"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { StoreShell } from "../../../../components/layout/StoreShell";
import { apiRequest } from "../../../../lib/api";

export default function ShareProduct({ params }) {
  const { id } = use(params);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      try {
        const prodRes = await apiRequest(`/products/${id}`, { csrf: false });
        if (active && prodRes?.product) {
          setProduct(prodRes.product);
        }
      } catch (err) {
        console.warn("Failed to fetch product:", err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProduct();
    return () => { active = false; };
  }, [id]);

  // Construct product URL
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${id}` : `https://katabazaar.com/product/${id}`;
  
  // Use a public QR code generation API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(productUrl)}&color=8C63F5&bgcolor=1a192b`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    setToastMessage("Link copied to clipboard!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const shareOptions = [
    { name: "WhatsApp", icon: "forum", bg: "bg-green-500", url: `https://wa.me/?text=${encodeURIComponent(`Check out ${product?.name} on Katabazaar! ${productUrl}`)}` },
    { name: "Facebook", icon: "facebook", bg: "bg-blue-600", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}` },
    { name: "Twitter", icon: "cruelty_free", bg: "bg-sky-500", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out ${product?.name}!`)}` },
    { name: "Telegram", icon: "send", bg: "bg-blue-400", url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out ${product?.name}!`)}` },
    { name: "Email", icon: "mail", bg: "bg-rose-500", url: `mailto:?subject=${encodeURIComponent(`Check out ${product?.name}`)}&body=${encodeURIComponent(`I thought you might like this product: ${productUrl}`)}` }
  ];

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20 pt-8">
        <div className="max-w-xl mx-auto px-4 md:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 font-medium mb-6 flex flex-wrap gap-2 items-center justify-center md:justify-start">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href={`/product/${id}`} className="hover:text-white transition-colors truncate max-w-[150px] inline-block align-bottom">{product?.name || "Product"}</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">Share</span>
          </nav>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-emerald-500/20 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              {toastMessage}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
            </div>
          ) : product ? (
            <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1a192b] to-[#2d2c45]/30 p-6 flex items-center justify-between border-b border-[#2d2c45]">
                <h1 className="text-xl font-bold text-white">Share Product</h1>
                <Link href={`/product/${id}`} className="w-8 h-8 rounded-full bg-[#121121] border border-[#2d2c45] text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </Link>
              </div>

              <div className="p-6 md:p-8">
                
                {/* Product Card */}
                <div className="flex items-center gap-4 mb-8 bg-[#1a192b] p-4 rounded-xl border border-[#2d2c45]">
                  <div className="w-16 h-16 bg-[#121121] rounded-lg border border-[#2d2c45] overflow-hidden shrink-0 flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img src={product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-500">inventory_2</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#8C63F5] uppercase tracking-wider mb-1">{product.category?.name || "Product"}</p>
                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">₹{Number(product.variants?.[0]?.price || 0).toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <span className="material-symbols-outlined text-[12px] text-fill">star</span>
                        <span>4.6</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Icons */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-400 mb-4">Share via</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                    {shareOptions.map(opt => (
                      <a 
                        key={opt.name} 
                        href={opt.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${opt.bg} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined">{opt.icon}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{opt.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Copy Link */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-400 mb-4">Copy Link</h4>
                  <div className="flex bg-[#1a192b] border border-[#2d2c45] rounded-xl p-1">
                    <input 
                      type="text" 
                      readOnly 
                      value={productUrl} 
                      className="flex-1 bg-transparent text-sm text-slate-300 px-3 py-2 outline-none w-full"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="shrink-0 bg-[#8C63F5] hover:bg-[#7c3aed] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-[#8C63F5]/20 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      Copy
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="border-t border-[#2d2c45]/50 pt-8 text-center">
                  <h4 className="text-sm font-bold text-slate-400 mb-6">Or Share via QR Code</h4>
                  <div className="inline-block bg-[#1a192b] p-4 rounded-2xl border border-[#2d2c45] shadow-lg">
                    <div className="bg-white p-2 rounded-xl">
                      <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 md:w-40 md:h-40 rounded-lg" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 max-w-[200px] mx-auto">Scan this code with your phone's camera to view the product.</p>
                </div>

              </div>
            </div>
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
