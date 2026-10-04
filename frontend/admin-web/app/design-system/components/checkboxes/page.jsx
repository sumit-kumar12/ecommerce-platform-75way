"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Download, Info, X, HelpCircle } from "lucide-react";

const TABS = ["Overview", "Variants", "States", "Sizes", "Groups", "Indeterminate", "Validation", "Best Practices"];

const GUIDELINES = [
  { label: "Use checkboxes for selecting one or more items.", ok: true },
  { label: "Use clear, concise labels for each option.", ok: true },
  { label: "Indeterminate state indicates a partial selection.", ok: true },
  { label: "Keep labels short and scannable.", ok: true },
  { label: "Ensure sufficient spacing between options.", ok: true },
  { label: "Provide clear disabled states when needed.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use native input with type=\"checkbox\".", ok: true },
  { label: "Ensure label is associated with the input.", ok: true },
  { label: "Support keyboard navigation (Space to toggle).", ok: true },
  { label: "Maintain sufficient color contrast.", ok: true },
  { label: "Announce state changes to screen readers.", ok: true }
];

export default function DSCheckboxesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);

  // Playground Parent-Child Indeterminate State
  const [childA, setChildA] = useState(true);
  const [childB, setChildB] = useState(false);
  const [childC, setChildC] = useState(false);
  
  const parentRef = useRef(null);

  useEffect(() => {
    if (!parentRef.current) return;
    const checkedCount = [childA, childB, childC].filter(Boolean).length;
    if (checkedCount === 3) {
      parentRef.current.checked = true;
      parentRef.current.indeterminate = false;
    } else if (checkedCount === 0) {
      parentRef.current.checked = false;
      parentRef.current.indeterminate = false;
    } else {
      parentRef.current.checked = false;
      parentRef.current.indeterminate = true;
    }
  }, [childA, childB, childC]);

  const handleParentToggle = (e) => {
    const isChecked = e.target.checked;
    setChildA(isChecked);
    setChildB(isChecked);
    setChildC(isChecked);
  };

  const handleCopyCode = () => {
    const code = `<div class="checkbox">
  <input type="checkbox" id="remember" />
  <label for="remember">Remember me</label>
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS2 – CHECKBOXES</h1>
            <div className="w-5 h-5 bg-indigo-600 text-white rounded flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Checkboxes allow users to select one or more items from a list.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
        
        {/* Left Side blocks */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Row */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">select_all</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Variants</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">rule</span>
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

          {/* Checkbox Variants */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Checkbox Variants</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
              
              {/* Default */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Default</span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-slate-800 border-slate-300 focus:ring-slate-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Unchecked</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-800 border-slate-350 focus:ring-slate-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Checked</span>
                </label>
              </div>

              {/* Primary */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Primary</span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Unchecked</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Checked</span>
                </label>
              </div>

              {/* Success */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-455 uppercase block">Success</span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Unchecked</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Checked</span>
                </label>
              </div>

              {/* Warning */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-460 uppercase block">Warning</span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Unchecked</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Checked</span>
                </label>
              </div>

              {/* Error */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-470 uppercase block">Error</span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-red-650 border-slate-300 focus:ring-red-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Unchecked</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-red-650 border-slate-300 focus:ring-red-500 cursor-pointer" />
                  <span className="text-sm text-slate-700 font-medium">Checked</span>
                </label>
              </div>

              {/* Disabled */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-470 uppercase block">Disabled</span>
                <label className="flex items-center gap-2.5 cursor-not-allowed opacity-50">
                  <input type="checkbox" disabled className="w-4 h-4 rounded text-slate-400 border-slate-300 cursor-not-allowed" />
                  <span className="text-sm text-slate-750 font-medium">Unchecked</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-not-allowed opacity-50">
                  <input type="checkbox" disabled defaultChecked className="w-4 h-4 rounded text-slate-400 border-slate-300 cursor-not-allowed" />
                  <span className="text-sm text-slate-750 font-medium">Checked</span>
                </label>
              </div>

            </div>
          </section>

          {/* Checkbox States */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Checkbox States</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
              
              {/* Unchecked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Unchecked</span>
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer" />
              </div>

              {/* Checked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Checked</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer" />
              </div>

              {/* Indeterminate */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Indeterminate</span>
                <div className="relative">
                  <div className="w-5 h-5 rounded bg-indigo-600 border border-indigo-650 flex items-center justify-center text-white">
                    <span className="w-2.5 h-0.5 bg-white block rounded-sm"></span>
                  </div>
                </div>
              </div>

              {/* Disabled Unchecked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Disabled Unchecked</span>
                <input type="checkbox" disabled className="w-5 h-5 rounded border-slate-200 bg-slate-50 cursor-not-allowed opacity-55" />
              </div>

              {/* Disabled Checked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Disabled Checked</span>
                <input type="checkbox" disabled defaultChecked className="w-5 h-5 rounded border-slate-200 bg-slate-100 cursor-not-allowed opacity-55 text-slate-400" />
              </div>

              {/* Disabled Indeterminate */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Disabled Indet.</span>
                <div className="w-5 h-5 rounded bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 cursor-not-allowed opacity-55">
                  <span className="w-2.5 h-0.5 bg-slate-400 block rounded-sm"></span>
                </div>
              </div>

            </div>
          </section>

          {/* Sizes & Labels Block Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sizes Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkbox Sizes</h3>
              
              <div className="space-y-3.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-xs text-slate-700">Small checkbox</span>
                </label>
                
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-sm text-slate-750 font-medium">Medium checkbox</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5.5 h-5.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-base text-slate-800 font-semibold">Large checkbox</span>
                </label>
              </div>
            </div>

            {/* Checkbox with Label */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkbox with Label</h3>
              
              <div className="space-y-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-650 mt-0.5 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700 leading-normal">I agree to the terms and conditions</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-350 text-indigo-650 mt-0.5 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700 leading-normal">Subscribe to newsletter and updates</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600 border-slate-300 mt-0.5 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700 leading-normal">Enable two-factor authentication</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-not-allowed opacity-50">
                  <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-200 bg-slate-50 mt-0.5 cursor-not-allowed" />
                  <span className="text-xs font-semibold text-slate-750 leading-normal">This is a disabled option</span>
                </label>
              </div>
            </div>

            {/* Checkbox group vertical */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkbox Group (Vertical)</h3>
              
              <div className="space-y-3.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-700">Option one</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-slate-350 text-indigo-650 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-700">Option two</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-700">Option three</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-emerald-600 border-slate-300 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-700">Option four</span>
                </label>
              </div>
            </div>

          </section>

          {/* Horizontal Group & With Description */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Checkbox Group Horizontal */}
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkbox Group (Horizontal)</h3>
              
              <div className="flex flex-wrap gap-x-6 gap-y-3.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700">Apple</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700">Banana</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-emerald-600 border-slate-300 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700">Orange</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700">Grapes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-red-600 border-slate-300 cursor-pointer" />
                  <span className="text-xs font-semibold text-slate-700">Mango</span>
                </label>

                <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                  <input type="checkbox" disabled className="w-4.5 h-4.5 rounded border-slate-200 bg-slate-50 cursor-not-allowed" />
                  <span className="text-xs font-semibold text-slate-750">Disabled option</span>
                </label>
              </div>
            </div>

            {/* Checkbox with Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkbox with Description</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="email-notif" className="w-4 h-4 rounded border-slate-300 text-indigo-650 mt-0.5 cursor-pointer" />
                  <label htmlFor="email-notif" className="flex flex-col cursor-pointer">
                    <span className="text-xs font-semibold text-slate-800">Email notifications</span>
                    <span className="text-[10px] text-slate-400 leading-normal">Receive email updates about your account activity.</span>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="sms-alert" defaultChecked className="w-4 h-4 rounded border-slate-350 text-indigo-650 mt-0.5 cursor-pointer" />
                  <label htmlFor="sms-alert" className="flex flex-col cursor-pointer">
                    <span className="text-xs font-semibold text-slate-800">SMS alerts</span>
                    <span className="text-[10px] text-slate-400 leading-normal">Get important alerts via SMS messages.</span>
                  </label>
                </div>
              </div>
            </div>

          </section>

          {/* Interactive Playground Parent-Child */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Interactive Indeterminate Playground</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-4 border border-slate-100 rounded-lg p-5 bg-slate-50/50">
                <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3 mb-3">
                  <input 
                    type="checkbox" 
                    id="parent-check" 
                    ref={parentRef}
                    onChange={handleParentToggle}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-650 cursor-pointer" 
                  />
                  <label htmlFor="parent-check" className="text-sm font-bold text-slate-850 cursor-pointer">Select All Categories</label>
                </div>

                <div className="pl-6 space-y-3.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={childA} 
                      onChange={(e) => setChildA(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <span className="text-xs font-semibold text-slate-700">Technology Products</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={childB} 
                      onChange={(e) => setChildB(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <span className="text-xs font-semibold text-slate-700">Fashion & Accessories</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={childC} 
                      onChange={(e) => setChildC(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <span className="text-xs font-semibold text-slate-700">Home & Kitchen Appliance</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-350 p-5 rounded-xl font-mono text-xs leading-relaxed space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Live Selected States</div>
                  <pre className="text-indigo-300 font-bold whitespace-pre-wrap">
                    {JSON.stringify({
                      parentCheckbox: parentRef.current ? {
                        checked: parentRef.current.checked,
                        indeterminate: parentRef.current.indeterminate
                      } : null,
                      children: {
                        technology: childA,
                        fashion: childB,
                        homeAppliance: childC
                      }
                    }, null, 2)}
                  </pre>
                </div>
                <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-800 pt-3">
                  This demo handles nested check states. When only some options are checked, the parent checkbox goes into an indeterminate state (rendering a minus/hyphen icon).
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Usage guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Checkbox Guidelines</h3>
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
{`<div class="checkbox">
  <input type="checkbox" id="remember" />
  <label for="remember">Remember me</label>
</div>`}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3 text-xs text-slate-600 leading-normal">
              <p>• Use for multiple selections in a list.</p>
              <p>• Use for optional settings and preferences.</p>
              <p>• Use indeterminate for parent-child relationships.</p>
              <p>• Avoid using for single selection (use radio instead).</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}

// Small helper Search icon to keep code safe
function SearchIcon({ className = "" }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
