import { z } from "zod";
import { addCartItem, getCart, removeCartItem, updateCartItemQuantity, applyCoupon, removeCoupon } from "../services/cart.service.js";

const addItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(100),
});
const variantParamSchema = z.object({
  variantId: z.string().uuid(),
});

export const getCartController = async (req, res) => {
  const cart = await getCart(req, req.user?.id ?? null);
  res.status(200).json({ cart });
};

export const addCartItemController = async (req, res) => {
  const input = addItemSchema.parse(req.body);
  const cart = await addCartItem({
    req,
    res,
    userId: req.user?.id ?? null,
    variantId: input.variantId,
    quantity: input.quantity,
  });
  res.status(200).json({ cart });
};

export const updateCartItemController = async (req, res) => {
  const input = updateQuantitySchema.parse(req.body);
  const params = variantParamSchema.parse(req.params);
  const cart = await updateCartItemQuantity({
    req,
    res,
    userId: req.user?.id ?? null,
    variantId: params.variantId,
    quantity: input.quantity,
  });
  res.status(200).json({ cart });
};

export const removeCartItemController = async (req, res) => {
  const params = variantParamSchema.parse(req.params);
  const cart = await removeCartItem({
    req,
    res,
    userId: req.user?.id ?? null,
    variantId: params.variantId,
  });
  res.status(200).json({ cart });
};

const applyCouponSchema = z.object({
  code: z.string().min(1),
});

export const applyCouponController = async (req, res) => {
  const input = applyCouponSchema.parse(req.body);
  const cart = await applyCoupon({
    req,
    res,
    userId: req.user?.id ?? null,
    code: input.code,
  });
  res.status(200).json({ cart });
};

export const removeCouponController = async (req, res) => {
  const cart = await removeCoupon({
    req,
    res,
    userId: req.user?.id ?? null,
  });
  res.status(200).json({ cart });
};
