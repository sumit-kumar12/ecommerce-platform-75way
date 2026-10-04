"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/store-pos", label: "Dashboard", icon: "dashboard" },
  { href: "/store-pos/sale", label: "New Sale", icon: "add_box" },
  { href: "/store-pos/history", label: "Sales History", icon: "receipt_long" },
  { href: "/store-pos/products", label: "Products", icon: "inventory_2" },
  { href: "/store-pos/customers", label: "Customers", icon: "group" },
  { href: "/store-pos/drawer", label: "Cash Drawer", icon: "point_of_sale" },
  { href: "/store-pos/reports", label: "Reports", icon: "monitoring" },
  { href: "/store-pos/settings", label: "Settings", icon: "settings" },
];

export default function StorePOSLayout({ children }) {
  const pathname = usePathname() || "";
  const currentLabel = NAV_ITEMS.find(i => i.href === pathname)?.label || "Dashboard";
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full bg-[#0F0E17] text-slate-300 font-sans">
      
      {/* POS Topbar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/60 bg-[#1A1827] shrink-0 sticky top-0 z-10">
        <div className="text-sm font-bold text-white tracking-widest">
          {currentLabel}
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
          
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Cashier:</span>
            <select className="bg-transparent text-white font-medium outline-none cursor-pointer appearance-none">
              <option className="bg-[#1A1827]">Rahul Sharma</option>
              <option className="bg-[#1A1827]">Priya Mehta</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-zinc-500 pointer-events-none -ml-1">expand_more</span>
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
