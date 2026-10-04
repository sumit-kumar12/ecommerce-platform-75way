"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "../lib/api";

export default function SponsoredBrands() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await apiRequest("/sponsored-ads");
        if (res.ads) {
          setAds(res.ads);
        }
      } catch (err) {
        console.error("Error fetching sponsored ads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  if (!loading && ads.length === 0) return null;

  // Fallback for demonstration based on the plan
  const displayAds = ads.length > 0 ? ads : [
    { id: 1, campaignName: "Audio Week", brand: "boAt", image: "/images/brand-boat.png" },
    { id: 2, campaignName: "Smart Wearables", brand: "Noise", image: "/images/brand-noise.png" },
    { id: 3, campaignName: "Republic Sale", brand: "Realme", image: "/images/brand-realme.png" },
    { id: 4, campaignName: "Never Settle", brand: "OnePlus", image: "/images/brand-oneplus.png" },
    { id: 5, campaignName: "Gaming Setup", brand: "Zebronics", image: "/images/brand-zebronics.png" },
  ];

  return (
    <section className="py-12 bg-background-dark border-b border-border/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary flex items-center gap-2">
            Sponsored Brands <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted border border-border">Ad</span>
          </h2>
        </div>

        <div className="relative">
          <div className="flex gap-4 md:gap-8 items-center overflow-x-auto scrollbar-hide snap-x pb-4">
            {displayAds.map((ad, i) => (
              <Link 
                key={ad.id || i} 
                href="/products"
                className="min-w-[120px] md:min-w-[160px] h-16 md:h-20 bg-surface/50 border border-border/50 rounded-xl flex items-center justify-center p-4 hover:bg-surface hover:border-primary/40 transition-all group snap-start shrink-0 relative"
              >
                {/* Simulated Logo Text if no image */}
                <span className="font-bold text-lg text-text-muted group-hover:text-primary transition-colors">
                  {ad.brand}
                </span>
              </Link>
            ))}
          </div>
          {/* Gradient fades for the edges */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background-dark to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background-dark to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
