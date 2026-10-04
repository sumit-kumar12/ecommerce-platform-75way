"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import ProductSearchSelect from "../../../components/ui/ProductSearchSelect";

export default function SponsoredAdModal({ isOpen, onClose, onSaved, adToEdit }) {
  const [formData, setFormData] = useState({
    campaignName: "",
    productId: null,
    adPosition: 1,
    dailyBudget: 100,
    totalBudget: 1000,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (adToEdit) {
        setFormData({
          campaignName: adToEdit.campaignName || "",
          productId: adToEdit.productId || null,
          adPosition: adToEdit.adPosition || 1,
          dailyBudget: adToEdit.dailyBudget || 100,
          totalBudget: adToEdit.totalBudget || 1000,
          startDate: adToEdit.startDate ? new Date(adToEdit.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          endDate: adToEdit.endDate ? new Date(adToEdit.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          status: adToEdit.status || "active",
        });
      } else {
        setFormData({
          campaignName: "",
          productId: null,
          adPosition: 1,
          dailyBudget: 100,
          totalBudget: 1000,
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          status: "active",
        });
      }
      setError(null);
    }
  }, [isOpen, adToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        throw new Error("Please select a product for the sponsored ad.");
      }

      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        adPosition: parseInt(formData.adPosition, 10),
        dailyBudget: Number(formData.dailyBudget),
        totalBudget: Number(formData.totalBudget),
      };

      if (adToEdit) {
        await apiRequest(`/admin/sponsored-ads/${adToEdit.id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiRequest("/admin/sponsored-ads", {
          method: "POST",
          body: payload,
        });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while saving the sponsored ad.");
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
            {adToEdit ? "Edit Sponsored Ad" : "Create Sponsored Ad"}
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
                <label className="block text-sm font-medium text-slate-300">Campaign Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="campaignName"
                  required
                  value={formData.campaignName}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="Diwali Push"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-300">Target Product <span className="text-red-400">*</span></label>
                <ProductSearchSelect value={formData.productId} onChange={handleProductChange} placeholder="Search product by name..." />
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
                <label className="block text-sm font-medium text-slate-300">Daily Budget (₹) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  name="dailyBudget"
                  required
                  min="1"
                  step="0.01"
                  value={formData.dailyBudget}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Total Budget (₹) <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  name="totalBudget"
                  required
                  min="1"
                  step="0.01"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Ad Position <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  name="adPosition"
                  required
                  min="1"
                  value={formData.adPosition}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                  placeholder="e.g., 1 for Top"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Status <span className="text-red-400">*</span></label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5] appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
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
              {adToEdit ? "Save Changes" : "Create Sponsored Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
