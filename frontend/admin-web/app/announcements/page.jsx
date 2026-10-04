"use client";

import React from "react";
import Link from "next/link";

const ANNOUNCEMENTS = [
  { 
    id: 1, 
    title: "Scheduled Maintenance", 
    type: "Important", 
    typeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    date: "May 31, 2024",
    content: "We will be performing scheduled maintenance on June 2, 2024 from 12:00 AM to 3:00 AM. During this time, the merchant portal will be read-only." 
  },
  { 
    id: 2, 
    title: "New Feature: Bulk Product Upload", 
    type: "New", 
    typeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    date: "May 29, 2024",
    content: "You can now upload multiple products at once using a CSV file. Go to Products > Bulk Import to try it out!" 
  },
  { 
    id: 3, 
    title: "Payout Timeline Update", 
    type: "Update", 
    typeColor: "bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/20",
    date: "May 27, 2024",
    content: "Payouts will now be processed within 24-48 hours of settlement. You can track your payout status directly from the Finance > Payouts tab." 
  },
  { 
    id: 4, 
    title: "GST Invoice Now Available", 
    type: "Update", 
    typeColor: "bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/20",
    date: "May 25, 2024",
    content: "Download GST Invoices directly from your dashboard under the Finance > Invoices section." 
  },
];

export default function Announcements() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Announcements</h2>
          <p className="text-slate-400 mt-1 text-sm">Share important updates</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#8C63F5] hover:bg-[#7b53de] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">add</span> New Announcement
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8 p-6 space-y-6">
        
        {ANNOUNCEMENTS.map((ann) => (
          <div key={ann.id} className="bg-[#1A1827] border border-zinc-800/60 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">{ann.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ann.typeColor}`}>
                  {ann.type}
                </span>
              </div>
              <span className="text-xs text-zinc-500">{ann.date}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {ann.content}
            </p>
          </div>
        ))}

        <div className="pt-4 text-center">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
            View all announcements →
          </button>
        </div>
      </div>
    </div>
  );
}
