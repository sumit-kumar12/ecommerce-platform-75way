"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BrandLogo } from "../../../shared-ui/BrandLogo";
import styles from "./StoreFooter.module.css";
import { Suspense } from "react";

function StoreFooterInner({ categories = [], options = {} }) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("categorySlug") ?? "";
  const {
    showCategories = true,
    showAccount = true,
    showSupport = true,
    compact = false,
  } = options;

  const buildCategoryHref = (slug) => {
    if (!slug) return "/products";

    if (!pathname.startsWith("/products")) {
      return `/products?categorySlug=${encodeURIComponent(slug)}`;
    }

    const params = new URLSearchParams();
    const query = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "";
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";

    params.set("categorySlug", slug);

    if (query.trim()) params.set("q", query.trim());
    if (sort && sort !== "latest") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    return `/products?${params.toString()}`;
  };

  return (
    <footer className={`${styles.footer} ${compact ? styles.footerCompact : ""}`.trim()}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brand}>
            <BrandLogo width={40} height={40} showText={true} />
          </Link>
          <p className={styles.brandCopy}>
            Your ultimate shopping destination for premium goods, local quality, and a world-class merchant experience.
          </p>
        </div>

        {showCategories ? (
          <div className={styles.linkColumn}>
            <h3 className={styles.heading}>Categories</h3>
            <div className={styles.linkList}>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={buildCategoryHref(category.slug)}
                  className={`${styles.link} ${activeCategorySlug === category.slug ? styles.linkActive : ""}`.trim()}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {showAccount ? (
          <div className={styles.linkColumn}>
            <h3 className={styles.heading}>Account</h3>
            <div className={styles.linkList}>
              <Link href="/login" className={styles.link}>Sign In</Link>
              <Link href="/register" className={styles.link}>Create Account</Link>
              <Link href="/wishlist" className={styles.link}>Wishlist</Link>
              <Link href="/checkout" className={styles.link}>Checkout</Link>
            </div>
          </div>
        ) : null}

        {showSupport ? (
          <div className={styles.linkColumn}>
            <h3 className={styles.heading}>Support</h3>
            <div className={styles.linkList}>
              <Link href="/help" className={styles.link}>Help Center</Link>
              <Link href="/shipping" className={styles.link}>Shipping Policy</Link>
              <Link href="/returns" className={styles.link}>Returns & Exchanges</Link>
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Katabazaar. All rights reserved. Your premium marketplace partner.</p>
      </div>
    </footer>
  );
}

export function StoreFooter(props) {
  return (
    <Suspense fallback={null}>
      <StoreFooterInner {...props} />
    </Suspense>
  );
}
