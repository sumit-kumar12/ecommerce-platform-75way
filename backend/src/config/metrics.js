import client from "prom-client";

const registry = new client.Registry();

client.collectDefaultMetrics({
  register: registry,
  prefix: "merchent_",
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "merchent_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [registry],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new client.Counter({
  name: "merchent_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [registry],
});

const inflightRequestsGauge = new client.Gauge({
  name: "merchent_inflight_requests",
  help: "Current number of inflight HTTP requests",
  registers: [registry],
});

const securityEventsTotal = new client.Counter({
  name: "merchent_security_events_total",
  help: "Total security events by event type",
  labelNames: ["event_type"],
  registers: [registry],
});

const failedLoginAttemptsTotal = new client.Counter({
  name: "merchent_failed_login_attempts_total",
  help: "Total failed login attempts",
  registers: [registry],
});

const paymentMismatchTotal = new client.Counter({
  name: "merchent_payment_mismatch_total",
  help: "Total payment mismatch rejections",
  registers: [registry],
});

const honeypotHitsTotal = new client.Counter({
  name: "merchent_honeypot_hits_total",
  help: "Total honeypot/recon hits detected",
  registers: [registry],
});

export const observeHttpRequest = ({ method, route, statusCode, durationMs }) => {
  const labels = {
    method: String(method).toUpperCase(),
    route: String(route || "unknown"),
    status_code: String(statusCode),
  };

  httpRequestsTotal.inc(labels, 1);
  httpRequestDurationSeconds.observe(labels, durationMs / 1000);
};

export const setInflightRequestCount = (count) => {
  inflightRequestsGauge.set(Math.max(0, Number(count) || 0));
};

export const incrementSecurityEventMetric = (eventType) => {
  securityEventsTotal.inc({ event_type: String(eventType || "unknown") }, 1);
};

export const incrementFailedLoginMetric = () => {
  failedLoginAttemptsTotal.inc(1);
};

export const incrementPaymentMismatchMetric = () => {
  paymentMismatchTotal.inc(1);
};

export const incrementHoneypotHitMetric = () => {
  honeypotHitsTotal.inc(1);
};

export const getMetricsContentType = () => registry.contentType;

export const renderMetrics = async () => registry.metrics();
