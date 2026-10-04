import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import "../setup-env.js";

const { verifyRazorpaySignature, verifyRazorpayWebhookSignature } = await import("../../src/services/payment.service.js");

describe("Payment signature validation", () => {
  it("accepts a valid Razorpay HMAC signature", () => {
    const razorpayOrderId = "order_test_123";
    const razorpayPaymentId = "pay_test_456";
    const razorpayKeySecret = "live_secret_for_signature_validation";
    const razorpaySignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    expect(
      verifyRazorpaySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        razorpayKeySecret,
      }),
    ).toBe(true);
  });

  it("rejects an invalid Razorpay HMAC signature", () => {
    expect(
      verifyRazorpaySignature({
        razorpayOrderId: "order_test_123",
        razorpayPaymentId: "pay_test_456",
        razorpaySignature: "invalid_signature",
        razorpayKeySecret: "live_secret_for_signature_validation",
      }),
    ).toBe(false);
  });

  it("accepts a valid Razorpay webhook signature", () => {
    const rawBody = Buffer.from(JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: "pay_1" } } } }));
    const webhookSecret = "razorpay_webhook_signature_secret";
    const signature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

    expect(verifyRazorpayWebhookSignature({ rawBody, signature, webhookSecret })).toBe(true);
  });

  it("rejects a modified Razorpay webhook body", () => {
    const webhookSecret = "razorpay_webhook_signature_secret";
    const signature = crypto.createHmac("sha256", webhookSecret).update("original").digest("hex");

    expect(
      verifyRazorpayWebhookSignature({
        rawBody: Buffer.from("modified"),
        signature,
        webhookSecret,
      }),
    ).toBe(false);
  });
});
