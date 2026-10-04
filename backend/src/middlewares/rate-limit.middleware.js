import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { addThreatEvent } from "../services/threat.service.js";
import { redis } from "../config/redis.js";

const adminPrefix = `/${String(env.ADMIN_ROUTE_PREFIX || "").replace(/^\/+/, "").replace(/\/+$/, "")}`;
const isAdminRequestPath = (originalUrl) => {
  const pathname = String(originalUrl || "")
    .split("?")[0]
    .replace(/\/{2,}/g, "/")
    .toLowerCase();
  const normalizedPrefix = adminPrefix.toLowerCase();
  return pathname === normalizedPrefix || pathname.startsWith(`${normalizedPrefix}/`);
};

const onRateLimitTriggered = (req, res) => {
  addThreatEvent({
    req,
    userId: req.user?.id ?? null,
    eventType: "rate_limit_triggered",
    details: { path: req.originalUrl, method: req.method },
  }).catch((error) => {
    loggers.error.error({
      eventType: "rate_limit_threat_log_failed",
      details: { message: error.message },
    });
  });

  loggers.security.warn({
    eventType: "rate_limit_triggered",
    userId: req.user?.id ?? null,
    details: { ip: req.ip, path: req.originalUrl },
  });

  res.status(429).json({
    error: "Too many requests.",
  });
};

export const globalRateLimiterMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  skip: (req) => isAdminRequestPath(req.originalUrl),
  ...(!env.RATE_LIMIT_USE_REDIS
    ? {}
    : {
        store: new RedisStore({
          sendCommand: (...args) => redis.call(...args),
          prefix: `${env.REDIS_KEY_PREFIX}:rl:global:`,
        }),
      }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: onRateLimitTriggered,
});

export const adminRateLimiterMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.ADMIN_RATE_LIMIT_MAX,
  skip: (req) =>
    ["GET", "HEAD", "OPTIONS"].includes(req.method) ||
    !isAdminRequestPath(req.originalUrl),
  ...(!env.RATE_LIMIT_USE_REDIS
    ? {}
    : {
        store: new RedisStore({
          sendCommand: (...args) => redis.call(...args),
          prefix: `${env.REDIS_KEY_PREFIX}:rl:admin:`,
        }),
      }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: onRateLimitTriggered,
});

// Dedicated limiter for POST /forgot-password — prevents email-enumeration
// and brute-force reset loops. 10 requests per 15 minutes per IP.
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onRateLimitTriggered,
  ...(!env.RATE_LIMIT_USE_REDIS
    ? {}
    : {
        store: new RedisStore({
          sendCommand: (...args) => redis.call(...args),
          prefix: `${env.REDIS_KEY_PREFIX}:rl:forgot-pw:`,
        }),
      }),
});
