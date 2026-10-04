import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
  applyCouponController,
  removeCouponController,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", asyncHandler(getCartController));
router.post("/items", asyncHandler(addCartItemController));
router.patch("/items/:variantId", asyncHandler(updateCartItemController));
router.delete("/items/:variantId", asyncHandler(removeCartItemController));

router.post("/coupon", asyncHandler(applyCouponController));
router.delete("/coupon", asyncHandler(removeCouponController));

export default router;
