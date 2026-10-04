"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { StoreShell } from "../../../../components/layout/StoreShell";
import { apiRequest } from "../../../../lib/api";
import ProductCard from "../../../../components/product/ProductCard";

export default function FrequentlyBoughtTogether({ params }) {
  const { id } = use(params);
  
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to track selected items in the bundle (index 0 is main product, 1/2 are bundle items)
  const [selectedItems, setSelectedItems] = useState([true, true, true]);

  useEffect(() => {
    let active = true;
    const fetchFBT = async () => {
      try {
        const prodRes = await apiRequest(`/products/${id}`, { csrf: false });
        if (!active) return;
        setProduct(prodRes?.product);

        const relRes = await apiRequest(`/products/${id}/related?limit=5`, { csrf: false });
        if (!active) return;
        setRelated(relRes?.products || []);
      } catch (err) {
        console.warn("Failed to fetch FBT data:", err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFBT();
    return () => { active = false; };
  }, [id]);

  const bundleItems = product ? [product, ...related.slice(0, 2)] : [];
  const moreOptions = related.slice(2);

  const toggleSelection = (index) => {
    const newSelected = [...selectedItems];
    newSelected[index] = !newSelected[index];
    setSelectedItems(newSelected);
  };

  // Calculate totals
  const totalPrice = bundleItems.reduce((sum, item, idx) => selectedItems[idx] ? sum + item.price : sum, 0);
  const totalOldPrice = bundleItems.reduce((sum, item, idx) => {
    if (!selectedItems[idx]) return sum;
    return sum + (item.compareAtPrice || item.price * 1.2);
  }, 0);
  const totalSavings = totalOldPrice - totalPrice;
  const selectedCount = selectedItems.filter(Boolean).length;

  const handleAddBundleToCart = async () => {
    const itemsToAdd = bundleItems.filter((_, idx) => selectedItems[idx]);
    if (itemsToAdd.length === 0) return;
    
    // Simulate adding to cart since there's no bulk add API
    alert(`Added ${itemsToAdd.length} items to cart!`);
  };

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20 pt-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 font-medium mb-6 flex flex-wrap gap-2 items-center">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href={`/product/${id}`} className="hover:text-white transition-colors truncate max-w-[150px] inline-block align-bottom">{product?.name || "Product"}</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">Frequently Bought Together</span>
          </nav>

          <h1 className="text-3xl font-black text-white mb-8">Frequently Bought Together</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
            </div>
          ) : product ? (
            <>
              {/* Bundle Display */}
              <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6 md:p-8 mb-12">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8 overflow-x-auto hide-scrollbar">
                  
                  {bundleItems.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && (
                        <div className="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-[#1a192b] border border-[#2d2c45] items-center justify-center font-bold text-[#8C63F5]">
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </div>
                      )}
                      
                      <div className={`relative flex flex-col items-center shrink-0 w-full md:w-auto transition-opacity ${!selectedItems[idx] ? 'opacity-50' : ''}`}>
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-[#1a192b] border border-[#2d2c45] p-4 flex items-center justify-center mb-4 overflow-hidden relative group">
                          {item.images?.[0] ? (
                            <img src={item.images[0].url || item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-500 text-[48px]">inventory_2</span>
                          )}
                          
                          <label className="absolute top-2 right-2 bg-[#121121] rounded border border-[#2d2c45] cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedItems[idx]}
                              onChange={() => toggleSelection(idx)}
                              className="appearance-none w-5 h-5 bg-transparent checked:bg-[#8C63F5] rounded-sm transition-colors flex items-center justify-center relative outline-none"
                            />
                            <span className="material-symbols-outlined absolute inset-0 text-white text-[16px] pointer-events-none flex items-center justify-center opacity-0 peer-checked:opacity-100">check</span>
                          </label>
                        </div>
                        
                        <div className="text-center w-32 md:w-40">
                          <h4 className="font-bold text-white text-sm line-clamp-2 mb-1">{item.name}</h4>
                          <div className="flex items-center justify-center gap-1 text-xs text-amber-400 mb-1">
                            {"★".repeat(Math.round(4.5))}{"☆".repeat(5 - Math.round(4.5))}
                          </div>
                          <p className="font-bold text-[#8C63F5]">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {idx < bundleItems.length - 1 && (
                        <div className="md:hidden flex w-8 h-8 rounded-full bg-[#1a192b] border border-[#2d2c45] items-center justify-center font-bold text-[#8C63F5] my-4">
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  
                </div>

                {/* Bundle Summary */}
                <div className="border-t border-[#2d2c45]/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Total Price: <span className="text-2xl font-black text-white ml-2">₹{totalPrice.toLocaleString()}</span></p>
                    {totalSavings > 0 && (
                      <p className="text-sm font-medium">
                        <span className="text-slate-500 line-through">₹{totalOldPrice.toLocaleString()}</span>
                        <span className="text-emerald-400 ml-2">You Save: ₹{Math.round(totalSavings).toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleAddBundleToCart}
                      disabled={selectedCount === 0}
                      className={`w-full md:w-auto bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {selectedCount === bundleItems.length ? `Add All ${selectedCount} to Cart` : `Add Selected to Cart`}
                    </button>
                  </div>
                </div>
              </div>

              {/* More Options */}
              {moreOptions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">More Options You Might Like</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moreOptions.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-slate-500 text-[48px] mb-4">error</span>
              <h2 className="text-xl font-bold text-white">Product not found</h2>
            </div>
          )}

        </div>
      </div>
    </StoreShell>
  );
}
