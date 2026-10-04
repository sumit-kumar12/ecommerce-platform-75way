"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";

export default function POSDrawer() {
  const router = useRouter();
  
  const [shift, setShift] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Open Shift Form
  const [openingBalance, setOpeningBalance] = useState("1000");
  const [isOpening, setIsOpening] = useState(false);
  
  // Close Shift Form
  const [actualBalance, setActualBalance] = useState("");
  const [notes, setNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchDrawer();
  }, []);

  const fetchDrawer = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/pos/drawer/current");
      setShift(res.shift || null);
      setMetrics(res.metrics || null);
      if (res.metrics) {
        setActualBalance(String(res.metrics.expectedBalance));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShift = async (e) => {
    e.preventDefault();
    setIsOpening(true);
    try {
      await apiRequest("/pos/drawer/open", {
        method: "POST",
        body: { openingBalance: Number(openingBalance) }
      });
      await fetchDrawer();
    } catch (err) {
      alert("Failed to open shift: " + err.message);
    } finally {
      setIsOpening(false);
    }
  };

  const handleCloseShift = async (e) => {
    e.preventDefault();
    setIsClosing(true);
    try {
      await apiRequest(`/pos/drawer/${shift.id}/close`, {
        method: "POST",
        body: { actualBalance: Number(actualBalance), notes }
      });
      setShift(null);
      setMetrics(null);
      alert("Shift closed successfully");
    } catch (err) {
      alert("Failed to close shift: " + err.message);
    } finally {
      setIsClosing(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading drawer...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[calc(100vh-64px)]">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cash Drawer</h1>
          <p className="text-slate-400 mt-1">Manage your active till and reconcile cash drops.</p>
        </div>
        {shift && (
           <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-full">
             Shift Active
           </span>
        )}
      </div>

      {!shift ? (
        // Open Shift UI
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-8 max-w-md mx-auto mt-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
              <span className="material-symbols-outlined text-[#8C63F5] text-3xl">point_of_sale</span>
            </div>
            <h2 className="text-xl font-bold text-white">Open Cash Drawer</h2>
            <p className="text-sm text-zinc-400 mt-2">Enter the starting cash amount in the till.</p>
          </div>

          <form onSubmit={handleOpenShift} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Opening Balance (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-zinc-800 rounded-lg pl-9 pr-4 py-3 text-white text-lg font-mono focus:border-[#8C63F5] outline-none"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isOpening}
              className="w-full py-3.5 bg-[#8C63F5] hover:bg-[#7b53de] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-[#8C63F5]/20 transition-colors"
            >
              {isOpening ? "Opening..." : "Open Shift"}
            </button>
          </form>
        </div>
      ) : (
        // Active Shift UI
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">lock_open_right</span>
              Current Shift Details
            </h3>
            
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 font-sans">Shift Started</span>
                <span className="text-white">{new Date(shift.openedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 font-sans">Opening Balance</span>
                <span className="text-white">₹{Number(shift.openingBalance).toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 font-sans">Cash Sales</span>
                <span className="text-emerald-400">+₹{Number(metrics?.cashSales || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold pt-3 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <span className="text-white font-sans">Expected Cash</span>
                <span className="text-[#8C63F5]">₹{Number(metrics?.expectedBalance || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
              </div>
            </div>
            
            <button onClick={() => router.push("/store-pos/sale")} className="w-full mt-6 py-3 border border-[#8C63F5] text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-xl font-medium transition-colors">
              Return to POS Sale
            </button>
          </div>

          <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400">lock</span>
              Close Shift
            </h3>
            
            <form onSubmit={handleCloseShift} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Actual Cash in Drawer (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={actualBalance}
                    onChange={(e) => setActualBalance(e.target.value)}
                    className="w-full bg-[#0F0E17] border border-zinc-800 rounded-lg pl-9 pr-4 py-3 text-white text-lg font-mono focus:border-red-500 outline-none transition-colors"
                  />
                </div>
                {Number(actualBalance) !== (metrics?.expectedBalance || 0) && (
                  <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Discrepancy of ₹{(Number(actualBalance) - (metrics?.expectedBalance || 0)).toLocaleString('en-IN', {minimumFractionDigits:2})}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Closing Notes / Discrepancy Reason</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  className="w-full bg-[#0F0E17] border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 outline-none min-h-[100px]"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isClosing}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-colors"
              >
                {isClosing ? "Closing..." : "Close Shift & Print Z-Report"}
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
