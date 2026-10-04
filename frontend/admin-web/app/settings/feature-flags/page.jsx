"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const topKPIs = [
  { label: "Total Feature Flags", value: "128", sub: "+16.4% vs last 7 days", isRed: false, icon: "flag", color: "#a855f7", bg: "bg-purple-500/20", spark: [120,122,121,124,126,128,128] },
  { label: "Enabled Flags", value: "84", sub: "65.6% of total", isRed: false, icon: "check_circle", color: "#22c55e", bg: "bg-green-500/20", spark: [75,76,78,80,82,83,84] },
  { label: "Disabled Flags", value: "32", sub: "25.0% of total", isRed: true, icon: "cancel", color: "#ef4444", bg: "bg-red-500/20", spark: [40,38,37,35,34,33,32] },
  { label: "In Experiment", value: "12", sub: "9.4% of total", isRed: false, icon: "science", color: "#f59e0b", bg: "bg-orange-500/20", spark: [5,6,8,9,11,12,12] },
  { label: "Rollouts Active", value: "14", sub: "+27.3% vs last 7 days", isRed: false, icon: "rocket_launch", color: "#3b82f6", bg: "bg-blue-500/20", spark: [8,9,10,12,13,14,14] },
  { label: "Impressions (7D)", value: "42.8M", sub: "+18.7% vs last 7 days", isRed: false, icon: "visibility", color: "#14b8a6", bg: "bg-teal-500/20", spark: [30,32,35,36,39,41,42.8] },
];

const flagsStatus = [
  { label: "Enabled", value: 84, color: "#22c55e", pct: "65.6%" },
  { label: "Disabled", value: 32, color: "#ef4444", pct: "25.0%" },
  { label: "In Experiment", value: 12, color: "#f59e0b", pct: "9.4%" },
  { label: "Archived", value: 6, color: "#6b7280", pct: "4.7%" },
];

const targetingOverview = [
  { label: "User Targeting", value: 64, color: "#3b82f6", pct: "50.0%" },
  { label: "Percentage Rollout", value: 28, color: "#22c55e", pct: "21.9%" },
  { label: "Segment Targeting", value: 20, color: "#f59e0b", pct: "15.6%" },
  { label: "Environment Targeting", value: 10, color: "#a855f7", pct: "7.8%" },
  { label: "Others", value: 6, color: "#6b7280", pct: "4.7%" },
];

const typesDistribution = [
  { label: "Release", value: 74, color: "#3b82f6", pct: "57.8%" },
  { label: "Experiment", value: 24, color: "#22c55e", pct: "18.8%" },
  { label: "Permission", value: 16, color: "#f59e0b", pct: "12.5%" },
  { label: "Ops / Kill Switch", value: 10, color: "#a855f7", pct: "7.8%" },
  { label: "Business Rule", value: 4, color: "#6b7280", pct: "3.1%" },
];

const envDistribution = [
  { label: "Production", value: 64, color: "#3b82f6", pct: "50.0%" },
  { label: "Staging", value: 28, color: "#22c55e", pct: "21.9%" },
  { label: "Development", value: 20, color: "#f59e0b", pct: "15.6%" },
  { label: "QA", value: 10, color: "#a855f7", pct: "7.8%" },
  { label: "Others", value: 6, color: "#6b7280", pct: "4.7%" },
];

const featureFlagsList = [
  { name: "New User Onboarding Flow", key: "new_onboarding_flow", status: "Enabled", type: "Release", target: "50% Rollout", env: "Production", imp: "8.4M", mod: "May 27, 2025 09:20 AM", cBg: "bg-green-500/20", cTc: "text-green-400", icon: "N", bg: "bg-blue-500" },
  { name: "Advanced Search", key: "advanced_search", status: "Enabled", type: "Release", target: "75% Rollout", env: "Production", imp: "12.7M", mod: "May 27, 2025 09:10 AM", cBg: "bg-green-500/20", cTc: "text-green-400", icon: "A", bg: "bg-green-500" },
  { name: "AI Product Recommendations", key: "ai_recommendations", status: "In Experiment", type: "Experiment", target: "User Segment", env: "Production", imp: "6.5M", mod: "May 27, 2025 08:30 AM", cBg: "bg-orange-500/20", cTc: "text-orange-400", icon: "AI", bg: "bg-orange-500" },
  { name: "Express Checkout", key: "express_checkout", status: "Disabled", type: "Release", target: "-", env: "Production", imp: "0", mod: "May 26, 2025 06:45 PM", cBg: "bg-red-500/20", cTc: "text-red-400", icon: "E", bg: "bg-purple-500" },
  { name: "New Seller Dashboard", key: "seller_dashboard_v2", status: "Enabled", type: "Release", target: "100%", env: "Production", imp: "4.8M", mod: "May 26, 2025 05:30 PM", cBg: "bg-green-500/20", cTc: "text-green-400", icon: "N", bg: "bg-teal-500" },
  { name: "Cash on Delivery UI", key: "cod_ui_update", status: "Disabled", type: "Release", target: "-", env: "Production", imp: "0", mod: "May 26, 2025 04:15 PM", cBg: "bg-red-500/20", cTc: "text-red-400", icon: "C", bg: "bg-red-500" },
  { name: "Multi Language Support", key: "multi_language", status: "Enabled", type: "Release", target: "100%", env: "Staging", imp: "1.2M", mod: "May 26, 2025 03:40 PM", cBg: "bg-green-500/20", cTc: "text-green-400", icon: "M", bg: "bg-indigo-500" },
  { name: "Dark Mode", key: "dark_mode", status: "Enabled", type: "Release", target: "User Segment", env: "Production", imp: "9.1M", mod: "May 26, 2025 02:20 PM", cBg: "bg-green-500/20", cTc: "text-green-400", icon: "D", bg: "bg-blue-400" },
];

const healthChecks = [
  { label: "No conflicting rules detected", status: "pass" },
  { label: "All critical flags have fallback", status: "pass" },
  { label: "Kill switch enabled", status: "pass" },
  { label: "No stale experiments", status: "pass" },
  { label: "Audit logging enabled", status: "pass" },
];

const recentActivity = [
  { title: "New flag 'Express Checkout' created", sub: "by DevOps Admin", time: "10:20 AM", icon: "flag", bg: "bg-purple-500" },
  { title: "Flag 'New Seller Dashboard' enabled", sub: "by Product Manager", time: "09:45 AM", icon: "check_circle", bg: "bg-orange-500" },
  { title: "Rollout 'Advanced Search' 50% → 75%", sub: "by DevOps Admin", time: "09:10 AM", icon: "rocket_launch", bg: "bg-blue-500" },
  { title: "Experiment 'AI Recommendations' started", sub: "by Data Team", time: "08:30 AM", icon: "science", bg: "bg-indigo-500" },
  { title: "Flag 'Cash on Delivery UI' disabled", sub: "by Product Manager", time: "Yesterday", icon: "cancel", bg: "bg-red-500" },
];

const quickActions = [
  { icon: "flag", label: "Create Flag", bg: "text-blue-400" },
  { icon: "science", label: "Create Experiment", bg: "text-purple-400" },
  { icon: "rocket_launch", label: "Create Rollout", bg: "text-green-400" },
  { icon: "download", label: "Import Flags", bg: "text-orange-400" },
  { icon: "upload", label: "Export Flags", bg: "text-emerald-400" },
  { icon: "history_edu", label: "Audit Logs", bg: "text-indigo-400" },
  { icon: "description", label: "Flag Templates", bg: "text-yellow-400" },
  { icon: "compare_arrows", label: "Compare Flags", bg: "text-fuchsia-400" },
  { icon: "delete_sweep", label: "Cleanup Flags", bg: "text-teal-400" },
];

const topFlagsImp = [
  { label: "Advanced Search", value: "12.7M", pct: 100 },
  { label: "Dark Mode", value: "9.1M", pct: 71 },
  { label: "New Onboarding Flow", value: "8.4M", pct: 66 },
  { label: "AI Recommendations", value: "6.5M", pct: 51 },
  { label: "New Seller Dashboard", value: "4.8M", pct: 37 },
];

const rolloutProgress = [
  { label: "Advanced Search", value: "75%" },
  { label: "New Onboarding Flow", value: "50%" },
  { label: "COD UI Update", value: "25%" },
  { label: "Dark Mode", value: "30%" },
  { label: "Wishlist Beta", value: "10%" },
];


// ─────────────────────────────────────────────────────────────────────────────
// CHART COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");

  return (
    <svg className="w-16 h-5 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function DonutChart({ items, totalLabel, totalValue, size = 48, r = 18, strokeWidth = 8 }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;
  const center = size / 2;
  const circum = 2 * Math.PI * r;

  return (
    <div className="relative w-full aspect-square max-w-[140px] flex-shrink-0 mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
        <circle r={r} cx={center} cy={center} fill="transparent" stroke="#1f2937" strokeWidth={strokeWidth} />
        {items.map((item, i) => {
          const pct = item.value / total;
          const dasharray = `${pct * circum} ${circum}`;
          const dashoffset = -(cumulativePercent * circum);
          cumulativePercent += pct;
          return (
            <circle
              key={i}
              r={r}
              cx={center}
              cy={center}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[14px] font-bold text-white leading-tight">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center uppercase tracking-wider mt-0.5">{totalLabel}</div>
      </div>
    </div>
  );
}

function MultiLineChart({ datasets }) {
  return (
    <div className="absolute inset-0 pt-6 pb-6 pr-4 pl-8">
      {/* Y-Axis labels */}
      <div className="absolute left-0 top-6 bottom-6 flex flex-col justify-between text-[9px] text-zinc-500 font-mono text-right w-6">
        <span>50M</span>
        <span>40M</span>
        <span>30M</span>
        <span>20M</span>
        <span>10M</span>
        <span>0</span>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 left-8 top-6 bottom-6 right-4 flex flex-col justify-between pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border-b border-zinc-800 w-full" />
        ))}
      </div>

      {/* X-Axis labels */}
      <div className="absolute left-8 right-4 bottom-0 flex justify-between text-[9px] text-zinc-500 font-mono translate-y-full pt-2">
        <span>May 21</span>
        <span>May 22</span>
        <span>May 23</span>
        <span>May 24</span>
        <span>May 25</span>
        <span>May 26</span>
        <span>May 27</span>
      </div>

      {/* SVG Container */}
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ marginLeft: "32px", width: "calc(100% - 48px)" }}>
        {datasets.map((ds, idx) => {
          const max = 50000;
          const points = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
          return (
            <g key={idx}>
              <polyline points={points} fill="none" stroke={ds.color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
              {ds.data.map((v, i) => (
                <circle key={i} cx={(i / (ds.data.length - 1)) * 100} cy={100 - (v / max) * 100} r="1.5" fill={ds.color} stroke="#18181b" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function HalfGauge({ score }) {
  const size = 100;
  const r = 40;
  const center = size / 2;
  const circum = Math.PI * r; // half circle
  const pct = score / 100;

  return (
    <div className="relative w-full max-w-[160px] mx-auto overflow-hidden">
      <svg viewBox={`0 0 ${size} ${size/2 + 10}`} className="w-full">
        {/* Background Arc */}
        <path d={`M ${center - r},${center} A ${r},${r} 0 0,1 ${center + r},${center}`} fill="none" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
        {/* Foreground Arc */}
        <path 
          d={`M ${center - r},${center} A ${r},${r} 0 0,1 ${center + r},${center}`} 
          fill="none" 
          stroke="#22c55e" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={circum - (pct * circum)}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <div className="text-[20px] font-bold text-white leading-none tracking-tight">
          {score}<span className="text-zinc-500 text-[14px]">/100</span>
        </div>
        <div className="text-[10px] text-zinc-400 mt-1">Excellent</div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function FeatureFlagsDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
          <div className="px-6 pt-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white tracking-tight">Feature Flags Dashboard</h1>
                <span className="material-symbols-outlined text-purple-400 text-[18px]">flag</span>
              </div>
              <p className="text-[11px] text-zinc-400">Manage feature flags, rollouts, experiments and feature control across the platform.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-[11px] font-medium text-zinc-300 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                May 21 – May 27, 2025
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>
              <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Refresh
              </button>
              <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                <span className="material-symbols-outlined text-[14px]">description</span>
                Documentation
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 lg:min-w-0">
            
            {/* Top KPIs Row */}
            <div className="flex flex-wrap gap-3">
              {topKPIs.map((kpi, i) => (
                <div key={i} className="flex-1 min-w-[140px] bg-zinc-900/40 border border-zinc-800 rounded p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2 min-w-0 mb-1">
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${kpi.bg}`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ color: kpi.color }}>{kpi.icon}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">{kpi.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white whitespace-nowrap truncate">{kpi.value}</div>
                  <div className="flex items-end justify-between mt-1 gap-2">
                    <div className={`text-[9px] truncate ${kpi.isRed ? 'text-red-500' : 'text-emerald-400'}`}>{kpi.sub}</div>
                    <Spark data={kpi.spark} color={kpi.color} />
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Row */}
            <div className="flex flex-wrap gap-4">
              
              {/* Status Donut */}
              <div className="flex-1 min-w-[300px] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Feature Flags Status</h3>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-4 flex-1">
                  <DonutChart items={flagsStatus} totalValue="128" totalLabel="Total" size={48} r={18} strokeWidth={8} />
                  <div className="flex-1 space-y-2 w-full mt-2 xl:mt-0">
                    {flagsStatus.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{item.value}</span>
                          <span className="text-zinc-500 w-10 text-right">({item.pct})</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-center mt-2">
                      <Link href="#" className="text-[10px] text-purple-400 hover:text-purple-300">View all flags →</Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-line Over Time */}
              <div className="flex-[2] min-w-[100%] xl:min-w-[500px] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-h-[260px]">
                <div className="flex items-center justify-between mb-4 z-10 relative">
                  <h3 className="text-[13px] font-bold text-white">Rollout & Experiment Overview</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-[9px] text-zinc-400">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5" style={{backgroundColor: "#3b82f6"}}></span> Rollouts
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5" style={{backgroundColor: "#f59e0b"}}></span> Experiments
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5" style={{backgroundColor: "#22c55e"}}></span> Impressions (M)
                      </div>
                    </div>
                    <select className="bg-zinc-800/50 border border-zinc-700 rounded px-2 py-1 text-[10px] text-white">
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 relative min-h-0">
                  <MultiLineChart datasets={[
                    { color: "#22c55e", data: [32000, 36000, 39000, 38000, 42000, 44000, 48000] }, // Impressions (highest)
                    { color: "#3b82f6", data: [15000, 16000, 18000, 19000, 22000, 25000, 28000] }, // Rollouts
                    { color: "#f59e0b", data: [5000, 6000, 8000, 7500, 9000, 10000, 12000] }, // Experiments
                  ]} />
                </div>
              </div>

              {/* Targeting Donut */}
              <div className="flex-1 min-w-[300px] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Targeting Overview</h3>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-4 flex-1">
                  <DonutChart items={targetingOverview} totalValue="128" totalLabel="Total" size={48} r={18} strokeWidth={8} />
                  <div className="flex-1 space-y-2 w-full mt-2 xl:mt-0">
                    {targetingOverview.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{item.value}</span>
                          <span className="text-zinc-500 w-10 text-right">({item.pct})</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-center mt-2">
                      <Link href="#" className="text-[10px] text-purple-400 hover:text-purple-300">View targeting rules →</Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Main Split Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              
              {/* Left Column (Primary Table + Charts) */}
              <div className="xl:col-span-9 flex flex-col gap-4 min-w-0">
                
                {/* All Feature Flags */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded flex flex-col min-w-0 overflow-hidden">
                  <div className="p-4 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-[13px] font-bold text-white shrink-0">All Feature Flags</h3>
                    
                    <div className="flex items-center flex-wrap gap-3 flex-1 justify-end">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-zinc-500">search</span>
                        <input type="text" placeholder="Search flags..." className="bg-zinc-900/50 border border-zinc-800 rounded text-[11px] text-zinc-300 pl-8 pr-3 py-1.5 focus:outline-none focus:border-purple-500/50 w-40 placeholder:text-zinc-500" />
                      </div>
                      <select className="bg-zinc-900/50 border border-zinc-800 rounded px-2 py-1.5 text-[11px] text-zinc-300">
                        <option>All Status</option>
                      </select>
                      <select className="bg-zinc-900/50 border border-zinc-800 rounded px-2 py-1.5 text-[11px] text-zinc-300">
                        <option>All Types</option>
                      </select>
                      <select className="bg-zinc-900/50 border border-zinc-800 rounded px-2 py-1.5 text-[11px] text-zinc-300">
                        <option>All Environments</option>
                      </select>
                      <button className="flex items-center gap-1 text-[11px] font-medium text-white bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded transition-colors">
                        <span className="material-symbols-outlined text-[14px]">add</span> Create Flag
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] whitespace-nowrap">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-800/60 bg-zinc-900/20">
                          <th className="px-4 py-3 font-medium">Flag Name</th>
                          <th className="px-4 py-3 font-medium">Key</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Targeting</th>
                          <th className="px-4 py-3 font-medium">Environment</th>
                          <th className="px-4 py-3 font-medium">Impressions (7D)</th>
                          <th className="px-4 py-3 font-medium">Last Modified</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-300">
                        {featureFlagsList.map((f, i) => (
                          <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                            <td className="px-4 py-3 flex items-center gap-2">
                              <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white ${f.bg}`}>{f.icon}</div>
                              <span className="text-white font-medium">{f.name}</span>
                            </td>
                            <td className="px-4 py-3 font-mono text-zinc-400">{f.key}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${f.cBg} ${f.cTc}`}>
                                {f.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-400">{f.type}</td>
                            <td className="px-4 py-3 text-zinc-400">{f.target}</td>
                            <td className="px-4 py-3 text-zinc-400">{f.env}</td>
                            <td className="px-4 py-3 text-white">{f.imp}</td>
                            <td className="px-4 py-3 text-zinc-500">{f.mod}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2 text-zinc-500">
                                <button className="hover:text-white transition-colors"><span className="material-symbols-outlined text-[14px]">visibility</span></button>
                                <button className="hover:text-white transition-colors"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                                <button className="hover:text-white transition-colors"><span className="material-symbols-outlined text-[14px]">more_vert</span></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Showing 1 to 8 of 128 feature flags</span>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-zinc-800 transition-colors"><span className="material-symbols-outlined text-[14px]">chevron_left</span></button>
                      <button className="w-6 h-6 rounded flex items-center justify-center bg-purple-600 text-white transition-colors">1</button>
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-zinc-800 transition-colors">2</button>
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-zinc-800 transition-colors">3</button>
                      <span>...</span>
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-zinc-800 transition-colors">16</button>
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-zinc-800 transition-colors"><span className="material-symbols-outlined text-[14px]">chevron_right</span></button>
                    </div>
                  </div>
                </div>

                {/* Bottom Sub-Widgets Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Flag Types Distribution */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                    <h3 className="text-[11px] font-bold text-white mb-4 shrink-0">Flag Types Distribution</h3>
                    <div className="flex flex-col items-center gap-4 flex-1">
                      <DonutChart items={typesDistribution} totalValue="128" totalLabel="Total" size={44} r={16} strokeWidth={6} />
                      <div className="w-full space-y-1.5 mt-2">
                        {typesDistribution.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                              <span className="text-zinc-300">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white">{item.value}</span>
                              <span className="text-zinc-500">({item.pct})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Environments Distribution */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                    <h3 className="text-[11px] font-bold text-white mb-4 shrink-0">Environments Distribution</h3>
                    <div className="flex flex-col items-center gap-4 flex-1">
                      <DonutChart items={envDistribution} totalValue="128" totalLabel="Total" size={44} r={16} strokeWidth={6} />
                      <div className="w-full space-y-1.5 mt-2">
                        {envDistribution.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                              <span className="text-zinc-300">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white">{item.value}</span>
                              <span className="text-zinc-500">({item.pct})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Flags by Impressions */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                    <h3 className="text-[11px] font-bold text-white mb-4 shrink-0">Top Flags by Impressions (7D)</h3>
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      {topFlagsImp.map((f, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-zinc-300 truncate pr-2">{f.label}</span>
                            <span className="text-white shrink-0">{f.value}</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${f.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono mt-2 pt-2 border-t border-zinc-800/50">
                      <span>0</span>
                      <span>5M</span>
                      <span>10M</span>
                      <span>15M</span>
                    </div>
                  </div>

                  {/* Rollout Progress */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                    <h3 className="text-[11px] font-bold text-white mb-4 shrink-0">Rollout Progress</h3>
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      {rolloutProgress.map((r, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-zinc-300 truncate pr-2">{r.label}</span>
                            <span className="text-zinc-400 shrink-0">{r.value}</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-indigo-500" style={{ width: r.value }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Sidebar Widgets) */}
              <div className="xl:col-span-3 flex flex-col gap-4 min-w-0">
                
                {/* Feature Flag Health */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                  <h3 className="text-[13px] font-bold text-white mb-4">Feature Flag Health</h3>
                  
                  <div className="mb-4 mt-2">
                    <HalfGauge score={92} />
                  </div>

                  <div className="space-y-2.5 mb-6 mt-4">
                    {healthChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">check_circle</span>
                        <span className="text-zinc-300">{check.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 py-2 rounded text-[11px] font-medium transition-colors">
                    View Recommendations
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-bold text-white">Recent Activity</h3>
                    <Link href="#" className="text-[9px] text-purple-400 hover:text-purple-300">View All</Link>
                  </div>
                  <div className="flex-1 flex flex-col gap-4 relative">
                    <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-800/60 z-0"></div>
                    {recentActivity.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 relative z-10">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white shrink-0 shadow-lg ${act.bg}`}>
                          <span className="material-symbols-outlined text-[12px]">{act.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white leading-tight">{act.title}</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[9px] text-zinc-500">{act.sub}</span>
                            <span className="text-[9px] text-zinc-600">{act.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                  <h3 className="text-[13px] font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {quickActions.map((action, i) => (
                      <button key={i} className="flex flex-col items-center justify-center gap-1.5 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800/50 p-2.5 rounded transition-colors group">
                        <span className={`material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform ${action.bg}`}>{action.icon}</span>
                        <span className="text-[9px] text-zinc-400 text-center leading-tight group-hover:text-zinc-300">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          <footer className="mt-auto px-6 py-4 border-t border-zinc-800/60 text-center flex items-center justify-between shrink-0">
            <span className="text-[10px] text-zinc-500">© 2025 Katabazaar Platform. All rights reserved.</span>
            <span className="text-[10px] text-zinc-500">Timezone: IST (UTC +05:30)</span>
          </footer>
    </div>
  );
}
