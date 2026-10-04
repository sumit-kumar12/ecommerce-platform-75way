"use client";

import { useState, useRef, useEffect } from "react";

export default function SortDropdown({ onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Popular");
  const dropdownRef = useRef(null);

  const options = [
    "Popular",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Customer Rating"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSortChange) onSortChange(option);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm hidden sm:inline">Sort By:</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#18181b] border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg text-sm text-white transition-colors"
        >
          {selected}
          <span className="material-symbols-outlined text-[18px] text-gray-400">
            {isOpen ? "expand_less" : "expand_more"}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a192b] border border-[#8B5CF6]/30 rounded-xl shadow-xl overflow-hidden z-20">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option}>
                <button
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selected === option 
                      ? "bg-[#8B5CF6]/20 text-[#8B5CF6]" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
