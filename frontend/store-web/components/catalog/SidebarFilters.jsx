"use client";

import { useState } from "react";
import Link from "next/link";

const POPULAR_BRANDS = [
  { id: "boat", name: "boAt" },
  { id: "noise", name: "Noise" },
  { id: "realme", name: "Realme" },
  { id: "oneplus", name: "OnePlus" },
  { id: "zebronics", name: "Zebronics" }
];

export function SidebarFilters({ 
  categories = [], 
  categorySlug, 
  maxPrice, 
  minimumRating, 
  setMinimumRating, 
  updateParams,
  selectedBrands = []
}) {
  const PRICE_SLIDER_MAX = 5000;

  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    ratings: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBrand = (brandId) => {
    let newBrands;
    if (selectedBrands.includes(brandId)) {
      newBrands = selectedBrands.filter(id => id !== brandId);
    } else {
      newBrands = [...selectedBrands, brandId];
    }
    updateParams({ brands: newBrands.join(','), page: 1 });
  };

  return (
    <div className="w-full bg-[#0F0E17] md:border-r border-white/10 md:pr-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-400">filter_list</span>
          Filters
        </h2>
        <button 
          className="text-sm text-[#8B5CF6] hover:text-white transition-colors"
          onClick={() => {
            setMinimumRating(0);
            updateParams({ categorySlug: null, maxPrice: null, brands: null, page: 1 });
          }}
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-6 pb-6 border-b border-white/5">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-gray-200 mb-4"
          onClick={() => toggleSection('category')}
        >
          Category
          <span className="material-symbols-outlined text-gray-400">
            {openSections.category ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSections.category && (
          <div className="space-y-2">
            <Link
              href="/products"
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categorySlug ? "bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}
            >
              All Categories
            </Link>
            {categories.slice(0, 8).map(c => (
              <Link
                key={c.id}
                href={`/category/${encodeURIComponent(c.slug)}`}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categorySlug === c.slug ? "bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="mb-6 pb-6 border-b border-white/5">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-gray-200 mb-4"
          onClick={() => toggleSection('brand')}
        >
          Brands
          <span className="material-symbols-outlined text-gray-400">
            {openSections.brand ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSections.brand && (
          <div className="space-y-3">
            {POPULAR_BRANDS.map(brand => {
              const isSelected = selectedBrands.includes(brand.id);
              return (
                <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors relative ${isSelected ? 'border-[#8B5CF6]' : 'border-gray-600 group-hover:border-[#8B5CF6]'}`}>
                    <input 
                      type="checkbox" 
                      className="absolute opacity-0 cursor-pointer w-0 h-0" 
                      checked={isSelected}
                      onChange={() => toggleBrand(brand.id)}
                    />
                    <span className={`material-symbols-outlined text-[12px] text-white bg-[#8B5CF6] w-full h-full rounded transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>check</span>
                  </div>
                  <span className={`text-sm transition-colors ${isSelected ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-200'}`}>{brand.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-white/5">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-gray-200 mb-4"
          onClick={() => toggleSection('price')}
        >
          Price Range
          <span className="material-symbols-outlined text-gray-400">
            {openSections.price ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSections.price && (
          <div className="space-y-4">
            <input 
              type="range" 
              className="w-full accent-[#8B5CF6]" 
              min="0" 
              max={PRICE_SLIDER_MAX} 
              step="100"
              value={maxPrice || PRICE_SLIDER_MAX}
              onChange={(e) => updateParams({ maxPrice: e.target.value, page: 1 })}
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>₹0</span>
              <span>₹{Intl.NumberFormat('en-IN').format(maxPrice || PRICE_SLIDER_MAX)}{!maxPrice || maxPrice == PRICE_SLIDER_MAX ? "+" : ""}</span>
            </div>
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-gray-200 mb-4"
          onClick={() => toggleSection('ratings')}
        >
          Ratings
          <span className="material-symbols-outlined text-gray-400">
            {openSections.ratings ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSections.ratings && (
          <div className="space-y-3">
            <button 
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${minimumRating === 0 ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}
              onClick={() => setMinimumRating(0)}
            >
              All ratings
            </button>
            {[4, 3, 2].map(rating => (
              <button 
                key={rating}
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${minimumRating === rating ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}
                onClick={() => setMinimumRating(rating)}
              >
                <div className={`flex items-center gap-1 ${minimumRating === rating ? "text-[#8B5CF6]" : "text-[#F59E0B]"}`}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-[14px] ${i < rating ? 'filled' : 'text-gray-600'}`}>star</span>
                  ))}
                </div>
                <span className="text-xs ml-1">& Up</span>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
