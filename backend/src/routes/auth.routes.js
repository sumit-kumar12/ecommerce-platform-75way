import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  csrfTokenController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  resetPasswordController,
  registerController,
  validateResetPasswordTokenController,
  issueSseTokenController,
  googleOAuthInitController,
  googleOAuthCallbackController,
  instagramOAuthInitController,
  instagramOAuthCallbackController,
} from "../controllers/auth.controller.js";
import { forgotPasswordRateLimiter } from "../middlewares/rate-limit.middleware.js";

const router = Router();

router.get("/csrf-token", asyncHandler(csrfTokenController));
router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));
router.post("/refresh", asyncHandler(refreshController));
router.post("/logout", asyncHandler(logoutController));
// Rate-limited: 10 req / 15 min per IP (prevents enumeration + brute-force).
router.post("/forgot-password", forgotPasswordRateLimiter, asyncHandler(forgotPasswordController));
router.get("/reset-password/:token/validate", asyncHandler(validateResetPasswordTokenController));
router.post("/reset-password", asyncHandler(resetPasswordController));

import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
router.post("/sse-token", requireAuthenticatedUserMiddleware, asyncHandler(issueSseTokenController));

router.get("/google", asyncHandler(googleOAuthInitController));
router.get("/google/callback", asyncHandler(googleOAuthCallbackController));

router.get("/instagram", asyncHandler(instagramOAuthInitController));
router.get("/instagram/callback", asyncHandler(instagramOAuthCallbackController));

export default router;
