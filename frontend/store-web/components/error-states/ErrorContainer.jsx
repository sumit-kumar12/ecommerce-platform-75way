import React from "react";
import { StoreShell } from "../layout/StoreShell";

export function ErrorContainer({ children }) {
  // We provide dummy categories just to keep StoreShell from throwing, 
  // or we can just omit them if StoreShell handles it gracefully.
  return (
    <StoreShell
      categories={[]}
      headerOptions={{
        showSearch: false,
        showNav: true,
        showTheme: false,
        showNotifications: false,
        showWishlist: false,
        showCart: false,
        showAccount: true,
        showMobileCategories: false,
      }}
      footerOptions={{
        showCategories: false,
        showAccount: false,
        showSupport: true,
        compact: true,
      }}
    >
      <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8C63F5]/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Main Card */}
        <div className="w-full max-w-lg bg-[#121121] border border-[#2d2c45] rounded-3xl p-8 md:p-12 text-center shadow-2xl relative z-10 flex flex-col items-center">
          {children}
        </div>
      </div>
    </StoreShell>
  );
}
