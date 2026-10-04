import styles from "./SecureBadge.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function SecureBadge({ children, className = "", icon = "verified_user", tone = "default" }) {
  return (
    <span className={joinClasses(styles.badge, styles[`tone${tone}`], className)}>
      <span className={joinClasses("material-symbols-outlined", styles.icon)}>{icon}</span>
      <span>{children}</span>
    </span>
  );
}
