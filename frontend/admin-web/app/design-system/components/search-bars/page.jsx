"use client";

import React, { useState } from "react";
import { 
  Search, X, Sliders, ChevronDown, Download, Info, Check, 
  Clock, ArrowRight, CornerDownLeft, ShieldAlert
} from "lucide-react";

const TABS = ["Overview", "Variants", "States", "Sizes", "Suggestions", "Best Practices"];

const GUIDELINES = [
  { label: "Use clear placeholder text to indicate search purpose.", ok: true },
  { label: "Provide clear affordances for actions (search, clear, filters).", ok: true },
  { label: "Show suggestions to help users discover faster.", ok: true },
  { label: "Support keyboard navigation and shortcuts.", ok: true },
  { label: "Provide feedback for no results and loading states.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use aria-label or aria-labelledby for screen readers.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Support keyboard navigation (Tab, Enter, Esc).", ok: true },
  { label: "Announce results to screen readers.", ok: true }
];

export default function DSSearchBarsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Interactive States
  const [typedQuery, setTypedQuery] = useState("iphone 15");
  const [playgroundQuery, setPlaygroundQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "iPhone 15 Pro Max",
    "MacBook Air M2",
    "Samsung Galaxy S24",
    "Wireless Headphones"
  ]);

  const [activeSearchFocus, setActiveSearchFocus] = useState(false);

  const mockSuggestions = [
    "iPhone 15",
    "iPhone 15 Pro",
    "iPhone 14",
    "iPhone Charger",
    "iPhone Case"
  ];

  const filteredSuggestions = playgroundQuery 
    ? mockSuggestions.filter(item => item.toLowerCase().includes(playgroundQuery.toLowerCase()))
    : [];

  const handleCopyCode = () => {
    const code = `<div class="search-bar">
  <span class="search-icon">
    <i data-icon="search"></i>
  </span>
  <input type="text" placeholder="Search anything..." aria-label="Search" />
  <button class="clear-btn" aria-label="Clear">
    <i data-icon="x"></i>
  </button>
</div>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS2 – SEARCH BARS</h1>
            <Search className="w-5 h-5 text-indigo-650" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Search bars help users find information quickly and efficiently.</p>
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

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side Blocks */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">search</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Variants</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">toggle_on</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">States</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">7 States</span>
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

          {/* Search Variants */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Search Variants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Default Search */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default Search</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full pl-10 pr-14 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 border border-slate-200 bg-slate-50 text-slate-400 rounded text-[10px] font-mono font-bold">
                    <span>⌘</span><span>K</span>
                  </div>
                </div>
              </div>

              {/* With Icon Button */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Icon Button</label>
                <div className="relative flex">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none shadow-sm"
                  />
                  <button className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 text-slate-600 transition-colors">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* With Clear Button */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Clear Button</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    defaultValue="Query text"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none shadow-sm font-medium text-slate-850"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* With Filters */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Filters</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search products, orders..." 
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none shadow-sm"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* With Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Dropdown</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none shadow-sm"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* With Action */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Action</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none shadow-sm"
                    />
                  </div>
                  <button className="bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold px-4.5 py-2.5 shadow-sm transition-all whitespace-nowrap">
                    Search
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Search States */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Search States</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
              
              {/* Default */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Search..." readOnly className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-md text-xs placeholder-slate-400 cursor-default focus:outline-none" />
                </div>
              </div>

              {/* Hover */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hover</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Search..." readOnly className="w-full pl-8 pr-3 py-2 bg-white border border-slate-350 rounded-md text-xs placeholder-slate-400 cursor-default focus:outline-none" />
                </div>
              </div>

              {/* Focused */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Focused</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500" />
                  <input type="text" placeholder="Search..." readOnly className="w-full pl-8 pr-3 py-2 bg-white border border-indigo-500 ring-2 ring-indigo-500/20 rounded-md text-xs outline-none cursor-default" />
                </div>
              </div>

              {/* Typing */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Typing</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input type="text" value={typedQuery} onChange={(e) => setTypedQuery(e.target.value)} className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500" />
                  <button onClick={() => setTypedQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* No Results */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase text-amber-600">No Results</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450" />
                  <input type="text" value="No results found" readOnly className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 font-semibold" />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-150 text-slate-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Disabled */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                  <input type="text" placeholder="Search..." disabled className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs placeholder-slate-300 cursor-not-allowed" />
                </div>
              </div>

            </div>
          </section>

          {/* Search Sizes */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Search Sizes</h3>
            
            <div className="space-y-4">
              {/* Small */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Small</label>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder-slate-400 focus:outline-none" />
                </div>
              </div>

              {/* Medium */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Medium (Default)</label>
                <div className="relative w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none" />
                </div>
              </div>

              {/* Large */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Large</label>
                <div className="relative w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input type="text" placeholder="Search..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-base placeholder-slate-400 focus:outline-none" />
                </div>
              </div>

              {/* Extra Large */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Extra Large</label>
                <div className="relative w-full max-w-lg">
                  <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Search..." className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-xl text-lg placeholder-slate-400 focus:outline-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Search with Suggestions Grid */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Search with Suggestions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Recent Searches Panel */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Recent Searches</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Search..." readOnly className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-md text-xs placeholder-slate-400 focus:outline-none" />
                </div>
                <div className="border border-slate-200 rounded-lg shadow-md bg-white p-2 text-xs space-y-1">
                  {recentSearches.map(item => (
                    <div key={item} className="px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-650 transition-colors">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {recentSearches.length === 0 && (
                    <div className="px-2 py-4 text-center text-slate-400">No recent searches</div>
                  )}
                  {recentSearches.length > 0 && (
                    <div className="pt-2 mt-1 border-t border-slate-100 flex justify-start">
                      <button onClick={clearRecent} className="text-[10px] font-bold text-red-500 hover:text-red-750 transition-colors bg-transparent border-none">
                        Clear recent searches
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions Panel */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Suggestions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-550" />
                  <input type="text" value="iph" readOnly className="w-full pl-8 pr-3 py-2 bg-white border border-indigo-500 ring-2 ring-indigo-500/20 rounded-md text-xs font-semibold text-slate-800" />
                </div>
                <div className="border border-slate-200 rounded-lg shadow-md bg-white p-2 text-xs space-y-1">
                  {mockSuggestions.map(item => (
                    <div key={item} className="px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-650 transition-colors">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <strong className="text-slate-900 font-bold">iph</strong>
                        <span>{item.substring(3)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <button className="text-[10px] font-bold text-indigo-650 hover:text-indigo-800 transition-colors bg-transparent border-none">
                      View all results for "iph"
                    </button>
                  </div>
                </div>
              </div>

              {/* With Categories Panel */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Categories</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450" />
                  <input type="text" placeholder="Search products..." readOnly className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-md text-xs" />
                  <X className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                </div>
                <div className="border border-slate-200 rounded-lg shadow-md bg-white p-2 text-xs space-y-0.5">
                  {[
                    { label: "Products", desc: "Search in products" },
                    { label: "Orders", desc: "Search in orders" },
                    { label: "Customers", desc: "Search in customers" },
                    { label: "Categories", desc: "Search in categories" }
                  ].map(cat => (
                    <div key={cat.label} className="px-2.5 py-2 rounded hover:bg-slate-50 cursor-pointer flex items-center justify-between text-slate-600 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-xs">{cat.label}</span>
                        <span className="text-[10px] text-slate-400 leading-normal">{cat.desc}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* With Recent + Suggestions Panel */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Recent + Suggestions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450" />
                  <input type="text" value="mac" readOnly className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-md text-xs" />
                </div>
                <div className="border border-slate-200 rounded-lg shadow-md bg-white p-3.5 text-xs space-y-3">
                  
                  {/* Recent Group */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recent</div>
                    <div className="px-1 py-1 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-650 transition-colors">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>MacBook Pro 14"</span>
                    </div>
                    <div className="px-1 py-1 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-650 transition-colors">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>MacBook Air M2</span>
                    </div>
                  </div>

                  {/* Suggestions Group */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Suggestions</div>
                    <div className="px-1 py-1 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-650 transition-colors">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>MacBook Pro 16"</span>
                    </div>
                    <div className="px-1 py-1 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-650 transition-colors">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>Magic Mouse</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Interactive Playground */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Interactive Playground</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-6">
                
                {/* Search Bar with Live Suggestions */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-700">Search with Auto-suggestions</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      value={playgroundQuery}
                      onChange={(e) => setPlaygroundQuery(e.target.value)}
                      onFocus={() => setActiveSearchFocus(true)}
                      onBlur={() => setTimeout(() => setActiveSearchFocus(false), 200)}
                      placeholder="Type 'iph' to see dynamic suggestions..." 
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm font-medium"
                    />
                    {playgroundQuery && (
                      <button 
                        onClick={() => setPlaygroundQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {activeSearchFocus && (
                    <div className="absolute top-full left-0 w-full mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-30">
                      
                      {/* Show live matches */}
                      {playgroundQuery ? (
                        <>
                          {filteredSuggestions.map(item => (
                            <div 
                              key={item}
                              onClick={() => {
                                setPlaygroundQuery(item);
                              }}
                              className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2.5">
                                <Search className="w-4 h-4 text-slate-400" />
                                <span>{item}</span>
                              </div>
                              <CornerDownLeft className="w-3 h-3 text-slate-350" />
                            </div>
                          ))}
                          {filteredSuggestions.length === 0 && (
                            <div className="px-4 py-6 text-center text-xs text-slate-450 flex flex-col items-center justify-center gap-1">
                              <ShieldAlert className="w-6 h-6 text-amber-500" />
                              <span className="font-semibold text-slate-700">No direct suggestions match</span>
                              <span>Press enter to search for "{playgroundQuery}"</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recent Searches</div>
                          {recentSearches.map(item => (
                            <div 
                              key={item}
                              onClick={() => {
                                setPlaygroundQuery(item);
                              }}
                              className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2.5"
                            >
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <div className="bg-slate-900 text-slate-350 p-5 rounded-xl font-mono text-xs leading-relaxed space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Live Selected Query</div>
                  <pre className="text-indigo-300 font-bold whitespace-pre-wrap">
                    {JSON.stringify({
                      searchQuery: playgroundQuery || null,
                      filteredResultsCount: filteredSuggestions.length,
                      recentCount: recentSearches.length
                    }, null, 2)}
                  </pre>
                </div>
                <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-800 pt-3">
                  This mock console captures the state of the suggestions autocomplete search bar in real-time. Try typing "iphone" or clicking elements.
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar panel */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Usage guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Search Guidelines</h3>
            <div className="space-y-3">
              {GUIDELINES.map(g => (
                <div key={g.label} className="flex gap-2.5 items-start">
                  <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">{g.label}</span>
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
                  <div className="p-0.5 rounded-full bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] block font-bold">universal_access</span>
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code example code block */}
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
{`<div class="search-bar">
  <span class="search-icon">
    <i data-icon="search"></i>
  </span>
  <input type="text" placeholder="Search anything..." aria-label="Search" />
  <button class="clear-btn" aria-label="Clear">
    <i data-icon="x"></i>
  </button>
</div>`}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3">
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-650 leading-normal">
                  <strong className="text-slate-800">Default Search:</strong> For general purpose, fast search.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-650 leading-normal">
                  <strong className="text-slate-800">With Filters:</strong> When the search scope is large and filters refine it.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-650 leading-normal">
                  <strong className="text-slate-800">With Dropdown:</strong> When searching categories or separate databases.
                </span>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
