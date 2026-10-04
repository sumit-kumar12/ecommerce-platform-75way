import styles from "./IncidentTimeline.module.css";

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function IncidentTimeline({ items = [] }) {
  if (!items.length) {
    return (
      <div className={styles.empty}>
        <span className="material-symbols-outlined">history</span>
        <p>No incident timeline entries are available.</p>
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <article key={`${item.id || item.timestamp || "event"}-${index}`} className={styles.item}>
          <span className={styles.dot}></span>
          <div className={styles.body}>
            <strong>{item.title || item.action || item.status || "Timeline event"}</strong>
            <p>{item.description || item.note || item.summary || "No detail provided."}</p>
            <small>{formatDateTime(item.timestamp || item.createdAt || item.updatedAt)}</small>
          </div>
        </article>
      ))}
    </div>
  );
}
