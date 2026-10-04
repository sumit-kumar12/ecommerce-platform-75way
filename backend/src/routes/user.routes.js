import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { getMeController, updateMeController, changePasswordController } from "../controllers/user.controller.js";

const router = Router();

// All user self-service routes require authentication
router.use(requireAuthenticatedUserMiddleware);

// GET  /api/v1/users/me — Get own profile
router.get("/me", asyncHandler(getMeController));

// PATCH /api/v1/users/me — Update own profile (name, phone)
router.patch("/me", asyncHandler(updateMeController));

// POST /api/v1/users/me/change-password — Change password (revokes all sessions)
router.post("/me/change-password", asyncHandler(changePasswordController));

// GET  /api/v1/users/me/sessions — List active sessions
import { getUserSessions, revokeUserSession } from "../controllers/user-sessions.controller.js";
router.get("/me/sessions", asyncHandler(getUserSessions));

// DELETE /api/v1/users/me/sessions/:sessionId — Revoke a session
router.delete("/me/sessions/:sessionId", asyncHandler(revokeUserSession));

export default router;
