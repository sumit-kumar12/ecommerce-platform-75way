"use client";

import React, { useState } from "react";
import { 
  List, Download, Search, Info, Check, AlertTriangle, X, Bell, 
  ChevronRight, ChevronLeft, User, CheckSquare, Square, 
  Home, Package, ShoppingBag, Users, Mail, MessageSquare, 
  Calendar, ChevronDown, Clock, HelpCircle, ArrowRight
} from "lucide-react";

const TABS = ["Overview", "Variants", "Anatomy", "States", "Interactions", "Accessibility", "Best Practices"];

const GUIDELINES = [
  { label: "Use lists to present related items in a clear structure.", ok: true },
  { label: "Keep list items concise and scannable.", ok: true },
  { label: "Use icons or avatars to enhance visual hierarchy.", ok: true },
  { label: "Maintain consistent spacing and alignment.", ok: true },
  { label: "Support various list types for different use cases.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use semantic <ul>, <ol>, <li> elements.", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Provide focus states for interactive items.", ok: true },
  { label: "Support keyboard navigation.", ok: true },
  { label: "Use descriptive text for icons and actions.", ok: true }
];

export default function DSListsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Interactive Playground States
  const [checkedProducts, setCheckedProducts] = useState({
    all: false,
    prodA: false,
    prodB: true,
    prodC: false,
  });

  const [toggles, setToggles] = useState({
    email: false,
    sms: false,
    push: false,
  });

  const [statusToggles, setStatusToggles] = useState({
    email: true,
    sms: true,
    push: false,
    marketing: true,
  });

  const [selectedStatesList, setSelectedStatesList] = useState({
    item1: true,
    item2: false,
    item3: false,
  });

  const handleCopyCode = () => {
    const code = `<ul class="list-icon-list">
  <li class="list-item">
    <span class="list-icon">
      <svg>...</svg>
    </span>
    <span class="list-text">Dashboard</span>
  </li>
  <li class="list-item">
    <span class="list-icon">
      <svg>...</svg>
    </span>
    <span class="list-text">Orders</span>
  </li>
  <li class="list-item">
    <span class="list-icon">
      <svg>...</svg>
    </span>
    <span class="list-text">Products</span>
  </li>
</ul>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleProduct = (key) => {
    if (key === 'all') {
      const nextVal = !checkedProducts.all;
      setCheckedProducts({
        all: nextVal,
        prodA: nextVal,
        prodB: nextVal,
        prodC: nextVal,
      });
    } else {
      const nextState = { ...checkedProducts, [key]: !checkedProducts[key] };
      const allChecked = nextState.prodA && nextState.prodB && nextState.prodC;
      setCheckedProducts({
        ...nextState,
        all: allChecked,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS3 – LISTS</h1>
            <List className="w-5 h-5 text-indigo-655" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Lists display collections of related items in a clean and organized format.</p>
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

      {/* Dashboard Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Columns */}
        <div className="flex-grow space-y-8 w-full lg:min-w-0">
          
          {/* Stats Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <List className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Variants</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 Variants</span>
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

          {/* List Variants Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">List Variants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              
              {/* Unordered List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Unordered List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Simple list with bullet points.</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                  <li>Fourth item</li>
                </ul>
              </div>

              {/* Ordered List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Ordered List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with numerical order.</p>
                </div>
                <ol className="space-y-2 text-sm text-slate-600 list-decimal pl-5">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                  <li>Fourth item</li>
                </ol>
              </div>

              {/* Icon List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Icon List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with icons for quick scan.</p>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-650">
                  <li className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Orders</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Products</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Customers</span>
                  </li>
                </ul>
              </div>

              {/* Avatar List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Avatar List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with avatar and text.</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0 border border-slate-200">AM</div>
                    <div>
                      <div className="text-xs font-semibold text-slate-950">Arjun Mehta</div>
                      <div className="text-[10px] text-slate-450">Product Designer</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-55 flex items-center justify-center font-bold text-xs text-indigo-750 shrink-0 border border-indigo-105">NS</div>
                    <div>
                      <div className="text-xs font-semibold text-slate-955">Neha Singh</div>
                      <div className="text-[10px] text-slate-450">Marketing Lead</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-xs text-emerald-700 shrink-0 border border-emerald-100">RS</div>
                    <div>
                      <div className="text-xs font-semibold text-slate-955">Rohit Sharma</div>
                      <div className="text-[10px] text-slate-450">Developer</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Action List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Action List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with actions on the right.</p>
                </div>
                <ul className="space-y-3">
                  {["#ORD-00123", "#ORD-00124", "#ORD-00125", "#ORD-00126"].map(orderId => (
                    <li key={orderId} className="flex items-center justify-between py-0.5 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-medium text-slate-700">Order {orderId}</span>
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View</button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkbox List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Checkbox List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with selectable items.</p>
                </div>
                <ul className="space-y-2.5">
                  <li>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={checkedProducts.all} 
                        onChange={() => toggleProduct('all')}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">Select all</span>
                    </label>
                  </li>
                  <li className="h-px bg-slate-100 my-1" />
                  {['prodA', 'prodB', 'prodC'].map((prod, idx) => (
                    <li key={prod}>
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={checkedProducts[prod]} 
                          onChange={() => toggleProduct(prod)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-650">Product {String.fromCharCode(65 + idx)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Switch List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Switch List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with toggle switches.</p>
                </div>
                <ul className="space-y-3.5">
                  {Object.keys(toggles).map((key) => (
                    <li key={key} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700 capitalize">{key} notifications</span>
                      <button 
                        onClick={() => setToggles(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          toggles[key] ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          toggles[key] ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Status List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List showing toggle states.</p>
                </div>
                <ul className="space-y-3.5">
                  {Object.keys(statusToggles).map((key) => (
                    <li key={key} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700 capitalize">
                        {key === 'marketing' ? 'Marketing updates' : `${key} notifications`}
                      </span>
                      <button 
                        onClick={() => setStatusToggles(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          statusToggles[key] ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          statusToggles[key] ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description List */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Description List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">List with terms and descriptions.</p>
                </div>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="font-semibold text-slate-450 uppercase">Order ID</dt>
                    <dd className="font-bold text-slate-900">#ORD-00123</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="font-semibold text-slate-450 uppercase">Date</dt>
                    <dd className="font-medium text-slate-800">20 May 2024</dd>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <dt className="font-semibold text-slate-450 uppercase">Status</dt>
                    <dd className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">Delivered</dd>
                  </div>
                </dl>
              </div>

            </div>
          </section>

          {/* List Examples Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">List Examples</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Activity Feed */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Activity Feed</h4>
                  
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="relative">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">Order #ORD-00123 delivered successfully.</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">2 min ago</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-indigo-650 ring-4 ring-indigo-50" />
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">Payment of ₹2,499 received.</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">10 min ago</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-indigo-655 ring-4 ring-indigo-50" />
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">Order #ORD-00124 is out for delivery.</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">1 hour ago</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-indigo-655 ring-4 ring-indigo-50" />
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">New user registered – Arjun Mehta.</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Notifications</h4>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <Bell className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-700 font-medium">Your order #ORD-00123 has been delivered.</p>
                        <span className="text-[10px] text-slate-450 mt-0.5 block">2 min ago</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Bell className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-700 font-medium">Payment received for order #ORD-00124.</p>
                        <span className="text-[10px] text-slate-455 mt-0.5 block">15 min ago</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Bell className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-700 font-medium">Low stock alert for Wireless Headphones.</p>
                        <span className="text-[10px] text-slate-455 mt-0.5 block">1 hour ago</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Bell className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-700 font-medium">New message from Neha Singh.</p>
                        <span className="text-[10px] text-slate-455 mt-0.5 block">2 hours ago</span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <button className="text-xs font-bold text-indigo-655 hover:text-indigo-700 transition-colors w-full text-center mt-6 pt-4 border-t border-slate-100 block">
                  View all
                </button>
              </div>

              {/* Contact List */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Contact List</h4>
                  
                  <ul className="space-y-3.5">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0 border border-slate-200">AM</div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">Arjun Mehta</div>
                          <div className="text-[10px] text-slate-400 truncate">arjun@example.com</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50/50 rounded transition-colors shrink-0">Message</button>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-750 shrink-0 border border-indigo-105">NS</div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">Neha Singh</div>
                          <div className="text-[10px] text-slate-400 truncate">neha@example.com</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50/50 rounded transition-colors shrink-0">Message</button>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-xs text-emerald-700 shrink-0 border border-emerald-100">RS</div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">Rohit Sharma</div>
                          <div className="text-[10px] text-slate-400 truncate">rohit@example.com</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50/50 rounded transition-colors shrink-0">Message</button>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center font-bold text-xs text-orange-700 shrink-0 border border-orange-100">SI</div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">Sneha Iyer</div>
                          <div className="text-[10px] text-slate-400 truncate">sneha@example.com</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50/50 rounded transition-colors shrink-0">Message</button>
                    </li>
                  </ul>
                </div>
                
                <button className="text-xs font-bold text-indigo-655 hover:text-indigo-700 transition-colors w-full text-center mt-6 pt-4 border-t border-slate-100 block">
                  View all contacts
                </button>
              </div>

            </div>
          </section>

          {/* List States Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">List States</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
              
              {/* Default State */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Default</label>
                <div className="border border-slate-200 rounded-lg p-3.5 min-h-[110px] flex items-center bg-white">
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>List item one</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>List item two</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>List item three</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Hover State */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hover</label>
                <div className="border border-slate-200 rounded-lg p-2 min-h-[110px] flex flex-col justify-center bg-white">
                  <ul className="space-y-1 text-xs text-slate-650">
                    <li className="px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>List item one</span>
                    </li>
                    <li className="px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>List item two</span>
                    </li>
                    <li className="px-2 py-1 rounded bg-slate-100 transition-colors cursor-pointer flex items-center gap-2 font-semibold text-slate-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      <span>List item three</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Selected State */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Selected</label>
                <div className="border border-slate-200 rounded-lg p-2 min-h-[110px] flex flex-col justify-center bg-white">
                  <ul className="space-y-1 text-xs text-slate-655">
                    <li 
                      onClick={() => setSelectedStatesList(p => ({ ...p, item1: !p.item1 }))}
                      className={`px-2 py-1 rounded cursor-pointer flex items-center gap-2 select-none ${
                        selectedStatesList.item1 ? 'bg-indigo-50/70 text-indigo-750 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      {selectedStatesList.item1 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                      )}
                      <span>List item one</span>
                    </li>
                    <li 
                      onClick={() => setSelectedStatesList(p => ({ ...p, item2: !p.item2 }))}
                      className={`px-2 py-1 rounded cursor-pointer flex items-center gap-2 select-none ${
                        selectedStatesList.item2 ? 'bg-indigo-50/70 text-indigo-750 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      {selectedStatesList.item2 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-355 shrink-0" />
                      )}
                      <span>List item two</span>
                    </li>
                    <li 
                      onClick={() => setSelectedStatesList(p => ({ ...p, item3: !p.item3 }))}
                      className={`px-2 py-1 rounded cursor-pointer flex items-center gap-2 select-none ${
                        selectedStatesList.item3 ? 'bg-indigo-50/70 text-indigo-750 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      {selectedStatesList.item3 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-355 shrink-0" />
                      )}
                      <span>List item three</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Disabled State */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Disabled</label>
                <div className="border border-slate-200 rounded-lg p-3.5 min-h-[110px] flex items-center bg-white opacity-40 select-none pointer-events-none">
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span>List item one</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span>List item two</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span>List item three</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Loading State */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Loading</label>
                <div className="border border-slate-200 rounded-lg p-3.5 min-h-[110px] flex flex-col justify-center gap-3 bg-white">
                  <div className="flex items-center gap-2.5 animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
                    <span className="h-2.5 bg-slate-200 rounded w-16" />
                  </div>
                  <div className="flex items-center gap-2.5 animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
                    <span className="h-2.5 bg-slate-200 rounded w-20" />
                  </div>
                  <div className="flex items-center gap-2.5 animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
                    <span className="h-2.5 bg-slate-200 rounded w-24" />
                  </div>
                </div>
              </div>

              {/* Empty State */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Empty</label>
                <div className="border border-slate-200 rounded-lg p-3 min-h-[110px] flex flex-col items-center justify-center text-center bg-white">
                  <span className="material-symbols-outlined text-[20px] text-slate-300 block mb-1">mail</span>
                  <div className="text-[9px] font-bold text-slate-800">No items found</div>
                  <div className="text-[8px] text-slate-400 mt-0.5">Try adjusting your search or filters.</div>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">List Guidelines</h4>
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
{`<ul class="list-icon-list">
  <li class="list-item">
    <span class="list-icon">
      <svg>...</svg>
    </span>
    <span class="list-text">Dashboard</span>
  </li>
  <li class="list-item">
    <span class="list-icon">
      <svg>...</svg>
    </span>
    <span class="list-text">Orders</span>
  </li>
  <li class="list-item">
    <span class="list-icon">
      <svg>...</svg>
    </span>
    <span class="list-text">Products</span>
  </li>
</ul>`}
            </pre>
          </div>

          {/* When to Use */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">When to Use</h4>
            <ul className="space-y-3">
              {[
                "Displaying navigation links.",
                "Showing activity feeds or timelines.",
                "Presenting selectable options.",
                "Displaying contacts or user lists.",
                "Showing settings with toggles or actions."
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
