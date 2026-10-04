"use client";

import styles from "./OfferBox.module.css";

export function OfferBox({ offers, daysLeft }) {
  if (!offers || offers.length === 0) return null;

  return (
    <div className={styles.offerContainer}>
      <h3 className={styles.title}>Available Offers</h3>
      <div className={styles.offerList}>
        {offers.map((offer, idx) => (
          <div key={idx} className={styles.offerBanner}>
            <div className={styles.offerBannerIcon}>
              <span className="material-symbols-outlined">local_offer</span>
            </div>
            <div className={styles.offerBannerBody}>
              <span>{offer.discountPercent}% active offer</span>
              <strong>{offer.title}</strong>
              <small>
                {offer.code ? `Use code ${offer.code}` : "Applied to eligible checkout windows"}
                {daysLeft !== null ? ` · ${daysLeft <= 0 ? "Ends today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}` : ""}
              </small>
            </div>
          </div>
        ))}
        <div className={styles.bankOffer}>
          <span className="material-symbols-outlined text-indigo-400">account_balance</span>
          <div className={styles.bankOfferBody}>
            <strong>Bank Offer</strong>
            <small>5% Unlimited Cashback on Katabazaar Axis Bank Credit Card</small>
            <button type="button" className={styles.tncLink}>T&amp;C</button>
          </div>
        </div>
        <div className={styles.bankOffer}>
          <span className="material-symbols-outlined text-indigo-400">credit_card</span>
          <div className={styles.bankOfferBody}>
            <strong>No Cost EMI</strong>
            <small>Avail No Cost EMI on select cards for orders above ₹3000</small>
            <button type="button" className={styles.tncLink}>T&amp;C</button>
          </div>
        </div>
      </div>
    </div>
  );
}
