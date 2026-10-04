"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "../lib/api";
import CountdownTimer from "./ui/CountdownTimer";
import DiscountBadge from "./ui/DiscountBadge";
import RatingStars from "./ui/RatingStars";
import PriceDisplay from "./ui/PriceDisplay";
import { getProductImageUrl } from "../lib/catalog";

export default function FlashDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetDate, setTargetDate] = useState(null);

  // Cart state per deal
  const [addingState, setAddingState] = useState({});

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await apiRequest("/flash-deals");
        if (res.deals && res.deals.length > 0) {
          setDeals(res.deals);
          // Find the deal with the latest endDate to use as global timer
          const maxDate = res.deals.reduce((max, deal) => {
            const dealDate = new Date(deal.endDate).getTime();
            return dealDate > max ? dealDate : max;
          }, 0);
          if (maxDate > 0) {
            setTargetDate(new Date(maxDate).toISOString());
          }
        }
      } catch (err) {
        console.error("Error fetching flash deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (!loading && deals.length === 0) return null;

  // For testing/fallback if no deals exist but we want to show the UI
  const displayDeals = deals.length > 0 ? deals : [
    { id: "32ead0d5-862a-4328-90de-279f2cd42ca1", discountValue: 40, discountType: "PERCENTAGE", product: { id: "8230baaa-21db-4493-9f1f-5089eddbc331", name: "boAt Airdopes 141", rating: 4.4, reviews: 12400, variants: [{ id: "18797d9f-d279-4181-adb3-574539bfed77", price: 2499 }] } },
    { id: "08c997d0-211e-4aef-a4c7-428ec79dd4a9", discountValue: 22, discountType: "PERCENTAGE", product: { id: "2e934747-561a-4c71-9bba-019242c1d3da", name: "Noise ColorFit Pro 4", rating: 4.3, reviews: 8200, variants: [{ id: "25af62e2-3a99-4b22-9d64-f6ce67b9f777", price: 3499 }] } },
    { id: "1fd1e80a-f420-41b6-98a7-6ae88a573456", discountValue: 28, discountType: "PERCENTAGE", product: { id: "4b06a877-3115-4e03-b300-676902de4198", name: "ASUS ROG Strix G15", rating: 4.8, reviews: 1200, variants: [{ id: "46017409-5b47-478b-ab40-9b853b505586", price: 154990 }] } },
    { id: "424f27c0-ee23-489b-9918-c3256f855c9a", discountValue: 40, discountType: "PERCENTAGE", product: { id: "32ead0d5-862a-4328-90de-279f2cd42ca2", name: "Philips Air Fryer XL", rating: 4.5, reviews: 3400, variants: [{ id: "8230baaa-21db-4493-9f1f-5089eddbc332", price: 11499 }] } },
  ];

  const handleAddToCart = async (e, variantId, dealId) => {
    e.preventDefault();
    if (!variantId) return;
    
    setAddingState(prev => ({ ...prev, [dealId]: 'adding' }));
    
    try {
      await apiRequest("/cart/items", { method: "POST", body: { variantId, quantity: 1 }, csrf: true });
      setAddingState(prev => ({ ...prev, [dealId]: 'added' }));
      setTimeout(() => setAddingState(prev => ({ ...prev, [dealId]: null })), 2000);
    } catch (err) {
      console.error("Failed to add to cart", err);
      setAddingState(prev => ({ ...prev, [dealId]: 'added' }));
      setTimeout(() => setAddingState(prev => ({ ...prev, [dealId]: null })), 2000);
    }
  };

  return (
    <section className="py-8 md:py-12 border-b border-white/10 bg-[#0F0E17]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
              Flash Deals
            </h2>
            <CountdownTimer targetDate={targetDate} className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] sm:text-xs md:text-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded" />
          </div>
          <Link href="/deals" className="text-[#8B5CF6] hover:text-white text-xs md:text-sm font-semibold flex items-center gap-1 transition-colors">
            View All <span className="material-symbols-outlined text-xs md:text-sm">chevron_right</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-4 md:pb-6 scrollbar-hide snap-x">
          {displayDeals.map((deal, i) => {
            const product = deal.product;
            if (!product) return null;
            
            const variant = product.variants?.[0];
            const originalPrice = variant ? Number(variant.price) : 0;
            let dealPrice = originalPrice;
            
            if (deal.discountType === "PERCENTAGE") {
              dealPrice = originalPrice - (originalPrice * (Number(deal.discountValue) / 100));
            } else {
              dealPrice = originalPrice - Number(deal.discountValue);
            }

            const discountPercentage = deal.discountType === "PERCENTAGE" 
              ? deal.discountValue 
              : Math.round(((originalPrice - dealPrice) / originalPrice) * 100);

            const imageUrl = deal.mediaUrl 
              ? (deal.mediaUrl.startsWith('http') ? deal.mediaUrl : `${process.env.NEXT_PUBLIC_API_BASE || ''}${deal.mediaUrl}`) 
              : (getProductImageUrl(product) || (product.images?.[0]?.storageKey ? `/media/products/${product.images[0].storageKey}` : null));


            const status = addingState[deal.id];
            const isAdding = status === 'adding';
            const isAdded = status === 'added';

            return (
              <div 
                key={deal.id || i} 
                className="min-w-[160px] sm:min-w-[200px] md:min-w-[280px] w-[160px] sm:w-[200px] md:w-[280px] flex-shrink-0 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col snap-start hover:border-[#8B5CF6]/50 transition-colors group"
              >
                <div className="relative aspect-square w-full rounded-lg md:rounded-xl bg-[#111] overflow-hidden flex items-center justify-center mb-3 md:mb-4">
                  <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 z-10 scale-75 md:scale-100 origin-top-left">
                    <DiscountBadge discount={discountPercentage} />
                  </div>
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Image fill sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 280px" src="/images/product-placeholder.svg" alt="Placeholder" style={{ objectFit: 'cover' }} className="opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  )}
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2 flex-1">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-[#8B5CF6] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <RatingStars rating={product.rating || 4.5} count={product.reviews || 0} />
                  
                  <div className="mt-auto pt-2 flex flex-col gap-2 md:gap-4">
                    <PriceDisplay price={dealPrice} mrp={originalPrice} size="sm" />
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, variant?.id, deal.id)}
                      disabled={isAdding || isAdded}
                      className={`w-full font-medium text-[10px] md:text-sm py-1.5 md:py-2 rounded-lg md:rounded-xl transition-colors ${
                        isAdded ? "bg-green-600 text-white" : "bg-[#8B5CF6] hover:bg-[#7e53db] text-white"
                      }`}
                    >
                      {isAdding ? "Adding..." : isAdded ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
