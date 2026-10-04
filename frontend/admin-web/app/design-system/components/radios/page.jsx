"use client";

import React, { useState } from "react";
import { 
  Check, Download, Info, X, Mail, MessageSquare, Bell, Megaphone, Lock
} from "lucide-react";

const TABS = ["Overview", "Variants", "States", "Sizes", "With Icons", "With Description", "Groups", "Best Practices"];

const GUIDELINES = [
  { label: "Use radio buttons when users must select only one option from a list.", ok: true },
  { label: "Keep labels short, clear, and meaningful.", ok: true },
  { label: "Group related options under a clear question or label.", ok: true },
  { label: "Don't use radio buttons for on-off selection.", ok: true },
  { label: "Ensure sufficient touch target size.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"radiogroup\" for grouped radios.", ok: true },
  { label: "Each radio must have an accessible label.", ok: true },
  { label: "Support keyboard navigation (Arrow keys).", ok: true },
  { label: "Maintain sufficient color contrast.", ok: true },
  { label: "Announce selection changes to screen readers.", ok: true }
];

export default function DSRadiosPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);

  // Interactive Playground States
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [experienceRating, setExperienceRating] = useState("good");
  const [contactMethod, setContactMethod] = useState("email");
  const [variantSelections, setVariantSelections] = useState({
    default: "opt2",
    primary: "opt2",
    success: "opt2",
    warning: "opt2",
    error: "opt2",
  });

  const handleCopyCode = () => {
    const code = `<fieldset class="radio-group">
  <legend>Choose your plan</legend>
  <label class="radio">
    <input type="radio" name="plan" value="free" />
    <span>Free Plan</span>
  </label>
  <label class="radio">
    <input type="radio" name="plan" value="pro" checked />
    <span>Pro Plan</span>
  </label>
  <label class="radio">
    <input type="radio" name="plan" value="enterprise" />
    <span>Enterprise Plan</span>
  </label>
</fieldset>`;
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS2 – RADIO BUTTONS</h1>
            <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Radio buttons allow users to select one option from a set.</p>
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

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left main block */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">radio_button_checked</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">10 Variants</span>
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

          {/* Radio Variants Spec */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Radio Variants</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
              
              {/* Default */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Default</span>
                {["Option One", "Option Two", "Option Three"].map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="variant-default" 
                      checked={variantSelections.default === `opt${idx+1}`} 
                      onChange={() => setVariantSelections({...variantSelections, default: `opt${idx+1}`})}
                      className="w-4 h-4 border-slate-350 text-slate-800 focus:ring-slate-500 cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Primary */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Primary</span>
                {["Primary One", "Primary Two", "Primary Three"].map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="variant-primary" 
                      checked={variantSelections.primary === `opt${idx+1}`} 
                      onChange={() => setVariantSelections({...variantSelections, primary: `opt${idx+1}`})}
                      className="w-4 h-4 border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Success */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-455 uppercase block">Success</span>
                {["Success One", "Success Two", "Success Three"].map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="variant-success" 
                      checked={variantSelections.success === `opt${idx+1}`} 
                      onChange={() => setVariantSelections({...variantSelections, success: `opt${idx+1}`})}
                      className="w-4 h-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Warning */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-460 uppercase block">Warning</span>
                {["Warning One", "Warning Two", "Warning Three"].map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="variant-warning" 
                      checked={variantSelections.warning === `opt${idx+1}`} 
                      onChange={() => setVariantSelections({...variantSelections, warning: `opt${idx+1}`})}
                      className="w-4 h-4 border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Error */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-470 uppercase block">Error</span>
                {["Error One", "Error Two", "Error Three"].map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="variant-error" 
                      checked={variantSelections.error === `opt${idx+1}`} 
                      onChange={() => setVariantSelections({...variantSelections, error: `opt${idx+1}`})}
                      className="w-4 h-4 border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Disabled */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-470 uppercase block">Disabled</span>
                {[
                  { label: "Disabled One", checked: false },
                  { label: "Disabled Two", checked: true },
                  { label: "Disabled Three", checked: false }
                ].map(opt => (
                  <label key={opt.label} className="flex items-center gap-2.5 cursor-not-allowed opacity-50">
                    <input 
                      type="radio" 
                      disabled 
                      checked={opt.checked} 
                      onChange={() => {}}
                      className="w-4 h-4 border-slate-200 bg-slate-50 cursor-not-allowed text-slate-400" 
                    />
                    <span className="text-xs font-medium text-slate-750">{opt.label}</span>
                  </label>
                ))}
              </div>

            </div>
          </section>

          {/* Radio States */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Radio States</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-6">
              
              {/* Unchecked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Unchecked</span>
                <input type="radio" checked={false} onChange={() => {}} className="w-5 h-5 border-slate-300 text-indigo-650 cursor-pointer" />
              </div>

              {/* Checked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Checked</span>
                <input type="radio" checked={true} onChange={() => {}} className="w-5 h-5 border-slate-300 text-indigo-650 cursor-pointer" />
              </div>

              {/* Hover */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Hover</span>
                <input type="radio" checked={false} onChange={() => {}} className="w-5 h-5 border-indigo-400 text-indigo-600 cursor-pointer" />
              </div>

              {/* Focus */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Focus</span>
                <input type="radio" checked={false} onChange={() => {}} className="w-5 h-5 border-indigo-500 ring-2 ring-indigo-500/25 cursor-pointer" />
              </div>

              {/* Disabled Unchecked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Disabled Unch.</span>
                <input type="radio" disabled checked={false} onChange={() => {}} className="w-5 h-5 border-slate-200 bg-slate-50 cursor-not-allowed opacity-50" />
              </div>

              {/* Disabled Checked */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Disabled Ch.</span>
                <input type="radio" disabled checked={true} onChange={() => {}} className="w-5 h-5 border-slate-200 bg-slate-50 cursor-not-allowed opacity-50 text-slate-400" />
              </div>

              {/* Read Only */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">Read Only</span>
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border border-slate-250 bg-slate-50 flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Radio Sizes & Icons Block */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sizes Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Radio Sizes</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="size-demo" className="w-3.5 h-3.5 border-slate-350 text-indigo-650 cursor-pointer" />
                  <span className="text-xs text-slate-700">Small</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="size-demo" defaultChecked className="w-4.5 h-4.5 border-slate-350 text-indigo-650 cursor-pointer" />
                  <span className="text-sm text-slate-750 font-medium">Medium (Default)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="size-demo" className="w-5.5 h-5.5 border-slate-350 text-indigo-650 cursor-pointer" />
                  <span className="text-base text-slate-800 font-semibold">Large</span>
                </label>

                <label className="flex items-center gap-3.5 cursor-pointer">
                  <input type="radio" name="size-demo" className="w-6.5 h-6.5 border-slate-350 text-indigo-650 cursor-pointer" />
                  <span className="text-lg text-slate-900 font-bold">Extra Large</span>
                </label>
              </div>
            </div>

            {/* With Icons */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">With Icons</h3>
              
              <div className="space-y-3.5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="icon-group" 
                    checked={contactMethod === "email"} 
                    onChange={() => setContactMethod("email")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                  />
                  <Mail className="w-4.5 h-4.5 text-slate-450" />
                  <span className="text-xs font-semibold text-slate-700">Email updates</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="icon-group" 
                    checked={contactMethod === "sms"} 
                    onChange={() => setContactMethod("sms")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                  />
                  <MessageSquare className="w-4.5 h-4.5 text-slate-455" />
                  <span className="text-xs font-semibold text-slate-700">SMS alerts</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="icon-group" 
                    checked={contactMethod === "push"} 
                    onChange={() => setContactMethod("push")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                  />
                  <Bell className="w-4.5 h-4.5 text-slate-450" />
                  <span className="text-xs font-semibold text-slate-700">Push notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="icon-group" 
                    checked={contactMethod === "marketing"} 
                    onChange={() => setContactMethod("marketing")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                  />
                  <Megaphone className="w-4.5 h-4.5 text-slate-450" />
                  <span className="text-xs font-semibold text-slate-700">Marketing updates</span>
                </label>
              </div>
            </div>

          </section>

          {/* With Description & Vertical Group */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* With Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">With Description</h3>
              
              <div className="space-y-4">
                
                {/* Free */}
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="plan-free"
                    name="playground-plan"
                    checked={selectedPlan === "free"}
                    onChange={() => setSelectedPlan("free")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 mt-0.5 cursor-pointer" 
                  />
                  <label htmlFor="plan-free" className="flex flex-col cursor-pointer">
                    <span className="text-xs font-bold text-slate-800">Free Plan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Basic features for individuals</span>
                  </label>
                </div>

                {/* Pro */}
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="plan-pro"
                    name="playground-plan"
                    checked={selectedPlan === "pro"}
                    onChange={() => setSelectedPlan("pro")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 mt-0.5 cursor-pointer" 
                  />
                  <label htmlFor="plan-pro" className="flex flex-col cursor-pointer">
                    <span className="text-xs font-bold text-slate-800">Pro Plan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Advanced features for professionals</span>
                  </label>
                </div>

                {/* Enterprise */}
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="plan-enterprise"
                    name="playground-plan"
                    checked={selectedPlan === "enterprise"}
                    onChange={() => setSelectedPlan("enterprise")}
                    className="w-4.5 h-4.5 border-slate-300 text-indigo-650 mt-0.5 cursor-pointer" 
                  />
                  <label htmlFor="plan-enterprise" className="flex flex-col cursor-pointer">
                    <span className="text-xs font-bold text-slate-800">Enterprise Plan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Tailored solutions for organizations</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Vertical Group Example */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vertical Group (Example)</h3>
              
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 block">How would you rate your experience?</span>
                
                <div className="space-y-3">
                  {["excellent", "good", "average", "poor", "very poor"].map(rating => (
                    <label key={rating} className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="exp-rating" 
                        checked={experienceRating === rating} 
                        onChange={() => setExperienceRating(rating)}
                        className="w-4 h-4 border-slate-300 text-indigo-650 cursor-pointer" 
                      />
                      <span className="text-xs font-medium text-slate-700 capitalize">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

          </section>

          {/* Inline Group Example */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inline Group (Example)</h3>
            
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-slate-850 block">Choose your preferred contact method:</span>
              
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {["email", "phone call", "whatsApp", "sms", "in-app message"].map(method => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="inline-method" 
                      checked={contactMethod === method} 
                      onChange={() => setContactMethod(method)}
                      className="w-4.5 h-4.5 border-slate-300 text-indigo-650 cursor-pointer" 
                    />
                    <span className="text-xs font-semibold text-slate-700 capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Live Playground State console */}
          <section className="bg-slate-900 text-slate-350 p-5 rounded-xl font-mono text-xs leading-relaxed space-y-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Live Selected States</div>
              <pre className="text-indigo-300 font-bold whitespace-pre-wrap">
                {JSON.stringify({
                  selectedPricingPlan: selectedPlan,
                  ratingScore: experienceRating,
                  preferredContact: contactMethod
                }, null, 2)}
              </pre>
            </div>
            <div className="text-[10px] text-slate-550 leading-normal border-t border-slate-800 pt-3">
              This terminal panel reflects the live state of the interactive radio groups above. Clicking different plans or options updates this state instantly.
            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Usage guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Radio Guidelines</h3>
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

            <pre className="bg-slate-900 text-slate-355 p-3.5 rounded-lg text-[10px] font-mono leading-normal overflow-x-auto whitespace-pre max-h-48 scrollbar-thin">
{`<fieldset class="radio-group">
  <legend>Choose your plan</legend>
  <label class="radio">
    <input type="radio" name="plan" value="free" />
    <span>Free Plan</span>
  </label>
  <label class="radio">
    <input type="radio" name="plan" value="pro" checked />
    <span>Pro Plan</span>
  </label>
</fieldset>`}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3 text-xs text-slate-600 leading-normal">
              <p>• Use when only one option from a set can be chosen.</p>
              <p>• Ideal for mutually exclusive options.</p>
              <p>• Use checkboxes for multiple selections.</p>
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
