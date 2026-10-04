import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { AppError } from "../errors/app-error.js";
import {
  SQL_INJECTION_PATTERNS,
  XSS_PATTERNS,
  isReconPath,
  isSensitivePath,
  matchPatterns,
} from "../utils/security-patterns.js";
import { addThreatEvent } from "../services/threat.service.js";
import { incrementHoneypotHitMetric, incrementSecurityEventMetric } from "../config/metrics.js";
import { isConfiguredHoneypotPath, recordHoneypotTrigger } from "../services/admin-control.service.js";
import { adminBasePathPrefix } from "./admin-guard.middleware.js";

export const suspiciousInputScannerMiddleware = async (req, res, next) => {
  try {
    const requestPath = req.path;
    const normalizedOriginalPath = (req.originalUrl ?? req.path ?? "").split("?")[0];
    const adminPrefix = adminBasePathPrefix.toLowerCase();
    const normalizedOriginalPathLower = normalizedOriginalPath.toLowerCase();
    const requestPathLower = requestPath.toLowerCase();
    const requestPayload = {
      path: req.originalUrl,
      query: req.query,
      body: req.body,
      params: req.params,
    };

    const configuredTrapHit = await isConfiguredHoneypotPath(requestPath).catch(() => false);
    const isAdminPath =
      requestPathLower === adminPrefix ||
      requestPathLower.startsWith(`${adminPrefix}/`) ||
      normalizedOriginalPathLower === adminPrefix ||
      normalizedOriginalPathLower.startsWith(`${adminPrefix}/`) ||
      normalizedOriginalPathLower.includes(`${adminPrefix}/`);
    const shouldBlockPathByRecon =
      !isAdminPath && (isSensitivePath(requestPath) || isReconPath(requestPath));
    if (requestPath === env.HONEYPOT_PATH || configuredTrapHit || shouldBlockPathByRecon) {
      incrementHoneypotHitMetric();
      incrementSecurityEventMetric("recon_attempt_blocked");
      if (configuredTrapHit || requestPath === env.HONEYPOT_PATH) {
        await recordHoneypotTrigger(requestPath).catch(() => undefined);
      }
      await addThreatEvent({
        req,
        userId: req.user?.id ?? null,
        eventType: "recon_attempt_blocked",
        details: { path: req.originalUrl },
      });
      loggers.security.warn({
        eventType: "recon_path_blocked",
        userId: req.user?.id ?? null,
        details: { path: req.originalUrl },
      });
      return res.status(404).json({ error: "Not Found" });
    }

    if (matchPatterns(requestPayload, SQL_INJECTION_PATTERNS)) {
      incrementSecurityEventMetric("sql_pattern_detected");
      await addThreatEvent({
        req,
        userId: req.user?.id ?? null,
        eventType: "sql_pattern_detected",
        details: { path: req.originalUrl, method: req.method },
      });
      return next(new AppError("Suspicious request rejected.", 400, "SUSPICIOUS_SQL_INPUT"));
    }

    if (matchPatterns(requestPayload, XSS_PATTERNS)) {
      incrementSecurityEventMetric("xss_pattern_detected");
      await addThreatEvent({
        req,
        userId: req.user?.id ?? null,
        eventType: "xss_pattern_detected",
        details: { path: req.originalUrl, method: req.method },
      });
      return next(new AppError("Suspicious request rejected.", 400, "SUSPICIOUS_XSS_INPUT"));
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
