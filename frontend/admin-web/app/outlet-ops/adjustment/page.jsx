"use client";

import React from "react";

const ADJUSTMENT_ITEMS = [
  { id: 1, name: "Boat Rockerz 450", current: 48, adj: "+20", newStock: 68, reason: "New Stock Received", image: "🎧" },
  { id: 2, name: "Milton Water Bottle", current: 12, adj: "+10", newStock: 22, reason: "Stock Correction", image: "🫙" },
  { id: 3, name: "Puma T-Shirt (M)", current: 25, adj: "-5", newStock: 20, reason: "Damaged / Returns", image: "👕" },
];

export default function StockAdjustment() {
  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto min-h-full">
      
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden">
        
        {/* Header Form */}
        <div className="p-6 border-b border-zinc-800/60 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Adjustment Type</label>
            <div className="relative">
              <select className="w-full bg-[#0F0E17] border border-zinc-700/80 rounded-lg pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-[#8C63F5] appearance-none">
                <option>Increase / Add Stock</option>
                <option>Decrease / Remove Stock</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Reference</label>
            <input 
              type="text" 
              defaultValue="ADJ-2024-05-31-001" 
              className="w-full bg-[#0F0E17] border border-zinc-700/80 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Date</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="May 31, 2024" 
                className="w-full bg-[#0F0E17] border border-zinc-700/80 rounded-lg pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-[#8C63F5]"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[18px]">calendar_today</span>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="p-6 border-b border-zinc-800/60">
          <label className="text-xs text-zinc-400 font-medium block mb-2">Select Product</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search product by name, SKU or scan barcode" 
              className="w-full bg-[#0F0E17] border border-zinc-800/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>
        </div>

        {/* Adjustment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider bg-[#0F0E17]">
                <th className="px-6 py-4 font-medium w-1/3">Product</th>
                <th className="px-6 py-4 font-medium text-center">Current Stock</th>
                <th className="px-6 py-4 font-medium text-center">Adjustment</th>
                <th className="px-6 py-4 font-medium text-center">New Stock</th>
                <th className="px-6 py-4 font-medium w-1/4">Reason</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ADJUSTMENT_ITEMS.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#0F0E17] border border-zinc-800 flex items-center justify-center text-sm shrink-0">
                      {item.image}
                    </div>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-400">{item.current}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      defaultValue={item.adj}
                      className="w-20 mx-auto block bg-[#0F0E17] border border-zinc-700 rounded-lg px-2 py-1.5 text-center text-white text-sm outline-none focus:border-[#8C63F5]"
                    />
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-white">{item.newStock}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-300 outline-none appearance-none">
                        <option>{item.reason}</option>
                        <option>Stock Correction</option>
                        <option>Damaged / Returns</option>
                        <option>Theft / Loss</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[16px]">expand_more</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-red-400 transition-colors p-1">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-center border-b border-zinc-800/60">
            <button className="flex items-center gap-2 text-[#8C63F5] text-sm font-medium hover:text-[#7b53de] transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Another Product
            </button>
          </div>
        </div>

        {/* Footer Notes & Attachment */}
        <div className="p-6 bg-[#0F0E17] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Add notes (optional)</label>
            <textarea 
              rows="3"
              defaultValue="Received new stock from central warehouse."
              className="w-full bg-[#1A1827] border border-zinc-800/60 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] resize-none"
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Attachment (optional)</label>
            <div className="w-full h-[76px] border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#8C63F5] hover:bg-[#8C63F5]/5 transition-colors group">
              <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span className="text-sm font-medium">Upload Document</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1">JPG, PNG, PDF up to 5MB</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-zinc-800/60 flex items-center justify-end gap-4 bg-[#1A1827]">
          <button className="px-6 py-2.5 rounded-xl border border-zinc-700 text-slate-300 font-medium hover:text-white hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20">
            Save Adjustment
          </button>
        </div>

      </div>

    </div>
  );
}
