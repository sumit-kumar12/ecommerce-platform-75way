"use client";
import React from 'react';
import styles from './products.module.css';

export default function ProductReportsAdmin() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Product Performance</h1>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.chartPanel}>
          <h2 className={styles.panelTitle}>Top Selling Categories</h2>
          <div className={styles.barChartContainer}>
            {[
              { label: 'Electronics', val: 80 },
              { label: 'Fashion', val: 65 },
              { label: 'Home', val: 45 },
              { label: 'Beauty', val: 30 }
            ].map((item, i) => (
              <div key={i} className={styles.barRow}>
                <span className={styles.barLabel}>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tablePanel}>
          <h2 className={styles.panelTitle}>Top Products</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Wireless Headphones WH-1001</td>
                <td>1,245</td>
                <td>₹31,11,255</td>
              </tr>
              <tr>
                <td>Smartphone Pro Max</td>
                <td>856</td>
                <td>₹68,47,144</td>
              </tr>
              <tr>
                <td>Ergonomic Office Chair</td>
                <td>432</td>
                <td>₹21,59,568</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
