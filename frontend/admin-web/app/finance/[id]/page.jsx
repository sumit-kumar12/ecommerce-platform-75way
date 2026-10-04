"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PayoutDetails() {
  const { id } = useParams();
  const payoutId = `#${id?.toUpperCase() || 'PYOUT-1256'}`;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/finance" className="hover:text-slate-300 transition-colors">Finance</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Payout Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">Payout {payoutId}</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Completed
            </span>
          </div>
          <p className="text-slate-400 mt-2 text-sm">Detailed information about a payout</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors h-10 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-6">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Payout Amount</p>
                <p className="text-xl font-semibold text-white">₹24,56,800</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Net Amount</p>
                <p className="text-xl font-semibold text-[#8C63F5]">₹24,12,800</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Fees</p>
                <p className="text-sm font-medium text-white">₹44,000</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Tax Deducted</p>
                <p className="text-sm font-medium text-white">₹0</p>
              </div>
              <div className="sm:col-span-2 pt-4 mt-2 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Method</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <span className="material-symbols-outlined text-[16px] text-zinc-400">account_balance</span>
                    Bank Transfer
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Reference ID</p>
                  <p className="text-sm font-medium text-white">TXN1234567890</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Initiated Date</p>
                  <p className="text-sm font-medium text-white">May 31, 2024 02:30 PM</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Completed Date</p>
                  <p className="text-sm font-medium text-white">May 31, 2024 06:45 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-6">Bank Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Bank Name</p>
                <p className="text-sm font-medium text-white">HDFC Bank</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Account Holder</p>
                <p className="text-sm font-medium text-white">Rahul Sharma</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Account Number</p>
                <p className="text-sm font-medium text-white">XXXX XXXX 1234</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">IFSC Code</p>
                <p className="text-sm font-medium text-white">HDFC0001234</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-6">Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-zinc-700 before:to-zinc-700">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-emerald-500 bg-[#0F0E17] text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#0F0E17]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:mr-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Payout Completed</span>
                    <span className="text-[10px] text-zinc-400 mt-1">May 31, 06:45 PM</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-emerald-500 bg-[#0F0E17] text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#0F0E17]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:mr-4 p-3 bg-zinc-800/40 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-300">Bank Processing</span>
                    <span className="text-[10px] text-zinc-500 mt-1">May 31, 03:15 PM</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-emerald-500 bg-[#0F0E17] text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#0F0E17]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:mr-4 p-3 bg-zinc-800/40 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-300">Payment Processing</span>
                    <span className="text-[10px] text-zinc-500 mt-1">May 31, 02:40 PM</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-emerald-500 bg-[#0F0E17] text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#0F0E17]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 md:mr-4 p-3 bg-zinc-800/40 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-300">Payout Initiated</span>
                    <span className="text-[10px] text-zinc-500 mt-1">May 31, 02:30 PM</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
