import styles from "./RecentActivity.module.css";

const ACTION_MAP = {
  INCIDENT_CREATED: { color: "danger", icon: "emergency" },
  INCIDENT_UPDATED: { color: "primary", icon: "update" },
  SECURITY_OVERVIEW_READ: { color: "cyan", icon: "visibility" },
  ADMIN_LOGIN: { color: "success", icon: "admin_panel_settings" },
  GLOBAL_LOCKOUT: { color: "danger", icon: "lock" },
};

export function RecentActivity({ activity, loading }) {
  const items = loading ? [] : (activity || []).map(log => ({
    title: (log.event || "").replace(/_/g, " "),
    time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false }) : "--",
    node: log.ip || "Secure uplink",
    type: log.resource,
    color: ACTION_MAP[log.event]?.color || "muted"
  }));

  return (
    <div className={`${styles.container} glass-panel`}>
      <div className="glass-card-header">
        <h4 className={styles.header}>Live Audit Stream</h4>
        <div className={styles.actions}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', opacity: 0.6 }}>history</span>
        </div>
      </div>
      <div className={styles.body}>
      <div className={styles.timeline}>
        {loading ? (
          <div className="text-xs text-slate-500 py-4">Syncing with system journal...</div>
        ) : items.length === 0 ? (
          <div className="text-xs text-slate-500 py-4">No recent records.</div>
        ) : (
          items.map((a, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.connector}>
                <div className={`${styles.dot} ${styles[a.color]}`}></div>
                {i < items.length - 1 && <div className={styles.line}></div>}
              </div>
              <div className={styles.content}>
                <p className={`${styles.title} ${a.color === "danger" ? styles.threatText : ""}`}>
                  {a.title}
                </p>
                <p className={styles.resource}>{a.type || "control_surface"}</p>
                <p className={styles.meta}>
                  {a.time} | {a.node}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}
