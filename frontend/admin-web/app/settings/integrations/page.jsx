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
  const id = `spk-int-${color.replace("#", "")}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible mt-1 shrink-0" preserveAspectRatio="none">
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
        <div className="text-lg font-bold text-white leading-tight">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center">{totalLabel}</div>
      </div>
    </div>
  );
}

function MultiLineChart({ series, labels = [], height = 120 }) {
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals, 1), w = 440;
  const pts = (data) => data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`mlli-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      {series.map((s, i) => {
        const area = `M0,${height} ${s.data.map((v, j) => `L${(j / Math.max(s.data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
        return (
          <g key={i}>
            <path d={area} fill={`url(#mlli-${i})`} />
            <polyline points={pts(s.data)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, j) => (
              <circle key={j} cx={(j / Math.max(s.data.length - 1, 1)) * w} cy={height - (v / max) * height} r="3" fill={s.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function CircleGauge({ pct, label, size = 80 }) {
  const r = 36, cx = 40, cy = 40, circum = 2 * Math.PI * r;
  const dash = `${(pct / 100) * circum} ${circum}`;
  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90 absolute inset-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="6" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth="6"
          strokeDasharray={dash} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[14px] font-bold text-white">{pct}%</span>
        <span className="text-[7px] text-zinc-400 text-center leading-none mt-0.5 w-12">{label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "integration_instructions", label: "Total Integrations", value: "24", sub: "+14.3% vs last 7 days", up: true, color: "#3b82f6", sp: [20, 21, 21, 22, 23, 23, 24] },
  { icon: "check_circle", label: "Active Integrations", value: "18", sub: "+12.5% vs last 7 days", up: true, color: "#10b981", sp: [15, 16, 16, 17, 17, 18, 18] },
  { icon: "hub", label: "Connected Services", value: "16", sub: "+10.2% vs last 7 days", up: true, color: "#8b5cf6", sp: [12, 13, 14, 14, 15, 15, 16] },
  { icon: "webhook", label: "Webhook Endpoints", value: "28", sub: "+16.7% vs last 7 days", up: true, color: "#f59e0b", sp: [20, 22, 24, 25, 26, 28, 28] },
  { icon: "cancel", label: "Failed Integrations", value: "2", sub: "-33.3% vs last 7 days", up: false, color: "#ef4444", sp: [4, 3, 3, 2, 2, 2, 2] },
  { icon: "sync", label: "Sync Success Rate", value: "98.6%", sub: "+2.8% vs last 7 days", up: true, color: "#06b6d4", sp: [95, 96, 97, 98, 98.2, 98.5, 98.6] },
];

const healthOverview = [
  { label: "Healthy", value: 18, pct: "75.0%", color: "#10b981" },
  { label: "Warning", value: 3, pct: "12.5%", color: "#f59e0b" },
  { label: "Errored", value: 2, pct: "8.3%", color: "#ef4444" },
  { label: "Inactive", value: 1, pct: "4.2%", color: "#6b7280" },
];

const integrationsByCategory = [
  { label: "Payments", value: 6, pct: "25.0%", color: "#3b82f6" },
  { label: "Communication", value: 5, pct: "20.8%", color: "#10b981" },
  { label: "Analytics", value: 4, pct: "16.7%", color: "#f59e0b" },
  { label: "Cloud & Infra", value: 4, pct: "16.7%", color: "#8b5cf6" },
  { label: "Marketing", value: 3, pct: "12.5%", color: "#06b6d4" },
  { label: "Others", value: 2, pct: "8.3%", color: "#ef4444" },
];

const trendSeries = [
  { label: "Healthy", color: "#10b981", data: [15, 16, 17, 17, 18, 18, 18] },
  { label: "Warning", color: "#f59e0b", data: [2, 3, 3, 4, 3, 3, 3] },
  { label: "Errored", color: "#ef4444", data: [4, 3, 2, 2, 3, 2, 2] },
  { label: "Inactive", color: "#6b7280", data: [2, 2, 1, 1, 1, 1, 1] },
];
const trendLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const allIntegrations = [
  { name: "Razorpay", icon: "account_balance_wallet", color: "#3b82f6", cat: "Payments", status: "Healthy", health: "100%", lastSync: "May 27, 2025 10:20 AM", time: "120 ms", usage: 90 },
  { name: "Cashfree", icon: "payments", color: "#10b981", cat: "Payments", status: "Healthy", health: "99%", lastSync: "May 27, 2025 10:18 AM", time: "140 ms", usage: 60 },
  { name: "SendGrid", icon: "mark_email_unread", color: "#0ea5e9", cat: "Communication", status: "Healthy", health: "100%", lastSync: "May 27, 2025 09:58 AM", time: "180 ms", usage: 80 },
  { name: "Twilio SMS", icon: "sms", color: "#ef4444", cat: "Communication", status: "Warning", health: "92%", lastSync: "May 27, 2025 09:30 AM", time: "230 ms", usage: 50 },
  { name: "Google Analytics", icon: "analytics", color: "#f59e0b", cat: "Analytics", status: "Healthy", health: "100%", lastSync: "May 27, 2025 10:22 AM", time: "90 ms", usage: 85 },
  { name: "Mixpanel", icon: "query_stats", color: "#8b5cf6", cat: "Analytics", status: "Warning", health: "88%", lastSync: "May 27, 2025 09:45 AM", time: "310 ms", usage: 30 },
  { name: "AWS S3", icon: "cloud", color: "#f97316", cat: "Cloud & Infra", status: "Healthy", health: "100%", lastSync: "May 27, 2025 10:21 AM", time: "110 ms", usage: 65 },
  { name: "Cloudflare", icon: "security", color: "#f59e0b", cat: "Cloud & Infra", status: "Errored", health: "60%", lastSync: "May 27, 2025 07:30 AM", time: "—", usage: 75 },
  { name: "Mailchimp", icon: "campaign", color: "#eab308", cat: "Marketing", status: "Inactive", health: "—", lastSync: "Never", time: "—", usage: 0 },
  { name: "WhatsApp API", icon: "chat", color: "#22c55e", cat: "Communication", status: "Healthy", health: "99%", lastSync: "May 27, 2025 10:15 AM", time: "160 ms", usage: 55 },
];

const topIntegrations = [
  { name: "Razorpay", pct: 72.4 },
  { name: "SendGrid", pct: 58.2 },
  { name: "Google Analytics", pct: 41.7 },
  { name: "AWS S3", pct: 36.5 },
  { name: "Twilio SMS", pct: 32.1 },
];

const categoryCards = [
  { label: "Payments", count: "6 Integrations", icon: "payments", color: "#3b82f6" },
  { label: "Communication", count: "5 Integrations", icon: "mail", color: "#f59e0b" },
  { label: "Analytics", count: "4 Integrations", icon: "analytics", color: "#10b981" },
  { label: "Cloud & Infra", count: "4 Integrations", icon: "cloud", color: "#8b5cf6" },
  { label: "Marketing", count: "3 Integrations", icon: "campaign", color: "#0ea5e9" },
  { label: "Others", count: "2 Integrations", icon: "widgets", color: "#6b7280" },
];

const recentActivity = [
  { text: "Razorpay integration synced", time: "2m ago", color: "#3b82f6", icon: "sync" },
  { text: "SMTP settings updated", time: "12m ago", color: "#10b981", icon: "settings" },
  { text: "Twilio SMS credentials updated", time: "21m ago", color: "#ef4444", icon: "key" },
  { text: "Google Analytics reconnected", time: "1h ago", color: "#f59e0b", icon: "link" },
  { text: "New webhook endpoint added", time: "2h ago", color: "#06b6d4", icon: "add_circle" },
  { text: "Cloudflare integration updated", time: "3h ago", color: "#8b5cf6", icon: "edit" },
  { text: "Mailchimp integration disabled", time: "5h ago", color: "#6b7280", icon: "power_settings_new" },
  { text: "AWS S3 bucket updated", time: "6h ago", color: "#f97316", icon: "cloud_upload" },
];

const integrationAlerts = [
  { title: "Cloudflare SSL certificate expiring", sub: "in 12 days", time: "1h ago", icon: "warning", color: "#f59e0b" },
  { title: "Twilio SMS balance low", sub: "Please recharge", time: "2h ago", icon: "warning", color: "#f59e0b" },
  { title: "Razorpay webhook signature", sub: "mismatch detected", time: "3h ago", icon: "error", color: "#ef4444" },
  { title: "Mailchimp API rate limit", sub: "approaching", time: "5h ago", icon: "warning", color: "#f59e0b" },
  { title: "Google Analytics property", sub: "not receiving data", time: "6h ago", icon: "warning", color: "#f59e0b" },
];

const recentFailures = [
  { name: "Order Created Webhook", time: "May 27, 2025 10:12 AM", code: "500" },
  { name: "Payment Failed Webhook", time: "May 27, 2025 09:58 AM", code: "Timeout" },
  { name: "Inventory Update Webhook", time: "May 27, 2025 09:31 AM", code: "400" },
];

const quickActions = [
  { icon: "add_box", label: "Add Integration", color: "#3b82f6" },
  { icon: "webhook", label: "Configure Webhook", color: "#8b5cf6" },
  { icon: "power", label: "Test Connection", color: "#10b981" },
  { icon: "api", label: "API Explorer", color: "#8b5cf6" },
  { icon: "sync", label: "Sync All Integrations", color: "#3b82f6" },
  { icon: "article", label: "View Logs", color: "#f59e0b" },
  { icon: "backup", label: "Backup Integrations", color: "#0ea5e9" },
  { icon: "upload_file", label: "Import Config", color: "#f59e0b" },
  { icon: "download", label: "Export Config", color: "#10b981" },
];

function statusBadge(status) {
  if (status === "Healthy") return "bg-emerald-500/20 text-emerald-400";
  if (status === "Warning") return "bg-amber-500/20 text-amber-400";
  if (status === "Errored") return "bg-red-500/20 text-red-400";
  return "bg-zinc-500/20 text-zinc-400";
}

function healthColor(status) {
  if (status === "Healthy") return "text-emerald-400";
  if (status === "Warning") return "text-amber-400";
  if (status === "Errored") return "text-red-400";
  return "text-zinc-500";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function IntegrationsDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Integrations Dashboard
            <span className="material-symbols-outlined text-[18px] text-purple-400">link</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage third-party services, APIs, webhooks and connected integrations.</p>
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">menu_book</span> View Docs
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
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${k.color}15` }}>
                    <span className="material-symbols-outlined text-[14px]" style={{ color: k.color }}>{k.icon}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium leading-tight">{k.label}</span>
                </div>
                <div className="text-xl font-bold text-white mt-1">{k.value}</div>
                <div className={`text-[9px] flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                  <span className="material-symbols-outlined text-[11px]">{k.up ? "arrow_upward" : "arrow_downward"}</span>
                  {k.sub}
                </div>
                <Spark data={k.sp} color={k.color} height={20} />
              </div>
            ))}
          </div>

          {/* Row 2: Health Overview Donut + Status Trend + Category Donut */}
          <div className="grid grid-cols-12 gap-4">

            {/* Health Overview */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Integration Health Overview</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={healthOverview} totalValue="24" totalLabel="Total" size={120} />
                <div className="space-y-1.5 flex-1">
                  {healthOverview.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: r.color }} />
                        <span className="text-zinc-300">{r.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-medium">{r.value}</span>
                        <span className="text-zinc-500">({r.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Integrations Status Trend */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Integrations Status Trend</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Daily</option>
                </select>
              </div>
              <div className="flex gap-3 mb-2 justify-center">
                {trendSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[9px]">
                    <span className="w-3 h-0.5 inline-block" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-1 min-h-[100px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={trendSeries} labels={trendLabels} height={110} />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
                {trendLabels.map(l => <span key={l}>{l.replace("May ", "")}</span>)}
              </div>
            </div>

            {/* Category Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Integrations by Category</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={integrationsByCategory} totalValue="24" totalLabel="Total" size={120} />
                <div className="space-y-1.5 flex-1">
                  {integrationsByCategory.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: f.color }} />
                        <span className="text-zinc-300">{f.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-medium">{f.value}</span>
                        <span className="text-zinc-500">({f.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: All Integrations Table + Webhook Delivery */}
          <div className="grid grid-cols-12 gap-4">

            {/* All Integrations Table */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">All Integrations</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All Integrations</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">Integration Name</th>
                      <th className="text-left pb-3 font-medium">Category</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-center pb-3 font-medium">Health</th>
                      <th className="text-left pb-3 font-medium">Last Sync</th>
                      <th className="text-right pb-3 font-medium">Response Time</th>
                      <th className="text-center pb-3 font-medium">Usage</th>
                      <th className="text-right pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {allIntegrations.map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: `${r.color}20` }}>
                              <span className="material-symbols-outlined text-[13px]" style={{ color: r.color }}>{r.icon}</span>
                            </div>
                            <span className="text-zinc-200 font-medium">{r.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-zinc-400">{r.cat}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-medium ${statusBadge(r.status)}`}>{r.status}</span>
                        </td>
                        <td className={`py-3 text-center font-bold ${healthColor(r.status)}`}>{r.health}</td>
                        <td className="py-3 text-zinc-400 whitespace-nowrap">{r.lastSync}</td>
                        <td className="py-3 text-right text-zinc-300 font-mono text-[11px]">{r.time}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-zinc-500 w-8 text-right">
                              {r.usage > 70 ? "High" : r.usage > 40 ? "Medium" : r.usage === 0 ? "—" : "Low"}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden w-12">
                              {r.usage > 0 && (
                                <div className="h-full rounded-full" style={{ width: `${r.usage}%`, background: r.usage > 70 ? "#10b981" : r.usage > 40 ? "#f59e0b" : "#ef4444" }} />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2 text-zinc-400">
                            <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">visibility</span>
                            <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">settings</span>
                            <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">more_vert</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[10px] text-zinc-500 mt-2">Showing 1 to 10 of 24 integrations</div>
            </div>
          </div>

          {/* Row 3.5: Webhook Delivery & Recent Failures */}
          <div className="grid grid-cols-12 gap-4">

            {/* Webhook Delivery */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-white">Webhook Delivery</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <CircleGauge pct={98.3} label="Success Rate" size={100} />
                  <div className="w-full space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500"/><span className="text-zinc-300">Successful</span></div>
                      <div className="flex gap-1.5"><span className="text-white font-medium">1,245</span><span className="text-zinc-500">(98.3%)</span></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500"/><span className="text-zinc-300">Failed</span></div>
                      <div className="flex gap-1.5"><span className="text-white font-medium">18</span><span className="text-zinc-500">(1.4%)</span></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-500"/><span className="text-zinc-300">Pending</span></div>
                      <div className="flex gap-1.5"><span className="text-white font-medium">5</span><span className="text-zinc-500">(0.3%)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            {/* Recent Failures */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Recent Failures</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-3">
                {recentFailures.map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-zinc-200 font-medium">{f.name}</div>
                      <div className="text-[9px] text-zinc-500">{f.time}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      {f.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Top Integrations + Categories + Performance */}
          <div className="grid grid-cols-12 gap-4">

            {/* Top Integrations by Usage */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-white">Top Integrations by Usage</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-3">
                {topIntegrations.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 w-2">{i + 1}</span>
                    <span className="text-[11px] text-zinc-200 w-24 truncate">{t.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${t.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-zinc-400 w-8 text-right">{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Categories Grid */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Integration Categories</h3>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {categoryCards.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]" style={{ color: c.color }}>{c.icon}</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-200 font-medium">{c.label}</div>
                      <div className="text-[9px] text-zinc-500">{c.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Performance */}
            <div className="col-span-12 lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Integration Performance</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                <div className="flex flex-col border-r border-zinc-800 pr-3">
                  <span className="text-[10px] text-zinc-400 mb-1">Avg Response Time</span>
                  <span className="text-xl font-bold text-white">162 ms</span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-[10px]">arrow_downward</span> 8.6%
                  </span>
                </div>
                <div className="flex flex-col border-r border-zinc-800 pr-3">
                  <span className="text-[10px] text-zinc-400 mb-1">Total Requests</span>
                  <span className="text-xl font-bold text-white">45,782</span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-[10px]">arrow_upward</span> 15.2%
                  </span>
                </div>
                <div className="flex flex-col border-r border-zinc-800 pr-3">
                  <span className="text-[10px] text-zinc-400 mb-1">Failed Requests</span>
                  <span className="text-xl font-bold text-white">287</span>
                  <span className="text-[9px] text-red-400 flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-[10px]">arrow_downward</span> 23.1%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 mb-1">Data Transferred</span>
                  <span className="text-xl font-bold text-white">12.48 GB</span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-[10px]">arrow_upward</span> 18.7%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-bold text-white">Recent Activity</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-3.5 relative before:absolute before:inset-y-1 before:left-3 before:w-px before:bg-zinc-800">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center z-10 shrink-0">
                    <span className="material-symbols-outlined text-[12px]" style={{ color: a.color }}>{a.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="text-[10px] text-zinc-300 leading-tight pr-12">{a.text}</div>
                  </div>
                  <div className="text-[9px] text-zinc-500 shrink-0 absolute right-0 top-1">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Integration Alerts</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {integrationAlerts.map((a, i) => (
                <div key={i} className="flex gap-2.5 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50" style={{ background: a.color }} />
                  <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5" style={{ color: a.color }}>{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium leading-tight">{a.title}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{a.sub}</div>
                  </div>
                  <div className="text-[9px] text-zinc-500 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-2">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group aspect-square">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-zinc-800" style={{ background: `${q.color}10` }}>
                    <span className="material-symbols-outlined text-[15px]" style={{ color: q.color }}>{q.icon}</span>
                  </div>
                  <span className="text-[8px] text-zinc-400 text-center leading-[1.1] group-hover:text-zinc-200 px-1">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
