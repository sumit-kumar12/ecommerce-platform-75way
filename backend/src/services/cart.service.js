import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { guestCookieOptions } from "../utils/cookies.js";
import { openCookiePayload, sealCookiePayload } from "../utils/crypto.js";
import { buildProductMediaAbsoluteUrl } from "../utils/product-media.js";
import { getOfferPricingForVariant, listActiveOffers, serializeOfferPricing } from "./offer.service.js";
import { listActiveFlashDeals } from "./flash-deal.service.js";

const guestCartCookieName = env.GUEST_CART_COOKIE_NAME;

const normalizeQuantity = (quantity) => {
  const parsed = Number(quantity);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
    throw new AppError("Quantity must be an integer between 1 and 100.", 400, "INVALID_QUANTITY");
  }
  return parsed;
};

const ensureVariant = async (variantId) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!variant || !variant.isActive || !variant.product.isActive) {
    throw new AppError("Variant is not available.", 404, "VARIANT_NOT_AVAILABLE");
  }
  return variant;
};

const getGuestCart = (req) => {
  const payload = openCookiePayload(req.cookies[guestCartCookieName]);
  if (!payload || !Array.isArray(payload?.items)) return { items: [], couponCode: null };
  return payload;
};

const setGuestCart = (res, cart) => {
  res.cookie(guestCartCookieName, sealCookiePayload(cart), guestCookieOptions());
};

export const clearGuestCart = (res) => {
  res.clearCookie(guestCartCookieName);
};

const getOrCreateUserCart = async (userId) => {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
};

const serializeCartProduct = (req, product) => {
  const primaryImage =
    (Array.isArray(product?.images) ? product.images : []).find((image) => image?.isPrimary) ??
    (Array.isArray(product?.images) ? product.images[0] : null);

  return {
    id: product.id,
    name: product.name,
    category: product.category?.name ?? "",
    categoryId: product.category?.id ?? null,
    categorySlug: product.category?.slug ?? null,
    isDigital: Boolean(product.isDigital),
    paymentOnlineOnly: Boolean(product.paymentOnlineOnly),
    paymentAllowCOD: Boolean(product.paymentAllowCOD),
    paymentMinCODPrice: product.paymentMinCODPrice,
    shippingPrice: product.shippingPrice,
    thumbnailImageUrl: primaryImage ? buildProductMediaAbsoluteUrl({ req, storageKey: primaryImage.storageKey }) : null,
  };
};

export const mergeGuestCartIntoUser = async (req, userId) => {
  const guestCart = getGuestCart(req);
  if (!guestCart.items.length) return;
  const cart = await getOrCreateUserCart(userId);

  for (const item of guestCart.items) {
    const quantity = normalizeQuantity(item.quantity);
    const variant = await ensureVariant(item.variantId);
    if (variant.stock < quantity) continue;

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: variant.id,
        },
      },
    });

    if (existingItem) {
      const mergedQuantity = Math.min(existingItem.quantity + quantity, variant.stock);
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: mergedQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variant.id,
          quantity,
        },
      });
    }
  }
};

export const getCart = async (req, userId) => {
  const [activeOffers, activeFlashDeals] = await Promise.all([
    listActiveOffers(),
    listActiveFlashDeals().catch(() => []),
  ]);

  if (!userId) {
    const guest = getGuestCart(req);
    const detailedItems = [];
    for (const item of guest.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: {
          product: {
            include: {
              category: true,
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
                take: 1,
              },
            },
          },
        },
      });
      if (!variant || !variant.product.isActive || !variant.isActive) continue;
      const pricing = getOfferPricingForVariant({ variant, offers: activeOffers, flashDeals: activeFlashDeals });
      detailedItems.push({
        variantId: variant.id,
        title: variant.title,
        ...serializeOfferPricing(pricing, item.quantity),
        quantity: item.quantity,
        product: serializeCartProduct(req, variant.product),
      });
    }

    const shippingSettings = await prisma.shippingSettings.findUnique({ where: { id: "singleton" } });
    let subtotalPaise = 0;
    let shippingFeePaise = 0;
    
    for (const item of detailedItems) {
      subtotalPaise += item.unitPaise * item.quantity;
      const productShipping = Number(item.product.shippingPrice) || 0;
      shippingFeePaise += Math.round(productShipping * 100) * item.quantity;
    }

    if (shippingSettings?.freeShippingThreshold && (subtotalPaise / 100) >= Number(shippingSettings.freeShippingThreshold)) {
      shippingFeePaise = 0;
    }

    let couponDiscountPaise = 0;
    let couponApplied = null;
    let couponError = null;
    
    if (guest.couponCode) {
      const offer = activeOffers.find(o => o.code === guest.couponCode);
      if (offer && offer.discountPercent) {
        couponDiscountPaise = Math.round(subtotalPaise * (offer.discountPercent / 100));
        couponApplied = guest.couponCode;
      } else {
        couponError = "Coupon is invalid or expired.";
      }
    }

    return {
      type: "guest",
      warning: "Guest cart is cookie-based and will be cleared if browser cookies are removed.",
      items: detailedItems,
      shippingFeePaise,
      subtotalPaise,
      couponDiscountPaise,
      couponApplied,
      couponError,
      totalPaise: subtotalPaise + shippingFeePaise - couponDiscountPaise,
      allowGlobalCOD: shippingSettings ? shippingSettings.allowGlobalCOD : true
    };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                  images: {
                    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
      offer: true,
    },
  });

  const mappedItems = cart?.items.map((item) => {
    const pricing = getOfferPricingForVariant({ variant: item.variant, offers: activeOffers, flashDeals: activeFlashDeals });
    return {
      variantId: item.variant.id,
      title: item.variant.title,
      ...serializeOfferPricing(pricing, item.quantity),
      quantity: item.quantity,
      product: serializeCartProduct(req, item.variant.product),
    };
  }) ?? [];

  const shippingSettings = await prisma.shippingSettings.findUnique({ where: { id: "singleton" } });
  let subtotalPaise = 0;
  let shippingFeePaise = 0;
  
  for (const item of mappedItems) {
    subtotalPaise += item.unitPaise * item.quantity;
    const productShipping = Number(item.product.shippingPrice) || 0;
    shippingFeePaise += Math.round(productShipping * 100) * item.quantity;
  }

  if (shippingSettings?.freeShippingThreshold && (subtotalPaise / 100) >= Number(shippingSettings.freeShippingThreshold)) {
    shippingFeePaise = 0;
  }

  let couponDiscountPaise = 0;
  let couponApplied = null;
  let couponError = null;

  if (cart?.offer) {
    if (cart.offer.isActive && cart.offer.discountPercent) {
      couponDiscountPaise = Math.round(subtotalPaise * (cart.offer.discountPercent / 100));
      couponApplied = cart.offer.code;
    } else {
      couponError = "Coupon is invalid or expired.";
    }
  }

  return {
    type: "user",
    items: mappedItems,
    shippingFeePaise,
    subtotalPaise,
    couponDiscountPaise,
    couponApplied,
    couponError,
    totalPaise: subtotalPaise + shippingFeePaise - couponDiscountPaise,
    allowGlobalCOD: shippingSettings ? shippingSettings.allowGlobalCOD : true
  };
};

export const addCartItem = async ({ req, res, userId, variantId, quantity }) => {
  const normalizedQuantity = normalizeQuantity(quantity);
  const variant = await ensureVariant(variantId);
  if (variant.stock < normalizedQuantity) {
    throw new AppError("Not enough stock for requested quantity.", 400, "INSUFFICIENT_STOCK");
  }

  if (!userId) {
    const cart = getGuestCart(req);
    const existing = cart.items.find((item) => item.variantId === variantId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + normalizedQuantity, variant.stock);
    } else {
      cart.items.push({ variantId, quantity: normalizedQuantity });
    }
    setGuestCart(res, cart);
    return getCart(req, null);
  }

  const cart = await getOrCreateUserCart(userId);
  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId,
      },
    },
  });

  if (existing) {
    const mergedQuantity = Math.min(existing.quantity + normalizedQuantity, variant.stock);
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: mergedQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity: normalizedQuantity },
    });
  }
  return getCart(req, userId);
};

export const updateCartItemQuantity = async ({ req, res, userId, variantId, quantity }) => {
  const normalizedQuantity = normalizeQuantity(quantity);
  const variant = await ensureVariant(variantId);
  if (variant.stock < normalizedQuantity) {
    throw new AppError("Not enough stock for requested quantity.", 400, "INSUFFICIENT_STOCK");
  }

  if (!userId) {
    const cart = getGuestCart(req);
    const item = cart.items.find((entry) => entry.variantId === variantId);
    if (!item) throw new AppError("Item not found in guest cart.", 404, "CART_ITEM_NOT_FOUND");
    item.quantity = normalizedQuantity;
    setGuestCart(res, cart);
    return getCart(req, null);
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found.", 404, "CART_NOT_FOUND");

  await prisma.cartItem.updateMany({
    where: {
      cartId: cart.id,
      variantId,
    },
    data: { quantity: normalizedQuantity },
  });
  return getCart(req, userId);
};

export const removeCartItem = async ({ req, res, userId, variantId }) => {
  if (!userId) {
    const cart = getGuestCart(req);
    cart.items = cart.items.filter((item) => item.variantId !== variantId);
    setGuestCart(res, cart);
    return getCart(req, null);
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return getCart(req, userId);

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      variantId,
    },
  });
  return getCart(req, userId);
};

export const applyCoupon = async ({ req, res, userId, code }) => {
  const offer = await prisma.offer.findUnique({ where: { code } });
  if (!offer || !offer.isActive) {
    throw new AppError("Invalid or expired coupon code.", 400, "INVALID_COUPON");
  }

  if (!userId) {
    const cart = getGuestCart(req);
    cart.couponCode = code;
    setGuestCart(res, cart);
    return getCart(req, null);
  }

  const cart = await getOrCreateUserCart(userId);
  await prisma.cart.update({
    where: { id: cart.id },
    data: { offerId: offer.id },
  });
  return getCart(req, userId);
};

export const removeCoupon = async ({ req, res, userId }) => {
  if (!userId) {
    const cart = getGuestCart(req);
    cart.couponCode = null;
    setGuestCart(res, cart);
    return getCart(req, null);
  }

  const cart = await getOrCreateUserCart(userId);
  await prisma.cart.update({
    where: { id: cart.id },
    data: { offerId: null },
  });
  return getCart(req, userId);
};
