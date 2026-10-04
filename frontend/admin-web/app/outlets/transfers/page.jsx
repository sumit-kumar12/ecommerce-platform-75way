"use client";

import React, { useState } from "react";

const OUTLETS = [
  { id: "mumbai", name: "Katabazaar Mumbai", city: "Mumbai, MH", stock: "1,820" },
  { id: "bangalore", name: "Katabazaar Bangalore", city: "Bangalore, KA", stock: "2,150" },
  { id: "delhi", name: "Katabazaar Delhi", city: "New Delhi, DL", stock: "940" },
  { id: "chennai", name: "Katabazaar Chennai", city: "Chennai, TN", stock: "1,200" },
];

export default function StockTransferPage() {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState("mumbai");
  const [destination, setDestination] = useState("bangalore");

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[800px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs text-slate-500 mb-1">Commerce Control</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Stock Transfer</h1>
        <p className="text-sm text-slate-400 mt-1">Transfer stock between outlets</p>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl">
        {/* Stepper */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-[#2d2c45] bg-[#0F0E17]">
          {[
            { num: 1, label: "From Outlet" },
            { num: 2, label: "To Outlet" },
            { num: 3, label: "Products" },
            { num: 4, label: "Review" },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s.num ? "bg-[#8C63F5] text-white shadow-lg shadow-[#8C63F5]/20" : "bg-[#2d2c45] text-slate-400"
                }`}>
                  {s.num}
                </div>
                <span className={`text-xs font-bold ${step >= s.num ? "text-white" : "text-slate-500"} hidden sm:block`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div className="flex-1 h-[2px] bg-[#2d2c45] mx-2 -translate-y-[10px] relative">
                  {step > i + 1 && (
                    <div className="absolute top-0 left-0 bottom-0 bg-[#8C63F5] w-full animate-slide-right origin-left"></div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-8 animate-fade-in">
          {/* Source & Destination (Enhanced with Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            {/* From Outlet */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">From Outlet</label>
              <div className="space-y-3">
                {OUTLETS.map(outlet => (
                  <div 
                    key={`from-${outlet.id}`}
                    onClick={() => setSource(outlet.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      source === outlet.id 
                        ? "bg-[#8C63F5]/10 border-[#8C63F5] shadow-lg shadow-[#8C63F5]/10" 
                        : "bg-[#0F0E17] border-[#2d2c45] hover:border-[#8C63F5]/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-white">{outlet.name}</p>
                        <p className="text-xs text-slate-400">{outlet.city}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        source === outlet.id ? "border-[#8C63F5]" : "border-slate-500"
                      }`}>
                        {source === outlet.id && <div className="w-2 h-2 rounded-full bg-[#8C63F5]"></div>}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">Available Stock</p>
                    <p className="text-lg font-bold text-slate-300">{outlet.stock}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Arrow */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#2d2c45] rounded-full items-center justify-center text-white z-10 border-4 border-[#1A1827] shadow-xl">
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </div>

            {/* To Outlet */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">To Outlet</label>
              <div className="space-y-3">
                {OUTLETS.map(outlet => (
                  <div 
                    key={`to-${outlet.id}`}
                    onClick={() => setDestination(outlet.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      destination === outlet.id 
                        ? "bg-[#8C63F5]/10 border-[#8C63F5] shadow-lg shadow-[#8C63F5]/10" 
                        : "bg-[#0F0E17] border-[#2d2c45] hover:border-[#8C63F5]/50"
                    } ${source === outlet.id ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-white">{outlet.name}</p>
                        <p className="text-xs text-slate-400">{outlet.city}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        destination === outlet.id ? "border-[#8C63F5]" : "border-slate-500"
                      }`}>
                        {destination === outlet.id && <div className="w-2 h-2 rounded-full bg-[#8C63F5]"></div>}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">Available Stock</p>
                    <p className="text-lg font-bold text-slate-300">{outlet.stock}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#2d2c45]">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Transfer Date</label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue="2024-05-31"
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Delivery</label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue="2024-06-02"
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Remarks (Optional)</label>
            <textarea
              placeholder="Enter remarks..."
              rows={3}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-[#2d2c45] bg-[#0F0E17] flex justify-between items-center">
          <button className="px-6 py-2.5 bg-[#1A1827] border border-[#2d2c45] text-slate-300 rounded-lg text-sm font-medium hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => setStep(Math.min(4, step + 1))}
            className="px-8 py-2.5 bg-[#8C63F5] hover:bg-[#7b53e4] text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#8C63F5]/20"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
