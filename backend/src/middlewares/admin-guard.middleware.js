import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { isAdminSurfaceRole } from "../config/constants.js";

const normalizePath = (value) => `/${String(value || "").replace(/^\/+/, "").replace(/\/+$/, "")}`;
const adminBasePath = normalizePath(env.ADMIN_ROUTE_PREFIX);
const isAdminPath = (path) => path === adminBasePath || path.startsWith(`${adminBasePath}/`);

export const adminSurfaceGuardMiddleware = (req, res, next) => {
  const requestHost = String(req.hostname || "").toLowerCase();
  const normalizedOriginalUrl = "/" + (req.originalUrl ?? req.path ?? "").split("?")[0].replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/").toLowerCase();
  const matchesAdminPath = isAdminPath(normalizedOriginalUrl);
  const allowedAdminHost = env.ADMIN_ALLOWED_HOSTS.includes(requestHost);

  if (!matchesAdminPath) {
    const isProdAdminHost = env.NODE_ENV === "production" && requestHost === env.ADMIN_SUBDOMAIN;
    if (!isProdAdminHost) return next();
    loggers.security.warn({
      eventType: "admin_recon_path_blocked",
      userId: req.user?.id ?? null,
      details: { host: requestHost, path: req.originalUrl },
    });
    return res.status(404).json({ error: "Not Found" });
  }

  if (!allowedAdminHost) {
    loggers.security.warn({
      eventType: "admin_host_rejected",
      userId: req.user?.id ?? null,
      details: { host: requestHost, path: req.originalUrl },
    });
    return res.status(404).json({ error: "Not Found" });
  }

  if (!req.user || !isAdminSurfaceRole(req.user.role)) {
    loggers.security.warn({
      eventType: "admin_unauthorized_hidden",
      userId: req.user?.id ?? null,
      details: { host: requestHost, path: req.originalUrl },
    });
    return res.status(404).json({ error: "Not Found" });
  }

  return next();
};

export const adminBasePathPrefix = adminBasePath;
