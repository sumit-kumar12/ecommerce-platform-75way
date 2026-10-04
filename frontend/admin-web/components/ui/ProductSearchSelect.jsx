"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "../../lib/api";

export default function ProductSearchSelect({ value, onChange, placeholder = "Search for a product..." }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch initial selected product if value exists and we don't have it
  useEffect(() => {
    if (value && !selectedProduct) {
      const fetchProduct = async () => {
        try {
          const res = await apiRequest(`/products/${value}`);
          if (res.product) {
            setSelectedProduct(res.product);
            setQuery(res.product.name);
          }
        } catch (err) {
          console.error("Failed to fetch selected product:", err);
        }
      };
      fetchProduct();
    }
  }, [value, selectedProduct]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/products/search?q=${encodeURIComponent(query)}&pageSize=10`);
        setResults(res.products || []);
      } catch (err) {
        console.error("Product search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, isOpen]);

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setQuery(product.name);
    setIsOpen(false);
    if (onChange) {
      onChange(product.id, product);
    }
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setQuery("");
    setResults([]);
    if (onChange) {
      onChange(null, null);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <span className="absolute left-3 material-symbols-outlined text-slate-400 text-[18px]">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (selectedProduct) {
              setSelectedProduct(null); // Reset selection when user types something new
              if (onChange) onChange(null, null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#8C63F5] transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-[#2d2c45]">
              {results.map((product) => {
                const imageUrl = product.thumbnailImageUrl || (product.images?.[0]?.url);
                return (
                  <li
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="p-3 hover:bg-[#8C63F5]/10 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-[#0F0E17] flex items-center justify-center border border-[#2d2c45] overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px] text-slate-500">inventory_2</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {product.variants?.[0]?.sku && <span className="font-mono">{product.variants[0].sku}</span>}
                        <span>•</span>
                        <span>₹{product.variants?.[0]?.price || 0}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-400">No products found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}
