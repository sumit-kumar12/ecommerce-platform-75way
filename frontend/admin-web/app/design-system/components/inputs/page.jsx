"use client";

import React, { useState } from "react";
import { 
  Search, User, Calendar, Eye, EyeOff, X, Mail, Check, AlertTriangle, 
  HelpCircle, ArrowRight, Download, Info, CheckCircle2
} from "lucide-react";

const TABS = ["Overview", "Text Input", "Textarea", "Validation", "States", "Prefixes & Suffixes", "Best Practices"];

const INPUT_USAGES = [
  { label: "Use descriptive labels for all inputs.", ok: true },
  { label: "Show placeholder text as examples, not instructions.", ok: true },
  { label: "Provide clear validation and error messages.", ok: true },
  { label: "Use the right input type for the right data.", ok: true },
  { label: "Keep it simple and consistent.", ok: true }
];

const SPECIFICATIONS = [
  { name: "Font Family", value: "Inter" },
  { name: "Font Size", value: "14px" },
  { name: "Line Height", value: "20px" },
  { name: "Border Radius", value: "8px" },
  { name: "Padding (Y)", value: "10px" },
  { name: "Padding (X)", value: "14px" }
];

export default function DSInputsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [codeTab, setCodeTab] = useState("React");
  const [showPassword, setShowPassword] = useState(false);
  const [textareaVal, setTextareaVal] = useState("");
  const [copied, setCopied] = useState(false);

  const getCodeSnippet = () => {
    switch (codeTab) {
      case "React":
        return `import { Input } from 'katabazaar-ds';\nimport { Mail } from 'lucide-react';\n\n<Input\n  type="email"\n  label="Email Address"\n  placeholder="you@example.com"\n  iconLeft={<Mail size={18} />}\n  helperText="We'll never share your email."\n/>`;
      case "Vue":
        return `<template>\n  <KBInput\n    type="email"\n    label="Email Address"\n    placeholder="you@example.com"\n    helperText="We'll never share your email."\n  >\n    <template #iconLeft>\n      <MailIcon />\n    </template>\n  </KBInput>\n</template>\n\n<script>\nimport { KBInput } from 'katabazaar-ds-vue';\nimport MailIcon from './MailIcon.vue';\nexport default {\n  components: { KBInput, MailIcon }\n}\n<\/script>`;
      case "HTML":
        return `<div class="input-group">\n  <label for="email">Email Address</label>\n  <div class="input-wrapper">\n    <span class="icon">\n      <i data-icon="mail"></i>\n    </span>\n    <input type="email" id="email" placeholder="you@example.com" />\n  </div>\n  <p class="helper-text">We'll never share your email.</p>\n</div>`;
      case "Angular":
        return `<kb-input type="email" label="Email Address" placeholder="you@example.com" helperText="We'll never share your email.">\n  <kb-icon name="mail" slot="icon-left"></kb-icon>\n</kb-input>`;
      case "Svelte":
        return `<script>\n  import { Input } from 'katabazaar-ds-svelte';\n  import { Mail } from 'lucide-react-svelte';\n<\/script>\n\n<Input type="email" label="Email Address" placeholder="you@example.com" helperText="We'll never share your email.">\n  <Mail slot="icon-left" size={18} />\n</Input>`;
      default:
        return "";
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS2 – INPUTS</h1>
          <p className="text-sm text-slate-500 mt-1">Inputs help users enter and edit information. Use the right type for the right data.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search inputs..." 
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
          <span>Export Inputs</span>
        </button>
      </div>

      {/* Dashboard Columns */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Main block */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">text_fields</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Input Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">toggle_on</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">States</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">accessibility</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accessible</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">100%</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">devices</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Responsive</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">All Devices</span>
              </div>
            </div>
          </section>

          {/* Text Input Block */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Text Input</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Default */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <input 
                  type="text" 
                  placeholder="Enter text" 
                  className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Hover */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hover</label>
                <input 
                  type="text" 
                  placeholder="Enter text" 
                  className="px-3.5 py-2.5 border border-slate-350 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Focus */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Focus</label>
                <input 
                  type="text" 
                  placeholder="Enter text" 
                  className="px-3.5 py-2.5 border border-indigo-500 ring-2 ring-indigo-500/20 rounded-lg text-sm bg-white placeholder-slate-400 outline-none"
                />
              </div>

              {/* Filled */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Filled</label>
                <input 
                  type="text" 
                  defaultValue="John Doe" 
                  className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Disabled */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <input 
                  type="text" 
                  placeholder="Enter text" 
                  disabled
                  className="px-3.5 py-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-sm cursor-not-allowed placeholder-slate-300"
                />
              </div>

              {/* Read Only */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Read Only</label>
                <input 
                  type="text" 
                  value="Read only text" 
                  readOnly
                  className="px-3.5 py-2.5 border border-slate-200 bg-slate-50 text-slate-650 rounded-lg text-sm focus:outline-none select-all"
                />
              </div>

              {/* Prefix Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Prefix Icon</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Suffix Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Suffix Icon</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              {/* Prefix & Suffix */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Prefix & Suffix</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Select date" 
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              {/* Clear Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Clear Icon</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    defaultValue="Search query"
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="supersecret"
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Eye className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Reveal Password (Interactive!) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Reveal Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    defaultValue="supersecret"
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Textarea Block */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Textarea</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              
              {/* Default */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <textarea 
                  placeholder="Enter your message..." 
                  rows="3"
                  className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Focus */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Focus</label>
                <textarea 
                  placeholder="Enter your message..." 
                  rows="3"
                  className="px-3.5 py-2.5 border border-indigo-500 ring-2 ring-indigo-500/20 rounded-lg text-sm bg-white placeholder-slate-400 outline-none resize-none"
                />
              </div>

              {/* With Counter */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Counter</label>
                <textarea 
                  placeholder="Enter your message..." 
                  maxLength="200"
                  rows="3"
                  value={textareaVal}
                  onChange={(e) => setTextareaVal(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none pb-8"
                />
                <span className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 font-semibold">
                  {textareaVal.length}/200
                </span>
              </div>

              {/* Exceeding Limit */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Exceeding Limit</label>
                <textarea 
                  defaultValue="You have exceeded the limit." 
                  rows="3"
                  className="px-3.5 py-2.5 border border-red-500 rounded-lg text-sm bg-white focus:outline-none ring-2 ring-red-500/20 resize-none pb-8"
                />
                <span className="absolute bottom-2 right-3 text-[10px] font-mono text-red-500 font-bold">
                  210/200
                </span>
              </div>

              {/* Disabled */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <textarea 
                  placeholder="Enter your message..." 
                  disabled
                  rows="3"
                  className="px-3.5 py-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-sm cursor-not-allowed resize-none placeholder-slate-300"
                />
              </div>

            </div>
          </section>

          {/* Validation States */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0_0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Validation States</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Default */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Success */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Success</label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="john@example.com" 
                    className="w-full pl-3.5 pr-10 py-2.5 border border-emerald-500 rounded-lg text-sm bg-white focus:outline-none ring-2 ring-emerald-500/20 text-emerald-950"
                  />
                  <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-500" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 mt-1">Looks good!</span>
              </div>

              {/* Warning */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Warning</label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="john@example" 
                    className="w-full pl-3.5 pr-10 py-2.5 border border-amber-500 rounded-lg text-sm bg-white focus:outline-none ring-2 ring-amber-500/20 text-amber-950"
                  />
                  <AlertTriangle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-amber-500" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 mt-1">Please enter a valid email</span>
              </div>

              {/* Error */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Error</label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="johnexample.com" 
                    className="w-full pl-3.5 pr-10 py-2.5 border border-red-500 rounded-lg text-sm bg-white focus:outline-none ring-2 ring-red-500/20 text-red-950"
                  />
                  <AlertTriangle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-red-600 mt-1">Please enter a valid email</span>
              </div>

              {/* Helper Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Helper Text</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <span className="text-[10px] font-medium text-slate-400 mt-1">We'll never share your email.</span>
              </div>

            </div>
          </section>

          {/* Input Sizes & Full Width split */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Sizes */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Input Sizes</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Small</label>
                  <input type="text" value="Small input" readOnly className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none w-56" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Medium (Default)</label>
                  <input type="text" value="Medium input" readOnly className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none w-64" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Large</label>
                  <input type="text" value="Large input" readOnly className="px-4 py-3.5 border border-slate-200 rounded-lg text-base bg-slate-50 focus:outline-none w-72" />
                </div>
              </div>
            </div>

            {/* Full Width */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Full Width</h3>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Full Width Input</label>
                  <input 
                    type="text" 
                    defaultValue="This input takes the full width of the container" 
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 leading-normal mt-4">
                Use the <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">w-full</code> class variant for grid alignment and forms.
              </div>
            </div>

          </section>

        </div>

        {/* Right Sidebar panel */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Usage guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Input Usage Guidelines</h3>
            <div className="space-y-3">
              {INPUT_USAGES.map(g => (
                <div key={g.label} className="flex gap-2.5 items-start">
                  <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type Specifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Type Specifications</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  {SPECIFICATIONS.map((spec, idx) => (
                    <tr key={spec.name} className={idx !== SPECIFICATIONS.length - 1 ? "border-b border-slate-100" : ""}>
                      <td className="px-3 py-2.5 bg-slate-50/50 text-slate-400 font-medium w-28">{spec.name}</td>
                      <td className="px-3 py-2.5 text-slate-700 font-semibold">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Usage example code block */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usage Example (HTML)</h3>
              <button 
                onClick={handleCopyCode}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            
            <div className="flex border-b border-slate-200 mb-3">
              {["React", "Vue", "HTML", "Angular", "Svelte"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    codeTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-[10px] font-mono leading-normal overflow-x-auto whitespace-pre max-h-48 scrollbar-thin">
              {getCodeSnippet()}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="flex gap-2.5 items-start">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-600 leading-normal">
                Use inputs when users need to enter or update text information such as names, emails, descriptions, codes, etc.
              </span>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
