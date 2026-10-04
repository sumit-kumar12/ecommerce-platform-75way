"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [shippingSettings, setShippingSettings] = useState(null);

  useEffect(() => {
    Promise.all([
      apiRequest("/products/categories/tree", { csrf: false }).catch(() => null),
      apiRequest("/shipping/settings").catch(() => null)
    ]).then(([catRes, shipRes]) => {
      setCategories(catRes?.categories || []);
      setShippingSettings(shipRes?.settings || null);
    });
  }, []);
  
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    brand: "",
    shortDescription: "",
    description: "",
    type: "Single",
    tags: "",
    price: "",
    compareAtPrice: "",
    stockQuantity: "",
    paymentRestriction: "ANY", // ANY or ONLINE_ONLY
    paymentMinCODPrice: "",
  });

  const maxCODPrice = shippingSettings?.maxCODPrice ? Number(shippingSettings.maxCODPrice) : Infinity;
  const isGlobalCODDisabled = shippingSettings?.allowGlobalCOD === false;
  const priceExceedsCODLimit = Number(form.price) > maxCODPrice;
  const mustBeOnlineOnly = isGlobalCODDisabled || priceExceedsCODLimit;
  
  const effectivePaymentRestriction = mustBeOnlineOnly ? "ONLINE_ONLY" : form.paymentRestriction;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/admin/products", {
        method: "POST",
        body: {
          name: form.name,
          categoryId: form.categoryId || undefined, // the API requires this, so we send what we have
          shortDescription: form.shortDescription,
          description: form.description && form.description.length >= 10 ? form.description : (form.description || "Default description") + "          ",
          price: Number(form.price) || 1, // must be positive
          stockQuantity: Number(form.stockQuantity) || 0,
          isDigital: form.type === "Digital",
          paymentAllowCOD: effectivePaymentRestriction === "ANY",
          paymentOnlineOnly: effectivePaymentRestriction === "ONLINE_ONLY",
          paymentMinCODPrice: form.paymentMinCODPrice ? Number(form.paymentMinCODPrice) : undefined,
        },
      });
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      <div className="flex items-center gap-3 text-sm text-zinc-400 mb-6">
        <span className="flex items-center gap-2 bg-[#8C63F5]/20 text-[#8C63F5] px-3 py-1 rounded-full font-medium">
          <span className="w-5 h-5 rounded-full bg-[#8C63F5] text-white flex items-center justify-center text-xs">3</span>
          Add Product
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-white">Add New Product</h1>
          <div className="flex items-center gap-3">
            <button type="button" className="px-4 py-2 bg-transparent border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
              Save as Draft
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Product Title *</label>
              <input
                type="text"
                placeholder="Enter product title"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Category *</label>
                <select
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors appearance-none"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {/* Fallback static options if API returns nothing */}
                  {!categories.length && (
                    <>
                      <option value="" disabled>Loading categories...</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Brand</label>
                <select 
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors appearance-none"
                  value={form.brand}
                  onChange={e => setForm({...form, brand: e.target.value})}
                >
                  <option value="" disabled>Select brand</option>
                  <option value="brand1">Brand 1</option>
                  <option value="brand2">Brand 2</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex justify-between">
                <span>Short Description *</span>
                <span className="text-zinc-600 text-xs">0/100</span>
              </label>
              <textarea
                placeholder="Brief description about product..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors min-h-[80px]"
                value={form.shortDescription}
                onChange={e => setForm({...form, shortDescription: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex justify-between">
                <span>Full Description *</span>
                <span className="text-zinc-600 text-xs">0/5000</span>
              </label>
              <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
                <div className="flex items-center gap-2 p-2 border-b border-zinc-800 bg-zinc-900">
                  {['format_bold', 'format_italic', 'format_underlined', 'format_list_bulleted', 'format_list_numbered', 'link'].map(icon => (
                    <button type="button" key={icon} className="p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 rounded transition-colors">
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Write full description..."
                  className="w-full bg-transparent px-4 py-3 text-sm text-zinc-200 outline-none min-h-[150px] resize-y"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Product Type</label>
              <div className="flex gap-6">
                {['Single', 'Variable', 'Digital'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.type === type ? 'border-[#8C63F5]' : 'border-zinc-600'}`}>
                      {form.type === type && <div className="w-2 h-2 rounded-full bg-[#8C63F5]"></div>}
                    </div>
                    <input type="radio" name="type" className="hidden" checked={form.type === type} onChange={() => setForm({...form, type})} />
                    <span className={`text-sm ${form.type === type ? 'text-white' : 'text-zinc-400'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tags</label>
              <input
                type="text"
                placeholder="Add tags... (Press Enter to add tag)"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors"
                value={form.tags}
                onChange={e => setForm({...form, tags: e.target.value})}
              />
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white">Pricing</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Price *</label>
              <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]" placeholder="0" />
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white">Inventory</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Stock Quantity *</label>
              <input type="number" required value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]" placeholder="0" />
            </div>
          </div>

          {/* Payment Options Card */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white">Payment Options</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Payment Method Restriction</label>
                <select
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors appearance-none"
                  value={effectivePaymentRestriction}
                  onChange={(e) => setForm({ ...form, paymentRestriction: e.target.value })}
                  disabled={mustBeOnlineOnly}
                >
                  <option value="ANY">Any Method (COD + Online)</option>
                  <option value="ONLINE_ONLY">Online Payment Only</option>
                </select>
                {mustBeOnlineOnly && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {isGlobalCODDisabled 
                      ? "COD is disabled globally." 
                      : `COD is disabled because the product price (₹${form.price || 0}) exceeds the global COD limit of ₹${maxCODPrice}.`}
                  </p>
                )}
                {!mustBeOnlineOnly && (
                   <p className="text-xs text-zinc-500 mt-2">Choose whether to allow Cash on Delivery or restrict to Online Payments.</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Minimum Product Price for COD</label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="Leave empty for no minimum"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#8C63F5] transition-colors"
                  value={form.paymentMinCODPrice}
                  onChange={(e) => setForm({...form, paymentMinCODPrice: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white">Media</h2>
            <div className="w-full h-40 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 bg-zinc-900/20">
              Upload images here
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
