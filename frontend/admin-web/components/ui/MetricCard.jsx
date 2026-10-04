import Link from "next/link";
import styles from "./MetricCard.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function MetricCard({ label, value, delta, icon, footer, href, className = "" }) {
  const content = (
    <>
      <div className={styles.topRow}>
        <div>
          <p className={styles.label}>{label}</p>
          <h3 className={styles.value}>{value}</h3>
        </div>
        {icon ? (
          <div className={styles.iconWrap}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        ) : null}
      </div>
      {delta ? <p className={styles.delta}>{delta}</p> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={joinClasses(styles.card, styles.linkCard, className)}>
        {content}
      </Link>
    );
  }

  return <div className={joinClasses(styles.card, className)}>{content}</div>;
}
