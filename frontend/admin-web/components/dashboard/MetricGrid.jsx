import styles from "./MetricGrid.module.css";

export function MetricGrid({ stats, security, loading }) {
  const activeThreats = security?.recentThreatEvents || 0;
  const securityScore = security?.healthScore !== undefined ? security.healthScore : (Math.max(0, 100 - (activeThreats * 2)));
  
  const metrics = [
    {
      label: "System Status",
      value: loading ? "CHECKING..." : (stats ? "OPERATIONAL" : "OFFLINE"),
      icon: stats ? "verified" : "error",
      color: stats ? "success" : "danger",
      glow: true
    },
    {
      label: "Global Users",
      value: loading ? "..." : `${stats?.users || 0}`,
      icon: "group",
      color: "primary",
      glow: true
    },
    {
      label: "Active Threats",
      value: loading ? "..." (activeThreats),
      icon: "radar",
      color: activeThreats > 0 ? "danger" : "cyan",
      glow: true
    },
    {
      label: "Security Score",
      value: loading ? "..." : `${securityScore.toFixed(1)}%`,
      icon: "security",
      color: securityScore > 80 ? "success" : (securityScore > 50 ? "warning" : "danger"),
      glow: true
    }
  ];

  return (
    <div className={styles.grid}>
      {metrics.map((m, i) => (
        <div key={i} className={`${styles.card} glass-panel`}>
          <div className={styles.info}>
            <p className={styles.label}>{m.label}</p>
            <h3 className={`${styles.value} ${m.glow ? styles.neon : ""} ${styles[m.color]}`}>
              {m.value}
            </h3>
          </div>
          <div className={`${styles.iconWrapper} ${styles[m.color]}`}>
            <span className="material-symbols-outlined">{m.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
