"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";

const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Purple", hex: "#8C63F5" },
  { name: "Pink", hex: "#EC4899" },
];

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "UK6", "UK7", "UK8", "UK9", "UK10", "UK11"];

function generateVariants(colors, sizes) {
  if (!colors.length && !sizes.length) return [];
  if (!colors.length) return sizes.map((s) => ({ key: s, size: s, color: "", sku: "", price: "", stock: "", isActive: true }));
  if (!sizes.length) return colors.map((c) => ({ key: c.name, size: "", color: c.name, hex: c.hex, sku: "", price: "", stock: "", isActive: true }));
  return colors.flatMap((c) => sizes.map((s) => ({ key: `${c.name}-${s}`, color: c.name, hex: c.hex, size: s, sku: "", price: "", stock: "", isActive: true })));
}

export default function ProductVariantsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customColor, setCustomColor] = useState("#8C63F5");
  const [customColorName, setCustomColorName] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [variants, setVariants] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, varRes] = await Promise.allSettled([
          apiRequest(`/admin/products/${id}`),
          apiRequest(`/admin/products/${id}/variants`),
        ]);
        if (prodRes.status === "fulfilled") setProduct(prodRes.value?.product || prodRes.value);
        if (varRes.status === "fulfilled" && varRes.value?.variants?.length) {
          const existing = varRes.value.variants;
          // Extract unique colors and sizes from existing
          const colors = [...new Map(existing.filter(v => v.color).map(v => [v.color, { name: v.color, hex: v.colorHex || "#8C63F5" }])).values()];
          const sizes = [...new Set(existing.filter(v => v.size).map(v => v.size))];
          setSelectedColors(colors);
          setSelectedSizes(sizes);
          setVariants(existing.map(v => ({ ...v, key: `${v.color || ""}-${v.size || ""}`, hex: v.colorHex || "#8C63F5" })));
        }
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Regenerate variant matrix whenever color/size selections change
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setVariants((prev) => {
      const newVariants = generateVariants(selectedColors, selectedSizes);
      if (newVariants.length === 0 && selectedColors.length === 0 && selectedSizes.length === 0) {
        // If user cleared everything, maybe they want to revert to a single default variant
        return prev.filter(v => !v.color && !v.size).length ? prev.filter(v => !v.color && !v.size) : [{ key: "-", color: "", size: "", sku: "", price: "", stock: "", isActive: true }];
      }
      return newVariants.map((nv) => {
        const existing = prev.find((p) => p.key === nv.key);
        return existing ? { ...nv, ...existing } : nv;
      });
    });
  }, [selectedColors, selectedSizes]);

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.name === color.name) ? prev.filter((c) => c.name !== color.name) : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const addCustomColor = () => {
    const name = customColorName.trim() || customColor;
    if (!name || selectedColors.some((c) => c.name === name)) return;
    setSelectedColors((prev) => [...prev, { name, hex: customColor }]);
    setCustomColorName("");
  };

  const addCustomSize = () => {
    const s = customSize.trim().toUpperCase();
    if (!s || selectedSizes.includes(s)) return;
    setSelectedSizes((prev) => [...prev, s]);
    setCustomSize("");
  };

  const updateVariant = (key, field, value) => {
    setVariants((prev) => prev.map((v) => v.key === key ? { ...v, [field]: value } : v));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest(`/admin/products/${id}/variants`, {
        method: "POST",
        body: {
          variants: variants.map((v) => ({
            id: v.id,
            color: v.color || undefined,
            colorHex: v.hex || undefined,
            size: v.size || undefined,
            sku: v.sku || undefined,
            price: v.price ? parseFloat(v.price) : undefined,
            stock: v.stock ? parseInt(v.stock, 10) : undefined,
            isActive: v.isActive,
          })),
        },
      });
      showToast("Variants saved successfully!");
    } catch (err) {
      showToast(err.message || "Failed to save variants.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0910] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0910] px-4 py-6 md:px-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2 ${toast.type === "error" ? "bg-rose-500/20 border border-rose-500/40 text-rose-300" : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"}`}>
          <span className="material-symbols-outlined text-[18px]">{toast.type === "error" ? "error" : "check_circle"}</span>
          {toast.message}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/products" className="hover:text-slate-300 transition-colors">Products</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href={`/products/${id}`} className="hover:text-slate-300 transition-colors">{product?.name || "Product"}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Variants</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Product Variants</h1>
          <p className="text-slate-400 text-sm mt-1">Create & manage variants (size, color, etc.)</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !variants.length}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#8C63F5] hover:bg-[#7c3aed] disabled:opacity-50 text-white rounded-xl text-sm font-black shadow-lg shadow-[#8C63F5]/20 transition-all"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[18px]">save</span>}
          Save Variants
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Colors */}
        <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">palette</span>
            Colors
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_COLORS.map((color) => {
              const active = selectedColors.some((c) => c.name === color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color)}
                  title={color.name}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${active ? "border-[#8C63F5] bg-[#8C63F5]/10 text-white" : "border-[#2d2c45] text-slate-400 hover:border-slate-600"}`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" style={{ background: color.hex }} />
                  {color.name}
                  {active && <span className="material-symbols-outlined text-[12px] text-[#8C63F5]">check</span>}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-10 h-9 rounded-lg border border-[#2d2c45] bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder="Color name"
              className="flex-1 bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-3 py-2 text-xs outline-none"
              onKeyDown={(e) => e.key === "Enter" && addCustomColor()}
            />
            <button onClick={addCustomColor} className="px-3 bg-[#8C63F5] text-white rounded-xl text-xs font-bold hover:bg-[#7c3aed] transition-colors">
              +
            </button>
          </div>
          {selectedColors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {selectedColors.map((c) => (
                <span key={c.name} className="flex items-center gap-1 px-2 py-1 bg-[#2d2c45] text-slate-300 rounded-full text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.hex }} />
                  {c.name}
                  <button onClick={() => toggleColor(c)} className="text-slate-500 hover:text-white ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">straighten</span>
            Sizes
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_SIZES.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${active ? "border-[#8C63F5] bg-[#8C63F5]/10 text-white" : "border-[#2d2c45] text-slate-400 hover:border-slate-600"}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom size (e.g. UK12)"
              className="flex-1 bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-xl px-3 py-2 text-xs outline-none"
              onKeyDown={(e) => e.key === "Enter" && addCustomSize()}
            />
            <button onClick={addCustomSize} className="px-3 bg-[#8C63F5] text-white rounded-xl text-xs font-bold hover:bg-[#7c3aed]">+</button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C63F5] text-[18px]">auto_awesome</span>
            Variant Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Colors selected</span>
              <span className="text-white font-bold">{selectedColors.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sizes selected</span>
              <span className="text-white font-bold">{selectedSizes.length}</span>
            </div>
            <div className="h-px bg-[#2d2c45]" />
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total variants</span>
              <span className="text-[#8C63F5] font-black">{variants.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Table */}
      {variants.length > 0 && (
        <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d2c45]">
            <h2 className="text-sm font-bold text-white">Variant Matrix ({variants.length})</h2>
            <button
              onClick={() => setVariants((prev) => prev.map((v) => ({ ...v, isActive: !prev.every((p) => p.isActive) })))}
              className="text-xs text-slate-400 hover:text-white transition-colors font-bold"
            >
              Toggle All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a192b]">
                  <th className="text-left text-xs font-bold text-slate-500 px-4 py-3">Variant</th>
                  <th className="text-left text-xs font-bold text-slate-500 px-4 py-3 hidden sm:table-cell">SKU</th>
                  <th className="text-left text-xs font-bold text-slate-500 px-4 py-3">Price (₹)</th>
                  <th className="text-left text-xs font-bold text-slate-500 px-4 py-3">Stock</th>
                  <th className="text-left text-xs font-bold text-slate-500 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2c45]">
                {variants.map((v, idx) => (
                  <tr key={v.id || v.key || idx} className="hover:bg-[#1a192b]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {v.hex && <span className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0" style={{ background: v.hex }} />}
                        <span className="text-white font-semibold text-xs">{[v.color, v.size].filter(Boolean).join(" / ")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <input
                        type="text"
                        value={v.sku || ""}
                        onChange={(e) => updateVariant(v.key, "sku", e.target.value)}
                        placeholder="Auto"
                        className="w-24 bg-[#2d2c45] border border-transparent focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-lg px-2 py-1 text-xs outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={v.price || ""}
                        onChange={(e) => updateVariant(v.key, "price", e.target.value)}
                        placeholder="0"
                        className="w-20 bg-[#2d2c45] border border-transparent focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-lg px-2 py-1 text-xs outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={v.stock || ""}
                        onChange={(e) => updateVariant(v.key, "stock", e.target.value)}
                        placeholder="0"
                        className="w-16 bg-[#2d2c45] border border-transparent focus:border-[#8C63F5] text-white placeholder-slate-600 rounded-lg px-2 py-1 text-xs outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateVariant(v.key, "isActive", !v.isActive)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${v.isActive ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "bg-slate-700/40 border-slate-600 text-slate-500"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${v.isActive ? "bg-emerald-400" : "bg-slate-600"}`} />
                        {v.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
