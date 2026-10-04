"use client";
import { useState } from "react";

export function CreateOfferModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    code: "",
    discountPercent: "",
    usageLimit: "",
    endDate: ""
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0F0E17]/80 backdrop-blur-sm transition-all" onClick={onClose}>
      <div className="bg-[#1a192b] w-full max-w-lg rounded-2xl overflow-hidden border border-[#8B5CF6]/30 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        
        <div className="px-6 py-5 border-b border-[#8B5CF6]/20 flex items-center justify-between bg-[#0F0E17]/90">
          <div>
            <p className="text-xs font-bold text-[#8C63F5] uppercase tracking-widest mb-1">Marketing</p>
            <h2 className="text-xl font-bold text-slate-100">Create Promotional Offer</h2>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 bg-[#0F0E17]/60 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Campaign Title</label>
            <input 
              type="text" 
              className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none" 
              placeholder="e.g. Summer Mega Sale" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Promo Code</label>
            <input 
              type="text" 
              className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-[#8C63F5] uppercase font-mono font-bold outline-none tracking-widest" 
              placeholder="SUMMER50" 
              value={form.code}
              onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Discount (%)</label>
              <input 
                type="number" 
                className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none" 
                placeholder="20" 
                value={form.discountPercent}
                onChange={e => setForm({...form, discountPercent: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Usage Limit</label>
              <input 
                type="number" 
                className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none" 
                placeholder="Leave empty for unlimited" 
                value={form.usageLimit}
                onChange={e => setForm({...form, usageLimit: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Expiry Date</label>
            <input 
              type="date" 
              className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none" 
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-[#0F0E17] border-t border-[#8B5CF6]/20 flex justify-end gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 transition-colors hover:bg-white/5" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#8C63F5] text-white transition-all hover:bg-[#6a64f1] shadow-lg shadow-[#8C63F5]/20 flex items-center gap-2"
            onClick={() => onSubmit(form)}
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            Launch Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

