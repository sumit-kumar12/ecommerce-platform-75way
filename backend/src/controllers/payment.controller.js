import { z } from "zod";
import { prisma } from "../config/prisma.js";
import {
  completeMockRazorpayPayment,
  createRazorpayOrder,
  getRazorpayPaymentStatus,
  processRazorpayWebhook,
  recordRazorpayClientFailure,
  verifyRazorpayPayment,
} from "../services/payment.service.js";
import { notifyOrderEvent } from "../services/notification.service.js";

const verifySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(10),
  razorpayPaymentId: z.string().min(10),
  razorpaySignature: z.string().min(10),
});
const orderParamSchema = z.object({
  orderId: z.string().min(1),
});
const clientFailureSchema = z.object({
  reason: z.enum(["dismissed", "provider_failed"]),
});

// AUDIT B2 — Payment total is NOT read from req.body.
// Amount is derived server-side in createRazorpayOrder() from the DB Order record.
// The client supplies only the orderId (from the URL param); the Razorpay order
// amount is always computed from Order.totalAmount stored at order-creation time.
export const createRazorpayOrderController = async (req, res) => {
  const params = orderParamSchema.parse(req.params);
  const paymentSession = await createRazorpayOrder({
    orderId: params.orderId,
    userId: req.user.id,
  });
  res.status(201).json(paymentSession);
};

export const verifyPaymentController = async (req, res) => {
  const input = verifySchema.parse(req.body);
  const result = await verifyRazorpayPayment({
    req,
    orderId: input.orderId,
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
    userId: req.user.id,
  });

  if (result.changed) {
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      include: { items: true },
    });
    await notifyOrderEvent({
      order,
      eventType: "PAYMENT_VERIFIED",
    });
  }

  res.status(200).json({
    status: "verified",
    orderId: input.orderId,
  });
};

export const completeMockPaymentController = async (req, res) => {
  const params = orderParamSchema.parse(req.params);
  const result = await completeMockRazorpayPayment({
    req,
    orderId: params.orderId,
    userId: req.user.id,
  });

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  });
  await notifyOrderEvent({
    order,
    eventType: "PAYMENT_VERIFIED",
  });

  res.status(200).json({
    status: "verified",
    mode: "mock",
    orderId: result.orderId,
    paymentId: result.paymentId,
  });
};

export const recordPaymentClientFailureController = async (req, res) => {
  const params = orderParamSchema.parse(req.params);
  const input = clientFailureSchema.parse(req.body);
  const result = await recordRazorpayClientFailure({
    orderId: params.orderId,
    userId: req.user.id,
    reason: input.reason,
  });
  res.status(200).json(result);
};

export const getPaymentStatusController = async (req, res) => {
  const params = orderParamSchema.parse(req.params);
  const result = await getRazorpayPaymentStatus({
    orderId: params.orderId,
    userId: req.user.id,
  });
  res.status(200).json(result);
};

export const razorpayWebhookController = async (req, res) => {
  const result = await processRazorpayWebhook({
    req,
    rawBody: req.rawBody,
    signature: req.get("x-razorpay-signature"),
    payload: req.body,
  });

  if (result.changed && result.orderId) {
    const order = await prisma.order.findUnique({
      where: { id: result.orderId },
      include: { items: true },
    });
    if (order) {
      const notificationEventType =
        result.eventType === "refund.processed"
          ? "PAYMENT_REFUNDED"
          : result.eventType === "payment.failed"
            ? "PAYMENT_FAILED"
            : "PAYMENT_VERIFIED";
      await notifyOrderEvent({
        order,
        eventType: notificationEventType,
      });
    }
  }

  res.status(200).json({ received: true, handled: result.handled });
};
