"use client";

import Link from "next/link";
import { formatCatalogPrice, getProductImageUrl } from "../../lib/catalog";
import RatingStars from "../ui/RatingStars";

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity, price, originalPrice, title, variantId } = item;
  
  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(item.variantId, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.variantId, quantity + 1);
  };

  const image = getProductImageUrl(product) || "/placeholder.png";

  return (
    <div className="flex flex-col sm:flex-row gap-5 bg-[#1A1A2E] border border-white/5 hover:border-[#8B5CF6]/30 transition-colors duration-300 rounded-2xl p-5">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="shrink-0 group">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#0F0E17] rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
          <img src={image} alt={product.name || 'Product'} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </Link>
      
      {/* Item Details */}
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-white font-semibold hover:text-[#8B5CF6] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <div className="mt-1">
              <RatingStars rating={product.rating || 4.4} count={product.reviews || 12400} />
            </div>
            {title && (
              <p className="text-gray-400 text-sm mt-1">{title}</p>
            )}
          </div>
          
          <div className="flex flex-col items-start sm:items-end min-w-[100px]">
            <strong className="text-lg text-white font-bold">{formatCatalogPrice(price)}</strong>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through mt-0.5">
                {formatCatalogPrice(originalPrice)}
              </span>
            )}
            {originalPrice > price && (
              <span className="text-xs text-green-400 font-medium mt-1 bg-green-400/10 px-1.5 py-0.5 rounded">
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-5 gap-4 pt-4 border-t border-white/5">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#0F0E17] border border-white/10 rounded-lg p-0.5">
            <button 
              type="button" 
              onClick={handleDecrease} 
              disabled={quantity <= 1} 
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-[#2A2A40] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="text-white font-semibold text-sm w-8 text-center">{quantity}</span>
            <button 
              type="button" 
              onClick={handleIncrease} 
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-[#2A2A40] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <button type="button" className="text-gray-400 hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">favorite</span>
              Save
            </button>
            <span className="w-px h-4 bg-white/10"></span>
            <button type="button" onClick={() => onRemove(item.variantId)} className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
