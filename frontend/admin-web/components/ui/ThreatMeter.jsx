import styles from "./ThreatMeter.module.css";

function clampPercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

export function ThreatMeter({ percent, label, sublabel, className = "" }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const safePercent = clampPercent(percent);
  const dashOffset = circumference - (safePercent / 100) * circumference;

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 140 140" className={styles.ringSvg} aria-hidden="true">
          <circle cx="70" cy="70" r={radius} className={styles.track} />
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={styles.value}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className={styles.center}>
          <strong>{safePercent}%</strong>
          <span>{label}</span>
        </div>
      </div>
      {sublabel ? <p className={styles.sub}>{sublabel}</p> : null}
    </div>
  );
}
