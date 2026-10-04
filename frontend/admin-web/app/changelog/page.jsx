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
  const id = `spk-cl-${color.replace("#", "")}`;
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

function DonutChart({ items, totalValue, totalLabel, size = 110, innerSize = "text-lg" }) {
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
        <div className={`${innerSize} font-bold text-white leading-tight`}>{totalValue}</div>
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
          <linearGradient key={i} id={`mlcl-${i}`} x1="0" y1="0" x2="0" y2="1">
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
            <path d={area} fill={`url(#mlcl-${i})`} />
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

function CircleGauge({ value, size = 120 }) {
  const r = 44, cx = 60, cy = 60;
  const circum = 2 * Math.PI * r;
  const pct = value / 100;
  const dash = `${pct * circum} ${circum}`;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-180">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={dash} className="transition-all duration-700" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -rotate-180">
        <div className="text-2xl font-bold text-white leading-none">
          {value}<span className="text-[10px] text-zinc-500 font-normal"> /100</span>
        </div>
        <div className="text-[10px] text-emerald-400 font-medium mt-1">Excellent</div>
      </div>
    </div>
  );
}

function ProgressList({ items }) {
  const max = Math.max(...items.map(i => i.value));
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-[10px] text-zinc-300 w-28 text-right pr-2">{item.label}</div>
          <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, background: item.color }} />
          </div>
          <div className="text-[10px] text-zinc-400 w-16 flex justify-between">
            <span>{item.value}</span>
            <span>({item.pct})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "new_releases", label: "Total Releases", value: "26", sub: "+18.2% vs last 7 days", up: true, color: "#8b5cf6", sp: [20, 21, 21, 23, 24, 25, 26] },
  { icon: "star", label: "New Features", value: "14", sub: "+27.3% vs last 7 days", up: true, color: "#10b981", sp: [10, 10, 11, 12, 12, 13, 14] },
  { icon: "upgrade", label: "Improvements", value: "8", sub: "+14.3% vs last 7 days", up: true, color: "#3b82f6", sp: [6, 7, 7, 7, 8, 8, 8] },
  { icon: "bug_report", label: "Bug Fixes", value: "21", sub: "+30.6% vs last 7 days", up: true, color: "#f59e0b", sp: [15, 16, 17, 18, 19, 20, 21] },
  { icon: "security", label: "Security Updates", value: "4", sub: "+100% vs last 7 days", up: true, color: "#ef4444", sp: [2, 2, 2, 3, 3, 3, 4] },
  { icon: "warning", label: "Breaking Changes", value: "1", sub: "-50% vs last 7 days", up: false, color: "#8b5cf6", sp: [2, 2, 2, 1, 1, 1, 1] },
];

const releaseTrendSeries = [
  { label: "Releases", color: "#8b5cf6", data: [35, 36, 40, 32, 42, 44, 48] },
  { label: "Features", color: "#10b981", data: [18, 20, 22, 19, 25, 28, 30] },
  { label: "Fixes", color: "#3b82f6", data: [12, 14, 15, 13, 16, 15, 21] },
];
const releaseTrendLabels = ["May 21", "May 22", "May 23", "May 24", "May 26", "May 27"];

const updateTypeDist = [
  { label: "New Features", value: 14, pct: "28.0%", color: "#10b981" },
  { label: "Improvements", value: 8, pct: "16.0%", color: "#3b82f6" },
  { label: "Bug Fixes", value: 21, pct: "42.0%", color: "#f59e0b" },
  { label: "Security Updates", value: 4, pct: "8.0%", color: "#ef4444" },
  { label: "Breaking Changes", value: 1, pct: "2.0%", color: "#8b5cf6" },
  { label: "Others", value: 2, pct: "4.0%", color: "#6b7280" },
];

const releasesByEnv = [
  { label: "Production", value: 16, pct: "61.5%", color: "#8b5cf6" },
  { label: "Staging", value: 6, pct: "23.1%", color: "#10b981" },
  { label: "Development", value: 3, pct: "11.5%", color: "#3b82f6" },
  { label: "QA", value: 1, pct: "3.9%", color: "#f59e0b" },
];

const recentReleases = [
  { version: "v2.8.4", title: "Checkout Flow Optimization", type: "Improvement", env: "Production", on: "May 27, 2025 10:24 AM", by: "DevOps Team", status: "Live" },
  { version: "v2.8.3", title: "Bug Fixes & Performance Update", type: "Bug Fix", env: "Production", on: "May 24, 2025 08:45 AM", by: "DevOps Team", status: "Live" },
  { version: "v2.8.2", title: "Advanced Search Enhancement", type: "New Feature", env: "Production", on: "May 22, 2025 11:30 AM", by: "Product Team", status: "Live" },
  { version: "v2.8.1", title: "Security Patch - High Priority", type: "Security", env: "Production", on: "May 21, 2025 04:15 PM", by: "Security Team", status: "Live" },
  { version: "v2.7.9", title: "UI/UX Improvements", type: "Improvement", env: "Production", on: "May 19, 2025 09:20 AM", by: "Product Team", status: "Live" },
  { version: "v2.7.8", title: "Payment Gateway Fix", type: "Bug Fix", env: "Production", on: "May 18, 2025 07:40 PM", by: "DevOps Team", status: "Live" },
  { version: "v2.7.7", title: "Wishlist & Save for Later", type: "New Feature", env: "Staging", on: "May 17, 2025 02:10 PM", by: "Product Team", status: "Staging" },
];

const releaseImpact = [
  { label: "Users Affected", value: "1.2M+", impact: "High", icon: "group" },
  { label: "Services Affected", value: "8", impact: "Medium", icon: "dns" },
  { label: "Database Changes", value: "2", impact: "Low", icon: "database" },
  { label: "New APIs", value: "3", impact: "Medium", icon: "api" },
  { label: "Performance Impact", value: "+15%", impact: "Positive", icon: "speed" },
  { label: "Security Impact", value: "High", impact: "Positive", icon: "security" },
];

const topCategories = [
  { label: "Orders & Payments", value: 18, pct: "36%", color: "#8b5cf6" },
  { label: "Performance", value: 10, pct: "20%", color: "#10b981" },
  { label: "User Experience", value: 8, pct: "16%", color: "#3b82f6" },
  { label: "Security", value: 4, pct: "8%", color: "#f59e0b" },
  { label: "Integrations", value: 3, pct: "6%", color: "#ef4444" },
  { label: "Others", value: 7, pct: "14%", color: "#6b7280" },
];

const changelogHighlights = [
  { type: "New Feature", desc: "One-click reorder for orders placed in the last 30 days.", v: "v2.8.4", color: "#10b981", icon: "star" },
  { type: "Improvement", desc: "Reduced checkout time by 18% through UI optimization.", v: "v2.8.4", color: "#3b82f6", icon: "upgrade" },
  { type: "Bug Fix", desc: "Fixed issue where COD orders were failing on retry.", v: "v2.8.3", color: "#f59e0b", icon: "bug_report" },
  { type: "Security", desc: "Patched XSS vulnerability in review module.", v: "v2.8.1", color: "#ef4444", icon: "security" },
];

const releaseTimeline = [
  { time: "May 27, 2025  10:24 AM", desc: "v2.8.4 Released to Production", status: "Live", color: "#8b5cf6" },
  { time: "May 24, 2025  08:45 AM", desc: "v2.8.3 Released to Production", status: "Live", color: "#10b981" },
  { time: "May 22, 2025  11:30 AM", desc: "v2.8.2 Released to Production", status: "Live", color: "#3b82f6" },
  { time: "May 21, 2025  04:15 PM", desc: "v2.8.1 Security Patch Released", status: "Live", color: "#f59e0b" },
  { time: "May 19, 2025  09:20 AM", desc: "v2.7.9 Released to Production", status: "Live", color: "#ef4444" },
];

const upcomingReleases = [
  { version: "v2.8.5", env: "Staging", date: "May 30, 2025", status: "Scheduled", color: "#3b82f6" },
  { version: "v2.9.0", env: "Production", date: "Jun 03, 2025", status: "Scheduled", color: "#8b5cf6" },
  { version: "v2.9.1", env: "Staging", date: "Jun 07, 2025", status: "Planned", color: "#10b981" },
];

const quickActions = [
  { icon: "add", label: "Create Release", color: "#8b5cf6" },
  { icon: "post_add", label: "Add Update", color: "#10b981" },
  { icon: "calendar_month", label: "Schedule Release", color: "#f59e0b" },
  { icon: "category", label: "Manage Categories", color: "#3b82f6" },
  { icon: "settings", label: "Release Settings", color: "#8b5cf6" },
  { icon: "download", label: "Export Changelog", color: "#10b981" },
  { icon: "map", label: "View Roadmap", color: "#ef4444" },
  { icon: "fact_check", label: "Approval Queue", color: "#f59e0b" },
  { icon: "person_add", label: "Subscribe Users", color: "#8b5cf6" },
];

function envBadge(env) {
  if (env === "Production") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  if (env === "Staging") return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
}
function statusBadge(status) {
  if (status === "Live") return "text-emerald-400";
  if (status === "Staging") return "text-blue-400";
  return "text-zinc-400";
}
function impactBadge(impact) {
  if (impact === "High") return "text-red-400";
  if (impact === "Medium") return "text-amber-400";
  if (impact === "Low") return "text-yellow-400";
  if (impact === "Positive") return "text-emerald-400";
  return "text-zinc-400";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function ChangelogDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Changelog Dashboard
            <span className="material-symbols-outlined text-[18px] text-purple-400">description</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Track product updates, releases, improvements and platform changes.</p>
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
            <span className="material-symbols-outlined text-[14px]">download</span> Export Report
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
                <div className={`text-[9px] flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-amber-400"}`}>
                  <span className="material-symbols-outlined text-[11px]">{k.up ? "arrow_upward" : "arrow_downward"}</span>
                  {k.sub}
                </div>
                <Spark data={k.sp} color={k.color} height={20} />
              </div>
            ))}
          </div>

          {/* Row 2: Trend Line + Update Type Donut + Env Donut */}
          <div className="grid grid-cols-12 gap-4">
            {/* Release Trend */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Release Trend</h3>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-[9px] text-zinc-300">
                  Last 7 Days <span className="material-symbols-outlined text-[12px]">expand_more</span>
                </div>
              </div>
              <div className="flex gap-4 mb-3 justify-center">
                {releaseTrendSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-4 h-0.5 inline-block" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-1 min-h-[120px]">
                <div className="flex flex-col justify-between text-[10px] text-zinc-600 py-1">
                  <span>50</span><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={releaseTrendSeries} labels={releaseTrendLabels} height={120} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 mt-2 px-1">
                {releaseTrendLabels.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* Update Type Distribution */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-4">Update Type Distribution</h3>
              <div className="flex flex-col items-center flex-1 justify-center gap-6">
                <DonutChart items={updateTypeDist} totalValue="50" totalLabel="Total" size={130} innerSize="text-2xl" />
                <div className="space-y-2 w-full">
                  {updateTypeDist.map((u, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: u.color }} />
                        <span className="text-zinc-300">{u.label}</span>
                      </div>
                      <div className="flex gap-2 w-16 justify-between">
                        <span className="text-white font-medium">{u.value}</span>
                        <span className="text-zinc-500">({u.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Releases by Environment */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-4">Releases by Environment</h3>
              <div className="flex flex-col items-center flex-1 justify-center gap-6">
                <DonutChart items={releasesByEnv} totalValue="26" totalLabel="Total" size={130} innerSize="text-2xl" />
                <div className="space-y-2 w-full">
                  {releasesByEnv.map((e, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: e.color }} />
                        <span className="text-zinc-300">{e.label}</span>
                      </div>
                      <div className="flex gap-2 w-16 justify-between">
                        <span className="text-white font-medium">{e.value}</span>
                        <span className="text-zinc-500">({e.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Recent Releases */}
          <div className="grid grid-cols-12 gap-4">

            {/* Recent Releases */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Recent Releases</h3>
                <Link href="#" className="text-[11px] text-purple-400">View All Releases</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">Version</th>
                      <th className="text-left pb-3 font-medium">Title</th>
                      <th className="text-left pb-3 font-medium">Type</th>
                      <th className="text-left pb-3 font-medium">Environment</th>
                      <th className="text-left pb-3 font-medium">Released On</th>
                      <th className="text-left pb-3 font-medium">Released By</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {recentReleases.map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-300 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {r.version}
                          </div>
                        </td>
                        <td className="py-3 text-zinc-200">{r.title}</td>
                        <td className="py-3 text-zinc-400">{r.type}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-medium ${envBadge(r.env)}`}>{r.env}</span>
                        </td>
                        <td className="py-3 text-zinc-400 text-[11px] whitespace-nowrap">{r.on}</td>
                        <td className="py-3 text-zinc-300">{r.by}</td>
                        <td className="py-3 font-medium text-[11px]">
                          <span className={`px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 ${statusBadge(r.status)}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 3.5: Release Impact + Top Update Categories */}
          <div className="grid grid-cols-12 gap-4">

            {/* Release Impact */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Release Impact</h3>
              <div className="space-y-4 pt-2">
                {releaseImpact.map((ri, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-purple-400">{ri.icon}</span>
                      </div>
                      <span className="text-[12px] text-zinc-300">{ri.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] font-medium text-white">{ri.value}</span>
                      <span className={`text-[11px] font-medium w-12 text-right ${impactBadge(ri.impact)}`}>{ri.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Update Categories */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-5">Top Update Categories</h3>
              <div className="flex-1 pt-2">
                <ProgressList items={topCategories} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-4 px-1 border-t border-zinc-800/50 pt-2 pl-24">
                <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
              </div>
            </div>
          </div>

          {/* Row 4: Highlights + Timeline */}
          <div className="grid grid-cols-12 gap-4">

            {/* Changelog Highlights */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-5">Changelog Highlights</h3>
              <div className="space-y-5 flex-1">
                {changelogHighlights.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${h.color}15` }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: h.color }}>{h.icon}</span>
                    </div>
                    <div>
                      <div className="text-[12px] text-zinc-200">
                        <span className="font-bold" style={{ color: h.color }}>{h.type}:</span> {h.desc}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: h.color }}>{h.type}</div>
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono shrink-0 ml-auto">{h.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-start">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all highlights <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Release Timeline */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-5">Release Timeline</h3>
              <div className="relative pl-3 space-y-6 flex-1 before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-zinc-800">
                {releaseTimeline.map((rt, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="absolute left-[-16px] w-2.5 h-2.5 rounded-full bg-zinc-900 border-2 mt-1 z-10" style={{ borderColor: rt.color }} />
                    <div className="text-[11px] text-zinc-400 w-32 shrink-0 pt-0.5">{rt.time}</div>
                    <div className="flex-1 text-[12px] text-zinc-200 leading-tight pt-0.5 pr-2">{rt.desc}</div>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800/50 border border-zinc-700/50 text-[10px] font-medium text-emerald-400 shrink-0">{rt.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-start">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View full timeline <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-[300px] border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-5 gap-6 shrink-0 overflow-y-auto">

          {/* Latest Release */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-white">Latest Release</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30">Production</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-white">v2.8.4</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-medium">Latest</span>
            </div>
            <div className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
              Released on May 27, 2025 10:24 AM<br/>
              by DevOps Team
            </div>
            <p className="text-[11px] text-zinc-300 mb-4 leading-relaxed">
              This release includes new features, performance improvements and bug fixes.
            </p>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-[12px] font-medium rounded-lg transition-colors">
              View Release Notes
            </button>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Release Health */}
          <div>
            <h3 className="text-[13px] font-bold text-white mb-4">Release Health</h3>
            <div className="flex justify-center mb-6">
              <CircleGauge value={96} size={140} />
            </div>
            <div className="space-y-3">
              {[
                "No critical issues reported",
                "All services operational",
                "Monitoring stable",
                "Zero failed deployments",
                "No rollback required"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                  <span className="text-[11px] text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Upcoming Releases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-white">Upcoming Releases</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-3">
              {upcomingReleases.map((ur, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center border border-zinc-700/50" style={{ background: `${ur.color}15` }}>
                    <span className="text-[10px] font-bold text-white leading-tight">{ur.version}</span>
                    <span className="text-[7px]" style={{ color: ur.color }}>{ur.env}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-zinc-300">{ur.date}</div>
                  </div>
                  <span className="text-[10px] text-zinc-400">{ur.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Quick Actions */}
          <div>
            <h3 className="text-[13px] font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group aspect-square">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800" style={{ background: `${q.color}10` }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: q.color }}>{q.icon}</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 text-center leading-tight group-hover:text-zinc-200 px-1">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
