"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Layout, 
  HelpCircle, CheckCircle2, Lock, ArrowRight, Play, Eye
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Animation", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use skeletons to set expectations.", ok: true },
  { label: "Match the final layout to prevent layout shift.", ok: true },
  { label: "Keep animations subtle and non-distracting.", ok: true },
  { label: "Remove skeletons immediately when content is ready.", ok: true },
  { label: "Avoid skeletons for fast-loading content.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use aria-busy=\"true\" on the container.", ok: true },
  { label: "Use aria-live=\"polite\" for status updates.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Do not rely solely on animation.", ok: true },
  { label: "Provide alternative text for screen readers.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="skeleton-container" aria-busy="true" aria-live="polite">
  <div class="skeleton skeleton-avatar skeleton-circular"></div>
  <div class="skeleton-details">
    <div class="skeleton skeleton-line w-3/4"></div>
    <div class="skeleton skeleton-line w-1/2"></div>
  </div>
</div>

<style>
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>`,
  Examples: `<div class="p-4 border rounded-xl space-y-3">
  <div class="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
  <div class="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
  <div class="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
</div>`,
  Types: `<div class="skeleton-text"></div>
<div class="skeleton-heading"></div>
<div class="skeleton-avatar"></div>
<div class="skeleton-image"></div>
<div class="skeleton-button"></div>`,
  Animation: `/* Shimmer animation keyframes */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`
};

export default function DSSkeletonsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [skeletonVariant, setSkeletonVariant] = useState("rounded"); // rounded, square, circular
  
  // Interactive usage preview state
  const [useCase, setUseCase] = useState("Product Card"); // Product Card, Dashboard, Table, List, Form, Profile

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBorderRadiusClass = () => {
    switch (skeletonVariant) {
      case "square": return "rounded-none";
      case "circular": return "rounded-full";
      default: return "rounded-lg"; // rounded
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – SKELETONS</h1>
            <span className="material-symbols-outlined text-[24px] text-indigo-650 block">progress_activity</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Skeletons act as visual placeholders while content is loading.</p>
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
                <span className="material-symbols-outlined text-[24px] block">grid_view</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skeleton Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">7 Types</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">shapes</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">5 Shapes</span>
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

          {/* Skeletons Examples */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skeleton Examples</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Text Lines */}
              <div className="p-4 border border-slate-250/60 rounded-xl bg-slate-50/50 space-y-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Text Lines</span>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-full"></div>
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-5/6"></div>
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-2/3"></div>
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>

              {/* Card */}
              <div className="p-4 border border-slate-250/60 rounded-xl bg-slate-50/50 space-y-3.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Card</span>
                <div className="space-y-3">
                  <div className="h-20 bg-slate-200 animate-pulse rounded-lg w-full"></div>
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-2 bg-slate-150 animate-pulse rounded w-1/2"></div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="p-4 border border-slate-250/60 rounded-xl bg-slate-50/50 space-y-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Table Rows</span>
                <div className="space-y-2.5">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="flex gap-2">
                      <div className="h-2.5 bg-slate-200 animate-pulse rounded w-1/4"></div>
                      <div className="h-2.5 bg-slate-200 animate-pulse rounded w-2/4"></div>
                      <div className="h-2.5 bg-slate-200 animate-pulse rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* List Item */}
              <div className="p-4 border border-slate-250/60 rounded-xl bg-slate-50/50 space-y-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">List Item</span>
                <div className="space-y-3">
                  {[1, 2, 3].map(idx => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                      <div className="flex-grow space-y-1">
                        <div className="h-2 bg-slate-200 animate-pulse rounded w-4/5"></div>
                        <div className="h-1.5 bg-slate-150 animate-pulse rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Object */}
              <div className="p-4 border border-slate-250/60 rounded-xl bg-slate-50/50 space-y-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Media Object</span>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-200 animate-pulse rounded-lg shrink-0"></div>
                  <div className="flex-grow space-y-2.5">
                    <div className="h-2.5 bg-slate-200 animate-pulse rounded w-full"></div>
                    <div className="h-2 bg-slate-150 animate-pulse rounded w-5/6"></div>
                    <div className="h-2 bg-slate-100 animate-pulse rounded w-2/3"></div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Types and Visual Shapes Playground */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shapes & Variants Playground</h3>
              <p className="text-[11px] text-slate-450 mt-1">Skeletons are available in different shapes to match visual controls.</p>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-500 mr-2">Shape Style:</span>
              {["rounded", "square", "circular"].map(shape => (
                <button
                  key={shape}
                  onClick={() => setSkeletonVariant(shape)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    skeletonVariant === shape 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rounded Preview Container */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Text block</span>
                <div className="w-full space-y-2">
                  <div className={`h-3 bg-slate-250/70 animate-pulse w-full ${getBorderRadiusClass()}`}></div>
                  <div className={`h-3 bg-slate-250/70 animate-pulse w-4/5 ${getBorderRadiusClass()}`}></div>
                  <div className={`h-3 bg-slate-250/70 animate-pulse w-2/3 ${getBorderRadiusClass()}`}></div>
                </div>
              </div>

              {/* Square Preview Container */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Media card block</span>
                <div className="w-full space-y-3">
                  <div className={`h-16 bg-slate-250/70 animate-pulse w-full ${getBorderRadiusClass()}`}></div>
                  <div className={`h-3 bg-slate-250/70 animate-pulse w-3/4 ${getBorderRadiusClass()}`}></div>
                </div>
              </div>

              {/* Circular Preview Container */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">User avatar block</span>
                <div className="flex items-center gap-3 w-full justify-center">
                  <div className={`w-12 h-12 bg-slate-250/70 animate-pulse shrink-0 ${skeletonVariant === "square" ? "rounded-none" : "rounded-full"}`}></div>
                  <div className="space-y-1.5 flex-grow max-w-[120px]">
                    <div className={`h-2.5 bg-slate-250/70 animate-pulse w-full ${getBorderRadiusClass()}`}></div>
                    <div className={`h-2 bg-slate-150/70 animate-pulse w-2/3 ${getBorderRadiusClass()}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Context Showcase */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contextual Showcase</h3>
                <p className="text-[11px] text-slate-450 mt-1">Select a usecase to preview customized skeleton components.</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Product Card", "Dashboard", "Table", "List", "Form", "Profile"].map(item => (
                  <button
                    key={item}
                    onClick={() => setUseCase(item)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      useCase === item 
                        ? "bg-indigo-650 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-8 bg-slate-50/40 flex items-center justify-center min-h-[220px]">
              
              {useCase === "Product Card" && (
                <div className="w-64 bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                  <div className="h-36 bg-slate-200 animate-pulse rounded-lg w-full"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-200 animate-pulse rounded w-3/4"></div>
                    <div className="h-2 bg-slate-150 animate-pulse rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-250 animate-pulse rounded w-1/3"></div>
                    <div className="h-8 bg-slate-250 animate-pulse rounded-lg w-20"></div>
                  </div>
                </div>
              )}

              {useCase === "Dashboard" && (
                <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="h-2 bg-slate-200 animate-pulse rounded w-1/3"></div>
                        <div className="w-4 h-4 bg-slate-200 animate-pulse rounded-full"></div>
                      </div>
                      <div className="h-6 bg-slate-250 animate-pulse rounded w-3/4 mt-2"></div>
                      <div className="h-2 bg-slate-150 animate-pulse rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}

              {useCase === "Table" && (
                <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-xs font-semibold text-slate-500">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
                    <div className="h-3 bg-slate-350 animate-pulse rounded w-16"></div>
                    <div className="h-3 bg-slate-350 animate-pulse rounded w-20"></div>
                    <div className="h-3 bg-slate-350 animate-pulse rounded w-12"></div>
                  </div>
                  <div className="divide-y divide-slate-100 p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center py-1">
                        <div className="h-3 bg-slate-200 animate-pulse rounded w-12"></div>
                        <div className="h-3 bg-slate-200 animate-pulse rounded w-24"></div>
                        <div className="h-3 bg-slate-200 animate-pulse rounded w-8"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {useCase === "List" && (
                <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                      <div className="flex-grow space-y-1.5">
                        <div className="h-2.5 bg-slate-200 animate-pulse rounded w-2/3"></div>
                        <div className="h-2 bg-slate-150 animate-pulse rounded w-1/3"></div>
                      </div>
                      <div className="w-5 h-5 bg-slate-150 animate-pulse rounded-full shrink-0"></div>
                    </div>
                  ))}
                </div>
              )}

              {useCase === "Form" && (
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-2.5 bg-slate-200 animate-pulse rounded w-1/4"></div>
                      <div className="h-10 bg-slate-150 animate-pulse rounded-lg w-full"></div>
                    </div>
                  ))}
                  <div className="flex justify-end gap-2.5 pt-4">
                    <div className="h-9 bg-slate-150 animate-pulse rounded-lg w-20"></div>
                    <div className="h-9 bg-slate-250 animate-pulse rounded-lg w-24"></div>
                  </div>
                </div>
              )}

              {useCase === "Profile" && (
                <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-200 animate-pulse rounded-full"></div>
                  <div className="space-y-2 w-full flex flex-col items-center">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                    <div className="h-2.5 bg-slate-150 animate-pulse rounded w-1/3"></div>
                  </div>
                  <div className="flex justify-center gap-3 w-full pt-4">
                    <div className="h-8 bg-slate-150 animate-pulse rounded-lg w-24"></div>
                    <div className="h-8 bg-slate-150 animate-pulse rounded-lg w-24"></div>
                  </div>
                </div>
              )}

            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Skeleton Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Skeleton Guidelines</h3>
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
              <p>• Visual placeholders while data is loading.</p>
              <p>• Data-driven screens like dashboards, feeds, lists.</p>
              <p>• Slow-loading operations (&gt; 1 second latency).</p>
              <p>• Reducing perceived wait times for users.</p>
              <p>• Preventing layout shifts during image / script loads.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
