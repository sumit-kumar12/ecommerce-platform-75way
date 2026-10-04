"use client";

import { useEffect, useState, useCallback } from "react";
import { adminRequest } from "../../lib/api";
import Link from "next/link";

const ago = (iso) => {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime(), s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// ── Sparkline ────────────────────────────────────────────────────────────────
function Spark({ data = [], color = "#ef4444" }) {
  if (!data.length) return <div className="h-6 w-16 shrink-0" />;
  const max = Math.max(...data, 1), w = 64, h = 24;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible opacity-80 mt-1 shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Gauge Ring ───────────────────────────────────────────────────────────────
function GaugeRing({ percent = 0, color = "#10b981", label, sub }) {
  const r = 36, circ = 2 * Math.PI * r, dash = (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#1f2937" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke-dasharray 0.6s" }}
        />
      </svg>
      <div className="text-center mt-[-46px] mb-4">
        <div className="text-sm font-bold text-white">{percent}%</div>
        <div className="text-[9px] text-zinc-500">of 100%</div>
      </div>
      {label && <div className="text-xs font-semibold text-zinc-300 mt-2">{label}</div>}
      {sub && <div className="text-[10px] text-zinc-500">{sub}</div>}
    </div>
  );
}

// ── Area Chart (Mini) ────────────────────────────────────────────────────────
function AreaChart({ data = [], color = "#8b5cf6" }) {
  if (!data.length) return <div className="h-24 w-full bg-zinc-800/20 rounded" />;
  const max = Math.max(...data, 1), w = 200, h = 60;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`);
  const pathData = `M0,${h} L${pts.join(" L")} L${w},${h} Z`;
  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={pathData} fill={`url(#grad-${color})`} />
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function MonitoringDashboard() {
  const [data, setData] = useState({
    health: null,
    metrics: null,
    disk: null,
    logs: [],
    traffic: [],
    manifest: null,
    incidents: [], // simulating alerts
    audit: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (showR = false) => {
    if (showR) setRefreshing(true);
    try {
      const results = await Promise.allSettled([
        adminRequest("/monitoring/health"),
        adminRequest("/monitoring/metrics/summary"),
        adminRequest("/monitoring/disk-status"),
        adminRequest("/monitoring/logs?limit=15"),
        adminRequest("/monitoring/traffic-pulse"),
        adminRequest("/monitoring/system-manifest"),
        adminRequest("/incidents?limit=5"), // for alerts/notifications
        adminRequest("/monitoring/audit/stats")
      ]);
      const get = (r, fallback = null) => r.status === "fulfilled" ? r.value : fallback;
      const arr = (r, key) => { const v = get(r); if (!v) return []; return v[key] || v.data || []; };
      
      setData({
        health: get(results[0]),
        metrics: get(results[1]),
        disk: get(results[2]),
        logs: arr(results[3], "logs"),
        traffic: arr(results[4], "history"),
        manifest: get(results[5]),
        incidents: arr(results[6], "incidents"),
        audit: get(results[7]),
      });
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchAll(); const iv = setInterval(fetchAll, 20000); return () => clearInterval(iv); }, [fetchAll]);

  const h = data.health || {};
  const m = data.metrics || {};
  const d = data.disk || {};
  
  const cpu = m.cpuPercent || 42.7;
  const mem = m.heapUsedPercent || m.memoryPercent || 61.3;
  const diskPct = d.usedPercent || 56.8;

  const kpis = [
    { icon: "favorite", label: "Overall Platform Health", value: "98.6%", sub: "Healthy", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", spark: [90,95,92,98,96,99,98.6], scolor: "#10b981" },
    { icon: "dns", label: "Active Servers", value: "124 / 128", sub: "Running", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", spark: [120,122,121,124,124,124,124], scolor: "#3b82f6" },
    { icon: "memory", label: "CPU Usage (Avg.)", value: `${cpu}%`, sub: "-3.4% vs yesterday", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", spark: [50,45,60,40,55,42,cpu], scolor: "#a855f7" },
    { icon: "memory_alt", label: "Memory Usage (Avg.)", value: `${mem}%`, sub: "+2.1% vs yesterday", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", spark: [60,65,62,58,63,61,mem], scolor: "#f59e0b" },
    { icon: "notifications_active", label: "Active Alerts", value: "23", sub: "-8 vs yesterday", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", spark: [30,28,35,25,22,24,23], scolor: "#ef4444" },
    { icon: "build", label: "Maintenance Mode", value: "Off", sub: "All systems normal", color: "text-zinc-400", bg: "bg-zinc-800/60", border: "border-zinc-700", spark: [0,0,0,0,0,0,0], scolor: "#52525b" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Platform Operations - Command Center
            <span className="material-symbols-outlined text-zinc-400 text-[18px]">dns</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time overview of infrastructure, deployments, and platform performance.</p>
          <div className="flex gap-2 text-[10px] text-zinc-500 mt-1">
            <span>Home</span><span className="text-zinc-700">›</span><span>Platform Operations</span><span className="text-zinc-700">›</span><span className="text-zinc-400">Command Center</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            Past 24 Hours
          </div>
          <button onClick={() => fetchAll(true)} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-300 transition-colors">
            <span className={`material-symbols-outlined text-[14px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            Refresh
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Auto Refresh</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 p-6 space-y-5 lg:min-w-0">
          
          {/* KPI Cards (Top Row) */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
             {kpis.map(({ icon, label, value, sub, color, bg, border, spark, scolor }) => (
              <div key={label} className={`bg-zinc-900/60 border ${border} rounded-xl p-3 flex flex-col gap-1 min-w-0`}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`material-symbols-outlined text-[16px] shrink-0 ${color}`}>{icon}</span>
                  <span className="text-[10px] font-semibold text-zinc-300 truncate">{label}</span>
                </div>
                <div className="flex items-end justify-between mt-2 gap-2">
                  <div className="min-w-0">
                    <div className="text-2xl font-bold text-white whitespace-nowrap truncate">{loading ? <span className="text-zinc-600">—</span> : value}</div>
                    <div className={`text-[10px] truncate ${sub.includes("-") ? "text-emerald-400" : sub.includes("+") ? "text-red-400" : color}`}>{sub}</div>
                  </div>
                  <Spark data={spark} color={scolor} />
                </div>
              </div>
            ))}
          </div>

          {/* Row 1: Infrastructure Metrics */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Infrastructure Metrics</h3>
                <div className="flex bg-zinc-800/80 rounded p-0.5 text-[10px]">
                  {['1H','6H','12H','24H','7D','30D'].map(t => (
                    <div key={t} className={`px-2 py-1 rounded cursor-pointer ${t === '24H' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-300'}`}>{t}</div>
                  ))}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                {[
                  { label: "CPU Usage (%)", val: `${cpu}%`, sub: "-3.4%", color: "#a855f7", data: [40,45,42,50,48,60,42,45,40,38,cpu] },
                  { label: "Memory Usage (%)", val: `${mem}%`, sub: "+2.1%", color: "#f59e0b", data: [60,62,61,65,64,68,62,60,61,59,mem] },
                  { label: "Disk Usage (%)", val: `${diskPct}%`, sub: "+1.3%", color: "#3b82f6", data: [50,51,52,53,54,55,55,56,56,56,diskPct] },
                ].map((chart, i) => (
                  <div key={i} className="flex flex-col h-full bg-zinc-800/30 p-2 rounded-lg border border-zinc-800/50">
                    <div className="text-[10px] text-zinc-400 mb-1">{chart.label}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-white">{chart.val}</span>
                      <span className={`text-[10px] ${chart.sub.includes('+') ? 'text-red-400' : 'text-emerald-400'}`}>{chart.sub}</span>
                    </div>
                    <div className="flex-1 min-h-[60px] relative">
                      <div className="absolute top-0 right-0 text-[8px] text-zinc-600">100%</div>
                      <div className="absolute bottom-1/2 right-0 text-[8px] text-zinc-600 border-b border-dashed border-zinc-700 w-full text-right leading-3">50%</div>
                      <div className="absolute bottom-0 right-0 text-[8px] text-zinc-600">0%</div>
                      <div className="absolute bottom-0 left-0 text-[8px] text-zinc-600">00:00</div>
                      <div className="absolute bottom-0 left-1/2 text-[8px] text-zinc-600 transform -translate-x-1/2">12:00</div>
                      <div className="absolute bottom-0 right-4 text-[8px] text-zinc-600">24:00</div>
                      <div className="pt-2 pb-3 h-full"><AreaChart data={chart.data} color={chart.color} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: System Health Overview & Resource Distribution */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">System Health Overview</h3>
                <span className="text-[11px] text-purple-400 cursor-pointer hover:text-purple-300">View All</span>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full text-[11px] min-w-max">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">Component</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                    <th className="text-left pb-2 font-medium">Health</th>
                    <th className="text-left pb-2 font-medium">Availability</th>
                    <th className="text-left pb-2 font-medium">Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {[
                    { c: "Web Servers", h: 99.2, a: 99.98, r: 120 },
                    { c: "API Gateway", h: 98.7, a: 99.95, r: 95 },
                    { c: "Database (PostgreSQL)", h: h?.db?.status === "OK" ? 99.1 : 50, a: 99.97, r: 76 },
                    { c: "Redis Cluster", h: h?.redis?.status === "OK" ? 99.5 : 50, a: 99.99, r: 22 },
                    { c: "Message Queue", h: 98.9, a: 99.96, r: 45 },
                    { c: "Object Storage", h: 99.0, a: 99.95, r: 110 },
                    { c: "Search Engine", h: 98.4, a: 99.92, r: 130 },
                    { c: "CDN", h: 100, a: 100, r: 35 },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30">
                      <td className="py-2 text-zinc-300 flex items-center gap-1.5"><span className="material-symbols-outlined text-[12px] text-zinc-500">dns</span> {row.c}</td>
                      <td className="py-2"><span className="text-emerald-400 font-medium">● Healthy</span></td>
                      <td className="py-2"><div className="flex items-center gap-1"><div className="w-8 h-1.5 bg-zinc-800 rounded overflow-hidden"><div className="h-full bg-emerald-500" style={{width:`${row.h}%`}}/></div><span className="text-white">{row.h}%</span></div></td>
                      <td className="py-2 text-white">{row.a}%</td>
                      <td className="py-2 text-white">{row.r} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="xl:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Resource Distribution</h3>
                <span className="text-[11px] text-purple-400 cursor-pointer">View All</span>
              </div>
              <div className="flex items-center justify-center relative mb-4 mt-2">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="80 314" strokeDashoffset="0" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="70 314" strokeDashoffset="-80" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="60 314" strokeDashoffset="-150" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="30 314" strokeDashoffset="-210" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" strokeWidth="16" strokeDasharray="20 314" strokeDashoffset="-240" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#a855f7" strokeWidth="16" strokeDasharray="54 314" strokeDashoffset="-260" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-zinc-400">Total Resources</span>
                  <span className="text-xl font-bold text-white">128</span>
                </div>
              </div>
              <div className="space-y-2 mt-4 flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
                {[
                  { l: "Web Servers", v: "32 (25%)", c: "bg-purple-500" },
                  { l: "API Servers", v: "28 (21.9%)", c: "bg-red-500" },
                  { l: "Workers", v: "24 (18.8%)", c: "bg-amber-500" },
                  { l: "Database", v: "12 (9.4%)", c: "bg-emerald-500" },
                  { l: "Cache", v: "8 (6.3%)", c: "bg-cyan-500" },
                  { l: "Others", v: "24 (18.8%)", c: "bg-blue-500" },
                ].map(r => (
                  <div key={r.l} className="flex justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-zinc-300"><span className={`w-2 h-2 rounded-sm ${r.c}`} />{r.l}</div>
                    <div className="text-zinc-500">{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: System Resources & Deployment Pipeline */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">System Resources</h3>
                <span className="text-[11px] text-purple-400 cursor-pointer">View All</span>
              </div>
              <div className="flex justify-around mb-6 mt-4">
                <GaugeRing percent={cpu} color="#a855f7" label="CPU" />
                <GaugeRing percent={mem} color="#f59e0b" label="Memory" />
                <GaugeRing percent={diskPct} color="#3b82f6" label="Disk" />
                <GaugeRing percent={72.4} color="#10b981" label="Network" sub="Mbps" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-zinc-800/50 rounded-lg p-3 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-[24px]">dns</span>
                  <div><div className="text-xs text-zinc-500">Total Servers</div><div className="text-lg font-bold text-white">128</div></div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[24px]">play_arrow</span>
                  <div><div className="text-xs text-zinc-500">Running</div><div className="text-lg font-bold text-white">124</div></div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-red-400 text-[24px]">stop</span>
                  <div><div className="text-xs text-zinc-500">Stopped</div><div className="text-lg font-bold text-white">2</div></div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Deployment Pipeline</h3>
                <span className="text-[11px] text-purple-400 cursor-pointer">View All</span>
              </div>
              <div className="relative pl-3 mt-4 space-y-5 before:absolute before:inset-y-2 before:left-4 before:w-[2px] before:bg-zinc-800 flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
                {[
                  { step: "Code Commit", status: "Completed", time: "2h ago", icon: "check_circle", color: "text-emerald-500" },
                  { step: "Build", status: "Completed", time: "2h ago", icon: "check_circle", color: "text-emerald-500" },
                  { step: "Tests", status: "Completed", time: "2h ago", icon: "check_circle", color: "text-emerald-500" },
                  { step: "Security Scan", status: "Completed", time: "1h ago", icon: "check_circle", color: "text-emerald-500" },
                  { step: "Deploy to Staging", status: "Completed", time: "1h ago", icon: "check_circle", color: "text-emerald-500" },
                  { step: "Deploy to Production", status: "Completed", time: "45m ago", icon: "check_circle", color: "text-emerald-500" },
                ].map((s, i) => (
                  <div key={i} className="relative pl-6 flex items-center justify-between">
                    <span className={`material-symbols-outlined absolute -left-1.5 top-0.5 bg-[#0d0f1a] text-[16px] ${s.color}`}>{s.icon}</span>
                    <span className="text-xs text-white font-medium">{s.step}</span>
                    <div className="text-right">
                      <div className="text-[11px] text-emerald-400 font-medium">{s.status}</div>
                      <div className="text-[10px] text-zinc-500">{s.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Active Deployments */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Active Deployments</h3>
                <span className="text-[11px] text-purple-400 cursor-pointer">View All</span>
              </div>
              <div className="overflow-x-auto flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <table className="w-full text-xs min-w-max">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-3 font-medium">Service</th>
                    <th className="text-left pb-3 font-medium">Environment</th>
                    <th className="text-left pb-3 font-medium">Version</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-left pb-3 font-medium">Deployed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {[
                    { s: "User Service", e: "Production", v: "v2.3.8", st: "Success", t: "14:32:21" },
                    { s: "Order Service", e: "Production", v: "v2.1.4", st: "Success", t: "14:30:10" },
                    { s: "Payment Service", e: "Production", v: "v2.1.4", st: "Success", t: "14:28:45" },
                    { s: "Inventory Service", e: "Staging", v: "v2.0.6", st: "Deploying", t: "14:35:18" },
                    { s: "Notification Service", e: "Production", v: "v1.9.2", st: "Success", t: "14:20:33" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30">
                      <td className="py-3 text-zinc-200 font-medium">{row.s}</td>
                      <td className="py-3 text-zinc-400">{row.e}</td>
                      <td className="py-3 text-zinc-400 font-mono">{row.v}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.st === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {row.st}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-500">{row.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col h-full">
              <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mt-2">
                {[
                  { icon: "dns", label: "Add New Server", c: "text-emerald-400" },
                  { icon: "backup", label: "Create Backup", c: "text-purple-400" },
                  { icon: "health_and_safety", label: "Run Health Check", c: "text-blue-400" },
                  { icon: "list_alt", label: "View All Logs", c: "text-amber-400" },
                  { icon: "rocket_launch", label: "Manage Deployments", c: "text-cyan-400" },
                  { icon: "settings", label: "System Settings", c: "text-zinc-400" },
                  { icon: "cleaning_services", label: "Clear Cache", c: "text-red-400" },
                  { icon: "restart_alt", label: "Restart Services", c: "text-blue-500" },
                ].map(a => (
                  <div key={a.label} className="bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors border border-zinc-700/50 hover:border-zinc-600">
                    <span className={`material-symbols-outlined text-[24px] ${a.c}`}>{a.icon}</span>
                    <span className="text-[11px] text-zinc-300 font-bold text-center">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ─────────────────────────────────────────────────── */}
        <div className="w-full lg:w-72 xl:w-80 border-l border-zinc-800 bg-zinc-900/40 flex flex-col p-4 gap-5 shrink-0 lg:flex-none">
          
          {/* Alerts & Notifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Alerts & Notifications</h3>
              <Link href="/alerts" className="text-[11px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {[
                { l: "Critical Alerts", s: "Require immediate attention", v: "3", c: "text-red-400", i: "warning", bg: "bg-red-500/10" },
                { l: "High Alerts", s: "Require attention", v: "8", c: "text-amber-400", i: "error", bg: "bg-amber-500/10" },
                { l: "Medium Alerts", s: "Monitor closely", v: "12", c: "text-amber-400", i: "warning_amber", bg: "bg-amber-500/10" },
                { l: "Low Alerts", s: "All good", v: "0", c: "text-blue-400", i: "info", bg: "bg-blue-500/10" },
              ].map(a => (
                <div key={a.l} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[16px] ${a.c}`}>{a.i}</span>
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-200">{a.l}</div>
                      <div className="text-[9px] text-zinc-500">{a.s}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${a.v !== "0" ? a.c : "text-blue-400"}`}>{a.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Recent Activity</h3>
              <Link href="/activity" className="text-[11px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-zinc-800">
              {[
                { e: "Deployment completed", d: "Payment Service v2.1.4", t: "2m ago", i: "check_circle", c: "text-emerald-400" },
                { e: "Database backup completed", d: "PostgreSQL - Main Cluster", t: "15m ago", i: "cloud_done", c: "text-emerald-400" },
                { e: "New server added", d: "Web Server - web-128", t: "21m ago", i: "dns", c: "text-blue-400" },
                { e: "Scaling action triggered", d: "Workers scaled to 24", t: "35m ago", i: "sync", c: "text-purple-400" },
                { e: "Configuration updated", d: "API Gateway Rate Limit", t: "42m ago", i: "settings", c: "text-blue-400" },
              ].map((a, i) => (
                <div key={i} className="relative pl-8">
                  <span className={`material-symbols-outlined absolute -left-0.5 top-0 bg-[#0d0f1a] text-[16px] ${a.c}`}>{a.i}</span>
                  <div className="text-[11px] font-semibold text-zinc-200">{a.e}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{a.d}</div>
                  <div className="text-[9px] text-zinc-600 absolute right-0 top-0">{a.t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Upcoming Maintenance</h3>
              <Link href="/maintenance" className="text-[11px] text-purple-400">View All</Link>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-zinc-400">event</span>
                  <span className="text-[11px] font-semibold text-white">Database Cluster Upgrade</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Scheduled</span>
              </div>
              <div className="text-[10px] text-zinc-500 ml-6 mt-1">May 28, 2025 01:00 AM IST</div>
              <div className="flex justify-between mt-3 text-[10px]">
                <span className="text-zinc-500">Impact: <span className="text-emerald-400">Low</span></span>
                <span className="text-zinc-500">Duration: ~15 min</span>
              </div>
            </div>
          </div>

          {/* System Status Summary */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">System Status Summary</h3>
              <span className="text-[11px] text-purple-400 cursor-pointer">View Status Page</span>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-2 space-y-2">
              {[
                { l: "Platform Status" },
                { l: "API Services" },
                { l: "Database" },
                { l: "Storage" },
                { l: "CDN" },
                { l: "Third Party Services" },
              ].map(s => (
                <div key={s.l} className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                    {s.l}
                  </div>
                  <span className="text-emerald-400">Operational</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
        
        {/* ── Bottom Full Width Content ───────────────────────────────────── */}
        <div className="p-6 border-t border-zinc-800 bg-[#0a0a0a]">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Event Logs <span className="text-zinc-500 font-normal">(Last 50)</span></h3>
              <span className="text-[11px] text-purple-400 cursor-pointer">View All Logs</span>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg border border-zinc-800 p-2 overflow-x-auto flex-1 min-h-[250px] max-h-[600px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-xs font-mono min-w-max">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800 bg-zinc-900/50">
                    <th className="text-left px-3 py-2.5 font-medium">Time</th>
                    <th className="text-left px-3 py-2.5 font-medium">Level</th>
                    <th className="text-left px-3 py-2.5 font-medium">Source</th>
                    <th className="text-left px-3 py-2.5 font-medium">Event</th>
                    <th className="text-left px-3 py-2.5 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {[
                    { t: "14:35:18", l: "INFO", src: "Deployment", ev: "Deployment started", det: "Service: Inventory Service | Version: v2.0.6" },
                    { t: "14:34:52", l: "WARN", src: "Database", ev: "Slow query detected", det: "Query execution time: 2.35s | Database: katabazaar_main" },
                    { t: "14:33:21", l: "INFO", src: "System", ev: "Auto scaling triggered", det: "Workers scaled from 20 to 24 | CPU: 78%" },
                    { t: "14:32:21", l: "INFO", src: "Deployment", ev: "Deployment completed", det: "Service: User Service | Version: v2.3.8" },
                    { t: "14:31:09", l: "ERROR", src: "API Gateway", ev: "High error rate detected", det: "Error rate: 5.2% | Endpoint: /api/v1/orders | Status: 500" },
                    { t: "14:30:10", l: "INFO", src: "Deployment", ev: "Deployment completed", det: "Service: Order Service | Version: v2.1.4" },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30">
                      <td className="px-3 py-2.5 text-zinc-500">{r.t}</td>
                      <td className="px-3 py-2.5"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.l === 'INFO' ? 'bg-blue-500/10 text-blue-400' : r.l === 'WARN' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{r.l}</span></td>
                      <td className="px-3 py-2.5 text-zinc-400">{r.src}</td>
                      <td className="px-3 py-2.5 text-zinc-300 font-medium">{r.ev}</td>
                      <td className="px-3 py-2.5 text-zinc-500">{r.det}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
