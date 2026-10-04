"use client";

import { useState } from "react";

export function ProfileForm({ user }) {
  const [form, setForm] = useState({
    fullName: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+91 98765 43210",
    dob: user?.dob || "1995-08-15",
    gender: user?.gender || "Male",
    language: user?.language || "English",
    currency: user?.currency || "INR",
    bio: user?.bio || "Tech enthusiast and casual gamer.",
    isEmailVerified: user?.isEmailVerified || false,
    isPhoneVerified: user?.isPhoneVerified || false
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Mock API call
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
          <input 
            type="text" 
            className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none transition-colors" 
            value={form.fullName}
            onChange={e => setForm({...form, fullName: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
          <div className="relative">
            <input 
              type="email" 
              className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl pl-4 pr-24 py-3 text-slate-200 outline-none transition-colors" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
            {form.isEmailVerified ? (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#10B861]/20 text-[#10B861] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span> Verified
              </div>
            ) : form.email ? (
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[12px]">warning</span> Verify Now
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
          <div className="relative">
            <input 
              type="tel" 
              className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl pl-4 pr-24 py-3 text-slate-200 outline-none transition-colors" 
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
            {form.isPhoneVerified ? (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#10B861]/20 text-[#10B861] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span> Verified
              </div>
            ) : form.phone ? (
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[12px]">warning</span> Verify Now
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Date of Birth</label>
          <input 
            type="date" 
            className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none transition-colors" 
            value={form.dob}
            onChange={e => setForm({...form, dob: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Gender</label>
          <select 
            className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none transition-colors appearance-none"
            value={form.gender}
            onChange={e => setForm({...form, gender: e.target.value})}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Language</label>
            <select 
              className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none transition-colors appearance-none"
              value={form.language}
              onChange={e => setForm({...form, language: e.target.value})}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Currency</label>
            <select 
              className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none transition-colors appearance-none"
              value={form.currency}
              onChange={e => setForm({...form, currency: e.target.value})}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-300 mb-2">About You (Bio)</label>
        <textarea 
          className="w-full bg-[#121121] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-slate-200 outline-none transition-colors min-h-[120px] resize-y" 
          placeholder="Tell us a bit about yourself..."
          value={form.bio}
          onChange={e => setForm({...form, bio: e.target.value})}
        ></textarea>
      </div>

      <div className="flex justify-end pt-6 border-t border-[#2d2c45]">
        <button 
          type="submit" 
          disabled={saving}
          className="bg-[#8C63F5] hover:bg-[#6a64f1] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#8C63F5]/20 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Saving...</>
          ) : (
            <><span className="material-symbols-outlined text-[20px]">save</span> Save Changes</>
          )}
        </button>
      </div>
    </form>
  );
}
