"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { GlassPanel } from "./GlassPanel";
import styles from "./SearchOverlay.module.css";

const SCOPES = [
  { id: "all", label: "All", icon: "apps" },
  { id: "orders", label: "Orders", icon: "receipt_long" },
  { id: "users", label: "Users", icon: "person" },
  { id: "products", label: "Products", icon: "inventory_2" },
  { id: "categories", label: "Categories", icon: "category" },
  { id: "threats", label: "Threats", icon: "security" },
  { id: "audit", label: "Audit", icon: "gavel" },
];

const SUGGESTIONS = [
  { label: "Pending orders", value: "pending", scope: "orders" },
  { label: "Payment mismatches", value: "mismatch", scope: "threats" },
  { label: "Blocked accounts", value: "blocked", scope: "users" },
  { label: "Threat spikes", value: "threat", scope: "threats" },
  { label: "Inactive categories", value: "inactive", scope: "categories" },
  { label: "Role changes", value: "role", scope: "audit" },
];

const scopeLabelById = new Map(SCOPES.map((scope) => [scope.id, scope.label]));
const scopeByPath = [
  { match: "/orders", scope: "orders" },
  { match: "/users", scope: "users" },
  { match: "/products", scope: "products" },
  { match: "/categories", scope: "categories" },
  { match: "/threat", scope: "threats" },
  { match: "/monitoring", scope: "threats" },
  { match: "/incidents", scope: "threats" },
  { match: "/audit", scope: "audit" },
];

const getAllowedScopes = (quickLinks) => {
  const allowed = new Set(["all"]);
  for (const link of quickLinks) {
    // Guard: skip any entry that is undefined/null or lacks an href (defensive
    // against shape changes in the nav data producing sparse arrays).
    if (!link?.href) continue;
    const matched = scopeByPath.find((item) => link.href === item.match || link.href.startsWith(`${item.match}/`));
    if (matched) allowed.add(matched.scope);
  }
  return allowed;
};

export function SearchOverlay({ open, onClose, quickLinks = [], defaultScope = "all" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(defaultScope);
  const allowedScopeIds = useMemo(() => getAllowedScopes(quickLinks), [quickLinks]);
  const visibleScopes = useMemo(() => SCOPES.filter((item) => allowedScopeIds.has(item.id)), [allowedScopeIds]);
  const visibleSuggestions = useMemo(
    () => SUGGESTIONS.filter((item) => allowedScopeIds.has(item.scope)),
    [allowedScopeIds],
  );
  const effectiveDefaultScope = allowedScopeIds.has(defaultScope) ? defaultScope : "all";

  useEffect(() => {
    if (!open) {
      setQuery("");
      setScope(effectiveDefaultScope);
      return undefined;
    }

    setScope(effectiveDefaultScope);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveDefaultScope, onClose, open]);

  const topLinks = useMemo(() => quickLinks.filter(Boolean).slice(0, 8), [quickLinks]);

  const navigateToSearch = (nextQuery = "", nextScope = "all") => {
    const trimmed = nextQuery.trim();
    onClose();
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    if (nextScope && nextScope !== "all") {
      params.set("scope", nextScope);
    }
    if (!params.toString()) {
      router.push("/search");
      return;
    }
    router.push(`/search?${params.toString()}`);
  };

  const submit = () => {
    navigateToSearch(query, scope);
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <GlassPanel className={styles.panel} elevated onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Global search</span>
            <h2>Jump across operator surfaces</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close search overlay">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <label className={styles.searchField} htmlFor="admin-global-search">
          <span className="material-symbols-outlined">manage_search</span>
          <input
            id="admin-global-search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submit();
              }
            }}
            placeholder="Search orders, users, products, categories, threats, or audit actions"
          />
        </label>

        <div className={styles.scopeRow}>
          {visibleScopes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={scope === item.id ? styles.scopeActive : styles.scopeButton}
              onClick={() => setScope(item.id)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <ButtonPrimary type="button" icon="search" onClick={submit}>
            Search admin data
          </ButtonPrimary>
          <ButtonSecondary type="button" icon="close" onClick={onClose}>
            Close
          </ButtonSecondary>
        </div>

        <div className={styles.grid}>
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Suggested prompts</span>
            <div className={styles.chipRow}>
              {visibleSuggestions.map((suggestion) => {
                const effectiveScope = scope === "all" ? suggestion.scope : scope;
                return (
                  <button
                    key={`${suggestion.scope}-${suggestion.value}`}
                    type="button"
                    className={styles.chip}
                    onClick={() => {
                      setQuery(suggestion.value);
                      navigateToSearch(suggestion.value, effectiveScope);
                    }}
                  >
                    <span>{suggestion.label}</span>
                    <small>{scopeLabelById.get(effectiveScope) || "All"}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Quick navigation</span>
            <div className={styles.linkGrid}>
              {topLinks.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className={styles.linkButton}
                  onClick={() => {
                    onClose();
                    router.push(item.href);
                  }}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.summary}</small>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </GlassPanel>
    </div>
  );
}
