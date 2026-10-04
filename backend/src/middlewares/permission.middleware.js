import { AppError } from "../errors/app-error.js";
import { getRolePermissions } from "../services/admin-control.service.js";

const normalizePermissions = (permissions) =>
  (Array.isArray(permissions) ? permissions : [permissions])
    .map((permission) => String(permission || "").trim())
    .filter(Boolean);

export const requirePermissions = (permissions, { mode = "all", hideUnauthorized = false } = {}) => {
  const required = normalizePermissions(permissions);
  const matchAny = mode === "any";

  return async (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          hideUnauthorized ? "Not Found." : "Authentication required.",
          hideUnauthorized ? 404 : 401,
          "AUTH_REQUIRED",
        ),
      );
    }

    const granted = await getRolePermissions(req.user.role);
    req.user.permissions = granted;

    const allowed = required.length === 0
      ? true
      : matchAny
        ? required.some((permission) => granted.includes(permission))
        : required.every((permission) => granted.includes(permission));

    if (!allowed) {
      return next(
        new AppError(
          hideUnauthorized ? "Not Found." : "Forbidden.",
          hideUnauthorized ? 404 : 403,
          "FORBIDDEN",
        ),
      );
    }

    return next();
  };
};

