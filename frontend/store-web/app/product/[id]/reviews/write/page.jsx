"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreShell } from "../../../../../components/layout/StoreShell";
import { apiRequest } from "../../../../../lib/api";

export default function WriteReview({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState("yes");
  const [anonymous, setAnonymous] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const getRatingLabel = (val) => {
    switch(val) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      const fullComment = title ? `**${title}**\n\n${comment}`.substring(0, 500) : comment.substring(0, 500);
      
      await apiRequest(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating,
          comment: fullComment
        })
      });
      
      router.push(`/product/${id}/reviews?success=true`);
    } catch (err) {
      console.error(err);
      setError("Failed to submit review. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200 pb-20 pt-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 font-medium mb-6 flex flex-wrap gap-2 items-center">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href={`/product/${id}`} className="hover:text-white transition-colors truncate max-w-[150px] inline-block align-bottom">{product?.name || "Product"}</Link>
            <span className="text-slate-600">/</span>
            <Link href={`/product/${id}/reviews`} className="hover:text-white transition-colors">Reviews</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">Write Review</span>
          </nav>

          <h1 className="text-3xl font-black text-white mb-6">Write a Review</h1>

          {/* Product Mini Card */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-4 flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#1a192b] rounded-xl flex items-center justify-center shrink-0 border border-[#2d2c45] overflow-hidden">
              {product?.images?.[0] ? (
                <img src={product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[#8C63F5] text-[32px]">inventory_2</span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#8C63F5] uppercase tracking-wider mb-1">{product?.category?.name || "Product"}</p>
              <h3 className="font-bold text-white line-clamp-1">{product?.name || "Loading product..."}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6 md:p-8">
            
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-4 rounded-xl mb-6 font-bold text-sm">
                {error}
              </div>
            )}

            {/* Rating Section */}
            <div className="mb-8 border-b border-[#2d2c45]/50 pb-8">
              <label className="block text-sm font-bold text-slate-300 mb-4">Your Rating <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <span className={`material-symbols-outlined text-[36px] ${(hoverRating || rating) >= star ? 'text-amber-400 text-fill' : 'text-slate-600'}`}>star</span>
                    </button>
                  ))}
                </div>
                <span className="text-amber-400 font-bold min-w-[100px]">{getRatingLabel(hoverRating || rating)}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Review Title <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8C63F5] transition-colors" 
                  placeholder="Summarize your experience" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-300">Your Review <span className="text-rose-500">*</span></label>
                  <span className="text-xs font-bold text-slate-500">{comment.length}/500</span>
                </div>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value.substring(0, 500))}
                  rows={5}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8C63F5] transition-colors resize-none" 
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Add Photos & Videos (Optional)</label>
                <div className="border-2 border-dashed border-[#2d2c45] rounded-xl p-8 flex flex-col items-center justify-center bg-[#1a192b]/50 hover:bg-[#1a192b] transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-[32px] text-slate-500 group-hover:text-[#8C63F5] mb-2 transition-colors">add_photo_alternate</span>
                  <p className="text-sm font-bold text-slate-300">Click to Add Photos</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Recommend this product?</label>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setRecommend("yes")}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all border ${recommend === "yes" ? 'bg-[#8C63F5] border-[#8C63F5] text-white' : 'bg-[#1a192b] border-[#2d2c45] text-slate-400 hover:text-white hover:border-slate-500'}`}
                  >
                    Yes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecommend("no")}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all border ${recommend === "no" ? 'bg-[#8C63F5] border-[#8C63F5] text-white' : 'bg-[#1a192b] border-[#2d2c45] text-slate-400 hover:text-white hover:border-slate-500'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2d2c45]/50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="w-5 h-5 appearance-none border border-[#2d2c45] rounded bg-[#1a192b] checked:bg-[#8C63F5] checked:border-[#8C63F5] transition-colors peer cursor-pointer"
                    />
                    <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Keep my name anonymous</span>
                </label>
              </div>

            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className={`w-full mt-8 bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

        </div>
      </div>
    </StoreShell>
  );
}
