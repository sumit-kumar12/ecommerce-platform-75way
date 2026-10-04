"use client";

import { useEffect, useState, useRef } from "react";
import { adminRequest, resolveAdminApiBase, coreApiRequest } from "../../../lib/api";
import styles from "../../audit/page.module.css";
import Link from "next/link";

function formatDateExact(val) {
  if (!val) return "--";
  const date = new Date(val);
  const pad = (n, l=2) => String(n).padStart(l, '0');
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`;
}

export default function LiveAuditMonitor() {
  const [entries, setEntries] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({ percentages: { INFO: 0, WARN: 0, CRITICAL: 0 }, total: 0 });
  const [status, setStatus] = useState("CONNECTING");
  
  const bufferRef = useRef([]);
  const entriesRef = useRef([]);

  useEffect(() => {
    let active = true;
    let eventSource = null;
    let reconnectTimeout = null;

    // Initial Stats Fetch
    const fetchStats = async () => {
      const data = await adminRequest("/monitoring/audit/stats").catch(() => null);
      if (active && data) setStats(data);
    };
    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000);

    const connectStream = async () => {
      if (!active) return;
      
      try {
        setStatus("CONNECTING");
        const apiBase = await resolveAdminApiBase();
        const sseRes = await coreApiRequest("/auth/sse-token", { method: "POST" });
        
        if (eventSource) {
          eventSource.close();
        }

        eventSource = new EventSource(`${apiBase}/monitoring/audit/stream?sseToken=${sseRes.sseToken}`, { withCredentials: true });

        eventSource.onopen = () => {
          if (active) setStatus("CONNECTED");
        };

        eventSource.onerror = () => {
          if (!active) return;
          setStatus("DISCONNECTED");
          eventSource.close();
          // Exponential backoff or simple delay for reconnect
          reconnectTimeout = setTimeout(connectStream, 5000);
        };

        eventSource.onmessage = (event) => {
          if (!active) return;
          try {
            const log = JSON.parse(event.data);
            if (isPaused) {
              bufferRef.current = [log, ...bufferRef.current].slice(0, 50);
            } else {
              setEntries(prev => [log, ...prev].slice(0, 100));
            }
          } catch (err) {
            console.error("Stream parse error:", err);
          }
        };
      } catch (err) {
        if (active) {
          setStatus("AUTH_ERROR");
          reconnectTimeout = setTimeout(connectStream, 10000);
        }
      }
    };

    connectStream();

    return () => {
      active = false;
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(statsInterval);
    };
  }, [isPaused]);

  const handleTogglePause = () => {
    if (isPaused) {
      // Release buffer
      setEntries(prev => [...bufferRef.current, ...prev].slice(0, 100));
      bufferRef.current = [];
    }
    setIsPaused(!isPaused);
  };

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case "CRITICAL": return "text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      case "WARN": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      default: return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    }
  };

  return (
    <div className={`flex flex-col flex-1 min-h-screen bg-[#050508] text-slate-300 font-mono selection:bg-[#8B5CF6]/30`}>
      {/* HUD Header */}
      <header className="sticky top-0 z-50 border-b border-[#8B5CF6]/20 bg-[#050508]/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_8px_#8B5CF6]"></div>
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white">Security_Live_Stream_v4</h1>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{status}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleTogglePause}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${isPaused ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20'}`}>
            <span className="material-symbols-outlined text-sm">{isPaused ? 'play_arrow' : 'pause'}</span>
            {isPaused ? `Resume Stream (${bufferRef.current.length})` : 'Pause Stream'}
          </button>
          <Link href="/audit" className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6] hover:underline">
            History Mode
          </Link>
        </div>
      </header>

      <main className="flex-1 p-8 space-y-8">
        {/* Real-time Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 p-4 rounded-xl">
            <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Session events</p>
            <p className="text-2xl font-black text-white">{entries.length}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
            <p className="text-[9px] font-bold text-red-500/50 uppercase mb-1">Critical threats (24h)</p>
            <p className="text-2xl font-black text-red-400">{stats.percentages.CRITICAL}%</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl">
            <p className="text-[9px] font-bold text-amber-500/50 uppercase mb-1">Suspicious (24h)</p>
            <p className="text-2xl font-black text-amber-400">{stats.percentages.WARN}%</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
            <p className="text-[9px] font-bold text-emerald-500/50 uppercase mb-1">Integrity Score</p>
            <p className="text-2xl font-black text-emerald-400">{stats.percentages.INFO}%</p>
          </div>
        </div>

        {/* The Live Ledger */}
        <div className="bg-[#0a0a0f] border border-[#8B5CF6]/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-[#8B5CF6]/10">
                <th className="px-6 py-4">T-Stamp</th>
                <th className="px-6 py-4">Event_Id</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target_Resource</th>
                <th className="px-6 py-4 text-right">Source_IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {entries.map((log, i) => (
                <tr key={log.id} className={`group hover:bg-[#8B5CF6]/5 transition-colors animate-in slide-in-from-top duration-500 ${i === 0 && !isPaused ? 'bg-[#8B5CF6]/10' : ''}`}>
                  <td className="px-6 py-3 text-[11px] text-slate-500">{formatDateExact(log.timestamp)}</td>
                  <td className="px-6 py-3 text-[10px] font-bold text-slate-600 truncate max-w-[100px]">{log.id}</td>
                  <td className="px-6 py-3 text-[11px] font-bold text-emerald-500/70">{log.actor}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getSeverityStyle(log.severity)}`}>
                      {log.event}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[11px] text-slate-400 italic">{log.resource}</td>
                  <td className="px-6 py-3 text-right text-[11px] font-mono text-slate-500">{log.ip}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-xs text-slate-600 animate-pulse">
                    Listening for cluster heartbeat...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer Status */}
      <footer className="p-4 border-t border-slate-900 text-[9px] text-slate-700 flex justify-between uppercase tracking-widest">
        <span>AES-256 encrypted stream</span>
        <span>Buffer state: {isPaused ? 'Locked' : 'Flowing'}</span>
      </footer>
    </div>
  );
}

