import { loggers } from "../config/logger.js";

export const structuredRequestLoggerMiddleware = (req, res, next) => {
  const startedAt = Date.now();

  loggers.app.info({
    eventType: "request_started",
    requestId: req.id,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? "unknown",
    details: {
      method: req.method,
      path: req.originalUrl,
    },
  });

  res.on("finish", () => {
    loggers.app.info({
      eventType: "request_finished",
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? "unknown",
      details: {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      },
    });
  });

  next();
};
