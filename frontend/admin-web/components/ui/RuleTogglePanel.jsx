"use client";
import styles from "./RuleTogglePanel.module.css";

export function RuleTogglePanel({ namespace, permissions, selectedPermissions, onToggle }) {
  return (
    <section className={styles.section}>
      <div className={styles.namespaceHeader}>
        <strong>{namespace}</strong>
        <small>{permissions.length} permissions</small>
      </div>
      <div className={styles.permissionList}>
        {permissions.map((permission) => {
          const hasPermission = selectedPermissions.includes(permission);
          return (
            <button
              key={permission}
              type="button"
              className={hasPermission ? styles.permissionItemActive : styles.permissionItem}
              onClick={() => onToggle(permission)}
            >
              <span className={hasPermission ? styles.checkboxOn : styles.checkboxOff}>
                {hasPermission ? <span className={`material-symbols-outlined ${styles.checkIcon}`}>check</span> : null}
              </span>
              <code>{permission}</code>
            </button>
          );
        })}
      </div>
    </section>
  );
}

