"use client";

import React, { useState } from "react";
import { 
  Search, User, ChevronDown, ChevronUp, X, Download, Info, Check, 
  AlertCircle, ShieldAlert, CheckCircle2, UserCheck, Settings, Users
} from "lucide-react";

const TABS = ["Overview", "Variants", "States", "Sizes", "Dropdown Menus", "Grouping", "Best Practices"];

const USAGE_GUIDELINES = [
  { label: "Use dropdowns when users must select a single option from a list.", ok: true },
  { label: "Use multi-select for selecting multiple values.", ok: true },
  { label: "Keep option lists short and scannable.", ok: true },
  { label: "Use search for long lists (10+ options).", ok: true },
  { label: "Provide clear labels and placeholder text.", ok: true }
];

const ACCESSIBILITY_GUIDELINES = [
  { label: "Ensure proper label association.", ok: true },
  { label: "Use keyboard navigation (Arrow keys, Enter, Esc).", ok: true },
  { label: "Support screen readers with ARIA roles.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true }
];

export default function DSDropdownsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Interactive States
  const [selectedDefault, setSelectedDefault] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrouped, setSelectedGrouped] = useState("");
  const [selectedSize, setSelectedSize] = useState("Medium");
  
  // Multi Select States
  const [selectedFruit, setSelectedFruit] = useState(["Apple", "Banana"]);
  
  // Active Interactive Dropdowns (Open/Closed)
  const [openDropdown, setOpenDropdown] = useState(null); // 'default', 'user', 'searchable', 'multi', 'grouped'

  const toggleFruit = (fruit) => {
    if (selectedFruit.includes(fruit)) {
      setSelectedFruit(selectedFruit.filter(f => f !== fruit));
    } else {
      setSelectedFruit([...selectedFruit, fruit]);
    }
  };

  const users = [
    { name: "Rahul Sharma", initial: "RS", color: "bg-indigo-600" },
    { name: "Priya Singh", initial: "PS", color: "bg-emerald-600" },
    { name: "Amit Verma", initial: "AV", color: "bg-amber-600" },
    { name: "Neha Gupta", initial: "NG", color: "bg-rose-600" }
  ];

  const fruits = ["Apple", "Banana", "Orange", "Grapes"];

  const handleCopyCode = () => {
    const code = `<div class="dropdown">
  <label for="country">Country</label>
  <select id="country" name="country">
    <option value="" disabled selected>Select a country</option>
    <option value="in">India</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </select>
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS2 – DROPDOWNS</h1>
          <p className="text-sm text-slate-500 mt-1">Dropdowns help users select a value from a list of options.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search dropdowns..." 
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
          <span>Export Dropdowns</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left main block */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">list_alt</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">swap_horiz</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">States</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">5 States</span>
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
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <span className="material-symbols-outlined text-[24px] block">code</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accessible</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">100%</span>
              </div>
            </div>
          </section>

          {/* Dropdown Variants Spec Box */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Dropdown Variants</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              
              {/* Default Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <div className="relative">
                  <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors">
                    <span className="text-slate-500">Select an option</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  {/* Open State Menu Preview */}
                  <div className="mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-15">
                    {["Option 1", "Option 2", "Option 3", "Option 4"].map(opt => (
                      <div key={opt} className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* With Icon Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">With Icon</label>
                <div className="relative">
                  <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Select user</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  {/* Open State Menu Preview */}
                  <div className="mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-15">
                    {users.map(user => (
                      <div key={user.name} className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2.5 transition-colors">
                        <div className={`w-5 h-5 rounded-full ${user.color} text-white flex items-center justify-center font-bold text-[9px]`}>
                          {user.initial}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Searchable Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Searchable</label>
                <div className="relative">
                  <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors">
                    <span className="text-slate-400">Search...</span>
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  {/* Open State Menu Preview */}
                  <div className="mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden p-2 space-y-1 z-15">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search options..."
                        readOnly
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none"
                      />
                    </div>
                    <div className="max-h-36 overflow-y-auto pt-1">
                      {fruits.map(opt => (
                        <div key={opt} className="px-2 py-1.5 rounded text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi Select Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Multi Select</label>
                <div className="relative">
                  <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors">
                    <span className="text-slate-500">Select options</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  {/* Open State Menu Preview */}
                  <div className="mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-15">
                    {["Option 1", "Option 2", "Option 3", "Option 4"].map((opt, idx) => (
                      <div key={opt} className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2.5 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={idx < 2} 
                          readOnly 
                          className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grouped Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Grouped</label>
                <div className="relative">
                  <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors">
                    <span className="text-slate-500">Select option</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  {/* Open State Menu Preview */}
                  <div className="mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-2 space-y-2 z-15">
                    <div>
                      <div className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fruits</div>
                      <div className="px-5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">Apple</div>
                      <div className="px-5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">Banana</div>
                    </div>
                    <div>
                      <div className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vegetables</div>
                      <div className="px-5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">Carrot</div>
                      <div className="px-5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">Broccoli</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disabled Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <div className="relative opacity-60 pointer-events-none">
                  <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-not-allowed text-slate-400">
                    <span>Disabled</span>
                    <ChevronDown className="w-4 h-4 text-slate-300" />
                  </div>
                  {/* Open State Menu Preview */}
                  <div className="mt-1.5 border border-slate-200 rounded-lg shadow-md bg-white overflow-hidden py-1">
                    {["Option 1", "Option 2", "Option 3"].map(opt => (
                      <div key={opt} className="px-3.5 py-2 text-sm text-slate-350">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Dropdown States Box */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Dropdown States</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              
              {/* Default State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                  <span className="text-slate-500">Select an option</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Hover State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hover</label>
                <div className="w-full px-3.5 py-2.5 bg-white border border-slate-350 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer">
                  <span className="text-slate-500">Select an option</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Focus State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Focus</label>
                <div className="w-full px-3.5 py-2.5 bg-white border border-indigo-500 ring-2 ring-indigo-500/25 rounded-lg text-sm flex items-center justify-between cursor-pointer outline-none">
                  <span className="text-slate-500">Select an option</span>
                  <ChevronDown className="w-4 h-4 text-indigo-500" />
                </div>
              </div>

              {/* Open State */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Open</label>
                <div className="w-full px-3.5 py-2.5 bg-white border border-indigo-500 rounded-lg text-sm flex items-center justify-between cursor-pointer">
                  <span className="text-slate-500">Select an option</span>
                  <ChevronUp className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="absolute top-full left-0 w-full mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-10">
                  <div className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">Option 1</div>
                  <div className="px-3.5 py-2 text-sm text-indigo-600 bg-indigo-50/70 font-semibold cursor-pointer">Option 2</div>
                  <div className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">Option 3</div>
                </div>
              </div>

              {/* Selected State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Selected</label>
                <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors">
                  <span className="text-slate-900 font-medium">Option 2</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Disabled State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm flex items-center justify-between text-slate-400 cursor-not-allowed">
                  <span>Disabled</span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </div>
              </div>

              {/* Error State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Error</label>
                <div className="w-full px-3.5 py-2.5 bg-white border border-red-500 ring-2 ring-red-500/20 rounded-lg text-sm flex items-center justify-between cursor-pointer text-red-950">
                  <span>Select an option</span>
                  <ChevronDown className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-red-600 block mt-1">Please select a valid option</span>
              </div>

            </div>
          </section>

          {/* Sizes & Multi-select Selected Values Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sizes Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Dropdown Sizes</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Small</label>
                  <div className="w-56 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs flex items-center justify-between cursor-pointer hover:border-slate-350 shadow-sm transition-colors">
                    <span className="text-slate-500">Small</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Medium (Default)</label>
                  <div className="w-64 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between cursor-pointer hover:border-slate-350 shadow-sm transition-colors">
                    <span className="text-slate-500">Medium</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Large</label>
                  <div className="w-72 px-4 py-3 bg-white border border-slate-200 rounded-lg text-base flex items-center justify-between cursor-pointer hover:border-slate-350 shadow-sm transition-colors">
                    <span className="text-slate-500">Large</span>
                    <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Multi Select Selected Values */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Multi Select (Selected Values)</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Selected Values</label>
                  <div className="w-full min-h-[44px] p-1.5 border border-slate-200 rounded-lg bg-white flex flex-wrap gap-1.5 items-center justify-between cursor-pointer hover:border-slate-350 shadow-sm transition-colors">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFruit.map(f => (
                        <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors">
                          {f}
                          <X 
                            className="w-3 h-3 text-slate-450 hover:text-slate-800 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFruit(f);
                            }}
                          />
                        </span>
                      ))}
                      {selectedFruit.length === 0 && (
                        <span className="text-sm text-slate-400 pl-2">Select fruits...</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 pr-1 border-none bg-transparent">
                      {selectedFruit.length > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFruit([]);
                          }} 
                          className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg text-xs text-slate-500 leading-normal mt-4">
                Selected options are rendered as inline badges within the select area. Clicking the check badge remove button removes the item from selection.
              </div>
            </div>

          </section>

          {/* Interactive Playground Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Interactive Playground</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Interactive Showcase */}
              <div className="space-y-6">
                
                {/* Default select */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600">Standard Select</label>
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'default' ? null : 'default')}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors"
                  >
                    <span className={selectedDefault ? "text-slate-900 font-medium" : "text-slate-500"}>
                      {selectedDefault || "Select an option..."}
                    </span>
                    {openDropdown === 'default' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                  {openDropdown === 'default' && (
                    <div className="absolute top-full left-0 w-full mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-30">
                      {["Option 1", "Option 2", "Option 3", "Option 4"].map(opt => (
                        <div 
                          key={opt} 
                          onClick={() => {
                            setSelectedDefault(opt);
                            setOpenDropdown(null);
                          }}
                          className={`px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between ${selectedDefault === opt ? 'bg-indigo-50/50 font-semibold text-indigo-600' : ''}`}
                        >
                          <span>{opt}</span>
                          {selectedDefault === opt && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Select */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600">User Select</label>
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 transition-colors"
                  >
                    {selectedUser ? (
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full ${users.find(u => u.name === selectedUser)?.color || 'bg-slate-400'} text-white flex items-center justify-center font-bold text-[9px]`}>
                          {users.find(u => u.name === selectedUser)?.initial || "U"}
                        </div>
                        <span className="text-slate-900 font-medium">{selectedUser}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Select user...</span>
                      </div>
                    )}
                    {openDropdown === 'user' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                  {openDropdown === 'user' && (
                    <div className="absolute top-full left-0 w-full mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-30">
                      {users.map(user => (
                        <div 
                          key={user.name} 
                          onClick={() => {
                            setSelectedUser(user.name);
                            setOpenDropdown(null);
                          }}
                          className={`px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between ${selectedUser === user.name ? 'bg-indigo-50/50 font-semibold text-indigo-600' : ''}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-5 h-5 rounded-full ${user.color} text-white flex items-center justify-center font-bold text-[9px]`}>
                              {user.initial}
                            </div>
                            <span>{user.name}</span>
                          </div>
                          {selectedUser === user.name && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fruit Multi-select */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600">Fruits Multi-select</label>
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'multi' ? null : 'multi')}
                    className="w-full min-h-[44px] p-1.5 border border-slate-200 rounded-lg bg-white flex flex-wrap gap-1.5 items-center justify-between cursor-pointer hover:border-slate-350 shadow-sm transition-colors"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFruit.map(f => (
                        <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 text-xs font-semibold text-indigo-700 border border-indigo-150 transition-colors">
                          {f}
                          <X 
                            className="w-3.5 h-3.5 text-indigo-400 hover:text-indigo-850 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFruit(f);
                            }}
                          />
                        </span>
                      ))}
                      {selectedFruit.length === 0 && (
                        <span className="text-sm text-slate-400 pl-2">Select fruits...</span>
                      )}
                    </div>
                    {openDropdown === 'multi' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                  {openDropdown === 'multi' && (
                    <div className="absolute top-full left-0 w-full mt-1.5 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden py-1 z-30">
                      {fruits.map(opt => {
                        const isChecked = selectedFruit.includes(opt);
                        return (
                          <div 
                            key={opt} 
                            onClick={() => toggleFruit(opt)}
                            className="px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2.5 transition-colors"
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className={isChecked ? 'font-semibold text-slate-900' : ''}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Code output area */}
              <div className="flex flex-col justify-between bg-slate-900 text-slate-350 p-5 rounded-xl font-mono text-xs leading-relaxed space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Live Selected Data</div>
                  <pre className="text-indigo-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {JSON.stringify({
                      standardSelect: selectedDefault || null,
                      userSelect: selectedUser || null,
                      fruitsMultiSelect: selectedFruit,
                    }, null, 2)}
                  </pre>
                </div>
                <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-800 pt-3">
                  This state display shows the selected values from the interactive playground. The inputs update dynamically as the user interacts with the elements.
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar panel */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          
          {/* Usage guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Usage Guidelines</h3>
            <div className="space-y-3">
              {USAGE_GUIDELINES.map(g => (
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
              {ACCESSIBILITY_GUIDELINES.map(g => (
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
{`<div class="dropdown">
  <label for="country">Country</label>
  <select id="country" name="country">
    <option value="" disabled selected>Select a country</option>
    <option value="in">India</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </select>
</div>`}
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
                Use dropdowns for selecting a single value from a list such as country, category, status, or user.
              </span>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
