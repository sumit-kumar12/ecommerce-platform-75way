"use client";

import React from "react";

const DENOMINATIONS = [
  { value: 2000, count: 5, total: 10000 },
  { value: 500, count: 6, total: 3000 },
  { value: 200, count: 10, total: 2000 },
  { value: 100, count: 15, total: 1500 },
  { value: 50, count: 20, total: 1000 },
];

export default function CashDrawer() {
  const currentBalance = 25430;
  const openingBalance = 20000;
  const cashSales = 45300;
  const payouts = 39870;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17] flex flex-col justify-center">
      
      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-auto overflow-hidden">
        
        {/* Header / Balance */}
        <div className="p-6 border-b border-zinc-800/60 text-center bg-[#0F0E17]">
          <p className="text-zinc-500 text-sm font-medium mb-1">Current Balance</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">₹{currentBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h2>
        </div>

        <div className="p-6 space-y-8 flex-1">
          
          {/* Ledger Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Opening Balance</span>
              <span className="text-white font-medium">₹{openingBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Sales (Cash)</span>
              <span className="text-emerald-400 font-medium">+₹{cashSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Payouts</span>
              <span className="text-red-400 font-medium">-₹{payouts.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="h-px bg-zinc-800/60 w-full my-2"></div>
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-slate-300">Closing Balance</span>
              <span className="text-white">₹{currentBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
          </div>

          {/* Denominations */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm">Denominations</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {DENOMINATIONS.map((den, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">₹{den.value} × {den.count}</span>
                  <span className="text-slate-300 font-medium">₹{den.total.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action */}
        <div className="p-6 bg-[#0F0E17] border-t border-zinc-800/60">
          <button className="w-full py-4 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20">
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
