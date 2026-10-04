"use client";

import React, { useState, useEffect } from "react";
import { adminRequest } from "../../../lib/api";

export default function BarcodeScanner() {
  const [quantity, setQuantity] = useState(1);
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchSku = async (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminRequest(`/products/search?q=${encodeURIComponent(query)}`);
      if (res?.products && res.products.length > 0) {
        setProduct(res.products[0]);
      } else {
        setError("Product not found");
        setProduct(null);
      }
    } catch (err) {
      setError(err.message || "Failed to find product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchSku(sku);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden p-6 gap-6 justify-center">
      
      {/* Scanner Box */}
      <div className="flex-1 max-w-2xl bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Title */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#8C63F5] text-white flex items-center justify-center font-bold text-xs">3</span>
          <h2 className="text-white font-medium">Barcode Scanner</h2>
        </div>
        
        <div className="absolute top-6 right-6 flex items-center gap-2">
           <input 
             type="text" 
             value={sku} 
             onChange={(e) => setSku(e.target.value)} 
             onKeyDown={handleKeyDown} 
             placeholder="Enter SKU..." 
             className="border border-zinc-700 bg-[#0F0E17] text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:border-[#8C63F5]"
             autoFocus
           />
           <button onClick={() => searchSku(sku)} className="border border-zinc-700 bg-[#0F0E17] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
             Search
           </button>
        </div>

        {/* Scanner Window */}
        <div className="w-[400px] h-[260px] border-2 border-[#8C63F5]/30 rounded-3xl relative flex flex-col items-center justify-center mt-8">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#8C63F5] rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#8C63F5] rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#8C63F5] rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#8C63F5] rounded-br-3xl"></div>

          {/* Barcode Graphic */}
          <div className="flex items-end justify-center gap-1 h-20 mb-4 px-10">
            {[...Array(40)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white/80" 
                style={{ 
                  width: Math.random() > 0.5 ? '4px' : '2px', 
                  height: Math.random() > 0.2 ? '100%' : '80%' 
                }}
              ></div>
            ))}
          </div>

          <div className="text-white font-mono tracking-[0.3em] text-xl">
            {sku || "SCANNING..."}
          </div>

          {/* Laser Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.8)] -translate-y-1/2"></div>
        </div>

        <p className="text-zinc-500 mt-8 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          {loading ? "Searching..." : error ? <span className="text-red-400">{error}</span> : "Align barcode within frame or enter manually"}
        </p>

      </div>

      {/* Scanned Item Info */}
      <div className="w-80 shrink-0 bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col relative">
        
        <div className="p-6 border-b border-zinc-800/60 flex justify-between items-center">
          <h3 className="text-white font-medium">Scanned Item</h3>
          <span className="material-symbols-outlined text-zinc-500 cursor-pointer text-[20px]" onClick={() => setProduct(null)}>close</span>
        </div>

        {product ? (
          <div className="p-6 flex flex-col items-center text-center">
            {product.thumbnailImageUrl ? (
               <img src={product.thumbnailImageUrl} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-6 shadow-inner border border-zinc-800/50" />
            ) : (
               <div className="w-32 h-32 bg-[#0F0E17] rounded-xl flex items-center justify-center text-6xl mb-6 shadow-inner border border-zinc-800/50">
                 📦
               </div>
            )}
            <h2 className="text-xl font-bold text-white mb-1">{product.name}</h2>
            <p className="text-zinc-400 text-sm mb-2">{product.category?.name}</p>
            <p className="text-zinc-500 text-xs mb-6 font-mono">SKU: {product.variants?.[0]?.sku}</p>
            <h3 className="text-3xl font-bold text-white mb-4">₹{product.price?.toLocaleString()}</h3>
            
            <div className={`flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full border ${product.stockQuantity > 0 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              {product.stockQuantity > 0 ? `In Stock • ${product.stockQuantity} available` : 'Out of Stock'}
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center text-center flex-1">
             <div className="text-zinc-600 mb-4 text-5xl">🛒</div>
             <p className="text-zinc-500">Scan or search for a product to add it to the cart.</p>
          </div>
        )}

        <div className="mt-auto p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium">Quantity</label>
            <div className="flex items-center justify-between bg-[#0F0E17] border border-zinc-700/50 rounded-lg p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="text-white font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <button disabled={!product || product.stockQuantity === 0} className="w-full py-3.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20 disabled:opacity-50 disabled:cursor-not-allowed">
            Add to Cart
          </button>
          
          <button disabled={!product} onClick={() => { setProduct(null); setSku(""); }} className="w-full py-3.5 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Clear
          </button>
        </div>

      </div>

    </div>
  );
}
