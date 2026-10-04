import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { isFullAdminRole } from "../config/constants.js";
import { z } from "zod";

const productParamSchema = z.object({
  productId: z.string().uuid(),
});
const variantParamSchema = z.object({
  variantId: z.string().uuid(),
});
const orderParamSchema = z.object({
  orderId: z.string().min(1),
});

export const requireProductOwnershipOrAdmin = async (req, _res, next) => {
  const params = productParamSchema.parse(req.params);
  if (!req.user) return next(new AppError("Authentication required.", 401, "AUTH_REQUIRED"));
  if (isFullAdminRole(req.user.role)) return next();
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    select: { listerId: true },
  });
  if (!product) return next(new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND"));
  if (product.listerId !== req.user.id) {
    return next(new AppError("Forbidden.", 403, "FORBIDDEN"));
  }
  return next();
};

export const requireVariantOwnershipOrAdmin = async (req, _res, next) => {
  const params = variantParamSchema.parse(req.params);
  if (!req.user) return next(new AppError("Authentication required.", 401, "AUTH_REQUIRED"));
  if (isFullAdminRole(req.user.role)) return next();
  const variant = await prisma.productVariant.findUnique({
    where: { id: params.variantId },
    include: { product: { select: { listerId: true } } },
  });
  if (!variant) return next(new AppError("Variant not found.", 404, "VARIANT_NOT_FOUND"));
  if (variant.product.listerId !== req.user.id) {
    return next(new AppError("Forbidden.", 403, "FORBIDDEN"));
  }
  return next();
};

export const requireOrderOwnership = async (req, _res, next) => {
  const params = orderParamSchema.parse(req.params);
  if (!req.user) return next(new AppError("Authentication required.", 401, "AUTH_REQUIRED"));
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: params.orderId },
        { orderNumber: params.orderId }
      ]
    },
    select: { userId: true },
  });
  if (!order) return next(new AppError("Order not found.", 404, "ORDER_NOT_FOUND"));
  if (!isFullAdminRole(req.user.role) && req.user.id !== order.userId) {
    return next(new AppError("Forbidden.", 403, "FORBIDDEN"));
  }
  return next();
};
