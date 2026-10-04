import Image from "next/image";
import Link from "next/link";
import styles from "./AuthFrame.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

const WIDTH_CLASS_MAP = {
  narrow: styles.narrow,
  medium: styles.medium,
  wide: styles.wide,
};

export function AuthFrame({
  hero,
  title,
  subtitle,
  children,
  footer,
  headerAction,
  monitorLabel,
  width = "narrow",
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.grid}></div>
      <div className={styles.orbTop}></div>
      <div className={styles.orbBottom}></div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image src="/logo.png" alt="Katabazaar" width={768} height={768} priority className={styles.brandLogo} />
          <span className={styles.brandText}>Katabazaar</span>
        </Link>
        <div className={styles.headerAction}>{headerAction}</div>
      </header>

      <main className={styles.main}>
        <section className={joinClasses(styles.panelWrap, WIDTH_CLASS_MAP[width] ?? styles.narrow)}>
          {hero ? <div className={styles.hero}>{hero}</div> : null}
          <div className={styles.panel}>
            <div className={styles.copy}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            </div>
            <div className={styles.content}>{children}</div>
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </div>
        </section>
      </main>

      <footer className={styles.bottomBar}>
        <div className={styles.bottomLinks}>
          <Link href="/trust">Privacy Policy</Link>
          <span>•</span>
          <Link href="/trust">Terms of Service</Link>
          <span>•</span>
          <Link href="/trust">Security Standards</Link>
        </div>
        {monitorLabel ? (
          <div className={styles.monitor}>
            <span className={styles.monitorPulse}></span>
            <span>{monitorLabel}</span>
          </div>
        ) : null}
      </footer>
    </div>
  );
}
