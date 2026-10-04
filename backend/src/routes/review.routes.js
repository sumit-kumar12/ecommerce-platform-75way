import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import { COMMERCE_ADMIN_ROLES } from "../config/constants.js";
import {
  createReviewController,
  getProductReviewsController,
  getAdminReviewsController,
  updateReviewStatusController,
  deleteReviewController
} from "../controllers/review.controller.js";

const router = Router({ mergeParams: true });

// Public route to get reviews for a product
// Example: /api/v1/products/:productId/reviews
router.get("/", asyncHandler(getProductReviewsController));

// Authenticated route to create a review
router.post("/", requireAuthenticatedUserMiddleware, asyncHandler(createReviewController));

export default router;

// A separate router for admin review management
export const adminReviewRoutes = Router();
adminReviewRoutes.use(requireAuthenticatedUserMiddleware, requireRoles(COMMERCE_ADMIN_ROLES));
adminReviewRoutes.get("/", asyncHandler(getAdminReviewsController));
adminReviewRoutes.put("/:id/status", asyncHandler(updateReviewStatusController));
adminReviewRoutes.delete("/:id", asyncHandler(deleteReviewController));
