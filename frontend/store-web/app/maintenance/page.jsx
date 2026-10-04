"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 15,
    seconds: 45
  });

  // Simple countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8C63F5]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-[#121121] border border-[#2d2c45] rounded-3xl p-8 md:p-16 text-center shadow-2xl relative z-10 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="w-full flex items-center justify-between mb-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-[#8C63F5] flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-[#8C63F5] transition-colors">
              KATABAZAAR
            </span>
          </Link>
          <div className="flex gap-4 text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        </div>

        {/* Graphics */}
        <div className="relative mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-[#1a192b] rounded-full flex items-center justify-center border-4 border-[#2d2c45]">
            <img src="https://cdn-icons-png.flaticon.com/512/2622/2622285.png" alt="Maintenance" className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-lg" style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(140,99,245,0.5))' }} />
          </div>
          {/* Decorative gears */}
          <span className="material-symbols-outlined absolute -top-4 -right-4 text-[#8C63F5] text-[32px] animate-[spin_4s_linear_infinite]">settings</span>
          <span className="material-symbols-outlined absolute bottom-4 -left-6 text-slate-500 text-[24px] animate-[spin_6s_linear_infinite_reverse]">settings</span>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">We'll be right back!</h1>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-12 leading-relaxed">
          We are currently performing scheduled maintenance to serve you better. Please check back in a while.
        </p>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4 md:gap-8 mb-16">
          <div className="flex flex-col items-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hours</span>
          </div>
          <div className="text-4xl md:text-5xl font-black text-[#2d2c45] mb-6">:</div>
          <div className="flex flex-col items-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Minutes</span>
          </div>
          <div className="text-4xl md:text-5xl font-black text-[#2d2c45] mb-6">:</div>
          <div className="flex flex-col items-center">
            <div className="text-4xl md:text-5xl font-black text-[#8C63F5] mb-2 font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-xs font-bold text-[#8C63F5] uppercase tracking-widest">Seconds</span>
          </div>
        </div>

        {/* Stay Updated Form */}
        <div className="w-full max-w-md border-t border-[#2d2c45]/50 pt-10">
          <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Stay Updated</h3>
          <p className="text-xs text-slate-500 mb-6">Get notified when we're back online</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full mb-10">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="flex-1 bg-[#1a192b] border border-[#2d2c45] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors"
            />
            <button 
              type="submit" 
              className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-[#8C63F5]/20"
            >
              Notify Me
            </button>
          </form>

          {subscribed && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold">
              Thanks! We'll notify you soon.
            </div>
          )}

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-slate-500 hover:text-[#8C63F5] transition-colors"><span className="material-symbols-outlined">facebook</span></a>
            <a href="#" className="text-slate-500 hover:text-[#8C63F5] transition-colors"><span className="material-symbols-outlined">cruelty_free</span></a>
            <a href="#" className="text-slate-500 hover:text-[#8C63F5] transition-colors"><span className="material-symbols-outlined">photo_camera</span></a>
            <a href="#" className="text-slate-500 hover:text-[#8C63F5] transition-colors"><span className="material-symbols-outlined">work</span></a>
          </div>
        </div>

      </div>
    </div>
  );
}
