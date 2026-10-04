// ─── SIEM Engine Service ──────────────────────────────────────────────────────
// Evaluated after every ThreatEvent is written. If a ThreatRule has
// autoCreateCase=true, this engine creates a real SocCase, seeds it with
// timeline + IOC entries, and optionally triggers a playbook.

import { prisma } from "../config/prisma.js";
import { loggers } from "../config/logger.js";
import { computeSlaDeadline, mapEventSeverityToCaseSeverity } from "./sla.service.js";
import { notifySecurityEscalation } from "./notification.service.js";

// ID of the SYSTEM user — populated from DB on first call
let _systemUserId = null;

async function getSystemUserId() {
  if (_systemUserId) return _systemUserId;
  const sys = await prisma.user.findFirst({
    where: { email: "system@katabazaar.internal" },
    select: { id: true },
  });
  _systemUserId = sys?.id ?? null;
  return _systemUserId;
}

/**
 * Build a unique, human-readable case number.
 */
async function buildCaseNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.socCase.count();
  return `CASE-${year}-${String(count + 1).padStart(6, "0")}`;
}

/**
 * Find an existing OPEN/IN_PROGRESS case that matches the same detection rule
 * and was created within the last 24 hours — to avoid duplicate case explosion.
 */
async function findRecentMatchingCase(eventRecord) {
  const since = new Date(Date.now() - 24 * 3_600_000);
  return prisma.socCase.findFirst({
    where: {
      detectionRule: eventRecord.eventType,
      status: { in: ["OPEN", "IN_PROGRESS"] },
      createdAt: { gte: since },
      ...(eventRecord.ip && eventRecord.ip !== "0.0.0.0"
        ? { iocs: { some: { indicator: eventRecord.ip } } }
        : {}),
    },
    select: { id: true, caseNumber: true },
  });
}

/**
 * Called from threat.service.js after a ThreatEvent is written.
 * @param {object} eventRecord  - the created ThreatEvent row
 * @param {number} updatedScore - the current cumulative threat score
 */
export async function evaluateSiemRules(eventRecord, updatedScore) {
  try {
    const siemConfig = await prisma.siemConfig.findUnique({ where: { id: "singleton" } });
    if (!siemConfig?.enabled) return; // SIEM disabled globally

    const rule = await prisma.threatRule.findUnique({
      where: { eventType: eventRecord.eventType },
    });
    if (!rule?.enabled || !rule?.autoCreateCase) return;

    const systemUserId = await getSystemUserId();
    if (!systemUserId) {
      loggers.security.warn({
        eventType: "siem_engine_no_system_user",
        details: { message: "SYSTEM user not seeded — run seed-system-user.js" },
      });
      return;
    }

    // Check for existing open case with same rule in last 24h
    const existing = await findRecentMatchingCase(eventRecord);
    if (existing) {
      // Merge event into existing case timeline — no new case created
      await prisma.socCaseTimeline.create({
        data: {
          caseId: existing.id,
          eventType: "SIEM Alert Correlated",
          description: `Additional ${eventRecord.eventType} event from IP ${eventRecord.ip} (score: ${updatedScore})`,
          actorName: "SIEM Engine",
          source: "SIEM",
          metadata: { eventId: eventRecord.id, ip: eventRecord.ip, score: updatedScore },
        },
      });
      loggers.security.info({
        eventType: "siem_engine_correlated",
        details: { existingCaseId: existing.id, caseNumber: existing.caseNumber },
      });
      return;
    }

    // Create new case
    const severity = rule.caseSeverity ?? mapEventSeverityToCaseSeverity(eventRecord.severity);
    const caseNumber = await buildCaseNumber();

    const newCase = await prisma.socCase.create({
      data: {
        caseNumber,
        title: rule.caseTitle ?? `${rule.title || eventRecord.eventType.replace(/_/g, " ")} detected`,
        description: `Auto-created by SIEM engine. Detection rule: ${rule.eventType}. Source IP: ${eventRecord.ip}.`,
        severity,
        priority: severity, // default priority = severity
        status: "OPEN",
        source: "SIEM Alert",
        sourceEventId: eventRecord.id,
        detectionRule: eventRecord.eventType,
        threatScore: updatedScore,
        confidence: 75,
        slaDeadline: computeSlaDeadline(severity),
        createdById: systemUserId,
        tags: JSON.stringify(["Auto-Created", "SIEM"]),
        mitreaTactics: JSON.stringify([]),
      },
    });

    // Seed timeline entry
    await prisma.socCaseTimeline.create({
      data: {
        caseId: newCase.id,
        eventType: "Case Created",
        description: `Auto-created from SIEM rule: ${rule.eventType}. Threat score: ${updatedScore}.`,
        actorName: "SIEM Engine",
        source: "SIEM",
        metadata: { ruleEventType: rule.eventType, ip: eventRecord.ip, score: updatedScore },
      },
    });

    // Seed IOC if IP is present and meaningful
    if (eventRecord.ip && eventRecord.ip !== "0.0.0.0" && eventRecord.ip !== "::1" && eventRecord.ip !== "127.0.0.1") {
      await prisma.socCaseIoc.create({
        data: {
          caseId: newCase.id,
          indicator: eventRecord.ip,
          type: "IP",
          reputation: "UNKNOWN",
          firstSeen: eventRecord.createdAt,
          lastSeen: eventRecord.createdAt,
        },
      });
    }

    // Seed audit entry
    await prisma.socCaseAudit.create({
      data: {
        caseId: newCase.id,
        actorName: "SIEM Engine",
        actorId: systemUserId,
        action: "Case Auto-Created",
        details: { caseNumber, rule: rule.eventType, ip: eventRecord.ip },
      },
    });

    // Auto-trigger playbook if rule has one configured
    if (rule.playbookId) {
      try {
        const { triggerPlaybookRun } = await import("./playbook-engine.service.js");
        await triggerPlaybookRun(newCase.id, rule.playbookId, systemUserId);
      } catch (pbErr) {
        loggers.security.warn({ eventType: "siem_engine_playbook_trigger_failed", details: { err: pbErr.message } });
      }
    }

    // Send notifications if configured
    if (rule.notifyChannels?.length) {
      await notifySecurityEscalation({
        eventType: "SIEM_CASE_AUTO_CREATED",
        severity,
        message: `New SOC case auto-created: ${caseNumber} — ${newCase.title}`,
        details: { caseId: newCase.id, caseNumber, ip: eventRecord.ip, score: updatedScore },
      }).catch(() => {}); // Non-fatal
    }

    loggers.security.info({
      eventType: "siem_engine_case_created",
      details: { caseId: newCase.id, caseNumber, severity, rule: rule.eventType },
    });
  } catch (err) {
    // Never throw from SIEM engine — it's a fire-and-forget side effect
    loggers.error.error({
      eventType: "siem_engine_error",
      details: { message: err.message, stack: err.stack?.slice(0, 500) },
    });
  }
}
