// ─── SLA Service ─────────────────────────────────────────────────────────────
// Computes SLA deadlines by severity and evaluates breach status.
// SLA hours are configurable via env vars; defaults fit enterprise SOC practices.

const SLA_HOURS = {
  CRITICAL:      Number(process.env.SLA_CRITICAL_HOURS)      || 1,
  HIGH:          Number(process.env.SLA_HIGH_HOURS)          || 4,
  MEDIUM:        Number(process.env.SLA_MEDIUM_HOURS)        || 24,
  LOW:           Number(process.env.SLA_LOW_HOURS)           || 72,
  INFORMATIONAL: Number(process.env.SLA_INFORMATIONAL_HOURS) || 168,
};

/**
 * Compute the SLA deadline for a new case.
 * @param {string} severity  - CaseSeverity enum value
 * @param {Date}   createdAt - optional; defaults to now
 * @returns {Date}
 */
export function computeSlaDeadline(severity, createdAt = new Date()) {
  const hours = SLA_HOURS[severity] ?? 24;
  return new Date(new Date(createdAt).getTime() + hours * 3_600_000);
}

/**
 * Evaluate SLA status for a case.
 * @param {Date|null}  slaDeadline
 * @param {string}     status        - CaseStatus
 * @returns {{ breached: boolean, label: string, remainingMs: number|null, percentage: number }}
 */
export function getSlaStatus(slaDeadline, status) {
  const terminal = ["RESOLVED", "CLOSED"];
  if (terminal.includes(status)) {
    return { breached: false, label: "Completed", remainingMs: null, percentage: 100 };
  }
  if (!slaDeadline) {
    return { breached: false, label: "No SLA", remainingMs: null, percentage: null };
  }

  const now = Date.now();
  const deadline = new Date(slaDeadline).getTime();
  const remaining = deadline - now;

  if (remaining <= 0) {
    return { breached: true, label: "SLA Breached", remainingMs: 0, percentage: 0 };
  }

  const totalMs = deadline - (deadline - 3_600_000 * 24); // 24h window for display
  const percentage = Math.max(0, Math.min(100, Math.round((remaining / totalMs) * 100)));

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);

  let label;
  if (h > 0) label = `${h}h ${m}m`;
  else if (m > 0) label = `${m}m ${s}s`;
  else label = `${s}s`;

  return { breached: false, label, remainingMs: remaining, percentage };
}

/**
 * Map EventSeverity → CaseSeverity
 */
export function mapEventSeverityToCaseSeverity(eventSeverity) {
  const map = { CRITICAL: "CRITICAL", WARN: "HIGH", INFO: "MEDIUM" };
  return map[eventSeverity] ?? "MEDIUM";
}
