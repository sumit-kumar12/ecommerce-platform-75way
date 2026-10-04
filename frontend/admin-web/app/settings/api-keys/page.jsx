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
  const id = `spk-${color.replace("#", "")}-${height}`;
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
        <div className="text-sm font-bold text-white">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center">{totalLabel}</div>
      </div>
    </div>
  );
}

function LineChart({ data, color = "#8b5cf6", labels = [], height = 120 }) {
  const max = Math.max(...data, 1), w = 440;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  const area = `M0,${height} ${data.map((v, i) => `L${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
  const id = `lc-${color.replace("#", "")}`;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={(i / Math.max(data.length - 1, 1)) * w} cy={height - (v / max) * height} r="3" fill={color} />
        ))}
      </svg>
      {labels.length > 0 && (
        <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
          {labels.map(l => <span key={l}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

function GaugeChart({ value, max = 100, label }) {
  const r = 50, cx = 60, cy = 65;
  const toRad = (a) => (a * Math.PI) / 180;
  const arcPath = (start, end, radius) => {
    const s = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const e = { x: cx + radius * Math.cos(toRad(end)), y: cy + radius * Math.sin(toRad(end)) };
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };
  const angle = -180 + (value / max) * 180;
  const color = value >= 90 ? "#10b981" : value >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 80" className="w-full max-w-[160px]">
        <path d={arcPath(-180, 0, r)} fill="none" stroke="#1f2937" strokeWidth="12" strokeLinecap="round" />
        <path d={arcPath(-180, angle, r)} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{value}</text>
        <text x={cx} y={cy + 17} textAnchor="middle" fill="#9ca3af" fontSize="7">/100</text>
      </svg>
      <div className="text-[11px] font-semibold -mt-1" style={{ color }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "key", label: "Total API Keys", value: "128", sub: "+12.8% vs last 7 days", up: true, color: "#3b82f6", sp: [90, 95, 100, 105, 110, 120, 128] },
  { icon: "verified_user", label: "Active API Keys", value: "104", sub: "+10.3% vs last 7 days", up: true, color: "#10b981", sp: [75, 80, 85, 90, 95, 100, 104] },
  { icon: "key_off", label: "Expired / Revoked Keys", value: "12", sub: "+8.2% vs last 7 days", up: false, color: "#ef4444", sp: [8, 9, 10, 10, 11, 11, 12] },
  { icon: "lock", label: "Secrets Stored", value: "256", sub: "+14.7% vs last 7 days", up: true, color: "#8b5cf6", sp: [180, 200, 210, 220, 235, 248, 256] },
  { icon: "schedule", label: "Expiring Soon (≤7 days)", value: "8", sub: "-11.1% vs last 7 days", up: false, color: "#f59e0b", sp: [12, 11, 10, 10, 9, 9, 8] },
  { icon: "trending_up", label: "Key Usage (Today)", value: "3.42M", sub: "+18.9% vs yesterday", up: true, color: "#06b6d4", sp: [2.1, 2.5, 2.8, 2.9, 3.0, 3.2, 3.42] },
];

const keyStatusItems = [
  { label: "Active", value: 104, pct: "81.3%", color: "#10b981" },
  { label: "Expired", value: 10, pct: "7.8%", color: "#ef4444" },
  { label: "Revoked", value: 2, pct: "1.6%", color: "#f59e0b" },
  { label: "Inactive", value: 12, pct: "9.3%", color: "#6b7280" },
];

const keysOverTimeData = [20, 22, 25, 28, 30, 35, 38, 42, 40, 45, 48, 50];
const keysOverTimeLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const secretsByEnv = [
  { label: "Production", value: 132, pct: "51.6%", color: "#3b82f6" },
  { label: "Staging", value: 64, pct: "25.0%", color: "#10b981" },
  { label: "Development", value: 40, pct: "15.6%", color: "#f59e0b" },
  { label: "Testing", value: 12, pct: "4.7%", color: "#8b5cf6" },
  { label: "Others", value: 8, pct: "3.1%", color: "#6b7280" },
];

const apiKeys = [
  { icon: "storefront", name: "Merchant Public API", key: "pk_live_••••••••••••••••a1b2", env: "Production", service: "Merchant Service", status: "Active", createdBy: "Super Admin", createdOn: "May 20, 2025", lastUsed: "May 27, 2025 09:41 AM", requests: "5,23,421" },
  { icon: "person", name: "Customer API Key", key: "ck_live_••••••••••••••••c3d4", env: "Production", service: "Customer Service", status: "Active", createdBy: "Super Admin", createdOn: "May 18, 2025", lastUsed: "May 27, 2025 08:15 AM", requests: "3,12,093" },
  { icon: "bar_chart", name: "Analytics Service Key", key: "ak_live_••••••••••••••••e5f6", env: "Production", service: "Analytics", status: "Active", createdBy: "Admin User", createdOn: "May 15, 2025", lastUsed: "May 27, 2025 07:32 AM", requests: "10,24,331" },
  { icon: "webhook", name: "Webhook Secret - Orders", key: "whsec_••••••••••••••••g7h8", env: "Production", service: "Webhook", status: "Active", createdBy: "Admin User", createdOn: "May 14, 2025", lastUsed: "May 27, 2025 09:29 AM", requests: "84,213" },
  { icon: "payments", name: "Razorpay Live Key", key: "rzp_live_••••••••••••••••i9j0", env: "Production", service: "Payment Gateway", status: "Expiring Soon", createdBy: "Finance Admin", createdOn: "Feb 10, 2025", lastUsed: "May 27, 2025 09:02 AM", requests: "6,32,421" },
  { icon: "chat", name: "Old Slack Integration", key: "slack_old_••••••••••••••••k1l2", env: "Staging", service: "Communication", status: "Revoked", createdBy: "Super Admin", createdOn: "Jan 05, 2025", lastUsed: "May 10, 2025 11:03 AM", requests: "0" },
];

const secretsCategories = [
  { label: "Payment", value: 72, pct: "28.1%", color: "#10b981" },
  { label: "Communication", value: 48, pct: "18.8%", color: "#3b82f6" },
  { label: "Cloud & Infra", value: 46, pct: "18.0%", color: "#8b5cf6" },
  { label: "Database", value: 38, pct: "14.8%", color: "#f59e0b" },
  { label: "API Tokens", value: 28, pct: "10.9%", color: "#06b6d4" },
  { label: "Others", value: 24, pct: "9.4%", color: "#6b7280" },
];

const recentSecrets = [
  { name: "database_password", env: "Production", updated: "May 27, 2025 08:45 AM", by: "DevOps Admin", status: "Active" },
  { name: "aws_s3_access_key", env: "Production", updated: "May 26, 2025 10:12 PM", by: "DevOps Admin", status: "Active" },
  { name: "sendgrid_api_key", env: "Production", updated: "May 26, 2025 07:20 PM", by: "System", status: "Active" },
  { name: "razorpay_webhook_secret", env: "Production", updated: "May 26, 2025 11:38 AM", by: "DevOps Admin", status: "Active" },
  { name: "firebase_admin_sdk", env: "Staging", updated: "May 24, 2025 09:13 AM", by: "Admin User", status: "Active" },
];

const auditLogs = [
  { text: "API Key 'Merchant Public API' used", sub: "IP: 103.21.45.12", time: "" },
  { text: "Secret 'database_password' updated", sub: "By: DevOps Admin", time: "" },
  { text: "API Key 'Analytics Service Key' used", sub: "IP: 103.21.45.12", time: "" },
  { text: "Webhook secret rotated", sub: "By: System", time: "" },
  { text: "API Key 'Customer API Key' used", sub: "IP: 103.21.45.12", time: "" },
];

const expirations = [
  { name: "Razorpay Live Key", sub: "Expires in 2 days", days: 2, color: "#ef4444" },
  { name: "SendGrid API Key", sub: "Expires in 3 days", days: 3, color: "#ef4444" },
  { name: "AWS Access Key", sub: "Expires in 5 days", days: 5, color: "#f59e0b" },
  { name: "Cloudflare Token", sub: "Expires in 6 days", days: 6, color: "#f59e0b" },
  { name: "Firebase Service Key", sub: "Expires in 7 days", days: 7, color: "#f59e0b" },
];

const quickActions = [
  { icon: "add", label: "Create API Key", color: "#10b981" },
  { icon: "lock", label: "Create Secret", color: "#8b5cf6" },
  { icon: "autorenew", label: "Rotate Key", color: "#3b82f6" },
  { icon: "key_off", label: "Revoke Key", color: "#ef4444" },
  { icon: "upload", label: "Import Secrets", color: "#f59e0b" },
  { icon: "download", label: "Export Secrets", color: "#06b6d4" },
  { icon: "history_edu", label: "View Audit Logs", color: "#6b7280" },
  { icon: "policy", label: "Policy Settings", color: "#a855f7" },
  { icon: "security_scan", label: "Scan Secrets", color: "#10b981" },
];

function statusBadge(status) {
  if (status === "Active") return "bg-emerald-500/20 text-emerald-400";
  if (status === "Expiring Soon") return "bg-amber-500/20 text-amber-400";
  if (status === "Revoked") return "bg-red-500/20 text-red-400";
  return "bg-zinc-500/20 text-zinc-400";
}

function envBadge(env) {
  if (env === "Production") return "bg-blue-500/20 text-blue-400";
  if (env === "Staging") return "bg-purple-500/20 text-purple-400";
  return "bg-zinc-500/20 text-zinc-400";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function ApiKeysDashboard() {
  const [showKey, setShowKey] = useState({});

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            API Keys & Secrets Dashboard
            <span className="material-symbols-outlined text-[18px] text-blue-400">shield</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Securely manage API keys, secrets, tokens and credentials across the platform.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            May 21 – May 27, 2025
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">menu_book</span> Docs
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
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

          {/* Row 2: Key Status Donut + Keys Over Time Line Chart + Secrets by Environment */}
          <div className="grid grid-cols-12 gap-4">

            {/* Key Status Distribution */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Key Status Distribution</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={keyStatusItems} totalValue="128" totalLabel="Total Keys" size={120} />
                <div className="space-y-2.5 flex-1">
                  {keyStatusItems.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-zinc-300">{s.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-bold">{s.value}</span>
                        <span className="text-zinc-500">({s.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keys Created Over Time */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Keys Created Over Time</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Daily</option><option>Weekly</option>
                </select>
              </div>
              {/* Y labels */}
              <div className="flex gap-2 flex-1 min-h-[100px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>50</span><span>40</span><span>30</span><span>20</span><span>0</span>
                </div>
                <div className="flex-1">
                  <LineChart data={keysOverTimeData} color="#8b5cf6" labels={keysOverTimeLabels} height={100} />
                </div>
              </div>
            </div>

            {/* Secrets by Environment */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Secrets by Environment</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={secretsByEnv} totalValue="256" totalLabel="Total Secrets" size={120} />
                <div className="space-y-2 flex-1">
                  {secretsByEnv.map((s, i) => (
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
            </div>
          </div>

          {/* Row 3: API Keys Overview Table */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-white">API Keys Overview</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All Keys</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium w-4">Key</th>
                    <th className="text-left pb-2 font-medium">Name</th>
                    <th className="text-left pb-2 font-medium">Environment</th>
                    <th className="text-left pb-2 font-medium">Service / Application</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                    <th className="text-left pb-2 font-medium">Created By</th>
                    <th className="text-left pb-2 font-medium">Created On</th>
                    <th className="text-left pb-2 font-medium">Last Used</th>
                    <th className="text-right pb-2 font-medium">Requests (7D)</th>
                    <th className="text-center pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {apiKeys.map((k, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 pr-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-500/10">
                          <span className="material-symbols-outlined text-[13px] text-blue-400">{k.icon}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="text-zinc-200 font-medium whitespace-nowrap">{k.name}</div>
                        <div className="text-zinc-600 font-mono mt-0.5">{k.key}</div>
                      </td>
                      <td className="py-2 pr-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${envBadge(k.env)}`}>{k.env}</span>
                      </td>
                      <td className="py-2 pr-3 text-zinc-300 whitespace-nowrap">{k.service}</td>
                      <td className="py-2 pr-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${statusBadge(k.status)}`}>{k.status}</span>
                      </td>
                      <td className="py-2 pr-3 text-zinc-400 whitespace-nowrap">{k.createdBy}</td>
                      <td className="py-2 pr-3 text-zinc-400 whitespace-nowrap">{k.createdOn}</td>
                      <td className="py-2 pr-3 text-zinc-400 whitespace-nowrap">{k.lastUsed}</td>
                      <td className="py-2 text-right text-white font-medium">{k.requests}</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                          </button>
                          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">settings</span>
                          </button>
                          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 4: Secrets Categories + Recent Secrets + Audit Log */}
          <div className="grid grid-cols-12 gap-4">

            {/* Secrets Categories */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Secrets Categories</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={secretsCategories} totalValue="256" totalLabel="Total Secrets" size={110} />
                <div className="space-y-1.5 flex-1">
                  {secretsCategories.map((s, i) => (
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
            </div>

            {/* Recent Secrets */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Recent Secrets</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All Secrets</Link>
              </div>
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">Secret Name</th>
                    <th className="text-left pb-2 font-medium">Environment</th>
                    <th className="text-left pb-2 font-medium">Last Updated</th>
                    <th className="text-right pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {recentSecrets.map((s, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 text-zinc-200 font-mono">{s.name}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${envBadge(s.env)}`}>{s.env}</span>
                      </td>
                      <td className="py-2 text-zinc-400 whitespace-nowrap">{s.updated.split(" ")[0]}</td>
                      <td className="py-2 text-right">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-emerald-500/20 text-emerald-400">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit Log (Recent) */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Audit Log (Recent)</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-2">
                {auditLogs.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[11px] text-blue-400">key</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-zinc-200 font-medium leading-tight">{a.text}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Security Score Gauge */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-[12px] font-bold text-white mb-3">Security Score</h3>
            <GaugeChart value={92} max={100} label="Excellent" />
            <div className="mt-3 space-y-1.5">
              {[
                { text: "No hardcoded secrets detected", ok: true },
                { text: "MFA required for key access", ok: true },
                { text: "Regular key rotation enabled", ok: true },
                { text: "Secrets encrypted at rest", ok: true },
                { text: "Access logging enabled", ok: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                  <span className="text-zinc-300">{s.text}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">
              View Security Recommendations
            </button>
          </div>

          {/* Upcoming Expirations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Upcoming Expirations</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {expirations.map((e, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[13px] text-zinc-400">key</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium truncate">{e.name}</div>
                    <div className="text-[9px] text-zinc-500">{e.sub}</div>
                  </div>
                  <div className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0" style={{ background: `${e.color}20`, color: e.color }}>
                    {e.days}d
                  </div>
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

        </div>
      </div>
    </div>
  );
}
