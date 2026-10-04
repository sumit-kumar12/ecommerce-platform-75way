import { getGlobalLockoutState } from "../services/admin-control.service.js";
import { AppError } from "../errors/app-error.js";
import { isAdminSurfaceRole } from "../config/constants.js";

/**
 * Middleware to block traffic if the platform is in global lockout/maintenance mode.
 * Admins are allowed to bypass this to perform repairs.
 */
export const lockoutGuardMiddleware = async (req, res, next) => {
  // Allow admins to bypass the lockout
  if (isAdminSurfaceRole(req.user?.role)) {
    return next();
  }

  // Allow health checks and auth routes (to allow admin login)
  const bypassPaths = ["/monitoring/health", "/auth/login", "/auth/logout"];
  if (bypassPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const state = await getGlobalLockoutState();
  if (state.locked) {
    throw new AppError(
      state.reason || "Platform is currently under emergency maintenance.", 
      423, 
      "GLOBAL_LOCKOUT_ACTIVE"
    );
  }

  next();
};
