"use client";

import React from "react";

const TRANSFER_ITEMS = [
  { id: 1, name: "Amul Milk 1L", available: 36, qty: 10, unit: "Pcs", image: "🥛" },
  { id: 2, name: "Surf Excel Matic 1kg", available: 15, qty: 5, unit: "Pcs", image: "🫧" },
  { id: 3, name: "Fortune Sunflower Oil 1L", available: 18, qty: 8, unit: "Pcs", image: "🛢️" },
  { id: 4, name: "Milton Water Bottle", available: 12, qty: 5, unit: "Pcs", image: "🫙" },
];

export default function StockTransfer() {
  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto min-h-full">
      
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden">
        
        {/* Header Form */}
        <div className="p-6 border-b border-zinc-800/60 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">From Outlet</label>
            <div className="relative">
              <select className="w-full bg-[#0F0E17] border border-zinc-700/80 rounded-lg pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-[#8C63F5] appearance-none">
                <option>Koramangala Outlet</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">To Outlet</label>
            <div className="relative">
              <select className="w-full bg-[#0F0E17] border border-zinc-700/80 rounded-lg pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-[#8C63F5] appearance-none">
                <option>Indiranagar Outlet</option>
                <option>Jayanagar Outlet</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Transfer Date</label>
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
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search product by name, SKU or scan barcode" 
              className="w-full bg-[#0F0E17] border border-zinc-800/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>
        </div>

        {/* Transfer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider bg-[#0F0E17]">
                <th className="px-6 py-4 font-medium w-2/5">Product</th>
                <th className="px-6 py-4 font-medium text-center">Available</th>
                <th className="px-6 py-4 font-medium text-center">Transfer Qty</th>
                <th className="px-6 py-4 font-medium text-center w-32">Unit</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {TRANSFER_ITEMS.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#0F0E17] border border-zinc-800 flex items-center justify-center text-sm shrink-0">
                      {item.image}
                    </div>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-400">{item.available}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      defaultValue={item.qty}
                      className="w-16 mx-auto block bg-[#0F0E17] border border-zinc-700 rounded-lg px-2 py-1.5 text-center text-white text-sm outline-none focus:border-[#8C63F5]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative w-20 mx-auto">
                      <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-300 outline-none appearance-none">
                        <option>{item.unit}</option>
                        <option>Box</option>
                        <option>Kg</option>
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
        </div>

        {/* Summary Footer */}
        <div className="p-6 border-t border-zinc-800/60 bg-[#0F0E17]">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#1A1827] border border-zinc-800/60 rounded-xl p-4">
              <p className="text-xs text-zinc-400 mb-1">Total Items</p>
              <p className="text-xl font-bold text-white">4</p>
            </div>
            <div className="bg-[#1A1827] border border-zinc-800/60 rounded-xl p-4">
              <p className="text-xs text-zinc-400 mb-1">Total Quantity</p>
              <p className="text-xl font-bold text-white">28</p>
            </div>
            <div className="bg-[#1A1827] border border-zinc-800/60 rounded-xl p-4">
              <p className="text-xs text-zinc-400 mb-1">Est. Value</p>
              <p className="text-xl font-bold text-white">₹2,840.00</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-zinc-400 font-medium">Notes</label>
              <textarea 
                rows="2"
                defaultValue="Transfer due to high demand at destination outlet."
                className="w-full bg-[#1A1827] border border-zinc-800/60 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20">
                Create Transfer
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
