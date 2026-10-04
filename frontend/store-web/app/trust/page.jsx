"use client";

import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { useStoreCategories } from "../../lib/useStoreCategories";

export default function AboutPage() {
  const { categories } = useStoreCategories();

  return (
    <StoreShell
      categories={categories}
      headerOptions={{
        showSearch: true,
        showNav: true,
        showTheme: true,
        showNotifications: true,
        showWishlist: true,
        showCart: true,
        showAccount: true,
        showMobileCategories: true,
      }}
      footerOptions={{
        showCategories: true,
        showAccount: true,
        showSupport: true,
      }}
    >
      <div className="bg-[#0f0e17] min-h-screen text-slate-200">
        
        {/* Clean Hero Section */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden py-24 md:py-32">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8C63F5]/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C63F5] to-[#00DAFF]">Katabazaar</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
              We are a premium digital marketplace dedicated to bringing you the best products, unbeatable deals, and a flawless shopping experience.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#1a192b] border-4 border-[#2d2c45] flex items-center justify-center shrink-0 shadow-2xl shadow-[#8C63F5]/10 relative overflow-hidden group">
            <span className="material-symbols-outlined text-[80px] md:text-[100px] text-[#8C63F5] group-hover:scale-110 transition-transform duration-500">shield_person</span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-sm font-bold text-[#8C63F5] tracking-widest uppercase mb-2">Our Founder</h2>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6">Sumit Kumar</h3>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed max-w-2xl mx-auto md:mx-0">
              As a Certified Ethical Hacker, I founded Katabazaar with a single core philosophy: <strong className="text-white">Security First</strong>. 
              In today's digital age, you shouldn't have to worry about your data or your payments when shopping online. 
            </p>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto md:mx-0">
              I engineered this platform from the ground up to handle your global commerce needs with a high-availability stack designed for speed, absolute security, and a premium customer experience.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-[#121121] border-t border-[#2d2c45] py-20 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-[#1a192b] border border-[#2d2c45] rounded-3xl p-8 hover:border-[#8C63F5] transition-colors group">
                <div className="w-14 h-14 bg-[#8C63F5]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8C63F5]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#8C63F5] text-3xl">verified_user</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Ironclad Security</h4>
                <p className="text-slate-400 leading-relaxed">Enterprise-grade encryption and security protocols protect every single transaction you make.</p>
              </div>

              <div className="bg-[#1a192b] border border-[#2d2c45] rounded-3xl p-8 hover:border-[#8C63F5] transition-colors group">
                <div className="w-14 h-14 bg-[#8C63F5]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8C63F5]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#8C63F5] text-3xl">local_shipping</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Express Delivery</h4>
                <p className="text-slate-400 leading-relaxed">Our advanced logistics network ensures your orders are processed and delivered lightning fast.</p>
              </div>

              <div className="bg-[#1a192b] border border-[#2d2c45] rounded-3xl p-8 hover:border-[#8C63F5] transition-colors group">
                <div className="w-14 h-14 bg-[#8C63F5]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8C63F5]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#8C63F5] text-3xl">diamond</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Premium Quality</h4>
                <p className="text-slate-400 leading-relaxed">We carefully verify every merchant and product to guarantee you receive only the best.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </StoreShell>
  );
}
