"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StoreShell } from "../../components/layout/StoreShell";
import { apiRequest } from "../../lib/api";
import { useStoreCategories } from "../../lib/useStoreCategories";
import { getProductImageUrl } from "../../lib/catalog";

export default function WishlistPage() {
  const { categories } = useStoreCategories();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionMessage, setActionMessage] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest("/wishlist")
      .then(res => {
        if (active && res.wishlist?.items) setProducts(res.wishlist.items);
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleRemove = async (id) => {
    try {
      await apiRequest(`/wishlist/items/${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };
  
  const showMessage = (text, type = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(true);
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) throw new Error("Product variant not found");
      await apiRequest("/cart/items", {
        method: "POST",
        body: { variantId, quantity: 1 },
        csrf: true
      });
      showMessage("Added to cart");
    } catch (err) {
      console.error(err);
      showMessage("Failed to add to cart", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (products.length === 0) return;
    setAddingToCart(true);
    try {
      let successCount = 0;
      for (const p of products) {
        const variantId = p.variants?.[0]?.id;
        if (variantId) {
          try {
             await apiRequest("/cart/items", {
              method: "POST",
              body: { variantId, quantity: 1 },
              csrf: true
            });
            successCount++;
          } catch(e) {
            console.error(e);
          }
        }
      }
      showMessage(`Added ${successCount} items to cart`);
    } catch (err) {
      showMessage("Failed to add items to cart", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <StoreShell categories={categories}>
      <div className="max-w-[1200px] mx-auto px-5 py-10 min-h-[70vh]">
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <span>Account</span> <span className="text-gray-600">/</span> <span className="text-white">Wishlist</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              My Wishlist <span className="bg-white/10 text-sm font-medium px-3 py-1 rounded-full">{products.length}</span>
            </h1>
            <div className="flex items-center gap-4">
              {actionMessage && (
                <span className={`text-sm font-bold ${actionMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {actionMessage.text}
                </span>
              )}
              <button 
                onClick={handleAddAllToCart}
                disabled={addingToCart || products.length === 0}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-full font-bold transition-colors flex items-center justify-center gap-2 text-sm w-full md:w-auto shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
              >
                {addingToCart ? "Adding..." : "Add All To Cart"}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading wishlist...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#121121] border border-[#2d2c45] rounded-3xl text-center shadow-xl">
            <div className="w-40 h-40 bg-[#1a192b] rounded-full flex items-center justify-center mb-8 border-4 border-[#2d2c45]">
              <span className="material-symbols-outlined text-[80px] text-[#8C63F5]">favorite</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-8 max-w-sm">Start adding items you love<br />to see them here.</p>
            <Link href="/products" className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 mb-16">
              Explore Products
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl border-t border-[#2d2c45]/50 pt-12">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-3xl text-[#8C63F5] mb-3">auto_awesome</span>
                <h4 className="text-white font-bold text-sm">Curated for you</h4>
                <p className="text-slate-500 text-xs mt-1">Handpicked collections</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-3xl text-[#8C63F5] mb-3">bookmark_add</span>
                <h4 className="text-white font-bold text-sm">Save for later</h4>
                <p className="text-slate-500 text-xs mt-1">Add items to wishlist</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-3xl text-[#8C63F5] mb-3">search</span>
                <h4 className="text-white font-bold text-sm">Easy Access</h4>
                <p className="text-slate-500 text-xs mt-1">Find anytime</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => {
              const image = getProductImageUrl(p) || "https://placehold.co/400x400/1a1a2e/8B5CF6?text=Image";
              const price = Number(p.variants?.[0]?.price || p.price || 0);
              const compareAtPrice = Number(p.variants?.[0]?.compareAtPrice || 0);

              return (
                <div key={p.id} className="group relative bg-[#0F0E17] rounded-xl border border-white/10 overflow-hidden hover:border-[#8B5CF6]/50 transition-all flex flex-col">
                  {/* Image container */}
                  <div className="relative aspect-square bg-[#1A1A2E] overflow-hidden p-6">
                    <img src={image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    
                    {/* Top right actions */}
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                  
                  {/* Content container */}
                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={`/product/${p.id}`} className="text-white font-semibold hover:text-[#8B5CF6] transition-colors line-clamp-2 mb-2">
                      {p.name}
                    </Link>
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-white">₹{price.toLocaleString('en-IN')}</span>
                        {compareAtPrice > 0 && compareAtPrice > price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">₹{compareAtPrice.toLocaleString('en-IN')}</span>
                            <span className="text-xs font-bold text-green-400">-{Math.round((1 - price / compareAtPrice) * 100)}%</span>
                          </>
                        )}
                      </div>
                      
                      <button onClick={() => handleAddToCart(p)} disabled={addingToCart} className="w-full bg-[#1A1A2E] text-[#8B5CF6] border border-[#8B5CF6] py-2.5 rounded-lg font-semibold hover:bg-[#8B5CF6] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
