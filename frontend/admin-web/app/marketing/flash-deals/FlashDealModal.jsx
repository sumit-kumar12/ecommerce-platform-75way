"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import ProductSearchSelect from "../../../components/ui/ProductSearchSelect";

const toLocalISOString = (dateObj) => {
  if (!dateObj) return "";
  const tzOffset = dateObj.getTimezoneOffset() * 60000;
  return new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function FlashDealModal({ isOpen, onClose, onSaved, dealToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    productId: null,
    discountType: "PERCENTAGE",
    discountValue: 10,
    startDate: toLocalISOString(new Date()),
    endDate: toLocalISOString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    stockQuantity: 0,
    priority: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (dealToEdit) {
        setFormData({
          name: dealToEdit.name || "",
          productId: dealToEdit.productId || null,
          discountType: dealToEdit.discountType || "PERCENTAGE",
          discountValue: dealToEdit.discountValue || 10,
          startDate: dealToEdit.startDate ? toLocalISOString(new Date(dealToEdit.startDate)) : toLocalISOString(new Date()),
          endDate: dealToEdit.endDate ? toLocalISOString(new Date(dealToEdit.endDate)) : toLocalISOString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
          stockQuantity: dealToEdit.stockQuantity || 0,
          priority: dealToEdit.priority || 0,
          isActive: dealToEdit.isActive ?? true,
        });
      } else {
        setFormData({
          name: "",
          productId: null,
          discountType: "PERCENTAGE",
          discountValue: 10,
          startDate: toLocalISOString(new Date()),
          endDate: toLocalISOString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
          stockQuantity: 0,
          priority: 0,
          isActive: true,
        });
      }
      setError(null);
    }
  }, [isOpen, dealToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductChange = (productId) => {
    setFormData((prev) => ({ ...prev, productId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.productId) {
        throw new Error("Please select a product for the flash deal.");
      }

      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        discountValue: Number(formData.discountValue),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        priority: parseInt(formData.priority, 10),
      };

      if (dealToEdit) {
        await apiRequest(`/admin/flash-deals/${dealToEdit.id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiRequest("/admin/flash-deals", {
          method: "POST",
          body: payload,
        });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while saving the flash deal.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-[#2d2c45]">
          <h2 className="text-xl font-bold text-white">
            {dealToEdit ? "Edit Flash Deal" : "Create New Flash Deal"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300">Deal Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="Midnight Flash Deal"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300">Target Product <span className="text-red-400">*</span></label>
                <ProductSearchSelect value={formData.productId} onChange={handleProductChange} placeholder="Search product by name..." />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Discount Type <span className="text-red-400">*</span></label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5] appearance-none"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Discount Value <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  name="discountValue"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Start Date & Time <span className="text-red-400">*</span></label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">End Date & Time <span className="text-red-400">*</span></label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Flash Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="0 means unlimited"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Display Priority</label>
                <input
                  type="number"
                  name="priority"
                  min="0"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                />
              </div>
            </div>

            <div className="space-y-2 flex items-center pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2d2c45] rounded-full peer peer-checked:bg-[#8C63F5] transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-white">Active Status</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#2d2c45]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#2d2c45] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-medium bg-[#8C63F5] text-white hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              {dealToEdit ? "Save Changes" : "Create Flash Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
