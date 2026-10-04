import styles from "./loading.module.css";

const chartBars = ["bar40", "bar60", "bar35", "bar75", "bar55", "bar90", "bar45", "bar30", "bar65", "bar80"];

export default function Loading() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandMark}>
            <span className="material-symbols-outlined">diamond</span>
          </div>
          <div className={styles.brandName}>Katabazaar</div>
          <div className={styles.navSkeletons}>
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={`nav-${index}`} className={styles.navItem}></span>
            ))}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.search}></div>
          <div className={styles.avatar}></div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}></div>
          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}></span>
            <span className={styles.filterLine}></span>
            <span className={styles.filterLine}></span>
          </div>
          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}></span>
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={`filter-${index}`} className={styles.filterLine}></span>
            ))}
          </div>
          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}></span>
            <span className={styles.filterChip}></span>
          </div>
        </aside>

        <main className={styles.main}>
          <section className={styles.titleRow}>
            <div className={styles.titleBlock}>
              <div className={styles.title}></div>
              <div className={styles.subtitle}></div>
            </div>
            <div className={styles.toolbar}>
              <div className={styles.sortLabel}></div>
              <div className={styles.sortControl}></div>
            </div>
          </section>

          <section className={styles.metrics}>
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={`metric-${index}`} className={styles.metricCard}>
                <div className={styles.metricGlow}></div>
                <span className={styles.metricLabel}></span>
                <span className={`${styles.metricValue} ${index === 2 ? styles.metricValueShort : ""}`}></span>
                <span className={styles.metricDelta}></span>
              </article>
            ))}
          </section>

          <section className={styles.analytics}>
            <article className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}></span>
                <div className={styles.chartActions}>
                  <span className={styles.chartAction}></span>
                  <span className={styles.chartAction}></span>
                </div>
              </div>
              <div className={styles.chartBars}>
                {chartBars.map((barClass, index) => (
                  <span key={`bar-${index}`} className={`${styles.chartBar} ${styles[barClass]}`}></span>
                ))}
              </div>
            </article>

            <article className={styles.activityCard}>
              <span className={styles.activityTitle}></span>
              <div className={styles.activityList}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`activity-${index}`} className={styles.activityItem}>
                    <span className={styles.activityIcon}></span>
                    <div className={styles.activityLines}>
                      <span className={styles.activityLineLong}></span>
                      <span className={styles.activityLineShort}></span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className={styles.productGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <article key={`product-${index}`} className={styles.productCard}>
                <div className={styles.productMedia}></div>
                <div className={styles.productBody}>
                  <span className={styles.productCategory}></span>
                  <span className={styles.productTitle}></span>
                  <span className={styles.productMeta}></span>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}></span>
                    <span className={styles.productAction}></span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
