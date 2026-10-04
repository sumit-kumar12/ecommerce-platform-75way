"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { apiRequest } from "../../lib/api";
import { getProductImageUrl } from "../../lib/catalog";

export default function DealsPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 32 });
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchDeals = async () => {
      try {
        const data = await apiRequest("/flash-deals", { csrf: false });
        if (active) setDeals(data?.deals || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDeals();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // Map API flash deals or fallback mock deals to display UI if API is empty
  const displayDeals = deals.length > 0 ? deals.map(deal => {
    const product = deal.product || {};
    const variant = product.variants?.[0] || {};
    const price = variant.price || 0;
    const oldPrice = deal.discountType === "PERCENTAGE" 
      ? price / (1 - deal.discountValue / 100)
      : price + deal.discountValue;
    
    return {
      id: product.id || deal.id,
      name: product.name || deal.name,
      price: price,
      oldPrice: oldPrice,
      discount: deal.discountType === "PERCENTAGE" ? `${deal.discountValue}%` : `₹${deal.discountValue}`,
      rating: 4.5,
      stock: deal.stockQuantity > 0 ? deal.stockQuantity : 10,
      images: [getProductImageUrl(product)].filter(Boolean),
      slug: product.slug || product.id || deal.id
    };
  }) : [
    { id: "32ead0d5-862a-4328-90de-279f2cd42ca1", name: "Apple AirPods Pro 2", price: 12990, oldPrice: 24900, discount: "48%", rating: 4.8, stock: 12, images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop"] },
    { id: "08c997d0-211e-4aef-a4c7-428ec79dd4a9", name: "Noise ColorFit Pro 4", price: 2499, oldPrice: 4999, discount: "50%", rating: 4.5, stock: 4, images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop"] },
    { id: "1fd1e80a-f420-41b6-98a7-6ae88a573456", name: "ASUS ROG Strix G15", price: 89990, oldPrice: 124990, discount: "28%", rating: 4.7, stock: 2, images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop"] },
    { id: "424f27c0-ee23-489b-9918-c3256f855c9a", name: "Sony PS5 Console", price: 44990, oldPrice: 54990, discount: "18%", rating: 4.9, stock: 15, images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b90cd?w=800&auto=format&fit=crop"] },
  ];

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8C63F5]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00DAFF]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 lg:py-24 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 space-y-6">
              <span className="text-[#8C63F5] font-bold tracking-widest uppercase text-sm">Katabazaar Specials</span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                MEGA DEALS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C63F5] to-[#00DAFF]">
                  UP TO 70% OFF
                </span>
              </h1>
              <p className="text-xl text-slate-400">Limited Time Only!</p>
              
              {/* Countdown */}
              <div className="flex items-center gap-4 pt-2 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#1a192b] border border-[#2d2c45] rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-medium">Hours</span>
                </div>
                <span className="text-2xl font-bold text-slate-500 mb-6">:</span>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#1a192b] border border-[#2d2c45] rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-medium">Mins</span>
                </div>
                <span className="text-2xl font-bold text-slate-500 mb-6">:</span>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#8C63F5] rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-[#8C63F5]/20">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-medium">Secs</span>
                </div>
              </div>

              <Link href="/products?sort=latest" className="inline-block bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 transform hover:-translate-y-1">
                Shop All Deals
              </Link>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="text-[140px] md:text-[280px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#8C63F5] to-[#121121] opacity-80 leading-none drop-shadow-2xl select-none">
                %
              </div>
            </div>

          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-16">
          
          {/* Flash Deals Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400 text-[28px]">bolt</span>
                <h2 className="text-2xl font-bold text-white">Flash Deals</h2>
              </div>
              <Link href="/deals/flash" className="text-[#8C63F5] font-semibold hover:text-[#7c3aed] transition-colors flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
              {displayDeals.map((item) => {
                const stock = item.stock || Math.floor(Math.random() * 20) + 1;
                const progressWidth = Math.min((stock / 20) * 100, 100);
                const discount = item.discount || `${Math.floor(Math.random() * 40) + 10}%`;
                const oldPrice = item.oldPrice || Math.floor(item.price * 1.3);
                
                return (
                  <div key={item.id} className="min-w-[280px] sm:min-w-0 bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden group hover:border-[#8C63F5] transition-all flex flex-col h-full relative snap-start">
                    
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded z-10">
                      {discount} OFF
                    </div>
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1a192b]/80 backdrop-blur border border-[#2d2c45] flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors z-10">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>

                    <Link href={`/product/${item.id}`} className="block aspect-[4/3] bg-[#1a192b] flex items-center justify-center overflow-hidden group-hover:bg-[#2d2c45]/30 transition-colors">
                      {item.images?.[0] ? (
                         <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                         <span className="material-symbols-outlined text-[64px] text-slate-600 group-hover:text-white transition-colors duration-500 group-hover:scale-110">image</span>
                      )}
                    </Link>

                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/product/${item.id}`} className="font-bold text-white mb-1 line-clamp-2 hover:text-[#8C63F5] transition-colors">{item.name}</Link>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-[14px] text-amber-400 text-fill">star</span>
                        <span className="text-xs font-medium text-slate-300">{item.rating || '4.5'}</span>
                      </div>
                      
                      {/* Urgency Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Stock</span>
                          <span className="text-rose-400 font-bold">Only {stock} left!</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#2d2c45] rounded-full overflow-hidden">
                          <div className={`h-full ${stock < 5 ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: `${progressWidth}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-bold text-white">₹{new Intl.NumberFormat('en-IN').format(item.price)}</span>
                          <span className="text-sm text-slate-500 line-through">₹{new Intl.NumberFormat('en-IN').format(oldPrice)}</span>
                        </div>
                        
                        <button className="w-full bg-[#8C63F5]/10 hover:bg-[#8C63F5] text-[#8C63F5] hover:text-white border border-[#8C63F5]/30 hover:border-[#8C63F5] font-bold py-2.5 rounded-xl transition-all">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top Deals In Categories */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Top Deals in Categories</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Smartphones", icon: "smartphone", discount: "Up to 40% Off" },
                { name: "Laptops", icon: "laptop_mac", discount: "Up to 30% Off" },
                { name: "Headphones", icon: "headphones", discount: "Up to 60% Off" },
                { name: "Smartwatches", icon: "watch", discount: "Up to 50% Off" },
                { name: "Cameras", icon: "photo_camera", discount: "Up to 25% Off" },
                { name: "Gaming", icon: "sports_esports", discount: "Up to 45% Off" },
              ].map(cat => (
                <Link key={cat.name} href={`/category/${cat.name.toLowerCase()}`} className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5 flex flex-col items-center justify-center text-center group hover:border-[#8C63F5] hover:bg-[#8C63F5]/5 transition-all">
                  <div className="w-14 h-14 rounded-full bg-[#1a192b] group-hover:bg-[#8C63F5]/20 flex items-center justify-center mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[28px] text-slate-400 group-hover:text-[#8C63F5] transition-colors">{cat.icon}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{cat.name}</h4>
                  <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">{cat.discount}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </StoreShell>
  );
}
