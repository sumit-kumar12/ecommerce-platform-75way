"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Spark({ data = [], color = "#3b82f6" }) {
  if (!data.length) return <div className="h-6 w-16 shrink-0" />;
  const max = Math.max(...data, 1), w = 64, h = 24;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible opacity-80 mt-1 shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MultiLineChart({ datasets = [] }) {
  if (!datasets.length) return null;
  const allValues = datasets.flatMap(d => d.data);
  const max = Math.max(...allValues, 100);
  const w = 400, h = 140;
  
  return (
    <div className="w-full h-full relative mt-4">
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-zinc-800/60 pb-5 pl-8 text-[9px] text-zinc-500">
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">80K</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">60K</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">40K</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">20K</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">0</div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between transform translate-y-full pt-1.5">
          <span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span><span>May 25</span><span>May 26</span><span>May 27</span>
        </div>
      </div>
      
      <div className="absolute inset-0 ml-8 mb-5">
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
          {datasets.map((ds, i) => {
            const pts = ds.data.map((v, j) => `${(j / Math.max(ds.data.length - 1, 1)) * w},${h - (v / max) * h}`);
            return (
              <g key={i}>
                <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={ds.color} fillOpacity="0.1" />
                <polyline points={pts.join(" ")} fill="none" stroke={ds.color} strokeWidth="1.5" />
                {pts.map((pt, j) => (
                  <circle key={j} cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="2" fill={ds.color} />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function SimpleLineChart({ data = [], color = "#10b981" }) {
  if (!data.length) return null;
  const max = Math.max(...data, 100);
  const w = 400, h = 80;
  
  return (
    <div className="w-full h-full relative mt-4">
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-zinc-800/60 pb-5 pl-6 text-[8px] text-zinc-500">
        <div className="flex items-center -ml-6 w-6 justify-end pr-1.5 -mt-1.5">20K</div>
        <div className="flex items-center -ml-6 w-6 justify-end pr-1.5 -mt-1.5">15K</div>
        <div className="flex items-center -ml-6 w-6 justify-end pr-1.5 -mt-1.5">10K</div>
        <div className="flex items-center -ml-6 w-6 justify-end pr-1.5 -mt-1.5">5K</div>
        <div className="flex items-center -ml-6 w-6 justify-end pr-1.5 -mt-1.5">0</div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-6 right-0 flex justify-between transform translate-y-full pt-1.5">
          <span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span><span>May 25</span><span>May 26</span><span>May 27</span>
        </div>
      </div>
      
      <div className="absolute inset-0 ml-6 mb-5">
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
          {(() => {
            const pts = data.map((v, j) => `${(j / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`);
            return (
              <g>
                <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={color} fillOpacity="0.1" />
                <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" />
                {pts.map((pt, j) => (
                  <circle key={j} cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="2" fill={color} />
                ))}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

function DonutChart({ items, totalLabel, totalValue, size = 44, r = 16, strokeWidth = 4, thick = false }) {
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

export default function CommunicationDashboard() {
  const topKPIs = [
    { icon: "send", label: "Total Messages Sent", value: "1,248,756", sub: "+18.6% vs last 7 days", isRed: false, spark: [50,55,60,65,70,80,95], color: "#3b82f6", bg: "bg-blue-500/20" },
    { icon: "mark_email_read", label: "Delivery Rate", value: "99.62%", sub: "+0.7% vs last 7 days", isRed: false, spark: [99.1,99.2,99.3,99.4,99.5,99.6,99.62], color: "#10b981", bg: "bg-emerald-500/20" },
    { icon: "drafts", label: "Open Rate (Email)", value: "42.81%", sub: "+6.3% vs last 7 days", isRed: false, spark: [36,37,38,39,40,41,42.8], color: "#a855f7", bg: "bg-purple-500/20" },
    { icon: "touch_app", label: "Click Rate (Email)", value: "12.35%", sub: "+3.1% vs last 7 days", isRed: false, spark: [9,10,10.5,11,11.5,12,12.35], color: "#f59e0b", bg: "bg-orange-500/20" },
    { icon: "cancel", label: "Failed Messages", value: "4,812", sub: "-8.2% vs last 7 days", isRed: true, spark: [6000,5800,5500,5200,5000,4900,4812], color: "#ef4444", bg: "bg-red-500/20" },
    { icon: "person_off", label: "Unsubscribes", value: "312", sub: "+5.4% vs last 7 days", isRed: true, spark: [250,260,270,280,290,300,312], color: "#f59e0b", bg: "bg-orange-500/20" },
    { icon: "currency_rupee", label: "SMS Cost (₹)", value: "₹48,756", sub: "-12.4% vs last 7 days", isRed: false, spark: [55000,54000,53000,52000,50000,49000,48756], color: "#3b82f6", bg: "bg-blue-500/20" },
  ];

  const channelDist = [
    { label: "Email", value: 733489, pct: "58.7%", color: "#3b82f6" },
    { label: "SMS", value: 280120, pct: "22.4%", color: "#f59e0b" },
    { label: "WhatsApp", value: 159671, pct: "12.8%", color: "#10b981" },
    { label: "Push Notification", value: 52634, pct: "4.2%", color: "#f43f5e" },
    { label: "In-App", value: 22842, pct: "1.9%", color: "#8b5cf6" },
  ];

  const deliveryStatus = [
    { label: "Delivered", value: 1242568, pct: "99.62%", color: "#10b981" },
    { label: "Failed", value: 3496, pct: "0.28%", color: "#ef4444" },
    { label: "Pending", value: 1248, pct: "0.10%", color: "#f59e0b" },
  ];

  const topTemplates = [
    { name: "Order Confirmation", sent: "125,489", open: "48.21%", click: "14.32%" },
    { name: "Password Reset", sent: "98,124", open: "52.18%", click: "11.21%" },
    { name: "Welcome Email", sent: "75,642", open: "60.33%", click: "18.65%" },
    { name: "Invoice Generated", sent: "63,221", open: "41.22%", click: "10.14%" },
    { name: "Shipping Update", sent: "58,412", open: "45.18%", click: "12.01%" },
  ];

  const recentLogs = [
    { time: "May 27, 10:42 AM", channel: "Email", type: "Order Confirmation", recipient: "john.doe@example.com", status: "Delivered", delTime: "1.42 sec", id: "msg_3f8a7b2c91", cBg: "bg-blue-500/20", cTc: "text-blue-400", sTc: "text-emerald-500" },
    { time: "May 27, 10:41 AM", channel: "SMS", type: "OTP Verification", recipient: "+91 98765 43210", status: "Delivered", delTime: "2.12 sec", id: "sms_2a7b8c3d92", cBg: "bg-emerald-500/20", cTc: "text-emerald-400", sTc: "text-emerald-500" },
    { time: "May 27, 10:41 AM", channel: "WhatsApp", type: "Order Update", recipient: "+91 91234 56789", status: "Delivered", delTime: "3.05 sec", id: "wa_7b8c9d4e12", cBg: "bg-emerald-500/20", cTc: "text-emerald-400", sTc: "text-emerald-500" },
    { time: "May 27, 10:40 AM", channel: "Push", type: "New Feature", recipient: "User Segment: All", status: "Delivered", delTime: "0.98 sec", id: "push_1c2d3e4f56", cBg: "bg-orange-500/20", cTc: "text-orange-400", sTc: "text-emerald-500" },
    { time: "May 27, 10:39 AM", channel: "In-App", type: "Wallet Credit", recipient: "user_id_12345", status: "Delivered", delTime: "0.58 sec", id: "inapp_9f8e7c6c5b", cBg: "bg-purple-500/20", cTc: "text-purple-400", sTc: "text-emerald-500" },
    { time: "May 27, 10:38 AM", channel: "Email", type: "Invoice Generated", recipient: "billing@example.com", status: "Failed", delTime: "—", id: "msg_6d5c4b3a12", cBg: "bg-blue-500/20", cTc: "text-blue-400", sTc: "text-red-500" },
  ];

  const queue = [
    { ch: "Email", queued: "1,124", prog: "256", sched: "3,452", failed: "12", cBg: "bg-blue-500/20", cTc: "text-blue-400" },
    { ch: "SMS", queued: "842", prog: "91", sched: "1,024", failed: "8", cBg: "bg-emerald-500/20", cTc: "text-emerald-400" },
    { ch: "WhatsApp", queued: "512", prog: "63", sched: "892", failed: "6", cBg: "bg-emerald-500/20", cTc: "text-emerald-400" },
    { ch: "Push", queued: "234", prog: "18", sched: "356", failed: "0", cBg: "bg-orange-500/20", cTc: "text-orange-400" },
    { ch: "In-App", queued: "156", prog: "11", sched: "128", failed: "0", cBg: "bg-purple-500/20", cTc: "text-purple-400" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans overflow-x-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Communication Dashboard <span className="material-symbols-outlined text-[20px] text-purple-400">forum</span>
          </h1>
          <p className="text-[11px] text-zinc-400 mt-1">Monitor and manage all platform communications across channels and templates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            May 21 - May 27, 2026
            <span className="material-symbols-outlined text-[14px] ml-1">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 p-6 space-y-4 lg:min-w-0">
            
            {/* Top KPIs */}
            <div className="flex flex-wrap gap-3">
              {topKPIs.map((kpi, i) => (
                <div key={i} className="flex-1 min-w-[200px] xl:min-w-[140px] bg-zinc-900/40 border border-zinc-800 rounded p-3 flex flex-col gap-1">
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

            {/* Dynamic Content Grid */}
            <div className="flex flex-wrap gap-4">
              
              {/* Messages by Channel */}
              <div className="flex-1 min-w-[300px] xl:min-w-[400px] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Messages by Channel</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-4 flex-1">
                  <DonutChart items={channelDist} totalValue="1.25M" totalLabel="Total" size={44} r={16} strokeWidth={6} />
                  <div className="flex-1 space-y-2 w-full mt-2 xl:mt-0">
                    {channelDist.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white">{item.pct}</span>
                          <span className="text-zinc-500">({item.value.toLocaleString()})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="flex-1 min-w-[300px] xl:min-w-[400px] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Delivery Status</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-4 flex-1">
                  <DonutChart items={deliveryStatus} totalValue="99.62%" totalLabel="Delivered" size={48} r={18} strokeWidth={8} />
                  <div className="flex-1 space-y-3 w-full mt-2 xl:mt-0">
                    {deliveryStatus.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-[2px]" style={{backgroundColor: item.color}}></span>
                          <span className="text-zinc-300">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white">{item.pct}</span>
                          <span className="text-zinc-500">({item.value.toLocaleString()})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages Over Time */}
              <div className="flex-[2] min-w-[100%] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Messages Over Time</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 text-[9px] text-zinc-400 mr-4">
                      {channelDist.map((c, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-[2px]" style={{backgroundColor: c.color}}></span>
                          {c.label}
                        </div>
                      ))}
                    </div>
                    <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-white">
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 relative min-h-0">
                  <MultiLineChart datasets={[
                    { color: "#3b82f6", data: [40000, 42000, 41000, 45000, 48000, 49000, 52000] }, // Email
                    { color: "#f59e0b", data: [20000, 21000, 20500, 22000, 23000, 22500, 24000] }, // SMS
                    { color: "#10b981", data: [15000, 16000, 15500, 17000, 18000, 17500, 19000] }, // WA
                    { color: "#f43f5e", data: [5000, 6000, 5500, 6500, 7000, 6800, 7500] }, // Push
                    { color: "#8b5cf6", data: [2000, 2500, 2300, 2800, 3000, 2900, 3200] }, // In-App
                  ]} />
                </div>
              </div>

              {/* SMS & WhatsApp Performance Row */}
              <div className="w-full flex flex-col xl:flex-row gap-4">
                {/* SMS Performance */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-h-[220px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-bold text-white">SMS Performance</h3>
                    <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Sent</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">280,120</span>
                      <span className="text-[9px] text-emerald-500 mt-0.5 flex items-center"><span className="material-symbols-outlined text-[10px] mr-0.5">arrow_upward</span> 15.2%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Delivered</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">278,455</span>
                      <span className="text-[9px] text-emerald-500 mt-0.5">99.41%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Failed</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">1,665</span>
                      <span className="text-[9px] text-red-500 mt-0.5">0.59%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Delivery Time (Avg)</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">2.34 sec</span>
                      <span className="text-[9px] text-emerald-500 mt-0.5 flex items-center"><span className="material-symbols-outlined text-[10px] mr-0.5">arrow_downward</span> -0.18</span>
                    </div>
                  </div>
                  <div className="flex-1 relative min-h-0">
                    <SimpleLineChart data={[10000, 11000, 10500, 12000, 13000, 12500, 14000]} color="#10b981" />
                  </div>
                </div>

                {/* WhatsApp Performance */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-h-[220px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-bold text-white">WhatsApp Performance</h3>
                    <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Sent</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">159,671</span>
                      <span className="text-[9px] text-emerald-500 mt-0.5 flex items-center"><span className="material-symbols-outlined text-[10px] mr-0.5">arrow_upward</span> 12.8%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Delivered</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">158,932</span>
                      <span className="text-[9px] text-emerald-500 mt-0.5">99.54%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Failed</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">739</span>
                      <span className="text-[9px] text-red-500 mt-0.5">0.46%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Read Rate</span>
                      <span className="text-[15px] font-bold text-white mt-0.5">68.21%</span>
                      <span className="text-[9px] text-emerald-500 mt-0.5 flex items-center"><span className="material-symbols-outlined text-[10px] mr-0.5">arrow_upward</span> 4.2%</span>
                    </div>
                  </div>
                  <div className="flex-1 relative min-h-0">
                    <SimpleLineChart data={[6000, 6200, 6100, 6500, 6800, 6700, 7000]} color="#8b5cf6" />
                  </div>
                </div>
              </div>

              {/* Top Email Templates & Notification Queue Row */}
              <div className="w-full flex flex-col xl:flex-row gap-4">
                {/* Top Email Templates */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-bold text-white">Top Email Templates</h3>
                    <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-800/60">
                          <th className="pb-2 font-medium">Template</th>
                          <th className="pb-2 font-medium">Sent</th>
                          <th className="pb-2 font-medium text-center">Open Rate</th>
                          <th className="pb-2 font-medium text-right">Click Rate</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-300">
                        {topTemplates.map((t, i) => (
                          <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                            <td className="py-2.5 truncate max-w-[120px]">{t.name}</td>
                            <td className="py-2.5 text-zinc-400">{t.sent}</td>
                            <td className="py-2.5 text-center text-white">{t.open}</td>
                            <td className="py-2.5 text-right text-white">{t.click}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notification Queue */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-bold text-white">Notification Queue</h3>
                    <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-[11px] whitespace-nowrap">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-800/60">
                          <th className="pb-2 font-medium">Channel</th>
                          <th className="pb-2 font-medium text-center">Queued</th>
                          <th className="pb-2 font-medium text-center">In Progress</th>
                          <th className="pb-2 font-medium text-center">Scheduled</th>
                          <th className="pb-2 font-medium text-right">Failed</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-300">
                        {queue.map((q, i) => (
                          <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${q.cBg} ${q.cTc}`}>
                                {q.ch}
                              </span>
                            </td>
                            <td className="py-2.5 text-center">{q.queued}</td>
                            <td className="py-2.5 text-center text-zinc-400">{q.prog}</td>
                            <td className="py-2.5 text-center text-zinc-400">{q.sched}</td>
                            <td className={`py-2.5 text-right font-medium ${q.failed !== '0' ? 'text-red-500' : 'text-zinc-500'}`}>{q.failed}</td>
                          </tr>
                        ))}
                        <tr className="font-bold text-white bg-zinc-900/30">
                          <td className="py-3">Total</td>
                          <td className="py-3 text-center">2,868</td>
                          <td className="py-3 text-center">439</td>
                          <td className="py-3 text-center">5,852</td>
                          <td className="py-3 text-right">26</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Recent Message Logs */}
              <div className="flex-[2] min-w-[100%] bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Recent Message Logs</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800/60">
                        <th className="pb-2 font-medium">Time</th>
                        <th className="pb-2 font-medium">Channel</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Recipient</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Delivery Time</th>
                        <th className="pb-2 font-medium text-right">Message ID</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {recentLogs.map((l, i) => (
                        <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                          <td className="py-2.5 text-zinc-500">{l.time}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${l.cBg} ${l.cTc}`}>
                              {l.channel}
                            </span>
                          </td>
                          <td className="py-2.5">{l.type}</td>
                          <td className="py-2.5 text-zinc-400">{l.recipient}</td>
                          <td className={`py-2.5 font-medium ${l.sTc}`}>
                            {l.status === 'Failed' ? <span className="bg-red-500 px-1.5 py-0.5 text-white rounded text-[9px]">Failed</span> : l.status}
                          </td>
                          <td className="py-2.5 text-zinc-400">{l.delTime}</td>
                          <td className="py-2.5 text-right font-mono text-[9px] text-zinc-500">{l.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Panel (Sidebar) ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-[320px] border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-6 shrink-0 lg:flex-none">
            
            {/* Channel Health */}
            <div>
              <h3 className="text-[12px] font-bold text-white mb-4">Channel Health</h3>
              <div className="space-y-4">
                {[
                  { name: "Email Service", provider: "Amazon SES", status: "Healthy", sc: "text-emerald-500", icon: "mail" },
                  { name: "SMS Service", provider: "Twilio", status: "Healthy", sc: "text-emerald-500", icon: "sms" },
                  { name: "WhatsApp Service", provider: "Meta Cloud API", status: "Healthy", sc: "text-emerald-500", icon: "chat" },
                  { name: "Push Service", provider: "Firebase", status: "Healthy", sc: "text-emerald-500", icon: "notifications" },
                  { name: "In-App Service", provider: "System", status: "Healthy", sc: "text-emerald-500", icon: "app_shortcut" },
                ].map((c, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-7 h-7 rounded-full bg-zinc-800/80 flex items-center justify-center shrink-0 border border-zinc-700/50">
                      <span className="material-symbols-outlined text-[14px] text-blue-400">{c.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-zinc-200">{c.name}</div>
                      <div className="text-[9px] text-zinc-500">{c.provider}</div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[9px] ${c.sc}`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500`}></span>
                      {c.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Campaigns */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Recent Campaigns</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Summer Sale Offer", type: "Email Campaign", status: "Sent", sc: "bg-emerald-500/20 text-emerald-400", time: "2h ago", icon: "campaign" },
                  { name: "New Feature Release", type: "Push Notification", status: "Sent", sc: "bg-emerald-500/20 text-emerald-400", time: "5h ago", icon: "rocket_launch" },
                  { name: "Order Confirmation", type: "SMS Campaign", status: "Sent", sc: "bg-emerald-500/20 text-emerald-400", time: "1d ago", icon: "receipt" },
                  { name: "WhatsApp Order Update", type: "WhatsApp Campaign", status: "Sent", sc: "bg-emerald-500/20 text-emerald-400", time: "1d ago", icon: "mark_chat_read" },
                  { name: "Weekend Discount", type: "Email Campaign", status: "Draft", sc: "bg-zinc-500/20 text-zinc-400", time: "2d ago", icon: "edit_note" },
                ].map((c, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="mt-0.5 shrink-0 text-zinc-400">
                      <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-zinc-200 truncate">{c.name}</div>
                      <div className="text-[9px] text-zinc-500">{c.type}</div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${c.sc}`}>{c.status}</span>
                      <span className="text-[9px] text-zinc-600">{c.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-[12px] font-bold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-blue-400">mail</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Create Email<br/>Campaign</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">sms</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Send<br/>SMS</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-emerald-500">chat</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Send<br/>WhatsApp</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-orange-400">notifications_active</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Create Push<br/>Notification</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-purple-400">app_shortcut</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Create In-App<br/>Message</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-zinc-400">dashboard_customize</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">View All<br/>Templates</span>
                </button>
              </div>
            </div>

            {/* Communication Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-[12px] font-bold text-white">Communication Alerts</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-4">
                {[
                  { title: "High email bounce rate", desc: "2.3% (above threshold)", time: "15m ago", icon: "warning", sc: "text-amber-500", bg: "bg-amber-500/10" },
                  { title: "SMS delivery issues", desc: "Provider latency detected", time: "42m ago", icon: "warning", sc: "text-amber-500", bg: "bg-amber-500/10" },
                  { title: "WhatsApp template rejected", desc: "Template name format invalid", time: "1h ago", icon: "error", sc: "text-red-500", bg: "bg-red-500/10" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-start border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                    <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 ${a.bg} ${a.sc}`}>
                      <span className="material-symbols-outlined text-[14px]">{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium text-zinc-200 truncate">{a.title}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{a.desc}</div>
                    </div>
                    <div className="text-[9px] text-zinc-600 shrink-0">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
