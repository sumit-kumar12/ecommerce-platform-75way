"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";

export default function CategoryOrderingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const payload = await apiRequest("/admin/categories");
        // Sort them by current sortOrder
        const sorted = (payload.categories || []).sort((a, b) => a.sortOrder - b.sortOrder);
        setCategories(sorted);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIdx === null || draggedIdx === index) return;
    
    // Swap items visually
    const newItems = [...categories];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setCategories(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...categories];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setCategories(newItems);
  };

  const moveDown = (index) => {
    if (index === categories.length - 1) return;
    const newItems = [...categories];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    setCategories(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const items = categories.map((cat, i) => ({
        id: cat.id,
        parentId: cat.parentId || null,
        sortOrder: i
      }));

      await apiRequest("/admin/categories/reorder", {
        method: "PUT",
        body: { items }
      });
      router.push("/categories");
    } catch (err) {
      console.error("Failed to save category order:", err);
      alert(err.message || "Failed to save category order");
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/categories" className="hover:text-slate-300 transition-colors">Categories</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Category Ordering</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Category Ordering</h1>
          <p className="text-slate-400 mt-1 text-sm">Drag & drop or use arrows to reorder categories</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>

      {/* Sortable List */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-4 md:p-6 min-h-[400px]">
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No categories found.</div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 p-3 bg-[#0F0E17] border border-[#2d2c45] rounded-xl cursor-grab active:cursor-grabbing hover:border-[#8C63F5]/50 hover:bg-[#8C63F5]/5 transition-all ${draggedIdx === index ? 'opacity-50 scale-[0.98]' : 'opacity-100'}`}
              >
                <div className="text-zinc-600 flex items-center justify-center cursor-grab">
                  <span className="material-symbols-outlined">drag_indicator</span>
                </div>
                
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <span className="material-symbols-outlined text-[16px]">{cat.iconName || "category"}</span>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{cat.name}</p>
                  <p className="text-xs text-zinc-500">{cat.products?.length || 0} products</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>
                  <button 
                    onClick={() => moveDown(index)}
                    disabled={index === categories.length - 1}
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
