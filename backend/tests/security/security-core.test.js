import crypto from "node:crypto";
import request from "supertest";
import { describe, expect, it } from "vitest";
import "../setup-env.js";

const { default: app } = await import("../../src/app.js");

describe("Security core", () => {
  it("returns liveness health", async () => {
    const response = await request(app).get("/health/live");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("live");
  });

  it("reports readiness as not ready without live database", async () => {
    const response = await request(app).get("/health/ready");
    expect(response.status).toBe(503);
    expect(response.body.status).toBe("not_ready");
  });

  it("rejects CSRF on state-changing auth route", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("x-device-id", "1234567890abcdef1234567890abcdef")
      .send({ email: "user@example.com", password: "InvalidPass123!" });

    expect(response.status).toBe(403);
    expect(response.body.code).toBe("CSRF_VALIDATION_FAILED");
  });

  it("accepts signed monitoring webhook", async () => {
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
});
