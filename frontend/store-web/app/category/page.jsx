"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { apiRequest } from "../../lib/api";
import { pickCategoryIcon } from "../../lib/catalog";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest("/products/categories/tree", { csrf: false });
        setCategories(res?.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8C63F5]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 relative z-10 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-[64px] text-[#8C63F5] mb-4">category</span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              All Categories
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Explore our wide range of premium products across multiple categories. Find exactly what you're looking for.
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${encodeURIComponent(cat.slug)}`}
                  className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-[#8C63F5] hover:bg-[#8C63F5]/5 transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#1a192b] group-hover:bg-[#8C63F5]/20 flex items-center justify-center mb-6 transition-colors shadow-inner">
                    <span className="material-symbols-outlined text-[40px] text-slate-400 group-hover:text-[#8C63F5] transition-colors">
                      {pickCategoryIcon(cat)}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg group-hover:text-[#8C63F5] transition-colors">{cat.name}</h3>
                  {cat.children && cat.children.length > 0 && (
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      {cat.children.length} Subcategories
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
          
          {!loading && categories.length === 0 && (
            <div className="py-20 text-center border border-dashed border-[#2d2c45] rounded-2xl">
              <span className="material-symbols-outlined text-[48px] text-slate-600 mb-4">inventory_2</span>
              <h3 className="text-xl font-bold text-white mb-2">No categories found</h3>
              <p className="text-slate-400">Check back later for exciting new products.</p>
            </div>
          )}

        </div>
      </div>
    </StoreShell>
  );
}
