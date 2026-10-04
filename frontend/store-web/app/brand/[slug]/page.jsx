"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { StoreShell } from "../../../components/layout/StoreShell";
import { apiRequest } from "../../../lib/api";
import ProductCard from "../../../components/product/ProductCard";

export default function BrandLandingPage({ params }) {
  const { slug } = use(params);

  // Format slug to title (e.g., 'apple' -> 'Apple')
  const brandName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Brand";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeTab, setActiveTab] = useState("All Products");

  // Fetch products by searching brand name — no DB change needed
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchParams = new URLSearchParams({ q: brandName, pageSize: "12", sort: "latest" });
        const res = await apiRequest(`/products/search?${fetchParams.toString()}`, { csrf: false });
        if (!active) return;
        setProducts(res?.products || []);
        setTotalProducts(res?.total || res?.products?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    return () => { active = false; };
  }, [brandName]);

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20">

        {/* Brand Hero */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8C63F5]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 lg:py-16 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* Brand Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#1a192b] border-2 border-[#2d2c45] flex items-center justify-center shrink-0 shadow-2xl">
              <span className="material-symbols-outlined text-[64px] md:text-[80px] text-[#8C63F5]">interests</span>
            </div>

            {/* Brand Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{brandName}</h1>
              <p className="text-slate-400 text-lg mb-6">Premium products by {brandName}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-12">
                <div>
                  <div className="text-xl font-bold text-white mb-1">{loading ? "..." : `${totalProducts}+`}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Products</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-1">
                    4.7 <span className="material-symbols-outlined text-[18px] text-amber-400">star</span>
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Avg Rating</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-1">100%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Original</div>
                </div>
              </div>
            </div>

            {/* CTA & Hero Highlight (Right Side) */}
            <div className="shrink-0 flex flex-col items-center md:items-end gap-6 ml-auto">
              <Link
                href={`/products?q=${encodeURIComponent(brandName)}`}
                className="flex items-center justify-center gap-2 bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20"
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                View All Products
              </Link>
              
              {/* Highlight Card (Desktop Only) */}
              {!loading && products.length > 0 && (
                <div className="hidden lg:flex w-[320px] bg-[#121121] border border-[#2d2c45] rounded-2xl p-4 items-center gap-4 group hover:border-[#8C63F5] transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8C63F5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-20 h-20 bg-[#1a192b] rounded-xl flex items-center justify-center shrink-0 z-10 overflow-hidden">
                    {products[0].images?.[0] ? (
                      <img src={products[0].images?.[0]?.url} alt={products[0].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-500 text-[32px]">image</span>
                    )}
                  </div>
                  <div className="z-10">
                    <p className="text-xs text-[#8C63F5] font-bold uppercase tracking-wider mb-1">Latest Release</p>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{products[0].name}</h3>
                    <p className="text-slate-400 font-bold mt-1">₹{products[0].price.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Dynamic Category Tabs */}
        {!loading && products.length > 0 && (
          <div className="border-b border-[#2d2c45] bg-[#121121]/50 backdrop-blur sticky top-0 z-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
              <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
                {["All Products", ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)))].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-[#8C63F5] text-[#8C63F5]"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
          
          {/* Top Products */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {activeTab === "All Products" ? "Top Products" : activeTab}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-[#121121] border border-[#2d2c45] px-4 py-2 rounded-xl">
                Sort: <span className="text-white font-bold">Popular</span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter(p => activeTab === "All Products" || p.category?.name === activeTab)
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#121121] border border-[#2d2c45] rounded-2xl">
                <span className="material-symbols-outlined text-[64px] text-slate-600 mb-4">inventory_2</span>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400">No products are currently listed for {brandName}.</p>
              </div>
            )}
          </section>

          {/* Why Choose Brand Section */}
          <section className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-white mb-10 text-center">Why Choose {brandName}?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: "verified", title: "Premium Quality", desc: "Crafted with the finest materials." },
                { icon: "lightbulb", title: "Innovative Design", desc: "State of the art engineering." },
                { icon: "sync", title: "Seamless Ecosystem", desc: "Everything works magically together." },
                { icon: "security", title: "1 Year Warranty", desc: "Peace of mind guaranteed." }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#1a192b] border border-[#2d2c45] flex items-center justify-center mb-4 text-[#8C63F5]">
                    <span className="material-symbols-outlined text-[32px]">{feature.icon}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </StoreShell>
  );
}
