"use client";

import React from "react";

const UPDATES = [
  {
    id: 1,
    title: "Bulk Product Upload",
    badge: "NEW",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    date: "May 30, 2024",
    desc: "Upload multiple products using CSV file. Save time and manage inventory easily.",
    icon: "upload_file"
  },
  {
    id: 2,
    title: "Advanced Reports",
    badge: "NEW",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    date: "May 28, 2024",
    desc: "Get deeper insights with advanced filtering and custom date ranges.",
    icon: "monitoring"
  },
  {
    id: 3,
    title: "Multi-currency Support",
    badge: "IMPROVED",
    badgeColor: "bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/20",
    date: "May 25, 2024",
    desc: "Accept payments in multiple currencies with automatic conversion.",
    icon: "currency_exchange"
  }
];

export default function WhatsNew() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">What's New</h2>
          <p className="text-slate-400 mt-1 text-sm">Latest updates and release notes</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        
        <div className="p-6 space-y-6">
          {UPDATES.map((update) => (
            <div key={update.id} className="flex gap-4 pb-6 border-b border-zinc-800/60 last:border-0 last:pb-0">
              <div className="w-12 h-12 rounded-xl bg-[#1A1827] border border-zinc-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#8C63F5] text-[24px]">{update.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{update.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${update.badgeColor}`}>
                    {update.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{update.desc}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{update.date}</span>
                  <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
                    Try Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="px-6 py-4 border-t border-zinc-800/60 text-center bg-[#1A1827] rounded-b-2xl">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full">
            View all updates <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
