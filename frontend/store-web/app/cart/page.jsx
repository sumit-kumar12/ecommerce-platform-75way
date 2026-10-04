"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { CartItem } from "../../components/cart/CartItem";
import { PriceSummary } from "../../components/cart/PriceSummary";
import { CartRecommendations } from "../../components/cart/CartRecommendations";
import { apiRequest } from "../../lib/api";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [cartRes, catRes] = await Promise.all([
          apiRequest("/cart", { csrf: false }).catch(() => null),
          apiRequest("/products/categories/tree", { csrf: false })
        ]);
        if (active) {
          setCart(cartRes?.cart || { items: [] });
          setCategories(catRes?.categories || []);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const res = await apiRequest(`/cart/items/${itemId}`, {
        method: "PUT",
        body: { quantity: newQuantity },
        csrf: true
      });
      if (res.cart) setCart(res.cart);
    } catch (err) {
      showToast("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await apiRequest(`/cart/items/${itemId}`, {
        method: "DELETE",
        csrf: true
      });
      if (res.cart) setCart(res.cart);
      showToast("Item removed from cart");
    } catch (err) {
      showToast("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <StoreShell categories={categories}>
        <div className="min-h-screen bg-[#0F0E17] text-white pt-24 pb-12 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl animate-pulse">
            <div className="h-8 w-48 bg-white/10 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-white/5 rounded-2xl"></div>
                <div className="h-32 bg-white/5 rounded-2xl"></div>
              </div>
              <div className="h-64 bg-white/5 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </StoreShell>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <StoreShell categories={categories}>
      <div className="min-h-screen bg-[#0F0E17] text-white pb-12 relative">
        {toast && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-[#8B5CF6] text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right">
            <span className="material-symbols-outlined">info</span>
            {toast}
          </div>
        )}

        {/* Cart Hero Banner */}
        <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8C63F5]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 relative z-10 flex items-center justify-between gap-4">
            <div>
              <nav className="flex items-center text-xs text-slate-500 mb-3 gap-2 uppercase tracking-widest font-bold">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-[#8C63F5]">Your Cart</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                Your Cart
                {!isEmpty && (
                  <span className="text-base font-bold bg-[#8C63F5] text-white px-3 py-1 rounded-full">
                    {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
                  </span>
                )}
              </h1>
            </div>
            <div className="hidden md:flex">
              <div className="w-20 h-20 rounded-2xl bg-[#8C63F5]/10 border border-[#8C63F5]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[44px] text-[#8C63F5]">shopping_cart</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#121121] border border-[#2d2c45] rounded-3xl text-center shadow-xl">
              <div className="w-40 h-40 bg-[#1a192b] rounded-full flex items-center justify-center mb-8 border-4 border-[#2d2c45]">
                <span className="material-symbols-outlined text-[80px] text-slate-400">shopping_cart</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
              <p className="text-slate-400 mb-8 max-w-sm">Looks like you haven't added anything yet.<br />Let's change that!</p>
              <Link href="/products" className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 mb-16">
                Start Shopping
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl border-t border-[#2d2c45]/50 pt-12">
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-3xl text-[#8C63F5] mb-3">local_shipping</span>
                  <h4 className="text-white font-bold text-sm">Free Shipping</h4>
                  <p className="text-slate-500 text-xs mt-1">On orders above ₹499</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-3xl text-[#8C63F5] mb-3">cached</span>
                  <h4 className="text-white font-bold text-sm">Easy Returns</h4>
                  <p className="text-slate-500 text-xs mt-1">7 days return policy</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-3xl text-[#8C63F5] mb-3">verified_user</span>
                  <h4 className="text-white font-bold text-sm">Secure Payments</h4>
                  <p className="text-slate-500 text-xs mt-1">100% protected</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-4">
                {cart.items.map(item => (
                  <CartItem 
                    key={item.variantId} 
                    item={item} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <PriceSummary cart={cart} setCart={setCart} />
                </div>
              </div>
            </div>
          )}

          <div className="mt-16">
            <CartRecommendations />
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
