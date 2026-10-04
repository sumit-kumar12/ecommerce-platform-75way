"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { adminRequest } from "../lib/api";
import { getAvailablePanels, PANEL_DEFINITIONS } from "../lib/access";
import styles from "./AdminTopbar.module.css";
import Link from "next/link";
import { AdminProfileDropdown } from "./ui/AdminProfileDropdown";

export function AdminTopbar({ title, summary, user, onMenuToggle, onSearchOpen, navVisible, panel = "commerce", onPanelChange, searchShortcut }) {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const availablePanels = getAvailablePanels(user);
  const isSecurity = panel === "security";
  const otherPanel = isSecurity ? "commerce" : "security";
  const otherPanelDef = PANEL_DEFINITIONS[otherPanel];
  const canSwitch = availablePanels.length > 1;

  const displayName = user?.name || "Platform Admin";
  const displayRole = String(user?.role || "ADMIN").replace(/_/g, " ").toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const [threatsResult, auditResult] = await Promise.allSettled([
        adminRequest("/monitoring/threat-spikes?limit=3"),
        adminRequest("/audit?limit=3"),
      ]);
      const next = [];
      if (threatsResult.status === "fulfilled") {
        for (const item of threatsResult.value?.threatSpikes ?? []) {
          next.push({ id: `threat-${item.id || item.createdAt}`, icon: "warning", title: item.eventType || "Threat spike detected", meta: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Live", href: "/threats" });
        }
      }
      if (auditResult.status === "fulfilled") {
        for (const item of auditResult.value?.logs ?? []) {
          next.push({ id: `audit-${item.id || item.createdAt}`, icon: "history_edu", title: item.action || "Audit activity logged", meta: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent", href: "/audit" });
        }
      }
      setNotifications(next.slice(0, 6));
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationsToggle = async () => {
    const next = !notificationsOpen;
    setNotificationsOpen(next);
    if (next) { setIsProfileOpen(false); await loadNotifications(); }
  };

  return (
    <header className={styles.header}>
      {/* ── Left: Hamburger ───────────────────────────── */}
      <div className={styles.leftSection}>
        <button onClick={onMenuToggle} className={styles.menuBtn} aria-label="Toggle menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* ── Centre: Search ────────────────────────────── */}
      <div className={styles.searchBar} onClick={onSearchOpen} role="button" aria-label="Open global search" aria-haspopup="dialog">
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input
          type="text"
          placeholder={`Global Search [ ${searchShortcut || "Ctrl+K"} ]`}
          className={styles.searchInput}
          readOnly
          aria-label="Global search"
          aria-readonly="true"
          tabIndex={-1}
        />
      </div>

      <button className={`${styles.iconBtn} ${styles.mobileSearchBtn}`} onClick={onSearchOpen} aria-label="Open search">
        <span className="material-symbols-outlined">search</span>
      </button>

      {/* ── Right: actions ───────────────────────────── */}
      <div className={styles.rightSection}>

        {/* Theme toggle disabled globally as per request
        <button onClick={toggleTheme} className={styles.iconBtn} aria-label="Toggle theme">
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
        */}

        {/* Notifications */}
        <div className={styles.notificationWrap} ref={notificationRef}>
          <button
            type="button"
            onClick={() => void handleNotificationsToggle()}
            className={styles.iconBtn}
            aria-label="Open notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.length > 0 && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </button>

          {notificationsOpen && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <strong>Notifications</strong>
                <button type="button" className={styles.notificationRefresh} onClick={() => void loadNotifications()}>
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>
              <div className={styles.notificationList}>
                {notificationsLoading ? (
                  <div className={styles.notificationEmpty}>Loading live activity…</div>
                ) : notifications.length ? (
                  notifications.map((item) => (
                    <Link key={item.id} href={item.href} className={styles.notificationItem} onClick={() => setNotificationsOpen(false)}>
                      <span className={`material-symbols-outlined ${styles.notificationItemIcon}`}>{item.icon}</span>
                      <div className={styles.notificationItemBody}>
                        <span>{item.title}</span>
                        <small>{item.meta}</small>
                      </div>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </Link>
                  ))
                ) : (
                  <div className={styles.notificationEmpty}>No active notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile capsule */}
        <div className={styles.profileWrap} ref={profileRef}>
          <button
            type="button"
            className={styles.profileBtn}
            onClick={() => { setIsProfileOpen((c) => !c); setNotificationsOpen(false); }}
          >
            <div className={styles.profileAvatar}>
              <span className="material-symbols-outlined">local_police</span>
            </div>
            <div className={styles.profileMeta}>
              <span className={styles.profileName}>{displayName}</span>
              <span className={styles.profileRole}>{displayRole}</span>
            </div>
            <span className={`material-symbols-outlined ${styles.profileChevron}`}>expand_more</span>
          </button>

          <AdminProfileDropdown open={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} panel={panel} />
        </div>
      </div>
    </header>
  );
}
