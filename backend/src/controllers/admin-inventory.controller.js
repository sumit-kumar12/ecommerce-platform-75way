import { z } from "zod";
import { prisma } from "../config/prisma.js";

export const adminInventoryStatsController = async (req, res) => {
  const variants = await prisma.productVariant.findMany({
    select: { 
      stock: true, 
      price: true,
      orderItems: {
        where: { order: { status: { in: ['PENDING_PAYMENT', 'PAID', 'PROCESSING'] } } },
        select: { quantity: true }
      }
    }
  });

  let totalStock = 0;
  let stockValue = 0;
  let lowStock = 0;
  let outOfStock = 0;

  variants.forEach(v => {
    const reserved = v.orderItems ? v.orderItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
    const available = v.stock - reserved;

    totalStock += v.stock; // Usually Total Stock implies physical on-hand stock
    stockValue += v.stock * Number(v.price);
    
    if (available <= 0) outOfStock++;
    else if (available <= 10) lowStock++;
  });

  // Calculate items sold this month and last month
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [soldThisMonthAgg, soldLastMonthAgg] = await Promise.all([
    prisma.orderItem.aggregate({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        order: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } }
      },
      _sum: { quantity: true }
    }),
    prisma.orderItem.aggregate({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        order: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } }
      },
      _sum: { quantity: true }
    })
  ]);

  const soldThisMonth = soldThisMonthAgg._sum.quantity || 0;
  const soldLastMonth = soldLastMonthAgg._sum.quantity || 0;

  const calculateTrend = (current, previous) => {
    if (Number(previous) === 0) return current > 0 ? 100 : 0;
    return ((current - Number(previous)) / Number(previous)) * 100;
  };
  const formatTrend = (val) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

  const soldTrend = calculateTrend(soldThisMonth, soldLastMonth);

  // Take today's snapshot using Raw SQL (to avoid needing prisma generate)
  const todayStr = now.toISOString().split('T')[0] + " 00:00:00.000Z";
  
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "InventorySnapshot" ("id", "snapshotDate", "totalStock", "stockValue", "lowStock", "outOfStock", "createdAt")
      VALUES (gen_random_uuid(), $1::date, $2, $3, $4, $5, NOW())
      ON CONFLICT ("snapshotDate") DO UPDATE SET
        "totalStock" = EXCLUDED."totalStock",
        "stockValue" = EXCLUDED."stockValue",
        "lowStock" = EXCLUDED."lowStock",
        "outOfStock" = EXCLUDED."outOfStock"
    `, todayStr, totalStock, stockValue, lowStock, outOfStock);
  } catch (err) {
    console.error("Failed to insert inventory snapshot:", err);
  }

  // Fetch oldest snapshot up to 30 days ago
  const pastSnapshots = await prisma.$queryRawUnsafe(`
    SELECT "totalStock", "stockValue", "lowStock", "outOfStock"
    FROM "InventorySnapshot"
    WHERE "snapshotDate" <= $1::date
    ORDER BY "snapshotDate" DESC
    LIMIT 1
  `, thirtyDaysAgo.toISOString().split('T')[0] + " 00:00:00.000Z");

  const oldestSnapshots = await prisma.$queryRawUnsafe(`
    SELECT "totalStock", "stockValue", "lowStock", "outOfStock"
    FROM "InventorySnapshot"
    ORDER BY "snapshotDate" ASC
    LIMIT 1
  `);

  const compareSnapshot = (pastSnapshots && pastSnapshots.length > 0) ? pastSnapshots[0] : (oldestSnapshots && oldestSnapshots.length > 0 ? oldestSnapshots[0] : null);

  let totalStockTrend = 0, stockValueTrend = 0, lowStockTrend = 0, outOfStockTrend = 0;
  
  if (compareSnapshot) {
    totalStockTrend = calculateTrend(totalStock, compareSnapshot.totalStock);
    stockValueTrend = calculateTrend(stockValue, compareSnapshot.stockValue);
    lowStockTrend = calculateTrend(lowStock, compareSnapshot.lowStock);
    outOfStockTrend = calculateTrend(outOfStock, compareSnapshot.outOfStock);
  }

  res.status(200).json({
    kpis: {
      totalStock: { value: totalStock, trend: formatTrend(totalStockTrend), trendUp: totalStockTrend >= 0 },
      stockValue: { value: stockValue, trend: formatTrend(stockValueTrend), trendUp: stockValueTrend >= 0 },
      lowStock: { value: lowStock, trend: formatTrend(lowStockTrend), trendUp: lowStockTrend <= 0 },
      outOfStock: { value: outOfStock, trend: formatTrend(outOfStockTrend), trendUp: outOfStockTrend <= 0 },
      itemsSold: { value: soldThisMonth, trend: formatTrend(soldTrend), trendUp: soldTrend >= 0 }
    }
  });
};

export const adminInventoryListController = async (req, res) => {
  const query = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(1000).default(50),
    search: z.string().optional(),
    status: z.string().optional(),
  }).parse(req.query);

  const where = {
    ...(query.search ? {
      OR: [
        { sku: { contains: query.search, mode: "insensitive" } },
        { product: { name: { contains: query.search, mode: "insensitive" } } },
      ]
    } : {})
  };

  const [total, variants] = await Promise.all([
    prisma.productVariant.count({ where }),
    prisma.productVariant.findMany({
      where,
      include: {
        product: { select: { name: true } },
        orderItems: {
          where: { order: { status: { in: ['PENDING_PAYMENT', 'PAID', 'PROCESSING'] } } },
          select: { quantity: true }
        }
      },
      orderBy: { stock: 'asc' }, // Show lowest stock first by default
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    })
  ]);

  const items = variants.map(v => {
    const reserved = v.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const available = v.stock - reserved;
    
    let status = 'In Stock';
    if (available <= 0) status = 'Out of Stock';
    else if (available <= 10) status = 'Low Stock';

    return {
      id: v.sku, // For frontend tracking
      sku: v.sku,
      productId: v.productId,
      product: v.product?.name + (v.title !== "Default" ? ` - ${v.title}` : ""),
      stock: v.stock,
      reserved,
      available,
      status,
      price: v.price
    };
  });

  // Simple client-side filtering since status depends on calculated available stock
  let filteredItems = items;
  if (query.status && query.status !== "All") {
    filteredItems = items.filter(i => i.status === query.status);
  }

  res.status(200).json({
    total,
    items: filteredItems
  });
};

export const adminInventoryUpdateController = async (req, res) => {
  const { sku } = z.object({ sku: z.string() }).parse(req.params);
  const { stock } = z.object({ stock: z.number().int().min(0) }).parse(req.body);

  const variant = await prisma.productVariant.findUnique({
    where: { sku }
  });

  if (!variant) {
    res.status(404).json({ error: "Variant not found" });
    return;
  }

  await prisma.productVariant.update({
    where: { sku },
    data: { stock }
  });

  res.status(200).json({ success: true, message: "Stock updated successfully" });
};
