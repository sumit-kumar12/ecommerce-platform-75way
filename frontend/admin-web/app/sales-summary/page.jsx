"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CHANNEL_DATA = [
  { name: "Website", value: 45, color: "#8C63F5", revenue: "11,05,200" },
  { name: "Mobile App", value: 30, color: "#F59E0B", revenue: "7,36,800" },
  { name: "Marketplaces", value: 15, color: "#EF4444", revenue: "3,68,400" },
  { name: "Others", value: 10, color: "#10B981", revenue: "2,46,200" },
];

const TOP_PRODUCTS = [
  { product: "Wireless Headphones", orders: "1,245", revenue: "₹2,45,600", icon: "headphones" },
  { product: "Smart Watch Pro", orders: "932", revenue: "₹1,86,300", icon: "watch" },
  { product: "Leather Wallet", orders: "1,120", revenue: "₹1,25,400", icon: "wallet" },
  { product: "Backpack Pro", orders: "876", revenue: "₹1,15,600", icon: "backpack" },
  { product: "Sneakers", orders: "732", revenue: "₹98,700", icon: "sports_score" },
];

export default function SalesSummary() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState(null);
  const [finance, setFinance] = React.useState(null);

  React.useEffect(() => {
    let active = true;
    Promise.all([
      import('../../lib/api').then(m => m.adminRequest('/stats')),
      import('../../lib/api').then(m => m.adminRequest('/finance/summary'))
    ]).then(([statsData, financeData]) => {
      if (active) {
        setStats(statsData);
        setFinance(financeData?.summary);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0F0E17] flex items-center justify-center text-white">Loading Sales Summary...</div>;
  }

  const grossSales = finance?.totalRevenue || 0;
  const netSales = finance?.totalRevenue ? grossSales * 0.95 : 0;
  const refunds = finance?.totalRevenue ? grossSales * 0.05 : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sales Summary</h2>
          <p className="text-slate-400 mt-1 text-sm">Comprehensive sales summary and breakdown</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#1A1827] border border-zinc-800 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none pr-10 relative cursor-pointer">
            <option>All Time</option>
          </select>
          <button className="bg-[#1A1827] hover:bg-zinc-800 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-slate-300 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#8C63F5]">download</span> Download Report
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-zinc-800/60">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-800/60 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Gross Sales</p>
            <h3 className="text-3xl font-bold text-white mb-2">₹{grossSales.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              16.8%
            </div>
          </div>
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-800/60 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Total Orders</p>
            <h3 className="text-3xl font-bold text-white mb-2">{stats?.orders || 0}</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              16.8%
            </div>
          </div>
          <div className="p-6 border-r lg:border-b-0 border-zinc-800/60 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Active Products</p>
            <h3 className="text-3xl font-bold text-white mb-2">{stats?.products || 0}</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              2.3%
            </div>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Conversion Rate</p>
            <h3 className="text-3xl font-bold text-white mb-2">{stats?.conversionRate || "0.00"}%</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              3.1%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Sales by Channel */}
          <div className="p-6 lg:border-r border-zinc-800/60 flex flex-col">
            <h3 className="text-white font-medium mb-6">Sales by Channel</h3>
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="h-[220px] w-[220px] relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={CHANNEL_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {CHANNEL_DATA.map((entry, index) => (
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
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-2xl font-bold text-white">100%</span>
                  <span className="text-xs text-zinc-500">Total Sales</span>
                </div>
              </div>
              
              <div className="space-y-4 w-full md:w-auto flex-1">
                {CHANNEL_DATA.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-300 w-24">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">{item.value}%</span>
                    <span className="text-zinc-400 font-mono text-right w-24">₹{item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="p-6 flex flex-col">
            <h3 className="text-white font-medium mb-6">Top Products by Sales</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/60 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium text-right">Orders</th>
                    <th className="pb-4 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {TOP_PRODUCTS.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#1A1827] border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-[#8C63F5] transition-colors">
                            <span className="material-symbols-outlined text-[16px]">{prod.icon}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-200">{prod.product}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm text-zinc-400">{prod.orders}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-medium text-white">{prod.revenue}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Footer Link */}
        <div className="px-6 py-4 border-t border-zinc-800/60 text-center">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full">
            View full sales report <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
