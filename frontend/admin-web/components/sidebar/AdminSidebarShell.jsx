"use client";

/**
 * AdminSidebarShell.jsx
 * ---------------------
 * The premium sidebar component for Katabazaar Admin.
 * Converted from sidebar-shell.tsx (TypeScript → plain JSX).
 *
 * Features:
 *  • Desktop collapse/expand (persistent)
 *  • Mobile slide-in drawer
 *  • Panel switcher (Commerce / Security) via workspace switcher UI
 *  • Inline search with keyboard shortcut (Ctrl+K)
 *  • Favorites (star pinning)
 *  • Recently & frequently used items
 *  • Group expand/collapse (persistent)
 *  • Light / dark / system theme toggle (writes to html.dark globally)
 *  • User profile + logout
 *  • Keyboard navigation (↑ ↓ Home End)
 *  • Flyout menu in collapsed mode
 */

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Grid2x2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Command,
  Menu,
  Moon,
  Pin,
  Search,
  Star,
  Sun,
  X,
} from "lucide-react";

import { STORAGE_KEYS, WORKSPACES, getSectionsForWorkspace } from "./sidebar-config";
import {
  collectAncestorIds,
  cx,
  filterNodes,
  findActiveNode,
  findNodeById,
  highlightText,
  isNodeAllowed,
  pathMatches,
  usePersistentState,
  useResolvedTheme,
} from "./sidebar-utils";

const shortcutHint = "Ctrl K";

// ─── NotificationBadge ───────────────────────────────────────────────────────
const NotificationBadge = memo(function NotificationBadge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <motion.span
      initial={false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 30 }}
      className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/20"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
});

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const Tooltip = memo(function Tooltip({ children, content, open = false }) {
  return (
    <span className="relative inline-flex">
      {children}
      <AnimatePresence>
        {open ? (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.14 }}
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-slate-200/80 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-2xl shadow-slate-950/25 dark:border-slate-800 dark:bg-slate-50 dark:text-slate-950"
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
});

// ─── FavoriteButton ───────────────────────────────────────────────────────────
const FavoriteButton = memo(function FavoriteButton({ active, onToggle, label, compact }) {
  return (
    <Tooltip content={active ? "Remove favorite" : "Pin to favorites"} open={compact}>
      <button
        type="button"
        aria-label={active ? `Remove ${label} from favorites` : `Pin ${label} to favorites`}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={cx(
          "inline-flex items-center justify-center rounded-lg border transition",
          active
            ? "border-amber-400/30 bg-amber-400/15 text-amber-200"
            : "border-transparent bg-transparent text-slate-400 hover:border-slate-200/40 hover:bg-slate-100/70 hover:text-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-slate-200",
          compact ? "h-8 w-8" : "h-7 w-7",
        )}
      >
        <Star className={cx("h-3.5 w-3.5", active && "fill-current")} />
      </button>
    </Tooltip>
  );
});

// ─── ThemeToggle ──────────────────────────────────────────────────────────────
const ThemeToggle = memo(function ThemeToggle({ theme, resolvedTheme, onToggle, compact }) {
  const Icon = theme === "system" ? Command : resolvedTheme === "dark" ? Moon : Sun;
  const label =
    theme === "system" ? "System theme" : resolvedTheme === "dark" ? "Dark theme" : "Light theme";

  return (
    <button
      type="button"
      data-sidebar-focusable="true"
      onClick={onToggle}
      title="Theme"
      aria-label={`Theme toggle. Current: ${label}`}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition",
        "border-slate-200/80 bg-white/80 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-slate-700",
        compact && "h-9 w-9 justify-center gap-0 px-0",
      )}
    >
      <Icon className="h-4 w-4" />
      {!compact ? <span className="truncate">{label}</span> : null}
    </button>
  );
});

// ─── WorkspaceSwitcher (Panel Switcher) ───────────────────────────────────────
const WorkspaceSwitcher = memo(function WorkspaceSwitcher({
  workspaces,
  currentWorkspaceId,
  onChange,
  compact,
}) {
  const [open, setOpen] = useState(false);
  const current = workspaces.find((w) => w.id === currentWorkspaceId) ?? workspaces[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!e.target?.closest?.("[data-workspace-switcher]")) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div data-workspace-switcher className="relative">
      <button
        type="button"
        data-sidebar-focusable="true"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Switch panel"
        title="Switch panel"
        className={cx(
          "group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
          "border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
          compact && "justify-center px-0",
        )}
      >
        <span
          className={cx(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
            current.accent,
          )}
        >
          <CurrentIcon className="h-5 w-5" />
        </span>
        {!compact ? (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
              {current.label}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
              {current.description}
            </span>
          </span>
        ) : null}
        {!compact ? (
          <ChevronDown className={cx("h-4 w-4 text-slate-400 transition", open && "rotate-180")} />
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Admin Panel
            </div>
            <div className="p-2">
              {workspaces.map((workspace) => {
                const selected = workspace.id === currentWorkspaceId;
                const WIcon = workspace.icon;
                return (
                  <button
                    key={workspace.id}
                    type="button"
                    data-sidebar-focusable="true"
                    onClick={() => { onChange(workspace.id); setOpen(false); }}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                      selected
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
                    )}
                  >
                    <span
                      className={cx(
                        "inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg",
                        workspace.accent,
                      )}
                    >
                      <WIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{workspace.label}</span>
                      <span
                        className={cx(
                          "block truncate text-xs",
                          selected ? "text-white/70 dark:text-slate-500" : "text-slate-500",
                        )}
                      >
                        {workspace.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

// ─── SearchBox ────────────────────────────────────────────────────────────────
const SearchBox = memo(function SearchBox({ value, onChange, onOpen, onClear, compact }) {
  return compact ? (
    <button
      type="button"
      data-sidebar-focusable="true"
      onClick={onOpen}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-slate-700"
      aria-label="Open search"
      title={`Search (${shortcutHint})`}
    >
      <Search className="h-4 w-4" />
    </button>
  ) : (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onOpen}
        placeholder="Search navigation"
        aria-label="Search navigation"
        className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/90 pl-10 pr-24 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-sm focus:border-slate-300 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-700"
      />
      <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-7 items-center rounded-lg border border-slate-200/80 bg-slate-100 px-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear
          </button>
        ) : null}
        <span className="hidden items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 md:inline-flex">
          <Command className="h-3 w-3" />
          {shortcutHint}
        </span>
      </div>
    </div>
  );
});

// ─── UserProfile ──────────────────────────────────────────────────────────────
const UserProfile = memo(function UserProfile({ name, role, avatarUrl, onLogout, compact }) {
  const initials = name
    ? name.split(" ").map((p) => p.slice(0, 1)).join("").slice(0, 2)
    : "AM";

  return (
    <div
      className={cx(
        "rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70",
        compact && "p-2",
      )}
    >
      <div className={cx("flex items-center gap-3", compact && "justify-center")}>
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 dark:from-white dark:via-slate-300 dark:to-slate-500 dark:text-slate-950">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
        </div>
        {!compact ? (
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{name}</div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">{role}</div>
          </div>
        ) : null}
      </div>
      {!compact ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            data-sidebar-focusable="true"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Profile
          </button>
          <button
            type="button"
            data-sidebar-focusable="true"
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-500/15 dark:text-rose-300"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
});

// ─── SidebarHeader ────────────────────────────────────────────────────────────
const SidebarHeader = memo(function SidebarHeader({
  brandName,
  collapsed,
  onToggleCollapsed,
  onCloseMobile,
  compact,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className={cx("flex items-center gap-3", collapsed && !compact && "justify-center")}>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-700 to-violet-900 text-sm font-bold text-white shadow-lg shadow-violet-950/40">
          K
        </div>
        {!collapsed || compact ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
              {brandName}
            </div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
              Enterprise commerce control
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {onCloseMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        {onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 lg:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cx("h-4 w-4 transition", collapsed && "rotate-180")} />
          </button>
        ) : null}
      </div>
    </div>
  );
});

// ─── SidebarFooter ────────────────────────────────────────────────────────────
const SidebarFooter = memo(function SidebarFooter({
  userName, userRole, userAvatarUrl, onLogout, theme, resolvedTheme, onToggleTheme, compact,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <ThemeToggle theme={theme} resolvedTheme={resolvedTheme} onToggle={onToggleTheme} compact={compact} />
      </div>
      <UserProfile name={userName} role={userRole} avatarUrl={userAvatarUrl} onLogout={onLogout} compact={compact} />
    </div>
  );
});

// ─── SidebarItem ─────────────────────────────────────────────────────────────
const SidebarItem = memo(function SidebarItem({ node, depth, context }) {
  const Icon = node.icon ?? Grid2x2;
  const active = pathMatches(context.activePath, node.href, node.exact);
  const favorite = context.isFavorite(node.id);
  const indent = context.compact ? 0 : Math.min(depth * 14, 28);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const body = (
    <>
      <span
        className={cx(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition",
          active
            ? "border-violet-400/30 bg-violet-500/12 text-violet-400"
            : "border-transparent bg-slate-800/60 text-slate-400 group-hover:bg-slate-700/60 group-hover:text-slate-200",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      {!context.compact ? (
        <span className="min-w-0 flex-1 text-left">
          <span className="flex items-center gap-2">
            <span className="truncate text-[13px] font-medium text-slate-300 group-hover:text-slate-100">
              {highlightText(node.label, context.searchQuery)}
            </span>
            <NotificationBadge count={node.badge} />
          </span>
          {node.description ? (
            <span className="mt-0.5 block max-h-0 overflow-hidden truncate text-xs text-slate-500 opacity-0 transition-all duration-200 group-hover:max-h-8 group-hover:opacity-100">
              {highlightText(node.description, context.searchQuery)}
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  if (context.compact) {
    return (
      <Tooltip content={node.label} open={tooltipOpen}>
        <button
          type="button"
          data-sidebar-focusable="true"
          onClick={() => context.onNavigate(node)}
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          onFocus={() => setTooltipOpen(true)}
          onBlur={() => setTooltipOpen(false)}
          className={cx(
            "group relative flex h-14 w-14 items-center justify-center rounded-2xl border transition",
            active
              ? "border-violet-400/30 bg-violet-500/12 text-violet-400 shadow-lg shadow-violet-500/10"
              : "border-transparent bg-slate-900/70 text-slate-400 shadow-sm hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200",
          )}
          aria-current={active ? "page" : undefined}
          style={{ marginLeft: indent }}
        >
          {body}
        </button>
      </Tooltip>
    );
  }

  return (
    <div style={{ marginLeft: indent }} className="group flex items-start gap-1.5 rounded-2xl">
      <button
        type="button"
        data-sidebar-focusable="true"
        onClick={() => context.onNavigate(node)}
        className={cx(
          "group flex min-w-0 flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-150",
          active
            ? "border-violet-400/20 bg-violet-500/10 shadow-sm shadow-violet-500/10"
            : "border-transparent bg-transparent hover:border-slate-700/60 hover:bg-slate-800/50",
        )}
        aria-current={active ? "page" : undefined}
      >
        {body}
      </button>
      <div className="pt-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <FavoriteButton
          active={favorite}
          onToggle={() => context.onToggleFavorite(node.id)}
          label={node.label}
        />
      </div>
    </div>
  );
});

// ─── SidebarGroup ─────────────────────────────────────────────────────────────
const SidebarGroup = memo(function SidebarGroup({ node, depth, context }) {
  const Icon = node.icon ?? Grid2x2;
  const open = context.isGroupOpen(node.id);
  const active = Boolean(node.href && pathMatches(context.activePath, node.href, node.exact));
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div
      className="relative rounded-xl"
      style={{ marginLeft: context.compact ? depth * 0 : Math.min(depth * 14, 28) }}
    >
      <div className="flex items-start gap-1.5">
        <Tooltip content={node.label} open={context.compact && tooltipOpen}>
          <button
            type="button"
            data-sidebar-focusable="true"
            onClick={() => context.onToggleGroup(node.id)}
            onMouseEnter={(e) => {
              if (context.compact && !context.searchQuery.trim()) {
                context.onOpenFlyout(node, e.currentTarget.getBoundingClientRect());
              }
              if (context.compact) setTooltipOpen(true);
            }}
            onFocus={(e) => {
              if (context.compact && !context.searchQuery.trim()) {
                context.onOpenFlyout(node, e.currentTarget.getBoundingClientRect());
              }
              if (context.compact) setTooltipOpen(true);
            }}
            onMouseLeave={() => {
              if (context.compact && !context.searchQuery.trim()) context.onCloseFlyout();
              if (context.compact) setTooltipOpen(false);
            }}
            onBlur={() => { if (context.compact) setTooltipOpen(false); }}
            aria-expanded={open}
            className={cx(
              "group flex min-w-0 flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-150",
              active || open
                ? "border-violet-400/20 bg-violet-500/10 shadow-sm shadow-violet-500/10"
                : "border-transparent bg-transparent hover:border-slate-700/60 hover:bg-slate-800/50",
              context.compact && "h-14 w-14 justify-center p-0",
            )}
          >
            <span
              className={cx(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition",
                active || open
                  ? "border-violet-400/30 bg-violet-500/12 text-violet-400"
                  : "border-transparent bg-slate-800/60 text-slate-400 group-hover:bg-slate-700/60 group-hover:text-slate-200",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>

            {!context.compact ? (
              <>
                <span className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-slate-300 group-hover:text-slate-100">
                      {highlightText(node.label, context.searchQuery)}
                    </span>
                    <NotificationBadge count={node.badge} />
                  </span>
                </span>
                <ChevronRight className={cx("h-3.5 w-3.5 text-slate-500 transition-transform duration-200", open && "rotate-90")} />
              </>
            ) : (
              <ChevronRight className="absolute bottom-1 right-1 h-3.5 w-3.5 text-current opacity-70" />
            )}
          </button>
        </Tooltip>
        {!context.compact ? (
          <div className="pt-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <FavoriteButton
              active={context.isFavorite(node.id)}
              onToggle={() => context.onToggleFavorite(node.id)}
              label={node.label}
            />
          </div>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {open && !context.compact ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-700/50 pl-3 pb-1">
              {node.children?.map((child) =>
                child.children?.length ? (
                  <SidebarGroup key={child.id} node={child} depth={depth + 1} context={context} />
                ) : (
                  <SidebarItem key={child.id} node={child} depth={depth + 1} context={context} />
                ),
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

// ─── RecentSection ───────────────────────────────────────────────────────────
const RecentSection = memo(function RecentSection({ title, icon: Icon, items, context }) {
  if (!items.length || context.compact) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map((node) =>
          node.children?.length ? (
            <SidebarGroup key={node.id} node={node} depth={0} context={context} />
          ) : (
            <SidebarItem key={node.id} node={node} depth={0} context={context} />
          ),
        )}
      </div>
    </div>
  );
});

// ─── SidebarSectionView ───────────────────────────────────────────────────────
// Accordion section: closed by default, expands on hover or click.
// Only one section open at a time (accordion mode via context.onToggleSection).
const SidebarSectionView = memo(function SidebarSectionView({ section, context }) {
  const visibleItems = context.searchQuery
    ? filterNodes(section.items, context.searchQuery, context.role, context.permissions)
    : section.items.filter((node) => isNodeAllowed(node, context.role, context.permissions));

  if (!visibleItems.length) return null;

  // Section open state: use isSectionOpen from context (handles active-route auto-open + accordion)
  const open = context.isSectionOpen(section.id);
  const isActiveSection = context.activeSectionId === section.id;

  if (context.compact) {
    // In compact/icon mode, render items directly (no accordion header needed)
    return (
      <div className="space-y-1">
        {visibleItems.map((node) =>
          node.children?.length ? (
            <SidebarGroup key={node.id} node={node} depth={0} context={context} />
          ) : (
            <SidebarItem key={node.id} node={node} depth={0} context={context} />
          ),
        )}
      </div>
    );
  }

  return (
    <section>
      {/* ── Section header (accordion toggle) ── */}
      <button
        type="button"
        data-sidebar-focusable="true"
        aria-expanded={open}
        onClick={() => context.onToggleSection(section.id)}
        onMouseEnter={() => {
          // Hover opens the section if it is currently closed
          if (!open) context.onToggleSection(section.id);
        }}
        className={cx(
          "group flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-all duration-150",
          open
            ? "text-violet-300"
            : "text-slate-500 hover:text-slate-300",
        )}
      >
        {/* Left accent bar */}
        <span
          className={cx(
            "h-3.5 w-0.5 rounded-full transition-all duration-200",
            open || isActiveSection ? "bg-violet-400" : "bg-slate-700 group-hover:bg-slate-500",
          )}
        />

        {/* Section label */}
        <span className="flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.15em]">
          {section.label}
        </span>

        {/* Item count */}
        <span
          className={cx(
            "text-[10px] font-medium tabular-nums transition-colors",
            open ? "text-violet-400/60" : "text-slate-600 group-hover:text-slate-500",
          )}
        >
          {visibleItems.length}
        </span>

        {/* Chevron */}
        <ChevronRight
          className={cx(
            "h-3 w-3 transition-transform duration-200",
            open ? "rotate-90 text-violet-400" : "text-slate-600 group-hover:text-slate-400",
          )}
        />
      </button>

      {/* ── Section body (animated) ── */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key={section.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-1 pt-0.5">
              {visibleItems.map((node) =>
                node.children?.length ? (
                  <SidebarGroup key={node.id} node={node} depth={0} context={context} />
                ) : (
                  <SidebarItem key={node.id} node={node} depth={0} context={context} />
                ),
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
});

// ─── FlyoutMenu ──────────────────────────────────────────────────────────────
const FlyoutMenu = memo(function FlyoutMenu({ node, rect, context }) {
  if (!node.children?.length) return null;

  const Icon = node.icon ?? Grid2x2;
  const viewportWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
  const left = Math.min(rect.right + 14, viewportWidth - 320);
  const top = Math.min(rect.top, viewportHeight - 420);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -6, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -6, scale: 0.98 }}
      transition={{ duration: 0.14 }}
      style={{ left, top }}
      className="fixed z-50 w-72 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
      onMouseEnter={() => context.onOpenFlyout(node, rect)}
      onMouseLeave={context.onCloseFlyout}
    >
      <div className="mb-2 rounded-2xl bg-slate-950 px-3 py-2 text-white dark:bg-slate-100 dark:text-slate-950">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="h-4 w-4" />
          {node.label}
        </div>
        {node.description ? (
          <div className="mt-1 text-xs text-white/70 dark:text-slate-500">{node.description}</div>
        ) : null}
      </div>
      <div className="space-y-1">
        {node.children.map((child) =>
          child.children?.length ? (
            <div
              key={child.id}
              className="rounded-2xl border border-slate-200/80 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <SidebarGroup node={child} depth={0} context={context} />
            </div>
          ) : (
            <SidebarItem key={child.id} node={child} depth={0} context={context} />
          ),
        )}
      </div>
    </motion.aside>
  );
});

// ─── MobileDrawer ─────────────────────────────────────────────────────────────
const MobileDrawer = memo(function MobileDrawer({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label="Close drawer backdrop"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="relative flex h-full w-[min(88vw,22rem)] flex-col border-r border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
          >
            {children}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});

// ─── collectGroupIds ──────────────────────────────────────────────────────────
function collectGroupIds(nodes, ids = new Set()) {
  for (const node of nodes) {
    if (node.children?.length) {
      ids.add(node.id);
      collectGroupIds(node.children, ids);
    }
  }
  return ids;
}

// ─── SidebarContent ───────────────────────────────────────────────────────────
function SidebarContent({
  brandName, userName, userRole, userAvatarUrl, onLogout,
  compact, workspaceId, setWorkspaceId, theme, resolvedTheme,
  onToggleTheme, searchQuery, setSearchQuery, searchOpen, setSearchOpen,
  favorites, setFavorites, recentEntries, setRecentEntries,
  expandedGroups, setExpandedGroups, activePath, setActivePath,
  onNavigate, onToggleCollapsed, permissions, flyoutNode,
  flyoutRect, setFlyout, showHeader,
}) {
  const navRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Load sections for the current workspace/panel
  const currentSections = useMemo(() => getSectionsForWorkspace(workspaceId), [workspaceId]);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  const visibleSections = useMemo(
    () =>
      currentSections
        .map((section) => ({
          ...section,
          items: filterNodes(section.items, "", userRole, permissionSet),
        }))
        .filter((section) => section.items.length > 0),
    [currentSections, permissionSet, userRole],
  );

  const accessibleRoots = useMemo(
    () => visibleSections.flatMap((section) => section.items),
    [visibleSections],
  );

  const filteredSections = useMemo(
    () =>
      currentSections
        .map((section) => ({
          ...section,
          items: filterNodes(section.items, searchQuery, userRole, permissionSet),
        }))
        .filter((section) => section.items.length > 0),
    [currentSections, permissionSet, searchQuery, userRole],
  );

  const activeNode = useMemo(
    () => findActiveNode(accessibleRoots, activePath),
    [activePath, accessibleRoots],
  );

  const ancestorIds = useMemo(
    () => collectAncestorIds(accessibleRoots, activePath),
    [accessibleRoots, activePath],
  );

  const recentForWorkspace = useMemo(
    () =>
      recentEntries
        .filter((e) => e.workspaceId === workspaceId)
        .sort((a, b) => b.visitedAt - a.visitedAt)
        .slice(0, 5),
    [recentEntries, workspaceId],
  );

  const recentNodes = useMemo(
    () =>
      recentForWorkspace
        .map((e) => findNodeById(accessibleRoots, e.id))
        .filter(Boolean),
    [accessibleRoots, recentForWorkspace],
  );

  const frequentNodes = useMemo(() => {
    const counts = recentEntries
      .filter((e) => e.workspaceId === workspaceId)
      .sort((a, b) => b.count - a.count || b.visitedAt - a.visitedAt)
      .slice(0, 5);
    return counts.map((e) => findNodeById(accessibleRoots, e.id)).filter(Boolean);
  }, [accessibleRoots, recentEntries, workspaceId]);

  const favoriteNodes = useMemo(
    () => favorites.map((id) => findNodeById(accessibleRoots, id)).filter(Boolean),
    [accessibleRoots, favorites],
  );

  // ─── Which section contains the currently active page ────────────────────────
  const activeSectionId = useMemo(() => {
    for (const section of currentSections) {
      const found = findActiveNode(
        filterNodes(section.items, "", userRole, permissionSet),
        activePath,
      );
      if (found) return section.id;
    }
    return null;
  }, [currentSections, activePath, userRole, permissionSet]);

  // ─── All section IDs (used for accordion close-others logic) ─────────────────
  const allSectionIds = useMemo(
    () => new Set(currentSections.map((s) => s.id)),
    [currentSections],
  );

  const openGroups = useMemo(() => {
    const next = new Set();
    Object.entries(expandedGroups).forEach(([id, isOpen]) => {
      if (isOpen) next.add(id);
    });
    ancestorIds.forEach((id) => next.add(id));
    if (searchQuery.trim()) {
      // During search: force-open all sections and all groups
      currentSections.forEach((section) => next.add(section.id));
      filteredSections.forEach((section) => {
        collectGroupIds(section.items, next);
      });
    }
    return next;
  }, [ancestorIds, expandedGroups, filteredSections, searchQuery, currentSections]);

  const canAccess = (node) => isNodeAllowed(node, userRole, permissionSet);
  const isFavorite = (id) => favoriteSet.has(id);
  const isGroupOpen = (id) => openGroups.has(id);

  // isSectionOpen: section is open if in expandedGroups OR it contains the active route
  //               OR search is active (all sections forced open)
  const isSectionOpen = (id) => {
    if (searchQuery.trim()) return true;
    if (id === activeSectionId) return true;
    return Boolean(expandedGroups[id]);
  };

  // onToggleSection: accordion — opening one section closes all others
  const onToggleSection = (sectionId) => {
    // Active section stays open (cannot be collapsed)
    if (sectionId === activeSectionId) return;
    setExpandedGroups((current) => {
      const wasOpen = Boolean(current[sectionId]);
      const next = { ...current };
      // Close all sibling sections (accordion)
      allSectionIds.forEach((id) => {
        if (id !== activeSectionId) next[id] = false;
      });
      // Toggle clicked section (open if was closed, leave closed if was open)
      if (!wasOpen) next[sectionId] = true;
      return next;
    });
  };

  const updateRecent = (node) => {
    setRecentEntries((current) => {
      const now = Date.now();
      const existing = current.find((e) => e.id === node.id && e.workspaceId === workspaceId);
      if (existing) {
        return current
          .map((e) =>
            e.id === node.id && e.workspaceId === workspaceId
              ? { ...e, visitedAt: now, count: e.count + 1 }
              : e,
          )
          .sort((a, b) => b.visitedAt - a.visitedAt);
      }
      return [{ id: node.id, workspaceId, visitedAt: now, count: 1 }, ...current].slice(0, 50);
    });
  };

  const navigate = (node) => {
    if (node.children?.length && !node.href) {
      setExpandedGroups((current) => ({ ...current, [node.id]: !current[node.id] }));
      return;
    }
    const nextPath = node.href ?? `/${node.id}`;
    setActivePath(nextPath);
    updateRecent(node);
    setSearchOpen(false);
    setSearchQuery("");
    if (onNavigate && node.href) {
      onNavigate(node.href, node);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(true);
        requestAnimationFrame(() => {
          const input = navRef.current?.querySelector('input[aria-label="Search navigation"]');
          input?.focus();
          input?.select?.();
        });
        return;
      }

      if (e.key === "Escape") {
        if (searchOpen || flyoutNode) {
          e.preventDefault();
          setSearchOpen(false);
          setFlyout(null, null);
          return;
        }
      }

      if (typing || !navRef.current) return;
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;

      const focusable = Array.from(
        navRef.current.querySelectorAll('[data-sidebar-focusable="true"]'),
      ).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;

      const currentIndex = focusable.findIndex((el) => el === document.activeElement);
      let nextIndex = currentIndex;
      if (e.key === "ArrowDown") nextIndex = Math.min(focusable.length - 1, currentIndex + 1);
      if (e.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - 1);
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = focusable.length - 1;

      if (nextIndex >= 0) {
        e.preventDefault();
        focusable[nextIndex]?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [flyoutNode, searchOpen, setFlyout, setSearchOpen]);

  useEffect(() => {
    if (!searchOpen || compact) return;
    requestAnimationFrame(() => {
      const input = navRef.current?.querySelector('input[aria-label="Search navigation"]');
      input?.focus();
      input?.select?.();
    });
  }, [compact, searchOpen]);

  // Global theme — writes to html.dark so Tailwind dark: classes work everywhere
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
    // Also persist to the existing admin-theme key so AdminTopbar/ThemeContext stays in sync
    try { localStorage.setItem("admin-theme", resolvedTheme); } catch { /* noop */ }
  }, [resolvedTheme]);

  const context = {
    activePath,
    activeSectionId,
    allSectionIds,
    compact,
    searchQuery,
    workspaceId,
    openGroups,
    permissions: permissionSet,
    role: userRole,
    favorites: favoriteSet,
    isFavorite,
    isGroupOpen,
    isSectionOpen,
    canAccess,
    onNavigate: navigate,
    onToggleFavorite: (id) => {
      setFavorites((current) =>
        current.includes(id) ? current.filter((f) => f !== id) : [...current, id],
      );
    },
    onToggleGroup: (id) => {
      setExpandedGroups((current) => ({ ...current, [id]: !current[id] }));
    },
    onToggleSection,
    onOpenFlyout: (node, rect) => setFlyout(node, rect),
    onCloseFlyout: () => setFlyout(null, null),
  };

  const showSearchHint = searchOpen || searchQuery.trim().length > 0;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div ref={navRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 pb-4">
        {showHeader ? (
          <SidebarHeader
            brandName={brandName}
            collapsed={compact}
            onToggleCollapsed={onToggleCollapsed}
            compact={false}
          />
        ) : null}

        {/* Panel / workspace switcher */}
        <WorkspaceSwitcher
          workspaces={WORKSPACES}
          currentWorkspaceId={workspaceId}
          onChange={setWorkspaceId}
          compact={compact}
        />

        {/* Search */}
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          onOpen={() => {
            if (compact && onToggleCollapsed) onToggleCollapsed();
            setSearchOpen(true);
          }}
          onClear={() => setSearchQuery("")}
          compact={compact}
        />

        {showSearchHint && !compact ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-violet-400/20 bg-violet-500/8 px-3 py-2 text-xs text-violet-300"
          >
            Searching all sections — press Esc to close.
          </motion.div>
        ) : null}

        {/* Favorites / Recents / Frequent */}
        {!searchQuery.trim() && !compact ? (
          <>
            <RecentSection title="Favorites" icon={Star} items={favoriteNodes} context={context} />
            <RecentSection title="Recently Used" icon={Clock3} items={recentNodes} context={context} />
            <RecentSection title="Frequently Used" icon={Pin} items={frequentNodes} context={context} />
          </>
        ) : null}

        {/* Main nav sections — accordion */}
        <div className="space-y-1">
          {(searchQuery.trim() ? filteredSections : visibleSections).map((section) => (
            <SidebarSectionView key={section.id} section={section} context={context} />
          ))}
        </div>
      </div>

      {/* Footer: theme + profile */}
      <div className="border-t border-slate-800/80 p-4">
        <SidebarFooter
          userName={userName}
          userRole={userRole}
          userAvatarUrl={userAvatarUrl}
          onLogout={onLogout}
          theme={theme}
          resolvedTheme={resolvedTheme}
          onToggleTheme={onToggleTheme}
          compact={compact}
        />
      </div>

      <AnimatePresence>
        {flyoutNode && flyoutRect && compact && !searchQuery.trim() ? (
          <FlyoutMenu node={flyoutNode} rect={flyoutRect} context={context} />
        ) : null}
      </AnimatePresence>

      {activeNode ? <span className="sr-only">Active: {activeNode.label}</span> : null}
    </div>
  );
}

// ─── AdminSidebarShell (default export) ──────────────────────────────────────
/**
 * Props:
 *  activePath    — current URL pathname (from usePathname in AdminShell)
 *  activePanel   — "commerce" | "security" — controls initial workspace
 *  onPanelChange — callback when user switches panel via workspace dropdown
 *  className     — extra classes for the <aside>
 *  userName      — display name
 *  userRole      — role string e.g. "Merchant" or "Platform Admin"
 *  userAvatarUrl — optional avatar URL
 *  permissions   — array of permission strings for node filtering
 *  onNavigate    — called with (href) when a nav item is clicked
 *  onLogout      — called when Logout is clicked
 *  brandName     — sidebar brand name
 *  expandedWidth — desktop expanded width in px (default 290)
 *  collapsedWidth — desktop collapsed width in px (default 80)
 */
export default function AdminSidebarShell({
  activePath,
  activePanel = "commerce",
  onPanelChange,
  className,
  userName = "Admin User",
  userRole = "Platform Admin",
  userAvatarUrl,
  permissions = [],
  onNavigate,
  onLogout,
  brandName = "Katabazaar",
  expandedWidth = 290,
  collapsedWidth = 80,
}) {
  const [desktopOpen, setDesktopOpen] = usePersistentState(STORAGE_KEYS.desktopOpen, true);
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [theme, setTheme] = usePersistentState(STORAGE_KEYS.theme, "system");
  // workspaceId mirrors the active panel — starts from the panel prop
  const [workspaceId, setWorkspaceId] = usePersistentState(STORAGE_KEYS.workspace, activePanel);
  const [expandedGroups, setExpandedGroups] = usePersistentState(STORAGE_KEYS.expandedGroups, {});
  const [favorites, setFavorites] = usePersistentState(STORAGE_KEYS.favorites, []);
  const [recentEntries, setRecentEntries] = usePersistentState(STORAGE_KEYS.recents, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flyout, setFlyoutState] = useState({ node: null, rect: null });
  const [internalActivePath, setInternalActivePath] = useState(activePath ?? "/dashboard");

  const resolvedTheme = useResolvedTheme(theme);

  // Sync external activePath changes
  useEffect(() => {
    if (activePath !== undefined) setInternalActivePath(activePath);
  }, [activePath]);

  // Sync panel changes from parent → workspaceId
  useEffect(() => {
    if (activePanel && activePanel !== workspaceId) {
      setWorkspaceId(activePanel);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePanel]);

  // When workspace changes, notify parent for panel switching
  const handleWorkspaceChange = (newWorkspaceId) => {
    setWorkspaceId(newWorkspaceId);
    if (onPanelChange) onPanelChange(newWorkspaceId);
  };

  // Lock body scroll on mobile open
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Listen for the topbar hamburger toggle event (desktop)
  useEffect(() => {
    const handle = () => {
      setDesktopOpen((c) => !c);
      setHoverExpanded(false);
    };
    window.addEventListener("katabazaar:toggleSidebar", handle);
    return () => window.removeEventListener("katabazaar:toggleSidebar", handle);
  }, []);

  const handleToggleTheme = () => {
    setTheme((current) =>
      current === "system" ? "light" : current === "light" ? "dark" : "system",
    );
  };

  const handleNavigate = (href, node) => {
    setMobileOpen(false);
    if (onNavigate) onNavigate(href, node);
  };

  const setFlyout = (node, rect) => setFlyoutState({ node, rect });

  const compact = !desktopOpen && !hoverExpanded;
  const width = (desktopOpen || hoverExpanded) ? expandedWidth : collapsedWidth;

  // Derive display role for the footer
  const displayRole = userRole
    ? String(userRole).replace(/_/g, " ")
    : "Admin";

  const sharedContentProps = {
    brandName,
    userName,
    userRole: displayRole,
    userAvatarUrl,
    onLogout,
    workspaceId,
    setWorkspaceId: handleWorkspaceChange,
    theme,
    resolvedTheme,
    onToggleTheme: handleToggleTheme,
    searchQuery,
    setSearchQuery,
    searchOpen,
    setSearchOpen,
    favorites,
    setFavorites,
    recentEntries,
    setRecentEntries,
    expandedGroups,
    setExpandedGroups,
    activePath: activePath ?? internalActivePath,
    setActivePath: setInternalActivePath,
    onNavigate: handleNavigate,
    permissions,
    flyoutNode: flyout.node,
    flyoutRect: flyout.rect,
    setFlyout,
  };

  return (
    <>
      {/* Mobile hamburger — only on small screens, opens the drawer */}
      <button
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/90 text-slate-200 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop sidebar — always dark, hover-to-expand when collapsed */}
      <aside
        className={cx(
          "relative hidden h-full min-h-0 flex-col border-r border-slate-800/70 bg-slate-950 shadow-2xl shadow-black/40 transition-[width] duration-250 ease-out lg:flex",
          hoverExpanded && !desktopOpen && "shadow-[4px_0_32px_rgba(139,92,246,0.12)]",
          className,
        )}
        style={{ width }}
        onMouseEnter={() => { if (!desktopOpen) setHoverExpanded(true); }}
        onMouseLeave={() => setHoverExpanded(false)}
      >
        {/* Pin button — visible only when hover-expanded in collapsed mode */}
        {hoverExpanded && !desktopOpen ? (
          <button
            type="button"
            onClick={() => { setDesktopOpen(true); setHoverExpanded(false); }}
            title="Pin sidebar open"
            className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10 text-violet-300 shadow-sm transition hover:bg-violet-500/20"
            aria-label="Pin sidebar open"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        ) : null}
        <SidebarContent
          {...sharedContentProps}
          compact={compact}
          onToggleCollapsed={() => setDesktopOpen((c) => !c)}
          showHeader
        />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div className="flex h-full min-h-0 flex-col bg-slate-950">
          <div className="border-b border-slate-800/80 p-4">
            <SidebarHeader
              brandName={brandName}
              collapsed={false}
              onCloseMobile={() => setMobileOpen(false)}
              compact
            />
          </div>
          <SidebarContent
            {...sharedContentProps}
            compact={false}
            onToggleCollapsed={undefined}
            showHeader={false}
          />
        </div>
      </MobileDrawer>
    </>
  );
}
