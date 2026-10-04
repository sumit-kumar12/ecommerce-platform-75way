import crypto from "node:crypto";
import { env } from "../config/env.js";

const cookieKey = Buffer.from(env.COOKIE_ENCRYPTION_KEY, "base64");

export const hashValue = (value) => crypto.createHash("sha256").update(value).digest("hex");

export const randomToken = (bytes = 48) => crypto.randomBytes(bytes).toString("hex");

export const secureCompare = (a, b) => {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  if (first.length !== second.length) return false;
  return crypto.timingSafeEqual(first, second);
};

export const sealCookiePayload = (payload) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", cookieKey, iv);
  const serialized = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(serialized, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
};

export const openCookiePayload = (encoded) => {
  if (!encoded) return null;
  try {
    const buffer = Buffer.from(encoded, "base64url");
    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const ciphertext = buffer.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", cookieKey, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const encryptSecret = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", cookieKey, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${Buffer.concat([iv, tag, encrypted]).toString("base64url")}`;
};

export const decryptSecret = (encoded) => {
  if (!encoded) return null;
  if (!String(encoded).startsWith("v1:")) return encoded;
  try {
    const buffer = Buffer.from(String(encoded).slice(3), "base64url");
    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const ciphertext = buffer.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", cookieKey, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
};
