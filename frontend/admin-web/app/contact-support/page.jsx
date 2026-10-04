"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Components
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data = [], color = "#3b82f6", height = 24, strokeWidth = "1.5" }) {
  if (!data.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1), w = 80;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible mt-1 shrink-0" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ items, totalValue, totalLabel, size = 110, innerSize = "text-xl", strokeWidth = 14 }) {
  const total = items.reduce((s, i) => s + (i.value || 0), 0);
  const r = 44, cx = 60, cy = 60, circum = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
        {items.map((item, i) => {
          const pct = (item.value || 0) / total;
          const dash = `${pct * circum} ${circum}`;
          const offset = -(cum * circum);
          cum += pct;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={item.color} strokeWidth={strokeWidth} strokeDasharray={dash} strokeDashoffset={offset} className="transition-all duration-700" />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className={`${innerSize} font-bold text-white leading-tight`}>{totalValue}</div>
        <div className="text-[10px] text-zinc-400 text-center">{totalLabel}</div>
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
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      {series.map((s, i) => (
        <g key={i}>
          <polyline points={pts(s.data)} fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {s.data.map((v, j) => (
            <circle key={j} cx={(j / Math.max(s.data.length - 1, 1)) * w} cy={height - (v / max) * height} r="3" fill={s.color} />
          ))}
        </g>
      ))}
    </svg>
  );
}

function SingleLineChartWithDots({ data, color, height = 120 }) {
  const max = Math.max(...data, 1), w = 440;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, j) => (
        <circle key={j} cx={(j / Math.max(data.length - 1, 1)) * w} cy={height - (v / max) * height} r="4" fill={color} stroke="#0d0f1a" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function ProgressList({ items }) {
  const max = Math.max(...items.map(i => i.value));
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-[11px] text-zinc-300 w-32 text-right pr-2">{item.label}</div>
          <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, background: item.color }} />
          </div>
          <div className="text-[11px] text-zinc-400 w-24 flex justify-between">
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
  { icon: "confirmation_number", label: "Total Tickets (7D)", value: "1,842", sub: "↑ 18.7% vs last 7 days", up: true, color: "#8b5cf6", sp: [20, 22, 21, 23, 24, 25, 26] },
  { icon: "check_circle", label: "Open Tickets", value: "326", sub: "↑ 12.4% vs last 7 days", up: true, color: "#10b981", sp: [10, 11, 11, 12, 12, 13, 14] },
  { icon: "assignment_turned_in", label: "Resolved Tickets (7D)", value: "1,532", sub: "↑ 21.3% vs last 7 days", up: true, color: "#8b5cf6", sp: [15, 16, 15, 17, 18, 19, 21] },
  { icon: "timer", label: "Avg. First Response Time", value: "2h 18m", sub: "↓ 14.8% vs last 7 days", up: false, color: "#f59e0b", sp: [3, 2.8, 2.9, 2.5, 2.6, 2.4, 2.3] },
  { icon: "schedule", label: "Avg. Resolution Time", value: "1d 8h", sub: "↓ 9.6% vs last 7 days", up: false, color: "#10b981", sp: [1.8, 1.7, 1.6, 1.5, 1.5, 1.4, 1.3] },
  { icon: "star", label: "Customer Satisfaction", value: "4.6", suffix: "/ 5", sub: "↑ 6.2% vs last 7 days", up: true, color: "#ef4444", sp: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.6] },
];

const ticketsByStatus = [
  { label: "Open", value: 326, pct: "17.7%", color: "#3b82f6" },
  { label: "In Progress", value: 298, pct: "16.2%", color: "#f59e0b" },
  { label: "Pending", value: 184, pct: "10.0%", color: "#8b5cf6" },
  { label: "Resolved", value: 1532, pct: "83.2%", color: "#10b981" },
  { label: "Closed", value: 1102, pct: "59.7%", color: "#6b7280" },
]; // Intentionally mirroring the image's non-summing percentages for fidelity. To render correctly in donut, we map closed/resolved/etc to a flat pie.
const donutStatusItems = ticketsByStatus.map(s => ({ ...s, value: parseInt(s.pct) })); 

const ticketsByChannel = [
  { label: "Web Form", value: 824, pct: "44.7%", color: "#3b82f6" },
  { label: "Email", value: 562, pct: "30.5%", color: "#10b981" },
  { label: "Live Chat", value: 286, pct: "15.5%", color: "#f59e0b" },
  { label: "Phone", value: 110, pct: "6.0%", color: "#8b5cf6" },
  { label: "Social Media", value: 60, pct: "3.3%", color: "#ef4444" },
];

const ticketsTrendSeries = [
  { label: "Created", color: "#3b82f6", data: [420, 600, 580, 620, 580, 610, 680] },
  { label: "Resolved", color: "#10b981", data: [250, 310, 300, 380, 350, 390, 420] },
  { label: "Closed", color: "#8b5cf6", data: [100, 110, 120, 100, 110, 100, 120] },
];
const trendLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const recentTickets = [
  { id: "TK-98451", subject: "Payment not received", status: "In Progress", priority: "High", channel: "Web Form", createdOn: "May 27, 2025 10:24 AM", assignee: "Rohit Sharma", avatar: "https://i.pravatar.cc/100?img=11" },
  { id: "TK-98450", subject: "Unable to login", status: "Open", priority: "Medium", channel: "Email", createdOn: "May 27, 2025 09:15 AM", assignee: "Ananya Verma", avatar: "https://i.pravatar.cc/100?img=5" },
  { id: "TK-98449", subject: "Order not delivered", status: "Open", priority: "High", channel: "Live Chat", createdOn: "May 27, 2025 08:32 AM", assignee: "Vikram Das", avatar: "https://i.pravatar.cc/100?img=14" },
  { id: "TK-98448", subject: "Refund not initiated", status: "Resolved", priority: "Medium", channel: "Web Form", createdOn: "May 26, 2025 04:35 PM", assignee: "Neha Gupta", avatar: "https://i.pravatar.cc/100?img=9" },
  { id: "TK-98447", subject: "Wrong item received", status: "Resolved", priority: "Low", channel: "WhatsApp", createdOn: "May 26, 2025 11:20 AM", assignee: "Amit Kumar", avatar: "https://i.pravatar.cc/100?img=12" },
];

const topCategories = [
  { label: "Orders & Payments", value: 642, pct: "34.9%", color: "#3b82f6" },
  { label: "Account & Login", value: 412, pct: "22.4%", color: "#10b981" },
  { label: "Shipping & Delivery", value: 321, pct: "17.4%", color: "#f59e0b" },
  { label: "Refunds & Returns", value: 263, pct: "14.3%", color: "#8b5cf6" },
  { label: "Product Issues", value: 146, pct: "7.9%", color: "#ef4444" },
  { label: "Others", value: 58, pct: "3.1%", color: "#6b7280" },
];

const helpResources = [
  { icon: "menu_book", title: "Getting Started Guide", desc: "Learn how to use Katabazaar platform", color: "#10b981" },
  { icon: "support_agent", title: "Merchant Help Center", desc: "Guides and FAQs for merchants", color: "#3b82f6" },
  { icon: "integration_instructions", title: "API Documentation", desc: "Developer resources and API guides", color: "#8b5cf6" },
  { icon: "public", title: "System Status Page", desc: "Real-time system and service status", color: "#10b981" },
];

const contactSummary = [
  { label: "Total Conversations", value: "1,842", sub: "↑ 18.7%", up: true },
  { label: "Unique Customers", value: "1,256", sub: "↑ 16.1%", up: true },
  { label: "SLA Compliance", value: "98.4%", sub: "↑ 4.8%", up: true },
  { label: "Reopened Tickets", value: "112", sub: "↓ 7.3%", up: false },
];

const myRecentTickets = [
  { id: "TK-98451", title: "Payment not received", date: "May 27, 10:24 AM", status: "In Progress" },
  { id: "TK-98450", title: "Unable to login", date: "May 27, 09:15 AM", status: "Open" },
  { id: "TK-98449", title: "Order not delivered", date: "May 26, 04:35 PM", status: "Resolved" },
  { id: "TK-98448", title: "Refund not initiated", date: "May 26, 11:20 AM", status: "Resolved" },
];

const quickActions = [
  { icon: "add_circle", label: "Create Ticket", color: "#10b981" },
  { icon: "list_alt", label: "View Tickets", color: "#3b82f6" },
  { icon: "chat", label: "Chat Now", color: "#8b5cf6" },
  { icon: "menu_book", label: "Knowledge Base", color: "#3b82f6" },
  { icon: "public", label: "System Status", color: "#8b5cf6" },
  { icon: "report_problem", label: "Report an Issue", color: "#ef4444" },
  { icon: "campaign", label: "Feature Request", color: "#ef4444" },
  { icon: "feedback", label: "Feedback", color: "#10b981" },
  { icon: "person", label: "Contact Admin", color: "#f59e0b" },
];

function statusBadge(status) {
  if (status === "Resolved") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (status === "In Progress") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (status === "Open") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
}
function priorityBadge(priority) {
  if (priority === "High") return "text-red-400 border-red-400/30";
  if (priority === "Medium") return "text-amber-400 border-amber-400/30";
  if (priority === "Low") return "text-emerald-400 border-emerald-400/30";
  return "text-zinc-400 border-zinc-400/30";
}


// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactSupportDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Contact Support Dashboard
            <span className="material-symbols-outlined text-[18px] text-blue-400">headphones</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage support channels, raise tickets, track issues and communicate with our support team.</p>
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
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: `${k.color}15` }}>
                    <span className="material-symbols-outlined text-[14px]" style={{ color: k.color }}>{k.icon}</span>
                  </div>
                  <span className="text-[11px] text-zinc-300 font-medium leading-tight">{k.label}</span>
                </div>
                <div className="text-xl font-bold text-white mt-2 flex items-baseline gap-1">
                  {k.value}
                  {(k.suffix) && <span className="text-[14px] text-zinc-400 font-normal">{k.suffix}</span>}
                </div>
                <div className={`text-[10px] ${k.up ? "text-emerald-400" : "text-amber-400"}`}>
                  {k.sub}
                </div>
                <Spark data={k.sp} color={k.color} height={20} />
              </div>
            ))}
          </div>

          {/* Row 2: Status Donut + Trends Chart + Channel Donut */}
          <div className="grid grid-cols-12 gap-4">

            {/* Tickets by Status */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Tickets by Status</h3>
              <div className="flex flex-col items-center flex-1 justify-center gap-6 pt-2">
                <DonutChart items={donutStatusItems} totalValue="1,842" totalLabel="Total" size={140} innerSize="text-2xl" strokeWidth={18} />
                <div className="space-y-2.5 w-full">
                  {ticketsByStatus.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 w-24">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: s.color }} />
                        <span className="text-zinc-300">{s.label}</span>
                      </div>
                      <div className="flex gap-2 justify-between flex-1 pl-4">
                        <span className="text-white font-medium">{s.value}</span>
                        <span className="text-zinc-500">({s.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="#" className="text-[11px] text-blue-400 flex items-center gap-1 hover:text-blue-300">
                  View all tickets <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Tickets Trend */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Tickets Trend <span className="text-zinc-500 font-normal">(Last 7 Days)</span></h3>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-[10px] text-zinc-300 cursor-pointer">
                  Last 7 Days <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </div>
              </div>
              <div className="flex gap-6 mb-4 justify-center">
                {ticketsTrendSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className="w-4 h-0.5 inline-block" style={{ background: s.color }} />
                    <span className="text-zinc-200">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-1 min-h-[160px]">
                <div className="flex flex-col justify-between text-[10px] text-zinc-600 py-1">
                  <span>800</span><span>600</span><span>400</span><span>200</span><span>0</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={ticketsTrendSeries} labels={trendLabels} height={160} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 mt-2 px-2">
                {trendLabels.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* Tickets by Channel */}
            <div className="col-span-12 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Tickets by Channel</h3>
              <div className="flex flex-col items-center flex-1 justify-center gap-6 pt-2">
                <DonutChart items={ticketsByChannel} totalValue="1,842" totalLabel="Total" size={140} innerSize="text-2xl" strokeWidth={18} />
                <div className="space-y-2.5 w-full">
                  {ticketsByChannel.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 w-24">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: c.color }} />
                        <span className="text-zinc-300">{c.label}</span>
                      </div>
                      <div className="flex gap-2 justify-between flex-1 pl-4">
                        <span className="text-white font-medium">{c.value}</span>
                        <span className="text-zinc-500">({c.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="#" className="text-[11px] text-blue-400 flex items-center gap-1 hover:text-blue-300">
                  View channel report <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Row 3: Recent Tickets */}
          <div className="grid grid-cols-12 gap-4">

            {/* Recent Tickets Table */}
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Recent Tickets</h3>
                <Link href="#" className="text-[11px] text-blue-400">View all tickets</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800/60">
                      <th className="text-left pb-3 font-medium">Ticket ID</th>
                      <th className="text-left pb-3 font-medium">Subject</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-left pb-3 font-medium">Priority</th>
                      <th className="text-left pb-3 font-medium">Channel</th>
                      <th className="text-left pb-3 font-medium">Created On</th>
                      <th className="text-left pb-3 font-medium">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {recentTickets.map((t, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-3 text-zinc-300 font-mono text-[11px]">{t.id}</td>
                        <td className="py-3 text-zinc-200 pr-2">{t.subject}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-medium border ${statusBadge(t.status)}`}>{t.status}</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded border ${priorityBadge(t.priority)}`}>{t.priority}</span>
                        </td>
                        <td className="py-3 text-zinc-300">{t.channel}</td>
                        <td className="py-3 text-zinc-400 whitespace-nowrap">{t.createdOn}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Image src={t.avatar} alt={t.assignee} width={20} height={20} className="rounded-full" />
                            <span className="text-zinc-300 whitespace-nowrap">{t.assignee}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 3.5: Top Issue Categories + Customer Satisfaction Trend */}
          <div className="grid grid-cols-12 gap-4">

            {/* Top Issue Categories */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-bold text-white">Top Issue Categories</h3>
                <Link href="#" className="text-[11px] text-blue-400">View all</Link>
              </div>
              <div className="flex-1 pt-2">
                <ProgressList items={topCategories} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-6 px-1 border-t border-zinc-800/50 pt-2 pl-36">
                <span>0</span><span>200</span><span>400</span><span>600</span><span>800</span>
              </div>
            </div>

            {/* Customer Satisfaction Trend */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">Customer Satisfaction Trend</h3>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">4.6 <span className="text-[14px] text-zinc-400 font-normal">/ 5</span></div>
                  <div className="text-[11px] text-emerald-400">↑ 6.2%</div>
                </div>
              </div>
              <div className="flex gap-3 flex-1 min-h-[120px] mt-4">
                <div className="flex flex-col justify-between text-[10px] text-zinc-600 py-1">
                  <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
                </div>
                <div className="flex-1">
                  <SingleLineChartWithDots data={[4.1, 4.2, 4.4, 4.3, 4.2, 4.5, 4.6]} color="#3b82f6" height={140} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 mt-3 px-3">
                {trendLabels.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>

          {/* Row 4: Help Resources + Contact Summary */}
          <div className="grid grid-cols-12 gap-4">

            {/* Help Center Resources */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-5">Help Center Resources</h3>
              <div className="space-y-4 flex-1">
                {helpResources.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700/50" style={{ background: `${h.color}15` }}>
                      <span className="material-symbols-outlined text-[18px]" style={{ color: h.color }}>{h.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] text-zinc-200 font-medium leading-tight">{h.title}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{h.desc}</div>
                    </div>
                    <Link href="#" className="text-[11px] text-blue-400 flex items-center gap-0.5 shrink-0 hover:text-blue-300">
                      View <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="#" className="text-[11px] text-blue-400 flex items-center gap-1 hover:text-blue-300">
                  View all articles <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Contact Summary */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-6">Contact Summary <span className="text-zinc-500 font-normal">(7 Days)</span></h3>
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 flex-1 content-center">
                {contactSummary.map((c, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[11px] text-zinc-400 mb-2">{c.label}</span>
                    <span className="text-2xl font-bold text-white leading-none">{c.value}</span>
                    <span className={`text-[10px] mt-2 ${c.up ? "text-emerald-400" : "text-red-400"}`}>{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-[300px] border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-5 gap-6 shrink-0 overflow-y-auto">

          {/* Contact Support Hero */}
          <div>
            <h3 className="text-[16px] font-bold text-white mb-1">Contact Support</h3>
            <p className="text-[11px] text-zinc-400 mb-4">We're here to help you 24/7</p>
            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
              Create New Ticket
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-zinc-300">mail</span>
              </div>
              <div>
                <div className="text-[11px] text-zinc-300 font-medium">Email Support</div>
                <div className="text-[10px] text-zinc-500">support@katabazaar.com</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-zinc-300">chat</span>
              </div>
              <div>
                <div className="text-[11px] text-zinc-300 font-medium">Live Chat</div>
                <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available 24/7
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-zinc-300">call</span>
              </div>
              <div>
                <div className="text-[11px] text-zinc-300 font-medium">Phone Support</div>
                <div className="text-[10px] text-zinc-500">+91 1800 123 4567</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">forum</span>
              </div>
              <div>
                <div className="text-[11px] text-emerald-400 font-medium">WhatsApp Support</div>
                <div className="text-[10px] text-zinc-500">+91 98765 43210</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* My Recent Tickets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-white">My Recent Tickets</h3>
              <Link href="#" className="text-[10px] text-purple-400">View all</Link>
            </div>
            <div className="space-y-4">
              {myRecentTickets.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[12px] text-blue-400">confirmation_number</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-zinc-200 font-medium">{t.id}</span>
                      <span className={`px-1.5 py-0.5 rounded border text-[8px] font-medium ${statusBadge(t.status)}`}>{t.status}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">{t.title}</div>
                    <div className="text-[9px] text-zinc-500 mt-1">{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Support Hours */}
          <div>
            <h3 className="text-[13px] font-bold text-white mb-2">Support Hours</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">schedule</span>
              <span className="text-[12px] text-zinc-200">24/7 Support</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Our support team is available around the clock to assist you.
            </p>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Quick Actions */}
          <div>
            <h3 className="text-[13px] font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group aspect-square">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800/50" style={{ background: `${q.color}10` }}>
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
