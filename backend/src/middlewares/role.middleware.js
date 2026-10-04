import { AppError } from "../errors/app-error.js";

export const requireRoles = (roles, { hideUnauthorized = false } = {}) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (allowed.length === 0) {
    throw new Error("[requireRoles] Called with an empty roles array. This is a developer misconfiguration.");
  }
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(hideUnauthorized ? "Not Found." : "Authentication required.", hideUnauthorized ? 404 : 401, "AUTH_REQUIRED"));
    }
    if (!allowed.includes(req.user.role)) {
      return next(new AppError(hideUnauthorized ? "Not Found." : "Forbidden.", hideUnauthorized ? 404 : 403, "FORBIDDEN"));
    }
    return next();
  };
};
