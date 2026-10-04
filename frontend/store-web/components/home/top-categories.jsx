"use client";

import Link from "next/link";
import styles from "./top-categories.module.css";

const CATEGORIES = [
  { name: "Electronics", icon: "smartphone", href: "/products?category=electronics" },
  { name: "Fashion", icon: "styler", href: "/products?category=fashion" },
  { name: "Home & Kitchen", icon: "kitchen", href: "/products?category=home-kitchen" },
  { name: "Beauty", icon: "health_and_beauty", href: "/products?category=beauty" },
  { name: "Sports", icon: "sports_baseball", href: "/products?category=sports" },
  { name: "More", icon: "apps", href: "/products" },
];

export function TopCategories() {
  return (
    <section className={styles.categoriesSection}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Top Categories</h2>
        <Link href="/products" className={styles.viewAllBtn}>
          View All <span className="material-symbols-outlined" style={{fontSize: '16px'}}>chevron_right</span>
        </Link>
      </div>
      
      <div className={styles.categoriesGrid}>
        {CATEGORIES.map((cat, idx) => (
          <Link key={idx} href={cat.href} className={styles.categoryItem}>
            <div className={styles.iconCircle}>
              <span className="material-symbols-outlined">{cat.icon}</span>
            </div>
            <span className={styles.categoryName}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
