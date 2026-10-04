"use client";
import React from 'react';
import styles from './EmptyWishlist.module.css';

export default function EmptyWishlist() {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={styles.animatePulseSlow}>🤍</div>
      </div>
      <h2 className={styles.title}>Your wishlist is empty</h2>
      <p className={styles.subtitle}>Save items you love to your wishlist. Review them anytime and easily move them to cart.</p>
      <button className={styles.actionBtn}>Explore Products</button>
    </div>
  );
}
