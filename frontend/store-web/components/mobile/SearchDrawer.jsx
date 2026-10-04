"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const POPULAR_SEARCHES = ["Shoes", "Watch", "Backpack", "Kurti", "Perfume", "Sunglasses"];
const TRENDING_PRODUCTS = [
  { name: "Apple iPhone 15 Pro", price: "₹1,29,000", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&q=80" },
  { name: "Boat Headphones", price: "₹1,499", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80" },
  { name: "Fossil Watch", price: "₹8,999", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80" },
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

export function SearchDrawer({ open, onClose }) {
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
      setTimeout(() => inputRef.current?.focus(), 100);
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

  return (
    <>
      <div
        className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 right-0 z-[999] bg-[#121121] border-b border-[#2d2c45] shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-y-0" : "-translate-y-full"}`}
        aria-label="Search drawer"
        aria-hidden={!open}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#2d2c45]">
          <span className="material-symbols-outlined text-slate-400 text-[22px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="Search products, brands, categories..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors font-bold text-sm ml-2">Cancel</button>
        </div>

        <div className="px-4 py-5 max-h-[80vh] overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Searches</h3>
              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <button key={term} onClick={() => handleSearch(term)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-left group transition-colors">
                    <span className="material-symbols-outlined text-slate-500 text-[18px]">history</span>
                    <span className="text-slate-300 text-sm flex-1">{term}</span>
                    <span className="material-symbols-outlined text-slate-600 text-[16px] group-hover:text-slate-400 transition-colors">north_west</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="mb-6">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="bg-[#1a192b] border border-[#2d2c45] text-slate-300 hover:text-white hover:border-[#8C63F5] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Now */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Trending Now</h3>
            <div className="space-y-3">
              {TRENDING_PRODUCTS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleSearch(p.name)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1a192b] border border-[#2d2c45] hover:border-[#8C63F5]/40 text-left transition-colors"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-[#8C63F5] text-sm font-bold">{p.price}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">north_west</span>
                </button>
              ))}
            </div>
            <button onClick={() => { handleSearch(query || "all"); }} className="w-full text-center text-[#8C63F5] font-bold text-sm mt-4 py-2 hover:underline">
              View all results →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
