"use client";

import React, { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Boat Rockerz 450", sku: "BR450", category: "Electronics", stock: 48, status: "In Stock", image: "🎧" },
  { id: 2, name: "Milton Water Bottle", sku: "MWB1000", category: "Home & Kitchen", stock: 12, status: "Low Stock", image: "🫙" },
  { id: 3, name: "Surf Excel Matic 1kg", sku: "SEXM1", category: "Groceries", stock: 0, status: "Out of Stock", image: "🫧" },
  { id: 4, name: "Puma T-Shirt (M)", sku: "PTS-M", category: "Fashion", stock: 25, status: "In Stock", image: "👕" },
  { id: 5, name: "Amul Milk 1L", sku: "AML1L", category: "Groceries", stock: 36, status: "In Stock", image: "🥛" },
];

export default function InventoryCheck() {
  const [activeTab, setActiveTab] = useState("All Items");

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-full">
      
      {/* Search and Scan */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">search</span>
          <input 
            type="text" 
            placeholder="Search product by name, SKU or barcode" 
            className="w-full bg-[#1A1827] border border-zinc-800/60 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-700 bg-[#1A1827] text-white font-medium hover:bg-zinc-800 transition-colors shrink-0">
          <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
          Scan Barcode
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span className="text-sm">Total Items</span>
          </div>
          <h3 className="text-3xl font-bold text-white">2,456</h3>
        </div>
        
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span className="text-sm">In Stock</span>
          </div>
          <h3 className="text-3xl font-bold text-white">1,872</h3>
        </div>
        
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span className="text-sm">Low Stock</span>
          </div>
          <h3 className="text-3xl font-bold text-white">342</h3>
        </div>
        
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span className="text-sm">Out of Stock</span>
          </div>
          <h3 className="text-3xl font-bold text-white">242</h3>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden">
        
        <div className="p-4 md:p-6 border-b border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
            {["All Items", "Low Stock", "Out of Stock"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? "bg-[#8C63F5] text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <select className="w-full bg-[#0F0E17] border border-zinc-700/80 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] appearance-none">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Groceries</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#0F0E17] text-slate-300 text-sm font-medium hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider bg-[#1A1827]">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-center">Stock</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PRODUCTS.map((prod) => (
                <tr key={prod.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#0F0E17] border border-zinc-800/60 flex items-center justify-center text-lg">
                      {prod.image}
                    </div>
                    <span className="text-slate-300 font-medium">{prod.name}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono">{prod.sku}</td>
                  <td className="px-6 py-4 text-slate-300">{prod.category}</td>
                  <td className="px-6 py-4 text-center font-medium text-white">{prod.stock}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      prod.status === 'In Stock' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : prod.status === 'Low Stock'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-1">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 md:p-6 border-t border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0F0E17]">
          <p className="text-sm text-zinc-500">Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">5</span> of <span className="text-white font-medium">2,456</span> items</p>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#8C63F5] text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-300 hover:bg-zinc-800/50 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-300 hover:bg-zinc-800/50 transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-300 hover:bg-zinc-800/50 transition-colors">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-300 hover:bg-zinc-800/50 transition-colors">5</button>
            <span className="w-8 h-8 flex items-center justify-center text-zinc-500">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-300 hover:bg-zinc-800/50 transition-colors">492</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
