"use client";

import React, { useState } from "react";

const INITIAL_CART = [
  { id: 1, name: "Wireless Headphones", price: 4590, qty: 1, icon: "headphones" },
  { id: 2, name: "Smart Watch Pro", price: 8990, qty: 1, icon: "watch" },
  { id: 3, name: "Backpack Pro", price: 1890, qty: 2, icon: "backpack" },
  { id: 4, name: "Leather Wallet", price: 1290, qty: 1, icon: "wallet" },
];

export default function NewSaleCart() {
  const [cart, setCart] = useState(INITIAL_CART);

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = 780;
  const total = subtotal - discount;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">New Sale</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Cart</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-[700px]">
        
        {/* Search */}
        <div className="p-4 border-b border-zinc-800/60">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search product..." 
              className="pl-10 pr-4 py-2.5 bg-[#0F0E17] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-[#8C63F5] transition-colors w-full"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-zinc-800/40 bg-[#0F0E17] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A1827] border border-zinc-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-zinc-400 text-[18px]">{item.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{item.name}</h4>
                  <span className="text-xs text-[#8C63F5] font-medium">₹{(item.price).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end sm:justify-center gap-3">
                <div className="flex items-center bg-[#1A1827] rounded-lg border border-zinc-800 p-0.5">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[14px]">remove</span>
                  </button>
                  <span className="text-sm font-medium text-white w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
                <span className="text-sm font-bold text-white w-16 text-right hidden sm:block">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="p-4 border-t border-zinc-800/60 bg-[#1A1827] space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Discount</span>
            <span className="text-emerald-400">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-px w-full bg-zinc-800/60 my-2"></div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Total</span>
            <span className="text-xl font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 grid grid-cols-2 gap-3 bg-[#0F0E17] rounded-b-2xl border-t border-zinc-800/60">
          <button className="py-3 rounded-xl border border-zinc-700 text-slate-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Hold Sale
          </button>
          <button className="py-3 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white text-sm font-medium transition-colors shadow-lg shadow-[#8C63F5]/20">
            Proceed to Pay
          </button>
        </div>

      </div>
    </div>
  );
}
