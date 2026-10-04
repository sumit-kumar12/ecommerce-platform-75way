"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { apiRequest } from "../../lib/api";

const CATEGORY_DATA = [
  { name: "Electronics", value: 45, color: "#8C63F5" },
  { name: "Fashion", value: 25, color: "#EC4899" },
  { name: "Home & Kitchen", value: 15, color: "#3B82F6" },
  { name: "Groceries", value: 7, color: "#10B981" },
  { name: "Others", value: 5, color: "#F59E0B" },
];

export default function POSDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/pos/dashboard")
      .then(res => setData(res))
      .catch(err => console.error("Failed to load dashboard", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-white animate-pulse">Loading dashboard...</div>;
  if (!data) return <div className="p-10 text-red-400">Failed to load data</div>;

  // Mocking chart data points since we only have raw total from backend in this simplified version
  const SALES_DATA = [
    { time: "9 AM", value: data.metrics.todaySales * 0.1 },
    { time: "12 PM", value: data.metrics.todaySales * 0.3 },
    { time: "3 PM", value: data.metrics.todaySales * 0.6 },
    { time: "6 PM", value: data.metrics.todaySales * 0.8 },
    { time: "9 PM", value: data.metrics.todaySales },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto min-h-full">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">payments</span>
          </div>
          <p className="text-zinc-400 text-sm mb-2 font-medium">Today's POS Sales</p>
          <h3 className="text-4xl font-bold text-white mb-2">₹{Number(data.metrics.todaySales).toLocaleString('en-IN')}</h3>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Live Updates
          </div>
        </div>
        
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">receipt_long</span>
          </div>
          <p className="text-zinc-400 text-sm mb-2 font-medium">POS Transactions</p>
          <h3 className="text-4xl font-bold text-white mb-2">{data.metrics.transactions}</h3>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Live Updates
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sales Overview */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 md:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Sales Trend (Today)</h3>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={SALES_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8C63F5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Area type="monotone" dataKey="value" stroke="#8C63F5" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 md:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Top Categories</h3>
          </div>
          <div className="flex items-center gap-6 flex-1">
            <div className="w-[120px] h-[120px] shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
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

      </div>

      {/* Recent Transactions */}
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-medium">Recent POS Transactions</h3>
        </div>
        
        {data.recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">No transactions today</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Receipt #</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-center">Payment</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.recentTransactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 text-slate-300">{new Date(tx.time).toLocaleTimeString()}</td>
                  <td className="py-3 text-white font-mono text-xs">{tx.id}</td>
                  <td className="py-3 text-slate-300">{tx.customer}</td>
                  <td className="py-3 text-right font-medium text-white">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                  <td className="py-3 text-center text-slate-300">{tx.method}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block border ${
                      tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
