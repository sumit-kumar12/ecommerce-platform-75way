"use client";

export const loadRazorpayCheckout = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector('script[data-katabazaar-razorpay="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.katabazaarRazorpay = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const openRazorpayCheckout = async ({ gateway, providerOrder, description, prefill = {} }) => {
  const loaded = await loadRazorpayCheckout();
  if (!loaded || !window.Razorpay) {
    return { status: "gateway_unavailable" };
  }

  return new Promise((resolve) => {
    let settled = false;
    const settle = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || gateway.keyId,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      name: gateway.merchantLabel || "Katabazaar",
      description,
      order_id: providerOrder.id,
      prefill,
      retry: { enabled: true, max_count: 2 },
      remember_customer: false,
      send_sms_hash: true,
      theme: { color: "#5048e5" },
      modal: {
        confirm_close: true,
        escape: false,
        ondismiss: () => settle({ status: "cancelled" }),
      },
      handler: (paymentResult) => settle({ status: "success", paymentResult }),
    });

    razorpay.on("payment.failed", (response) => {
      settle({ status: "failed", error: response?.error ?? null });
    });
    razorpay.open();
  });
};
