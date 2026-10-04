import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { AppError } from "../errors/app-error.js";
import { notifySecurityEscalation } from "./notification.service.js";
import { incrementSecurityEventMetric } from "../config/metrics.js";
import { broadcastThreatEvent } from "../threat-ws.js";
import { resolveThreatRule } from "./threat-policy.service.js";
import { evaluateSiemRules } from "./siem-engine.service.js";

const now = () => new Date();

const subjectFrom = (ip, userId) => `${userId ?? "guest"}:${ip}`;

const localDevIps = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

export const isLocalDevIp = (ip) => env.NODE_ENV !== "production" && localDevIps.has(String(ip ?? "").trim());

const toSeverity = (points) => {
  if (points >= 10) return "CRITICAL";
  if (points >= 5) return "WARN";
  return "INFO";
};

export const addThreatEvent = async ({
  req,
  userId = null,
  ip = null,
  eventType,
  points = null,
  details = {},
}) => {
  const resolvedIp = ip ?? req?.ip ?? "0.0.0.0";
  const resolvedUserAgent = req?.get("user-agent") ?? "unknown";
  const subjectKey = subjectFrom(resolvedIp, userId);

  const policy = await resolveThreatRule(eventType);
  if (!policy?.enabled) {
    loggers.security.info({
      eventType: "threat_rule_disabled_drop",
      userId,
      ip: resolvedIp,
      userAgent: resolvedUserAgent,
      details: { eventType },
    });
    return;
  }

  const resolvedPoints = Number.isInteger(points) ? points : Number(policy?.points ?? 0);
  if (!Number.isFinite(resolvedPoints) || resolvedPoints <= 0) return;

  const severity = toSeverity(resolvedPoints);
  incrementSecurityEventMetric(eventType);

  if (env.NODE_ENV === "test") return;

  try {
    const existing = await prisma.threatScore.findUnique({ where: { subjectKey } });
    const updatedScore = existing ? existing.score + resolvedPoints : resolvedPoints;

    if (existing) {
      await prisma.threatScore.update({
        where: { subjectKey },
        data: {
          score: updatedScore,
          lastEventAt: now(),
        },
      });
    } else {
      await prisma.threatScore.create({
        data: {
          subjectKey,
          userId,
          ip: resolvedIp,
          score: updatedScore,
          lastEventAt: now(),
        },
      });
    }

    const eventRecord = await prisma.threatEvent.create({
      data: {
        userId,
        ip: resolvedIp,
        eventType,
        points: resolvedPoints,
        severity,
        details: {
          ...details,
          userAgent: resolvedUserAgent,
        },
      },
    });

    // Fire SIEM rule evaluation asynchronously — non-blocking
    setImmediate(() => evaluateSiemRules(eventRecord, updatedScore));

    // Update ThreatRule tracking — lastTriggeredAt and triggerCount
    try {
      await prisma.threatRule.update({
        where: { eventType },
        data: {
          lastTriggeredAt: now(),
          triggerCount: { increment: 1 },
        },
      });
    } catch {
      // Rule may not exist in DB yet (e.g., dynamically generated event types) — ignore
    }

    try {
      broadcastThreatEvent({
        eventType,
        score: updatedScore,
        ip: resolvedIp,
        userId: userId ?? null,
        timestamp: eventRecord.createdAt.toISOString(),
        points: resolvedPoints,
      });
    } catch {
      // ignore WS broadcast errors
    }

    loggers.security.warn({
      severity,
      eventType,
      userId,
      ip: resolvedIp,
        userAgent: resolvedUserAgent,
        details: {
          ...details,
          points: resolvedPoints,
          score: updatedScore,
        },
      });

    if (updatedScore >= env.THREAT_THRESHOLD) {
      const lockUntil = new Date(now().getTime() + env.ACCOUNT_LOCK_MINUTES * 60 * 1000);
      const ipBlockUntil = new Date(now().getTime() + env.IP_BLOCK_MINUTES * 60 * 1000);

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            lockedUntil: lockUntil,
            failedLoginAttempts: 5,
          },
        });
        await redis.del(`user-cache:${userId}`);
      }

      if (!isLocalDevIp(resolvedIp)) {
        await prisma.iPBlock.upsert({
          where: { ip: resolvedIp },
          create: {
            ip: resolvedIp,
            blockedUntil: ipBlockUntil,
            reason: `Threat threshold reached (${updatedScore})`,
          },
          update: {
            blockedUntil: ipBlockUntil,
            reason: `Threat threshold reached (${updatedScore})`,
          },
        });
      }

      loggers.security.error({
        severity: "CRITICAL",
        eventType: "threat_threshold_exceeded",
        userId,
        ip: resolvedIp,
        details: {
          score: updatedScore,
          lockUntil,
          ipBlockUntil,
        },
      });

      await notifySecurityEscalation({
        eventType: "THREAT_THRESHOLD_EXCEEDED",
        severity: "CRITICAL",
        message: `Threat threshold exceeded for ${resolvedIp}`,
        details: {
          userId,
          score: updatedScore,
          lockUntil,
          ipBlockUntil,
        },
      });
    }
  } catch (error) {
    loggers.error.error({
      severity: "ERROR",
      eventType: "threat_event_persistence_failed",
      userId,
      ip: resolvedIp,
      userAgent: resolvedUserAgent,
      details: {
        originalEventType: eventType,
        points: resolvedPoints,
        message: error.message,
      },
    });
  }
};

export const enforceIpNotBlocked = async (ip) => {
  if (isLocalDevIp(ip)) {
    await prisma.iPBlock.deleteMany({ where: { ip } });
    return;
  }
  const blocked = await prisma.iPBlock.findUnique({ where: { ip } });
  if (!blocked) return;
  if (blocked.blockedUntil <= now()) {
    await prisma.iPBlock.delete({ where: { ip } });
    return;
  }
  throw new AppError("Access denied.", 403, "IP_BLOCKED");
};
