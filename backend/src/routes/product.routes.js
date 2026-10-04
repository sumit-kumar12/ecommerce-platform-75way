import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createCategoryController,
  createProductController,
  deactivateProductController,
  getProductByIdController,
  listCategoryTreeController,
  listCategoriesController,
  listRelatedProductsController,
  searchProductsController,
  updateProductController,
  updateVariantStockController,
} from "../controllers/product.controller.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import qaRoutes from "./qa.routes.js";

import { requireRoles } from "../middlewares/role.middleware.js";
import { COMMERCE_ADMIN_ROLES, FULL_ADMIN_ROLES } from "../config/constants.js";
import {
  requireProductOwnershipOrAdmin,
  requireVariantOwnershipOrAdmin,
} from "../middlewares/ownership.middleware.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

router.use("/:productId/reviews", reviewRoutes);

// PUBLIC — intentionally unauthenticated. Product data is public catalog.
// Audit B4: Prisma uses parameterised queries; no raw SQL interpolation of req.query.
router.get("/search", asyncHandler(searchProductsController));
router.get("/categories", asyncHandler(listCategoriesController));
router.get("/categories/tree", asyncHandler(listCategoryTreeController));
router.get("/:productId/related", asyncHandler(listRelatedProductsController));
// PUBLIC — intentionally unauthenticated. Ownership check only applies to mutations.
router.get("/:productId", asyncHandler(getProductByIdController));

router.post(
  "/categories",
  requireAuthenticatedUserMiddleware,
  requireRoles(FULL_ADMIN_ROLES),
  asyncHandler(createCategoryController),
);

router.post(
  "/",
  requireAuthenticatedUserMiddleware,
  requireRoles(COMMERCE_ADMIN_ROLES),
  asyncHandler(createProductController),
);

router.patch(
  "/:productId",
  requireAuthenticatedUserMiddleware,
  requireRoles(COMMERCE_ADMIN_ROLES),
  asyncHandler(requireProductOwnershipOrAdmin),
  asyncHandler(updateProductController),
);

router.patch(
  "/:productId/deactivate",
  requireAuthenticatedUserMiddleware,
  requireRoles(COMMERCE_ADMIN_ROLES),
  asyncHandler(requireProductOwnershipOrAdmin),
  asyncHandler(deactivateProductController),
);

router.patch(
  "/variants/:variantId/stock",
  requireAuthenticatedUserMiddleware,
  requireRoles(COMMERCE_ADMIN_ROLES),
  asyncHandler(requireVariantOwnershipOrAdmin),
  asyncHandler(updateVariantStockController),
);

// Q&A sub-routes
router.use("/:productId/qa", qaRoutes);

export default router;
