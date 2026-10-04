import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { writeAuditLog } from "../services/audit.service.js";
import { isLocalDevIp } from "../services/threat.service.js";

const ipPattern = /^(([0-9]{1,3}\.){3}[0-9]{1,3}|[a-fA-F0-9:]+)$/;

const ipSchema = z.object({
  ip: z.string().regex(ipPattern),
  reason: z.string().min(3).max(200),
  minutes: z.number().int().min(1).max(10080).default(60),
});

const ipParamSchema = z.object({
  ip: z.string().regex(ipPattern),
});

export const securityOverviewController = async (req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [blockedIps, lockedUsers, recentThreatEvents, paymentMismatches] = await Promise.all([
    prisma.iPBlock.count({ where: { blockedUntil: { gt: new Date() } } }),
    prisma.user.count({ where: { lockedUntil: { gt: new Date() } } }),
    prisma.threatEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.threatEvent.count({
      where: {
        createdAt: { gte: since },
        eventType: "payment_amount_mismatch",
      },
    }),
  ]);

  // Proportional Health Score calculation
  // Base: 100
  // Penalty: -10 for each recent threat event
  // Penalty: -15 for each locked user (active security compromise)
  // Bonus: +2 for each confirmed IP block (mitigation action)
  const baseScore = 100;
  const threatPenalty = recentThreatEvents * 10;
  const lockPenalty = lockedUsers * 15;
  const mitigationBonus = Math.min(20, blockedIps * 2);
  
  const healthScore = Math.max(0, Math.min(100, baseScore - threatPenalty - lockPenalty + mitigationBonus));

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SECURITY_OVERVIEW_READ",
    targetType: "SECURITY_OVERVIEW",
    targetId: "GLOBAL",
    details: { healthScore },
  });

  res.status(200).json({
    summary: {
      blockedIps,
      lockedUsers,
      recentThreatEvents,
      paymentMismatches,
      healthScore,
    },
    generatedAt: new Date().toISOString(),
  });
};

export const suspiciousIpsController = async (req, res) => {
  const suspicious = await prisma.threatScore.findMany({
    where: {
      score: {
        gte: 1,
      },
    },
    orderBy: [{ score: "desc" }, { lastEventAt: "desc" }],
    take: 200,
  });

  const activeBlocks = await prisma.iPBlock.findMany({
    where: { blockedUntil: { gt: new Date() } },
  });
  const blockedMap = new Map(activeBlocks.map((item) => [item.ip, item]));

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SECURITY_SUSPICIOUS_IPS_READ",
    targetType: "SECURITY_IP",
    targetId: "*",
    details: { returnedCount: suspicious.length },
  });

  res.status(200).json({
    suspiciousIps: suspicious.map((entry) => ({
      ip: entry.ip,
      score: entry.score,
      userId: entry.userId,
      lastEventAt: entry.lastEventAt,
      blockedUntil: blockedMap.get(entry.ip)?.blockedUntil ?? null,
    })),
  });
};

export const createIpBlockController = async (req, res) => {
  const input = ipSchema.parse(req.body);
  if (isLocalDevIp(input.ip)) {
    return res.status(400).json({
      error: "Loopback addresses are exempt from IP blocking in local development.",
      code: "LOCAL_IP_BLOCK_FORBIDDEN",
    });
  }
  const blockedUntil = new Date(Date.now() + input.minutes * 60 * 1000);

  const block = await prisma.iPBlock.upsert({
    where: { ip: input.ip },
    create: {
      ip: input.ip,
      blockedUntil,
      reason: input.reason,
    },
    update: {
      blockedUntil,
      reason: input.reason,
    },
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SECURITY_IP_BLOCK_CREATE",
    targetType: "IP_BLOCK",
    targetId: input.ip,
    details: { reason: input.reason, minutes: input.minutes },
  });

  res.status(201).json({ block });
};

export const deleteIpBlockController = async (req, res) => {
  const params = ipParamSchema.parse(req.params);

  await prisma.iPBlock.deleteMany({
    where: { ip: params.ip },
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SECURITY_IP_BLOCK_DELETE",
    targetType: "IP_BLOCK",
    targetId: params.ip,
    details: {},
  });

  res.status(204).send();
};

export const threatStreamController = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SECURITY_THREAT_STREAM_OPEN",
    targetType: "THREAT_EVENT",
    targetId: "STREAM",
    details: {},
  });

  let cursor = new Date();

  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
  }, 15000);

  const poller = setInterval(async () => {
    try {
      const events = await prisma.threatEvent.findMany({
        where: {
          createdAt: {
            gt: cursor,
          },
        },
        orderBy: { createdAt: "asc" },
        take: 100,
      });

      for (const event of events) {
        cursor = event.createdAt > cursor ? event.createdAt : cursor;
        res.write(`event: threat\ndata: ${JSON.stringify(event)}\n\n`);
      }
    } catch (error) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: "Threat stream poll failed", detail: error.message })}\n\n`,
      );
    }
  }, 5000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clearInterval(poller);
  });
};
