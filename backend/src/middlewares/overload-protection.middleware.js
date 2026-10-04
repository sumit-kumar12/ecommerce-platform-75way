import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { setInflightRequestCount } from "../config/metrics.js";

let inflightRequests = 0;

export const overloadProtectionMiddleware = (req, res, next) => {
  setInflightRequestCount(inflightRequests);
  if (inflightRequests >= env.OVERLOAD_MAX_INFLIGHT_REQUESTS) {
    loggers.security.warn({
      eventType: "overload_rejected",
      userId: req.user?.id ?? null,
      details: {
        path: req.originalUrl,
        method: req.method,
        inflightRequests,
        limit: env.OVERLOAD_MAX_INFLIGHT_REQUESTS,
      },
    });
    return res.status(env.OVERLOAD_REJECT_STATUS).json({
      error: "Service temporarily overloaded.",
      code: "SERVICE_OVERLOADED",
      requestId: req.id,
    });
  }

  inflightRequests += 1;
  setInflightRequestCount(inflightRequests);
  let closed = false;
  const finalize = () => {
    if (closed) return;
    closed = true;
    inflightRequests = Math.max(0, inflightRequests - 1);
    setInflightRequestCount(inflightRequests);
  };

  res.on("finish", finalize);
  res.on("close", finalize);

  return next();
};

export const getInflightRequests = () => inflightRequests;
