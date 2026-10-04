import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import {
  getProductByBarcodeController,
  posCheckoutController,
  posCurrentDrawerController,
  posDrawerOpenController,
  posDrawerCloseController,
  posDashboardController
} from "../controllers/pos.controller.js";

const router = Router();

// Wrap with POS specific auth later, using requireAuthenticatedUserMiddleware for drawer
router.get("/dashboard", asyncHandler(posDashboardController));
router.get("/products/barcode/:sku", asyncHandler(getProductByBarcodeController));
router.post("/checkout", asyncHandler(posCheckoutController));

// Drawer routes
router.get("/drawer/current", requireAuthenticatedUserMiddleware, asyncHandler(posCurrentDrawerController));
router.post("/drawer/open", requireAuthenticatedUserMiddleware, asyncHandler(posDrawerOpenController));
router.post("/drawer/:id/close", requireAuthenticatedUserMiddleware, asyncHandler(posDrawerCloseController));

export default router;
