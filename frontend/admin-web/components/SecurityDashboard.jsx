"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest } from "../lib/api";

export function SecurityDashboard() {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, auditData] = await Promise.all([
        adminRequest("/stats"),
        adminRequest("/audit?limit=5"),
      ]);
      setStats(statsData);
      setAuditLogs(auditData.logs || []);
    } catch (err) {
      console.error("Failed to load security dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  const getThreatMeterPercentage = () => {
    if (!stats) return 12;
    const count = stats.recentThreatEvents || 0;
    if (count === 0) return 12;
    if (count > 50) return 95;
    return Math.min(12 + count * 2, 95);
  };

  const threatPct = getThreatMeterPercentage();
  const meterColor = threatPct > 70 ? "text-red-500" : threatPct > 40 ? "text-yellow-500" : "text-green-500";
  const ringOffset = 502 - (502 * threatPct) / 100;

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0F0E17] text-slate-900 dark:text-slate-100 font-['Space_Grotesk'] font-medium">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[rgba(139, 92, 246,0.05)] backdrop-blur-xl border-b border-[#8B5CF6]/10">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight">Monitoring <span className="text-[#8B5CF6]">Hub</span></h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0bda68]/10 rounded-full border border-[#0bda68]/20 shadow-[0_0_8px_rgba(11,218,104,0.3)]">
            <div className="w-2 h-2 bg-[#0bda68] rounded-full animate-pulse shadow-[0_0_5px_#0bda68]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0bda68]">Live WebSocket Connected</span>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Top High-Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[rgba(139, 92, 246,0.05)] backdrop-blur-md p-6 rounded-2xl border border-[#8B5CF6]/10 border-l-4 border-l-[#8B5CF6] shadow-[0_0_15px_rgba(139, 92, 246,0.2)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Resources</p>
              <span className="material-symbols-outlined text-[#8B5CF6]">memory</span>
            </div>
            <h3 className="text-3xl font-black mb-1">STABLE</h3>
            <div className="w-full bg-[#8B5CF6]/10 h-1.5 rounded-full mt-4">
              <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: "42.8%" }}></div>
            </div>
            <p className="text-[#0bda68] text-xs mt-3 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-xs">check_circle</span> System Nominal
            </p>
          </div>

          <div className="bg-[rgba(139, 92, 246,0.05)] backdrop-blur-md p-6 rounded-2xl border border-[#8B5CF6]/10 border-l-4 border-l-[#0bda68]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active User Sessions</p>
              <span className="material-symbols-outlined text-[#0bda68]">group</span>
            </div>
            <h3 className="text-3xl font-black mb-1">{loading ? "..." : stats?.activeUsers || 0}</h3>
            <div className="w-full bg-[#0bda68]/10 h-1.5 rounded-full mt-4">
              <div className="bg-[#0bda68] h-1.5 rounded-full" style={{ width: "68%" }}></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-3">Active within 24h</p>
          </div>

          <div className="bg-[rgba(139, 92, 246,0.05)] backdrop-blur-md p-6 rounded-2xl border border-[#8B5CF6]/10 border-l-4 border-l-[#ff3e3e]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Threat Spikes (24h)</p>
              <span className="material-symbols-outlined text-[#ff3e3e]">security_update_warning</span>
            </div>
            <h3 className="text-3xl font-black mb-1">{loading ? "..." : stats?.recentThreatEvents || 0}</h3>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-2 w-full rounded-sm ${i < Math.min(5, (stats?.recentThreatEvents || 0) / 2) ? 'bg-[#ff3e3e]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
              ))}
            </div>
            <p className="text-[#ff3e3e] text-xs mt-3 font-bold uppercase tracking-tighter">
              {(stats?.recentThreatEvents || 0) > 0 ? "Elevated Alert" : "No active spikes"}
            </p>
          </div>

          <div className="bg-[rgba(139, 92, 246,0.05)] backdrop-blur-md p-6 rounded-2xl border border-[#8B5CF6]/10 border-l-4 border-l-[#facc15]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Blocked IPs</p>
              <span className="material-symbols-outlined text-[#facc15]">do_not_disturb_on</span>
            </div>
            <h3 className="text-3xl font-black mb-1">{loading ? "..." : stats?.blockedIps || 0}</h3>
            <div className="w-full bg-[#facc15]/10 h-1.5 rounded-full mt-4">
              <div className="bg-[#facc15] h-1.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-3">Currently enforcing WAF bans</p>
          </div>
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* WebSocket Real-time Graph Visual (Simulated) */}
          <div className="xl:col-span-2 bg-[rgba(139, 92, 246,0.05)] backdrop-blur-md rounded-2xl p-8 border border-[#8B5CF6]/10 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-lg font-bold">Inbound Traffic Pulse</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Packets per microsecond cluster</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
                  <span className="text-xs font-medium">Global CDN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0bda68]"></div>
                  <span className="text-xs font-medium">API Core</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end gap-1 relative">
              <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                {[...Array(4)].map((_, i) => <div key={i} className="w-full border-t border-slate-500 dark:border-slate-100"></div>)}
              </div>
              {/* Dynamic simulated bars */}
              {[40,60,30,80,45,20,55,90,40,30,70,50,40,60,30,50].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${i % 3 === 0 ? 'bg-[#0bda68]/40' : 'bg-[#8B5CF6]/40'} ${i === 3 ? 'shadow-[0_0_15px_rgba(139, 92, 246,0.5)] bg-[#8B5CF6]/80' : ''}`} style={{height: `${h}%`}}></div>
              ))}
            </div>
          </div>

          {/* Side Column: ThreatMeter & Audit Logs */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <Link href="/threats" className="text-xs font-bold text-[#8B5CF6] hover:underline uppercase tracking-widest">Detail View</Link>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 w-full text-left">ThreatMeter Status</h4>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-200 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className={`${meterColor} transition-all duration-1000`} cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset={ringOffset} strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${meterColor}`}>{threatPct}%</span>
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Risk Level</span>
                  </div>
                </div>
            </div>

            <div className="bg-[rgba(139, 92, 246,0.05)] backdrop-blur-md rounded-2xl p-6 border border-[#8B5CF6]/10">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Recent Audit Logs</h4>
                 <Link href="/monitoring/audit" className="text-xs font-bold text-[#8B5CF6] hover:underline uppercase tracking-widest">View All</Link>
              </div>
              <div className="space-y-4">
                {loading ? <p className="text-sm text-slate-500">Scanning logs...</p> : auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#facc15] mt-1.5 shadow-[0_0_5px_#facc15]"></div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{log.action}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{log.actorId} • {log.targetType}</p>
                    </div>
                  </div>
                ))}
                {!loading && auditLogs.length === 0 && <p className="text-xs text-slate-500">No recent audit logs.</p>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

