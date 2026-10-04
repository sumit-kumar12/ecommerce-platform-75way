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
  const id = `spk-hc-${color.replace("#", "")}`;
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
          <linearGradient key={i} id={`mlhc-${i}`} x1="0" y1="0" x2="0" y2="1">
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
            <path d={area} fill={`url(#mlhc-${i})`} />
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

function ProgressList({ items }) {
  const max = Math.max(...items.map(i => i.value));
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-[10px] text-zinc-300 w-28 truncate">{item.label}</div>
          <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, background: item.color }} />
          </div>
          <div className="text-[10px] text-zinc-400 w-16 text-right">{item.displayValue}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "menu_book", label: "Total Articles", value: "256", sub: "+12.5% vs last 7 days", up: true, color: "#8b5cf6", sp: [220, 225, 230, 240, 245, 250, 256] },
  { icon: "check_circle", label: "Published Articles", value: "198", sub: "77.3% of total", up: true, color: "#10b981", sp: [180, 185, 188, 190, 192, 195, 198] },
  { icon: "confirmation_number", label: "Total Tickets (7D)", value: "1,842", sub: "+18.7% vs last 7 days", up: true, color: "#3b82f6", sp: [1500, 1550, 1600, 1650, 1720, 1780, 1842] },
  { icon: "task_alt", label: "Tickets Resolved (7D)", value: "1,532", sub: "83.2% resolution rate", up: true, color: "#10b981", sp: [1200, 1250, 1300, 1380, 1420, 1480, 1532] },
  { icon: "schedule", label: "Avg. Response Time", value: "2h 18m", sub: "-14.8% vs last 7 days", up: false, color: "#f59e0b", sp: [160, 155, 150, 145, 142, 140, 138] },
  { icon: "star", label: "Customer Satisfaction", value: "4.6 / 5", sub: "+6.2% vs last 7 days", up: true, color: "#ef4444", sp: [4.2, 4.3, 4.4, 4.4, 4.5, 4.5, 4.6] },
];

const ticketsOverview = [
  { label: "Open", value: 256, pct: "13.9%", color: "#3b82f6" },
  { label: "In Progress", value: 312, pct: "16.9%", color: "#f59e0b" },
  { label: "Pending", value: 124, pct: "6.7%", color: "#8b5cf6" },
  { label: "Resolved", value: 1532, pct: "83.2%", color: "#10b981" },
  { label: "Closed", value: 398, pct: "21.6%", color: "#6b7280" },
];

const ticketsTrendSeries = [
  { label: "Created", color: "#3b82f6", data: [400, 500, 550, 450, 520, 480, 580] },
  { label: "Resolved", color: "#10b981", data: [350, 400, 420, 380, 450, 420, 480] },
  { label: "Closed", color: "#8b5cf6", data: [150, 180, 200, 160, 220, 180, 250] },
];
const ticketsTrendLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const popularTopics = [
  { label: "Orders & Payments", value: 596, pct: "32.4%", color: "#3b82f6" },
  { label: "Shipping & Delivery", value: 345, pct: "18.7%", color: "#10b981" },
  { label: "Account & Login", value: 287, pct: "15.6%", color: "#f59e0b" },
  { label: "Refunds & Returns", value: 236, pct: "12.8%", color: "#8b5cf6" },
  { label: "Product & Services", value: 193, pct: "10.5%", color: "#ef4444" },
];

const recentTickets = [
  { id: "TK-98451", subject: "Refund not received", customer: "Rohan Sharma", status: "Open", priority: "High", on: "May 27, 2025 10:24 AM", assignee: "Support Agent" },
  { id: "TK-98450", subject: "Unable to login", customer: "Priya Verma", status: "In Progress", priority: "Medium", on: "May 27, 2025 09:48 AM", assignee: "Ankit Kumar" },
  { id: "TK-98449", subject: "Order not delivered", customer: "Amit Singh", status: "Open", priority: "High", on: "May 27, 2025 09:32 AM", assignee: "Support Agent" },
  { id: "TK-98448", subject: "Payment failed", customer: "Neha Gupta", status: "Pending", priority: "Medium", on: "May 27, 2025 09:15 AM", assignee: "Riya Patel" },
  { id: "TK-98447", subject: "Wrong item received", customer: "Vikram Das", status: "Resolved", priority: "Low", on: "May 27, 2025 08:41 AM", assignee: "Ankit Kumar" },
];

const mostViewedArticles = [
  { title: "How to return an item", cat: "Orders & Payments", views: "8,425", helpful: 96 },
  { title: "Refund policy explained", cat: "Orders & Payments", views: "7,814", helpful: 94 },
  { title: "Track your order", cat: "Shipping & Delivery", views: "6,214", helpful: 92 },
  { title: "How to change password", cat: "Account & Login", views: "5,632", helpful: 95 },
  { title: "Payment methods accepted", cat: "Orders & Payments", views: "4,981", helpful: 93 },
];

const kbOverview = [
  { label: "Getting Started", value: 24, displayValue: "24 Articles", color: "#8b5cf6" },
  { label: "Orders & Payments", value: 62, displayValue: "62 Articles", color: "#8b5cf6" },
  { label: "Shipping & Delivery", value: 44, displayValue: "44 Articles", color: "#8b5cf6" },
  { label: "Returns & Refunds", value: 34, displayValue: "34 Articles", color: "#8b5cf6" },
  { label: "Account & Profile", value: 40, displayValue: "40 Articles", color: "#8b5cf6" },
  { label: "Policies & Terms", value: 28, displayValue: "28 Articles", color: "#8b5cf6" },
];

const articlePerfSeries = [
  { label: "Views", color: "#3b82f6", data: [4000, 5000, 5500, 4800, 6000, 5200, 6500] },
  { label: "Unique Views", color: "#10b981", data: [2500, 3000, 3200, 2900, 3500, 3100, 3800] },
];

const articleHealth = [
  { label: "Published", value: 198, pct: "77.3%", color: "#10b981" },
  { label: "Draft", value: 32, pct: "12.5%", color: "#3b82f6" },
  { label: "Needs Update", value: 18, pct: "7.0%", color: "#f59e0b" },
  { label: "Archived", value: 8, pct: "3.2%", color: "#6b7280" },
];

const quickActions = [
  { icon: "post_add", label: "Create Article", color: "#8b5cf6" },
  { icon: "create_new_folder", label: "Create Category", color: "#8b5cf6" },
  { icon: "upload_file", label: "Upload Guide", color: "#10b981" },
  { icon: "confirmation_number", label: "View Tickets", color: "#8b5cf6" },
  { icon: "menu_book", label: "Knowledge Base", color: "#3b82f6" },
  { icon: "contact_support", label: "FAQ Manager", color: "#f59e0b" },
  { icon: "bar_chart", label: "Article Analytics", color: "#ef4444" },
  { icon: "settings", label: "Ticket Settings", color: "#8b5cf6" },
  { icon: "download", label: "Export Reports", color: "#10b981" },
];

const helpCenterStatus = [
  { label: "Knowledge Base", status: "Operational", color: "#10b981" },
  { label: "Ticket System", status: "Operational", color: "#10b981" },
  { label: "Live Chat", status: "Operational", color: "#10b981" },
  { label: "Email Support", status: "Operational", color: "#10b981" },
];

function statusBadge(status) {
  if (status === "Open") return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  if (status === "In Progress") return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  if (status === "Pending") return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
  if (status === "Resolved") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
}

function priorityBadge(priority) {
  if (priority === "High") return "bg-red-500/20 text-red-400 border border-red-500/30";
  if (priority === "Medium") return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  if (priority === "Low") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function HelpCenterDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Help Center Dashboard
            <span className="material-symbols-outlined text-[18px] text-purple-400">help</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage knowledge base, FAQs, tickets, articles and customer support resources.</p>
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
            <span className="material-symbols-outlined text-[14px]">menu_book</span> Documentation
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

          {/* Row 2: Tickets Overview Donut + Trend Line + Popular Topics Donut */}
          <div className="grid grid-cols-12 gap-4">

            {/* Tickets Overview Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Tickets Overview</h3>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={ticketsOverview} totalValue="1,842" totalLabel="Total" size={120} />
                <div className="space-y-1.5 flex-1">
                  {ticketsOverview.map((r, i) => (
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
              <div className="mt-4 flex justify-center">
                <Link href="#" className="text-[10px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all tickets <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Tickets Trend Line */}
            <div className="col-span-12 lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Tickets Trend <span className="text-zinc-500 font-normal">(Last 7 Days)</span></h3>
              </div>
              <div className="flex gap-3 mb-2 justify-center">
                {ticketsTrendSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[9px]">
                    <span className="w-3 h-0.5 inline-block" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-1 min-h-[100px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>800</span><span>600</span><span>400</span><span>200</span><span>0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={ticketsTrendSeries} labels={ticketsTrendLabels} height={110} />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
                {ticketsTrendLabels.map(l => <span key={l}>{l.replace("May ", "")}</span>)}
              </div>
            </div>
          </div>

          {/* Row 2.5: Popular Topics & Customer Satisfaction */}
          <div className="grid grid-cols-12 gap-4">
            {/* Popular Topics Donut */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Popular Topics <span className="text-zinc-500 font-normal">(Top 5)</span></h3>
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all topics <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
              <div className="flex items-center gap-8 w-full justify-center py-2">
                <DonutChart items={popularTopics} totalValue="1,842" totalLabel="Total" size={160} innerSize="text-2xl" />
                <div className="space-y-3 flex-1 max-w-[200px]">
                  {popularTopics.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-[3px]" style={{ background: f.color }} />
                        <span className="text-zinc-300">{f.label}</span>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <span className="text-white font-medium">{f.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expanded Customer Satisfaction Trend */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-white">Customer Satisfaction Trend</h3>
                <Link href="#" className="text-[11px] text-purple-400">View report</Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-white">4.6</span>
                <span className="text-[14px] text-zinc-400 mt-2">/ 5</span>
                <span className="text-[12px] text-emerald-400 ml-3 mt-1">↑ 6.2% <span className="text-zinc-500">vs last 7 days</span></span>
                <div className="flex gap-1 ml-auto">
                  {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-[20px] text-amber-400">star</span>)}
                  <span className="material-symbols-outlined text-[20px] text-zinc-600">star_border</span>
                </div>
              </div>
              <div className="flex gap-3 flex-1 min-h-[140px]">
                <div className="flex flex-col justify-between text-[10px] text-zinc-600 py-1">
                  <span>5.0</span><span>4.5</span><span>4.0</span><span>3.5</span><span>3.0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={[{ color: "#8b5cf6", data: [4.1, 4.2, 4.4, 4.3, 4.5, 4.6, 4.6] }]} labels={ticketsTrendLabels} height={140} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 mt-2 px-2">
                {ticketsTrendLabels.map(l => <span key={l}>{l.replace("May ", "")}</span>)}
              </div>
            </div>
          </div>

          {/* Row 3: Recent Tickets + Most Viewed Articles */}
          <div className="grid grid-cols-12 gap-4">

            {/* Recent Tickets */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Recent Tickets</h3>
                <Link href="#" className="text-[11px] text-purple-400">View all tickets</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">Ticket ID</th>
                      <th className="text-left pb-3 font-medium">Subject</th>
                      <th className="text-left pb-3 font-medium">Customer</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-left pb-3 font-medium">Priority</th>
                      <th className="text-left pb-3 font-medium">Created On</th>
                      <th className="text-left pb-3 font-medium">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {recentTickets.map((t, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-400 font-mono text-[11px]">{t.id}</td>
                        <td className="py-3 text-zinc-200">{t.subject}</td>
                        <td className="py-3 text-zinc-300">{t.customer}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-medium ${statusBadge(t.status)}`}>{t.status}</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-medium ${priorityBadge(t.priority)}`}>{t.priority}</span>
                        </td>
                        <td className="py-3 text-zinc-400 whitespace-nowrap text-[11px]">{t.on}</td>
                        <td className="py-3 text-zinc-300">{t.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 3.5: Most Viewed Articles */}
          <div className="grid grid-cols-12 gap-4">

            {/* Most Viewed Articles */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Most Viewed Articles</h3>
                <Link href="#" className="text-[11px] text-purple-400">View all articles</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">Article Title</th>
                      <th className="text-left pb-3 font-medium">Category</th>
                      <th className="text-center pb-3 font-medium">Views</th>
                      <th className="text-left pb-3 font-medium pl-4">Helpful %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {mostViewedArticles.map((a, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-200 pr-2">{a.title}</td>
                        <td className="py-3 text-zinc-400">{a.cat}</td>
                        <td className="py-3 text-center font-medium text-white">{a.views}</td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3 max-w-[200px]">
                            <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${a.helpful}%` }} />
                            </div>
                            <span className="text-[11px] text-emerald-400 font-bold w-8">{a.helpful}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 4: KB Overview + Article Performance */}
          <div className="grid grid-cols-12 gap-4">

            {/* Knowledge Base Overview */}
            <div className="col-span-12 lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-4">Knowledge Base Overview</h3>
              <div className="flex-1 pt-2">
                <ProgressList items={kbOverview} />
              </div>
            </div>

            {/* Article Performance */}
            <div className="col-span-12 lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[13px] font-bold text-white mb-3">Article Performance <span className="text-zinc-500 font-normal">(7 Days)</span></h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div>
                  <div className="text-[9px] text-zinc-400">Total Views</div>
                  <div className="text-lg font-bold text-white leading-tight">52,483</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">↑ 16.4%</div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-400">Unique Views</div>
                  <div className="text-lg font-bold text-white leading-tight">31,245</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">↑ 14.2%</div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-400">Helpful Votes</div>
                  <div className="text-lg font-bold text-white leading-tight">8,924</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">↑ 18.7%</div>
                </div>
                <div>
                  <div className="text-[9px] text-zinc-400">Unhelpful Votes</div>
                  <div className="text-lg font-bold text-white leading-tight">354</div>
                  <div className="text-[9px] text-red-400 mt-0.5">↓ 5.2%</div>
                </div>
              </div>
              <div className="flex gap-2 flex-1 min-h-[90px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>10K</span><span>8K</span><span>6K</span><span>4K</span><span>2K</span><span>0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={articlePerfSeries} labels={ticketsTrendLabels} height={100} />
                </div>
              </div>
              <div className="flex gap-4 justify-center mt-2">
                {articlePerfSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[9px]">
                    <span className="w-3 h-0.5 inline-block" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Search Analytics */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-3">Search Analytics <span className="text-zinc-500 font-normal">(7D)</span></h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-purple-400">search</span>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">Total Searches</div>
                  <div className="text-lg font-bold text-white leading-tight mt-0.5">4,825</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">↑ 22.6% <span className="text-zinc-500">vs last 7 days</span></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-purple-400">do_not_disturb_alt</span>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">No Result Searches</div>
                  <div className="text-lg font-bold text-white leading-tight mt-0.5">568</div>
                  <div className="text-[9px] text-zinc-400 mt-0.5">11.8% of total searches</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-purple-400">find_in_page</span>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">Top Search Term</div>
                  <div className="text-[12px] font-bold text-white leading-tight mt-1">"refund policy"</div>
                  <div className="text-[9px] text-zinc-400 mt-0.5">356 searches</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Article Health */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-3">Article Health</h3>
            <div className="flex items-center gap-3">
              <DonutChart items={articleHealth} totalValue="256" totalLabel="Total" size={80} innerSize="text-sm" />
              <div className="space-y-1.5 flex-1">
                {articleHealth.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-[2px]" style={{ background: h.color }} />
                      <span className="text-zinc-300">{h.label}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-white font-medium">{h.value}</span>
                      <span className="text-zinc-500">({h.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="#" className="text-[10px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                Manage articles <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Quick Actions */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-3">Quick Actions</h3>
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

          <div className="h-px bg-zinc-800" />

          {/* Help Center Status */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-3">Help Center Status</h3>
            <div className="space-y-2">
              {helpCenterStatus.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-300">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-zinc-400">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
