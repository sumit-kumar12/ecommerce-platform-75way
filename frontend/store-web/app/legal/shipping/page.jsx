"use client";
import React from 'react';
import styles from './shipping.module.css';

export default function ShippingPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shipping & Delivery Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: June 15, 2026</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Delivery Options & Timeframes</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Shipping Method</th>
                  <th>Estimated Delivery</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard Shipping</td>
                  <td>5-7 Business Days</td>
                  <td>Free on orders over ₹499</td>
                </tr>
                <tr>
                  <td>Express Shipping</td>
                  <td>2-3 Business Days</td>
                  <td>₹99</td>
                </tr>
                <tr>
                  <td>Same Day Delivery (Select Cities)</td>
                  <td>By 9 PM Today</td>
                  <td>₹199</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Order Processing</h2>
          <p>
            All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Order Tracking</h2>
          <p>
            Once your order has shipped, we will send you an email with a tracking number and a link to track the package on the carrier's website. Please allow 24 hours for the tracking information to become available.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Lost or Damaged Packages</h2>
          <p>
            KataBazaar is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </section>
      </div>
    </div>
  );
}
