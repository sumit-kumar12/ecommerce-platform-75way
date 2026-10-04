import { observeHttpRequest } from "../config/metrics.js";

export const httpMetricsMiddleware = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const route = req.route?.path ?? req.path ?? req.originalUrl;
    observeHttpRequest({
      method: req.method,
      route,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};
