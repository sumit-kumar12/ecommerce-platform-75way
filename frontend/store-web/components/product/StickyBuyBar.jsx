"use client";

import { useState, useEffect } from "react";
import { formatCatalogPrice } from "../../lib/catalog";
import styles from "./StickyBuyBar.module.css";

export function StickyBuyBar({ product, variant, onAddToCart, onBuyNow }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const currentPrice = Number(variant?.price || 0);
  const stock = Number(variant?.stock || 0);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || !product) return null;

  return (
    <div className={styles.stickyBar}>
      <div className={styles.container}>
        <div className={styles.productInfo}>
          <div className={styles.titleWrap}>
            <span className={styles.title}>{product.name}</span>
            <span className={styles.variant}>{variant?.title || 'Standard'}</span>
          </div>
          <div className={styles.priceWrap}>
            <span className={styles.price}>{formatCatalogPrice(currentPrice)}</span>
            <span className={`${styles.stock} ${stock > 0 ? styles.inStock : styles.outOfStock}`}>
              {stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.cartBtn} 
            onClick={onAddToCart}
            disabled={stock <= 0}
          >
            Add to Cart
          </button>
          <button 
            type="button" 
            className={styles.buyBtn} 
            onClick={onBuyNow}
            disabled={stock <= 0}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
