import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { assertAllowedMediaUrl } from "../utils/security-patterns.js";

const saveFile = async (base64String, fileName) => {
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const buffer = Buffer.from(matches[2], "base64");
  const ext = path.extname(fileName) || ".png";
  const uniqueName = `${crypto.randomBytes(16).toString("hex")}${ext}`;
  const dirPath = path.join(process.cwd(), "public", "campaigns");

  await fs.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, uniqueName);
  await fs.writeFile(filePath, buffer);

  return `/campaigns/${uniqueName}`;
};

export const createFlashDeal = async ({ input, actor }) => {
  const { mediaBase64, mediaName, productId, ...rest } = input;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  let mediaUrl = input.mediaUrl || null;
  if (mediaUrl) assertAllowedMediaUrl(mediaUrl);
  if (mediaBase64 && mediaName) {
    mediaUrl = await saveFile(mediaBase64, mediaName);
  }

  const deal = await prisma.flashDeal.create({
    data: {
      ...rest,
      productId,
      mediaUrl,
      startDate: new Date(rest.startDate),
      endDate: new Date(rest.endDate),
    },
    include: { product: true }
  });

  return deal;
};

export const updateFlashDeal = async ({ id, input, actor }) => {
  const deal = await prisma.flashDeal.findUnique({ where: { id } });
  if (!deal) throw new AppError("Flash Deal not found", 404, "DEAL_NOT_FOUND");

  const { mediaBase64, mediaName, productId, ...rest } = input;
  let mediaUrl = deal.mediaUrl;
  if (input.mediaUrl) {
    assertAllowedMediaUrl(input.mediaUrl);
    mediaUrl = input.mediaUrl;
  }

  if (mediaBase64 && mediaName) {
    mediaUrl = await saveFile(mediaBase64, mediaName);
  }

  const dataToUpdate = { ...rest, mediaUrl };
  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    dataToUpdate.productId = productId;
  }
  if (rest.startDate !== undefined) dataToUpdate.startDate = new Date(rest.startDate);
  if (rest.endDate !== undefined) dataToUpdate.endDate = new Date(rest.endDate);

  const updatedDeal = await prisma.flashDeal.update({
    where: { id },
    data: dataToUpdate,
    include: { product: true }
  });

  return updatedDeal;
};

export const deleteFlashDeal = async ({ id, actor }) => {
  const deal = await prisma.flashDeal.findUnique({ where: { id } });
  if (!deal) throw new AppError("Flash Deal not found", 404, "DEAL_NOT_FOUND");

  await prisma.flashDeal.delete({ where: { id } });
  return true;
};

export const listAdminFlashDeals = async () => {
  return await prisma.flashDeal.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    include: {
      product: {
        select: { id: true, name: true, images: { take: 1 } }
      }
    }
  });
};

export const listActiveFlashDeals = async () => {
  const now = new Date();
  return await prisma.flashDeal.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
          variants: { take: 1, orderBy: { price: 'asc' } }
        }
      }
    }
  });
};

export const getFlashDealAnalytics = async () => {
  const deals = await prisma.flashDeal.findMany();
  
  const totalDeals = deals.length;
  const totalSold = deals.reduce((acc, deal) => acc + deal.soldQuantity, 0);
  const totalRevenue = deals.reduce((acc, deal) => acc + Number(deal.revenueGenerated || 0), 0);
  
  const totalViews = deals.reduce((acc, deal) => acc + deal.views, 0);
  const avgConversion = totalViews > 0 ? (totalSold / totalViews) * 100 : 0;

  // Simple mock of daily sales logic for the chart
  const salesOverview = [];
  const start = new Date();
  start.setDate(start.getDate() - 14);
  for (let i = 0; i < 15; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    salesOverview.push({
      date: d.toISOString().split("T")[0],
      sales: Math.floor(Math.random() * 20000)
    });
  }

  const topPerformingDeals = await prisma.flashDeal.findMany({
    orderBy: { soldQuantity: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      soldQuantity: true
    }
  });

  return {
    totalDeals,
    totalSold,
    totalRevenue,
    avgConversion: avgConversion.toFixed(2),
    salesOverview,
    topPerformingDeals,
    trafficSources: [
      { name: "Homepage", value: 45, color: "#8b5cf6" },
      { name: "Deals Page", value: 30, color: "#ec4899" },
      { name: "Notifications", value: 15, color: "#f59e0b" },
      { name: "Others", value: 10, color: "#06b6d4" }
    ]
  };
};
