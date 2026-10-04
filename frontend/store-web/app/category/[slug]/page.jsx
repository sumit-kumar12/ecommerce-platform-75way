"use client";

import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { StoreShell } from "../../../components/layout/StoreShell";
import { apiRequest } from "../../../lib/api";
import { pickCategoryIcon } from "../../../lib/catalog";
import ProductCard from "../../../components/product/ProductCard";
import { SidebarFilters } from "../../../components/catalog/SidebarFilters";
import { MobileFilter } from "../../../components/catalog/MobileFilter";

// Map slugs to placeholder premium stock images.
const CATEGORY_BANNERS = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop",
  hardware: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop",
  home: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
};

export default function CategoryLandingPage({ params }) {
  const { slug } = use(params);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const maxPrice = searchParams.get("maxPrice") || "";
  const brandsParam = searchParams.get("brands") || "";
  const sort = searchParams.get("sort") || "latest";
  const minimumRating = Number(searchParams.get("minimumRating") || "0");
  
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState("all");
  
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localMinRating, setLocalMinRating] = useState(minimumRating);

  const selectedBrands = useMemo(() => brandsParam ? brandsParam.split(',') : [], [brandsParam]);

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, String(value));
    });
    router.replace(`/category/${slug}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, slug]);

  // Fetch Category Info
  useEffect(() => {
    let active = true;
    const fetchCat = async () => {
      try {
        const res = await apiRequest("/products/categories/tree", { csrf: false });
        if (!active) return;
        
        const fetchedCategories = res?.categories || [];
        setAllCategories(fetchedCategories);
        const cat = fetchedCategories.find(c => String(c.slug).toLowerCase() === String(slug).toLowerCase());
        
        if (cat) {
          setCategory(cat);
          setSubCategories(cat.children || []);
        } else {
          setCategory({ name: slug.charAt(0).toUpperCase() + slug.slice(1), slug, description: "Explore the best of this category." });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCat();
    return () => { active = false; };
  }, [slug]);

  // Fetch Products based on selected subcategory or parent category
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const targetSlug = activeSub === "all" ? slug : activeSub;
        const fetchParams = new URLSearchParams({
          categorySlug: targetSlug,
          pageSize: "24",
          sort: sort
        });
        if (maxPrice) fetchParams.set("maxPrice", maxPrice);
        if (brandsParam) fetchParams.set("brands", brandsParam);

        const res = await apiRequest(`/products/search?${fetchParams.toString()}`, { csrf: false });
        if (!active) return;
        setProducts(res?.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    
    // Fetch Best Sellers
    const fetchBestSellers = async () => {
      try {
        const fetchParams = new URLSearchParams({
          categorySlug: slug,
          pageSize: "6",
          sort: "latest"
        });
        const res = await apiRequest(`/products/search?${fetchParams.toString()}`, { csrf: false });
        if (active) setBestSellers(res?.products || res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBestSellers();

    return () => { active = false; };
  }, [slug, activeSub, maxPrice, brandsParam, sort]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const average = Number(product?.averageRating ?? product?.ratingAverage ?? product?.rating ?? 4.6);
      if (average < localMinRating) return false;
      return true;
    });
  }, [products, localMinRating]);

  const title = category?.name || "Loading...";
  const description = category?.description || "Explore our premium curated collection.";
  const heroImage = CATEGORY_BANNERS[slug.toLowerCase()];

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20">
        
        {/* Category Hero */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden min-h-[300px] flex flex-col justify-end">
          
          {/* Dynamic Hero Background Banner */}
          {heroImage && (
            <div className="absolute inset-0 z-0 opacity-20 mask-image-to-bottom">
              <img 
                src={heroImage} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121121] via-[#121121]/80 to-transparent"></div>
            </div>
          )}

          <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 py-12 relative z-10">
            <div className="flex items-center gap-4 mb-2">
              {category && (
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[28px]">{pickCategoryIcon(category)}</span>
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{title}</h1>
            </div>
            <p className="text-slate-400 text-lg mb-8 max-w-xl">{description}</p>
            
            {subCategories.length > 0 && (
              <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
                <button
                  onClick={() => setActiveSub("all")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-bold transition-all border ${
                    activeSub === "all"
                      ? "bg-[#8C63F5] border-[#8C63F5] text-white"
                      : "bg-[#121121]/80 backdrop-blur border-[#2d2c45] text-slate-400 hover:text-white hover:border-slate-500"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                  All {title}
                </button>
                {subCategories.map(sub => (
                  <button
                    key={sub.slug}
                    onClick={() => setActiveSub(sub.slug)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-bold transition-all border ${
                      activeSub === sub.slug
                        ? "bg-[#8C63F5] border-[#8C63F5] text-white"
                        : "bg-[#121121]/80 backdrop-blur border-[#2d2c45] text-slate-400 hover:text-white hover:border-slate-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{pickCategoryIcon(sub)}</span>
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6 hidden lg:block">
            <SidebarFilters 
              categories={allCategories}
              categorySlug={activeSub === "all" ? slug : activeSub}
              maxPrice={maxPrice}
              minimumRating={localMinRating}
              setMinimumRating={setLocalMinRating}
              updateParams={updateParams}
              selectedBrands={selectedBrands}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {activeSub === "all" ? "All Products" : subCategories.find(s => s.slug === activeSub)?.name}
                <span className="text-sm text-slate-500 ml-3 font-normal">{filteredProducts.length} Items</span>
              </h2>
              <div className="flex items-center gap-2 bg-[#121121] border border-[#2d2c45] rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-slate-400">Sort:</span>
                <select 
                  className="bg-transparent text-white text-sm font-bold focus:outline-none appearance-none pr-4 cursor-pointer"
                  value={sort}
                  onChange={e => updateParams({ sort: e.target.value })}
                >
                  <option value="latest">Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-slate-400 -ml-4 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Best Sellers Strip */}
            {bestSellers.length > 0 && activeSub === "all" && !maxPrice && !brandsParam && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400">workspace_premium</span>
                    Best Sellers
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    Sort: <span className="text-white font-bold">Popular</span>
                  </div>
                </div>
                <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
                  {bestSellers.map(product => (
                    <div key={product.id} className="min-w-[280px] sm:min-w-[300px] snap-start">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Explore All CTA */}
                <div className="flex justify-center mt-8">
                  <Link href={`/products?categorySlug=${slug}`} className="bg-[#121121] hover:bg-[#8C63F5] text-white border border-[#2d2c45] hover:border-[#8C63F5] font-bold py-4 px-12 rounded-xl transition-all shadow-lg text-lg group">
                    Explore All {title}
                    <span className="material-symbols-outlined ml-2 text-[20px] align-middle group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-[#121121] border border-[#2d2c45] rounded-2xl">
                <span className="material-symbols-outlined text-[64px] text-slate-600 mb-4">inventory_2</span>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400 mb-6">There are no products available matching your filters.</p>
                <button onClick={() => updateParams({ maxPrice: '', brands: '', minimumRating: '' })} className="inline-block text-[#8C63F5] font-bold hover:underline">
                  Clear Filters
                </button>
              </div>
            )}

          </main>
        </div>

        {/* Floating Mobile Filter Button */}
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden fixed bottom-24 right-4 z-40 bg-[#8C63F5] text-white p-4 rounded-full shadow-xl shadow-[#8C63F5]/30 flex items-center justify-center"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>

      <MobileFilter 
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={allCategories}
        categorySlug={activeSub === "all" ? slug : activeSub}
        maxPrice={maxPrice}
        minimumRating={localMinRating}
        setMinimumRating={setLocalMinRating}
        updateParams={updateParams}
        selectedBrands={selectedBrands}
      />
    </StoreShell>
  );
}
