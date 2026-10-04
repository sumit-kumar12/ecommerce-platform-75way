"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { adminRequest } from "../../../lib/api";
import {
  Globe, RefreshCw, Loader2, AlertTriangle,
  Radar, Target, Crosshair, Zap, Activity,
  ShieldAlert, Fingerprint, ServerCrash
} from "lucide-react";

// --- Helpers & Constants ---
const TACTICS_MAPPING = {
  "Brute Force": "Credential Access",
  "Sql Injection": "Initial Access",
  "Xss": "Initial Access",
  "Unauthorized Access": "Initial Access",
  "Malware Detected": "Execution",
  "Anomalous Traffic": "Command & Control",
  "Data Exfiltration": "Exfiltration",
  "Privilege Escalation": "Privilege Escalation",
  "Suspicious Login": "Credential Access",
  "Ransomware": "Impact",
  "Ddos": "Impact",
  "Phishing": "Initial Access",
  "Lateral Movement": "Lateral Movement",
  "Defense Evasion": "Defense Evasion",
  "Persistence": "Persistence",
  "Discovery": "Discovery",
};

const MITRE_MATRIX_BASE = {
  "Initial Access": ["Phishing", "Valid Accounts", "Exploit Public-Facing Application"],
  "Execution": ["Command and Scripting Interpreter", "Scheduled Task", "User Execution"],
  "Persistence": ["Create Account", "Modify System Process", "Event Triggered Execution"],
  "Privilege Escalation": ["Abuse Elevation Control", "Valid Accounts", "Logon Autostart Execution"],
  "Defense Evasion": ["Clear Event Logs", "Obfuscated Files", "Hide Artifacts"],
  "Credential Access": ["Brute Force", "OS Credential Dumping", "Password Stores"],
  "Discovery": ["Network Service Scanning", "System Info Discovery", "Account Discovery"],
  "Lateral Movement": ["Remote Services", "Lateral Tool Transfer", "Session Hijacking"],
  "Collection": ["Data from Local System", "Automated Collection", "Archive Collected Data"],
  "Command & Control": ["Anomalous Traffic", "Application Layer Protocol", "Web Service"],
  "Exfiltration": ["Data Exfiltration", "Exfiltration Over Web Service", "Automated Exfiltration"],
  "Impact": ["Ransomware", "Data Destruction", "Endpoint Denial of Service"]
};

const ago = (date) => {
  if (!date) return "—";
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function ThreatIntelligencePage() {
  const [data, setData] = useState({
    cases: [], events: [], analytics: null, geolocations: [],
    topIps: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [casesRes, eventsRes, analyticsRes, geoRes] = await Promise.allSettled([
        adminRequest("/soc/cases?limit=100"),
        adminRequest("/threat/events?limit=50"),
        adminRequest("/soc/analytics/overview"),
        adminRequest("/soc/geolocation")
      ]);

      const cases = casesRes.status === "fulfilled" ? (casesRes.value?.cases || casesRes.value?.data || []) : [];
      const events = eventsRes.status === "fulfilled" ? (eventsRes.value?.events || eventsRes.value?.data || []) : [];
      const analytics = analyticsRes.status === "fulfilled" ? (analyticsRes.value?.data || analyticsRes.value || null) : null;
      let geolocations = [];
      if (geoRes.status === "fulfilled") {
         geolocations = geoRes.value?.data || geoRes.value || [];
         if (!Array.isArray(geolocations)) {
           geolocations = geolocations.markers || [];
         }
      }

      // Top IPs
      const ipCounts = {};
      events.forEach(e => { 
        if (e.ip) {
           const pts = e.points || (e.severity === 'CRITICAL' ? 10 : e.severity === 'WARN' ? 5 : 1);
           ipCounts[e.ip] = (ipCounts[e.ip] || 0) + pts;
        }
      });
      const topIps = Object.entries(ipCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([ip, score]) => ({ ip, score }));

      setData({ cases, events, analytics, geolocations, topIps });
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message || "Failed to load threat intelligence");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  // Derived Matrix
  const mitreMatrix = useMemo(() => {
    const matrix = JSON.parse(JSON.stringify(MITRE_MATRIX_BASE));
    const detected = {};
    
    data.events.forEach(e => {
       const rawType = e.eventType || "Unknown";
       const normType = rawType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
       
       let targetTactic = TACTICS_MAPPING[normType] || "Command & Control";
       if (targetTactic === "Command and Control") targetTactic = "Command & Control";
       
       if (matrix[targetTactic]) {
         if (!matrix[targetTactic].includes(normType)) {
           matrix[targetTactic].unshift(normType);
         }
       } else {
           // fallback if somehow missed
           if (!matrix["Command & Control"].includes(normType)) {
               matrix["Command & Control"].unshift(normType);
           }
       }
       detected[normType] = (detected[normType] || 0) + 1;
    });
    
    return { matrix, detected };
  }, [data.events]);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans pb-10">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />

      {/* Header */}
      <div className="bg-[#0a0c14] border-b border-[#1e2235] px-8 py-5 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <Radar className="w-4 h-4 text-red-500 animate-spin-slow" style={{ animationDuration: '4s' }} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight uppercase">Threat Intelligence Center</h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold tracking-widest">LIVE</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Real-time global threat landscape & IOC analysis</p>
          </div>
          <div className="flex items-center gap-4">
            {lastRefresh && (
              <div className="text-[10px] font-mono text-gray-500 flex flex-col items-end">
                <span>SYSTEM SYNC</span>
                <span className="text-cyan-500">{lastRefresh.toLocaleTimeString()}</span>
              </div>
            )}
            <button onClick={() => { setLoading(true); load(); }} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-8 py-6 space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" /> [SYSTEM_ERROR] {error}
          </div>
        )}

        {/* Top KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Active Threats", value: data.events.length, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
             { label: "Unique Attacker IPs", value: data.topIps.length, icon: Globe, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
             { label: "Detected Techniques", value: Object.keys(mitreMatrix.detected).length, icon: Fingerprint, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
             { label: "Impacted Assets", value: data.geolocations.length, icon: ServerCrash, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" }
           ].map((kpi, i) => (
             <div key={i} className={`rounded-xl border ${kpi.border} bg-[#0a0c14] p-5 relative overflow-hidden group`}>
               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-${kpi.color.replace('text-', '')}/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:scale-150 duration-700`} />
               <div className="flex items-center justify-between mb-3 relative z-10">
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${kpi.color}`}>{kpi.label}</span>
                 <kpi.icon className={`w-4 h-4 ${kpi.color} opacity-70`} />
               </div>
               <div className="relative z-10">
                 {loading ? <div className="h-8 w-16 bg-white/5 rounded animate-pulse" /> :
                   <div className="text-3xl font-mono font-bold text-white">{kpi.value.toLocaleString()}</div>}
               </div>
             </div>
           ))}
        </div>

        {/* Hero Section: Map & Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Threat Map */}
          <div className="lg:col-span-2 relative w-full h-[500px] bg-[#050508] border border-[#1e2235] rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('/world-map.svg')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
            
            {/* Grid overlay for tech look */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />

            {loading ? (
              <Loader2 className="w-10 h-10 text-red-500 animate-spin relative z-20" />
            ) : (
              <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                {data.geolocations.map((loc, i) => {
                  if (!loc.coordinates) return null;
                  const [lng, lat] = loc.coordinates;
                  const x = (lng + 180) * (1000 / 360);
                  const y = (90 - lat) * (500 / 180);
                  const isCritical = loc.severity === 'CRITICAL' || i % 4 === 0;
                  const color = isCritical ? '#ef4444' : '#f59e0b';
                  
                  return (
                    <g key={i} transform={`translate(${x}, ${y})`}>
                      <circle r="3" fill={color} className="animate-pulse" style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
                      <circle r="12" fill="none" stroke={color} strokeWidth="1" className="animate-ping opacity-60" style={{ animationDuration: `${2 + (i%3)}s` }} />
                      {isCritical && <circle r="25" fill="none" stroke={color} strokeWidth="0.5" className="animate-ping opacity-30" style={{ animationDuration: `4s` }} />}
                      
                      {/* Connection lines to center if critical to look cool */}
                      {isCritical && (
                         <line x1="0" y1="0" x2={500-x} y2={250-y} stroke={color} strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" className="animate-pulse" />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            <div className="absolute top-5 left-5 z-20 flex flex-col gap-3 pointer-events-none">
              <div className="px-3 py-1.5 bg-black/60 border border-white/10 rounded backdrop-blur-md flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest">GLOBAL SENSORS</span>
              </div>
              <div className="px-3 py-2 bg-black/60 border border-white/10 rounded backdrop-blur-md flex flex-col min-w-[120px]">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">Active Nodes</span>
                  <span className="text-xl font-mono text-white font-bold">{data.geolocations.length}</span>
              </div>
            </div>
            
            <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-1 pointer-events-none text-right">
               <span className="text-[9px] font-mono text-red-500/50 uppercase tracking-widest">Map Projection: Mercator</span>
               <span className="text-[9px] font-mono text-red-500/50 uppercase tracking-widest">Status: Monitoring</span>
            </div>
          </div>

          {/* Threat Intel Feeds (Top IPs) */}
          <div className="flex flex-col gap-0 bg-[#0a0c14] border border-[#1e2235] rounded-xl h-[500px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e2235] bg-[#07090e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Top Threat Sources</h3>
              </div>
              <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">IOC FEED</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-6 h-6 text-red-500 animate-spin" /></div>
              ) : data.topIps.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs font-mono uppercase tracking-widest gap-2">
                   <Target className="w-6 h-6 opacity-20" />
                   No Threat Sources
                </div>
              ) : (
                data.topIps.map((ipObj, i) => (
                  <div key={i} className="group flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.05] hover:border-red-500/30 transition-all cursor-crosshair relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center font-mono text-[10px] text-red-500 font-bold">
                        {i+1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-gray-200">{ipObj.ip}</span>
                        <span className="text-[9px] text-red-400/70 uppercase tracking-wider">Malicious Actor</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end relative z-10">
                      <span className="text-xs font-bold font-mono text-red-400">{ipObj.score}</span>
                      <span className="text-[9px] text-gray-600 uppercase tracking-wider">Risk Score</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Matrix */}
        <div className="bg-[#0a0c14] border border-[#1e2235] rounded-xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-[#1e2235] bg-[#07090e] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crosshair className="w-4 h-4 text-purple-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">MITRE ATT&CK® Matrix</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Mapped From Live Events</span>
            </div>
          </div>
          
          <div className="p-5 overflow-x-auto custom-scrollbar bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}>
            <div className="flex gap-3 min-w-max pb-4">
              {Object.entries(mitreMatrix.matrix).map(([tactic, techniques], i) => (
                <div key={tactic} className="w-52 shrink-0 flex flex-col gap-2.5">
                  {/* Tactic Header */}
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center min-h-[50px] flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider leading-tight">{tactic}</span>
                  </div>
                  {/* Techniques */}
                  <div className="flex flex-col gap-2">
                    {techniques.map(tech => {
                      const activeCount = mitreMatrix.detected[tech];
                      const isActive = !!activeCount;
                      return (
                        <div key={tech} className={`relative p-2.5 rounded-lg text-[11px] leading-snug flex justify-between items-start transition-all duration-300 ${
                          isActive 
                          ? "bg-red-500/10 border border-red-500/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)] z-10 transform scale-[1.02]" 
                          : "bg-[#07090e] border border-[#1e2235] text-gray-500 hover:border-white/10"
                        }`}>
                          <span className="break-words pr-2 font-mono">{tech}</span>
                          {isActive && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded bg-red-500 text-white font-mono font-bold text-[9px] shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                              {activeCount}
                            </span>
                          )}
                          {isActive && (
                            <div className="absolute -inset-px border border-red-500/50 rounded-lg animate-pulse pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Event Feed (Optional but good for SIEM feel) */}
        <div className="bg-[#0a0c14] border border-[#1e2235] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2235] bg-[#07090e] flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-cyan-500" />
               <h3 className="text-xs font-bold text-white uppercase tracking-widest">Live Security Feed</h3>
             </div>
             <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
               {data.events.length} EVENTS RECORDED
             </span>
          </div>
          <div className="overflow-x-auto custom-scrollbar max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0a0c14] border-b border-[#1e2235] z-20 shadow-md">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Source IP</th>
                  <th className="px-6 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2235]/50 font-mono text-xs">
                {data.events.slice(0, 30).map((e, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-3.5 text-gray-500">{ago(e.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <span className="text-purple-400 font-bold">{e.eventType?.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${
                        e.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                        e.severity === 'WARN' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        'bg-cyan-500/10 text-cyan-500 border-cyan-500/30'
                      }`}>{e.severity || 'INFO'}</span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-300 group-hover:text-white transition-colors">{e.ip || '—'}</td>
                    <td className="px-6 py-3.5 text-right font-bold text-red-400">+{e.points || 0}</td>
                  </tr>
                ))}
                {data.events.length === 0 && !loading && (
                   <tr>
                     <td colSpan="5" className="px-6 py-10 text-center text-gray-600 font-sans text-xs uppercase tracking-widest">
                       No events detected
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
