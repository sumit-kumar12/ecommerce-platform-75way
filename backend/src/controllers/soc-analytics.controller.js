import { prisma } from "../config/prisma.js";

// Helper: format minutes into human-readable time string
const formatTime = (mins) => {
  if (!mins || isNaN(mins) || mins <= 0) return "N/A";
  if (mins < 60) return `${Math.round(mins)}m`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const getSocAnalyticsOverview = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // 1. Top KPIs
    const totalEvents = await prisma.threatEvent.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    const uniqueThreats = await prisma.threatEvent.groupBy({
      by: ['ip'],
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    // 2. Compute real MTTD (Mean Time to Detect)
    // We approximate MTTD as the average lag between a threat event and the
    // creation of an incident within the same 24-hour window
    let mttdMinutes = 0;
    let mttrMinutes = 0;
    try {
      const mttdQuery = await prisma.$queryRaw`
        SELECT AVG(
          EXTRACT(EPOCH FROM (i."createdAt" - te."createdAt")) / 60.0
        )::float AS mttd_minutes
        FROM "Incident" i
        INNER JOIN "ThreatEvent" te
          ON te."createdAt" <= i."createdAt"
          AND te."createdAt" >= i."createdAt" - INTERVAL '24 hours'
        WHERE i."createdAt" >= ${thirtyDaysAgo}
      `;
      mttdMinutes = Number(mttdQuery[0]?.mttd_minutes) || 0;

      // 3. Compute real MTTR (Mean Time to Respond / Resolve)
      const mttrQuery = await prisma.$queryRaw`
        SELECT AVG(
          EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 60.0
        )::float AS mttr_minutes
        FROM "Incident"
        WHERE "status" = 'RESOLVED'
          AND "updatedAt" >= ${thirtyDaysAgo}
      `;
      mttrMinutes = Number(mttrQuery[0]?.mttr_minutes) || 0;
    } catch (_) {
      // Incident table might be empty — gracefully fall back to 0
    }

    // 4. Events Over Time (Daily Aggregation)
    const eventsQuery = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(id) as value
      FROM "ThreatEvent"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY DATE_TRUNC('day', "createdAt") ASC
    `;

    const eventsData = eventsQuery.map(row => ({
      day: row.day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Number(row.value)
    }));

    // 5. Events by Source
    const sourceQuery = await prisma.$queryRaw`
      SELECT details->>'source' as name, COUNT(id) as value
      FROM "ThreatEvent"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY details->>'source'
    `;

    const sourceColors = {
      "Firewall": "#EF4444",
      "Endpoint": "#F97316",
      "IDS/IPS": "#3B82F6",
      "Cloud": "#8C63F5",
      "Application": "#10B981"
    };

    const sourceData = sourceQuery.map(row => ({
      name: row.name || 'System',
      value: Number(row.value),
      color: sourceColors[row.name] || "#EAB308"
    }));

    const totalSourceCount = sourceData.reduce((acc, curr) => acc + curr.value, 0);
    sourceData.forEach(src => {
      src.value = totalSourceCount > 0 ? Math.round((src.value / totalSourceCount) * 100) : 0;
    });

    // 6. Top Attacked Assets (from ThreatEvent details->path)
    const assetsQuery = await prisma.$queryRaw`
      SELECT details->>'path' as name, COUNT(id) as val
      FROM "ThreatEvent"
      WHERE "createdAt" >= ${thirtyDaysAgo}
        AND details->>'path' IS NOT NULL
      GROUP BY details->>'path'
      ORDER BY COUNT(id) DESC
      LIMIT 5
    `;

    const maxAssetVal = assetsQuery.length > 0 ? Number(assetsQuery[0].val) : 1;
    const assetsData = assetsQuery.map(row => ({
      name: row.name,
      count: String(row.val),
      val: Math.round((Number(row.val) / maxAssetVal) * 100)
    }));

    // 7. Threat Trends — real event counts with computed change vs previous period
    const trendsQuery = await prisma.$queryRaw`
      SELECT "eventType" as name, COUNT(id) as value
      FROM "ThreatEvent"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY "eventType"
      ORDER BY COUNT(id) DESC
      LIMIT 5
    `;

    const prevTrendsQuery = await prisma.$queryRaw`
      SELECT "eventType" as name, COUNT(id) as value
      FROM "ThreatEvent"
      WHERE "createdAt" >= ${fifteenDaysAgo} AND "createdAt" < ${thirtyDaysAgo}
      GROUP BY "eventType"
    `;

    const prevMap = new Map(prevTrendsQuery.map(r => [r.name, Number(r.value)]));

    // For each trending event type, get a real daily spark for the last 7 days
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sparkQuery = await prisma.$queryRaw`
      SELECT
        "eventType",
        DATE_TRUNC('day', "createdAt") as day,
        COUNT(id)::int as count
      FROM "ThreatEvent"
      WHERE "createdAt" >= ${since7d}
      GROUP BY "eventType", DATE_TRUNC('day', "createdAt")
      ORDER BY "eventType", day ASC
    `;

    const sparkByType = {};
    sparkQuery.forEach(r => {
      if (!sparkByType[r.eventType]) sparkByType[r.eventType] = [];
      sparkByType[r.eventType].push({ v: Number(r.count) });
    });

    const trendsData = trendsQuery.map(row => {
      const prev = prevMap.get(row.name) || 0;
      const curr = Number(row.value);
      const changePct = prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0;
      const trending = changePct >= 0 ? `+${changePct}%` : `${changePct}%`;

      return {
        name: row.name,
        value: curr,
        change: trending,
        color: changePct > 0 ? "text-red-400" : "text-emerald-400",
        spark: sparkByType[row.name] || [{ v: curr }]
      };
    });

    res.json({
      success: true,
      data: {
        kpis: {
          totalEvents,
          uniqueThreats: uniqueThreats.length,
          // FIXED: real computed values instead of hardcoded strings
          meanTimeToDetect: formatTime(mttdMinutes),
          meanTimeToRespond: formatTime(mttrMinutes),
        },
        eventsOverTime: eventsData,
        eventsBySource: sourceData,
        topAttackedAssets: assetsData,
        attackTrends: trendsData
      }
    });

  } catch (error) {
    console.error("Error in getSocAnalyticsOverview:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
