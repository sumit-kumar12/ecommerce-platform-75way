"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, ChevronLeft, ChevronRight, Home,
  Package, ShoppingCart, User, BarChart2, Settings, Link2, Menu, Bell,
  ChevronDown, HelpCircle, Mail, Sparkles, Smartphone, CheckCircle2
} from "lucide-react";

const TABS = ["Overview", "Navigation Bars", "Tabs", "Breadcrumbs", "Side Navigation", "Pagination", "Steppers", "Best Practices"];

const GUIDELINES = [
  { label: "Keep navigation clear and consistent." },
  { label: "Use descriptive labels and icons." },
  { label: "Highlight the current location." },
  { label: "Group related items together." },
  { label: "Avoid more than 7 items in a row." }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use semantic HTML for navigation." },
  { label: "Ensure sufficient color contrast." },
  { label: "Provide focus states for all items." },
  { label: "Support keyboard navigation." },
  { label: "Use aria-current for active states." }
];

const CODE_EXAMPLE_HTML = `<nav class="top-nav" role="navigation">
  <div class="nav-left">
    <a href="/" class="logo">KATABAZAAR</a>
  </div>
  <ul class="nav-menu">
    <li>
      <a href="/dashboard" class="active" aria-current="page">
        Dashboard
      </a>
    </li>
    <li><a href="/products">Products</a></li>
    <li><a href="/orders">Orders</a></li>
    <li><a href="/reports">Reports</a></li>
  </ul>
</nav>`;

export default function DSNavigationPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Interactive states
  const [activeTopTab, setActiveTopTab] = useState("Dashboard");
  const [activeSecondaryTab, setActiveSecondaryTab] = useState("Overview");
  const [activeHorizontalTab, setActiveHorizontalTab] = useState("All");
  const [activeIconTab, setActiveIconTab] = useState("Home");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Dashboard");
  const [stepperStep, setStepperStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1120] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 z-50 animate-bounce">
          <Info className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DS3 – NAVIGATION</h1>
            <span className="material-symbols-outlined text-[28px] text-indigo-650 font-bold bg-indigo-50 p-1.5 rounded-lg">explore</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Navigation components help users move through content and complete tasks efficiently.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search components..." 
              className="w-full pl-9 pr-14 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-700"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              ⌘ K
            </span>
          </div>

          {/* Theme, notification, and profile */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[20px] block">light_mode</span>
            </button>
            <div className="relative">
              <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[20px] block">notifications</span>
              </button>
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                RS
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">Rahul Sharma</div>
                <div className="text-[10px] text-slate-400 font-medium">Design System</div>
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
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-650' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold px-4 py-2.5 shadow-md hover:shadow-lg transition-all border-none">
          <Download className="w-4 h-4" />
          <span>Export Assets</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Columns */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Metrics summary */}
          {(activeTab === "Overview" || activeTab === "Best Practices") && (
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">explore</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">6</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Navigation Types</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">tune</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">5</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Sizes & Variants</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">100%</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Responsive</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">universal_access</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">AA</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Accessible</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">keyboard</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">100%</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Keyboard Friendly</span>
                </div>
              </div>
            </section>
          )}

          {/* NAVIGATION BARS Section */}
          {(activeTab === "Overview" || activeTab === "Navigation Bars") && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation Bars</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* 1. Top Navigation Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Top Navigation Bar</span>
                  
                  {/* Real Nav bar element */}
                  <div className="border border-slate-150 rounded-xl p-3 flex items-center justify-between bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <button className="p-1 hover:bg-slate-50 text-slate-600 rounded border-none bg-transparent">
                        <Menu className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-6 h-6 rounded bg-indigo-650 text-white flex items-center justify-center font-bold text-xs">K</div>
                        <span className="text-xs font-black tracking-wider text-slate-900">KATABAZAAR</span>
                      </div>

                      {/* Menu links */}
                      <div className="hidden md:flex items-center gap-1.5 pl-6 border-l border-slate-150 text-xs font-semibold text-slate-600">
                        {["Dashboard", "Products", "Orders", "Customers", "Reports"].map(tab => {
                          const isActive = activeTopTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => {
                                setActiveTopTab(tab);
                                triggerToast(`Navigated to ${tab}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                                isActive ? 'bg-indigo-50 text-indigo-650 font-bold' : 'hover:bg-slate-50'
                              }`}
                            >
                              <span>{tab}</span>
                              {tab === "Products" && <ChevronDown className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-slate-400" />
                      <div className="relative">
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                        RS
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Secondary Navigation Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Secondary Navigation Bar</span>
                  
                  <div className="border border-slate-150 rounded-xl p-3 flex items-center bg-white shadow-sm overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      {["Overview", "Analytics", "Settings", "Members", "Activity", "Integrations"].map(tab => {
                        const isActive = activeSecondaryTab === tab;
                        return (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveSecondaryTab(tab);
                              triggerToast(`Viewed: ${tab}`);
                            }}
                            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
                              isActive ? 'border-indigo-600 text-indigo-650 font-bold' : 'border-transparent hover:text-slate-700'
                            }`}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TABS & BREADCRUMBS CONTAINER */}
          {(activeTab === "Overview" || activeTab === "Tabs" || activeTab === "Breadcrumbs") && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Tabs Showcase */}
              {(activeTab === "Overview" || activeTab === "Tabs") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Tabs</h3>
                  
                  {/* Standard Tabs row */}
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Standard Tabs</span>
                    <div className="border border-slate-150 rounded-xl p-2 bg-white flex flex-wrap items-center justify-between shadow-sm gap-2">
                      <div className="flex border-b border-slate-100 text-xs font-semibold text-slate-500">
                        {["All", "Active", "Draft", "Scheduled", "Completed", "Archived"].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveHorizontalTab(tab)}
                            className={`px-3 py-1.5 border-b-2 whitespace-nowrap transition-all ${
                              activeHorizontalTab === tab ? 'border-indigo-600 text-indigo-650 font-bold' : 'border-transparent hover:text-slate-700'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => triggerToast("Add New Tab Action")} className="px-2.5 py-1.5 border border-indigo-200 text-indigo-650 hover:bg-indigo-50/20 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0 bg-white">
                        <Plus className="w-3 h-3" />
                        <span>Add New</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabs with Icons */}
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tabs with Icons</span>
                    <div className="border border-slate-150 rounded-xl p-3 bg-white flex items-center justify-around shadow-sm">
                      {[
                        { name: "Home", icon: Home },
                        { name: "Profile", icon: User },
                        { name: "Messages", icon: Mail, badge: 12 },
                        { name: "Settings", icon: Settings }
                      ].map(tab => {
                        const isActive = activeIconTab === tab.name;
                        return (
                          <button
                            key={tab.name}
                            onClick={() => setActiveIconTab(tab.name)}
                            className={`relative flex flex-col items-center gap-1.5 px-6 py-2 border-b-2 transition-all ${
                              isActive ? 'border-indigo-600 text-indigo-650 font-bold' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[10px]">{tab.name}</span>
                            {tab.badge && (
                              <span className="absolute top-1 right-2 bg-indigo-600 text-white rounded-full text-[8px] font-bold px-1.5 py-0.5 shadow-sm">
                                {tab.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* Breadcrumbs Showcase */}
              {(activeTab === "Overview" || activeTab === "Breadcrumbs") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Breadcrumbs</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-slate-150 rounded-xl p-4 bg-white shadow-sm flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <button onClick={() => triggerToast("Navigated to Home")} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <button onClick={() => triggerToast("Navigated to Dashboard")} className="hover:text-slate-700 hover:underline">Dashboard</button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <button onClick={() => triggerToast("Navigated to Products")} className="hover:text-slate-700 hover:underline">Products</button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <button onClick={() => triggerToast("Navigated to Electronics")} className="hover:text-slate-700 hover:underline">Electronics</button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <button onClick={() => triggerToast("Navigated to Smartphones")} className="hover:text-slate-700 hover:underline">Smartphones</button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <span className="text-indigo-650 font-bold">iPhone 15 Pro</span>
                    </div>
                  </div>
                </section>
              )}

            </div>
          )}

          {/* SIDE NAVIGATION & STEPPERS */}
          {(activeTab === "Overview" || activeTab === "Side Navigation" || activeTab === "Steppers" || activeTab === "Pagination") && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Side Navigation Showcase */}
              {(activeTab === "Overview" || activeTab === "Side Navigation") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 xl:col-span-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Side Navigation</h3>
                  
                  <div className="flex gap-4 items-stretch h-[320px]">
                    {/* Normal Side Navigation */}
                    <div className="w-3/5 border border-slate-150 rounded-xl bg-slate-50/50 p-2 flex flex-col justify-between shadow-inner">
                      <div className="space-y-1">
                        {[
                          { name: "Dashboard", icon: Home },
                          { name: "Products", icon: Package, dropdown: true },
                          { name: "Orders", icon: ShoppingCart },
                          { name: "Customers", icon: User },
                          { name: "Reports", icon: BarChart2 },
                          { name: "Settings", icon: Settings }
                        ].map(item => {
                          const isActive = activeSidebarItem === item.name;
                          return (
                            <button
                              key={item.name}
                              onClick={() => setActiveSidebarItem(item.name)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                                isActive ? 'bg-indigo-50 text-indigo-650 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <item.icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </div>
                              {item.dropdown && <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Collapsed Side Navigation */}
                    <div className="w-2/5 border border-slate-150 rounded-xl bg-slate-50/50 p-2 flex flex-col items-center shadow-inner gap-1">
                      {[Home, Package, ShoppingCart, User, BarChart2, Settings].map((Icon, idx) => (
                        <button key={idx} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border-none bg-transparent">
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Stepper & Stepper details */}
              {(activeTab === "Overview" || activeTab === "Steppers") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 xl:col-span-1 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Stepper</h3>
                    
                    {/* Visual Stepper */}
                    <div className="flex items-center justify-between w-full px-2 relative mb-6">
                      {/* Connection bar */}
                      <div className="absolute left-0 right-0 top-4.5 h-0.5 bg-slate-100 -z-10 mx-6">
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${((stepperStep - 1) / 3) * 100}%` }}
                        ></div>
                      </div>

                      {[
                        { step: 1, label: "Cart" },
                        { step: 2, label: "Shipping" },
                        { step: 3, label: "Payment" },
                        { step: 4, label: "Review" }
                      ].map(item => {
                        const isCompleted = stepperStep > item.step;
                        const isActive = stepperStep === item.step;
                        return (
                          <div key={item.step} className="flex flex-col items-center z-10">
                            <button 
                              onClick={() => setStepperStep(item.step)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                                isCompleted 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : isActive 
                                    ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-350'
                              }`}
                            >
                              {isCompleted ? <Check className="w-4 h-4 font-bold" /> : item.step}
                            </button>
                            <span className={`text-[10px] mt-2 font-semibold ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-1 text-xs">
                      <span className="font-bold text-slate-800 block">Checkout Process</span>
                      <p className="text-slate-500 leading-normal">Track progress through a sequence of steps.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 mt-6">
                    <button 
                      disabled={stepperStep === 1}
                      onClick={() => setStepperStep(p => Math.max(1, p - 1))}
                      className="px-3.5 py-1.5 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors bg-white"
                    >
                      Back
                    </button>
                    <button 
                      disabled={stepperStep === 4}
                      onClick={() => setStepperStep(p => Math.min(4, p + 1))}
                      className="px-3.5 py-1.5 bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none"
                    >
                      Next Step
                    </button>
                  </div>
                </section>
              )}

              {/* Variants info */}
              {(activeTab === "Overview" || activeTab === "Tabs" || activeTab === "Side Navigation") && (
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 xl:col-span-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Variants</h3>
                  
                  <div className="space-y-4 text-xs font-semibold text-slate-700">
                    {/* Underline Tab */}
                    <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Underline</span>
                      <div className="flex gap-4 border-b border-slate-200 pb-0.5 text-slate-500">
                        <span className="border-b-2 border-indigo-600 text-indigo-650 font-bold pb-1.5">Tab 1</span>
                        <span>Tab 2</span>
                        <span>Tab 3</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-2 leading-relaxed">Best for top level sections.</p>
                    </div>

                    {/* Pill Tab */}
                    <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Pill</span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold">All</span>
                        <span className="px-3 py-1 hover:bg-slate-100 rounded-full text-[10px] font-semibold text-slate-500">Active</span>
                        <span className="px-3 py-1 hover:bg-slate-100 rounded-full text-[10px] font-semibold text-slate-500">Draft</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-2 leading-relaxed">Great for filtering options.</p>
                    </div>

                    {/* Sidebar item */}
                    <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Sidebar</span>
                      <div className="px-3.5 py-2 bg-indigo-50 text-indigo-650 font-bold rounded-xl flex items-center gap-2 max-w-[150px] text-[11px] shadow-sm">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-2 leading-relaxed">Ideal for app navigation.</p>
                    </div>
                  </div>
                </section>
              )}

            </div>
          )}

          {/* PAGINATION Section */}
          {(activeTab === "Overview" || activeTab === "Pagination") && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Pagination</h3>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border border-slate-150 rounded-xl p-4 bg-white shadow-sm gap-4">
                {/* Visual paginator */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[1, 2, 3, 4, 5].map(p => (
                    <button 
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        triggerToast(`Switched to page ${p}`);
                      }}
                      className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all ${
                        currentPage === p ? 'bg-indigo-600 text-white shadow-sm' : 'border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="px-1 text-slate-300">...</span>
                  <button 
                    onClick={() => {
                      setCurrentPage(20);
                      triggerToast("Switched to page 20");
                    }}
                    className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all ${
                      currentPage === 20 ? 'bg-indigo-600 text-white shadow-sm' : 'border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    20
                  </button>
                  <button 
                    disabled={currentPage === 20}
                    onClick={() => setCurrentPage(p => Math.min(20, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Rows per page */}
                <div className="flex items-center gap-3 justify-end text-xs font-semibold text-slate-500">
                  <span>Rows per page:</span>
                  <select className="border border-slate-200 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-indigo-500 text-slate-700 font-bold cursor-pointer">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                  </select>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Navigation Guidelines</h4>
            <ul className="space-y-3.5">
              {GUIDELINES.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-normal font-semibold">
                  <Check className="w-4 h-4 text-emerald-500 font-bold shrink-0 mt-0.5" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Accessibility</h4>
            <ul className="space-y-3.5">
              {ACCESSIBILITY_ITEMS.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-normal font-semibold">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          <div className="bg-[#0B1120] text-slate-300 rounded-2xl p-6 shadow-lg border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code Example (HTML)</h4>
              <button 
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all border-none"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#070b15] text-[#94a3b8] p-3.5 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-64 custom-scrollbar border border-slate-800/80">
              <code>{CODE_EXAMPLE_HTML}</code>
            </pre>
          </div>

          {/* When to Use */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">When to Use</h4>
            <ul className="space-y-3.5">
              {[
                "Navigation bars for primary navigation.",
                "Tabs for switching between views.",
                "Breadcrumbs to show hierarchy.",
                "Side navigation for complex apps.",
                "Pagination for large data sets.",
                "Steppers for multi-step processes."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 leading-normal font-semibold">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </aside>

      </div>
      
      {/* Footer Branding */}
      <footer className="mt-12 pt-6 pb-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Design with consistency. Build with confidence.</span>
        <div className="flex items-center gap-4">
          <span>Katabazaar Design System © 2024</span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-650 border border-indigo-100 rounded">v1.0.0</span>
        </div>
      </footer>

    </div>
  );
}
