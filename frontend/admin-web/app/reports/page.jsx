"use client";
import React from 'react';
import styles from './reports.module.css';

export default function ReportsAdmin() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sales Overview</h1>
        <button className={styles.exportBtn}>Export Data</button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Sales</h3>
          <p className={styles.statValue}>₹12,45,000</p>
          <span className={styles.positive}>+15% this month</span>
        </div>
        <div className={styles.statCard}>
          <h3>Orders</h3>
          <p className={styles.statValue}>3,421</p>
          <span className={styles.positive}>+8% this month</span>
        </div>
        <div className={styles.statCard}>
          <h3>Avg. Order Value</h3>
          <p className={styles.statValue}>₹363</p>
          <span className={styles.negative}>-2% this month</span>
        </div>
      </div>

      <div className={styles.chartPanel}>
        <h2 className={styles.panelTitle}>Sales Trend</h2>
        <div className={styles.chartPlaceholder}>
          <div className={styles.areaChart}></div>
          <div className={styles.xLabels}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>
      </div>
    </div>
  );
}
