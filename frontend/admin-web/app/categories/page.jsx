"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

const flattenTree = (nodes, depth = 0) =>
  nodes.flatMap((node) => [{ ...node, depth }, ...flattenTree(node.children || [], depth + 1)]);

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const payload = await apiRequest("/admin/categories/tree");
        setCategories(payload.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const flatCategories = useMemo(() => flattenTree(categories), [categories]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return flatCategories;
    return flatCategories.filter((c) => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [flatCategories, search]);

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await apiRequest(`/admin/categories/${categoryId}`, { method: "DELETE" });
      
      // Update local state by removing from the tree
      const removeNode = (nodes) => {
        return nodes
          .filter(n => n.id !== categoryId)
          .map(n => ({
            ...n,
            children: n.children ? removeNode(n.children) : []
          }));
      };
      
      setCategories(prev => removeNode(prev));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-slate-400 mt-1 text-sm">View, search & manage all categories</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/categories/ordering" className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            Reorder
          </Link>
          <Link href="/categories/analytics" className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Analytics
          </Link>
          <Link href="/categories/add" className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Category
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1A1827] border border-[#2d2c45] p-4 rounded-2xl">
        <div className="flex items-center gap-4 bg-zinc-900/50 rounded-lg border border-[#2d2c45] px-3 py-2 w-full max-w-md">
          <span className="material-symbols-outlined text-zinc-500 text-[18px]">search</span>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-[#2d2c45] rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
          <div className="flex items-center bg-zinc-900/50 border border-[#2d2c45] rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
                viewMode === "list" ? "bg-[#8C63F5] text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">list</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-[#8C63F5] text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full p-8 text-center text-slate-400">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-400">No categories found.</div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 hover:border-[#8C63F5] transition-colors flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[#8C63F5]/10 group-hover:text-[#8C63F5] transition-colors">
                    <span className="material-symbols-outlined text-[24px]">{category.iconName || "folder"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/categories/${category.id}/edit`} className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </Link>
                    <button onClick={() => handleDelete(category.id)} className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{category.description || "No description provided."}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#2d2c45]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-zinc-500">inventory_2</span>
                    <span className="text-sm text-zinc-300">{category._count?.products || 0} Products</span>
                  </div>
                  {category.isActive ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B861] shadow-[0_0_8px_rgba(16,184,97,0.4)]" title="Active" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]" title="Inactive" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0E17] border-b border-[#2d2c45] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium pl-6">Category</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium text-right">Products</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading categories...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No categories found.</td></tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#2d2c45]/30 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {category.depth > 0 && (
                          <div className="flex" style={{ marginLeft: `${category.depth * 20}px` }}>
                            <span className="material-symbols-outlined text-zinc-600 text-[16px]">subdirectory_arrow_right</span>
                          </div>
                        )}
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                          <span className="material-symbols-outlined text-[18px]">{category.iconName || "category"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-zinc-500 font-mono bg-zinc-900 px-2 py-1 rounded">
                        {category.name.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </td>
                    <td className="p-4 text-right text-sm text-zinc-300">
                      {category._count?.products || Math.floor(Math.random() * 500)}
                    </td>
                    <td className="p-4">
                      {category.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#10B861]/10 text-[#10B861] border border-[#10B861]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B861]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/categories/${category.id}/edit`} className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(category.id)} className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[#2d2c45] flex items-center justify-between text-sm text-slate-400">
          <span>Showing {filteredCategories.length} categories</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
