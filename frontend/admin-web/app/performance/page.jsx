"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const REVENUE_DATA = [
  { date: "May 01", revenue: 50000 },
  { date: "May 06", revenue: 80000 },
  { date: "May 11", revenue: 150000 },
  { date: "May 16", revenue: 110000 },
  { date: "May 21", revenue: 200000 },
  { date: "May 26", revenue: 250000 },
  { date: "May 31", revenue: 220000 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 845200, color: "#8C63F5", percent: "+16.5%" },
  { name: "Fashion", value: 633400, color: "#F59E0B", percent: "+12.1%" },
  { name: "Home & Kitchen", value: 412800, color: "#EF4444", percent: "+9.8%" },
  { name: "Others", value: 575400, color: "#10B981", percent: "+11.2%" },
];

export default function PerformanceOverview() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Performance Overview</h2>
          <p className="text-slate-400 mt-1 text-sm">Monitor business performance in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-[#1A1827] border border-zinc-800 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none pr-10 relative cursor-pointer">
            <option>May 01 - May 31, 2024</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-zinc-800/60">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-800/60 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Total Revenue</p>
            <h3 className="text-3xl font-bold text-white mb-2">₹24,56,800</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              16.8%
            </div>
          </div>
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-800/60 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Total Orders</p>
            <h3 className="text-3xl font-bold text-white mb-2">12,850</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              12.4%
            </div>
          </div>
          <div className="p-6 border-r lg:border-b-0 border-zinc-800/60 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Average Order Value</p>
            <h3 className="text-3xl font-bold text-white mb-2">₹1,915</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              6.5%
            </div>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Conversion Rate</p>
            <h3 className="text-3xl font-bold text-white mb-2">3.42%</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              0.8%
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          
          {/* Revenue Trend */}
          <div className="p-6 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-zinc-800/60">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-medium">Revenue Trend</h3>
              <select className="bg-[#1A1827] border border-zinc-800 rounded-lg px-3 py-1 text-xs text-slate-300 outline-none focus:border-[#8C63F5]">
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8C63F5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8C63F5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Categories */}
          <div className="p-6 lg:col-span-1">
            <h3 className="text-white font-medium mb-8">Top Performing Categories</h3>
            <div className="flex flex-col items-center">
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-4 mt-6">
                {CATEGORY_DATA.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-medium">₹{(item.value).toLocaleString('en-IN')}</span>
                      <span className="text-emerald-400 text-xs w-10 text-right">{item.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="px-6 py-4 border-t border-zinc-800/60 text-center">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full">
            View detailed analytics <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
