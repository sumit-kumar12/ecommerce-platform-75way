"use client";

import { useState } from "react";

const initialCategories = [
  { id: "all", name: "All Categories", count: 14 },
  { id: "orders", name: "Orders", count: 6 },
  { id: "payments", name: "Payments", count: 4 },
  { id: "shipping", name: "Shipping", count: 4 },
  { id: "returns", name: "Returns", count: 3 },
  { id: "products", name: "Products", count: 3 },
  { id: "account", name: "Account", count: 2 },
];

const initialFaqs = [
  { id: 1, category: "orders", question: "How do I track my order?", answer: "You can track your order using the tracking link sent to your email after your purchase is confirmed.", status: "Published" },
  { id: 2, category: "payments", question: "What payment methods do you accept?", answer: "We accept Visa, MasterCard, American Express, PayPal, and store credit.", status: "Published" },
  { id: 3, category: "shipping", question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Expedited shipping is available at checkout.", status: "Published" },
  { id: 4, category: "returns", question: "Can I return a product?", answer: "Yes, we offer a 30-day return policy for unused items in their original packaging.", status: "Published" },
  { id: 5, category: "account", question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email.", status: "Draft" },
];

export default function FAQManagementPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [faqs, setFaqs] = useState(initialFaqs);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredFaqs = faqs.filter(f => {
    if (activeCategory !== "all" && f.category !== activeCategory) return false;
    if (search && !f.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Support & Help</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">FAQ Management</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">FAQ Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Create & manage frequently asked questions</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-[0_0_15px_rgba(140,99,245,0.3)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add FAQ
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-64 shrink-0 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-4 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Categories</h3>
          {initialCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeCategory === cat.id 
                  ? "bg-[#8C63F5]/10 text-[#8C63F5] font-medium" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${activeCategory === cat.id ? "bg-[#8C63F5]/20" : "bg-zinc-800 text-slate-500"}`}>
                {cat.count}
              </span>
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-[#2d2c45]">
            <button className="flex items-center gap-2 px-3 py-2 w-full text-sm font-medium text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Category
            </button>
          </div>
        </div>

        {/* FAQ List */}
        <div className="flex-1 w-full bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#2d2c45] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {initialCategories.find(c => c.id === activeCategory)?.name || "All FAQs"}
            </h2>
            <div className="flex items-center gap-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 w-full max-w-xs focus-within:border-[#8C63F5] transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
              />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-[#2d2c45] rounded-xl">
                No FAQs found in this category.
              </div>
            ) : filteredFaqs.map(faq => (
              <div 
                key={faq.id} 
                className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl overflow-hidden transition-all duration-300"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                  onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined transition-transform duration-300 text-slate-400 ${expandedFaqId === faq.id ? 'rotate-180 text-[#8C63F5]' : ''}`}>
                      expand_more
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{faq.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 capitalize">{faq.category}</span>
                        <span className="text-slate-600 text-[10px]">•</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${faq.status === 'Published' ? 'bg-[#10B861]/10 text-[#10B861]' : 'bg-zinc-800 text-slate-400'}`}>
                          {faq.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 text-slate-400 hover:text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {expandedFaqId === faq.id && (
                  <div className="p-4 pt-0 border-t border-[#2d2c45] mt-2 text-sm text-slate-300 bg-[#0F0E17]">
                    <div className="pt-3">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add FAQ Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-[#1A1827] border border-[#2d2c45] rounded-2xl shadow-2xl animate-fade-in scale-95 origin-center transform transition-all">
            <div className="p-6 border-b border-[#2d2c45] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New FAQ</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                <select className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8C63F5]">
                  <option>Select Category...</option>
                  <option>Orders</option>
                  <option>Payments</option>
                  <option>Shipping</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Question</label>
                <input type="text" placeholder="e.g. How do I track my order?" className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8C63F5]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Answer</label>
                <textarea rows="4" placeholder="Provide a clear and concise answer..." className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8C63F5] resize-none"></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-[#2d2c45] bg-[#0F0E17]/50 rounded-b-2xl flex items-center justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-transparent text-slate-300 hover:text-white text-sm font-medium transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors">
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
