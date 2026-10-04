"use client";

import { useEffect, useState, useCallback } from "react";
import { adminRequest } from "../../../lib/api";
import Link from "next/link";

const ago = (iso) => {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime(), s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString("en-IN"));

// ── Sparkline ────────────────────────────────────────────────────────────────
function Spark({ data = [], color = "#ef4444" }) {
  if (!data.length) return <div className="h-8 w-24" />;
  const max = Math.max(...data, 1), w = 120, h = 32;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible opacity-80 mt-2">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Bar Chart (Alerts by Hour) ───────────────────────────────────────────────
function BarChart({ data = [], color = "#8b5cf6" }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between h-16 gap-0.5 mt-2">
      {data.map((v, i) => (
        <div key={i} className="w-full rounded-t-sm" style={{ height: `${(v / max) * 100}%`, background: color }} />
      ))}
    </div>
  );
}

// ── Donut Chart ──────────────────────────────────────────────────────────────
function Donut({ centerText, items = [] }) {
  let offset = 0;
  const total = items.reduce((sum, i) => sum + i.value, 0) || 1;
  return (
    <div className="relative w-20 h-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
        <circle cx="40" cy="40" r="32" fill="none" stroke="#1f2937" strokeWidth="12" />
        {items.map((it, i) => {
          const dash = (it.value / total) * 201; // 2 * PI * 32 ~= 201
          const strokeOffset = -offset;
          offset += dash;
          return (
            <circle key={i} cx="40" cy="40" r="32" fill="none" stroke={it.color} strokeWidth="12" strokeDasharray={`${dash} 201`} strokeDashoffset={strokeOffset} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-white leading-tight">{centerText}</span>
        <span className="text-[7px] text-zinc-400">Total</span>
      </div>
    </div>
  );
}

// ── Threat Map SVG ────────────────────────────────────────────────────────────
function ThreatMap() {
  return (
    <div className="relative w-full flex-1 min-h-[260px] bg-[#0a0f1a] rounded-lg overflow-hidden border border-zinc-800/80 flex items-center justify-center">
      {/* Authentic World Map Background */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: "url('/world-map.svg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "invert(1) brightness(1.5)"
        }}
      />
      
      {/* Attack Paths and Nodes */}
      <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 z-10">
        
        {/* Glowing Nodes */}
        <circle cx="700" cy="150" r="10" fill="#f59e0b" style={{ filter: "drop-shadow(0 0 12px #f59e0b)" }}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="220" r="12" fill="#ef4444" style={{ filter: "drop-shadow(0 0 15px #ef4444)" }}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="500" cy="300" r="8" fill="#3b82f6" style={{ filter: "drop-shadow(0 0 10px #3b82f6)" }} />
        <circle cx="850" cy="250" r="6" fill="#06b6d4" />
        
        {/* Animated Attack Arcs */}
        <path d="M 250 220 Q 450 50 700 150" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 6" opacity="0.8">
          <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M 500 300 Q 600 100 700 150" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M 250 220 Q 350 400 500 300" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M 700 150 Q 750 200 850 250" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2.5s" repeatCount="indefinite" />
        </path>

        {/* Pulse rings */}
        <circle cx="250" cy="220" r="25" fill="none" stroke="#ef4444" strokeWidth="2">
          <animate attributeName="r" from="12" to="40" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="700" cy="150" r="20" fill="none" stroke="#f59e0b" strokeWidth="2">
          <animate attributeName="r" from="10" to="35" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex gap-4 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-700/50 backdrop-blur-md">
        {[["Critical", "#ef4444"], ["High", "#f59e0b"], ["Medium", "#3b82f6"], ["Info", "#06b6d4"]].map(([l, c]) => (
          <div key={l} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shadow-lg" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
            <span className="text-[10px] font-bold text-zinc-300">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SOCDashboard() {
  const [data, setData] = useState({
    events: [], incidents: [], ips: [], kpis: null, userRisk: [], sparklines: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        adminRequest("/threat/events?limit=20"),
        adminRequest("/incidents?limit=10"),
        adminRequest("/security/suspicious-ips?limit=5"),
        adminRequest("/soc/dashboard-kpis"),
        adminRequest("/soc/user-risk?limit=5"),
      ]);
      const get = (idx) => results[idx].status === 'fulfilled' ? results[idx].value : null;
      const kpisData = get(3);
      const userRiskData = get(4);
      setData({
        events: get(0)?.events || [],
        incidents: get(1)?.incidents || [],
        ips: get(2)?.ips || [],
        kpis: kpisData?.kpis || null,
        userRisk: userRiskData?.users?.slice(0, 5) || [],
        sparklines: kpisData?.sparklines || {},
      });
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Build KPI cards from real data (fall back to "—" while loading)
  const kpis = [
    {
      icon: "warning", label: "Critical Alerts",
      value: data.kpis ? String(data.kpis.criticalAlerts.value) : "—",
      sub: data.kpis ? data.kpis.criticalAlerts.sub : "Loading...",
      c: "text-red-400", bg: "bg-red-500/10", b: "border-red-500/20", sc: "#ef4444",
      sp: data.sparklines?.criticalAlerts || []
    },
    {
      icon: "radar", label: "High Severity Alerts",
      value: data.kpis ? String(data.kpis.highAlerts.value) : "—",
      sub: data.kpis ? data.kpis.highAlerts.sub : "Loading...",
      c: "text-amber-400", bg: "bg-amber-500/10", b: "border-amber-500/20", sc: "#f59e0b",
      sp: data.sparklines?.highAlerts || []
    },
    {
      icon: "emergency", label: "Open Incidents",
      value: data.kpis ? String(data.kpis.openIncidents.value) : "—",
      sub: data.kpis ? data.kpis.openIncidents.sub : "Loading...",
      c: "text-orange-400", bg: "bg-orange-500/10", b: "border-orange-500/20", sc: "#f97316",
      sp: []
    },
    {
      icon: "travel_explore", label: "Threat Intelligence",
      value: data.kpis ? String(data.kpis.recentEvents.value) : "—",
      sub: data.kpis ? data.kpis.recentEvents.sub : "Loading...",
      c: "text-blue-400", bg: "bg-blue-500/10", b: "border-blue-500/20", sc: "#3b82f6",
      sp: []
    },
    {
      icon: "group", label: "High Risk Users",
      value: data.kpis ? String(data.kpis.highRiskUsers.value) : "—",
      sub: data.kpis ? data.kpis.highRiskUsers.sub : "Loading...",
      c: "text-purple-400", bg: "bg-purple-500/10", b: "border-purple-500/20", sc: "#a855f7",
      sp: []
    },
    {
      icon: "verified_user", label: "Security Score",
      value: data.kpis ? `${data.kpis.securityScore.value}%` : "—",
      sub: data.kpis ? data.kpis.securityScore.sub : "Loading...",
      c: "text-emerald-400", bg: "bg-emerald-500/10", b: "border-emerald-500/20", sc: "#10b981",
      sp: []
    },
    {
      icon: "shield", label: "Blocked IPs",
      value: data.kpis ? String(data.kpis.blockedIps.value) : "—",
      sub: data.kpis ? data.kpis.blockedIps.sub : "Loading...",
      c: "text-emerald-400", bg: "bg-emerald-500/10", b: "border-emerald-500/20", sc: "#10b981",
      sp: []
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Security Operations Center
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Monitor threats, investigate incidents, analyze security posture.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            Last 24 Hours <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span> Refresh
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400">
            <span className="material-symbols-outlined text-[14px]">dns</span> Environment: <span className="text-emerald-400">Production</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs">
            Detection Engine: <span className="text-emerald-400 font-bold">Healthy</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Main Content ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Row 1: Top KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-4">
            {kpis.map((kpi, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`material-symbols-outlined text-[16px] ${kpi.c}`}>{kpi.icon}</span>
                  <span className="text-[10px] font-semibold text-zinc-300">{kpi.label}</span>
                </div>
                <div className="text-xl font-bold text-white">{kpi.value}</div>
                <div className={`text-[9px] mt-0.5 ${kpi.sub.includes('-') ? 'text-red-400' : 'text-emerald-400'}`}>{kpi.sub}</div>
                <div className="mt-auto"><Spark data={kpi.sp} color={kpi.sc} /></div>
              </div>
            ))}
          </div>

          {/* Row 2: Live Events */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Live Security Events</h3>
                <Link href="/events" className="text-[10px] text-purple-400">View All Events</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[9px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-2 font-medium">Time</th>
                      <th className="text-left pb-2 font-medium">Source</th>
                      <th className="text-left pb-2 font-medium">Event</th>
                      <th className="text-left pb-2 font-medium">Severity</th>
                      <th className="text-left pb-2 font-medium">User / IP</th>
                      <th className="text-left pb-2 font-medium">Country</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {data.events && data.events.length > 0 ? data.events.map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-2 text-zinc-400 whitespace-nowrap">{ago(r.createdAt)}</td>
                        <td className="py-2 text-zinc-300 whitespace-nowrap">{r.details?.source || "System"}</td>
                        <td className="py-2 text-zinc-200 whitespace-nowrap">{r.eventType}</td>
                        <td className="py-2 font-bold whitespace-nowrap"><span className={r.severity === 'CRITICAL' ? 'text-red-500' : r.severity === 'WARN' ? 'text-amber-500' : 'text-blue-500'}>{r.severity}</span></td>
                        <td className="py-2 text-zinc-400 font-mono whitespace-nowrap">{r.ip}</td>
                        <td className="py-2 text-[12px] whitespace-nowrap">{r.details?.country || "—"}</td>
                      </tr>
                    )) : <tr><td colSpan="6" className="py-4 text-center text-zinc-500">No live events</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 3: Threat Map & Threat Intel */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 xl:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Global Threat Map</h3>
                <Link href="/map" className="text-[10px] text-purple-400">View Full Map</Link>
              </div>
              <ThreatMap />
            </div>

            <div className="col-span-12 xl:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Threat Intelligence</h3>
                <Link href="/intel" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { i: "public", l: "Malicious IPs", v: "532", c: "text-blue-400" },
                  { i: "language", l: "Malicious Domains", v: "312", c: "text-blue-400" },
                  { i: "bug_report", l: "Malware Hashes", v: "1,208", c: "text-blue-400" },
                  { i: "security_update_warning", l: "CVE Feed (Updated)", v: "152", c: "text-blue-400" },
                  { i: "person_alert", l: "Threat Actors", v: "27", c: "text-blue-400" },
                  { i: "visibility", l: "Zero-day Watch", v: "3", c: "text-blue-400" },
                  { i: "check_circle", l: "IOC Updates (24h)", v: "148", c: "text-blue-400" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] border-b border-zinc-800/50 pb-2 last:border-0">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className={`material-symbols-outlined text-[14px] ${r.c}`}>{r.i}</span> {r.l}
                    </div>
                    <div className="text-zinc-400">{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Timeline & MITRE, User Risk */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Attack Timeline</h3>
                  <Link href="/timeline" className="text-[10px] text-purple-400">View Full Timeline</Link>
                </div>
                <div className="relative flex justify-between items-center px-4 mt-6">
                  <div className="absolute left-8 right-8 h-[1px] bg-red-900/50 top-1.5" />
                  {data.events.length > 0
                    ? data.events.slice(0, 5).map((ev, i) => (
                      <div key={i} className="flex flex-col items-center relative z-10 w-16">
                        <div className={`w-3 h-3 rounded-full mb-2 border-[2px] border-[#0d0f1a] ${i === 0 ? 'bg-red-500 ring-4 ring-red-500/20' : ev.severity === 'CRITICAL' ? 'bg-red-500/60' : 'bg-amber-500/60'}`} />
                        <span className="text-[9px] font-mono text-zinc-400">{ago(ev.createdAt)}</span>
                        <span className="text-[8px] text-zinc-300 text-center leading-tight mt-1">{ev.eventType.replace(/_/g,' ').slice(0, 20)}</span>
                      </div>
                    ))
                    : [
                      { t:"10:14", ev:"Brute Force Detected" },
                      { t:"10:15", ev:"Credential Stuffing" },
                      { t:"10:18", ev:"Suspicious Login" },
                      { t:"10:21", ev:"Privilege Escalation" },
                      { t:"10:25", ev:"Incident Created", active:true },
                    ].map((node, i) => (
                      <div key={i} className="flex flex-col items-center relative z-10 w-16">
                        <div className={`w-3 h-3 rounded-full mb-2 border-[2px] border-[#0d0f1a] ${node.active ? 'bg-red-500 ring-4 ring-red-500/20' : 'bg-red-500/60'}`} />
                        <span className="text-[9px] font-mono text-zinc-400">{node.t}</span>
                        <span className="text-[8px] text-zinc-300 text-center leading-tight mt-1">{node.ev}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">MITRE ATT&CK Matrix</h3>
                  <Link href="/matrix" className="text-[10px] text-purple-400">View Full Matrix</Link>
                </div>
                <div className="grid grid-cols-11 gap-0.5 text-[7px] text-center text-zinc-500 mt-2">
                  <div className="rotate-0 pb-1">Recon</div><div className="rotate-0 pb-1">Init. Access</div><div className="rotate-0 pb-1">Execution</div><div className="rotate-0 pb-1">Persist.</div><div className="rotate-0 pb-1">Priv. Esc.</div><div className="rotate-0 pb-1">Defense Evasion</div><div className="rotate-0 pb-1">Cred. Access</div><div className="rotate-0 pb-1">Discovery</div><div className="rotate-0 pb-1">Lateral Move.</div><div className="rotate-0 pb-1">Collection</div><div className="rotate-0 pb-1">Impact</div>
                  {/* Grid cells simulation */}
                  {Array.from({length: 33}).map((_, i) => {
                    let c = "bg-zinc-800/30", t = "";
                    if (i===0) { c = "bg-red-500"; t="5"; }
                    if (i===13) { c = "bg-orange-500"; t="2"; }
                    if (i===14) { c = "bg-orange-500"; t="1"; }
                    if (i===26) { c = "bg-orange-500"; t="1"; }
                    if (i===17) { c = "bg-red-500"; t="4"; }
                    if (i===19) { c = "bg-orange-500"; t="2"; }
                    return <div key={i} className={`h-6 rounded-sm flex items-center justify-center font-bold text-white ${c}`}>{t}</div>
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">User Risk (Top 5)</h3>
                <Link href="/users" className="text-[10px] text-purple-400">View All Users</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-1.5 font-medium">User</th>
                    <th className="text-left pb-1.5 font-medium">Risk Score</th>
                    <th className="text-left pb-1.5 font-medium">Reason</th>
                    <th className="text-center pb-1.5 font-medium">Level</th>
                    <th className="text-left pb-1.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {data.userRisk.length > 0
                    ? data.userRisk.map((u, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-2.5 text-zinc-300 truncate max-w-[90px]">{u.name || u.email?.split('@')[0] || '—'}</td>
                        <td className="py-2.5"><span className="bg-red-500/20 text-red-500 border border-red-500/30 rounded px-1.5 py-0.5 font-bold text-[9px]">{u.score}</span></td>
                        <td className="py-2.5 text-zinc-400 truncate max-w-[80px]">{u.factors?.split(',')[0]}</td>
                        <td className="py-2.5 text-center"><span className={`text-[9px] font-bold ${u.level === 'High' ? 'text-red-500' : u.level === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>{u.level}</span></td>
                        <td className="py-2.5 text-zinc-500">{u.isLocked ? '🔒 Locked' : 'Active'}</td>
                      </tr>
                    ))
                    : [
                      { u: "root_admin", s: "96", r: "Multiple failed logins", mfa: false, l: "2m ago" },
                      { u: "john.doe", s: "88", r: "Suspicious locations", mfa: true, l: "15m ago" },
                      { u: "sarah.miller", s: "82", r: "Unusual data access", mfa: true, l: "1h ago" },
                      { u: "michael.brown", s: "78", r: "Brute force attempt", mfa: false, l: "2h ago" },
                      { u: "admin_test", s: "75", r: "Privilege escalation", mfa: false, l: "3h ago" },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-2.5 text-zinc-300">{r.u}</td>
                        <td className="py-2.5"><span className="bg-red-500/20 text-red-500 border border-red-500/30 rounded px-1.5 py-0.5 font-bold text-[9px]">{r.s}</span></td>
                        <td className="py-2.5 text-zinc-400">{r.r}</td>
                        <td className="py-2.5 text-center"><span className={`material-symbols-outlined text-[12px] ${r.mfa ? 'text-emerald-500' : 'text-red-500'}`}>{r.mfa ? 'check' : 'close'}</span></td>
                        <td className="py-2.5 text-zinc-500">{r.l}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* Row 5: Analytics & SIEM */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 xl:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Detection Analytics</h3>
                <Link href="/analytics" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div className="w-1/3 pr-4">
                  <div className="text-[10px] text-zinc-400 mb-1">Alerts by Hour</div>
                  <div className="text-xl font-bold text-white">1,248</div>
                  <BarChart data={[20,40,30,50,45,60,80,50,40,65,70,85,90,40,30]} color="#8b5cf6" />
                </div>
                <div className="w-1/3 px-2 flex flex-col items-center">
                  <div className="text-[9px] text-zinc-400 mb-2 w-full text-left">Alerts by Severity</div>
                  <div className="flex items-center gap-2">
                    <Donut centerText="1,248" items={[{value:18, color:"#ef4444"},{value:32, color:"#f59e0b"},{value:34, color:"#3b82f6"},{value:16, color:"#06b6d4"}]} />
                    <div className="flex flex-col gap-1 text-[8px] text-zinc-400">
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500" /> Critical <span className="text-white ml-auto">18%</span></div>
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500" /> High <span className="text-white ml-auto">32%</span></div>
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500" /> Medium <span className="text-white ml-auto">34%</span></div>
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500" /> Low <span className="text-white ml-auto">16%</span></div>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 px-2 flex flex-col items-center">
                  <div className="text-[9px] text-zinc-400 mb-2 w-full text-left">Alerts by Source</div>
                  <div className="flex items-center gap-2">
                    <Donut centerText="1,248" items={[{value:38, color:"#a855f7"},{value:22, color:"#f97316"},{value:20, color:"#3b82f6"},{value:15, color:"#10b981"},{value:5, color:"#64748b"}]} />
                    <div className="flex flex-col gap-1 text-[8px] text-zinc-400">
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-500" /> WAF <span className="text-white ml-auto">38%</span></div>
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-orange-500" /> Firewall <span className="text-white ml-auto">22%</span></div>
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500" /> Auth <span className="text-white ml-auto">20%</span></div>
                      <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500" /> Cloud <span className="text-white ml-auto">15%</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-3 border-t border-zinc-800/50">
                {[
                  { l: "False Positive Rate", v: "5.8%", s: "-1.2% vs yesterday", sc: "text-emerald-400" },
                  { l: "Detection Success", v: "94.2%", s: "+3.6% vs yesterday", sc: "text-emerald-400" },
                  { l: "Avg. Response Time", v: "18m 42s", s: "-3m vs yesterday", sc: "text-emerald-400" },
                  { l: "Avg. Investigation Time", v: "1h 32m", s: "-12m vs yesterday", sc: "text-emerald-400" },
                  { l: "SLA Compliance", v: "92.1%", s: "+4.3% vs yesterday", sc: "text-emerald-400" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="text-[8px] text-zinc-400 mb-1">{m.l}</div>
                    <div className="text-base font-bold text-white mb-0.5">{m.v}</div>
                    <div className={`text-[8px] ${m.sc}`}>{m.s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">SIEM Sources Health</h3>
                <Link href="/siem" className="text-[10px] text-purple-400">View All Sources</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { n: "Firewall", i: "security" }, { n: "Cloudflare", i: "cloud" },
                  { n: "WAF", i: "shield" }, { n: "Nginx", i: "dns" },
                  { n: "PostgreSQL", i: "database" }, { n: "Redis", i: "storage" },
                  { n: "Node Backend", i: "terminal" }, { n: "API Gateway", i: "router" },
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-800/40 border border-zinc-800/60 rounded-lg p-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-zinc-400">{s.i}</span>
                    <div>
                      <div className="text-[10px] font-semibold text-white">{s.n}</div>
                      <div className="flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[8px] text-emerald-400">Healthy</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Incident Queue */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col overflow-x-auto">
              <div className="min-w-fit">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Incident Queue</h3>
                  <Link href="/incidents" className="text-[10px] text-purple-400">View All Incidents</Link>
                </div>
                <table className="w-full text-[10px] mb-2">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-2 font-medium">Incident ID</th>
                      <th className="text-left pb-2 font-medium">Title</th>
                      <th className="text-left pb-2 font-medium">Severity</th>
                      <th className="text-left pb-2 font-medium">Status</th>
                      <th className="text-left pb-2 font-medium">Assigned To</th>
                      <th className="text-left pb-2 font-medium">Created</th>
                      <th className="text-left pb-2 font-medium">SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {data.incidents && data.incidents.length > 0 ? data.incidents.map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-2.5 text-zinc-400 font-mono">{r.id.substring(0,8).toUpperCase()}</td>
                        <td className="py-2.5 text-zinc-300">{r.title}</td>
                        <td className="py-2.5 font-bold"><span className={['CRITICAL','HIGH'].includes(r.severity) ? 'text-red-500' : 'text-amber-500'}>{r.severity}</span></td>
                        <td className="py-2.5"><span className={['OPEN','IN_PROGRESS'].includes(r.status) ? 'text-amber-500' : 'text-emerald-500'}>{r.status}</span></td>
                        <td className="py-2.5 text-zinc-400">System Admin</td>
                        <td className="py-2.5 text-zinc-500">{ago(r.createdAt)}</td>
                        <td className="py-2.5 font-bold text-emerald-500">OK</td>
                      </tr>
                    )) : <tr><td colSpan="7" className="py-4 text-center text-zinc-500">No active incidents</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <button className="bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded py-2 text-xs font-bold hover:bg-purple-600/40">Investigate</button>
                <button className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded py-2 text-xs font-bold hover:bg-blue-600/40">Assign</button>
                <button className="bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded py-2 text-xs font-bold hover:bg-amber-600/40">Escalate</button>
                <button className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded py-2 text-xs font-bold hover:bg-emerald-600/40">Resolve</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ─────────────────────────────────────────────────── */}
        <div className="w-72 xl:w-80 border-l border-zinc-800 bg-zinc-900/40 flex flex-col overflow-y-auto p-4 gap-5 shrink-0 hidden lg:flex">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Critical Alerts</h3>
              <Link href="/alerts" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-3">
              {data.events.filter(e => e.severity === 'CRITICAL' || e.severity === 'WARN').slice(0, 4).length > 0
                ? data.events.filter(e => e.severity === 'CRITICAL' || e.severity === 'WARN').slice(0, 4).map((ev, i) => (
                  <div key={i} className="flex gap-2">
                    <div className={`mt-0.5 ${ev.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-zinc-200 leading-tight">{ev.eventType.replace(/_/g, ' ')}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">IP: {ev.ip || '—'}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] ${ev.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>{ev.severity}</span>
                      <span className="text-[8px] text-zinc-600">{ago(ev.createdAt)}</span>
                    </div>
                  </div>
                ))
                : [
                  { e: "Unauthorized access attempt blocked", d: "IP: 192.168.0.21", t: "2m ago", c: "text-red-500", i: "warning", badge: "High" },
                  { e: "Malicious payload detected", d: "Source: 45.2.19.1", t: "15m ago", c: "text-red-500", i: "error", badge: "High" },
                  { e: "Brute force login attempt", d: "User: admin", t: "38m ago", c: "text-amber-500", i: "warning", badge: "Medium" },
                  { e: "Suspicious privilege escalation", d: "User: root_admin", t: "1h ago", c: "text-red-500", i: "warning", badge: "High" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <div className={`mt-0.5 ${a.c}`}>
                      <span className="material-symbols-outlined text-[14px]">{a.i}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-zinc-200 leading-tight">{a.e}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{a.d}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] ${a.c}`}>{a.badge}</span>
                      <span className="text-[8px] text-zinc-600">{a.t}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Recent Threat Feed</h3>
              <Link href="/feed" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-3">
              {data.events.slice(0, 5).length > 0
                ? data.events.slice(0, 5).map((ev, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <span className="material-symbols-outlined text-[12px] text-zinc-500">security</span>
                      <span className="text-[10px] font-mono truncate max-w-[100px]">{ev.eventType.replace(/_/g,' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] ${ev.severity === 'CRITICAL' ? 'text-red-500' : ev.severity === 'WARN' ? 'text-amber-500' : 'text-blue-400'}`}>{ev.severity}</span>
                      <span className="text-[8px] text-zinc-600 w-10 text-right">{ago(ev.createdAt)}</span>
                    </div>
                  </div>
                ))
                : [
                  { i: "security", l: "CVE-2024-3094", b: "Critical", bc: "text-red-500", t: "5m ago" },
                  { i: "security", l: "CVE-2024-27198", b: "High", bc: "text-red-500", t: "18m ago" },
                  { i: "bug_report", l: "Malware: AgentTesla", b: "High", bc: "text-red-500", t: "42m ago" },
                  { i: "public", l: "IOC: 185.220.101.23", b: "Medium", bc: "text-amber-500", t: "1h ago" },
                  { i: "public", l: "IOC: malicious-domain.com", b: "Medium", bc: "text-amber-500", t: "1h ago" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <span className={`material-symbols-outlined text-[12px] text-zinc-500`}>{r.i}</span>
                      <span className="text-[10px] font-mono">{r.l}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] ${r.bc}`}>{r.b}</span>
                      <span className="text-[8px] text-zinc-600 w-8 text-right">{r.t}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">SOC Tasks</h3>
              <Link href="/tasks" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2.5">
              {[
                { l: "Investigate brute force alerts", c: "3" },
                { l: "Review high risk users", c: "5" },
                { l: "Validate new IOC feed", c: "2" },
                { l: "Check open incidents", c: "4" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="material-symbols-outlined text-[14px]">check_box_outline_blank</span> {r.l}
                  </div>
                  <div className="text-zinc-300 font-bold">{r.c}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3">On-Call Engineer</h3>
            <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-zinc-400">person</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Arjun Nair</div>
                  <div className="text-[9px] text-zinc-400">Security Engineer</div>
                  <div className="text-[8px] text-zinc-500 flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[10px]">call</span> +91 98765 43210</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold">On Duty</span>
                <span className="material-symbols-outlined text-[16px] text-emerald-400 bg-emerald-500/10 p-1 rounded-full cursor-pointer hover:bg-emerald-500/20">phone_in_talk</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Recent Investigations</h3>
              <Link href="/investigations" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-1.5 font-medium">Title</th>
                    <th className="text-left pb-1.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {[
                    { t: "Brute force attack", st: "Open", stc: "text-red-500" },
                    { t: "SQL injection attempt", st: "Open", stc: "text-red-500" },
                    { t: "Malware upload analysis", st: "In Progress", stc: "text-amber-500" },
                    { t: "Suspicious login", st: "In Progress", stc: "text-amber-500" },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 text-zinc-300 truncate max-w-[120px]">{r.t}</td>
                      <td className="py-2.5 font-bold"><span className={r.stc}>{r.st}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <h3 className="text-sm font-bold text-red-400 mb-1">Emergency Actions</h3>
              <div className="text-[9px] text-zinc-400 mb-4">Trigger immediate security response</div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-[11px] shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all">
                Activate Incident Response
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
