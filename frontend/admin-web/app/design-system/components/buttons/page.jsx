"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, Plus, Trash2, Settings, Star,
  HelpCircle, ChevronRight, X, AlertTriangle, Play, RefreshCw,
  Smartphone
} from "lucide-react";

const TABS = ["Overview", "Variants", "Sizes", "States", "Icon Buttons", "Best Practices"];

const GUIDELINES = [
  { label: "Use buttons to trigger actions or navigation." },
  { label: "Use clear and concise button labels." },
  { label: "Use Primary for main actions on the page." },
  { label: "Use consistent styling across the product." },
  { label: "Don't use buttons for information display." }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Ensure sufficient color contrast." },
  { label: "Buttons should have discernible text." },
  { label: "Provide visible focus indicators." },
  { label: "Ensure loading state is announced." },
  { label: "Use semantic <button> elements." }
];

const CODE_EXAMPLE_HTML = `<!-- Primary Button -->
<button class="btn btn-primary">
  Save Changes
</button>

<!-- Outline Button with Icon -->
<button class="btn btn-outline">
  <span class="icon icon-plus"></span>
  Add Item
</button>

<!-- Loading Button -->
<button class="btn btn-primary" disabled>
  <span class="spinner"></span>
  Loading...
</button>`;

export default function DSButtonsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [clickCounts, setClickCounts] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  const handleButtonClick = (buttonName) => {
    setClickCounts(prev => ({
      ...prev,
      [buttonName]: (prev[buttonName] || 0) + 1
    }));
    setToastMessage(`Clicked: ${buttonName}`);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative">
      
      {/* Toast Notification */}
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DS3 – BUTTONS</h1>
            <span className="material-symbols-outlined text-[28px] text-indigo-650 font-bold bg-indigo-50 p-1.5 rounded-lg">smart_button</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Buttons trigger actions and make key interactions clear.</p>
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
                  <span className="material-symbols-outlined text-[24px] block font-bold">category</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">8</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Button Variants</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">zoom_out_map</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">5</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Sizes</span>
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

          {/* Button Variants Section */}
          {(activeTab === "Overview" || activeTab === "Variants") && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Button Variants</h3>
                <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">8 Styles Matrix</span>
              </div>
              
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[12%]">State</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Primary</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Secondary</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Outline</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Ghost</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Danger</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Success</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Warning</th>
                      <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[11%]">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Default */}
                    <tr>
                      <td className="py-4 text-xs font-bold text-slate-900">Default</td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Primary Default")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Secondary Default")} className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white rounded-lg text-xs font-bold shadow-sm transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Outline Default")} className="px-4 py-2 border border-indigo-600 text-indigo-650 hover:bg-indigo-50/30 bg-transparent rounded-lg text-xs font-bold transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Ghost Default")} className="px-4 py-2 text-indigo-650 hover:bg-indigo-50 rounded-lg text-xs font-bold transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Danger Default")} className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Success Default")} className="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Warning Default")} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button onClick={() => handleButtonClick("Link Default")} className="text-indigo-650 hover:underline text-xs font-bold">Link</button>
                      </td>
                    </tr>

                    {/* Hover */}
                    <tr>
                      <td className="py-4 text-xs font-bold text-slate-900">Hover</td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 border border-slate-350 text-slate-800 bg-slate-50 rounded-lg text-xs font-bold transition-all shadow-sm">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 border border-indigo-700 text-indigo-750 bg-indigo-50/50 rounded-lg text-xs font-bold transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 text-indigo-750 bg-indigo-50 rounded-lg text-xs font-bold transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-bold shadow-md transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-emerald-750 text-white rounded-lg text-xs font-bold shadow-md transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-orange-700 text-white rounded-lg text-xs font-bold shadow-md transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="text-indigo-750 underline text-xs font-bold">Link</button>
                      </td>
                    </tr>

                    {/* Active */}
                    <tr>
                      <td className="py-4 text-xs font-bold text-slate-900">Active</td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-indigo-800 text-white rounded-lg text-xs font-bold scale-[0.96] transition-all shadow-inner">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 border border-slate-300 text-slate-900 bg-slate-100 rounded-lg text-xs font-bold scale-[0.96] transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 border border-indigo-800 text-indigo-800 bg-indigo-100 rounded-lg text-xs font-bold scale-[0.96] transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 text-indigo-800 bg-indigo-100/70 rounded-lg text-xs font-bold scale-[0.96] transition-all">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-red-800 text-white rounded-lg text-xs font-bold scale-[0.96] transition-all shadow-inner">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold scale-[0.96] transition-all shadow-inner">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-orange-800 text-white rounded-lg text-xs font-bold scale-[0.96] transition-all shadow-inner">Button</button>
                      </td>
                      <td className="py-4">
                        <button className="text-indigo-800 underline text-xs font-bold scale-[0.96]">Link</button>
                      </td>
                    </tr>

                    {/* Disabled */}
                    <tr>
                      <td className="py-4 text-xs font-bold text-slate-900">Disabled</td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 bg-indigo-50/50 text-indigo-300 rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 border border-slate-150 text-slate-300 bg-[#FAFAFA] rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 border border-indigo-100 text-indigo-200 bg-transparent rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 text-indigo-200 bg-transparent rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 bg-red-50 text-red-300 rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 bg-emerald-50 text-emerald-300 rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="px-4 py-2 bg-orange-50 text-orange-300 rounded-lg text-xs font-bold cursor-not-allowed">Button</button>
                      </td>
                      <td className="py-4">
                        <button disabled className="text-slate-300 hover:no-underline text-xs font-bold cursor-not-allowed">Link</button>
                      </td>
                    </tr>

                    {/* Loading */}
                    <tr>
                      <td className="py-4 text-xs font-bold text-slate-900">Loading</td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 border border-indigo-650 text-indigo-650 bg-transparent rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin text-indigo-650" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 text-indigo-650 bg-transparent rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin text-indigo-650" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-red-650 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-emerald-650 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Loading</span>
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="text-indigo-650 text-xs font-bold flex items-center gap-1.5 cursor-wait">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Loading</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Button Sizes & Icon Buttons Container */}
          {(activeTab === "Overview" || activeTab === "Sizes" || activeTab === "Icon Buttons") && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Button Sizes */}
              {(activeTab === "Overview" || activeTab === "Sizes") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Button Sizes</h3>
                    
                    <div className="space-y-4">
                      {/* Extra Large */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase w-24">Extra Large</span>
                        <button onClick={() => handleButtonClick("XL Button")} className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors">
                          Button
                        </button>
                        <span className="text-[10px] text-slate-400 font-semibold text-right w-36">Height: 56px<br />Padding: 20px 32px</span>
                      </div>
                      
                      {/* Large */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase w-24">Large</span>
                        <button onClick={() => handleButtonClick("L Button")} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors">
                          Button
                        </button>
                        <span className="text-[10px] text-slate-400 font-semibold text-right w-36">Height: 48px<br />Padding: 16px 24px</span>
                      </div>

                      {/* Medium */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase w-24">Medium (Default)</span>
                        <button onClick={() => handleButtonClick("M Button")} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors">
                          Button
                        </button>
                        <span className="text-[10px] text-slate-400 font-semibold text-right w-36">Height: 40px<br />Padding: 12px 20px</span>
                      </div>

                      {/* Small */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase w-24">Small</span>
                        <button onClick={() => handleButtonClick("S Button")} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition-colors">
                          Button
                        </button>
                        <span className="text-[10px] text-slate-400 font-semibold text-right w-36">Height: 32px<br />Padding: 8px 16px</span>
                      </div>

                      {/* Extra Small */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase w-24">Extra Small</span>
                        <button onClick={() => handleButtonClick("XS Button")} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-[9px] shadow-sm transition-colors">
                          Button
                        </button>
                        <span className="text-[10px] text-slate-400 font-semibold text-right w-36">Height: 24px<br />Padding: 6px 12px</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Icon Buttons Matrix */}
              {(activeTab === "Overview" || activeTab === "Icon Buttons") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Icon Buttons</h3>
                    
                    <div className="space-y-6">
                      {/* Primary Icon Buttons */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary</span>
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex flex-col items-center gap-1.5">
                            <button onClick={() => handleButtonClick("Primary Icon Default")} className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center shadow-sm">
                              <Plus className="w-5 h-5 font-bold" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Default</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button className="w-10 h-10 bg-indigo-700 text-white rounded-lg flex items-center justify-center shadow-md">
                              <Plus className="w-5 h-5 font-bold" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Hover</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button className="w-10 h-10 bg-indigo-800 text-white rounded-lg flex items-center justify-center shadow-inner scale-95">
                              <Plus className="w-5 h-5 font-bold" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Active</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button disabled className="w-10 h-10 bg-indigo-50/50 text-indigo-300 rounded-lg flex items-center justify-center cursor-not-allowed">
                              <Plus className="w-5 h-5 font-bold" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Disabled</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center cursor-wait">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Loading</span>
                          </div>
                        </div>
                      </div>

                      {/* Outline Icon Buttons */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outline</span>
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex flex-col items-center gap-1.5">
                            <button onClick={() => handleButtonClick("Outline Icon Default")} className="w-10 h-10 border border-slate-200 hover:border-slate-350 bg-white text-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                              <Plus className="w-5 h-5" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Default</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button className="w-10 h-10 border border-slate-300 bg-slate-50 text-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                              <Plus className="w-5 h-5" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Hover</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button className="w-10 h-10 border border-slate-300 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center scale-95 shadow-inner">
                              <Plus className="w-5 h-5" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Active</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button disabled className="w-10 h-10 border border-slate-150 bg-[#FAFAFA] text-slate-300 rounded-lg flex items-center justify-center cursor-not-allowed">
                              <Plus className="w-5 h-5" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Disabled</span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <button className="w-10 h-10 border border-slate-200 bg-white text-slate-700 rounded-lg flex items-center justify-center cursor-wait">
                              <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                            </button>
                            <span className="text-[9px] text-slate-400 font-bold">Loading</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

            </div>
          )}

          {/* Button States Cards */}
          {(activeTab === "Overview" || activeTab === "States") && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Button States</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {/* Default */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Default</span>
                    <button onClick={() => handleButtonClick("State Default")} className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm">Button</button>
                  </div>
                  <span className="text-[10px] text-slate-450 font-medium block mt-4 leading-normal">Default state of a button.</span>
                </div>

                {/* Hover */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hover</span>
                    <button className="w-full py-2.5 px-4 bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-md">Button</button>
                  </div>
                  <span className="text-[10px] text-slate-450 font-medium block mt-4 leading-normal">Appears on mouse hover.</span>
                </div>

                {/* Active */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                    <button className="w-full py-2.5 px-4 bg-indigo-800 text-white font-bold rounded-lg text-xs scale-95 shadow-inner">Button</button>
                  </div>
                  <span className="text-[10px] text-slate-450 font-medium block mt-4 leading-normal">Appears on click or press.</span>
                </div>

                {/* Disabled */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between opacity-60">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disabled</span>
                    <button disabled className="w-full py-2.5 px-4 bg-indigo-50/50 text-indigo-300 font-bold rounded-lg text-xs cursor-not-allowed">Button</button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block mt-4 leading-normal">Indicates an unavailable action.</span>
                </div>

                {/* Loading */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Loading</span>
                    <button className="w-full py-2.5 px-4 bg-indigo-600 text-white font-bold rounded-lg text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-wait">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Loading</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-450 font-medium block mt-4 leading-normal">Shows progress or ongoing action.</span>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Button Guidelines</h4>
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
                "Forms: Submit, Reset, Cancel actions.",
                "Dialogs: Confirm, Dismiss actions.",
                "Navigation: Next, Back, Continue.",
                "Data actions: Add, Edit, Delete.",
                "Toolbar actions: Save, Export, Print."
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
