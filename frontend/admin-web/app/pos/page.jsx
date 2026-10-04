"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PAYMENT_DATA = [
  { name: "Card", value: 60, color: "#8C63F5" },
  { name: "UPI", value: 25, color: "#F59E0B" },
  { name: "Cash", value: 10, color: "#EF4444" },
  { name: "Wallet", value: 5, color: "#10B981" },
];

const TOP_ITEMS = [
  { name: "Wireless Headphones", price: "₹4,590", sold: 28, icon: "headphones" },
  { name: "Smart Watch Pro", price: "₹8,990", sold: 22, icon: "watch" },
  { name: "Leather Wallet", price: "₹1,290", sold: 18, icon: "wallet" },
];

export default function POSDashboard() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">POS Dashboard</h2>
          <p className="text-slate-400 mt-1 text-sm">Point of Sale system overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* KPIs */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Today's Summary</h3>
            <span className="text-xs text-zinc-500">Live</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-zinc-800/60">
            <div className="pr-4">
              <p className="text-xs text-zinc-500 mb-1">Sales</p>
              <h4 className="text-xl font-bold text-emerald-400">₹45,68,900</h4>
            </div>
            <div className="px-4">
              <p className="text-xs text-zinc-500 mb-1">Orders</p>
              <h4 className="text-xl font-bold text-white">320</h4>
            </div>
            <div className="pl-4">
              <p className="text-xs text-zinc-500 mb-1">Avg. Order</p>
              <h4 className="text-xl font-bold text-white">₹1,426</h4>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 md:col-span-1 flex flex-col">
          <h3 className="text-white font-medium mb-6">Payment Methods</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={PAYMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {PAYMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {PAYMENT_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 md:col-span-2 flex flex-col">
          <h3 className="text-white font-medium mb-6">Top Selling Items</h3>
          <div className="flex-1 space-y-4">
            {TOP_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/40 bg-[#0F0E17]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A1827] border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-400 text-[18px]">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{item.name}</h4>
                    <span className="text-xs text-zinc-500">{item.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#8C63F5]">{item.sold}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Sold</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-6 text-center">
            <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
              View all reports →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
