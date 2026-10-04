import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import { FULL_ADMIN_ROLES, ROLES } from "../config/constants.js";
import {
  completeMockPaymentController,
  createRazorpayOrderController,
  getPaymentStatusController,
  recordPaymentClientFailureController,
  verifyPaymentController,
} from "../controllers/payment.controller.js";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const router = Router();
const PAYMENT_ACCESS_ROLES = Object.values(ROLES);

const requireNonProduction = (req, res, next) => {
  if (env.NODE_ENV === "production") {
    throw new AppError("Not found", 404, "NOT_FOUND");
  }
  next();
};

router.post(
  "/checkout/:orderId/start",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(createRazorpayOrderController),
);

router.post(
  "/orders/:orderId/razorpay",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(createRazorpayOrderController),
);

router.post(
  "/checkout/confirm",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(verifyPaymentController),
);

router.post(
  "/verify",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(verifyPaymentController),
);

router.post(
  "/checkout/:orderId/test-success",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  requireNonProduction,
  asyncHandler(completeMockPaymentController),
);

router.post(
  "/orders/:orderId/mock-complete",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  requireNonProduction,
  asyncHandler(completeMockPaymentController),
);

router.get(
  "/checkout/:orderId/status",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(getPaymentStatusController),
);

router.get(
  "/orders/:orderId/status",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(getPaymentStatusController),
);

router.post(
  "/checkout/:orderId/incomplete",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(recordPaymentClientFailureController),
);

router.post(
  "/orders/:orderId/client-failure",
  requireAuthenticatedUserMiddleware,
  requireRoles(PAYMENT_ACCESS_ROLES),
  asyncHandler(recordPaymentClientFailureController),
);

export default router;
