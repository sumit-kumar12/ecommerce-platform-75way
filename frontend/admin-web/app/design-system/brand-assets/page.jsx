"use client";

import React, { useState } from "react";
import { 
  Download, Search, Copy, Check, Info, AlertTriangle, Play, HelpCircle,
  FileCheck, Shield, HelpCircle as HelpIcon, ArrowRight
} from "lucide-react";

const LOGO_VARIANTS = [
  { name: "Primary Logo (Horizontal)", bg: "bg-white border-slate-200", color: "#4F46E5", dark: false, iconOnly: false },
  { name: "Primary Logo (Icon)", bg: "bg-white border-slate-200", color: "#4F46E5", dark: false, iconOnly: true },
  { name: "White Logo (Horizontal)", bg: "bg-[#0B1329] border-slate-800", color: "#FFFFFF", dark: true, iconOnly: false },
  { name: "White Logo (Icon)", bg: "bg-[#0B1329] border-slate-800", color: "#FFFFFF", dark: true, iconOnly: true },
  { name: "Black Logo (Horizontal)", bg: "bg-slate-50 border-slate-200", color: "#0F172A", dark: false, iconOnly: false },
  { name: "Black Logo (Icon)", bg: "bg-slate-50 border-slate-200", color: "#0F172A", dark: false, iconOnly: true },
  { name: "Gray Logo (Horizontal)", bg: "bg-slate-100/50 border-slate-200", color: "#64748B", dark: false, iconOnly: false },
  { name: "Gray Logo (Icon)", bg: "bg-slate-100/50 border-slate-200", color: "#64748B", dark: false, iconOnly: true },
];

const LOGO_RULES = [
  { ok: true, text: "Always use the official logo files provided." },
  { ok: false, text: "Do not alter the logo colors, proportions or typography." },
  { ok: true, text: "Ensure sufficient clear space around the logo." },
  { ok: true, text: "Use the white logo on dark backgrounds and primary logo on light backgrounds." },
  { ok: true, text: "The icon logo can be used in tight spaces like favicons or avatars." },
];

const BRAND_COLORS = [
  { name: "Primary", hex: "#4F46E5", rgb: "79, 70, 229" },
  { name: "Primary Dark", hex: "#4338CA", rgb: "67, 56, 202" },
  { name: "Secondary", hex: "#10B981", rgb: "16, 185, 129" },
  { name: "Accent", hex: "#F59E0B", rgb: "245, 158, 11" },
  { name: "Danger", hex: "#EF4444", rgb: "239, 68, 68" },
  { name: "Neutral 900", hex: "#0F172A", rgb: "15, 23, 42" },
  { name: "Neutral 600", hex: "#475569", rgb: "71, 85, 105" },
  { name: "Neutral 300", hex: "#CBD5E1", rgb: "203, 213, 225" },
  { name: "Neutral 100", hex: "#F1F5F9", rgb: "241, 245, 249", border: true },
];

const TYPE_SCALE = [
  { name: "Heading 1", spec: "Inter Bold 32/40", size: "text-2xl font-bold" },
  { name: "Heading 2", spec: "Inter Bold 24/32", size: "text-xl font-bold" },
  { name: "Body Large", spec: "Inter Regular 16/24", size: "text-base font-normal" },
  { name: "Body Medium", spec: "Inter Regular 14/20", size: "text-sm font-normal" },
  { name: "Body Small", spec: "Inter Regular 12/16", size: "text-xs font-normal" },
  { name: "Caption", spec: "Inter Regular 11/16", size: "text-[11px] font-normal uppercase tracking-wider text-slate-400" },
];

const GRIDS = [
  { name: "Mobile", range: "320px – 767px", cols: 4 },
  { name: "Tablet", range: "768px – 1023px", cols: 8 },
  { name: "Desktop", range: "1024px – 1439px", cols: 12 },
  { name: "Wide", range: "1440px+", cols: 12 },
];

const DOWNLOAD_ASSETS = [
  { name: "Full Brand Kit", desc: "Logos, colors, typography, icons and more", type: "ZIP", size: "12.4 MB" },
  { name: "Logos Only", desc: "All logo variants in multiple formats", type: "ZIP", size: "2.1 MB" },
  { name: "Color Palette", desc: "Brand colors in various formats (HEX, RGB, HSL)", type: "ASE", size: "0.3 MB" },
  { name: "Typography Pack", desc: "Inter font family — all weights", type: "ZIP", size: "4.8 MB" },
];

const TABS = ["Logo", "Color", "Typography", "Grid & Layout", "Icons", "Images", "Illustrations", "Favicon & App Icon"];

const LogoSvg = ({ color = "#4F46E5", iconOnly = false, isDarkBg = false }) => (
  <div className="flex items-center gap-3.5 select-none">
    <svg viewBox="0 0 40 40" className="w-12 h-12 shrink-0 overflow-visible">
      {/* Shopping bag handle */}
      <path 
        d="M13 15 C13 7, 27 7, 27 15" 
        fill="none" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      {/* Shopping bag body */}
      <rect x="6" y="13" width="28" height="23" rx="5" fill={color} />
      {/* Letter K */}
      <text 
        x="20" 
        y="30" 
        fill={isDarkBg ? "#0B1329" : "#FFFFFF"} 
        fontSize="16" 
        fontWeight="900" 
        textAnchor="middle" 
        fontFamily="sans-serif"
      >
        K
      </text>
    </svg>
    {!iconOnly && (
      <span 
        className="font-black text-xl tracking-tight" 
        style={{ color: color }}
      >
        KATABAZAAR
      </span>
    )}
  </div>
);

export default function DSBrandAssetsPage() {
  const [activeTab, setActiveTab] = useState("Logo");
  const [copiedColor, setCopiedColor] = useState(null);

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDownload = (name, format) => {
    alert(`Downloading ${name} (${format})...`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS1 – BRAND ASSETS</h1>
          <p className="text-sm text-slate-500 mt-1">Official logos, colors, typography and other brand assets for consistent representation.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search brand assets..." 
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
                4
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
        
        <button 
          onClick={() => handleDownload("All Brand Assets", "ZIP")}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold px-4 py-2 shadow-sm transition-colors border-none"
        >
          <Download className="w-4 h-4" />
          <span>Download All Assets</span>
        </button>
      </div>

      {/* Grid Sections */}
      <div className="space-y-8">
        
        {/* LOGO VARIANTS & USAGE SECTION */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* Logo Variants (2 cols) */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Logo Variants</h2>
            <p className="text-[11px] text-slate-400 mb-6">Use the appropriate logo variant based on background and context.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LOGO_VARIANTS.map(lv => (
                <div key={lv.name} className={`rounded-xl border p-5 flex flex-col justify-between h-40 ${lv.bg}`}>
                  {/* Visual Preview */}
                  <div className="flex-grow flex items-center justify-center">
                    <LogoSvg color={lv.color} iconOnly={lv.iconOnly} isDarkBg={lv.dark} />
                  </div>
                  
                  {/* Meta / Formats */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100/50">
                    <span className={`text-[10px] font-semibold ${lv.dark ? "text-slate-400" : "text-slate-500"}`}>
                      {lv.name}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      {["SVG", "PNG", "EPS"].map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => handleDownload(lv.name, fmt)}
                          className={`text-[9px] px-1.5 py-0.5 rounded border transition-all font-bold ${
                            lv.dark 
                              ? "border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50" 
                              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                      <button 
                        onClick={() => handleDownload(lv.name, "SVG")}
                        className={`p-1 rounded transition-all hover:bg-slate-100 text-slate-500`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Usage (1 col) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Logo Usage</h2>
              <p className="text-[11px] text-slate-400 mb-6">Follow these guidelines to maintain brand consistency.</p>
              
              <div className="space-y-4">
                {LOGO_RULES.map((rule, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`p-1 rounded-full shrink-0 ${
                      rule.ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>
                      {rule.ok ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rule.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span>View Usage Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </section>

        {/* BRAND COLORS SECTION */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Brand Colors</h2>
              <p className="text-[11px] text-slate-400">The official color palette for Katabazaar.</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
              <span>View Color Tokens</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
            {BRAND_COLORS.map(color => (
              <div 
                key={color.name}
                onClick={() => handleCopyHex(color.hex)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Swatch color Box */}
                <div 
                  className={`h-24 rounded-lg relative shadow-inner transition-transform group-hover:scale-[1.02] flex items-center justify-center ${
                    color.border ? "border border-slate-200" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy HEX
                    </span>
                  </div>
                  
                  {copiedColor === color.hex && (
                    <div className="absolute bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-10 bottom-2">
                      Copied!
                    </div>
                  )}
                </div>

                <div className="mt-2.5">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">{color.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold uppercase">{color.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY & GRID LAYOUT SECTION */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Typography */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Typography</h2>
                <p className="text-[11px] text-slate-400">Official font families and scale.</p>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                <span>View Typography</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Typography Card Preview */}
            <div className="border border-slate-100 rounded-xl p-5 mb-5 bg-slate-50/50 flex gap-4 items-center">
              <span className="text-4xl font-black text-slate-950 font-serif w-12 text-center select-none leading-none">Aa</span>
              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">Inter</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Our primary font family for a clean, modern and accessible layout system.
                </p>
              </div>
            </div>

            {/* Typography Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                    <th className="px-4 py-2">Preview</th>
                    <th className="px-4 py-2">Scale</th>
                    <th className="px-4 py-2">Spec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {TYPE_SCALE.map(t => (
                    <tr key={t.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={t.size}>Aa</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-800">{t.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-500">{t.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grid & Layout */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Grid & Layout</h2>
                  <p className="text-[11px] text-slate-400">Our responsive grid system for building consistent layouts.</p>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                  <span>View Grid System</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {GRIDS.map(g => (
                  <div key={g.name} className="bg-slate-50/50 border border-slate-150 rounded-xl p-4 flex flex-col justify-between h-44 shadow-inner">
                    {/* Columns Preview Graphic */}
                    <div className="grid gap-1.5 flex-grow items-center h-14 bg-white p-2 rounded-lg border border-slate-100 shadow-sm"
                         style={{ gridTemplateColumns: `repeat(${g.cols}, minmax(0, 1fr))` }}>
                      {Array.from({ length: g.cols }).map((_, i) => (
                        <div key={i} className="h-full bg-indigo-50/60 border-x border-indigo-200/50 rounded-sm" />
                      ))}
                    </div>

                    <div className="mt-3">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">{g.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{g.range}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">{g.cols} Columns</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* DOWNLOAD ASSETS SECTION */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Download Assets</h2>
          <p className="text-[11px] text-slate-400 mb-6">Get individual assets or the complete brand kit.</p>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {DOWNLOAD_ASSETS.map(asset => (
              <div 
                key={asset.name} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{asset.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{asset.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-none pt-3 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                      {asset.type}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {asset.size}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDownload(asset.name, asset.type)}
                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-lg transition-colors border-none cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
