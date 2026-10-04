"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";
import { formatCatalogPrice } from "../../lib/catalog";
import { getProductImageUrl } from "../../lib/catalog";

export default function CheckoutLayoutClient({ children }) {
  const pathname = usePathname();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/cart", { csrf: false, refresh: false })
      .then(res => {
        if (active && res.cart) setCart(res.cart);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Determine current step
  let currentStep = 1;
  if (pathname.includes("/delivery")) currentStep = 2;
  if (pathname.includes("/payment")) currentStep = 3;
  if (pathname.includes("/verification")) currentStep = 4;

  if (currentStep === 4) {
    // Payment Success screen doesn't show stepper/sidebar
    return children;
  }

  const subtotal = cart?.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
  const shipping = 0; // Handled dynamically in real app based on delivery method
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1A1A2E] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#8B5CF6]">K3</span>
            <span className="text-xl font-bold tracking-tight text-white uppercase">Katabazaar</span>
          </Link>

          {/* Stepper */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 1 ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-[#8B5CF6] text-white' : 'bg-gray-800'}`}>1</div>
              <span className="text-xs font-semibold">Shipping</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-[#8B5CF6]' : 'bg-gray-800'}`}></div>
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 2 ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-[#8B5CF6] text-white' : 'bg-gray-800'}`}>2</div>
              <span className="text-xs font-semibold">Delivery</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-[#8B5CF6]' : 'bg-gray-800'}`}></div>
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 3 ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-[#8B5CF6] text-white' : 'bg-gray-800'}`}>3</div>
              <span className="text-xs font-semibold">Payment</span>
            </div>
          </div>
          
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Forms) */}
          <div className="flex-1">
            {children}
          </div>

          {/* Right Column (Sidebar Summary) */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1A1A2E] border border-white/5 rounded-3xl p-6 sticky top-28 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <p className="text-gray-400">Loading cart...</p>
                ) : cart?.items?.map(item => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#0F0E17] rounded-xl overflow-hidden flex-shrink-0 border border-white/5 relative">
                      <img src={getProductImageUrl(item.product) || "/placeholder.png"} alt={item.title} className="w-full h-full object-contain p-2" />
                      <span className="absolute -top-1 -right-1 bg-[#8B5CF6] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-[#1A1A2E]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{item.title}</h4>
                      <p className="text-gray-500 text-xs mt-1">{item.product?.category?.name || "Product"}</p>
                      <strong className="text-white text-sm mt-1 block">{formatCatalogPrice(item.price)}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Items ({cart?.items?.length || 0})</span>
                  <span className="text-white font-medium">{formatCatalogPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-medium">FREE</span>
                </div>
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-lg font-bold text-white">{formatCatalogPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
