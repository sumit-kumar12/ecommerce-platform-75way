"use client";

import React from "react";
import Link from "next/link";

export default function Settlements() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/finance" className="hover:text-slate-300 transition-colors">Finance</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Settlements</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Settlements</h2>
          <p className="text-slate-400 mt-1 text-sm">View settlement and reconciliation details</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors h-10 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8">
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col max-w-3xl">
          <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white">Settlement #SETT-1286</h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Settled
              </span>
            </div>
            <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">download</span> Download
            </button>
          </div>
          
          <div className="p-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Settlement Amount</p>
                <p className="text-xl font-bold text-white">₹12,45,600</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Orders</p>
                <p className="text-xl font-bold text-white">235</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Start Date</p>
                <p className="text-sm font-medium text-white">May 24, 2024</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">End Date</p>
                <p className="text-sm font-medium text-white">May 30, 2024</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Payment Method</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="material-symbols-outlined text-[16px] text-zinc-400">account_balance</span>
                  Bank Transfer
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Settled On</p>
                <p className="text-sm font-medium text-white">May 31, 2024</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-zinc-500 mb-1">Reference ID</p>
                <p className="text-sm font-medium text-white">SETT1234567890</p>
              </div>
            </div>

            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-t border-zinc-800/60 pt-6">Breakdown</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Order Amount</span>
                <span className="text-white font-medium text-sm">₹13,20,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Discounts</span>
                <span className="text-red-400 font-medium text-sm">-₹45,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Returns</span>
                <span className="text-red-400 font-medium text-sm">-₹13,350</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Platform Fees</span>
                <span className="text-red-400 font-medium text-sm">-₹1,38,270</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">GST (18%)</span>
                <span className="text-red-400 font-medium text-sm">-₹78,000</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60">
                <span className="text-white font-bold">Net Settlement</span>
                <span className="text-[#8C63F5] font-bold text-lg">₹12,45,600</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-zinc-800/60 text-center">
            <Link href="/finance/reconciliation" className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
              View settlement report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
