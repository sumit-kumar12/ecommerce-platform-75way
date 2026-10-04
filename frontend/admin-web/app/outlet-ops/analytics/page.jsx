"use client";

import React from "react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const TREND_DATA = [
  { day: 1, value: 30000 },
  { day: 2, value: 45000 },
  { day: 3, value: 25000 },
  { day: 4, value: 60000 },
  { day: 5, value: 55000 },
  { day: 6, value: 70000 },
  { day: 7, value: 65000 },
  { day: 8, value: 85000 },
  { day: 9, value: 75000 },
  { day: 10, value: 90000 },
];

const SPARK_DATA_1 = [{val: 10}, {val: 25}, {val: 20}, {val: 45}, {val: 30}, {val: 50}];
const SPARK_DATA_2 = [{val: 20}, {val: 15}, {val: 30}, {val: 25}, {val: 40}, {val: 35}];
const SPARK_DATA_3 = [{val: 5}, {val: 10}, {val: 8}, {val: 15}, {val: 12}, {val: 20}];
const SPARK_DATA_4 = [{val: 30}, {val: 25}, {val: 40}, {val: 35}, {val: 55}, {val: 60}];

const CATEGORY_DATA = [
  { name: "Electronics", value: 45, color: "#8C63F5" },
  { name: "Groceries", value: 20, color: "#10B981" },
  { name: "Fashion", value: 15, color: "#F97316" },
  { name: "Home & Kitchen", value: 10, color: "#3B82F6" },
  { name: "Others", value: 10, color: "#6B7280" },
];

export default function OutletAnalytics() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-full">
      
      {/* Page Header Actions */}
      <div className="flex justify-end">
        <div className="relative">
          <select className="bg-[#1A1827] border border-zinc-800/60 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:border-[#8C63F5] appearance-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Sales */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-zinc-400 text-xs mb-1">Total Sales</p>
            <h3 className="text-2xl font-bold text-white mb-2">₹4,56,800</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              12.5% <span className="text-zinc-500 font-normal">vs last month</span>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={SPARK_DATA_1}>
                <Area type="monotone" dataKey="val" stroke="#8C63F5" fill="#8C63F5" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-zinc-400 text-xs mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold text-white mb-2">856</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              8.3% <span className="text-zinc-500 font-normal">vs last month</span>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={SPARK_DATA_2}>
                <Area type="monotone" dataKey="val" stroke="#8C63F5" fill="#8C63F5" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Order */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-zinc-400 text-xs mb-1">Avg Order</p>
            <h3 className="text-2xl font-bold text-white mb-2">₹533</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              5.1% <span className="text-zinc-500 font-normal">vs last month</span>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={SPARK_DATA_3}>
                <Area type="monotone" dataKey="val" stroke="#8C63F5" fill="#8C63F5" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-zinc-400 text-xs mb-1">Gross Profit</p>
            <h3 className="text-2xl font-bold text-white mb-2">₹1,28,450</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              14.8% <span className="text-zinc-500 font-normal">vs last month</span>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={SPARK_DATA_4}>
                <Area type="monotone" dataKey="val" stroke="#8C63F5" fill="#8C63F5" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Categories */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 lg:col-span-1">
          <h3 className="text-white font-medium mb-6">Top Selling Categories</h3>
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">856</span>
              </div>
            </div>
            
            <div className="w-full space-y-3 mt-2">
              {CATEGORY_DATA.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-slate-300">{cat.name}</span>
                  </div>
                  <span className="text-white font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Alerts & Sales Trend Container */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Stock Alerts */}
            <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-6">Stock Alerts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-slate-300">Milk 1L</span>
                  </div>
                  <span className="text-red-400 font-medium text-xs">Out of Stock</span>
                </div>
                
                <div className="flex items-center justify-between text-sm p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-slate-300">Surf Excel 1kg</span>
                  </div>
                  <span className="text-amber-400 font-medium text-xs">Low Stock (5)</span>
                </div>
                
                <div className="flex items-center justify-between text-sm p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-slate-300">Rockerz 450</span>
                  </div>
                  <span className="text-amber-400 font-medium text-xs">Low Stock (8)</span>
                </div>
              </div>
            </div>

            {/* Sales Trend */}
            <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium">Sales Trend</h3>
                <div className="relative">
                  <select className="bg-transparent text-xs text-zinc-500 outline-none appearance-none cursor-pointer pr-4">
                    <option className="bg-[#1A1827]">Daily</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[14px]">expand_more</span>
                </div>
              </div>
              <div className="flex-1 min-h-[150px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={TREND_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSalesTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8C63F5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} 
                      tickFormatter={(val) => `May ${val}`}
                      interval="preserveStartEnd"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      labelFormatter={(label) => `May ${label}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8C63F5" strokeWidth={2} fillOpacity={1} fill="url(#colorSalesTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
}
