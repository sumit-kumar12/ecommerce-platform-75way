"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFrame } from "../../components/auth/AuthFrame";
import { ButtonPrimary } from "../../components/ui/ButtonPrimary";
import { InputField } from "../../components/ui/InputField";
import { apiRequest } from "../../lib/api";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email },
        csrf: true,
      });
      router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`);
    } catch (requestError) {
      setError(requestError.message ?? "Unable to start the password reset flow right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      width="narrow"
      headerAction={
        <Link href="/login" className={styles.backLink} aria-label="Back to login">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
      }
      hero={
        <div className={styles.heroIcon}>
          <span className="material-symbols-outlined">key_visualizer</span>
        </div>
      }
      title="Forgot password?"
      subtitle="Enter your email to receive a secure reset link."
    >
      <form className={styles.form} onSubmit={submit}>
        <InputField
          id="forgot-email"
          label="Email address"
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {error ? (
          <div className={styles.errorBanner}>
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        ) : null}

        <ButtonPrimary type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Sending reset link..." : "Send Reset Link"}
        </ButtonPrimary>
      </form>

      <div className={styles.formFooter}>
        <p className={styles.footerCopy}>
          Remember your password?{" "}
          <Link href="/login" className={styles.inlineLink}>
            Back to login
          </Link>
        </p>
        <div className={styles.footerBar}></div>
      </div>
    </AuthFrame>
  );
}
