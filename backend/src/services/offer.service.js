import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { sanitizeText } from "../utils/sanitize.js";
import { decimalToPaise, paiseToDecimalString } from "../utils/money.js";

const normalizeOfferCode = (value) => {
  if (value === undefined) return undefined;
  const normalized = sanitizeText(value || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return normalized || null;
};

const validateOfferWindow = ({ startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("Offer schedule is invalid.", 400, "INVALID_OFFER_SCHEDULE");
  }
  if (end <= start) {
    throw new AppError("Offer end date must be after start date.", 400, "INVALID_OFFER_WINDOW");
  }
  return { start, end };
};

const assertValidDiscount = (discountPercent) => {
  const discount = Number(discountPercent);
  if (!Number.isInteger(discount) || discount < 1 || discount > 90) {
    throw new AppError("Offer discount must be between 1 and 90 percent.", 400, "INVALID_OFFER_DISCOUNT");
  }
  return discount;
};

const normalizeUsageLimit = (value, fieldName) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 1_000_000) {
    throw new AppError(`${fieldName} must be between 1 and 1,000,000.`, 400, "INVALID_OFFER_LIMIT");
  }
  return limit;
};

const assertCategoryExists = async (categoryId) => {
  if (!categoryId) return;
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) throw new AppError("Offer category not found.", 404, "OFFER_CATEGORY_NOT_FOUND");
};

const assertLimitRelationship = ({ usageLimit, perCustomerLimit }) => {
  if (usageLimit && perCustomerLimit && perCustomerLimit > usageLimit) {
    throw new AppError("Per-customer limit cannot exceed total usage limit.", 400, "INVALID_OFFER_LIMIT");
  }
};

const isGloballyRedeemable = (offer) => !offer.usageLimit || Number(offer.redeemedCount || 0) < Number(offer.usageLimit);

export const createOffer = async (input) => {
  const code = normalizeOfferCode(input.code);
  const { start, end } = validateOfferWindow(input);
  const discountPercent = assertValidDiscount(input.discountPercent);
  const usageLimit = normalizeUsageLimit(input.usageLimit, "Usage limit");
  const perCustomerLimit = normalizeUsageLimit(input.perCustomerLimit, "Per-customer limit");
  assertLimitRelationship({ usageLimit, perCustomerLimit });
  await assertCategoryExists(input.categoryId);

  if (code) {
    const existing = await prisma.offer.findUnique({ where: { code } });
    if (existing) throw new AppError("Offer code already exists.", 409, "OFFER_CODE_EXISTS");
  }

  return prisma.offer.create({
    data: {
      title: sanitizeText(input.title),
      description: input.description ? sanitizeText(input.description) : null,
      code,
      discountPercent,
      startDate: start,
      endDate: end,
      isActive: input.isActive ?? true,
      usageLimit: usageLimit ?? null,
      perCustomerLimit: perCustomerLimit ?? null,
      categoryId: input.categoryId ?? null,
    },
    include: { category: true },
  });
};

export const updateOffer = async (id, input) => {
  const existing = await prisma.offer.findUnique({ where: { id } });
  if (!existing) throw new AppError("Offer not found.", 404, "OFFER_NOT_FOUND");

  const code = normalizeOfferCode(input.code);
  const startDate = input.startDate ?? existing.startDate;
  const endDate = input.endDate ?? existing.endDate;
  const { start, end } = validateOfferWindow({ startDate, endDate });
  const discountPercent =
    input.discountPercent === undefined ? undefined : assertValidDiscount(input.discountPercent);
  const usageLimit = normalizeUsageLimit(input.usageLimit, "Usage limit");
  const perCustomerLimit = normalizeUsageLimit(input.perCustomerLimit, "Per-customer limit");
  assertLimitRelationship({
    usageLimit: usageLimit === undefined ? existing.usageLimit : usageLimit,
    perCustomerLimit: perCustomerLimit === undefined ? existing.perCustomerLimit : perCustomerLimit,
  });
  if (input.categoryId !== undefined) await assertCategoryExists(input.categoryId);

  if (code && code !== existing.code) {
    const duplicate = await prisma.offer.findUnique({ where: { code } });
    if (duplicate) throw new AppError("Offer code already exists.", 409, "OFFER_CODE_EXISTS");
  }

  return prisma.offer.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: sanitizeText(input.title) } : {}),
      ...(input.description !== undefined ? { description: input.description ? sanitizeText(input.description) : null } : {}),
      ...(input.code !== undefined ? { code } : {}),
      ...(discountPercent !== undefined ? { discountPercent } : {}),
      ...(input.startDate !== undefined ? { startDate: start } : {}),
      ...(input.endDate !== undefined ? { endDate: end } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(usageLimit !== undefined ? { usageLimit } : {}),
      ...(perCustomerLimit !== undefined ? { perCustomerLimit } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId ?? null } : {}),
    },
    include: { category: true },
  });
};

export const deleteOffer = async (id) => {
  await prisma.offer.delete({ where: { id } });
};

export const listAllOffers = async () =>
  prisma.offer.findMany({
    where: { code: null },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

export const listAllCoupons = async () =>
  prisma.offer.findMany({
    where: { code: { not: null } },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

export const listActiveOffers = async () => {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: { category: true },
    orderBy: { discountPercent: "desc" },
  });
  return offers.filter(isGloballyRedeemable);
};

export const findBestOfferForProduct = (offers, product) => {
  const categoryId = product?.categoryId ?? product?.category?.id ?? null;
  return (
    offers.find((offer) => offer.categoryId && offer.categoryId === categoryId) ??
    offers.find((offer) => !offer.categoryId) ??
    null
  );
};

export const getOfferPricingForVariant = ({ variant, offers, flashDeals = [] }) => {
  const originalPaise = decimalToPaise(variant.price);
  const offer = findBestOfferForProduct(offers.filter(isGloballyRedeemable), variant.product);
  
  let maxSavingsPaise = 0;
  let bestActiveDeal = null;

  if (offer) {
    maxSavingsPaise = Math.max(0, Math.round(originalPaise * (Number(offer.discountPercent) / 100)));
    bestActiveDeal = {
      id: offer.id,
      title: offer.title,
      code: offer.code,
      discountPercent: offer.discountPercent,
      endDate: offer.endDate
    };
  }

  const flashDeal = flashDeals.find(fd => fd.productId === variant.productId);
  if (flashDeal) {
    let fdSavingsPaise = 0;
    let fdDiscountPercent = 0;

    if (flashDeal.discountType === 'PERCENTAGE') {
      fdDiscountPercent = Number(flashDeal.discountValue);
      fdSavingsPaise = Math.max(0, Math.round(originalPaise * (fdDiscountPercent / 100)));
    } else if (flashDeal.discountType === 'FIXED') {
      const fixedPaise = Math.round(Number(flashDeal.discountValue) * 100);
      fdSavingsPaise = Math.min(originalPaise, fixedPaise);
      if (originalPaise > 0) fdDiscountPercent = (fdSavingsPaise / originalPaise) * 100;
    }

    if (fdSavingsPaise > maxSavingsPaise) {
      maxSavingsPaise = fdSavingsPaise;
      bestActiveDeal = {
        id: flashDeal.id,
        title: flashDeal.name,
        code: 'FLASH-DEAL',
        isFlashDeal: true,
        discountPercent: Math.min(100, Math.round(fdDiscountPercent)),
        endDate: flashDeal.endDate
      };
    }
  }

  if (maxSavingsPaise === 0) {
    return {
      unitPaise: originalPaise,
      originalUnitPaise: originalPaise,
      savingsPaise: 0,
      offer: null,
      activeOffer: null,
    };
  }

  const unitPaise = Math.max(0, originalPaise - maxSavingsPaise);

  return {
    unitPaise,
    originalUnitPaise: originalPaise,
    savingsPaise: maxSavingsPaise,
    offer: bestActiveDeal,
    activeOffer: bestActiveDeal,
  };
};

export const isOfferRedemptionAvailable = async ({ tx = prisma, offer, userId, quantity = 1 }) => {
  if (!offer) return true;

  const safeQuantity = Math.max(1, Number(quantity || 1));
  const currentOffer = await tx.offer.findUnique({
    where: { id: offer.id },
    select: {
      id: true,
      usageLimit: true,
      perCustomerLimit: true,
      redeemedCount: true,
      isActive: true,
      startDate: true,
      endDate: true,
    },
  });
  if (!currentOffer) return false;

  const now = new Date();
  if (!currentOffer.isActive || currentOffer.startDate > now || currentOffer.endDate < now) return false;
  if (currentOffer.usageLimit && currentOffer.redeemedCount + safeQuantity > currentOffer.usageLimit) return false;
  if (!currentOffer.perCustomerLimit) return true;

  const aggregate = await tx.offerRedemption.aggregate({
    where: { offerId: currentOffer.id, userId },
    _sum: { quantity: true },
  });
  const alreadyRedeemed = Number(aggregate._sum.quantity || 0);
  return alreadyRedeemed + safeQuantity <= currentOffer.perCustomerLimit;
};

export const recordOfferRedemption = async ({ tx = prisma, offer, userId, orderId, quantity = 1 }) => {
  if (!offer) return null;

  const safeQuantity = Math.max(1, Number(quantity || 1));
  const available = await isOfferRedemptionAvailable({ tx, offer, userId, quantity: safeQuantity });
  if (!available) {
    throw new AppError("Offer redemption limit reached.", 409, "OFFER_REDEMPTION_LIMIT_REACHED");
  }

  await tx.offer.update({
    where: { id: offer.id },
    data: {
      redeemedCount: {
        increment: safeQuantity,
      },
    },
  });

  return tx.offerRedemption.create({
    data: {
      offerId: offer.id,
      userId,
      orderId,
      quantity: safeQuantity,
    },
  });
};

export const serializeOfferPricing = (pricing, quantity = 1) => ({
  price: paiseToDecimalString(pricing.unitPaise),
  originalPrice: paiseToDecimalString(pricing.originalUnitPaise),
  savings: paiseToDecimalString(pricing.savingsPaise),
  lineSavings: paiseToDecimalString(pricing.savingsPaise * Math.max(1, Number(quantity || 1))),
  activeOffer: pricing.activeOffer,
});
