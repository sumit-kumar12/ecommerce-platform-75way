"use client";

import { createElement, useEffect, useState } from "react";

// ─── cx: classname joiner ─────────────────────────────────────────────────────
export function cx(...values) {
  return values.filter(Boolean).join(" ");
}

// ─── escapeRegExp ─────────────────────────────────────────────────────────────
export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── highlightText: wraps query matches in <mark> ────────────────────────────
export function highlightText(text, query) {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const safeQuery = escapeRegExp(trimmed);
  const matcher = new RegExp(safeQuery, "ig");
  const pieces = [];
  let lastIndex = 0;
  let match;

  while ((match = matcher.exec(text))) {
    if (match.index > lastIndex) {
      pieces.push(text.slice(lastIndex, match.index));
    }
    pieces.push(
      createElement(
        "mark",
        {
          key: `${match.index}-${match[0]}`,
          className:
            "rounded bg-amber-300/20 px-0.5 text-amber-200 dark:bg-amber-400/20 dark:text-amber-100",
        },
        match[0],
      ),
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    pieces.push(text.slice(lastIndex));
  }

  return pieces;
}

// ─── usePersistentState: useState backed by localStorage ────────────────────
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw));
      }
    } catch {
      // Ignore malformed or unavailable storage.
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage failures.
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}

// ─── useResolvedTheme: system → actual light/dark ────────────────────────────
export function useResolvedTheme(theme) {
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return theme === "system" ? (systemDark ? "dark" : "light") : theme;
}

// ─── isNodeAllowed: role + permission guard ───────────────────────────────────
export function isNodeAllowed(node, role, permissions) {
  const roleAllowed = !node.roles || node.roles.includes(role);
  const permissionAllowed =
    !node.permissions || node.permissions.some((p) => permissions.has(p));
  return roleAllowed && permissionAllowed;
}

// ─── matchesNode: fuzzy search ────────────────────────────────────────────────
export function matchesNode(node, query) {
  if (!query) return true;

  const haystack = [node.label, node.description, node.href, ...(node.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

// ─── filterNodes: filter tree by query + role + permissions ──────────────────
export function filterNodes(nodes, query, role, permissions) {
  const filtered = [];

  for (const node of nodes) {
    if (!isNodeAllowed(node, role, permissions)) continue;

    const childNodes = node.children ? filterNodes(node.children, query, role, permissions) : undefined;
    const selfMatches = matchesNode(node, query);

    if (!query || selfMatches || (childNodes?.length ?? 0) > 0) {
      filtered.push({
        ...node,
        children: childNodes?.length ? childNodes : undefined,
      });
    }
  }

  return filtered;
}

// ─── flattenNodes ─────────────────────────────────────────────────────────────
export function flattenNodes(nodes, ancestry = []) {
  const flat = [];

  for (const node of nodes) {
    flat.push({ node, ancestry });
    if (node.children?.length) {
      flat.push(...flattenNodes(node.children, [...ancestry, node.label]));
    }
  }

  return flat;
}

// ─── pathMatches ─────────────────────────────────────────────────────────────
export function pathMatches(activePath, href, exact) {
  if (!href) return false;
  if (exact) return activePath === href;
  if (activePath === href) return true;
  return activePath.startsWith(`${href}/`);
}

// ─── findNodeById ─────────────────────────────────────────────────────────────
export function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const match = findNodeById(node.children, id);
      if (match) return match;
    }
  }
  return null;
}

// ─── findActiveNode ───────────────────────────────────────────────────────────
export function findActiveNode(nodes, activePath) {
  for (const node of nodes) {
    if (pathMatches(activePath, node.href, node.exact)) {
      return node;
    }
    if (node.children?.length) {
      const child = findActiveNode(node.children, activePath);
      if (child) return child;
    }
  }
  return null;
}

// ─── collectAncestorIds ───────────────────────────────────────────────────────
export function collectAncestorIds(nodes, activePath) {
  const ids = new Set();

  function walk(items, chain) {
    for (const item of items) {
      const nextChain = [...chain, item.id];
      const selfMatches = pathMatches(activePath, item.href, item.exact);
      const childMatches = item.children ? walk(item.children, nextChain) : false;

      if (childMatches) {
        for (const id of chain) ids.add(id);
        ids.add(item.id);
      }

      if (selfMatches || childMatches) {
        return true;
      }
    }
    return false;
  }

  walk(nodes, []);
  return ids;
}

// ─── findFirstFocusable ───────────────────────────────────────────────────────
export function findFirstFocusable(container) {
  if (!container) return null;
  const items = Array.from(
    container.querySelectorAll('[data-sidebar-focusable="true"]'),
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
  return items[0] ?? null;
}
