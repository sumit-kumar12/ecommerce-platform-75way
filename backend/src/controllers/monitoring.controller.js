import crypto from "node:crypto";
import { z } from "zod";
import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { AppError } from "../errors/app-error.js";
import { notifySecurityEscalation } from "../services/notification.service.js";
import { getGlobalLockoutState } from "../services/admin-control.service.js";

const alertSchema = z.object({
  eventType: z.string().min(3).max(120),
  severity: z.enum(["INFO", "WARN", "ERROR", "CRITICAL", "EMERGENCY"]),
  message: z.string().min(3).max(2000),
  details: z.record(z.any()).optional(),
  source: z.string().min(1).max(120).optional(),
  timestamp: z.string().optional(),
});

const computeSignature = (rawBody) =>
  crypto.createHmac("sha256", env.ALERT_WEBHOOK_SECRET).update(rawBody).digest("hex");

export const monitoringAlertWebhookController = async (req, res) => {
  const signature = req.get("x-alert-signature");
  const rawBody = JSON.stringify(req.body ?? {});
  if (!signature) {
    throw new AppError("Missing alert signature.", 401, "ALERT_SIGNATURE_REQUIRED");
  }

  const expected = computeSignature(rawBody);
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");
  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    throw new AppError("Invalid alert signature.", 401, "ALERT_SIGNATURE_INVALID");
  }

  const alert = alertSchema.parse(req.body);

  loggers.security.info({
    severity: alert.severity,
    eventType: "monitoring_alert_webhook_received",
    details: {
      source: alert.source ?? "unknown",
      externalEventType: alert.eventType,
      message: alert.message,
      payloadTimestamp: alert.timestamp ?? null,
    },
  });

  if (alert.severity === "ERROR" || alert.severity === "CRITICAL" || alert.severity === "EMERGENCY") {
    await notifySecurityEscalation({
      eventType: alert.eventType,
      severity: alert.severity,
      message: alert.message,
      details: {
        source: alert.source ?? "unknown",
        ...alert.details,
      },
    });
  }

  res.status(202).json({ status: "accepted" });
};

export const monitoringPublicLockoutStatusController = async (_req, res) => {
  const state = await getGlobalLockoutState();
  res.status(200).json({
    locked: Boolean(state?.locked),
    lockedAt: state?.lockedAt ?? null,
    reason: state?.reason ?? null,
  });
};
