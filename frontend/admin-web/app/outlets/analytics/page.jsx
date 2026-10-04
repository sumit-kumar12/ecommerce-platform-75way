"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function OutletAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 mb-1">Commerce Control</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Outlet Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Deep insights and performance trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#1A1827] border border-[#2d2c45] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#8C63F5]">
            <option>All Outlets</option>
            <option>Katabazaar Mumbai</option>
            <option>Katabazaar Bangalore</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] text-slate-300 rounded-lg text-sm font-medium transition-colors">
            May 01 - May 31, 2024
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "₹2,45,68,900", change: "+14.2%" },
          { label: "Total Orders", value: "16,450", change: "+8.5%" },
          { label: "Total Customers", value: "12,850", change: "+12.0%" },
          { label: "Avg Order Value", value: "₹1,332", change: "+3.4%" },
        ].map((kpi, i) => (
          <div 
            key={i} 
            className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white animate-count-up">{kpi.value}</p>
            </div>
            <p className="text-xs font-bold text-green-400 mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-sm font-bold text-white mb-6">Revenue Over Time</h2>
          <div className="h-64 relative flex items-end">
            {mounted && (
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full stroke-[#8C63F5] fill-[#8C63F5]/10 group hover:fill-[#8C63F5]/20 transition-all duration-500">
                <path className="animate-draw" d="M0,35 L10,30 L20,32 L30,20 L40,25 L50,15 L60,18 L70,10 L80,12 L90,5 L100,2 L100,40 L0,40 Z" />
                <path className="animate-draw fill-none stroke-2" d="M0,35 L10,30 L20,32 L30,20 L40,25 L50,15 L60,18 L70,10 L80,12 L90,5 L100,2" />
              </svg>
            )}
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 w-1 flex flex-col justify-between text-[10px] font-medium text-slate-500 pr-2 pb-6">
              <span>10L</span><span>7.5L</span><span>5L</span><span>2.5L</span><span>0</span>
            </div>
            {/* Grid lines */}
            <div className="absolute left-6 right-0 top-0 bottom-8 flex flex-col justify-between pb-6 pointer-events-none">
              <div className="border-b border-[#2d2c45] border-dashed w-full opacity-50"></div>
              <div className="border-b border-[#2d2c45] border-dashed w-full opacity-50"></div>
              <div className="border-b border-[#2d2c45] border-dashed w-full opacity-50"></div>
              <div className="border-b border-[#2d2c45] border-dashed w-full opacity-50"></div>
              <div className="border-b border-[#2d2c45] border-solid w-full"></div>
            </div>
            {/* X-Axis Labels */}
            <div className="absolute bottom-[-20px] left-6 right-0 flex justify-between text-[10px] font-medium text-slate-500">
              <span>May 01</span><span>May 08</span><span>May 15</span><span>May 22</span><span>May 31</span>
            </div>
          </div>
        </div>

        {/* Top Outlets List */}
        <div className="lg:col-span-1 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white">Top Outlets by Revenue</h2>
          </div>
          <div className="space-y-4">
            {[
              { rank: 1, name: "Katabazaar Delhi", rev: "₹48,25,000" },
              { rank: 2, name: "Katabazaar Mumbai", rev: "₹42,10,000" },
              { rank: 3, name: "Katabazaar Bangalore", rev: "₹36,50,000" },
              { rank: 4, name: "Katabazaar Chennai", rev: "₹28,15,000" },
              { rank: 5, name: "Katabazaar Kolkata", rev: "₹18,37,900" },
            ].map((outlet) => (
              <div key={outlet.rank} className="flex items-center justify-between p-3 bg-[#0F0E17] border border-[#2d2c45] rounded-xl hover:border-[#8C63F5]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${outlet.rank <= 3 ? "bg-[#8C63F5] text-white shadow-lg shadow-[#8C63F5]/20" : "bg-[#2d2c45] text-slate-400"}`}>
                    {outlet.rank}
                  </span>
                  <span className="text-sm font-medium text-slate-300">{outlet.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{outlet.rev}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category (Donut) */}
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h2 className="text-sm font-bold text-white mb-6">Sales by Category</h2>
          <div className="flex items-center gap-6 h-48">
            <div className="w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                {mounted && (
                  <>
                    {/* Home (18%) */}
                    <path strokeDasharray="100 100" strokeDashoffset="0" className="stroke-[#eab308] fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    {/* Beauty (10%) */}
                    <path strokeDasharray="82 100" strokeDashoffset="0" className="stroke-[#ec4899] fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    {/* Fashion (25%) */}
                    <path strokeDasharray="72 100" strokeDashoffset="0" className="stroke-[#06b6d4] fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    {/* Electronics (42%) */}
                    <path strokeDasharray="47 100" strokeDashoffset="0" className="stroke-[#8C63F5] fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </>
                )}
              </svg>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { label: "Electronics", val: "42%", color: "bg-[#8C63F5]" },
                { label: "Fashion", val: "25%", color: "bg-[#06b6d4]" },
                { label: "Home", val: "18%", color: "bg-[#eab308]" },
                { label: "Beauty", val: "10%", color: "bg-[#ec4899]" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300"><div className={`w-3 h-3 rounded-full ${item.color}`}></div> {item.label}</div>
                  <span className="font-bold text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Health (Donut) */}
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <h2 className="text-sm font-bold text-white mb-6">Stock Health</h2>
          <div className="flex items-center gap-6 h-48">
            <div className="w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                {mounted && (
                  <>
                    {/* Out of Stock (5%) */}
                    <path strokeDasharray="100 100" strokeDashoffset="0" className="stroke-red-400 fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    {/* Low Stock (20%) */}
                    <path strokeDasharray="95 100" strokeDashoffset="0" className="stroke-yellow-400 fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    {/* Good (75%) */}
                    <path strokeDasharray="75 100" strokeDashoffset="0" className="stroke-green-400 fill-none animate-draw" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </>
                )}
              </svg>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { label: "Good", val: "75%", color: "bg-green-400" },
                { label: "Low Stock", val: "20%", color: "bg-yellow-400" },
                { label: "Out of Stock", val: "5%", color: "bg-red-400" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300"><div className={`w-3 h-3 rounded-full ${item.color}`}></div> {item.label}</div>
                  <span className="font-bold text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
