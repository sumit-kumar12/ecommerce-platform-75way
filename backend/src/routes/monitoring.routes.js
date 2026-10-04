import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  monitoringAlertWebhookController,
  monitoringPublicLockoutStatusController,
} from "../controllers/monitoring.controller.js";

const router = Router();

router.post("/alerts/webhook", asyncHandler(monitoringAlertWebhookController));
router.get("/lockout-status", asyncHandler(monitoringPublicLockoutStatusController));

export default router;
