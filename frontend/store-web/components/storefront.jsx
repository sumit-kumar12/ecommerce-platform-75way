"use client";

import { useEffect, useState } from "react";
import { StoreShell } from "./layout/StoreShell";
import HeroSection from "./home/HeroSection";
import TrustBadges from "./home/TrustBadges";
import TopCategories from "./home/TopCategories";
import FlashDeals from "./flash-deals";
import SponsoredBrands from "./sponsored-ads";
import BestSellers from "./home/BestSellers";
import { apiRequest } from "../lib/api";

export default function Storefront() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          apiRequest("/products/categories/tree", { csrf: false }).catch(() => ({ categories: [] })),
          apiRequest("/products/search?page=1&pageSize=8", { csrf: false }).catch(() => ({ products: [] }))
        ]);
        
        if (catRes.categories) setCategories(catRes.categories);
        if (prodRes.products) setProducts(prodRes.products);
      } catch (err) {
        console.error("Failed to load storefront data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <StoreShell categories={categories}>
      <main className="min-h-screen bg-background-dark text-text-primary overflow-x-hidden">
        <HeroSection />
        <TrustBadges />
        <FlashDeals />
        <TopCategories categories={categories} />
        <SponsoredBrands />
        <BestSellers products={products} loading={loading} />
      </main>
    </StoreShell>
  );
}
