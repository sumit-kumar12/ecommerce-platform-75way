"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";
import { formatCatalogPrice } from "../../../lib/catalog";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import styles from "./page.module.css";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const load = async () => {
      try {
        const res = await apiRequest(`/orders/${orderId}`);
        setOrder(res.order);
      } catch (err) {
        console.error("Order Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.pulseContainer}>
          <div className={styles.pulse}></div>
          <span className={styles.loadingEyebrow}>ORDER VERIFICATION</span>
          <h2>Processing your order...</h2>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.notFound}>
        <span className="material-symbols-outlined">error</span>
        <h2>Order Metadata Not Found</h2>
        <p>We could not find the details for this order.</p>
        <Link href="/products" className={styles.backBtn}>Return to Store</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topInner}>
          <Link href="/" className={styles.brand}>
            <div className={styles.brandLogo}>
               <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>shield_with_heart</span>
            </div>
            <span className={styles.brandWordmark}>Katabazaar</span>
          </Link>
          <div className={styles.statusPill}>
            <span className="material-symbols-outlined text-green-400">verified</span>
            ORDER VERIFIED
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.successIntro}>
          <div className={styles.successIcon}>
             <span className="material-symbols-outlined">verified_user</span>
             <div className={styles.successGlow}></div>
          </div>
          <h1>Order Successful</h1>
          <p>Order <strong>{order.orderNumber}</strong> has been successfully placed and is being prepared for dispatch.</p>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.orderDetails}>
            <SectionHeader 
              eyebrow="ORDER TRACKING" 
              title="Delivery Status" 
              description="Track the progress of your delivery."
              icon="local_shipping"
            />
            
            <GlassPanel className={styles.trackingCard}>
               <div className={styles.trackingHeader}>
                  <div className={styles.trackingId}>
                     <p>Order Reference</p>
                     <strong>{order.orderNumber}</strong>
                  </div>
                  <div className={styles.trackingStatus}>
                     <p>Dispatch Status</p>
                     <span className={styles.statusLabel}>{order.status}</span>
                  </div>
               </div>
               
               <div className={styles.visualTracker}>
                  <div className={styles.trackLine}>
                     <div className={styles.trackProgress} style={{width: '25%'}}></div>
                     <div className={`${styles.trackNode} ${styles.nodeActive}`}>
                        <span className="material-symbols-outlined">receipt_long</span>
                     </div>
                     <div className={styles.trackNode}>
                        <span className="material-symbols-outlined">inventory_2</span>
                     </div>
                     <div className={styles.trackNode}>
                        <span className="material-symbols-outlined">package_2</span>
                     </div>
                     <div className={styles.trackNode}>
                        <span className="material-symbols-outlined">local_shipping</span>
                     </div>
                  </div>
               </div>
            </GlassPanel>

            <div className={styles.orderSummary}>
               <h3>Order Details</h3>
               <div className={styles.itemList}>
                  {order.items?.map(item => (
                     <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemInfo}>
                           <strong>{item.product?.name}</strong>
                           <span>Qty: {item.quantity}</span>
                        </div>
                        <strong>{formatCatalogPrice(item.lineTotal)}</strong>
                     </div>
                  ))}
               </div>
               <div className={styles.totalRow}>
                  <span>Total Order Value</span>
                  <strong>{formatCatalogPrice(order.totalAmount)}</strong>
               </div>
            </div>
          </section>

          <aside className={styles.nextSteps}>
             <GlassPanel className={styles.infoCard}>
                 <h4>Your Account</h4>
                 <p>View your order history and track shipments from your account dashboard.</p>
                 <div className={styles.actionRow}>
                    <ButtonPrimary icon="account_circle">View Account</ButtonPrimary>
                </div>
             </GlassPanel>

             <div className={styles.dispatchPill}>
                <span className="material-symbols-outlined">verified</span>
                <p>SECURE ORDER COMPLETE</p>
             </div>
          </aside>
        </div>

        <div className={styles.footerNav}>
           <Link href="/products" className={styles.returnBtn}>
              <span className="material-symbols-outlined">chevron_left</span>
              Return to Catalog
           </Link>
        </div>
      </main>
    </div>
  );
}
