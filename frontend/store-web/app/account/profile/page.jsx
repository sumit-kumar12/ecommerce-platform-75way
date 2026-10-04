"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    language: "English",
    about: "",
    isEmailVerified: false,
    isPhoneVerified: false,
  });

  useEffect(() => {
    apiRequest("/users/me")
      .then((payload) => {
        const user = payload?.user || {};
        setForm({
          name: user.name || "Guest User",
          email: user.email || "",
          phone: user.phone || "",
          dob: user.dob || "1995-12-08",
          gender: user.gender || "Male",
          language: user.language || "English",
          about: user.about || "",
          isEmailVerified: user.isEmailVerified || false,
          isPhoneVerified: user.isPhoneVerified || false,
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/users/me", {
        method: "PATCH",
        body: { name: form.name, phone: form.phone },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto xl:mx-0">
      
      <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#2d2c45]">
          <h1 className="text-xl font-bold text-white">Profile Information</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-[#2d2c45]">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8C63F5] to-[#00DAFF] p-0.5">
                <div className="w-full h-full bg-[#121121] rounded-full overflow-hidden border-2 border-[#121121]">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8C63F5] hover:bg-[#7c3aed] text-white flex items-center justify-center transition-colors border-2 border-[#121121]">
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            <button type="button" className="text-sm font-medium text-[#8C63F5] hover:text-[#7c3aed] transition-colors">
              Change Photo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  readOnly
                  className="w-full bg-[#1a192b]/50 border border-[#2d2c45] text-slate-400 rounded-lg px-4 py-2.5 outline-none cursor-not-allowed"
                />
                {form.isEmailVerified ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    Verified
                  </div>
                ) : form.email ? (
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors">
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    Verify Now
                  </button>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                  placeholder="Enter phone number"
                />
                {form.isPhoneVerified ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    Verified
                  </div>
                ) : form.phone ? (
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors">
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    Verify Now
                  </button>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all appearance-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Default Language</label>
              <div className="relative">
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">About You (Optional)</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500 resize-none"
                placeholder="Love shopping on Katabazaar!"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#2d2c45]">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
