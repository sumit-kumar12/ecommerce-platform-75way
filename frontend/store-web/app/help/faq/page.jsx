"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreShell } from "../../../components/layout/StoreShell";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [expandedId, setExpandedId] = useState(1); // Set first item expanded by default

  const categories = [
    'All Categories',
    'Orders & Delivery',
    'Returns & Refunds',
    'Payments',
    'Account & Profile',
    'Products',
    'Offers & Coupons',
    'General'
  ];

  const faqs = [
    { id: 1, q: "How can I track my order?", a: "You can easily track your order by going to My Orders, selecting the order you want to track, and clicking on 'Track Order'. You will also receive email and SMS updates about your order status." },
    { id: 2, q: "What is your return policy?", a: "We offer a 7-day return policy for most items. Items must be unused, in their original packaging, and with all tags attached. Some items like personal care and perishables are non-returnable." },
    { id: 3, q: "How long does a refund take?", a: "Refunds typically take 5-7 business days to reflect in your original payment method after the returned item has been received and inspected." },
    { id: 4, q: "Which payment methods are accepted?", a: "We accept all major Credit/Debit cards, UPI, Net Banking, and Cash on Delivery (COD) for eligible pin codes." },
    { id: 5, q: "How can I change my address?", a: "You can change your delivery address before the order is dispatched. Go to My Orders, select the active order, and click 'Edit Address'." },
    { id: 6, q: "How do I cancel my order?", a: "Orders can be cancelled before they are dispatched. Go to My Orders, select the order, and click 'Cancel Order'." },
    { id: 7, q: "Do you deliver internationally?", a: "Currently, we only deliver within India. We are working on expanding our delivery network." },
    { id: 8, q: "How can I contact customer support?", a: "You can contact our support team via Live Chat, Email, or Phone. Visit our Contact Support page for more details." }
  ];

  return (
    <StoreShell>
      <div className="min-h-screen bg-[#0F0E17] text-white">
        
        {/* Hero */}
        <div className="w-full bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden py-10 md:py-12">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#8C63F5]/10 rounded-full blur-[80px] -mr-40 -mt-20 pointer-events-none"></div>
          
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <nav className="flex items-center text-xs text-slate-500 mb-3 gap-2 uppercase tracking-widest font-bold">
                <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-[#8C63F5]">FAQ</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Frequently Asked Questions</h1>
              <p className="text-slate-400">Find quick answers to common questions</p>
            </div>
            
            <div className="relative w-full md:w-72 shrink-0">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search FAQ..." 
                className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-4 sticky top-24">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                        activeCategory === cat 
                          ? 'bg-[#8C63F5] text-white shadow-lg shadow-[#8C63F5]/20 font-bold' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Top Questions</h2>
              <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl divide-y divide-[#2d2c45] overflow-hidden">
                {faqs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  return (
                    <div key={faq.id} className="group">
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                        className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                      >
                        <span className={`font-bold pr-4 transition-colors ${isExpanded ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {faq.q}
                        </span>
                        <span className={`material-symbols-outlined shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#8C63F5]' : 'text-slate-500 group-hover:text-white'}`}>
                          expand_more
                        </span>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-[#2d2c45]/50 bg-white/[0.02]">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Still Need Help Box inside right column */}
            <div className="bg-gradient-to-br from-[#8C63F5]/10 to-transparent border border-[#8C63F5]/30 rounded-2xl p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Still need help?</h3>
                <p className="text-slate-400 text-sm">Can't find what you're looking for? Contact our support team.</p>
              </div>
              <Link 
                href="/help/contact" 
                className="shrink-0 bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20"
              >
                Contact Support
              </Link>
            </div>
            
          </div>

        </div>
      </div>
    </StoreShell>
  );
}
