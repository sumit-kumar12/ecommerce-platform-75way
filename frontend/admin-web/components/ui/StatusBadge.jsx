import styles from "./StatusBadge.module.css";

const TONE_MAP = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warn: "warn",
  danger: "danger",
};

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function StatusBadge({ children, tone = "neutral", className = "" }) {
  const toneClass = styles[TONE_MAP[tone] || TONE_MAP.neutral];
  return <span className={joinClasses(styles.badge, toneClass, className)}>{children}</span>;
}
