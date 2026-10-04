"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../../components/product/ProductCard";
import SortDropdown from "../../components/product/SortDropdown";
import { StoreShell } from "../../components/layout/StoreShell";
import { ButtonSecondary } from "../../components/ui/ButtonSecondary";
import { EmptyState } from "../../components/ui/EmptyState";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { SkeletonCard } from "../../components/ui/SkeletonCard";
import { SidebarFilters } from "../../components/catalog/SidebarFilters";
import { MobileFilter } from "../../components/catalog/MobileFilter";
import { apiRequest } from "../../lib/api";
import { pickCategoryIcon } from "../../lib/catalog";
import styles from "./page.module.css";

// Same banner map as Category Landing Page
const CATEGORY_BANNERS = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop",
  hardware: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop",
  home: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop",
  beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2000&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop",
};

const PAGE_SIZE = 12;
const PRICE_SLIDER_MAX = 5000;
const SORT_OPTIONS = [
  { value: "latest", label: "Popularity" },
  { value: "price_asc", label: "Price Low to High" },
  { value: "price_desc", label: "Price High to Low" },
  { value: "name_asc", label: "Name A to Z" },
];
const FEATURED_CATEGORY_ORDER = ["grocery", "food", "hardware", "home-items", "home-item", "home"];
const CATEGORY_ICON_MAP = {
  grocery: "shopping_cart",
  food: "restaurant",
  hardware: "handyman",
  "home-items": "chair",
  "home-item": "chair",
  home: "chair",
};

function clampPage(value) {
  const parsed = Number(value);
  return isFinite(parsed) && parsed > 1 ? Math.floor(parsed) : 1;
}

function findCategoryPathBySlug(categories = [], slug = "") {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return [];

  for (const category of categories) {
    if (String(category?.slug || "").toLowerCase() === normalized) {
      return [category];
    }
    const nested = findCategoryPathBySlug(category?.children || [], normalized);
    if (nested.length) return [category, ...nested];
  }

  return [];
}

function getOfferExpiryLabel(offer) {
  if (!offer?.endDate) return "Open window";
  const diff = new Date(offer.endDate).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return "Ends today";
  const hours = Math.ceil(diff / 3_600_000);
  if (hours <= 24) return `${hours}h left`;
  const days = Math.ceil(diff / 86_400_000);
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const categorySlug = searchParams.get("categorySlug") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const brandsParam = searchParams.get("brands") ?? "";
  const page = clampPage(searchParams.get("page") ?? 1);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [notice, setNotice] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);
  const [minimumRating, setMinimumRating] = useState(0);
  const [liveOffers, setLiveOffers] = useState([]);
  const [sponsoredAds, setSponsoredAds] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const selectedBrands = useMemo(() => brandsParam ? brandsParam.split(',') : [], [brandsParam]);

  const getFirstPurchasableVariantId = useCallback((product) => {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const purchasable =
      variants.find((variant) => variant && variant.id && variant.isActive !== false && Number(variant.stock ?? 0) > 0) ||
      variants.find((variant) => variant && variant.id && variant.isActive !== false);
    return purchasable?.id || null;
  }, []);


  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (key === "page" && value <= 1)) params.delete(key);
      else params.set(key, String(value));
    });
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const fetchParams = new URLSearchParams({
          page: String(page),
          pageSize: String(PAGE_SIZE),
          sort,
        });
        if (query) fetchParams.set("q", query);
        if (categorySlug) fetchParams.set("categorySlug", categorySlug);
        if (maxPrice) fetchParams.set("maxPrice", String(maxPrice));
        if (brandsParam) fetchParams.set("brands", brandsParam);

        const [catRes, prodRes, wishRes, offerRes, sponsoredRes] = await Promise.all([
          apiRequest("/products/categories/tree", { csrf: false }),
          apiRequest(`/products/search?${fetchParams.toString()}`, { csrf: false }),
          apiRequest("/wishlist", { csrf: false, refresh: false }).catch(() => ({ wishlist: { items: [] } })),
          apiRequest("/offers", { csrf: false }).catch(() => ({ offers: [] })),
          apiRequest("/sponsored-ads", { csrf: false }).catch(() => ({ ads: [] })),
        ]);

        if (!active) return;
        setCategories(catRes?.categories || []);
        setProducts(prodRes?.products || []);
        setTotal(prodRes?.total || 0);
        setWishlistIds((wishRes?.wishlist?.items || []).map((i) => i.id));
        setLiveOffers((offerRes?.offers || []).filter((offer) => offer.isActive !== false));
        setSponsoredAds(sponsoredRes?.ads || []);
      } catch (err) {
        if (active) setError("Catalog offline. Verify API reachability.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [page, sort, query, categorySlug, maxPrice, brandsParam]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  useEffect(() => {
    if (!loading && total > 0 && page > totalPages) {
      updateParams({ page: totalPages });
    }
  }, [loading, total, page, totalPages, updateParams]);

  const filteredProducts = useMemo(() => (
    products.filter((product) => {
      const average = Number(product?.averageRating ?? product?.ratingAverage ?? product?.rating ?? 4.6);
      if (average < minimumRating) return false;
      if (selectedBrands.length > 0) {
        const brandToken = String(product?.brand?.slug || product?.brand?.name || "").toLowerCase();
        if (!selectedBrands.includes(brandToken)) return false;
      }
      return true;
    })
  ), [products, minimumRating, selectedBrands]);

  const featuredCategories = useMemo(() => {
    const normalized = categories.map((category) => ({
      ...category,
      token: String(category.slug || category.name || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
    }));

    const prioritized = FEATURED_CATEGORY_ORDER.map((token) => normalized.find((category) => category.token === token)).filter(Boolean);
    const seen = new Set(prioritized.map((category) => category.id));
    const remainder = normalized.filter((category) => !seen.has(category.id));
    return [...prioritized, ...remainder].slice(0, 4);
  }, [categories]);
  const selectedCategoryPath = useMemo(() => findCategoryPathBySlug(categories, categorySlug), [categories, categorySlug]);
  const selectedCategorySlugs = useMemo(
    () => new Set(selectedCategoryPath.map((category) => String(category.slug || "").toLowerCase()).filter(Boolean)),
    [selectedCategoryPath],
  );

  const filteredSponsoredAds = useMemo(() => {
    return sponsoredAds.filter(ad => {
      if (!ad.product) return false;
      if (categorySlug) {
        const prodCatSlug = String(ad.product.category?.slug || "").toLowerCase();
        return selectedCategorySlugs.has(prodCatSlug);
      }
      return true;
    });
  }, [sponsoredAds, categorySlug, selectedCategorySlugs]);

  const visibleOfferRail = useMemo(() => {
    if (!liveOffers.length) return [];

    const scoped = liveOffers.filter((offer) => {
      const offerSlug = String(offer?.category?.slug || "").toLowerCase();
      if (!offerSlug) return true;
      if (!categorySlug) return true;
      return selectedCategorySlugs.has(offerSlug);
    });

    const fallback = scoped.length ? scoped : liveOffers.filter((offer) => !offer.categoryId || !offer.category);
    return fallback
      .sort((left, right) => Number(right.discountPercent || 0) - Number(left.discountPercent || 0))
      .slice(0, 3);
  }, [categorySlug, liveOffers, selectedCategorySlugs]);
  const offerRailTitle = selectedCategoryPath.length
    ? `${selectedCategoryPath[selectedCategoryPath.length - 1].name} deals`
    : "Category offer rail";

  const handleAddToCart = useCallback(async (product) => {
    const variantId = getFirstPurchasableVariantId(product);
    if (!variantId) {
      setNotice(`No purchasable variant is available for ${product.name}.`);
      return;
    }

    try {
      await apiRequest("/cart/items", {
        method: "POST",
        body: { variantId, quantity: 1 },
      });
      window.dispatchEvent(new CustomEvent("cart-updated"));
      setNotice(`${product.name} added to cart.`);
    } catch (err) {
      if (err?.status === 401 || err?.code === "AUTH_REQUIRED") {
        router.push("/login?next=/products");
        return;
      }
      setNotice(err?.message || `Unable to add ${product.name} to the cart.`);
    }
  }, [getFirstPurchasableVariantId, router]);

  const handleBuyNow = useCallback(async (product) => {
    const variantId = getFirstPurchasableVariantId(product);
    if (!variantId) {
      router.push(`/product/${product.id}`);
      return;
    }

    try {
      await apiRequest("/cart/items", {
        method: "POST",
        body: { variantId, quantity: 1 },
      });
      router.push("/checkout");
    } catch (err) {
      if (err?.status === 401 || err?.code === "AUTH_REQUIRED") {
        router.push("/login?next=/checkout");
        return;
      }
      setNotice(err?.message || `Unable to start checkout for ${product.name}.`);
    }
  }, [getFirstPurchasableVariantId, router]);

  const handleToggleWishlist = useCallback(async (product) => {
    const wishlisted = wishlistIds.includes(product.id);

    try {
      const response = wishlisted
        ? await apiRequest(`/wishlist/items/${product.id}`, { method: "DELETE" })
        : await apiRequest("/wishlist/items", {
            method: "POST",
            body: { productId: product.id },
          });

      setWishlistIds((response?.wishlist?.items || []).map((item) => item.id));
      setNotice(wishlisted ? `${product.name} removed from wishlist.` : `${product.name} saved to wishlist.`);
    } catch (err) {
      if (err?.status === 401 || err?.code === "AUTH_REQUIRED") {
        router.push("/login?next=/products");
        return;
      }
      setNotice(err?.message || `Unable to update wishlist for ${product.name}.`);
    }
  }, [wishlistIds, router]);

  return (
    <StoreShell categories={categories}>
      <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col relative">
        {notice && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-[#8B5CF6] text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right">
            <span className="material-symbols-outlined">info</span>
            {notice}
          </div>
        )}

        {/* Hero / Page Banner — same style as Category Landing Page */}
        {(() => {
          const activeCategory = selectedCategoryPath.length ? selectedCategoryPath[selectedCategoryPath.length - 1] : null;
          
          // Try to find a specific banner for this category or its parents
          let heroImage = null;
          for (let i = selectedCategoryPath.length - 1; i >= 0; i--) {
            const slug = selectedCategoryPath[i]?.slug?.toLowerCase() || "";
            if (CATEGORY_BANNERS[slug]) {
              heroImage = CATEGORY_BANNERS[slug];
              break;
            }
          }
          // Fallbacks: if inside a category use default, if "All Categories" use default
          if (!heroImage) {
            heroImage = CATEGORY_BANNERS.default;
          }
          
          const title = activeCategory?.name || "Premium Collection";
          const description = activeCategory?.description || "Discover the best products curated for your lifestyle.";
          // Children of the active parent category for subcategory chips
          const parentCat = selectedCategoryPath.length > 0 ? selectedCategoryPath[0] : null;
          const subCats = parentCat?.children || [];

          return (
            <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden min-h-[280px] flex flex-col justify-end">
              {/* Background stock photo */}
              {heroImage && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={heroImage}
                    alt={title}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#121121] via-[#121121]/70 to-transparent"></div>
                </div>
              )}
              {/* Glowing orb when no image */}
              {!heroImage && (
                <>
                  <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#8C63F5]/40 rounded-full blur-[80px] -mr-40 -mt-20 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00DAFF]/20 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none"></div>
                </>
              )}

              <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 py-12 relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{title}</h1>
                <p className="text-slate-400 text-lg mb-6 max-w-xl">
                  {activeCategory ? description : (
                    total > 0 ? <><span className="text-[#8C63F5] font-bold">{total}</span> products available</> : description
                  )}
                </p>

                {/* Subcategory chips — show when a parent category is selected */}
                {subCats.length > 0 && (
                  <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-3">
                    <button
                      onClick={() => updateParams({ categorySlug: parentCat.slug, page: 1 })}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-bold transition-all border ${
                        categorySlug === parentCat.slug
                          ? "bg-[#8C63F5] border-[#8C63F5] text-white"
                          : "bg-[#121121]/80 backdrop-blur border-[#2d2c45] text-slate-400 hover:text-white hover:border-slate-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">grid_view</span>
                      All {parentCat.name}
                    </button>
                    {subCats.map(sub => (
                      <button
                        key={sub.slug}
                        onClick={() => updateParams({ categorySlug: sub.slug, page: 1 })}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-bold transition-all border ${
                          categorySlug === sub.slug
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
          );
        })()}


        <main className="flex-grow container mx-auto px-4 py-8 flex gap-8">
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <SidebarFilters 
              categories={categories}
              categorySlug={categorySlug}
              maxPrice={maxPrice}
              minimumRating={minimumRating}
              setMinimumRating={setMinimumRating}
              updateParams={updateParams}
              selectedBrands={selectedBrands}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-end mb-8 gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <button 
                  className="lg:hidden flex items-center gap-2 text-white bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="text-sm">Filters</span>
                </button>
                <SortDropdown onSortChange={(val) => updateParams({ sort: val, page: 1 })} />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                {filteredSponsoredAds.length > 0 && page === 1 && !query && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#8B5CF6]">campaign</span>
                      Sponsored
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredSponsoredAds.slice(0, 4).map(ad => (
                        <div key={ad.id} className="relative">
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#8C63F5] to-[#00DAFF] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg z-20 shadow-lg border border-white/20">
                            Ad
                          </div>
                          <ProductCard product={ad.product} onAddToCart={handleAddToCart} />
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-white/10 my-8"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="flex justify-center items-center gap-2 mt-12 mb-8">
                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-colors"
                      disabled={page === 1}
                      onClick={() => updateParams({ page: page - 1 })}
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((_, idx) => {
                        const pageNum = Math.max(0, page - 3) + idx + 1;
                        const isActive = page === pageNum;
                        return (
                          <button 
                            key={pageNum} 
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#8B5CF6] text-white" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`}
                            onClick={() => updateParams({ page: pageNum })}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-colors"
                      disabled={page === totalPages}
                      onClick={() => updateParams({ page: page + 1 })}
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </nav>
                )}
              </>
            ) : query ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#121121] border border-[#2d2c45] rounded-3xl text-center shadow-xl px-4">
                <div className="w-40 h-40 bg-[#1a192b] rounded-full flex items-center justify-center mb-8 border-4 border-[#2d2c45]">
                  <span className="material-symbols-outlined text-[80px] text-slate-400">search</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">No results found for <span className="text-[#8C63F5]">"{query}"</span></h2>
                <p className="text-slate-400 mb-8 max-w-md">Try searching with different keywords or check spelling.</p>
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                  <button onClick={() => router.push('/products')} className="bg-transparent border border-[#8C63F5] text-[#8C63F5] hover:bg-[#8C63F5]/10 font-bold py-3 px-8 rounded-xl transition-all">
                    Edit Search
                  </button>
                  <button onClick={() => updateParams({ q: '' })} className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20">
                    Browse Categories
                  </button>
                </div>
                <div className="border-t border-[#2d2c45]/50 w-full max-w-2xl pt-12 text-left md:text-center">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Popular Searches</h4>
                  <div className="flex flex-wrap justify-start md:justify-center gap-3">
                    {["iPhone 15", "Shoes", "Watch", "Backpack", "Kurti"].map(term => (
                      <button key={term} onClick={() => updateParams({ q: term })} className="bg-[#1a192b] border border-[#2d2c45] text-slate-300 hover:text-white hover:border-[#8C63F5] px-4 py-2 rounded-full text-sm font-medium transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-[#121121] border border-[#2d2c45] rounded-3xl text-center shadow-xl px-4">
                <div className="w-40 h-40 bg-[#1a192b] rounded-full flex items-center justify-center mb-8 border-4 border-[#2d2c45]">
                  <span className="material-symbols-outlined text-[80px] text-slate-400">search</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">No products found</h2>
                <p className="text-slate-400 mb-8 max-w-md">We couldn't find any products matching your filters.</p>
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                  <button onClick={() => router.push('/products')} className="bg-transparent border border-[#8C63F5] text-[#8C63F5] hover:bg-[#8C63F5]/10 font-bold py-3 px-8 rounded-xl transition-all">
                    Clear Filters
                  </button>
                  <button onClick={() => router.push('/products')} className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20">
                    Browse All Products
                  </button>
                </div>
                <div className="border-t border-[#2d2c45]/50 w-full max-w-2xl pt-12 text-left flex flex-col items-center">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 self-start md:self-center">Suggestions</h4>
                  <ul className="text-slate-400 text-sm space-y-3 flex flex-col items-start w-fit">
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#8C63F5] text-[18px]">check</span> Try different keywords</li>
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#8C63F5] text-[18px]">check</span> Remove some filters</li>
                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#8C63F5] text-[18px]">check</span> Check spelling</li>
                  </ul>
                </div>
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
        minimumRating={minimumRating}
        setMinimumRating={setMinimumRating}
        updateParams={updateParams}
        selectedBrands={selectedBrands}
      />
    </StoreShell>
  );
}
