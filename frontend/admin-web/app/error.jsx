"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrokenRobot } from "../components/illustrations/BrokenRobot";

export default function ServerErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Critical Admin App Error Caught:", error);
    try {
      fetch("/api-proxy/api/v1/client-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error?.message || "Unknown error",
          stack: error?.stack,
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          source: "admin-web",
        }),
      }).catch(console.error);
    } catch (e) {
      console.error("Failed to report error", e);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0E17] p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <BrokenRobot className="w-48 h-48 mb-6 animate-shake" />
        <h1 className="text-6xl font-extrabold text-red-500 mb-2">500</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong!</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We're working on fixing the issue. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-center shadow-lg shadow-red-500/20"
          >
            Try Again
          </button>
          <Link href="/" className="px-6 py-3 bg-[#1A1827] text-slate-200 border border-[#2d2c45] rounded-lg font-medium hover:bg-white/5 transition-colors text-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
