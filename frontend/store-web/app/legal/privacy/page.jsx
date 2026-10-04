"use client";
import React from 'react';
import styles from './privacy.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Effective Date: June 15, 2026</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
          <h3>Personal Data</h3>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. How We Use Your Data</h2>
          <p>KataBazaar uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Data Protection</h2>
          <p>
            The security of your data is important to us. We implement industry-standard security measures, including encryption and secure socket layer (SSL) technology, to protect your personal information during transmission and storage.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Third-Party Services</h2>
          <p>
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
            These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.
          </p>
        </section>
      </div>
    </div>
  );
}
