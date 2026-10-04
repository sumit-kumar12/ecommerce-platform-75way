import styles from "./AdminContentShell.module.css";

export function AdminContentShell({ children }) {
  return <div className={styles.shell}>{children}</div>;
}
