"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function OutletOpsLayout({ children }) {
  const pathname = usePathname() || "";
  
  // Extract a readable title from pathname
  let currentLabel = "Outlet Operations";
  if (pathname.includes("inventory")) currentLabel = "Inventory Check";
  if (pathname.includes("adjustment")) currentLabel = "Stock Adjustment";
  if (pathname.includes("transfers")) currentLabel = "Stock Transfer";
  if (pathname.includes("orders")) currentLabel = "Supplier Orders";
  if (pathname.includes("suppliers")) currentLabel = "Supplier Management";
  if (pathname.includes("analytics")) currentLabel = "Outlet Analytics";
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full bg-[#0F0E17] text-slate-300 font-sans">
      
      {/* Outlet Operations Topbar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/60 bg-[#1A1827] shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-white tracking-widest">
            {currentLabel}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Outlet:</span>
            <select className="bg-transparent text-white font-medium outline-none cursor-pointer appearance-none">
              <option className="bg-[#1A1827]">Katabazaar Koramangala</option>
              <option className="bg-[#1A1827]">Indiranagar</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-zinc-500 pointer-events-none -ml-1">expand_more</span>
          </div>
          
          <div className="hidden md:block w-px h-6 bg-zinc-800/60"></div>
          
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <span className="material-symbols-outlined text-zinc-400 hover:text-white transition-colors">notifications</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#1A1827]">3</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8C63F5] text-white font-bold text-xs flex items-center justify-center">
                RS
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-tight">Rahul Sharma</p>
                <p className="text-[10px] text-zinc-500">Outlet Manager</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-6 bg-zinc-800/60"></div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Online</span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-x-auto bg-[#0F0E17]">
        <div className="min-w-fit md:min-w-0">
          {children}
        </div>
      </div>

    </div>
  );
}
