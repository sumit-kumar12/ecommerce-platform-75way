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
  const id = `spk-${color.replace("#", "")}-env`;
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
        <div className="text-lg font-bold text-white">{totalValue}</div>
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
          <linearGradient key={i} id={`mlenv-${i}`} x1="0" y1="0" x2="0" y2="1">
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
            <path d={area} fill={`url(#mlenv-${i})`} />
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

function CircleGauge({ pct, label, sub, color }) {
  const r = 32, cx = 40, cy = 40, circum = 2 * Math.PI * r;
  const dash = `${(pct / 100) * circum} ${circum}`;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="8" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={dash} strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[15px] font-bold text-white">{pct}%</span>
        </div>
      </div>
      <div className="text-[11px] font-semibold text-white">{label}</div>
      <div className="text-[9px] text-zinc-500 text-center">{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "cloud", label: "Total Environments", value: "5", sub: "+1 this month", up: true, color: "#3b82f6", sp: [3, 3, 4, 4, 4, 5, 5] },
  { icon: "check_circle", label: "Healthy Environments", value: "4", sub: "+80.0%", up: true, color: "#10b981", sp: [2, 2, 3, 3, 3, 4, 4] },
  { icon: "rocket_launch", label: "Deployments (7D)", value: "24", sub: "+33.3% vs last 7 days", up: true, color: "#8b5cf6", sp: [12, 14, 16, 18, 20, 22, 24] },
  { icon: "cancel", label: "Failed Deployments", value: "2", sub: "-50.0% vs last 7 days", up: false, color: "#ef4444", sp: [6, 5, 5, 4, 3, 3, 2] },
  { icon: "difference", label: "Configuration Drifts", value: "7", sub: "Needs Review", up: false, color: "#f59e0b", sp: [4, 5, 6, 6, 7, 7, 7] },
  { icon: "memory", label: "Resources Provisioned", value: "128", sub: "+18.5% vs last 7 days", up: true, color: "#06b6d4", sp: [90, 100, 105, 110, 115, 122, 128] },
];

const environments = [
  { name: "Production", status: "Healthy", version: "v2.8.4", region: "ap-south-1", lastDeploy: "May 27, 2025 10:21 AM", uptime: "99.98%", statusColor: "#10b981" },
  { name: "Staging", status: "Healthy", version: "v2.8.4-rc.1", region: "ap-south-1", lastDeploy: "May 27, 2025 09:15 AM", uptime: "99.92%", statusColor: "#10b981" },
  { name: "Development", status: "Healthy", version: "v2.8.5-dev", region: "ap-south-1", lastDeploy: "May 27, 2025 06:42 AM", uptime: "99.71%", statusColor: "#10b981" },
  { name: "QA", status: "Warning", version: "v2.8.4-qa.2", region: "ap-south-1", lastDeploy: "May 26, 2025 11:30 PM", uptime: "96.65%", statusColor: "#f59e0b" },
  { name: "Disaster Recovery", status: "Offline", version: "v2.8.3", region: "ap-south-1", lastDeploy: "May 24, 2025 03:10 AM", uptime: "—", statusColor: "#ef4444" },
];

const healthItems = [
  { label: "Healthy", value: 4, pct: "80.0%", color: "#10b981" },
  { label: "Warning", value: 1, pct: "20.0%", color: "#f59e0b" },
  { label: "Critical", value: 0, pct: "0.0%", color: "#ef4444" },
  { label: "Offline", value: 0, pct: "0.0%", color: "#6b7280" },
];

const deploymentTrendSeries = [
  { label: "Successful", color: "#10b981", data: [10, 12, 15, 14, 16, 18, 20] },
  { label: "Failed", color: "#ef4444", data: [4, 3, 3, 2, 3, 2, 1] },
];
const trendLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const resourceUtilization = [
  { label: "CPU Usage", pct: 42, sub: "1.68 / 4 vCPU", color: "#10b981" },
  { label: "Memory Usage", pct: 63, sub: "5.02 / 8 GB", color: "#f59e0b" },
  { label: "Disk Usage", pct: 58, sub: "116 / 200 GB", color: "#3b82f6" },
  { label: "Network I/O", pct: 35, sub: "350 Mbps", color: "#8b5cf6" },
];

const configDrifts = [
  { env: "Production", drifted: 3, severity: "Medium", detected: "May 27, 2025 09:40 AM", sevColor: "#f59e0b" },
  { env: "Staging", drifted: 2, severity: "Low", detected: "May 27, 2025 09:20 AM", sevColor: "#10b981" },
  { env: "QA", drifted: 2, severity: "Medium", detected: "May 27, 2025 08:10 AM", sevColor: "#f59e0b" },
];

const infraSummary = [
  { icon: "dns", label: "Total Instances", val: "28", change: "+7.7%", up: true },
  { icon: "storage", label: "Databases", val: "6", change: "+20.0%", up: true },
  { icon: "inventory_2", label: "Storage Buckets", val: "12", change: "+9.1%", up: true },
  { icon: "memory", label: "Cache Instances", val: "8", change: "+33.3%", up: true },
  { icon: "balance", label: "Load Balancers", val: "5", change: "+0.0%", up: true },
  { icon: "language", label: "CDN Distributions", val: "7", change: "+15.4%", up: true },
];

const envByType = [
  { label: "Production", value: 1, pct: "20.0%", color: "#3b82f6" },
  { label: "Staging", value: 1, pct: "20.0%", color: "#10b981" },
  { label: "Development", value: 1, pct: "20.0%", color: "#8b5cf6" },
  { label: "QA", value: 1, pct: "20.0%", color: "#f59e0b" },
  { label: "Disaster Recovery", value: 1, pct: "20.0%", color: "#6b7280" },
];

const recentDeployments = [
  { env: "Production", version: "v2.8.4", by: "DevOps Admin", status: "Success", on: "May 27, 2025 10:21 AM" },
  { env: "Staging", version: "v2.8.4-rc.1", by: "DevOps Admin", status: "Success", on: "May 27, 2025 09:15 AM" },
  { env: "Development", version: "v2.8.5-dev", by: "DevOps Admin", status: "Success", on: "May 27, 2025 06:42 AM" },
  { env: "QA", version: "v2.8.4-qa.2", by: "CI Pipeline", status: "Failed", on: "May 27, 2025 07:45 AM" },
  { env: "Production", version: "v2.8.3", by: "DevOps Admin", status: "Success", on: "May 26, 2025 11:05 PM" },
];

const envInfo = [
  { label: "Region", val: "ap-south-1 (Mumbai)" },
  { label: "Kubernetes Cluster", val: "prod-k8s-cluster-01" },
  { label: "Namespace", val: "katabazaar-prod" },
  { label: "App Version", val: "v2.8.4" },
  { label: "Last Backup", val: "May 27, 2025 02:30 AM" },
  { label: "Auto Scaling", val: "Enabled", green: true },
  { label: "Monitoring", val: "Enabled", green: true },
  { label: "Logging", val: "Enabled", green: true },
];

const recentActivity = [
  { icon: "rocket_launch", text: "Deployed v2.8.4 to Production", sub: "by DevOps Admin", time: "10:21 AM", color: "#10b981" },
  { icon: "settings", text: "Configuration updated in Staging", sub: "by DevOps Admin", time: "09:15 AM", color: "#3b82f6" },
  { icon: "storage", text: "Database backup completed", sub: "Development", time: "08:30 AM", color: "#8b5cf6" },
  { icon: "cancel", text: "Deployment failed in QA", sub: "by CI Pipeline", time: "07:45 AM", color: "#ef4444" },
  { icon: "add_circle", text: "New environment created", sub: "Disaster Recovery", time: "May 26", color: "#f59e0b" },
];

const quickActions = [
  { icon: "add_circle", label: "Create Environment", color: "#10b981" },
  { icon: "rocket_launch", label: "Deploy Application", color: "#3b82f6" },
  { icon: "copy_all", label: "Clone Environment", color: "#8b5cf6" },
  { icon: "settings", label: "Environment Settings", color: "#f59e0b" },
  { icon: "article", label: "View Logs", color: "#06b6d4" },
  { icon: "terminal", label: "Access Console", color: "#6b7280" },
  { icon: "backup", label: "Backup Now", color: "#10b981" },
  { icon: "restore", label: "Restore", color: "#f59e0b" },
  { icon: "delete", label: "Delete Environment", color: "#ef4444" },
];

function statusBadge(status) {
  if (status === "Healthy") return "bg-emerald-500/20 text-emerald-400";
  if (status === "Warning") return "bg-amber-500/20 text-amber-400";
  if (status === "Offline") return "bg-red-500/20 text-red-400";
  return "bg-zinc-500/20 text-zinc-400";
}

function deployStatusBadge(status) {
  if (status === "Success") return "bg-emerald-500/20 text-emerald-400";
  if (status === "Failed") return "bg-red-500/20 text-red-400";
  return "bg-zinc-500/20 text-zinc-400";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function EnvironmentManagementDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Environment Management Dashboard
            <span className="material-symbols-outlined text-[18px] text-blue-400">cloud</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage and monitor all platform environments, deployments and configurations.</p>
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

          {/* Row 2: Environment Overview Table + Health Distribution + Deployment Trend */}
          <div className="grid grid-cols-12 gap-4">

            {/* Environment Overview Table */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Environment Overview</h3>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">Environment</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-left pb-3 font-medium">Version</th>
                      <th className="text-left pb-3 font-medium">Region</th>
                      <th className="text-left pb-3 font-medium">Last Deployment</th>
                      <th className="text-right pb-3 font-medium">Uptime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {environments.map((e, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-200 font-medium">{e.name}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-medium ${statusBadge(e.status)}`}>{e.status}</span>
                        </td>
                        <td className="py-3 text-zinc-400 font-mono">{e.version}</td>
                        <td className="py-3 text-zinc-400">{e.region}</td>
                        <td className="py-3 text-zinc-400 whitespace-nowrap">{e.lastDeploy}</td>
                        <td className="py-3 text-right font-medium text-white">{e.uptime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="mt-3 text-[10px] text-purple-400 hover:text-purple-300 transition-colors text-center">View All Environments</button>
            </div>
          </div>

          {/* Row 2.5: Health Distribution + Deployment Trend */}
          <div className="grid grid-cols-12 gap-4">

            {/* Environment Health Distribution Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Environment Health Distribution</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={healthItems} totalValue="5" totalLabel="Total" size={120} />
                <div className="space-y-2.5 flex-1">
                  {healthItems.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: h.color }} />
                        <span className="text-zinc-300">{h.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-bold">{h.value}</span>
                        <span className="text-zinc-500">({h.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deployment Trend (7 Days) Multi-line */}
            <div className="col-span-12 lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Deployment Trend (7 Days)</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Daily</option>
                </select>
              </div>
              <div className="flex gap-3 mb-2">
                {deploymentTrendSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[9px]">
                    <span className="w-3 h-0.5 inline-block" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
              {/* Y labels */}
              <div className="flex gap-2 flex-1 min-h-[100px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>20</span><span>15</span><span>10</span><span>5</span><span>-5</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={deploymentTrendSeries} labels={trendLabels} height={100} />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
                {trendLabels.map(l => <span key={l}>{l.replace("May ", "")}</span>)}
              </div>
            </div>
          </div>

          {/* Row 3: Resource Utilization + Configuration Drift + Infrastructure Summary */}
          <div className="grid grid-cols-12 gap-4">

            {/* Resource Utilization */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-white">Resource Utilization (Production)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {resourceUtilization.map((r, i) => (
                  <CircleGauge key={i} pct={r.pct} label={r.label} sub={r.sub} color={r.color} />
                ))}
              </div>
              <button className="mt-3 text-[10px] text-purple-400 hover:text-purple-300 transition-colors text-center">View All Metrics</button>
            </div>

            {/* Configuration Drift */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Configuration Drift</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">Environment</th>
                    <th className="text-center pb-2 font-medium">Drifted Resources</th>
                    <th className="text-center pb-2 font-medium">Severity</th>
                    <th className="text-right pb-2 font-medium">Detected On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {configDrifts.map((d, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 text-zinc-200 font-medium">{d.env}</td>
                      <td className="py-2 text-center text-white font-bold">{d.drifted}</td>
                      <td className="py-2 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-medium" style={{ background: `${d.sevColor}20`, color: d.sevColor }}>{d.severity}</span>
                      </td>
                      <td className="py-2 text-right text-zinc-400 whitespace-nowrap">{d.detected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Infrastructure Summary */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Infrastructure Summary</h3>
              <div className="space-y-2 flex-1">
                {infraSummary.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-zinc-800/40">
                    <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[13px] text-zinc-400">{s.icon}</span>
                    </div>
                    <span className="text-[10px] text-zinc-300 flex-1">{s.label}</span>
                    <span className="text-[11px] font-bold text-white">{s.val}</span>
                    <span className={`text-[9px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Environments by Type + Recent Deployments + Environment Info */}
          <div className="grid grid-cols-12 gap-4">

            {/* Environments by Type */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Environments by Type</h3>
              <div className="flex flex-col items-center gap-4 flex-1">
                <DonutChart items={envByType} totalValue="5" totalLabel="Total" size={120} />
                <div className="w-full space-y-1.5">
                  {envByType.map((e, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: e.color }} />
                        <span className="text-zinc-300">{e.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-medium">{e.value}</span>
                        <span className="text-zinc-500">({e.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Deployments */}
            <div className="col-span-12 lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Recent Deployments</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">Environment</th>
                    <th className="text-left pb-2 font-medium">Version</th>
                    <th className="text-left pb-2 font-medium">Deployed By</th>
                    <th className="text-center pb-2 font-medium">Status</th>
                    <th className="text-right pb-2 font-medium">Deployed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {recentDeployments.map((d, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 text-zinc-200 font-medium">{d.env}</td>
                      <td className="py-2 text-zinc-400 font-mono">{d.version}</td>
                      <td className="py-2 text-zinc-400">{d.by}</td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${deployStatusBadge(d.status)}`}>{d.status}</span>
                      </td>
                      <td className="py-2 text-right text-zinc-400 whitespace-nowrap">{d.on}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Environment Info (Production) */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Environment Info (Production)</h3>
              <div className="space-y-2 flex-1">
                {envInfo.map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] border-b border-zinc-800/40 pb-2">
                    <span className="text-zinc-400">{e.label}</span>
                    <span className={`font-medium ${e.green ? "text-emerald-400" : "text-zinc-200"}`}>{e.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Real-time Environment Status */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-3">Real-time Environment Status</h3>
            <div className="space-y-2">
              {environments.map((e, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-blue-400">cloud</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium">{e.name}</div>
                    <div className="text-[9px] text-zinc-500">{e.region}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: e.statusColor }} />
                    <span className="text-[9px] font-medium" style={{ color: e.statusColor }}>{e.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-2 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium transition-colors">View Status Page</button>
          </div>

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

        </div>
      </div>
    </div>
  );
}
