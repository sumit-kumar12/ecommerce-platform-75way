"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";
import { openRazorpayCheckout } from "../../../lib/razorpay";

export default function VerificationClient({ orderId, status, mode, reason }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status || "pending");
  const [currentReason, setCurrentReason] = useState(reason || "");
  const [retrying, setRetrying] = useState(false);
  
  const verified = currentStatus === "verified" && orderId;
  const cancelled = currentStatus === "cancelled";
  const failed = currentStatus === "failed" || cancelled;

  // We fetch user email to display if possible, otherwise use a placeholder
  const [userEmail, setUserEmail] = useState("Guest Customer");

  useEffect(() => {
    let active = true;
    apiRequest("/users/me", { csrf: false, refresh: false }).then((res) => {
      if (active && res.user?.email) setUserEmail(res.user.email);
      else if (active && res.user?.name) setUserEmail(res.user.name);
    }).catch(() => {
      if (active) setUserEmail("Guest Customer");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!orderId || verified) return undefined;
    let active = true;
    const checkStatus = async () => {
      try {
        const result = await apiRequest(`/payments/checkout/${orderId}/status`, { csrf: false });
        if (!active) return;
        if (result?.paymentStatus === "VERIFIED") {
          setCurrentStatus("verified");
          setCurrentReason("");
        } else if (result?.paymentStatus === "REFUNDED") {
          setCurrentStatus("failed");
          setCurrentReason("refunded");
        }
      } catch {}
    };
    void checkStatus();
    const interval = window.setInterval(checkStatus, 3000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [orderId, verified]);

  const retryPayment = useCallback(async () => {
    if (!orderId || retrying) return;
    setRetrying(true);
    try {
      const session = await apiRequest(`/payments/checkout/${orderId}/start`, { method: "POST" });
      if (!session?.providerOrder || !session?.gateway) {
        setCurrentStatus("failed");
        setCurrentReason("session_failed");
        return;
      }

      if (session.gateway.mode === "mock") {
        await apiRequest(`/payments/checkout/${orderId}/test-success`, { method: "POST" });
        setCurrentStatus("verified");
        setCurrentReason("");
        return;
      }

      const outcome = await openRazorpayCheckout({
        gateway: session.gateway,
        providerOrder: session.providerOrder,
        description: `Order ${orderId}`,
      });
      if (outcome.status === "gateway_unavailable") {
        setCurrentStatus("failed");
        setCurrentReason("gateway_unavailable");
        return;
      }
      if (outcome.status === "cancelled" || outcome.status === "failed") {
        const failureReason = outcome.status === "cancelled" ? "dismissed" : "provider_failed";
        await apiRequest(`/payments/checkout/${orderId}/incomplete`, {
          method: "POST",
          body: { reason: failureReason },
        });
        setCurrentStatus(outcome.status);
        setCurrentReason(failureReason);
        return;
      }

      await apiRequest("/payments/checkout/confirm", {
        method: "POST",
        body: {
          orderId,
          razorpayOrderId: outcome.paymentResult.razorpay_order_id,
          razorpayPaymentId: outcome.paymentResult.razorpay_payment_id,
          razorpaySignature: outcome.paymentResult.razorpay_signature,
        },
      });
      setCurrentStatus("verified");
      setCurrentReason("");
    } catch (error) {
      setCurrentStatus("failed");
      setCurrentReason("verification_failed");
    } finally {
      setRetrying(false);
    }
  }, [orderId, retrying]);

  return (
    <div className="min-h-screen bg-[#0F0E17] flex flex-col items-center pt-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-md mb-8 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#8B5CF6]">K3</span>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Katabazaar</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#1A1A2E] border border-white/5 shadow-2xl rounded-3xl p-8 relative overflow-hidden text-center">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-[#8B5CF6]/10 blur-[80px] pointer-events-none rounded-full" />
        
        {verified ? (
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <span className="material-symbols-outlined text-white text-4xl">check</span>
              </div>
              {/* Confetti dots mock */}
              <div className="absolute -top-4 -left-4 w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="absolute bottom-2 -left-2 w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="absolute -bottom-4 right-0 w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Thank You!</h2>
            <p className="text-gray-400 text-sm mb-8">Your order has been placed successfully.</p>

            <div className="bg-[#0F0E17] border border-white/5 rounded-2xl p-5 mb-8">
              <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Order ID</div>
              <div className="text-lg font-bold text-white mb-4 tracking-wider">{orderId.split("-")[0].toUpperCase()}</div>
              
              <div className="w-full h-px bg-white/5 mb-4"></div>
              
              <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Customer</div>
              <div className="text-sm font-medium text-white mb-4">{userEmail}</div>

              <div className="w-full h-px bg-white/5 mb-4"></div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Estimated Delivery</div>
                  <div className="text-sm font-bold text-white">{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href={`/order/${orderId}/confirmation`}
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-4 rounded-xl transition-colors duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] block"
              >
                Track Your Order
              </Link>
              <Link 
                href="/products"
                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold py-4 rounded-xl transition-colors duration-200 block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : failed ? (
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <span className="material-symbols-outlined text-white text-4xl">close</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
            <p className="text-gray-400 text-sm mb-8">{currentReason || "The payment session did not complete."}</p>
            <div className="space-y-3">
              <button 
                onClick={retryPayment}
                disabled={retrying}
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-4 rounded-xl transition-colors duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-70"
              >
                {retrying ? "Retrying..." : "Retry Payment"}
              </button>
              <Link 
                href="/checkout"
                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold py-4 rounded-xl transition-colors duration-200 block"
              >
                Return to Checkout
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative z-10 animate-in fade-in py-10">
            <div className="w-16 h-16 border-4 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying Payment...</h2>
            <p className="text-gray-400 text-sm">Please wait while we confirm your transaction securely.</p>
          </div>
        )}
      </div>
    </div>
  );
}
