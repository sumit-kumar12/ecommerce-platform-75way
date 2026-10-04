import { z } from "zod";
import { writeAuditLog } from "../services/audit.service.js";
import { listThreatRules, updateThreatRules } from "../services/threat-policy.service.js";

export const listThreatRulesController = async (req, res) => {
  const rules = await listThreatRules();

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "THREAT_RULES_LIST",
    targetType: "THREAT_RULE",
    targetId: "*",
    details: { returnedCount: rules.length },
  });

  return res.status(200).json({ rules });
};

const updateRulesSchema = z.object({
  rules: z.array(z.object({
    eventType: z.string().min(3).max(120),
    points: z.number().int().min(0).max(100),
    enabled: z.boolean(),
  })).min(1).max(100),
});

export const updateThreatRulesController = async (req, res) => {
  const input = updateRulesSchema.parse(req.body);

  const updatedCount = await updateThreatRules({
    actorId: req.user.id,
    rules: input.rules,
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "THREAT_RULES_UPDATE",
    targetType: "THREAT_RULE",
    targetId: "*",
    details: { requestedCount: input.rules.length, updatedCount },
  });

  return res.status(200).json({ updatedCount });
};

