import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

export const SQL_INJECTION_PATTERNS = [
  /\bunion\b[\s\S]*\bselect\b/i,
  /\bdrop\b[\s\S]*\btable\b/i,
  /\binformation_schema\b/i,
  /\b(or|and)\b\s+\d+\s*=\s*\d+/i,
  /--/,
  /\/\*/,
  /\bpg_sleep\s*\(/i,
  /;\s*(select|insert|update|delete|drop|alter|create)\b/i,
];

export const XSS_PATTERNS = [
  /<script\b[^>]*>[\s\S]*?<\/script>/i,
  /\bon\w+\s*=/i,
  /javascript:/i,
  /<iframe/i,
  /<img[\s\S]*onerror/i,
];

export const RECON_PATH_PATTERNS = [
  /(^|\/)wp-admin(\/|$)/i,
  /(^|\/)phpmyadmin(\/|$)/i,
  /(^|\/)backup(\/|$)/i,
  /(^|\/)old(\/|$)/i,
];

export const SENSITIVE_PATH_PATTERNS = [
  /(^|\/)\.env(\/|$)/i,
  /(^|\/)\.git(\/|$)/i,
  /(^|\/)node_modules(\/|$)/i,
  /(^|\/)logs(\/|$)/i,
  /(^|\/)config(\/|$)/i,
  /(^|\/)\.[^/]+(\/|$)/,
];

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export const collectStrings = (value, collected = []) => {
  if (value === null || value === undefined) return collected;
  if (typeof value === "string") {
    collected.push(value);
    return collected;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, collected));
    return collected;
  }
  if (isObject(value)) {
    Object.values(value).forEach((item) => collectStrings(item, collected));
  }
  return collected;
};

export const matchPatterns = (value, patterns) => {
  const strings = collectStrings(value);
  return strings.some((str) => patterns.some((pattern) => pattern.test(str)));
};

const normalizePath = (path) => {
  if (typeof path !== "string" || !path) return "/";
  const rawPath = path.split("?")[0];
  try {
    return decodeURIComponent(rawPath).replace(/\\/g, "/").toLowerCase();
  } catch {
    return rawPath.replace(/\\/g, "/").toLowerCase();
  }
};

export const isSensitivePath = (path) => {
  const normalizedPath = normalizePath(path);
  return SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(normalizedPath));
};

export const isReconPath = (path) => {
  const normalizedPath = normalizePath(path);
  return RECON_PATH_PATTERNS.some((pattern) => pattern.test(normalizedPath));
};

export const assertAllowedMediaUrl = (urlString) => {
  if (!urlString) return;
  try {
    const parsed = new URL(urlString);
    const allowedHosts = [
      env.APP_BASE_DOMAIN,
      "s3.amazonaws.com",
      "res.cloudinary.com"
    ];
    if (!allowedHosts.includes(parsed.hostname)) {
      throw new AppError(`SSRF Blocked: Hostname ${parsed.hostname} is not allowed.`, 403, "SSRF_BLOCKED");
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Invalid media URL provided.", 400, "INVALID_URL");
  }
};
