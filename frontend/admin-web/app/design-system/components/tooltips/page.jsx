"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, HelpCircle,
  Sparkles, CheckCircle2, Lock, ArrowRight, Play, Eye
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Placement", "Behavior", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Keep tooltip text short and informative.", ok: true },
  { label: "Use tooltips for non-critical information.", ok: true },
  { label: "Do not use tooltips for interactive content.", ok: true },
  { label: "Ensure tooltips do not obstruct other UI.", ok: true },
  { label: "Keep content within viewport boundaries.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"tooltip\".", ok: true },
  { label: "Associate tooltip with trigger using aria-describedby.", ok: true },
  { label: "Tooltips should be triggered on focus.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Tooltips should not receive focus.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="tooltip-wrapper">
  <button aria-describedby="tooltip-1" class="tooltip-trigger">
    <span class="icon">i</span>
  </button>
  <div id="tooltip-1" role="tooltip" class="tooltip">
    This is a helpful tooltip message.
    <div class="tooltip-arrow"></div>
  </div>
</div>`,
  Examples: `<div class="relative group">
  <button class="p-1 border rounded-full">i</button>
  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded">
    Tooltip content
  </div>
</div>`,
  Types: `<div class="tooltip tooltip-success">Action completed successfully</div>`,
  Placement: `<!-- Position classes: top, bottom, left, right, top-start, top-end -->`,
  Behavior: `<!-- Triggers on: hover, focus, tap. Dismisses on: mouseleave, blur, Esc key -->`
};

export default function DSTooltipsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tooltipType, setTooltipType] = useState("default"); // default, success, warning, error, info
  
  // Interactive preview state
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTooltipBgColor = (type = tooltipType) => {
    switch (type) {
      case "success": return "bg-emerald-600 text-white border-emerald-700";
      case "warning": return "bg-amber-500 text-white border-amber-600";
      case "error": return "bg-red-650 text-white border-red-700";
      case "info": return "bg-blue-600 text-white border-blue-700";
      default: return "bg-slate-900 text-white border-slate-950";
    }
  };

  const getArrowBorderColor = (type = tooltipType) => {
    switch (type) {
      case "success": return "border-t-emerald-600";
      case "warning": return "border-t-amber-500";
      case "error": return "border-t-red-650";
      case "info": return "border-t-blue-600";
      default: return "border-t-slate-900";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – TOOLTIPS</h1>
            <span className="material-symbols-outlined text-[24px] text-indigo-650 block">help</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Tooltips display short, contextual information when users hover, focus, or tap.</p>
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
                <span className="material-symbols-outlined text-[24px] block">help</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tooltip Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">5 Types</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">open_with</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placements</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Positions</span>
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

          {/* Interactive Tooltip Placement Examples */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tooltip Examples</h3>
              <p className="text-[11px] text-slate-455 mt-1">Hover over or tap the info icons below to view tooltips in different directions.</p>
            </div>

            {/* Interactive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-8 items-center justify-items-center">
              
              {/* Top */}
              <div className="relative flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-8">Top</span>
                <div 
                  className="p-2 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-sm relative group"
                  onMouseEnter={() => setHoveredIndex("top")}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Info className="w-5 h-5 text-indigo-600" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block transition-all z-10">
                    <div className="bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-center shadow-lg relative leading-normal">
                      This is a tooltip on top.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-950"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="relative flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-8">Right</span>
                <div 
                  className="p-2 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-sm relative group"
                  onMouseEnter={() => setHoveredIndex("right")}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Info className="w-5 h-5 text-indigo-600" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-32 hidden group-hover:block transition-all z-10">
                    <div className="bg-slate-955 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-center shadow-lg relative leading-normal">
                      This is a tooltip on right.
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-slate-950"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="relative flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-8">Bottom</span>
                <div 
                  className="p-2 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-sm relative group"
                  onMouseEnter={() => setHoveredIndex("bottom")}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Info className="w-5 h-5 text-indigo-600" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 hidden group-hover:block transition-all z-10">
                    <div className="bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-center shadow-lg relative leading-normal">
                      This is a tooltip on bottom.
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-slate-955"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left */}
              <div className="relative flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-8">Left</span>
                <div 
                  className="p-2 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-sm relative group"
                  onMouseEnter={() => setHoveredIndex("left")}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Info className="w-5 h-5 text-indigo-600" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-32 hidden group-hover:block transition-all z-10">
                    <div className="bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-center shadow-lg relative leading-normal">
                      This is a tooltip on left.
                      <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-slate-955"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Start */}
              <div className="relative flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-8">Top Start</span>
                <div 
                  className="p-2 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-sm relative group"
                  onMouseEnter={() => setHoveredIndex("topstart")}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Info className="w-5 h-5 text-indigo-600" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute bottom-full left-0 mb-2 w-36 hidden group-hover:block transition-all z-10">
                    <div className="bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg relative leading-normal">
                      Tooltip aligned to start.
                      <div className="absolute top-full left-3.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-950"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Types / Colors Playground */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tooltip Types & Styles</h3>
              <p className="text-[11px] text-slate-455 mt-1">Different styles based on the purpose and context.</p>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-500 mr-2">Default Type:</span>
              {["default", "success", "warning", "error", "info"].map(type => (
                <button
                  key={type}
                  onClick={() => setTooltipType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    tooltipType === type 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Showcase grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Default */}
              <div className="flex flex-col items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-3">Default</span>
                <div className="px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg text-center shadow">
                  Default tooltip text.
                </div>
              </div>

              {/* Success */}
              <div className="flex flex-col items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-3">Success</span>
                <div className="px-2.5 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg text-center shadow">
                  Action completed successfully.
                </div>
              </div>

              {/* Warning */}
              <div className="flex flex-col items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-3">Warning</span>
                <div className="px-2.5 py-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-lg text-center shadow">
                  Please verify this information.
                </div>
              </div>

              {/* Error */}
              <div className="flex flex-col items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-3">Error</span>
                <div className="px-2.5 py-1.5 bg-red-650 text-white text-[10px] font-bold rounded-lg text-center shadow">
                  Something went wrong here.
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-3">Info</span>
                <div className="px-2.5 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg text-center shadow">
                  Here's some helpful information.
                </div>
              </div>

            </div>
          </section>

          {/* Interaction & Dismissal Behaviors */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Interaction */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interaction Behavior</h3>
              <div className="space-y-3.5 text-xs leading-normal">
                <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center font-bold text-indigo-650 shrink-0 font-mono text-[10px]">H</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Hover</span>
                    <span className="text-[10px] text-slate-450 block">Appears when user hovers over the element.</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center font-bold text-indigo-650 shrink-0 font-mono text-[10px]">F</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Focus</span>
                    <span className="text-[10px] text-slate-455 block">Appears when element receives keyboard focus.</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center font-bold text-indigo-650 shrink-0 font-mono text-[10px]">T</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Tap</span>
                    <span className="text-[10px] text-slate-455 block">Appears on tap for touch screen devices.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dismissal */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dismissal Behavior</h3>
              <div className="space-y-3.5 text-xs leading-normal">
                <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-3">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 font-mono text-[10px]">O</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Hover out</span>
                    <span className="text-[10px] text-slate-450 block">Dismisses when mouse leaves the target element.</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-3">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 font-mono text-[10px]">B</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Blur</span>
                    <span className="text-[10px] text-slate-450 block">Dismisses when element loses focus.</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-3">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 font-mono text-[10px]">Esc</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Escape</span>
                    <span className="text-[10px] text-slate-450 block">Dismisses when user presses Escape key.</span>
                  </div>
                </div>
              </div>
            </div>

          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Tooltip Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tooltip Guidelines</h3>
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
                  <div className="p-0.5 rounded-full bg-indigo-50 text-indigo-655 shrink-0 mt-0.5">
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
              <p>• Provide additional information.</p>
              <p>• Clarify complex functionality.</p>
              <p>• Help users fill forms.</p>
              <p>• Enhance discoverability.</p>
              <p>• Show on demand.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
