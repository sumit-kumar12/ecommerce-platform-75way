"use client";

import { SidebarFilters } from "./SidebarFilters";
import styles from "./MobileFilter.module.css";

export function MobileFilter({
  isOpen,
  onClose,
  categories,
  categorySlug,
  maxPrice,
  minimumRating,
  setMinimumRating,
  updateParams,
  selectedBrands
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.bottomSheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>Filters</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.scrollArea}>
          <SidebarFilters 
            categories={categories}
            categorySlug={categorySlug}
            maxPrice={maxPrice}
            minimumRating={minimumRating}
            setMinimumRating={setMinimumRating}
            updateParams={updateParams}
            selectedBrands={selectedBrands}
          />
        </div>
        <div className={styles.footer}>
          <button className={styles.applyBtn} onClick={onClose}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}
