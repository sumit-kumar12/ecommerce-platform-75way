import dotenv from "dotenv";
import os from "node:os";
import { z } from "zod";

dotenv.config();

const boolFromString = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return value;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return value;
}, z.boolean());

const intFromString = (defaultValue) =>
  z.preprocess(
    (value) => (value === undefined || value === "" ? defaultValue : Number(value)),
    z.number().int().positive(),
  );

const accessTokenTtlSchema = z
  .string()
  .default("10m")
  .refine((value) => {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) return false;
    const amount = Number(match[1]);
    const unit = match[2];
    const multiplier = unit === "s" ? 1 : unit === "m" ? 60 : unit === "h" ? 3600 : 86400;
    return amount * multiplier <= 7200;
  }, "JWT_ACCESS_TTL must be valid and not exceed 2 hours (e.g. 1h, 10m, 600s).");

const entropyCheck = z.string().min(64).refine(
  (s) => {
    const freq = {};
    for (const c of s) freq[c] = (freq[c] || 0) + 1;
    return Math.max(...Object.values(freq)) / s.length < 0.3;
  },
  { message: "Secret has low entropy — use crypto.randomBytes(64).toString('hex')" }
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.preprocess((value) => Number(value ?? 4000), z.number().int().min(1).max(65535)),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url(),
  REDIS_TLS: boolFromString.default(false),
  REDIS_KEY_PREFIX: z.string().min(3).default("store-secure"),
  JWT_ACCESS_SECRET: entropyCheck,
  JWT_REFRESH_SECRET: entropyCheck,
  JWT_ACCESS_TTL: accessTokenTtlSchema,
  JWT_REFRESH_TTL_DAYS: intFromString(14),
  ACCESS_TOKEN_REPLAY_TTL_SEC: intFromString(600),
  ACCESS_TOKEN_REUSE_BLOCK_MINUTES: intFromString(60),
  SESSION_BINDING_STRICT_DEVICE: boolFromString.default(true),
  BCRYPT_SALT_ROUNDS: intFromString(12),
  COOKIE_SECRET: z.string().min(32),
  COOKIE_SECURE: boolFromString.optional(),
  COOKIE_ENCRYPTION_KEY: z
    .string()
    .refine((value) => {
      try {
        return Buffer.from(value, "base64").length === 32;
      } catch {
        return false;
      }
    }, "COOKIE_ENCRYPTION_KEY must be a base64 encoded 32-byte key."),
  CORS_ALLOWED_ORIGINS: z.string().min(1),
  TRUST_PROXY: boolFromString.default(true),
  APP_BASE_DOMAIN: z.string().min(1),
  ADMIN_SUBDOMAIN: z.string().min(1),
  ADMIN_ALLOWED_HOSTS: z.string().optional(),
  ADMIN_ROUTE_PREFIX: z.string().min(16),
  CSRF_COOKIE_NAME: z.string().min(1).default("csrfToken"),
  ACCESS_COOKIE_NAME: z.string().min(1).default("accessToken"),
  REFRESH_COOKIE_NAME: z.string().min(1).default("refreshToken"),
  GUEST_CART_COOKIE_NAME: z.string().min(1).default("guestCart"),
  GUEST_WISHLIST_COOKIE_NAME: z.string().min(1).default("guestWishlist"),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(12),
  BREVO_SMTP_USER: z.string().min(1).optional(),
  BREVO_SMTP_PASS: z.string().min(1).optional(),
  BREVO_FROM_EMAIL: z.string().email().optional(),
  TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
  TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
  TWILIO_WHATSAPP_FROM: z.string().regex(/^whatsapp:\+\d+$/).optional(),
  NOTIFICATION_HOURLY_LIMIT: intFromString(20),
  PASSWORD_RESET_TTL_MINUTES: intFromString(15),
  THREAT_THRESHOLD: intFromString(15),
  IP_BLOCK_MINUTES: intFromString(60),
  ACCOUNT_LOCK_MINUTES: intFromString(30),
  AUTH_ATTEMPT_WINDOW_MINUTES: intFromString(15),
  AUTH_ATTEMPT_MAX_PER_IP: intFromString(30),
  AUTH_ATTEMPT_MAX_PER_ACCOUNT_IP: intFromString(5),
  RATE_LIMIT_USE_REDIS: z.enum(['true', 'false']).default('false').transform(v => v === 'true'),
  RATE_LIMIT_WINDOW_MS: intFromString(60_000),
  RATE_LIMIT_MAX: intFromString(120),
  ADMIN_RATE_LIMIT_MAX: intFromString(120),
  OVERLOAD_MAX_INFLIGHT_REQUESTS: intFromString(300),
  OVERLOAD_REJECT_STATUS: z.preprocess((value) => Number(value ?? 503), z.number().int().min(429).max(503)),
  LOG_SIGNING_SECRET: z.string().min(32),
  LOG_IMMUTABLE_ENDPOINT: z.string().url().optional(),
  LOG_IMMUTABLE_TOKEN: z.string().min(32).optional(),
  LOCAL_LOGGING_ONLY: boolFromString.optional(),
  METRICS_TOKEN: z.string().min(24),
  ALERT_WEBHOOK_SECRET: z.string().min(32),
  ALERT_EMAIL_TO: z.string().min(3),
  ALERT_WHATSAPP_TO: z.string().regex(/^(\+\d{10,15})(,\+\d{10,15})*$/),
  COMPLIANCE_REPORTS_ENABLED: boolFromString.default(false),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
  HONEYPOT_PATH: z.string().min(4),
  STORE_APP_URL: z.string().url().optional(),
  PRODUCT_MEDIA_BASE_URL: z.string().url().optional(),
  PRODUCT_MEDIA_CACHE_MAX_AGE: z.string().min(1).default("7d"),
  MAILHOG_HOST: z.string().optional(),
  MAILHOG_PORT: z.preprocess((v) => (v === undefined || v === "" ? undefined : Number(v)), z.number().int().min(1).max(65535).optional()),
  MEILISEARCH_HOST: z.string().url().optional(),
  MEILISEARCH_MASTER_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  INSTAGRAM_CLIENT_ID: z.string().optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().optional(),
  OAUTH_CALLBACK_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Critical configuration validation failed.");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

const data = parsed.data;

if (data.NODE_ENV === "production" && data.COOKIE_SECURE === false) {
  console.error("Critical configuration validation failed.");
  console.error("COOKIE_SECURE cannot be false when NODE_ENV is production.");
  process.exit(1);
}

if (data.NODE_ENV !== "test" && data.REDIS_URL.startsWith("memory://")) {
  console.error("Critical configuration validation failed.");
  console.error("REDIS_URL cannot use memory:// outside test mode.");
  process.exit(1);
}

if (data.NODE_ENV === "production" && (!data.LOG_IMMUTABLE_ENDPOINT || !data.LOG_IMMUTABLE_TOKEN)) {
  console.error("Critical configuration validation failed.");
  console.error("LOG_IMMUTABLE_ENDPOINT and LOG_IMMUTABLE_TOKEN are required in production.");
  process.exit(1);
}

if (data.NODE_ENV === "production") {
  if (!data.BREVO_SMTP_USER || !data.BREVO_SMTP_PASS || !data.BREVO_FROM_EMAIL) {
    console.error("Critical configuration validation failed.");
    console.error("BREVO_SMTP_USER, BREVO_SMTP_PASS, and BREVO_FROM_EMAIL are required in production.");
    process.exit(1);
  }
  if (!data.TWILIO_ACCOUNT_SID || !data.TWILIO_AUTH_TOKEN || !data.TWILIO_WHATSAPP_FROM) {
    console.error("Critical configuration validation failed.");
    console.error("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM are required in production.");
    process.exit(1);
  }
}

const useImmutableLogging =
  data.NODE_ENV !== "test" &&
  !data.LOCAL_LOGGING_ONLY &&
  Boolean(data.LOG_IMMUTABLE_ENDPOINT) &&
  Boolean(data.LOG_IMMUTABLE_TOKEN);

const normalizeOrigin = (origin) => {
  const input = String(origin ?? "").trim();
  if (!input) return null;

  try {
    const parsed = new URL(input);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}:${port}`;
  } catch {
    return null;
  }
};

const buildDevelopmentLanCorsOrigins = (ports) => {
  const origins = [];
  const interfaces = os.networkInterfaces();

  for (const records of Object.values(interfaces)) {
    for (const record of records ?? []) {
      if (!record || record.internal || record.family !== "IPv4") continue;
      for (const port of ports) {
        origins.push(`http://${record.address}:${port}`);
      }
    }
  }

  return origins;
};

const normalizedAdminRoutePrefix = data.ADMIN_ROUTE_PREFIX.replace(/^\/+/, "").replace(/\/+$/, "");
const normalizedAdminSubdomain = data.ADMIN_SUBDOMAIN.trim().toLowerCase();

const adminAllowedHosts = new Set(
  [normalizedAdminSubdomain, ...(data.ADMIN_ALLOWED_HOSTS ?? "").split(",")]
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
);

if (data.NODE_ENV !== "production") {
  adminAllowedHosts.add("localhost");
  adminAllowedHosts.add("127.0.0.1");
  adminAllowedHosts.add("::1");
  adminAllowedHosts.add("[::1]");
}

const configuredCorsOrigins = data.CORS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const extraDevelopmentCorsOrigins =
  data.NODE_ENV !== "production" ? buildDevelopmentLanCorsOrigins([3000, 3001]) : [];

const resolvedCorsAllowedOrigins = Array.from(
  new Set([...configuredCorsOrigins, ...extraDevelopmentCorsOrigins].map(normalizeOrigin).filter(Boolean)),
);

export const env = Object.freeze({
  ...data,
  LOG_IMMUTABLE_ENABLED: useImmutableLogging,
  COOKIE_SECURE: data.COOKIE_SECURE ?? data.NODE_ENV === "production",
  MAILHOG_PORT: data.MAILHOG_PORT ?? 1025,
  ALERT_EMAIL_TO: data.ALERT_EMAIL_TO.split(",")
    .map((email) => email.trim())
    .filter(Boolean),
  ALERT_WHATSAPP_TO: data.ALERT_WHATSAPP_TO.split(",")
    .map((phone) => phone.trim())
    .filter(Boolean),
  ADMIN_SUBDOMAIN: normalizedAdminSubdomain,
  ADMIN_ROUTE_PREFIX: normalizedAdminRoutePrefix,
  ADMIN_ALLOWED_HOSTS: Array.from(adminAllowedHosts),
  CORS_ALLOWED_ORIGINS: resolvedCorsAllowedOrigins,
  STORE_APP_URL:
    data.STORE_APP_URL ??
    (data.NODE_ENV === "production" ? `https://${data.APP_BASE_DOMAIN}` : "http://localhost:3000"),
  PRODUCT_MEDIA_BASE_URL: data.PRODUCT_MEDIA_BASE_URL,
  PRODUCT_MEDIA_CACHE_MAX_AGE: data.PRODUCT_MEDIA_CACHE_MAX_AGE,
});
