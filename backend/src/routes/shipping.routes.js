import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import { COMMERCE_ADMIN_ROLES } from "../config/constants.js";
import {
  getShippingConfigsController,
  getShippingSettingsController,
  createShippingConfigController,
  updateShippingConfigController,
  updateShippingSettingsController
} from "../controllers/shipping.controller.js";

const router = Router();

// Publicly available to get active configs for checkout
router.get("/configs", asyncHandler(getShippingConfigsController));
router.get("/settings", asyncHandler(getShippingSettingsController));

// Admin only routes
router.use(requireAuthenticatedUserMiddleware, requireRoles(COMMERCE_ADMIN_ROLES));

router.post("/configs", asyncHandler(createShippingConfigController));
router.put("/configs/:id", asyncHandler(updateShippingConfigController));
router.put("/settings", asyncHandler(updateShippingSettingsController));

export default router;
