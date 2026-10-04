import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { loggers } from "./config/logger.js";
import apiRoutes from "./routes/index.js";
import adminRoutes from "./routes/admin.routes.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { requestContextMiddleware } from "./middlewares/request-context.middleware.js";
import { structuredRequestLoggerMiddleware } from "./middlewares/request-logger.middleware.js";
import { suspiciousInputScannerMiddleware } from "./middlewares/suspicious-input.middleware.js";
import {
  adminRateLimiterMiddleware,
  globalRateLimiterMiddleware,
} from "./middlewares/rate-limit.middleware.js";
import { csrfProtectionMiddleware } from "./middlewares/csrf.middleware.js";
import { accountActiveCheckMiddleware } from "./middlewares/account-active.middleware.js";
import { threatScoreCheckMiddleware } from "./middlewares/threat-score.middleware.js";
import { jwtVerificationMiddleware } from "./middlewares/jwt.middleware.js";
import { overloadProtectionMiddleware } from "./middlewares/overload-protection.middleware.js";
import { httpMetricsMiddleware } from "./middlewares/metrics.middleware.js";
import {
  errorHandlerMiddleware,
  notFoundMiddleware,
} from "./middlewares/error-handler.middleware.js";
import { adminBasePathPrefix, adminSurfaceGuardMiddleware } from "./middlewares/admin-guard.middleware.js";
import { assertGlobalSecurityLayerOrder, assertTerminalSecurityLayerOrder } from "./utils/security-stack.js";
import { healthLiveController, healthReadyController } from "./controllers/health.controller.js";
import { metricsController } from "./controllers/metrics.controller.js";
import { productMediaDiskRoot, productMediaPublicPathPrefix } from "./utils/product-media.js";
import { cloudflareRealIpMiddleware } from "./middlewares/cloudflare-ip.middleware.js";
import path from "path";

const app = express();
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
const allowedCorsOrigins = new Set(env.CORS_ALLOWED_ORIGINS.map(normalizeOrigin).filter(Boolean));

if (env.TRUST_PROXY) app.set("trust proxy", 1);

// ── Cloudflare Real IP ─────────────────────────────────────────────────────
// Must be registered BEFORE all other middleware so req.ip is the real visitor
// IP (from cf-connecting-ip), not the Cloudflare edge server IP.
// When not behind Cloudflare, this is a no-op (header absent).
app.use(cloudflareRealIpMiddleware);
// ──────────────────────────────────────────────────────────────────────────

const registeredSecurityLayers = [];
const registeredTerminalSecurityLayers = [];
const registerLayer = (name, middleware) => {
  registeredSecurityLayers.push(name);
  app.use(middleware);
};

app.disable("x-powered-by");
registeredSecurityLayers.push("disable_x_powered_by");

registerLayer(
  "helmet",
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "frame-ancestors": ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "no-referrer" },
  }),
);

registerLayer(
  "strict_cors",
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = normalizeOrigin(origin);
      if (normalizedOrigin && allowedCorsOrigins.has(normalizedOrigin)) return callback(null, true);
      
      if (env.NODE_ENV === "development" && origin) {
        try {
          const originHostname = new URL(origin).hostname;
          // TODO: Remove this dynamic bypass before deploying to live/production
          if (originHostname.endsWith(".trycloudflare.com")) {
            return callback(null, true);
          }
        } catch {
          // ignore invalid URLs
        }
      }

      const corsError = new Error("Origin is not allowed by CORS policy.");
      corsError.status = 403;
      corsError.details = { origin };
      return callback(corsError);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Device-Id"],
  }),
);

registerLayer(
  "body_size_limit",
  [
    express.json({
      limit: "8mb",
      verify: (req, _res, buffer) => {
        if (
          req.originalUrl?.startsWith("/api/v1/payments/webhooks/razorpay") ||
          req.originalUrl?.startsWith("/api/v1/payments/razorpay/webhook")
        ) {
          req.rawBody = Buffer.from(buffer);
        }
      },
    }),
    express.urlencoded({ limit: "8mb", extended: false }),
  ],
);

app.use(cookieParser(env.COOKIE_SECRET));

registerLayer("request_id", requestIdMiddleware);
app.use(requestContextMiddleware);
registerLayer("structured_request_logger", structuredRequestLoggerMiddleware);
registerLayer("suspicious_input_scanner", suspiciousInputScannerMiddleware);
registerLayer("rate_limiter", globalRateLimiterMiddleware);
registerLayer("overload_protection", overloadProtectionMiddleware);
registerLayer("csrf_protection", csrfProtectionMiddleware);
registerLayer("jwt_verification", jwtVerificationMiddleware);
registerLayer("account_active_check", accountActiveCheckMiddleware);
registerLayer("threat_score_check", threatScoreCheckMiddleware);

assertGlobalSecurityLayerOrder(registeredSecurityLayers);

app.use(httpMetricsMiddleware);

app.get("/metrics", metricsController);

app.use(adminSurfaceGuardMiddleware);

app.get("/healthz", healthLiveController);
app.get("/health/live", healthLiveController);
app.get("/health/ready", healthReadyController);
app.use(
  productMediaPublicPathPrefix,
  express.static(productMediaDiskRoot, {
    fallthrough: true,
    index: false,
    maxAge: env.NODE_ENV === "production" ? env.PRODUCT_MEDIA_CACHE_MAX_AGE : "2h",
    setHeaders: (res) => {
      // Product images are intentionally rendered by the store/admin apps on different local origins.
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.use(
  "/campaigns",
  express.static(path.join(process.cwd(), "public", "campaigns"), {
    fallthrough: true,
    index: false,
    maxAge: env.NODE_ENV === "production" ? env.PRODUCT_MEDIA_CACHE_MAX_AGE : "2h",
  }),
);

app.use(
  "/sponsored-ads",
  express.static(path.join(process.cwd(), "public", "sponsored-ads"), {
    fallthrough: true,
    index: false,
    maxAge: env.NODE_ENV === "production" ? env.PRODUCT_MEDIA_CACHE_MAX_AGE : "2h",
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.get("/debug", (req, res) => res.json({ headers: req.headers, cookies: req.cookies }));
app.use("/api/v1", apiRoutes);
app.use(
  adminBasePathPrefix,
  (req, res, next) => {
    // TODO: Remove this dynamic bypass before deploying to live/production
    if (env.NODE_ENV === "development" && req.hostname.endsWith(".trycloudflare.com")) {
      return next();
    }
    if (!env.ADMIN_ALLOWED_HOSTS.includes(req.hostname)) return res.status(404).json({ error: "Not Found" });
    return next();
  },
  adminRateLimiterMiddleware,
  adminRoutes,
);

registeredTerminalSecurityLayers.push("not_found_handler");
app.use(notFoundMiddleware);
registeredTerminalSecurityLayers.push("central_error_handler");
app.use(errorHandlerMiddleware);
assertTerminalSecurityLayerOrder(registeredTerminalSecurityLayers);

loggers.app.info({
  eventType: "application_bootstrap_complete",
  details: {
    middlewareOrder: registeredSecurityLayers,
    terminalHandlerOrder: registeredTerminalSecurityLayers,
    adminBasePathPrefix,
  },
});

export default app;
