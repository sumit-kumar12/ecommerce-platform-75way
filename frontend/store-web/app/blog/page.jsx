"use client";
import React from 'react';
import styles from './blog.module.css';

export default function BlogHome() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>KataBazaar Blog</h1>
        <p className={styles.subtitle}>Insights, news, and tips from the world of e-commerce.</p>
      </div>

      <div className={styles.featuredPost}>
        <div className={styles.featuredImage}></div>
        <div className={styles.featuredContent}>
          <span className={styles.categoryBadge}>Technology</span>
          <h2 className={styles.featuredTitle}>The Future of E-commerce in 2026 and Beyond</h2>
          <p className={styles.featuredExcerpt}>
            Explore the emerging trends shaping the online shopping experience, from AI-driven personalization to augmented reality try-ons.
          </p>
          <div className={styles.meta}>
            <span>By Jane Doe</span>
            <span className={styles.dot}>•</span>
            <span>June 12, 2026</span>
          </div>
        </div>
      </div>

      <div className={styles.gridHeader}>
        <h3 className={styles.sectionTitle}>Latest Articles</h3>
        <div className={styles.filters}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>All</button>
          <button className={styles.filterBtn}>Technology</button>
          <button className={styles.filterBtn}>Business</button>
          <button className={styles.filterBtn}>Lifestyle</button>
        </div>
      </div>

      <div className={styles.postGrid}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className={styles.postCard}>
            <div className={styles.cardImage}></div>
            <div className={styles.cardContent}>
              <span className={styles.categoryBadgeSmall}>Business</span>
              <h4 className={styles.cardTitle}>How to Start Your Online Store in 5 Steps</h4>
              <p className={styles.cardExcerpt}>A comprehensive guide to launching your first e-commerce business successfully.</p>
              <div className={styles.cardMeta}>
                <span>June 10, 2026</span>
                <span className={styles.readTime}>5 min read</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn}>Previous</button>
        <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
        <button className={styles.pageBtn}>2</button>
        <button className={styles.pageBtn}>3</button>
        <button className={styles.pageBtn}>Next</button>
      </div>
    </div>
  );
}
