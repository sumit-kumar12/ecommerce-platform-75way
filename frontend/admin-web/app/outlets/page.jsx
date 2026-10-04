"use client";

import React, { useState } from "react";
import Link from "next/link";

const initialOutlets = [
  { id: 1, name: "Katabazaar Mumbai", manager: "Priya Mehta", city: "Mumbai", status: "Active", stockHealth: "Good", lowStockCount: 2 },
  { id: 2, name: "Katabazaar Bangalore", manager: "Arjun Reddy", city: "Bangalore", status: "Active", stockHealth: "Medium", lowStockCount: 15 },
  { id: 3, name: "Katabazaar Chennai", manager: "Karthik Raja", city: "Chennai", status: "Active", stockHealth: "Low", lowStockCount: 45 },
  { id: 4, name: "Katabazaar Kolkata", manager: "Sourav Das", city: "Kolkata", status: "Inactive", stockHealth: "Low", lowStockCount: 30 },
  { id: 5, name: "Katabazaar Delhi", manager: "Rahul Sharma", city: "New Delhi", status: "Active", stockHealth: "Good", lowStockCount: 5 },
];

export default function OutletListPage() {
  const [outlets, setOutlets] = useState(initialOutlets);
  const [search, setSearch] = useState("");

  const filteredOutlets = outlets.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.city.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => status === "Active" ? "text-green-400 bg-green-400/10" : "text-slate-400 bg-slate-500/10";
  const getStockColor = (health) => {
    if (health === "Good") return "text-green-400";
    if (health === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 mb-1">Commerce Control</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Outlets</h1>
          <p className="text-sm text-slate-400 mt-1">View & manage all outlets in the system</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Outlet
        </button>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#2d2c45] border-b border-[#2d2c45]">
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Outlets</p>
            <p className="text-2xl font-bold text-white">128</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Outlets</p>
            <p className="text-2xl font-bold text-white">112</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Inactive Outlets</p>
            <p className="text-2xl font-bold text-white">16</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Low Stock Outlets</p>
            <p className="text-2xl font-bold text-red-400">7</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d2c45]">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search outlets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0F0E17] border border-[#2d2c45] text-slate-300 rounded-lg text-sm font-medium hover:bg-[#2d2c45] transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Outlet Name</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Manager</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">City</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Stock Health</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {filteredOutlets.map((outlet, i) => (
                <tr 
                  key={outlet.id} 
                  className="hover:bg-white/[0.02] transition-colors group animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2d2c45] flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                      </div>
                      <Link href={`/outlets/${outlet.id}`} className="text-sm font-medium text-white hover:text-[#8C63F5] transition-colors">
                        {outlet.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-300">{outlet.manager}</td>
                  <td className="py-4 px-6 text-sm text-slate-400">{outlet.city}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(outlet.status)}`}>
                      {outlet.status === "Active" && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                      {outlet.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className={getStockColor(outlet.stockHealth)}>{outlet.stockHealth}</span>
                      {outlet.stockHealth === "Low" && (
                        <span className="text-xs text-slate-500">({outlet.lowStockCount} items)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/outlets/${outlet.id}`} className="p-1.5 text-slate-400 hover:text-white hover:bg-[#2d2c45] rounded-md transition-colors flex items-center justify-center" title="View details">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-md transition-colors flex items-center justify-center" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#2d2c45] flex items-center justify-between bg-[#0F0E17]">
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filteredOutlets.length}</span> of <span className="font-medium text-white">128</span> outlets
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors text-sm">3</button>
            <span className="text-slate-500 px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors text-sm">20</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
