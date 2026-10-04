"use client";

import React, { useState, useEffect, useMemo } from "react";
import { adminRequest } from "../../lib/api";

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ActivityLog() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAudit = async () => {
      try {
        const payload = await adminRequest("/audit");
        if (active) {
          // payload might be { auditLogs: [] } or { logs: [] } or just an array
          setLogs(payload.auditLogs || payload.logs || (Array.isArray(payload) ? payload : []));
        }
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAudit();
    return () => { active = false; };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchLower = search.toLowerCase();
      const userStr = log.user?.email || log.userId || "System";
      const matchesSearch = search === "" || 
        userStr.toLowerCase().includes(searchLower) ||
        (log.action && log.action.toLowerCase().includes(searchLower)) ||
        (log.resource && log.resource.toLowerCase().includes(searchLower));
        
      if (!matchesSearch) return false;
      
      if (activeTab !== "All") {
        if (activeTab === "Auth" && !["LOGIN", "LOGOUT", "SESSION_REVOKE"].includes(log.action)) return false;
        if (activeTab === "Users" && log.resource !== "USER") return false;
        if (activeTab === "Settings" && log.resource !== "SETTINGS") return false;
      }
      
      return true;
    });
  }, [logs, search, activeTab]);

  const tabs = [
    { name: "All", count: logs.length },
    { name: "Auth", count: logs.filter(l => ["LOGIN", "LOGOUT", "SESSION_REVOKE"].includes(l.action)).length },
    { name: "Users", count: logs.filter(l => l.resource === "USER").length },
    { name: "Settings", count: logs.filter(l => l.resource === "SETTINGS").length },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Audit Logs
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Immutable ledger of all platform administrative activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-[#8C63F5]/10 border border-[#8C63F5]/20 text-[#8C63F5] px-3 py-1.5 rounded-lg text-xs font-medium">
            <span className="material-symbols-outlined text-[14px]">history_edu</span>
            {logs.length} Total Events
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 min-w-0 max-w-screen-2xl mx-auto">
          
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col">
            {/* Toolbar */}
            <div className="px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.name ? "bg-[#8C63F5] text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    {tab.name} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.name ? 'bg-white/20' : 'bg-zinc-800'}`}>{tab.count}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Search activities..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#0F0E17] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-[#8C63F5] transition-colors w-full sm:w-64"
                  />
                </div>
                <button className="p-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#0F0E17]/50 border-b border-zinc-800/60 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium pl-6">User / Actor</th>
                    <th className="p-4 font-medium">Action</th>
                    <th className="p-4 font-medium">Resource</th>
                    <th className="p-4 font-medium">IP Address</th>
                    <th className="p-4 font-medium pr-6 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-zinc-500">
                        <span className="material-symbols-outlined animate-spin mb-2">refresh</span>
                        <p>Loading audit ledger...</p>
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-zinc-500">
                        No audit events found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, idx) => {
                      const userIdent = log.user?.email || log.user?.name || log.userId || "System";
                      return (
                        <tr key={log._id || idx} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                                {userIdent.substring(0,2).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-white">{userIdent}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-300 font-medium">{log.action || "--"}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-zinc-400">{log.resource || "--"}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/50">{log.ip || log.ipAddress || "--"}</span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <span className="text-sm text-zinc-400">{formatDateTime(log.createdAt || log.timestamp)}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {!loading && filteredLogs.length > 0 && (
              <div className="px-6 py-4 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-zinc-500">
                <span>Showing {filteredLogs.length} matching activities</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
