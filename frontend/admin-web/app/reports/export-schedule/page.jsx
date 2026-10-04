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
  const id = `spk-rx-${color.replace("#", "")}`;
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
          <linearGradient key={i} id={`mll-${i}`} x1="0" y1="0" x2="0" y2="1">
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
            <path d={area} fill={`url(#mll-${i})`} />
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

function BarChart({ items, height = 120 }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="flex items-end justify-between w-full" style={{ height }}>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 w-8 group">
          <div className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.value}</div>
          <div className="w-full rounded-t transition-all duration-500 hover:opacity-80" style={{ height: `${(item.value / max) * (height - 30)}px`, background: item.color }} />
          <div className="text-[8px] text-zinc-500 rotate-0 truncate w-12 text-center">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "person", label: "Total Reports", value: "186", sub: "+18.6% vs last 7 days", up: true, color: "#3b82f6", sp: [150, 155, 160, 165, 170, 180, 186] },
  { icon: "description", label: "Reports Generated", value: "128", sub: "+15.3% vs last 7 days", up: true, color: "#8b5cf6", sp: [90, 100, 105, 110, 115, 122, 128] },
  { icon: "schedule", label: "Scheduled Reports", value: "42", sub: "+12.5% vs last 7 days", up: true, color: "#10b981", sp: [34, 35, 36, 38, 39, 41, 42] },
  { icon: "download_done", label: "Exports Completed", value: "317", sub: "+22.8% vs last 7 days", up: true, color: "#f59e0b", sp: [220, 240, 260, 280, 290, 305, 317] },
  { icon: "download", label: "Reports Downloaded", value: "256", sub: "+19.7% vs last 7 days", up: true, color: "#06b6d4", sp: [180, 190, 200, 220, 230, 245, 256] },
  { icon: "error", label: "Report Failures", value: "6", sub: "-25.0% vs last 7 days", up: false, color: "#ef4444", sp: [10, 9, 8, 8, 7, 7, 6] },
];

const reportsByType = [
  { label: "Business Intelligence", value: 56, pct: "30.1%", color: "#3b82f6" },
  { label: "Merchant Reports", value: 42, pct: "22.6%", color: "#8b5cf6" },
  { label: "Customer Reports", value: 32, pct: "17.2%", color: "#f59e0b" },
  { label: "Financial Reports", value: 24, pct: "12.9%", color: "#10b981" },
  { label: "Operational Reports", value: 18, pct: "9.7%", color: "#06b6d4" },
  { label: "Security Reports", value: 14, pct: "7.5%", color: "#6b7280" },
];

const exportFormats = [
  { label: "PDF", value: 142, pct: "44.8%", color: "#3b82f6" },
  { label: "Excel (XLSX)", value: 98, pct: "30.9%", color: "#10b981" },
  { label: "CSV", value: 52, pct: "16.4%", color: "#f59e0b" },
  { label: "JSON", value: 15, pct: "4.7%", color: "#ef4444" },
  { label: "Others", value: 10, pct: "3.2%", color: "#8b5cf6" },
];

const trendSeries = [
  { label: "Generated", color: "#3b82f6", data: [90, 110, 105, 120, 125, 130, 145] },
  { label: "Downloaded", color: "#10b981", data: [60, 75, 70, 85, 90, 95, 110] },
];
const trendLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const popularReports = [
  { name: "Revenue Summary Report", cat: "Financial", generated: 24, downloads: 156 },
  { name: "Merchant Performance Report", cat: "Merchant", generated: 18, downloads: 132 },
  { name: "Customer Insights Report", cat: "Customer", generated: 16, downloads: 118 },
  { name: "Payout & Settlement Report", cat: "Financial", generated: 15, downloads: 105 },
  { name: "Sales & Orders Report", cat: "Business", generated: 12, downloads: 94 },
  { name: "Refund & Chargeback Report", cat: "Financial", generated: 10, downloads: 82 },
];

const reportStatus = [
  { label: "Completed", value: 128, pct: "68.8%", color: "#10b981" },
  { label: "Scheduled", value: 42, pct: "22.6%", color: "#3b82f6" },
  { label: "Processing", value: 10, pct: "5.4%", color: "#f59e0b" },
  { label: "Failed", value: 6, pct: "3.2%", color: "#ef4444" },
];

const reportsByCategory = [
  { label: "Business", value: 56, color: "#3b82f6" },
  { label: "Merchant", value: 42, color: "#10b981" },
  { label: "Customer", value: 32, color: "#06b6d4" },
  { label: "Financial", value: 24, color: "#f59e0b" },
  { label: "Operational", value: 18, color: "#f97316" },
  { label: "Security", value: 14, color: "#ef4444" },
];

const recentExports = [
  { file: "revenue_summary_20250527.pdf", format: "PDF", size: "1.24 MB", on: "May 27, 2025 10:30 AM", status: "Completed" },
  { file: "merchant_performance_20250527.xlsx", format: "Excel", size: "2.18 MB", on: "May 27, 2025 09:15 AM", status: "Completed" },
  { file: "customer_insights_20250527.csv", format: "CSV", size: "1.05 MB", on: "May 27, 2025 08:45 AM", status: "Completed" },
  { file: "security_incident_report_20250527.pdf", format: "PDF", size: "0.85 MB", on: "May 27, 2025 08:30 AM", status: "Completed" },
  { file: "platform_operations_20250527.xlsx", format: "Excel", size: "1.76 MB", on: "May 27, 2025 07:45 AM", status: "Completed" },
];

const recentReportsSidebar = [
  { icon: "description", name: "Revenue Summary Report", time: "May 27, 2025 10:30 AM", color: "#ef4444" },
  { icon: "table_chart", name: "Merchant Performance Report", time: "May 27, 2025 09:15 AM", color: "#10b981" },
  { icon: "group_work", name: "Customer Insights Report", time: "May 27, 2025 08:45 AM", color: "#f59e0b" },
  { icon: "security", name: "Security Incident Report", time: "May 27, 2025 08:30 AM", color: "#8b5cf6" },
  { icon: "analytics", name: "Platform Operations Report", time: "May 27, 2025 07:45 AM", color: "#3b82f6" },
  { icon: "payments", name: "Payout & Settlement Report", time: "May 27, 2025 07:30 AM", color: "#10b981" },
];

const scheduledReports = [
  { name: "Daily Revenue Report", sub: "Daily at 09:00 AM", icon: "description", color: "#3b82f6" },
  { name: "Weekly Merchant Report", sub: "Every Monday at 10:00 AM", icon: "table_chart", color: "#f59e0b" },
  { name: "Monthly Business Report", sub: "1st of every month at 11:00 AM", icon: "analytics", color: "#8b5cf6" },
  { name: "Security Summary Report", sub: "Daily at 08:00 AM", icon: "security", color: "#ef4444" },
  { name: "Settlement Summary", sub: "Daily at 07:00 PM", icon: "payments", color: "#f59e0b" },
];

const quickActions = [
  { icon: "add_chart", label: "Create Report", color: "#3b82f6" },
  { icon: "schedule", label: "Schedule Report", color: "#10b981" },
  { icon: "file_download", label: "Export Data", color: "#10b981" },
  { icon: "build", label: "Report Builder", color: "#8b5cf6" },
  { icon: "bookmark", label: "Saved Reports", color: "#8b5cf6" },
  { icon: "inventory", label: "Bulk Export", color: "#8b5cf6" },
  { icon: "library_books", label: "Data Dictionary", color: "#3b82f6" },
  { icon: "admin_panel_settings", label: "Report Permissions", color: "#f59e0b" },
  { icon: "settings", label: "Settings", color: "#06b6d4" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function ReportsExportDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Reports & Export Dashboard
            <span className="material-symbols-outlined text-[18px] text-purple-400">download</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Create, schedule, manage and export all platform reports with ease.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            May 21 – May 27, 2025
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors">
            Compare: May 14 – May 20, 2025
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

          {/* Row 2: Reports by Type Donut + Reports Trend Line + Export Formats Donut */}
          <div className="grid grid-cols-12 gap-4">

            {/* Reports by Type Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Reports by Type</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={reportsByType} totalValue="186" totalLabel="Total Reports" size={120} />
                <div className="space-y-1.5 flex-1">
                  {reportsByType.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
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
              <button className="mt-3 text-[10px] text-purple-400 hover:text-purple-300 transition-colors text-center">View All</button>
            </div>

            {/* Reports Trend Line Chart */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Reports Trend</h3>
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
                  <span>150</span><span>120</span><span>90</span><span>60</span><span>30</span><span>0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={trendSeries} labels={trendLabels} height={110} />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
                {trendLabels.map(l => <span key={l}>{l.replace("May ", "")}</span>)}
              </div>
            </div>

            {/* Export Formats Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Export Formats</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={exportFormats} totalValue="317" totalLabel="Total Exports" size={120} />
                <div className="space-y-1.5 flex-1">
                  {exportFormats.map((f, i) => (
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

          {/* Row 3: Popular Reports + Report Status + Reports by Category */}
          <div className="grid grid-cols-12 gap-4">

            {/* Popular Reports Table */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Popular Reports</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium w-4">#</th>
                      <th className="text-left pb-3 font-medium">Report Name</th>
                      <th className="text-left pb-3 font-medium">Category</th>
                      <th className="text-center pb-3 font-medium">Generated</th>
                      <th className="text-right pb-3 font-medium">Downloads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {popularReports.map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-500 font-medium">{i + 1}</td>
                        <td className="py-3 text-zinc-200">{r.name}</td>
                        <td className="py-3 text-zinc-400">{r.cat}</td>
                        <td className="py-3 text-center text-white">{r.generated}</td>
                        <td className="py-3 text-right font-medium text-white">{r.downloads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 3.5: Report Status + Reports by Category */}
          <div className="grid grid-cols-12 gap-4">

            {/* Report Status Donut */}
            <div className="col-span-12 lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Report Status</h3>
              <div className="flex flex-col items-center gap-4 flex-1 justify-center">
                <DonutChart items={reportStatus} totalValue="186" totalLabel="Total Reports" size={130} />
                <div className="w-full space-y-1.5 mt-2">
                  {reportStatus.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
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

            {/* Reports by Category Bar Chart */}
            <div className="col-span-12 lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Reports by Category</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="flex gap-2 flex-1 min-h-[140px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>60</span><span>45</span><span>30</span><span>15</span><span>0</span>
                </div>
                <div className="flex-1 px-4">
                  <BarChart items={reportsByCategory} height={140} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Report Builder UI */}
          <div className="grid grid-cols-12 gap-4">

            {/* Report Builder (Quick Access) */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-4">Report Builder (Quick Access)</h3>
              <div className="flex items-center justify-between flex-1 relative mb-6">
                <div className="absolute top-6 left-12 right-12 h-px bg-zinc-800/80 -z-10" />
                <div className="absolute top-6 left-12 right-1/2 h-px bg-purple-500/50 -z-10" />

                <div className="flex flex-col items-center gap-2 text-center w-1/4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <span className="material-symbols-outlined text-[20px] text-purple-400">dataset</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-purple-400">1. Select Data Source</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 px-1">Choose the module & data you want</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center w-1/4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-blue-400">filter_list</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-blue-400">2. Apply Filters</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 px-1">Set conditions, date range & advanced filters</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center w-1/4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-emerald-400">description</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400">3. Choose Format</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 px-1">Select the output format (PDF, Excel, CSV)</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center w-1/4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-amber-400">inventory</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-amber-400">4. Generate Report</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 px-1">View, download or schedule the report</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-auto py-2">
                <button className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-colors">
                  Create New Report
                </button>
              </div>
            </div>
          </div>

          {/* Row 4.5: Recent Export History */}
          <div className="grid grid-cols-12 gap-4">

            {/* Recent Export History */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Recent Export History</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">File Name</th>
                      <th className="text-left pb-3 font-medium">Format</th>
                      <th className="text-left pb-3 font-medium">Size</th>
                      <th className="text-left pb-3 font-medium">Generated On</th>
                      <th className="text-center pb-3 font-medium">Status</th>
                      <th className="text-center pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {recentExports.map((e, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-200 font-mono text-[11px]">{e.file}</td>
                        <td className="py-3 text-zinc-400">{e.format}</td>
                        <td className="py-3 text-zinc-400">{e.size}</td>
                        <td className="py-3 text-zinc-400 whitespace-nowrap">{e.on}</td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-1 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">{e.status}</span>
                        </td>
                        <td className="py-3 text-center">
                          <button className="text-zinc-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[15px]">file_download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Recent Reports */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Recent Reports</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {recentReportsSidebar.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 group">
                  <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]" style={{ color: r.color }}>{r.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium truncate group-hover:text-purple-400 transition-colors cursor-pointer">{r.name}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{r.time}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-emerald-400 font-medium">Completed</span>
                    <button className="text-zinc-500 hover:text-white transition-colors ml-1">
                      <span className="material-symbols-outlined text-[14px]">file_download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Scheduled Reports</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {scheduledReports.map((r, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-blue-400">{r.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium truncate">{r.name}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{r.sub}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[8px] text-emerald-400 font-medium">Active</span>
                    <span className="material-symbols-outlined text-[12px] text-zinc-500">event</span>
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
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${q.color}15` }}>
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
