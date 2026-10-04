"use client";

import Image from "next/image";
import styles from "./sponsored-brands.module.css";

const BRANDS = [
  { name: "boAt", logo: "/brands/boat.png" },
  { name: "Google", logo: "/brands/google.png" },
  { name: "ASUS", logo: "/brands/asus.png" },
  { name: "Philips", logo: "/brands/philips.png" },
  { name: "Realme", logo: "/brands/realme.png" },
  { name: "Samsung", logo: "/brands/samsung.png" },
];

export function SponsoredBrands() {
  return (
    <section className={styles.brandsSection}>
      <h2 className={styles.title}>Sponsored Brands</h2>
      <div className={styles.brandsRow}>
        {BRANDS.map((brand, idx) => (
          <div key={idx} className={styles.brandCard}>
            <div className={styles.logoPlaceholder}>
              {brand.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
