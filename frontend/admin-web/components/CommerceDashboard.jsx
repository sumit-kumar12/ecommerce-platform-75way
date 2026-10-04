"use client";

import React, { useEffect, useState } from "react";
import { adminRequest } from "../lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#f97316", "#eab308", "#06b6d4", "#ec4899"];

function TrendIndicator({ value, label }) {
  const isPositive = value >= 0;
  const color = isPositive ? "text-green-500" : "text-red-500";
  const icon = isPositive ? "arrow_upward" : "arrow_downward";
  
  return (
    <div className="flex items-center gap-1 text-xs mt-2">
      <span className={`material-symbols-outlined text-[14px] ${color}`}>{icon}</span>
      <span className={`font-medium ${color}`}>{Math.abs(value)}%</span>
      <span className="text-zinc-500 ml-1">vs last {label}</span>
    </div>
  );
}

export function CommerceDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminRequest("/merchant/analytics/business")
      .then((payload) => {
        setData(payload);
      })
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0F0E17] flex items-center justify-center">
        <div className="text-zinc-500">Loading dashboard...</div>
      </div>
    );
  }

  const { kpis, revenueChart, topProducts, salesByCategory, alerts } = data;

  const ordersByStatus = [
    { status: "Delivered", percentage: 60, color: "#10b981" },
    { status: "Processing", percentage: 20, color: "#f59e0b" },
    { status: "Shipped", percentage: 15, color: "#3b82f6" },
    { status: "Cancelled", percentage: 5, color: "#ef4444" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-zinc-200">Dashboard Overview</h1>
        <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>May 20 - May 26, 2024</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Total Revenue</h3>
          <div className="text-2xl font-bold text-zinc-200">₹{kpis.totalRevenue.toLocaleString()}</div>
          <TrendIndicator value={kpis.revenueGrowth} label="7 days" />
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Orders</h3>
          <div className="text-2xl font-bold text-zinc-200">{kpis.orders.toLocaleString()}</div>
          <TrendIndicator value={kpis.ordersGrowth} label="7 days" />
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Customers</h3>
          <div className="text-2xl font-bold text-zinc-200">{kpis.customers.toLocaleString()}</div>
          <TrendIndicator value={kpis.customersGrowth} label="7 days" />
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Pending Orders</h3>
          <div className="text-2xl font-bold text-zinc-200">{alerts.pendingOrders}</div>
          <TrendIndicator value={5.2} label="7 days" />
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">AOV</h3>
          <div className="text-2xl font-bold text-zinc-200">₹{Math.round(kpis.aov).toLocaleString()}</div>
          <TrendIndicator value={kpis.aovGrowth} label="7 days" />
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Conversion Rate</h3>
          <div className="text-2xl font-bold text-zinc-200">{kpis.conversionRate}%</div>
          <TrendIndicator value={kpis.conversionGrowth} label="7 days" />
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-400 mb-1">Refunds</h3>
          <div className="text-2xl font-bold text-zinc-200">₹{kpis.refunds.toLocaleString()}</div>
          <TrendIndicator value={kpis.refundsGrowth} label="7 days" />
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-zinc-200">Revenue Overview</h2>
          <select className="bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 rounded-md px-3 py-1 outline-none">
            <option>This Week</option>
            <option>Last Week</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={revenueChart}>
              <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#52525b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `₹${val / 100000}L`}
                domain={[0, 'dataMax + 100000']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#a1a1aa' }}
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#18181b" }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Top Selling, Sales by Category & Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Products */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-zinc-200 mb-6">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-zinc-600">image</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{p.name}</span>
                    <span className="text-xs text-zinc-500">{p.units.toLocaleString()} units</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-zinc-300">
                  ₹{p.revenue.toLocaleString()}
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="text-sm text-zinc-500 py-4">No product sales yet.</div>
            )}
          </div>
          <button className="w-full mt-6 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            View All Products
          </button>
        </div>

        {/* Sales by Category */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-zinc-200 mb-6">Sales by Category</h2>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="w-1/2 h-48 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="percentage"
                    stroke="none"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    formatter={(val) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text for donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-zinc-200">₹{(kpis.totalRevenue / 100000).toFixed(2)}L</span>
                <span className="text-[10px] text-zinc-500 uppercase">Total Sales</span>
              </div>
            </div>

            <div className="w-1/2 flex flex-col gap-3 pl-4">
              {salesByCategory.map((cat, i) => (
                <div key={cat.category} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                    <span className="text-zinc-300">{cat.category}</span>
                  </div>
                  <span className="text-zinc-400 font-medium">{cat.percentage}%</span>
                </div>
              ))}
              {salesByCategory.length === 0 && (
                <div className="text-sm text-zinc-500">No category data.</div>
              )}
            </div>
          </div>
          
          <button className="w-full mt-6 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            View Full Report
          </button>
        </div>

        {/* Orders by Status */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-zinc-200 mb-6">Orders by Status</h2>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="w-1/2 h-48 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="percentage"
                    stroke="none"
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    formatter={(val) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text for donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-zinc-200">{kpis.orders.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-500 uppercase">Total Orders</span>
              </div>
            </div>

            <div className="w-1/2 flex flex-col gap-3 pl-4">
              {ordersByStatus.map((stat, i) => (
                <div key={stat.status} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></span>
                    <span className="text-zinc-300">{stat.status}</span>
                  </div>
                  <span className="text-zinc-400 font-medium">{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full mt-6 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            View Details
          </button>
        </div>

      </div>

      {/* Bottom Alert Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-cyan-400">Low Stock Alerts</span>
          <div className="mt-2 text-xl font-bold text-zinc-200 flex items-baseline gap-1">
            {alerts.lowStock} <span className="text-xs font-normal text-zinc-500">Products</span>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-pink-400">Out of Stock</span>
          <div className="mt-2 text-xl font-bold text-zinc-200 flex items-baseline gap-1">
            {alerts.outOfStock} <span className="text-xs font-normal text-zinc-500">Products</span>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-purple-400">Pending Orders</span>
          <div className="mt-2 text-xl font-bold text-zinc-200 flex items-baseline gap-1">
            {alerts.pendingOrders} <span className="text-xs font-normal text-zinc-500">Orders</span>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-orange-400">Return Requests</span>
          <div className="mt-2 text-xl font-bold text-zinc-200 flex items-baseline gap-1">
            {alerts.returnRequests} <span className="text-xs font-normal text-zinc-500">Requests</span>
          </div>
        </div>
      </div>

    </div>
  );
}
