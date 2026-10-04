"use client";

import { SectionHeader } from "../ui/SectionHeader";
import styles from "../../app/checkout/page.module.css"; // Reuse the page styles or create new ones

export function PaymentMethod({ paymentMethod, setPaymentMethod, apiAllowCOD }) {
  return (
    <section className={styles.section}>
      <SectionHeader
        eyebrow="3"
        title="Payment Method"
        description="All payments are completed securely inside Razorpay and verified by the Katabazaar backend."
        icon="payments"
      />
      <div className={styles.paymentGrid}>
        <div 
          className={`${styles.paymentOption} ${paymentMethod === "ONLINE" ? styles.paymentOptionActive : ""}`}
          onClick={() => setPaymentMethod("ONLINE")}
          style={{ cursor: "pointer" }}
        >
          <span className={`material-symbols-outlined ${styles.paymentIcon}`}>verified_user</span>
          <div className={styles.paymentInfo}>
            <span>Razorpay Secure Checkout</span>
            <p>Choose card, UPI, netbanking, or other options.</p>
          </div>
        </div>
        {apiAllowCOD && (
          <div 
            className={`${styles.paymentOption} ${paymentMethod === "COD" ? styles.paymentOptionActive : ""}`}
            onClick={() => setPaymentMethod("COD")}
            style={{ cursor: "pointer" }}
          >
            <span className={`material-symbols-outlined ${styles.paymentIcon}`}>payments</span>
            <div className={styles.paymentInfo}>
              <span>Cash on Delivery</span>
              <p>Pay with cash or UPI at the time of delivery.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
