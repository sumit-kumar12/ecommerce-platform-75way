"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Star, Bell, 
  ShoppingCart, Mail, AlertCircle, RefreshCw, CheckCircle2, ArrowUp
} from "lucide-react";

const TABS = ["Overview", "Variants", "Sizes", "Types", "Content", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use badges to highlight status, counts or labels.", ok: true },
  { label: "Keep text short and meaningful.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Don't overuse badges on a single screen.", ok: true },
  { label: "Use consistent style and size.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use semantic elements with aria-labels.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Badges should be readable at all sizes.", ok: true },
  { label: "Don't rely on color alone for meaning.", ok: true },
  { label: "Badge count should be announced to screen readers.", ok: true }
];

export default function DSBadgesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Interactive counts playground
  const [counts, setCounts] = useState({
    notifications: 5,
    cart: 12,
    messages: 3,
    alerts: 2,
    updates: 8
  });

  const handleCopyCode = () => {
    const code = `<span class="badge badge-primary">New</span>
<span class="badge badge-success">
  <i class="icon-check"></i> Success
</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-danger">5</span>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const incrementCount = (key) => {
    setCounts(prev => ({ ...prev, [key]: prev[key] + 1 }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS3 – BADGES</h1>
            <span className="material-symbols-outlined text-[24px] text-indigo-650 block">verified</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Badges highlight status, labels, counts, or important information in a compact way.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search components..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Theme, notification, and profile */}
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[20px] block">light_mode</span>
            </button>
            <div className="relative">
              <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[20px] block">notifications</span>
              </button>
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                RS
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">Rahul Sharma</div>
                <div className="text-[10px] text-slate-400">Design System</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Row */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-slate-200 mb-8 pb-1 gap-4">
        <div className="flex overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide space-x-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold px-4 py-2 shadow-sm transition-colors border-none">
          <Download className="w-4 h-4" />
          <span>Export Assets</span>
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Columns */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">verified</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">10 Variants</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">rule</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">States</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 States</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">stay_current_portrait</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Responsive</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">100%</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">accessibility_new</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accessible</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">AA</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">keyboard</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keyboard</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">100%</span>
              </div>
            </div>
          </section>

          {/* Badge Variants Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Badge Variants</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              
              {/* Default */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">Default</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">Used for general labels or neutral information.</p>
              </div>

              {/* Primary */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-indigo-600 text-white rounded-md shadow-sm">Primary</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">Used to highlight primary category or item.</p>
              </div>

              {/* Success */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">Success</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Used to indicate success or completion.</p>
              </div>

              {/* Warning */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-md">Warning</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Used to indicate warning or caution.</p>
              </div>

              {/* Error */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-700 border border-red-100 rounded-md">Error</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Used to indicate error or issue.</p>
              </div>

              {/* Info */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-105 rounded-md">Info</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Used to provide informational context.</p>
              </div>

              {/* Light */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50/50 text-indigo-600 rounded-md">Light</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Subtle badge for less priority labels.</p>
              </div>

              {/* Outline */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-white text-indigo-600 border border-indigo-200 rounded-md">Outline</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Used when a subtle outlined style is needed.</p>
              </div>

              {/* Soft */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 rounded-md">Soft</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Soft background with subtle text color.</p>
              </div>

              {/* Gradient */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC]">
                <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-indigo-650 via-purple-600 to-pink-500 text-white rounded-md shadow-sm">New</span>
                <p className="text-[10px] text-slate-455 leading-relaxed">Used for special highlights or new features.</p>
              </div>

            </div>
          </section>

          {/* Badge with Icon Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Badge with Icon</h3>
            
            <div className="flex flex-wrap gap-6 items-center">
              
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Success</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Warning</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-bold">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Info</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs font-bold">
                <X className="w-3.5 h-3.5 text-red-600" />
                <span>Error</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-xs font-bold">
                <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Update</span>
              </div>

            </div>
          </section>

          {/* Combined Badge Content and Counters */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Badge With Content */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badge with Content</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
                
                {/* Label */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                  <span className="px-2.5 py-1 bg-indigo-55 text-indigo-700 font-bold rounded-full text-xs self-start">Featured</span>
                </div>

                {/* Count */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Count</label>
                  <div className="relative self-start p-1 border border-slate-150 rounded bg-slate-50 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-slate-500" />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px] font-bold">12</span>
                  </div>
                </div>

                {/* Dot */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Dot</label>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse self-start" />
                </div>

                {/* Text + Icon */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Text + Icon</label>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-bold self-start">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Top Rated</span>
                  </span>
                </div>

                {/* User */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">User</label>
                  <div className="flex -space-x-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border border-white text-[8px] font-bold flex items-center justify-center text-slate-650">AM</div>
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-white text-[8px] font-bold flex items-center justify-center text-indigo-650">NS</div>
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-white text-[8px] font-bold flex items-center justify-center text-white">+3</div>
                  </div>
                </div>

              </div>
            </section>

            {/* Badge As Counter */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badge as Counter</h3>
              
              <div className="flex flex-wrap gap-8 items-center">
                
                {/* Notification */}
                <div 
                  onClick={() => incrementCount('notifications')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Notification</span>
                  <div className="relative p-2.5 bg-slate-50 border border-slate-150 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      {counts.notifications}
                    </span>
                  </div>
                </div>

                {/* Cart Items */}
                <div 
                  onClick={() => incrementCount('cart')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Cart Items</span>
                  <div className="relative p-2.5 bg-slate-50 border border-slate-150 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      {counts.cart}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  onClick={() => incrementCount('messages')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Messages</span>
                  <div className="relative p-2.5 bg-slate-50 border border-slate-150 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <Mail className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      {counts.messages}
                    </span>
                  </div>
                </div>

                {/* Alerts */}
                <div 
                  onClick={() => incrementCount('alerts')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Alerts</span>
                  <div className="relative p-2.5 bg-slate-50 border border-slate-150 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-bounce">
                      {counts.alerts}
                    </span>
                  </div>
                </div>

                {/* Updates */}
                <div 
                  onClick={() => incrementCount('updates')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[9px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Updates</span>
                  <div className="relative p-2.5 bg-slate-50 border border-slate-150 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <RefreshCw className="w-5 h-5 text-slate-600 animate-spin-slow" />
                    <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-indigo-650 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      {counts.updates}
                    </span>
                  </div>
                </div>

              </div>
            </section>

          </div>

          {/* Badge Sizes and States */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Badge Sizes */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badge Sizes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Small */}
                <div className="border border-slate-150 rounded-lg p-4 space-y-3 bg-[#FCFCFC]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 mb-2">Small (sm)</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded self-start">New</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium space-y-0.5 pt-2 border-t border-slate-100">
                    <div>Height: 20px</div>
                    <div>Padding: 4px 8px</div>
                  </div>
                </div>

                {/* Medium */}
                <div className="border border-slate-150 rounded-lg p-4 space-y-3 bg-[#FCFCFC]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 mb-2">Medium (md)</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded self-start">New</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium space-y-0.5 pt-2 border-t border-slate-100">
                    <div>Height: 24px</div>
                    <div>Padding: 6px 10px</div>
                  </div>
                </div>

                {/* Large */}
                <div className="border border-slate-150 rounded-lg p-4 space-y-3 bg-[#FCFCFC]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 mb-2">Large (lg)</span>
                    <span className="px-3.5 py-1 text-sm font-bold bg-indigo-600 text-white rounded-md self-start">New</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium space-y-0.5 pt-2 border-t border-slate-100">
                    <div>Height: 28px</div>
                    <div>Padding: 8px 12px</div>
                  </div>
                </div>

              </div>
            </section>

            {/* Badge States */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badge States</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                
                {/* Default */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Default</span>
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold self-start shadow-sm cursor-pointer">New</span>
                </div>

                {/* Hover */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hover</span>
                  <span className="px-3 py-1 bg-indigo-700 text-white rounded text-xs font-bold self-start shadow-md cursor-pointer transition-all scale-[1.03]">New</span>
                </div>

                {/* Focus */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Focus</span>
                  <span className="px-3 py-1 bg-indigo-650 text-white rounded text-xs font-bold self-start ring-4 ring-indigo-500/25 outline-none cursor-pointer">New</span>
                </div>

                {/* Disabled */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Disabled</span>
                  <span className="px-3 py-1 bg-slate-200 text-slate-400 rounded text-xs font-bold self-start opacity-45 cursor-not-allowed select-none">New</span>
                </div>

              </div>
            </section>

          </div>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Badge Guidelines</h4>
            <ul className="space-y-3">
              {GUIDELINES.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-655 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-emerald-500 font-bold block mt-0.5">check_circle</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Accessibility</h4>
            <ul className="space-y-3">
              {ACCESSIBILITY_ITEMS.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-655 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-indigo-500 block mt-0.5">radio_button_checked</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Code Example (HTML)</h4>
              <button 
                onClick={handleCopyCode}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold shadow-sm transition-colors border-none"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#0b0f19] text-[#a9b2c3] p-3.5 rounded-lg text-[10px] font-mono overflow-x-auto leading-relaxed max-h-56">
{`<span class="badge badge-primary">New</span>
<span class="badge badge-success">
  <i class="icon-check"></i> Success
</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-danger">5</span>`}
            </pre>
          </div>

          {/* When to Use */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">When to Use</h4>
            <ul className="space-y-3">
              {[
                "Showing counts or numerical values.",
                "Indicating status or state.",
                "Highlighting new, updated or unread items.",
                "Categorizing items or features.",
                "Displaying notifications or alerts."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-655 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-indigo-500 block mt-0.5">radio_button_checked</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </aside>

      </div>
      
      {/* Footer Branding */}
      <footer className="mt-auto pt-10 pb-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Design with consistency. Build with confidence.</span>
        <div className="flex items-center gap-4">
          <span>Katabazaar Design System © 2024</span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">v1.0.0</span>
        </div>
      </footer>

    </div>
  );
}
