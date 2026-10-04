"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Categories", href: "/products", icon: "category" },
  { label: "Deals & Offers", href: "/deals", icon: "local_offer" },
  { label: "Flash Deals", href: "/offers", icon: "bolt" },
  { label: "Brands", href: "/brand", icon: "stars" },
  { label: "Wishlist", href: "/wishlist", icon: "favorite", badge: 1 },
  { label: "Track Order", href: "/order", icon: "local_shipping" },
  { label: "Addresses", href: "/account/addresses", icon: "location_on" },
  { label: "Payments", href: "/account/settings", icon: "payments" },
  { label: "Help Center", href: "/help", icon: "help" },
  { label: "Log Out", href: "/login", icon: "logout", danger: true },
];

export function MobileDrawer({ open, onClose }) {
  const pathname = usePathname();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-[999] bg-[#121121] border-r border-[#2d2c45] flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Mobile navigation menu"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d2c45]">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8C63F5] flex items-center justify-center font-black text-white text-sm">K</div>
            <span className="font-black text-white text-base tracking-tight">KATABAZAAR</span>
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-colors group ${
                  isActive
                    ? "bg-[#8C63F5]/15 text-[#8C63F5]"
                    : item.danger
                    ? "text-rose-400 hover:bg-rose-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? "text-[#8C63F5]" : ""}`}>{item.icon}</span>
                <span className="text-sm font-semibold flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="bg-[#8C63F5] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                ) : null}
                {!item.danger && !item.badge && (
                  <span className="material-symbols-outlined text-[16px] text-slate-600 group-hover:text-slate-400 transition-colors">chevron_right</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Katacoins Footer */}
        <div className="px-4 py-4 border-t border-[#2d2c45]">
          <div className="flex items-center gap-3 bg-[#8C63F5]/10 border border-[#8C63F5]/20 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-[#8C63F5] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">monetization_on</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">KATACOINS</p>
              <p className="text-white font-black text-lg leading-none">230</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
