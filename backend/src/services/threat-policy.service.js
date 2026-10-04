import { prisma } from "../config/prisma.js";
import { loggers } from "../config/logger.js";
import { THREAT_POINTS } from "../config/constants.js";
import { env } from "../config/env.js";

const DEFAULT_RULES = [
  {
    eventType: "credential_stuffing_threshold_reached",
    title: "Credential Stuffing",
    description: "High-volume authentication attempts matching stuffing patterns.",
    points: THREAT_POINTS.AUTH_STUFFING_PATTERN,
  },
  {
    eventType: "failed_login_unknown_email",
    title: "Failed Login (Unknown Email)",
    description: "Login attempt with an email address not present in the user directory.",
    points: THREAT_POINTS.FAILED_LOGIN,
  },
  {
    eventType: "failed_login_password_mismatch",
    title: "Failed Login (Password Mismatch)",
    description: "Login attempt failed due to invalid credentials.",
    points: THREAT_POINTS.FAILED_LOGIN,
  },
  {
    eventType: "invalid_refresh_token_signature",
    title: "Invalid Refresh Token",
    description: "Refresh token failed cryptographic verification or policy checks.",
    points: THREAT_POINTS.TOKEN_REUSE,
  },
  {
    eventType: "refresh_token_reuse_detected",
    title: "Refresh Token Reuse",
    description: "Refresh token reuse or device mismatch detected.",
    points: THREAT_POINTS.TOKEN_REUSE,
  },
  {
    eventType: "payment_amount_mismatch",
    title: "Payment Amount Mismatch",
    description: "Client-reported payment amount does not match server-calculated amount.",
    points: THREAT_POINTS.PAYMENT_MISMATCH,
  },
  {
    eventType: "recon_attempt_blocked",
    title: "Recon Attempt",
    description: "Suspicious path or query patterns indicating reconnaissance activity.",
    points: THREAT_POINTS.RECON_ATTEMPT,
  },
  {
    eventType: "recon_path_blocked",
    title: "Recon Path Probe",
    description: "Request path matched a high-risk reconnaissance signature.",
    points: THREAT_POINTS.RECON_ATTEMPT,
  },
  {
    eventType: "sql_pattern_detected",
    title: "SQL Injection Pattern",
    description: "Input matched SQL injection signatures.",
    points: THREAT_POINTS.SQL_PATTERN,
  },
  {
    eventType: "xss_pattern_detected",
    title: "XSS Pattern",
    description: "Input matched cross-site scripting signatures.",
    points: THREAT_POINTS.XSS_PATTERN,
  },
  {
    eventType: "rate_limit_triggered",
    title: "Rate Limit Trigger",
    description: "Request rate exceeded policy thresholds.",
    points: THREAT_POINTS.RATE_LIMIT_TRIGGER,
  },
  {
    eventType: "admin_bulk_ip_block",
    title: "Admin Bulk IP Block",
    description: "Administrative bulk action applied IP blocks to user-associated IP addresses.",
    points: THREAT_POINTS.RECON_ATTEMPT,
  },
];

let cache = {
  loadedAt: 0,
  ttlMs: 5000,
  byEventType: new Map(DEFAULT_RULES.map((rule) => [rule.eventType, { ...rule, enabled: true }])),
};

const loadRulesFromDb = async () => {
  const rows = await prisma.threatRule.findMany();
  const next = new Map();
  for (const row of rows) next.set(row.eventType, row);
  cache = { ...cache, loadedAt: Date.now(), byEventType: next };
  return next;
};

export const ensureThreatRuleDefaults = async () => {
  for (const rule of DEFAULT_RULES) {
    await prisma.threatRule.upsert({
      where: { eventType: rule.eventType },
      create: {
        eventType: rule.eventType,
        title: rule.title,
        description: rule.description,
        points: rule.points,
        enabled: true,
      },
      update: {
        title: rule.title,
        description: rule.description,
      },
    });
  }
  await loadRulesFromDb();
  loggers.app.info({ eventType: "threat_rule_defaults_ensured", details: { count: DEFAULT_RULES.length } });
};

export const listThreatRules = async () => {
  const rows = await prisma.threatRule.findMany({
    orderBy: { eventType: "asc" },
  });
  return rows;
};

export const updateThreatRules = async ({ actorId, rules }) => {
  const existing = await prisma.threatRule.findMany({
    where: { eventType: { in: rules.map((r) => r.eventType) } },
    select: { eventType: true },
  });
  const existingSet = new Set(existing.map((r) => r.eventType));

  const updates = [];
  for (const rule of rules) {
    if (!existingSet.has(rule.eventType)) continue;
    updates.push(
      prisma.threatRule.update({
        where: { eventType: rule.eventType },
        data: {
          points: rule.points,
          enabled: rule.enabled,
          updatedById: actorId,
        },
      }),
    );
  }

  const results = await prisma.$transaction(updates);
  await loadRulesFromDb();
  loggers.security.warn({
    eventType: "threat_rules_updated",
    userId: actorId,
    details: { updatedCount: results.length },
  });
  return results.length;
};

export const resolveThreatRule = async (eventType) => {
  if (env.NODE_ENV === "test") {
    return cache.byEventType.get(eventType) ?? { eventType, points: 1, enabled: true };
  }

  const now = Date.now();
  if (now - cache.loadedAt > cache.ttlMs) {
    try {
      await loadRulesFromDb();
    } catch (error) {
      loggers.error.error({
        eventType: "threat_rule_cache_refresh_failed",
        details: { message: error.message },
      });
    }
  }

  const found = cache.byEventType.get(eventType);
  if (found) return found;

  // Unknown rule types are treated as enabled with 1 point to avoid
  // silently dropping threat signals for newly introduced event types.
  return { eventType, points: 1, enabled: true };
};
