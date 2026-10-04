"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { pickCategoryIcon } from "../../lib/catalog";
import styles from "./CategoryNav.module.css";
import { Suspense } from "react";

function CategoryNavInner({ categories = [], maxItems = 4, className = "" }) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("categorySlug") ?? "";
  const visible = categories.slice(0, maxItems);

  const buildHref = (slug) => {
    if (!slug) return "/products";
    return `/category/${encodeURIComponent(slug)}`;
  };

  return (
    <nav className={`${styles.nav} ${className}`.trim()} aria-label="Primary categories">
      {visible.map((category) => (
        <Link
          key={category.id}
          href={buildHref(category.slug)}
          className={`${styles.link} ${activeCategorySlug === category.slug ? styles.linkActive : ""}`.trim()}
        >
          <span className={`material-symbols-outlined ${styles.icon}`}>{pickCategoryIcon(category)}</span>
          <span>{category.name}</span>
        </Link>
      ))}
    </nav>
  );
}

export function CategoryNav(props) {
  return (
    <Suspense fallback={null}>
      <CategoryNavInner {...props} />
    </Suspense>
  );
}
