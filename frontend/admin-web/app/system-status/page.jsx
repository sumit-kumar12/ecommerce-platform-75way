"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Components
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data = [], color = "#10b981", height = 24, strokeWidth = "1.5", fillOpacity = "0.15" }) {
  if (!data.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1), w = 80;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  const area = `M0,${height} ${data.map((v, i) => `L${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
  const id = `spk-ss-${color.replace("#", "")}-${Math.random().toString(36).substring(2,7)}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible mt-1 shrink-0" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MultiLineChart({ series, labels = [], height = 140 }) {
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals, 1), w = 440;
  const pts = (data) => data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      {series.map((s, i) => (
        <polyline key={i} points={pts(s.data)} fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { type: "hero", label: "Overall Status", status: "Operational", sub: "100% uptime", color: "#10b981", icon: "check_circle" },
  { label: "Services", value: "45", suffix: "/ 45", sub: "All Operational", color: "#10b981", sp: [40, 42, 45, 41, 45, 45, 45] },
  { label: "Uptime (24h)", value: "100.00%", sub: "No downtime", color: "#10b981", sp: [99.9, 100, 100, 100, 100, 100, 100] },
  { label: "Incidents (24h)", value: "0", sub: "No incidents", color: "#10b981", sp: [1, 0, 0, 0, 0, 0, 0] },
  { label: "Maintenance", value: "1", sub: "Scheduled", color: "#f59e0b", sp: [0, 0, 1, 0, 0, 1, 1] },
  { label: "Avg. Response Time", value: "128", suffix: "ms", sub: "↓ -15.6%", color: "#10b981", sp: [150, 145, 140, 135, 130, 128, 128] },
];

const serviceStatus = [
  { name: "Web Application", uptime: "100.00%", rt: "98 ms", sp: [90, 95, 92, 98, 96, 98, 98] },
  { name: "API Gateway", uptime: "100.00%", rt: "112 ms", sp: [100, 110, 105, 115, 112, 110, 112] },
  { name: "Auth Service", uptime: "100.00%", rt: "76 ms", sp: [70, 75, 72, 78, 75, 76, 76] },
  { name: "User Service", uptime: "100.00%", rt: "95 ms", sp: [90, 92, 96, 94, 98, 95, 95] },
  { name: "Order Service", uptime: "100.00%", rt: "134 ms", sp: [120, 130, 125, 135, 132, 134, 134] },
  { name: "Payment Service", uptime: "100.00%", rt: "210 ms", sp: [200, 205, 215, 210, 208, 212, 210] },
  { name: "Inventory Service", uptime: "100.00%", rt: "118 ms", sp: [110, 115, 120, 118, 116, 119, 118] },
  { name: "Notification Service", uptime: "100.00%", rt: "97 ms", sp: [95, 98, 94, 99, 96, 97, 97] },
];

const respTimeSeries = [
  { label: "Web", color: "#10b981", data: [98, 100, 95, 105, 98, 96, 98, 102, 97, 95, 98] },
  { label: "API", color: "#3b82f6", data: [110, 115, 112, 118, 110, 112, 115, 110, 108, 112, 110] },
  { label: "DB", color: "#8b5cf6", data: [150, 155, 145, 160, 150, 148, 155, 150, 145, 150, 148] },
  { label: "Cache", color: "#f59e0b", data: [40, 42, 38, 45, 40, 41, 40, 43, 39, 40, 41] },
];
const respTimeLabels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];

const infrastructureStatus = [
  { name: "Kubernetes Cluster", icon: "view_in_ar", up: "100%" },
  { name: "Database Cluster", icon: "database", up: "100%" },
  { name: "Redis Cluster", icon: "memory", up: "100%" },
  { name: "Storage (S3)", icon: "cloud", up: "100%" },
  { name: "CDN (Cloudflare)", icon: "language", up: "100%" },
  { name: "Load Balancers", icon: "account_tree", up: "100%" },
  { name: "Message Queue", icon: "queue", up: "100%" },
];

const thirdPartyIntegrations = [
  { name: "Razorpay", icon: "payments", up: "100%" },
  { name: "SendGrid", icon: "mail", up: "100%" },
  { name: "Firebase", icon: "local_fire_department", up: "100%" },
  { name: "Cloudflare", icon: "cloud_queue", up: "100%" },
  { name: "WhatsApp API", icon: "chat", up: "100%" },
  { name: "Google Analytics", icon: "monitoring", up: "100%" },
  { name: "GitHub", icon: "code", up: "100%" },
];

const regionStatus = [
  { name: "Mumbai (IN)", up: "100%" },
  { name: "Singapore (SG)", up: "100%" },
  { name: "Frankfurt (DE)", up: "100%" },
  { name: "Oregon (US)", up: "100%" },
  { name: "N. Virginia (US)", up: "100%" },
  { name: "Sydney (AU)", up: "100%" },
];

const systemMetrics = [
  { label: "Requests (24h)", val: "12.8M", sub: "↑ 18.2%", color: "#3b82f6", up: true, sp: [10, 11, 10.5, 12, 11.5, 12.5, 12.8] },
  { label: "Errors (24h)", val: "2,312", sub: "↓ -22.4%", color: "#ef4444", up: false, sp: [3000, 2800, 2900, 2500, 2400, 2600, 2312] },
  { label: "Throughput", val: "1.42K", suffix: "req/s", sub: "↑ 12.7%", color: "#10b981", up: true, sp: [1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.42] },
  { label: "Availability (24h)", val: "100.00%", sub: "↑ 0.00%", color: "#10b981", up: true, sp: [100, 100, 100, 100, 100, 100, 100] },
];

const quickActions = [
  { icon: "public", label: "Status Page", color: "#8b5cf6" },
  { icon: "report_problem", label: "Report an Issue", color: "#ef4444" },
  { icon: "forward_to_inbox", label: "Subscribe", color: "#10b981" },
  { icon: "history", label: "Incident History", color: "#3b82f6" },
  { icon: "build", label: "Maintenance", color: "#8b5cf6" },
  { icon: "notifications", label: "Notifications", color: "#f59e0b" },
  { icon: "list_alt", label: "Service List", color: "#f59e0b" },
  { icon: "speed", label: "Performance", color: "#3b82f6" },
  { icon: "api", label: "API Health", color: "#10b981" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function SystemStatusDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            System Status Dashboard
            <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Real-time status of all platform services, APIs, infrastructure and third-party integrations.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">Auto Refresh</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-8 h-4 rounded-full relative transition-colors ${autoRefresh ? "bg-emerald-500" : "bg-zinc-700"}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${autoRefresh ? "left-4.5 translate-x-4" : "left-0.5"}`} />
            </button>
            <span className="text-[11px] text-zinc-300">{autoRefresh ? "On" : "Off"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors">
            Last 24 Hours
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors">
            Subscribe to Updates
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((k, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400 font-medium leading-tight mb-2">{k.label}</span>
                {k.type === "hero" ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-1">
                    <span className="material-symbols-outlined text-[42px] mb-1" style={{ color: k.color }}>{k.icon}</span>
                    <span className="text-[14px] font-bold" style={{ color: k.color }}>{k.status}</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">{k.sub}</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                      {k.value}
                      {(k.suffix) && <span className="text-[12px] text-zinc-400 font-normal">{k.suffix}</span>}
                    </div>
                    <div className="text-[10px] text-zinc-500">{k.sub}</div>
                    <div className="mt-auto pt-2">
                      <Spark data={k.sp} color={k.color} height={28} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Row 2: Service Status + Uptime History + Response Time */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Service Status Table */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Service Status</h3>
              <div className="flex gap-4 mb-4 text-[10px]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Operational</span>
                <span className="flex items-center gap-1.5"><span className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-amber-500"></span>Degraded</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500"></span>Outage</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Maintenance</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800/60">
                      <th className="text-left pb-2 font-medium">Service</th>
                      <th className="text-left pb-2 font-medium">Status</th>
                      <th className="text-left pb-2 font-medium">Uptime (24h)</th>
                      <th className="text-left pb-2 font-medium">Response Time</th>
                      <th className="text-left pb-2 font-medium">Trend (24h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {serviceStatus.map((s, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-2.5 text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {s.name}
                          </div>
                        </td>
                        <td className="py-2.5 text-emerald-400">Operational</td>
                        <td className="py-2.5 text-zinc-300">{s.uptime}</td>
                        <td className="py-2.5 text-zinc-300">{s.rt}</td>
                        <td className="py-2.5 w-16">
                          <Spark data={s.sp} color="#10b981" height={16} strokeWidth="1" fillOpacity="0" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-center">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all services <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Uptime History Chart */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Uptime History <span className="text-zinc-500 font-normal">(Last 7 Days)</span></h3>
              <div className="flex gap-2 flex-1">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-1">
                  <span>100%</span><span>99.9%</span><span>99.8%</span><span>99.7%</span><span>99.6%</span><span>99.5%</span>
                </div>
                <div className="flex-1 relative">
                  {/* Mocked perfectly flat area chart with tiny dip */}
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,15 L45,15 L48,18 L52,15 L100,15 L100,100 L0,100 Z" fill="url(#uptimeGrad)" />
                    <polyline points="0,15 45,15 48,18 52,15 100,15" fill="none" stroke="#10b981" strokeWidth="1.5" />
                    {[0, 20, 40, 60, 80, 100].map((v, i) => (
                      <line key={i} x1="0" y1={v} x2="100" y2={v} stroke="#1f2937" strokeWidth="0.5" />
                    ))}
                  </svg>
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-2 px-6">
                <span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span><span>May 25</span><span>May 26</span><span>May 27</span>
              </div>
            </div>

            {/* Response Time Chart */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-2">Response Time (24h)</h3>
              <div className="flex gap-4 mb-4 justify-center">
                {respTimeSeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-3 h-0.5 inline-block" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-1 min-h-[140px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-1">
                  <span>400 ms</span><span>300 ms</span><span>200 ms</span><span>100 ms</span><span>0 ms</span>
                </div>
                <div className="flex-1">
                  <MultiLineChart series={respTimeSeries} labels={respTimeLabels} height={140} />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-2 px-2">
                {respTimeLabels.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>

          </div>

          {/* Row 3: Infrastructure + Integrations + Region Status */}
          <div className="grid grid-cols-12 gap-4">

            {/* Infrastructure Status */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Infrastructure Status</h3>
              <div className="space-y-3 flex-1">
                {infrastructureStatus.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-zinc-400">{item.icon}</span>
                      <span className="text-zinc-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400">Operational</span>
                      <span className="text-zinc-400 w-8 text-right">{item.up}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View infrastructure <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Third-party Integrations */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Third-party Integrations</h3>
              <div className="space-y-3 flex-1">
                {thirdPartyIntegrations.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-zinc-400">{item.icon}</span>
                      <span className="text-zinc-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400">Operational</span>
                      <span className="text-zinc-400 w-8 text-right">{item.up}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all integrations <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Region Status */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col relative overflow-hidden">
              <h3 className="text-[14px] font-bold text-white mb-4 relative z-10">Region Status</h3>
              <div className="flex-1 relative z-10 flex gap-4">
                <div className="flex-1 flex items-center justify-center relative min-h-[160px] opacity-40 mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat">
                  {/* Decorative map dots */}
                  <div className="absolute top-[30%] left-[25%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <div className="absolute top-[40%] left-[45%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <div className="absolute top-[50%] left-[70%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <div className="absolute top-[60%] left-[75%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <div className="absolute top-[80%] left-[85%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
                <div className="space-y-3 w-40">
                  {regionStatus.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-zinc-200">{item.name}</span>
                      </div>
                      <span className="text-zinc-400">{item.up}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end relative z-10">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all regions <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Row 4: Incident History + System Metrics Summary */}
          <div className="grid grid-cols-12 gap-4">

            {/* Incident History */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">Incident History <span className="text-zinc-500 font-normal">(Last 7 Days)</span></h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800/60">
                      <th className="text-left pb-2 font-medium">ID</th>
                      <th className="text-left pb-2 font-medium">Status</th>
                      <th className="text-left pb-2 font-medium">Service</th>
                      <th className="text-left pb-2 font-medium">Incident</th>
                      <th className="text-left pb-2 font-medium">Started At</th>
                      <th className="text-left pb-2 font-medium">Duration</th>
                      <th className="text-left pb-2 font-medium">Impact</th>
                    </tr>
                  </thead>
                </table>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px] text-emerald-400">check</span>
                </div>
                <div className="text-[13px] text-zinc-300">No incidents in the last 7 days.</div>
                <div className="text-[11px] text-zinc-500 mt-1">All systems are running smoothly.</div>
              </div>

              <div className="mt-2 flex justify-center">
                <Link href="#" className="text-[11px] text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  View all incidents <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* System Metrics Summary */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <h3 className="text-[14px] font-bold text-white mb-4">System Metrics Summary</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {systemMetrics.map((sm, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[11px] text-zinc-400 mb-2">{sm.label}</span>
                    <div className="text-xl font-bold text-white flex items-baseline gap-1">
                      {sm.val}
                      {(sm.suffix) && <span className="text-[10px] text-zinc-400 font-normal">{sm.suffix}</span>}
                    </div>
                    <div className={`text-[10px] mt-1 ${sm.up ? "text-emerald-400" : "text-amber-400"}`}>{sm.sub}</div>
                    <div className="mt-auto pt-4">
                      <Spark data={sm.sp} color={sm.color} height={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-[300px] border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-5 gap-6 shrink-0 overflow-y-auto">

          {/* Current Status */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex flex-col items-center text-center relative overflow-hidden">
            <h3 className="text-[12px] font-medium text-zinc-400 absolute top-4 left-4">Current Status</h3>
            <div className="mt-8 mb-4 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-[#0d0f1a] relative z-10">
                <span className="material-symbols-outlined text-[32px] text-emerald-400">check</span>
              </div>
            </div>
            <h2 className="text-[16px] font-bold text-emerald-400 mb-1">All Systems Operational</h2>
            <p className="text-[10px] text-zinc-500 mb-5">Updated 1 minute ago</p>
            <p className="text-[11px] text-zinc-300 mb-6 leading-relaxed">
              No active incidents across all systems.
            </p>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-zinc-700">
              View Status Page <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </button>
          </div>

          {/* Active Incidents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-white">Active Incidents</h3>
              <Link href="#" className="text-[10px] text-purple-400">View all</Link>
            </div>
            <div className="p-4 border border-dashed border-zinc-700 rounded-xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px] text-emerald-400">check</span>
              </div>
              <div className="text-[12px] font-bold text-emerald-400 mb-1">No Active Incidents</div>
              <div className="text-[10px] text-zinc-500 leading-relaxed">
                Great! There are currently no incidents affecting the platform.
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Scheduled Maintenance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-white">Scheduled Maintenance</h3>
              <Link href="#" className="text-[10px] text-purple-400">View all</Link>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex gap-3 mb-3">
                <span className="material-symbols-outlined text-[16px] text-purple-400 mt-0.5">build</span>
                <div>
                  <div className="text-[12px] font-bold text-white mb-1 flex items-center justify-between gap-2">
                    Database Maintenance
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">Scheduled</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">May 29, 2025 01:00 AM - 03:00 AM IST</div>
                </div>
              </div>
              <p className="text-[10px] text-zinc-300 leading-relaxed mb-3">
                Routine optimization and index rebuilding.
              </p>
              <div className="text-[9px] text-zinc-500 mb-4">
                Affects: Database Cluster (Read Replicas)
              </div>
              <button className="w-full py-1.5 bg-zinc-800/50 hover:bg-zinc-800 text-purple-400 text-[10px] font-medium rounded transition-colors border border-zinc-700/50">
                View Details
              </button>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Quick Actions */}
          <div>
            <h3 className="text-[13px] font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group aspect-square">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-zinc-800/50" style={{ background: `${q.color}10` }}>
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
