import styles from "./ResourceMatrix.module.css";

export function ResourceMatrix({ resources, loading }) {
  const nodes = resources?.length > 0 ? resources : [
    { id: "SYSTEM", type: "Cluster Hub", cpu: 0, mem: "0 / 0", net: "0 Mb/s", status: "LOADING", color: "primary" }
  ];

  return (
    <div className={`${styles.container} glass-panel`}>
      <div className="glass-card-header">
        <h4 className={styles.header}>Resource Grid Matrix</h4>
        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={`${styles.dot} ${styles.bgSuccess}`}></span> Active</div>
          <div className={styles.legendItem}><span className={`${styles.dot} ${styles.bgWarning}`}></span> Stress</div>
          <div className={styles.legendItem}><span className={`${styles.dot} ${styles.bgDanger}`}></span> Failed</div>
        </div>
      </div>
      <div className={styles.body}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Node ID</th>
              <th>Type</th>
              <th>CPU Load</th>
              <th>Memory</th>
              <th>Net IO</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n, i) => (
              <tr key={i}>
                <td className={styles.nodeId}>{n.id}</td>
                <td className={styles.nodeType}>{n.type}</td>
                <td>
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressBar}>
                      <div className={`${styles.progressFill} ${styles[n.color]}`} style={{ width: `${n.cpu}%` }}></div>
                    </div>
                    <span>{n.cpu}%</span>
                  </div>
                </td>
                <td className={styles.nodeMeta}>{n.mem}</td>
                <td className={styles.nodeMeta}>{n.net}</td>
                <td><span className={styles[n.color]}>{n.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
