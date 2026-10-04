import { GlassPanel } from "./GlassPanel";
import styles from "./EmptyState.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function EmptyState({ title, description, icon = "inventory_2", className = "", actions = null }) {
  return (
    <GlassPanel className={joinClasses(styles.panel, className)}>
      <span className={joinClasses("material-symbols-outlined", styles.icon)}>{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </GlassPanel>
  );
}
