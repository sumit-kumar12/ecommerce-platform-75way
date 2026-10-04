import crypto from "node:crypto";
import Razorpay from "razorpay";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { decimalToPaise } from "../utils/money.js";
import { addThreatEvent } from "./threat.service.js";
import { markOrderPaidAfterVerification } from "./order.service.js";
import { incrementPaymentMismatchMetric } from "../config/metrics.js";
import { assertPaymentGatewayReady, getPaymentGatewayRuntimeConfig } from "./payment-gateway-config.service.js";

const createRazorpayClient = (config) =>
  new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret,
  });

const createMockProviderOrder = ({ orderNumber, expectedAmount }) => ({
  id: `order_mock_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`,
  amount: expectedAmount,
  currency: "INR",
  receipt: orderNumber,
  payment_capture: true,
  mock: true,
});

const recalculateOrderAmount = async (orderId) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });
  if (!orderItems.length) {
    throw new AppError("Order has no items.", 400, "ORDER_EMPTY");
  }
  return orderItems.reduce((total, item) => total + decimalToPaise(item.lineTotal), 0);
};

const markPaymentVerified = async ({ payment, providerPaymentId, receivedAmount }) => {
  if (payment.status === "VERIFIED") {
    return { changed: false, payment };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "VERIFIED",
        providerPaymentId,
        receivedAmount,
        verifiedAt: new Date(),
        failureReason: null,
      },
    });

    await markOrderPaidAfterVerification({
      orderId: payment.orderId,
      providerPaymentId,
      tx,
    });
  });

  return { changed: true, payment };
};

const rejectPaymentAmountMismatch = async ({ req, payment, userId, receivedAmount, source }) => {
  incrementPaymentMismatchMetric();
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "FAILED",
      receivedAmount: Number.isInteger(receivedAmount) ? receivedAmount : null,
      failureReason: "Amount mismatch",
    },
  });

  await addThreatEvent({
    req,
    userId,
    eventType: "payment_amount_mismatch",
    details: {
      orderId: payment.orderId,
      expectedAmount: payment.expectedAmount,
      receivedAmount,
      source,
    },
  });

  throw new AppError("Payment amount mismatch.", 400, "PAYMENT_AMOUNT_MISMATCH");
};

const fetchCapturedRazorpayPayment = async ({ gatewayConfig, razorpayPaymentId, expectedAmount, razorpayOrderId }) => {
  const client = createRazorpayClient(gatewayConfig);
  let providerPayment = await client.payments.fetch(razorpayPaymentId);

  if (providerPayment.order_id !== razorpayOrderId) {
    throw new AppError("Razorpay order reference mismatch.", 400, "PAYMENT_REFERENCE_MISMATCH");
  }

  if (Number(providerPayment.amount) !== expectedAmount || providerPayment.currency !== "INR") {
    throw new AppError("Razorpay payment amount mismatch.", 400, "PAYMENT_AMOUNT_MISMATCH");
  }

  if (providerPayment.status === "authorized") {
    providerPayment = await client.payments.capture(razorpayPaymentId, expectedAmount, "INR");
  }

  if (providerPayment.status !== "captured") {
    throw new AppError("Razorpay payment has not been captured.", 409, "PAYMENT_NOT_CAPTURED", {
      providerStatus: providerPayment.status,
    });
  }

  return providerPayment;
};

export const createRazorpayOrder = async ({ orderId, userId }) => {
  const gatewayConfig = await getPaymentGatewayRuntimeConfig();
  if (gatewayConfig.mode === "live") {
    assertPaymentGatewayReady(gatewayConfig);
  }
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order || order.userId !== userId) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  if (order.paymentMethod !== "ONLINE") {
    throw new AppError("Razorpay order can only be created for ONLINE payments.", 400, "INVALID_PAYMENT_METHOD");
  }
  if (order.paymentStatus === "VERIFIED") {
    throw new AppError("Order payment is already verified.", 409, "PAYMENT_ALREADY_VERIFIED");
  }

  const expectedAmount = await recalculateOrderAmount(orderId);
  if (expectedAmount < 100) {
    throw new AppError("Order amount must be at least 1 INR (100 paise).", 400, "INVALID_AMOUNT");
  }
  const reusablePayment = await prisma.payment.findFirst({
    where: {
      orderId,
      provider: "razorpay",
      status: "PENDING",
      expectedAmount,
    },
    orderBy: { createdAt: "desc" },
  });
  if (reusablePayment) {
    return {
      providerOrder: {
        id: reusablePayment.providerOrderId,
        amount: reusablePayment.expectedAmount,
        currency: "INR",
        receipt: order.orderNumber,
        payment_capture: true,
        mock: reusablePayment.providerOrderId.startsWith("order_mock_"),
        reused: true,
      },
      gateway: {
        provider: gatewayConfig.provider,
        mode: gatewayConfig.mode,
        keyId: gatewayConfig.razorpayKeyId,
        merchantLabel: gatewayConfig.merchantLabel,
      },
    };
  }

  let providerOrder;
  try {
    providerOrder = gatewayConfig.mode === "mock"
      ? createMockProviderOrder({
          orderNumber: order.orderNumber,
          expectedAmount,
        })
      : await createRazorpayClient(gatewayConfig).orders.create({
          amount: expectedAmount,
          currency: "INR",
          receipt: order.orderNumber,
          payment_capture: true,
        });
  } catch (error) {
    if (error.statusCode === 401) {
      throw new AppError("Razorpay authentication failed. Invalid API Keys.", 401, "PAYMENT_GATEWAY_AUTH_FAILED");
    }
    throw new AppError("Failed to create Razorpay order.", 500, "PAYMENT_GATEWAY_ERROR", {
      providerError: error.message
    });
  }

  await prisma.payment.create({
    data: {
      orderId,
      provider: "razorpay",
      providerOrderId: providerOrder.id,
      expectedAmount,
      status: "PENDING",
    },
  });

  loggers.payment.info({
    eventType: "razorpay_order_created",
    userId,
    details: {
      orderId,
      providerOrderId: providerOrder.id,
      expectedAmount,
    },
  });

  return {
    providerOrder,
    gateway: {
      provider: gatewayConfig.provider,
      mode: gatewayConfig.mode,
      keyId: gatewayConfig.razorpayKeyId,
      merchantLabel: gatewayConfig.merchantLabel,
    },
  };
};

export const completeMockRazorpayPayment = async ({ req, orderId, userId }) => {
  const gatewayConfig = await getPaymentGatewayRuntimeConfig();
  if (gatewayConfig.mode !== "mock") {
    throw new AppError("Mock payment completion is not available.", 404, "PAYMENT_NOT_FOUND");
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  if (order.paymentMethod !== "ONLINE") {
    throw new AppError("Mock payment completion only applies to ONLINE orders.", 400, "INVALID_PAYMENT_METHOD");
  }

  const payment = await prisma.payment.findFirst({
    where: {
      orderId,
      provider: "razorpay",
      providerOrderId: {
        startsWith: "order_mock_",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!payment) {
    throw new AppError("Payment reference not found.", 404, "PAYMENT_NOT_FOUND");
  }

  if (payment.status === "VERIFIED" && order.paymentStatus === "VERIFIED") {
    return {
      orderId,
      paymentId: payment.id,
      providerPaymentId: payment.providerPaymentId,
    };
  }

  const expectedAmount = await recalculateOrderAmount(orderId);

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      verificationAttempts: {
        increment: 1,
      },
    },
  });

  if (payment.expectedAmount !== expectedAmount) {
    incrementPaymentMismatchMetric();
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        receivedAmount: expectedAmount,
        failureReason: "Mock payment amount mismatch",
      },
    });

    await addThreatEvent({
      req,
      userId,
      eventType: "payment_amount_mismatch",
      details: {
        orderId,
        expectedAmount,
        receivedAmount: expectedAmount,
        source: "mock_razorpay_completion",
      },
    });

    throw new AppError("Payment amount mismatch.", 400, "PAYMENT_AMOUNT_MISMATCH");
  }

  const providerPaymentId = `pay_mock_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
  const signature = `mock_signature_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "VERIFIED",
        providerPaymentId,
        signature,
        receivedAmount: expectedAmount,
        verifiedAt: new Date(),
        failureReason: null,
      },
    });

    await markOrderPaidAfterVerification({
      orderId,
      providerPaymentId,
      tx,
    });
  });

  loggers.payment.info({
    eventType: "mock_payment_verified",
    userId,
    details: {
      orderId,
      paymentId: payment.id,
      providerPaymentId,
      amount: expectedAmount,
    },
  });

  return {
    orderId,
    paymentId: payment.id,
    providerPaymentId,
  };
};

export const verifyRazorpaySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, razorpayKeySecret }) => {
  const secret = razorpayKeySecret;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(razorpaySignature ?? ""));
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

export const verifyRazorpayWebhookSignature = ({ rawBody, signature, webhookSecret }) => {
  if (!rawBody || !signature || !webhookSecret) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(signature));
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

export const verifyRazorpayPayment = async ({
  req,
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  userId,
}) => {
  const gatewayConfig = await getPaymentGatewayRuntimeConfig();
  assertPaymentGatewayReady(gatewayConfig);
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");

  const payment = await prisma.payment.findUnique({
    where: {
      provider_providerOrderId: {
        provider: "razorpay",
        providerOrderId: razorpayOrderId,
      },
    },
  });
  if (!payment || payment.orderId !== orderId) {
    throw new AppError("Payment reference not found.", 404, "PAYMENT_NOT_FOUND");
  }
  if (payment.status === "VERIFIED" && payment.providerPaymentId === razorpayPaymentId) {
    return { changed: false, orderId, paymentId: payment.id };
  }

  const expectedAmount = await recalculateOrderAmount(orderId);

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      verificationAttempts: {
        increment: 1,
      },
    },
  });

  loggers.payment.info({
    eventType: "payment_verification_attempt",
    userId,
    details: {
      paymentId: payment.id,
      orderId,
      razorpayOrderId,
      expectedAmount,
    },
  });

  if (expectedAmount !== payment.expectedAmount) {
    return rejectPaymentAmountMismatch({
      req,
      payment,
      userId,
      receivedAmount: expectedAmount,
      source: "order_recalculation",
    });
  }

  const signatureValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    razorpayKeySecret: gatewayConfig.razorpayKeySecret,
  });
  if (!signatureValid) {
    await addThreatEvent({
      req,
      userId,
      eventType: "invalid_payment_signature",
      details: { orderId, razorpayOrderId, razorpayPaymentId },
    });
    throw new AppError("Payment signature verification failed.", 400, "INVALID_PAYMENT_SIGNATURE");
  }

  let providerPayment;
  try {
    providerPayment = await fetchCapturedRazorpayPayment({
      gatewayConfig,
      razorpayPaymentId,
      expectedAmount,
      razorpayOrderId,
    });
  } catch (error) {
    if (error.code === "PAYMENT_AMOUNT_MISMATCH") {
      return rejectPaymentAmountMismatch({
        req,
        payment,
        userId,
        receivedAmount: null,
        source: "razorpay_api",
      });
    }
    throw error;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { signature: razorpaySignature },
  });
  const result = await markPaymentVerified({
    payment,
    providerPaymentId: providerPayment.id,
    receivedAmount: Number(providerPayment.amount),
  });
  loggers.payment.info({
    eventType: "payment_verified",
    userId,
    details: { orderId, paymentId: payment.id, razorpayPaymentId, amount: providerPayment.amount },
  });
  return { ...result, orderId, paymentId: payment.id };
};

export const recordRazorpayClientFailure = async ({ orderId, userId, reason }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  if (order.paymentStatus === "VERIFIED") {
    return { status: "VERIFIED", orderId };
  }

  const payment = await prisma.payment.findFirst({
    where: { orderId, provider: "razorpay" },
    orderBy: { createdAt: "desc" },
  });
  if (!payment) throw new AppError("Payment reference not found.", 404, "PAYMENT_NOT_FOUND");

  if (payment.status === "PENDING") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failureReason: reason === "dismissed" ? "Customer closed Razorpay checkout" : "Razorpay checkout reported failure",
      },
    });
  }

  loggers.payment.warn({
    eventType: "razorpay_client_payment_incomplete",
    userId,
    details: { orderId, paymentId: payment.id, reason },
  });
  return { status: reason === "dismissed" ? "CANCELLED" : "FAILED", orderId };
};

export const getRazorpayPaymentStatus = async ({ orderId, userId }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  const payment = await prisma.payment.findFirst({
    where: { orderId, provider: "razorpay" },
    orderBy: { createdAt: "desc" },
  });
  return {
    orderId,
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
    payment: payment
      ? {
          id: payment.id,
          status: payment.status,
          failureReason: payment.failureReason,
          providerPaymentId: payment.providerPaymentId,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        }
      : null,
  };
};

export const processRazorpayWebhook = async ({ req, rawBody, signature, payload }) => {
  const gatewayConfig = await getPaymentGatewayRuntimeConfig();
  if (!verifyRazorpayWebhookSignature({
    rawBody,
    signature,
    webhookSecret: gatewayConfig.razorpayWebhookSecret,
  })) {
    throw new AppError("Invalid Razorpay webhook signature.", 400, "INVALID_RAZORPAY_WEBHOOK_SIGNATURE");
  }

  const eventType = String(payload?.event ?? "");
  const providerPayment = payload?.payload?.payment?.entity;
  const providerRefund = payload?.payload?.refund?.entity;

  if (eventType === "payment.captured" && providerPayment?.order_id) {
    const payment = await prisma.payment.findUnique({
      where: {
        provider_providerOrderId: {
          provider: "razorpay",
          providerOrderId: providerPayment.order_id,
        },
      },
    });
    if (!payment) return { handled: false, eventType };

    const receivedAmount = Number(providerPayment.amount);
    if (receivedAmount !== payment.expectedAmount || providerPayment.currency !== "INR") {
      await rejectPaymentAmountMismatch({
        req,
        payment,
        userId: null,
        receivedAmount,
        source: "razorpay_webhook",
      });
    }

    const result = await markPaymentVerified({
      payment,
      providerPaymentId: providerPayment.id,
      receivedAmount,
    });
    return { handled: true, changed: result.changed, eventType, orderId: payment.orderId };
  }

  if (eventType === "payment.failed" && providerPayment?.order_id) {
    const payment = await prisma.payment.findUnique({
      where: {
        provider_providerOrderId: {
          provider: "razorpay",
          providerOrderId: providerPayment.order_id,
        },
      },
    });
    if (!payment) return { handled: false, eventType };
    const result = await prisma.payment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: {
        status: "FAILED",
        providerPaymentId: providerPayment.id ?? null,
        receivedAmount: Number.isInteger(Number(providerPayment.amount)) ? Number(providerPayment.amount) : null,
        failureReason: providerPayment.error_description || providerPayment.error_reason || "Razorpay payment failed",
      },
    });
    return { handled: true, changed: result.count === 1, eventType, orderId: payment.orderId };
  }

  if (eventType === "refund.processed" && providerRefund?.payment_id) {
    const payment = await prisma.payment.findFirst({
      where: { provider: "razorpay", providerPaymentId: providerRefund.payment_id },
    });
    if (!payment) return { handled: false, eventType };
    const refundAmount = Number(providerRefund.amount);
    if (refundAmount >= payment.expectedAmount && payment.status === "VERIFIED") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "REFUNDED", failureReason: null },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "REFUNDED", status: "CANCELLED" },
        }),
      ]);
      return { handled: true, changed: true, eventType, orderId: payment.orderId };
    }
    return { handled: true, changed: false, eventType, orderId: payment.orderId };
  }

  return { handled: false, changed: false, eventType };
};
