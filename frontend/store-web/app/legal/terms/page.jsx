"use client";
import React from 'react';
import styles from './terms.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last Updated: June 15, 2026</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using KataBazaar ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
            In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Description of Service</h2>
          <p>
            KataBazaar provides a multi-vendor e-commerce platform allowing users to purchase goods from various independent merchants.
            We act as an intermediary and provide the technology platform for these transactions.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. User Account</h2>
          <p>
            To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <ul>
            <li>You are responsible for safeguarding your password.</li>
            <li>You agree not to disclose your password to any third party.</li>
            <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. User Conduct</h2>
          <p>You agree not to use the Platform to:</p>
          <ul>
            <li>Violate any local, state, national, or international law.</li>
            <li>Infringe upon the rights of others, including intellectual property rights.</li>
            <li>Upload or transmit viruses or any other type of malicious code.</li>
            <li>Attempt to interfere with or compromise the system integrity or security.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Modifications to Service</h2>
          <p>
            We reserve the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
        </section>
      </div>
    </div>
  );
}
