import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { decryptSecret, encryptSecret } from "../utils/crypto.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..", "..");
const gatewayConfigPath = path.join(backendRoot, "storage", "system", "payment-gateway-config.json");

const normalizeString = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized.length ? normalized : null;
};

const maskSecret = (value) => {
  const normalized = normalizeString(value);
  if (!normalized) return null;
  return `••••••••${normalized.slice(-4)}`;
};

const maskKeyId = (value) => {
  const normalized = normalizeString(value);
  if (!normalized) return null;
  if (normalized.length <= 10) return `${normalized.slice(0, 3)}••••`;
  return `${normalized.slice(0, 8)}••••${normalized.slice(-4)}`;
};

const isPlaceholderCredential = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return (
    !normalized ||
    normalized === "rzp_test_key" ||
    normalized === "rzp_test_secret" ||
    normalized.startsWith("mock_") ||
    normalized.includes("placeholder")
  );
};

const validateGatewayConfig = (config) => {
  const issues = [];
  const keyId = normalizeString(config.razorpayKeyId);
  const keySecret = normalizeString(config.razorpayKeySecret);
  const webhookSecret = normalizeString(config.razorpayWebhookSecret);

  if (!["mock", "live"].includes(config.mode)) {
    issues.push("Gateway mode must be mock or live.");
  }

  if (config.mode === "live") {
    if (!keyId || (!/^rzp_live_[A-Za-z0-9]+$/.test(keyId) && !/^rzp_test_[A-Za-z0-9]+$/.test(keyId))) {
      issues.push("Live mode requires a Razorpay live or test key ID.");
    }
    if (!keySecret || keySecret.length < 12 || isPlaceholderCredential(keySecret)) {
      issues.push("Live mode requires a non-placeholder Razorpay key secret.");
    }
    if (!webhookSecret || webhookSecret.length < 12 || isPlaceholderCredential(webhookSecret)) {
      issues.push("Live mode requires a non-placeholder Razorpay webhook secret.");
    }
  }

  if (config.mode === "mock" && keyId?.startsWith("rzp_live_")) {
    issues.push("Mock mode is using a live-looking key ID. Switch to live mode or replace it with test/mock credentials.");
  }

  return {
    ready: issues.length === 0,
    issues,
  };
};

const getDefaultMode = () => {
  const keyId = String(env.RAZORPAY_KEY_ID ?? "").trim().toLowerCase();
  const keySecret = String(env.RAZORPAY_KEY_SECRET ?? "").trim().toLowerCase();
  const isPlaceholder =
    keyId === "rzp_test_key" ||
    keySecret === "rzp_test_secret" ||
    keyId.startsWith("mock_") ||
    keySecret.startsWith("mock_");
  return env.NODE_ENV !== "production" && isPlaceholder ? "mock" : "live";
};

const getDefaultConfig = () => ({
  provider: "RAZORPAY",
  mode: getDefaultMode(),
  merchantLabel: "Katabazaar",
  razorpayKeyId: env.RAZORPAY_KEY_ID,
  razorpayKeySecret: env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
});

const readStoredConfig = async () => {
  try {
    const raw = await fs.readFile(gatewayConfigPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      razorpayKeySecret: parsed.razorpayKeySecretEncrypted
        ? decryptSecret(parsed.razorpayKeySecretEncrypted)
        : parsed.razorpayKeySecret,
      razorpayWebhookSecret: parsed.razorpayWebhookSecretEncrypted
        ? decryptSecret(parsed.razorpayWebhookSecretEncrypted)
        : parsed.razorpayWebhookSecret,
    };
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};

const writeStoredConfig = async (config) => {
  await fs.mkdir(path.dirname(gatewayConfigPath), { recursive: true });
  await fs.writeFile(
    gatewayConfigPath,
    JSON.stringify(
      {
        provider: config.provider,
        mode: config.mode,
        merchantLabel: config.merchantLabel,
        razorpayKeyId: config.razorpayKeyId,
        razorpayKeySecretEncrypted: encryptSecret(config.razorpayKeySecret),
        razorpayWebhookSecretEncrypted: encryptSecret(config.razorpayWebhookSecret),
        secretStorage: "aes-256-gcm:v1",
      },
      null,
      2,
    ),
    "utf8",
  );
};

const buildRuntimeConfig = (storedConfig = null) => {
  const defaults = getDefaultConfig();
  const merged = {
    ...defaults,
    ...(storedConfig ?? {}),
  };

  return {
    provider: "RAZORPAY",
    mode: merged.mode === "live" ? "live" : "mock",
    merchantLabel: normalizeString(merged.merchantLabel) ?? defaults.merchantLabel,
    razorpayKeyId: normalizeString(merged.razorpayKeyId) ?? defaults.razorpayKeyId,
    razorpayKeySecret: normalizeString(merged.razorpayKeySecret) ?? defaults.razorpayKeySecret,
    razorpayWebhookSecret: normalizeString(merged.razorpayWebhookSecret) ?? defaults.razorpayWebhookSecret,
  };
};

export const getPaymentGatewayRuntimeConfig = async () => buildRuntimeConfig(await readStoredConfig());

export const getPaymentGatewayAdminConfig = async () => {
  const config = await getPaymentGatewayRuntimeConfig();
  const validation = validateGatewayConfig(config);
  return {
    provider: config.provider,
    mode: config.mode,
    merchantLabel: config.merchantLabel,
    razorpayKeyId: config.razorpayKeyId,
    maskedKeyId: maskKeyId(config.razorpayKeyId),
    hasKeySecret: Boolean(config.razorpayKeySecret),
    maskedKeySecret: maskSecret(config.razorpayKeySecret),
    hasWebhookSecret: Boolean(config.razorpayWebhookSecret),
    maskedWebhookSecret: maskSecret(config.razorpayWebhookSecret),
    isReady: validation.ready,
    validationIssues: validation.issues,
  };
};

export const updatePaymentGatewayConfig = async ({ input }) => {
  const existing = await getPaymentGatewayRuntimeConfig();
  const next = {
    provider: "RAZORPAY",
    mode: input.mode === "live" ? "live" : "mock",
    merchantLabel: normalizeString(input.merchantLabel) ?? existing.merchantLabel,
    razorpayKeyId: normalizeString(input.razorpayKeyId) ?? existing.razorpayKeyId,
    razorpayKeySecret:
      input.razorpayKeySecret === undefined
        ? existing.razorpayKeySecret
        : normalizeString(input.razorpayKeySecret) ?? existing.razorpayKeySecret,
    razorpayWebhookSecret:
      input.razorpayWebhookSecret === undefined
        ? existing.razorpayWebhookSecret
        : normalizeString(input.razorpayWebhookSecret) ?? existing.razorpayWebhookSecret,
  };

  const validation = validateGatewayConfig(next);
  if (next.mode === "live" && !validation.ready) {
    throw new AppError(validation.issues[0], 400, "INVALID_GATEWAY_CONFIG", { issues: validation.issues });
  }

  await writeStoredConfig(next);
  return getPaymentGatewayAdminConfig();
};

export const assertPaymentGatewayReady = (config) => {
  const validation = validateGatewayConfig(config);
  if (!validation.ready) {
    throw new AppError("Payment gateway is not configured for live processing.", 503, "PAYMENT_GATEWAY_NOT_READY", {
      issues: validation.issues,
    });
  }
};
