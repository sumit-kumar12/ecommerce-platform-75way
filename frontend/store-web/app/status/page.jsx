"use client";
import React from 'react';
import styles from './status.module.css';

export default function SystemStatus() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Status</h1>
        <p className={styles.subtitle}>Real-time status of KataBazaar services and APIs.</p>
      </div>

      <div className={styles.statusBanner}>
        <div className={styles.bannerIcon}>✅</div>
        <div className={styles.bannerText}>
          <h2>All Systems Operational</h2>
          <p>Last updated: Just now</p>
        </div>
      </div>

      <div className={styles.serviceGrid}>
        {[
          { name: 'Storefront Web', status: 'Operational', uptime: '99.99%' },
          { name: 'Admin Dashboard', status: 'Operational', uptime: '99.98%' },
          { name: 'Merchant Portal', status: 'Operational', uptime: '99.99%' },
          { name: 'Payment Gateway', status: 'Operational', uptime: '100.00%' },
          { name: 'API Core Services', status: 'Operational', uptime: '99.95%' },
          { name: 'Search Engine', status: 'Operational', uptime: '99.90%' }
        ].map((svc, i) => (
          <div key={i} className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <h3 className={styles.serviceName}>{svc.name}</h3>
              <span className={`${styles.statusBadge} ${styles.statusOperational}`}>
                {svc.status}
              </span>
            </div>
            <div className={styles.uptimeBar}></div>
            <div className={styles.uptimeText}>
              <span>Past 90 Days</span>
              <span>{svc.uptime}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.incidentHistory}>
        <h2 className={styles.historyTitle}>Past Incidents</h2>
        <div className={styles.incidentList}>
          <div className={styles.incidentItem}>
            <div className={styles.incidentDate}>May 12, 2026</div>
            <h4 className={styles.incidentTitle}>Partial API Outage</h4>
            <p className={styles.incidentDesc}>
              <strong>Resolved</strong> - We identified and resolved an issue causing slow response times in the Merchant Portal API. The issue was traced to a database index and has been corrected.
            </p>
          </div>
          <div className={styles.incidentItem}>
            <div className={styles.incidentDate}>April 03, 2026</div>
            <h4 className={styles.incidentTitle}>Search Engine Degraded Performance</h4>
            <p className={styles.incidentDesc}>
              <strong>Resolved</strong> - The search cluster experienced high load leading to increased latency. Additional nodes were provisioned to stabilize performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
