import { PrismaClient } from "@prisma/client";
import geoip from "geoip-lite";

const prisma = new PrismaClient();

// Helper: compute relative time
const ago = (date) => {
  if (!date) return "—";
  const d = Date.now() - new Date(date).getTime();
  const s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const getThreatGeolocationController = async (req, res) => {
  try {
    const events = await prisma.threatEvent.findMany({
      take: 200,
      orderBy: { createdAt: "desc" },
      where: {
        severity: { in: ["CRITICAL", "WARN", "INFO"] }
      }
    });

    const markers = [];
    for (const event of events) {
      // FIX: use event.ip directly (ThreatEvent has ip as a direct field — no metadata field)
      const ip = event.ip || null;
      if (!ip) continue;

      const geo = geoip.lookup(ip);
      if (geo && geo.ll) {
        let mappedType = "medium";
        if (event.severity === "CRITICAL") mappedType = "critical";
        else if (event.severity === "WARN") mappedType = "high";

        // Check if marker with this ip already exists to avoid duplicates
        const exists = markers.find(m => m.ip === ip);
        if (!exists) {
          markers.push({
            id: event.id,
            name: event.eventType,
            ip,
            coordinates: [geo.ll[1], geo.ll[0]], // [lng, lat]
            type: mappedType,
            country: geo.country,
            city: geo.city || "Unknown"
          });
        }
      }
    }

    return res.json({ markers });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "Failed to get threat geolocation");
    return res.status(500).json({ error: "Failed to get threat geolocation" });
  }
};

export const getSocCasesController = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const threats = await prisma.threatEvent.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      where: {
        severity: { in: ["CRITICAL", "WARN"] }
      }
    });

    const cases = threats.map(t => {
      // FIX: use t.ip directly (field exists on ThreatEvent model)
      const ip = t.ip || "Unknown";
      let geo = (ip && ip !== "Unknown") ? geoip.lookup(ip) : null;
      let location = geo ? `${geo.city || ""}, ${geo.country}`.replace(/^, /, "") : "Unknown Location";

      // FIX: map real severity to meaningful case status instead of hardcoded "Open"
      const statusMap = { "CRITICAL": "Critical", "WARN": "High", "INFO": "Medium" };
      const priorityMap = { "CRITICAL": "Critical", "WARN": "High", "INFO": "Medium" };

      return {
        id: `CAS-${t.id.slice(0, 6).toUpperCase()}`,
        title: `${t.eventType.replace(/_/g, " ")} detected`,
        severity: t.severity,
        priority: priorityMap[t.severity] || "Medium",
        status: statusMap[t.severity] || "Open",
        assignee: "Unassigned",
        time: t.createdAt,
        timeAgo: ago(t.createdAt),
        actor: ip,
        location,
        source: t.details?.source || "System"
      };
    });

    // Compute KPI counts
    const open = cases.filter(c => c.status === "Critical" || c.status === "High").length;
    const medium = cases.filter(c => c.status === "Medium").length;

    return res.json({
      cases,
      summary: {
        total: cases.length,
        critical: cases.filter(c => c.priority === "Critical").length,
        high: cases.filter(c => c.priority === "High").length,
        medium: cases.filter(c => c.priority === "Medium").length,
      }
    });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "Failed to fetch SOC cases");
    return res.status(500).json({ error: "Failed to fetch SOC cases" });
  }
};

export const getSocUserRiskController = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    // Get users with highest threat scores
    const scores = await prisma.threatScore.findMany({
      where: { userId: { not: null }, score: { gt: 0 } },
      orderBy: { score: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            failedLoginAttempts: true,
            lockedUntil: true,
            createdAt: true,
            role: true,
          }
        }
      }
    });

    // Also include users with failed login attempts but no threat score
    const failedUsers = await prisma.authAttemptCounter.findMany({
      where: { failedCount: { gt: 2 }, userId: { not: null } },
      orderBy: { failedCount: "desc" },
      take: 20,
    });

    const scoredUserIds = new Set(scores.map(s => s.userId));
    const extraUserIds = failedUsers
      .filter(f => f.userId && !scoredUserIds.has(f.userId))
      .map(f => f.userId);

    const extraUsers = extraUserIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: extraUserIds } },
          select: { id: true, email: true, name: true, failedLoginAttempts: true, lockedUntil: true, createdAt: true, role: true }
        })
      : [];

    const mapUser = (u, score, source = "ThreatScore") => {
      const riskLevel = score >= 80 ? "High" : score >= 40 ? "Medium" : "Low";
      const isLocked = u?.lockedUntil ? new Date(u.lockedUntil) > new Date() : false;

      // Build risk factors
      const factors = [];
      if (u?.failedLoginAttempts > 3) factors.push("Multiple Failed Logins");
      if (isLocked) factors.push("Account Locked");
      if (score > 80) factors.push("High Threat Score");
      if (u?.role === "ADMIN" || u?.role === "SUPER_ADMIN") factors.push("Privileged Account");
      if (factors.length === 0) factors.push("Elevated Activity");

      return {
        userId: u?.id,
        email: u?.email || "unknown",
        name: u?.name || "Unknown User",
        role: u?.role,
        score,
        level: riskLevel,
        factors: factors.join(", "),
        isLocked,
        failedLoginAttempts: u?.failedLoginAttempts || 0,
        source,
      };
    };

    const users = [
      ...scores.map(s => mapUser(s.user, s.score, "ThreatScore")),
      ...extraUsers.map(u => {
        const fl = failedUsers.find(f => f.userId === u.id);
        const score = Math.min(100, (fl?.failedCount || 0) * 10);
        return mapUser(u, score, "FailedLogins");
      })
    ].sort((a, b) => b.score - a.score);

    const high = users.filter(u => u.level === "High").length;
    const medium = users.filter(u => u.level === "Medium").length;
    const low = users.filter(u => u.level === "Low").length;

    return res.json({
      users,
      summary: { high, medium, low, total: users.length }
    });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "Failed to fetch user risk scores");
    return res.status(500).json({ error: "Failed to fetch user risk scores" });
  }
};

export const getSocDashboardKpisController = async (req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      criticalToday,
      criticalYesterday,
      highToday,
      highYesterday,
      openIncidents,
      slaBreached,
      highRiskUsers,
      blockedIps,
      recentThreatEvents
    ] = await Promise.all([
      prisma.threatEvent.count({ where: { severity: "CRITICAL", createdAt: { gte: since24h } } }),
      prisma.threatEvent.count({ where: { severity: "CRITICAL", createdAt: { gte: since48h, lt: since24h } } }),
      prisma.threatEvent.count({ where: { severity: "WARN", createdAt: { gte: since24h } } }),
      prisma.threatEvent.count({ where: { severity: "WARN", createdAt: { gte: since48h, lt: since24h } } }),
      prisma.incident.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.incident.count({ where: { status: "OPEN", createdAt: { lt: new Date(Date.now() - 4 * 60 * 60 * 1000) } } }),
      prisma.threatScore.count({ where: { score: { gte: 70 }, userId: { not: null } } }),
      prisma.iPBlock.count({ where: { blockedUntil: { gt: new Date() } } }),
      prisma.threatEvent.count({ where: { createdAt: { gte: since24h } } }),
    ]);

    // Compute security health score
    const baseScore = 100;
    const threatPenalty = Math.min(50, recentThreatEvents * 2);
    const incidentPenalty = Math.min(30, openIncidents * 5);
    const mitigationBonus = Math.min(10, blockedIps);
    const healthScore = Math.max(0, Math.min(100, baseScore - threatPenalty - incidentPenalty + mitigationBonus));

    // Sparklines: last 7 days critical events per day
    const criticalSparkQuery = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(id)::int as count
      FROM "ThreatEvent"
      WHERE severity = 'CRITICAL' AND "createdAt" >= ${since7d}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY day ASC
    `;

    const highSparkQuery = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(id)::int as count
      FROM "ThreatEvent"
      WHERE severity = 'WARN' AND "createdAt" >= ${since7d}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY day ASC
    `;

    return res.json({
      kpis: {
        criticalAlerts: {
          value: criticalToday,
          delta: criticalToday - criticalYesterday,
          sub: `${criticalToday > criticalYesterday ? '+' : ''}${criticalToday - criticalYesterday} today`
        },
        highAlerts: {
          value: highToday,
          delta: highToday - highYesterday,
          sub: `${highToday > highYesterday ? '+' : ''}${highToday - highYesterday} today`
        },
        openIncidents: {
          value: openIncidents,
          slaBreached,
          sub: `${slaBreached} SLA Breached`
        },
        highRiskUsers: {
          value: highRiskUsers,
          sub: `${highRiskUsers} flagged`
        },
        securityScore: {
          value: parseFloat(healthScore.toFixed(1)),
          sub: healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Fair' : 'At Risk'
        },
        blockedIps: {
          value: blockedIps,
          sub: 'Active blocks'
        },
        recentEvents: {
          value: recentThreatEvents,
          sub: 'Last 24h'
        }
      },
      sparklines: {
        criticalAlerts: criticalSparkQuery.map(r => Number(r.count)),
        highAlerts: highSparkQuery.map(r => Number(r.count)),
      }
    });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "Failed to fetch SOC dashboard KPIs");
    return res.status(500).json({ error: "Failed to fetch SOC dashboard KPIs" });
  }
};
