"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "../../../lib/api";
import {
  ShieldAlert, Siren, Clock, AlertTriangle, CheckCircle2,
  Search, Filter, RefreshCw, Eye, MoreVertical, Plus,
  ChevronLeft, ChevronRight, Calendar, Download, Loader2,
  TrendingUp, TrendingDown, Activity, Users, Server, Zap
} from "lucide-react";
import { SeverityBadge, StatusBadge } from "./components/CaseBadge";
import { SparklineChart, DonutChart, MultiLineChart } from "./components/SparklineChart";

// ─── Static helpers ───────────────────────────────────────────────────────────
const SOURCE_ICONS = {
  "SIEM Alert": "🛡️", "EDR": "🖥️", "WAF": "🌐", "Network IDS": "📡",
  "DLP": "📋", "User Report": "👤", "API Gateway": "🔗", "CSPM": "☁️",
  "APPLICATION": "⚙️", "FIREWALL": "🔥", "ENDPOINT": "🖥️", "CLOUD": "☁️",
};
const TABS = ["All Cases", "OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED"];
const TAB_LABELS = { "All Cases": "All Cases", OPEN: "Open", IN_PROGRESS: "In Progress", ON_HOLD: "On Hold", RESOLVED: "Resolved", CLOSED: "Closed" };

// Fallback empty sparks (7 zeros) — replaced with real trend data when available
const EMPTY_SPARK = [0, 0, 0, 0, 0, 0, 0];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SOCCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [totalFromServer, setTotalFromServer] = useState(0);

  // Filters
  const [activeTab, setActiveTab] = useState("All Cases");
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("All Severity");
  const [prioFilter, setPrioFilter] = useState("All Priority");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    try {
      setError(null);
      const statusParam = activeTab !== "All Cases" ? `&status=${activeTab}` : "";
      const sevParam = sevFilter !== "All Severity" ? `&severity=${sevFilter}` : "";
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";

      const [casesRes, summaryRes, trendRes] = await Promise.allSettled([
        adminRequest(`/soc/cases?limit=100&page=${page}${statusParam}${sevParam}${searchParam}`),
        adminRequest("/soc/cases/analytics/summary"),
        adminRequest("/soc/cases/analytics/trend?days=7"),
      ]);

      if (casesRes.status === "fulfilled") {
        setCases(casesRes.value?.cases || []);
        setTotalFromServer(casesRes.value?.total || 0);
      }
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
      if (trendRes.status === "fulfilled") setTrendData(trendRes.value?.trend || []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message || "Failed to load cases");
    } finally {
      setLoading(false);
    }
  }, [activeTab, sevFilter, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);

  // Client-side filter (for priority + assignee which aren\'t server params)
  const filtered = useMemo(() => {
    return cases.filter(c => {
      const matchPrio = prioFilter === "All Priority" || c.priority === prioFilter.toUpperCase();
      const matchAssignee = assigneeFilter === "All Assignees" || c.assignee?.name === assigneeFilter;
      return matchPrio && matchAssignee;
    });
  }, [cases, prioFilter, assigneeFilter]);

  const totalPages = Math.ceil((totalFromServer || filtered.length) / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Build trend spark arrays from real trend data
  const trendCreated  = trendData?.map(r => r.created)  || EMPTY_SPARK;
  const trendResolved = trendData?.map(r => r.resolved) || EMPTY_SPARK;
  const trendLabels   = trendData?.map(r => {
    const d = new Date(r.day);
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  }) || ["—","—","—","—","—","—","—"];

  // Donut segments from real summary
  const sevSegments = summary ? [
    { label: "Critical", value: summary.critical || 0, color: "#ef4444" },
    { label: "High",     value: summary.high     || 0, color: "#f97316" },
    { label: "Medium",   value: summary.medium   || 0, color: "#eab308" },
    { label: "Low",      value: summary.low      || 0, color: "#3b82f6" },
  ] : [
    { label: "Critical", value: 142, color: "#ef4444" },
    { label: "High",     value: 278, color: "#f97316" },
    { label: "Medium",   value: 456, color: "#eab308" },
    { label: "Low",      value: 314, color: "#3b82f6" },
  ];

  const statusSegments = summary ? [
    { label: "Open",        value: summary.open       || 0, color: "#3b82f6" },
    { label: "In Progress", value: summary.inProgress || 0, color: "#8B5CF6" },
    { label: "On Hold",     value: summary.onHold     || 0, color: "#f59e0b" },
    { label: "Resolved",    value: summary.resolved   || 0, color: "#22c55e" },
  ] : [
    { label: "Open",        value: 326, color: "#3b82f6" },
    { label: "In Progress", value: 285, color: "#8B5CF6" },
    { label: "On Hold",     value: 114, color: "#f59e0b" },
    { label: "Resolved",    value: 523, color: "#22c55e" },
  ];

  const tabCounts = {
    "All Cases":   summary?.total      || totalFromServer || 0,
    "OPEN":        summary?.open       || 0,
    "IN_PROGRESS": summary?.inProgress || 0,
    "ON_HOLD":     summary?.onHold     || 0,
    "RESOLVED":    summary?.resolved   || 0,
    "CLOSED":      summary?.closed     || 0,
  };

  // KPI cards wired to real summary
  const kpis = [
    {
      label: "Total Cases", value: summary?.total ?? totalFromServer ?? "…", icon: ShieldAlert,
      color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20",
      spark: trendCreated, sparkColor: "#8B5CF6",
      trend: null, trendUp: true, sub: "all time"
    },
    {
      label: "Open Cases", value: summary?.open ?? "…", icon: Siren,
      color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20",
      spark: trendCreated, sparkColor: "#3b82f6",
      trend: null, trendUp: true, sub: "active"
    },
    {
      label: "In Progress", value: summary?.inProgress ?? "…", icon: Activity,
      color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20",
      spark: EMPTY_SPARK, sparkColor: "#8B5CF6",
      trend: null, trendUp: true, sub: "being investigated"
    },
    {
      label: "Resolved (7D)", value: summary?.resolved ?? "…", icon: CheckCircle2,
      color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
      spark: trendResolved, sparkColor: "#22c55e",
      trend: null, trendUp: true, sub: "vs last 7 days"
    },
    {
      label: "Critical + High", value: ((summary?.critical || 0) + (summary?.high || 0)) || "…", icon: AlertTriangle,
      color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20",
      spark: EMPTY_SPARK, sparkColor: "#ef4444",
      trend: null, trendUp: true, sub: "needs attention"
    },
    {
      label: "Mean Time to Resolve", value: summary?.mttr ?? "N/A", icon: Clock,
      color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20",
      spark: EMPTY_SPARK, sparkColor: "#f59e0b",
      trend: summary?.slaBreached ? `${summary.slaBreached} SLA breached` : null,
      trendUp: false, sub: "avg resolution time"
    },
  ];

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleString("en-IN", { month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" }); }
    catch { return "—"; }
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#1e2235] bg-[#0f1117] px-8 py-5 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span>Security Operations</span>
              <ChevronRight className="w-3 h-3" />
              <span>SOC</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">Cases</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">SOC Cases</h1>
                  <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-500 text-xs cursor-pointer hover:text-gray-300">?</span>
                </div>
                <p className="text-gray-500 text-sm">Manage, investigate and respond to security cases and incidents across the platform.</p>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 text-sm hover:border-purple-500/30 cursor-pointer transition-all">
              <Calendar className="w-4 h-4" />
              <span>May 21 – May 27, 2025</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all text-sm">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all text-sm">
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={load}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/20 transition-all">
              <Plus className="w-4 h-4" /> Create Case
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 max-w-[1800px] mx-auto">

        {/* ── KPI Strip ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-4 backdrop-blur-sm hover:scale-[1.01] transition-transform`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${kpi.color} opacity-70`}>{kpi.label}</span>
                <div className={`w-7 h-7 rounded-lg ${kpi.bg} border ${kpi.border} flex items-center justify-center`}>
                  <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                </div>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-white/5 rounded animate-pulse mb-2" />
              ) : (
                <div className={`text-2xl font-extrabold ${kpi.color} mb-1`}>{kpi.value}</div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {kpi.trendUp
                    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                    : <TrendingDown className="w-3 h-3 text-emerald-400" />
                  }
                  <span className={`text-[10px] font-semibold ${kpi.trendUp ? "text-emerald-400" : "text-emerald-400"}`}>{kpi.trend}</span>
                </div>
                <SparklineChart data={kpi.spark} color={kpi.sparkColor} height={28} width={64} />
              </div>
              <div className="text-[10px] text-gray-600 mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Analytics Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cases by Severity */}
          <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Cases by Severity</h3>
            </div>
            <div className="flex items-center gap-4">
              <DonutChart segments={sevSegments} size={100} thickness={14} label={String(summary?.total || totalFromServer || 0)} sublabel="Total" />
              <div className="flex flex-col gap-2 flex-1">
                {sevSegments.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-xs text-gray-400">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{s.value}</span>
                      <span className="text-[10px] text-gray-600">({(summary?.total||totalFromServer||1) > 0 ? ((s.value/(summary?.total||totalFromServer||1))*100).toFixed(1) : "0"}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cases by Status */}
          <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Cases by Status</h3>
            </div>
            <div className="flex items-center gap-4">
              <DonutChart segments={statusSegments} size={100} thickness={14} label={String(summary?.total || totalFromServer || 0)} sublabel="Total" />
              <div className="flex flex-col gap-2 flex-1">
                {statusSegments.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-xs text-gray-400">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{s.value}</span>
                      <span className="text-[10px] text-gray-600">({(summary?.total||totalFromServer||1) > 0 ? ((s.value/(summary?.total||totalFromServer||1))*100).toFixed(1) : "0"}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cases Trend */}
          <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Cases Trend (Last 7 Days)</h3>
            </div>
            {/* Legend */}
            <div className="flex gap-4 mb-3">
              {[["Created","#8B5CF6"],["Resolved","#22c55e"],["Closed","#64748b"]].map(([l,c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ background: c }} />
                  <span className="text-[10px] text-gray-500">{l}</span>
                </div>
              ))}
            </div>
            {/* Y axis labels */}
            <div className="relative">
              <div className="flex justify-between text-[9px] text-gray-700 mb-1">
                {["200","150","100","50","0"].map(v=><span key={v}>{v}</span>)}
              </div>
              <MultiLineChart
                series={[
                  { data: trendCreated,  color: "#8B5CF6" },
                  { data: trendResolved, color: "#22c55e" },
                ]}
                labels={trendLabels}
                height={80}
                width={320}
              />
              <div className="flex justify-between text-[9px] text-gray-700 mt-1">
                {trendLabels.map((l,i)=><span key={i}>{l.split(" ").pop()}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Table Section ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-1 px-6 pt-4 border-b border-[#1e2235] overflow-x-auto">
            {TABS.map(tab => {
              const count = tabCounts[tab] ?? 0;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-all ${
                    isActive
                      ? "border-purple-500 text-white bg-purple-500/10"
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {TAB_LABELS[tab] || tab}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-purple-500/30 text-purple-300" : "bg-white/5 text-gray-600"}`}>
                    {count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 px-6 py-4 border-b border-[#1e2235]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search cases..."
                className="w-full bg-[#0b0d14] border border-[#252840] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            {[
              { value: sevFilter, setValue: setSevFilter, options: ["All Severity","CRITICAL","HIGH","MEDIUM","LOW"] },
              { value: prioFilter, setValue: setPrioFilter, options: ["All Priority","CRITICAL","HIGH","MEDIUM","LOW"] },
              { value: assigneeFilter, setValue: setAssigneeFilter, options: ["All Assignees", ...new Set(cases.map(c => c.assignee?.name).filter(Boolean))] },
            ].map((f, fi) => (
              <select
                key={fi}
                value={f.value}
                onChange={e => { f.setValue(e.target.value); setPage(1); }}
                className="bg-[#0b0d14] border border-[#252840] rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
              >
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="text-gray-500 text-sm">Loading cases...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 m-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error} — showing mock data
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#1e2235]">
                  <tr className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                    <th className="px-5 py-3">Case ID</th>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Severity</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Source</th>
                    <th className="px-5 py-3">Assignee</th>
                    <th className="px-5 py-3">Created At</th>
                    <th className="px-5 py-3">Updated At</th>
                    <th className="px-5 py-3">SLA</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d2e]">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-16 text-gray-600 text-sm">
                        {loading ? "Loading..." : "No cases found"}
                      </td>
                    </tr>
                  ) : paginated.map((c, i) => (
                    <tr
                      key={c.id || i}
                      onClick={() => router.push(`/soc/cases/${c.id}`)}
                      className="hover:bg-white/[0.025] transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                          {c.caseNumber || c.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-200 text-sm max-w-[220px] truncate" title={c.title}>
                          {c.title}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <SeverityBadge level={c.severity} />
                      </td>
                      <td className="px-5 py-3.5">
                        <SeverityBadge level={c.priority} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span>{SOURCE_ICONS[c.source] || "🛡️"}</span>
                          <span>{c.source}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-300 font-bold">
                            {(c.assignee?.name || c.assignee || "?")[0]}
                          </div>
                          <span className="text-xs text-gray-400 truncate max-w-[100px]">{c.assignee?.name || c.assignee || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(c.updatedAt)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {["RESOLVED","CLOSED"].includes(c.status) ? (
                          <span className="text-xs text-gray-600">—</span>
                        ) : (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                            c.sla?.breached
                              ? "text-red-400 bg-red-500/10 border-red-500/30"
                              : c.sla?.label
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                              : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                          }`}>
                            {c.sla?.breached ? "⚠ " : ""}{c.sla?.label || c.sla || "—"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); router.push(`/soc/cases/${c.id}`); }}
                            className="p-1.5 rounded-lg hover:bg-purple-500/20 text-gray-500 hover:text-purple-400 transition-colors"
                            title="View case"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-600 hover:text-gray-300 transition-colors"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#1e2235]">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                  className="bg-[#0b0d14] border border-[#252840] rounded px-2 py-1 text-xs text-gray-400 focus:outline-none"
                >
                  {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="text-xs text-gray-600">
                  Showing {((page-1)*rowsPerPage)+1} to {Math.min(page*rowsPerPage, filtered.length)} of {filtered.length.toLocaleString()} cases
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page-1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-gray-300 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        p === page
                          ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                          : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-gray-600 text-xs px-1">…</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === totalPages ? "bg-purple-500/20 border border-purple-500/40 text-purple-300" : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setPage(Math.min(totalPages, page+1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-gray-300 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Last refresh indicator */}
        {lastRefresh && (
          <div className="text-[11px] text-gray-700 text-center pb-2">
            Last refreshed: {lastRefresh.toLocaleTimeString()}  ·  Auto-refreshes every 60s
          </div>
        )}
      </div>
    </div>
  );
}
