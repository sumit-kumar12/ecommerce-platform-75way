"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "../lib/api";
import {
  canAccessAdminPath,
  getDefaultPanelForRole,
  getDefaultRouteForPanel,
  getNavItemsForUser,
  getPanelForPath,
  isAdminRole,
  resolveFallbackPath,
} from "../lib/access";
import { AdminContentShell } from "./AdminContentShell";
import AdminSidebarShell from "./sidebar/AdminSidebarShell";
import { AdminTopbar } from "./AdminTopbar";
import { GlassPanel } from "./ui/GlassPanel";
import { SearchOverlay } from "./ui/SearchOverlay";
import styles from "./AdminShell.module.css";

const AUTH_FREE_PATHS = new Set(["/login"]);
const getSearchScopeForPath = (pathname) => {
  if (pathname.startsWith("/orders")) return "orders";
  if (pathname.startsWith("/users")) return "users";
  if (pathname.startsWith("/products")) return "products";
  if (pathname.startsWith("/categories")) return "categories";
  if (pathname.startsWith("/threat")) return "threats";
  if (pathname.startsWith("/audit")) return "audit";
  return "all";
};

export function AdminShell({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isAuthFree = useMemo(() => AUTH_FREE_PATHS.has(pathname), [pathname]);
  const [authChecking, setAuthChecking] = useState(!isAuthFree);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    let preferredPanel = activePanel;
    if (!preferredPanel && typeof window !== "undefined") {
      preferredPanel = localStorage.getItem("activeAdminPanel");
    }
    
    let resolvedPanel = getPanelForPath(pathname, preferredPanel);
    if (!resolvedPanel && currentUser) {
      resolvedPanel = getDefaultPanelForRole(currentUser.role);
    }
    
    if (resolvedPanel) {
      setActivePanel(resolvedPanel);
      if (typeof window !== "undefined") {
        localStorage.setItem("activeAdminPanel", resolvedPanel);
      }
    }
  }, [pathname, currentUser, activePanel]);

  const navItems = useMemo(() => (currentUser && activePanel ? getNavItemsForUser(currentUser, activePanel) : []), [activePanel, currentUser]);

  const activeItem = useMemo(
    () => navItems.find((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) ?? null,
    [navItems, pathname],
  );
  const searchScope = useMemo(() => getSearchScopeForPath(pathname), [pathname]);

  useEffect(() => {
    setSearchOpen(false);
    setIsForbidden(false);
  }, [pathname]);

  // Sidebar collapse state is now managed inside AdminSidebarShell

  useEffect(() => {
    if (isAuthFree) return undefined;

    const handleKeyDown = (event) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;

      const tagName = event.target?.tagName?.toLowerCase?.() || "";
      const isTypingTarget =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        event.target?.isContentEditable;

      if (isTypingTarget) return;

      event.preventDefault();
      setSearchOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthFree]);

  useEffect(() => {
    let active = true;

    if (isAuthFree) {
      setAuthChecking(false);
      setCurrentUser(null);
      return () => {
        active = false;
      };
    }
    
    if (!currentUser) {
      setAuthChecking(true);
    }
    
    const timeoutId = setTimeout(() => {
      console.warn("Admin session check timed out - redirecting to login for security (DISABLED FOR TESTING)");
      if (active) {
        setAuthChecking(false);
        const next = encodeURIComponent(pathname || "/");
        router.replace(`/login?next=${next}`);
      }
    }, 30000); // 30s fail-closed timeout for security

    getCurrentUser()
      .then((payload) => {
        clearTimeout(timeoutId);
        if (!active) return;
        
        if (!isAdminRole(payload?.user?.role)) {
          setCurrentUser(null);
          setAuthChecking(false);
          router.replace("/login?error=unauthorized");
          return;
        }

        if (!canAccessAdminPath(payload.user.role, pathname)) {
          setCurrentUser(payload.user);
          setAuthChecking(false);
          setIsForbidden(true);
          return;
        }
        
        setCurrentUser(payload.user);
        setAuthChecking(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (!active) return;
        setCurrentUser(null);
        setAuthChecking(false);
        router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      });

    return () => {
      active = false;
    };
  }, [isAuthFree, pathname, router]);

  // Derive permissions array from user role for the new sidebar's node filtering
  const userPermissions = useMemo(() => {
    if (!currentUser) return [];
    // Grant broad read permissions based on role — sidebar will filter per node
    const base = ["dashboard.read", "orders.read", "orders.write", "products.read",
      "products.write", "customers.read", "support.read", "analytics.read",
      "reports.read", "finance.read", "delivery.read", "marketing.read",
      "cms.read", "reviews.read", "settings.read", "profile.read"];
    const isFullAdmin = ["ADMIN", "SUPER_ADMIN"].includes(currentUser.role);
    if (isFullAdmin) {
      return [...base, "users.read", "users.write", "security.read",
        "system.read", "api.read", "integrations.read",
        "roles.read", "permissions.read", "finance.write",
        "marketing.write", "cms.write", "products.write"];
    }
    return base;
  }, [currentUser]);

  if (isAuthFree) {
    return <div className={styles.authShell}>{children}</div>;
  }

  const shouldRenderContent = !authChecking && currentUser !== null;
  const handlePanelChange = (panel) => {
    setActivePanel(panel);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeAdminPanel", panel);
    }
    router.push(getDefaultRouteForPanel(panel));
  };

  return (
    <div className={styles.shell}>
      {!shouldRenderContent ? (
        <div className={styles.workspace}>
          <AdminContentShell>
            <div className={styles.loadingWrap}>
              <GlassPanel className={styles.loadingCard} elevated>
                <div className={styles.loadingPulse}></div>
                <span className={styles.loadingEyebrow}>System Integrity Check</span>
                <h2>{authChecking ? "Validating operator context" : "Security Lock Active"}</h2>
                <p>
                  {authChecking
                    ? "Role checks, session state, and account status are being verified before the command center opens."
                    : "Redirecting to secure login gateway..."}
                </p>
                <div className={styles.loadingBar}>
                  <span></span>
                </div>
              </GlassPanel>
            </div>
          </AdminContentShell>
        </div>
      ) : (
        <>
          {/* New premium sidebar — self-manages mobile drawer + desktop collapse */}
          <AdminSidebarShell
            activePath={pathname}
            activePanel={activePanel}
            onPanelChange={handlePanelChange}
            className={styles.sidebarRail}
            userName={currentUser?.name || "Admin User"}
            userRole={currentUser?.role || "ADMIN"}
            permissions={userPermissions}
            onNavigate={(href) => router.push(href)}
            onLogout={async () => {
              try {
                const { logoutRequest } = await import("../lib/api");
                await logoutRequest();
              } catch { /* noop */ }
              window.location.href = "/login";
            }}
            brandName="Katabazaar"
          />

          <div className={styles.workspace}>
            <AdminContentShell>
              <AdminTopbar
                title={activeItem?.label || "Dashboard"}
                summary={activeItem?.summary || "Central oversight for commerce, security, and governance workflows."}
                user={currentUser}
                onMenuToggle={() => {
                  // Post a custom event — AdminSidebarShell listens and toggles desktopOpen
                  window.dispatchEvent(new CustomEvent("katabazaar:toggleSidebar"));
                }}
                onSearchOpen={() => setSearchOpen(true)}
                navVisible={true}
                panel={activePanel}
                onPanelChange={handlePanelChange}
                searchShortcut={typeof navigator !== "undefined" && navigator.platform?.toLowerCase().includes("mac") ? "Cmd+K" : "Ctrl+K"}
              />
              <div className={styles.pageSlot}>
                {isForbidden ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                      <span className="material-symbols-outlined text-4xl text-red-500">lock</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Access Restricted</h2>
                    <p className="text-slate-400 max-w-md mb-8">
                      Your current role ({currentUser?.role}) does not have the required permissions to view this surface.
                      This event has been logged to the security audit trail.
                    </p>
                    <button
                      onClick={() => router.push(getDefaultRouteForPanel(activePanel))}
                      className="px-6 py-2.5 bg-slate-800 text-slate-200 font-medium rounded-lg border border-slate-700 hover:bg-slate-700 transition"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                ) : (
                  children
                )}
              </div>
            </AdminContentShell>
          </div>
        </>
      )}

      {shouldRenderContent ? (
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} quickLinks={navItems} defaultScope={searchScope} />
      ) : null}
    </div>
  );
}
