"use client";

import Link from "next/link";
import { formatCatalogPrice } from "../../lib/catalog";
import { ButtonPrimary } from "../ui/ButtonPrimary";
import styles from "../../app/checkout/page.module.css";

export function OrderSummary({
  cartItems,
  subtotal,
  apiShippingFee,
  offerSavings,
  total,
  paymentMethod,
  shippingId,
  creating,
  loading,
  authChecked,
  authenticated,
  onPlaceOrder
}) {
  return (
    <aside className={styles.right}>
      <div className={styles.summaryCard}>
        <h2>Order summary</h2>
        {cartItems.length ? (
          <div className={styles.itemList}>
            {cartItems.map((item, idx) => (
              <div key={item.variantId || idx} className={styles.item}>
                  <div className={styles.itemThumb}>
                    {item.product?.thumbnailImageUrl || item.product?.images?.[0]?.url ? (
                      <img src={item.product.thumbnailImageUrl || item.product.images[0].url} alt={item.title} />
                    ) : (
                      <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600">inventory_2</span>
                      </div>
                    )}
                    <em>{item.quantity}</em>
                  </div>
                  <div className={styles.itemInfo}>
                    <Link href={`/product/${item.product?.id}`}>{item.product?.name || item.title}</Link>
                    <span>{item.title}</span>
                  </div>
                  <div className={styles.itemPriceStack}>
                    {Number(item.originalPrice || 0) > Number(item.price || 0) ? (
                      <span>{formatCatalogPrice(Number(item.originalPrice) * Number(item.quantity || 1))}</span>
                    ) : null}
                    <strong>{formatCatalogPrice(item.price * item.quantity)}</strong>
                  </div>
                  {item.activeOffer ? (
                    <div className={styles.itemOffer}>
                      <span className="material-symbols-outlined">local_offer</span>
                      <small>{item.activeOffer.discountPercent}% off {item.activeOffer.code ? `with ${item.activeOffer.code}` : "applied"}</small>
                    </div>
                  ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptySummary}>
            <span className="material-symbols-outlined">shopping_cart</span>
            <strong>Your cart is empty</strong>
            <p>Add products from the catalog before completing checkout.</p>
          </div>
        )}
        
        <div className={styles.totals}>
            {offerSavings > 0 ? (
              <div className={styles.savingsRow}><span>Offer savings</span><strong>-{formatCatalogPrice(offerSavings)}</strong></div>
            ) : null}
            <div><span>Subtotal</span><strong>{formatCatalogPrice(subtotal)}</strong></div>
            <div><span>Shipping</span><strong>{apiShippingFee === 0 ? "FREE" : formatCatalogPrice(apiShippingFee)}</strong></div>
            <div><span>Payment</span><strong>{paymentMethod === "ONLINE" ? "Razorpay" : "Cash on Delivery"}</strong></div>
        </div>

        <div className={styles.totalFinal}>
            <span>Total</span>
            <strong>{formatCatalogPrice(total)}</strong>
        </div>

        <ButtonPrimary
          onClick={onPlaceOrder}
          disabled={creating || loading || !authChecked || !authenticated || cartItems.length === 0}
          icon={creating ? "sync" : "lock"}
          className={styles.summaryAction}
        >
          {creating ? "Processing..." : "Complete Purchase"}
        </ButtonPrimary>

        <div className={styles.summaryTrust}>
          <div className={styles.summaryTrustLabel}>
            <span className="material-symbols-outlined">verified</span>
            <span>Encrypted &amp; Secure</span>
          </div>
          <p>
            By completing your order, you agree to Katabazaar&apos;s <Link href="/trust">secure commerce policy</Link>.
          </p>
        </div>
      </div>

      <div className={styles.mapCard}>
        <div className={styles.mapGlow}></div>
        <div className={styles.mapInfo}>
            <span className="material-symbols-outlined">location_on</span>
            <p>Shipping from</p>
            <strong>Katabazaar Warehouse</strong>
            <span>Est. delivery: {shippingId === "express" ? "1-2 days" : "3-5 days"}</span>
        </div>
      </div>
    </aside>
  );
}
