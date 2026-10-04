"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthFrame } from "../../../components/auth/AuthFrame";
import { apiRequest } from "../../../lib/api";
import { maskEmailAddress } from "../../../lib/auth";
import styles from "./page.module.css";

export default function SentClient({ email }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resend = async () => {
    if (!email) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email },
        csrf: true,
      });
      setMessage("A fresh reset email has been queued for delivery.");
    } catch (requestError) {
      setError(requestError.message ?? "Unable to resend the reset email right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      width="narrow"
      headerAction={
        <Link href="/login" className={styles.closeLink} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </Link>
      }
      hero={
        <div className={styles.heroWrap}>
          <div className={styles.heroIcon}>
            <span className="material-symbols-outlined">mark_email_unread</span>
          </div>
          <div className={styles.heroCheck}>
            <span className="material-symbols-outlined">check</span>
          </div>
        </div>
      }
      title="Check Your Inbox"
      subtitle={
        email
          ? `We've sent a secure one-time reset link to ${maskEmailAddress(email)}.`
          : "We've sent a secure one-time reset link if that account exists."
      }
    >
      <div className={styles.content}>
        <div className={styles.notice}>
          <span className="material-symbols-outlined">schedule</span>
          <p>The link will expire in 15 minutes.</p>
        </div>

        {message ? (
          <div className={styles.successBanner}>
            <span className="material-symbols-outlined">check_circle</span>
            <span>{message}</span>
          </div>
        ) : null}

        {error ? (
          <div className={styles.errorBanner}>
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        ) : null}

        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryLink}>
            <span>Return to Login</span>
          </Link>
          <button type="button" className={styles.resendButton} onClick={resend} disabled={loading || !email}>
            {loading ? "Resending..." : "Didn't receive an email? Resend"}
          </button>
        </div>

        <p className={styles.footerCopy}>Secure authentication by Katabazaar Identity Services</p>
      </div>
    </AuthFrame>
  );
}
