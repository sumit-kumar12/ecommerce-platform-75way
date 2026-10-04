"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Generate an anonymous session ID for tracking
    let sessionId = localStorage.getItem("analytics_session_id");
    if (!sessionId) {
      // crypto.randomUUID() requires a secure context (HTTPS).
      // Fall back to a Math.random-based UUID v4 for HTTP (localhost/dev).
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        sessionId = crypto.randomUUID();
      } else {
        sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
      }
      localStorage.setItem("analytics_session_id", sessionId);
    }

    const pathWithQuery = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    fetch("/api-proxy/api/v1/events/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathWithQuery,
        referrer: document.referrer || null,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {
      // Ignore failures
    });
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}
