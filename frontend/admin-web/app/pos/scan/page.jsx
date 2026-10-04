"use client";

import React from "react";

export default function BarcodeScan() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17] flex flex-col justify-center">
      
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-8 flex flex-col items-center">
        
        <h2 className="text-xl font-bold text-white mb-8">Scan Barcode</h2>
        
        {/* Scanner Visual */}
        <div className="w-full h-[200px] bg-[#0F0E17] rounded-xl border-2 border-dashed border-zinc-700 relative overflow-hidden flex items-center justify-center mb-8">
          
          {/* Simulated Barcode */}
          <div className="flex gap-1 h-24 items-center opacity-80">
            <div className="w-2 h-full bg-white"></div>
            <div className="w-1 h-full bg-white"></div>
            <div className="w-3 h-full bg-white"></div>
            <div className="w-1 h-full bg-white"></div>
            <div className="w-2 h-full bg-white"></div>
            <div className="w-4 h-full bg-white"></div>
            <div className="w-1 h-full bg-white"></div>
            <div className="w-2 h-full bg-white"></div>
            <div className="w-1 h-full bg-white"></div>
            <div className="w-3 h-full bg-white"></div>
            <div className="w-1 h-full bg-white"></div>
            <div className="w-2 h-full bg-white"></div>
          </div>

          <div className="absolute bottom-4 text-zinc-500 font-mono tracking-widest text-sm">
            8901234567890
          </div>
          
          {/* Scanline Animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

        </div>

        {/* Product Details */}
        <div className="w-full text-center space-y-2 mb-8">
          <h3 className="text-lg font-bold text-slate-200">Wireless Headphones</h3>
          <p className="text-[#8C63F5] font-bold text-xl">₹4,590</p>
          <p className="text-sm text-emerald-400 font-medium">In Stock: 48</p>
        </div>

        {/* Action */}
        <button className="w-full py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium transition-colors">
          Manual Entry
        </button>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
