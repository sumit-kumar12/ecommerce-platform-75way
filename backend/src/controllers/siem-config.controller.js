// ─── SIEM Configuration Controller ────────────────────────────────────────────
// Manages the SIEM config singleton, SIEM rules (ThreatRule extended),
// and the SIEM health status endpoint.

import { prisma } from "../config/prisma.js";
import { writeAuditLog } from "../services/audit.service.js";

// Mask sensitive API keys before returning to client
const maskKey = (key) => key ? `${"*".repeat(Math.max(0, key.length - 4))}${key.slice(-4)}` : null;
const maskConfig = (config) => config ? {
  ...config,
  vtApiKey:    maskKey(config.vtApiKey),
  abuseApiKey: maskKey(config.abuseApiKey),
  gnApiKey:    maskKey(config.gnApiKey),
  edrWebhookSecret: config.edrWebhookSecret ? "***configured***" : null,
} : null;

// ─── SIEM Config ──────────────────────────────────────────────────────────────

export const getSiemConfigController = async (req, res) => {
  try {
    const config = await prisma.siemConfig.findUnique({
      where: { id: "singleton" },
      include: { updatedBy: { select: { name: true, email: true } } },
    });
    return res.json({ config: maskConfig(config) });
  } catch {
    return res.status(500).json({ error: "Failed to fetch SIEM config" });
  }
};

export const updateSiemConfigController = async (req, res) => {
  try {
    const {
      enabled, sources, alertThreshold, enrichmentEnabled,
      vtApiKey, abuseApiKey, gnApiKey,
      edrWebhookUrl, edrWebhookSecret, retentionDays,
    } = req.body;

    const updated = await prisma.siemConfig.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        enabled: enabled ?? false,
        sources: sources ?? null,
        alertThreshold: alertThreshold ?? 10,
        enrichmentEnabled: enrichmentEnabled ?? false,
        vtApiKey:    vtApiKey    ?? null,
        abuseApiKey: abuseApiKey ?? null,
        gnApiKey:    gnApiKey    ?? null,
        edrWebhookUrl:    edrWebhookUrl    ?? null,
        edrWebhookSecret: edrWebhookSecret ?? null,
        retentionDays: retentionDays ?? 90,
        updatedById: req.user.id,
      },
      update: {
        ...(enabled !== undefined        && { enabled }),
        ...(sources                      && { sources }),
        ...(alertThreshold !== undefined && { alertThreshold: Number(alertThreshold) }),
        ...(enrichmentEnabled !== undefined && { enrichmentEnabled }),
        ...(vtApiKey    && { vtApiKey }),
        ...(abuseApiKey && { abuseApiKey }),
        ...(gnApiKey    && { gnApiKey }),
        ...(edrWebhookUrl    && { edrWebhookUrl }),
        ...(edrWebhookSecret && { edrWebhookSecret }),
        ...(retentionDays !== undefined && { retentionDays: Number(retentionDays) }),
        updatedById: req.user.id,
      },
    });

    await writeAuditLog({
      req, actorId: req.user.id, action: "SIEM_CONFIG_UPDATED",
      targetType: "SIEM", targetId: "singleton",
      details: { enabled, enrichmentEnabled, hasVtKey: !!vtApiKey },
    });

    return res.json({ config: maskConfig(updated) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update SIEM config" });
  }
};

// ─── SIEM Rules (ThreatRule CRUD) ─────────────────────────────────────────────

export const getSiemRulesController = async (req, res) => {
  try {
    const rules = await prisma.threatRule.findMany({ orderBy: { eventType: "asc" } });
    return res.json({ rules });
  } catch {
    return res.status(500).json({ error: "Failed to fetch SIEM rules" });
  }
};

export const createSiemRuleController = async (req, res) => {
  try {
    const { eventType, title, description, points, enabled, autoCreateCase, caseSeverity, caseTitle, notifyChannels } = req.body;
    if (!eventType || !title || points === undefined) {
      return res.status(400).json({ error: "eventType, title, and points are required" });
    }
    const rule = await prisma.threatRule.create({
      data: {
        eventType, title, description: description ?? "",
        points: Number(points), enabled: enabled ?? true,
        autoCreateCase: autoCreateCase ?? false,
        caseSeverity: caseSeverity ?? null,
        caseTitle: caseTitle ?? null,
        notifyChannels: notifyChannels ?? null,
        updatedById: req.user.id,
      },
    });
    await writeAuditLog({ req, actorId: req.user.id, action: "SIEM_RULE_CREATED", targetType: "SIEM_RULE", targetId: rule.id, details: { eventType } });
    return res.status(201).json({ rule });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "Rule with this eventType already exists" });
    return res.status(500).json({ error: "Failed to create SIEM rule" });
  }
};

export const updateSiemRuleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, points, enabled, autoCreateCase, caseSeverity, caseTitle, notifyChannels } = req.body;
    const rule = await prisma.threatRule.update({
      where: { id },
      data: {
        ...(title         && { title }),
        ...(description   && { description }),
        ...(points !== undefined && { points: Number(points) }),
        ...(enabled !== undefined && { enabled }),
        ...(autoCreateCase !== undefined && { autoCreateCase }),
        ...(caseSeverity  && { caseSeverity }),
        ...(caseTitle     && { caseTitle }),
        ...(notifyChannels && { notifyChannels }),
        updatedById: req.user.id,
      },
    });
    return res.json({ rule });
  } catch {
    return res.status(500).json({ error: "Failed to update SIEM rule" });
  }
};

export const deleteSiemRuleController = async (req, res) => {
  try {
    const { id } = req.params;
    // Soft delete — just disable
    await prisma.threatRule.update({ where: { id }, data: { enabled: false, updatedById: req.user.id } });
    await writeAuditLog({ req, actorId: req.user.id, action: "SIEM_RULE_DISABLED", targetType: "SIEM_RULE", targetId: id, details: {} });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to disable SIEM rule" });
  }
};

// ─── SIEM Status ──────────────────────────────────────────────────────────────

export const getSiemStatusController = async (req, res) => {
  try {
    const since24h = new Date(Date.now() - 86_400_000);
    const [config, ruleCount, activeRules, eventsToday, casesToday, logsToday] = await Promise.all([
      prisma.siemConfig.findUnique({ where: { id: "singleton" }, select: { enabled: true, enrichmentEnabled: true, edrWebhookUrl: true } }),
      prisma.threatRule.count(),
      prisma.threatRule.count({ where: { enabled: true, autoCreateCase: true } }),
      prisma.threatEvent.count({ where: { createdAt: { gte: since24h } } }),
      prisma.socCase.count({ where: { createdAt: { gte: since24h } } }),
      prisma.socLog.count({ where: { createdAt: { gte: since24h } } }),
    ]);

    const lastTrigger = await prisma.threatRule.findFirst({
      where: { lastTriggeredAt: { not: null } },
      orderBy: { lastTriggeredAt: "desc" },
      select: { lastTriggeredAt: true, eventType: true },
    });

    return res.json({
      siemEnabled:         config?.enabled ?? false,
      enrichmentEnabled:   config?.enrichmentEnabled ?? false,
      edrConfigured:       !!(config?.edrWebhookUrl),
      totalRules:          ruleCount,
      autoCreateRules:     activeRules,
      eventsLast24h:       eventsToday,
      casesAutoCreated24h: casesToday,
      logsIngested24h:     logsToday,
      lastRuleTrigger:     lastTrigger ?? null,
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch SIEM status" });
  }
};
