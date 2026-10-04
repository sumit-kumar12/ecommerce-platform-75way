"use client";

import React from "react";

const ITEMS = [
  { name: "Wireless Headphones", qty: 1, price: 4590 },
  { name: "Smart Watch Pro", qty: 1, price: 8990 },
  { name: "Backpack Pro", qty: 2, price: 3780 },
  { name: "Leather Wallet", qty: 1, price: 1290 },
];

export default function Receipt() {
  const subtotal = 15670;
  const discount = 780;
  const total = 14890;
  const paid = 15000;
  const change = 110;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17] flex flex-col justify-center">
      
      {/* Receipt Paper */}
      <div className="bg-white rounded-t-xl rounded-b-md shadow-2xl overflow-hidden relative mx-auto w-full max-w-[360px] text-zinc-900 font-mono text-sm pb-8">
        
        {/* Jagged Bottom Edge */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gZmlsbD0iIzBGMEUxNyIgcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCAiLz48L3N2Zz4=')] bg-repeat-x bg-bottom z-10"></div>

        <div className="p-6">
          
          {/* Header */}
          <div className="text-center border-b border-zinc-300 pb-4 mb-4">
            <h1 className="text-xl font-bold tracking-widest mb-1">KATABAZAAR</h1>
            <p className="text-xs text-zinc-500">Thank you for shopping!</p>
            <div className="flex justify-between items-center text-xs text-zinc-500 mt-4">
              <span>May 31, 10:45 AM</span>
              <span>ORD-125678</span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="pb-2 font-normal w-1/2">Item</th>
                <th className="pb-2 font-normal text-center">Qty</th>
                <th className="pb-2 font-normal text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2 text-xs truncate max-w-[120px]">{item.name}</td>
                  <td className="py-2 text-center text-xs">{item.qty}</td>
                  <td className="py-2 text-right text-xs">{(item.price).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="border-t border-zinc-300 pt-4 space-y-2 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Total Items</span>
              <span>5</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Subtotal</span>
              <span>{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Discount</span>
              <span>-{discount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-zinc-200">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment details */}
          <div className="border-t border-zinc-300 pt-4 space-y-2 mb-8">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Paid (Cash)</span>
              <span>{paid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span>Change</span>
              <span>{change.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Barcode */}
          <div className="flex flex-col items-center justify-center pt-4 border-t border-zinc-300">
            <div className="flex gap-0.5 h-12 items-center mb-2">
              <div className="w-1 h-full bg-black"></div>
              <div className="w-0.5 h-full bg-black"></div>
              <div className="w-2 h-full bg-black"></div>
              <div className="w-0.5 h-full bg-black"></div>
              <div className="w-1 h-full bg-black"></div>
              <div className="w-2 h-full bg-black"></div>
              <div className="w-0.5 h-full bg-black"></div>
              <div className="w-1 h-full bg-black"></div>
              <div className="w-0.5 h-full bg-black"></div>
              <div className="w-1.5 h-full bg-black"></div>
              <div className="w-0.5 h-full bg-black"></div>
              <div className="w-1 h-full bg-black"></div>
            </div>
            <span className="text-[10px] tracking-widest">8901234567890</span>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-[360px] mx-auto w-full">
        <button className="py-3 rounded-xl border border-zinc-700 text-slate-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
          Print Order
        </button>
        <button className="py-3 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white text-sm font-medium transition-colors shadow-lg shadow-[#8C63F5]/20">
          Next Order
        </button>
      </div>

    </div>
  );
}
