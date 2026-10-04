import { AppError } from "../errors/app-error.js";
import { getGlobalLockoutState } from "../services/admin-control.service.js";
import { isAdminSurfaceRole } from "../config/constants.js";

export const accountActiveCheckMiddleware = async (req, _res, next) => {
  if (!req.user) return next();
  if (!isAdminSurfaceRole(req.user.role)) {
    const lockout = await getGlobalLockoutState();
    if (lockout.locked) {
      return next(new AppError("Platform emergency lockout is active.", 423, "GLOBAL_LOCKOUT_ACTIVE"));
    }
  }
  if (!req.user.isActive) {
    return next(new AppError("Account inactive.", 403, "ACCOUNT_INACTIVE"));
  }
  if (req.user.lockedUntil && req.user.lockedUntil > new Date()) {
    return next(new AppError("Account locked.", 423, "ACCOUNT_LOCKED"));
  }
  return next();
};
