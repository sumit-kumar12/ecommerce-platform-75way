// ─── Log Collection Controller ────────────────────────────────────────────────
// Handles the SOC Log Management page and external log ingest webhook.

import { prisma } from "../config/prisma.js";

// ─── Log List / Search ────────────────────────────────────────────────────────

export const getSocLogsController = async (req, res) => {
  try {
    const { source, level, search, from, to, eventType, ip, page = "1", limit = "100" } = req.query;
    const take = Math.min(Number(limit), 500);
    const skip = (Math.max(Number(page), 1) - 1) * take;

    const where = {
      ...(source    && { source }),
      ...(level     && { level }),
      ...(eventType && { eventType }),
      ...(ip        && { ip: { contains: ip } }),
      ...((from || to) && {
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to   && { lte: new Date(to) }),
        },
      }),
      ...(search && {
        OR: [
          { message:   { contains: search, mode: "insensitive" } },
          { service:   { contains: search, mode: "insensitive" } },
          { eventType: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [logs, total] = await Promise.all([
      prisma.socLog.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
      prisma.socLog.count({ where }),
    ]);

    return res.json({ logs, total, page: Number(page), totalPages: Math.ceil(total / take) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// ─── External Log Ingest (webhook endpoint) ───────────────────────────────────

export const ingestExternalLogController = async (req, res) => {
  try {
    // Verify ingest key if configured
    const ingestKey = process.env.LOG_INGEST_API_KEY;
    if (ingestKey) {
      const provided = req.headers["x-ingest-key"] ?? req.query.key;
      if (provided !== ingestKey) return res.status(401).json({ error: "Invalid ingest key" });
    }

    const { source, level, message, hostname, service, ip, userId, sessionId, requestId, eventType, rawData, tags } = req.body;

    if (!message) return res.status(400).json({ error: "message is required" });

    const VALID_SOURCES = ["SIEM","FIREWALL","WAF","API_GATEWAY","APPLICATION","ENDPOINT","CLOUD","NETWORK"];
    const VALID_LEVELS  = ["DEBUG","INFO","WARN","ERROR","CRITICAL"];

    await prisma.socLog.create({
      data: {
        source:    VALID_SOURCES.includes(source) ? source : "APPLICATION",
        level:     VALID_LEVELS.includes(level)   ? level  : "INFO",
        message,
        hostname:  hostname  ?? null,
        service:   service   ?? null,
        ip:        ip        ?? null,
        userId:    userId    ?? null,
        sessionId: sessionId ?? null,
        requestId: requestId ?? null,
        eventType: eventType ?? null,
        rawData:   rawData   ?? null,
        tags:      tags ? JSON.stringify(tags) : null,
      },
    });

    // Update source last-seen counter
    if (source) {
      await prisma.logCollectionSource.updateMany({
        where: { name: source, enabled: true },
        data: { lastSeenAt: new Date(), eventCount: { increment: 1 } },
      }).catch(() => {});
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to ingest log" });
  }
};

// ─── Log Analytics ─────────────────────────────────────────────────────────────

export const getLogAnalyticsController = async (req, res) => {
  try {
    const hours = Math.min(Number(req.query.hours) || 24, 168);
    const since = new Date(Date.now() - hours * 3_600_000);

    const [bySource, byLevel, volumeOverTime, topEventTypes] = await Promise.all([
      prisma.socLog.groupBy({ by: ["source"], where: { createdAt: { gte: since } }, _count: { id: true } }),
      prisma.socLog.groupBy({ by: ["level"],  where: { createdAt: { gte: since } }, _count: { id: true } }),
      prisma.$queryRaw`
        SELECT DATE_TRUNC('hour', "createdAt") as hour, COUNT(id)::int as count
        FROM "SocLog" WHERE "createdAt" >= ${since}
        GROUP BY DATE_TRUNC('hour', "createdAt") ORDER BY hour ASC
      `,
      prisma.$queryRaw`
        SELECT "eventType", COUNT(id)::int as count
        FROM "SocLog" WHERE "createdAt" >= ${since} AND "eventType" IS NOT NULL
        GROUP BY "eventType" ORDER BY count DESC LIMIT 10
      `,
    ]);

    return res.json({
      bySource:  bySource.map(r => ({ source: r.source, count: r._count.id })),
      byLevel:   byLevel.map(r  => ({ level:  r.level,  count: r._count.id })),
      volumeOverTime: volumeOverTime.map(r => ({ hour: r.hour, count: Number(r.count) })),
      topEventTypes:  topEventTypes.map(r => ({ eventType: r.eventType, count: Number(r.count) })),
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch log analytics" });
  }
};

// ─── Log Collection Sources CRUD ───────────────────────────────────────────────

export const getLogSourcesController = async (req, res) => {
  try {
    const sources = await prisma.logCollectionSource.findMany({ orderBy: { name: "asc" } });
    return res.json({ sources });
  } catch {
    return res.status(500).json({ error: "Failed to fetch log sources" });
  }
};

export const createLogSourceController = async (req, res) => {
  try {
    const { name, type, endpoint, apiKey, format, filters } = req.body;
    if (!name || !type) return res.status(400).json({ error: "name and type are required" });
    const source = await prisma.logCollectionSource.create({
      data: { name, type, endpoint, apiKey, format: format ?? "json", filters: filters ?? null },
    });
    return res.status(201).json({ source });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "Source name already exists" });
    return res.status(500).json({ error: "Failed to create log source" });
  }
};

export const updateLogSourceController = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, endpoint, apiKey, format, filters } = req.body;
    const updated = await prisma.logCollectionSource.update({
      where: { id },
      data: {
        ...(enabled   !== undefined && { enabled }),
        ...(endpoint  && { endpoint }),
        ...(apiKey    && { apiKey }),
        ...(format    && { format }),
        ...(filters   && { filters }),
      },
    });
    return res.json({ source: updated });
  } catch {
    return res.status(500).json({ error: "Failed to update log source" });
  }
};

export const deleteLogSourceController = async (req, res) => {
  try {
    await prisma.logCollectionSource.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete log source" });
  }
};
