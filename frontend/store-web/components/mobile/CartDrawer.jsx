"use client";
import { useEffect } from "react";
import Link from "next/link";
import { formatCatalogPrice, getProductImageUrl, pickCategoryIcon } from "../../lib/catalog";

export function CartDrawer({ open, onClose, cartItems, cartOffers, cartLoading, cartError, cartSubtotal, cartOfferSavings, onQuantityChange, onCheckout }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const itemCount = cartItems.reduce((s, i) => s + Number(i.quantity || 0), 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] z-[999] bg-[#121121] border-l border-[#2d2c45] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Cart drawer"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d2c45] flex-shrink-0">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">My Cart</p>
            <h2 className="text-white font-black text-lg leading-none">
              {itemCount} {itemCount === 1 ? "item" : "items"}
              {cartSubtotal > 0 && <span className="text-[#8C63F5] ml-2">· {formatCatalogPrice(cartSubtotal)}</span>}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close cart">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {cartLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : cartError ? (
            <div className="text-rose-400 text-sm text-center py-10">{cartError}</div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">shopping_bag</span>
              <p className="text-white font-bold mb-1">Cart is empty</p>
              <p className="text-slate-500 text-sm">Add products to get started</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const imageUrl = getProductImageUrl(item.product);
              return (
                <article key={item.variantId} className="flex items-start gap-3 bg-[#1a192b] border border-[#2d2c45] rounded-xl p-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-[#121121] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {imageUrl
                      ? <img src={imageUrl} alt={item.product?.name || item.title} className="w-full h-full object-cover" />
                      : <span className="material-symbols-outlined text-slate-500 text-[28px]">{pickCategoryIcon(item.product?.category || item.product)}</span>
                    }
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-snug truncate mb-0.5">{item.product?.name || item.title}</p>
                    <p className="text-slate-400 text-xs mb-2">{item.title}</p>
                    <div className="flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-1 bg-[#121121] border border-[#2d2c45] rounded-lg overflow-hidden">
                        <button onClick={() => onQuantityChange(item.variantId, Number(item.quantity) - 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="text-white text-sm font-bold w-7 text-center">{item.quantity}</span>
                        <button onClick={() => onQuantityChange(item.variantId, Number(item.quantity) + 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                      <span className="text-[#8C63F5] font-black text-sm">{formatCatalogPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </article>
              );
            })
          )}

          {/* Offers Section */}
          {cartOffers?.length > 0 && (
            <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-3">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">local_offer</span>
                You saved {formatCatalogPrice(cartOfferSavings)} on this order!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-[#2d2c45] px-4 py-4 space-y-3">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-bold">{formatCatalogPrice(cartSubtotal)}</span>
            </div>
            {cartOfferSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Offer savings</span>
                <span className="text-emerald-400 font-bold">-{formatCatalogPrice(cartOfferSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-400">
              <span>Shipping</span>
              <span className="text-white font-bold">Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-black text-white text-base border-t border-[#2d2c45] pt-3">
              <span>Total</span>
              <span className="text-[#8C63F5]">{formatCatalogPrice(cartSubtotal)}</span>
            </div>
            <Link href="/cart" onClick={onClose} className="block w-full text-center bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl transition-colors text-sm">
              View Cart
            </Link>
            <button onClick={onCheckout} disabled={!cartItems.length} className="w-full bg-[#8C63F5] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors shadow-lg shadow-[#8C63F5]/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Checkout Now
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
