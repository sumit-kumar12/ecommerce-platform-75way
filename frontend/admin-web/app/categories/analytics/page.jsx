"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";
import { StatCard } from "../../../components/dashboard/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from "recharts";

export default function CategoryAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30D");

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const payload = await apiRequest("/admin/categories/analytics");
        setData(payload);
      } catch (err) {
        console.error("Failed to load category analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const kpis = data?.kpis || {
    totalCategories: 0, totalProducts: 0, totalRevenue: 0, totalOrders: 0,
    trends: { categories: 0, products: 0, revenue: 0, orders: 0 }
  };
  const revenueByCategory = data?.revenueByCategory || [];
  const topCategories = data?.topCategories || [];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/categories" className="hover:text-slate-300 transition-colors">Categories</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Category Analytics</h1>
          <p className="text-slate-400 mt-1 text-sm">Track performance of each category</p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl p-1 h-10">
          {['7D', '30D', '90D', 'ALL'].map((p) => (
            <button
              key={p}
              onClick={() => setRange(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                range === p ? "bg-zinc-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Categories" value={kpis.totalCategories.toLocaleString()} icon="category" trend={kpis.trends.categories} color="#8B5CF6" />
        <StatCard title="Total Products" value={kpis.totalProducts.toLocaleString()} icon="inventory_2" trend={kpis.trends.products} color="#10B861" />
        <StatCard title="Total Revenue" value={`₹${kpis.totalRevenue.toLocaleString()}`} icon="account_balance_wallet" trend={kpis.trends.revenue} color="#F59E0B" />
        <StatCard title="Total Orders" value={kpis.totalOrders.toLocaleString()} icon="shopping_bag" trend={kpis.trends.orders} color="#00DAFF" />
      </div>

      {/* Charts Row */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Revenue by Category</h2>
          <p className="text-slate-400 text-sm mt-1">Top grossing product categories</p>
        </div>
        
        <div className="w-full h-[350px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-500">Loading chart...</div>
          ) : revenueByCategory.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-500">No revenue data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={revenueByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2c45" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  dy={10}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#2d2c45', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0F0E17', borderColor: '#2d2c45', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#8C63F5' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8C63F5" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Categories Table */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-[#2d2c45]">
          <h3 className="text-lg font-bold text-white">Top Categories by Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0E17] border-b border-[#2d2c45] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium pl-6">Category</th>
                <th className="p-4 font-medium text-right">Products</th>
                <th className="p-4 font-medium text-right">Orders</th>
                <th className="p-4 font-medium text-right pr-6">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading metrics...</td></tr>
              ) : topCategories.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No category sales found.</td></tr>
              ) : topCategories.map((cat, i) => (
                <tr key={cat.id || i} className="hover:bg-[#2d2c45]/30 transition-colors">
                  <td className="p-4 pl-6 font-medium text-sm text-white">{cat.name}</td>
                  <td className="p-4 text-right text-slate-300 font-mono">{cat.products.toLocaleString()}</td>
                  <td className="p-4 text-right text-slate-300 font-mono">{cat.orders.toLocaleString()}</td>
                  <td className="p-4 text-right text-[#10B861] font-mono pr-6">₹{cat.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
