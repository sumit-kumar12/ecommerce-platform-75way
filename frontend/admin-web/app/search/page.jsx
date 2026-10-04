"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminRequest } from "../../lib/api";
import styles from "./page.module.css";

const SCOPES = [
  { id: "all", label: "All Results", icon: "grid_view" },
  { id: "users", label: "Users", icon: "group" },
  { id: "orders", label: "Orders", icon: "shopping_cart" },
  { id: "threats", label: "Threat Events", icon: "security" },
];

const RESULT_SECTIONS = [
  { key: "users", label: "Recent Users", icon: "person", tone: styles.usersTone },
  { key: "threats", label: "Active Threats", icon: "warning", tone: styles.threatTone },
  { key: "orders", label: "Recent Orders", icon: "receipt_long", tone: styles.ordersTone },
  { key: "products", label: "Products", icon: "inventory_2", tone: styles.usersTone },
  { key: "categories", label: "Categories", icon: "category", tone: styles.usersTone },
  { key: "audit", label: "Audit Logs", icon: "gavel", tone: styles.usersTone },
];

const validScopes = new Set(["all", "users", "orders", "threats", "products", "categories", "audit"]);

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
};

const buildPrimary = (section, item) => {
  if (section === "users") return item.name || item.email || item.id;
  if (section === "orders") return item.orderNumber || item.id;
  if (section === "products") return item.name || item.id;
  if (section === "categories") return item.name || item.slug || item.id;
  if (section === "threats") return item.eventType || item.id;
  return item.action || item.id;
};

const buildSecondary = (section, item) => {
  if (section === "users") return `${item.email || "--"} • ${item.role || "--"}`;
  if (section === "orders") return `Total: ${item.totalAmount ?? "--"} • ${item.status || "--"}`;
  if (section === "products") return `${item.slug || "--"} • ${item.isActive ? "Active" : "Inactive"}`;
  if (section === "categories") return `${item.parent?.name || "Root category"} • ${item.slug || "--"}`;
  if (section === "threats") return `IP: ${item.ip || "--"} • ${item.severity || "--"}`;
  return `${item.targetType || "--"} • ${item.targetId || "--"}`;
};

const buildMeta = (section, item) => {
  if (section === "users") return item.isActive ? "Active account" : "Inactive account";
  if (section === "orders") return `${item.itemsCount || item.itemCount || "--"} items`;
  if (section === "products") return item.shortDescription || item.id;
  if (section === "categories") return formatDateTime(item.updatedAt);
  if (section === "threats") return formatDateTime(item.createdAt);
  return formatDateTime(item.createdAt);
};

const buildResultHref = (section, item) => {
  const params = new URLSearchParams();
  if (section === "users") {
    if (item?.email || item?.name) params.set("q", item.email || item.name);
    if (item?.id) params.set("selected", item.id);
    return `/users?${params.toString()}`;
  }
  if (section === "orders") {
    if (item?.orderNumber || item?.id) params.set("q", item.orderNumber || item.id);
    if (item?.id) params.set("selected", item.id);
    return `/orders?${params.toString()}`;
  }
  if (section === "products") {
    if (item?.name || item?.slug) params.set("q", item.name || item.slug);
    if (item?.id) params.set("selected", item.id);
    return `/products?${params.toString()}`;
  }
  if (section === "categories") {
    if (item?.name || item?.slug) params.set("q", item.name || item.slug);
    if (item?.id) params.set("selected", item.id);
    return `/categories?${params.toString()}`;
  }
  if (section === "threats") {
    if (item?.ip || item?.eventType) params.set("q", item.ip || item.eventType);
    if (item?.id) params.set("selected", item.id);
    return `/threats?${params.toString()}`;
  }
  if (section === "audit") {
    if (item?.action || item?.targetId || item?.targetType) params.set("q", item.action || item.targetId || item.targetType);
    if (item?.id) params.set("selected", item.id);
    return `/audit?${params.toString()}`;
  }
  return "/search";
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const routeQuery = searchParams.get("q") ?? "";
  const routeScope = validScopes.has(searchParams.get("scope") ?? "") ? searchParams.get("scope") : "all";

  const [query, setQuery] = useState(routeQuery);
  const [scope, setScope] = useState(routeScope);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const syncUrl = useCallback(
    (nextQuery, nextScope) => {
      const params = new URLSearchParams();
      if (String(nextQuery || "").trim()) params.set("q", String(nextQuery).trim());
      if (nextScope && nextScope !== "all") params.set("scope", nextScope);
      const next = params.toString();
      router.replace(next ? `/search?${next}` : "/search", { scroll: false });
    },
    [router],
  );

  const runSearch = useCallback(async (nextQuery, nextScope) => {
    const trimmed = String(nextQuery || "").trim();
    if (!trimmed) {
      setResults(null);
      setMessage("");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams({ q: trimmed, scope: nextScope });
      const payload = await adminRequest(`/search?${params.toString()}`);
      setResults(payload);
    } catch (error) {
      setResults(null);
      setMessage(error.message || "Global search failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setQuery(routeQuery);
    setScope(routeScope);
    if (routeQuery.trim()) {
      void runSearch(routeQuery, routeScope);
    } else {
      setResults(null);
      setMessage("");
    }
  }, [routeQuery, routeScope, runSearch]);

  const sectionSummaries = useMemo(
    () =>
      RESULT_SECTIONS.map((section) => ({
        ...section,
        items: Array.isArray(results?.[section.key]) ? results[section.key] : [],
      })).filter((section) => section.items.length > 0),
    [results],
  );

  const totalHits = sectionSummaries.reduce((sum, section) => sum + section.items.length, 0);

  return (
    <div className={styles.page}>
      <div className={styles.overlay}>
        <div className={styles.searchContainer}>
          <div className={styles.header}>
            <div className={styles.searchBar}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>{loading ? "progress_activity" : "search"}</span>
              <input
                ref={inputRef}
                className={styles.searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") syncUrl(query, scope);
                }}
                placeholder="Search users, orders, or threats..."
              />
              <button type="button" className={styles.escapeChip} onClick={() => router.push("/")}>ESC</button>
            </div>

            <div className={styles.scopeRow}>
              {SCOPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={scope === item.id ? styles.scopeActive : styles.scopeButton}
                  onClick={() => {
                    setScope(item.id);
                    syncUrl(query, item.id);
                  }}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.body}>
            {message ? <div className={styles.message}>{message}</div> : null}

            {!results ? (
              <div className={styles.emptyState}>
                <span className="material-symbols-outlined">travel_explore</span>
                <p>Search users, orders, products, threats, and audit records from one operator surface.</p>
              </div>
            ) : (
              sectionSummaries.map((section) => {
                if (section.key === "users") {
                  return (
                    <section key={section.key} className={styles.sectionBlock}>
                      <h3 className={`${styles.sectionHeading} ${section.tone}`}>
                        <span className="material-symbols-outlined">{section.icon}</span>
                        {section.label}
                      </h3>
                      <div className={styles.userGrid}>
                        {section.items.map((item) => (
                          <Link key={item.id} href={buildResultHref(section.key, item)} className={styles.userCard}>
                            <div className={styles.avatarCircle}>{(item.name || item.email || "U").slice(0, 1).toUpperCase()}</div>
                            <div className={styles.userBody}>
                              <strong>{buildPrimary(section.key, item)}</strong>
                              <p>{buildSecondary(section.key, item)}</p>
                            </div>
                            <span className={`material-symbols-outlined ${styles.chevron}`}>chevron_right</span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  );
                }

                if (section.key === "threats") {
                  return (
                    <section key={section.key} className={styles.sectionBlock}>
                      <h3 className={`${styles.sectionHeading} ${section.tone}`}>
                        <span className="material-symbols-outlined">{section.icon}</span>
                        {section.label}
                      </h3>
                      <div className={styles.alertList}>
                        {section.items.map((item) => (
                          <Link key={item.id} href={buildResultHref(section.key, item)} className={styles.alertCard}>
                            <div className={styles.alertIcon}>
                              <span className="material-symbols-outlined">{String(item.severity).toUpperCase() === "CRITICAL" ? "gpp_maybe" : "public"}</span>
                            </div>
                            <div className={styles.alertBody}>
                              <div className={styles.alertHead}>
                                <strong>{buildPrimary(section.key, item)}</strong>
                                <span className={String(item.severity).toUpperCase() === "CRITICAL" ? styles.priorityHigh : styles.priorityMedium}>
                                  {String(item.severity || "INFO").toUpperCase()}
                                </span>
                              </div>
                              <p>{buildSecondary(section.key, item)}</p>
                              <small>{buildMeta(section.key, item)}</small>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  );
                }

                return (
                  <section key={section.key} className={styles.sectionBlock}>
                    <h3 className={`${styles.sectionHeading} ${section.tone}`}>
                      <span className="material-symbols-outlined">{section.icon}</span>
                      {section.label}
                    </h3>
                    <div className={styles.rowList}>
                      {section.items.map((item) => (
                        <Link key={item.id} href={buildResultHref(section.key, item)} className={styles.resultRow}>
                          <div className={styles.rowIdentity}>
                            <span className={`material-symbols-outlined ${styles.rowIcon}`}>{section.key === "orders" ? "package" : section.icon}</span>
                            <div>
                              <strong>{buildPrimary(section.key, item)}</strong>
                              <p>{buildSecondary(section.key, item)}</p>
                            </div>
                          </div>
                          <div className={styles.rowMeta}>
                            <small>{buildMeta(section.key, item)}</small>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.footerKeys}>
              <span><span className="material-symbols-outlined">keyboard_arrow_up</span><span className="material-symbols-outlined">keyboard_arrow_down</span> Navigate</span>
              <span><span className="material-symbols-outlined">keyboard_return</span> Select</span>
            </div>
            <div className={styles.footerMeta}>Showing <strong>{totalHits}</strong> results</div>
          </div>
        </div>
      </div>
    </div>
  );
}
