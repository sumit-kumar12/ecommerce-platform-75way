import styles from "./ThreatEngineScore.module.css";

export function ThreatEngineScore({ security, loading }) {
  const score = loading ? 0 : (security?.healthScore !== undefined ? security.healthScore : Math.min(100, (security?.recentThreatEvents || 0) * 8));
  const reverseScore = 100 - score; // Risk level is often inverse of health
  const colorClass = reverseScore < 30 ? styles.lowRisk : reverseScore < 70 ? styles.mediumRisk : styles.highRisk;

  return (
    <div className={`${styles.container} glass-panel`}>
      <div className="glass-card-header">
        <h4 className={styles.header}>Threat Engine Score</h4>
        <div className={styles.actions}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', opacity: 0.6 }}>security</span>
        </div>
      </div>
      <div className={styles.body}>
      <div className={styles.content}>
        <div className={styles.meterWrapper}>
          <svg className={styles.meterSvg}>
            <circle className={styles.bgCircle} cx="64" cy="64" r="58"></circle>
            <circle 
              className={`${styles.fgCircle} ${colorClass}`} 
              cx="64" cy="64" r="58" 
              style={{ strokeDasharray: 365, strokeDashoffset: 365 - (365 * score) / 100 }}
            ></circle>
          </svg>
          <div className={styles.meterTextCenter}>
            <span className={`${styles.meterValue} ${colorClass}`}>{loading ? "--" : reverseScore}</span>
            <p className={styles.meterLabel}>RISK LEVEL</p>
          </div>
        </div>
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <p className={styles.detailLabel}>Blocked IPs</p>
            <p className={`${styles.detailValue} ${styles.lowRisk}`}>{loading ? "--" : security?.blockedIps || 0}</p>
          </div>
          <div className={styles.detailCard}>
            <p className={styles.detailLabel}>Mismatches</p>
            <p className={`${styles.detailValue} ${security?.paymentMismatches > 0 ? styles.highRisk : styles.lowRisk}`}>
              {loading ? "--" : security?.paymentMismatches || 0}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
