"use client";

import { useState } from "react";

const initialCategories = [
  { id: "getting-started", name: "Getting Started", count: 8 },
  { id: "orders-shipping", name: "Orders & Shipping", count: 12 },
  { id: "payments", name: "Payments", count: 5 },
  { id: "returns-refunds", name: "Returns & Refunds", count: 4 },
  { id: "account-profile", name: "Account & Profile", count: 6 },
  { id: "products", name: "Products", count: 3 },
  { id: "other", name: "Other", count: 2 },
];

const initialArticles = [
  { id: 1, categoryId: "getting-started", title: "How to create an account", categoryName: "Getting Started", status: "Published", date: "May 10, 2026" },
  { id: 2, categoryId: "orders-shipping", title: "How to place an order", categoryName: "Orders & Shipping", status: "Published", date: "May 12, 2026" },
  { id: 3, categoryId: "payments", title: "Payment methods & security", categoryName: "Payments", status: "Published", date: "May 15, 2026" },
  { id: 4, categoryId: "returns-refunds", title: "How to return a product", categoryName: "Returns & Refunds", status: "Published", date: "May 16, 2026" },
  { id: 5, categoryId: "orders-shipping", title: "Tracking your order", categoryName: "Orders & Shipping", status: "Draft", date: "May 18, 2026" },
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const filteredArticles = articles.filter(a => {
    if (activeCategory !== "all" && a.categoryId !== activeCategory) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
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
            <span className="text-slate-300">Help Center</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Help Center</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage help articles & categories</p>
        </div>
        
        <button 
          onClick={() => setIsArticleModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-[0_0_15px_rgba(140,99,245,0.3)]"
        >
          <span className="material-symbols-outlined text-[18px]">post_add</span>
          New Article
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-64 shrink-0 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-4 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Categories</h3>
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
              activeCategory === "all" 
                ? "bg-[#8C63F5]/10 text-[#8C63F5] font-medium" 
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>All Articles</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${activeCategory === "all" ? "bg-[#8C63F5]/20" : "bg-zinc-800 text-slate-500"}`}>
              {articles.length}
            </span>
          </button>
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
              <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
              Add Category
            </button>
          </div>
        </div>

        {/* Article List */}
        <div className="flex-1 w-full bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#2d2c45] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {activeCategory === "all" ? "All Articles" : initialCategories.find(c => c.id === activeCategory)?.name}
            </h2>
            <div className="flex items-center gap-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 w-full max-w-xs focus-within:border-[#8C63F5] transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
              />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-[#2d2c45] rounded-xl">
                No articles found in this category.
              </div>
            ) : filteredArticles.map(article => (
              <div 
                key={article.id} 
                className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#8C63F5]/10 flex items-center justify-center text-[#8C63F5] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">article</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#8C63F5] transition-colors cursor-pointer">{article.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">folder</span>
                        {article.categoryName}
                      </span>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${article.status === 'Published' ? 'bg-[#10B861]/10 text-[#10B861]' : 'bg-zinc-800 text-slate-400'}`}>
                        {article.status}
                      </span>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <span className="text-xs text-slate-500">Updated {article.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Article Modal Placeholder */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsArticleModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#1A1827] border border-[#2d2c45] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in scale-95 transform transition-all">
            <div className="p-6 border-b border-[#2d2c45] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create Help Article</h2>
              <button onClick={() => setIsArticleModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Article Title</label>
                <input type="text" placeholder="e.g. How to use store credit" className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8C63F5]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                  <select className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8C63F5]">
                    {initialCategories.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                  <select className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8C63F5]">
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Content</label>
                <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-lg overflow-hidden">
                  <div className="bg-[#1A1827] border-b border-[#2d2c45] p-2 flex items-center gap-1">
                    <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
                    <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
                    <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
                    <div className="w-px h-4 bg-[#2d2c45] mx-1"></div>
                    <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><span className="material-symbols-outlined text-[16px]">image</span></button>
                    <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><span className="material-symbols-outlined text-[16px]">link</span></button>
                  </div>
                  <textarea rows="8" placeholder="Write article content here..." className="w-full bg-transparent border-none p-4 text-sm text-white outline-none resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#2d2c45] bg-[#0F0E17]/50 rounded-b-2xl flex items-center justify-between">
              <button className="px-4 py-2 bg-transparent text-slate-400 hover:text-red-400 text-sm font-medium transition-colors">
                Discard
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsArticleModalOpen(false)} className="px-4 py-2 bg-[#1A1827] border border-[#2d2c45] text-slate-300 rounded-lg text-sm font-medium hover:text-white transition-colors">
                  Save Draft
                </button>
                <button className="px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors">
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
