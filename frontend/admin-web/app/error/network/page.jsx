"use client";

import React from "react";
import Link from "next/link";
import { Offline } from "../../../components/illustrations/Offline";

export default function NetworkErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0E17] p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <Offline className="w-48 h-48 mb-6 animate-bounce" />
        <h2 className="text-2xl font-bold text-white mb-3">You're offline</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          It looks like you lost your internet connection. Please check your connection and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#8C63F5] text-white rounded-lg font-medium hover:bg-[#7b53e4] transition-colors text-center shadow-lg shadow-[#8C63F5]/20"
          >
            Retry
          </button>
          <Link href="/" className="px-6 py-3 bg-[#1A1827] text-slate-200 border border-[#2d2c45] rounded-lg font-medium hover:bg-white/5 transition-colors text-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
