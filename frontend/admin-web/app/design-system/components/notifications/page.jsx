"use client";

import React, { useState, useEffect } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Bell, 
  RefreshCw, CheckCircle2, ArrowRight, Play, Volume2
} from "lucide-react";

const TABS = ["Overview", "Types", "Behavior", "Placement", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use notifications to communicate system feedback.", ok: true },
  { label: "Keep messages short and actionable.", ok: true },
  { label: "Use the right type for the right context.", ok: true },
  { label: "Don't stack too many notifications.", ok: true },
  { label: "Ensure important notifications are not missed.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use role=\"status\" or role=\"alert\" appropriately.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Notifications should be focusable if interactive.", ok: true },
  { label: "Auto-dismiss notifications should be announced.", ok: true },
  { label: "Provide clear action buttons and labels.", ok: true }
];

export default function DSNotificationsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Interactive toast triggers
  const [toasts, setToasts] = useState([]);
  const [placement, setPlacement] = useState("top-right"); // 'top-left', 'top-center', 'top-right', 'bottom-right'
  const [autoDismiss, setAutoDismiss] = useState(5); // seconds
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [maxVisible, setMaxVisible] = useState(3);
  const [newOnTop, setNewOnTop] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Auto-dismiss logic
  useEffect(() => {
    if (toasts.length === 0) return;
    
    const interval = setInterval(() => {
      setToasts(prev => {
        if (prev.length === 0) return prev;
        const now = Date.now();
        return prev.filter(t => now - t.createdAt < autoDismiss * 1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [toasts, autoDismiss]);

  const addToast = (type, message, actionText = null, onAction = null) => {
    if (soundEnabled) {
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav");
        audio.volume = 0.3;
        audio.play();
      } catch (e) {
        console.log("Audio play blocked");
      }
    }

    const newToast = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      actionText,
      onAction,
      createdAt: Date.now()
    };

    setToasts(prev => {
      let nextToasts = newOnTop ? [newToast, ...prev] : [...prev, newToast];
      if (nextToasts.length > maxVisible) {
        nextToasts = newOnTop ? nextToasts.slice(0, maxVisible) : nextToasts.slice(nextToasts.length - maxVisible);
      }
      return nextToasts;
    });
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCopyCode = () => {
    const code = `<div class="notification-toast success" role="status">
  <div class="notification-icon">
    <svg>...</svg>
  </div>
  <div class="notification-content">
    <p>Your changes have been saved successfully.</p>
  </div>
  <button class="notification-close" aria-label="Close">&times;</button>
</div>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50 border-emerald-150 text-emerald-800",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-150 text-blue-800",
          icon: <Info className="w-4 h-4 text-blue-600" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-150 text-amber-800",
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-150 text-red-800",
          icon: <X className="w-4 h-4 text-red-650 bg-red-100 rounded-full p-0.5" />,
        };
      case "update":
        return {
          bg: "bg-indigo-50 border-indigo-150 text-indigo-850",
          icon: <RefreshCw className="w-4 h-4 text-indigo-650" />,
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-700",
          icon: <Info className="w-4 h-4 text-slate-400" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative overflow-hidden">
      
      {/* Floating Notifications Host */}
      <div className={`fixed z-50 p-6 flex flex-col gap-3 pointer-events-none max-w-sm w-full ${
        placement === "top-right" ? "top-0 right-0" :
        placement === "top-left" ? "top-0 left-0" :
        placement === "top-center" ? "top-0 left-1/2 -translate-x-1/2" :
        "bottom-0 right-0"
      }`}>
        {toasts.map(toast => {
          const styles = getToastStyles(toast.type);
          return (
            <div 
              key={toast.id}
              className={`p-4 border rounded-xl shadow-xl flex items-start justify-between gap-3 pointer-events-auto transition-all duration-300 transform scale-100 translate-y-0 animate-slide-in-toast ${styles.bg}`}
            >
              <div className="flex gap-2.5 min-w-0">
                <div className="shrink-0 mt-0.5">{styles.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-relaxed break-words">{toast.message}</p>
                  {toast.actionText && (
                    <button 
                      onClick={() => {
                        if (toast.onAction) toast.onAction();
                        removeToast(toast.id);
                      }}
                      className="text-[10px] font-bold underline mt-1.5 hover:opacity-80 block text-left"
                    >
                      {toast.actionText}
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-450 hover:text-slate-700 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS3 – NOTIFICATIONS</h1>
            <Bell className="w-5 h-5 text-indigo-655 animate-bounce" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Notifications keep users informed about important events and updates.</p>
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
        
        {/* Left Columns */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block font-bold">6 Types</span>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-bold">Accessible</span>
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

          {/* Notification Types Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notification Types</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Click any to test trigger</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Success */}
              <div 
                onClick={() => addToast("success", "Your changes have been saved successfully.")}
                className="border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-emerald-400 transition-all flex items-start justify-between gap-3 bg-emerald-50/20"
              >
                <div className="flex gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Success</h5>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">Your changes have been saved successfully.</p>
                  </div>
                </div>
                <X className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
              </div>

              {/* Info */}
              <div 
                onClick={() => addToast("info", "Here's some helpful information for you.")}
                className="border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-blue-400 transition-all flex items-start justify-between gap-3 bg-blue-50/20"
              >
                <div className="flex gap-2.5">
                  <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Info</h5>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">Here's some helpful information for you.</p>
                  </div>
                </div>
                <X className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
              </div>

              {/* Warning */}
              <div 
                onClick={() => addToast("warning", "Please review the information before continuing.")}
                className="border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-amber-400 transition-all flex items-start justify-between gap-3 bg-amber-50/20"
              >
                <div className="flex gap-2.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Warning</h5>
                    <p className="text-[10px] text-slate-455 mt-1 leading-relaxed">Please review the information before continuing.</p>
                  </div>
                </div>
                <X className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
              </div>

              {/* Error */}
              <div 
                onClick={() => addToast("error", "Something went wrong. Please try again.")}
                className="border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-red-400 transition-all flex items-start justify-between gap-3 bg-red-50/20"
              >
                <div className="flex gap-2.5">
                  <X className="w-4.5 h-4.5 text-red-650 bg-red-100 rounded-full p-0.5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Error</h5>
                    <p className="text-[10px] text-slate-455 mt-1 leading-relaxed">Something went wrong. Please try again.</p>
                  </div>
                </div>
                <X className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
              </div>

              {/* Update */}
              <div 
                onClick={() => addToast("update", "A new update is available. Click to view details.", "View Details")}
                className="border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-indigo-400 transition-all flex items-start justify-between gap-3 bg-indigo-50/20"
              >
                <div className="flex gap-2.5">
                  <RefreshCw className="w-4.5 h-4.5 text-indigo-650 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Update</h5>
                    <p className="text-[10px] text-slate-455 mt-1 leading-relaxed">A new update is available. Click to view details.</p>
                  </div>
                </div>
                <X className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
              </div>

              {/* Neutral */}
              <div 
                onClick={() => addToast("neutral", "This is a neutral notification message.")}
                className="border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-slate-400 transition-all flex items-start justify-between gap-3 bg-slate-50"
              >
                <div className="flex gap-2.5">
                  <Info className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Neutral</h5>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">This is a neutral notification message.</p>
                  </div>
                </div>
                <X className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
              </div>

            </div>
          </section>

          {/* Notification States */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Notification States</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
              
              {/* Default */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <div className="p-3 border border-emerald-150 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-between text-[10px] font-bold min-h-[56px]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Default content.</span>
                  </div>
                  <X className="w-3 h-3 text-slate-400 cursor-pointer" />
                </div>
              </div>

              {/* Icon Only */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Icon Only</label>
                <div className="p-3 border border-emerald-150 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-between text-[10px] font-bold min-h-[56px]">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mx-auto" />
                  <X className="w-3 h-3 text-slate-400 cursor-pointer shrink-0" />
                </div>
              </div>

              {/* With Action */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Action</label>
                <div className="p-2.5 border border-blue-150 bg-blue-50 text-blue-800 rounded-lg flex flex-col justify-between text-[9px] min-h-[56px] gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Update available</span>
                    <X className="w-2.5 h-2.5 text-slate-400 cursor-pointer" />
                  </div>
                  <button className="text-[8px] font-bold underline text-left cursor-pointer">View</button>
                </div>
              </div>

              {/* With Undo */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Undo</label>
                <div className="p-2.5 border border-amber-150 bg-amber-50 text-amber-800 rounded-lg flex flex-col justify-between text-[9px] min-h-[56px] gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Item moved to trash</span>
                    <X className="w-2.5 h-2.5 text-slate-400 cursor-pointer" />
                  </div>
                  <button className="text-[8px] font-bold underline text-left cursor-pointer">Undo</button>
                </div>
              </div>

              {/* Dismissible */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Dismissible</label>
                <div className="p-3 border border-red-150 bg-red-50 text-red-800 rounded-lg flex items-center justify-between text-[10px] font-bold min-h-[56px]">
                  <div className="flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5 text-red-600 shrink-0 bg-red-100 rounded-full p-0.5" />
                    <span>Dismissible</span>
                  </div>
                  <X className="w-3 h-3 text-slate-400 cursor-pointer" />
                </div>
              </div>

              {/* Auto Dismiss */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Auto Dismiss (5s)</label>
                <div className="p-3 border border-blue-150 bg-blue-50 text-blue-800 rounded-lg flex items-center justify-between text-[9px] font-medium min-h-[56px]">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Disappears auto...</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Placement Examples */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Examples</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Top Left */}
              <div 
                onClick={() => setPlacement("top-left")}
                className={`border rounded-xl p-4 cursor-pointer text-center bg-slate-50/50 hover:bg-slate-50 transition-colors ${
                  placement === "top-left" ? "border-indigo-600 ring-2 ring-indigo-500/10 font-bold" : "border-slate-200"
                }`}
              >
                <div className="border border-slate-200 bg-white rounded-lg p-2.5 h-20 relative overflow-hidden mb-2">
                  <span className="absolute top-1.5 left-1.5 w-10 h-3 bg-indigo-50 border border-indigo-150 rounded flex items-center gap-0.5 px-0.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                    <span className="w-6 h-0.5 bg-slate-200 rounded" />
                  </span>
                  <div className="space-y-1.5 mt-6">
                    <div className="h-1 bg-slate-100 rounded w-full" />
                    <div className="h-1 bg-slate-100 rounded w-3/5" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-700">Top Left</div>
              </div>

              {/* Top Center */}
              <div 
                onClick={() => setPlacement("top-center")}
                className={`border rounded-xl p-4 cursor-pointer text-center bg-slate-50/50 hover:bg-slate-50 transition-colors ${
                  placement === "top-center" ? "border-indigo-600 ring-2 ring-indigo-500/10 font-bold" : "border-slate-200"
                }`}
              >
                <div className="border border-slate-200 bg-white rounded-lg p-2.5 h-20 relative overflow-hidden mb-2">
                  <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-indigo-50 border border-indigo-150 rounded flex items-center gap-0.5 px-0.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                    <span className="w-6 h-0.5 bg-slate-200 rounded" />
                  </span>
                  <div className="space-y-1.5 mt-6">
                    <div className="h-1 bg-slate-100 rounded w-full" />
                    <div className="h-1 bg-slate-100 rounded w-3/5" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-700">Top Center</div>
              </div>

              {/* Top Right */}
              <div 
                onClick={() => setPlacement("top-right")}
                className={`border rounded-xl p-4 cursor-pointer text-center bg-slate-50/50 hover:bg-slate-50 transition-colors ${
                  placement === "top-right" ? "border-indigo-600 ring-2 ring-indigo-500/10 font-bold" : "border-slate-200"
                }`}
              >
                <div className="border border-slate-200 bg-white rounded-lg p-2.5 h-20 relative overflow-hidden mb-2">
                  <span className="absolute top-1.5 right-1.5 w-10 h-3 bg-indigo-50 border border-indigo-150 rounded flex items-center gap-0.5 px-0.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                    <span className="w-6 h-0.5 bg-slate-200 rounded" />
                  </span>
                  <div className="space-y-1.5 mt-6">
                    <div className="h-1 bg-slate-100 rounded w-full" />
                    <div className="h-1 bg-slate-100 rounded w-3/5" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-700">Top Right</div>
              </div>

              {/* Bottom Right */}
              <div 
                onClick={() => setPlacement("bottom-right")}
                className={`border rounded-xl p-4 cursor-pointer text-center bg-slate-50/50 hover:bg-slate-50 transition-colors ${
                  placement === "bottom-right" ? "border-indigo-600 ring-2 ring-indigo-500/10 font-bold" : "border-slate-200"
                }`}
              >
                <div className="border border-slate-200 bg-white rounded-lg p-2.5 h-20 relative overflow-hidden mb-2">
                  <span className="absolute bottom-1.5 right-1.5 w-10 h-3 bg-indigo-50 border border-indigo-150 rounded flex items-center gap-0.5 px-0.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                    <span className="w-6 h-0.5 bg-slate-200 rounded" />
                  </span>
                  <div className="space-y-1.5">
                    <div className="h-1 bg-slate-100 rounded w-full" />
                    <div className="h-1 bg-slate-100 rounded w-3/5" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-700">Bottom Right</div>
              </div>

            </div>

            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl flex items-center gap-2 text-xs font-semibold border border-blue-150">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Top right is the recommended placement for most use cases.</span>
            </div>
          </section>

          {/* Behavior Settings */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Behavior Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
              
              {/* Auto Dismiss */}
              <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] font-bold text-slate-450 uppercase">Auto Dismiss</span>
                <div className="flex items-center justify-between mt-2">
                  <select 
                    value={autoDismiss}
                    onChange={(e) => setAutoDismiss(Number(e.target.value))}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none cursor-pointer font-medium"
                  >
                    <option value={3}>3 seconds</option>
                    <option value={5}>5 seconds</option>
                    <option value={10}>10 seconds</option>
                  </select>
                </div>
              </div>

              {/* Pause on Hover */}
              <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] font-bold text-slate-455 uppercase">Pause on Hover</span>
                <div className="flex items-center justify-between mt-2">
                  <button 
                    onClick={() => setPauseOnHover(!pauseOnHover)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      pauseOnHover ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      pauseOnHover ? 'translate-x-4.5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Stacking */}
              <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] font-bold text-slate-455 uppercase">Stacking</span>
                <div className="flex items-center justify-between mt-2">
                  <select 
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none cursor-pointer font-medium"
                  >
                    <option>Stack up</option>
                    <option>Stack down</option>
                  </select>
                </div>
              </div>

              {/* Max Visible */}
              <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] font-bold text-slate-455 uppercase">Max Visible</span>
                <div className="flex items-center justify-between mt-2">
                  <select 
                    value={maxVisible}
                    onChange={(e) => setMaxVisible(Number(e.target.value))}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none cursor-pointer font-medium"
                  >
                    <option value={3}>3 toasts</option>
                    <option value={5}>5 toasts</option>
                    <option value={10}>10 toasts</option>
                  </select>
                </div>
              </div>

              {/* New on Top */}
              <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] font-bold text-slate-455 uppercase">New on Top</span>
                <div className="flex items-center justify-between mt-2">
                  <button 
                    onClick={() => setNewOnTop(!newOnTop)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      newOnTop ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      newOnTop ? 'translate-x-4.5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Sound */}
              <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] font-bold text-slate-455 uppercase flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-slate-400" />
                  <span>Sound</span>
                </span>
                <div className="flex items-center justify-between mt-2">
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4.5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Notification Guidelines</h4>
            <ul className="space-y-3">
              {GUIDELINES.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-655 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-emerald-500 font-bold block mt-0.5">check_circle</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Accessibility</h4>
            <ul className="space-y-3">
              {ACCESSIBILITY_ITEMS.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-655 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-indigo-500 block mt-0.5">radio_button_checked</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Code Example (HTML)</h4>
              <button 
                onClick={handleCopyCode}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold shadow-sm transition-colors border-none"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#0b0f19] text-[#a9b2c3] p-3.5 rounded-lg text-[10px] font-mono overflow-x-auto leading-relaxed max-h-56">
{`<div class="notification-toast success" role="status">
  <div class="notification-icon">
    <svg>...</svg>
  </div>
  <div class="notification-content">
    <p>Your changes have been saved successfully.</p>
  </div>
  <button class="notification-close" aria-label="Close">&times;</button>
</div>`}
            </pre>
          </div>

          {/* When to Use */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">When to Use</h4>
            <ul className="space-y-3">
              {[
                "After form submissions or actions.",
                "To show success or error messages.",
                "To provide important announcements.",
                "For updates or new feature highlights.",
                "To confirm user actions or changes."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-655 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-indigo-500 block mt-0.5">radio_button_checked</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </aside>

      </div>
      
      {/* Footer Branding */}
      <footer className="mt-auto pt-10 pb-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Design with consistency. Build with confidence.</span>
        <div className="flex items-center gap-4">
          <span>Katabazaar Design System © 2024</span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">v1.0.0</span>
        </div>
      </footer>

    </div>
  );
}
