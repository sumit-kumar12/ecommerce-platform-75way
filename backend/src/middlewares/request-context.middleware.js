import { runWithRequestContext } from "../config/request-context.js";

export const requestContextMiddleware = (req, res, next) => {
  runWithRequestContext(
    {
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? "unknown",
      userId: null,
    },
    () => next(),
  );
};
