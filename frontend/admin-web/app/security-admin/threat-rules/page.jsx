"use client";
import { useState, useEffect, useCallback } from "react";
import { adminRequest } from "../../../lib/api";
import {
  ShieldAlert, ToggleLeft, ToggleRight, RefreshCw, AlertTriangle,
  CheckCircle, Loader2, Search, Zap, Clock, Hash, Edit3, Save, X
} from "lucide-react";

const SEVERITY_MAP = (points) => {
  if (points >= 15) return { label: "Critical", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  if (points >= 10) return { label: "High",     bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" };
  if (points >= 5)  return { label: "Medium",   bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" };
  return               { label: "Low",      bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" };
};

const ago = (date) => {
  if (!date) return "Never";
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function ThreatRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null); // eventType being saved
  const [search, setSearch] = useState("");
  const [editRule, setEditRule] = useState(null); // { eventType, points }
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await adminRequest("/threat/rules");
      if (res?.rules) {
        setRules(res.rules);
        setLastRefresh(new Date());
      }
    } catch (e) {
      setError(e.message || "Failed to load threat rules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (rule) => {
    if (saving) return;
    const optimistic = rules.map(r =>
      r.eventType === rule.eventType ? { ...r, enabled: !r.enabled } : r
    );
    setRules(optimistic);
    setSaving(rule.eventType);
    try {
      await adminRequest("/threat/rules", {
        method: "PUT",
        body: { rules: [{ eventType: rule.eventType, points: rule.points, enabled: !rule.enabled }] }
      });
    } catch (e) {
      // Revert on failure
      setRules(rules);
      setError(e.message || "Failed to update rule");
    } finally {
      setSaving(null);
    }
  };

  const handleSavePoints = async () => {
    if (!editRule || saving) return;
    const points = parseInt(editRule.points, 10);
    if (isNaN(points) || points < 0 || points > 100) {
      setError("Points must be between 0 and 100");
      return;
    }
    setSaving(editRule.eventType);
    try {
      await adminRequest("/threat/rules", {
        method: "PUT",
        body: { rules: [{ eventType: editRule.eventType, points, enabled: editRule.enabled }] }
      });
      setRules(rules.map(r => r.eventType === editRule.eventType ? { ...r, points } : r));
      setEditRule(null);
    } catch (e) {
      setError(e.message || "Failed to save rule points");
    } finally {
      setSaving(null);
    }
  };

  const filtered = rules.filter(r =>
    !search ||
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.eventType?.toLowerCase().includes(search.toLowerCase())
  );

  // KPIs from real data
  const total = rules.length;
  const active = rules.filter(r => r.enabled).length;
  const disabled = rules.filter(r => !r.enabled).length;
  const triggered = rules.filter(r => r.lastTriggeredAt).length;

  const kpis = [
    { label: "Total Rules", value: total, icon: Hash, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Active Rules", value: active, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Disabled", value: disabled, icon: ToggleLeft, color: "text-gray-400", bg: "bg-white/5", border: "border-white/10" },
    { label: "Triggered Today", value: triggered, icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-[#0f1117] border-b border-[#1e2235] px-8 py-5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Threat Rules</h1>
            </div>
            <p className="text-gray-500 text-sm">Manage real-time threat detection rules — changes take effect within 5 seconds</p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && <span className="text-[11px] text-gray-600">Updated {lastRefresh.toLocaleTimeString()}</span>}
            <button onClick={() => { setLoading(true); load(); }} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/50 transition-all text-sm">
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
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search rules by name or event type..."
            className="w-full bg-[#0f1117] border border-[#1e2235] rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>

        {/* Rules Table */}
        <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2235] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Detection Rules
              <span className="text-xs text-gray-500">({filtered.length})</span>
            </h3>
            <span className="text-xs text-gray-600">Toggle to enable/disable · Click points to edit</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="text-gray-500 text-sm">Loading threat rules from database...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <CheckCircle className="w-10 h-10 text-emerald-500/40" />
              <p className="text-gray-500 text-sm">No rules match your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#1e2235]">
                  <tr className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    <th className="px-6 py-3">Rule Name</th>
                    <th className="px-6 py-3">Event Type</th>
                    <th className="px-6 py-3">Severity</th>
                    <th className="px-6 py-3">Points</th>
                    <th className="px-6 py-3">Last Triggered</th>
                    <th className="px-6 py-3">Trigger Count</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d2e]">
                  {filtered.map((rule, i) => {
                    const sev = SEVERITY_MAP(rule.points);
                    const isEditing = editRule?.eventType === rule.eventType;
                    const isSavingThis = saving === rule.eventType;
                    return (
                      <tr key={rule.id || i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-200 text-sm">{rule.title}</div>
                          <div className="text-xs text-gray-600 mt-0.5 max-w-[200px] truncate">{rule.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                            {rule.eventType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}>
                            {sev.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number" min="0" max="100"
                                value={editRule.points}
                                onChange={e => setEditRule({ ...editRule, points: e.target.value })}
                                className="w-16 bg-[#1a1d2e] border border-purple-500/40 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                autoFocus
                              />
                              <button onClick={handleSavePoints} disabled={isSavingThis}
                                className="p-1.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                                {isSavingThis ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              </button>
                              <button onClick={() => setEditRule(null)}
                                className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setEditRule({ eventType: rule.eventType, points: rule.points, enabled: rule.enabled })}
                              className="flex items-center gap-1.5 group">
                              <span className="text-sm font-bold text-white">{rule.points}</span>
                              <Edit3 className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {ago(rule.lastTriggeredAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-300">{rule.triggerCount ?? 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            rule.enabled
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-white/5 text-gray-500 border-white/10"
                          }`}>
                            {rule.enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggle(rule)}
                            disabled={!!saving}
                            className="transition-all hover:scale-110 disabled:opacity-50"
                            title={rule.enabled ? "Disable rule" : "Enable rule"}
                          >
                            {isSavingThis ? (
                              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            ) : rule.enabled ? (
                              <ToggleRight className="w-7 h-7 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-gray-600" />
                            )}
                          </button>
                        </td>
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
