"use client";

import React, { useState } from "react";
import { 
  Compass, Eye, Play, Sparkles, Accessibility, Layers, ArrowUpDown,
  Download, Copy, Bell, Search, Check, AlertTriangle, Settings, RefreshCw
} from "lucide-react";

const TABS = ["Overview", "Easing", "Duration", "Transitions", "Animations", "Micro Interactions", "Page Transitions", "Accessibility", "Best Practices"];

const PRINCIPLES = [
  { 
    title: "Purposeful", 
    desc: "Every motion should have a clear purpose and enhance understanding.", 
    icon: Compass,
    color: "bg-blue-50 text-blue-600"
  },
  { 
    title: "Natural", 
    desc: "Motion follows real-world physics and feels intuitive.", 
    icon: Sparkles,
    color: "bg-indigo-50 text-indigo-600"
  },
  { 
    title: "Consistent", 
    desc: "Use consistent patterns to build familiarity and reduce cognitive load.", 
    icon: Layers,
    color: "bg-purple-50 text-purple-600"
  },
  { 
    title: "Accessible", 
    desc: "Respect user preferences and ensure motion is comfortable for everyone.", 
    icon: Accessibility,
    color: "bg-emerald-50 text-emerald-600"
  },
];

const EASING_CURVES = [
  { name: "Linear", value: "cubic-bezier(0, 0, 1, 1)", path: "M4,28 L44,4" },
  { name: "Ease In", value: "cubic-bezier(0.4, 0, 1, 1)", path: "M4,28 C20,28 44,28 44,4" },
  { name: "Ease Out", value: "cubic-bezier(0, 0, 0.2, 1)", path: "M4,28 C4,4 30,4 44,4" },
  { name: "Ease In Out", value: "cubic-bezier(0.4, 0, 0.2, 1)", path: "M4,28 C15,28 33,4 44,4" },
  { name: "Spring (Standard)", value: "cubic-bezier(0.34, 1.56, 0.64, 1)", path: "M4,28 C18,28 16,-4 26,8 C32,16 34,2 44,4" },
];

const DURATION_SCALE = [
  { name: "Instant", ms: "0ms", desc: "No delay, immediate change." },
  { name: "Fast", ms: "100ms", desc: "Micro-interactions, hover states." },
  { name: "Base", ms: "200ms", desc: "Standard transitions, fade-ins." },
  { name: "Medium", ms: "300ms", desc: "Page transitions, slide-ins." },
  { name: "Slow", ms: "500ms", desc: "Complex components, cards." },
  { name: "Slower", ms: "700ms", desc: "Large page refreshes, dashboards." },
  { name: "Slowest", ms: "1000ms+", desc: "Progress loops, custom loaders." },
];

const TRANSITIONS = [
  { name: "Fade", classNormal: "opacity-100 scale-100 rotate-0 translate-x-0", classActive: "opacity-0 scale-100 rotate-0 translate-x-0" },
  { name: "Slide", classNormal: "opacity-100 scale-100 rotate-0 translate-x-0", classActive: "opacity-100 scale-100 rotate-0 translate-x-12" },
  { name: "Scale", classNormal: "opacity-100 scale-100 rotate-0 translate-x-0", classActive: "opacity-100 scale-[0.2] rotate-0 translate-x-0" },
  { name: "Slide & Fade", classNormal: "opacity-100 scale-100 rotate-0 translate-x-0", classActive: "opacity-0 scale-100 rotate-0 translate-x-12" },
  { name: "Scale & Fade", classNormal: "opacity-100 scale-100 rotate-0 translate-x-0", classActive: "opacity-0 scale-[0.2] rotate-0 translate-x-0" },
  { name: "Rotate", classNormal: "opacity-100 scale-100 rotate-0 translate-x-0", classActive: "opacity-100 scale-100 rotate-180 translate-x-0" },
];

const ANIMATIONS = [
  { name: "Fade In", duration: "200ms", easing: "Ease Out", type: "fade" },
  { name: "Slide Up", duration: "300ms", easing: "Ease Out", type: "slide" },
  { name: "Scale In", duration: "200ms", easing: "Ease Out Back", type: "scale" },
  { name: "Bounce", duration: "600ms", easing: "Spring", type: "bounce" },
  { name: "Shimmer", duration: "1500ms", easing: "Linear", type: "shimmer" },
  { name: "Loading Spinner", duration: "1000ms", easing: "Linear", type: "spin" },
  { name: "Progress Loop", duration: "2000ms", easing: "Linear", type: "progress" },
  { name: "Pulse", duration: "1200ms", easing: "Ease In Out", type: "pulse" },
  { name: "Wiggle", duration: "400ms", easing: "Ease In Out", type: "wiggle" },
];

const CSS_USAGE = `.modal-enter {
  animation: fade-in 200ms ease-out both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-hover:hover {
  transition: transform 150ms var(--ease-out), box-shadow 150ms var(--ease-out);
  transform: translateY(-2px);
}`;

const A11Y_CSS = `@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

export default function DSMotionPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hoveredCurve, setHoveredCurve] = useState(null);
  const [activeTransition, setActiveTransition] = useState(null);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedA11y, setCopiedA11y] = useState(false);

  const handleCopy = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerTransition = (name) => {
    setActiveTransition(name);
    setTimeout(() => {
      setActiveTransition(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      {/* Custom Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideUpCustom {
          0%, 100% { transform: translateY(16px); opacity: 0; }
          40%, 60% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleInCustom {
          0%, 100% { transform: scale(0.4); opacity: 0; }
          45%, 55% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes bounceCustom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulseCustom {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes wiggleCustom {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
        @keyframes progressCustom {
          0% { stroke-dashoffset: 100; }
          50% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 100; }
        }

        .animate-shimmer-custom {
          animation: shimmer 1.6s infinite linear;
        }
        .animate-slide-custom {
          animation: slideUpCustom 2s infinite cubic-bezier(0.25, 1, 0.5, 1);
        }
        .animate-scale-custom {
          animation: scaleInCustom 1.6s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-bounce-custom-1 {
          animation: bounceCustom 1s infinite ease-in-out;
        }
        .animate-bounce-custom-2 {
          animation: bounceCustom 1s infinite ease-in-out;
          animation-delay: 0.15s;
        }
        .animate-bounce-custom-3 {
          animation: bounceCustom 1s infinite ease-in-out;
          animation-delay: 0.3s;
        }
        .animate-pulse-custom {
          animation: pulseCustom 1.6s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-wiggle-custom {
          animation: wiggleCustom 0.5s infinite ease-in-out;
        }
        .animate-progress-custom {
          animation: progressCustom 2.2s infinite ease-in-out;
        }
      `}} />

      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS1 – MOTION</h1>
          <p className="text-sm text-slate-500 mt-1">Principles and guidelines for creating smooth, meaningful and consistent motion.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search motion..." 
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
                0
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

      {/* Tabs bar */}
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
        
        <button className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold px-4 py-2 shadow-sm transition-colors">
          <Download className="w-4 h-4" />
          <span>Download Motion Kit</span>
        </button>
      </div>

      {/* Easing, Duration, and Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 items-start">
        
        {/* Motion Principles */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Motion Principles</h2>
            <p className="text-[11px] text-slate-400 mb-6">Our motion is intentional and user-focused.</p>
            
            <div className="space-y-5">
              {PRINCIPLES.map(p => (
                <div key={p.title} className="flex gap-4 items-start">
                  <div className={`p-2 rounded-lg ${p.color} shrink-0`}>
                    <p.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Easing Curves */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Easing Curves</h2>
            <p className="text-[11px] text-slate-400 mb-6">Use easing to create natural feeling motion.</p>
            
            <div className="space-y-4">
              {EASING_CURVES.map((e, idx) => (
                <div 
                  key={e.name} 
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all cursor-pointer group"
                  onMouseEnter={() => setHoveredCurve(idx)}
                  onMouseLeave={() => setHoveredCurve(null)}
                >
                  <div className="w-24">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">{e.name}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 truncate max-w-[80px]" title={e.value}>
                      {e.value}
                    </span>
                  </div>
                  
                  {/* SVG Bezier Graph */}
                  <div className="w-16 h-8 bg-slate-50 rounded border border-slate-100 flex items-center justify-center overflow-hidden relative">
                    <svg className="w-full h-full p-1 overflow-visible" viewBox="0 0 48 32">
                      <path 
                        d={e.path} 
                        stroke="#CBD5E1" 
                        strokeWidth="1.5" 
                        fill="none" 
                      />
                      <path 
                        d={e.path} 
                        stroke="#6366F1" 
                        strokeWidth="2" 
                        fill="none" 
                        className={`transition-all duration-300 ${hoveredCurve === idx ? "stroke-indigo-600" : ""}`}
                      />
                    </svg>

                    {/* Animated moving dot on track */}
                    <div className="absolute left-2 right-2 bottom-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute top-[-1px] transition-all"
                        style={{
                          left: hoveredCurve === idx ? "100%" : "0%",
                          transitionDuration: "800ms",
                          transitionTimingFunction: e.value
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Duration Scale */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration Scale</h2>
            <p className="text-[11px] text-slate-400 mb-6">Duration should be proportional to distance and complexity.</p>
            
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {DURATION_SCALE.map(d => (
                <div key={d.name} className="relative group cursor-default">
                  {/* Timeline circle node */}
                  <span className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white group-hover:bg-indigo-500 group-hover:scale-110 transition-all"></span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{d.name}</span>
                    <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {d.ms}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transition Examples */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transition Examples</h2>
            <p className="text-[11px] text-slate-400 mb-6">Common transition patterns used in the system.</p>
            
            <div className="space-y-3">
              {TRANSITIONS.map(t => {
                const isActive = activeTransition === t.name;
                return (
                  <div key={t.name} className="flex items-center justify-between p-2 bg-slate-50/50 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      {/* Interactive Visual Preview Box */}
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                        <div 
                          className={`w-5 h-5 rounded-md bg-indigo-600 shadow-sm transition-all duration-700 ${
                            isActive ? t.classActive : t.classNormal
                          }`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{t.name}</span>
                    </div>

                    <button 
                      onClick={() => triggerTransition(t.name)}
                      className="px-3 py-1 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/20 text-[10px] font-bold text-slate-600 rounded-md shadow-sm transition-all cursor-pointer"
                    >
                      Preview
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Common Animations */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Common Animations</h2>
        <p className="text-[11px] text-slate-400 mb-6">Reusable animations for feedback and emphasis.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-4">
          {ANIMATIONS.map(a => (
            <div key={a.name} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex flex-col items-center text-center shadow-inner group hover:border-indigo-100 transition-colors">
              
              {/* Visual Interactive Animation Area */}
              <div className="h-16 flex items-center justify-center mb-4 w-full relative overflow-hidden bg-white border border-slate-100 rounded-lg shadow-sm">
                
                {/* Fade In */}
                {a.type === "fade" && (
                  <div className="flex gap-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 animate-[pulse_1.2s_infinite]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 animate-[pulse_1.2s_infinite]" style={{ animationDelay: "0.2s" }} />
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 animate-[pulse_1.2s_infinite]" style={{ animationDelay: "0.4s" }} />
                  </div>
                )}

                {/* Slide Up */}
                {a.type === "slide" && (
                  <div className="w-12 h-6 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center animate-slide-custom">
                    <span className="text-[10px] font-bold text-indigo-600">▲</span>
                  </div>
                )}

                {/* Scale In */}
                {a.type === "scale" && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 animate-scale-custom shadow" />
                )}

                {/* Bounce */}
                {a.type === "bounce" && (
                  <div className="flex gap-1 items-end h-8">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce-custom-1" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce-custom-2" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce-custom-3" />
                  </div>
                )}

                {/* Shimmer */}
                {a.type === "shimmer" && (
                  <div className="w-16 h-8 bg-slate-100 rounded relative overflow-hidden flex flex-col justify-center gap-1.5 px-2">
                    <div className="h-2 w-full bg-slate-200 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full h-full translate-x-[-100%] animate-shimmer-custom" />
                    </div>
                    <div className="h-2 w-2/3 bg-slate-200 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full h-full translate-x-[-100%] animate-shimmer-custom" />
                    </div>
                  </div>
                )}

                {/* Loading Spinner */}
                {a.type === "spin" && (
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin" />
                )}

                {/* Progress Loop */}
                {a.type === "progress" && (
                  <svg className="w-8 h-8 rotate-[-90deg]">
                    <circle cx="16" cy="16" r="12" fill="none" stroke="#EEF2FF" strokeWidth="2.5" />
                    <circle 
                      cx="16" 
                      cy="16" 
                      r="12" 
                      fill="none" 
                      stroke="#4F46E5" 
                      strokeWidth="2.5" 
                      strokeDasharray="100" 
                      className="animate-progress-custom"
                    />
                  </svg>
                )}

                {/* Pulse */}
                {a.type === "pulse" && (
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute w-6 h-6 rounded-full bg-indigo-500/30 animate-pulse-custom" />
                    <div className="absolute w-6 h-6 rounded-full bg-indigo-500/30 animate-pulse-custom" style={{ animationDelay: "0.5s" }} />
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 z-10" />
                  </div>
                )}

                {/* Wiggle */}
                {a.type === "wiggle" && (
                  <div className="w-7 h-7 flex items-center justify-center animate-wiggle-custom text-indigo-600">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                )}

              </div>

              <div className="text-xs font-bold text-slate-800 truncate w-full">{a.name}</div>
              <div className="text-[10px] text-slate-400 mt-1">Dur: {a.duration}</div>
              <div className="text-[10px] text-slate-400">Ease: {a.easing}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Code and Accessibility Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CSS Usage Code Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usage Example (CSS)</h2>
              <button 
                onClick={() => handleCopy(CSS_USAGE, setCopiedCSS)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copiedCSS ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-6">Use our motion tokens in your styles.</p>
            
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[11px] font-mono leading-normal overflow-x-auto whitespace-pre">
              {CSS_USAGE}
            </pre>
          </div>
        </div>

        {/* Accessibility Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accessibility</h2>
              <button 
                onClick={() => handleCopy(A11Y_CSS, setCopiedA11y)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copiedA11y ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-6">Respect user preferences for reduced motion.</p>
            
            {/* Reduce Motion Card Switch */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6 shadow-inner">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Accessibility className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <div className="text-xs font-bold text-slate-800 leading-none">Reduce Motion</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Automatically minimize or remove non-essential motion when the user prefers reduced motion.
                </p>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  reduceMotion ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  reduceMotion ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[11px] font-mono leading-normal overflow-x-auto whitespace-pre">
              {A11Y_CSS}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
