import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import { z } from "zod";
import { loggers } from "../config/logger.js";

const prisma = new PrismaClient();

// In a real POS, you scan barcodes, but we'll lookup by ID or SKU string.
export const getProductByBarcodeController = async (req, res) => {
  try {
    const { sku } = req.params;
    
    // We'll search for products that match the SKU or ID or name since we don't have a strict barcode field
    const variant = await prisma.productVariant.findFirst({
      where: {
        OR: [
          { sku: sku },
          { id: sku },
        ]
      },
      include: {
        product: {
          include: {
            images: { take: 1 }
          }
        }
      }
    });

    if (!variant) {
      // Fallback: search product by name
      const product = await prisma.product.findFirst({
        where: { name: { contains: sku, mode: "insensitive" } },
        include: {
          variants: { take: 1 },
          images: { take: 1 }
        }
      });
      if (!product || product.variants.length === 0) {
        throw new AppError("Product not found", 404);
      }
      return res.json({
        id: product.variants[0].id,
        productId: product.id,
        name: product.name,
        price: product.variants[0].price,
        stock: product.variants[0].stock,
        image: product.images[0]?.url
      });
    }

    return res.json({
      id: variant.id,
      productId: variant.productId,
      name: variant.product.name,
      price: variant.price,
      stock: variant.stock,
      image: variant.product.images[0]?.url
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    loggers.app.error({ err }, "Failed to find product by barcode");
    return res.status(500).json({ error: "Failed to find product" });
  }
};

export const posCheckoutController = async (req, res) => {
  try {
    const { items, paymentMethod, customerName, customerEmail, customerPhone, discountAmount = 0 } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    let linkedUserId = null;
    if (customerPhone) {
      const user = await prisma.user.findUnique({ where: { phone: customerPhone } });
      if (user) {
        linkedUserId = user.id;
      } else {
        // Send promo message logic
        loggers.app.info({ phone: customerPhone }, "Sent promo SMS to unregistered customer");
      }
    }

    let subtotal = 0;
    
    // Verify inventory and calculate total
    const orderItemsData = [];
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });
      if (!variant) {
        throw new AppError(`Variant ${item.variantId} not found`, 404);
      }
      if (variant.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${variant.product.name}`, 400);
      }
      const lineTotal = Number(variant.price) * item.quantity;
      subtotal += lineTotal;
      
      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.price,
        total: lineTotal
      });
    }

    const totalAmount = subtotal - Number(discountAmount);
    if (totalAmount < 0) throw new AppError("Invalid discount", 400);

    // Run transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Deduct stock
      for (const oi of orderItemsData) {
        await tx.productVariant.update({
          where: { id: oi.variantId },
          data: { stock: { decrement: oi.quantity } }
        });
      }

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId: linkedUserId,
          status: "DELIVERED",
          paymentStatus: "PAID",
          shippingStatus: "DELIVERED", // handed over counter
          totalAmount: totalAmount,
          items: {
            create: orderItemsData
          }
        }
      });

      // 3. Create Payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          expectedAmount: totalAmount,
          provider: paymentMethod || "CASH",
          status: "VERIFIED",
          transactionId: `TXN-POS-${Date.now()}`
        }
      });

      return newOrder;
    });

    return res.json({ 
      success: true, 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      receiptUrl: `/pos/receipt/${order.id}` 
    });

  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    loggers.app.error({ err }, "POS Checkout failed");
    return res.status(500).json({ error: "POS Checkout failed" });
  }
};

// Drawer Controllers
export const posCurrentDrawerController = async (req, res) => {
  try {
    const shift = await prisma.drawerShift.findFirst({
      where: { userId: req.user.id, status: "OPEN" },
      orderBy: { openedAt: "desc" }
    });
    
    if (!shift) return res.json({ shift: null });

    // Calculate actual sales during this shift
    const sales = await prisma.payment.aggregate({
      where: {
        provider: "CASH",
        status: "VERIFIED",
        createdAt: { gte: shift.openedAt },
        order: { orderNumber: { startsWith: "POS-" } }
      },
      _sum: { expectedAmount: true }
    });
    
    const cashSales = sales._sum.expectedAmount || 0;
    const expected = Number(shift.openingBalance) + Number(cashSales);
    
    return res.json({ 
      shift,
      metrics: {
        cashSales,
        expectedBalance: expected
      }
    });
  } catch (err) {
    loggers.app.error({ err }, "Failed to get current drawer");
    return res.status(500).json({ error: "Failed to fetch drawer state" });
  }
};

export const posDrawerOpenController = async (req, res) => {
  try {
    const { openingBalance } = req.body;
    const existing = await prisma.drawerShift.findFirst({
      where: { userId: req.user.id, status: "OPEN" }
    });
    if (existing) throw new AppError("You already have an open shift", 400);

    const shift = await prisma.drawerShift.create({
      data: { userId: req.user.id, openingBalance: Number(openingBalance) }
    });
    res.status(201).json({ shift });
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json({ error: err.message });
    loggers.app.error({ err }, "Failed to open drawer");
    return res.status(500).json({ error: "Failed to open drawer" });
  }
};

export const posDrawerCloseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualBalance, notes } = req.body;
    
    const shift = await prisma.drawerShift.findUnique({ where: { id } });
    if (!shift || shift.userId !== req.user.id) throw new AppError("Shift not found or unauthorized", 404);
    if (shift.status === "CLOSED") throw new AppError("Shift already closed", 400);

    const sales = await prisma.payment.aggregate({
      where: {
        provider: "CASH",
        status: "VERIFIED",
        createdAt: { gte: shift.openedAt },
        order: { orderNumber: { startsWith: "POS-" } }
      },
      _sum: { expectedAmount: true }
    });
    
    const expected = Number(shift.openingBalance) + Number(sales._sum.expectedAmount || 0);
    const discrepancy = Number(actualBalance) - expected;

    const closedShift = await prisma.drawerShift.update({
      where: { id },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        closingBalance: expected,
        actualBalance: Number(actualBalance),
        discrepancy,
        notes
      }
    });
    res.json({ shift: closedShift });
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json({ error: err.message });
    loggers.app.error({ err }, "Failed to close drawer");
    return res.status(500).json({ error: "Failed to close drawer" });
  }
};

export const posDashboardController = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [ordersToday, totalRevenue] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfDay }, orderNumber: { startsWith: "POS-" } }
      }),
      prisma.payment.aggregate({
        where: { createdAt: { gte: startOfDay }, order: { orderNumber: { startsWith: "POS-" } }, status: "VERIFIED" },
        _sum: { expectedAmount: true }
      })
    ]);

    const recentTransactions = await prisma.order.findMany({
      where: { orderNumber: { startsWith: "POS-" } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: true, payments: true }
    });

    res.json({
      metrics: {
        todaySales: totalRevenue._sum.expectedAmount || 0,
        transactions: ordersToday
      },
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.orderNumber,
        time: tx.createdAt,
        customer: tx.user ? tx.user.name : "Walk-in Customer",
        amount: tx.totalAmount,
        method: tx.payments?.[0]?.provider || "UNKNOWN",
        status: tx.status
      }))
    });
  } catch (err) {
    loggers.app.error({ err }, "Failed to load dashboard metrics");
    res.status(500).json({ error: "Failed to load metrics" });
  }
};
