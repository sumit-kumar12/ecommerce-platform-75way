import { Router } from "express";
import { razorpayWebhookController } from "../controllers/payment.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post("/webhooks/razorpay", asyncHandler(razorpayWebhookController));
router.post("/razorpay/webhook", asyncHandler(razorpayWebhookController));

export default router;
