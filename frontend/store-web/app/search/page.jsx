"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../lib/api";
import ProductCard from "../../components/product/ProductCard";
import { StoreShell } from "../../components/layout/StoreShell";
import { SidebarFilters } from "../../components/catalog/SidebarFilters";
import { MobileFilter } from "../../components/catalog/MobileFilter";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("categorySlug") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brandsParam = searchParams.get("brands") || "";
  const sort = searchParams.get("sort") || "latest";
  const minimumRating = Number(searchParams.get("minimumRating") || "0");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localMinRating, setLocalMinRating] = useState(minimumRating);

  const selectedBrands = useMemo(() => brandsParam ? brandsParam.split(',') : [], [brandsParam]);

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, String(value));
    });
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ sort, pageSize: "24" });
        if (query) params.set("q", query);
        if (categorySlug) params.set("categorySlug", categorySlug);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (brandsParam) params.set("brands", brandsParam);
        
        const [prodData, catData] = await Promise.all([
          apiRequest(`/products/search?${params.toString()}`, { csrf: false }),
          apiRequest("/products/categories/tree", { csrf: false })
        ]);
        
        if (active) {
          setProducts(prodData?.products || []);
          setCategories(catData?.categories || []);
        }
      } catch (err) {
        if (active) setError("Failed to fetch search results. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchResults();
    return () => { active = false; };
  }, [query, categorySlug, sort, maxPrice, brandsParam]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const average = Number(product?.averageRating ?? product?.ratingAverage ?? product?.rating ?? 4.6);
      if (average < localMinRating) return false;
      return true;
    });
  }, [products, localMinRating]);

  return (
    <StoreShell>
      <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col">

        {/* Search Hero Banner */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8C63F5]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 relative z-10">
            <nav className="flex items-center text-xs text-slate-500 mb-3 gap-2 uppercase tracking-widest font-bold">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#8C63F5]">Search Results</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
              {query ? (
                <>Search results for &quot;<span className="text-[#8C63F5]">{query}</span>&quot;</>
              ) : (
                "All Products"
              )}
            </h1>
            <p className="text-slate-400 text-lg">
              {loading ? "Searching..." : `${filteredProducts.length} products found`}
            </p>
          </div>
        </div>

        <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 md:px-8 py-8 flex gap-8">
          
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <SidebarFilters 
              categories={categories}
              categorySlug={categorySlug}
              maxPrice={maxPrice}
              minimumRating={localMinRating}
              setMinimumRating={setLocalMinRating}
              updateParams={updateParams}
              selectedBrands={selectedBrands}
            />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button 
                className="lg:hidden flex items-center gap-2 text-white bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span className="text-sm">Filters</span>
              </button>
              <div className="flex items-center gap-2 bg-[#121121] border border-[#2d2c45] rounded-xl px-4 py-2 ml-auto">
                <span className="text-sm font-medium text-slate-400">Sort:</span>
                <select
                  className="bg-transparent text-white text-sm font-bold focus:outline-none appearance-none pr-4 cursor-pointer"
                  value={sort}
                  onChange={e => updateParams({ sort: e.target.value })}
                >
                  <option value="latest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-slate-400 -ml-4 pointer-events-none">expand_more</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#121121] border border-[#2d2c45] rounded-2xl">
                <span className="material-symbols-outlined text-[64px] text-slate-600 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your search query or filters.</p>
                <button onClick={() => updateParams({ maxPrice: '', brands: '', minimumRating: '' })} className="mt-6 inline-block text-[#8C63F5] font-bold hover:underline">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileFilter 
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        categorySlug={categorySlug}
        maxPrice={maxPrice}
        minimumRating={localMinRating}
        setMinimumRating={setLocalMinRating}
        updateParams={updateParams}
        selectedBrands={selectedBrands}
      />
    </StoreShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
