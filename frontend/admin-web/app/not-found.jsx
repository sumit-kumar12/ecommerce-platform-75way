"use client";

import React from "react";
import Link from "next/link";
import { Astronaut } from "../components/illustrations/Astronaut";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0E17] p-4">
      <div className="text-center max-w-md mx-auto flex flex-col items-center">
        <Astronaut className="w-48 h-48 mb-6 animate-float" />
        <h1 className="text-6xl font-extrabold text-[#8C63F5] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Oops! Page not found</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/" className="px-6 py-3 bg-[#8C63F5] text-white rounded-lg font-medium hover:bg-[#7b53e4] transition-colors text-center shadow-lg shadow-[#8C63F5]/20">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
