"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../catalog/ProductCard";
import { apiRequest } from "../../lib/api";

export function CartRecommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      try {
        const res = await apiRequest("/products/search?pageSize=4&sort=latest", { csrf: false });
        if (active && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRecommendations();
    return () => { active = false; };
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">You may also like</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
