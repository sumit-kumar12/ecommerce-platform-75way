"use client";

import React from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const STORES = [
  { name: "Indiranagar", stock: 42 },
  { name: "HSR Layout", stock: 18 },
  { name: "Whitefield", stock: 12 },
  { name: "Koramangala", stock: 6 },
];

const MOVEMENT_DATA = [
  { day: "May 25", in: 20, out: 15 },
  { day: "May 26", in: 0, out: 8 },
  { day: "May 27", in: 50, out: 12 },
  { day: "May 28", in: 0, out: 25 },
  { day: "May 29", in: 10, out: 5 },
  { day: "May 30", in: 0, out: 18 },
  { day: "May 31", in: 30, out: 10 },
];

export default function InventoryCheck() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Check</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Outlets</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-auto">
        
        {/* Search */}
        <div className="p-4 border-b border-zinc-800/60">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search product..." 
              defaultValue="Wireless Headphones"
              className="pl-10 pr-4 py-2.5 bg-[#0F0E17] border border-[#8C63F5]/50 shadow-[0_0_10px_rgba(140,99,245,0.1)] rounded-xl text-sm text-white placeholder-zinc-600 outline-none w-full"
            />
          </div>
        </div>

        <div className="p-6 space-y-8 flex-1">
          
          {/* Product & Summary */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#0F0E17] border border-zinc-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-zinc-400 text-[24px]">headphones</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-0.5">Wireless Headphones</h3>
              <p className="text-xs text-zinc-500">SKU: WH-1001</p>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-zinc-800/60 bg-[#0F0E17] rounded-xl border border-zinc-800/60 p-4">
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Total</p>
              <h4 className="text-xl font-bold text-white">48</h4>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Available</p>
              <h4 className="text-xl font-bold text-emerald-400">42</h4>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Reserved</p>
              <h4 className="text-xl font-bold text-[#F59E0B]">6</h4>
            </div>
          </div>

          {/* Stock by Store */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm">Stock by Store</h3>
            <div className="space-y-3">
              {STORES.map((store, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{store.name}</span>
                  <span className="text-white font-medium">{store.stock}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Movement */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm">Stock Movement</h3>
            <div className="h-[120px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={MOVEMENT_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" hide />
                  <Tooltip 
                    cursor={{fill: '#27272a', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="in" name="Inbound" fill="#8C63F5" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="out" name="Outbound" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
