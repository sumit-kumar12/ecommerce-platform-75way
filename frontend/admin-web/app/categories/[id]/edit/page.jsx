"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";

const flattenTree = (nodes, depth = 0) =>
  nodes.flatMap((node) => [{ ...node, depth }, ...flattenTree(node.children || [], depth + 1)]);

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
    iconName: "category",
    isActive: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [treePayload, categoryPayload] = await Promise.all([
          apiRequest("/admin/categories/tree"),
          apiRequest(`/admin/categories/${id}`)
        ]);
        
        const flatCategories = flattenTree(treePayload.categories || []);
        setCategories(flatCategories);

        const currentCategory = categoryPayload.category;
        if (currentCategory) {
          setFormData({
            name: currentCategory.name || "",
            slug: (currentCategory.name || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            parentId: currentCategory.parentId || "",
            description: currentCategory.description || "",
            iconName: currentCategory.iconName || "category",
            isActive: currentCategory.isActive ?? true
          });
        }
      } catch (err) {
        console.error("Failed to load category:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(`/admin/categories/${id}`, {
        method: "PATCH",
        body: {
          name: formData.name,
          parentId: formData.parentId || null,
          description: formData.description,
          iconName: formData.iconName,
          isActive: formData.isActive
        }
      });
      router.push("/categories");
    } catch (err) {
      console.error("Failed to update category:", err);
      alert(err.message || "Failed to update category");
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-slate-400 text-center">Loading category...</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/categories" className="hover:text-slate-300 transition-colors">Categories</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Edit Category</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Category</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 md:p-8 space-y-6">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category Name <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#8C63F5] transition-colors"
              placeholder="e.g. Electronics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Slug <span className="text-xs text-slate-500 font-normal ml-2">(auto-generated)</span></label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2.5 text-slate-400 focus:outline-none focus:border-[#8C63F5] transition-colors"
              placeholder="e.g. electronics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Parent Category</label>
            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8C63F5] transition-colors appearance-none"
            >
              <option value="">None (Top Level)</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === id}>
                  {'\u00A0'.repeat(c.depth * 4)} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#8C63F5] transition-colors h-24 resize-none"
              placeholder="Enter category description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Material Icon Name</label>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-[#0F0E17] border border-[#2d2c45] flex items-center justify-center text-zinc-400">
                <span className="material-symbols-outlined text-[24px]">{formData.iconName || "category"}</span>
              </div>
              <input 
                type="text" 
                name="iconName"
                value={formData.iconName}
                onChange={handleChange}
                className="flex-1 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#8C63F5] transition-colors"
                placeholder="e.g. devices, category, checkroom"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B861]"></div>
            </label>
            <span className="text-sm font-medium text-slate-300">Active Status</span>
          </div>

        </div>

        <div className="pt-6 border-t border-[#2d2c45] flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#8C63F5] text-white hover:bg-[#7b53e4] transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
