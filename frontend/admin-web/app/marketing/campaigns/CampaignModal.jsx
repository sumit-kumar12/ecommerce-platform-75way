"use client";

import React, { useState, useEffect } from "react";
import ProductSearchSelect from "../../../components/ui/ProductSearchSelect";
import { apiRequest } from "../../../lib/api";

export default function CampaignModal({ isOpen, onClose, onSaved, campaignToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Image",
    title: "",
    subtitle: "",
    ctaText: "",
    linkUrl: "",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true,
    priority: 0,
    productId: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (campaignToEdit) {
        setFormData({
          name: campaignToEdit.name || "",
          type: campaignToEdit.type || "Image",
          title: campaignToEdit.title || "",
          subtitle: campaignToEdit.subtitle || "",
          ctaText: campaignToEdit.ctaText || "",
          linkUrl: campaignToEdit.linkUrl || "",
          startDate: campaignToEdit.startDate ? new Date(campaignToEdit.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          endDate: campaignToEdit.endDate ? new Date(campaignToEdit.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          isActive: campaignToEdit.isActive ?? true,
          priority: campaignToEdit.priority || 0,
          productId: campaignToEdit.productId || null
        });
      } else {
        setFormData({
          name: "",
          type: "Image",
          title: "",
          subtitle: "",
          ctaText: "",
          linkUrl: "",
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          isActive: true,
          priority: 0,
          productId: null
        });
      }
      setError(null);
    }
  }, [isOpen, campaignToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductChange = (productId) => {
    setFormData(prev => ({ ...prev, productId }));
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
        priority: parseInt(formData.priority, 10)
      };
      
      // Clear empty strings to null/undefined if optional
      if (!payload.title) delete payload.title;
      if (!payload.subtitle) delete payload.subtitle;
      if (!payload.ctaText) delete payload.ctaText;
      if (!payload.linkUrl) delete payload.linkUrl;
      if (!payload.productId) delete payload.productId;

      if (campaignToEdit) {
        await apiRequest(`/admin/campaigns/${campaignToEdit.id}`, {
          method: "PATCH",
          body: payload
        });
      } else {
        await apiRequest("/admin/campaigns", {
          method: "POST",
          body: payload
        });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while saving the campaign.");
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
            {campaignToEdit ? "Edit Campaign" : "Create New Campaign"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Campaign Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                placeholder="Summer Sale 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Media Type <span className="text-red-400">*</span></label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5] appearance-none"
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                placeholder="Huge Discounts!"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                placeholder="Up to 50% off on all items"
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
                style={{ colorScheme: 'dark' }}
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
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">CTA Button Text</label>
              <input
                type="text"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                placeholder="Shop Now"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Target URL</label>
              <input
                type="text"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
                placeholder="/deals"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300">Linked Product (Optional)</label>
              <p className="text-xs text-slate-500 mb-2">Search for a product to link directly to this campaign.</p>
              <ProductSearchSelect value={formData.productId} onChange={handleProductChange} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Display Priority</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8C63F5]"
              />
            </div>

            <div className="space-y-2 flex items-center pt-8">
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
              {campaignToEdit ? "Save Changes" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
