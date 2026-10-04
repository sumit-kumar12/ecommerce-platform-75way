"use client";
import React from 'react';
import styles from './NoSearchResults.module.css';

export default function NoSearchResults({ query = "Unknown" }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>🔍</div>
      </div>
      <h2 className={styles.title}>No results for <span className={styles.query}>"{query}"</span></h2>
      <p className={styles.subtitle}>Check the spelling or try searching for something else</p>
      
      <div className={styles.popularSearches}>
        <h3>Popular Searches</h3>
        <div className={styles.chipsRow}>
          <span className={styles.chip}>Headphones</span>
          <span className={styles.chip}>Smartwatch</span>
          <span className={styles.chip}>Laptops</span>
          <span className={styles.chip}>Sneakers</span>
        </div>
      </div>
    </div>
  );
}
