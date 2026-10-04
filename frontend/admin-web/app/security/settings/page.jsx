"use client";
import React from 'react';
import styles from './settings.module.css';

export default function SecuritySettings() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Security Settings</h1>
        <button className={styles.saveBtn}>Save Settings</button>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingsGroup}>
          <h2 className={styles.groupTitle}>Authentication Rules</h2>
          <div className={styles.card}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>Two-Factor Authentication (2FA)</h3>
                <p>Enforce 2FA for all Admin and Merchant accounts.</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>Password Expiry</h3>
                <p>Force password change every 90 days.</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>Max Failed Login Attempts</h3>
                <p>Lock account after consecutive failed attempts.</p>
              </div>
              <select className={styles.select}>
                <option>3 attempts</option>
                <option selected>5 attempts</option>
                <option>10 attempts</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <h2 className={styles.groupTitle}>Network & Access</h2>
          <div className={styles.card}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>IP Whitelisting (Admin)</h3>
                <p>Only allow admin access from approved IP addresses.</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>API Rate Limiting</h3>
                <p>Throttle excessive requests to prevent DDoS attacks.</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>Session Timeout</h3>
                <p>Automatically log out inactive users.</p>
              </div>
              <select className={styles.select}>
                <option>15 Minutes</option>
                <option selected>30 Minutes</option>
                <option>1 Hour</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
