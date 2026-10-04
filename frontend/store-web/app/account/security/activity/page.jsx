"use client";
import React from 'react';
import styles from './activity.module.css';

export default function SecurityActivity() {
  const activities = [
    {
      id: 1,
      type: 'New Login',
      details: 'Browser: Chrome · OS: Windows · Location: Noida, IN',
      date: 'May 24, 2024 10:30 AM',
      status: 'green',
    },
    {
      id: 2,
      type: 'Password Changed',
      details: '',
      date: 'May 23, 2024 08:15 PM',
      status: 'blue',
    },
    {
      id: 3,
      type: 'Two-Factor Authentication Enabled',
      details: '',
      date: 'May 18, 2024 10:43 AM',
      status: 'blue',
    },
    {
      id: 4,
      type: 'Login Attempt: Blocked',
      details: 'Unknown Device · Unknown Location',
      date: 'May 16, 2024 11:55 PM',
      status: 'red',
      badge: 'Suspicious'
    },
    {
      id: 5,
      type: 'Email Address Changed',
      details: '',
      date: 'May 15, 2024 08:10 AM',
      status: 'blue',
    },
    {
      id: 6,
      type: 'New Login',
      details: 'Safari · iPhone · Delhi, IN',
      date: 'May 09, 2024 07:40 AM',
      status: 'green',
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.shieldIcon}>🛡️</span>
        <h1 className={styles.pageTitle}>Login Activity</h1>
      </div>

      <div className={styles.timeline}>
        {activities.map((item) => (
          <div key={item.id} className={styles.timelineItem}>
            <div className={`${styles.dot} ${styles[item.status]}`}></div>
            <div className={styles.content}>
              <div className={styles.titleRow}>
                <p className={styles.type}>{item.type}</p>
                {item.badge && <span className={styles.redBadge}>{item.badge}</span>}
              </div>
              {item.details && <p className={styles.details}>{item.details}</p>}
              <p className={styles.date}>{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.viewAllBtn}>View All Activity</button>
    </div>
  );
}
