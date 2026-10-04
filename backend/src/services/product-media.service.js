import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { normalizeStorageKey, productMediaDiskRoot } from "../utils/product-media.js";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const extensionByMimeType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const dataUrlPrefixPattern = /^data:([a-z0-9/+.-]+);base64,/i;

const detectMimeTypeFromBuffer = (buffer) => {
  if (!buffer || buffer.length < 12) return null;

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  if (
    buffer.length > 16 &&
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70 &&
    buffer[8] === 0x61 &&
    buffer[9] === 0x76 &&
    buffer[10] === 0x69 &&
    (buffer[11] === 0x66 || buffer[11] === 0x73)
  ) {
    return "image/avif";
  }

  return null;
};

const decodeImagePayload = ({ imageBase64, mimeType }) => {
  if (typeof imageBase64 !== "string" || !imageBase64.trim()) {
    throw new AppError("imageBase64 is required.", 400, "INVALID_IMAGE_PAYLOAD");
  }

  const trimmed = imageBase64.trim();
  const prefixed = dataUrlPrefixPattern.exec(trimmed);
  const payloadMimeFromDataUrl = prefixed?.[1]?.toLowerCase() ?? null;
  const rawBase64 = prefixed ? trimmed.slice(prefixed[0].length) : trimmed;

  let buffer;
  try {
    buffer = Buffer.from(rawBase64, "base64");
  } catch {
    throw new AppError("Invalid base64 image payload.", 400, "INVALID_IMAGE_DATA");
  }

  if (!buffer?.length) {
    throw new AppError("Image payload is empty.", 400, "EMPTY_IMAGE_DATA");
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new AppError("Image exceeds 5MB limit.", 400, "IMAGE_TOO_LARGE");
  }

  const detectedMimeType = detectMimeTypeFromBuffer(buffer);
  if (!detectedMimeType || !ALLOWED_MIME_TYPES.has(detectedMimeType)) {
    throw new AppError("Unsupported image format. Use JPEG, PNG, WEBP, or AVIF.", 400, "UNSUPPORTED_IMAGE_TYPE");
  }

  const providedMimeType = mimeType ? String(mimeType).trim().toLowerCase() : null;
  if (providedMimeType && providedMimeType !== detectedMimeType) {
    throw new AppError("Image mime type does not match payload.", 400, "IMAGE_MIME_MISMATCH");
  }

  if (payloadMimeFromDataUrl && payloadMimeFromDataUrl !== detectedMimeType) {
    throw new AppError("Image mime type in data URL does not match payload.", 400, "IMAGE_MIME_MISMATCH");
  }

  return {
    buffer,
    mimeType: detectedMimeType,
    extension: extensionByMimeType[detectedMimeType],
  };
};

const toImageDiskPath = (storageKey) => {
  const normalizedKey = normalizeStorageKey(storageKey);
  return path.join(productMediaDiskRoot, ...normalizedKey.split("/"));
};

const normalizeAltText = (altText) => {
  if (altText === undefined) return undefined;
  const normalized = String(altText ?? "").trim();
  if (!normalized) return null;
  return normalized.slice(0, 160);
};

const normalizeCaption = (caption) => {
  if (caption === undefined) return undefined;
  const normalized = String(caption ?? "").trim();
  if (!normalized) return null;
  return normalized.slice(0, 240);
};

export const createProductImage = async ({ productId, input }) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");

  const { buffer, mimeType, extension } = decodeImagePayload({
    imageBase64: input.imageBase64,
    mimeType: input.mimeType,
  });

  const imageId = randomUUID();
  const storageKey = `${productId}/${imageId}.${extension}`;
  const filePath = toImageDiskPath(storageKey);
  const parentDirectory = path.dirname(filePath);
  const requestedSortOrder =
    input.sortOrder !== undefined && Number.isInteger(input.sortOrder) ? Math.max(0, input.sortOrder) : null;
  const normalizedAltText = normalizeAltText(input.altText);
  const normalizedCaption = normalizeCaption(input.caption);

  const existingImages = await prisma.productImage.findMany({
    where: { productId },
    select: { id: true, isPrimary: true, sortOrder: true },
  });
  const nextSortOrder =
    requestedSortOrder ?? (existingImages.length ? Math.max(...existingImages.map((image) => image.sortOrder)) + 1 : 0);
  const shouldSetPrimary = Boolean(input.isPrimary) || existingImages.length === 0;

  await fs.mkdir(parentDirectory, { recursive: true });
  await fs.writeFile(filePath, buffer, { mode: 0o600 });

  try {
    return await prisma.$transaction(async (tx) => {
      if (shouldSetPrimary) {
        await tx.productImage.updateMany({
          where: { productId, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      return tx.productImage.create({
        data: {
          id: imageId,
          productId,
          storageKey,
          originalName: String(input.originalName ?? `upload.${extension}`).slice(0, 160),
          mimeType,
          sizeBytes: buffer.length,
          altText: normalizedAltText,
          caption: normalizedCaption,
          isPrimary: shouldSetPrimary,
          sortOrder: nextSortOrder,
        },
      });
    });
  } catch (error) {
    await fs.unlink(filePath).catch(() => undefined);
    throw error;
  }
};

export const deleteProductImage = async ({ productId, imageId }) => {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
  });
  if (!image) throw new AppError("Image not found.", 404, "PRODUCT_IMAGE_NOT_FOUND");

  await prisma.$transaction(async (tx) => {
    await tx.productImage.delete({ where: { id: image.id } });

    if (image.isPrimary) {
      const replacement = await tx.productImage.findFirst({
        where: { productId },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      if (replacement) {
        await tx.productImage.update({
          where: { id: replacement.id },
          data: { isPrimary: true },
        });
      }
    }
  });

  await fs.unlink(toImageDiskPath(image.storageKey)).catch(() => undefined);
};

export const setPrimaryProductImage = async ({ productId, imageId }) => {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
    select: { id: true, productId: true },
  });
  if (!image) throw new AppError("Image not found.", 404, "PRODUCT_IMAGE_NOT_FOUND");

  await prisma.$transaction(async (tx) => {
    await tx.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
    await tx.productImage.update({
      where: { id: image.id },
      data: { isPrimary: true },
    });
  });
};
