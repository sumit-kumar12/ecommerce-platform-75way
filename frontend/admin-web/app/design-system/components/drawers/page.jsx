"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Menu, Bell,
  ShoppingCart, Sliders, Star, ArrowRight, ArrowLeft, ArrowUp, ArrowDown
} from "lucide-react";

const TABS = ["Overview", "Examples", "Sizes", "Behavior", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use drawers to display supplementary content.", ok: true },
  { label: "Keep primary content in the underlying page.", ok: true },
  { label: "Allow users to close the drawer easily.", ok: true },
  { label: "Don't use drawers for critical or blocking flows.", ok: true },
  { label: "Ensure content is scrollable if it overflows.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"dialog\" and aria-modal=\"true\".", ok: true },
  { label: "Label the drawer with aria-labelledby.", ok: true },
  { label: "Trap focus inside the drawer when open.", ok: true },
  { label: "Provide a clear way to close the drawer.", ok: true },
  { label: "Return focus to the triggering element.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="drawer drawer-right" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  <div class="drawer-overlay"></div>
  <div class="drawer-content">
    <div class="drawer-header">
      <h2 id="drawer-title">Filters</h2>
      <button class="drawer-close" aria-label="Close">&times;</button>
    </div>
    <div class="drawer-body">
      <!-- Drawer content goes here -->
    </div>
  </div>
</div>`,
  Examples: `<div class="drawer drawer-left" role="dialog">
  <div class="drawer-content">
    <!-- Navigation Links -->
  </div>
</div>`,
  Sizes: `<div class="drawer-content max-w-md w-full">
  <!-- Medium Drawer (480px / max-w-md) -->
</div>`,
  Behavior: `<div class="drawer-overlay bg-slate-900/50 backdrop-blur-sm transition-opacity"></div>`
};

export default function DSDrawersPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer States
  const [activeDrawer, setActiveDrawer] = useState(null); // 'right', 'left', 'top', 'bottom'
  const [drawerSize, setDrawerSize] = useState("medium"); // 'small', 'medium', 'large'

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDrawerSizeClass = () => {
    if (activeDrawer === "top" || activeDrawer === "bottom") {
      switch (drawerSize) {
        case "small": return "h-[240px]";
        case "large": return "h-[480px]";
        default: return "h-[360px]";
      }
    } else {
      switch (drawerSize) {
        case "small": return "max-w-[320px]";
        case "large": return "max-w-[720px]";
        default: return "max-w-[480px]"; // medium
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative overflow-x-hidden">
      
      {/* Drawer Overlay Backdrop */}
      {activeDrawer && (
        <div 
          onClick={() => setActiveDrawer(null)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div 
        role="dialog" 
        aria-modal="true"
        className={`fixed z-50 bg-white shadow-2xl flex flex-col transition-all duration-350 ease-out border-slate-200 ${getDrawerSizeClass()} ${
          activeDrawer === "right" ? "top-0 right-0 h-full w-full border-l animate-slide-in-right" :
          activeDrawer === "left" ? "top-0 left-0 h-full w-full border-r animate-slide-in-left" :
          activeDrawer === "top" ? "top-0 left-0 w-full border-b animate-slide-in-top" :
          activeDrawer === "bottom" ? "bottom-0 left-0 w-full border-t animate-slide-in-bottom" :
          "hidden"
        }`}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 capitalize">
            {activeDrawer} Drawer ({drawerSize})
          </h2>
          <button 
            onClick={() => setActiveDrawer(null)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          {activeDrawer === "right" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-800">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Home Decor</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Range</label>
                    <span className="text-xs font-semibold text-slate-700">$10 - $500</span>
                  </div>
                  <input type="range" min="10" max="500" className="w-full accent-indigo-650" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex gap-2">
                    {["4* +", "3* +", "2* +"].map(rating => (
                      <button key={rating} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors mt-8">
                Apply Filters
              </button>
            </div>
          )}

          {activeDrawer === "left" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">K</div>
                <span className="text-sm font-bold text-slate-900 tracking-tight">Katabazaar</span>
              </div>
              <nav className="flex flex-col gap-1">
                {["Dashboard", "Orders", "Products", "Customers", "Reports", "Settings", "Help & Support"].map(link => (
                  <button key={link} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    {link}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {activeDrawer === "top" && (
            <div className="max-w-4xl mx-auto space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border border-slate-200 rounded-lg flex items-start gap-2 bg-slate-50">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">New order received</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 min ago</p>
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg flex items-start gap-2 bg-slate-50">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Payment received</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">15 min ago</p>
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg flex items-start gap-2 bg-slate-50">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Product out of stock</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="text-center pt-2">
                <button onClick={() => setActiveDrawer(null)} className="text-xs font-bold text-indigo-650 hover:underline">View all notifications</button>
              </div>
            </div>
          )}

          {activeDrawer === "bottom" && (
            <div className="max-w-md mx-auto flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg border flex items-center justify-center text-2xl shadow-inner shrink-0">🎧</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Noise Cancelling Headphones</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">$129.00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0">
                  <button className="px-2.5 py-1.5 text-xs font-bold hover:bg-slate-50 border-r border-slate-200">-</button>
                  <span className="px-3 text-xs font-bold">1</span>
                  <button className="px-2.5 py-1.5 text-xs font-bold hover:bg-slate-50 border-l border-slate-200">+</button>
                </div>
                <button onClick={() => setActiveDrawer(null)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header Info */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – DRAWERS</h1>
            <span className="material-symbols-outlined text-[24px] text-indigo-650 block">side_navigation</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Drawers slide in from the edge of the screen to present additional content and actions.</p>
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
                <span className="material-symbols-outlined text-[24px] block">side_navigation</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drawer Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">4 Position Options</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">view_headline</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sizes</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">3 Main Sizes</span>
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

          {/* Interactive Trigger Panel */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drawer Examples & Interactive Triggers</h3>
              <p className="text-[11px] text-slate-455 mt-1">Select size and position to trigger the active drawer overlay component.</p>
            </div>

            {/* Playground Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Playground Size:</span>
                {["small", "medium", "large"].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setDrawerSize(sz)}
                    className={`px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold capitalize transition-colors ${
                      drawerSize === sz ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-slate-600"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Triggers grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveDrawer("right")} 
                className="p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 text-center transition-all flex flex-col items-center gap-3.5 group shadow-sm bg-white"
              >
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Right Drawer</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">e.g. Filters</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveDrawer("left")} 
                className="p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 text-center transition-all flex flex-col items-center gap-3.5 group shadow-sm bg-white"
              >
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Left Drawer</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">e.g. Navigation</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveDrawer("top")} 
                className="p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 text-center transition-all flex flex-col items-center gap-3.5 group shadow-sm bg-white"
              >
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                  <ArrowDown className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Top Drawer</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">e.g. Alerts</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveDrawer("bottom")} 
                className="p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 text-center transition-all flex flex-col items-center gap-3.5 group shadow-sm bg-white"
              >
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                  <ArrowUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Bottom Drawer</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">e.g. Add to Cart</span>
                </div>
              </button>
            </div>
          </section>

          {/* Sizes and Overlay Behavior Comparison Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual sizes block */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drawer Sizes</h3>
              
              <div className="space-y-3 text-xs leading-normal">
                <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Small (320px width)</span>
                    <span className="text-[10px] text-slate-450 block">Ideal for side panels & narrow devices.</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-[9px]">320px</span>
                </div>

                <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Medium (480px width)</span>
                    <span className="text-[10px] text-slate-450 block">Standard default option for forms & filters.</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-[9px]">480px</span>
                </div>

                <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Large (720px width)</span>
                    <span className="text-[10px] text-slate-450 block">Ideal for large tables or multi-step wizards.</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-[9px]">720px</span>
                </div>
              </div>
            </div>

            {/* Overlay Behavior */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overlay Backdrop Behavior</h3>
              
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center gap-4 relative overflow-hidden h-[130px]">
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 shadow-md">
                      Backdrop Active
                    </span>
                  </div>
                  <div className="flex-1 space-y-2 opacity-30">
                    <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">
                  Backdrop overlays focus user attention on the drawer, dimming the rest of the page. Clicking outside the drawer closes it by default.
                </p>
              </div>
            </div>

          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Drawer Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Drawer Guidelines</h3>
            <div className="space-y-3">
              {GUIDELINES.map(g => (
                <div key={g.label} className="flex gap-2.5 items-start">
                  <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-slate-650 leading-relaxed">{g.label}</span>
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
                  <span className="text-xs text-slate-650 leading-relaxed">{g.label}</span>
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
            <div className="space-y-3 text-xs text-slate-655 leading-normal font-medium">
              <p>• To show details without navigating away.</p>
              <p>• For filters, settings, or additional forms.</p>
              <p>• To provide quick actions or workflows.</p>
              <p>• To present contextual information.</p>
              <p>• When screen space needs to be preserved.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
