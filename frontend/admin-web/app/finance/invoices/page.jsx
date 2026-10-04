"use client";

import React, { useState } from "react";
import Link from "next/link";

const INVOICES = [
  { id: "INV-2024-006", period: "May 2024", amount: 1245600, status: "Paid" },
  { id: "INV-2024-005", period: "Apr 2024", amount: 1123450, status: "Paid" },
  { id: "INV-2024-004", period: "Mar 2024", amount: 976300, status: "Paid" },
  { id: "INV-2024-003", period: "Feb 2024", amount: 1185200, status: "Paid" },
  { id: "INV-2024-002", period: "Jan 2024", amount: 890450, status: "Paid" },
  { id: "INV-2023-012", period: "Dec 2023", amount: 1345300, status: "Unpaid" },
  { id: "INV-2023-011", period: "Nov 2023", amount: 1432150, status: "Unpaid" },
  { id: "INV-2023-010", period: "Oct 2023", amount: 921000, status: "Paid" },
];

export default function Invoices() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { name: "All", count: 98 },
    { name: "Paid", count: 96 },
    { name: "Unpaid", count: 2 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/finance" className="hover:text-slate-300 transition-colors">Finance</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Invoices</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Invoices</h2>
          <p className="text-slate-400 mt-1 text-sm">View and download invoices</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors h-10 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col">
        {/* Toolbar */}
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.name ? "bg-[#8C63F5] text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {tab.name} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.name ? 'bg-white/20' : 'bg-zinc-800'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search invoices..." 
                className="pl-10 pr-4 py-2 bg-[#0F0E17] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-[#8C63F5] transition-colors w-full md:w-64"
              />
            </div>
            <button className="p-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0E17]/50 border-b border-zinc-800/60 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium pl-6">Invoice #</th>
                <th className="p-4 font-medium">Period</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {INVOICES.map((invoice, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="text-sm font-medium text-[#8C63F5]">{invoice.id}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-300">{invoice.period}</p>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-bold text-white">
                      ₹{invoice.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 ${
                      invoice.status === 'Paid' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 text-center pr-6">
                    <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-800/60 flex items-center justify-between text-sm text-zinc-500">
          <span>Showing 1 to 8 of 98 invoices</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">3</button>
            <span className="px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">10</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
