import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import { COMMERCE_ADMIN_ROLES } from "../config/constants.js";
import {
  createOutletController,
  updateOutletController,
  listOutletsController,
  deleteOutletController,
  updateOutletInventoryController,
  listOutletInventoryController,
} from "../controllers/outlet.controller.js";

const router = Router();

// Only Commerce Admins (and Super Admins) can manage outlets
router.use(requireAuthenticatedUserMiddleware, requireRoles(COMMERCE_ADMIN_ROLES));

router.get("/", asyncHandler(listOutletsController));
router.post("/", asyncHandler(createOutletController));
router.put("/:id", asyncHandler(updateOutletController));
router.delete("/:id", asyncHandler(deleteOutletController));

router.get("/:id/inventory", asyncHandler(listOutletInventoryController));
router.post("/:id/inventory", asyncHandler(updateOutletInventoryController));

export default router;
