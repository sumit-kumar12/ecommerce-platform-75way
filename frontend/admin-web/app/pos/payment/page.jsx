"use client";

import React, { useState } from "react";

const METHODS = [
  { id: "cash", label: "Cash", icon: "payments" },
  { id: "upi", label: "UPI", icon: "qr_code_scanner" },
  { id: "card", label: "Card", icon: "credit_card" },
  { id: "split", label: "Split Payment", icon: "call_split" },
];

export default function Payment() {
  const [method, setMethod] = useState("cash");
  const [received, setReceived] = useState(15000);
  const payable = 14890;
  
  const change = Math.max(0, received - payable);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17] flex flex-col justify-center">
      
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-auto overflow-hidden">
        
        {/* Header / Total */}
        <div className="p-6 border-b border-zinc-800/60 text-center bg-[#0F0E17]">
          <p className="text-zinc-500 text-sm font-medium mb-1">Total Payable</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">₹{payable.toLocaleString('en-IN')}</h2>
        </div>

        <div className="p-6 space-y-6 flex-1">
          
          {/* Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-white mb-4">Select Payment Method</p>
            {METHODS.map((m) => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  method === m.id 
                    ? 'border-[#8C63F5] bg-[#8C63F5]/10 shadow-[0_0_15px_rgba(140,99,245,0.1)]' 
                    : 'border-zinc-800/60 hover:border-zinc-600 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${method === m.id ? 'text-[#8C63F5]' : 'text-zinc-400'}`}>
                    {m.icon}
                  </span>
                  <span className={`font-medium ${method === m.id ? 'text-white' : 'text-slate-300'}`}>
                    {m.label}
                  </span>
                </div>
                {method === m.id && (
                  <span className="material-symbols-outlined text-[#8C63F5]">check_circle</span>
                )}
              </button>
            ))}
          </div>

          {/* Cash inputs */}
          {method === "cash" && (
            <div className="space-y-4 pt-4 border-t border-zinc-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Cash Received</span>
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={received}
                    onChange={(e) => setReceived(Number(e.target.value))}
                    className="w-full bg-[#0F0E17] border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-right text-white text-sm outline-none focus:border-[#8C63F5]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-medium">Change</span>
                <span className="text-emerald-400 font-bold text-lg">₹{change.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

        </div>

        {/* Action */}
        <div className="p-6 bg-[#0F0E17] border-t border-zinc-800/60">
          <button className="w-full py-4 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20">
            Process Payment
          </button>
        </div>

      </div>
    </div>
  );
}
