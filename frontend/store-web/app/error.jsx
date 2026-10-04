"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrokenRobot } from "../components/illustrations/BrokenRobot";

export default function ServerErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
    try {
      fetch("/api-proxy/api/v1/client-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error?.message || "Unknown error",
          stack: error?.stack,
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          source: "store-web",
        }),
      }).catch(console.error);
    } catch (e) {
      console.error("Failed to report error", e);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <BrokenRobot className="w-48 h-48 mb-6 animate-shake" />
        <h1 className="text-6xl font-extrabold text-red-500 mb-2">500</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          We're working on fixing the issue. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-center shadow-lg shadow-red-500/20"
          >
            Try Again
          </button>
          <Link href="/" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
