"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getNavGroupsForUser, PANEL_DEFINITIONS } from "../lib/access";
import { logoutRequest } from "../lib/api";
import styles from "./AdminSidebar.module.css";

const STORAGE_KEY = "kb-admin-sidebar-modules";

function readModuleState() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function writeModuleState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AdminSidebar({ user, panel = "commerce", mobileOpen = false, collapsed = false, onClose = null }) {
  const path = usePathname();
  const router = useRouter();
  const navGroups = getNavGroupsForUser(user, panel);
  const panelDefinition = PANEL_DEFINITIONS[panel] ?? PANEL_DEFINITIONS.commerce;
  const isSecurity = panel === "security";

  const isActive = useCallback(
    (href) => path === href || (href !== "/" && path.startsWith(`${href}/`)),
    [path],
  );

  // Detect modular (commerce) vs flat (security) nav shape
  const isModular = navGroups.length > 0 && Array.isArray(navGroups[0]?.groups);

  // Accordion state for modular panels
  const [openModules, setOpenModules] = useState(() => {
    if (!isModular) return {};
    const saved = readModuleState();
    return Object.fromEntries(
      navGroups.map((mod) => [mod.id, saved[mod.id] ?? mod.defaultOpen ?? false]),
    );
  });

  // Expanded groups for security panel (collapsible groups with arrow)
  const [expandedGroups, setExpandedGroups] = useState(() => {
    if (!isSecurity) return {};
    // All groups start expanded by default
    return Object.fromEntries(navGroups.map((g, i) => [i, true]));
  });

  useEffect(() => {
    if (!isModular) return;
    setOpenModules((prev) => {
      let changed = false;
      const next = { ...prev };
      navGroups.forEach((mod) => {
        const hasActive = mod.groups?.some((g) => g.items?.some((item) => isActive(item.href)));
        if (hasActive && !next[mod.id]) { next[mod.id] = true; changed = true; }
      });
      if (changed) writeModuleState(next);
      return changed ? next : prev;
    });
  }, [path, isModular, navGroups, isActive]);

  const toggleModule = useCallback((id) => {
    setOpenModules((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeModuleState(next);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((idx) => {
    setExpandedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutRequest();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ── Security sidebar nav item (compact single-line style) ─────────────────
  // Items that act as "section roots" and get a chevron hint
  const CHEVRON_HREFS = new Set(["/dashboard", "/threats", "/incidents", "/lockout", "/users", "/audit"]);

  const renderSecurityNavItem = (item) => {
    const isDashboard = item.href === "/soc/dashboard";
    const active = isActive(item.href);
    const hasChevron = CHEVRON_HREFS.has(item.href);
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => onClose?.()}
        className={`${isDashboard ? styles.navItemDashboard : styles.navItem} ${active && !isDashboard ? styles.navItemActive : ""} ${item.danger ? styles.navItemDanger : ""}`}
      >
        {active && !isDashboard && <div className={styles.activeIndicator} />}
        <span className={`material-symbols-outlined ${styles.navIcon}`}>{item.icon}</span>
        {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
        {!collapsed && hasChevron && (
          <span className={`material-symbols-outlined ${styles.navChevron}`}>expand_more</span>
        )}
        {!collapsed && item.danger && (
          <span className={`material-symbols-outlined ${styles.dangerIcon}`}>warning</span>
        )}
      </Link>
    );
  };

  // ── Commerce accordion nav item (two-line with summary) ───────────────────
  const renderCommerceNavItem = (item) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => onClose?.()}
        className={`${styles.navItemRich} ${active ? styles.navItemRichActive : ""}`}
      >
        <div className={styles.navIconWrapper}>
          <span className="material-symbols-outlined">{item.icon}</span>
        </div>
        <div className={styles.navContent}>
          <span className={styles.navText}>{item.label}</span>
          <span className={styles.navSummary}>{item.summary}</span>
        </div>
        {active && <div className={styles.activeIndicator} />}
      </Link>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""} ${collapsed ? styles.sidebarCollapsed : ""}`.trim()}>

      {/* ── Brand / Panel Header ──────────────────────────────────────────── */}
      <div className={styles.brandArea}>
        <div className={styles.brandLogo}>
          <span className={`material-symbols-outlined ${styles.brandIcon}`}>{panelDefinition.icon}</span>
        </div>
        {!collapsed && (
          <div className={styles.brandText}>
            <span className={styles.brandName}>KATABAZAAR</span>
            <span className={styles.brandRole}>{panelDefinition.eyebrow}</span>
          </div>
        )}
      </div>

      {/* ── Scrollable Nav ───────────────────────────────────────────────── */}
      <div className={styles.scrollArea}>
        {isSecurity && !isModular
          ? /* ── Security: primary groups (no header) + secondary groups (with header) */
            navGroups.map((group, gIdx) => {
              // The first group has label === null, always visible without header
              const isPrimary = group.label === null;
              const isExpanded = expandedGroups[gIdx] !== false;
              return (
                <section key={group.label ?? gIdx} className={`${styles.group} ${isPrimary ? styles.groupPrimary : ""}`}>
                  {!isPrimary && group.label && !collapsed && (
                    <button
                      type="button"
                      className={styles.groupLabelBtn}
                      onClick={() => toggleGroup(gIdx)}
                    >
                      <span className={styles.groupLabel}>{group.label}</span>
                      <span className={`material-symbols-outlined ${styles.groupChevron} ${isExpanded ? styles.groupChevronOpen : ""}`}>
                        expand_more
                      </span>
                    </button>
                  )}
                  {(isPrimary || isExpanded) && (
                    <div className={styles.groupItems}>
                      {group.items?.map(renderSecurityNavItem)}
                    </div>
                  )}
                </section>
              );
            })
          : /* ── Commerce: modular accordion ──────────────────────────────── */
            navGroups.map((mod) => {
              const isOpen = !!openModules[mod.id];
              return (
                <div key={mod.id} className={styles.module}>
                  <button
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className={`${styles.moduleHeader} ${isOpen ? styles.moduleHeaderOpen : ""}`}
                    aria-expanded={isOpen}
                  >
                    <span className={`material-symbols-outlined ${styles.moduleIcon}`}>{mod.icon}</span>
                    <span className={styles.moduleLabel}>{mod.label}</span>
                    <span className={`material-symbols-outlined ${styles.moduleChevron}`}>chevron_right</span>
                  </button>
                  <div className={`${styles.moduleBody} ${isOpen ? styles.moduleBodyOpen : ""}`}>
                    {mod.groups?.flatMap((g) => g.items ?? []).map(renderCommerceNavItem)}
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        {isSecurity ? (
          <>
            <button className={styles.terminateBtn} onClick={handleLogout}>
              <span className={`material-symbols-outlined ${styles.terminateIcon}`}>power_settings_new</span>
              {!collapsed && <span>Terminate Session</span>}
            </button>
            {!collapsed && (
              <div className={styles.uplinkStatus}>
                <span className={styles.uplinkDot} />
                <span className={styles.uplinkText}>Secure Admin Uplink Active</span>
              </div>
            )}
          </>
        ) : (
          <div className={styles.quickActionCard}>
            <div className={styles.cardHeader}>
              <span className="material-symbols-outlined">{panelDefinition.icon}</span>
              {!collapsed && <p className={styles.cardTitle}>{panelDefinition.label}</p>}
            </div>
            {!collapsed && <p className={styles.cardText}>{panelDefinition.summary}</p>}
          </div>
        )}
      </div>
    </aside>
  );
}
