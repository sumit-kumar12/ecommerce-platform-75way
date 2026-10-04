"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "DRAFT"];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    brand: "",
    price: "",
    salePrice: "",
    stockQuantity: "",
    sku: "",
    status: "ACTIVE",
    paymentAllowCOD: true,
    paymentOnlineOnly: false,
    paymentMinCODPrice: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productRes, catRes] = await Promise.allSettled([
          apiRequest(`/products/${id}`),
          apiRequest("/products/categories/tree", { csrf: false }),
        ]);
        if (productRes.status === "fulfilled") {
          const p = productRes.value?.product || productRes.value;
          setProduct(p);
          setForm({
            name: p.name || "",
            description: p.description || "",
            categoryId: p.categoryId || p.category?.id || "",
            brand: p.brand || "",
            price: p.price?.toString() || "",
            salePrice: p.salePrice?.toString() || "",
            stockQuantity: (p.stockQuantity ?? p.stock ?? "").toString(),
            sku: p.sku || "",
            status: p.isActive ? "ACTIVE" : "INACTIVE",
            paymentAllowCOD: p.paymentAllowCOD ?? true,
            paymentOnlineOnly: p.paymentOnlineOnly ?? false,
            paymentMinCODPrice: p.paymentMinCODPrice?.toString() || "",
          });
        }
        if (catRes.status === "fulfilled") {
          setCategories(catRes.value?.categories || []);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        if (err?.code === "NOT_FOUND" || err?.message?.includes("404")) {
          setIsNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest(`/admin/products/${id}`, {
        method: "PATCH",
        body: {
          name: form.name || undefined,
          description: form.description && form.description.length >= 10 ? form.description : undefined,
          categoryId: form.categoryId || undefined,
          price: form.price ? parseFloat(form.price) : undefined,
          stockQuantity: form.stockQuantity !== "" ? parseInt(form.stockQuantity, 10) : undefined,
          isActive: form.status === "ACTIVE",
          paymentAllowCOD: form.paymentAllowCOD,
          paymentOnlineOnly: form.paymentOnlineOnly,
          paymentMinCODPrice: form.paymentMinCODPrice !== "" ? Number(form.paymentMinCODPrice) : null,
        },
      });
      showToast("Product updated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to update product.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (isNotFound) notFound();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0910] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  const productImage = product?.images?.[0]?.url || product?.imageUrl;

  return (
    <div className="min-h-screen bg-[#0a0910] px-4 py-6 md:px-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2 transition-all ${
          toast.type === "error" ? "bg-rose-500/20 border border-rose-500/40 text-rose-300" : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
        }`}>
          <span className="material-symbols-outlined text-[18px]">{toast.type === "error" ? "error" : "check_circle"}</span>
          {toast.message}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/products" className="hover:text-slate-300 transition-colors">Products</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Edit Product</span>
      </div>

      {/* Hero / Overview Panel */}
      <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Product Image Thumbnail */}
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-[#1a192b] border border-[#2d2c45] flex items-center justify-center">
          {productImage ? (
            <img src={productImage} alt={product?.name || "Product Image"} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-3xl text-slate-600">image_not_supported</span>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-white truncate">{product?.name || "Loading..."}</h2>
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase ${
              form.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              form.status === "INACTIVE" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}>
              {form.status}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-500">payments</span>
              <span className="font-semibold text-slate-200">₹{form.price || "0"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-500">inventory_2</span>
              <span>Stock: <span className="text-slate-200 font-semibold">{form.stockQuantity || "0"}</span></span>
            </div>
            {form.sku && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-slate-500">tag</span>
                <span>SKU: <span className="text-slate-200">{form.sku}</span></span>
              </div>
            )}
          </div>
        </div>

        {/* View in Store Mock Link */}
        <div className="shrink-0 mt-4 md:mt-0 w-full md:w-auto">
          <Link href="#" className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a192b] border border-[#2d2c45] text-slate-300 hover:text-white hover:border-[#8C63F5]/40 rounded-xl text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            View in Store
          </Link>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Edit Product</h1>
          <p className="text-slate-400 text-sm mt-1">Update product information, pricing & status</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href={`/products/${id}/analytics`} className="flex items-center gap-2 px-4 py-2 bg-[#1a192b] border border-[#2d2c45] text-slate-300 rounded-xl text-sm font-semibold hover:border-[#8C63F5]/40 transition-colors">
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Analytics
          </Link>
          <Link href={`/products/${id}/media`} className="flex items-center gap-2 px-4 py-2 bg-[#1a192b] border border-[#2d2c45] text-slate-300 rounded-xl text-sm font-semibold hover:border-[#8C63F5]/40 transition-colors">
            <span className="material-symbols-outlined text-[18px]">photo_library</span>
            Media
          </Link>
          <Link href={`/products/${id}/variants`} className="flex items-center gap-2 px-4 py-2 bg-[#1a192b] border border-[#2d2c45] text-slate-300 rounded-xl text-sm font-semibold hover:border-[#8C63F5]/40 transition-colors">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Variants
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5 md:p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">info</span>
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the product..."
                  rows={4}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
                  <div className="relative">
                    <select
                      value={form.categoryId}
                      onChange={(e) => handleChange("categoryId", e.target.value)}
                      className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white rounded-xl px-4 py-3 text-sm outline-none appearance-none transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Brand</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    placeholder="e.g. Nike, Apple"
                    className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5 md:p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">payments</span>
              Pricing & Stock
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl pl-8 pr-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Sale Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => handleChange("salePrice", e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl pl-8 pr-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Stock Quantity *</label>
                <input
                  type="number"
                  value={form.stockQuantity}
                  onChange={(e) => handleChange("stockQuantity", e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="e.g. PROD-001"
                  className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Options Card */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5 md:p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">payments</span>
              Payment Options
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-200">Allow Cash on Delivery</h3>
                  <p className="text-slate-500 text-xs mt-1">Customers can choose COD at checkout for this product.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={form.paymentAllowCOD}
                    onChange={(e) => handleChange("paymentAllowCOD", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[#1a192b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C63F5]"></div>
                </label>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-200">Force Online Payment Only</h3>
                  <p className="text-slate-500 text-xs mt-1">Strictly disable COD for this item.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={form.paymentOnlineOnly}
                    onChange={(e) => handleChange("paymentOnlineOnly", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[#1a192b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Minimum Product Price for COD</label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="Leave empty for no minimum"
                    className="w-full bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl pl-8 pr-4 py-3 text-sm outline-none transition-colors"
                    value={form.paymentMinCODPrice}
                    onChange={(e) => handleChange("paymentMinCODPrice", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5 md:p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">toggle_on</span>
              Status
            </h2>
            <div className="flex gap-3 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleChange("status", s)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    form.status === s
                      ? s === "ACTIVE"
                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400"
                        : s === "INACTIVE"
                        ? "bg-rose-500/15 border-rose-500/50 text-rose-400"
                        : "bg-amber-500/15 border-amber-500/50 text-amber-400"
                      : "bg-[#1a192b] border-[#2d2c45] text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    s === "ACTIVE" ? "bg-emerald-400" : s === "INACTIVE" ? "bg-rose-400" : "bg-amber-400"
                  } ${form.status !== s ? "opacity-40" : ""}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Image Preview & Notes */}
        <div className="space-y-5">
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">image</span>
              Product Image
            </h2>
            <div className="aspect-square rounded-xl overflow-hidden bg-[#1a192b] border border-[#2d2c45] flex items-center justify-center mb-3">
              {productImage ? (
                <img src={productImage} alt={product?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-5xl">image_not_supported</span>
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
            <Link href={`/products/${id}/media`} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a192b] border border-[#2d2c45] hover:border-[#8C63F5]/50 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-colors">
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
              Manage Media
            </Link>
          </div>

          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">info</span>
              Note
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              This form for 275 days awaits your next edit. Click Update Product to save all changes. Variant-level pricing can be set in the <Link href={`/products/${id}/variants`} className="text-[#8C63F5] hover:underline">Variants</Link> tab.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-[#2d2c45]">
        <Link href="/products" className="w-full sm:w-auto text-center px-6 py-3 bg-[#1a192b] border border-[#2d2c45] text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-colors">
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.price}
          className="w-full sm:w-auto px-8 py-3 bg-[#8C63F5] hover:bg-[#7c3aed] disabled:opacity-50 text-white rounded-xl text-sm font-black shadow-lg shadow-[#8C63F5]/20 transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><span className="material-symbols-outlined text-[18px]">save</span> Update Product</>
          )}
        </button>
      </div>
    </div>
  );
}
