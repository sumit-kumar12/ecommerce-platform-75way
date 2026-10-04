"use client";

import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { useStoreCategories } from "../../lib/useStoreCategories";
import styles from "./page.module.css";

export default function ShippingPage() {
  const { categories } = useStoreCategories();

  return (
    <StoreShell categories={categories}>
      <div className={styles.pageWrap}>
        <header className={styles.pageHeader}>
          <span className={styles.kicker}>Logistics</span>
          <h1>Shipping Policy</h1>
          <p>Everything you need to know about how we get your orders to you safely and on time.</p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Delivery Timelines</h2>
            <div className={styles.table}>
              <div className={styles.tableRow}>
                <strong>Standard Delivery</strong>
                <span>3–7 business days</span>
              </div>
              <div className={styles.tableRow}>
                <strong>Express Delivery</strong>
                <span>1–2 business days (selected cities)</span>
              </div>
              <div className={styles.tableRow}>
                <strong>Same-Day Delivery</strong>
                <span>Available in select metro areas for orders placed before 12 PM</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Shipping Charges</h2>
            <p>Shipping is <strong>free</strong> on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 applies.</p>
            <p>Express delivery carries an additional fee of ₹99–₹149 depending on your location and order weight.</p>
          </section>

          <section className={styles.section}>
            <h2>Order Processing</h2>
            <p>Orders are typically processed within 24 hours of placement (Monday to Saturday). Orders placed on Sunday or public holidays are processed the next business day.</p>
            <p>Once shipped, you will receive a tracking link via email and/or WhatsApp notification.</p>
          </section>

          <section className={styles.section}>
            <h2>Coverage Areas</h2>
            <p>We ship to all 28 states and 8 union territories across India. Remote areas may experience slightly longer delivery times.</p>
            <p>International shipping is not currently available.</p>
          </section>

          <section className={styles.section}>
            <h2>Damaged or Lost Shipments</h2>
            <p>If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date. We will arrange a replacement or full refund.</p>
            <p>See our <Link href="/returns">Returns &amp; Exchanges</Link> policy for more details.</p>
          </section>
        </div>
      </div>
    </StoreShell>
  );
}
