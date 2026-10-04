'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, ChevronLeft, 
  AlertCircle, Info, AlertTriangle, X, Play, 
  User, CheckCircle2, Settings, LogOut, CreditCard, Calendar, Search,
  Sliders, Plus, Star, Trash2, Bell, Lock, Activity, Eye, FileText,
  Home, Package
} from 'lucide-react';

export default function DesignSystemComponentsPage() {
  const [activeCategory, setActiveCategory] = useState("All Components");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All Components", "Buttons", "Forms", "Data Display", "Navigation", 
    "Feedback", "Overlay", "Charts & Graphs", "Tables", "Others"
  ];

  const components = [
    {
      id: "buttons",
      title: "1. BUTTONS",
      category: "Buttons",
      href: "/design-system/components/buttons",
      preview: (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Primary & Variants</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm">Primary</button>
              <button className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-900 transition-colors shadow-sm">Dark</button>
              <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm">Success</button>
              <button className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-750 transition-colors shadow-sm">Danger</button>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Outline, Ghost & Link</p>
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-355 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">Outline</button>
              <button className="px-3 py-1.5 bg-transparent text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-100 transition-colors">Ghost</button>
              <button className="text-indigo-600 hover:underline text-xs font-semibold">Link Button &rarr;</button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "inputs",
      title: "2. INPUTS",
      category: "Forms",
      href: "/design-system/components/inputs",
      preview: (
        <div className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Default Input</label>
            <input type="text" placeholder="Enter text..." className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 bg-white" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 mb-1 uppercase">Focused Input</label>
            <input type="text" defaultValue="Active text" className="w-full px-3 py-1.5 border border-indigo-500 rounded-md text-xs outline-none ring-2 ring-indigo-500/20 bg-white" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-red-600 mb-1 uppercase">Error state</label>
            <div className="relative">
              <input type="text" defaultValue="Invalid text" className="w-full px-3 py-1.5 border border-red-500 rounded-md text-xs outline-none ring-2 ring-red-500/20 text-red-950 bg-white" />
              <AlertCircle className="absolute right-2.5 top-2 w-3.5 h-3.5 text-red-500" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "dropdowns",
      title: "3. SELECT",
      category: "Forms",
      href: "/design-system/components/dropdowns",
      preview: (
        <div className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Standard Dropdown</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                <option>Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Multi-select Tags</label>
            <div className="w-full border border-slate-300 rounded-md p-1 bg-white flex flex-wrap gap-1 items-center min-h-[34px]">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] font-semibold text-indigo-750 border border-indigo-100">
                Design
                <X className="w-2.5 h-2.5 text-indigo-400 cursor-pointer" />
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] font-semibold text-indigo-750 border border-indigo-100">
                Code
                <X className="w-2.5 h-2.5 text-indigo-400 cursor-pointer" />
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "checkboxes",
      title: "4. CHECKBOX & RADIO",
      category: "Forms",
      href: "/design-system/components/checkboxes",
      preview: (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2.5 border-r border-slate-100 pr-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Checkboxes</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
              <span className="text-xs text-slate-700 font-medium">Unchecked</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-650 cursor-pointer" />
              <span className="text-xs text-slate-700 font-medium">Checked</span>
            </label>
          </div>
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Radios</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="preview-radio" className="w-3.5 h-3.5 border-slate-300 text-indigo-650 cursor-pointer" />
              <span className="text-xs text-slate-700 font-medium">Radio 1</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="preview-radio" defaultChecked className="w-3.5 h-3.5 border-slate-300 text-indigo-650 cursor-pointer" />
              <span className="text-xs text-slate-700 font-medium">Radio 2</span>
            </label>
          </div>
        </div>
      )
    },
    {
      id: "toggle",
      title: "5. TOGGLE",
      category: "Forms",
      href: "/design-system/components/checkboxes", // Toggles are detailed under checkboxes/inputs
      preview: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Toggle On</span>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-indigo-600 transition-colors">
              <span className="inline-block h-3.5 w-3.5 translate-x-4.5 transform rounded-full bg-white shadow-sm" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Toggle Off</span>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-200 transition-colors">
              <span className="inline-block h-3.5 w-3.5 translate-x-1 transform rounded-full bg-white shadow-sm" />
            </button>
          </div>
          <div className="flex items-center justify-between opacity-50">
            <span className="text-xs font-semibold text-slate-750">Disabled</span>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-100">
              <span className="inline-block h-3.5 w-3.5 translate-x-1 transform rounded-full bg-slate-300 shadow-sm" />
            </button>
          </div>
        </div>
      )
    },
    {
      id: "alerts",
      title: "6. ALERTS",
      category: "Feedback",
      href: "/design-system/components/alerts", // Alerts validation spec
      preview: (
        <div className="space-y-2">
          <div className="flex items-start p-2 rounded bg-emerald-50 border border-emerald-150 text-[10px] font-semibold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>Success: Action completed successfully.</span>
          </div>
          <div className="flex items-start p-2 rounded bg-red-50 border border-red-150 text-[10px] font-semibold text-red-800">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>Error: Something went wrong.</span>
          </div>
        </div>
      )
    },
    {
      id: "badges",
      title: "7. BADGES",
      category: "Data Display",
      href: "/design-system/components/badges", // Badges & Pills
      preview: (
        <div className="space-y-3.5">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Default</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">Primary</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Success</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">Danger</span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">12</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200 text-slate-600 bg-white">Beta</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
              Active
            </span>
          </div>
        </div>
      )
    },
    {
      id: "tabs",
      title: "8. TABS",
      category: "Navigation",
      href: "/design-system/components/navigation", // Navigation components
      preview: (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="flex border-b border-slate-200 bg-slate-50 text-[11px] font-bold">
            <span className="px-3 py-1.5 text-indigo-600 border-b-2 border-indigo-600 bg-white">Tab 1</span>
            <span className="px-3 py-1.5 text-slate-450 hover:text-slate-700">Tab 2</span>
            <span className="px-3 py-1.5 text-slate-450 hover:text-slate-700">Tab 3</span>
          </div>
          <div className="p-3 text-[10px] text-slate-500 bg-white min-h-[44px]">
            Tab content preview area.
          </div>
        </div>
      )
    },
    {
      id: "pagination",
      title: "9. PAGINATION",
      category: "Navigation",
      href: "/design-system/components/navigation", // Pagination stats spec
      preview: (
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 h-6 rounded bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">1</span>
            <span className="w-6 h-6 rounded border border-transparent hover:border-slate-200 text-slate-600 text-[11px] flex items-center justify-center cursor-pointer">2</span>
            <span className="w-6 h-6 rounded border border-transparent hover:border-slate-200 text-slate-600 text-[11px] flex items-center justify-center cursor-pointer">3</span>
            <button className="p-1 rounded border border-slate-200 bg-white text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[10px] text-slate-450 font-semibold block">Showing 1 to 5 of 50 results</span>
        </div>
      )
    },
    {
      id: "tooltip",
      title: "10. TOOLTIP",
      category: "Data Display",
      href: "/design-system/components/tooltips",
      preview: (
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative flex flex-col items-center">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm cursor-default">
              Hover me
            </button>
            <div className="mt-1.5 flex flex-col items-center">
              <div className="w-2 h-2 rotate-45 bg-slate-900 rounded-sm -mb-1"></div>
              <div className="relative z-10 px-2.5 py-1 text-[10px] font-semibold text-white bg-slate-900 shadow rounded-md">
                Useful tooltip tip!
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "modal",
      title: "11. MODAL",
      category: "Overlay",
      href: "/design-system/components/modals",
      preview: (
        <div className="border border-slate-200 rounded-lg bg-white shadow-md overflow-hidden max-w-[240px] mx-auto text-xs">
          <div className="px-3 py-2 border-b border-slate-200 flex justify-between items-center bg-slate-50 font-bold">
            <span>Confirm Action</span>
            <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>
          <div className="p-3 text-[10px] text-slate-500 leading-normal">
            Are you sure you want to perform this task?
          </div>
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-1.5">
            <button className="px-2 py-1 border border-slate-300 rounded text-[9px] font-bold bg-white text-slate-700">Cancel</button>
            <button className="px-2 py-1 bg-indigo-600 text-white rounded text-[9px] font-bold">Confirm</button>
          </div>
        </div>
      )
    },
    {
      id: "dropdown-menu",
      title: "12. DROPDOWN MENU",
      category: "Overlay",
      href: "/design-system/components/dropdowns",
      preview: (
        <div className="border border-slate-200 rounded-lg bg-white shadow-lg overflow-hidden max-w-[150px] mx-auto text-[10px] font-semibold py-1">
          <div className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Profile</span>
          </div>
          <div className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </div>
          <div className="border-t border-slate-100 my-1"></div>
          <div className="px-3 py-1.5 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-red-600">
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign out</span>
          </div>
        </div>
      )
    },
    {
      id: "drawers",
      title: "12b. DRAWERS",
      category: "Overlay",
      href: "/design-system/components/drawers",
      preview: (
        <div className="border border-slate-200 rounded-lg bg-[#FAFAFA] overflow-hidden max-w-[220px] mx-auto text-xs relative h-[100px]">
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-white border-l border-slate-200 shadow-lg flex flex-col p-2 gap-1.5">
            <div className="flex justify-between items-center pb-1 border-b border-slate-100">
              <span className="text-[9px] font-bold text-slate-800">Drawer</span>
              <X className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-slate-200 rounded w-full"></div>
              <div className="h-1.5 bg-slate-150 rounded w-4/5"></div>
              <div className="h-1.5 bg-slate-100 rounded w-1/2"></div>
            </div>
          </div>
          <div className="p-3 text-[9px] text-slate-400">
            Page content dims.
          </div>
        </div>
      )
    },
    {
      id: "data-table",
      title: "13. DATA TABLE",
      category: "Tables",
      href: "/design-system/components/tables",
      preview: (
        <div className="border border-slate-200 rounded-lg overflow-hidden text-[10px] font-medium bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-400 font-bold">
                <th className="px-2.5 py-1 text-left">ID</th>
                <th className="px-2.5 py-1 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-2.5 py-1.5 font-bold">#ORD-123</td>
                <td className="px-2.5 py-1.5 text-emerald-600 font-bold">Delivered</td>
              </tr>
              <tr>
                <td className="px-2.5 py-1.5 font-bold">#ORD-124</td>
                <td className="px-2.5 py-1.5 text-blue-600 font-bold">Processing</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: "progress-bar",
      title: "14. PROGRESS BAR",
      category: "Data Display",
      href: "/design-system/components/buttons",
      preview: (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
              <span>Progress</span>
              <span>70%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
              <span>Completed</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "avatar",
      title: "15. AVATAR",
      category: "Data Display",
      href: "/design-system/components/avatars",
      preview: (
        <div className="space-y-3.5">
          <div className="flex items-end gap-3 justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600 border border-slate-200">XS</div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-700 border border-indigo-100 shadow-sm">SM</div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow relative">
              <User className="h-5 w-5 text-slate-400" />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-450 ring-2 ring-white"></span>
            </div>
          </div>
          <div className="flex -space-x-3 overflow-hidden justify-center pt-0.5">
            <div className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">A</div>
            <div className="w-8 h-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">B</div>
            <div className="w-8 h-8 rounded-full ring-2 ring-white bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm">C</div>
          </div>
        </div>
      )
    },
    {
      id: "date-pickers",
      title: "16. DATE PICKER",
      category: "Forms",
      href: "/design-system/components/date-pickers",
      preview: (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Single Date</label>
            <div className="relative">
              <input type="text" readOnly value="15 May 2024" className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-800 font-semibold focus:outline-none" />
              <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-indigo-650" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Date Range</label>
            <div className="relative">
              <input type="text" readOnly value="01 May - 15 May" className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-800 font-semibold focus:outline-none" />
              <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-indigo-655" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "search-bars",
      title: "17. SEARCH BAR",
      category: "Forms",
      href: "/design-system/components/search-bars",
      preview: (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">With ShortCut Key</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" readOnly placeholder="Search anything..." className="w-full pl-8 pr-10 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-900 focus:outline-none" />
              <div className="absolute right-2 top-1.5 flex items-center gap-0.5 px-1 py-0.5 border border-slate-200 bg-slate-50 text-slate-400 rounded text-[8px] font-mono font-bold">
                <span>⌘</span><span>K</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">With Filter</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-450" />
              <input type="text" readOnly placeholder="Search products..." className="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-md text-xs bg-white focus:outline-none" />
              <Sliders className="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-650" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "radios",
      title: "18. RADIO BUTTONS",
      category: "Forms",
      href: "/design-system/components/radios",
      preview: (
        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Radio Variants</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" checked={true} readOnly className="w-4 h-4 border-slate-300 text-indigo-650 cursor-pointer" />
              <span className="text-xs text-slate-700 font-bold">Option Selected (Primary)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={true} readOnly className="w-4 h-4 border-slate-300 text-emerald-600 cursor-pointer" />
              <span className="text-xs text-slate-700 font-bold">Option Selected (Success)</span>
            </label>
          </div>
        </div>
      )
    },
    {
      id: "cards",
      title: "19. CARDS",
      category: "Data Display",
      href: "/design-system/components/cards",
      preview: (
        <div className="space-y-3">
          <div className="border border-slate-200 bg-white rounded-lg p-3 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Revenue</span>
              <span className="inline-flex items-center px-1 py-0.2 bg-emerald-50 text-emerald-700 rounded text-[8px] font-bold">+12.5%</span>
            </div>
            <div className="text-base font-bold text-slate-900">₹24,58,900</div>
          </div>
          <div className="border border-slate-200 bg-white rounded-lg overflow-hidden shadow-sm flex items-center p-2.5 gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm shrink-0">🪴</div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-slate-200 rounded w-4/5"></div>
              <div className="h-2 bg-slate-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "charts",
      title: "20. CHARTS & GRAPHS",
      category: "Charts & Graphs",
      href: "/design-system/components/charts",
      preview: (
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Interactive Mini-Charts</p>
          <div className="flex gap-4 items-center justify-around h-[84px] border border-slate-100 rounded-lg p-2.5 bg-slate-50/50">
            {/* Bar Chart Preview */}
            <svg className="w-16 h-12" viewBox="0 0 60 40">
              <rect x="5" y="25" width="8" height="15" className="fill-indigo-500 rounded-sm" />
              <rect x="18" y="15" width="8" height="25" className="fill-indigo-600 rounded-sm" />
              <rect x="31" y="20" width="8" height="20" className="fill-indigo-400 rounded-sm" />
              <rect x="44" y="8" width="8" height="32" className="fill-indigo-750 rounded-sm" />
            </svg>
            
            {/* Line Chart Preview */}
            <svg className="w-16 h-12" viewBox="0 0 60 40">
              <path d="M 5 30 L 20 15 L 35 25 L 50 8" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="5" cy="30" r="2.5" className="fill-white stroke-indigo-600 stroke-[1.5]" />
              <circle cx="20" cy="15" r="2.5" className="fill-white stroke-indigo-600 stroke-[1.5]" />
              <circle cx="35" cy="25" r="2.5" className="fill-white stroke-indigo-600 stroke-[1.5]" />
              <circle cx="50" cy="8" r="2.5" className="fill-white stroke-indigo-600 stroke-[1.5]" />
            </svg>

            {/* Pie Chart Preview */}
            <svg className="w-12 h-12" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="3.2" strokeDasharray="65 35" strokeDashoffset="25" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="30 70" strokeDashoffset="90" />
            </svg>
          </div>
        </div>
      )
    },
    {
      id: "lists",
      title: "21. LISTS",
      category: "Others",
      href: "/design-system/components/lists",
      preview: (
        <div className="space-y-3.5">
          <div className="border border-slate-200 bg-white rounded-lg p-2.5 shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unordered List</p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                <span>First item in list</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                <span>Second item in list</span>
              </li>
            </ul>
          </div>
          <div className="border border-slate-200 bg-white rounded-lg p-2.5 shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Icon List</p>
            <div className="flex gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Orders</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "forms",
      title: "22. FORMS",
      category: "Forms",
      href: "/design-system/components/forms",
      preview: (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">Input & Button</label>
            <div className="flex gap-2">
              <input type="text" readOnly placeholder="Enter text..." className="flex-grow px-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none bg-white" />
              <button className="px-3 py-1.5 bg-indigo-655 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm">Submit</button>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked readOnly className="w-3.5 h-3.5 rounded text-indigo-650 border-slate-300" />
              <span className="text-xs text-slate-700 font-medium">Checked</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked readOnly className="w-3.5 h-3.5 text-indigo-655 border-slate-300" />
              <span className="text-xs text-slate-700 font-medium">Radio</span>
            </label>
            <div className="flex items-center gap-2">
              <button className="relative inline-flex h-4 w-7.5 items-center rounded-full bg-indigo-600">
                <span className="inline-block h-3 w-3 translate-x-3.5 transform rounded-full bg-white" />
              </button>
              <span className="text-xs text-slate-700 font-medium">Switch</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "notifications",
      title: "23. NOTIFICATIONS",
      category: "Feedback",
      href: "/design-system/components/notifications",
      preview: (
        <div className="space-y-3.5">
          <div className="p-2.5 border border-emerald-155 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-between text-[10px] font-bold shadow-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Success: Action completed!</span>
            </div>
            <X className="w-3 h-3 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex gap-4 items-center justify-between">
            <span className="text-xs text-slate-650 font-semibold">Floating Position</span>
            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded text-[10px]">Top Right</span>
          </div>
        </div>
      )
    },
    {
      id: "skeletons",
      title: "24. SKELETONS",
      category: "Feedback",
      href: "/design-system/components/skeletons",
      preview: (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
            <div className="flex-grow space-y-1.5">
              <div className="h-2.5 bg-slate-200 animate-pulse rounded w-2/3"></div>
              <div className="h-2 bg-slate-150 animate-pulse rounded w-1/3"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 bg-slate-200 animate-pulse rounded w-full"></div>
            <div className="h-2.5 bg-slate-150 animate-pulse rounded w-5/6"></div>
          </div>
        </div>
      )
    },
    {
      id: "loaders",
      title: "25. LOADERS",
      category: "Feedback",
      href: "/design-system/components/loaders",
      preview: (
        <div className="flex gap-4 items-center justify-around py-3">
          <div className="w-6 h-6 border-[2px] border-slate-200 border-t-indigo-650 rounded-full animate-spin"></div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-duration:0.8s]"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
          </div>
          <div className="w-6 h-6 bg-indigo-600/20 rounded-md animate-pulse"></div>
        </div>
      )
    },
    {
      id: "empty-states",
      title: "26. EMPTY STATES",
      category: "Feedback",
      href: "/design-system/components/empty-states",
      preview: (
        <div className="text-center p-3 border border-dashed border-slate-200 rounded-lg space-y-2 bg-[#FAFAFA]/50">
          <Inbox className="w-6 h-6 text-slate-350 mx-auto" />
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-800">No data matches</p>
            <p className="text-[8px] text-slate-400">Clear filters and try again.</p>
          </div>
        </div>
      )
    },
    {
      id: "error-states",
      title: "27. ERROR STATES",
      category: "Feedback",
      href: "/design-system/components/error-states",
      preview: (
        <div className="space-y-3">
          <div className="p-2 border border-red-200 bg-red-50 text-red-800 rounded-lg flex items-center justify-between text-[10px] font-bold shadow-sm">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-650 shrink-0" />
              <span>Error: Connection lost!</span>
            </div>
            <X className="w-3.5 h-3.5 text-red-400 cursor-pointer" />
          </div>
          <div className="flex gap-2">
            <input type="text" readOnly defaultValue="wrong" className="flex-grow px-2 py-1 border border-red-500 rounded text-[10px] text-red-900 bg-white" />
            <button className="px-2.5 py-1 bg-red-600 hover:bg-red-750 text-white rounded text-[10px] font-bold">Retry</button>
          </div>
        </div>
      )
    }
  ];

  // Filtering Logic
  const filteredComponents = components.filter(comp => {
    const matchesCategory = activeCategory === "All Components" || comp.category === activeCategory;
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Components</h1>
            <p className="text-slate-500 mt-1">Design system component catalog and usage guidelines.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Catalog search field */}
            <div className="relative flex-grow md:flex-initial md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors w-fit whitespace-nowrap shrink-0">
              <Play className="w-4 h-4 mr-2" fill="currentColor" />
              View Storybook
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <div className="flex space-x-1 border-b border-slate-200 w-full min-w-max">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeCategory === tab 
                    ? 'border-indigo-600 text-indigo-600 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredComponents.map((comp) => (
          <Card 
            key={comp.id}
            title={comp.title} 
            headerRight={
              <a href={comp.href} className="text-xs font-semibold text-indigo-600 hover:text-indigo-750 transition-colors">
                View Detailed Spec &rarr;
              </a>
            }
          >
            {comp.preview}
          </Card>
        ))}
        {filteredComponents.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-medium bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            No components match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children, className = "", headerRight = null }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden flex flex-col ${className}`}>
      <div className="px-5 py-4 border-b border-slate-100/80 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-800 tracking-wide">{title}</h2>
        {headerRight}
      </div>
      <div className="p-6 flex-grow flex flex-col justify-center bg-white/40">
        {children}
      </div>
    </div>
  );
}
