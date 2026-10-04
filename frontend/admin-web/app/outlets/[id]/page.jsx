"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function OutletDetailPage({ params }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data
  const outlet = {
    name: "Katabazaar Mumbai",
    manager: "Priya Mehta",
    phone: "+91 98765 43210",
    email: "mumbai.outlet@katabazaar.com",
    address: "123 Market Street, Andheri West, Mumbai, Maharashtra 400058",
    areaManager: "Rahul Sharma",
    joined: "Jan 15, 2022",
    code: "OUT-MUM-001",
    status: "Active",
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/outlets" className="hover:text-white transition-colors">Outlets</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-white">{outlet.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Info Card */}
        <div className="lg:col-span-1 bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl relative animate-fade-in-up">
          {/* Hero Image */}
          <div className="h-32 bg-[#2d2c45] relative">
            <img src="/api/placeholder/400/200" alt="Outlet Storefront" className="w-full h-full object-cover opacity-80" />
            <button className="absolute top-4 right-4 px-3 py-1.5 bg-[#1A1827]/80 backdrop-blur border border-white/10 hover:border-[#8C63F5] text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit Outlet
            </button>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6 relative -mt-12">
              <div className="w-16 h-16 rounded-xl bg-[#8C63F5] border-4 border-[#1A1827] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                PM
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-bold text-white mb-1">{outlet.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-green-400 bg-green-400/10 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                {outlet.status}
              </span>
              <p className="text-xs text-slate-400">Outlet Code: <span className="text-slate-300 font-mono">{outlet.code}</span></p>
            </div>

            <div className="space-y-4 border-t border-[#2d2c45] pt-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">location_on</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Address</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{outlet.address}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">mail</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm text-[#8C63F5] hover:underline cursor-pointer">{outlet.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">badge</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Area Manager</p>
                  <p className="text-sm text-slate-300">{outlet.areaManager}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">calendar_today</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Established On</p>
                  <p className="text-sm text-slate-300">{outlet.joined}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#2d2c45]">
              <button className="w-full py-2.5 bg-[#8C63F5] hover:bg-[#7b53e4] text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#8C63F5]/20">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: KPIs & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance KPIs */}
          <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Performance</h2>
              <span className="text-xs font-medium text-slate-500 bg-[#0F0E17] px-3 py-1.5 rounded-lg border border-[#2d2c45] cursor-pointer hover:bg-[#2d2c45] transition-colors">This Month ▾</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-x divide-[#2d2c45]">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Revenue</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold text-white">₹24,58,120</p>
                  <span className="text-xs font-bold text-green-400 flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>12.5%</span>
                </div>
              </div>
              <div className="pl-6">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Orders</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold text-white">1,248</p>
                  <span className="text-xs font-bold text-green-400 flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>8.2%</span>
                </div>
              </div>
              <div className="pl-6">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Customers</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold text-white">856</p>
                  <span className="text-xs font-bold text-green-400 flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>10.3%</span>
                </div>
              </div>
              <div className="pl-6">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Avg. Rating</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold text-white flex items-center gap-1">4.8 <span className="text-yellow-400 text-lg">★</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Area */}
          <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Tab Nav */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-[#2d2c45]">
              {["Overview", "Inventory", "Performance", "Staff", "Settings"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
                    activeTab === tab ? "text-[#8C63F5]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C63F5] animate-slide-up" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "Overview" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Map Card */}
                  <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl overflow-hidden col-span-1 md:col-span-2 relative h-48">
                    <img src="/api/placeholder/800/400" alt="Map View" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-[#8C63F5]/20 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-4 h-4 bg-[#8C63F5] rounded-full border-2 border-white"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-[#1A1827]/90 backdrop-blur px-3 py-2 rounded-lg border border-[#2d2c45] text-xs text-slate-300">
                      19.1136° N, 72.8697° E
                    </div>
                  </div>

                  {/* Sales Chart (Mock) */}
                  <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-400 mb-4">Sales <span className="font-normal">(This Month)</span></p>
                    <div className="h-40 relative flex items-end">
                      {mounted && (
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full stroke-[#8C63F5] fill-[#8C63F5]/10 group hover:fill-[#8C63F5]/20 transition-all duration-500">
                          <path className="animate-draw" d="M0,35 Q10,30 20,25 T40,15 T60,20 T80,5 T100,10 L100,40 L0,40 Z" />
                          <path className="animate-draw fill-none stroke-2" d="M0,35 Q10,30 20,25 T40,15 T60,20 T80,5 T100,10" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Order Status Chart (Mock) */}
                  <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-4 flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-400 mb-4">Order Status <span className="font-normal">(This Month)</span></p>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 shrink-0">
                        {mounted && (
                          <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                            {/* Processing (15%) */}
                            <path strokeDasharray="100 100" strokeDashoffset="0" className="stroke-yellow-400 fill-none" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            {/* Cancelled (23%) */}
                            <path strokeDasharray="85 100" strokeDashoffset="0" className="stroke-red-400 fill-none" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            {/* Delivered (62%) */}
                            <path strokeDasharray="62 100" strokeDashoffset="0" className="stroke-[#8C63F5] fill-none" strokeWidth="6" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                          </svg>
                        )}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-white"><div className="w-2 h-2 rounded-full bg-[#8C63F5]"></div> Delivered</div>
                          <span className="font-bold">62%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-white"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Processing</div>
                          <span className="font-bold">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-500 animate-fade-in">
                  Content for {activeTab} will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
