"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";

export default function POSPayment() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCart = sessionStorage.getItem("pos_cart");
    const savedDisc = sessionStorage.getItem("pos_discount");
    const savedPhone = sessionStorage.getItem("pos_customer_phone");
    const savedName = sessionStorage.getItem("pos_customer_name");

    if (!savedCart || JSON.parse(savedCart).length === 0) {
      router.push("/store-pos/sale");
      return;
    }
    setCart(JSON.parse(savedCart));
    if (savedDisc) setDiscount(Number(savedDisc));
    if (savedPhone) setCustomerPhone(savedPhone);
    if (savedName) setCustomerName(savedName);
  }, [router]);

  // Compute subtotal without any discounts
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Compute item-level discounts
  const itemDiscountsTotal = cart.reduce((sum, item) => sum + ((item.itemDiscount || 0) * item.qty), 0);
  
  // Total discount to send to API
  const totalDiscount = discount + itemDiscountsTotal;
  
  const total = Math.max(0, rawSubtotal - totalDiscount);

  const handleCheckout = async () => {
    setProcessing(true);
    setError(null);
    try {
      const payload = {
        items: cart.map(c => ({ variantId: c.variantId, quantity: c.qty })),
        paymentMethod,
        customerName,
        customerPhone: customerPhone || undefined,
        discountAmount: totalDiscount
      };
      const res = await apiRequest("/pos/checkout", { method: "POST", body: payload });
      
      if (res.orderId) {
        sessionStorage.removeItem("pos_cart");
        sessionStorage.removeItem("pos_discount");
        sessionStorage.removeItem("pos_customer_phone");
        sessionStorage.removeItem("pos_customer_name");
        router.push(`/store-pos/receipt/${res.orderId}`);
      }
    } catch (err) {
      setError(err.message || "Checkout failed");
      setProcessing(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="flex h-full w-full max-w-5xl mx-auto p-6 gap-6 bg-[#0F0E17]">
      
      {/* Left - Payment Options */}
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold text-white">Payment Processing</h2>
        
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-xl p-6 space-y-6">
          
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-4">Customer Details (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Customer Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-[#8C63F5]"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +91 9876543210"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-[#8C63F5]"
                />
                <p className="text-[10px] text-zinc-500 mt-1">If registered, order connects to their account. If not, sends promo SMS.</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800/60"></div>

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              {['CASH', 'UPI', 'CARD'].map(method => (
                <button 
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-colors ${
                    paymentMethod === method 
                      ? "bg-[#8C63F5]/10 border-[#8C63F5] text-[#8C63F5]" 
                      : "bg-[#0F0E17] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {method === 'CASH' ? 'payments' : method === 'UPI' ? 'qr_code_scanner' : 'credit_card'}
                  </span>
                  <span className="font-medium text-sm">{method}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Cash Amounts */}
          {paymentMethod === 'CASH' && (
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Cash Input</h3>
              <div className="flex gap-2">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} className="px-4 py-2 bg-[#0F0E17] border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white hover:border-zinc-700">
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

        </div>
      </div>

      {/* Right Sidebar - Summary */}
      <div className="w-96 flex flex-col shrink-0 bg-[#1A1827] border border-zinc-800/60 rounded-xl overflow-hidden">
        
        <div className="p-6 border-b border-zinc-800/60">
          <h3 className="text-white font-medium text-lg">Order Summary</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-white">{item.name}</h4>
                <p className="text-xs text-zinc-500 mt-1">{item.qty} x ₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <span className="text-sm font-bold text-white">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-zinc-800/60 bg-[#1A1827]">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="h-px bg-zinc-800/60 my-2"></div>
            <div className="flex justify-between text-xl">
              <span className="text-white font-bold">Total Pay</span>
              <span className="font-bold text-[#8C63F5]">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex gap-3">
             <button onClick={() => router.push("/store-pos/sale")} className="w-1/3 py-4 rounded-xl bg-transparent border border-zinc-700 hover:bg-zinc-800 text-white font-medium transition-colors">
               Back
             </button>
             <button 
               onClick={handleCheckout}
               disabled={processing}
               className="w-2/3 py-4 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] disabled:opacity-50 text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20 flex justify-center items-center gap-2"
             >
               {processing ? (
                 <span className="material-symbols-outlined animate-spin text-sm">sync</span>
               ) : (
                 <span className="material-symbols-outlined text-sm">check_circle</span>
               )}
               {processing ? "Processing..." : "Complete Sale"}
             </button>
          </div>
        </div>

      </div>

    </div>
  );
}
