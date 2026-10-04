"use client";

import React, { useState } from "react";
import { 
  Search, Download, Check, X, ShieldAlert, Sparkles, Layers, 
  Accessibility, Layout, Eye, HelpCircle, ArrowRight, BookOpen
} from "lucide-react";

const TABS = ["Overview", "Do's & Don'ts", "Layout", "Spacing", "Color", "Typography", "Iconography", "Motion", "Accessibility", "Content", "Performance"];

const PRINCIPLES = [
  { 
    title: "Consistent", 
    desc: "Use established patterns and components to build familiarity and trust.", 
    icon: Layers,
    color: "bg-indigo-50 text-indigo-600"
  },
  { 
    title: "Accessible", 
    desc: "Design for everyone, everywhere. Follow WCAG standards strictly.", 
    icon: Accessibility,
    color: "bg-emerald-50 text-emerald-600"
  },
  { 
    title: "Clear", 
    desc: "Communicate information with clear visual structure and contrast.", 
    icon: Eye,
    color: "bg-blue-50 text-blue-600"
  },
  { 
    title: "Efficient", 
    desc: "Help users complete tasks quickly with smart layouts and defaults.", 
    icon: Sparkles,
    color: "bg-amber-50 text-amber-600"
  },
  { 
    title: "Responsive", 
    desc: "Build content that scales gracefully across mobile, tablet, and wide screens.", 
    icon: Layout,
    color: "bg-purple-50 text-purple-600"
  },
  { 
    title: "Delightful", 
    desc: "Incorporate micro-interactions and animations that reward user input.", 
    icon: BookOpen,
    color: "bg-rose-50 text-rose-600"
  },
];

const BREAKPOINTS = [
  { name: "xs", range: "0 – 575px", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { name: "sm", range: "576 – 767px", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "md", range: "768 – 1023px", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "lg", range: "1024 – 1439px", color: "bg-orange-50 text-orange-700 border-orange-100" },
  { name: "xl", range: "1440px+", color: "bg-rose-50 text-rose-700 border-rose-100" },
];

const SPACING_SCALE = [
  { size: 0, px: "0px", w: "w-0" },
  { size: 4, px: "4px", w: "w-1" },
  { size: 8, px: "8px", w: "w-2" },
  { size: 16, px: "16px", w: "w-4" },
  { size: 24, px: "24px", w: "w-6" },
  { size: 32, px: "32px", w: "w-8" },
  { size: 48, px: "48px", w: "w-12" },
  { size: 64, px: "64px", w: "w-16" },
];

export default function DSGuidelinesPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS1 – USAGE GUIDELINES</h1>
          <p className="text-sm text-slate-500 mt-1">Best practices and guidelines for using the design system effectively.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search guidelines..." 
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

      {/* Tabs */}
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
          <span>Export Guidelines</span>
        </button>
      </div>

      {/* Main Grid Content + Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start flex-grow">
        
        {/* Left Column (Guidelines Dashboard) */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Hero Banner Card */}
          <div className="relative rounded-2xl bg-gradient-to-r from-indigo-50 via-indigo-50/50 to-white border border-indigo-100 p-6 md:p-8 overflow-hidden shadow-sm flex items-center justify-between">
            <div className="z-10 max-w-lg">
              <h2 className="text-xl font-bold text-indigo-950">Design with consistency</h2>
              <p className="text-xs text-indigo-800 mt-2 leading-relaxed">
                These guidelines help maintain a consistent, accessible and user-friendly experience across all products and platforms. Follow these core tokens to guarantee visual alignment.
              </p>
            </div>
            
            {/* Visual Vector Illustration in Hero */}
            <div className="hidden md:flex items-center gap-2 select-none relative right-4">
              <div className="w-24 h-16 bg-white rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-between p-2">
                <div className="h-2 w-3/4 bg-indigo-100 rounded" />
                <div className="h-2 w-1/2 bg-indigo-50 rounded" />
                <div className="h-4 w-full bg-indigo-600 rounded-md" />
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md relative right-4 top-4 border-2 border-white">
                ✓
              </div>
            </div>
          </div>

          {/* Core Principles */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Core Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRINCIPLES.map(p => (
                <div key={p.title} className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-lg ${p.color} shrink-0 shadow-sm`}>
                    <p.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{p.title}</h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Do's & Don'ts */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Do's & Don'ts</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Row 1: Space & Layout */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-indigo-600 pl-2 uppercase tracking-wide">
                  Use consistent spacing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Good Spacing (Do) */}
                  <div className="border border-emerald-200 bg-emerald-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">Do</span>
                    </div>
                    {/* Mock Card Preview */}
                    <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col gap-3 shadow-sm flex-grow">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Heading Title</div>
                        <div className="text-[10px] text-slate-400 mt-1">Consistent 12px margin padding.</div>
                      </div>
                      <div className="h-6 w-16 bg-indigo-600 rounded text-[9px] font-bold text-white flex items-center justify-center">Button</div>
                    </div>
                  </div>
                  
                  {/* Bad Spacing (Don't) */}
                  <div className="border border-red-200 bg-red-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded">Don't</span>
                    </div>
                    {/* Mock Card Preview */}
                    <div className="bg-white border border-slate-200 p-2.5 pt-1 pl-1 rounded-lg flex flex-col gap-1 shadow-sm flex-grow">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Heading Title</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Cluttered uneven paddings.</div>
                      </div>
                      <div className="h-6 w-20 bg-indigo-600 rounded text-[9px] font-bold text-white flex items-center justify-center mt-3">Button</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Color Hierarchy */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-indigo-600 pl-2 uppercase tracking-wide">
                  Follow color hierarchy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Do */}
                  <div className="border border-emerald-200 bg-emerald-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">Do</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col gap-2.5 shadow-sm flex-grow justify-center">
                      <div className="h-7 w-full bg-indigo-600 rounded text-[9px] font-bold text-white flex items-center justify-center shadow">Primary Button</div>
                      <div className="h-7 w-full border border-indigo-200 rounded text-[9px] font-bold text-indigo-600 flex items-center justify-center bg-white">Secondary Button</div>
                    </div>
                  </div>
                  
                  {/* Don't */}
                  <div className="border border-red-200 bg-red-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded">Don't</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col gap-2.5 shadow-sm flex-grow justify-center">
                      <div className="h-7 w-full bg-indigo-600 rounded text-[9px] font-bold text-white flex items-center justify-center">Primary Button</div>
                      <div className="h-7 w-full bg-indigo-700 rounded text-[9px] font-bold text-white flex items-center justify-center">Secondary Button</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Typography Hierarchy */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-indigo-600 pl-2 uppercase tracking-wide">
                  Use clear typography hierarchy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Do */}
                  <div className="border border-emerald-200 bg-emerald-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">Do</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col gap-1.5 shadow-sm flex-grow justify-center">
                      <div className="text-sm font-extrabold text-slate-900 leading-tight">Heading Title</div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Sub-title element</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-normal">Readable small body text for descriptions.</div>
                    </div>
                  </div>
                  
                  {/* Don't */}
                  <div className="border border-red-200 bg-red-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded">Don't</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col gap-1 shadow-sm flex-grow justify-center">
                      <div className="text-xs font-normal text-slate-900 leading-tight">Heading Title</div>
                      <div className="text-xs font-black text-slate-950 uppercase leading-none">Sub-title element</div>
                      <div className="text-xs text-slate-400 mt-1 leading-tight">Readable small body text for descriptions.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Align Elements */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-indigo-600 pl-2 uppercase tracking-wide">
                  Align elements consistently
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Do */}
                  <div className="border border-emerald-200 bg-emerald-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">Do</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-3.5 rounded-lg flex flex-col gap-2 shadow-sm flex-grow justify-center">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-500">Label</label>
                        <div className="h-6 w-full border border-slate-200 rounded px-2 text-[10px] bg-slate-50/30 flex items-center text-slate-700">Input text</div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-500">Label</label>
                        <div className="h-6 w-full border border-slate-200 rounded px-2 text-[10px] bg-slate-50/30 flex items-center text-slate-700">Input text</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Don't */}
                  <div className="border border-red-200 bg-red-50/10 rounded-xl p-4 flex flex-col justify-between h-44">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded">Don't</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-3.5 rounded-lg flex flex-col gap-2 shadow-sm flex-grow justify-center">
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] font-bold text-slate-500 w-10 text-right">Label</label>
                        <div className="h-6 flex-grow border border-slate-200 rounded px-2 text-[10px] bg-slate-50/30 flex items-center text-slate-700">Input text</div>
                      </div>
                      <div className="flex flex-col gap-0.5 ml-4">
                        <label className="text-[9px] font-bold text-slate-500">Label</label>
                        <div className="h-6 w-full border border-slate-200 rounded px-2 text-[10px] bg-slate-50/30 flex items-center text-slate-700">Input text</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar Column */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Links</h3>
            <div className="space-y-0.5">
              {[
                "Do's & Don'ts", "Spacing Rules", "Color Usage", "Typography Scale",
                "Icon Guidelines", "Responsive Breakpoints", "Accessibility", "Content Guidelines"
              ].map(link => (
                <button 
                  key={link} 
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
                >
                  <span>{link}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Spacing Scale */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Spacing Scale</h3>
            <p className="text-[10px] text-slate-400 mb-4">Use the spacing scale for consistency.</p>
            
            <div className="flex items-end gap-2.5 h-16 pt-2 select-none justify-between px-2">
              {SPACING_SCALE.map(s => (
                <div key={s.size} className="flex flex-col items-center gap-1.5 flex-grow">
                  <div className="h-10 flex items-end justify-center w-full">
                    {/* Spacing Box preview */}
                    <div 
                      className={`bg-indigo-150 border border-indigo-300 rounded-sm ${s.w} max-w-full`}
                      style={{ height: `${Math.max(4, s.size * 0.6)}px` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">{s.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakpoints */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Breakpoints</h3>
            <p className="text-[10px] text-slate-400 mb-4">Design for these responsive breakpoints.</p>
            
            <div className="space-y-2">
              {BREAKPOINTS.map(bp => (
                <div key={bp.name} className="flex items-center justify-between p-2 bg-slate-50/50 border border-slate-100 rounded-lg">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${bp.color}`}>
                    {bp.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 font-mono">
                    {bp.range}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Reminder */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border-l-4 border-l-emerald-500">
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm shrink-0">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">Accessibility</h4>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  Ensure sufficient color contrast, keyboard navigability, and screen reader support.
                </p>
              </div>
            </div>
            
            <button className="w-full mt-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span>View Accessibility Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </aside>

      </div>

    </div>
  );
}
