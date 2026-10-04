"use client";

import React from "react";
import Link from "next/link";
import { Hourglass } from "../../components/illustrations/Hourglass";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <Hourglass className="w-48 h-48 mb-6 animate-[rotate-slow_4s_linear_infinite]" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Session Expired</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Your session has expired due to inactivity. Please login again to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href="/login"
            className="px-6 py-3 bg-purple-600 dark:bg-[#8C63F5] text-white rounded-lg font-medium hover:bg-purple-700 dark:hover:bg-[#7b53e4] transition-colors text-center shadow-lg shadow-purple-600/20"
          >
            Login Again
          </Link>
          <Link href="/" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
