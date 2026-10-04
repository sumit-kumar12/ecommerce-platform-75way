import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import {
  addWishlistController,
  getWishlistController,
  removeWishlistController,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.get("/", asyncHandler(getWishlistController));
router.post("/items", requireAuthenticatedUserMiddleware, asyncHandler(addWishlistController));
router.delete("/items/:productId", requireAuthenticatedUserMiddleware, asyncHandler(removeWishlistController));

export default router;
