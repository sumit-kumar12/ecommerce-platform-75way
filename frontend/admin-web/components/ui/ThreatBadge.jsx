import styles from "./ThreatBadge.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function ThreatBadge({ children, tone = "neutral", icon = "security", className = "" }) {
  return (
    <span className={joinClasses(styles.badge, styles[`tone${tone}`], className)}>
      <span className={joinClasses("material-symbols-outlined", styles.icon)}>{icon}</span>
      <span>{children}</span>
    </span>
  );
}
