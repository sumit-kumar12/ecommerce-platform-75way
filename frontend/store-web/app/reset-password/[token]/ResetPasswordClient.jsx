"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AuthFrame } from "../../../components/auth/AuthFrame";
import { PasswordField } from "../../../components/auth/PasswordField";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import { apiRequest } from "../../../lib/api";
import { assessPasswordStrength, isPasswordPolicySatisfied } from "../../../lib/auth";
import styles from "./page.module.css";

const formatExpiry = (value) => {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

export default function ResetPasswordClient({ token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("validating");
  const [expiresAt, setExpiresAt] = useState("");

  const passwordMismatch = useMemo(
    () => confirmPassword.length > 0 && confirmPassword !== password,
    [confirmPassword, password],
  );
  const passwordStrength = useMemo(() => assessPasswordStrength(password), [password]);

  useEffect(() => {
    let mounted = true;

    const validate = async () => {
      try {
        const response = await apiRequest(`/auth/reset-password/${token}/validate`, {
          method: "GET",
          csrf: false,
        });

        if (!mounted) return;
        setExpiresAt(response.expiresAt ?? "");
        setStatus("ready");
      } catch (requestError) {
        if (!mounted) return;
        setError(requestError.message ?? "This reset link is invalid or expired.");
        setStatus("invalid");
      }
    };

    void validate();

    return () => {
      mounted = false;
    };
  }, [token]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isPasswordPolicySatisfied(password)) {
      setError("Password must satisfy every security requirement before reset can complete.");
      return;
    }

    if (passwordMismatch) {
      setError("Password confirmation does not match.");
      return;
    }

    setStatus("submitting");

    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: {
          token,
          password,
        },
        csrf: true,
      });
      setStatus("success");
    } catch (requestError) {
      setError(requestError.message ?? "Password reset failed.");
      setStatus("ready");
    }
  };

  if (status === "success") {
    return (
      <AuthFrame
        width="narrow"
        hero={
          <div className={styles.heroIconSuccess}>
            <span className="material-symbols-outlined">verified_user</span>
          </div>
        }
        title="Password updated"
        subtitle="Your password has been changed and all refresh sessions have been revoked. Sign in again to start a new trusted session."
        footer={
          <p className={styles.footerCopy}>
            Need another reset later?{" "}
            <Link href="/forgot-password" className={styles.inlineLink}>
              Request a new link
            </Link>
          </p>
        }
      >
        <div className={styles.actions}>
          <Link href="/login?reset=success" className={styles.primaryLink}>
            <span>Return to login</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </AuthFrame>
    );
  }

  if (status === "invalid") {
    return (
      <AuthFrame
        width="narrow"
        hero={
          <div className={styles.heroIconInvalid}>
            <span className="material-symbols-outlined">gpp_bad</span>
          </div>
        }
        title="Reset link unavailable"
        subtitle={error || "This reset link is invalid or expired. Start the password reset flow again to receive a new one."}
        footer={
          <p className={styles.footerCopy}>
            Still blocked?{" "}
            <Link href="/login" className={styles.inlineLink}>
              Return to login
            </Link>
          </p>
        }
      >
        <div className={styles.actions}>
          <Link href="/forgot-password" className={styles.primaryLink}>
            <span>Request a new reset link</span>
            <span className="material-symbols-outlined">refresh</span>
          </Link>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      width="medium"
      headerAction={
        <div className={styles.sessionBadge}>
          <span className="material-symbols-outlined">verified_user</span>
          <span>Secure Session</span>
        </div>
      }
      hero={
        <div className={styles.heroIcon}>
          <span className="material-symbols-outlined">lock_reset</span>
        </div>
      }
      title="Create New Password"
      subtitle="Please choose a strong password to protect your Katabazaar account and assets."
      footer={
        <p className={styles.footerCopy}>
          Want to sign in instead?{" "}
          <Link href="/login" className={styles.inlineLink}>
            Back to login
          </Link>
        </p>
      }
    >
      {status === "validating" ? (
        <div className={styles.loadingPanel}>
          <span className="material-symbols-outlined">sync</span>
          <span>Verifying reset link...</span>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <PasswordField
            name="password"
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Choose a new password"
            autoComplete="new-password"
            required
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm new password"
            icon="lock_reset"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat the new password"
            autoComplete="new-password"
            error={passwordMismatch ? "Passwords do not match." : ""}
            required
          />

          <div className={styles.strengthWrap}>
            <div className={styles.strengthHeader}>
              <span className={styles.strengthTitle}>Password Strength</span>
              <span className={styles.strengthValue}>
                {passwordStrength.label === "Very strong" ? "Strong" : passwordStrength.label}
                {password ? ` (${passwordStrength.percent}%)` : ""}
              </span>
            </div>
            <div className={styles.strengthTrack}>
              <span className={styles.strengthFill} style={{ width: `${passwordStrength.percent}%` }}></span>
            </div>
            <div className={styles.strengthMeta}>
              <span className="material-symbols-outlined">
                {isPasswordPolicySatisfied(password) ? "check_circle" : "info"}
              </span>
              <span>
                {isPasswordPolicySatisfied(password)
                  ? "Matches all high-security requirements"
                  : "Use a long password with upper, lower, number, and symbol characters"}
              </span>
            </div>
          </div>

          {expiresAt ? (
            <div className={styles.notice}>
              <span className="material-symbols-outlined">schedule</span>
              <p>Verified reset link. Current expiry: {formatExpiry(expiresAt)}.</p>
            </div>
          ) : null}

          {error ? (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          ) : null}

          <ButtonPrimary type="submit" icon="arrow_forward" className={styles.submitButton} disabled={status === "submitting"}>
            {status === "submitting" ? "Updating password..." : "Reset password"}
          </ButtonPrimary>

          <div className={styles.trustNote}>
            <span className="material-symbols-outlined">shield_with_heart</span>
            <div>
              <strong>Zero-trust reset flow</strong>
              <p>When the password changes, existing refresh sessions are revoked automatically.</p>
            </div>
          </div>
        </form>
      )}
    </AuthFrame>
  );
}
