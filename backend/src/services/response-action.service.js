// ─── Response Action Service ──────────────────────────────────────────────────
// Executes SOC response actions triggered manually from the UI.
// Each action: executes real logic + records SocResponseAction + SocCaseAudit + SocCaseTimeline.

import { prisma } from "../config/prisma.js";
import { loggers } from "../config/logger.js";

const ACTION_EXECUTORS = {
  "Block IP": async ({ target, reason, caseId }) => {
    if (!target) throw new Error("Target IP required");
    await prisma.iPBlock.upsert({
      where: { ip: target },
      create: { ip: target, blockedUntil: new Date(Date.now() + 86_400_000), reason: reason ?? `SOC Response: Block IP (${caseId})` },
      update: { blockedUntil: new Date(Date.now() + 86_400_000), reason: reason ?? `SOC Response: Block IP (${caseId})` },
    });
    return { detail: `IP ${target} blocked for 24 hours` };
  },

  "Block Domain": async ({ target, caseId }) => {
    if (!target) throw new Error("Target domain required");
    // Add to case IOC list as blocked domain — actual DNS blocking via EDR webhook
    await prisma.socCaseIoc.upsert({
      where: { id: "noop" }, // force create
      create: { caseId, indicator: target, type: "DOMAIN", reputation: "MALICIOUS" },
      update: {},
    }).catch(async () => {
      await prisma.socCaseIoc.create({ data: { caseId, indicator: target, type: "DOMAIN", reputation: "MALICIOUS" } });
    });
    return { detail: `Domain ${target} logged as malicious IOC` };
  },

  "Block URL": async ({ target, caseId }) => {
    if (!target) throw new Error("Target URL required");
    await prisma.socCaseIoc.create({ data: { caseId, indicator: target, type: "URL", reputation: "MALICIOUS" } }).catch(() => {});
    return { detail: `URL ${target} logged as malicious IOC` };
  },

  "Disable User": async ({ target }) => {
    if (!target) throw new Error("Target user email required");
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) throw new Error(`User ${target} not found`);
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    return { detail: `User ${target} account disabled` };
  },

  "Reset Password": async ({ target }) => {
    if (!target) throw new Error("Target user email required");
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) throw new Error(`User ${target} not found`);
    // Invalidate all password reset tokens, user must request new one
    await prisma.passwordResetToken.updateMany({ where: { userId: user.id }, data: { usedAt: new Date() } });
    return { detail: `Password reset tokens invalidated for ${target}. User must re-request.` };
  },

  "Revoke Session": async ({ target }) => {
    if (!target) throw new Error("Target user email required");
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) throw new Error(`User ${target} not found`);
    const [t, s] = await Promise.all([
      prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date(), revocationReason: "SOC Response: Revoke Session" },
      }),
      prisma.sessionBinding.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { detail: `Revoked ${t.count} refresh tokens and ${s.count} sessions for ${target}` };
  },

  "Lock Account": async ({ target }) => {
    if (!target) throw new Error("Target user email required");
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) throw new Error(`User ${target} not found`);
    const lockUntil = new Date(Date.now() + 24 * 3_600_000);
    await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: lockUntil, failedLoginAttempts: 5 } });
    return { detail: `Account ${target} locked for 24 hours until ${lockUntil.toISOString()}` };
  },

  "Block Merchant": async ({ target }) => {
    if (!target) throw new Error("Target merchant email required");
    const user = await prisma.user.findUnique({
      where: { email: target },
      select: { id: true, role: true },
    });
    if (!user) throw new Error(`Merchant ${target} not found`);
    if (!["PRODUCT_LISTER", "COMMERCE_ADMIN"].includes(user.role)) {
      throw new Error(`User ${target} is not a merchant role`);
    }
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    return { detail: `Merchant ${target} account blocked` };
  },

  "Disable API Key": async ({ target }) => {
    // Revoke all active access tokens by revoking session families
    // Without knowing the specific JTI, we expire all sessions for this user
    if (!target) throw new Error("Target user email required");
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) throw new Error(`User ${target} not found`);
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date(), revocationReason: "SOC Response: Disable API Key" },
    });
    return { detail: `All API sessions revoked for ${target}` };
  },

  "Isolate Host": async ({ target, caseId }) => {
    const config = await prisma.siemConfig.findUnique({ where: { id: "singleton" } });
    if (config?.edrWebhookUrl) {
      try {
        const resp = await fetch(config.edrWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(config.edrWebhookSecret ? { "X-EDR-Secret": config.edrWebhookSecret } : {}),
          },
          body: JSON.stringify({ action: "ISOLATE_HOST", target, caseId, timestamp: new Date().toISOString() }),
          signal: AbortSignal.timeout(8000),
        });
        return { detail: `EDR isolate request sent for ${target}`, webhookStatus: resp.status };
      } catch (err) {
        return { detail: `EDR webhook unreachable: ${err.message}. Action logged.`, warning: true };
      }
    }
    return { detail: `Host ${target} isolation request logged (no EDR webhook configured)`, warning: true };
  },

  "Kill Process": async ({ target, caseId }) => {
    const config = await prisma.siemConfig.findUnique({ where: { id: "singleton" } });
    if (config?.edrWebhookUrl) {
      try {
        const resp = await fetch(config.edrWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(config.edrWebhookSecret ? { "X-EDR-Secret": config.edrWebhookSecret } : {}) },
          body: JSON.stringify({ action: "KILL_PROCESS", target, caseId, timestamp: new Date().toISOString() }),
          signal: AbortSignal.timeout(8000),
        });
        return { detail: `EDR kill process request sent for ${target}`, webhookStatus: resp.status };
      } catch (err) {
        return { detail: `EDR webhook unreachable: ${err.message}. Logged.`, warning: true };
      }
    }
    return { detail: `Kill process for ${target} logged (no EDR webhook configured)`, warning: true };
  },

  "Quarantine File": async ({ target, caseId }) => {
    // Log evidence with quarantine flag — actual file quarantine via EDR
    await prisma.socCaseEvidence.create({
      data: { caseId, name: target ?? "Unknown File", type: "FILE", source: "SOC Response", integrity: "QUARANTINED" },
    }).catch(() => {});
    return { detail: `File ${target} quarantine request logged in evidence. Requires EDR for enforcement.`, warning: !target };
  },

  "Pause Orders": async ({ target }) => {
    // Lock the account so they can't place new orders
    if (!target) throw new Error("Target customer email required");
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) throw new Error(`Customer ${target} not found`);
    const lockUntil = new Date(Date.now() + 24 * 3_600_000);
    await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: lockUntil } });
    return { detail: `Orders paused for ${target} (account locked for 24h)` };
  },

  "Freeze Wallet": async ({ target }) => {
    // No wallet model yet — log as pending action
    return { detail: `Wallet freeze request for ${target} logged. Requires wallet module integration.`, warning: true };
  },
};

/**
 * Execute a SOC response action.
 * @param {string}  caseId        - The SocCase ID
 * @param {string}  actionType    - Action name e.g. "Block IP"
 * @param {string}  target        - Target (IP, email, hostname)
 * @param {string}  reason        - Analyst's reason
 * @param {string}  executedById  - Actor user ID
 * @param {string}  actorIp       - Actor IP for audit
 * @returns {Promise<{ action: SocResponseAction, result: object }>}
 */
export async function executeResponseAction({ caseId, actionType, target, reason, executedById, actorName, actorIp }) {
  const executor = ACTION_EXECUTORS[actionType];
  if (!executor) throw new Error(`Unknown action type: ${actionType}`);

  let result;
  let status = "EXECUTED";
  try {
    result = await executor({ target, reason, caseId });
  } catch (err) {
    result = { detail: err.message, error: true };
    status = "FAILED";
  }

  // Record the action
  const action = await prisma.socResponseAction.create({
    data: {
      caseId,
      actionType,
      target,
      reason,
      status,
      executedById,
      executedAt: new Date(),
      result,
    },
  });

  // Audit log
  await prisma.socCaseAudit.create({
    data: {
      caseId,
      actorId: executedById,
      actorName,
      actorIp,
      action: `Response Action: ${actionType}`,
      details: { target, reason, result, status },
    },
  });

  // Timeline entry
  await prisma.socCaseTimeline.create({
    data: {
      caseId,
      eventType: `Response: ${actionType}`,
      description: `${actionType} executed on target: ${target ?? "N/A"}. Result: ${result.detail ?? "OK"}`,
      actorId: executedById,
      actorName,
      source: "SOC Response",
      metadata: { target, reason, result, status },
    },
  });

  loggers.security.info({
    eventType: "soc_response_action_executed",
    details: { caseId, actionType, target, status, result },
  });

  return { action, result };
}
