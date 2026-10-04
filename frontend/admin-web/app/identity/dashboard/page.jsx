"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1000) return n.toLocaleString("en-US");
  return String(n);
};

function Spark({ data = [], color = "#3b82f6" }) {
  if (!data.length) return <div className="h-6 w-16 shrink-0" />;
  const max = Math.max(...data, 1), w = 64, h = 24;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible opacity-80 mt-1 shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AreaChart({ data = [], color = "#8b5cf6" }) {
  if (!data.length) return <div className="w-full h-full bg-zinc-800/20 rounded" />;
  const max = Math.max(...data, 1), w = 400, h = 100;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`);
  const pathData = `M0,${h} L${pts.join(" L")} L${w},${h} Z`;
  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0">
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={pathData} fill={`url(#grad-${color.replace('#','')})`} />
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function BarChart({ data = [], labels = [], color = "#8b5cf6" }) {
  if (!data.length) return null;
  const max = Math.max(...data, 100);
  return (
    <div className="w-full h-full flex items-end justify-between gap-1 pt-4 pb-2 px-1">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center justify-end h-full flex-1 gap-1">
          <span className="text-[9px] text-zinc-400">{val}%</span>
          <div className="w-full bg-zinc-800/50 rounded-t-sm relative" style={{ height: '100%' }}>
            <div 
              className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-all" 
              style={{ height: `${(val / max) * 100}%`, backgroundColor: color }}
            ></div>
          </div>
          <span className="text-[8px] text-zinc-500 whitespace-nowrap">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ items, totalLabel, totalValue }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <circle r="15.9155" cx="18" cy="18" fill="transparent" stroke="#1f2937" strokeWidth="4" />
        {items.map((item, i) => {
          const pct = item.value / total;
          const strokeDasharray = `${pct * 100} 100`;
          const strokeDashoffset = -(cumulativePercent * 100);
          cumulativePercent += pct;
          return (
            <circle
              key={i}
              r="15.9155"
              cx="18"
              cy="18"
              fill="transparent"
              stroke={item.color}
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[14px] font-bold text-white leading-tight">{totalValue}</div>
        <div className="text-[8px] text-zinc-400 text-center uppercase tracking-wider">{totalLabel}</div>
      </div>
    </div>
  );
}

export default function IdentityDashboard() {
  const topKPIs = [
    { icon: "group", label: "Total Users", value: "23,842", sub: "+342 today", scolor: "#10b981", isRed: false, spark: [90,95,92,100,105,110,124] },
    { icon: "admin_panel_settings", label: "Admin Users", value: "156", sub: "+5 today", scolor: "#10b981", isRed: false, spark: [100,105,110,115,120,125,128] },
    { icon: "store", label: "Merchant Users", value: "6,218", sub: "+108 today", scolor: "#10b981", isRed: false, spark: [80,85,90,95,100,105,110] },
    { icon: "devices", label: "Active Sessions", value: "1,248", sub: "+78 now", scolor: "#10b981", isRed: false, spark: [30,35,32,40,45,42,50] },
    { icon: "verified_user", label: "MFA Enabled", value: "68.3%", sub: "+5.6% vs last 7 days", scolor: "#10b981", isRed: false, spark: [60,62,63,65,66,67,68.5] },
    { icon: "warning", label: "Failed Logins (24h)", value: "124", sub: "-12% vs last 7 days", scolor: "#ef4444", isRed: true, spark: [80,75,85,70,60,65,50] },
    { icon: "lock", label: "Locked Accounts", value: "32", sub: "+4 vs yesterday", scolor: "#ef4444", isRed: true, spark: [18,17,19,16,15,16,15] },
    { icon: "policy", label: "Privilege Violations", value: "7", sub: "+3 vs yesterday", scolor: "#f59e0b", isRed: true, spark: [10,9,8,11,9,8,7] },
  ];

  const usersOverview = [
    { label: "Super Admin", value: 12, color: "#8b5cf6" },
    { label: "Platform Admin", value: 144, color: "#ec4899" },
    { label: "Merchant Admin", value: 632, color: "#f59e0b" },
    { label: "Merchant Staff", value: 5586, color: "#3b82f6" },
    { label: "Customers", value: 17468, color: "#10b981" }
  ];

  const authMethods = [
    { label: "Password", value: 12456, color: "#8b5cf6" },
    { label: "MFA", value: 7128, color: "#10b981" },
    { label: "SSO", value: 3248, color: "#f59e0b" },
    { label: "API Keys", value: 1010, color: "#3b82f6" }
  ];

  const roleDistribution = [
    { label: "Super Admin", value: 1, color: "#8b5cf6" },
    { label: "Platform Admin", value: 8, color: "#ec4899" },
    { label: "Merchant Admin", value: 24, color: "#f59e0b" },
    { label: "Support Admin", value: 18, color: "#f43f5e" },
    { label: "Finance Admin", value: 12, color: "#10b981" },
    { label: "Merchant Staff", value: 68, color: "#3b82f6" },
    { label: "Others", value: 25, color: "#64748b" }
  ];

  const userRisk = [
    { label: "Low Risk", value: 20145, color: "#10b981" },
    { label: "Medium Risk", value: 2456, color: "#f59e0b" },
    { label: "High Risk", value: 1241, color: "#ef4444" }
  ];

  const topUsers = [
    { user: "john.doe@example.com", role: "Platform Admin", logins: 56, last: "2 min ago" },
    { user: "sarah.miller@example.com", role: "Security Admin", logins: 42, last: "5 min ago" },
    { user: "admin@katabazaar.com", role: "Super Admin", logins: 38, last: "10 min ago" },
    { user: "merchant_admin_12", role: "Merchant Admin", logins: 28, last: "15 min ago" },
    { user: "support_admin_08", role: "Support Admin", logins: 26, last: "18 min ago" },
  ];

  const recentLogins = [
    { time: "10:42:31", user: "john.doe@example.com", ip: "103.21.244.11", loc: "New Delhi, India", status: "Success", device: "Chrome / Windows", sc: "text-emerald-500" },
    { time: "10:41:08", user: "attacker@temp-mail.com", ip: "185.199.108.153", loc: "Unknown", status: "Failed", device: "Firefox / Linux", sc: "text-red-500" },
    { time: "10:40:12", user: "sarah.miller@example.com", ip: "103.21.244.12", loc: "Bengaluru, India", status: "Success", device: "Chrome / MacOS", sc: "text-emerald-500" },
    { time: "10:39:44", user: "random@domain.com", ip: "45.153.23.91", loc: "Russia", status: "Failed", device: "Safari / iOS", sc: "text-red-500" },
    { time: "10:38:21", user: "merchant_admin_12", ip: "103.21.244.15", loc: "Mumbai, India", status: "Success", device: "Edge / Windows", sc: "text-emerald-500" },
  ];

  const lockedAccounts = [
    { user: "attacker@temp-mail.com", reason: "Multiple failed logins", lockedAt: "10:40 AM" },
    { user: "fraud.user@temp.com", reason: "Suspicious activity", lockedAt: "09:52 AM" },
    { user: "test123@demo.com", reason: "Brute force attempt", lockedAt: "Yesterday" },
    { user: "spam.user@domain.com", reason: "Policy violation", lockedAt: "Yesterday" },
    { user: "new.hacker@domain.com", reason: "Malware detected", lockedAt: "2 days ago" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans overflow-x-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Identity & Access Dashboard <span className="material-symbols-outlined text-[20px] text-purple-400">group</span>
          </h1>
          <p className="text-[11px] text-zinc-400 mt-1">Manage users, roles, permissions, authentication and access across the platform.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
            All Environments
            <span className="material-symbols-outlined text-[14px] ml-1">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 p-6 space-y-4 lg:min-w-0">
            
            {/* Row 1: Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {topKPIs.map((kpi, i) => (
                <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded p-3 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 mb-1">
                    <span className="material-symbols-outlined text-[14px] shrink-0" style={{ color: kpi.scolor }}>{kpi.icon}</span>
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">{kpi.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white whitespace-nowrap truncate">{kpi.value}</div>
                  <div className="flex items-end justify-between mt-1 gap-2">
                    <div className={`text-[9px] truncate ${kpi.isRed ? 'text-red-500' : 'text-emerald-400'}`}>{kpi.sub}</div>
                    <Spark data={kpi.spark} color={kpi.scolor} />
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Users Overview */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Users Overview</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All Users</Link>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <DonutChart items={usersOverview} totalValue="23,842" totalLabel="Total Users" />
                  <div className="flex-1 space-y-2">
                    {usersOverview.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white font-medium">{item.value}</span>
                          <span className="text-zinc-500 w-8 text-right">({((item.value/23842)*100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">User Growth <span className="text-zinc-500 font-normal text-[10px]">(Last 7 Days)</span></h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex-1 relative min-h-[120px]">
                  <AreaChart data={[10,12,11,15,18,20,25]} color="#8b5cf6" />
                </div>
              </div>

              {/* Authentication Methods */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Authentication Methods</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <DonutChart items={authMethods} totalValue="23,842" totalLabel="Total Auth" />
                  <div className="flex-1 space-y-2">
                    {authMethods.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white font-medium">{item.value.toLocaleString()}</span>
                          <span className="text-zinc-500 w-8 text-right">({((item.value/23842)*100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Secondary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Role Distribution */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Role Distribution</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <DonutChart items={roleDistribution} totalValue="156" totalLabel="Total Roles" />
                  <div className="flex-1 space-y-1">
                    {roleDistribution.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white">{item.value}</span>
                          <span className="text-zinc-500 w-6 text-right">({((item.value/156)*100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Risk Overview */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">User Risk Overview</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <DonutChart items={userRisk} totalValue="23,842" totalLabel="Total Users" />
                  <div className="flex-1 space-y-2">
                    {userRisk.map((item, i) => (
                      <div key={i} className="flex flex-col text-[10px]">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="pl-3.5 flex gap-1">
                          <span className="text-white">{item.value.toLocaleString()}</span>
                          <span className="text-zinc-500">({((item.value/23842)*100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MFA Adoption Trend */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">MFA Adoption Trend</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex-1 min-h-[120px]">
                  <BarChart data={[58, 60, 61, 63, 64, 66, 68]} labels={["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"]} color="#8b5cf6" />
                </div>
              </div>
            </div>

            {/* Row 3: Smaller Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top Users by Login Frequency */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Top Users by Login Frequency</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800/60">
                        <th className="pb-2 font-medium">User</th>
                        <th className="pb-2 font-medium">Role</th>
                        <th className="pb-2 font-medium text-center">Logins (7D)</th>
                        <th className="pb-2 font-medium text-right">Last Login</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {topUsers.map((u, i) => (
                        <tr key={i} className="border-b border-zinc-800/30">
                          <td className="py-2.5 pr-2 truncate max-w-[120px]">{u.user}</td>
                          <td className="py-2.5 text-zinc-400">{u.role}</td>
                          <td className="py-2.5 text-center text-white">{u.logins}</td>
                          <td className="py-2.5 text-right text-zinc-500">{u.last}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Locked Accounts */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Locked Accounts</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800/60">
                        <th className="pb-2 font-medium">User</th>
                        <th className="pb-2 font-medium">Reason</th>
                        <th className="pb-2 font-medium text-right">Locked At</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {lockedAccounts.map((l, i) => (
                        <tr key={i} className="border-b border-zinc-800/30">
                          <td className="py-2.5 truncate max-w-[120px]">{l.user}</td>
                          <td className="py-2.5 text-zinc-400 truncate max-w-[150px]">{l.reason}</td>
                          <td className="py-2.5 text-right text-zinc-500">{l.lockedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Row 4: Wide Table */}
            <div className="grid grid-cols-1 gap-4">
              {/* Recent Login Attempts */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Recent Login Attempts</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800/60">
                        <th className="pb-2 font-medium">Time</th>
                        <th className="pb-2 font-medium">User</th>
                        <th className="pb-2 font-medium">IP Address</th>
                        <th className="pb-2 font-medium">Location</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Device</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {recentLogins.map((l, i) => (
                        <tr key={i} className="border-b border-zinc-800/30">
                          <td className="py-2.5 text-zinc-500">{l.time}</td>
                          <td className="py-2.5">{l.user}</td>
                          <td className="py-2.5 text-zinc-400 font-mono">{l.ip}</td>
                          <td className="py-2.5">{l.loc}</td>
                          <td className={`py-2.5 font-medium ${l.sc}`}>{l.status}</td>
                          <td className="py-2.5 text-zinc-400">{l.device}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Panel (Sidebar) ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-[320px] border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-6 shrink-0 lg:flex-none">
            
            {/* Security Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Security Alerts</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-2">
                {[
                  { e: "Multiple failed login attempts", d: "User: john.doe@example.com", t: "2m ago", risk: "High", sc: "text-red-500", bg: "bg-red-500/10" },
                  { e: "Unusual login location detected", d: "User: sarah.miller@example.com", t: "8m ago", risk: "High", sc: "text-red-500", bg: "bg-red-500/10" },
                  { e: "Privilege escalation attempt", d: "User: admin_test", t: "15m ago", risk: "Medium", sc: "text-amber-500", bg: "bg-amber-500/10" },
                  { e: "New device login", d: "User: david.wilson@example.com", t: "32m ago", risk: "Low", sc: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { e: "MFA disabled", d: "User: merchant_admin_23", t: "1h ago", risk: "High", sc: "text-red-500", bg: "bg-red-500/10" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-start border-b border-zinc-800/50 pb-2.5">
                    <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 ${a.bg} ${a.sc}`}>
                      <span className="material-symbols-outlined text-[14px]">lock_person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium text-zinc-200 truncate">{a.e}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{a.d}</div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className={`text-[9px] font-medium ${a.sc}`}>{a.risk}</span>
                      <span className="text-[9px] text-zinc-600">{a.t}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Recent Activity</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { e: "User created", d: "newuser@katabazaar.com", t: "5m ago", icon: "person_add" },
                  { e: "Role updated", d: "Merchant Staff", t: "12m ago", icon: "manage_accounts" },
                  { e: "Permission changed", d: "User: merchant_admin_12", t: "18m ago", icon: "admin_panel_settings" },
                  { e: "MFA enabled", d: "User: john.doe@example.com", t: "25m ago", icon: "verified_user" },
                  { e: "User locked", d: "User: attacker@temp-mail.com", t: "1h ago", icon: "lock", sc: "text-red-500" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`mt-0.5 shrink-0 ${a.sc || "text-zinc-400"}`}>
                      <span className="material-symbols-outlined text-[14px]">{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium text-zinc-300">{a.e}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{a.d}</div>
                    </div>
                    <div className="text-[9px] text-zinc-600 shrink-0">{a.t}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-[12px] font-bold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded p-2 text-[10px] text-zinc-300 flex items-center justify-start gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-purple-400">person_add</span> Add User
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded p-2 text-[10px] text-zinc-300 flex items-center justify-start gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-blue-400">add</span> Add Admin
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded p-2 text-[10px] text-zinc-300 flex items-center justify-start gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-amber-400">manage_accounts</span> Manage Roles
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded p-2 text-[10px] text-zinc-300 flex items-center justify-start gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">lock_open</span> Access Control
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded p-2 text-[10px] text-zinc-300 flex items-center justify-start gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-orange-400">key</span> Reset Password
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded p-2 text-[10px] text-zinc-300 flex items-center justify-start gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-pink-400">download</span> User Import
                </button>
              </div>
            </div>

            {/* Logged-in Admins */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Logged-in Admins (5)</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Platform Admin", loc: "New Delhi, India", status: "Active", sc: "text-emerald-500", bg: "bg-emerald-500" },
                  { name: "Security Admin", loc: "Bengaluru, India", status: "Active", sc: "text-emerald-500", bg: "bg-emerald-500" },
                  { name: "DevOps Admin", loc: "Mumbai, India", status: "Active", sc: "text-emerald-500", bg: "bg-emerald-500" },
                  { name: "Support Admin", loc: "Kolkata, India", status: "Idle", sc: "text-amber-500", bg: "bg-amber-500" },
                  { name: "Finance Admin", loc: "Hyderabad, India", status: "Active", sc: "text-emerald-500", bg: "bg-emerald-500" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="material-symbols-outlined text-[16px] text-zinc-400">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-zinc-200">{a.name}</div>
                      <div className="text-[9px] text-zinc-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">location_on</span> {a.loc}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[9px] ${a.sc}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${a.bg}`}></span>
                      {a.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
