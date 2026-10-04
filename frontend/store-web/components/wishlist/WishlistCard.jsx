"use client";

import Link from "next/link";
import {
  formatCatalogPrice,
  getMinVariantPrice,
  getProductImageUrl,
  getTotalStock,
} from "../../lib/catalog";
import styles from "./WishlistCard.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

function getInventoryState(product) {
  const stock = getTotalStock(product);

  if (stock <= 0) {
    return {
      label: "Unavailable",
      detail: "No active inventory is currently available for this item.",
      tone: "critical",
    };
  }

  if (stock <= 5) {
    return {
      label: "Low stock",
      detail: `${stock} unit${stock === 1 ? "" : "s"} remaining.`,
      tone: "warning",
    };
  }

  return {
    label: "Ready",
    detail: `${stock} unit${stock === 1 ? "" : "s"} available.`,
    tone: "positive",
  };
}

function hasPurchasableVariant(product) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.some((variant) => variant && variant.id && variant.isActive !== false && Number(variant.stock ?? 0) > 0);
}

export function WishlistCard({ product, href, busy = false, onMoveToCart, onRemove }) {
  const imageUrl = getProductImageUrl(product);
  const price = getMinVariantPrice(product);
  const inventory = getInventoryState(product);
  const canMoveToCart = hasPurchasableVariant(product);
  const productHref = href || `/product/${product.id}`;

  return (
    <article className={joinClasses(styles.card, busy ? styles.cardBusy : "")}>
      <div className={styles.mediaWrap}>
        <Link href={productHref} className={styles.mediaLink} aria-label={`Open ${product.name}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.mediaFallback}>
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          )}
        </Link>

        <span
          className={joinClasses(
            styles.statusPill,
            inventory.tone === "positive" ? styles.statusPositive : "",
            inventory.tone === "warning" ? styles.statusWarning : "",
            inventory.tone === "critical" ? styles.statusCritical : "",
          )}
        >
          <span className="material-symbols-outlined">
            {inventory.tone === "positive" ? "verified" : inventory.tone === "warning" ? "schedule" : "gpp_maybe"}
          </span>
          <span>{inventory.label}</span>
        </span>

        <button
          type="button"
          className={styles.removeButton}
          onClick={() => onRemove(product.id)}
          disabled={busy}
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <span className="material-symbols-outlined">heart_minus</span>
        </button>

        {canMoveToCart ? (
          <div className={styles.hoverAction}>
            <button
              type="button"
              className={styles.moveButton}
              onClick={() => onMoveToCart(product)}
              disabled={busy}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              <span>Move to Cart</span>
            </button>
          </div>
        ) : (
          <div className={styles.outOfStockOverlay}>
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.category}>{product?.category?.name ?? "Marketplace item"}</p>
            <Link href={productHref} className={styles.titleLink}>
              <h3 className={styles.title}>{product.name}</h3>
            </Link>
          </div>
          <strong className={styles.price}>{formatCatalogPrice(price, { fallback: "Price on request" })}</strong>
        </div>

        <div className={styles.stockRow}>
          <span className={joinClasses(styles.stockDot, inventory.tone === "positive" ? styles.stockPositive : "", inventory.tone === "warning" ? styles.stockWarning : "", inventory.tone === "critical" ? styles.stockCritical : "")}></span>
          <span className={styles.stockText}>
            {inventory.tone === "positive"
              ? "In Stock"
              : inventory.tone === "warning"
                ? inventory.detail.replace(".", "")
                : "Notify when available"}
          </span>
        </div>

        {!canMoveToCart ? (
          <button 
            type="button" 
            className={styles.notifyButton} 
            disabled={busy}
            onClick={() => alert(`Back-in-stock alert registered for ${product.name}. You will be notified via email node when inventory replenishment completes.`)}
          >
            Notify when available
          </button>
        ) : null}
      </div>
    </article>
  );
}
