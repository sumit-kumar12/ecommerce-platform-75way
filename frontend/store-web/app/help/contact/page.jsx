"use client";

import React, { useState } from 'react';
import { StoreShell } from "../../../components/layout/StoreShell";

import { apiRequest } from "../../../lib/api";

export default function ContactSupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      subject: formData.get("subject") || "general",
      orderId: formData.get("orderId") || "",
      message: formData.get("message") || ""
    };
    
    try {
      await apiRequest("/contact", {
        method: "POST",
        body: payload,
        csrf: true
      });
      setShowToast(true);
      e.target.reset();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StoreShell>
      <div className="min-h-screen bg-[#0F0E17] text-white">
        
        {/* Success Toast */}
        {showToast && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right fade-in">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
          </div>
        )}

        {/* Hero */}
        <div className="w-full bg-gradient-to-r from-[#121121] to-[#1a192b] border-b border-[#2d2c45] relative overflow-hidden py-12 md:py-16">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#8C63F5]/10 rounded-full blur-[80px] -mr-40 -mt-20 pointer-events-none"></div>
          
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#8C63F5]/20 border border-[#8C63F5]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px] text-[#8C63F5]">support_agent</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Contact Support</h1>
              <p className="text-slate-400">We're here to help you</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column: Contact Options */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Choose a way to contact us</h2>
              
              <div className="space-y-4">
                {/* Live Chat */}
                <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#8C63F5]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#8C63F5]">chat</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Live Chat</h3>
                      <p className="text-sm text-slate-400">Chat with our support team</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 mb-6">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    Available 24/7
                  </div>
                  <button className="w-full bg-[#8C63F5]/10 hover:bg-[#8C63F5]/20 text-[#8C63F5] border border-[#8C63F5]/30 hover:border-[#8C63F5]/50 font-bold py-3 rounded-xl transition-all">
                    Start Chat
                  </button>
                </div>

                {/* Email Support */}
                <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#8C63F5]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#8C63F5]">mail</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Email Support</h3>
                      <p className="text-sm text-slate-400">Send us an email</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 font-medium mb-6">support@katabazaar.com</p>
                  <a href="mailto:support@katabazaar.com" className="flex items-center justify-center w-full bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20">
                    Send Email
                  </a>
                </div>

                {/* Call Support */}
                <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#8C63F5]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#8C63F5]">call</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Call Support</h3>
                      <p className="text-sm text-slate-400">Talk to our support executive</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 font-medium mb-6">+91 98765 43210</p>
                  <a href="tel:+919876543210" className="flex items-center justify-center w-full bg-transparent hover:bg-white/5 border border-[#2d2c45] hover:border-slate-500 text-white font-bold py-3 rounded-xl transition-all">
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#121121] border border-[#2d2c45] rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Subject</label>
                  <div className="relative">
                    <select required name="subject" className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-white appearance-none outline-none transition-colors">
                      <option value="">Select a subject</option>
                      <option value="order">Order Issue</option>
                      <option value="refund">Refund/Return</option>
                      <option value="delivery">Delivery</option>
                      <option value="product">Product Info</option>
                      <option value="other">Other</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Order ID <span className="text-slate-500 font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    name="orderId"
                    placeholder="e.g. ORD-123456"
                    className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Message</label>
                  <textarea 
                    required
                    name="message"
                    rows="5"
                    placeholder="Type your message here..."
                    className="w-full bg-[#0F0E17] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder-slate-600 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </StoreShell>
  );
}
