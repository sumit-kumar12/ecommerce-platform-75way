"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    label: "DESIGN SYSTEM",
    items: [
      { href: "/design-system/foundations", label: "Foundations", icon: "layers" },
      { href: "/design-system/components", label: "Components", icon: "category" },
      { href: "/design-system/tokens", label: "Tokens & Theme", icon: "token" },
      { href: "/design-system/icons", label: "Icon Library", icon: "emoji_symbols" },
      { href: "/design-system/illustrations", label: "Illustrations", icon: "image" },
      { href: "/design-system/motion", label: "Motion", icon: "animation" },
    ]
  },
  {
    label: "RESOURCES",
    items: [
      { href: "/design-system/brand-assets", label: "Brand Assets", icon: "folder_zip" },
      { href: "/design-system/guidelines", label: "Usage Guidelines", icon: "menu_book" },
      { href: "/design-system/best-practices", label: "Best Practices", icon: "verified" },
    ]
  },
  {
    label: "DEVELOPERS",
    items: [
      { href: "/design-system/install", label: "Install & Setup", icon: "terminal" },
      { href: "/design-system/api", label: "API & Usage", icon: "api" },
      { href: "/design-system/changelog", label: "Changelog", icon: "history" },
    ]
  }
];

export default function DesignSystemLayout({ children }) {
  const pathname = usePathname() || "";
  
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      
      {/* Design System Sidebar */}
      <aside className="w-[280px] shrink-0 bg-[#0B1120] border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-300">
        <div className="p-6">
          <Link href="/design-system/foundations" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#4F46E5] text-white flex items-center justify-center font-bold text-lg">
              K
            </div>
            <div>
              <div className="text-[15px] font-bold text-white tracking-wide leading-tight">
                KATABAZAAR
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider">
                DESIGN SYSTEM
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-8 custom-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                {group.label}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-[#4F46E5] text-white shadow-sm" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-[#1E293B] rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-1">Need help?</p>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Check our guidelines to build consistent products.
            </p>
            <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              View Guidelines
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
        {/* Scrollable Content (Header is part of the page content in the design) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
          {children}
        </main>
      </div>

    </div>
  );
}
