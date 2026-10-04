"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Chart Components
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data = [], color = "#3b82f6", height = 24 }) {
  if (!data.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1), w = 80;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  const areaPath = `M0,${height} ${data.map((v, i) => `L${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
  const id = `sg-${color.replace("#", "")}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible mt-1 shrink-0" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ items, totalLabel, totalValue, size = 120 }) {
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
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={item.color} strokeWidth="14"
              strokeDasharray={dash} strokeDashoffset={offset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-sm font-bold text-white">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center">{totalLabel}</div>
      </div>
    </div>
  );
}

function MultiLineChart({ series, labels, height = 140 }) {
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals, 1);
  const w = 440, h = height;
  const pts = (data) => data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`mlg-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1="0" y1={h * f} x2={w} y2={h * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      {series.map((s, i) => {
        const area = `M0,${h} ${s.data.map((v, j) => `L${(j / Math.max(s.data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ")} L${w},${h} Z`;
        return (
          <g key={i}>
            <path d={area} fill={`url(#mlg-${i})`} />
            <polyline points={pts(s.data)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

function BarChart({ data, color = "#8b5cf6", height = 120 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 w-full" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t transition-all duration-700" style={{ height: `${(d.value / max) * (height - 20)}px`, background: color, opacity: 0.75 + (i / data.length) * 0.25 }} />
        </div>
      ))}
    </div>
  );
}

function GeoMap({ data = [] }) {
  const getX = (lng) => ((lng + 180) / 360) * 1000;
  const getY = (lat) => 280 - (lat * 2.8);
  const isOnlyIndia = data.every(c => !c.lat || !c.lng || (c.lat > 8 && c.lat < 37 && c.lng > 68 && c.lng < 97));
  const viewBox = isOnlyIndia ? "690 175 75 80" : "0 0 1000 500";

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0a0f1a] rounded-lg overflow-hidden border border-zinc-800/50">
      <svg viewBox={viewBox} className="w-full h-full">
        <image href="/world-map.svg" width="1000" height="500" className="opacity-30" style={{ filter: "invert(1) brightness(1.5)" }} />
        {data.map((city, i) => city.lat && city.lng ? (
          <g key={i}>
            <circle cx={getX(city.lng)} cy={getY(city.lat)} r={isOnlyIndia ? 1.5 : 8} fill={city.color || "#f59e0b"} opacity="0.9" style={{ filter: `drop-shadow(0 0 4px ${city.color || "#f59e0b"})` }} />
          </g>
        ) : null)}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "group", label: "Total Customers", value: "2,45,876", sub: "+15.3% vs last 7 days", up: true, color: "#3b82f6", sp: [180, 195, 205, 215, 230, 240, 245] },
  { icon: "person_add", label: "New Customers", value: "18,672", sub: "+13.8% vs last 7 days", up: true, color: "#10b981", sp: [12, 14, 15, 16, 17, 18, 18.6] },
  { icon: "group_remove", label: "Returning Customers", value: "67,543", sub: "+9.6% vs last 7 days", up: true, color: "#8b5cf6", sp: [55, 58, 61, 63, 65, 67, 67.5] },
  { icon: "repeat", label: "Repeat Purchase Rate", value: "34.26%", sub: "+4.21% vs last 7 days", up: true, color: "#f59e0b", sp: [28, 30, 31, 32, 33, 34, 34.26] },
  { icon: "diamond", label: "Avg. Customer Lifetime Value", value: "₹3,245", sub: "+6.32% vs last 7 days", up: true, color: "#06b6d4", sp: [2900, 3000, 3050, 3100, 3150, 3200, 3245] },
  { icon: "trending_down", label: "Churn Rate", value: "4.18%", sub: "-0.72% vs last 7 days", up: false, color: "#ef4444", sp: [5.2, 5.0, 4.9, 4.7, 4.5, 4.3, 4.18] },
];

const growthSeries = [
  { label: "Total Customers", color: "#3b82f6", data: [213342, 220000, 225000, 228000, 235000, 240000, 245876] },
  { label: "New Customers", color: "#10b981", data: [14000, 15000, 16000, 15500, 17000, 18000, 18672] },
  { label: "Returning Customers", color: "#8b5cf6", data: [58000, 60000, 62000, 63000, 65000, 66000, 67543] },
];
const growthLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const demographics = [
  { label: "18-24 Years", value: 28.6, color: "#3b82f6" },
  { label: "25-34 Years", value: 41.2, color: "#8b5cf6" },
  { label: "35-44 Years", value: 18.7, color: "#10b981" },
  { label: "45-54 Years", value: 8.9, color: "#f59e0b" },
  { label: "55+ Years", value: 2.6, color: "#ef4444" },
];

const cities = [
  { name: "New Delhi", customers: 28742, lat: 28.6139, lng: 77.2090, color: "#f59e0b" },
  { name: "Mumbai", customers: 24561, lat: 19.0760, lng: 72.8777, color: "#f59e0b" },
  { name: "Bengaluru", customers: 21875, lat: 12.9716, lng: 77.5946, color: "#f59e0b" },
  { name: "Hyderabad", customers: 18632, lat: 17.3850, lng: 78.4867, color: "#f59e0b" },
  { name: "Pune", customers: 14263, lat: 18.5204, lng: 73.8567, color: "#f59e0b" },
  { name: "Chennai", customers: 12984, lat: 13.0827, lng: 80.2707, color: "#f59e0b" },
  { name: "Kolkata", customers: 10826, lat: 22.5726, lng: 88.3639, color: "#f59e0b" },
  { name: "Ahmedabad", customers: 8765, lat: 23.0225, lng: 72.5714, color: "#f59e0b" },
];

const acquisitionChannels = [
  { label: "Organic Search", value: 38.6, color: "#3b82f6" },
  { label: "Direct", value: 24.3, color: "#8b5cf6" },
  { label: "Social Media", value: 16.8, color: "#10b981" },
  { label: "Referrals", value: 10.2, color: "#f59e0b" },
  { label: "Paid Ads", value: 7.1, color: "#06b6d4" },
  { label: "Email Campaign", value: 3.0, color: "#ef4444" },
];

const clvBuckets = [
  { label: "₹0-500", value: 45000 }, { label: "₹500-1k", value: 38000 },
  { label: "₹1k-2k", value: 52000 }, { label: "₹2k-5k", value: 62000 },
  { label: "₹5k-10k", value: 28000 }, { label: "₹10k+", value: 21000 },
];

const cohorts = [
  { month: "Jan 2025", data: [100, 42, 28, 18, 12, 8] },
  { month: "Feb 2025", data: [100, 43, 29, 19, 13, 9] },
  { month: "Mar 2025", data: [100, 41, 27, 17, 11, null] },
  { month: "Apr 2025", data: [100, 40, 26, 16, null, null] },
  { month: "May 2025", data: [100, 39, null, null, null, null] },
];

const topCustomers = [
  { name: "rahul.verma@example.com", spend: "₹48,756", orders: 48, clv: "₹12,450", segment: "High Value" },
  { name: "priya.sharma@example.com", spend: "₹36,450", orders: 36, clv: "₹9,850", segment: "High Value" },
  { name: "karthik.reddy@example.com", spend: "₹28,340", orders: 25, clv: "₹8,120", segment: "Loyal" },
  { name: "anita.patel@example.com", spend: "₹24,510", orders: 22, clv: "₹7,450", segment: "Loyal" },
  { name: "saurabh.jain@example.com", spend: "₹22,330", orders: 18, clv: "₹6,820", segment: "Loyal" },
];

const topCategories = [
  { name: "Grocery", customers: 125430, revenue: "₹4,12,34,560", orders: 412345 },
  { name: "Food & Beverages", customers: 98762, revenue: "₹2,98,45,210", orders: 298765 },
  { name: "Home Essentials", customers: 85230, revenue: "₹2,25,12,340", orders: 225312 },
  { name: "Hardware", customers: 61245, revenue: "₹1,68,23,450", orders: 168934 },
  { name: "Daily Essentials", customers: 45678, revenue: "₹1,05,33,220", orders: 105812 },
];

const feedback = [
  { label: "Positive", value: 7245, pct: 58.2, color: "#10b981" },
  { label: "Neutral", value: 3126, pct: 25.1, color: "#f59e0b" },
  { label: "Negative", value: 2085, pct: 16.7, color: "#ef4444" },
];

const segments = [
  { label: "High Value Customers", count: "18,456", pct: "7.50%", color: "#f59e0b" },
  { label: "Loyal Customers", count: "42,318", pct: "17.20%", color: "#10b981" },
  { label: "Potential Loyalists", count: "52,347", pct: "21.28%", color: "#3b82f6" },
  { label: "New Customers", count: "18,672", pct: "7.59%", color: "#8b5cf6" },
  { label: "At Risk Customers", count: "15,832", pct: "6.43%", color: "#ef4444" },
  { label: "Churned Customers", count: "7,651", pct: "3.10%", color: "#6b7280" },
  { label: "Need Attention", count: "90,600", pct: "36.90%", color: "#06b6d4" },
];

const recentActivity = [
  { icon: "person_add", text: "New customer registered", sub: "john.doe@example.com", time: "2m ago", color: "#10b981" },
  { icon: "repeat", text: "Repeat purchase completed", sub: "Order #KB278621", time: "8m ago", color: "#3b82f6" },
  { icon: "edit", text: "Customer profile updated", sub: "sarah.miller@example.com", time: "15m ago", color: "#8b5cf6" },
  { icon: "location_on", text: "Address added", sub: "rahul.verma@example.com", time: "25m ago", color: "#f59e0b" },
  { icon: "person_off", text: "Account deactivated", sub: "mike.brown@example.com", time: "45m ago", color: "#ef4444" },
];

const customerAlerts = [
  { icon: "warning", text: "High churn rate detected", sub: "Category: At Risk Customers", time: "10m ago", color: "#f59e0b" },
  { icon: "warning", text: "Low repeat purchase rate", sub: "Category: Hardware", time: "22m ago", color: "#f59e0b" },
  { icon: "info", text: "Inactive customers > 90 days", sub: "Count: 12,543", time: "35m ago", color: "#3b82f6" },
  { icon: "error", text: "High refund customers", sub: "Count: 1,245", time: "1h ago", color: "#ef4444" },
];

const quickActions = [
  { icon: "add_circle", label: "Create Segment", color: "#8b5cf6" },
  { icon: "campaign", label: "Send Campaign", color: "#10b981" },
  { icon: "file_download", label: "Export Customers", color: "#3b82f6" },
  { icon: "manage_search", label: "View Cohort", color: "#f59e0b" },
  { icon: "reviews", label: "Customer Feedback", color: "#06b6d4" },
  { icon: "upload", label: "Upload Customers", color: "#ef4444" },
];

function segmentColor(s) {
  if (s === "High Value") return "bg-amber-500/20 text-amber-400";
  if (s === "Loyal") return "bg-emerald-500/20 text-emerald-400";
  return "bg-blue-500/20 text-blue-400";
}

function retentionColor(val) {
  if (val === null) return "bg-zinc-800/50 text-zinc-600";
  if (val >= 80) return "bg-emerald-500/80 text-white";
  if (val >= 40) return "bg-emerald-500/50 text-white";
  if (val >= 20) return "bg-amber-500/50 text-white";
  if (val >= 10) return "bg-orange-500/50 text-white";
  return "bg-red-500/50 text-white";
}

export default function CustomerInsightsDashboard() {
  const [period, setPeriod] = useState("May 21 – May 27, 2025");

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Customer Insights Dashboard
            <span className="material-symbols-outlined text-[18px] text-blue-400">group</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Deep dive into customer behavior, segmentation, retention and lifetime value.</p>
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
        {/* ── Main Content ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((k, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]" style={{ color: k.color }}>{k.icon}</span>
                  <span className="text-[10px] text-zinc-400 font-medium leading-tight">{k.label}</span>
                </div>
                <div className="text-lg font-bold text-white">{k.value}</div>
                <div className={`text-[9px] flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                  <span className="material-symbols-outlined text-[11px]">{k.up ? "arrow_upward" : "arrow_downward"}</span>
                  {k.sub}
                </div>
                <Spark data={k.sp} color={k.color} height={22} />
              </div>
            ))}
          </div>

          {/* Row 2: Growth Chart + Demographics + Location Map */}
          <div className="grid grid-cols-12 gap-4">
            {/* Customer Growth - Multi-line Chart */}
            <div className="col-span-12 lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Customer Growth</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Daily</option><option>Weekly</option><option>Monthly</option>
                </select>
              </div>
              <div className="flex gap-3 mb-2 flex-wrap">
                {growthSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-[9px] text-zinc-400">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 min-h-[120px]">
                <MultiLineChart series={growthSeries} labels={growthLabels} height={120} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
                {growthLabels.map(l => <span key={l}>{l}</span>)}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 border-t border-zinc-800 pt-3">
                {[
                  { label: "Current Period", val: "2,45,876" },
                  { label: "Previous Period", val: "2,13,342" },
                  { label: "Growth", val: "15.3%", green: true },
                  { label: "Trend", val: "Positive", green: true },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[9px] text-zinc-500">{s.label}</div>
                    <div className={`text-[11px] font-bold ${s.green ? "text-emerald-400" : "text-white"}`}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Demographics */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Customer Demographics</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={demographics} totalValue="2,45,876" totalLabel="Total Customers" size={100} />
                <div className="space-y-1.5 flex-1">
                  {demographics.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: d.color }} />
                        <span className="text-zinc-300">{d.label}</span>
                      </div>
                      <span className="text-white font-medium">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-800">
                {[
                  { label: "Male", val: "58.7%", sub: "(1,44,201)" },
                  { label: "Female", val: "40.8%", sub: "(1,00,214)" },
                  { label: "Other", val: "0.5%", sub: "(1,461)" },
                ].map((g, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-zinc-400">{g.label}</div>
                    <div className="text-[12px] font-bold text-white">{g.val}</div>
                    <div className="text-[9px] text-zinc-500">{g.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Location Map */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Customer Location</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="flex-1 min-h-[110px] mb-2 rounded overflow-hidden">
                <GeoMap data={cities} />
              </div>
              <div className="text-[9px] text-zinc-500 font-semibold mb-1">Top Cities</div>
              <div className="space-y-1">
                {cities.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-300">{c.name}</span>
                    <span className="text-white font-medium">{c.customers.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Acquisition Channels + CLV Distribution + Cohort Retention */}
          <div className="grid grid-cols-12 gap-4">
            {/* Acquisition Channels */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Customer Acquisition Channels</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={acquisitionChannels} totalValue="2,45,876" totalLabel="Total Customers" size={100} />
                <div className="space-y-1.5 flex-1">
                  {acquisitionChannels.map((a, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: a.color }} />
                        <span className="text-zinc-300">{a.label}</span>
                      </div>
                      <span className="text-white font-medium">{a.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CLV Distribution Bar Chart */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Customer Lifetime Value (CLV) Distribution</h3>
              <div className="flex-1">
                <BarChart data={clvBuckets} color="#8b5cf6" height={110} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
                {clvBuckets.map(b => <span key={b.label}>{b.label}</span>)}
              </div>
            </div>

            {/* Cohort Retention Analysis */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Cohort Retention Analysis</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Monthly</option>
                </select>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[9px]">
                  <thead>
                    <tr className="text-zinc-500">
                      <th className="text-left pb-1.5 font-medium whitespace-nowrap pr-2">Cohort</th>
                      {["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"].map(m => (
                        <th key={m} className="text-center pb-1.5 font-medium px-0.5 whitespace-nowrap">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {cohorts.map((row, i) => (
                      <tr key={i}>
                        <td className="py-0.5 text-zinc-400 pr-2 whitespace-nowrap">{row.month}</td>
                        {row.data.map((val, j) => (
                          <td key={j} className="py-0.5 px-0.5">
                            <div className={`text-center rounded text-[9px] font-bold py-1 ${retentionColor(val)}`}>
                              {val !== null ? `${val}%` : "–"}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] text-zinc-500">High Retention</span>
                  <div className="flex-1 h-2 rounded" style={{ background: "linear-gradient(to right, #10b981, #f59e0b, #ef4444)" }} />
                  <span className="text-[9px] text-zinc-500">Low Retention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Top Customers + Top Categories + Customer Feedback */}
          <div className="grid grid-cols-12 gap-4">
            {/* Top Customers by Lifetime Value */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Top Customers by Lifetime Value</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">Customer</th>
                    <th className="text-right pb-2 font-medium">Spend</th>
                    <th className="text-right pb-2 font-medium">CLV</th>
                    <th className="text-right pb-2 font-medium">Segment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {topCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 text-zinc-300">{c.name}</td>
                      <td className="py-2 text-right text-white">{c.spend}</td>
                      <td className="py-2 text-right text-emerald-400">{c.clv}</td>
                      <td className="py-2 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${segmentColor(c.segment)}`}>{c.segment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Purchased Categories */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Top Purchased Categories</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">Category</th>
                    <th className="text-right pb-2 font-medium">Customers</th>
                    <th className="text-right pb-2 font-medium">Revenue</th>
                    <th className="text-right pb-2 font-medium">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {topCategories.map((c, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 text-zinc-300">{c.name}</td>
                      <td className="py-2 text-right text-white">{c.customers.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right text-emerald-400">{c.revenue}</td>
                      <td className="py-2 text-right text-zinc-400">{c.orders.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customer Feedback Summary */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Customer Feedback Summary</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={feedback} totalValue="12,456" totalLabel="Total Feedback" size={100} />
                <div className="space-y-3 flex-1">
                  {feedback.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: f.color }} />
                        <span className="text-zinc-300">{f.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{f.value.toLocaleString("en-IN")}</div>
                        <div className="text-zinc-500">({f.pct}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-3 gap-2 text-[9px]">
                <div className="text-center">
                  <div className="text-zinc-500">Most active time</div>
                  <div className="text-white font-medium">7 PM – 10 PM</div>
                </div>
                <div className="text-center">
                  <div className="text-zinc-500">Most used device</div>
                  <div className="text-white font-medium">Mobile (78.6%)</div>
                </div>
                <div className="text-center">
                  <div className="text-zinc-500">Avg. session</div>
                  <div className="text-white font-medium">8m 34s</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Customer Segments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Customer Segments</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-1.5">
              {segments.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] py-1.5 border-b border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-zinc-300">{s.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{s.count}</div>
                    <div className="text-zinc-500">{s.pct}</div>
                  </div>
                </div>
              ))}
            </div>
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
                    <div className="text-[9px] text-zinc-500 truncate">{a.sub}</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Customer Alerts</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {customerAlerts.map((a, i) => (
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

        </div>
      </div>
    </div>
  );
}
