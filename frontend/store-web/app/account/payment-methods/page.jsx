"use client";
import React from 'react';
import styles from './payment-methods.module.css';

export default function PaymentMethods() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Saved Payment Methods</h1>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Cards</h2>
        
        <div className={styles.cardList}>
          <div className={`${styles.paymentCard} ${styles.defaultCard}`}>
            <div className={styles.cardInfo}>
              <div className={`${styles.cardIcon} ${styles.visa}`}>V</div>
              <div>
                <p className={styles.cardName}>VISA</p>
                <p className={styles.cardNumber}>**** 4242</p>
                <p className={styles.cardExp}>Exp 12/26</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <span className={styles.defaultBadge}>Default</span>
              <button className={styles.menuBtn}>⋮</button>
            </div>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.cardInfo}>
              <div className={`${styles.cardIcon} ${styles.mastercard}`}>M</div>
              <div>
                <p className={styles.cardName}>Mastercard</p>
                <p className={styles.cardNumber}>**** 5555</p>
                <p className={styles.cardExp}>Exp 10/25</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.menuBtn}>⋮</button>
            </div>
          </div>

          <div className={styles.paymentCard}>
            <div className={styles.cardInfo}>
              <div className={`${styles.cardIcon} ${styles.rupay}`}>R</div>
              <div>
                <p className={styles.cardName}>RuPay</p>
                <p className={styles.cardNumber}>**** 6789</p>
                <p className={styles.cardExp}>Exp 09/24</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.menuBtn}>⋮</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>UPI & Wallets</h2>
        <div className={styles.walletList}>
          <div className={styles.walletItem}>
            <div className={styles.walletInfo}>
              <div className={styles.walletIcon}>U</div>
              <p className={styles.walletText}>john@ukokobi</p>
            </div>
            <button className={styles.editBtn}>✏️</button>
          </div>
          <div className={styles.walletItem}>
            <div className={styles.walletInfo}>
              <div className={`${styles.walletIcon} ${styles.paytm}`}>P</div>
              <p className={styles.walletText}>Paytm Wallet (9876 5432 1098)</p>
            </div>
            <button className={styles.editBtn}>✏️</button>
          </div>
        </div>
      </div>

      <button className={styles.addBtn}>+ Add New Payment Method</button>
    </div>
  );
}
