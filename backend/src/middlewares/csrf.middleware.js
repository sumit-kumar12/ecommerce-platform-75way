import { createHash, createHmac, randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { csrfCookieOptions } from "../utils/cookies.js";
import { secureCompare } from "../utils/crypto.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const CSRF_EXEMPT_PATHS = new Set([
  "/api/v1/monitoring/alerts/webhook",
  "/api/v1/payments/webhooks/razorpay",
  "/api/v1/payments/razorpay/webhook",
]);

const hashDeviceId = (deviceId) =>
  createHash("sha256")
    .update(String(deviceId || "anonymous-device"))
    .digest("hex");

const signCsrfPayload = (deviceHash, nonce, expiresAt) =>
  createHmac("sha256", env.COOKIE_SECRET)
    .update(`${deviceHash}.${nonce}.${expiresAt}`)
    .digest("base64url");

const buildSignedCsrfToken = (deviceId) => {
  const nonce = randomUUID().replace(/-/g, "");
  const expiresAt = Date.now() + CSRF_TOKEN_TTL_MS;
  const signature = signCsrfPayload(hashDeviceId(deviceId), nonce, expiresAt);
  return `${nonce}.${expiresAt}.${signature}`;
};

const verifySignedCsrfToken = (token, deviceId) => {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return false;

  const [nonce, expiresAtRaw, signature] = parts;
  if (!nonce || !expiresAtRaw || !signature) return false;
  if (!/^\d+$/.test(expiresAtRaw)) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  const expectedSignature = signCsrfPayload(hashDeviceId(deviceId), nonce, expiresAt);
  return secureCompare(signature, expectedSignature);
};

export const issueCsrfCookie = (req, res) => {
  const deviceId = req.get("x-device-id") || "anonymous-device";
  const token = buildSignedCsrfToken(deviceId);
  res.cookie(env.CSRF_COOKIE_NAME, token, csrfCookieOptions());
  return token;
};

export const csrfProtectionMiddleware = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (CSRF_EXEMPT_PATHS.has(req.path)) return next();

  // TODO: Remove this CSRF bypass before deploying to production/live!
  // This is temporarily added to allow automated testing tools to work in development.
  if (env.NODE_ENV === "development") return next();

  const headerToken = req.get("x-csrf-token");
  const cookieToken = req.cookies[env.CSRF_COOKIE_NAME];
  const deviceId = req.get("x-device-id") || "anonymous-device";
  const isHeaderTokenValid = verifySignedCsrfToken(headerToken, deviceId);

  if (!headerToken || !isHeaderTokenValid) {
    return next(new AppError("CSRF validation failed.", 403, "CSRF_VALIDATION_FAILED"));
  }

  if (cookieToken && !secureCompare(cookieToken, headerToken)) {
    return next(new AppError("CSRF validation failed.", 403, "CSRF_VALIDATION_FAILED"));
  }

  next();
};
