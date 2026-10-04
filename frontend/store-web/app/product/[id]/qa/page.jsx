"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { StoreShell } from "../../../../components/layout/StoreShell";
import { apiRequest } from "../../../../lib/api";

export default function ProductQA({ params }) {
  const { id } = use(params);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Questions");
  const [expandedId, setExpandedId] = useState(null);
  
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
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

  const [qas, setQas] = useState([]);
  
  const fetchQA = async () => {
    try {
      const res = await apiRequest(`/products/${id}/qa`, { csrf: false });
      if (res?.items) setQas(res.items);
    } catch (err) {
      console.warn("Failed to fetch Q&A:", err.message);
    }
  };

  useEffect(() => {
    fetchQA();
  }, [id]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    
    try {
      await apiRequest(`/products/${id}/qa`, {
        method: "POST",
        body: { question: questionText }
      });
      setShowAskForm(false);
      setQuestionText("");
      setToastMessage("Your question has been submitted successfully!");
      fetchQA();
      
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    } catch (err) {
      alert(err.message || "Failed to submit question. Please login first.");
    }
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
            <span className="text-slate-300">Q&A</span>
          </nav>

          <h1 className="text-3xl font-black text-white mb-8">Questions & Answers</h1>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-emerald-500/20 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              {toastMessage}
            </div>
          )}

          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6 md:p-8">
            
            {/* Tabs and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-[#2d2c45]/50">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveTab("Questions")}
                  className={`text-lg font-bold pb-2 border-b-2 transition-colors ${activeTab === 'Questions' ? 'border-[#8C63F5] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Questions ({qas.length})
                </button>
                <button 
                  onClick={() => setActiveTab("Answers")}
                  className={`text-lg font-bold pb-2 border-b-2 transition-colors ${activeTab === 'Answers' ? 'border-[#8C63F5] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Answers ({qas.reduce((acc, q) => acc + (q.answers?.length || 0), 0)})
                </button>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                  <input 
                    type="text" 
                    placeholder="Search Q&A..." 
                    className="w-full bg-[#1a192b] border border-[#2d2c45] rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#8C63F5] transition-colors"
                  />
                </div>
                <button 
                  onClick={() => setShowAskForm(!showAskForm)}
                  className="bg-[#8C63F5]/10 hover:bg-[#8C63F5] text-[#8C63F5] hover:text-white border border-[#8C63F5]/30 hover:border-[#8C63F5] px-5 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap"
                >
                  Ask a Question
                </button>
              </div>
            </div>

            {/* Inline Ask Form */}
            {showAskForm && (
              <form onSubmit={handleAskQuestion} className="bg-[#1a192b] border border-[#2d2c45] rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="font-bold text-white mb-4">What do you want to know about this product?</h3>
                <textarea 
                  required
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  placeholder="e.g., Does this include a charger?"
                  className="w-full bg-[#121121] border border-[#2d2c45] rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#8C63F5] transition-colors resize-none mb-4"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAskForm(false)}
                    className="px-5 py-2 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20"
                  >
                    Submit Question
                  </button>
                </div>
              </form>
            )}

            {/* Q&A List */}
            <div className="space-y-6">
              {qas.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No questions yet. Be the first to ask!</div>
              ) : qas.map(qa => {
                const answerObj = qa.answers?.[0];
                return (
                <div key={qa.id} className="flex gap-4 md:gap-6 pb-6 border-b border-[#2d2c45]/30 last:border-0 last:pb-0">
                  
                  {/* Vote Box */}
                  <div className="flex flex-col items-center shrink-0">
                    <button className="w-10 h-10 rounded-full bg-[#1a192b] border border-[#2d2c45] text-slate-400 hover:text-[#8C63F5] hover:border-[#8C63F5] transition-colors flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[20px]">expand_less</span>
                    </button>
                    <span className="font-bold text-white text-lg">{qa.upvotes || 0}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Votes</span>
                    <button className="w-10 h-10 rounded-full bg-[#1a192b] border border-[#2d2c45] text-slate-400 hover:text-[#8C63F5] hover:border-[#8C63F5] transition-colors flex items-center justify-center mt-2">
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </button>
                  </div>

                  {/* Q&A Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-3 mb-2">
                      <span className="font-black text-rose-500 text-lg">Q:</span>
                      <div>
                        <h3 className="font-bold text-white text-base md:text-lg">{qa.question}</h3>
                        <p className="text-xs text-slate-500 mt-1">{qa.author?.name || "Anonymous"} • {new Date(qa.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <span className="font-black text-emerald-500 text-lg">A:</span>
                      <div className="flex-1">
                        {answerObj ? (
                          <>
                            <div className={`text-slate-300 text-sm md:text-base leading-relaxed ${expandedId === qa.id ? '' : 'line-clamp-2'}`}>
                              {answerObj.answer}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <span className="text-xs text-slate-400 font-medium">
                                Answer by <span className="font-bold text-slate-300">{answerObj.author?.name || "Support"}</span>
                              </span>
                              <span className="text-xs text-slate-500">• {new Date(answerObj.createdAt).toLocaleDateString()}</span>
                            </div>

                            {qa.answers?.length > 1 && (
                              <button 
                                onClick={() => setExpandedId(expandedId === qa.id ? null : qa.id)}
                                className="mt-3 text-sm font-bold text-[#8C63F5] hover:text-[#7c3aed] transition-colors"
                              >
                                {expandedId === qa.id ? 'Show less' : `See all ${qa.answers.length} answers`}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-slate-500 italic text-sm">Not answered yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            <button className="mt-8 w-full border border-[#2d2c45] bg-[#1a192b] hover:bg-[#2d2c45] hover:border-[#8C63F5]/50 text-[#8C63F5] font-bold py-4 rounded-xl transition-all">
              Load More Questions
            </button>

          </div>

        </div>
      </div>
    </StoreShell>
  );
}
