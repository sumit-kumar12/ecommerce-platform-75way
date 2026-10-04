import { z } from "zod";
import { updateGlobalPaymentPolicy, getGlobalPaymentPolicy } from "../services/payment-policy.service.js";
import { writeAuditLog } from "../services/audit.service.js";

const updateSchema = z.object({
  onlineOnly: z.boolean().optional(),
  allowCOD: z.boolean().optional(),
  minCODPrice: z.coerce.number().nonnegative().nullable().optional(),
  forceDigitalOnline: z.boolean().optional(),
});

export const getPaymentPolicyController = async (req, res) => {
  const policy = await getGlobalPaymentPolicy();
  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "PAYMENT_POLICY_READ",
    targetType: "PAYMENT_POLICY",
    targetId: policy.id,
    details: {},
  });
  res.status(200).json({ policy });
};

export const updatePaymentPolicyController = async (req, res) => {
  const input = updateSchema.parse(req.body);
  const policy = await updateGlobalPaymentPolicy({
    actorId: req.user.id,
    input,
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "PAYMENT_POLICY_UPDATE",
    targetType: "PAYMENT_POLICY",
    targetId: policy.id,
    details: input,
  });

  res.status(200).json({ policy });
};
