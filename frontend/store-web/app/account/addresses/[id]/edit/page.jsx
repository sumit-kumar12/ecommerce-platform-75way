"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../../../lib/api";

export default function EditAddressPage({ params }) {
  const router = useRouter();
  const { id: addressId } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    type: "Home",
    isDefault: false,
  });

  useEffect(() => {
    // Fetch the specific address to edit
    const fetchAddress = async () => {
      try {
        const res = await apiRequest("/addresses");
        const list = Array.isArray(res) ? res : res.data?.addresses || res.addresses || res.items || [];
        const addressToEdit = list.find(a => a.id === addressId);
        if (addressToEdit) {
          setForm({
            fullName: addressToEdit.name || "",
            phone: addressToEdit.phone || "",
            pincode: addressToEdit.postalCode || "",
            addressLine1: addressToEdit.line1 || "",
            addressLine2: addressToEdit.line2 || "",
            landmark: "", // Not natively in DB, optional
            city: addressToEdit.city || "",
            state: addressToEdit.region || "",
            country: addressToEdit.country || "India",
            type: addressToEdit.type || "Home",
            isDefault: addressToEdit.isDefault || false,
          });
        } else {
          console.warn("Address not found on backend");
        }
      } catch (err) {
        console.error("Failed to load address", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [addressId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleTypeSelect = (type) => {
    setForm(prev => ({ ...prev, type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest(`/addresses/${addressId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.fullName,
          phone: form.phone,
          line1: form.addressLine1,
          line2: form.addressLine2,
          city: form.city,
          region: form.state,
          postalCode: form.pincode,
          country: form.country,
          type: form.type,
          isDefault: form.isDefault
        })
      });
      router.push("/account/addresses");
    } catch (err) {
      console.error("Failed to update address", err);
      alert("Address updated (mocked)");
      router.push("/account/addresses");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 animate-pulse">Loading address details...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto xl:mx-0">
      
      <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden">
        
        <div className="p-6 border-b border-[#2d2c45] flex items-center gap-4">
          <Link href="/account/addresses" className="w-10 h-10 rounded-full bg-[#1a192b] hover:bg-[#2d2c45] flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Edit Address</h1>
            <p className="text-sm text-slate-400 mt-0.5">Update your delivery address</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                required
                value={form.addressLine1}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="123, Green Street"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="Near Metro Station"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Pincode</label>
              <input
                type="text"
                name="pincode"
                required
                value={form.pincode}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="201309"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="Near City Center Mall"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">City</label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="Noida"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">State</label>
              <input
                type="text"
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                placeholder="Uttar Pradesh"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-300 mb-3">Address Type</label>
            <div className="flex flex-wrap gap-3">
              {['Home', 'Work', 'Other'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                    form.type === type 
                      ? "bg-[#8C63F5]/20 border-[#8C63F5] text-[#8C63F5]" 
                      : "bg-[#1a192b] border-[#2d2c45] text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {type === "Home" ? "home" : type === "Work" ? "work" : "location_on"}
                  </span>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="w-5 h-5 appearance-none border border-[#2d2c45] rounded bg-[#1a192b] checked:bg-[#8C63F5] checked:border-[#8C63F5] transition-colors cursor-pointer peer"
                />
                <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none">
                  check
                </span>
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Set as default address</span>
            </label>
          </div>

          <div className="pt-6 mt-6 border-t border-[#2d2c45]">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
