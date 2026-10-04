"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const POPULAR_CATEGORIES = [
  { name: "Mobiles", icon: "smartphone" },
  { name: "Fashion", icon: "checkroom" },
  { name: "Electronics", icon: "devices" },
  { name: "Beauty", icon: "face_retouching_natural" },
  { name: "Home", icon: "chair" },
  { name: "Sports", icon: "sports_soccer" },
];
const TOP_BRANDS = [
  { name: "Apple", color: "#555" },
  { name: "Samsung", color: "#1428A0" },
  { name: "Nike", color: "#111" },
  { name: "Adidas", color: "#222" },
  { name: "OnePlus", color: "#EB0028" },
  { name: "Boat", color: "#FF4D00" },
];
const RECENT_SEARCHES_KEY = "kb-recent-searches";

function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"); } catch { return []; }
}
function saveRecentSearch(term) {
  if (typeof window === "undefined") return;
  const existing = getRecentSearches().filter(t => t !== term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([term, ...existing].slice(0, 5)));
}
function removeRecentSearch(term) {
  if (typeof window === "undefined") return;
  const existing = getRecentSearches().filter(t => t !== term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(existing));
}

export function MegaSearchOverlay({ open, onClose, categories = [] }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSearch = (term) => {
    const t = (term || query).trim();
    if (!t) return;
    saveRecentSearch(t);
    onClose();
    router.push(`/products?q=${encodeURIComponent(t)}`);
  };

  const handleRemoveRecent = (e, term) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  };

  const displayCategories = categories.length > 0
    ? categories.slice(0, 6).map(c => ({ name: c.name, icon: c.icon || "category" }))
    : POPULAR_CATEGORIES;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/80 backdrop-blur-md transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 left-0 right-0 z-[999] bg-[#0F0E17] border-b border-[#2d2c45] shadow-2xl transition-all duration-200 ease-out ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        aria-label="Advanced search overlay"
        aria-hidden={!open}
      >
        {/* Search Input */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center gap-3 bg-[#121121] border border-[#2d2c45] focus-within:border-[#8C63F5] rounded-2xl px-5 py-4 transition-colors">
            <span className="material-symbols-outlined text-[#8C63F5] text-[24px]">search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="Search products, brands, categories..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-base outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm ml-1 px-3 py-1 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1: Popular Categories + Top Brands */}
          <div className="space-y-6">
            <div>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Popular Categories</h3>
              <div className="grid grid-cols-3 gap-2">
                {displayCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { onClose(); router.push(`/products?categorySlug=${cat.name.toLowerCase()}`); }}
                    className="flex flex-col items-center gap-1.5 p-2.5 bg-[#121121] border border-[#2d2c45] rounded-xl hover:border-[#8C63F5]/40 hover:bg-[#8C63F5]/5 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-[#8C63F5] transition-colors">{cat.icon}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-white font-semibold text-center leading-tight transition-colors">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Top Brands</h3>
              <div className="flex flex-wrap gap-2">
                {TOP_BRANDS.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => handleSearch(brand.name)}
                    className="bg-[#121121] border border-[#2d2c45] text-slate-300 hover:text-white hover:border-[#8C63F5]/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Recent Searches */}
          <div>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Recent Searches</h3>
            {recentSearches.length === 0 ? (
              <p className="text-slate-600 text-sm">No recent searches yet.</p>
            ) : (
              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <div key={term} className="flex items-center gap-2 group">
                    <button
                      onClick={() => handleSearch(term)}
                      className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 text-left transition-colors"
                    >
                      <span className="material-symbols-outlined text-slate-500 text-[16px]">search</span>
                      <span className="text-slate-300 text-sm">{term}</span>
                    </button>
                    <button onClick={(e) => handleRemoveRecent(e, term)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Trending Products */}
          <div>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Trending Products</h3>
            <div className="space-y-2">
              {[
                { name: "iPhone 15 Pro", price: "₹1,29,000", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&q=80" },
                { name: "Nike Air Max", price: "₹12,999", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80" },
                { name: "Boat Earbuds", price: "₹1,299", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&q=80" },
              ].map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleSearch(p.name)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#121121] border border-[#2d2c45] hover:border-[#8C63F5]/40 text-left transition-colors"
                >
                  <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-[#8C63F5] text-xs font-bold">{p.price}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 text-[16px]">north_west</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (query) {
                  handleSearch(query);
                } else {
                  onClose();
                  router.push("/products");
                }
              }}
              className="mt-4 w-full text-center text-[#8C63F5] font-bold text-sm py-2 border border-[#8C63F5]/30 rounded-xl hover:bg-[#8C63F5]/10 transition-colors"
            >
              View all results →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
