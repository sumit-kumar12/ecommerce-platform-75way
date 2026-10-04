"use client";
import React from 'react';
import styles from './analytics.module.css';

export default function AnalyticsDashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics & Insights</h1>
        <div className={styles.dateFilter}>
          <select className={styles.select}>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <h3>Total Visitors</h3>
          <p className={styles.metricValue}>45,231</p>
          <span className={styles.positive}>+15.2%</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Bounce Rate</h3>
          <p className={styles.metricValue}>32.4%</p>
          <span className={styles.negative}>-2.1%</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Avg. Session Duration</h3>
          <p className={styles.metricValue}>3m 45s</p>
          <span className={styles.positive}>+0m 12s</span>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartPanel}>
          <h2 className={styles.panelTitle}>Traffic Sources</h2>
          <div className={styles.pieChartContainer}>
            <div className={styles.pieChart}></div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: '#8C63F5'}}></span> Direct (40%)
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: '#00DAFF'}}></span> Organic Search (35%)
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: '#F02E81'}}></span> Social (15%)
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: '#10b981'}}></span> Referral (10%)
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartPanel}>
          <h2 className={styles.panelTitle}>Top Performing Pages</h2>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Page Path</th>
                <th>Views</th>
                <th>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>/category/electronics</td>
                <td>12,450</td>
                <td>02:30</td>
              </tr>
              <tr>
                <td>/offers</td>
                <td>8,210</td>
                <td>01:45</td>
              </tr>
              <tr>
                <td>/product/wh-1001</td>
                <td>6,340</td>
                <td>04:15</td>
              </tr>
              <tr>
                <td>/brand/apple</td>
                <td>5,920</td>
                <td>02:10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
