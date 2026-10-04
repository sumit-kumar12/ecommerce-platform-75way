"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonPrimary } from "../../components/ui/ButtonPrimary";
import { getCurrentUser, loginRequest, logoutRequest } from "../../lib/api";
import styles from "./LoginClient.module.css";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "SECURITY_ADMIN", "COMMERCE_ADMIN", "SUPPORT_AGENT", "VIEWER"]);
const isAdminUser = (payload) => ADMIN_ROLES.has(payload?.user?.role);

const normalizeNextPath = (value) => {
  const raw = String(value || "/").trim();
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  return raw;
};

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => normalizeNextPath(searchParams.get("next")), [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");

  const resolveAdminSession = async () => {
    const payload = await getCurrentUser();
    if (!isAdminUser(payload)) {
      await logoutRequest().catch(() => {});
      throw new Error("This account does not have admin access.");
    }
    return payload.user;
  };

  useEffect(() => {
    let active = true;
    resolveAdminSession()
      .then(() => { if (active) router.replace(nextPath); })
      .catch((error) => {
        if (!active) return;
        if (error?.code === "AUTH_REQUIRED") {
          return;
        }
        if (error?.message === "This account does not have admin access.") {
          setMessage(error.message);
        }
      })
      .finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; };
  }, [nextPath, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || checkingSession) return;
    setLoading(true);
    setMessage("");

    try {
      const payload = await loginRequest({ email: email.trim(), password });
      if (!isAdminUser(payload)) {
        await logoutRequest().catch(() => {});
        throw new Error("This account does not have admin access.");
      }
      router.replace(nextPath);
    } catch (error) {
      const errText = error?.message || "Login failed.";
      if (errText.includes("Invalid credentials") || error?.code === "INVALID_CREDENTIALS") {
        setMessage("Invalid email or password");
      } else {
        setMessage(errText);
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.chrome}>
        <Link href="http://localhost:3000" className={styles.brandLink}>
          <div className={styles.brandIcon}>
            <span className="material-symbols-outlined">shield_person</span>
          </div>
          <h2 className={styles.brandTitle}>Katabazaar <span>Admin</span></h2>
        </Link>
        <div className={styles.chromeActions}>
          <button className={styles.iconButton} onClick={() => alert("Aegis Security Gateway: Version 4.0.1. All administrative sessions are encrypted and logged.")}>
            <span className="material-symbols-outlined">security</span>
          </button>
          <button className={styles.iconButton} onClick={() => alert("Midnight Obsidian theme is locked by system policy.")}>
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
        </div>
      </header>

      <main className={styles.shell}>
        <div className={styles.radarLayer}>
          <div className={`${styles.radarRing} ${styles.ring1}`}></div>
          <div className={`${styles.radarRing} ${styles.ring2}`}></div>
          <div className={`${styles.radarRing} ${styles.ring3}`}></div>
          <div className={styles.radarSweep}></div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.headerBlock}>
            <h1 className={styles.commandTitle}>Command Center</h1>
            <p className={styles.commandSubtitle}>SECURE ACCESS PROTOCOL REQUIRED</p>
          </div>

          <div className={styles.noticeBanner}>
            <span className="material-symbols-outlined">verified_user</span>
            <div>
              <p>Local Admin Access</p>
              <span>Use the seeded administrator account for local testing. The real auth flow here is email and password only.</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className={styles.fieldStack}>
              <label className={styles.fieldLabel}>Administrator ID</label>
              <div className={styles.inputShell}>
                <span className="material-symbols-outlined">badge</span>
                <input 
                  className={styles.loginInput} 
                  type="email" 
                  autoComplete="email" 
                  placeholder="Enter credentials" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.fieldStack}>
              <label className={styles.fieldLabel}>Secure Passphrase</label>
              <div className={styles.inputShell}>
                <span className="material-symbols-outlined">key</span>
                <input 
                  className={styles.loginInput} 
                  type="password" 
                  autoComplete="current-password" 
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.testingNote}>
              <span className="material-symbols-outlined">info</span>
              <div>
                <strong>Local testing mode</strong>
                <span>MFA is not enforced by the current backend auth flow. Sign in with admin email and password only.</span>
              </div>
            </div>

            {message && (
              <div className={styles.errorBanner}>
                <span className="material-symbols-outlined">warning</span>
                <span>{message}</span>
              </div>
            )}

            <ButtonPrimary type="submit" className={styles.submitButton} icon="key_visualizer" disabled={loading || checkingSession}>
              {loading ? "INITIATING..." : "INITIATE AUTHENTICATION"}
            </ButtonPrimary>
          </form>

        </div>
      </main>

      <div className={styles.bgDeco}>
        <div className={styles.decoBlob1}></div>
        <div className={styles.decoBlob2}></div>
      </div>
    </div>
  );
}
