"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "../../components/ui/ButtonPrimary";
import { ButtonSecondary } from "../../components/ui/ButtonSecondary";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { adminRequest } from "../../lib/api";
import styles from "./page.module.css";

const CHANNEL_OPTIONS = [
  { id: "sms", label: "SMS Message", icon: "sms", tone: styles.channelBlue },
  { id: "email", label: "Email Alert", icon: "mail", tone: styles.channelRed },
  { id: "whatsapp", label: "WhatsApp", icon: "chat", tone: styles.channelGreen },
  { id: "push", label: "Push Notification", icon: "notifications", tone: styles.channelPurple },
  { id: "webhook", label: "Webhook", icon: "link", tone: styles.channelSlate },
];

const SEVERITY_CARDS = [
  {
    id: "LOW",
    title: "System Alert",
    description: "Routine notifications, maintenance, and general updates.",
    icon: "info",
    tone: styles.levelSystem,
  },
  {
    id: "HIGH",
    title: "Warning",
    description: "High-importance alerts requiring user awareness but no immediate action.",
    icon: "warning",
    tone: styles.levelWarning,
  },
  {
    id: "CRITICAL",
    title: "Critical / IP Block",
    description: "Immediate threat, containment, or lockout communication.",
    icon: "bolt",
    tone: styles.levelCritical,
  },
];

const AUDIENCE_PRESETS = [
  { id: "all", label: "All Platform Users", recipients: "" },
  { id: "merchants", label: "Verified Merchants Only", recipients: "merchants@katabazaar.local" },
  { id: "staff", label: "Admin & Staff Only", recipients: "ops@katabazaar.local, secops@katabazaar.local" },
  { id: "regional", label: "Region: North America", recipients: "north-america@katabazaar.local" },
];

const createEmptyDraft = () => ({
  enabled: false,
  channels: ["email"],
  severity: "HIGH",
  recipients: "",
  headline: "",
  details: "",
});

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const severityTone = (value) => {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "CRITICAL") return "danger";
  if (normalized === "HIGH") return "warn";
  if (normalized === "LOW") return "info";
  return "neutral";
};

const formatChannels = (channels) => {
  if (!Array.isArray(channels) || channels.length === 0) return "Manual scope";
  return channels.map((value) => String(value).toUpperCase()).join(" / ");
};

const splitEmergencyMessage = (message) => {
  const source = String(message || "").trim();
  if (!source) {
    return { headline: "No message", details: "" };
  }
  const [headline, ...rest] = source.split("\n");
  return {
    headline: headline.trim(),
    details: rest.join("\n").trim(),
  };
};

const recipientCountLabel = (recipients) => {
  if (!Array.isArray(recipients) || recipients.length === 0) return "All configured users";
  return `${recipients.length} targeted recipients`;
};

export default function EmergencyPage() {
  const router = useRouter();
  const [draft, setDraft] = useState(createEmptyDraft());
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshedAt, setRefreshedAt] = useState(null);

  const hydrateDraftFromConfig = useCallback((config) => {
    const audiencePreset = AUDIENCE_PRESETS.find((preset) => preset.recipients === String(config?.recipients || ""));
    setDraft((current) => ({
      ...current,
      enabled: Boolean(config?.enabled),
      channels: Array.isArray(config?.channels) && config.channels.length > 0 ? config.channels : ["email"],
      severity: String(config?.severity || "HIGH").toUpperCase(),
      recipients: String(config?.recipients || ""),
      audience: audiencePreset?.id ?? "custom",
    }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const [configResult, historyResult] = await Promise.allSettled([
      adminRequest("/emergency/config"),
      adminRequest("/emergency/history?limit=20"),
    ]);

    if (configResult.status === "fulfilled") {
      hydrateDraftFromConfig(configResult.value);
    }

    if (historyResult.status === "fulfilled") {
      setHistory(Array.isArray(historyResult.value?.alerts) ? historyResult.value.alerts : []);
    }

    if (configResult.status === "rejected" || historyResult.status === "rejected") {
      setMessage("Some emergency telemetry could not be loaded. Broadcast actions remain available.");
    }

    setRefreshedAt(new Date());
    setLoading(false);
  }, [hydrateDraftFromConfig]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectAudience = (audienceId) => {
    const preset = AUDIENCE_PRESETS.find((entry) => entry.id === audienceId);
    setDraft((current) => ({
      ...current,
      audience: audienceId,
      recipients: preset ? preset.recipients : current.recipients,
    }));
  };

  const toggleChannel = (channelId) => {
    setDraft((current) => {
      const hasChannel = current.channels.includes(channelId);
      return {
        ...current,
        channels: hasChannel ? current.channels.filter((value) => value !== channelId) : [...current.channels, channelId],
      };
    });
  };

  const sendBroadcast = async () => {
    if (!draft.headline.trim()) {
      setMessage("Alert headline is required.");
      return;
    }

    if (!draft.details.trim()) {
      setMessage("Detailed emergency instructions are required.");
      return;
    }

    if (draft.channels.length === 0) {
      setMessage("Select at least one delivery channel.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const recipients = String(draft.recipients || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      const payload = {
        enabled: Boolean(draft.enabled),
        channels: draft.channels,
        severity: draft.severity,
        message: `${draft.headline.trim()}\n${draft.details.trim()}`,
        recipients,
      };

      const result = await adminRequest("/emergency/broadcast", {
        method: "POST",
        body: payload,
      });

      if (result?.alert) {
        setHistory((current) => [
          {
            ...result.alert,
            sentAt: result.alert.sentAt || result.alert.createdAt,
            channels: Array.isArray(result.alert.channels) ? result.alert.channels : draft.channels,
            recipients: Array.isArray(result.alert.recipients) ? result.alert.recipients : recipients,
          },
          ...current,
        ]);
      }

      setDraft((current) => ({
        ...current,
        headline: "",
        details: "",
      }));
      setMessage("Emergency broadcast sent and operator defaults updated.");
      setRefreshedAt(new Date());
    } catch (error) {
      setMessage(error.message || "Emergency broadcast failed.");
    } finally {
      setSending(false);
    }
  };

  const handleAddProtocolDoc = () => {
    alert("Protocol Document Attached: SECURITY_PROTOCOL_CONTAINMENT_v1.0.pdf. Detailed instructions have been appended to emergency report.");
    setDraft((current) => ({
      ...current,
      details: current.details + (current.details ? "\n\n" : "") + "[REF_DOC: SECURITY_PROTOCOL_CONTAINMENT_v1.0.pdf]"
    }));
  };

  const handleInsertSystemLink = () => {
    const link = window.prompt("Enter System URL to insert:", "https://katabazaar.local/status");
    if (link) {
      setDraft((current) => ({
        ...current,
        details: current.details + (current.details ? " " : "") + link
      }));
    }
  };

  const recentCritical = useMemo(
    () => history.filter((entry) => String(entry.severity).toUpperCase() === "CRITICAL").length,
    [history],
  );
  const lastAlert = history[0] ?? null;
  const selectedPreset = AUDIENCE_PRESETS.find((entry) => entry.id === draft.audience) ?? null;
  const systemStatus = recentCritical > 0 ? "Critical activity in recent history." : "System operational. No active wide-scale threats detected in recent history.";

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Main menu</p>
            <div className={styles.navList}>
              <button type="button" className={styles.navItem} onClick={() => router.push("/dashboard")}>
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </button>
              <button type="button" className={styles.navItemActive} onClick={() => router.push("/emergency")}>
                <span className="material-symbols-outlined">campaign</span>
                <span>Broadcasts</span>
              </button>
              <button type="button" className={styles.navItem} onClick={() => router.push("/users")}>
                <span className="material-symbols-outlined">group</span>
                <span>User Directory</span>
              </button>
              <button type="button" className={styles.navItem} onClick={() => router.push("/audit")}>
                <span className="material-symbols-outlined">security_update_good</span>
                <span>System Logs</span>
              </button>
              <button type="button" className={styles.navItem} onClick={() => router.push("/lockout")}>
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </button>
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <span className="material-symbols-outlined">emergency_home</span>
              <span>System Status</span>
            </div>
            <p>{systemStatus}</p>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <span className={styles.portalPill}>
                <span className={styles.portalPing}></span>
                Active Emergency Portal
              </span>
              <h1>Emergency Broadcast</h1>
              <p>Configure and trigger immediate multi-channel alerts across the network infrastructure.</p>
            </div>
            <div className={styles.headerMeta}>
              <span className="material-symbols-outlined">schedule</span>
              <span>Last Broadcast: {lastAlert ? formatDateTime(lastAlert.sentAt) : "No broadcasts yet"}</span>
            </div>
          </header>

          {message ? (
            <div className={styles.message}>
              <span className="material-symbols-outlined">campaign</span>
              <span>{message}</span>
            </div>
          ) : null}

          <div className={styles.configGrid}>
            <section className={styles.primaryColumn}>
              <GlassPanel className={styles.panel} elevated>
                <div className={styles.panelHeader}>
                  <h2>
                    <span className="material-symbols-outlined">warning</span>
                    Select Alert Level
                  </h2>
                </div>
                <div className={styles.levelGrid}>
                  {SEVERITY_CARDS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      className={draft.severity === level.id ? styles.levelCardActive : styles.levelCard}
                      onClick={() => setDraft((current) => ({ ...current, severity: level.id }))}
                    >
                      <div className={`${styles.levelIcon} ${level.tone}`}>
                        <span className="material-symbols-outlined">{level.icon}</span>
                      </div>
                      <h3>{level.title}</h3>
                      <p>{level.description}</p>
                      <span className={styles.levelCheck}>
                        <span className="material-symbols-outlined">check_circle</span>
                      </span>
                    </button>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className={styles.panel} elevated>
                <div className={styles.panelHeader}>
                  <h2>
                    <span className="material-symbols-outlined">edit_note</span>
                    Compose Broadcast
                  </h2>
                  <button
                    type="button"
                    className={draft.enabled ? styles.toggleOn : styles.toggleOff}
                    onClick={() => setDraft((current) => ({ ...current, enabled: !current.enabled }))}
                    aria-label="Toggle broadcast portal"
                  >
                    <span className={styles.toggleThumb}></span>
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="headline">Alert Headline</label>
                    <input
                      id="headline"
                      className={styles.input}
                      value={draft.headline}
                      onChange={(event) => setDraft((current) => ({ ...current, headline: event.target.value }))}
                      placeholder="e.g. Unusual login activity detected from unknown location"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="details">Detailed Message</label>
                    <textarea
                      id="details"
                      className={styles.textarea}
                      value={draft.details}
                      onChange={(event) => setDraft((current) => ({ ...current, details: event.target.value }))}
                      placeholder="Enter detailed emergency instructions here..."
                    ></textarea>
                  </div>
                  <div className={styles.helperRow}>
                    <button type="button" className={styles.helperButton} onClick={handleAddProtocolDoc}>
                      <span className="material-symbols-outlined">attach_file</span>
                      Add Protocol Doc
                    </button>
                    <button type="button" className={styles.helperButton} onClick={handleInsertSystemLink}>
                      <span className="material-symbols-outlined">link</span>
                      Insert System Link
                    </button>
                  </div>
                </div>
              </GlassPanel>
            </section>

            <section className={styles.sideColumn}>
              <GlassPanel className={styles.panel} elevated>
                <div className={styles.panelHeader}>
                  <h2>
                    <span className="material-symbols-outlined">hub</span>
                    Broadcast Channels
                  </h2>
                </div>
                <div className={styles.channelList}>
                  {CHANNEL_OPTIONS.map((channel) => (
                    <div key={channel.id} className={styles.channelRow}>
                      <div className={styles.channelMeta}>
                        <div className={`${styles.channelIcon} ${channel.tone}`}>
                          <span className="material-symbols-outlined">{channel.icon}</span>
                        </div>
                        <span>{channel.label}</span>
                      </div>
                      <button
                        type="button"
                        className={draft.channels.includes(channel.id) ? styles.toggleOn : styles.toggleOff}
                        onClick={() => toggleChannel(channel.id)}
                        aria-label={`Toggle ${channel.label}`}
                      >
                        <span className={styles.toggleThumb}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className={styles.panel} elevated>
                <div className={styles.panelHeader}>
                  <h2>Audience Segment</h2>
                </div>
                <select
                  className={styles.select}
                  value={selectedPreset?.id ?? "custom"}
                  onChange={(event) => selectAudience(event.target.value)}
                >
                  {AUDIENCE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>{preset.label}</option>
                  ))}
                  <option value="custom">Custom recipients</option>
                </select>
                <input
                  className={styles.input}
                  value={draft.recipients}
                  onChange={(event) => setDraft((current) => ({ ...current, recipients: event.target.value, audience: "custom" }))}
                  placeholder="ops@katabazaar.local, secops@katabazaar.local"
                />
                <div className={styles.audienceMeta}>
                  <span className="material-symbols-outlined">group</span>
                  <span>Estimated delivery: ~45 seconds</span>
                </div>
                <ButtonPrimary type="button" icon="send" onClick={() => void sendBroadcast()} disabled={sending || loading}>
                  {sending ? "Triggering..." : "Trigger Broadcast"}
                </ButtonPrimary>
              </GlassPanel>
            </section>
          </div>

          <GlassPanel className={styles.historyPanel} elevated>
            <div className={styles.historyHeader}>
              <h2>Recent Broadcast History</h2>
              <div className={styles.historyActions}>
                <StatusBadge tone={draft.enabled ? "success" : "neutral"}>{draft.enabled ? "Portal Armed" : "Manual Mode"}</StatusBadge>
                <ButtonSecondary type="button" icon="refresh" onClick={() => void load()} disabled={loading || sending}>
                  Refresh
                </ButtonSecondary>
              </div>
            </div>

            {loading ? (
              <div className={styles.historyLoading}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <span key={`history-loading-${index}`} className={styles.loadingBar}></span>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className={styles.emptyState}>
                <span className="material-symbols-outlined">campaign</span>
                <p>No emergency broadcasts have been sent yet.</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Alert Type</th>
                      <th>Subject</th>
                      <th>Reach</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => {
                      const parsed = splitEmergencyMessage(entry.message);
                      return (
                        <tr key={entry.id}>
                          <td>{formatDateTime(entry.sentAt)}</td>
                          <td>
                            <StatusBadge tone={severityTone(entry.severity)}>{entry.severity}</StatusBadge>
                          </td>
                          <td>
                            <div className={styles.subjectCell}>
                              <strong>{parsed.headline}</strong>
                              <small>{parsed.details || formatChannels(entry.channels)}</small>
                            </div>
                          </td>
                          <td>
                            <div className={styles.reachCell}>
                              <strong>{recipientCountLabel(entry.recipients)}</strong>
                              <small>{formatChannels(entry.channels)}</small>
                            </div>
                          </td>
                          <td>
                            <span className={styles.statusCell}>
                              <span className={styles.statusDot}></span>
                              {entry.status || "SENT"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </main>
      </div>
    </div>
  );
}
