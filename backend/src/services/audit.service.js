import { prisma } from "../config/prisma.js";
import { loggers } from "../config/logger.js";

export const writeAuditLog = async ({ req, actorId, action, targetType, targetId, details }) => {
  const log = await prisma.auditLog.create({
    data: {
      actorId,
      action,
      targetType,
      targetId,
      details,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? "unknown",
    },
  });

  loggers.audit.info({
    eventType: "admin_action",
    userId: actorId,
    details: {
      action,
      targetType,
      targetId,
      auditId: log.id,
    },
  });

  return log;
};
