"use client";
import { useState, useEffect, useCallback } from "react";
import { adminRequest } from "../../../lib/api";
import {
  Users, ShieldAlert, AlertTriangle, CheckCircle, Loader2,
  Search, Lock, RefreshCw, UserX, TrendingUp, Activity
} from "lucide-react";

const LEVEL_CONFIG = {
  High:   { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/20",    dot: "bg-red-500",    bar: "bg-red-500" },
  Medium: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", dot: "bg-orange-500", bar: "bg-orange-500" },
  Low:    { bg: "bg-emerald-500/10",text: "text-emerald-400",border: "border-emerald-500/20",dot: "bg-emerald-500",bar: "bg-emerald-500" },
};

export default function UserRiskPage() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ high: 0, medium: 0, low: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await adminRequest("/soc/user-risk");
      if (res?.users) {
        setUsers(res.users);
        setSummary(res.summary || { high: 0, medium: 0, low: 0, total: res.users.length });
        setLastRefresh(new Date());
      }
    } catch (e) {
      setError(e.message || "Failed to load user risk data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "All" || u.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const kpis = [
    { label: "High Risk", value: summary.high, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { label: "Medium Risk", value: summary.medium, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Low Risk", value: summary.low, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Flagged", value: summary.total, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-[#0f1117] border-b border-[#1e2235] px-8 py-5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">User Risk Scores</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">LIVE</span>
            </div>
            <p className="text-gray-500 text-sm">Users ranked by real threat score and activity signals</p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && <span className="text-[11px] text-gray-600">Updated {lastRefresh.toLocaleTimeString()}</span>}
            <button onClick={() => { setLoading(true); load(); }} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-orange-500/50 transition-all text-sm">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className={`rounded-xl border ${kpi.border} ${kpi.bg} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold uppercase tracking-widest ${kpi.color} opacity-80`}>{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} border ${kpi.border} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              {loading ? <div className="h-8 w-12 bg-white/5 rounded animate-pulse" /> :
                <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full bg-[#0f1117] border border-[#1e2235] rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            {["All", "High", "Medium", "Low"].map(l => (
              <button key={l} onClick={() => setLevelFilter(l)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  levelFilter === l ? "bg-orange-500/20 border-orange-500/40 text-orange-300" : "bg-[#0f1117] border-[#1e2235] text-gray-500 hover:text-gray-300"
                }`}>{l}</button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2235] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" />
              Flagged Users
              <span className="text-xs text-gray-500">({filtered.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                <span className="text-gray-500 text-sm">Loading risk profiles...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <CheckCircle className="w-10 h-10 text-emerald-500/40" />
              <p className="text-gray-500 text-sm">No users match your criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1a1d2e]">
              {filtered.map((u, i) => {
                const cfg = LEVEL_CONFIG[u.level] || LEVEL_CONFIG.Low;
                return (
                  <div key={u.userId || i} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${cfg.border} ${cfg.bg} ${cfg.text} shrink-0`}>
                          {(u.name || u.email || "?")[0].toUpperCase()}
                        </div>
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-gray-200 truncate">{u.name || "Unknown"}</span>
                            {u.isLocked && <Lock className="w-3 h-3 text-red-400 shrink-0" title="Account Locked" />}
                            {u.role && (
                              <span className="text-[10px] font-medium bg-[#1a1d2e] border border-[#252840] px-1.5 py-0.5 rounded text-gray-500">
                                {u.role}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{u.email}</div>
                        </div>
                        {/* Risk Factors */}
                        <div className="hidden md:block text-xs text-gray-600 max-w-[200px] truncate">{u.factors}</div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 ml-4">
                        {/* Score Bar */}
                        <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-[10px] font-semibold uppercase ${cfg.text}`}>{u.level}</span>
                            <span className={`text-sm font-bold ${cfg.text}`}>{u.score}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`} style={{ width: `${u.score}%` }} />
                          </div>
                        </div>
                        {/* Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {u.isLocked ? "Locked" : u.level}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
