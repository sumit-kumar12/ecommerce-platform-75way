"use client";

import { useState } from "react";

const TABS = ["Top Products", "Low Stock", "Low Performing"];

const products = [
  { name: "Wireless Headphones", units: 1145, revenue: "₹2,10,680", views: 12450, conversion: 9.2 },
  { name: "Smart Watch", units: 980, revenue: "₹3,88,000", views: 9870, conversion: 7.9 },
  { name: "Leather Wallet", units: 764, revenue: "₹1,73,628", views: 8240, conversion: 5.4 },
  { name: "Backpack Pro", units: 954, revenue: "₹98,100", views: 5210, conversion: 5.3 },
  { name: "Sneakers", units: 631, revenue: "₹78,640", views: 3980, conversion: 4.1 },
];

const lowStock = [
  { name: "Wireless Headphones", units: 4, revenue: "₹2,10,680", views: 12450, conversion: 9.2 },
  { name: "Smart Watch", units: 7, revenue: "₹3,88,000", views: 9870, conversion: 7.9 },
  { name: "Leather Wallet", units: 2, revenue: "₹1,73,628", views: 8240, conversion: 5.4 },
];

const lowPerforming = [
  { name: "Old Model Earbuds", units: 12, revenue: "₹8,400", views: 1200, conversion: 1.0 },
  { name: "Basic Charger", units: 25, revenue: "₹5,200", views: 980, conversion: 2.5 },
  { name: "Phone Case V1", units: 8, revenue: "₹3,100", views: 750, conversion: 1.1 },
];

function getBar(val, max) {
  const pct = Math.min((val / max) * 100, 100);
  return pct;
}

export default function ProductPerformancePage() {
  const [activeTab, setActiveTab] = useState("Top Products");

  const data = activeTab === "Top Products" ? products : activeTab === "Low Stock" ? lowStock : lowPerforming;
  const maxRevenue = 388000;

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Reports</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Product Performance</h1>
          <p className="text-sm text-slate-400 mt-1">Analyze top performing and low performing products</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-[#1A1827] border border-[#2d2c45] px-3 py-2 rounded-lg">
            May 01 – May 31, 2024
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Tabs + Table Card */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-[#2d2c45]">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#8C63F5] text-[#8C63F5]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                {["Product", "Units Sold", "Revenue", "Views", "Conversion"].map(h => (
                  <th key={h} className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {data.map((row, i) => {
                const barPct = getBar(parseFloat(row.revenue.replace(/[^\d]/g, "")), maxRevenue);
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors duration-150">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2d2c45] flex items-center justify-center text-xs font-bold text-slate-400">
                          {row.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-white">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-300">{row.units.toLocaleString()}</td>
                    <td className="py-3 px-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-white">{row.revenue}</span>
                        <div className="w-24 h-1.5 bg-[#2d2c45] rounded-full overflow-hidden">
                          <div className="h-full bg-[#8C63F5] rounded-full" style={{ width: `${barPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-300">{row.views.toLocaleString()}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.conversion >= 7 ? "bg-green-500/10 text-green-400"
                          : row.conversion >= 4 ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {row.conversion}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#2d2c45] flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing <span className="text-white font-medium">{data.length}</span> results</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400" disabled>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white text-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45]">
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
