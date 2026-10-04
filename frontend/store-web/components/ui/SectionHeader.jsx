import styles from "./SectionHeader.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function SectionHeader({ eyebrow, title, description, action, className = "" }) {
  return (
    <div className={joinClasses(styles.header, className)}>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
