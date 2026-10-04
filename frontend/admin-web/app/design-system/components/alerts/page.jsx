"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, ShieldAlert,
  HelpCircle, Sparkles, CheckCircle2, Lock, ArrowRight, Play, Eye
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Variants", "Usage", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use alerts to communicate system feedback.", ok: true },
  { label: "Choose the right type to convey the meaning.", ok: true },
  { label: "Keep messages clear, concise and actionable.", ok: true },
  { label: "Don't use alerts for content or navigation.", ok: true },
  { label: "Allow users to dismiss non-critical alerts.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"alert\" or role=\"status\".", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Include icons and text for clarity.", ok: true },
  { label: "Do not rely on color alone.", ok: true },
  { label: "Ensure alerts are keyboard dismissible.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<div class="alert alert-success" role="status">
  <div class="alert-icon">
    <svg class="icon-check-circle">...</svg>
  </div>
  <div class="alert-content">
    <strong>Success</strong>
    <span>Your changes have been saved successfully.</span>
  </div>
  <button class="alert-close" aria-label="Close">&times;</button>
</div>`,
  Examples: `<div class="alert alert-warning" role="alert">
  <div class="alert-icon">
    <svg class="icon-warning">...</svg>
  </div>
  <div class="alert-content">
    <strong>Warning:</strong> Your subscription will expire in 3 days.
  </div>
</div>`,
  Types: `<div class="alert alert-critical" role="alert">
  <div class="alert-icon">
    <svg class="icon-shield">...</svg>
  </div>
  <div class="alert-content">
    <strong>Critical Error:</strong> Suspicious activity detected.
  </div>
</div>`,
  Variants: `<div class="alert alert-filled alert-success">
  <span>Solid colored filled style alert</span>
</div>`,
  Usage: `<!-- Use Alerts at the top of forms or page headers for clear visibility -->`
};

export default function DSAlertsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive dismissed states
  const [dismissedAlerts, setDismissedAlerts] = useState({
    success: false,
    info: false,
    warning: false,
    error: false,
    critical: false,
    neutral: false
  });

  const [alertVariantStyle, setAlertVariantStyle] = useState("soft"); // filled, soft, outline, plain

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAlerts = () => {
    setDismissedAlerts({
      success: false,
      info: false,
      warning: false,
      error: false,
      critical: false,
      neutral: false
    });
  };

  const toggleDismiss = (key) => {
    setDismissedAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getAlertClasses = (type, styleMode = alertVariantStyle) => {
    const base = "p-4 rounded-xl border flex items-start justify-between gap-3.5 transition-all duration-200 shadow-sm ";
    
    if (styleMode === "filled") {
      switch (type) {
        case "success": return base + "bg-emerald-600 border-emerald-700 text-white";
        case "info": return base + "bg-blue-600 border-blue-700 text-white";
        case "warning": return base + "bg-amber-500 border-amber-600 text-white";
        case "error": return base + "bg-red-600 border-red-700 text-white";
        case "critical": return base + "bg-purple-650 border-purple-700 text-white";
        default: return base + "bg-slate-700 border-slate-800 text-white";
      }
    } else if (styleMode === "outlined") {
      switch (type) {
        case "success": return base + "bg-white border-emerald-500 text-emerald-700";
        case "info": return base + "bg-white border-blue-500 text-blue-700";
        case "warning": return base + "bg-white border-amber-500 text-amber-700";
        case "error": return base + "bg-white border-red-500 text-red-700";
        case "critical": return base + "bg-white border-purple-500 text-purple-700";
        default: return base + "bg-white border-slate-400 text-slate-700";
      }
    } else if (styleMode === "subtle") {
      switch (type) {
        case "success": return base + "bg-emerald-50/40 border-emerald-100 text-emerald-800";
        case "info": return base + "bg-blue-50/40 border-blue-100 text-blue-800";
        case "warning": return base + "bg-amber-50/40 border-amber-100 text-amber-800";
        case "error": return base + "bg-red-50/40 border-red-100 text-red-800";
        case "critical": return base + "bg-purple-50/40 border-purple-100 text-purple-805";
        default: return base + "bg-slate-50/40 border-slate-150 text-slate-800";
      }
    } else if (styleMode === "border-left") {
      const baseBorder = "p-4 rounded-xl border border-slate-200 border-l-4 flex items-start justify-between gap-3.5 transition-all duration-200 shadow-sm bg-white ";
      switch (type) {
        case "success": return baseBorder + "border-l-emerald-600 text-slate-800";
        case "info": return baseBorder + "border-l-blue-600 text-slate-800";
        case "warning": return baseBorder + "border-l-amber-500 text-slate-800";
        case "error": return baseBorder + "border-l-red-650 text-slate-800";
        case "critical": return baseBorder + "border-l-purple-600 text-slate-800";
        default: return baseBorder + "border-l-slate-500 text-slate-800";
      }
    } else {
      // soft (default)
      switch (type) {
        case "success": return base + "bg-emerald-50 border-emerald-150 text-emerald-800";
        case "info": return base + "bg-blue-50 border-blue-150 text-blue-800";
        case "warning": return base + "bg-amber-50 border-amber-150 text-amber-800";
        case "error": return base + "bg-red-50 border-red-150 text-red-800";
        case "critical": return base + "bg-purple-50 border-purple-150 text-purple-800";
        default: return base + "bg-slate-50 border-slate-200 text-slate-850";
      }
    }
  };

  const getIcon = (type, styleMode = alertVariantStyle) => {
    const colorClass = styleMode === "filled" ? "text-white" : 
      type === "success" ? "text-emerald-600" :
      type === "info" ? "text-blue-600" :
      type === "warning" ? "text-amber-500" :
      type === "error" ? "text-red-655" :
      type === "critical" ? "text-purple-600" :
      "text-slate-500";

    const sizeClass = "w-5 h-5 flex-shrink-0 mt-0.5";

    switch (type) {
      case "success": return <CheckCircle2 className={`${sizeClass} ${colorClass}`} />;
      case "info": return <Info className={`${sizeClass} ${colorClass}`} />;
      case "warning": return <AlertTriangle className={`${sizeClass} ${colorClass}`} />;
      case "error": return <X className={`${sizeClass} ${colorClass} bg-red-100 rounded-full p-0.5`} />;
      case "critical": return <ShieldAlert className={`${sizeClass} ${colorClass}`} />;
      default: return <Info className={`${sizeClass} ${colorClass}`} />;
    }
  };

  const isAnyAlertDismissed = Object.values(dismissedAlerts).some(v => v);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – ALERTS</h1>
            <span className="material-symbols-outlined text-[24px] text-indigo-650 block">notifications_active</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Alerts communicate important information that requires user attention.</p>
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
                <span className="material-symbols-outlined text-[24px] block">warning</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alert Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Types</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">style</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">5 Variants</span>
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

          {/* Interactive Alert Examples */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alert Examples</h3>
                <p className="text-[11px] text-slate-450 mt-1">Click the dismiss button (X) to hide. Adjust variant style below.</p>
              </div>
              {isAnyAlertDismissed && (
                <button 
                  onClick={resetAlerts}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-650 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors"
                >
                  Reset Dismissed Alerts
                </button>
              )}
            </div>

            {/* Variant Style Selector bar */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-500 mr-2">Alert Style:</span>
              {["filled", "outlined", "subtle", "soft", "border-left"].map(style => (
                <button
                  key={style}
                  onClick={() => setAlertVariantStyle(style)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    alertVariantStyle === style 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {style.replace("-", " ")}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Success */}
              {!dismissedAlerts.success && (
                <div className={getAlertClasses("success")} role="status">
                  <div className="flex gap-3">
                    {getIcon("success")}
                    <div className="text-xs">
                      <strong className="block font-bold">Success</strong>
                      <span className="mt-0.5 block opacity-90">Your changes have been saved successfully.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDismiss("success")} 
                    aria-label="Dismiss alert"
                    className="text-inherit hover:opacity-75 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Information */}
              {!dismissedAlerts.info && (
                <div className={getAlertClasses("info")} role="status">
                  <div className="flex gap-3">
                    {getIcon("info")}
                    <div className="text-xs">
                      <strong className="block font-bold">Information</strong>
                      <span className="mt-0.5 block opacity-90">We've updated our privacy policy. Please review the changes.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDismiss("info")} 
                    aria-label="Dismiss alert"
                    className="text-inherit hover:opacity-75 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Warning */}
              {!dismissedAlerts.warning && (
                <div className={getAlertClasses("warning")} role="alert">
                  <div className="flex gap-3">
                    {getIcon("warning")}
                    <div className="text-xs">
                      <strong className="block font-bold">Warning</strong>
                      <span className="mt-0.5 block opacity-90">Your subscription will expire in 3 days. Please renew to continue.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDismiss("warning")} 
                    aria-label="Dismiss alert"
                    className="text-inherit hover:opacity-75 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error */}
              {!dismissedAlerts.error && (
                <div className={getAlertClasses("error")} role="alert">
                  <div className="flex gap-3">
                    {getIcon("error")}
                    <div className="text-xs">
                      <strong className="block font-bold">Error</strong>
                      <span className="mt-0.5 block opacity-90">Unable to process your request. Please try again later.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDismiss("error")} 
                    aria-label="Dismiss alert"
                    className="text-inherit hover:opacity-75 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Critical */}
              {!dismissedAlerts.critical && (
                <div className={getAlertClasses("critical")} role="alert">
                  <div className="flex gap-3">
                    {getIcon("critical")}
                    <div className="text-xs">
                      <strong className="block font-bold">Critical</strong>
                      <span className="mt-0.5 block opacity-90">Your account has been temporarily locked due to suspicious activity.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDismiss("critical")} 
                    aria-label="Dismiss alert"
                    className="text-inherit hover:opacity-75 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Neutral */}
              {!dismissedAlerts.neutral && (
                <div className={getAlertClasses("neutral")} role="status">
                  <div className="flex gap-3">
                    {getIcon("neutral")}
                    <div className="text-xs">
                      <strong className="block font-bold">Neutral</strong>
                      <span className="mt-0.5 block opacity-90">System maintenance is scheduled for May 25, 2026 at 02:00 AM UTC.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDismiss("neutral")} 
                    aria-label="Dismiss alert"
                    className="text-inherit hover:opacity-75 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Variants and Styles Comparison Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual variants block */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style Variants Comparison</h3>
              <div className="space-y-4.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">1. Filled (Solid)</span>
                  <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Solid background with colored tone.</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">2. Soft (Subtle)</span>
                  <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Subtle background with light tone.</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">3. Outline</span>
                  <div className="p-3 border border-emerald-500 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2 bg-white">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Bordered with no background.</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">4. Plain</span>
                  <div className="p-2 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Minimal style with icon and text only.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* With icons vs No icons comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">With / Without Icons</h3>
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>Success: Operation completed successfully.</span>
                  </div>
                  <X className="w-4 h-4 opacity-60" />
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-150 text-blue-800 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                    <span>Info: This is an informational message.</span>
                  </div>
                  <X className="w-4 h-4 opacity-60" />
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-150 text-amber-800 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Warning: Please review this warning.</span>
                  </div>
                  <X className="w-4 h-4 opacity-60" />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-250 text-slate-800 rounded-xl text-xs flex items-center justify-between">
                  <span>No Icon: This alert has no icon.</span>
                  <X className="w-4 h-4 opacity-60" />
                </div>
              </div>
            </div>

          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Alert Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Alert Guidelines</h3>
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
              {CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3 text-xs text-slate-650 leading-normal">
              <p><strong className="text-slate-800 font-bold block">Success:</strong> To show successful completion.</p>
              <p><strong className="text-slate-800 font-bold block">Info:</strong> To share general information.</p>
              <p><strong className="text-slate-800 font-bold block">Warning:</strong> To warn about potential issues.</p>
              <p><strong className="text-slate-800 font-bold block">Error:</strong> To show errors that block actions.</p>
              <p><strong className="text-slate-800 font-bold block">Critical:</strong> For high priority or security issues.</p>
              <p><strong className="text-slate-800 font-bold block">Neutral:</strong> To share neutral or routine updates.</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
