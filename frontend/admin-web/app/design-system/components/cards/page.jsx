"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, ArrowRight, Heart, ChevronRight, Trash2, 
  Edit3, Sliders, Sparkles, Smartphone, Grid, Layers, List, TrendingUp, 
  User, Image, FileText, CheckCircle2
} from "lucide-react";

const TABS = ["Overview", "Variants", "Content", "Actions", "Layouts", "Best Practices"];

const GUIDELINES = [
  { label: "Use cards to group related content." },
  { label: "Keep content clear, concise and scannable." },
  { label: "Maintain consistent spacing and alignment." },
  { label: "Use appropriate variants for context." },
  { label: "Ensure actions are easy to discover." }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Cards must have sufficient color contrast." },
  { label: "Use semantic HTML and proper roles." },
  { label: "Ensure focus states are visible." },
  { label: "All interactive cards must be keyboard accessible." },
  { label: "Provide descriptive text for images." }
];

const CODE_EXAMPLE_HTML = `<div class="ds-card ds-card--default">
  <img src="image.jpg" alt="Card image" class="ds-card__image" />
  <div class="ds-card__body">
    <h3 class="ds-card__title">Card title</h3>
    <p class="ds-card__description">
      This is a sample card description.
    </p>
    <a href="#" class="ds-card__action">
      View details →
    </a>
  </div>
</div>`;

export default function DSCardsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Card interaction states
  const [liked, setLiked] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleCardClick = (cardName) => {
    setClickCount(c => c + 1);
    triggerToast(`Clicked: ${cardName}`);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1120] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 z-50 animate-bounce">
          <Info className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DS3 – CARDS</h1>
            <span className="material-symbols-outlined text-[28px] text-indigo-650 font-bold bg-indigo-50 p-1.5 rounded-lg">style</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Cards group related content and actions in a flexible container.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search components..." 
              className="w-full pl-9 pr-14 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-700"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              ⌘ K
            </span>
          </div>

          {/* Theme, notification, and profile */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[20px] block">light_mode</span>
            </button>
            <div className="relative">
              <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[20px] block">notifications</span>
              </button>
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                RS
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">Rahul Sharma</div>
                <div className="text-[10px] text-slate-400 font-medium">Design System</div>
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
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-650' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold px-4 py-2.5 shadow-md hover:shadow-lg transition-all border-none">
          <Download className="w-4 h-4" />
          <span>Export Assets</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Columns */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Metrics summary */}
          {(activeTab === "Overview" || activeTab === "Best Practices") && (
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">style</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">8</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Card Variants</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">category</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">6</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Content Types</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">100%</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Responsive</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">universal_access</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">AA</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Accessible</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">keyboard</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">100%</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Keyboard Friendly</span>
                </div>
              </div>
            </section>
          )}

          {/* CARD VARIANTS Section */}
          {(activeTab === "Overview" || activeTab === "Variants") && (
            <section className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Card Variants</h3>
                <span className="text-[10px] text-indigo-650 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">Core Types</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                
                {/* 1. Default Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-350 border-b border-slate-150">
                      <Image className="w-8 h-8" />
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-850 block">Card title</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">This is a default card with image, title and description.</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <button onClick={() => handleCardClick("Default Card")} className="text-indigo-650 hover:text-indigo-850 text-xs font-bold transition-colors flex items-center gap-1 bg-transparent border-none">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Elevated Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-shadow relative">
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm z-10">New</span>
                  <div>
                    <div className="h-32 bg-indigo-50/50 flex items-center justify-center border-b border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                        <span className="material-symbols-outlined text-[24px] font-semibold">deployed_code</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-850 block">Card title</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">Elevated card has more prominence with shadow.</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <button onClick={() => handleCardClick("Elevated Card")} className="text-indigo-650 hover:text-indigo-850 text-xs font-bold transition-colors flex items-center gap-1 bg-transparent border-none">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Outline Card */}
                <div className="bg-transparent rounded-2xl border-2 border-slate-200 hover:border-indigo-400 overflow-hidden flex flex-col justify-between transition-colors">
                  <div>
                    <div className="h-32 bg-emerald-50/10 flex items-center justify-center border-b-2 border-slate-200">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                        <span className="material-symbols-outlined text-[24px] font-semibold">shield</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-850 block">Card title</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">Outline card is useful for highlighting information.</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <button onClick={() => handleCardClick("Outline Card")} className="text-indigo-650 hover:text-indigo-850 text-xs font-bold transition-colors flex items-center gap-1 bg-transparent border-none">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4. Filled Card */}
                <div className="bg-indigo-50/30 rounded-2xl border border-indigo-100/60 overflow-hidden flex flex-col justify-between hover:bg-indigo-50/50 transition-colors">
                  <div>
                    <div className="h-32 bg-indigo-100/30 flex items-center justify-center border-b border-indigo-100/50">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-650 shadow-sm border border-indigo-100">
                        <span className="material-symbols-outlined text-[24px] font-semibold">bar_chart</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-850 block">Card title</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">Filled card uses background color for emphasis.</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <button onClick={() => handleCardClick("Filled Card")} className="text-indigo-650 hover:text-indigo-850 text-xs font-bold transition-colors flex items-center gap-1 bg-transparent border-none">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5. Horizontal Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex items-center gap-4 xl:col-span-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                    RS
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-bold text-slate-850 block truncate">Card title</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5 truncate">Horizontal card is great for compact layouts.</p>
                    <button onClick={() => handleCardClick("Horizontal Card")} className="text-indigo-650 hover:text-indigo-850 text-xs font-bold transition-colors flex items-center gap-0.5 mt-2 bg-transparent border-none">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 6. Interactive Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-indigo-400 hover:-translate-y-0.5 transition-all relative group cursor-pointer">
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLiked(!liked);
                      triggerToast(liked ? "Removed from favorites" : "Added to favorites");
                    }}
                    className="absolute top-3.5 right-3.5 z-10 p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <div onClick={() => handleCardClick("Interactive Card")}>
                    <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-350 border-b border-slate-150">
                      <Image className="w-8 h-8 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-850 block">Card title</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">Hover or focus to reveal interactive state.</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <button onClick={() => handleCardClick("Interactive Card")} className="text-indigo-650 hover:text-indigo-850 text-xs font-bold transition-colors flex items-center gap-1 bg-transparent border-none">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 7. Clickable Card */}
                <div 
                  onClick={() => handleCardClick("Clickable Card")}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition-all cursor-pointer relative"
                >
                  <ChevronRight className="absolute top-3.5 right-3.5 w-4 h-4 text-slate-400" />
                  <div>
                    <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-350 border-b border-slate-150">
                      <Image className="w-8 h-8" />
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-850 block">Card title</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">Entire card is clickable and navigates.</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <div className="text-indigo-655 text-xs font-bold flex items-center gap-1">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* CARD CONTENT TYPES Section */}
          {(activeTab === "Overview" || activeTab === "Content" || activeTab === "Actions") && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Card Content Types</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 items-stretch">
                
                {/* 1. Text Content */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow xl:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">Text Content</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-lg mb-3 shadow-inner">
                      <span>T</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">Used for text based information and updates.</p>
                  </div>
                </div>

                {/* 2. Image Content */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow xl:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">Image Content</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center mb-3 shadow-inner">
                      <Image className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">Perfect for visual content and media previews.</p>
                  </div>
                </div>

                {/* 3. List Content */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow xl:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">List Content</span>
                    <ul className="text-xs space-y-2 text-slate-600 font-semibold list-disc pl-4">
                      <li>First item</li>
                      <li>Second item</li>
                      <li>Third item</li>
                    </ul>
                  </div>
                </div>

                {/* 4. Stats Content */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow xl:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Stats Content</span>
                    <span className="text-2xl font-black text-slate-900 block leading-tight">8.2K</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Total Visitors</span>
                    
                    <div className="mt-3.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold">
                        ▲ 8.5%
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">vs last week</span>
                    </div>
                  </div>
                </div>

                {/* 5. User Content */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow xl:col-span-1 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 self-start">User Content</span>
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow mb-2">
                      RS
                    </div>
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Rahul Sharma</span>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Product Designer</span>
                  </div>
                  <button onClick={() => triggerToast("Viewing profile detail")} className="w-full mt-4 py-1 border border-indigo-200 hover:bg-indigo-50/20 text-indigo-655 font-bold rounded-lg text-[10px] transition-colors bg-white">
                    View Profile
                  </button>
                </div>

                {/* 6. Action Content */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow xl:col-span-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Action Content</span>
                    <p className="text-[11px] text-slate-500 leading-normal mb-4">Quick actions for common operations.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => triggerToast("Edit item")} className="flex-1 py-1.5 border border-indigo-200 hover:bg-indigo-50/30 text-indigo-650 font-bold rounded-lg text-[9px] flex items-center justify-center gap-1 transition-colors bg-white">
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => triggerToast("Delete item")} className="flex-1 py-1.5 border border-red-200 hover:bg-red-50 text-red-650 font-bold rounded-lg text-[9px] flex items-center justify-center gap-1 transition-colors bg-white">
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* CARD LAYOUTS Section */}
          {(activeTab === "Overview" || activeTab === "Layouts") && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Card Layouts</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                
                {/* 1. Single Column */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Single Column</span>
                    
                    {/* Visual diagram */}
                    <div className="border border-slate-100 bg-slate-50/50 p-3.5 rounded-xl space-y-2 mb-4">
                      <div className="h-4 bg-slate-200/80 rounded w-full"></div>
                      <div className="h-4 bg-slate-200/80 rounded w-full"></div>
                    </div>

                    <p className="text-[10px] text-slate-450 font-medium leading-relaxed">Content stacks vertically in a single column.</p>
                  </div>
                </div>

                {/* 2. Two Column */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Two Column</span>
                    
                    {/* Visual diagram */}
                    <div className="border border-slate-100 bg-slate-50/50 p-3.5 rounded-xl flex gap-2 mb-4">
                      <div className="h-6 bg-slate-200/80 rounded w-1/2"></div>
                      <div className="h-6 bg-slate-200/80 rounded w-1/2"></div>
                    </div>

                    <p className="text-[10px] text-slate-450 font-medium leading-relaxed">Content is split into two equal columns.</p>
                  </div>
                </div>

                {/* 3. Three Column */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Three Column</span>
                    
                    {/* Visual diagram */}
                    <div className="border border-slate-100 bg-slate-50/50 p-3.5 rounded-xl flex gap-2 mb-4">
                      <div className="h-6 bg-slate-200/80 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200/80 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200/80 rounded w-1/3"></div>
                    </div>

                    <p className="text-[10px] text-slate-450 font-medium leading-relaxed">Content is divided into three columns.</p>
                  </div>
                </div>

                {/* 4. Masonry Grid */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Masonry Grid</span>
                    
                    {/* Visual diagram */}
                    <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl grid grid-cols-2 gap-2 mb-4">
                      <div className="space-y-2">
                        <div className="h-8 bg-slate-200/80 rounded w-full"></div>
                        <div className="h-4 bg-slate-200/80 rounded w-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200/80 rounded w-full"></div>
                        <div className="h-8 bg-slate-200/80 rounded w-full"></div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-450 font-medium leading-relaxed">Cards of varying height in a grid layout.</p>
                  </div>
                </div>

              </div>
            </section>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Card Guidelines</h4>
            <ul className="space-y-3.5">
              {GUIDELINES.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-normal font-semibold">
                  <Check className="w-4 h-4 text-emerald-500 font-bold shrink-0 mt-0.5" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Accessibility</h4>
            <ul className="space-y-3.5">
              {ACCESSIBILITY_ITEMS.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-normal font-semibold">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          <div className="bg-[#0B1120] text-slate-300 rounded-2xl p-6 shadow-lg border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code Example (HTML)</h4>
              <button 
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all border-none"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#070b15] text-[#94a3b8] p-3.5 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-64 custom-scrollbar border border-slate-800/80">
              <code>{CODE_EXAMPLE_HTML}</code>
            </pre>
          </div>

          {/* When to Use */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">When to Use</h4>
            <ul className="space-y-3.5">
              {[
                "Dashboard widgets and summaries.",
                "Product or content previews.",
                "Grouping related information.",
                "Showcasing features or benefits.",
                "User profiles and team members."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-normal font-semibold">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </aside>

      </div>
      
      {/* Footer Branding */}
      <footer className="mt-12 pt-6 pb-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Design with consistency. Build with confidence.</span>
        <div className="flex items-center gap-4">
          <span>Katabazaar Design System © 2024</span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-650 border border-indigo-100 rounded">v1.0.0</span>
        </div>
      </footer>

    </div>
  );
}
