"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";

export default function CouponModal({ isOpen, onClose, onSaved, couponToEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discountPercent: 10,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    usageLimit: "",
    perCustomerLimit: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (couponToEdit) {
        setFormData({
          title: couponToEdit.title || "",
          code: couponToEdit.code || "",
          discountPercent: couponToEdit.discountPercent || 10,
          startDate: couponToEdit.startDate ? new Date(couponToEdit.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          endDate: couponToEdit.endDate ? new Date(couponToEdit.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          usageLimit: couponToEdit.usageLimit || "",
          perCustomerLimit: couponToEdit.perCustomerLimit || "",
          isActive: couponToEdit.isActive ?? true,
        });
      } else {
        setFormData({
          title: "",
          code: "",
          discountPercent: 10,
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          usageLimit: "",
          perCustomerLimit: "",
          isActive: true,
        });
      }
      setError(null);
    }
  }, [isOpen, couponToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        discountPercent: parseInt(formData.discountPercent, 10),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        perCustomerLimit: formData.perCustomerLimit ? parseInt(formData.perCustomerLimit, 10) : null,
      };

      if (!payload.usageLimit) delete payload.usageLimit;
      if (!payload.perCustomerLimit) delete payload.perCustomerLimit;

      if (couponToEdit) {
        await apiRequest(`/admin/offers/${couponToEdit.id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiRequest("/admin/offers", {
          method: "POST",
          body: payload,
        });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while saving the coupon.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-[#2d2c45]">
          <h2 className="text-xl font-bold text-white">
            {couponToEdit ? "Edit Coupon" : "Create New Coupon"}
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
                <label className="block text-sm font-medium text-slate-300">Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="Summer Sale 20% OFF"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Coupon Code <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white font-mono uppercase focus:outline-none focus:border-[#8C63F5]"
                  placeholder="SUMMER20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Discount (%) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  name="discountPercent"
                  required
                  min="1"
                  max="90"
                  value={formData.discountPercent}
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
                <label className="block text-sm font-medium text-slate-300">Total Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  min="1"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="e.g. 1000"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Per Customer Limit</label>
                <input
                  type="number"
                  name="perCustomerLimit"
                  min="1"
                  value={formData.perCustomerLimit}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="e.g. 1"
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
              {couponToEdit ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
