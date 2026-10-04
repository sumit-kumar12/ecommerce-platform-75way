"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { StoreShell } from "../../components/layout/StoreShell";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setStatus("Invalid or missing verification token.");
      return;
    }

    apiRequest("/auth/verify-email", { method: "POST", body: { token }, csrf: true })
      .then(() => {
        setStatus("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login?verified=1"), 2000);
      })
      .catch((err) => {
        setStatus(err.message || "Failed to verify email. The link may have expired.");
      });
  }, [token, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#0F0E17] text-white">
      <div className="bg-[#1A1A2E] p-8 rounded-xl border border-white/10 shadow-2xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className="text-gray-400">{status}</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <StoreShell>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </StoreShell>
  );
}
