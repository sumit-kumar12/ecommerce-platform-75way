"use client";

import React, { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", name: "All Questions", count: 42 },
  { id: "account", name: "Account", count: 3 },
  { id: "orders", name: "Orders", count: 10 },
  { id: "payments", name: "Payments", count: 8 },
  { id: "payouts", name: "Payouts", count: 6 },
  { id: "products", name: "Products", count: 5 },
  { id: "refunds", name: "Refunds", count: 4 },
];

const FAQS = [
  { id: 1, category: "products", q: "How do I add a new product?", a: "To add a new product, navigate to the Products tab in the sidebar and click on the 'Add Product' button. Fill in the required details such as Name, Price, Description, and Images, then click Save." },
  { id: 2, category: "payouts", q: "How long does it take to receive payouts?", a: "Payouts are processed automatically every week. Once a settlement is completed, it usually takes 2-3 business days for the funds to reflect in your registered bank account." },
  { id: 3, category: "payments", q: "What are the supported payment methods?", a: "We support a variety of payment methods including Credit/Debit Cards, UPI, Net Banking, and popular Wallets like Paytm and PhonePe." },
  { id: 4, category: "orders", q: "How can I track my orders?", a: "You can track orders from the Orders dashboard. Click on any specific order to view its timeline, shipping status, and tracking ID." },
  { id: 5, category: "refunds", q: "How do I request a refund?", a: "To request a refund for a customer, go to the Refunds section under Moderation Center. Search for the specific Order ID and initiate a refund request." },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = activeCategory === "all" ? FAQS : FAQS.filter(f => f.category === activeCategory);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">FAQ</h2>
          <p className="text-slate-400 mt-1 text-sm">Help merchants with common questions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        
        {/* Left Column: Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-white font-medium mb-4 pl-4">Categories</h3>
          <div className="flex flex-col space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-[#8C63F5] text-white shadow-lg shadow-[#8C63F5]/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span className="font-medium text-sm">{cat.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20' : 'bg-zinc-800'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: FAQ List */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col p-6 min-h-[500px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <h3 className="text-white font-medium text-lg">{CATEGORIES.find(c => c.id === activeCategory)?.name}</h3>
               <div className="relative w-full md:w-72">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
                 <input 
                   type="text" 
                   placeholder="Search questions..." 
                   className="pl-10 pr-4 py-2.5 bg-[#1A1827] border border-zinc-800/80 rounded-xl text-sm text-white placeholder-zinc-500 outline-none focus:border-[#8C63F5] transition-colors w-full"
                 />
               </div>
            </div>
            
            <div className="space-y-4 flex-1">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className={`border rounded-xl transition-colors ${isOpen ? 'bg-[#1A1827] border-[#8C63F5]/30' : 'bg-transparent border-zinc-800/60 hover:border-zinc-700'}`}>
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                    >
                      <span className="font-medium text-slate-200">{faq.q}</span>
                      <span className={`material-symbols-outlined text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#8C63F5]' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-500">No questions found in this category.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
              <p className="text-zinc-400 text-sm">
                Can't find your answer? 
                <Link href="/support/tickets" className="text-[#8C63F5] hover:text-[#7b53de] font-medium ml-2 transition-colors">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
