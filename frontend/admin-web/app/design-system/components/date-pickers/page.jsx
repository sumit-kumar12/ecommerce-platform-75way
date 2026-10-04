"use client";

import React, { useState } from "react";
import { 
  Search, Calendar, Clock, X, Download, Info, Check, 
  AlertTriangle, CheckCircle2, Lock, ArrowRight, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";

const TABS = ["Overview", "Single Date", "Date Range", "Date & Time", "Month & Year", "States", "Sizes", "Validation", "Best Practices"];

const GUIDELINES = [
  { label: "Use date picker for precise date selection.", ok: true },
  { label: "Use date range for start and end dates.", ok: true },
  { label: "Display clear format (e.g., DD / MM / YYYY).", ok: true },
  { label: "Always show selected values clearly.", ok: true },
  { label: "Support keyboard navigation.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Keyboard navigable (Tab, Arrow keys, Enter, Esc).", ok: true },
  { label: "Screen reader friendly with ARIA roles.", ok: true },
  { label: "Sufficient color contrast.", ok: true },
  { label: "Focus indicators on all interactive elements.", ok: true }
];

export default function DSDatePickersPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Interactive States
  const [singleDate, setSingleDate] = useState("15 May 2024");
  const [rangeStart, setRangeStart] = useState("01 May 2024");
  const [rangeEnd, setRangeEnd] = useState("15 May 2024");
  const [timeVal, setTimeVal] = useState("10:30 AM");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);

  // Time picker math hands
  const getClockRotation = () => {
    // 10:30 hands rotation
    return {
      hour: 315, // 10.5 * 30 deg
      minute: 180 // 30 * 6 deg
    };
  };

  const handleCopyCode = () => {
    const code = `<div class="date-picker">
  <label for="date">Select Date</label>
  <input type="date" id="date" placeholder="DD / MM / YYYY" />
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS2 – DATE PICKERS</h1>
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Date pickers help users select dates, date ranges and times.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search date pickers..." 
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
          <span>Export Date Pickers</span>
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Columns */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">calendar_today</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Types</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Types</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">rule</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">States</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 States</span>
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

          {/* Single Date Picker Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Single Date Picker</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
              
              {/* Inputs Group Column */}
              <div className="space-y-6">
                
                {/* Default */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      placeholder="Select date" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* With Label */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-slate-700">Start Date <span className="text-red-500">*</span></label>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      placeholder="Select date" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Placeholder */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Placeholder</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="DD / MM / YYYY" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

              </div>

              {/* Calendar Open Popover */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Calendar Open</label>
                <div className="border border-slate-200 rounded-xl shadow-lg bg-white overflow-hidden p-4 max-w-[280px] mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800">May 2024</span>
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                      <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-medium text-slate-700">
                    {/* Previous Month Days */}
                    {["28", "29", "30"].map(d => (
                      <span key={`prev-${d}`} className="text-slate-300 py-1">{d}</span>
                    ))}
                    {/* Current Month Days */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                      const isSelected = d === 15;
                      return (
                        <button 
                          key={d} 
                          className={`py-1 rounded-full w-7 h-7 mx-auto flex items-center justify-center transition-all ${
                            isSelected 
                              ? "bg-indigo-600 text-white font-bold shadow-sm" 
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Today</button>
                  </div>
                </div>
              </div>

              {/* Hovered Date Calendar */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hovered Date</label>
                <div className="border border-slate-200 rounded-xl shadow-lg bg-white overflow-hidden p-4 max-w-[280px] mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800">May 2024</span>
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                      <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-medium text-slate-700">
                    {/* Previous Month Days */}
                    {["28", "29", "30"].map(d => (
                      <span key={`prev-h-${d}`} className="text-slate-300 py-1">{d}</span>
                    ))}
                    {/* Current Month Days */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                      const isHovered = d === 15;
                      return (
                        <button 
                          key={d} 
                          className={`py-1 rounded-full w-7 h-7 mx-auto flex items-center justify-center transition-all ${
                            isHovered 
                              ? "bg-indigo-50 border border-indigo-300 text-indigo-700 font-bold" 
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-750">Today</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Split states row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100">
              
              {/* Selected Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Selected Date</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="15 May 2024" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-indigo-500 ring-2 ring-indigo-500/20 rounded-lg text-sm text-slate-900 font-medium outline-none"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-500" />
                </div>
              </div>

              {/* Read Only */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Read Only</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="15 May 2024" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-650"
                  />
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Disabled Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled Date</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="15 May 2024" 
                    disabled
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                </div>
              </div>

              {/* Clear Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Clear Date</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="15 May 2024" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Error State */}
              <div className="space-y-1.5 xl:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase text-red-500">Error State</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="Select date" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-red-500 ring-2 ring-red-500/20 rounded-lg text-sm text-red-950"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-red-650 block mt-1">Please select a valid date</span>
              </div>

            </div>
          </section>

          {/* Date Range Picker Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Date Range Picker</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              
              {/* Default Preview */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm shadow-sm">
                    <span className="text-slate-700 font-semibold">01 May 2024</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 font-semibold">15 May 2024</span>
                    <Calendar className="w-4.5 h-4.5 text-slate-400 ml-auto" />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-xs text-slate-500 leading-normal">
                  Clicking the input wrapper toggles the dual calendar popover shown on the right, allowing start and end date select in one view.
                </div>
              </div>

              {/* Calendar Open Popover */}
              <div className="xl:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Calendar Open</label>
                <div className="border border-slate-200 rounded-xl shadow-lg bg-white p-4 max-w-[560px] mx-auto flex flex-col sm:flex-row gap-6">
                  
                  {/* Month 1: May 2024 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-800">May 2024</span>
                      <span className="w-6 h-6"></span> {/* Spacer */}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                        <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-slate-700">
                      {["28", "29", "30"].map(d => (
                        <span key={`range-prev-${d}`} className="text-slate-350 py-1">{d}</span>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                        const isStart = d === 1;
                        const isEnd = d === 15;
                        const inRange = d > 1 && d < 15;
                        return (
                          <div 
                            key={`m1-${d}`} 
                            className={`py-1 flex items-center justify-center ${
                              inRange ? "bg-indigo-50/60" : ""
                            } ${isStart ? "rounded-l-full bg-indigo-50/60" : ""} ${
                              isEnd ? "rounded-r-full bg-indigo-50/60" : ""
                            }`}
                          >
                            <button 
                              className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                                isStart || isEnd 
                                  ? "bg-indigo-600 text-white font-bold shadow-sm" 
                                  : "text-slate-700 hover:bg-slate-150"
                              }`}
                            >
                              {d}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Month 2: Jun 2024 */}
                  <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-6 h-6"></span> {/* Spacer */}
                      <span className="text-xs font-bold text-slate-800">Jun 2024</span>
                      <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                        <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-slate-700">
                      {/* Starts on Saturday */}
                      {["26", "27", "28", "29", "30", "31"].map(d => (
                        <span key={`range-prev-j-${d}`} className="text-slate-350 py-1">{d}</span>
                      ))}
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                        <button key={`m2-${d}`} className="py-1 rounded-full w-7 h-7 mx-auto flex items-center justify-center hover:bg-slate-100">
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Date & Time Picker + Month Year Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Date & Time Picker */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Date & Time Picker</h3>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                
                <div className="flex-1 space-y-4 w-full">
                  {/* Date Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value="15 May 2024" 
                        readOnly
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Time Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Time</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value="10 : 30 AM" 
                        readOnly
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium"
                      />
                      <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Select Time list */}
                  <div className="border border-slate-200 rounded-lg shadow-md p-2 bg-white max-h-[170px] overflow-y-auto space-y-1 text-xs">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">Select Time</div>
                    {["08:00 AM", "09:15 AM", "10:30 AM", "11:45 AM", "12:00 PM", "01:15 PM"].map(time => (
                      <div 
                        key={time} 
                        className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                          time === "10:30 AM" 
                            ? "bg-indigo-50 text-indigo-750 font-bold" 
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clock Select dial widget */}
                <div className="border border-slate-200 rounded-xl shadow-lg bg-white p-5 flex flex-col items-center max-w-[260px] mx-auto shrink-0 w-full sm:w-auto">
                  <div className="relative w-40 h-40 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center mb-4">
                    {/* Clock numbers */}
                    <span className="absolute top-2 text-xs font-bold text-slate-650">12</span>
                    <span className="absolute right-2 text-xs font-bold text-slate-650">3</span>
                    <span className="absolute bottom-2 text-xs font-bold text-slate-650">6</span>
                    <span className="absolute left-2 text-xs font-bold text-slate-650">9</span>
                    
                    {/* Hour Hand */}
                    <div 
                      className="absolute w-1 bg-slate-800 rounded-full origin-bottom"
                      style={{ 
                        height: "36px", 
                        transform: `rotate(${getClockRotation().hour}deg)`,
                        top: "44px",
                        left: "78px"
                      }}
                    ></div>
                    
                    {/* Minute Hand */}
                    <div 
                      className="absolute w-0.5 bg-indigo-650 rounded-full origin-bottom"
                      style={{ 
                        height: "52px", 
                        transform: `rotate(${getClockRotation().minute}deg)`,
                        top: "28px",
                        left: "79px"
                      }}
                    ></div>

                    {/* Clock center pin */}
                    <span className="absolute w-2 h-2 bg-indigo-600 rounded-full border-2 border-white shadow"></span>
                  </div>

                  {/* AM/PM switcher */}
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-0.5">
                    <button className="px-4 py-1 rounded bg-indigo-600 text-white text-xs font-bold shadow-sm">AM</button>
                    <button className="px-4 py-1 text-slate-500 text-xs font-semibold hover:text-slate-800 transition-colors">PM</button>
                  </div>
                </div>

              </div>
            </div>

            {/* Month & Year Picker */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Month & Year Picker</h3>
              
              {/* Month picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Month Picker</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="May 2024" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
                </div>
              </div>

              {/* Year picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Year Picker</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="2024" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium"
                  />
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 pointer-events-none" />
                </div>
              </div>

              {/* Month & Year Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Month & Year Picker</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="May 2024" 
                    readOnly
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
                </div>
              </div>
            </div>

          </section>

          {/* Picker States */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Picker States</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Default */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <div className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 flex justify-between items-center cursor-pointer">
                  <span>Select date</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Hover */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hover</label>
                <div className="px-3.5 py-2.5 bg-white border border-slate-350 rounded-lg text-sm text-slate-500 flex justify-between items-center cursor-pointer">
                  <span>Select date</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Focus */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Focus</label>
                <div className="px-3.5 py-2.5 bg-white border border-indigo-500 ring-2 ring-indigo-500/25 rounded-lg text-sm text-slate-500 flex justify-between items-center cursor-pointer">
                  <span>Select date</span>
                  <Calendar className="w-4 h-4 text-indigo-500" />
                </div>
              </div>

              {/* Selected */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Selected</label>
                <div className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-semibold flex justify-between items-center cursor-pointer">
                  <span>15 May 2024</span>
                  <Calendar className="w-4 h-4 text-indigo-500" />
                </div>
              </div>

              {/* Disabled */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 flex justify-between items-center cursor-not-allowed">
                  <span>Select date</span>
                  <Calendar className="w-4 h-4 text-slate-300" />
                </div>
              </div>

              {/* Read Only */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Read Only</label>
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-650 flex justify-between items-center">
                  <span>15 May 2024</span>
                  <Lock className="w-4 h-4 text-slate-455" />
                </div>
              </div>

              {/* Error */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Error</label>
                <div className="px-3.5 py-2.5 bg-white border border-red-500 rounded-lg text-sm text-red-950 flex justify-between items-center cursor-pointer">
                  <span>Select date</span>
                  <Calendar className="w-4 h-4 text-red-500" />
                </div>
              </div>

              {/* Success */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Success</label>
                <div className="px-3.5 py-2.5 bg-white border border-emerald-500 rounded-lg text-sm text-slate-900 font-semibold flex justify-between items-center cursor-pointer">
                  <span>15 May 2024</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar panel */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Usage guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Date Picker Guidelines</h3>
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
{`<div class="date-picker">
  <label for="date">Select Date</label>
  <input type="date" id="date" placeholder="DD / MM / YYYY" />
</div>`}
            </pre>
          </div>

          {/* When to use list */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">When to use</h3>
            <div className="space-y-3">
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-650 leading-normal">
                  <strong className="text-slate-800">Single Date:</strong> For a single day selection.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-655 leading-normal">
                  <strong className="text-slate-800">Date Range:</strong> For start and end date selection.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-660 leading-normal">
                  <strong className="text-slate-800">Date & Time:</strong> When both date and time are required.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-670 leading-normal">
                  <strong className="text-slate-800">Month & Year:</strong> For selecting month and year.
                </span>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
