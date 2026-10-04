"use client";

import React from "react";

export default function StoreTransfers() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17] flex flex-col justify-center">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">New Transfers</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Outlets</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-auto overflow-hidden">
        
        <div className="p-6 space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">From Store</label>
            <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors appearance-none relative">
              <option>Indiranagar</option>
              <option>HSR Layout</option>
              <option>Whitefield</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">To Store</label>
            <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors appearance-none relative">
              <option>Whitefield</option>
              <option>Indiranagar</option>
              <option>HSR Layout</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Product</label>
            <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors appearance-none relative">
              <option>Smart Watch Pro</option>
              <option>Wireless Headphones</option>
              <option>Leather Wallet</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Quantity</label>
            <input 
              type="number" 
              defaultValue={5}
              className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Expected Date</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="May 31, 2024"
                className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">calendar_today</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Note</label>
            <textarea 
              rows={3}
              defaultValue="Customer demand"
              className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors resize-none"
            />
          </div>

        </div>

        <div className="p-6 bg-[#0F0E17] border-t border-zinc-800/60">
          <button className="w-full py-4 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20">
            Create Transfer
          </button>
        </div>

      </div>
    </div>
  );
}
