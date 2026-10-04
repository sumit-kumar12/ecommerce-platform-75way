"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { apiRequest, resolveAdminApiBase } from "../../lib/api";
import { ProductsTable } from "../../components/products/ProductsTable";

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState({
    All: 0, Active: 0, Inactive: 0, "Out of Stock": 0
  });

  const [showFilters, setShowFilters] = useState(false);
  const [categoryId, setCategoryId] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportRef = useRef(null);
  useClickOutside(exportRef, () => setExportMenuOpen(false));

  const limit = 20;

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const payload = await apiRequest("/admin/categories");
        const items = payload.items || payload.categories || payload;
        setCategories(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
      });
      if (activeTab !== "All") params.append("status", activeTab.toUpperCase().replace(/ /g, "_"));
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (categoryId !== "All") params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      
      const payload = await apiRequest(`/admin/products?${params.toString()}`);
      setProducts(payload.items || []);
      setSelectedIds([]);
      setTotal(payload.total || 0);
      
      if (payload.counts) {
        setTabCounts(payload.counts);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, debouncedSearch, categoryId, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => apiRequest(`/admin/products/${id}`, { method: 'DELETE' })));
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete products:", err);
      alert("Failed to delete some products.");
      fetchProducts();
    }
  };

  const handleBulkStatus = async (isActive) => {
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => apiRequest(`/admin/products/${id}`, { 
        method: 'PATCH', 
        body: { isActive }
      })));
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status of some products.");
      fetchProducts();
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      setLoading(true);
      await apiRequest(`/admin/products/${productId}`, { 
        method: 'PATCH', 
        body: { isActive: !currentStatus }
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiRequest(`/admin/products/${productId}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  };

  const handleExport = async (includeVariants) => {
    setExportMenuOpen(false);
    try {
      const adminBase = await resolveAdminApiBase();
      const params = new URLSearchParams();
      if (activeTab !== "All") params.append("status", activeTab.toUpperCase().replace(/ /g, "_"));
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (categoryId !== "All") params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (includeVariants) params.append("includeVariants", "true");

      const url = `${adminBase}/products/export?${params.toString()}`;
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `products-export-${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Failed to export products", err);
      alert("Failed to export products. Please try again.");
    }
  };

  const tabs = [
    { label: "All" },
    { label: "Active" },
    { label: "Inactive" },
    { label: "Out of Stock" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your catalog, pricing, and availability.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={exportRef}>
            <button 
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
            
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1A1827] border border-[#2d2c45] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => handleExport(false)}
                  className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-[#8C63F5] hover:text-white transition-colors"
                >
                  Export Products CSV
                </button>
                <div className="h-px bg-[#2d2c45]"></div>
                <button 
                  onClick={() => handleExport(true)}
                  className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-[#8C63F5] hover:text-white transition-colors"
                >
                  Export With Variants
                </button>
              </div>
            )}
          </div>
          <Link href="/products/bulk-import" className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Import
          </Link>
          <Link href="/products/new" className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-xl text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 bg-[#1A1827] border border-[#2d2c45] rounded-xl px-4 py-2.5 w-full md:w-96 focus-within:border-[#8C63F5] focus-within:ring-1 focus-within:ring-[#8C63F5] transition-all shadow-sm">
          <span className="material-symbols-outlined text-zinc-400 text-[20px]">search</span>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 bg-[#1A1827] border ${showFilters ? 'border-[#8C63F5] text-[#8C63F5]' : 'border-[#2d2c45] text-zinc-300'} rounded-xl text-sm font-medium hover:text-white transition-all shadow-sm`}
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-4 mb-6 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-zinc-400">Category</label>
            <select 
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-zinc-400">Min Price</label>
            <input 
              type="number"
              placeholder="0.00"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]"
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-zinc-400">Max Price</label>
            <input 
              type="number"
              placeholder="0.00"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]"
            />
          </div>

          <div className="flex items-end flex-none">
            <button 
              onClick={() => { setCategoryId("All"); setMinPrice(""); setMaxPrice(""); setPage(1); }}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#2d2c45] overflow-x-auto whitespace-nowrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.label)}
            className={`pb-4 text-sm font-medium flex items-center gap-2 transition-colors relative ${
              activeTab === tab.label ? "text-[#8C63F5]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === tab.label 
                ? "bg-[#8C63F5] text-white" 
                : "bg-[#1A1827] text-zinc-400"
            }`}>
              {activeTab === tab.label ? total : (tabCounts[tab.label] || 0)}
            </span>
            {activeTab === tab.label && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C63F5] rounded-t-full shadow-[0_-2px_10px_rgba(140,99,245,0.4)]" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <div className="w-8 h-8 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm">Loading products...</p>
        </div>
      ) : (
        <>
          {selectedIds.length > 0 && (
            <div className="mt-6 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
              <span className="text-sm font-medium text-indigo-400">{selectedIds.length} product(s) selected</span>
              <div className="flex gap-2">
                <button onClick={() => handleBulkStatus(true)} className="px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg text-sm font-medium text-[#10b981] hover:bg-[#10b981]/20 transition-colors">
                  Set Active
                </button>
                <button onClick={() => handleBulkStatus(false)} className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm font-medium text-yellow-500 hover:bg-yellow-500/20 transition-colors">
                  Set Inactive
                </button>
                <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-sm">
            <ProductsTable 
              products={products} 
              onDelete={handleDelete} 
              onToggleStatus={handleToggleStatus}
              selectedIds={selectedIds}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
            />
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-zinc-400">
              Showing {products.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} products
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[#1A1827] border border-[#2d2c45] rounded-lg text-sm font-medium text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 bg-[#1A1827] border border-[#2d2c45] rounded-lg text-sm font-medium text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
