import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import { requireOrderOwnership } from "../middlewares/ownership.middleware.js";
import { COMMERCE_ADMIN_ROLES, FULL_ADMIN_ROLES, ROLES } from "../config/constants.js";
import {
  createOrderController,
  getMyOrderController,
  listMyOrdersController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";

const router = Router();
const CUSTOMER_ORDER_ACCESS_ROLES = Object.values(ROLES);

router.post(
  "/",
  requireAuthenticatedUserMiddleware,
  requireRoles(CUSTOMER_ORDER_ACCESS_ROLES),
  asyncHandler(createOrderController),
);

router.get(
  "/mine",
  requireAuthenticatedUserMiddleware,
  requireRoles(CUSTOMER_ORDER_ACCESS_ROLES),
  asyncHandler(listMyOrdersController),
);

router.get(
  "/:orderId",
  requireAuthenticatedUserMiddleware,
  asyncHandler(requireOrderOwnership),
  asyncHandler(getMyOrderController),
);

const ORDER_STATUS_UPDATE_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COMMERCE_ADMIN];
router.patch(
  "/:orderId/status",
  requireAuthenticatedUserMiddleware,
  requireRoles(ORDER_STATUS_UPDATE_ROLES),
  asyncHandler(updateOrderStatusController),
);

export default router;
