"use client";

import Link from "next/link";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <span className="material-symbols-outlined">verified_user</span>
          100% SECURE CHECKOUT
        </div>
        <h1 className={styles.title}>
          Shop <span>Smart</span>.<br />
          Shop <span>Secure</span>.<br />
          Shop <span>Katabazaar</span>.
        </h1>
        <p className={styles.subtitle}>
          Discover unbeatable deals on premium quality products. 
          Experience the next generation of secure e-commerce today.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/products" className={styles.btnPrimary}>
            Shop Now <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link href="/deals" className={styles.btnSecondary}>
            Explore Deals
          </Link>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.glow}></div>
        <div className={styles.heroImageContainer}>
          <img 
            src="https://image.pollinations.ai/prompt/premium%20ecommerce%203d%20isometric%20shopping%20cart%20gift%20boxes%20modern%20clean%20ui%20purple%20neon?width=600&height=600&nologo=true" 
            alt="Ecommerce Shopping" 
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
}
