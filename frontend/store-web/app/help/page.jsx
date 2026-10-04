"use client";

import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";

export default function HelpCenterPage() {
  const topics = [
    { id: "orders", title: "Orders & Delivery", desc: "Track orders, delivery issues", icon: "local_shipping", link: "/help/faq?topic=orders" },
    { id: "returns", title: "Returns & Refunds", desc: "Return status, refund status", icon: "assignment_return", link: "/help/faq?topic=returns" },
    { id: "payments", title: "Payments", desc: "Payment methods, failed payments", icon: "payment", link: "/help/faq?topic=payments" },
    { id: "account", title: "Account & Profile", desc: "Manage your account, password", icon: "person", link: "/help/faq?topic=account" },
    { id: "products", title: "Products", desc: "Product info, stock, reviews", icon: "inventory_2", link: "/help/faq?topic=products" },
    { id: "offers", title: "Offers & Coupons", desc: "Deals, coupons, discounts", icon: "local_offer", link: "/help/faq?topic=offers" }
  ];

  const popularArticles = [
    { title: "How to track my order?", link: "/help/faq?q=track" },
    { title: "How to return a product?", link: "/help/faq?q=return" },
    { title: "How long does refund take?", link: "/help/faq?q=refund" },
    { title: "Which payment methods are available?", link: "/help/faq?q=payment" }
  ];

  return (
    <StoreShell>
      <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col items-center">
        
        {/* Help Center Hero */}
        <div className="w-full bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden py-16 md:py-24 flex justify-center">
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#8C63F5]/20 rounded-full blur-[80px] -mr-40 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00DAFF]/10 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none"></div>

          <div className="max-w-2xl w-full px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">How can we help you?</h1>
            <p className="text-slate-400 text-lg mb-8">Find answers to all your questions</p>
            
            <div className="relative w-full max-w-xl mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search help articles..." 
                className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-colors shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] w-full px-4 md:px-8 py-12 md:py-16">
          
          {/* Browse by Topics */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Browse by Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map(topic => (
                <Link 
                  key={topic.id} 
                  href={topic.link}
                  className="bg-[#121121] border border-[#2d2c45] hover:border-[#8C63F5]/50 rounded-2xl p-6 transition-all group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8C63F5]/10 border border-[#8C63F5]/20 flex items-center justify-center mb-4 group-hover:bg-[#8C63F5]/20 transition-colors">
                    <span className="material-symbols-outlined text-[24px] text-[#8C63F5]">{topic.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                  <p className="text-sm text-slate-400">{topic.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Popular Articles */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Popular Articles</h2>
              <Link href="/help/faq" className="text-[#8C63F5] font-bold text-sm hover:underline">
                View All Articles
              </Link>
            </div>
            
            <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl divide-y divide-[#2d2c45] overflow-hidden">
              {popularArticles.map((article, i) => (
                <Link 
                  key={i} 
                  href={article.link}
                  className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-500">article</span>
                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{article.title}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-[#8C63F5] transition-colors">chevron_right</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Still Need Help CTA */}
          <section className="bg-gradient-to-br from-[#8C63F5]/20 to-[#8C63F5]/5 border border-[#8C63F5]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8C63F5]/30 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
              <p className="text-slate-300 mb-8">Can't find what you're looking for? Contact our support team directly and we'll help you out.</p>
              <Link 
                href="/help/contact" 
                className="inline-flex items-center gap-2 bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#8C63F5]/20"
              >
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Contact Support
              </Link>
            </div>
          </section>

        </div>
      </div>
    </StoreShell>
  );
}
