import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

export const productMediaPublicPathPrefix = "/media/products";
export const productMediaDiskRoot = path.resolve(currentDir, "../../storage/products");

export const normalizeStorageKey = (storageKey) =>
  String(storageKey ?? "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\.\.(\/|\\)/g, "");

export const toProductMediaPublicPath = (storageKey) => {
  const normalized = normalizeStorageKey(storageKey);
  return `${productMediaPublicPathPrefix}/${normalized}`;
};

export const buildProductMediaAbsoluteUrl = ({ req, storageKey }) => {
  const relativePath = toProductMediaPublicPath(storageKey);
  if (env.PRODUCT_MEDIA_BASE_URL) {
    try {
      return new URL(relativePath, env.PRODUCT_MEDIA_BASE_URL).toString();
    } catch {
      return relativePath;
    }
  }

  // Always return the relative path instead of guessing the host.
  // This allows the Next.js frontends to proxy /media/products correctly
  // via their next.config.mjs rewrites, regardless of tunnels or domains.
  return relativePath;
};
