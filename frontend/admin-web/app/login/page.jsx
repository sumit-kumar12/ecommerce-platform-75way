import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { LoginClient } from "./LoginClient";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <section className={styles.page}>
          <header className={styles.chrome}>
            <Link href="/" className={styles.brandLink}>
              <Image src="/logo.png" alt="Katabazaar" width={768} height={768} priority className={styles.brandLogo} />
              <div className={styles.brandText}>
                <h2 className={styles.brandTitle}>Katabazaar <span>Admin</span></h2>
              </div>
            </Link>
            <div className={styles.chromeMeta}></div>
          </header>
          <div className={styles.shell}>
            <GlassPanel className={styles.loadingCard} elevated>
              <p className={styles.loadingEyebrow}>Preparing secure access</p>
              <h1>Command Center</h1>
              <div className={styles.loadingBar}><span></span></div>
            </GlassPanel>
          </div>
        </section>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
