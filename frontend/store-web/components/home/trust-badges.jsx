"use client";

import styles from "./trust-badges.module.css";

const BADGES = [
  { icon: "security", title: "100% Secure Shopping", desc: "Encrypted transactions" },
  { icon: "account_balance_wallet", title: "Pay on Delivery", desc: "Available nationwide" },
  { icon: "cached", title: "Easy Returns", desc: "7-Days replacement" },
  { icon: "sell", title: "Best Price", desc: "Guaranteed match" },
];

export function TrustBadges() {
  return (
    <section className={styles.badgesWrapper}>
      <div className={styles.badgesGrid}>
        {BADGES.map((badge, idx) => (
          <div key={idx} className={styles.badgeCard}>
            <div className={styles.iconWrap}>
              <span className="material-symbols-outlined">{badge.icon}</span>
            </div>
            <div className={styles.textWrap}>
              <strong>{badge.title}</strong>
              <small>{badge.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
