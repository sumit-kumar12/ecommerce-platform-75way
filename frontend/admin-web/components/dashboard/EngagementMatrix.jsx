import styles from "./EngagementMatrix.module.css";

export function EngagementMatrix({ data, loading }) {
  const sessions = data?.sessions || [];
  const orders = data?.orders || [];

  return (
    <div className={`${styles.container} glass-panel`}>
      <div className="glass-card-header">
        <div className={styles.titleInfo}>
          <h3 className={styles.title}>
            <span className="material-symbols-outlined">analytics</span>
            Enterprise Engagement & Transaction Matrix
          </h3>
          <p className={styles.subtitle}>Real-time customer throughput | Live Telemetry</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.badge}>Live Update: 3s</div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Section 1: Active Sessions */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Active User Navigation</h4>
            <span className={styles.badge}>{sessions.length} Active</span>
          </div>
          <div className={styles.list}>
            {loading ? (
              <div className={styles.loadingOverlay}>Scanning user sessions...</div>
            ) : sessions.length === 0 ? (
              <div className={styles.loadingOverlay}>No active sessions detected</div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className={styles.listItem}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{s.user}</span>
                    <span className={styles.userMeta}>
                      <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>near_me</span>
                      {s.page}
                    </span>
                  </div>
                  <div className={styles.statusInfo}>
                    <span className={styles.statusText} style={{ color: 'var(--accent-cyan)' }}>ACTIVE</span>
                    <span className={styles.statusTime}>{new Date(s.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Recent Transactions */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Recent Order Fulfillment</h4>
            <span className={styles.badge} style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)' }}>
              Latest Transactions
            </span>
          </div>
          <div className={styles.list}>
          {loading ? (
              <div className={styles.loadingOverlay}>Harvesting transactions...</div>
            ) : orders.length === 0 ? (
              <div className={styles.loadingOverlay}>Waiting for new orders...</div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className={styles.listItem}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{o.user}</span>
                    <span className={styles.userMeta}>REF: {o.id.split('-')[0]}</span>
                  </div>
                  <div className={styles.statusInfo}>
                    <span className={styles.amount}>₹{o.amount}</span>
                    <span className={styles.statusTime} style={{ color: 'var(--accent-success)' }}>{o.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

