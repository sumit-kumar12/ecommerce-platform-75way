"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { ProductCard } from "../../../components/catalog/ProductCard";
import { StoreShell } from "../../../components/layout/StoreShell";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { StickyBuyBar } from "../../../components/product/StickyBuyBar";
import { OfferBox } from "../../../components/product/OfferBox";
import { apiRequest } from "../../../lib/api";
import { formatCatalogPrice, getProductImageUrl } from "../../../lib/catalog";

function getActiveOffer(product) {
  const offer = product?.activeOffer || null;
  const discountPercent = Number(offer?.discountPercent ?? 0);
  if (!offer || !Number.isFinite(discountPercent) || discountPercent <= 0) return null;
  return { ...offer, discountPercent };
}

function getOfferPrice(price, offer) {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0 || !offer) return null;
  return Math.max(0, Math.round(amount * (1 - offer.discountPercent / 100)));
}

function getOfferDaysLeft(offer) {
  if (!offer?.endDate) return null;
  const diff = new Date(offer.endDate).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isNotFound, setIsNotFound] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [pincode, setPincode] = useState("110001");
  const [isEditingPincode, setIsEditingPincode] = useState(false);
  const [tempPincode, setTempPincode] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, relRes, wishlistRes] = await Promise.all([
          apiRequest(`/products/${id}`, { csrf: false }),
          apiRequest("/products/categories/tree", { csrf: false }),
          apiRequest(`/products/${id}/related?limit=4`, { csrf: false }),
          apiRequest("/wishlist", { csrf: false }).catch(() => null),
        ]);
        if (active) {
          setProduct(prodRes?.product || null);
          setCategories(catRes?.categories || []);
          setRelated(relRes?.products || []);
          setSelectedVariantId(prodRes?.product?.variants?.[0]?.id ?? null);

          const wishlistItems = wishlistRes?.wishlist?.items || [];
          const isSaved = wishlistItems.some((item) => item.id === id);
          setInWishlist(isSaved);
          
          if (prodRes?.product?.id) {
            try {
              const maxItems = 20;
              const stored = localStorage.getItem("kb_recently_viewed_ids");
              let ids = [];
              if (stored) {
                try {
                  ids = JSON.parse(stored);
                } catch(e) {}
              }
              const pid = prodRes.product.id;
              ids = ids.filter(itemId => itemId !== pid);
              ids.unshift(pid);
              if (ids.length > maxItems) ids = ids.slice(0, maxItems);
              localStorage.setItem("kb_recently_viewed_ids", JSON.stringify(ids));
            } catch(e) {
              console.error("Failed to save recently viewed item", e);
            }
          }
        }
      } catch (err) {
        if (err?.code === "NOT_FOUND" || err?.message?.includes("404")) {
          setIsNotFound(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();

    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await apiRequest(`/products/${id}/reviews`, { csrf: false });
      if (res.reviews) setReviews(res.reviews);
    } catch (err) {
      console.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const images = useMemo(() => product?.images || [], [product]);
  const variant = useMemo(() => {
    const variants = product?.variants || [];
    return variants.find((entry) => entry.id === selectedVariantId) || variants[0] || null;
  }, [product, selectedVariantId]);
  const stock = Number(variant?.stock || 0);
  const comparePrice = Number(product?.compareAtPrice ?? variant?.compareAtPrice ?? 0);
  const currentPrice = Number(variant?.price || 0);
  const activeOffer = getActiveOffer(product);
  const offerPrice = getOfferPrice(currentPrice, activeOffer);
  const displayPrice = offerPrice || currentPrice;
  const displayComparePrice = offerPrice ? currentPrice : comparePrice;
  const offerDaysLeft = getOfferDaysLeft(activeOffer);

  const specCards = useMemo(() => {
    const attrs = variant?.attributes || {};
    return [
      { icon: "memory", label: "Processor", value: attrs.processor || "Premium chipset" },
      { icon: "photo_camera", label: "Camera", value: attrs.camera || "Flagship imaging" },
      { icon: "battery_charging_full", label: "Battery", value: attrs.battery || "All-day battery" },
      { icon: "speed", label: "RAM/Storage", value: attrs.storage || variant?.title || "Performance tier" },
    ];
  }, [variant]);

  const specificationRows = useMemo(() => {
    const attrs = variant?.attributes || {};
    return [
      ["Model Name", product?.name || "Katabazaar Premium Device"],
      ["Display Size", attrs.display || "High refresh premium panel"],
      ["Refresh Rate", attrs.refreshRate || "Adaptive refresh"],
      ["Weight", attrs.weight || "Optimized chassis"],
      ["OS", attrs.os || "Katabazaar OS layer"],
    ];
  }, [product, variant]);

  const handleAddToCart = async ({ goToCheckout = false } = {}) => {
    try {
      await apiRequest("/cart/items", { method: "POST", body: { variantId: variant?.id, quantity }, csrf: true });
      if (goToCheckout) {
        window.location.href = "/checkout";
        return;
      }
      setToast(`${product.name} added to cart.`);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      setTimeout(() => setToast(""), 3000);
    } catch {
       setToast("Sign in required.");
    }
  };

  const handleToggleWishlist = async () => {
    if (wishlistBusy || !product) return;
    setWishlistBusy(true);
    try {
      if (inWishlist) {
        await apiRequest(`/wishlist/items/${product.id}`, { method: "DELETE", csrf: true });
        setInWishlist(false);
        setToast("Removed from wishlist.");
      } else {
        await apiRequest("/wishlist/items", { method: "POST", body: { productId: product.id }, csrf: true });
        setInWishlist(true);
        setToast("Added to wishlist.");
      }
      setTimeout(() => setToast(""), 3000);
    } catch (error) {
      setToast(error?.status === 401 ? "Sign in required to manage wishlist." : "Unable to update wishlist.");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMessage("");
    try {
      await apiRequest(`/products/${id}/reviews`, {
        method: "POST",
        body: reviewForm,
      });
      setReviewMessage("Review submitted successfully! Pending approval if flagged.");
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      fetchReviews();
    } catch (err) {
      if (err.code === "ALREADY_REVIEWED") {
        setReviewMessage("You have already reviewed this product.");
      } else {
        setReviewMessage(err.message || "Sign in required to submit reviews.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isNotFound) notFound();

  if (loading) return <StoreShell categories={categories}><div className="min-h-screen bg-[#0F0E17] text-white flex items-center justify-center">Loading...</div></StoreShell>;
  if (!product) return <StoreShell categories={categories}><div className="min-h-screen bg-[#0F0E17] text-white flex items-center justify-center">Product not found.</div></StoreShell>;

  return (
    <StoreShell categories={categories}>
      <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col relative px-4 md:px-8 py-6">
        {toast && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-[#8B5CF6] text-white px-4 py-3 rounded-lg shadow-lg font-medium text-sm animate-in slide-in-from-top-4">
            <span className="material-symbols-outlined">verified</span>
            <span>{toast}</span>
          </div>
        )}

        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 max-w-7xl mx-auto w-full">
          <Link href="/" className="hover:text-[#8B5CF6] transition-colors">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href="/products" className="hover:text-[#8B5CF6] transition-colors">{product.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-200">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto w-full">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div 
              className="bg-[#1A1A2E] border border-white/5 rounded-2xl p-8 flex items-center justify-center relative cursor-pointer aspect-square"
              onClick={() => setLightboxOpen(true)}
            >
              <Image 
                fill 
                src={images[selectedImg]?.url || "/placeholder.png"} 
                alt={product.name} 
                className="object-contain p-8" 
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <button 
                    type="button" 
                    key={img.id} 
                    className={`bg-[#1A1A2E] border rounded-xl aspect-square relative overflow-hidden transition-all duration-200 p-2 ${i === selectedImg ? 'border-[#8B5CF6]' : 'border-white/5 hover:border-white/20'}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <Image fill src={img.url} alt={product.name} className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{product.name}</h1>
                <p className="text-gray-400 text-sm mb-4">{product.shortDescription || product.description?.slice(0, 50) || "True Wireless Earbuds"}</p>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-1 bg-[#1A1A2E] border border-white/10 px-2 py-1 rounded-md text-sm cursor-pointer" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({behavior: 'smooth'})}>
                    <span className="material-symbols-outlined text-[#FBBF24] text-[16px]">star</span>
                    <strong className="text-white">{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}</strong>
                    <span className="text-gray-400">({reviews.length} reviews)</span>
                  </div>
                  <button 
                    onClick={() => {
                      document.getElementById('reviews-section')?.scrollIntoView({behavior: 'smooth'});
                      setShowReviewForm(true);
                    }} 
                    className="text-sm font-medium text-[#8B5CF6] hover:text-white transition-colors underline underline-offset-2"
                  >
                      Write a Review
                  </button>
                  <div className="flex items-center gap-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-2 py-1 rounded-md text-sm text-[#8B5CF6]">
                    <span className="material-symbols-outlined text-[16px]">emoji_events</span>
                    <strong>#1 Best Seller</strong> in {product.category?.name || "Category"}
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-200 ${inWishlist ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-[#1A1A2E] text-gray-400 hover:text-white"}`}
                onClick={handleToggleWishlist}
                disabled={wishlistBusy}
              >
                <span className="material-symbols-outlined text-[20px]">{inWishlist ? "favorite" : "favorite_border"}</span>
              </button>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-white">{formatCatalogPrice(displayPrice)}</span>
              {displayComparePrice > displayPrice && (
                <span className="text-lg text-gray-500 line-through mb-1">{formatCatalogPrice(displayComparePrice)}</span>
              )}
              {displayComparePrice > displayPrice && (
                <span className="text-sm font-bold text-[#10B861] bg-[#10B861]/10 px-2 py-0.5 rounded-md mb-1.5">
                  {Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-8">Inclusive of all taxes</p>

            {/* Offers & Delivery */}
            <div className="space-y-4 mb-8">
              {/* Offers Box */}
              <div className="bg-[#1A1A2E] border border-white/5 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#8B5CF6]/10 p-1 rounded-md mt-0.5 text-[#8B5CF6]">
                      <span className="material-symbols-outlined text-[16px]">local_offer</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Bank Offer <span className="font-normal text-gray-400">10% Instant Discount on HDFC Cards</span></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F59E0B]/10 p-1 rounded-md mt-0.5 text-[#F59E0B]">
                      <span className="material-symbols-outlined text-[16px]">credit_card</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">No Cost EMI <span className="font-normal text-gray-400">from ₹323/month</span> <a href="#" className="text-[#8B5CF6] ml-1">View</a></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#10B861]/10 p-1 rounded-md mt-0.5 text-[#10B861]">
                      <span className="material-symbols-outlined text-[16px]">redeem</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Special Price <span className="font-normal text-gray-400">Get extra 5% off on prepaid orders</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Box */}
              <div className="bg-[#1A1A2E] border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-2">Delivery:</h3>
                <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                  Deliver to: 
                  {isEditingPincode ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={tempPincode}
                        onChange={(e) => setTempPincode(e.target.value)}
                        className="bg-[#0F0E17] border border-white/20 rounded px-2 py-1 text-white text-xs w-20 focus:outline-none focus:border-[#8B5CF6]"
                        placeholder="Pincode"
                        maxLength={6}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (tempPincode.length === 6) {
                            setPincode(tempPincode);
                            setIsEditingPincode(false);
                            setToast("Pincode updated successfully.");
                            setTimeout(() => setToast(""), 3000);
                          }
                        }}
                        className="text-[#8B5CF6] text-xs font-medium hover:text-[#7C3AED]"
                      >
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditingPincode(false)}
                        className="text-gray-500 text-xs hover:text-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <strong className="text-white">{pincode}</strong> 
                      <button 
                        type="button" 
                        onClick={() => {
                          setTempPincode(pincode);
                          setIsEditingPincode(true);
                        }} 
                        className="text-[#8B5CF6] text-xs hover:underline"
                      >
                        Change
                      </button>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  Delivery by <strong className="text-white">{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong> <span className="text-[#10B861] font-medium">- FREE</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#1A1A2E] border border-white/10 rounded-lg">
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">remove</span>
                  </button>
                  <span className="w-8 text-center font-medium text-white">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q+1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
                {stock > 0 ? (
                  <span className="text-sm font-medium text-[#10B861]">In Stock</span>
                ) : (
                  <span className="text-sm font-medium text-red-500">Out of Stock</span>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => handleAddToCart()}
                  className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(139,92,246,0.39)]"
                >
                  Add to Cart
                </button>
                <button 
                  type="button" 
                  onClick={() => handleAddToCart({ goToCheckout: true })}
                  className="flex-1 bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(236,72,153,0.39)]"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">published_with_changes</span>
                  <span>7 Days Replacement</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  <span>100% Original</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Stacked Specifications and Reviews */}
        <section className="mt-12 space-y-12">
          {/* Product Details Full Width */}
          {product.description && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Product Details</h2>
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
            </div>
          )}

          {/* Specifications Full Width */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Full Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">General</h3>
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-white/5">
                    {specificationRows.map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-3 text-gray-400 w-1/3">{label}</td>
                        <td className="py-3 text-gray-200">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Warranty & Support</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#8B5CF6] text-2xl">verified</span>
                    <div>
                      <strong className="block text-gray-200 mb-1">Katabazaar Certified</strong>
                      <p className="text-sm text-gray-400">Guaranteed authentic and protected by our buyer protection program.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#8B5CF6] text-2xl">assignment_return</span>
                    <div>
                      <strong className="block text-gray-200 mb-1">7 Days Replacement</strong>
                      <p className="text-sm text-gray-400">Easy returns and replacements within 7 days of delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Full Width */}
          <div id="reviews-section" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-white">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                  </span>
                  <div>
                    <div className="flex text-[#F59E0B]">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`material-symbols-outlined text-sm ${i <= (reviews.length ? Math.round(reviews.reduce((a, b) => a + b.rating, 0)/reviews.length) : 0) ? 'filled' : 'text-gray-600'}`}>star</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{reviews.length} Global ratings</p>
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                className="bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>

            {showReviewForm && (
              <div className="mb-8 p-6 bg-[#1a192b] border border-[#8B5CF6]/20 rounded-xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Submit your review</h3>
                {reviewMessage && (
                  <div className="mb-4 p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium">
                    {reviewMessage}
                  </div>
                )}
                <form onSubmit={handleSubmitReview} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Rating</label>
                    <select 
                      value={reviewForm.rating} 
                      onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                      className="w-full bg-[#121121] border border-[#8B5CF6]/20 rounded-lg px-3 py-2 text-white"
                    >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Comment</label>
                    <textarea 
                      value={reviewForm.comment} 
                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                      className="w-full bg-[#121121] border border-[#8B5CF6]/20 rounded-lg px-3 py-2 text-white min-h-[100px]"
                      placeholder="What did you like or dislike?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="bg-[#8B5CF6] hover:bg-[#7e53db] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {reviewsLoading ? (
                <p className="text-slate-400">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] font-bold uppercase text-sm">
                        {review.user?.name ? review.user.name[0] : 'U'}
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-200">{review.user?.name || 'Customer'}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1,2,3,4,5].map(i => (
                              <span key={i} className={`material-symbols-outlined text-[12px] ${i <= review.rating ? 'filled text-[#F59E0B]' : 'text-gray-600'}`}>star</span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-300 mt-3">{review.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </section>

          {related.length > 0 && (
             <section className="mt-16">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-bold text-white">Similar Items</h2>
                   <Link href={`/products?categorySlug=${product.category?.slug || ""}`} className="text-[#8B5CF6] hover:text-[#7e53db] font-medium text-sm transition-colors">
                      View All
                   </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                   {related.map(p => (
                      <ProductCard key={p.id} product={p} />
                   ))}
                </div>
             </section>
          )}

          {lightboxOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
              onClick={() => setLightboxOpen(false)}
            >
              <button 
                className="absolute top-6 right-6 text-white hover:text-indigo-400 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                onClick={() => setLightboxOpen(false)}
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
              <div 
                className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
                onClick={e => e.stopPropagation()}
              >
                <Image 
                  fill 
                  src={images[selectedImg]?.url || "/placeholder.png"} 
                  alt={product.name} 
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-2xl" 
                />
              </div>
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/5 rounded-2xl backdrop-blur-md" onClick={e => e.stopPropagation()}>
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-indigo-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      onClick={() => setSelectedImg(i)}
                    >
                      <Image fill src={img.url} alt={product.name} style={{ objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <StickyBuyBar 
          product={product} 
          variant={variant} 
          onAddToCart={() => handleAddToCart()} 
          onBuyNow={() => handleAddToCart({ goToCheckout: true })} 
        />
      </StoreShell>
  );
}
