import express from "express";
import { requireAuthenticatedUserMiddleware as requireAuth } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import {
  createReturnController,
  getUserReturnsController,
  getAdminReturnsController,
  updateReturnStatusController
} from "../controllers/returns.controller.js";

const router = express.Router();

// Customer endpoints
router.post("/", requireAuth, createReturnController);
router.get("/mine", requireAuth, getUserReturnsController);

// Admin endpoints
router.get(
  "/admin",
  requireAuth,
  requireRoles(["SUPER_ADMIN", "ADMIN", "SECURITY_ADMIN", "COMMERCE_ADMIN"]),
  getAdminReturnsController
);
router.patch(
  "/:id/status",
  requireAuth,
  requireRoles(["SUPER_ADMIN", "ADMIN", "SECURITY_ADMIN", "COMMERCE_ADMIN"]),
  updateReturnStatusController
);

export default router;
