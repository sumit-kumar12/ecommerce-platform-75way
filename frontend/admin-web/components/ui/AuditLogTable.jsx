import { StatusBadge } from "./StatusBadge";
import styles from "./AuditLogTable.module.css";

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityTone(value) {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "CRITICAL") return "danger";
  if (normalized === "WARN") return "warn";
  if (normalized === "INFO") return "info";
  return "neutral";
}

export function AuditLogTable({ entries, loading, selectedId, onSelect }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
            <th>Severity</th>
            <th>Actor</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <tr key={`loading-${index}`}>
                <td colSpan={5}><span className={styles.loadingBar}></span></td>
              </tr>
            ))
          ) : entries.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyCell}>No audit entries matched the current filters.</td>
            </tr>
          ) : (
            entries.map((entry, index) => (
              <tr
                key={`${entry.id || entry.timestamp || "entry"}-${index}`}
                className={entry.id === selectedId ? styles.rowSelected : styles.row}
                onClick={() => onSelect(entry.id)}
              >
                <td className={styles.monoSmall}>{formatDateTime(entry.timestamp)}</td>
                <td>
                  <div className={styles.eventCell}>
                    <strong>{entry.event || entry.action || "--"}</strong>
                    <small>{entry.resource || entry.targetType || "Event resource unavailable"}</small>
                  </div>
                </td>
                <td><StatusBadge tone={severityTone(entry.severity)}>{entry.severity || "INFO"}</StatusBadge></td>
                <td>{entry.actor || entry.userId || "system"}</td>
                <td className={styles.mono}>{entry.ip || "--"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
