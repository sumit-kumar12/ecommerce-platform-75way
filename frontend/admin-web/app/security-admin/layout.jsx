"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/security-admin/audit-logs", label: "Audit Logs", icon: "receipt_long" },
  { href: "/security-admin/policies", label: "Security Policies", icon: "policy" },
  { href: "/security-admin/emergency", label: "Emergency Controls", icon: "emergency" },
  { href: "/security-admin/login-monitoring", label: "Login Monitoring", icon: "login" },
  { href: "/security-admin/threat-rules", label: "Threat Rules", icon: "rule" },
  { href: "/security-admin/access", label: "Access Management", icon: "manage_accounts" },
];

export default function SecurityAdminLayout({ children }) {
  const pathname = usePathname() || "";
  
  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#0F0E17] text-slate-300 font-sans overflow-hidden">
      
      {/* Security Admin Sidebar */}
      <aside className="w-64 shrink-0 bg-[#1A1827] border-r border-zinc-800/60 flex flex-col h-full overflow-y-auto">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-[#8C63F5]/20 text-[#8C63F5] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              KATABAZAAR<br/>SECURITY ADMIN
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[#8C63F5]/10 text-[#8C63F5]" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 w-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 w-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">first_page</span>
            Collapse
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 shrink-0 bg-[#1A1827] border-b border-zinc-800/60 flex items-center justify-between px-6">
          <div className="text-white font-medium text-sm hidden md:block">
            {NAV_ITEMS.find(i => pathname.startsWith(i.href))?.label || "Security Admin"}
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Organization</span>
              <select className="bg-transparent text-white font-medium outline-none cursor-pointer appearance-none">
                <option className="bg-[#1A1827]">Katabazaar Group</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-zinc-500 pointer-events-none -ml-1">expand_more</span>
            </div>
            
            <div className="hidden md:block w-px h-6 bg-zinc-800/60"></div>
            
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer">
                <span className="material-symbols-outlined text-zinc-400 hover:text-white transition-colors">notifications</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-[#1A1827]">15</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8C63F5] text-white font-bold text-xs flex items-center justify-center">
                  RS
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-tight">Rahul Sharma</p>
                  <p className="text-[10px] text-zinc-500">Security Admin</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-6 bg-zinc-800/60"></div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400 tracking-wide">Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0F0E17]">
          {children}
        </main>
        
      </div>

    </div>
  );
}
