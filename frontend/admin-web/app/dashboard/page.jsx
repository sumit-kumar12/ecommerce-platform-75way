"use client";

import { useEffect, useState, useCallback } from "react";
import { adminRequest } from "../../lib/api";
import Link from "next/link";
import dynamic from "next/dynamic";

const ThreatMapWidget = dynamic(() => import("../../components/ThreatMapWidget"), { ssr: false });

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_00_000) return `₹${(n / 1_00_000).toFixed(1)} L`;
  if (n >= 1000) return n.toLocaleString("en-IN");
  return String(n);
};

const fmtRev = (n) => {
  if (!n) return "₹0";
  const p = Number(n);
  if (p >= 1_00_00_000) return `₹${(p / 1_00_00_000).toFixed(2)} Cr`;
  if (p >= 1_00_000) return `₹${(p / 1_00_000).toFixed(1)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
};

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

function AreaChart({ data = [], color = "#8b5cf6" }) {
  if (!data.length) return <div className="w-full h-full bg-zinc-800/20 rounded" />;
  const max = Math.max(...data, 1), w = 400, h = 100;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`);
  const pathData = `M0,${h} L${pts.join(" L")} L${w},${h} Z`;
  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0">
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={pathData} fill={`url(#grad-${color.replace('#','')})`} />
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-zinc-500 font-mono mt-1">
        <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
      </div>
    </div>
  );
}

export default function PlatformOverview() {
  const [data, setData] = useState({
    health: null, stats: null, finance: null, threatStats: null,
    incidents: [], audit: [], threatEvents: [], failedLogins: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [lockdownOpen, setLockdownOpen] = useState(false);
  const [lockdownActive, setLockdownActive] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);

  // Live ticker events (simulated — replace with real WebSocket/API)
  const TICKER_EVENTS = [
    { level: "crit", msg: "Unauthorized access attempt blocked — IP 192.168.21.1" },
    { level: "warn", msg: "Malicious payload detected — Source: 45.2.19.1" },
    { level: "info", msg: "System backup completed successfully" },
    { level: "crit", msg: "Brute force login attempt — User: admin" },
    { level: "info", msg: "SQL Injection attempt blocked by WAF" },
    { level: "warn", msg: "High-risk user login detected — Root_User" },
    { level: "info", msg: "Scheduled vulnerability scanner initiated" },
    { level: "crit", msg: "DDoS pattern detected — 12K req/s from AS15169" },
    { level: "info", msg: "New merchant registered — ID #8821" },
    { level: "warn", msg: "Failed 2FA attempt — 3 consecutive failures" },
  ];

  const fetchAll = useCallback(async (showR = false) => {
    if (showR) setRefreshing(true);
    try {
      const results = await Promise.allSettled([
        adminRequest("/monitoring/health"),
        adminRequest("/stats"),
        adminRequest("/finance/summary"),
        adminRequest("/threat/stats"),
        adminRequest("/incidents?limit=10"),
        adminRequest("/audit?limit=8"),
        adminRequest("/threat/events?limit=20"),
        adminRequest("/monitoring/failed-logins?limit=5")
      ]);
      const get = (r) => r.status === "fulfilled" ? r.value : null;
      const arr = (r, key) => { const v = get(r); if (!v) return []; return v[key] || v.data || v.events || []; };
      
      setData({
        health: get(results[0]),
        stats: get(results[1]),
        finance: get(results[2]),
        threatStats: get(results[3]),
        incidents: arr(results[4], "incidents"),
        audit: arr(results[5], "logs"),
        threatEvents: arr(results[6], "events"),
        failedLogins: arr(results[7], "failedLogins")
      });
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchAll(); const iv = setInterval(fetchAll, 30000); return () => clearInterval(iv); }, [fetchAll]);

  // Auto-refresh countdown
  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? 30 : c - 1)), 1000);
    return () => clearInterval(t);
  }, []);


  const h = data.health || {};
  const s = data.stats || {};
  const f = data.finance || {};
  const t = data.threatStats || {};

  const revData = [1.2, 1.4, 1.3, 1.8, 2.1, 2.0, 2.4, 2.2, 2.6, 2.8, 3.1, 3.5, 3.4, 3.8, 4.2];
  const threatData = [10,25,15,30,20,40,35,50,45,60,40,30,20,35,45,55,30,40,25,15,20];

  const totalThreats = t.total ?? data.threatEvents.length ?? 45200;

  // New Top KPIs
  const topKPIs = [
    { icon: "verified_user", label: "Security Score", value: "72.4%", sub: "-26.0% vs yesterday", scolor: "#3b82f6", spark: [98,99,96,95,92,80,72.4], isRed: true },
    { icon: "warning", label: "Active Threats", value: "18", sub: "+12 vs last hour", scolor: "#ef4444", spark: [4,5,3,8,6,12,18], isRed: true },
    { icon: "bug_report", label: "Open Incidents", value: "04", sub: "+1 vs yesterday", scolor: "#f59e0b", spark: [2,3,2,4,3,3,4], isRed: false },
    { icon: "person_off", label: "High Risk Users", value: "128", sub: "+9 vs yesterday", scolor: "#10b981", spark: [100,105,110,115,120,125,128], isRed: false },
    { icon: "radar", label: "System Uptime", value: "99.9%", sub: "+0.01% vs yesterday", scolor: "#3b82f6", spark: [99.8,99.85,99.9,99.9,99.9,99.9,99.9], isRed: false },
  ];

  // Infrastructure Core (Platform Health Overview)
  const healthCards = [
    { label: "Web Servers", icon: "language", val: "100%", sub1: "12 Instances", sub2: "Healthy", color: "#3b82f6", sc: "text-emerald-400" },
    { label: "Database", icon: "database", val: "100%", sub1: "Primary + 2 Replicas", sub2: "Healthy", color: "#3b82f6", sc: "text-emerald-400" },
    { label: "Redis Cache", icon: "dns", val: "100%", sub1: "3 Nodes", sub2: "Healthy", color: "#ef4444", sc: "text-emerald-400" },
    { label: "Queue System", icon: "queue", val: "98.7%", sub1: "Active", sub2: "Healthy", color: "#8b5cf6", sc: "text-emerald-400" },
    { label: "Storage", icon: "folder", val: "68.2%", sub1: "1.36 TB / 2 TB", sub2: "", color: "#f59e0b", sc: "", donut: true },
  ];

  // Business KPIs (Bottom Row)
  const bizKPIs = [
    { icon: "group", label: "Total Users", val: fmt(s.totalUsers || 23842), sub: "+342 today", sc: "text-emerald-400", c: "#8b5cf6" },
    { icon: "store", label: "Merchants", val: fmt(s.totalMerchants || 4218), sub: "+28 today", sc: "text-emerald-400", c: "#f59e0b" },
    { icon: "shopping_cart", label: "Orders (Today)", val: fmt(s.totalOrders || 12984), sub: "+8.7% vs yesterday", sc: "text-emerald-400", c: "#10b981" },
    { icon: "attach_money", label: "Revenue (Today)", val: fmtRev(f.totalRevenue || 1875420), sub: "+12.4% vs yesterday", sc: "text-emerald-400", c: "#10b981" },
    { icon: "headset_mic", label: "Support Tickets", val: "156", sub: "18 open", sc: "text-zinc-400", c: "#8b5cf6" },
    { icon: "description", label: "System Logs", val: "2.45M", sub: "Events today", sc: "text-zinc-400", c: "#3b82f6" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans overflow-x-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Welcome back, Platform Admin <span className="text-xl">👋</span>
          </h1>
          <p className="text-[11px] text-zinc-400 mt-1">Here's what's happening across Katabazaar Platform today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Auto-refresh countdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Auto-refresh in <span className="text-white font-mono font-bold ml-1">{countdown}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            Past 24 Hours
            <span className="material-symbols-outlined text-[14px] ml-1">expand_more</span>
          </div>
          <button onClick={() => fetchAll(true)} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 transition-colors">
            <span className={`material-symbols-outlined text-[14px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            Refresh
          </button>

          {/* Emergency Lockdown */}
          <button
            onClick={() => setLockdownOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-[11px] font-semibold transition-all ${
              lockdownActive
                ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30 animate-pulse"
                : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">emergency</span>
            {lockdownActive ? "🔴 LOCKDOWN ACTIVE" : "Emergency Lockdown"}
          </button>
        </div>
      </div>

      {/* ── Live Threat Ticker ─────────────────────────────────────────────── */}
      <div
        className="relative flex items-center gap-3 border-b border-zinc-800/50 bg-zinc-950/80 px-4 py-1.5 overflow-hidden"
        onMouseEnter={() => setTickerPaused(true)}
        onMouseLeave={() => setTickerPaused(false)}
      >
        <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-500/30 rounded px-1.5 py-0.5 bg-red-500/10">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          LIVE
        </span>
        <div className="flex-1 overflow-hidden">
          <div
            className="flex gap-10 text-[11px] text-zinc-400 whitespace-nowrap"
            style={{
              animation: tickerPaused ? "none" : "tickerScroll 40s linear infinite",
            }}
          >
            {[...TICKER_EVENTS, ...TICKER_EVENTS].map((ev, i) => (
              <span key={i} className="shrink-0 flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  ev.level === "crit" ? "bg-red-400" : ev.level === "warn" ? "bg-amber-400" : "bg-emerald-400"
                }`} />
                <span className={ev.level === "crit" ? "text-red-300" : ev.level === "warn" ? "text-amber-300" : "text-zinc-400"}>
                  {ev.msg}
                </span>
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes tickerScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Emergency Lockdown Modal ───────────────────────────────────────── */}
      {lockdownOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-2xl border border-red-500/30 bg-[#0d0f1a] p-6 shadow-2xl shadow-red-950/50">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <span className="material-symbols-outlined text-[22px]">emergency</span>
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-white">Emergency Lockdown</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">This will immediately block all non-admin access.</p>
              </div>
            </div>
            <div className="rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3 mb-5 text-[12px] text-red-300">
              ⚠️ All merchant logins, API access, and public routes will be suspended until you manually lift the lockdown.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setLockdownActive(true); setLockdownOpen(false); }}
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
              >
                Confirm Lockdown
              </button>
              <button
                onClick={() => { lockdownActive ? setLockdownActive(false) : setLockdownOpen(false); setLockdownOpen(false); }}
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-4 py-2.5 text-[13px] font-medium text-zinc-300 transition-colors"
              >
                {lockdownActive ? "Lift Lockdown" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 p-6 space-y-4 lg:min-w-0">
            
            {/* Row 1: Top KPIs (Security Score, Active Threats, etc.) */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {topKPIs.map((kpi, i) => (
                <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded p-3 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 mb-1">
                    <span className="material-symbols-outlined text-[14px] shrink-0" style={{ color: kpi.scolor }}>{kpi.icon}</span>
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">{kpi.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white whitespace-nowrap truncate">{loading ? <span className="text-zinc-600">—</span> : kpi.value}</div>
                  <div className="flex items-end justify-between mt-1 gap-2">
                    <div className={`text-[10px] truncate ${kpi.isRed ? 'text-red-500' : 'text-emerald-400'}`}>{kpi.sub}</div>
                    <Spark data={kpi.spark} color={kpi.scolor} />
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Platform Health Overview (Infrastructure Core Retained & Adapted) */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[13px] font-bold text-white">Platform Health Overview</h3>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Real-time status of critical infrastructure and services</div>
                </div>
                <Link href="/monitoring" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {healthCards.map((hc, i) => (
                  <div key={i} className="bg-zinc-800/30 rounded border border-zinc-800/50 p-3 flex flex-col min-w-0 relative">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-[14px]" style={{ color: hc.color }}>{hc.icon}</span>
                      <span className="text-[11px] font-semibold text-zinc-300">{hc.label}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mb-2 truncate">{hc.sub1}</div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="text-xl font-bold text-white">{hc.val}</div>
                        <div className={`text-[10px] font-medium ${hc.sc}`}>{hc.sub2}</div>
                      </div>
                      {hc.donut && (
                        <div className="w-8 h-8 rounded-full border-[3px] border-amber-500/20 border-t-amber-500 shrink-0"></div>
                      )}
                      {!hc.donut && hc.sub2 && (
                        <Spark data={[100,100,100,100,100,100,100]} color="#10b981" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Threat Overview & Global Threat Map */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <h3 className="text-[13px] font-bold text-white mb-4">Threat Overview (24 Hours)</h3>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-2xl font-bold text-white">45.2K</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Total Threats</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-end"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> 5.4%</div>
                    <div className="text-[10px] text-zinc-500 mt-1">vs yesterday</div>
                  </div>
                </div>
                <div className="flex-1 min-h-[160px] mt-2 relative">
                  <AreaChart data={threatData} color="#8b5cf6" />
                </div>
              </div>
              
              <div className="xl:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Global Threat Map</h3>
                  <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded border border-zinc-700 text-[10px] text-zinc-400">
                    Last 24 Hours <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </div>
                </div>
                <div className="flex-1 min-h-[160px] w-full bg-zinc-900/50 rounded relative overflow-hidden flex items-center justify-center border border-zinc-800/50">
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }}></div>
                  
                  {/* Real Map using react-simple-maps */}
                  <ThreatMapWidget />
                  
                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>High</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Medium</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Low</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Info</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Business KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {bizKPIs.map((kpi, i) => (
                <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded p-3 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[14px]" style={{ color: kpi.c }}>{kpi.icon}</span>
                    <span className="text-[11px] font-bold text-zinc-300">{kpi.label}</span>
                  </div>
                  <div className="text-xl font-bold text-white whitespace-nowrap truncate">{kpi.val}</div>
                  <div className={`text-[10px] truncate mt-1 ${kpi.sc}`}>{kpi.sub}</div>
                  <div className="mt-3">
                     <Link href="#" className="text-[10px] text-purple-400 hover:underline">View {kpi.label.split(' ')[0]}</Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 5: RETAINED Revenue Operations */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-12 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col h-full min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Revenue Operations (Retained)</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[10px] text-zinc-400">Total Revenue</span></div>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-2">
                  <div className="text-2xl font-bold text-white">{fmtRev(f.totalRevenue || 1875420)}</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center mb-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> 12.4%</div>
                </div>
                <div className="flex-1 min-h-[160px] mt-2 relative">
                  <AreaChart data={revData} color="#10b981" />
                </div>
              </div>
            </div>

            {/* Row 6: Incidents Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-12 bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Incidents Overview</h3>
                  <Link href="/incidents" className="text-[10px] text-purple-400">View All Incidents</Link>
                </div>
                <div className="flex items-center gap-6 mb-4 px-2">
                  <div className="flex flex-col"><span className="text-xl font-bold text-red-500">04</span><span className="text-[10px] text-zinc-500">Open</span></div>
                  <div className="flex flex-col"><span className="text-xl font-bold text-amber-500">06</span><span className="text-[10px] text-zinc-500">In Progress</span></div>
                  <div className="flex flex-col"><span className="text-xl font-bold text-emerald-500">12</span><span className="text-[10px] text-zinc-500">Resolved (24H)</span></div>
                  <div className="flex flex-col"><span className="text-xl font-bold text-white">22</span><span className="text-[10px] text-zinc-500">Total (24H)</span></div>
                </div>
                <div className="flex-1 overflow-x-auto min-w-0">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800">
                        <th className="pb-2 font-medium pl-2">Incident ID</th>
                        <th className="pb-2 font-medium">Title</th>
                        <th className="pb-2 font-medium">Severity</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium text-right pr-2">Updated At</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-2.5 pl-2 font-mono">INC-2024-0521</td><td className="py-2.5">Unauthorized Admin Access Attempt</td><td className="py-2.5 text-red-500">High</td><td className="py-2.5 text-amber-500">Open</td><td className="py-2.5 text-right text-zinc-500 pr-2">2m ago</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-2.5 pl-2 font-mono">INC-2024-0519</td><td className="py-2.5">Malware Detected in File Upload</td><td className="py-2.5 text-red-500">High</td><td className="py-2.5 text-amber-500">In Progress</td><td className="py-2.5 text-right text-zinc-500 pr-2">15m ago</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-2.5 pl-2 font-mono">INC-2024-0518</td><td className="py-2.5">Multiple Failed Login Attempts</td><td className="py-2.5 text-amber-500">Medium</td><td className="py-2.5 text-amber-500">In Progress</td><td className="py-2.5 text-right text-zinc-500 pr-2">38m ago</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pl-2 font-mono">INC-2024-0517</td><td className="py-2.5">Suspicious Outbound Connection</td><td className="py-2.5 text-amber-500">Medium</td><td className="py-2.5 text-amber-500">Open</td><td className="py-2.5 text-right text-zinc-500 pr-2">1h ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Row 7: RETAINED Quick Actions */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 mb-4">
              <h3 className="text-[13px] font-bold text-white mb-4">Quick Actions (Retained)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                {[
                  { icon: "dashboard", label: "SOC Dashboard", c: "text-purple-400", href: "/soc/dashboard" },
                  { icon: "monitoring", label: "Command Center", c: "text-blue-400", href: "/monitoring" },
                  { icon: "admin_panel_settings", label: "View Audit", c: "text-amber-400", href: "/audit" },
                  { icon: "bug_report", label: "Incidents", c: "text-red-400", href: "/incidents" },
                  { icon: "person_off", label: "Lock Platform", c: "text-red-500", href: "/lockout" },
                  { icon: "store", label: "Merchants", c: "text-emerald-400", href: "/vendors" },
                  { icon: "group", label: "Users", c: "text-cyan-400", href: "/users" },
                  { icon: "settings", label: "Settings", c: "text-zinc-400", href: "/settings" },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="bg-zinc-800/30 hover:bg-zinc-700/50 rounded p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border border-zinc-800 hover:border-zinc-700 min-w-0">
                    <span className={`material-symbols-outlined text-[20px] ${a.c}`}>{a.icon}</span>
                    <span className="text-[10px] text-zinc-300 font-bold text-center truncate w-full">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right Panel (Sidebar) ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-[320px] border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 lg:flex-none">
            
            {/* Critical Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Critical Alerts</h3>
                <Link href="/alerts" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { e: "Unauthorized access attempt blocked", d: "IP: 192.168.0.21", t: "2m ago", c: "text-amber-500", icon: "warning" },
                  { e: "Malicious payload detected", d: "Source: 45.2.19.1", t: "15m ago", c: "text-red-500", icon: "error" },
                  { e: "Brute force login attempt", d: "User: admin", t: "38m ago", c: "text-amber-500", icon: "warning" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-start bg-zinc-800/20 p-2.5 rounded border border-zinc-800/50">
                    <div className={`mt-0.5 ${a.c} shrink-0`}>
                      <span className="material-symbols-outlined text-[16px]">{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-zinc-200 leading-tight mb-1">{a.e}</div>
                      <div className="text-[10px] text-zinc-500 flex justify-between">
                        <span>{a.d}</span>
                        <span className="text-zinc-600">{a.t}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Recent Activity</h3>
                <Link href="/activity" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-4">
                {[
                  { e: "System backup completed", t: "14:22:01", icon: "security" },
                  { e: "SQL Injection Attempt Blocked", t: "14:15:55", icon: "shield" },
                  { e: "Admin Login: Root_User", t: "13:58:30", icon: "person" },
                  { e: "New user registered", t: "13:35:12", icon: "person_add" },
                  { e: "Scheduled scanner initiated", t: "13:30:00", icon: "radar" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-0.5 text-purple-500 shrink-0">
                      <span className="material-symbols-outlined text-[16px]">{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex justify-between items-center border-b border-zinc-800/50 pb-3">
                      <div className="text-[11px] text-zinc-300">{a.e}</div>
                      <div className="text-[10px] text-zinc-600 font-mono shrink-0">{a.t}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Summary Quadrant (Moved to Sidebar) */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
              <h3 className="text-[12px] font-bold text-white mb-4">Platform Summary (Retained)</h3>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1">
                <div className="bg-zinc-800/30 border border-zinc-800 rounded p-2 flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-blue-400 text-[18px] mb-1">store</span>
                  <div className="text-md font-bold text-white">{fmt(s.totalMerchants || 4218)}</div>
                  <div className="text-[8px] text-zinc-400 uppercase tracking-wider">Active Merchants</div>
                </div>
                <div className="bg-zinc-800/30 border border-zinc-800 rounded p-2 flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-purple-400 text-[18px] mb-1">group</span>
                  <div className="text-md font-bold text-white">{fmt(s.totalUsers || 23842)}</div>
                  <div className="text-[8px] text-zinc-400 uppercase tracking-wider">Registered Users</div>
                </div>
                <div className="bg-zinc-800/30 border border-zinc-800 rounded p-2 flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px] mb-1">task_alt</span>
                  <div className="text-md font-bold text-white">{fmt(s.totalOrders || 12984)}</div>
                  <div className="text-[8px] text-zinc-400 uppercase tracking-wider">Orders Fulfilled</div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded p-2 flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-red-400 text-[18px] mb-1">security</span>
                  <div className="text-md font-bold text-white">{data.threatEvents.length || 18}</div>
                  <div className="text-[8px] text-zinc-400 uppercase tracking-wider">Critical Threats</div>
                </div>
              </div>
            </div>

            {/* Top Attack Vectors (Moved to Sidebar) */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Top Attack Vectors</h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 mb-3 shrink-0">
                  {/* Simulated Donut Chart using borders */}
                  <div className="absolute inset-0 rounded-full border-[10px] border-zinc-800"></div>
                  <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-red-500 border-r-amber-500 border-b-emerald-500 border-l-blue-500 rotate-45 opacity-80"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold text-white leading-none mb-1">45.2K</div>
                    <div className="text-[8px] text-zinc-500 leading-none">Total Attacks</div>
                  </div>
                </div>
                <div className="w-full space-y-1.5 mt-1">
                  <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><span className="text-zinc-300">SQL Injection</span></div><span className="text-zinc-400">28%</span></div>
                  <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span className="text-zinc-300">Brute Force</span></div><span className="text-zinc-400">18%</span></div>
                  <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span className="text-zinc-300">XSS Attempts</span></div><span className="text-zinc-400">12%</span></div>
                  <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><span className="text-zinc-300">Unauthorized Access</span></div><span className="text-zinc-400">9%</span></div>
                  <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span><span className="text-zinc-300">Malware</span></div><span className="text-zinc-400">7%</span></div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
