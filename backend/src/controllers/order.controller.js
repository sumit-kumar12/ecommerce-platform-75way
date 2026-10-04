import { z } from "zod";
import {
  createOrderFromCart,
  getOrderForUser,
  listOrdersForUser,
  updateOrderStatus,
} from "../services/order.service.js";
import { notifyOrderEvent } from "../services/notification.service.js";

const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(120),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(15),
  country: z.string().min(2).max(80),
  phone: z.string().regex(/^\+\d{10,15}$/),
});

const createOrderSchema = z.object({
  paymentMethod: z.enum(["ONLINE", "COD"]),
  shippingAddress: shippingAddressSchema,
  notes: z.string().max(500).optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});
const orderParamSchema = z.object({
  orderId: z.string().min(1),
});

export const createOrderController = async (req, res) => {
  const input = createOrderSchema.parse(req.body);
  const order = await createOrderFromCart({
    userId: req.user.id,
    paymentMethod: input.paymentMethod,
    shippingAddress: input.shippingAddress,
    notes: input.notes,
  });
  await notifyOrderEvent({ order, eventType: "ORDER_CREATED" });
  res.status(201).json({ order });
};

export const listMyOrdersController = async (req, res) => {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
  const cursor = req.query.cursor || null;
  const result = await listOrdersForUser(req.user.id, cursor, limit);
  res.status(200).json(result);
};

export const getMyOrderController = async (req, res) => {
  const params = orderParamSchema.parse(req.params);
  const order = await getOrderForUser({
    orderId: params.orderId,
    userId: req.user.id,
  });
  res.status(200).json({ order });
};

export const updateOrderStatusController = async (req, res) => {
  const params = orderParamSchema.parse(req.params);
  const input = updateOrderStatusSchema.parse(req.body);
  const order = await updateOrderStatus({
    orderId: params.orderId,
    actor: req.user,
    status: input.status,
  });
  await notifyOrderEvent({ order, eventType: `ORDER_STATUS_${input.status}` });
  res.status(200).json({ order });
};
