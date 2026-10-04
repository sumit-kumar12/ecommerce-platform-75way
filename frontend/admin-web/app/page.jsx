"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CommerceDashboard } from "../components/CommerceDashboard";
import { getCurrentUser } from "../lib/api";
import { canAccessPanel, getDefaultPanelForRole } from "../lib/access";
import styles from "./page.module.css";

export default function AdminHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((payload) => {
        if (!payload?.user) {
          router.replace("/login");
          return;
        }
        setUser(payload.user);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  useEffect(() => {
    if (loading || !user) return;
    
    // Only redirect away if the user explicitly DOES NOT have Commerce access
    if (!canAccessPanel(user.role, "commerce")) {
      const panel = getDefaultPanelForRole(user.role);
      router.replace(panel === "security" ? "/dashboard" : "/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className={styles.pageShell}>Loading...</div>;
  }

  // Waiting for redirect if they don't have access
  if (!canAccessPanel(user.role, "commerce")) {
    return <div className="min-h-screen bg-[#0F0E17]"></div>;
  }

  // Otherwise, they see the CommerceDashboard
  return (
    <div className={styles.pageShell}>
      <CommerceDashboard user={user} />
    </div>
  );
}

