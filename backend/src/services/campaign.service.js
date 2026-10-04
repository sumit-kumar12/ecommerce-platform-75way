import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { randomBytes } from "crypto";
import path from "path";
import fs from "fs/promises";
import { writeAuditLog } from "./audit.service.js";
import { assertAllowedMediaUrl } from "../utils/security-patterns.js";

const UPLOAD_DIR = path.join(process.cwd(), "public", "campaigns");

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
  
  return `/campaigns/${randomName}`;
};

export const createCampaign = async ({ input, actor }) => {
  let mediaUrl = input.mediaUrl;
  if (mediaUrl) assertAllowedMediaUrl(mediaUrl);

  if (input.mediaBase64) {
    mediaUrl = await saveFile(input.mediaBase64, input.mediaName || "campaign-media.jpg");
  }

  if (!mediaUrl) {
    throw new AppError("Media is required for a campaign.", 400, "CAMPAIGN_MEDIA_REQUIRED");
  }

  const campaign = await prisma.heroCampaign.create({
    data: {
      name: input.name,
      type: input.type,
      title: input.title,
      subtitle: input.subtitle,
      ctaText: input.ctaText,
      linkUrl: input.linkUrl,
      mediaUrl,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      isActive: input.isActive ?? true,
      priority: input.priority ?? 0,
      productId: input.productId ?? null,
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

  return campaign;
};

export const listCampaigns = async ({ activeOnly = false }) => {
  const where = activeOnly ? { isActive: true } : {};
  return prisma.heroCampaign.findMany({
    where,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    include: {
      product: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });
};

export const deleteCampaign = async ({ id, actor }) => {
  const campaign = await prisma.heroCampaign.findUnique({ where: { id } });
  if (!campaign) throw new AppError("Campaign not found", 404, "CAMPAIGN_NOT_FOUND");

  await prisma.heroCampaign.delete({ where: { id } });
  return true;
};

export const updateCampaign = async ({ id, input, actor }) => {
  const campaign = await prisma.heroCampaign.findUnique({ where: { id } });
  if (!campaign) throw new AppError("Campaign not found", 404, "CAMPAIGN_NOT_FOUND");

  const { mediaBase64, mediaName, ...rest } = input;
  let mediaUrl = campaign.mediaUrl;
  if (input.mediaUrl) {
    assertAllowedMediaUrl(input.mediaUrl);
    mediaUrl = input.mediaUrl;
  }

  if (mediaBase64 && mediaName) {
    mediaUrl = await saveFile(mediaBase64, mediaName);
  }

  const dataToUpdate = { ...rest, mediaUrl };
  if (rest.startDate !== undefined) dataToUpdate.startDate = new Date(rest.startDate);
  if (rest.endDate !== undefined) dataToUpdate.endDate = new Date(rest.endDate);

  const updatedCampaign = await prisma.heroCampaign.update({
    where: { id },
    data: dataToUpdate,
  });

  return updatedCampaign;
};

export const trackCampaignMetrics = async ({ metrics }) => {
  if (!Array.isArray(metrics)) return;
  
  const viewIds = metrics.filter(m => m.type === "view" && m.id).map(m => m.id);
  const clickIds = metrics.filter(m => m.type === "click" && m.id).map(m => m.id);

  if (viewIds.length > 0) {
    await prisma.heroCampaign.updateMany({
      where: { id: { in: viewIds } },
      data: { views: { increment: 1 } },
    });
  }

  if (clickIds.length > 0) {
    await prisma.heroCampaign.updateMany({
      where: { id: { in: clickIds } },
      data: { clicks: { increment: 1 } },
    });
  }
};
