"use client";
import React from 'react';
import styles from './MaintenanceMode.module.css';

export default function MaintenanceMode() {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={styles.animateSpinSlow}>⚙️</div>
      </div>
      <h2 className={styles.title}>System Maintenance</h2>
      <p className={styles.subtitle}>We're currently upgrading our platform to serve you better. We'll be back shortly.</p>
      
      <div className={styles.timerBox}>
        <h3>Estimated time remaining</h3>
        <div className={styles.countdown}>
          <div className={styles.timeBlock}>02<span>Hrs</span></div>
          <span className={styles.colon}>:</span>
          <div className={styles.timeBlock}>45<span>Min</span></div>
        </div>
      </div>

      <div className={styles.newsletterBox}>
        <p>Get notified when we're back online:</p>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Enter your email" className={styles.input} />
          <button className={styles.notifyBtn}>Notify Me</button>
        </div>
      </div>
    </div>
  );
}
