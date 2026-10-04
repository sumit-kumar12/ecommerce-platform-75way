"use client";

import React from "react";
import Link from "next/link";
import { Hourglass } from "../../../components/illustrations/Hourglass";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0E17] p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <Hourglass className="w-48 h-48 mb-6 animate-[rotate-slow_4s_linear_infinite]" />
        <h2 className="text-2xl font-bold text-white mb-3">Session Expired</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your session has expired due to inactivity. Please login again to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href="/login"
            className="px-6 py-3 bg-[#8C63F5] text-white rounded-lg font-medium hover:bg-[#7b53e4] transition-colors text-center shadow-lg shadow-[#8C63F5]/20"
          >
            Login Again
          </Link>
          <Link href="/" className="px-6 py-3 bg-[#1A1827] text-slate-200 border border-[#2d2c45] rounded-lg font-medium hover:bg-white/5 transition-colors text-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
