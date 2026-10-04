"use client";

import React, { useState } from "react";
import { StoreShell } from "../../components/layout/StoreShell";

export default function OffersPage() {
  const [filter, setFilter] = useState("All");
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const filters = ["All", "Bank", "Partner", "Coupons"];

  const offers = [
    {
      id: 1,
      type: "Coupons",
      icon: "local_offer",
      iconColor: "text-rose-500",
      bgColor: "bg-rose-500/10",
      title: "50% OFF Katabazaar Specials",
      desc: "Get 50% discount on all premium products",
      terms: "Min. Order: ₹999",
      code: "MEGA-DEAL-50",
    }
  ];

  const filteredOffers = filter === "All" ? offers : offers.filter(o => o.type === filter);

  const handleCopy = (code) => {
    if (code !== "No Code Required") {
      navigator.clipboard.writeText(code);
      setToastMessage(`Coupon code ${code} copied!`);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right fade-in">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Full-width Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-[#0f1f1a] border-b border-emerald-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -mb-20 pointer-events-none"></div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 relative z-10 flex items-center justify-between gap-8">
            <div>
              <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-3 block">Katabazaar</span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
                EXCLUSIVE<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">OFFERS</span>
              </h1>
              <p className="text-emerald-100/80 text-lg md:text-xl font-medium">
                Save More With Special Offers &amp; Coupons
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-900/50 transform rotate-6">
                  <span className="material-symbols-outlined text-[64px] text-white">percent</span>
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[20px] text-white">star</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-12">

          {/* Filters */}
          <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-3">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  filter === f
                    ? "bg-[#8C63F5] border-[#8C63F5] text-white"
                    : "bg-[#121121] border-[#2d2c45] text-slate-400 hover:text-white hover:border-slate-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Offers List */}
          <div className="space-y-10">
            
            {["Bank", "Partner", "Coupons"].map((type) => {
              const typeOffers = filteredOffers.filter(o => o.type === type);
              if (typeOffers.length === 0) return null;
              
              const sectionTitle = type === "Bank" ? "Bank Offers" : type === "Partner" ? "Partner Offers" : "Coupon Codes";
              const sectionIcon = type === "Bank" ? "account_balance" : type === "Partner" ? "handshake" : "local_offer";
              
              return (
                <section key={type}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#8C63F5]">{sectionIcon}</span>
                      {sectionTitle}
                    </h2>
                    <button className="text-[#8C63F5] text-sm font-bold hover:underline">View All</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {typeOffers.map(offer => {
                      // Different rendering based on type
                      if (type === "Bank") {
                        const isExpanded = expandedOffer === offer.id;
                        return (
                          <div key={offer.id} className="bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden hover:border-[#8C63F5] transition-colors">
                            <div 
                              className="p-6 cursor-pointer flex gap-5"
                              onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                            >
                              <div className={`w-14 h-14 rounded-2xl ${offer.bgColor} flex items-center justify-center shrink-0 border border-[#2d2c45]`}>
                                <span className={`material-symbols-outlined text-[28px] ${offer.iconColor}`}>{offer.icon}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-white text-lg mb-1">{offer.title}</h3>
                                  <span className={`material-symbols-outlined text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                                </div>
                                <p className="text-slate-400 text-sm mb-2">{offer.desc}</p>
                                <div className="flex gap-2">
                                  <span className="bg-[#1a192b] border border-[#2d2c45] text-slate-300 text-xs px-2 py-1 rounded font-mono font-bold tracking-wider">{offer.code}</span>
                                  <span className="text-slate-500 text-xs mt-1">T&C Apply</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Accordion Content */}
                            {isExpanded && (
                              <div className="px-6 pb-6 pt-2 border-t border-[#2d2c45] bg-[#1a192b]/50">
                                <p className="text-sm text-slate-300 mb-4">{offer.terms}</p>
                                {offer.code !== 'No Code Required' && (
                                  <button 
                                    onClick={() => handleCopy(offer.code)}
                                    className="w-full bg-[#8C63F5]/10 hover:bg-[#8C63F5] text-[#8C63F5] hover:text-white border border-[#8C63F5]/30 hover:border-[#8C63F5] font-bold py-2.5 rounded-xl transition-all"
                                  >
                                    Copy Code
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      if (type === "Coupons") {
                        // Tear-off ticket style
                        return (
                          <div key={offer.id} className="relative group hover:-translate-y-1 transition-transform">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-[#121121] border-2 border-dashed border-[#2d2c45] group-hover:border-rose-500/50 rounded-2xl p-6 flex gap-5 items-center">
                              {/* Ticket notches */}
                              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0f0e17] rounded-full border-r-2 border-dashed border-[#2d2c45] group-hover:border-rose-500/50"></div>
                              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0f0e17] rounded-full border-l-2 border-dashed border-[#2d2c45] group-hover:border-rose-500/50"></div>

                              <div className="flex-1 pl-4">
                                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 font-mono font-bold tracking-wider text-sm rounded border border-rose-500/30 mb-3">{offer.code}</span>
                                <h3 className="font-bold text-white text-lg mb-1">{offer.title}</h3>
                                <p className="text-slate-400 text-sm">{offer.terms}</p>
                              </div>
                              <button 
                                onClick={() => handleCopy(offer.code)}
                                className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shrink-0 border border-rose-500/20 mr-4"
                              >
                                <span className="material-symbols-outlined">content_copy</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // Partner Offers (Default)
                      return (
                        <div key={offer.id} className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6 relative group overflow-hidden hover:border-sky-500/50 transition-colors">
                          <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${offer.bgColor}`}></div>
                          <div className="flex gap-5 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-inner">
                              <span className={`material-symbols-outlined text-[28px] ${offer.iconColor}`}>{offer.icon}</span>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-lg mb-1">{offer.title}</h3>
                              <p className="text-slate-400 text-sm mb-3">{offer.desc}</p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">{offer.terms}</span>
                                <span className="text-sky-400 text-xs font-bold uppercase cursor-pointer hover:underline">T&C</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {filteredOffers.length === 0 && (
              <div className="py-20 text-center text-slate-500 border border-dashed border-[#2d2c45] rounded-2xl">
                No offers found in this category.
              </div>
            )}
            
          </div>
        </div>

      </div>
    </StoreShell>
  );
}
