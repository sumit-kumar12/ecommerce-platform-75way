"use client";

/**
 * QuickNavBar.jsx
 * ---------------
 * A sticky quick-access bar that sits below the main StoreHeader on desktop (hidden on mobile).
 * Contains: Home, Deals, Offers, Flash Sales, Categories + up to N dynamic categories fetched
 * from props, plus a Cart shortcut.
 *
 * On mobile this component renders nothing — the MobileNavbar handles small screens.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Static quick links ───────────────────────────────────────────────────────
const QUICK_LINKS = [
  {
    href: "/",
    label: "Home",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/deals",
    label: "Deals",
    exact: false,
    badge: "HOT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    href: "/offers",
    label: "Offers",
    exact: false,
    badge: "NEW",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    href: "/products",
    label: "All Products",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: "/order",
    label: "Track Order",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

// ─── Badge variants ───────────────────────────────────────────────────────────
const BADGE_STYLES = {
  HOT: "bg-rose-500/90 text-white",
  NEW: "bg-violet-500/90 text-white",
  SALE: "bg-amber-500/90 text-white",
};

// ─── QuickNavBar ─────────────────────────────────────────────────────────────
export function QuickNavBar({ categories = [] }) {
  const pathname = usePathname();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  // Scroll shadow indicators
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  }, [categories]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) { setVisible(true); return; }
      setVisible(y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (item) => {
    if (!item.href) return false;
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  // Build all tabs: static links + dynamic categories
  const categoryTabs = categories.slice(0, 8).map((cat) => ({
    href: `/category/${cat.slug}`,
    label: cat.name,
    exact: false,
    _category: cat,
  }));

  const allTabs = [...QUICK_LINKS, ...categoryTabs];

  return (
    <div
      className={[
        "hidden md:block sticky z-30 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
      style={{ top: 0 }}
    >
      <div className="relative border-b border-white/[0.06] bg-[#0d0f1a]/88 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.35)]">

        {/* Left fade + scroll button */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
          className={[
            "absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-4",
            "bg-gradient-to-r from-[#0d0f1a] to-transparent transition-opacity duration-200",
            canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-slate-300 backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
        </button>

        {/* Right fade + scroll button */}
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
          className={[
            "absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-4",
            "bg-gradient-to-l from-[#0d0f1a] to-transparent transition-opacity duration-200",
            canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-slate-300 backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </button>

        {/* Scrollable pill list */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth px-4 py-2.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allTabs.map((item) => {
            const active = isActive(item);
            const badge = item.badge;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5",
                  "text-[13px] font-medium leading-none whitespace-nowrap",
                  "border transition-all duration-200",
                  active
                    ? "border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    : "border-white/8 bg-white/[0.04] text-slate-400 hover:border-white/14 hover:bg-white/[0.08] hover:text-slate-200",
                ].join(" ")}
              >
                {/* Icon */}
                {item.icon ? (
                  <span className={[
                    "transition-colors duration-200",
                    active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300",
                  ].join(" ")}>
                    {item.icon}
                  </span>
                ) : null}

                {/* Label */}
                <span>{item.label}</span>

                {/* Badge */}
                {badge ? (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider ${BADGE_STYLES[badge] ?? "bg-slate-700 text-slate-300"}`}>
                    {badge}
                  </span>
                ) : null}

                {/* Active bottom line */}
                {active ? (
                  <span className="absolute -bottom-2.5 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
