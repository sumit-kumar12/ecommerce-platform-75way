import styles from "./GlassPanel.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function GlassPanel({ as: Tag = "div", children, className = "", elevated = false, ...props }) {
  return (
    <Tag className={joinClasses(styles.panel, elevated ? styles.elevated : "", className)} {...props}>
      {children}
    </Tag>
  );
}
