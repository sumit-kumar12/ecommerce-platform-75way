import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

export const createReturnRequest = async ({ userId, orderId, items, reason, notes }) => {
  // Verify order exists and belongs to user
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new AppError("Order not found or unauthorized", 404, "ORDER_NOT_FOUND");
  }

  // Create the return request
  const returnRequest = await prisma.returnRequest.create({
    data: {
      userId,
      orderId,
      reason,
      notes,
      items: {
        create: items.map(item => {
          const orderItem = order.items.find(oi => oi.id === item.orderItemId);
          if (!orderItem) throw new AppError("Invalid order item", 400, "INVALID_ORDER_ITEM");
          if (item.quantity > orderItem.quantity) {
             throw new AppError("Return quantity exceeds ordered quantity", 400, "INVALID_QUANTITY");
          }
          return {
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            reason: item.reason || reason,
          };
        }),
      },
    },
    include: {
      items: true,
    },
  });

  return returnRequest;
};

export const getUserReturns = async (userId) => {
  return prisma.returnRequest.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          orderItem: {
            include: {
              product: true,
              variant: true,
            }
          }
        }
      },
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllReturns = async () => {
  return prisma.returnRequest.findMany({
    include: {
      items: {
        include: {
          orderItem: {
            include: {
              product: true,
              variant: true,
            }
          }
        }
      },
      order: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateReturnStatus = async (id, status) => {
  const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "REFUNDED"];
  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid status", 400, "INVALID_STATUS");
  }

  return prisma.returnRequest.update({
    where: { id },
    data: { status },
  });
};
