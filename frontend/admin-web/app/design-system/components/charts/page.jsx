"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, FileText, BarChart2, PieChart, Activity
} from "lucide-react";

const TABS = ["Overview", "Variants", "Types", "Data & States", "Interactions", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Choose the right chart for your data.", ok: true },
  { label: "Keep charts simple and easy to understand.", ok: true },
  { label: "Use clear labels, titles and units.", ok: true },
  { label: "Maintain consistent colors and legends.", ok: true },
  { label: "Avoid 3D effects and unnecessary clutter.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Provide text alternatives for charts.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Do not rely on color alone to convey data.", ok: true },
  { label: "Support keyboard navigation.", ok: true },
  { label: "Ensure charts are readable with screen readers.", ok: true }
];

export default function DSChartsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);

  // Interactive playground states
  const [colorTheme, setColorTheme] = useState("primary");
  const [chartSize, setChartSize] = useState("Medium");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const getThemeColors = () => {
    switch (colorTheme) {
      case "primary":
        return {
          c1: "fill-indigo-600 stroke-indigo-600",
          c2: "fill-blue-500 stroke-blue-500",
          c3: "fill-emerald-500 stroke-emerald-500",
          c4: "fill-amber-500 stroke-amber-500",
          text: "indigo"
        };
      case "multi":
        return {
          c1: "fill-violet-600 stroke-violet-600",
          c2: "fill-rose-500 stroke-rose-500",
          c3: "fill-cyan-500 stroke-cyan-500",
          c4: "fill-yellow-500 stroke-yellow-500",
          text: "violet"
        };
      case "monochrome":
        return {
          c1: "fill-indigo-700 stroke-indigo-700",
          c2: "fill-indigo-500 stroke-indigo-500",
          c3: "fill-indigo-300 stroke-indigo-300",
          c4: "fill-indigo-100 stroke-indigo-100",
          text: "indigo"
        };
      default:
        return {};
    }
  };

  const colors = getThemeColors();

  const handleCopyCode = () => {
    const code = `<div class="chart-card">
  <h3>Monthly Revenue</h3>
  <div class="chart-wrapper">
    <canvas id="lineChart"></canvas>
  </div>
  <div class="chart-legend">
    <span class="legend-item">
      <i class="dot" style="background:#6366f1"></i> Revenue
    </span>
  </div>
</div>`;
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS3 – CHARTS</h1>
            <BarChart2 className="w-5 h-5 text-indigo-650" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Charts visualize data insights in a clear, accurate and meaningful way.</p>
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
        
        {/* Left main block */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">monitoring</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">10 Charts</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">grid_view</span>
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

          {/* Chart Variants */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Chart Variants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              
              {/* 1. Line Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Line Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Show trends over time.</p>
                  
                  {/* SVG Line Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      {/* Grid lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke="#f1f5f9" strokeWidth="0.5" />
                      {/* Line */}
                      <path 
                        d="M0 45 L20 30 L40 38 L60 20 L80 25 L100 8" 
                        fill="none" 
                        className={colors.c1} 
                        strokeWidth="1.5"
                      />
                      {/* Dots */}
                      <circle cx="20" cy="30" r="1.5" className={colors.c1} />
                      <circle cx="60" cy="20" r="1.5" className={colors.c1} />
                      <circle cx="100" cy="8" r="1.5" className={colors.c1} />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2. Area Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Area Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Emphasize volume over time.</p>
                  
                  {/* SVG Area Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path 
                        d="M0 45 L20 32 L40 28 L60 15 L80 18 L100 5 L100 50 L0 50 Z" 
                        className={colorTheme === "primary" ? "fill-indigo-100" : colorTheme === "multi" ? "fill-rose-100" : "fill-indigo-100"} 
                        opacity="0.6"
                      />
                      <path 
                        d="M0 45 L20 32 L40 28 L60 15 L80 18 L100 5" 
                        fill="none" 
                        className={colors.c1} 
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 3. Bar Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Bar Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Compare values across categories.</p>
                  
                  {/* SVG Bar Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      {[
                        { x: 10, h: 25 },
                        { x: 28, h: 40 },
                        { x: 46, h: 18 },
                        { x: 64, h: 32 },
                        { x: 82, h: 45 }
                      ].map((bar, idx) => (
                        <rect 
                          key={idx}
                          x={bar.x} 
                          y={50 - bar.h} 
                          width="10" 
                          height={bar.h} 
                          rx="1.5"
                          className={colors.c1}
                          opacity={hoveredBar === idx ? "0.9" : "0.75"}
                          onMouseEnter={() => setHoveredBar(idx)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4. Horizontal Bar Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Horizontal Bar Chart</h4>
                  <p className="text-[10px] text-slate-455 leading-normal mb-2">Compare values horizontally.</p>
                  
                  {/* SVG Horiz Bar Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      {[15, 32, 22, 45].map((w, idx) => (
                        <g key={idx}>
                          <text x="2" y={10 + idx * 11} fill="#64748b" fontSize="5" fontWeight="bold">P{idx + 1}</text>
                          <rect 
                            x="12" 
                            y={5 + idx * 11} 
                            width={w} 
                            height="6" 
                            rx="1"
                            className={colors.c1}
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* 5. Column Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Column Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Dual columns per category.</p>
                  
                  {/* SVG Column Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      {[
                        { x: 12, h1: 30, h2: 20 },
                        { x: 42, h1: 42, h2: 32 },
                        { x: 72, h1: 22, h2: 15 }
                      ].map((col, idx) => (
                        <g key={idx}>
                          <rect x={col.x} y={50 - col.h1} width="6" height={col.h1} rx="1" className={colors.c1} />
                          <rect x={col.x + 8} y={50 - col.h2} width="6" height={col.h2} rx="1" className={colors.c2} />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* 6. Donut Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Donut Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Show parts of a whole.</p>
                  
                  {/* SVG Donut Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1 flex items-center justify-center">
                    <svg className="w-20 h-20" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="3.2" strokeDasharray="40 60" strokeDashoffset="25" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="30 70" strokeDashoffset="85" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="20 80" strokeDashoffset="115" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.2" strokeDasharray="10 90" strokeDashoffset="135" />
                      
                      <text x="18" y="17.5" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#0f172a">Total</text>
                      <text x="18" y="21.5" textAnchor="middle" fontSize="3.2" fontWeight="bold" fill="#64748b">24,580</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 7. Pie Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Pie Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Show parts of a whole.</p>
                  
                  {/* SVG Pie Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1 flex items-center justify-center">
                    <svg className="w-20 h-20" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="#f1f5f9" />
                      {/* Slices using stroke-dasharray on circle */}
                      <circle cx="18" cy="18" r="8" fill="none" stroke="#4f46e5" strokeWidth="16" strokeDasharray="40 60" strokeDashoffset="25" />
                      <circle cx="18" cy="18" r="8" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="30 70" strokeDashoffset="85" />
                      <circle cx="18" cy="18" r="8" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="25 75" strokeDashoffset="115" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 8. Stacked Bar Chart */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Stacked Bar Chart</h4>
                  <p className="text-[10px] text-slate-450 leading-normal mb-2">Composition of totals.</p>
                  
                  {/* SVG Stacked Bar Chart */}
                  <div className="h-28 w-full border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      {[
                        { x: 15, h1: 15, h2: 12, h3: 8 },
                        { x: 38, h1: 22, h2: 8, h3: 12 },
                        { x: 61, h1: 10, h2: 18, h3: 15 },
                        { x: 84, h1: 18, h2: 10, h3: 10 }
                      ].map((col, idx) => (
                        <g key={idx}>
                          <rect x={col.x} y={50 - col.h1} width="8" height={col.h1} className={colors.c1} />
                          <rect x={col.x} y={50 - col.h1 - col.h2} width="8" height={col.h2} className={colors.c2} />
                          <rect x={col.x} y={50 - col.h1 - col.h2 - col.h3} width="8" height={col.h3} className={colors.c3} />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Chart States Block */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Chart States</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
              
              {/* Default */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">Default</label>
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                  <div className="h-24 bg-slate-50 border border-slate-100 rounded flex items-end justify-center p-2">
                    <svg className="w-full h-16" viewBox="0 0 100 40">
                      <rect x="15" y="10" width="10" height="30" rx="1" className={colors.c1} />
                      <rect x="35" y="20" width="10" height="20" rx="1" className={colors.c1} />
                      <rect x="55" y="5" width="10" height="35" rx="1" className={colors.c1} />
                      <rect x="75" y="15" width="10" height="25" rx="1" className={colors.c1} />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Loading */}
              <div className="space-y-1.5 animate-pulse">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">Loading</label>
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                  <div className="h-24 bg-slate-200/50 rounded flex items-end justify-between p-3">
                    <div className="w-6 h-10 bg-slate-300/40 rounded"></div>
                    <div className="w-6 h-16 bg-slate-300/40 rounded"></div>
                    <div className="w-6 h-8 bg-slate-300/40 rounded"></div>
                    <div className="w-6 h-12 bg-slate-300/40 rounded"></div>
                  </div>
                </div>
              </div>

              {/* No Data */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">No Data</label>
                <div className="border border-slate-200 rounded-xl p-4 bg-white h-[130px] flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 font-bold mb-1">?</div>
                  <span className="text-xs font-bold text-slate-700 block">No data available</span>
                </div>
              </div>

              {/* Error */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-red-500 uppercase block">Error</label>
                <div className="border border-red-200 bg-red-50/10 rounded-xl p-4 h-[130px] flex flex-col items-center justify-center text-center gap-1.5">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                  <span className="text-xs font-bold text-red-700 block">Failed to load chart</span>
                  <span className="text-[10px] text-red-500 block">Check your connection.</span>
                </div>
              </div>

            </div>
          </section>

          {/* Sizes & Color Themes Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sizes Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chart Sizes</h3>
              
              <div className="space-y-4">
                
                {/* Small */}
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase block mb-1">Small (120px height)</span>
                  <div className="h-28 w-56 border border-slate-100 bg-slate-50/50 rounded p-1">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path d="M0 45 Q25 20 50 35 T100 10" fill="none" className={colors.c1} strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <span className="text-[9px] font-bold text-slate-455 uppercase block mb-1">Medium (240px height)</span>
                  <div className="h-36 w-72 border border-slate-100 bg-slate-50/50 rounded p-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path d="M0 45 Q25 20 50 35 T100 10" fill="none" className={colors.c1} strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

            {/* Color Themes & Responsive Behaviors */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              
              {/* Color Themes */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chart Color Themes</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="color-theme-select" 
                      checked={colorTheme === "primary"}
                      onChange={() => setColorTheme("primary")}
                      className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">Primary (Default)</span>
                      <div className="flex gap-1 mt-1">
                        <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="color-theme-select" 
                      checked={colorTheme === "multi"}
                      onChange={() => setColorTheme("multi")}
                      className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">Multi Color</span>
                      <div className="flex gap-1 mt-1">
                        <span className="w-3 h-3 rounded-full bg-violet-600"></span>
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="color-theme-select" 
                      checked={colorTheme === "monochrome"}
                      onChange={() => setColorTheme("monochrome")}
                      className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">Monochrome</span>
                      <div className="flex gap-1 mt-1">
                        <span className="w-3 h-3 rounded-full bg-indigo-750"></span>
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                        <span className="w-3 h-3 rounded-full bg-indigo-300"></span>
                        <span className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-200"></span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Responsive Behavior summary */}
              <div className="border-t border-slate-100 pt-5 space-y-3.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Responsive Behavior</h3>
                <div className="space-y-2 text-xs text-slate-600 leading-normal">
                  <p>• <strong className="text-slate-800">Desktop:</strong> Full details with axes, hover grids, labels and legends.</p>
                  <p>• <strong className="text-slate-800">Tablet:</strong> Optimized margins and responsive scales.</p>
                  <p>• <strong className="text-slate-800">Mobile:</strong> Simplified view focusing only on core visuals, auto-hiding legends and grids.</p>
                </div>
              </div>

            </div>

          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Chart Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Chart Guidelines</h3>
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
                  <div className="p-0.5 rounded-full bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
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
{`<div class="chart-card">
  <h3>Monthly Revenue</h3>
  <div class="chart-wrapper">
    <canvas id="lineChart"></canvas>
  </div>
</div>`}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3 text-xs text-slate-650 leading-normal">
              <p>• Visualizing trends over time.</p>
              <p>• Comparing values across multiple categories.</p>
              <p>• Showing composition or distribution.</p>
              <p>• Identifying patterns or correlations.</p>
              <p>• Presenting KPIs and analytics insights.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}

// Small helper Search icon
function SearchIcon({ className = "" }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
