"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { useStoreCategories } from "../../lib/useStoreCategories";

export default function TrackOrderPage() {
  const router = useRouter();
  const { categories } = useStoreCategories();
  const [orderId, setOrderId] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Clean up order ID in case user pasted a URL or extra spaces
      const cleanId = orderId.trim().replace(/^#/, "");
      router.push(`/account/orders/${cleanId}`);
    }
  };

  return (
    <StoreShell
      categories={categories}
      headerOptions={{
        showSearch: true,
        showNav: true,
        showTheme: true,
        showNotifications: true,
        showWishlist: true,
        showCart: true,
        showAccount: true,
        showMobileCategories: true,
      }}
    >
      <div className="bg-[#0f0e17] min-h-[80vh] flex flex-col items-center justify-center p-4">
        
        <div className="max-w-md w-full bg-[#121121] border border-[#2d2c45] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8C63F5]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#1a192b] border border-[#2d2c45] rounded-full flex items-center justify-center mb-4 text-[#8C63F5] shadow-lg">
              <span className="material-symbols-outlined text-[32px]">local_shipping</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Track Your Order</h1>
            <p className="text-slate-400 text-sm">Enter your Order ID below to get real-time shipping and delivery updates.</p>
          </div>

          <form onSubmit={handleTrack} className="relative z-10 space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Order ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">tag</span>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-12345678"
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#8C63F5] transition-colors placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={!orderId.trim()}
              className="w-full bg-[#8C63F5] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 flex items-center justify-center gap-2"
            >
              Track Order
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#2d2c45] text-center relative z-10">
            <p className="text-sm text-slate-400">
              Want to see all your past purchases? <br/>
              <Link href="/account/orders" className="text-[#8C63F5] font-bold hover:underline inline-block mt-2">View all my orders</Link>
            </p>
          </div>
        </div>

      </div>
    </StoreShell>
  );
}
