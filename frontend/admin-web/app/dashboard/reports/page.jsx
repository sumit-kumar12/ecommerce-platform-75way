"use client";
import React from 'react';
import styles from './reports.module.css';

export default function ReportsDashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Custom Reports</h1>
        <button className={styles.createBtn}>+ Create New Report</button>
      </div>

      <div className={styles.savedReports}>
        <h2 className={styles.sectionTitle}>Saved Reports</h2>
        <div className={styles.reportsGrid}>
          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>📊</span>
              <button className={styles.menuBtn}>⋮</button>
            </div>
            <h3 className={styles.reportTitle}>Monthly Sales Summary</h3>
            <p className={styles.reportDesc}>Aggregated sales data grouped by product category.</p>
            <div className={styles.cardFooter}>
              <span className={styles.meta}>Generated: Today</span>
              <button className={styles.downloadBtn}>Download CSV</button>
            </div>
          </div>

          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>👥</span>
              <button className={styles.menuBtn}>⋮</button>
            </div>
            <h3 className={styles.reportTitle}>Customer Churn Rate</h3>
            <p className={styles.reportDesc}>Analysis of customers who haven't ordered in 90 days.</p>
            <div className={styles.cardFooter}>
              <span className={styles.meta}>Generated: 2 days ago</span>
              <button className={styles.downloadBtn}>Download PDF</button>
            </div>
          </div>

          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>📦</span>
              <button className={styles.menuBtn}>⋮</button>
            </div>
            <h3 className={styles.reportTitle}>Inventory Status</h3>
            <p className={styles.reportDesc}>List of products below minimum stock threshold.</p>
            <div className={styles.cardFooter}>
              <span className={styles.meta}>Generated: Weekly</span>
              <button className={styles.downloadBtn}>Download Excel</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.reportBuilder}>
        <h2 className={styles.sectionTitle}>Quick Report Builder</h2>
        <div className={styles.builderForm}>
          <div className={styles.formGroup}>
            <label>Data Source</label>
            <select className={styles.input}>
              <option>Sales & Revenue</option>
              <option>Customers & Demographics</option>
              <option>Inventory & Products</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Date Range</label>
            <div className={styles.dateInputs}>
              <input type="date" className={styles.input} />
              <span>to</span>
              <input type="date" className={styles.input} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Group By</label>
            <select className={styles.input}>
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
            </select>
          </div>
          <button className={styles.generateBtn}>Generate Preview</button>
        </div>
      </div>
    </div>
  );
}
