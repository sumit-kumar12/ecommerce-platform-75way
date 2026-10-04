// ─── SOC Case CRUD Controller ─────────────────────────────────────────────────
// Handles the primary SOC Cases list page, case creation, update, and close.
// Implements a smart hybrid: uses SocCase table when data exists, falls back
// to ThreatEvent-derived view if SocCase is empty (zero-downtime migration).

import { prisma } from "../config/prisma.js";
import { getSlaStatus, computeSlaDeadline } from "../services/sla.service.js";
import { writeAuditLog } from "../services/audit.service.js";
import geoip from "geoip-lite";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ago = (date) => {
  if (!date) return "—";
  const d = Date.now() - new Date(date).getTime();
  const s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFORMATIONAL: 4 };

function enrichCase(c) {
  const sla = getSlaStatus(c.slaDeadline, c.status);
  return {
    ...c,
    sla,
    timeAgo: ago(c.createdAt),
    mitreaTactics: c.mitreaTactics ?? [],
    tags: c.tags ?? [],
  };
}

// Fallback: derive "cases" from ThreatEvents when SocCase table is empty
async function buildFallbackCases(limit) {
  const threats = await prisma.threatEvent.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    where: { severity: { in: ["CRITICAL", "WARN"] } },
  });
  return threats.map((t, i) => {
    const ip = t.ip || "Unknown";
    const geo = ip !== "Unknown" ? geoip.lookup(ip) : null;
    const location = geo ? `${geo.city || ""}, ${geo.country}`.replace(/^, /, "") : "Unknown";
    const year = new Date(t.createdAt).getFullYear();
    const sev = t.severity === "CRITICAL" ? "CRITICAL" : "HIGH";
    const slaDeadline = computeSlaDeadline(sev, t.createdAt);
    return {
      id: `fallback-${t.id}`,
      caseNumber: `CASE-${year}-${String(i + 1).padStart(6, "0")}`,
      title: `${t.eventType.replace(/_/g, " ")} detected`,
      severity: sev,
      priority: sev,
      status: "OPEN",
      source: t.details?.source || "SIEM Alert",
      detectionRule: t.eventType,
      threatScore: t.points * 5,
      assignee: null,
      createdAt: t.createdAt,
      updatedAt: t.createdAt,
      slaDeadline,
      tags: [],
      mitreaTactics: [],
      timeAgo: ago(t.createdAt),
      sla: getSlaStatus(slaDeadline, "OPEN"),
      location,
      actor: ip,
      _isFallback: true,
    };
  });
}

// ─── Controllers ──────────────────────────────────────────────────────────────

export const getSocCasesListController = async (req, res) => {
  try {
    const {
      status, severity, priority, assigneeId, search,
      page = "1", limit = "50", sortBy = "createdAt", sortDir = "desc",
    } = req.query;

    const take = Math.min(Number(limit), 200);
    const skip = (Math.max(Number(page), 1) - 1) * take;

    const where = {
      ...(status    && { status }   ),
      ...(severity  && { severity } ),
      ...(priority  && { priority } ),
      ...(assigneeId && { assigneeId }),
      ...(search && {
        OR: [
          { title:      { contains: search, mode: "insensitive" } },
          { caseNumber: { contains: search, mode: "insensitive" } },
          { detectionRule: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Check whether real cases exist
    const realCount = await prisma.socCase.count();

    if (realCount === 0) {
      // Fallback mode
      const fallback = await buildFallbackCases(take);
      return res.json({
        cases: fallback,
        total: fallback.length,
        page: 1,
        totalPages: 1,
        isFallback: true,
      });
    }

    const [cases, total] = await Promise.all([
      prisma.socCase.findMany({
        where,
        take,
        skip,
        orderBy: { [sortBy]: sortDir },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          _count: { select: { iocs: true, evidence: true, affectedAssets: true, affectedUsers: true, notes: true } },
        },
      }),
      prisma.socCase.count({ where }),
    ]);

    return res.json({
      cases: cases.map(enrichCase),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / take),
      isFallback: false,
    });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "getSocCasesListController failed");
    return res.status(500).json({ error: "Failed to fetch SOC cases" });
  }
};

export const getSocCaseAnalyticsSummary = async (req, res) => {
  try {
    const realCount = await prisma.socCase.count();
    if (realCount === 0) {
      // Minimal stats from ThreatEvents
      const since24h = new Date(Date.now() - 86_400_000);
      const [total, critical, high] = await Promise.all([
        prisma.threatEvent.count({ where: { severity: { in: ["CRITICAL", "WARN"] } } }),
        prisma.threatEvent.count({ where: { severity: "CRITICAL" } }),
        prisma.threatEvent.count({ where: { severity: "WARN" } }),
      ]);
      return res.json({
        total, open: total, inProgress: 0, resolved: 0, closed: 0, onHold: 0,
        critical, high, medium: 0, low: 0,
        slaBreached: 0, avgResolutionHours: null, mttr: null,
        isFallback: true,
      });
    }

    const [statusCounts, severityCounts, slaBreached] = await Promise.all([
      prisma.socCase.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.socCase.groupBy({ by: ["severity"], _count: { id: true } }),
      prisma.socCase.count({
        where: { slaDeadline: { lt: new Date() }, status: { notIn: ["RESOLVED", "CLOSED"] } },
      }),
    ]);

    const byStatus  = Object.fromEntries(statusCounts.map(r => [r.status, r._count.id]));
    const bySeverity = Object.fromEntries(severityCounts.map(r => [r.severity, r._count.id]));

    // MTTR in hours
    const mttrQuery = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM ("closedAt" - "createdAt")) / 3600.0)::float AS avg_hours
      FROM "SocCase"
      WHERE "status" = 'CLOSED' AND "closedAt" IS NOT NULL
    `;
    const mttr = Number(mttrQuery[0]?.avg_hours) || null;

    return res.json({
      total: realCount,
      open:        byStatus.OPEN        ?? 0,
      inProgress:  byStatus.IN_PROGRESS ?? 0,
      onHold:      byStatus.ON_HOLD     ?? 0,
      resolved:    byStatus.RESOLVED    ?? 0,
      closed:      byStatus.CLOSED      ?? 0,
      critical:    bySeverity.CRITICAL  ?? 0,
      high:        bySeverity.HIGH      ?? 0,
      medium:      bySeverity.MEDIUM    ?? 0,
      low:         bySeverity.LOW       ?? 0,
      slaBreached,
      mttr: mttr ? `${Math.round(mttr)}h` : null,
      isFallback: false,
    });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "getSocCaseAnalyticsSummary failed");
    return res.status(500).json({ error: "Failed to fetch SOC case analytics" });
  }
};

export const getSocCaseAnalyticsTrend = async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 7, 30);
    const since = new Date(Date.now() - days * 86_400_000);

    const realCount = await prisma.socCase.count();
    if (realCount === 0) {
      // Trend from ThreatEvents
      const rows = await prisma.$queryRaw`
        SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(id)::int as value
        FROM "ThreatEvent"
        WHERE "createdAt" >= ${since}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY day ASC
      `;
      return res.json({ trend: rows.map(r => ({ day: r.day, created: Number(r.value), resolved: 0 })), isFallback: true });
    }

    const [created, resolved] = await Promise.all([
      prisma.$queryRaw`
        SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(id)::int as value
        FROM "SocCase" WHERE "createdAt" >= ${since}
        GROUP BY DATE_TRUNC('day', "createdAt") ORDER BY day ASC
      `,
      prisma.$queryRaw`
        SELECT DATE_TRUNC('day', "closedAt") as day, COUNT(id)::int as value
        FROM "SocCase" WHERE "closedAt" >= ${since} AND "status" IN ('RESOLVED','CLOSED')
        GROUP BY DATE_TRUNC('day', "closedAt") ORDER BY day ASC
      `,
    ]);

    const resolvedMap = new Map(resolved.map(r => [r.day.toISOString().slice(0,10), Number(r.value)]));

    return res.json({
      trend: created.map(r => ({
        day: r.day,
        created: Number(r.value),
        resolved: resolvedMap.get(r.day.toISOString().slice(0,10)) ?? 0,
      })),
      isFallback: false,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch case trend" });
  }
};

export const createSocCaseController = async (req, res) => {
  try {
    const { title, description, severity = "MEDIUM", priority = "MEDIUM", source, tags, mitreaTactics, assigneeId } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const year = new Date().getFullYear();
    const count = await prisma.socCase.count();
    const caseNumber = `CASE-${year}-${String(count + 1).padStart(6, "0")}`;

    const newCase = await prisma.socCase.create({
      data: {
        caseNumber,
        title,
        description,
        severity,
        priority,
        status: "OPEN",
        source: source ?? "Manual",
        slaDeadline: computeSlaDeadline(severity),
        createdById: req.user.id,
        assigneeId: assigneeId ?? null,
        tags: tags ? JSON.stringify(tags) : JSON.stringify([]),
        mitreaTactics: mitreaTactics ? JSON.stringify(mitreaTactics) : JSON.stringify([]),
      },
    });

    // Seed initial timeline and audit
    await Promise.all([
      prisma.socCaseTimeline.create({
        data: { caseId: newCase.id, eventType: "Case Created", description: `Manually created by ${req.user.email}`, actorId: req.user.id, actorName: req.user.name, source: "Manual" },
      }),
      prisma.socCaseAudit.create({
        data: { caseId: newCase.id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: "Case Created", details: { caseNumber, title } },
      }),
    ]);

    await writeAuditLog({ req, actorId: req.user.id, action: "SOC_CASE_CREATED", targetType: "SOC_CASE", targetId: newCase.id, details: { caseNumber } });

    return res.status(201).json({ case: newCase });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "createSocCaseController failed");
    return res.status(500).json({ error: "Failed to create SOC case" });
  }
};

export const getSocCaseDetailController = async (req, res) => {
  try {
    const { id } = req.params;
    let c;

    // Support both real SocCase ID and fallback "fallback-{threatEventId}" IDs
    if (id.startsWith("fallback-")) {
      const eventId = id.replace("fallback-", "");
      const event = await prisma.threatEvent.findUnique({ where: { id: eventId } });
      if (!event) return res.status(404).json({ error: "Case not found" });
      const sev = event.severity === "CRITICAL" ? "CRITICAL" : "HIGH";
      const slaDeadline = computeSlaDeadline(sev, event.createdAt);
      return res.json({
        case: {
          id, caseNumber: `CASE-FALLBACK-${eventId.slice(0, 6).toUpperCase()}`,
          title: `${event.eventType.replace(/_/g, " ")} detected`,
          severity: sev, priority: sev, status: "OPEN",
          source: "SIEM Alert", detectionRule: event.eventType,
          threatScore: event.points * 5, confidence: 70,
          description: `Threat event: ${event.eventType} from IP ${event.ip}`,
          slaDeadline, sla: getSlaStatus(slaDeadline, "OPEN"),
          createdAt: event.createdAt, updatedAt: event.createdAt,
          tags: [], mitreaTactics: [], assignee: null,
          _counts: { iocs: 0, evidence: 0, assets: 0, users: 0, notes: 0 },
          _isFallback: true,
        },
      });
    }

    c = await prisma.socCase.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        _count: {
          select: { iocs: true, evidence: true, affectedAssets: true, affectedUsers: true, notes: true, timeline: true, responseActions: true },
        },
      },
    });

    if (!c) return res.status(404).json({ error: "Case not found" });
    return res.json({ case: enrichCase(c) });
  } catch (err) {
    const logger = req.log || console;
    logger.error({ err }, "getSocCaseDetailController failed");
    return res.status(500).json({ error: "Failed to fetch case detail" });
  }
};

export const updateSocCaseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, severity, priority, assigneeId, title, description, tags, mitreaTactics, impact, rootSuspicion, confidence } = req.body;

    const existing = await prisma.socCase.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!existing) return res.status(404).json({ error: "Case not found" });

    const updated = await prisma.socCase.update({
      where: { id },
      data: {
        ...(status        && { status }),
        ...(severity      && { severity, slaDeadline: computeSlaDeadline(severity) }),
        ...(priority      && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(title         && { title }),
        ...(description   && { description }),
        ...(tags          && { tags: JSON.stringify(tags) }),
        ...(mitreaTactics && { mitreaTactics: JSON.stringify(mitreaTactics) }),
        ...(impact        && { impact }),
        ...(rootSuspicion && { rootSuspicion }),
        ...(confidence    !== undefined && { confidence: Number(confidence) }),
        updatedById: req.user.id,
      },
    });

    // Timeline entry for notable changes
    const changes = [];
    if (status)     changes.push(`Status → ${status}`);
    if (severity)   changes.push(`Severity → ${severity}`);
    if (assigneeId !== undefined) changes.push(`Assignee updated`);
    if (changes.length) {
      await prisma.socCaseTimeline.create({
        data: { caseId: id, eventType: "Case Updated", description: changes.join(", "), actorId: req.user.id, actorName: req.user.name, source: "Analyst" },
      });
    }

    await prisma.socCaseAudit.create({
      data: { caseId: id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: "Case Updated", details: req.body },
    });

    return res.json({ case: updated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update case" });
  }
};

export const closeSocCaseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, resolution = "RESOLVED" } = req.body;
    if (!["RESOLVED", "CLOSED"].includes(resolution)) return res.status(400).json({ error: "Invalid resolution status" });

    const updated = await prisma.socCase.update({
      where: { id },
      data: { status: resolution, closedAt: new Date(), updatedById: req.user.id },
    });

    await Promise.all([
      prisma.socCaseTimeline.create({
        data: { caseId: id, eventType: `Case ${resolution}`, description: `Case ${resolution.toLowerCase()} by ${req.user.email}. Reason: ${reason ?? "Not specified"}`, actorId: req.user.id, actorName: req.user.name, source: "Analyst" },
      }),
      prisma.socCaseAudit.create({
        data: { caseId: id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: `Case ${resolution}`, details: { reason } },
      }),
      writeAuditLog({ req, actorId: req.user.id, action: `SOC_CASE_${resolution}`, targetType: "SOC_CASE", targetId: id, details: { reason } }),
    ]);

    return res.json({ case: updated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to close case" });
  }
};
