import { prisma } from "../config/prisma.js";
import { pingRedis } from "../config/redis.js";
import { env } from "../config/env.js";

export const healthLiveController = (_req, res) => {
  res.status(200).json({ status: "live", timestamp: new Date().toISOString() });
};

export const healthReadyController = async (_req, res) => {
  const checks = {
    database: false,
    redis: false,
    queue: false,
  };

  if (env.NODE_ENV !== "test") {
    try {
      await prisma.user.findFirst({ select: { id: true } });
      checks.database = true;
    } catch {
      checks.database = false;
    }
  }

  try {
    checks.redis = await pingRedis();
    checks.queue = checks.redis;
  } catch {
    checks.redis = false;
    checks.queue = false;
  }

  const ready = checks.database && checks.redis && checks.queue;
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    checks,
    timestamp: new Date().toISOString(),
  });
};
