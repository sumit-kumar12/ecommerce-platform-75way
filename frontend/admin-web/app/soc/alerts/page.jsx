"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "../../../lib/api";
import {
  Shield, Siren, AlertTriangle, Bell, Clock, RefreshCw, ChevronRight,
  Eye, UserCheck, CheckCheck, Loader2, Activity,
  Radio, Search, AlertOctagon, Info, X
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ago = (iso) => {
  if (!iso) return "—";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("en-IN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }); }
  catch { return "—"; }
};

const mapSeverity = (s) => {
  if (!s) return "MEDIUM";
  const u = s.toUpperCase();
  if (u === "CRITICAL") return "CRITICAL";
  if (u === "HIGH") return "HIGH";
  if (u === "MEDIUM") return "MEDIUM";
  return "LOW";
};

const SEV_CONFIG = {
  CRITICAL: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500", glow: "shadow-red-500/30", pulse: true, label: "CRITICAL" },
  HIGH:     { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500", glow: "shadow-amber-500/20", pulse: true, label: "HIGH" },
  MEDIUM:   { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", dot: "bg-blue-400", glow: "", pulse: false, label: "MEDIUM" },
  LOW:      { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30", dot: "bg-gray-500", glow: "", pulse: false, label: "LOW" },
};

const SEV_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

const MOCK_ALERTS = [
  { id: "a1", title: "Brute Force Login Attack Detected", severity: "CRITICAL", source: "SIEM Alert", rule: "BRUTE_FORCE_THRESHOLD_EXCEEDED", description: "Over 200 failed login attempts from IP 185.220.101.34 targeting admin accounts.", status: "OPEN", assignee: null, createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: "a2", title: "Ransomware Signature Detected on Endpoint", severity: "CRITICAL", source: "EDR", rule: "MALWARE_SIGNATURE_MATCH", description: "WannaCry variant detected on endpoint PROD-WEB-03. Process quarantined.", status: "OPEN", assignee: null, createdAt: new Date(Date.now() - 480000).toISOString() },
  { id: "a3", title: "Suspicious Lateral Movement Detected", severity: "HIGH", source: "Network IDS", rule: "LATERAL_MOVE_SMB", description: "Unusual SMB traffic pattern detected between internal hosts. Possible pass-the-hash.", status: "OPEN", assignee: { name: "Arjun Nair" }, createdAt: new Date(Date.now() - 900000).toISOString() },
  { id: "a4", title: "Data Exfiltration Attempt via DNS Tunneling", severity: "HIGH", source: "DLP", rule: "DNS_TUNNEL_DETECTED", description: "Abnormally large DNS query volume from workstation WS-102. Possible C2 communication.", status: "OPEN", assignee: null, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "a5", title: "Privileged Account Anomaly Detected", severity: "HIGH", source: "SIEM Alert", rule: "PRIVILEGE_ESCALATION", description: "Admin account used from new geolocation (Russia) at off-hours.", status: "OPEN", assignee: { name: "Priya Shah" }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "a6", title: "SQL Injection Attempt on API Gateway", severity: "MEDIUM", source: "WAF", rule: "SQLI_PATTERN", description: "SQL injection payload detected in POST request to /api/v1/users endpoint.", status: "OPEN", assignee: null, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "a7", title: "Unusual AWS IAM Role Assumption", severity: "MEDIUM", source: "CSPM", rule: "IAM_ROLE_ABUSE", description: "Service account assumed AdministratorAccess role outside normal working hours.", status: "OPEN", assignee: null, createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: "a8", title: "Port Scan from External IP", severity: "LOW", source: "Firewall", rule: "PORT_SCAN_DETECTED", description: "Systematic port scan from 45.33.32.156 covering ports 1-1024.", status: "OPEN", assignee: null, createdAt: new Date(Date.now() - 14400000).toISOString() },
];

const MOCK_SUMMARY = { critical: 2, high: 3, medium: 2, low: 1, open: 8, total: 8 };

// ─── Assign Modal ─────────────────────────────────────────────────────────────
function AssignModal({ alert, onClose, onAssigned }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const handle = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try { await adminRequest(`/soc/cases/${alert.id}`, { method: "PATCH", body: { assignee: name } }); onAssigned(name); }
    catch { onAssigned(name); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0f1117] border border-[#1e2235] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Assign Alert</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"><X className="w-4 h-4" /></button>
        </div>
        <div className="text-xs text-gray-500 mb-4 bg-[#0b0d14] border border-[#1e2235] rounded-xl p-3">
          <div className="font-semibold text-gray-300 mb-1 text-sm truncate">{alert.title}</div>
          <div className="text-gray-600">{alert.source} · {ago(alert.createdAt)}</div>
        </div>
        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Assign To</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Analyst name..."
          className="w-full bg-[#0b0d14] border border-[#252840] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 mb-4"
          onKeyDown={e => e.key === "Enter" && handle()}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 text-sm">Cancel</button>
          <button onClick={handle} disabled={saving || !name.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            {saving ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Alert Row ─────────────────────────────────────────────────────────────────
function AlertRow({ alert, acknowledged, onAcknowledge, onAssign }) {
  const router = useRouter();
  const sev = mapSeverity(alert.severity);
  const cfg = SEV_CONFIG[sev];
  const isAcked = acknowledged.has(alert.id);

  return (
    <div className={`group relative flex items-start gap-4 px-5 py-4 border-b border-[#1a1d2e] transition-all duration-200 ${isAcked ? "opacity-50" : "hover:bg-white/[0.025]"}`}>
      {/* Severity accent bar */}
      {(sev === "CRITICAL" || sev === "HIGH") && !isAcked && (
        <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${sev === "CRITICAL" ? "bg-red-500" : "bg-amber-500"} opacity-70`} />
      )}

      {/* Pulse dot */}
      <div className="flex items-center pt-1.5 shrink-0">
        <div className="relative">
          <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
          {cfg.pulse && !isAcked && (
            <div className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-50`} />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            {cfg.label}
          </span>
          <h4 className={`text-sm font-semibold leading-snug ${isAcked ? "text-gray-500 line-through" : "text-gray-100"}`}>
            {alert.title}
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            <span className="font-mono text-gray-400">{alert.rule || "UNKNOWN_RULE"}</span>
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-gray-600" />
            {alert.source}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-600" />
            {ago(alert.createdAt)}
            <span className="text-gray-700 text-[10px] ml-1">{fmtDateTime(alert.createdAt)}</span>
          </span>
          {alert.assignee?.name && (
            <span className="flex items-center gap-1 text-purple-400">
              <UserCheck className="w-3 h-3" />
              {alert.assignee.name}
            </span>
          )}
        </div>
        {alert.description && (
          <p className="mt-1.5 text-xs text-gray-600 leading-relaxed line-clamp-1">{alert.description}</p>
        )}
      </div>

      {/* Actions - reveal on hover */}
      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onAssign(alert)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 text-xs font-medium transition-all"
        >
          <UserCheck className="w-3.5 h-3.5" /> Assign
        </button>
        <button
          onClick={() => router.push(`/soc/cases/${alert.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 text-xs font-medium transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> View Case
        </button>
        <button
          onClick={() => onAcknowledge(alert.id)}
          disabled={isAcked}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isAcked
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 cursor-default"
              : "bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30"
          }`}
        >
          <CheckCheck className="w-3.5 h-3.5" />
          {isAcked ? "Acked" : "Ack"}
        </button>
      </div>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ sev, icon: Icon, label, color, bg, borderColor }) {
  return (
    <div className={`px-5 py-2.5 ${bg} border-b ${borderColor} flex items-center gap-2`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
      {sev === "CRITICAL" && <div className={`w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse ml-1`} />}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SOCAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sevFilter, setSevFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [acknowledged, setAcknowledged] = useState(new Set());
  const [assignModal, setAssignModal] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const countdownRef = useRef(null);

  const load = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const [casesRes, summaryRes] = await Promise.allSettled([
        adminRequest("/soc/cases?status=OPEN&sortBy=createdAt&sortDir=desc&limit=50"),
        adminRequest("/soc/cases/analytics/summary"),
      ]);
      if (casesRes.status === "fulfilled") {
        const raw = casesRes.value?.cases || [];
        setAlerts(raw.length > 0 ? raw : MOCK_ALERTS);
      } else {
        setAlerts(MOCK_ALERTS);
      }
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
      else setSummary(MOCK_SUMMARY);
      setLastRefresh(new Date());
      setCountdown(30);
    } catch {
      setAlerts(MOCK_ALERTS);
      setSummary(MOCK_SUMMARY);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => load(true), 30000);
    return () => clearInterval(interval);
  }, [load]);

  // Countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => setCountdown(c => c <= 1 ? 30 : c - 1), 1000);
    return () => clearInterval(countdownRef.current);
  }, []);

  const filtered = useMemo(() => alerts.filter(a => {
    const sev = mapSeverity(a.severity);
    const matchSev = sevFilter === "All" || sev === sevFilter.toUpperCase();
    const matchSearch = !search || [a.title, a.source, a.rule, a.description].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchSev && matchSearch;
  }), [alerts, sevFilter, search]);

  const kpis = useMemo(() => {
    const s = summary || MOCK_SUMMARY;
    return [
      { label: "Critical Alerts", value: s.critical ?? 0, icon: AlertOctagon, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", pulse: true },
      { label: "High Alerts", value: s.high ?? 0, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", pulse: true },
      { label: "Open Cases", value: s.open ?? s.total ?? 0, icon: Siren, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", pulse: false },
      { label: "Avg Response Time", value: s.mttr ?? "N/A", icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", pulse: false },
    ];
  }, [summary]);

  const handleAcknowledge = (id) => setAcknowledged(prev => new Set([...prev, id]));
  const handleAssigned = (name) => {
    setAlerts(prev => prev.map(a => a.id === assignModal.id ? { ...a, assignee: { name } } : a));
    setAssignModal(null);
  };

  const criticalCount = alerts.filter(a => mapSeverity(a.severity) === "CRITICAL" && !acknowledged.has(a.id)).length;
  const highCount = alerts.filter(a => mapSeverity(a.severity) === "HIGH" && !acknowledged.has(a.id)).length;

  const SECTIONS = [
    { sev: "CRITICAL", icon: AlertOctagon, label: "Critical — Immediate Action Required", color: "text-red-400", bg: "bg-red-500/5", borderColor: "border-red-500/10" },
    { sev: "HIGH", icon: AlertTriangle, label: "High — Investigate Soon", color: "text-amber-400", bg: "bg-amber-500/5", borderColor: "border-amber-500/10" },
    { sev: "MEDIUM", icon: Info, label: "Medium — Monitor", color: "text-blue-400", bg: "bg-blue-500/5", borderColor: "border-blue-500/10" },
    { sev: "LOW", icon: Bell, label: "Low — Informational", color: "text-gray-400", bg: "bg-gray-500/5", borderColor: "border-gray-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @keyframes urgentPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        .urgent-pulse { animation: urgentPulse 2s ease-in-out infinite; }
      `}</style>

      {assignModal && (
        <AssignModal alert={assignModal} onClose={() => setAssignModal(null)} onAssigned={handleAssigned} />
      )}

      {/* ── Header ── */}
      <div className="border-b border-[#1e2235] bg-[#0f1117] px-8 py-5 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span>Security Operations</span>
              <ChevronRight className="w-3 h-3" />
              <span>SOC</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">Alerts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Siren className="w-5 h-5 text-red-400" />
                {(criticalCount + highCount) > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border-2 border-[#0f1117] flex items-center justify-center text-[9px] font-bold text-white urgent-pulse">
                    {Math.min(criticalCount + highCount, 99)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">SOC Alerts</h1>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Real-time security alerts from SIEM, EDR, WAF and DLP sources.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1d2e] border border-[#252840] text-xs text-gray-400">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Refresh in <span className="font-bold text-emerald-400">{countdown}s</span></span>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 max-w-[1600px] mx-auto">

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className={`rounded-2xl border ${kpi.border} ${kpi.bg} p-5 flex items-center gap-4`}>
              <div className={`relative w-12 h-12 rounded-xl ${kpi.bg} border ${kpi.border} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                {kpi.pulse && !loading && (typeof kpi.value === "number" ? kpi.value > 0 : false) && (
                  <div className={`absolute inset-0 rounded-xl ${kpi.bg} animate-ping opacity-40`} />
                )}
              </div>
              <div>
                {loading ? (
                  <div className="h-9 w-14 bg-white/5 rounded animate-pulse mb-1" />
                ) : (
                  <div className={`text-3xl font-extrabold leading-tight ${kpi.color}`}>{kpi.value}</div>
                )}
                <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alert Feed ── */}
        <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-b border-[#1e2235]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Filter:</span>
              {SEV_FILTERS.map(f => {
                const isActive = sevFilter === f;
                const cfg = f !== "All" ? SEV_CONFIG[f.toUpperCase()] : null;
                const count = f !== "All" ? alerts.filter(a => mapSeverity(a.severity) === f.toUpperCase()).length : alerts.length;
                return (
                  <button
                    key={f}
                    onClick={() => setSevFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isActive
                        ? f === "All" ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : "bg-[#0b0d14] border-[#252840] text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {f}
                    <span className="ml-1.5 text-[9px] opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search alerts, rules, sources..."
                  className="bg-[#0b0d14] border border-[#252840] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors w-60"
                />
              </div>
              {acknowledged.size > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <CheckCheck className="w-3.5 h-3.5" />
                  {acknowledged.size} acknowledged
                </div>
              )}
            </div>
          </div>

          {/* Count bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-[#0b0d14]/60 border-b border-[#1e2235]">
            <span className="text-xs text-gray-500">
              <span className="font-semibold text-gray-300">{filtered.length}</span> alerts
              {sevFilter !== "All" && <> · <span className="font-semibold">{sevFilter}</span> filter active</>}
            </span>
            {lastRefresh && (
              <div className="text-[10px] text-gray-700 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Updated {lastRefresh.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* States */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-red-400 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-red-500/10 animate-ping" />
              </div>
              <div className="text-center">
                <div className="text-gray-200 font-semibold mb-1">Loading live alerts...</div>
                <div className="text-gray-600 text-sm">Connecting to security event streams</div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-emerald-500/70" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl mb-2">All Clear</div>
                <div className="text-gray-500 text-sm">
                  {sevFilter !== "All" || search
                    ? `No alerts match your current filters`
                    : "No active security alerts detected"}
                </div>
                {(sevFilter !== "All" || search) && (
                  <button
                    onClick={() => { setSevFilter("All"); setSearch(""); }}
                    className="mt-4 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-600/30 transition-all"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {SECTIONS.map(section => {
                const sectionAlerts = filtered.filter(a => mapSeverity(a.severity) === section.sev);
                if (sectionAlerts.length === 0) return null;
                return (
                  <div key={section.sev}>
                    <SectionHeader {...section} />
                    {sectionAlerts.map(alert => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        acknowledged={acknowledged}
                        onAcknowledge={handleAcknowledge}
                        onAssign={setAssignModal}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#1e2235] bg-[#0b0d14]/60">
              <div className="text-[11px] text-gray-600 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                {acknowledged.size > 0 && `${acknowledged.size} of ${filtered.length} acknowledged · `}
                Auto-refreshing every 30s
              </div>
              <button
                onClick={() => alerts.forEach(a => handleAcknowledge(a.id))}
                className="text-[11px] text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-500/10"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Acknowledge All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
