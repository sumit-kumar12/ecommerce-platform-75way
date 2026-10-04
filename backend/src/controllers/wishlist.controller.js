import { z } from "zod";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../services/wishlist.service.js";
import { serializeProductPayload } from "./product.controller.js";

const itemSchema = z.object({
  productId: z.string().uuid(),
});
const productParamSchema = z.object({
  productId: z.string().uuid(),
});

const serializeWishlist = (req, wishlist) => {
  return {
    ...wishlist,
    items: wishlist.items.map(product => serializeProductPayload(req, product))
  };
};

export const getWishlistController = async (req, res) => {
  const wishlist = await getWishlist(req, req.user?.id ?? null);
  res.status(200).json({ wishlist: serializeWishlist(req, wishlist) });
};

export const addWishlistController = async (req, res) => {
  const input = itemSchema.parse(req.body);
  const wishlist = await addWishlistItem({
    req,
    res,
    userId: req.user?.id ?? null,
    productId: input.productId,
  });
  res.status(200).json({ wishlist: serializeWishlist(req, wishlist) });
};

export const removeWishlistController = async (req, res) => {
  const params = productParamSchema.parse(req.params);
  const wishlist = await removeWishlistItem({
    req,
    res,
    userId: req.user?.id ?? null,
    productId: params.productId,
  });
  res.status(200).json({ wishlist: serializeWishlist(req, wishlist) });
};
