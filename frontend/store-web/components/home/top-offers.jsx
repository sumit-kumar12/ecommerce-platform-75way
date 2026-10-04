"use client";

import Link from "next/link";
import styles from "./top-offers.module.css";

function getOfferExpiryLabel(offer) {
  if (!offer?.endDate) return "Open allocation";
  const diff = new Date(offer.endDate).getTime() - Date.now();
  if (!Number.isFinite(diff)) return "Verified window";
  const days = Math.ceil(diff / 86_400_000);
  if (days <= 0) return "Ends today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function TopOffers({ activeOffers = [] }) {
  if (!activeOffers.length) return null;

  return (
    <section className={styles.offersSection}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Top Offers</h2>
        <Link href="/deals" className={styles.viewAllBtn}>
          View All <span className="material-symbols-outlined" style={{fontSize: '16px'}}>chevron_right</span>
        </Link>
      </div>

      <div className={styles.offersGrid}>
        {activeOffers.map((offer, index) => {
          const discount = Number(offer.discountPercent || 0);
          const href = offer.category?.slug
            ? `/products?categorySlug=${encodeURIComponent(offer.category.slug)}`
            : "/deals";

          return (
            <Link key={offer.id || index} href={href} className={styles.offerBanner}>
              <div className={styles.bannerContent}>
                <span className={styles.kicker}>{offer.category?.name || "Global Campaign"}</span>
                <h3 className={styles.offerTitle}>{offer.title || "BIG SAVINGS"}</h3>
                <div className={styles.discountBadge}>
                  UP TO {discount > 0 ? `${discount}%` : "70%"} OFF
                </div>
                <p className={styles.expiry}>
                  <span className="material-symbols-outlined" style={{fontSize: '14px'}}>timer</span>
                  {getOfferExpiryLabel(offer)}
                </p>
              </div>
              <div className={styles.bannerVisual}>
                <div className={styles.glow}></div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
