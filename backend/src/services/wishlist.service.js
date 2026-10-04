import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { guestCookieOptions } from "../utils/cookies.js";
import { openCookiePayload, sealCookiePayload } from "../utils/crypto.js";

const guestWishlistCookieName = env.GUEST_WISHLIST_COOKIE_NAME;

const getGuestWishlist = (req) => {
  const payload = openCookiePayload(req.cookies[guestWishlistCookieName]);
  if (!payload || !Array.isArray(payload.productIds)) return { productIds: [] };
  return payload;
};

const setGuestWishlist = (res, wishlist) => {
  res.cookie(guestWishlistCookieName, sealCookiePayload(wishlist), guestCookieOptions());
};

export const clearGuestWishlist = (res) => {
  res.clearCookie(guestWishlistCookieName);
};

const ensureProduct = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new AppError("Product is unavailable.", 404, "PRODUCT_NOT_FOUND");
  return product;
};

const getOrCreateWishlist = async (userId) => {
  const existing = await prisma.wishlist.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.wishlist.create({ data: { userId } });
};

export const mergeGuestWishlistIntoUser = async (req, userId) => {
  const guest = getGuestWishlist(req);
  if (!guest.productIds.length) return;
  const wishlist = await getOrCreateWishlist(userId);

  for (const productId of guest.productIds) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) continue;

    await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
      create: {
        wishlistId: wishlist.id,
        productId,
      },
      update: {},
    });
  }
};

export const getWishlist = async (req, userId) => {
  if (!userId) {
    const guest = getGuestWishlist(req);
    const items = await prisma.product.findMany({
      where: {
        id: { in: guest.productIds },
        isActive: true,
      },
      include: {
        category: true,
        variants: { where: { isActive: true } },
        images: {
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });
    return {
      type: "guest",
      warning: "Guest wishlist is cookie-based and will be cleared if browser cookies are removed.",
      items,
    };
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              variants: { where: { isActive: true } },
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
              },
            },
          },
        },
      },
    },
  });

  return {
    type: "user",
    items: wishlist?.items.map((item) => item.product) ?? [],
  };
};

export const addWishlistItem = async ({ req, res, userId, productId }) => {
  await ensureProduct(productId);

  if (!userId) {
    const guest = getGuestWishlist(req);
    if (!guest.productIds.includes(productId)) guest.productIds.push(productId);
    setGuestWishlist(res, guest);
    return getWishlist(req, null);
  }

  const wishlist = await getOrCreateWishlist(userId);
  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
    create: {
      wishlistId: wishlist.id,
      productId,
    },
    update: {},
  });

  return getWishlist(req, userId);
};

export const removeWishlistItem = async ({ req, res, userId, productId }) => {
  if (!userId) {
    const guest = getGuestWishlist(req);
    guest.productIds = guest.productIds.filter((id) => id !== productId);
    setGuestWishlist(res, guest);
    return getWishlist(req, null);
  }

  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) return getWishlist(req, userId);
  await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });
  return getWishlist(req, userId);
};
