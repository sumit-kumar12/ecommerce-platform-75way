"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCheckoutStore } from "../../../lib/store/checkoutStore";
import { apiRequest } from "../../../lib/api";
import { openRazorpayCheckout } from "../../../lib/razorpay";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, shippingAddress, reset } = useCheckoutStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let orderId = createdOrderId;

      if (!orderId) {
        let normalizedPhone = shippingAddress.phone.replace(/[^\d+]/g, "");
        if (normalizedPhone && !normalizedPhone.startsWith("+")) {
          normalizedPhone = "+91" + normalizedPhone;
        }

        const { deliveryDate, deliveryTimeSlot, shippingMethod } = useCheckoutStore.getState();
        const orderData = {
          paymentMethod: paymentMethod === "COD" ? "COD" : "ONLINE",
          shippingAddress: {
            fullName: shippingAddress.fullName.trim(),
            line1: shippingAddress.line1,
            line2: shippingAddress.line2 || "",
            city: shippingAddress.city,
            state: shippingAddress.state || "Delhi",
            postalCode: shippingAddress.postalCode,
            country: "India",
            phone: normalizedPhone || "+910000000000",
          },
          notes: `Shipping Method: ${shippingMethod}, Date: ${deliveryDate}, Slot: ${deliveryTimeSlot}`,
        };

        const res = await apiRequest("/orders", {
          method: "POST",
          body: orderData,
        });

        if (!res?.order) throw new Error("Failed to create order");
        orderId = res.order.id;
        setCreatedOrderId(orderId);
      }

      if (paymentMethod === "COD") {
        router.push(`/checkout/verification?orderId=${orderId}&status=verified`);
        reset();
        return;
      }

      const paymentSession = await apiRequest(`/payments/checkout/${orderId}/start`, {
        method: "POST",
      });

      const providerOrder = paymentSession?.providerOrder;
      const gateway = paymentSession?.gateway;

      if (!providerOrder || !gateway) {
        router.push(`/checkout/verification?orderId=${orderId}&status=failed&reason=session_failed`);
        return;
      }

      if (gateway.mode === "mock") {
        await apiRequest(`/payments/checkout/${orderId}/test-success`, { method: "POST" });
        router.push(`/checkout/verification?orderId=${orderId}&status=verified&mode=mock`);
        reset();
        return;
      }

      const outcome = await openRazorpayCheckout({
        gateway,
        providerOrder,
        description: `Order ${orderId}`,
        prefill: {
          name: shippingAddress.fullName,
          email: "customer@example.com",
          contact: shippingAddress.phone,
        },
      });

      if (outcome.status === "success") {
        await apiRequest(`/payments/verify`, {
          method: "POST",
          body: {
            orderId: orderId,
            razorpayPaymentId: outcome.paymentResult.razorpay_payment_id,
            razorpayOrderId: outcome.paymentResult.razorpay_order_id,
            razorpaySignature: outcome.paymentResult.razorpay_signature,
          },
        });
        router.push(`/checkout/verification?orderId=${orderId}&status=verified`);
        reset();
      } else if (outcome.status === "cancelled") {
        setError("Payment cancelled by user.");
        setLoading(false);
      } else {
        router.push(`/checkout/verification?orderId=${orderId}&status=failed&reason=provider_failed`);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A2E] border border-white/5 shadow-2xl rounded-3xl p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Secure Checkout</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        
        {/* Razorpay Option */}
        <button
          type="button"
          onClick={() => setPaymentMethod("UPI")} // We map all online to UPI in store for convenience, but order payload is ONLINE
          className={`w-full flex items-center p-6 rounded-2xl border transition-all duration-300 text-left ${
            paymentMethod !== "COD"
              ? "bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
              : "bg-[#0F0E17] border-white/10 hover:border-white/30"
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-5 ${paymentMethod !== "COD" ? 'border-[#8B5CF6]' : 'border-gray-600'}`}>
            {paymentMethod !== "COD" && <div className="w-3 h-3 bg-[#8B5CF6] rounded-full"></div>}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className={`material-symbols-outlined ${paymentMethod !== "COD" ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>shield_lock</span>
              <span className={`font-bold text-lg ${paymentMethod !== "COD" ? 'text-white' : 'text-gray-400'}`}>Pay Securely via Razorpay</span>
            </div>
            <p className="text-sm text-gray-500">
              UPI, Credit/Debit Cards, Net Banking, and Wallets.
            </p>
            <div className="flex items-center gap-2 mt-3 opacity-60">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
          </div>
        </button>

        {/* COD Option */}
        <button
          type="button"
          onClick={() => setPaymentMethod("COD")}
          className={`w-full flex items-center p-6 rounded-2xl border transition-all duration-300 text-left ${
            paymentMethod === "COD"
              ? "bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
              : "bg-[#0F0E17] border-white/10 hover:border-white/30"
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-5 ${paymentMethod === "COD" ? 'border-[#8B5CF6]' : 'border-gray-600'}`}>
            {paymentMethod === "COD" && <div className="w-3 h-3 bg-[#8B5CF6] rounded-full"></div>}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className={`material-symbols-outlined ${paymentMethod === "COD" ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>payments</span>
              <span className={`font-bold text-lg ${paymentMethod === "COD" ? 'text-white' : 'text-gray-400'}`}>Cash on Delivery (COD)</span>
            </div>
            <p className="text-sm text-gray-500">
              Pay when you receive the order at your doorstep.
            </p>
          </div>
        </button>

        <div className="pt-6 border-t border-white/10 flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/checkout/delivery")}
            className="w-1/3 bg-[#0F0E17] border border-white/10 hover:bg-white/5 text-white font-semibold py-4 rounded-xl transition-colors duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-2/3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-4 rounded-xl transition-colors duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order (COD)" : "Proceed to Razorpay"}
            {!loading && <span className="material-symbols-outlined text-sm">{paymentMethod === "COD" ? "local_shipping" : "lock"}</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
