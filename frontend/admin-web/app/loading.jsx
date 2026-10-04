import styles from "./loading.module.css";

const metricWidths = ["wShort", "wMedium", "wTiny", "wSmall"];
const chartBars = ["bar40", "bar60", "bar35", "bar75", "bar55", "bar90", "bar45", "bar30", "bar65", "bar80"];

export default function Loading() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandMark}>
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div className={styles.brandName}>Katabazaar Admin</div>
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
          <div className={styles.sidebarBrand}>
            <div className={styles.sidebarLogo}></div>
            <div className={styles.sidebarBrandLines}>
              <span className={styles.lineMedium}></span>
              <span className={styles.lineShort}></span>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>
              <span className={styles.sidebarIcon}></span>
              <span className={styles.sidebarText}></span>
            </div>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`side-${index}`} className={styles.sidebarItem}>
                <span className={styles.sidebarIcon}></span>
                <span className={styles.sidebarText}></span>
              </div>
            ))}
          </nav>
        </aside>

        <main className={styles.main}>
          <section className={styles.titleBlock}>
            <div className={styles.title}></div>
            <div className={styles.subtitle}></div>
          </section>

          <section className={styles.metrics}>
            {metricWidths.map((widthClass, index) => (
              <article key={`metric-${index}`} className={styles.metricCard}>
                <div className={styles.metricGlow}></div>
                <span className={styles.metricLabel}></span>
                <span className={`${styles.metricValue} ${styles[widthClass]}`}></span>
                <span className={`${styles.metricDelta} ${index === 2 ? styles.metricDeltaWarn : ""}`}></span>
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

          <section className={styles.tableCard}>
            <div className={styles.tableHead}>
              <span className={styles.tableTitle}></span>
            </div>
            <div className={styles.table}>
              <div className={styles.tableHeaderRow}>
                <span className={styles.tableHeaderShort}></span>
                <span className={styles.tableHeaderMedium}></span>
                <span className={styles.tableHeaderTiny}></span>
                <span className={styles.tableHeaderTiny}></span>
              </div>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`row-${index}`} className={styles.tableRow}>
                  <span className={styles.tableCellShort}></span>
                  <span className={styles.tableCellLong}></span>
                  <span className={styles.tableChip}></span>
                  <span className={styles.tableCellTiny}></span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
