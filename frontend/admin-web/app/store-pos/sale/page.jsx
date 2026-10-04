"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";
import { Html5Qrcode } from "html5-qrcode";

export default function NewSale() {
  const router = useRouter();
  
  const [categories, setCategories] = useState([{ name: "All" }]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [globalDiscount, setGlobalDiscount] = useState(0);

  // New Features State
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [heldCarts, setHeldCarts] = useState([]);
  const [showHeldCarts, setShowHeldCarts] = useState(false);

  // Camera Scanner State
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const html5QrCodeRef = useRef(null);
  
  // Ref to store products to allow addToCart from global scope without dependency issues
  const productsRef = useRef(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    sessionStorage.removeItem("pos_cart");
    sessionStorage.removeItem("pos_discount");
    sessionStorage.removeItem("pos_customer_phone");
    sessionStorage.removeItem("pos_customer_name");

    const savedHeld = localStorage.getItem("pos_held_carts");
    if (savedHeld) {
      setHeldCarts(JSON.parse(savedHeld));
    }

    Promise.all([
      apiRequest("/admin/categories"),
      apiRequest("/admin/products?limit=100")
    ])
    .then(([catRes, prodRes]) => {
      if (catRes.categories) setCategories([{ name: "All" }, ...catRes.categories]);
      if (prodRes.products) setProducts(prodRes.products);
    })
    .catch(err => console.error("Failed to load catalog", err))
    .finally(() => setLoading(false));
  }, []);

  // GLOBAL PHYSICAL SCANNER LISTENER
  useEffect(() => {
    let barcodeBuffer = "";
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e) => {
      // Ignore if user is manually typing into an input/textarea
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return;
      }
      
      const currentTime = Date.now();
      // Physical scanners typically type extremely fast (< 30ms between strokes)
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = ""; // Reset if typing too slow (human typing)
      }
      
      lastKeyTime = currentTime;

      if (e.key === "Enter") {
        if (barcodeBuffer.length > 2) {
          processBarcode(barcodeBuffer);
        }
        barcodeBuffer = "";
      } else if (e.key.length === 1) { // Normal character
        barcodeBuffer += e.key;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []); // Empty deps, using functional updates and processBarcode abstraction

  // CAMERA SCANNER INITIALIZATION
  useEffect(() => {
    if (showScanner) {
      setScannerError("");
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop().then(() => {
            setShowScanner(false);
            processBarcode(decodedText);
          });
        },
        (errorMessage) => {
          // ignore stream reading errors, it's just trying to find a barcode
        }
      ).catch((err) => {
        console.error("Camera error", err);
        setScannerError("Camera blocked by browser. Please click the Lock/Camera icon in your address bar to 'Allow' camera access, then try again.");
      });

      return () => {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch(e => console.error("Failed to stop scanner", e));
        }
      };
    }
  }, [showScanner]);

  const processBarcode = async (barcode) => {
    try {
      const res = await apiRequest(`/pos/products/barcode/${encodeURIComponent(barcode)}`);
      if (res.id) {
         addToCart(res);
      }
    } catch (err) {
      alert(`Product with barcode/SKU '${barcode}' not found`);
    }
  };

  const saveHeldCartsToStorage = (newHeldCarts) => {
    setHeldCarts(newHeldCarts);
    localStorage.setItem("pos_held_carts", JSON.stringify(newHeldCarts));
  };

  const handleInputBarcodeScan = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      processBarcode(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const addToCart = (productOrVariant) => {
    const price = productOrVariant.price || (productOrVariant.variants?.[0]?.price) || 0;
    const variantId = productOrVariant.variantId || (productOrVariant.variants?.[0]?.id) || productOrVariant.id;
    const stock = productOrVariant.stock || (productOrVariant.variants?.[0]?.stock) || 0;
    const name = productOrVariant.name;
    const image = productOrVariant.image || (productOrVariant.images?.[0]?.url) || null;

    if (!variantId) return alert("Product has no valid variant");
    if (stock <= 0) return alert("Out of stock!");

    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        if (existing.qty >= stock) { alert("Max stock reached"); return prev; }
        return prev.map(item => item.variantId === variantId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { variantId, name, price: Number(price), qty: 1, image, maxStock: stock, itemDiscount: 0 }];
    });
  };

  const updateQty = (variantId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const newQty = item.qty + delta;
        if (newQty < 1) return item;
        if (newQty > item.maxStock) { alert("Max stock reached"); return item; }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const updateItemDiscount = (variantId) => {
    const item = cart.find(i => i.variantId === variantId);
    if (!item) return;
    const discount = prompt(`Enter discount for ${item.name} (₹):`, item.itemDiscount);
    if (discount !== null && !isNaN(discount)) {
      setCart(prev => prev.map(i => i.variantId === variantId ? { ...i, itemDiscount: Number(discount) } : i));
    }
  };

  const removeCartItem = (variantId) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const handleHoldCart = () => {
    if (cart.length === 0) return;
    const cartName = prompt("Enter a name/reference for this held cart (e.g. Customer Name):", customerName || customerPhone || `Cart ${heldCarts.length + 1}`);
    if (!cartName) return;
    
    const newHold = {
      id: Date.now().toString(),
      name: cartName,
      cart,
      globalDiscount,
      customerPhone,
      customerName,
      timestamp: new Date().toISOString()
    };
    saveHeldCartsToStorage([...heldCarts, newHold]);
    
    setCart([]);
    setGlobalDiscount(0);
    setCustomerPhone("");
    setCustomerName("");
  };

  const handleResumeCart = (heldId) => {
    const toResume = heldCarts.find(h => h.id === heldId);
    if (!toResume) return;
    
    if (cart.length > 0) {
      if (!confirm("Your current cart is not empty. Overwrite it? (Cancel to manually hold it first)")) return;
    }

    setCart(toResume.cart);
    setGlobalDiscount(toResume.globalDiscount || 0);
    setCustomerPhone(toResume.customerPhone || "");
    setCustomerName(toResume.customerName || "");
    
    saveHeldCartsToStorage(heldCarts.filter(h => h.id !== heldId));
    setShowHeldCarts(false);
  };

  const handleProceed = () => {
    if (cart.length === 0) return;
    sessionStorage.setItem("pos_cart", JSON.stringify(cart));
    sessionStorage.setItem("pos_discount", globalDiscount);
    if (customerPhone) sessionStorage.setItem("pos_customer_phone", customerPhone);
    if (customerName) sessionStorage.setItem("pos_customer_name", customerName);
    router.push("/store-pos/payment");
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || (p.category && p.category.name === activeCategory);
    return matchesSearch && matchesCat;
  });

  const subtotal = cart.reduce((sum, item) => sum + ((item.price - (item.itemDiscount || 0)) * item.qty), 0);
  const total = Math.max(0, subtotal - globalDiscount);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0F0E17] relative">
      
      {/* CAMERA SCANNER MODAL */}
      {showScanner && (
        <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1A1827] w-full max-w-lg rounded-xl overflow-hidden border border-zinc-700 shadow-2xl relative">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-white font-bold">Scan Barcode / QR Code</h3>
              <button onClick={() => setShowScanner(false)} className="text-zinc-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4">
              {scannerError ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center text-sm">
                  <span className="material-symbols-outlined text-3xl mb-2 block">videocam_off</span>
                  <p>{scannerError}</p>
                </div>
              ) : (
                <div id="reader" className="w-full bg-black rounded overflow-hidden aspect-square"></div>
              )}
              <p className="text-center text-xs text-zinc-500 mt-4">Point your device camera at the product barcode</p>
            </div>
          </div>
        </div>
      )}

      {/* Center Panel - Products */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-800/60">
        
        {/* Header Search & Actions */}
        <div className="p-4 border-b border-zinc-800/60 bg-[#1A1827] flex gap-4 items-center">
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-zinc-500 text-[20px]">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleInputBarcodeScan}
              placeholder="Search product or scan barcode..." 
              className="w-full bg-[#0F0E17] border border-zinc-700/50 rounded-lg pl-11 pr-12 py-3 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
            />
            {/* Camera Scanner Button */}
            <button 
              onClick={() => setShowScanner(true)}
              title="Open Camera Scanner"
              className="absolute right-3 w-8 h-8 flex items-center justify-center bg-[#27272a] rounded text-white hover:bg-zinc-700 transition shadow-inner shadow-black/20"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
          </div>

          <button 
            onClick={() => setShowHeldCarts(!showHeldCarts)}
            className="flex items-center gap-2 px-4 py-3 bg-[#0F0E17] border border-zinc-700/50 hover:border-zinc-500 rounded-lg text-sm text-white transition-colors relative"
          >
            <span className="material-symbols-outlined text-[18px]">pause_circle</span>
            Held Carts
            {heldCarts.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8C63F5] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1A1827]">
                {heldCarts.length}
              </span>
            )}
          </button>
        </div>

        {/* Held Carts Dropdown / Overlay */}
        {showHeldCarts && (
          <div className="absolute top-[73px] right-[320px] w-80 bg-[#1A1827] border border-zinc-700 shadow-2xl rounded-lg z-50 overflow-hidden flex flex-col max-h-[60vh]">
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-white font-medium text-sm">Held Carts</h3>
              <button onClick={() => setShowHeldCarts(false)} className="text-zinc-400 hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
            <div className="overflow-y-auto p-2 space-y-2">
              {heldCarts.length === 0 ? (
                <p className="text-zinc-500 text-xs text-center py-4">No carts on hold.</p>
              ) : heldCarts.map(h => (
                <div key={h.id} className="p-3 border border-zinc-800 rounded-lg bg-[#0F0E17] hover:border-[#8C63F5] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white text-sm font-medium">{h.name}</h4>
                    <span className="text-zinc-500 text-[10px]">{new Date(h.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-xs text-zinc-400 mb-3">{h.cart.length} items</div>
                  <button onClick={() => handleResumeCart(h.id)} className="w-full py-1.5 bg-[#8C63F5]/10 text-[#8C63F5] hover:bg-[#8C63F5] hover:text-white rounded text-xs font-medium transition-colors">
                    Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Categories */}
          <div className="w-40 bg-[#1A1827] border-r border-zinc-800/60 overflow-y-auto hide-scrollbar flex flex-col gap-1 p-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat.name)}
                className={`py-3 px-3 rounded-lg text-xs font-medium text-left transition-colors ${
                  activeCategory === cat.name 
                    ? "bg-[#8C63F5] text-white" 
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
            {loading ? (
              <div className="text-zinc-500 text-center py-10">Loading catalog...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-zinc-500 text-center py-10">No products found</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((prod) => {
                  const price = prod.variants?.[0]?.price || 0;
                  const img = prod.images?.[0]?.url;
                  return (
                    <div 
                      key={prod.id} 
                      onClick={() => addToCart(prod)}
                      className="bg-[#1A1827] border border-zinc-800/60 rounded-xl overflow-hidden hover:border-[#8C63F5] cursor-pointer transition-colors group flex flex-col"
                    >
                      <div className="h-28 bg-[#0F0E17] flex items-center justify-center relative">
                        {img ? (
                          <img src={img} alt={prod.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-zinc-600">inventory_2</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs text-white font-medium mb-1 line-clamp-2">{prod.name}</h4>
                        <p className="text-xs text-slate-300 font-bold">₹{Number(price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-80 flex flex-col shrink-0 bg-[#1A1827]">
        
        {/* Customer Context directly in POS screen */}
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/40">
           <div className="flex gap-2">
             <input 
               type="text"
               placeholder="Phone (optional)"
               value={customerPhone}
               onChange={e => setCustomerPhone(e.target.value)}
               className="w-1/2 bg-[#0F0E17] border border-zinc-700/50 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#8C63F5]"
             />
             <input 
               type="text"
               placeholder="Name (optional)"
               value={customerName}
               onChange={e => setCustomerName(e.target.value)}
               className="w-1/2 bg-[#0F0E17] border border-zinc-700/50 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#8C63F5]"
             />
           </div>
        </div>

        <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
          <h3 className="text-white font-medium">Current Sale ({cart.length})</h3>
          <div className="flex gap-3">
            <button onClick={handleHoldCart} disabled={cart.length === 0} className="text-[#8C63F5] hover:text-[#7b53de] text-xs font-medium transition disabled:opacity-30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">pause_circle</span> Hold
            </button>
            <button onClick={() => setCart([])} disabled={cart.length === 0} className="text-red-400 hover:text-red-300 text-xs font-medium transition disabled:opacity-30">
              Clear
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
          {cart.length === 0 && (
             <div className="text-center text-zinc-600 text-sm mt-10 flex flex-col items-center justify-center gap-2">
               <span>Cart is empty</span>
               <span className="text-[10px]">You can start typing a scanner instantly</span>
             </div>
          )}
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-3 relative group">
              <div className="w-12 h-12 rounded bg-[#0F0E17] border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                {item.image ? <img src={item.image} alt={item.name} className="object-cover w-full h-full" /> : <span className="material-symbols-outlined text-zinc-600">inventory_2</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-medium text-white line-clamp-2 pr-2">{item.name}</h4>
                  <button onClick={() => removeCartItem(item.variantId)} className="text-zinc-600 hover:text-red-400">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-bold text-[#8C63F5]">
                    ₹{(item.price - (item.itemDiscount || 0)).toLocaleString('en-IN')}
                  </p>
                  {item.itemDiscount > 0 && (
                    <span className="text-[10px] line-through text-zinc-500">₹{item.price.toLocaleString('en-IN')}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-[#0F0E17] w-fit rounded border border-zinc-800 px-1">
                    <button onClick={() => updateQty(item.variantId, -1)} className="text-zinc-400 hover:text-white px-1">-</button>
                    <span className="text-[12px] text-white min-w-[20px] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.variantId, 1)} className="text-zinc-400 hover:text-white px-1">+</button>
                  </div>
                  
                  {/* Item Discount Button */}
                  <button onClick={() => updateItemDiscount(item.variantId)} className="text-zinc-500 hover:text-[#8C63F5] text-[10px] font-medium flex items-center gap-1">
                     <span className="material-symbols-outlined text-[12px]">local_offer</span>
                     {item.itemDiscount > 0 ? `Disc: ₹${item.itemDiscount}` : 'Discount'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t border-zinc-800/60 bg-[#1A1827]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Subtotal</span>
              <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {globalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Global Discount</span>
                <span className="text-emerald-400">-₹{globalDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="h-px bg-zinc-800/60 my-2"></div>
            <div className="flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-2xl font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button 
            onClick={handleProceed}
            disabled={cart.length === 0}
            className="w-full py-3.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] disabled:opacity-50 disabled:hover:bg-[#8C63F5] text-white font-bold transition-colors shadow-lg shadow-[#8C63F5]/20 mb-4"
          >
            Proceed to Payment
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                const disc = prompt("Enter global order discount (₹):", globalDiscount);
                if (disc && !isNaN(disc)) setGlobalDiscount(Number(disc));
              }}
              className="py-2 flex flex-col items-center justify-center gap-1 bg-[#0F0E17] border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
            >
              <span className="material-symbols-outlined text-[16px]">loyalty</span>
              <span className="text-[10px]">Global Disc</span>
            </button>
            <button onClick={() => router.push("/store-pos/drawer")} className="py-2 flex flex-col items-center justify-center gap-1 bg-[#0F0E17] border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
              <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
              <span className="text-[10px]">Drawer</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
