"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    label: "Shop",
    href: "/products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: null,
    action: "search",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: "Account",
    href: "/account/settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    ),
  },
];

// ─── Animated indicator ───────────────────────────────────────────────────────
function ActiveIndicator({ style }) {
  return (
    <span
      className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-violet-400 transition-all duration-300"
      style={style}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MobileNavbar({ onSearchOpen }) {
  const pathname = usePathname();
  const [ripple, setRipple] = useState(null);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide on scroll down, reveal on scroll up (like iOS tab bar)
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 64) { setVisible(true); return; }
      setVisible(current < lastScrollY.current);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (item) => {
    if (item.action) return false;
    if (!item.href) return false;
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const handleRipple = (e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: `${key}-${Date.now()}` });
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className={[
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      {/* Frosted glass bar */}
      <div className="relative flex items-stretch border-t border-white/[0.06] bg-[#0d0f1a]/92 backdrop-blur-2xl">
        {/* Safe-area spacer */}
        <div className="absolute bottom-0 left-0 right-0 h-[env(safe-area-inset-bottom,0px)] bg-[#0d0f1a]/92" />

        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const isSearch = item.action === "search";

          const inner = (
            <>
              {/* Ripple */}
              {ripple?.key?.startsWith(item.label) ? (
                <span
                  className="pointer-events-none absolute rounded-full bg-violet-400/20 animate-ping"
                  style={{
                    width: 48,
                    height: 48,
                    left: ripple.x - 24,
                    top: ripple.y - 24,
                  }}
                />
              ) : null}

              {/* Active background pill */}
              <span
                className={[
                  "absolute inset-x-2 top-1.5 bottom-1.5 rounded-2xl transition-all duration-200",
                  active ? "bg-violet-500/12" : "bg-transparent",
                ].join(" ")}
              />

              {/* Icon */}
              <span
                className={[
                  "relative z-10 transition-all duration-200",
                  active ? "text-violet-400 scale-110" : "text-slate-400",
                  !active && "group-hover:text-slate-200 group-hover:scale-105",
                ].join(" ")}
              >
                {active ? item.activeIcon : item.icon}
              </span>

              {/* Label */}
              <span
                className={[
                  "relative z-10 mt-1 text-[10px] font-medium leading-none tracking-wide transition-colors duration-200",
                  active ? "text-violet-300" : "text-slate-500 group-hover:text-slate-300",
                ].join(" ")}
              >
                {item.label}
              </span>

              {/* Active dot */}
              {active ? (
                <span className="absolute top-1 right-3 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_2px_rgba(167,139,250,0.6)]" />
              ) : null}
            </>
          );

          if (isSearch) {
            return (
              <button
                key={item.label}
                type="button"
                aria-label="Open search"
                onClick={(e) => { handleRipple(e, item.label); onSearchOpen?.(); }}
                className="group relative flex flex-1 flex-col items-center justify-center py-3 overflow-hidden"
                style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
              >
                {inner}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onClick={(e) => handleRipple(e, item.label)}
              className="group relative flex flex-1 flex-col items-center justify-center py-3 overflow-hidden"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
