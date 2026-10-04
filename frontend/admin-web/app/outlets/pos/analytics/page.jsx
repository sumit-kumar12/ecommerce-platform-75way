"use client";

import React from "react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const TREND_DATA = [
  { day: 1, value: 30000 },
  { day: 2, value: 45000 },
  { day: 3, value: 25000 },
  { day: 4, value: 60000 },
  { day: 5, value: 50000 },
  { day: 6, value: 80000 },
  { day: 7, value: 65000 },
  { day: 8, value: 95000 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 45, color: "#8C63F5" },
  { name: "Accessories", value: 30, color: "#3B82F6" },
  { name: "Wearables", value: 15, color: "#10B981" },
  { name: "Others", value: 10, color: "#F59E0B" },
];

export default function OutletAnalytics() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Outlet Analytics</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Reports</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-auto overflow-hidden">
        
        {/* Sales Metric */}
        <div className="p-6 border-b border-zinc-800/60">
          <p className="text-sm font-medium text-slate-300 mb-1">Sales (This Month)</p>
          <div className="flex items-end gap-3 mb-6">
            <h3 className="text-3xl font-bold text-white">₹12,45,680</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium pb-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +18.3% <span className="text-zinc-500 font-normal">vs last month</span>
            </div>
          </div>
          
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8C63F5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  labelFormatter={() => ''}
                />
                <Area type="monotone" dataKey="value" stroke="#8C63F5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories */}
        <div className="p-6">
          <h3 className="text-white font-medium mb-6 text-sm">Top Categories</h3>
          
          <div className="flex items-center gap-6">
            <div className="w-[120px] h-[120px] shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-3">
              {CATEGORY_DATA.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-slate-300">{cat.name}</span>
                  </div>
                  <span className="text-white font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
