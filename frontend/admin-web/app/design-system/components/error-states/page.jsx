"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, ShieldAlert,
  HelpCircle, CheckCircle2, Lock, ArrowRight, Play, Eye, EyeOff,
  WifiOff, FileQuestion, ServerCrash, Database
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Variants", "Usage", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use clear and concise error messages.", ok: true },
  { label: "Explain what went wrong in simple terms.", ok: true },
  { label: "Suggest how users can fix or proceed.", ok: true },
  { label: "Use consistent error styling and icons.", ok: true },
  { label: "Don't blame the user for the error.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"alert\" or aria-live=\"assertive\".", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Associate errors with the relevant field.", ok: true },
  { label: "Focus the error message programmatically.", ok: true },
  { label: "Provide text alternatives for icons.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="error-container" role="alert">
  <div class="error-icon">
    <svg class="icon-server-crash">...</svg>
  </div>
  <div class="error-content">
    <h4>Something went wrong</h4>
    <p>Please check the information and try again.</p>
  </div>
  <button class="btn btn-outline-danger">Try Again</button>
</div>`,
  Examples: `<div class="form-group has-error">
  <label for="email">Email</label>
  <input type="email" id="email" class="border-red-500" value="invalid-email" />
  <span class="error-message text-red-600">Please enter a valid email address.</span>
</div>`,
  Types: `<div class="alert alert-danger" role="alert">
  <span>Access denied: You don't have permission.</span>
</div>`,
  Variants: `<div class="toast toast-error">Failed to save changes</div>`
};

export default function DSErrorStatesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [toastError, setToastError] = useState(true);

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative">
      
      {/* Modal Error Overlay Demo */}
      {showModalError && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-red-200 max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-red-50 text-red-650 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Critical Error</h3>
              </div>
              <button 
                onClick={() => setShowModalError(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              An unexpected error occurred. Please contact our support team immediately.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                onClick={() => setShowModalError(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowModalError(false)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-750 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – ERROR STATES</h1>
            <span className="material-symbols-outlined text-[24px] text-red-650 block">error</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Error states indicate problems, help prevent mistakes, and guide users to resolution.</p>
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
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">error</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Error Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 Types</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">grid_view</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contexts</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Contexts</span>
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

          {/* Error State Grid Examples */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Error Examples</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Form Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Form Error</span>
                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-600 block">Email</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="johndoe" 
                      readOnly 
                      className="w-full px-3 py-1.5 bg-white border border-red-500 rounded-lg text-xs outline-none text-red-950 font-medium" 
                    />
                    <X className="absolute right-2.5 top-2 w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span className="text-[10px] font-bold text-red-650 block">Please enter a valid email address.</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-2 block">Shows error for invalid form input.</span>
              </div>

              {/* Validation Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Validation Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Validation failed</h4>
                  <p className="text-[10px] text-slate-450">Please check the information and try again.</p>
                </div>
                <button className="px-3.5 py-1.5 border border-red-500 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors">
                  Fix Issues
                </button>
              </div>

              {/* Submission Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Submission Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-xl">
                  <span className="material-symbols-outlined text-[24px] block">description</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Failed to submit</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">Something went wrong while submitting your data.</p>
                </div>
                <button className="px-4 py-1.5 bg-red-600 hover:bg-red-750 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                  Try Again
                </button>
              </div>

              {/* Permission Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Permission Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Access denied</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">You don't have permission to perform this action.</p>
                </div>
                <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-250">
                  Go Back
                </button>
              </div>

              {/* Network Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Network Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-full">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">No internet connection</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">Check your connection and try again.</p>
                </div>
                <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-250">
                  Retry
                </button>
              </div>

              {/* Not Found Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Not Found Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-full">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Page not found</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">The page you're looking for doesn't exist.</p>
                </div>
                <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-250">
                  Go to Dashboard
                </button>
              </div>

              {/* Server Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Server Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-xl">
                  <ServerCrash className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Server error</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">We're having trouble on our end. Please try again later.</p>
                </div>
                <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-250">
                  Try Again Later
                </button>
              </div>

              {/* Data Error */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between items-center text-center min-h-[220px] shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Data Error</span>
                <div className="p-3 bg-red-50 text-red-650 rounded-full">
                  <Database className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Unable to load data</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">We couldn't load the requested data. Please try again.</p>
                </div>
                <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-250">
                  Reload Data
                </button>
              </div>

            </div>
          </section>

          {/* Error Variants Comparison */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Error Variants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Inline & Alert */}
              <div className="space-y-6">
                {/* Inline Error */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Inline Error</span>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 block">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        defaultValue="12345" 
                        readOnly 
                        className="w-full px-3 py-2 bg-white border border-red-500 rounded-lg text-xs outline-none text-red-950 font-medium" 
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-red-650 block">Password must be at least 8 characters.</span>
                  </div>
                </div>

                {/* Alert Error */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Alert Error</span>
                  <div className="p-4 bg-red-50 border border-red-150 text-red-800 rounded-xl flex items-start justify-between gap-3">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold">Payment failed</strong>
                        <span className="mt-0.5 block opacity-90">Your payment could not be processed. Please try again.</span>
                      </div>
                    </div>
                    <X className="w-4 h-4 opacity-60 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Right Column: Modal & Toast */}
              <div className="space-y-6">
                {/* Modal Trigger */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Modal Error Trigger</span>
                  <p className="text-xs text-slate-500 leading-normal">
                    Critical errors blocking workflows should show dialog popups.
                  </p>
                  <button 
                    onClick={() => setShowModalError(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    Open Error Modal Demo
                  </button>
                </div>

                {/* Toast Error */}
                {toastError && (
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Toast Error</span>
                    <div className="p-4 bg-red-50 border border-red-150 text-red-800 rounded-xl shadow-md flex items-center justify-between gap-3 max-w-sm">
                      <div className="flex items-center gap-2.5">
                        <X className="w-4.5 h-4.5 text-red-650 bg-red-100 rounded-full p-0.5" />
                        <span className="text-xs font-semibold">Failed to save changes</span>
                      </div>
                      <X 
                        onClick={() => setToastError(false)}
                        className="w-4 h-4 text-slate-450 hover:text-slate-700 cursor-pointer shrink-0" 
                      />
                    </div>
                  </div>
                )}
                {!toastError && (
                  <button 
                    onClick={() => setToastError(true)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Reset Toast
                  </button>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Error Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Error Guidelines</h3>
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
            <div className="space-y-3 text-xs text-slate-655 leading-normal font-medium">
              <p>• Form inputs that fail validation constraints.</p>
              <p>• Failed transaction or data submission requests.</p>
              <p>• Lost internet connectivity or timeout cases.</p>
              <p>• Attempting to access unauthorized resources.</p>
              <p>• System errors requiring user help / support.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
