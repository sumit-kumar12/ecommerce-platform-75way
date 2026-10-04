"use client";
import React from 'react';
import styles from './changelog.module.css';

export default function Changelog() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Changelog & Updates</h1>
        <p className={styles.subtitle}>New updates and improvements to KataBazaar.</p>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineItem}>
          <div className={styles.timelineLine}></div>
          <div className={styles.timelineMarker}></div>
          <div className={styles.timelineContent}>
            <div className={styles.itemHeader}>
              <h2 className={styles.version}>v2.4.0 — Unified Analytics</h2>
              <span className={styles.date}>June 10, 2026</span>
            </div>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeFeature}`}>Feature</span>
              <span className={`${styles.badge} ${styles.badgeImprovement}`}>Improvement</span>
            </div>
            <ul className={styles.changesList}>
              <li>Launched the new multi-channel analytics dashboard for merchants.</li>
              <li>Improved page load speeds by 24% across product detail pages.</li>
              <li>Added export capabilities for custom reporting in CSV and PDF formats.</li>
            </ul>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelineLine}></div>
          <div className={styles.timelineMarker}></div>
          <div className={styles.timelineContent}>
            <div className={styles.itemHeader}>
              <h2 className={styles.version}>v2.3.5 — Security Patches</h2>
              <span className={styles.date}>May 28, 2026</span>
            </div>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeFix}`}>Fix</span>
              <span className={`${styles.badge} ${styles.badgeSecurity}`}>Security</span>
            </div>
            <ul className={styles.changesList}>
              <li>Patched a vulnerability related to session handling.</li>
              <li>Fixed an issue where return requests would sometimes duplicate in the system.</li>
              <li>Enhanced rate-limiting on authentication endpoints.</li>
            </ul>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelineMarker}></div>
          <div className={styles.timelineContent}>
            <div className={styles.itemHeader}>
              <h2 className={styles.version}>v2.3.0 — POS Integration</h2>
              <span className={styles.date}>April 15, 2026</span>
            </div>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeFeature}`}>Feature</span>
            </div>
            <ul className={styles.changesList}>
              <li>Introduced the Point of Sale (POS) system for physical retail outlets.</li>
              <li>Added support for thermal receipt printers via browser Bluetooth API.</li>
              <li>Real-time inventory syncing between online store and physical outlets.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
