import { ZodError } from "zod";
import { loggers } from "../config/logger.js";
import { AppError } from "../errors/app-error.js";
import { isConfiguredHoneypotPath, recordHoneypotTrigger } from "../services/admin-control.service.js";
import { addThreatEvent } from "../services/threat.service.js";

const SUSPICIOUS_PATTERNS = [
  /\.env/i, /\.git/i, /\.well-known/i, /\.php/i, /\.aspx/i,
  /config/i, /admin/i, /setup/i, /install/i, /backup/i, /dump/i,
  /secrets/i, /credentials/i, /passwd/i, /shadow/i,
];

export const notFoundMiddleware = async (req, res) => {
  const isSuspicious = SUSPICIOUS_PATTERNS.some((regex) => regex.test(req.path));

  if (isSuspicious) {
    try {
      const isTrap = await isConfiguredHoneypotPath(req.path);
      if (isTrap) {
        await recordHoneypotTrigger(req.path);
        await addThreatEvent({
          req,
          userId: req.user?.id ?? null,
          eventType: "HONEYPOT_TRAP_TRIGGERED",
          details: { path: req.path },
        });
      }
    } catch {
      // Ignore honeypot processing errors to ensure 404 is still served
    }
  }

  res.status(404).json({
    error: "Not Found",
    requestId: req.id,
  });
};

export const errorHandlerMiddleware = (error, req, res, _next) => {
  let normalizedError = error;
  if (!(normalizedError instanceof AppError)) {
    if (normalizedError instanceof ZodError) {
      normalizedError = new AppError("Validation failed.", 400, "VALIDATION_ERROR", {
        issues: normalizedError.issues,
      });
    } else if (normalizedError?.status && normalizedError?.message) {
      normalizedError = new AppError(normalizedError.message, normalizedError.status, "REQUEST_REJECTED");
    } else {
      normalizedError = new AppError("Internal server error.", 500, "INTERNAL_ERROR");
    }
  }

  const logPayload = {
    eventType: "request_error",
    severity: normalizedError.statusCode >= 500 ? "CRITICAL" : "WARN",
    userId: req.user?.id ?? null,
    details: {
      code: normalizedError.code,
      message: error.message,
      path: req.originalUrl,
      method: req.method,
      statusCode: normalizedError.statusCode,
      errorDetails: normalizedError.details,
    },
  };

  if (normalizedError.statusCode >= 500) {
    loggers.error.error(logPayload);
  } else {
    loggers.app.warn(logPayload);
  }

  res.status(normalizedError.statusCode).json({
    error: normalizedError.expose ? normalizedError.message : "Internal server error.",
    code: normalizedError.code,
    details: normalizedError.expose ? normalizedError.details : undefined,
    requestId: req.id,
  });
};
