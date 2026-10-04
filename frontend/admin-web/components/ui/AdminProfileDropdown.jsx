"use client";

import React from "react";
import Link from "next/link";
import { logoutRequest } from "../../lib/api";
import styles from "./AdminProfileDropdown.module.css";
import { getAvailablePanels } from "../../lib/access";

export function AdminProfileDropdown({ open, onClose, user, panel = "security" }) {
  if (!open) return null;

  const isSecurity = panel === "security";
  const themeClass = isSecurity ? styles.themeSecurity : styles.themeCommerce;
  
  const availablePanels = getAvailablePanels(user);
  const canSwitch = availablePanels.length > 1;

  // Real or mock data based on user
  const displayName = user?.name || (isSecurity ? "Platform Admin" : "Store Manager");
  const displayEmail = user?.email || (isSecurity ? "platform@katabazaar.local" : "manager@merchant.local");
  const displayRole = user?.role || (isSecurity ? "SUPER ADMIN" : "COMMERCE ADMIN");
  
  // Formatting helper
  const roleDisplay = String(displayRole).replace(/_/g, ' ');

  const handleLogout = async () => {
    try {
      await logoutRequest();
      window.location.href = "/login";
    } catch (err) {
      console.error("Session termination failed:", err);
    }
  };

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <div className={styles.scrollArea}>
        {/* Avatar and Info Section */}
        <div className={styles.userInfoSection}>
          <div className={styles.avatarWrap}>
            <span className="material-symbols-outlined">
              {isSecurity ? "local_police" : "storefront"}
            </span>
          </div>
          <div className={styles.userInfoText}>
            <div className={styles.name}>{displayName}</div>
            <div className={styles.role}>{roleDisplay}</div>
            <div className={styles.email}>{displayEmail}</div>
          </div>
        </div>

        {/* Switch Panel Option */}
        {canSwitch && (
          <Link href={isSecurity ? "/commerce" : "/security"} className={styles.switchPanelItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>manage_accounts</span>
            <span className={styles.label}>
              {isSecurity ? "Switch to Merchant Admin" : "Switch to Platform Admin"}
            </span>
            <span className={`material-symbols-outlined ${styles.chevronRight}`}>chevron_right</span>
          </Link>
        )}

        <div className={styles.divider}></div>

        {/* Primary Links */}
        <div className={styles.menuGroup}>
          <Link href={isSecurity ? "/dashboard" : "/"} className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {isSecurity ? "home" : "store"}
            </span>
            <span className={styles.label}>{isSecurity ? "Command Center" : "Store Dashboard"}</span>
            <span className={`material-symbols-outlined ${styles.externalIcon}`}>open_in_new</span>
          </Link>
          
          <Link href={isSecurity ? "/audit" : "/orders"} className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {isSecurity ? "history_edu" : "receipt_long"}
            </span>
            <span className={styles.label}>{isSecurity ? "System Audit Logs" : "Manage Orders"}</span>
          </Link>
          
          <Link href={isSecurity ? "/soc/dashboard" : "/analytics"} className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {isSecurity ? "security" : "bar_chart"}
            </span>
            <span className={styles.label}>{isSecurity ? "Security Dashboard" : "Analytics"}</span>
          </Link>
          
          <Link href={isSecurity ? "/rbac" : "/settings/staff"} className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {isSecurity ? "admin_panel_settings" : "group"}
            </span>
            <span className={styles.label}>{isSecurity ? "RBAC Settings" : "Staff Settings"}</span>
          </Link>
        </div>

        <div className={styles.divider}></div>

        {/* Secondary Links */}
        <div className={styles.menuGroup}>
          <Link href="/settings/profile" className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>person</span>
            <span className={styles.label}>Profile Settings</span>
          </Link>
          
          <Link href="/settings/preferences" className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>settings</span>
            <span className={styles.label}>Preferences</span>
          </Link>
          
          <Link href="/settings/password" className={styles.menuItem} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.icon}`}>vpn_key</span>
            <span className={styles.label}>Change Password</span>
          </Link>
        </div>

        <div className={styles.divider}></div>

        {/* Logout */}
        <div className={styles.menuGroup}>
          <button className={styles.logoutItem} onClick={handleLogout}>
            <span className={`material-symbols-outlined ${styles.icon}`}>logout</span>
            <span className={styles.label}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
