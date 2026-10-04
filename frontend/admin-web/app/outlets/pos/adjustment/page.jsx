"use client";

import React, { useState } from "react";

export default function StockAdjustment() {
  const currentStock = 42;
  const [type, setType] = useState("Increase");
  const [quantity, setQuantity] = useState(10);
  
  const newStock = type === "Increase" ? currentStock + quantity : currentStock - quantity;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17] flex flex-col justify-center">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Adjust Stock</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Inventory</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-auto overflow-hidden">
        
        <div className="p-6 space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Product</label>
            <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors appearance-none relative">
              <option>Wireless Headphones (Current: 42)</option>
              <option>Smart Watch Pro (Current: 18)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Adjustment Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors appearance-none relative"
            >
              <option>Increase</option>
              <option>Decrease</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Quantity</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Reason</label>
            <select className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors appearance-none relative">
              <option>Stock recount</option>
              <option>Damage / Breakage</option>
              <option>Theft / Loss</option>
              <option>Internal Use</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Reference</label>
            <input 
              type="text" 
              defaultValue="INV-ADJ-4502"
              className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>

        </div>

        <div className="p-6 bg-[#0F0E17] border-t border-zinc-800/60">
          <div className="flex items-center justify-between mb-6">
            <span className="text-slate-300 font-medium">New Stock</span>
            <span className="text-2xl font-bold text-[#8C63F5]">{newStock}</span>
          </div>
          <button className="w-full py-4 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20">
            Apply Adjustment
          </button>
        </div>

      </div>
    </div>
  );
}
