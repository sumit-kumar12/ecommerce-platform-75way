"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#8C63F5', '#EF4444', '#F59E0B'];

const MATCH_DATA = [
  { name: "Matched", value: 86 },
  { name: "Unmatched", value: 11 },
  { name: "Pending", value: 3 },
];

const UNMATCHED_ITEMS = [
  { id: "#RND-1255", type: "Refund", amount: -1300, reason: "Pending Refund" },
  { id: "#FEE-1052", type: "Fee", amount: -544, reason: "Rounding Difference" },
];

export default function Reconciliation() {
  const [dateRange, setDateRange] = useState("May 24 - May 31, 2024");

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/finance" className="hover:text-slate-300 transition-colors">Finance</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Reconciliation</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Reconciliation</h2>
          <p className="text-slate-400 mt-1 text-sm">Match transactions with payouts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
             <h3 className="text-white font-medium">Reconciliation Overview</h3>
             <select 
               className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 text-sm rounded-xl px-4 py-2 outline-none"
               value={dateRange}
               onChange={(e) => setDateRange(e.target.value)}
             >
               <option>May 24 - May 31, 2024</option>
               <option>May 1 - May 31, 2024</option>
             </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-5">
              <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Orders Amount</p>
              <p className="text-2xl font-bold text-white tracking-tight">₹13,20,450</p>
            </div>
            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-5">
              <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Payouts Made</p>
              <p className="text-2xl font-bold text-white tracking-tight">₹12,45,600</p>
            </div>
            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-5 relative overflow-hidden group hover:border-[#8C63F5]/50 transition-colors">
              <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-l-xl"></div>
              <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Difference</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white tracking-tight">₹0</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Matched
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
          <h3 className="text-white font-medium mb-6">Match Status</h3>
          <div className="h-[220px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={MATCH_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {MATCH_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1A1827', borderColor: '#2d2c45', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <span className="text-white font-bold text-xl">{MATCH_DATA[0].value}%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-800/60">
            <h3 className="text-white font-medium">Unmatched Items <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-400">2</span></h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F0E17]/50 border-b border-zinc-800/60 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium pl-6">ID</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium">Reason</th>
                  <th className="p-4 font-medium pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {UNMATCHED_ITEMS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="text-sm font-medium text-[#8C63F5]">{item.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-300">{item.type}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-medium text-white">
                        {item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-400">{item.reason}</span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-zinc-800/60 text-center">
            <Link href="/reports/sales-overview" className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
              View full report →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
