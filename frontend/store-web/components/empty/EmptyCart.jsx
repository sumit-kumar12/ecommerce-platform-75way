"use client";
import React from 'react';
import styles from './EmptyCart.module.css';

export default function EmptyCart() {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={styles.animateFloat}>🛒</div>
      </div>
      <h2 className={styles.title}>Your cart is empty</h2>
      <p className={styles.subtitle}>Looks like you haven't added anything yet.</p>
      
      <div className={styles.benefitsRow}>
        <div className={styles.benefit}>
          <span>🚚</span>
          <p>Free Delivery</p>
        </div>
        <div className={styles.benefit}>
          <span>🛡️</span>
          <p>Secure Checkout</p>
        </div>
        <div className={styles.benefit}>
          <span>↩️</span>
          <p>Easy Returns</p>
        </div>
      </div>

      <button className={styles.actionBtn}>Start Shopping</button>
    </div>
  );
}
