"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../../lib/api";
import styles from "./sessions.module.css";

function deviceIcon(ip) {
  if (!ip) return "💻";
  return "🖥️";
}

function timeAgo(date) {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Active now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/users/me/sessions")
      .then(res => { if (active) setSessions(res.sessions || []); })
      .catch(err => { if (active) setError("Failed to load sessions."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleRevoke = async (sessionId) => {
    if (!confirm("Revoke this session? That device will need to log in again.")) return;
    setRevoking(sessionId);
    try {
      await apiRequest(`/users/me/sessions/${sessionId}`, { method: "DELETE" });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (e) {
      alert("Failed to revoke session. Please try again.");
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    const others = sessions.slice(1); // keep first (current) session
    if (others.length === 0) return alert("No other sessions to revoke.");
    if (!confirm(`Revoke all ${others.length} other session(s)?`)) return;
    setRevoking("all");
    try {
      await Promise.all(others.map(s => apiRequest(`/users/me/sessions/${s.id}`, { method: "DELETE" })));
      setSessions(prev => prev.slice(0, 1));
    } catch {
      alert("Some sessions could not be revoked. Please try again.");
    } finally {
      setRevoking(null);
    }
  };

  const [current, ...others] = sessions;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Session Management</h1>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", marginBottom: "24px", fontSize: "14px" }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>Loading sessions…</div>
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>No active sessions found.</div>
      ) : (
        <>
          {/* Current Session */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Current Session</h2>
            {current && (
              <div className={`${styles.sessionCard} ${styles.currentSession}`}>
                <div className={styles.sessionInfo}>
                  <div className={styles.iconBox}>{deviceIcon(current.initialIp)}</div>
                  <div>
                    <p className={styles.deviceName}>
                      {current.lastSeenIp || current.initialIp || "Unknown IP"}
                    </p>
                    <p className={styles.location}>
                      Started: {current.createdAt ? new Date(current.createdAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                    <p className={styles.status}>{timeAgo(current.lastSeenAt)}</p>
                  </div>
                </div>
                <span className={styles.currentBadge}>This Device</span>
              </div>
            )}
          </div>

          {/* Other Sessions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Other Sessions
              {others.length > 0 && (
                <span style={{ marginLeft: "8px", background: "rgba(255,255,255,0.08)", fontSize: "12px", padding: "2px 8px", borderRadius: "99px", fontWeight: 500 }}>
                  {others.length}
                </span>
              )}
            </h2>

            {others.length === 0 ? (
              <p style={{ color: "#475569", fontSize: "14px", padding: "16px 0" }}>
                No other active sessions.
              </p>
            ) : (
              <div className={styles.sessionList}>
                {others.map(s => (
                  <div key={s.id} className={styles.sessionCard}>
                    <div className={styles.sessionInfo}>
                      <div className={styles.iconBox}>{deviceIcon(s.lastSeenIp)}</div>
                      <div>
                        <p className={styles.deviceName}>{s.lastSeenIp || s.initialIp || "Unknown IP"}</p>
                        <p className={styles.location}>
                          First seen: {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "—"}
                        </p>
                        <p className={styles.time}>{timeAgo(s.lastSeenAt)}</p>
                      </div>
                    </div>
                    <button
                      className={styles.logoutBtn}
                      onClick={() => handleRevoke(s.id)}
                      disabled={revoking === s.id || revoking === "all"}
                    >
                      {revoking === s.id ? "Revoking…" : "Revoke"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {others.length > 0 && (
            <button
              className={styles.logoutAllBtn}
              onClick={handleRevokeAll}
              disabled={revoking === "all"}
            >
              {revoking === "all" ? "Revoking all…" : `Revoke All Other Sessions (${others.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
