"use client";
import React from 'react';
import styles from './NoProductsFound.module.css';

export default function NoProductsFound() {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>🔍📦</div>
      </div>
      <h2 className={styles.title}>No Products Found</h2>
      <p className={styles.subtitle}>We couldn't find any products matching your current filters.</p>
      
      <div className={styles.suggestionsBox}>
        <h3>Suggestions:</h3>
        <ul>
          <li>Check for typos in your search</li>
          <li>Remove some filters to expand your search</li>
          <li>Try more general keywords</li>
        </ul>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.outlineBtn}>Clear Filters</button>
        <button className={styles.primaryBtn}>Browse All</button>
      </div>
    </div>
  );
}
