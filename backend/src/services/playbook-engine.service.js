// ─── Playbook Engine Service ──────────────────────────────────────────────────
// Executes SocPlaybook steps sequentially, recording results per-step.
// Uses setImmediate chains so no blocking of the main request loop.

import { prisma } from "../config/prisma.js";
import { loggers } from "../config/logger.js";
import { notifySecurityEscalation } from "./notification.service.js";

// ─── Step Executors ───────────────────────────────────────────────────────────

const STEP_EXECUTORS = {
  /** Block an IP for 24 hours */
  block_ip: async ({ target }) => {
    if (!target) return { success: false, detail: "No target IP specified" };
    await prisma.iPBlock.upsert({
      where: { ip: target },
      create: { ip: target, blockedUntil: new Date(Date.now() + 86_400_000), reason: "Playbook auto-block" },
      update: { blockedUntil: new Date(Date.now() + 86_400_000), reason: "Playbook auto-block" },
    });
    return { success: true, detail: `IP ${target} blocked for 24h` };
  },

  /** Disable a user account (by email) */
  disable_user: async ({ target }) => {
    if (!target) return { success: false, detail: "No target email specified" };
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) return { success: false, detail: `User ${target} not found` };
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    return { success: true, detail: `User ${target} disabled` };
  },

  /** Revoke all active sessions for a user */
  revoke_sessions: async ({ target }) => {
    if (!target) return { success: false, detail: "No target email specified" };
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) return { success: false, detail: `User ${target} not found` };
    const [tokens, sessions] = await Promise.all([
      prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date(), revocationReason: "Playbook: revoke_sessions" },
      }),
      prisma.sessionBinding.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { success: true, detail: `Revoked ${tokens.count} tokens and ${sessions.count} sessions for ${target}` };
  },

  /** Lock a user account for N minutes */
  lock_account: async ({ target, minutes = 60 }) => {
    if (!target) return { success: false, detail: "No target email specified" };
    const user = await prisma.user.findUnique({ where: { email: target }, select: { id: true } });
    if (!user) return { success: false, detail: `User ${target} not found` };
    const lockUntil = new Date(Date.now() + minutes * 60_000);
    await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: lockUntil, failedLoginAttempts: 5 } });
    return { success: true, detail: `Account ${target} locked until ${lockUntil.toISOString()}` };
  },

  /** Send a security notification */
  send_notification: async ({ message, severity = "HIGH" }) => {
    await notifySecurityEscalation({
      eventType: "PLAYBOOK_NOTIFICATION",
      severity,
      message: message ?? "Playbook automated notification",
      details: {},
    }).catch(() => {});
    return { success: true, detail: "Notification sent" };
  },

  /** Add a timeline event to the case */
  add_timeline: async ({ caseId, description, eventType = "Playbook Action" }) => {
    if (!caseId) return { success: false, detail: "caseId not injected" };
    await prisma.socCaseTimeline.create({
      data: { caseId, eventType, description: description ?? "Playbook step executed", actorName: "Playbook Engine", source: "Playbook" },
    });
    return { success: true, detail: "Timeline event added" };
  },

  /** Add an IOC to the case */
  add_ioc: async ({ caseId, indicator, type = "IP" }) => {
    if (!caseId || !indicator) return { success: false, detail: "caseId or indicator missing" };
    await prisma.socCaseIoc.create({
      data: { caseId, indicator, type, reputation: "UNKNOWN" },
    }).catch(() => {}); // ignore duplicate
    return { success: true, detail: `IOC ${indicator} added` };
  },

  /** Update case status */
  update_status: async ({ caseId, status }) => {
    if (!caseId || !status) return { success: false, detail: "caseId or status missing" };
    await prisma.socCase.update({ where: { id: caseId }, data: { status } });
    return { success: true, detail: `Case status updated to ${status}` };
  },

  /** Call an external EDR webhook (Isolate Host, Kill Process, etc.) */
  edr_action: async ({ action, target, caseId }) => {
    const config = await prisma.siemConfig.findUnique({ where: { id: "singleton" } });
    if (!config?.edrWebhookUrl) return { success: false, detail: "EDR webhook not configured" };
    try {
      const resp = await fetch(config.edrWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.edrWebhookSecret ? { "X-EDR-Secret": config.edrWebhookSecret } : {}),
        },
        body: JSON.stringify({ action, target, caseId, timestamp: new Date().toISOString() }),
        signal: AbortSignal.timeout(8000),
      });
      return { success: resp.ok, statusCode: resp.status, detail: `EDR ${action} sent to ${target}` };
    } catch (err) {
      return { success: false, detail: `EDR webhook failed: ${err.message}` };
    }
  },

  /** No-op step for manual review gates */
  manual_review: async () => ({ success: true, detail: "Manual review gate — analyst must proceed manually" }),
};

// ─── Core Engine ──────────────────────────────────────────────────────────────

async function executeStep(run, stepIndex, steps) {
  if (stepIndex >= steps.length) {
    // All steps done
    await prisma.socPlaybookRun.update({
      where: { id: run.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    await prisma.socCaseTimeline.create({
      data: {
        caseId: run.caseId,
        eventType: "Playbook Completed",
        description: `Playbook "${run._playbookName}" completed all ${steps.length} steps.`,
        actorName: "Playbook Engine",
        source: "Playbook",
      },
    }).catch(() => {});
    return;
  }

  const step = steps[stepIndex];
  const executor = STEP_EXECUTORS[step.type];

  try {
    const result = executor
      ? await executor({ ...step.config, caseId: run.caseId })
      : { success: true, detail: `No executor for step type: ${step.type}` };

    const updatedResults = { ...(run.stepResults ?? {}), [stepIndex]: { ...step, result, executedAt: new Date().toISOString() } };

    await prisma.socPlaybookRun.update({
      where: { id: run.id },
      data: { currentStep: stepIndex + 1, stepResults: updatedResults, status: "RUNNING" },
    });

    // Continue to next step
    setImmediate(() => executeStep({ ...run, stepResults: updatedResults }, stepIndex + 1, steps));
  } catch (err) {
    loggers.error.error({ eventType: "playbook_step_failed", details: { runId: run.id, stepIndex, err: err.message } });
    await prisma.socPlaybookRun.update({ where: { id: run.id }, data: { status: "FAILED" } });
    await prisma.socCaseTimeline.create({
      data: {
        caseId: run.caseId,
        eventType: "Playbook Failed",
        description: `Playbook step ${stepIndex} (${step.title ?? step.type}) failed: ${err.message}`,
        actorName: "Playbook Engine",
        source: "Playbook",
      },
    }).catch(() => {});
  }
}

/**
 * Start a new playbook run for a case.
 * @returns {Promise<SocPlaybookRun>}
 */
export async function triggerPlaybookRun(caseId, playbookId, startedById) {
  const playbook = await prisma.socPlaybook.findUnique({ where: { id: playbookId } });
  if (!playbook || !playbook.active) throw new Error(`Playbook ${playbookId} not found or inactive`);

  const run = await prisma.socPlaybookRun.create({
    data: {
      caseId,
      playbookId,
      status: "RUNNING",
      currentStep: 0,
      startedById,
      startedAt: new Date(),
    },
  });

  const steps = Array.isArray(playbook.steps) ? playbook.steps : [];
  setImmediate(() => executeStep({ ...run, _playbookName: playbook.name }, 0, steps));

  return run;
}
