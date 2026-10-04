"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Loader2,
  RefreshCw, CheckCircle2, Lock, ArrowRight, Play, Eye
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Sizes", "Behavior", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use loaders to set user expectations.", ok: true },
  { label: "Match loader type to the context.", ok: true },
  { label: "Avoid excessive or long-running loaders.", ok: true },
  { label: "Provide progress when duration is known.", ok: true },
  { label: "Remove loaders immediately after completion.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"status\" for loader containers.", ok: true },
  { label: "Add aria-label to describe the loading content.", ok: true },
  { label: "Do not rely solely on animation.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Respect prefers-reduced-motion.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="loader-container" role="status" aria-label="Loading content">
  <div class="loader-spinner"></div>
</div>

<style>
.loader-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>`,
  Examples: `<div class="btn-loading flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
  <svg class="animate-spin h-4 w-4 text-white">...</svg>
  <span>Loading...</span>
</div>`,
  Types: `<div class="loader-dots flex gap-1">
  <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
  <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
  <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
</div>`,
  Sizes: `<div class="w-4 h-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
<div class="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>`
};

export default function DSLoadersPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProgress, setCurrentProgress] = useState(45);

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – LOADERS</h1>
            <Loader2 className="w-5 h-5 text-indigo-650 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Loaders indicate that a process is in progress and help set user expectations.</p>
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
                <span className="material-symbols-outlined text-[24px] block">refresh</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Loader Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 Styles</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">crop_free</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sizes</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">5 Sizes</span>
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

          {/* Loader Types Grid */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loader Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Spinner */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Spinner</span>
                <div className="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Standard circular spinner.</span>
              </div>

              {/* Dots */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dots</span>
                <div className="flex gap-1.5 py-3">
                  <div className="w-2.5 h-2.5 bg-indigo-650 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                  <div className="w-2.5 h-2.5 bg-indigo-650 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-indigo-650 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] text-slate-455 leading-relaxed block">Pulsing dots animation.</span>
              </div>

              {/* Bars */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bars</span>
                <div className="flex gap-1 py-1 items-end h-8">
                  <div className="w-1.5 bg-indigo-600 rounded-full animate-pulse h-6"></div>
                  <div className="w-1.5 bg-indigo-600 rounded-full animate-pulse h-8 [animation-delay:0.15s]"></div>
                  <div className="w-1.5 bg-indigo-600 rounded-full animate-pulse h-4 [animation-delay:0.3s]"></div>
                </div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Animated bar sequence.</span>
              </div>

              {/* Pulse */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pulse</span>
                <div className="w-8 h-8 bg-indigo-600/25 rounded-lg animate-ping"></div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Pulsing single element.</span>
              </div>

              {/* Ring */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ring</span>
                <div className="w-8 h-8 rounded-full border-[3px] border-indigo-600/30 border-t-indigo-600 animate-spin"></div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Circular ring with stroke.</span>
              </div>

              {/* Dual Ring */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dual Ring</span>
                <div className="w-8 h-8 rounded-full border-[3px] border-indigo-600 border-t-transparent border-b-transparent animate-spin"></div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Dual color rotating ring.</span>
              </div>

              {/* Ellipsis */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ellipsis</span>
                <div className="flex gap-1.5 py-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Expanding ellipsis.</span>
              </div>

              {/* Progress */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 bg-[#FCFCFC] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden max-w-[120px]">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${currentProgress}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-450 leading-relaxed block">Determinate progress bar ({currentProgress}%).</span>
              </div>

            </div>
          </section>

          {/* Loader Sizes */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sizes</h3>
              <p className="text-[11px] text-slate-450 mt-1">Loaders are available in multiple sizes matching text or icon boundaries.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 items-center justify-items-center">
              {/* Extra Small */}
              <div className="text-center space-y-2">
                <div className="w-3 h-3 border border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <span className="text-[10px] font-bold text-slate-500 block">Extra Small (12px)</span>
              </div>

              {/* Small */}
              <div className="text-center space-y-2">
                <div className="w-4 h-4 border-[2px] border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <span className="text-[10px] font-bold text-slate-500 block">Small (16px)</span>
              </div>

              {/* Medium */}
              <div className="text-center space-y-2">
                <div className="w-6 h-6 border-[2.5px] border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <span className="text-[10px] font-bold text-slate-500 block">Medium (24px)</span>
              </div>

              {/* Large */}
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <span className="text-[10px] font-bold text-slate-500 block">Large (32px)</span>
              </div>

              {/* Extra Large */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 border-[4px] border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <span className="text-[10px] font-bold text-slate-500 block">Extra Large (48px)</span>
              </div>
            </div>
          </section>

          {/* Usage Contexts Showcase */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usage Contexts Showcase</h3>
              <p className="text-[11px] text-slate-450 mt-1">Typical integration patterns inside merchant interface contexts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Button loading context */}
              <div className="p-5 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Button Loading</span>
                  <p className="text-[11px] text-slate-450 leading-relaxed mb-4">Inside primary/secondary action buttons during execution.</p>
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow shadow-indigo-600/10">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Loading...</span>
                </button>
              </div>

              {/* Data Fetching loading context */}
              <div className="p-5 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Data Fetching</span>
                  <p className="text-[11px] text-slate-450 leading-relaxed mb-4">Inside cards or panels while content sections load.</p>
                </div>
                <div className="border border-slate-200 bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center h-24">
                  <div className="flex gap-1.5 items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">Fetching transaction details...</span>
                </div>
              </div>

              {/* Overlay loading context */}
              <div className="p-5 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Overlay Loading</span>
                  <p className="text-[11px] text-slate-450 leading-relaxed mb-4">Block interface interactions during critical processes.</p>
                </div>
                <div className="border border-slate-200 bg-white rounded-xl flex items-center justify-center relative overflow-hidden h-24 shadow-sm">
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    <span className="text-[8px] font-bold text-indigo-700 tracking-wide bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">Processing Payment</span>
                  </div>
                  <div className="opacity-20 text-[9px] p-2 space-y-1 w-full">
                    <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Loader Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Loader Guidelines</h3>
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
              <p>• Action processing transitions (e.g. submit clicks).</p>
              <p>• Data loading inside components/sections.</p>
              <p>• Screen transition overlays.</p>
              <p>• Informing users about background tasks.</p>
              <p>• Continuous operations where total duration is unknown.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
