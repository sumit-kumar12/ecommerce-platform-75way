"use client";

import React from "react";

const SUPPLIERS = [
  { name: "Tech Distributor", rating: 4.8, phone: "+91 98765 43210", status: "Active" },
  { name: "Gadget World", rating: 4.5, phone: "+91 81234 56789", status: "Active" },
  { name: "Digital Supplies", rating: 3.9, phone: "+91 90000 11122", status: "Inactive" },
];

export default function SupplierManagement() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Suppliers</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Directory</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-[700px]">
        
        {/* Suppliers List */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto hide-scrollbar">
          {SUPPLIERS.map((sup, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/60 bg-[#0F0E17] hover:border-zinc-700 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{sup.name}</h4>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-zinc-400">Rating: {sup.rating}</span>
                  <span className="material-symbols-outlined text-[#F59E0B] text-[14px]">star</span>
                </div>
                <p className="text-xs text-zinc-500">{sup.phone}</p>
              </div>
              
              <div className="flex flex-col items-end justify-between h-full gap-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  sup.status === 'Active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {sup.status}
                </span>
                
                <button className="w-8 h-8 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="p-6 bg-[#0F0E17] border-t border-zinc-800/60 rounded-b-2xl">
          <button className="w-full py-4 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add</span> Add Supplier
          </button>
        </div>

      </div>
    </div>
  );
}
