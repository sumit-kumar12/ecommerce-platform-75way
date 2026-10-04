"use client";

import React from "react";
import Link from "next/link";

export default function SystemSettings() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/settings" className="hover:text-slate-300 transition-colors">Settings</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">System Preferences</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="text-slate-400 mt-1 text-sm">Configure system preferences</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        
        <div className="p-6 space-y-8">
          
          {/* General Settings */}
          <section>
            <h3 className="text-white font-medium mb-4">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Timezone</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>(GMT+05:30) Asia/Kolkata</option>
                  <option>(GMT+00:00) UTC</option>
                  <option>(GMT-08:00) Pacific Time</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Date Format</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>DD MMM, YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Currency</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Items Per Page</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="pt-6 border-t border-zinc-800/60">
            <h3 className="text-white font-medium mb-4">Security Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Password Policy</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>Strong</option>
                  <option>Medium</option>
                  <option>Basic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Session Timeout</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          </section>

          {/* Business Settings */}
          <section className="pt-6 border-t border-zinc-800/60">
            <h3 className="text-white font-medium mb-4">Business Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Default Tax Rate (%)</label>
                <input 
                  type="number" 
                  defaultValue={18}
                  className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Shipping Charge Type</label>
                <select className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors appearance-none">
                  <option>Per Order</option>
                  <option>Per Item</option>
                  <option>Weight Based</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 font-medium">Return Allowed Days</label>
                <input 
                  type="number" 
                  defaultValue={7}
                  className="w-full bg-[#1A1827] border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#8C63F5] transition-colors"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-zinc-800/60">
          <button className="w-full bg-[#8C63F5] hover:bg-[#7b53de] text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-[#8C63F5]/20">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
