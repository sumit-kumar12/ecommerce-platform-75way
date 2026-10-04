"use client";

import { useState } from "react";

export default function FiltersSidebar() {
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    ratings: true,
    availability: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-full bg-[#0F0E17] border-r border-white/10 pr-6 hidden md:block">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button className="text-sm text-[#8B5CF6] hover:text-white transition-colors">Clear All</button>
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
          <div className="space-y-3">
            {["Audio", "Earbuds", "Headphones", "Speakers"].map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center group-hover:border-[#8B5CF6] transition-colors relative">
                  <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" />
                  <span className="material-symbols-outlined text-[12px] opacity-0 text-white bg-[#8B5CF6] w-full h-full rounded transition-opacity">check</span>
                </div>
                <span className="text-gray-400 group-hover:text-gray-200 text-sm transition-colors">{cat}</span>
              </label>
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
          Brand
          <span className="material-symbols-outlined text-gray-400">
            {openSections.brand ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSections.brand && (
          <div className="space-y-3">
            {["boAt", "Noise", "Realme", "OnePlus", "Zebronics"].map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center group-hover:border-[#8B5CF6] transition-colors relative">
                  <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" />
                  <span className="material-symbols-outlined text-[12px] opacity-0 text-white bg-[#8B5CF6] w-full h-full rounded transition-opacity">check</span>
                </div>
                <span className="text-gray-400 group-hover:text-gray-200 text-sm transition-colors">{brand}</span>
              </label>
            ))}
            <button className="text-[#8B5CF6] text-xs hover:text-white transition-colors mt-2">+ More</button>
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
            <input type="range" className="w-full accent-[#8B5CF6]" min="0" max="15000" />
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1 flex items-center">
                <span className="text-gray-500 mr-1">₹</span>
                <input type="number" placeholder="500" className="bg-transparent w-full outline-none text-sm text-gray-200" />
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1 flex items-center">
                <span className="text-gray-500 mr-1">₹</span>
                <input type="number" placeholder="15000" className="bg-transparent w-full outline-none text-sm text-gray-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="mb-6 pb-6 border-b border-white/5">
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
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center group-hover:border-[#8B5CF6] transition-colors relative">
                  <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" />
                  <span className="material-symbols-outlined text-[12px] opacity-0 text-white bg-[#8B5CF6] w-full h-full rounded transition-opacity">check</span>
                </div>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-sm ${i < rating ? 'filled' : 'text-gray-600'}`}>star</span>
                  ))}
                  <span className="text-gray-400 text-xs ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-gray-200 mb-4"
          onClick={() => toggleSection('availability')}
        >
          Availability
          <span className="material-symbols-outlined text-gray-400">
            {openSections.availability ? "expand_less" : "expand_more"}
          </span>
        </button>
        {openSections.availability && (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center group-hover:border-[#8B5CF6] transition-colors relative">
                <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" defaultChecked />
                <span className="material-symbols-outlined text-[12px] opacity-100 text-white bg-[#8B5CF6] w-full h-full rounded transition-opacity">check</span>
              </div>
              <span className="text-gray-200 text-sm transition-colors">In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center group-hover:border-[#8B5CF6] transition-colors relative">
                <input type="checkbox" className="absolute opacity-0 cursor-pointer w-0 h-0" />
                <span className="material-symbols-outlined text-[12px] opacity-0 text-white bg-[#8B5CF6] w-full h-full rounded transition-opacity">check</span>
              </div>
              <span className="text-gray-400 group-hover:text-gray-200 text-sm transition-colors">Out of Stock</span>
            </label>
          </div>
        )}
      </div>

    </div>
  );
}
