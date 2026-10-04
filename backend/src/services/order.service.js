import { randomUUID } from "node:crypto";
import { prisma } from "../config/prisma.js";
import { isFullAdminRole, ORDER_STATUS } from "../config/constants.js";
import { AppError } from "../errors/app-error.js";
import { decimalToPaise, paiseToDecimalString } from "../utils/money.js";
import { sanitizeContent, sanitizeText } from "../utils/sanitize.js";
import { enforceGlobalPaymentPolicy } from "./payment-policy.service.js";
import {
  getOfferPricingForVariant,
  isOfferRedemptionAvailable,
  listActiveOffers,
  recordOfferRedemption,
} from "./offer.service.js";
import { listActiveFlashDeals } from "./flash-deal.service.js";
import { sendOrderConfirmation, sendOrderShipped } from "./notification.service.js";

const nextOrderNumber = () => {
  const date = new Date();
  const yyyymmdd = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
  return `ORD-${yyyymmdd}-${randomUUID().slice(0, 8).toUpperCase()}`;
};

const paymentMethodToEnum = (method) => {
  if (method === "ONLINE") return "ONLINE";
  if (method === "COD") return "COD";
  throw new AppError("Invalid payment method.", 400, "INVALID_PAYMENT_METHOD");
};

const validatePaymentRulesForItem = ({ item, paymentMethod, globalPolicy, unitPaise }) => {
  const product = item.variant.product;
  if (paymentMethod === "ONLINE") return;

  if (globalPolicy.onlineOnly || !globalPolicy.allowCOD) {
    throw new AppError("COD is disabled by global policy.", 400, "GLOBAL_PAYMENT_POLICY_BLOCK");
  }

  if (product.isDigital && globalPolicy.forceDigitalOnline) {
    throw new AppError(
      `Digital product ${product.name} requires ONLINE payment by global policy.`,
      400,
      "GLOBAL_PAYMENT_POLICY_BLOCK",
      { productId: product.id },
    );
  }

  if (product.isDigital || product.paymentOnlineOnly || !product.paymentAllowCOD) {
    throw new AppError(
      `COD is not allowed for product ${product.name}.`,
      400,
      "PAYMENT_RULE_VIOLATION",
      { productId: product.id },
    );
  }

  const productMinPaise = product.paymentMinCODPrice ? decimalToPaise(product.paymentMinCODPrice) : 0;
  const globalMinPaise = globalPolicy.minCODPrice ? decimalToPaise(globalPolicy.minCODPrice) : 0;
  const effectiveMinPaise = Math.max(productMinPaise, globalMinPaise);

  if (effectiveMinPaise > 0) {
    const linePaise = unitPaise * item.quantity;
    if (linePaise < effectiveMinPaise) {
      throw new AppError(
        `COD minimum price not met for product ${product.name}.`,
        400,
        "PAYMENT_RULE_VIOLATION",
        {
          productId: product.id,
          minCODPrice: product.paymentMinCODPrice,
          globalMinCODPrice: globalPolicy.minCODPrice,
          effectiveMinPaise,
        },
      );
    }
  }
};

const getEligiblePricingForItem = async ({ item, offers, flashDeals, userId }) => {
  let remainingOffers = offers;
  while (remainingOffers.length > 0) {
    const pricing = getOfferPricingForVariant({ variant: item.variant, offers: remainingOffers, flashDeals });
    if (!pricing.offer) return pricing;

    const offerAvailable = pricing.offer.code === 'FLASH-DEAL' ? true : await isOfferRedemptionAvailable({
      offerId: pricing.offer.id,
      userId,
      quantity: item.quantity,
    });
    if (offerAvailable) return pricing;

    remainingOffers = remainingOffers.filter((offer) => offer.id !== pricing.offer.id);
  }

  return getOfferPricingForVariant({ variant: item.variant, offers: [], flashDeals: [] });
};

export const createOrderFromCart = async ({ userId, paymentMethod, shippingAddress, notes }) => {
  const method = paymentMethodToEnum(paymentMethod);
  const globalPolicy = await enforceGlobalPaymentPolicy({ isDigital: false, paymentMethod: method });
  const activeOffers = await listActiveOffers();
  const activeFlashDeals = await listActiveFlashDeals().catch(() => []);
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { include: { images: true } },
            },
          },
        },
      },
      offer: true,
    },
  });
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty.", 400, "CART_EMPTY");
  }

  const pricingByVariantId = new Map();
  let subtotalPaise = 0;
  for (const item of cart.items) {
    const variant = item.variant;
    if (!variant.isActive || !variant.product.isActive) {
      throw new AppError("Cart contains unavailable items.", 400, "ITEM_UNAVAILABLE");
    }
    if (variant.stock < item.quantity) {
      throw new AppError("Cart contains insufficient stock items.", 400, "INSUFFICIENT_STOCK");
    }
    const pricing = await getEligiblePricingForItem({ item, offers: activeOffers, flashDeals: activeFlashDeals, userId });
    pricingByVariantId.set(item.variantId, pricing);
    validatePaymentRulesForItem({ item, paymentMethod: method, globalPolicy, unitPaise: pricing.unitPaise });
    subtotalPaise += pricing.unitPaise * item.quantity;
  }

  let shippingFeePaise = 0;
  for (const item of cart.items) {
    const productShipping = Number(item.variant.product.shippingPrice) || 0;
    shippingFeePaise += Math.round(productShipping * 100) * item.quantity;
  }

  const shippingSettings = await prisma.shippingSettings.findUnique({ where: { id: "singleton" } });
  if (shippingSettings?.freeShippingThreshold && (subtotalPaise / 100) >= Number(shippingSettings.freeShippingThreshold)) {
    shippingFeePaise = 0;
  }

  let couponDiscountPaise = 0;
  if (cart.offer && cart.offer.isActive && cart.offer.discountPercent) {
    couponDiscountPaise = Math.round(subtotalPaise * (cart.offer.discountPercent / 100));
  }

  const activeOutlets = await prisma.outlet.findMany({
    where: { isActive: true },
    include: { inventories: true }
  });

  let assignedOutletId = null;
  for (const outlet of activeOutlets) {
    let canFulfill = true;
    for (const item of cart.items) {
      const inventory = outlet.inventories.find(inv => inv.variantId === item.variantId);
      if (!inventory || inventory.stock < item.quantity) {
        canFulfill = false;
        break;
      }
    }
    if (canFulfill) {
      assignedOutletId = outlet.id;
      break;
    }
  }

  const orderNumber = nextOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        outletId: assignedOutletId,
        paymentMethod: method,
        status: method === "COD" ? ORDER_STATUS.PROCESSING : ORDER_STATUS.PENDING_PAYMENT,
        paymentStatus: "PENDING",
        subtotal: paiseToDecimalString(subtotalPaise),
        shippingFee: paiseToDecimalString(shippingFeePaise),
        couponDiscount: paiseToDecimalString(couponDiscountPaise),
        totalAmount: paiseToDecimalString(subtotalPaise + shippingFeePaise - couponDiscountPaise),
        offerId: cart.offer?.id || null,
        shippingAddress: sanitizeContent(shippingAddress),
        notes: notes ? sanitizeText(notes) : null,
      },
    });

    for (const cartItem of cart.items) {
      const pricing = pricingByVariantId.get(cartItem.variantId) ?? getOfferPricingForVariant({ variant: cartItem.variant, offers: activeOffers, flashDeals: activeFlashDeals });
      const unitPaise = pricing.unitPaise;
      const linePaise = unitPaise * cartItem.quantity;

      const stockUpdate = await tx.productVariant.updateMany({
        where: {
          id: cartItem.variantId,
          stock: {
            gte: cartItem.quantity,
          },
        },
        data: {
          stock: {
            decrement: cartItem.quantity,
          },
        },
      });
      if (stockUpdate.count !== 1) {
        throw new AppError("Insufficient stock while processing order.", 409, "INSUFFICIENT_STOCK");
      }

      if (assignedOutletId) {
        await tx.outletInventory.update({
          where: { outletId_variantId: { outletId: assignedOutletId, variantId: cartItem.variantId } },
          data: { stock: { decrement: cartItem.quantity } }
        });
      }

      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productId: cartItem.variant.productId,
          variantId: cartItem.variantId,
          listerId: cartItem.variant.product.listerId,
          quantity: cartItem.quantity,
          unitPrice: paiseToDecimalString(unitPaise),
          lineTotal: paiseToDecimalString(linePaise),
          originalUnitPrice: paiseToDecimalString(pricing.originalUnitPaise),
          lineSavings: paiseToDecimalString(pricing.savingsPaise * cartItem.quantity),
          appliedOffer: pricing.activeOffer,
        },
      });

      if (pricing.offer) {
        if (pricing.offer.isFlashDeal) {
          await tx.flashDeal.update({
            where: { id: pricing.offer.id },
            data: {
              soldQuantity: { increment: cartItem.quantity },
              revenueGenerated: { increment: linePaise / 100 }
            }
          });
        } else {
          await recordOfferRedemption({
            tx,
            offer: pricing.offer,
            userId,
            orderId: createdOrder.id,
            quantity: cartItem.quantity,
          });
        }
      }
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return createdOrder;
  });

  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
          lister: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      outlet: true,
    },
  });

  if (method === "COD") {
    sendOrderConfirmation(fullOrder).catch(console.error);
  }

  return fullOrder;
};

export const listOrdersForUser = async (userId, cursor = null, limit = 20) => {
  const take = limit + 1;
  const orders = await prisma.order.findMany({
    where: { userId },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
          lister: { select: { id: true, name: true } },
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  let nextCursor = null;
  if (orders.length > limit) {
    const nextItem = orders.pop();
    nextCursor = nextItem.id;
  }
  return { orders, nextCursor };
};

export const getOrderForUser = async ({ orderId, userId }) => {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      OR: [
        { id: orderId },
        { orderNumber: orderId }
      ]
    },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
          lister: { select: { id: true, name: true } },
        },
      },
      payments: true,
    },
  });
  if (!order || order.userId !== userId) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  return order;
};

export const markOrderPaidAfterVerification = async ({ orderId, providerPaymentId, tx = prisma }) => {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  if (!order) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  if (order.paymentStatus === "VERIFIED") return order;

  // Attribute revenue to SponsoredAds
  try {
    for (const item of order.items) {
      const activeAd = await tx.sponsoredAd.findFirst({
        where: {
          productId: item.productId,
          status: "active",
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      });
      if (activeAd) {
        await tx.sponsoredAd.update({
          where: { id: activeAd.id },
          data: {
            revenue: { increment: item.lineTotal }
          }
        });
      }
    }
  } catch (err) {
    // Log error but don't fail the payment verification flow
    console.error("Failed to attribute sponsored ad revenue:", err);
  }

  const updatedOrder = await tx.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "VERIFIED",
      status: ORDER_STATUS.PAID,
      paidAt: new Date(),
      notes: order.notes
        ? `${order.notes}\nPayment verified with provider payment id ${providerPaymentId}.`
        : `Payment verified with provider payment id ${providerPaymentId}.`,
    },
  });

  const orderWithUser = await tx.order.findUnique({ where: { id: orderId }, include: { user: true } });
  if (orderWithUser) {
    sendOrderConfirmation(orderWithUser).catch(console.error);
  }

  return updatedOrder;
};

export const updateOrderStatus = async ({ orderId, actor, status }) => {
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new AppError("Invalid order status.", 400, "INVALID_ORDER_STATUS");
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: orderId },
        { orderNumber: orderId }
      ]
    },
    include: { items: true },
  });
  if (!order) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");

  if (status === ORDER_STATUS.PAID && order.paymentStatus !== "VERIFIED") {
    throw new AppError(
      "Order cannot be marked as PAID before verified payment.",
      400,
      "PAYMENT_VERIFICATION_REQUIRED",
    );
  }

  if (actor.role === "PRODUCT_LISTER") {
    const canManage = order.items.every((item) => item.listerId === actor.id);
    if (!canManage) {
      throw new AppError("Forbidden.", 403, "FORBIDDEN_ORDER_OWNERSHIP");
    }
  } else if (!isFullAdminRole(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status },
    include: { user: true }
  });

  if (status === ORDER_STATUS.SHIPPED && order.status !== ORDER_STATUS.SHIPPED) {
    sendOrderShipped(updatedOrder).catch(console.error);
  }

  return updatedOrder;
};

export const releaseExpiredReservations = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: ORDER_STATUS.PENDING_PAYMENT,
      createdAt: { lt: thirtyMinutesAgo },
    },
    include: { items: true },
  });

  if (expiredOrders.length === 0) return 0;

  let releasedCount = 0;

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: ORDER_STATUS.CANCELLED,
            notes: (order.notes ? order.notes + "\n" : "") + "Order automatically cancelled due to payment timeout. Stock released.",
          },
        });
      });
      releasedCount++;
    } catch (error) {
      console.error(`Failed to release reservations for order ${order.id}:`, error);
    }
  }

  return releasedCount;
};

