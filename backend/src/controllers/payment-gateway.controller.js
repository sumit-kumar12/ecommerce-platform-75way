import { z } from "zod";
import {
  getPaymentGatewayAdminConfig,
  updatePaymentGatewayConfig,
} from "../services/payment-gateway-config.service.js";
import { writeAuditLog } from "../services/audit.service.js";

const updateSchema = z.object({
  mode: z.enum(["mock", "live"]).optional(),
  merchantLabel: z.string().min(1).max(80).optional(),
  razorpayKeyId: z.string().min(1).max(120).optional(),
  razorpayKeySecret: z.string().min(1).max(160).optional(),
  razorpayWebhookSecret: z.string().min(12).max(200).optional(),
});

export const getPaymentGatewayController = async (req, res) => {
  const config = await getPaymentGatewayAdminConfig();

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "PAYMENT_GATEWAY_READ",
    targetType: "PAYMENT_GATEWAY",
    targetId: config.provider,
    details: {
      mode: config.mode,
      merchantLabel: config.merchantLabel,
      hasKeySecret: config.hasKeySecret,
      hasWebhookSecret: config.hasWebhookSecret,
      isReady: config.isReady,
    },
  });

  res.status(200).json({ config });
};

export const updatePaymentGatewayController = async (req, res) => {
  const input = updateSchema.parse(req.body);
  const config = await updatePaymentGatewayConfig({ input });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "PAYMENT_GATEWAY_UPDATE",
    targetType: "PAYMENT_GATEWAY",
    targetId: config.provider,
    details: {
      mode: config.mode,
      merchantLabel: config.merchantLabel,
      maskedKeyId: config.maskedKeyId,
      hasKeySecret: config.hasKeySecret,
      hasWebhookSecret: config.hasWebhookSecret,
      isReady: config.isReady,
    },
  });

  res.status(200).json({ config });
};
