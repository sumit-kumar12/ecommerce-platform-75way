"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Inbox,
  HelpCircle, CheckCircle2, Lock, ArrowRight, Play, Eye, 
  FolderOpen, MessageSquare, Bell, Heart, Bookmark, ShoppingBag, Telescope
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Variants", "Usage", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use empty states to handle lack of content.", ok: true },
  { label: "Provide clear guidance on what to do next.", ok: true },
  { label: "Keep messages concise and helpful.", ok: true },
  { label: "Use illustrations to make it friendly.", ok: true },
  { label: "Align with the tone and brand voice.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"status\" for the container.", ok: true },
  { label: "Provide meaningful headings.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Buttons must be keyboard accessible.", ok: true },
  { label: "Don't rely on images alone to convey meaning.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="empty-state" role="status" aria-label="No data available">
  <div class="empty-state-illustration">
    <svg>...</svg>
  </div>
  <h3 class="empty-state-title">No Data Found</h3>
  <p class="empty-state-description">No data matches your search or filters.</p>
  <div class="empty-state-actions">
    <button class="btn btn-primary">Clear Filters</button>
  </div>
</div>`,
  Examples: `<div class="empty-state text-center p-8 border border-dashed rounded-xl">
  <div class="icon-wrapper mb-4">...</div>
  <h4>No notifications</h4>
</div>`,
  Types: `<div class="empty-state-type-card">...</div>`,
  Variants: `<div class="empty-state-minimal">...</div>`
};

export default function DSEmptyStatesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("illustration"); // illustration, minimal, icon-focused, action-oriented, informational

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIllustration = (type) => {
    const mainColor = "text-indigo-600";
    const subColor = "text-indigo-200";

    switch (type) {
      case "no-data":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="20" width="50" height="60" rx="4" className="stroke-indigo-200" strokeWidth="2" />
            <line x1="35" y1="35" x2="65" y2="35" className="stroke-indigo-100" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="45" x2="55" y2="45" className="stroke-indigo-100" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="55" x2="60" y2="55" className="stroke-indigo-100" strokeWidth="2" strokeLinecap="round" />
            <circle cx="65" cy="65" r="12" className="fill-white stroke-indigo-600" strokeWidth="2" />
            <line x1="73" y1="73" x2="83" y2="83" className="stroke-indigo-600" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case "no-results":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="45" r="20" className="stroke-indigo-200" strokeWidth="2" />
            <line x1="50" y1="65" x2="50" y2="85" className="stroke-indigo-200" strokeWidth="2" />
            <line x1="40" y1="85" x2="60" y2="85" className="stroke-indigo-200" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 35 L58 55" className="stroke-indigo-650" strokeWidth="3" strokeLinecap="round" />
            <path d="M58 35 L42 55" className="stroke-indigo-650" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case "no-items":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 30 C20 26 24 22 28 22 H42 L48 30 H80 C84 30 88 34 88 38 V74 C88 78 84 82 80 82 H28 C24 82 20 78 20 74 V30 Z" className="stroke-indigo-200" strokeWidth="2" />
            <circle cx="54" cy="56" r="10" className="fill-white stroke-indigo-600" strokeWidth="2" />
            <line x1="54" y1="51" x2="54" y2="61" className="stroke-indigo-600" strokeWidth="2" />
            <line x1="49" y1="56" x2="59" y2="56" className="stroke-indigo-600" strokeWidth="2" />
          </svg>
        );
      case "no-orders":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 35 H70 L75 80 H25 L30 35 Z" className="stroke-indigo-200" strokeWidth="2" />
            <path d="M40 35 C40 25 45 20 50 20 C55 20 60 25 60 35" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="55" r="8" className="stroke-indigo-200" strokeWidth="2" />
          </svg>
        );
      case "no-messages":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 25 H75 C79 25 82 28 82 32 V60 C82 64 79 67 75 67 H60 L45 80 V67 H25 C21 67 18 64 18 60 V32 C18 28 21 25 25 25 Z" className="stroke-indigo-200" strokeWidth="2" />
            <circle cx="38" cy="46" r="2.5" className="fill-indigo-600" />
            <circle cx="50" cy="46" r="2.5" className="fill-indigo-600" />
            <circle cx="62" cy="46" r="2.5" className="fill-indigo-600" />
          </svg>
        );
      case "no-notifications":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 C38 15 32 25 32 38 V55 L25 65 H75 L68 55 V38 C68 25 62 15 50 15 Z" className="stroke-indigo-200" strokeWidth="2" strokeLinejoin="round" />
            <path d="M42 70 C44 76 46 78 50 78 C54 78 56 76 58 70" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="12" r="3" className="fill-indigo-600" />
          </svg>
        );
      case "no-favorites":
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 78 L43 72 C25 56 12 44 12 29 C12 17 21 8 33 8 C40 8 46 12 50 17 C54 12 60 8 67 8 C79 8 88 17 88 29 C88 44 75 56 57 72 L50 78 Z" className="stroke-indigo-200" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default: // no-saved
        return (
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 20 H72 V80 L50 68 L28 80 V20 Z" className="stroke-indigo-200" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "no-data": return <Search className="w-8 h-8 text-indigo-600" />;
      case "no-results": return <Telescope className="w-8 h-8 text-indigo-600" />;
      case "no-items": return <FolderOpen className="w-8 h-8 text-indigo-600" />;
      case "no-orders": return <ShoppingBag className="w-8 h-8 text-indigo-600" />;
      case "no-messages": return <MessageSquare className="w-8 h-8 text-indigo-600" />;
      case "no-notifications": return <Bell className="w-8 h-8 text-indigo-600" />;
      case "no-favorites": return <Heart className="w-8 h-8 text-indigo-600" />;
      default: return <Bookmark className="w-8 h-8 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – EMPTY STATES</h1>
            <span className="material-symbols-outlined text-[24px] text-indigo-650 block">inbox</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Empty states communicate absence of data and guide users on what to do next.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search components..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

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

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left main block */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-650 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">inbox</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Empty States</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 Variations</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">palette</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">5 Layouts</span>
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
              <div className="p-3 bg-orange-50 text-orange-655 rounded-xl">
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

          {/* Interactive Variation Selector for Showcase */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <span className="text-xs font-semibold text-slate-500 mr-2">Showcase Style Variant:</span>
              {["illustration", "minimal", "icon-focused", "action-oriented", "informational"].map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    selectedVariant === v 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {v.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State Grid Examples */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. No Data Found */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Data Found</span>
              
              {selectedVariant === "illustration" && getIllustration("no-data")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-data")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Data Found</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">No data matches your search or filters.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm">
                  Clear Filters
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 2. No Results */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Results</span>
              
              {selectedVariant === "illustration" && getIllustration("no-results")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-results")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Results</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">We couldn't find any results for your search.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm border-none">
                  Try Different Search
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 3. No Items */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Items</span>
              
              {selectedVariant === "illustration" && getIllustration("no-items")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-items")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Items</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">You haven't added anything yet. Get started by adding your first item.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm border-none">
                  Add New Item
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 4. No Orders */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Orders</span>
              
              {selectedVariant === "illustration" && getIllustration("no-orders")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-orders")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Orders</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-455 leading-relaxed max-w-[180px]">You don't have any orders yet. Start shopping now!</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm">
                  Browse Products
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 5. No Messages */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Messages</span>
              
              {selectedVariant === "illustration" && getIllustration("no-messages")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-messages")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Messages</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">No messages yet. Start a conversation.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm">
                  New Message
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 6. No Notifications */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Notifications</span>
              
              {selectedVariant === "illustration" && getIllustration("no-notifications")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-notifications")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Notifications</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">You're all caught up! No new notifications.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm">
                  View All
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 7. No Favorites */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Favorites</span>
              
              {selectedVariant === "illustration" && getIllustration("no-favorites")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-favorites")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Favorites</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">You haven't added any favorites yet. Items you love will appear here.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm">
                  Explore Now
                </button>
              ) : <div className="h-8"></div>}
            </div>

            {/* 8. No Saved Items */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">No Saved Items</span>
              
              {selectedVariant === "illustration" && getIllustration("no-saved")}
              {selectedVariant === "icon-focused" && <div className="p-4 bg-indigo-50 rounded-full mb-3">{getIcon("no-saved")}</div>}
              {selectedVariant === "minimal" && <div className="h-6"></div>}
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Saved Items</h4>
                {selectedVariant !== "minimal" && (
                  <p className="text-[11px] text-slate-450 leading-relaxed max-w-[180px]">You don't have any saved items yet. Save items to view them here.</p>
                )}
              </div>

              {selectedVariant !== "informational" ? (
                <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg transition-colors mt-4 shadow-sm">
                  Save Items
                </button>
              ) : <div className="h-8"></div>}
            </div>

          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Empty State Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Empty State Guidelines</h3>
            <div className="space-y-3">
              {GUIDELINES.map(g => (
                <div key={g.label} className="flex gap-2.5 items-start">
                  <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-slate-655 leading-relaxed">{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Accessibility</h3>
            <div className="space-y-3">
              {ACCESSIBILITY_ITEMS.map(g => (
                <div key={g.label} className="flex gap-2.5 items-start">
                  <div className="p-0.5 rounded-full bg-indigo-50 text-indigo-650 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] block font-bold">universal_access</span>
                  </div>
                  <span className="text-xs text-slate-655 leading-relaxed">{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code Example (HTML)</h3>
              <button 
                onClick={handleCopyCode}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-350 p-3.5 rounded-lg text-[10px] font-mono leading-normal overflow-x-auto whitespace-pre max-h-48 scrollbar-thin">
              {CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3 text-xs text-slate-650 leading-normal font-medium">
              <p>• Screens with zero user data initially (first-time onboarding).</p>
              <p>• Search results pages with zero matched queries.</p>
              <p>• Cleared categories, folders, or inboxes.</p>
              <p>• Shopping carts with no items added.</p>
              <p>• Error states where data failed to load.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
