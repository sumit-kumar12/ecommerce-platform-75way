import crypto from "node:crypto";
import request from "supertest";
import { describe, expect, it } from "vitest";
import "../setup-env.js";

const { default: app } = await import("../../src/app.js");
const { env } = await import("../../src/config/env.js");

describe("Security defenses", () => {
  it("blocks honeypot path with not found response", async () => {
    const response = await request(app).get(env.HONEYPOT_PATH);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not Found");
  });

  it("blocks sensitive paths with not found response", async () => {
    const response = await request(app).get("/.env");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not Found");
  });

  it("blocks recon scanning paths with not found response", async () => {
    const response = await request(app).get("/wp-admin");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not Found");
  });

  it("rejects SQL injection patterns in search query", async () => {
    const response = await request(app).get("/api/v1/products/search").query({
      q: "1 UNION SELECT email,password FROM users",
      page: "1",
      pageSize: "20",
    });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("SUSPICIOUS_SQL_INPUT");
  });

  it("rejects XSS patterns in search query", async () => {
    const response = await request(app).get("/api/v1/products/search").query({
      q: "<script>alert(1)</script>",
      page: "1",
      pageSize: "20",
    });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("SUSPICIOUS_XSS_INPUT");
  });

  it("hides admin surface on admin host without admin session", async () => {
    const response = await request(app)
      .get(`/${env.ADMIN_ROUTE_PREFIX}/security/overview`)
      .set("Host", env.ADMIN_SUBDOMAIN);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not Found");
  });

  it("rejects monitoring webhook when signature is missing", async () => {
    const response = await request(app).post("/api/v1/monitoring/alerts/webhook").send({
      eventType: "ALERT_TEST",
      severity: "WARN",
      message: "Missing signature",
      source: "test",
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("ALERT_SIGNATURE_REQUIRED");
  });

  it("rejects monitoring webhook with invalid signature", async () => {
    const response = await request(app)
      .post("/api/v1/monitoring/alerts/webhook")
      .set("x-alert-signature", "deadbeef")
      .send({
        eventType: "ALERT_TEST",
        severity: "WARN",
        message: "Invalid signature",
        source: "test",
      });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("ALERT_SIGNATURE_INVALID");
  });

  it("accepts signed monitoring webhook payload", async () => {
    const payload = {
      eventType: "ALERT_TEST",
      severity: "INFO",
      message: "Synthetic monitoring signal",
      source: "alertmanager-test",
    };
    const signature = crypto
      .createHmac("sha256", process.env.ALERT_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    const response = await request(app)
      .post("/api/v1/monitoring/alerts/webhook")
      .set("x-alert-signature", signature)
      .send(payload);

    expect(response.status).toBe(202);
    expect(response.body.status).toBe("accepted");
  });

  it("rejects Razorpay webhook when signature is missing", async () => {
    const response = await request(app).post("/api/v1/payments/webhooks/razorpay").send({
      event: "test.unknown",
      payload: {},
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_RAZORPAY_WEBHOOK_SIGNATURE");
  });

  it("accepts a valid signed Razorpay webhook before lockout/auth guards", async () => {
    const payload = {
      event: "test.unknown",
      payload: {},
    };
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    const response = await request(app)
      .post("/api/v1/payments/webhooks/razorpay")
      .set("x-razorpay-signature", signature)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.received).toBe(true);
    expect(response.body.handled).toBe(false);
  });

  it("requires bearer token for metrics endpoint", async () => {
    const unauthorized = await request(app).get("/metrics");
    expect(unauthorized.status).toBe(401);
    expect(unauthorized.body.code).toBe("METRICS_UNAUTHORIZED");

    const authorized = await request(app).get("/metrics").set("authorization", `Bearer ${process.env.METRICS_TOKEN}`);
    expect(authorized.status).toBe(200);
    expect(authorized.text.includes("merchent_http_requests_total")).toBe(true);
  });
});
