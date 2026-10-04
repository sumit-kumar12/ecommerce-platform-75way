"use client";

import React, { useState } from "react";
import { 
  Download, Search, User, Check, Info, Bot, Plus, Crown, Star
} from "lucide-react";

const TABS = ["Overview", "Examples", "Types", "Variants", "Usage", "Accessibility", "Best Practices"];

const GUIDELINES = [
  "Use avatars to represent users or entities.",
  "Choose the appropriate type for the context.",
  "Use high quality images for photo avatars.",
  "Ensure sufficient contrast and visibility.",
  "Include status to indicate availability."
];

const ACCESSIBILITY_ITEMS = [
  "Use alt text for meaningful images.",
  "Ensure sufficient color contrast.",
  "Don't rely on color alone for status.",
  "Provide labels for screen readers.",
  "Ensure badges are descriptive."
];

const BEST_PRACTICES = [
  "Use avatars consistently throughout the app.",
  "Keep avatar sizes proportional.",
  "Prefer images for real users.",
  "Use initials when images are not available.",
  "Indicate status when it adds value."
];

export default function DSAvatarsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  const rahulImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80";
  const nehaImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80";
  const rohitImage = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80";

  const handleCopyCode = () => {
    const code = `<div class="avatar-group">
  <img class="avatar avatar-md" src="user1.jpg" alt="User 1" />
  <img class="avatar avatar-md" src="user2.jpg" alt="User 2" />
  <div class="avatar avatar-md avatar-initials">RS</div>
  <div class="avatar avatar-md avatar-more">+3</div>
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS4 – AVATARS</h1>
            <div className="w-6 h-6 rounded-full border border-indigo-650 text-indigo-650 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Avatars represent users or entities and help create a personal and visual connection.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search components...     ⌘ K" 
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
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
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

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Area */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* KPI Row */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 block">6</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Avatar Types</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">rule</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 block">7</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Variants</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">stay_current_portrait</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 block">100%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Responsive</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">accessibility_new</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 block">AA</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Accessible</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">keyboard</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 block">100%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Keyboard Friendly</span>
              </div>
            </div>
          </section>

          {/* Avatar Types Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Avatar Types</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Different avatar types serve different use cases.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
              
              {/* Image */}
              <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/20">
                <h5 className="text-xs font-bold text-slate-900 w-full text-left">Image</h5>
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                  <img src={rahulImage} alt="Rahul Sharma" className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">Uses a user image.</p>
              </div>

              {/* Icon */}
              <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/20">
                <h5 className="text-xs font-bold text-slate-900 w-full text-left">Icon</h5>
                <div className="w-16 h-16 rounded-full bg-indigo-650 text-white flex items-center justify-center shadow-sm">
                  <User className="w-7 h-7" />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">Uses a generic icon.</p>
              </div>

              {/* Initials */}
              <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/20">
                <h5 className="text-xs font-bold text-slate-900 w-full text-left">Initials</h5>
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                  RS
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">Shows user initials.</p>
              </div>

              {/* Bot */}
              <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/20">
                <h5 className="text-xs font-bold text-slate-900 w-full text-left">Bot</h5>
                <div className="w-16 h-16 rounded-full bg-[#EBF4FF] text-blue-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-7 h-7" />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">Represents a bot or system.</p>
              </div>

              {/* Group */}
              <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/20">
                <h5 className="text-xs font-bold text-slate-900 w-full text-left">Group</h5>
                <div className="flex -space-x-3 items-center h-16">
                  <img src={rahulImage} alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src={nehaImage} alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src={rohitImage} alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-[10px] border-2 border-white shadow-sm">+3</div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">Shows multiple avatars.</p>
              </div>

              {/* Placeholder */}
              <div className="border border-slate-200 rounded-xl p-4.5 flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-50/20">
                <h5 className="text-xs font-bold text-slate-900 w-full text-left">Placeholder</h5>
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shadow-sm">
                  <User className="w-8 h-8 text-slate-350" />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">Fallback when no data.</p>
              </div>

            </div>
          </section>

          {/* Variants Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Variants</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Avatars come in different sizes and shapes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Sizes Subsection */}
              <div className="border border-slate-150 rounded-xl p-5 bg-[#FCFCFC]/50">
                <h4 className="text-xs font-bold text-slate-700 mb-6">Sizes</h4>
                
                <div className="flex gap-4 items-end justify-between flex-wrap min-h-[140px]">
                  
                  {/* XS */}
                  <div className="flex flex-col items-center gap-2">
                    <img src={rahulImage} alt="XS" className="w-4 h-4 rounded-full object-cover shadow-sm" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800">XS</div>
                      <div className="text-[9px] text-slate-400">16px</div>
                    </div>
                  </div>

                  {/* S */}
                  <div className="flex flex-col items-center gap-2">
                    <img src={rahulImage} alt="S" className="w-6 h-6 rounded-full object-cover shadow-sm" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800">S</div>
                      <div className="text-[9px] text-slate-400">24px</div>
                    </div>
                  </div>

                  {/* M */}
                  <div className="flex flex-col items-center gap-2">
                    <img src={rahulImage} alt="M" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800">M</div>
                      <div className="text-[9px] text-slate-400">32px</div>
                    </div>
                  </div>

                  {/* L */}
                  <div className="flex flex-col items-center gap-2">
                    <img src={rahulImage} alt="L" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800">L</div>
                      <div className="text-[9px] text-slate-400">48px</div>
                    </div>
                  </div>

                  {/* XL */}
                  <div className="flex flex-col items-center gap-2">
                    <img src={rahulImage} alt="XL" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800">XL</div>
                      <div className="text-[9px] text-slate-400">64px</div>
                    </div>
                  </div>

                  {/* 2XL */}
                  <div className="flex flex-col items-center gap-2">
                    <img src={rahulImage} alt="2XL" className="w-24 h-24 rounded-full object-cover shadow-sm" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-800">2XL</div>
                      <div className="text-[9px] text-slate-400">96px</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Shapes Subsection */}
              <div className="border border-slate-150 rounded-xl p-5 bg-[#FCFCFC]/50">
                <h4 className="text-xs font-bold text-slate-700 mb-6">Shapes</h4>
                
                <div className="flex gap-8 items-center justify-around min-h-[140px]">
                  
                  {/* Circle */}
                  <div className="flex flex-col items-center gap-2.5">
                    <img src={rahulImage} alt="Circle" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200" />
                    <span className="text-xs font-bold text-slate-800">Circle</span>
                  </div>

                  {/* Rounded */}
                  <div className="flex flex-col items-center gap-2.5">
                    <img src={rahulImage} alt="Rounded" className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-200" />
                    <span className="text-xs font-bold text-slate-800">Rounded</span>
                  </div>

                  {/* Square */}
                  <div className="flex flex-col items-center gap-2.5">
                    <img src={rahulImage} alt="Square" className="w-16 h-16 rounded-none object-cover shadow-sm border border-slate-200" />
                    <span className="text-xs font-bold text-slate-800">Square</span>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Status Indicators & Avatar with Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Status Indicators */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status Indicators</h3>
                <p className="text-xs text-slate-400 mt-1">Use status indicators to show availability.</p>
              </div>
              
              <div className="grid grid-cols-5 gap-2 pt-2 items-center justify-items-center">
                {/* Online */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">Online</div>
                    <div className="text-[9px] text-slate-400">Available</div>
                  </div>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">Away</div>
                    <div className="text-[9px] text-slate-400">Away</div>
                  </div>
                </div>

                {/* Busy */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-550 border-2 border-white shadow-sm" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">Busy</div>
                    <div className="text-[9px] text-slate-400">Busy</div>
                  </div>
                </div>

                {/* Offline */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-slate-350 border-2 border-white shadow-sm" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">Offline</div>
                    <div className="text-[9px] text-slate-400">Offline</div>
                  </div>
                </div>

                {/* Do Not Disturb */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-650 border-2 border-white flex items-center justify-center text-white text-[8px] font-extrabold shadow-sm leading-none">-</span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-850 whitespace-nowrap">Do Not Disturb</div>
                    <div className="text-[9px] text-slate-400">Do not disturb</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Avatar with Badges */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Avatar with Badges</h3>
                <p className="text-xs text-slate-400 mt-1">Badges can be used to show notifications or roles.</p>
              </div>
              
              <div className="grid grid-cols-4 gap-4 pt-2 items-center justify-items-center">
                
                {/* Notifications */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-indigo-650 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-sm">5</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                </div>

                {/* Premium User */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Premium User</span>
                </div>

                {/* Verified */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3px]" />
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Verified</span>
                </div>

                {/* Admin */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="relative">
                    <img src={rahulImage} alt="user" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow-sm">
                      <Crown className="w-2.5 h-2.5 fill-current" />
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Admin</span>
                </div>

              </div>
            </section>

          </div>

          {/* Bottom Info Banner */}
          <div className="bg-[#EBF5FF] border border-blue-150 rounded-xl p-4.5 flex gap-3.5 items-start">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-750 font-semibold leading-relaxed">
              Choose the right avatar type and size for clarity and context.
            </p>
          </div>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Avatar Guidelines</h4>
            <ul className="space-y-3">
              {GUIDELINES.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-emerald-500 font-bold block mt-0.5">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Accessibility</h4>
            <ul className="space-y-3">
              {ACCESSIBILITY_ITEMS.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-normal">
                  <span className="material-symbols-outlined text-[16px] text-indigo-500 block mt-0.5">radio_button_checked</span>
                  <span>{item}</span>
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
                className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-700 text-white rounded text-[10px] font-bold shadow-sm transition-colors border-none"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#0b0f19] text-[#a9b2c3] p-3.5 rounded-lg text-[10px] font-mono overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
{`<div class="avatar-group">
  <img class="avatar avatar-md" src="user1.jpg" alt="User 1" />
  <img class="avatar avatar-md" src="user2.jpg" alt="User 2" />
  <div class="avatar avatar-md avatar-initials">RS</div>
  <div class="avatar avatar-md avatar-more">+3</div>
</div>`}
            </pre>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Best Practices</h4>
            <ul className="space-y-3">
              {BEST_PRACTICES.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-normal">
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

