"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Components
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data = [], color = "#3b82f6", height = 24 }) {
  if (!data.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1), w = 80;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  const area = `M0,${height} ${data.map((v, i) => `L${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
  const id = `sp-${color.replace("#", "")}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible mt-1" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ items, totalValue, totalLabel, size = 110 }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  const r = 44, cx = 60, cy = 60, circum = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="14" />
        {items.map((item, i) => {
          const pct = item.value / total;
          const dash = `${pct * circum} ${circum}`;
          const offset = -(cum * circum);
          cum += pct;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={item.color} strokeWidth="14" strokeDasharray={dash} strokeDashoffset={offset} className="transition-all duration-700" />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-sm font-bold text-white">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center">{totalLabel}</div>
      </div>
    </div>
  );
}

function GaugeChart({ value, max = 100, label }) {
  // Semi-circle gauge
  const r = 50, cx = 60, cy = 65;
  const startAngle = -180, endAngle = 0;
  const range = endAngle - startAngle;
  const valuePct = value / max;
  const angle = startAngle + valuePct * range;
  const toRad = (a) => (a * Math.PI) / 180;
  const arcPath = (start, end, radius) => {
    const s = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const e = { x: cx + radius * Math.cos(toRad(end)), y: cy + radius * Math.sin(toRad(end)) };
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };
  const color = value >= 90 ? "#10b981" : value >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 80" className="w-full max-w-[180px]">
        <path d={arcPath(-180, 0, r)} fill="none" stroke="#1f2937" strokeWidth="12" strokeLinecap="round" />
        <path d={arcPath(-180, angle, r)} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" className="transition-all duration-1000" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{value}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="#9ca3af" fontSize="8">/100</text>
      </svg>
      <div className="text-[11px] font-semibold mt-1" style={{ color }}>{label}</div>
    </div>
  );
}

function BarSparkRow({ data, height = 32 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 w-full" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t transition-all duration-500" style={{ height: `${(v / max) * height}px`, background: v > max * 0.8 ? "#10b981" : "#22c55e" }} />
      ))}
    </div>
  );
}

function Toggle({ on = true }) {
  return (
    <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${on ? "bg-purple-600" : "bg-zinc-700"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-5.5 translate-x-0.5" : "left-0.5"}`} style={{ left: on ? "calc(100% - 18px)" : "2px" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "settings", label: "Total Settings", value: "256", sub: "+12.5% vs last 7 days", up: true, color: "#3b82f6", sp: [200, 210, 215, 225, 235, 245, 256] },
  { icon: "view_module", label: "Groups / Modules", value: "24", sub: "+9.8% vs last 7 days", up: true, color: "#8b5cf6", sp: [18, 19, 20, 21, 22, 23, 24] },
  { icon: "check_circle", label: "Active Configs", value: "231", sub: "+14.6% vs last 7 days", up: true, color: "#10b981", sp: [180, 190, 200, 210, 220, 226, 231] },
  { icon: "pending_actions", label: "Pending Changes", value: "8", sub: "-11.1% vs last 7 days", up: false, color: "#f59e0b", sp: [12, 11, 10, 9, 9, 8, 8] },
  { icon: "tune", label: "System Preferences", value: "42", sub: "+7.2% vs last 7 days", up: true, color: "#06b6d4", sp: [34, 36, 37, 38, 39, 41, 42] },
  { icon: "flag", label: "Feature Toggles", value: "36", sub: "+18.9% vs last 7 days", up: true, color: "#ef4444", sp: [22, 25, 28, 30, 32, 34, 36] },
];

const settingsOverview = [
  { label: "General Settings", value: 78, pct: "30.5%", color: "#3b82f6" },
  { label: "Security Settings", value: 52, pct: "20.3%", color: "#8b5cf6" },
  { label: "Payment Settings", value: 38, pct: "14.8%", color: "#f59e0b" },
  { label: "Notification Settings", value: 28, pct: "10.9%", color: "#10b981" },
  { label: "Localization Settings", value: 24, pct: "9.4%", color: "#06b6d4" },
  { label: "Other Settings", value: 36, pct: "14.1%", color: "#6b7280" },
];

const settingsGroups = [
  { name: "General", count: 42, status: "Active", updated: "May 27, 2025 09:45 AM" },
  { name: "Security", count: 36, status: "Active", updated: "May 27, 2025 08:22 AM" },
  { name: "Payment", count: 28, status: "Active", updated: "May 26, 2025 11:10 PM" },
  { name: "Notification", count: 24, status: "Active", updated: "May 26, 2025 09:15 PM" },
  { name: "Localization", count: 20, status: "Active", updated: "May 26, 2025 06:05 PM" },
  { name: "Email", count: 18, status: "Active", updated: "May 26, 2025 05:30 PM" },
  { name: "Features", count: 16, status: "Active", updated: "May 26, 2025 04:40 PM" },
  { name: "Maintenance", count: 12, status: "Active", updated: "May 26, 2025 03:25 PM" },
  { name: "Other", count: 60, status: "Active", updated: "May 26, 2025 02:10 PM" },
];

const healthData = [70, 85, 90, 95, 88, 92, 100, 95, 90, 92, 95, 100, 98, 100];

const modules = [
  { icon: "store", label: "Marketplace Module", status: "Enabled", color: "#3b82f6", desc: "Core marketplace functionality including orders, payments and listings." },
  { icon: "storefront", label: "Merchant Module", status: "Enabled", color: "#8b5cf6", desc: "Merchant management, onboarding, stores and payouts." },
  { icon: "person", label: "Customer Module", status: "Enabled", color: "#10b981", desc: "Customer management, profiles, addresses and loyalty." },
  { icon: "bar_chart", label: "Analytics Module", status: "Enabled", color: "#f59e0b", desc: "Analytics, reporting and business intelligence features." },
  { icon: "mail", label: "Communication Module", status: "Enabled", color: "#06b6d4", desc: "Email, SMS, WhatsApp and push notification management." },
  { icon: "support_agent", label: "Support Module", status: "Enabled", color: "#ef4444", desc: "Ticketing, helpdesk and customer support management." },
  { icon: "psychology", label: "AI Module", status: "Beta", color: "#a855f7", desc: "AI powered features and automation capabilities." },
];

const recentActivity = [
  { icon: "edit", text: "Site name updated", sub: "Katabazaar Marketplace", time: "2m ago", color: "#10b981" },
  { icon: "build", text: "Maintenance mode disabled", sub: "Platform is live", time: "15m ago", color: "#3b82f6" },
  { icon: "payments", text: "Payment gateway config updated", sub: "Razorpay Settings", time: "32m ago", color: "#f59e0b" },
  { icon: "mail", text: "Email SMTP settings updated", sub: "SMTP Host changed", time: "1h ago", color: "#8b5cf6" },
  { icon: "flag", text: "New feature flag created", sub: "New UI Rollout", time: "2h ago", color: "#06b6d4" },
  { icon: "security", text: "Security setting updated", sub: "Password Policy", time: "3h ago", color: "#ef4444" },
  { icon: "language", text: "Localization updated", sub: "English (IN)", time: "4h ago", color: "#6b7280" },
];

const configAlerts = [
  { icon: "warning", text: "2 configurations need review", sub: "Security group", time: "30m ago", color: "#f59e0b" },
  { icon: "warning", text: "SMTP connection not verified", sub: "Email settings", time: "1h ago", color: "#f59e0b" },
  { icon: "info", text: "Deprecated setting detected", sub: "API v1 is deprecated", time: "2h ago", color: "#3b82f6" },
  { icon: "error", text: "Payment webhook not set", sub: "Razorpay webhook missing", time: "4h ago", color: "#ef4444" },
  { icon: "info", text: "Maintenance window upcoming", sub: "May 28, 02:00 AM – 04:00 AM", time: "6h ago", color: "#06b6d4" },
];

const quickActions = [
  { icon: "add_circle", label: "Create Setting", color: "#8b5cf6" },
  { icon: "upload", label: "Import Config", color: "#10b981" },
  { icon: "download", label: "Export Config", color: "#3b82f6" },
  { icon: "restart_alt", label: "Reset to Default", color: "#f59e0b" },
  { icon: "save", label: "Backup Settings", color: "#06b6d4" },
  { icon: "history", label: "View Change Log", color: "#ef4444" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function PlatformSettingsDashboard() {
  const [maintenance, setMaintenance] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Platform Settings Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Configure and manage platform wide settings, preferences and system configurations.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            May 21 – May 27, 2025
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((k, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]" style={{ color: k.color }}>{k.icon}</span>
                  <span className="text-[10px] text-zinc-400 font-medium leading-tight">{k.label}</span>
                </div>
                <div className="text-xl font-bold text-white">{k.value}</div>
                <div className={`text-[9px] flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                  <span className="material-symbols-outlined text-[11px]">{k.up ? "arrow_upward" : "arrow_downward"}</span>
                  {k.sub}
                </div>
                <Spark data={k.sp} color={k.color} height={20} />
              </div>
            ))}
          </div>

          {/* Row 2: Settings Overview + Settings Groups + Configuration Health */}
          <div className="grid grid-cols-12 gap-4">

            {/* Settings Overview Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Settings Overview</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={settingsOverview} totalValue="256" totalLabel="Total Settings" size={110} />
                <div className="space-y-1.5 flex-1">
                  {settingsOverview.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: s.color }} />
                        <span className="text-zinc-300">{s.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-medium">{s.value}</span>
                        <span className="text-zinc-500">({s.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-3 text-[10px] text-purple-400 hover:text-purple-300 transition-colors text-center">View All Settings</button>
            </div>

            {/* Settings Groups Table */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Settings Groups</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[9px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-2 font-medium">Group Name</th>
                      <th className="text-center pb-2 font-medium">Settings</th>
                      <th className="text-center pb-2 font-medium">Status</th>
                      <th className="text-right pb-2 font-medium">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {settingsGroups.map((g, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-1.5 text-zinc-300 font-medium">{g.name}</td>
                        <td className="py-1.5 text-center text-white">{g.count}</td>
                        <td className="py-1.5 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-emerald-500/20 text-emerald-400">{g.status}</span>
                        </td>
                        <td className="py-1.5 text-right text-zinc-500 whitespace-nowrap">{g.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Configuration Health Gauge */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Configuration Health</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 w-[130px]">
                  <GaugeChart value={92} max={100} label="Excellent" />
                </div>
                <div className="space-y-2 flex-1">
                  {[
                    { label: "Valid Configurations", count: "231 (90.2%)", color: "#10b981" },
                    { label: "Warnings", count: "17 (6.6%)", color: "#f59e0b" },
                    { label: "Errors", count: "5 (2.0%)", color: "#ef4444" },
                    { label: "Deprecated", count: "3 (1.2%)", color: "#6b7280" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        <span className="text-zinc-300">{s.label}</span>
                      </div>
                      <span className="text-white font-medium">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <div className="text-[9px] text-zinc-500 mb-1.5">Health Score History (Last 7 Days)</div>
                <BarSparkRow data={healthData} height={36} />
                <div className="flex justify-between text-[8px] text-zinc-600 mt-1">
                  {["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"].map(d => <span key={d}>{d.replace("May ", "")}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Maintenance Mode + Localization + Email Config + Security Settings + System Preferences */}
          <div className="grid grid-cols-12 gap-4">

            {/* Maintenance Mode */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-white">Maintenance Mode</h3>
                <div onClick={() => setMaintenance(!maintenance)}><Toggle on={maintenance} /></div>
              </div>
              <p className="text-[10px] text-zinc-500">Maintenance mode allows you to lock the platform for maintenance activities.</p>
              <div className="space-y-2 text-[10px]">
                <div className="text-zinc-400 font-medium">Scheduled Maintenance</div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">May 28, 2025 02:00 AM – 04:00 AM IST</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-amber-500/20 text-amber-400">Scheduled</span>
                </div>
                {[
                  { label: "Date Format", val: "DD MMM YYYY" },
                  { label: "Time Format", val: "12 Hour" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-t border-zinc-800/50 pt-2">
                    <span className="text-zinc-500">{r.label}</span>
                    <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[9px] rounded px-2 py-0.5">{<option>{r.val}</option>}</select>
                  </div>
                ))}
              </div>
              <button className="mt-auto w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">Save Changes</button>
            </div>

            {/* Localization Settings */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-white">Localization Settings</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-2.5 text-[10px] flex-1">
                {[
                  { label: "Default Language", val: "🇮🇳 English (IN)" },
                  { label: "Supported Languages", val: "8" },
                  { label: "Default Currency", val: "INR (₹)" },
                  { label: "Timezone", val: "(UTC +05:30) Asia/Kolkata" },
                  { label: "Number Format", val: "1,23,456.78" },
                  { label: "Currency Position", val: "₹1,23,456.78" },
                  { label: "Default Country", val: "🇮🇳 India" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-800/40 pb-2">
                    <span className="text-zinc-400">{r.label}</span>
                    <span className="text-zinc-200 font-medium">{r.val}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">Manage Localization</button>
            </div>

            {/* Email Configuration */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-white">Email Configuration</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-2.5 text-[10px] flex-1">
                {[
                  { label: "SMTP Provider", val: "SendGrid" },
                  { label: "From Email", val: "no-reply@katabazaar.com" },
                  { label: "From Name", val: "Katabazaar" },
                  { label: "Reply To", val: "support@katabazaar.com" },
                  { label: "SMTP Status", val: "Connected", color: "text-emerald-400" },
                  { label: "Last Email Sent", val: "May 27, 2025 10:28 AM" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-800/40 pb-2">
                    <span className="text-zinc-400">{r.label}</span>
                    <span className={`font-medium ${r.color || "text-zinc-200"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">Test Email Configuration</button>
            </div>

            {/* Security Settings */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-white">Security Settings</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-2.5 text-[10px] flex-1">
                {[
                  { label: "Password Policy", val: "Strong (12+ chars)" },
                  { label: "Session Timeout", val: "30 Minutes" },
                  { label: "MFA Enforcement", val: "Enabled", color: "text-emerald-400" },
                  { label: "IP Whitelist", val: "Enabled", color: "text-emerald-400" },
                  { label: "Login Attempts Limit", val: "5" },
                  { label: "Password Expiry", val: "90 Days" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-800/40 pb-2">
                    <span className="text-zinc-400">{r.label}</span>
                    <span className={`font-medium ${r.color || "text-zinc-200"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">Manage Security Settings</button>
            </div>
          </div>

          {/* Row 4: System Preferences full-width */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-white">System Preferences</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Items Per Page</span>
                <span className="text-white font-medium">25</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Default Dashboard</span>
                <span className="text-white font-medium">Platform Overview</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Theme</span>
                <span className="text-white font-medium">Dark</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Sidebar Mode</span>
                <span className="text-white font-medium">Expanded</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Animations</span>
                <div onClick={() => setAnimations(!animations)}><Toggle on={animations} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Compact Mode</span>
                <div onClick={() => setCompactMode(!compactMode)}><Toggle on={compactMode} /></div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">Save Preferences</button>
          </div>

          {/* Row 5: Feature & Module Configuration */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-white">Feature & Module Configuration</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {modules.map((m, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}20` }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: m.color }}>{m.icon}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${m.status === "Beta" ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-emerald-400"}`}>{m.status}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-white leading-tight">{m.label}</div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed flex-1">{m.desc}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Toggle on={m.status !== "Disabled"} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Recent Activity</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${a.color}20` }}>
                    <span className="material-symbols-outlined text-[12px]" style={{ color: a.color }}>{a.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium">{a.text}</div>
                    <div className="text-[9px] text-zinc-500 truncate">{a.sub}</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Configuration Alerts</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {configAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0" style={{ color: a.color }}>{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium">{a.text}</div>
                    <div className="text-[9px] text-zinc-500">{a.sub}</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-2">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q, i) => (
                <button key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${q.color}20` }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: q.color }}>{q.icon}</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 text-center leading-tight group-hover:text-zinc-200">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom mini info */}
          <div className="mt-auto space-y-2">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-[10px] text-zinc-400 transition-colors">
              <span className="material-symbols-outlined text-[14px]">compare</span> Compare Configs
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-[10px] text-zinc-400 transition-colors">
              <span className="material-symbols-outlined text-[14px]">info</span> System Info
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
