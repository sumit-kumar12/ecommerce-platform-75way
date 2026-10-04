"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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

const formatMinutes = (value) => {
  if (value === null || value === undefined) return "--";
  if (value < 60) return `${value}m`;
  const hours = Math.floor(value / 60);
  if (hours < 24) return `${hours}h ${value % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};

const riskTone = (flag) => {
  if (flag === "IP_CHANGED" || flag === "USER_AGENT_CHANGED") return "bg-red-500/10 text-red-400 border-red-500/20";
  if (flag === "NO_ACTIVE_REFRESH_TOKEN" || flag === "LONG_LIVED_SESSION") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-zinc-800 text-zinc-400 border-zinc-700";
};

export default function LockoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("q") ?? "";
  
  const [status, setStatus] = useState({ locked: false, activeSessions: 0, lockedAt: null, reason: null });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [message, setMessage] = useState("");
  const [refreshedAt, setRefreshedAt] = useState(null);
  const [search, setSearch] = useState(routeQuery);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const [statusResult, sessionsResult] = await Promise.allSettled([
      adminRequest("/lockout/status"),
      adminRequest("/sessions?limit=20"),
    ]);

    if (statusResult.status === "fulfilled") setStatus(statusResult.value);
    if (sessionsResult.status === "fulfilled") setSessions(sessionsResult.value?.sessions ?? []);

    if (statusResult.status === "rejected" || sessionsResult.status === "rejected") {
      setMessage("Some lockout telemetry could not be loaded. Critical controls remain available.");
    }

    setRefreshedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setSearch(routeQuery); }, [routeQuery]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [pathname, router, search, searchParams]);

  const engageLockout = async () => {
    if (confirmValue !== "LOCK") {
      setMessage("Type LOCK to authorize emergency lockout.");
      return;
    }
    setActing(true);
    setMessage("");
    try {
      await adminRequest("/lockout", { method: "POST", body: { action: "lock", reason: "Manual emergency lockout by admin" } });
      setConfirmValue("");
      setMessage("Emergency lockout engaged. Remote sessions were revoked.");
      await load();
    } catch (error) {
      setMessage(error.message || "Emergency lockout failed.");
    } finally {
      setActing(false);
    }
  };

  const releaseLockout = async () => {
    setActing(true);
    setMessage("");
    try {
      await adminRequest("/lockout", { method: "POST", body: { action: "unlock" } });
      setMessage("Emergency lockout released.");
      await load();
    } catch (error) {
      setMessage(error.message || "Unable to release lockout.");
    } finally {
      setActing(false);
    }
  };

  const revokeSession = async (sessionId) => {
    try {
      await adminRequest(`/sessions/${sessionId}`, { method: "DELETE" });
      await load();
    } catch (error) {
      setMessage(error.message || "Session revocation failed.");
    }
  };

  const revokeAllSessions = async () => {
    try {
      await adminRequest("/sessions", { method: "DELETE" });
      setMessage("All remote sessions were revoked.");
      await load();
    } catch (error) {
      setMessage(error.message || "Bulk session revocation failed.");
    }
  };

  const lastSeenAt = useMemo(() => {
    const values = sessions
      .map((session) => new Date(session.lastSeenAt || session.createdAt || 0).getTime())
      .filter((value) => Number.isFinite(value) && value > 0);
    if (values.length === 0) return null;
    return new Date(Math.max(...values));
  }, [sessions]);

  const visibleSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sessions;
    return sessions.filter((session) =>
      [
        session.user?.name,
        session.user?.email,
        session.userId,
        session.ip,
        session.initialIp,
        session.lastSeenIp,
        session.familyId,
        ...(session.riskFlags ?? []),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [search, sessions]);

  const buildUserHref = (session) => {
    const params = new URLSearchParams();
    const query = session?.user?.email || session?.user?.name || session?.userId;
    if (query) params.set("q", query);
    return params.toString() ? `/users?${params.toString()}` : "/users";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Access Control
          </h1>
          <p className="text-xs text-zinc-400 mt-1">High-privilege restriction plane for emergency lockdowns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => void load()} disabled={loading || acting} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors disabled:opacity-50">
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 max-w-7xl mx-auto min-w-0">
          
          {message && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              {message}
            </div>
          )}

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-red-500/10 to-zinc-900/40 border border-red-500/20 rounded-2xl p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Global System Lockout</h2>
              <p className="text-sm text-red-200/70 max-w-2xl leading-relaxed">
                Lockout is a server-authorized emergency control. It immediately blocks new sign-ins and revokes all active remote sessions via the backend workflow. This action cannot be undone.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.locked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {status.locked ? "LOCKOUT ACTIVE" : "OPERATIONAL"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                {status.activeSessions ?? sessions.length} Active Sessions
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold border bg-zinc-800 text-zinc-400 border-zinc-700">
                Last refresh {refreshedAt ? refreshedAt.toLocaleTimeString("en-IN") : "--"}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-black/40 border border-red-500/20 rounded-xl px-4 py-2.5 max-w-md focus-within:border-red-500/50 transition-colors">
              <span className="material-symbols-outlined text-red-500/50">search</span>
              <input
                className="bg-transparent border-none outline-none text-sm text-white placeholder-red-200/30 w-full"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filter sessions by user, email, or IP"
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "System State", value: status.locked ? "Locked" : "Operational", icon: "lock_person", color: status.locked ? "text-red-500" : "text-emerald-500" },
              { label: "Active Sessions", value: String(status.activeSessions ?? sessions.length), icon: "devices", color: "text-blue-500" },
              { label: "Locked At", value: status.lockedAt ? formatDateTime(status.lockedAt) : "--", icon: "schedule", color: "text-orange-500" },
              { label: "Last Activity", value: lastSeenAt ? formatDateTime(lastSeenAt) : "--", icon: "monitoring", color: "text-purple-500" },
            ].map((metric, idx) => (
              <div key={idx} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{metric.label}</span>
                  <span className={`material-symbols-outlined text-[20px] ${metric.color}`}>{metric.icon}</span>
                </div>
                <div className="text-xl font-bold text-white">{metric.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Control Panel */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Emergency Control</h3>
                  <p className="text-xs text-zinc-400 mt-1">{status.locked ? "System is currently restricted." : "Requires manual confirmation."}</p>
                </div>
                
                <div className="w-full h-px bg-zinc-800"></div>

                {!status.locked ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Type <strong>LOCK</strong> below to confirm emergency lockout. This will instantly terminate all active connections.
                    </p>
                    <input
                      className="bg-black/50 border border-zinc-700 focus:border-red-500 rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors uppercase"
                      value={confirmValue}
                      onChange={(event) => setConfirmValue(event.target.value.toUpperCase())}
                      placeholder="Type LOCK"
                    />
                    <button 
                      onClick={() => void engageLockout()} 
                      disabled={acting || loading || confirmValue !== "LOCK"}
                      className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/20 disabled:shadow-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      {acting ? "Locking..." : "Engage Lockout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-orange-300 leading-relaxed">
                      The platform is currently under emergency restriction. Unlock only after reviewing recent audit and threat activity.
                    </p>
                    <button 
                      onClick={() => void releaseLockout()} 
                      disabled={acting || loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock_open</span>
                      {acting ? "Unlocking..." : "Release Lockout"}
                    </button>
                  </div>
                )}
                
                <div className="w-full h-px bg-zinc-800"></div>
                
                <button 
                  onClick={() => void revokeAllSessions()} 
                  disabled={loading || acting || sessions.length === 0}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">block</span>
                  Revoke All Sessions
                </button>
              </div>
            </div>

            {/* Sessions List */}
            <div className="xl:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col h-[600px]">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-white">Active Sessions</h3>
                  <p className="text-xs text-zinc-400 mt-1">Live inventory of connected operators.</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 bg-zinc-800/50 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : visibleSessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                    <span className="material-symbols-outlined text-[48px] opacity-50">devices_off</span>
                    <p className="text-sm">No active sessions found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {visibleSessions.map((session) => (
                      <div key={session.id} className="bg-black/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
                        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-4">
                          <div className="flex flex-col gap-1 min-w-0">
                            <Link href={buildUserHref(session)} className="text-sm font-bold text-purple-400 hover:text-purple-300 truncate">
                              {session.user?.name || session.user?.email || session.userId}
                            </Link>
                            <span className="text-[10px] text-zinc-500 font-mono truncate">{session.familyId || session.id}</span>
                          </div>
                          <button 
                            onClick={() => void revokeSession(session.id)}
                            className="bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-transparent hover:border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                            Revoke
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 font-medium">IP Address</span>
                            <span className="text-zinc-300 font-mono">{session.lastSeenIp || session.initialIp || "--"} {session.ipChanged && <span className="text-red-400">(changed)</span>}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 font-medium">Last Seen</span>
                            <span className="text-zinc-300">{formatDateTime(session.lastSeenAt || session.createdAt)}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 font-medium">Idle / Age</span>
                            <span className="text-zinc-300">{formatMinutes(session.idleMinutes)} / {formatMinutes(session.ageMinutes)}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 font-medium">Device Hash</span>
                            <span className="text-zinc-300 font-mono">{session.deviceHash ? `${session.deviceHash.slice(0, 10)}...` : "--"}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50">
                          {(session.riskFlags?.length ? session.riskFlags : ["NORMAL"]).map((flag) => (
                            <span key={`${session.id}-${flag}`} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskTone(flag)}`}>
                              {flag.replaceAll("_", " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
