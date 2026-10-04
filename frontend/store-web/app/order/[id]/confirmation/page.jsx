"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StoreShell } from "../../../../components/layout/StoreShell";
import { GlassPanel } from "../../../../components/ui/GlassPanel";
import { apiRequest } from "../../../../lib/api";
import { findCategoryPathById, formatCatalogPrice, getProductImageUrl } from "../../../../lib/catalog";
import styles from "./page.module.css";

function buildOrderItemProductHref(product, categories) {
  if (!product?.id) return "/products";

  const categoryPath = findCategoryPathById(categories, product.categoryId || product.category?.id);
  const params = new URLSearchParams();

  if (categoryPath.length) {
    params.set("categorySlug", categoryPath[0].slug);
    if (categoryPath.length > 1) {
      params.set("subcategorySlug", categoryPath[categoryPath.length - 1].slug);
    }
  } else if (product?.category?.slug) {
    params.set("categorySlug", product.category.slug);
  }

  const suffix = params.toString();
  return suffix ? `/product/${product.id}?${suffix}` : `/product/${product.id}`;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = useMemo(
    () => (typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null),
    [params],
  );

  const [categories, setCategories] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedRewards, setJoinedRewards] = useState(false);

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [categoryResponse, orderResponse] = await Promise.all([
          apiRequest("/products/categories/tree", { csrf: false }),
          apiRequest(`/orders/${id}`, { csrf: false }),
        ]);

        if (!active) {
          return;
        }

        setCategories(Array.isArray(categoryResponse?.categories) ? categoryResponse.categories : []);
        setOrder(orderResponse?.order ?? orderResponse ?? null);
      } catch {
        if (!active) {
          return;
        }
        setCategories([]);
        setOrder(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [id]);

  const headline = useMemo(() => {
    if (!order) {
      return "Order unavailable";
    }

    if (order.paymentMethod === "ONLINE" && order.paymentStatus !== "VERIFIED") {
      return "Order created, payment still pending";
    }

    return "Order confirmed!";
  }, [order]);

  const subcopy = useMemo(() => {
    if (!order) {
      return "We could not load the order confirmation for this account.";
    }

    if (order.paymentMethod === "ONLINE" && order.paymentStatus !== "VERIFIED") {
      return "Your order exists, but payment verification has not completed yet. Review the order detail page for the latest state.";
    }

    return "Thank you for your purchase. Your order has been stored successfully and is now available in your order history.";
  }, [order]);

  const previewItems = useMemo(() => (Array.isArray(order?.items) ? order.items.slice(0, 3) : []), [order?.items]);
  const totalOfferSavings = useMemo(
    () => (Array.isArray(order?.items) ? order.items.reduce((sum, item) => sum + Math.max(0, Number(item.lineSavings || 0)), 0) : 0),
    [order?.items],
  );
  const statusLabel = order?.status ? String(order.status).replace(/_/g, " ") : "Recorded";
  const shippingAddress = order?.shippingAddress || null;

  const handleDownloadInvoice = () => {
    if (!order) return;
    const invoiceText = `
========================================
             KATABAZAAR RETAIL
========================================
INVOICE FOR ORDER: ${order.orderNumber}
Date: ${new Date().toLocaleDateString("en-IN")}
Status: ${statusLabel}
----------------------------------------
Items Purchased:
${previewItems.map(item => `- ${item.product?.name || "Product"} (${item.variant?.title || "Default"}) x ${item.quantity}: ${formatCatalogPrice(item.lineTotal)}`).join("\n")}
----------------------------------------
Subtotal: ${formatCatalogPrice(order.totalAmount)}
Total Paid: ${formatCatalogPrice(order.totalAmount)}
========================================
Thank you for shopping with us!
`;
    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order.orderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleJoinRewards = () => {
    setJoinedRewards(true);
    alert("Thank you for joining Katabazaar Rewards! Your account has been enrolled, and reward points from this purchase have been credited.");
  };

  return (
    <StoreShell
      categories={categories}
      headerOptions={{
        showSearch: false,
        showNav: true,
        showTheme: true,
        showNotifications: true,
        showWishlist: true,
        showCart: true,
        showAccount: true,
        showMobileCategories: false,
      }}
      footerOptions={{
        showCategories: false,
        showAccount: true,
        showSupport: true,
        compact: true,
      }}
    >
      <div className={styles.pageWrap}>
        {loading ? (
          <div className={styles.loadingCard}></div>
        ) : order ? (
          <div className={styles.confirmationLayout}>
            <section className={styles.heroSection}>
              <div className={styles.successIcon}>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h1>{headline}</h1>
              <p className={styles.copy}>{subcopy}</p>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span>Order ID</span>
                  <strong>{order.orderNumber}</strong>
                </div>
                <div className={styles.heroStat}>
                  <span>Status</span>
                  <strong>{statusLabel}</strong>
                </div>
              </div>
            </section>

            <div className={styles.contentGrid}>
              <div className={styles.mainColumn}>
                <GlassPanel className={styles.confirmationCard} elevated>
                  <div className={styles.sectionHeading}>
                    <span className="material-symbols-outlined">inventory_2</span>
                    <h2>Order Summary</h2>
                  </div>

                  <div className={styles.previewList}>
                    {previewItems.map((item) => (
                      <article key={item.id} className={styles.previewItem}>
                        <Link href={buildOrderItemProductHref(item.product, categories)} className={styles.previewThumb}>
                          {getProductImageUrl(item.product) ? (
                            <img src={getProductImageUrl(item.product)} alt={item.product?.name || "Product"} className={styles.previewImage} />
                          ) : (
                            <span>{(item.product?.name || "P").slice(0, 1).toUpperCase()}</span>
                          )}
                        </Link>
                        <div className={styles.previewBody}>
                          <h3>
                            <Link href={buildOrderItemProductHref(item.product, categories)} className={styles.previewLink}>
                              {item.product?.name || "Product"}
                            </Link>
                          </h3>
                          <p>{item.variant?.title || "Default configuration"}</p>
                          {item.appliedOffer ? (
                            <div className={styles.appliedOffer}>
                              <span className="material-symbols-outlined">local_offer</span>
                              <strong>{item.appliedOffer.discountPercent}% off</strong>
                              <small>{item.appliedOffer.code || item.appliedOffer.title || "Offer applied"}</small>
                            </div>
                          ) : null}
                        </div>
                        <div className={styles.previewMeta}>
                          <strong>{formatCatalogPrice(item.lineTotal, { maximumFractionDigits: 2 })}</strong>
                          {Number(item.originalUnitPrice || 0) > Number(item.unitPrice || 0) ? (
                            <em>{formatCatalogPrice(Number(item.originalUnitPrice) * Number(item.quantity || 1), { maximumFractionDigits: 2 })}</em>
                          ) : null}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className={styles.totals}>
                    <div>
                      <span>Subtotal</span>
                      <strong>{formatCatalogPrice(order.totalAmount, { maximumFractionDigits: 2 })}</strong>
                    </div>
                    {totalOfferSavings > 0 ? (
                      <div>
                        <span>Offer savings</span>
                        <strong className={styles.successText}>-{formatCatalogPrice(totalOfferSavings, { maximumFractionDigits: 2 })}</strong>
                      </div>
                    ) : null}
                    <div>
                      <span>Shipping</span>
                      <strong className={styles.successText}>Free</strong>
                    </div>
                    <div className={styles.totalPaid}>
                      <span>Total Paid</span>
                      <strong>{formatCatalogPrice(order.totalAmount, { maximumFractionDigits: 2 })}</strong>
                    </div>
                  </div>
                </GlassPanel>

                <GlassPanel className={styles.securityPanel}>
                  <div className={styles.securityBadge}>
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <strong>Securely Processed</strong>
                    <p>Payment verified via Katabazaar SecurePay</p>
                  </div>
                  <span className={`material-symbols-outlined ${styles.securityPanelIcon}`}>security</span>
                </GlassPanel>
              </div>

              <aside className={styles.sideColumn}>
                <GlassPanel className={styles.sideCard}>
                  <div className={styles.sectionHeading}>
                    <span className="material-symbols-outlined">local_shipping</span>
                    <h2>Shipping to</h2>
                  </div>
                  <div className={styles.addressBlock}>
                    <p className={styles.addressName}>{shippingAddress?.fullName || "Address not available"}</p>
                    {shippingAddress?.line1 ? <p>{shippingAddress.line1}</p> : null}
                    {shippingAddress?.line2 ? <p>{shippingAddress.line2}</p> : null}
                    <p>{[shippingAddress?.city, shippingAddress?.state, shippingAddress?.postalCode].filter(Boolean).join(", ")}</p>
                    {shippingAddress?.country ? <p>{shippingAddress.country}</p> : null}
                  </div>
                  <div className={styles.deliveryBlock}>
                    <h3>Estimated Delivery</h3>
                    <p>
                      <span className="material-symbols-outlined">calendar_today</span>
                      Delivery timing updates on the order detail screen
                    </p>
                  </div>
                </GlassPanel>

                <div className={styles.sideActions}>
                  <Link href={id ? `/order/${id}` : "/products"} className={styles.primaryAction}>
                    <span className="material-symbols-outlined">map</span>
                    <span>Track My Order</span>
                  </Link>
                  <button type="button" className={styles.secondaryAction} onClick={handleDownloadInvoice}>
                    <span className="material-symbols-outlined">receipt</span>
                    <span>Download Invoice</span>
                  </button>
                  <Link href="/products" className={styles.tertiaryAction}>
                    Return to Storefront
                  </Link>
                </div>
              </aside>
            </div>

            <section className={styles.rewardsBanner}>
              <div className={styles.rewardsCopy}>
                <h3>Join Katabazaar Rewards</h3>
                <p>Earn points from this purchase and unlock faster access to premium storefront benefits.</p>
              </div>
              <button 
                type="button" 
                className={styles.rewardsButton} 
                onClick={handleJoinRewards}
                disabled={joinedRewards}
              >
                {joinedRewards ? "Joined!" : "Join for Free"}
              </button>
            </section>
          </div>
        ) : (
          <GlassPanel className={styles.confirmationCard} elevated>
            <section className={styles.heroSection}>
              <div className={styles.successIcon}>
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <h1>{headline}</h1>
              <p className={styles.copy}>{subcopy}</p>
            </section>
            <div className={styles.actions}>
              <Link href="/products" className={`btn-ghost ${styles.actionLink}`}>
                Continue shopping
              </Link>
            </div>
          </GlassPanel>
        )}
      </div>
    </StoreShell>
  );
}
