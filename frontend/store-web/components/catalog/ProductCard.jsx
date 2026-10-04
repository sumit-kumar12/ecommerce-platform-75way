"use client";

import Link from "next/link";
import {
  formatCatalogPrice,
  getMinVariantPrice,
  getMinCompareAtPrice,
  getProductImageUrl,
} from "../../lib/catalog";

function buildRatingData(product) {
  const average = Number(product?.averageRating ?? product?.ratingAverage ?? product?.rating ?? 0);
  if (!Number.isFinite(average) || average <= 0) {
    return { average: 4.6 };
  }
  return { average };
}

export function ProductCard({
  product,
  href,
  className = "",
  onAddToCart,
  onBuyNow,
  showAction = true,
  catalogDesign = false,
}) {
  const productHref = href || `/product/${product.id}`;
  const imageUrl = getProductImageUrl(product);
  const price = getMinVariantPrice(product);
  const compareAtPrice = getMinCompareAtPrice(product);
  const rating = buildRatingData(product);

  const discount = compareAtPrice > price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <div className={`group bg-[#1A1A2E] border border-white/5 rounded-2xl overflow-hidden hover:border-[#8B5CF6]/50 transition-colors duration-300 ${className}`}>
       <Link href={productHref} className="block relative aspect-[4/5] bg-[#0F0E17] overflow-hidden p-6">
          {discount > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name ? `${product.name} product image` : "Product image"}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              aria-label={product.name ? `${product.name} — image unavailable` : "Product image unavailable"}
            >
              <span className="material-symbols-outlined text-4xl text-gray-700">shopping_bag</span>
            </div>
          )}
       </Link>
       
       <div className="p-5">
          <Link href={productHref}>
            <h3 className="text-[15px] font-semibold text-white/90 line-clamp-2 hover:text-[#8B5CF6] transition-colors leading-snug">
              {product.name || "Katabazaar Product"}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-2.5 text-yellow-500 text-xs font-medium">
             <span className="material-symbols-outlined text-[14px]">star</span>
             <span>{rating.average.toFixed(1)}</span>
          </div>

          <div className="flex items-end gap-2 mt-3">
             <span className="font-bold text-lg text-white">{formatCatalogPrice(price)}</span>
             {compareAtPrice > price && (
               <span className="text-gray-500 text-sm line-through mb-[2px]">{formatCatalogPrice(compareAtPrice)}</span>
             )}
          </div>

          {showAction && typeof onAddToCart === "function" && (
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                className="flex-1 bg-white/5 hover:bg-[#8B5CF6] text-white py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Add
              </button>
              {typeof onBuyNow === "function" && (
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); onBuyNow(product); }}
                  className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Buy
                </button>
              )}
            </div>
          )}
       </div>
    </div>
  );
}
