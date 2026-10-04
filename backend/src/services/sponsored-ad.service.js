import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { randomBytes } from "crypto";
import path from "path";
import fs from "fs/promises";
import { attachActiveOffers } from "./product.service.js";

const UPLOAD_DIR = path.join(process.cwd(), "public", "sponsored-ads");

const ensureUploadDir = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
};

const saveFile = async (base64Data, originalName) => {
  await ensureUploadDir();
  const ext = path.extname(originalName) || "";
  const randomName = randomBytes(16).toString("hex") + ext;
  const filePath = path.join(UPLOAD_DIR, randomName);
  
  const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64Clean, "base64");
  await fs.writeFile(filePath, buffer);
  
  return `/sponsored-ads/${randomName}`;
};

export const createSponsoredAd = async ({ input, actor }) => {
  let bannerImage = input.bannerImage;

  if (input.bannerBase64) {
    bannerImage = await saveFile(input.bannerBase64, input.bannerName || "sponsored-ad.jpg");
  }

  // Double check if product exists
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
  });
  if (!product) {
    throw new AppError("Target product does not exist.", 404, "PRODUCT_NOT_FOUND");
  }

  const sponsoredAd = await prisma.sponsoredAd.create({
    data: {
      campaignName: input.campaignName,
      productId: input.productId,
      adPosition: input.adPosition ?? 1,
      bannerImage,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      dailyBudget: input.dailyBudget,
      totalBudget: input.totalBudget,
      status: input.status ?? "active",
      impressions: 0,
      clicks: 0,
      revenue: 0,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  return sponsoredAd;
};

export const listSponsoredAds = async ({ activeOnly = false }) => {
  const now = new Date();
  const where = activeOnly 
    ? { 
        status: "active",
        startDate: { lte: now },
        endDate: { gte: now }
      } 
    : {};

  const ads = await prisma.sponsoredAd.findMany({
    where,
    orderBy: [
      { adPosition: "asc" },
      { createdAt: "desc" }
    ],
    include: {
      product: {
        include: {
          category: true,
          variants: {
            where: { isActive: true },
          },
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
          },
          lister: {
            select: { id: true, name: true },
          },
        }
      }
    }
  });

  // If activeOnly (storefront), attach active offers & campaigns to products
  if (activeOnly && ads.length > 0) {
    const products = ads.map(ad => ad.product).filter(Boolean);
    const enrichedProducts = await attachActiveOffers(products);
    
    // map them back
    const productMap = new Map(enrichedProducts.map(p => [p.id, p]));
    return ads.map(ad => ({
      ...ad,
      product: productMap.get(ad.productId) || ad.product
    }));
  }

  return ads;
};

export const updateSponsoredAd = async ({ id, input, actor }) => {
  const ad = await prisma.sponsoredAd.findUnique({ where: { id } });
  if (!ad) throw new AppError("Sponsored Ad campaign not found", 404, "SPONSORED_AD_NOT_FOUND");

  const { bannerBase64, bannerName, productId, ...rest } = input;
  let bannerImage = ad.bannerImage;

  if (bannerBase64 && bannerName) {
    bannerImage = await saveFile(bannerBase64, bannerName);
  }

  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError("Target product does not exist.", 404, "PRODUCT_NOT_FOUND");
    }
  }

  const dataToUpdate = { ...rest, bannerImage };
  if (productId) dataToUpdate.productId = productId;
  if (rest.startDate !== undefined) dataToUpdate.startDate = new Date(rest.startDate);
  if (rest.endDate !== undefined) dataToUpdate.endDate = new Date(rest.endDate);

  const updatedAd = await prisma.sponsoredAd.update({
    where: { id },
    data: dataToUpdate,
    include: {
      product: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  return updatedAd;
};

export const deleteSponsoredAd = async ({ id, actor }) => {
  const ad = await prisma.sponsoredAd.findUnique({ where: { id } });
  if (!ad) throw new AppError("Sponsored Ad campaign not found", 404, "SPONSORED_AD_NOT_FOUND");

  await prisma.sponsoredAd.delete({ where: { id } });
  return true;
};

export const trackSponsoredAdMetrics = async ({ metrics }) => {
  if (!Array.isArray(metrics)) return;

  for (const metric of metrics) {
    if (!metric.id) continue;
    if (metric.type === "view" || metric.type === "impression") {
      await prisma.sponsoredAd.update({
        where: { id: metric.id },
        data: { impressions: { increment: 1 } },
      });
    } else if (metric.type === "click") {
      await prisma.sponsoredAd.update({
        where: { id: metric.id },
        data: { clicks: { increment: 1 } },
      });
    }
  }
};
