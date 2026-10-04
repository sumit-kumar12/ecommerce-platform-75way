"use client";
import { useState, useEffect, useCallback } from "react";
import { adminRequest } from "../../../lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  ShieldCheck, ShieldAlert, AlertOctagon, Ban, Clock, MapPin,
  RefreshCw, Loader2, AlertTriangle, CheckCircle, Search
} from "lucide-react";

export default function LoginMonitoringPage() {
  const [data, setData] = useState({ failedLogins: [], chartData: [], kpis: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await adminRequest("/monitoring/failed-logins?limit=100");
      if (res?.failedLogins) {
        const logins = res.failedLogins;

        // Build hourly chart data from real failed login records
        const hourBins = {};
        logins.forEach(login => {
          const hour = new Date(login.lastAttemptAt).getHours();
          const key = `${String(hour).padStart(2, "0")}:00`;
          if (!hourBins[key]) hourBins[key] = { time: key, success: 0, failed: 0, suspicious: 0, blocked: 0 };
          hourBins[key].failed += login.failedCount;
          if (login.failedCount >= 5) hourBins[key].suspicious++;
          if (login.blockedUntil && new Date(login.blockedUntil) > new Date()) hourBins[key].blocked++;
        });
        const chartData = Object.values(hourBins).sort((a, b) => a.time.localeCompare(b.time));

        // KPIs from real data
        const totalFailed = logins.reduce((sum, l) => sum + l.failedCount, 0);
        const blocked = logins.filter(l => l.blockedUntil && new Date(l.blockedUntil) > new Date()).length;
        const suspicious = logins.filter(l => l.failedCount >= 5).length;
        const unique = new Set(logins.map(l => l.ip)).size;

        // Group by IP for top failed locations (IPs instead of hardcoded countries)
        const ipCounts = {};
        logins.forEach(l => { ipCounts[l.ip] = (ipCounts[l.ip] || 0) + l.failedCount; });
        const topIps = Object.entries(ipCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([ip, count]) => ({ ip, count }));
        const maxIpCount = topIps[0]?.count || 1;

        setData({ failedLogins: logins, chartData, kpis: { totalFailed, blocked, suspicious, unique }, topIps, maxIpCount });
        setLastRefresh(new Date());
      }
    } catch (e) {
      setError(e.message || "Failed to load login monitoring data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const filtered = (data.failedLogins || []).filter(l =>
    !search || l.email?.toLowerCase().includes(search.toLowerCase()) || l.ip?.includes(search)
  );

  const kpis = [
    { title: "Total Failed", value: data.kpis?.totalFailed || 0, icon: AlertOctagon, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { title: "Suspicious IPs", value: data.kpis?.suspicious || 0, icon: ShieldAlert, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { title: "Blocked IPs", value: data.kpis?.blocked || 0, icon: Ban, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { title: "Unique IPs", value: data.kpis?.unique || 0, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  const ago = (date) => {
    if (!date) return "—";
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-[#0f1117] border-b border-[#1e2235] px-8 py-5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Login Monitoring</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">LIVE</span>
            </div>
            <p className="text-gray-500 text-sm">Real-time authentication failures and threat detection</p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && <span className="text-[11px] text-gray-600">Updated {lastRefresh.toLocaleTimeString()}</span>}
            <button onClick={() => { setLoading(true); load(); }} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-blue-500/50 transition-all text-sm">
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
                <span className={`text-xs font-semibold uppercase tracking-widest ${kpi.color} opacity-80`}>{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} border ${kpi.border} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              {loading ? <div className="h-8 w-12 bg-white/5 rounded animate-pulse" /> :
                <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value.toLocaleString()}</div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-[#0f1117] rounded-2xl border border-[#1e2235] p-6">
            <h3 className="text-sm font-semibold text-white mb-6">Failed Login Attempts by Hour</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : data.chartData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <CheckCircle className="w-10 h-10 text-emerald-500/30" />
                <p className="text-gray-500 text-sm">No failed login data in current period</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" vertical={false} />
                    <XAxis dataKey="time" stroke="#374151" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#374151" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1117', border: '1px solid #1e2235', borderRadius: '10px' }} itemStyle={{ color: '#E5E7EB', fontSize: 12 }} />
                    <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="failed" name="Failed" stroke="#F97316" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="suspicious" name="Suspicious" stroke="#EAB308" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="blocked" name="Blocked" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top Failed IPs */}
          <div className="bg-[#0f1117] rounded-2xl border border-[#1e2235] p-6">
            <h3 className="text-sm font-semibold text-white mb-6">Top Offender IPs</h3>
            {loading ? (
              <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />)}</div>
            ) : (data.topIps || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <CheckCircle className="w-8 h-8 text-emerald-500/30" />
                <p className="text-gray-500 text-sm">No failed logins recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(data.topIps || []).map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-300 truncate">{item.ip}</span>
                      <span className="text-xs font-medium text-orange-400 ml-2">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((item.count / (data.maxIpCount || 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Login Attempts Table */}
        <div className="bg-[#0f1117] rounded-2xl border border-[#1e2235] overflow-hidden">
          <div className="p-6 border-b border-[#1e2235] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Recent Failed Logins
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IP or email..."
                className="bg-[#1a1d2e] border border-[#252840] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 w-48" />
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <CheckCircle className="w-8 h-8 text-emerald-500/30" />
              <p className="text-gray-500 text-sm">No failed logins found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#1e2235]">
                  <tr className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    <th className="px-6 py-3">Email / Subject</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">IP Address</th>
                    <th className="px-6 py-3">Failed Count</th>
                    <th className="px-6 py-3">Last Attempt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d2e]">
                  {filtered.slice(0, 50).map((login, i) => {
                    const isBlocked = login.blockedUntil && new Date(login.blockedUntil) > new Date();
                    const isSuspicious = login.failedCount >= 5;
                    const status = isBlocked ? "Blocked" : isSuspicious ? "Suspicious" : "Failed";
                    const statusCfg = {
                      Blocked:    { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
                      Suspicious: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
                      Failed:     { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
                    }[status];
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-gray-200 truncate max-w-[200px]">{login.email || login.subjectKey}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>{status}</span>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs text-gray-400">{login.ip}</td>
                        <td className="px-6 py-3">
                          <span className="text-sm font-bold text-orange-400">{login.failedCount}</span>
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-500">{ago(login.lastAttemptAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
