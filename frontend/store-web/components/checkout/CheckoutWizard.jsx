"use client";

import Link from "next/link";
import { SectionHeader } from "../ui/SectionHeader";
import { InputField } from "../ui/InputField";
import { ButtonPrimary } from "../ui/ButtonPrimary";
import { AddressManager } from "../account/AddressManager";
import { PaymentMethod } from "./PaymentMethod";
import styles from "../../app/checkout/page.module.css";

export function CheckoutWizard({
  form,
  setForm,
  selectedAddressId,
  handleSelectAddress,
  apiShippingFee,
  paymentMethod,
  setPaymentMethod,
  apiAllowCOD,
  message,
  authChecked,
  authenticated,
  onSignInFirst
}) {
  return (
    <section className={styles.left}>
      <nav className={styles.breadcrumbRow}>
        <Link href="/">Store</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <Link href="/cart">Cart</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span className={styles.breadcrumbActive}>Checkout</span>
      </nav>

      <header className={styles.pageHeader}>
        <div>
          <h1>Checkout</h1>
          <p>Review your order and complete checkout securely.</p>
        </div>
        <div className={styles.securePill}>
          <span className="material-symbols-outlined">verified_user</span>
          SSL Secured Payment
        </div>
      </header>

      {message ? (
        <div className={styles.statusMessage}>
          <span className="material-symbols-outlined">info</span>
          <p>{message}</p>
        </div>
      ) : null}

      {authChecked && !authenticated ? (
        <div className={styles.authNotice}>
          <div className={styles.authNoticeIcon}>
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <div className={styles.authNoticeCopy}>
            <strong>Checking out as Guest</strong>
            <p>Create an account after purchase to track shipping and preserve your order context.</p>
          </div>
          <ButtonPrimary onClick={onSignInFirst} icon="login">
            Sign In First
          </ButtonPrimary>
        </div>
      ) : null}

      <section className={styles.section}>
        <SectionHeader 
          eyebrow="1" 
          title="Shipping Information" 
          description="Stored from the secure checkout submission."
          icon="local_shipping"
        />
        <div style={{ margin: "24px 0" }}>
          <AddressManager onSelectAddress={handleSelectAddress} selectedAddressId={selectedAddressId} />
        </div>
        
        <div className={styles.formGrid} style={{ marginTop: "24px" }}>
          <div className={styles.inputWide}>
            <InputField 
              label="Order updates email" 
              placeholder="Email address" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              icon="alternate_email" 
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader 
          eyebrow="2" 
          title="Delivery Information" 
          description="Shipping cost is calculated based on the items in your cart."
          icon="package_2"
        />
        <div className={styles.deliveryList}>
          <div className={`${styles.deliveryCard} ${styles.deliveryCardActive}`}>
             <div className={styles.deliveryRadio}></div>
             <div className={styles.deliveryInfo}>
                <div className={styles.deliveryLabelRow}>
                   <span>Standard Delivery</span>
                </div>
                <p>Estimated dispatch within 3-5 business days.</p>
             </div>
             <span className={styles.deliveryFee}>
                {apiShippingFee === 0 ? "Free" : `₹${apiShippingFee.toFixed(2)}`}
             </span>
          </div>
        </div>
      </section>

      <PaymentMethod 
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod} 
        apiAllowCOD={apiAllowCOD} 
      />

      <div className={styles.footerNav}>
        <Link href="/cart" className={styles.backButton}>Return to cart</Link>
      </div>
    </section>
  );
}
