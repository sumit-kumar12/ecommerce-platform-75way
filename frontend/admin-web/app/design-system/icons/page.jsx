"use client";

import React, { useState, useMemo } from "react";
import { 
  Home, Settings, Search, User, Plus, Minus, X, Check, Info, HelpCircle,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Maximize2, Minimize2, ArrowLeftRight, ArrowUpDown,
  RefreshCw, Redo2, Undo2, MoveRight, Edit3, Trash2, Share2, Download, Upload, Copy, Layers, Move, Link, Link2Off,
  Save, Printer, ExternalLink, FileDown, Filter, MoreHorizontal, MoreVertical, Eye, EyeOff,
  Mail, Phone, Video, MessageSquare, MessageCircle, Bell, BellRing, Megaphone, AtSign, Send, Inbox,
  Flag, Bookmark, Star, ThumbsUp, ThumbsDown, Quote, Lock, Unlock, Shield, ShieldCheck, Key, Fingerprint,
  AlertTriangle, Bug, Ban, UserX, UserCheck, CheckCircle, Scan, WifiOff, Database, CreditCard, Contact, Globe, Heart
} from 'lucide-react';

const iconMap = {
  "home": Home,
  "settings": Settings,
  "search": Search,
  "user": User,
  "plus": Plus,
  "minus": Minus,
  "close": X,
  "check": Check,
  "info": Info,
  "help": HelpCircle,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "arrow-up-left": ArrowUpLeft,
  "arrow-down-right": ArrowDownRight,
  "arrow-down-left": ArrowDownLeft,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "expand": Maximize2,
  "collapse": Minimize2,
  "swap-horizontal": ArrowLeftRight,
  "swap-vertical": ArrowUpDown,
  "refresh": RefreshCw,
  "redo": Redo2,
  "undo": Undo2,
  "long-arrow-right": MoveRight,
  "edit": Edit3,
  "delete": Trash2,
  "share": Share2,
  "download": Download,
  "upload": Upload,
  "copy": Copy,
  "duplicate": Layers,
  "move": Move,
  "link": Link,
  "unlink": Link2Off,
  "save": Save,
  "print": Printer,
  "export": ExternalLink,
  "import": FileDown,
  "filter": Filter,
  "sort": ArrowUpDown,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  "eye": Eye,
  "eye-off": EyeOff,
  "mail": Mail,
  "phone": Phone,
  "video": Video,
  "message": MessageSquare,
  "chat": MessageCircle,
  "bell": Bell,
  "notification": BellRing,
  "megaphone": Megaphone,
  "at": AtSign,
  "send": Send,
  "inbox": Inbox,
  "outbox": Mail,
  "flag": Flag,
  "bookmark": Bookmark,
  "star": Star,
  "star-outline": Star,
  "like": ThumbsUp,
  "dislike": ThumbsDown,
  "quote": Quote,
  "paper-plane": Send,
  "lock": Lock,
  "unlock": Unlock,
  "shield": Shield,
  "shield-check": ShieldCheck,
  "key": Key,
  "fingerprint": Fingerprint,
  "alert-triangle": AlertTriangle,
  "bug": Bug,
  "block": Ban,
  "user-lock": UserX,
  "user-shield": UserCheck,
  "secure": Lock,
  "verified": CheckCircle,
  "scan": Scan,
  "wifi-off": WifiOff,
  "database-lock": Database,
  "credit-card-lock": CreditCard,
  "id-card": Contact,
  "vpn": Globe,
};

const CATEGORIES = [
  { name: "All Icons", count: 1248 },
  { name: "General", count: 120 },
  { name: "Arrows", count: 48 },
  { name: "Navigation", count: 96 },
  { name: "Actions", count: 144 },
  { name: "Communication", count: 72 },
  { name: "Data & Analytics", count: 128 },
  { name: "E-commerce", count: 96 },
  { name: "Finance", count: 88 },
  { name: "Security", count: 64 },
  { name: "Users", count: 72 },
  { name: "Devices", count: 48 },
  { name: "Files & Documents", count: 64 },
  { name: "Editor", count: 56 },
  { name: "UI Elements", count: 72 },
  { name: "Status", count: 80 },
  { name: "Logos", count: 24 },
  { name: "Social", count: 40 },
  { name: "Weather", count: 24 },
  { name: "Maps", count: 32 },
  { name: "Time", count: 32 },
  { name: "Healthcare", count: 24 },
  { name: "Miscellaneous", count: 24 },
];

const ICON_GROUPS = [
  {
    category: "General",
    countLabel: "120",
    icons: [
      { name: "home" },
      { name: "settings" },
      { name: "search" },
      { name: "user" },
      { name: "plus" },
      { name: "minus" },
      { name: "close" },
      { name: "check" },
      { name: "info" },
      { name: "help" },
    ],
  },
  {
    category: "Arrows",
    countLabel: "48",
    icons: [
      { name: "arrow-up" },
      { name: "arrow-down" },
      { name: "arrow-left" },
      { name: "arrow-right" },
      { name: "arrow-up-right" },
      { name: "arrow-up-left" },
      { name: "arrow-down-right" },
      { name: "arrow-down-left" },
      { name: "chevron-up" },
      { name: "chevron-down" },
      { name: "chevron-left" },
      { name: "chevron-right" },
      { name: "expand" },
      { name: "collapse" },
      { name: "swap-horizontal" },
      { name: "swap-vertical" },
      { name: "refresh" },
      { name: "redo" },
      { name: "undo" },
      { name: "long-arrow-right" },
    ],
  },
  {
    category: "Actions",
    countLabel: "144",
    icons: [
      { name: "edit" },
      { name: "delete" },
      { name: "share" },
      { name: "download" },
      { name: "upload" },
      { name: "copy" },
      { name: "duplicate" },
      { name: "move" },
      { name: "link" },
      { name: "unlink" },
      { name: "save" },
      { name: "print" },
      { name: "export" },
      { name: "import" },
      { name: "filter" },
      { name: "sort" },
      { name: "more-horizontal" },
      { name: "more-vertical" },
      { name: "eye" },
      { name: "eye-off" },
    ],
  },
  {
    category: "Communication",
    countLabel: "72",
    icons: [
      { name: "mail" },
      { name: "phone" },
      { name: "video" },
      { name: "message" },
      { name: "chat" },
      { name: "bell" },
      { name: "notification" },
      { name: "megaphone" },
      { name: "at" },
      { name: "send" },
      { name: "inbox" },
      { name: "outbox" },
      { name: "flag" },
      { name: "bookmark" },
      { name: "star" },
      { name: "star-outline" },
      { name: "like" },
      { name: "dislike" },
      { name: "quote" },
      { name: "paper-plane" },
    ],
  },
  {
    category: "Security",
    countLabel: "64",
    icons: [
      { name: "lock" },
      { name: "unlock" },
      { name: "shield" },
      { name: "shield-check" },
      { name: "key" },
      { name: "fingerprint" },
      { name: "eye-off" },
      { name: "alert-triangle" },
      { name: "bug" },
      { name: "block" },
      { name: "user-lock" },
      { name: "user-shield" },
      { name: "secure" },
      { name: "verified" },
      { name: "scan" },
      { name: "wifi-off" },
      { name: "database-lock" },
      { name: "credit-card-lock" },
      { name: "id-card" },
      { name: "vpn" },
    ],
  },
];

const SIZES = [16, 20, 24, 32, 48];
const COLORS = ["#0F172A", "#64748B", "#4F46E5", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const LucideRenderer = ({ name, size = 24, color = "#0F172A", style = "Outline", strokeWidth = 2 }) => {
  const Comp = iconMap[name] || HelpCircle;
  const isFilled = style === "Filled";
  
  return (
    <Comp 
      size={size} 
      className="transition-all duration-150"
      style={{
        color: color,
        stroke: color,
        strokeWidth: isFilled ? 1.5 : strokeWidth,
        fill: isFilled && name !== 'star-outline' ? color : "none"
      }}
    />
  );
};

export default function DSIconLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All Icons");
  const [selectedIcon, setSelectedIcon] = useState({ name: "home" });
  const [selectedSize, setSelectedSize] = useState(20);
  const [selectedStyle, setSelectedStyle] = useState("Outline");
  const [selectedColor, setSelectedColor] = useState("#0F172A");
  const [selectedStroke, setSelectedStroke] = useState(2);
  const [codeTab, setCodeTab] = useState("React");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Name");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState({});

  const handleCopyCode = () => {
    let code = "";
    const compName = selectedIcon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
    
    if (codeTab === "React") {
      code = `import { ${compName} } from 'lucide-react';\n\n<${compName} size={${selectedSize}} strokeWidth={${selectedStroke}} ${selectedStyle === "Filled" ? 'fill="currentColor"' : ''} />`;
    } else if (codeTab === "HTML") {
      code = `<i data-lucide="${selectedIcon.name}" style="width: ${selectedSize}px; height: ${selectedSize}px;"></i>`;
    } else if (codeTab === "Vue") {
      code = `<template>\n  <${compName} :size="${selectedSize}" :stroke-width="${selectedStroke}" />\n</template>\n\n<script>\nimport { ${compName} } from 'lucide-react-vue';\nexport default {\n  components: { ${compName} }\n}\n<\/script>`;
    } else if (codeTab === "SVG") {
      code = `<svg xmlns="http://www.w3.org/2000/svg" width="${selectedSize}" height="${selectedSize}" viewBox="0 0 24 24" fill="${selectedStyle === "Filled" ? selectedColor : "none"}" stroke="${selectedColor}" stroke-width="${selectedStroke}" stroke-linecap="round" stroke-linejoin="round">\n  <!-- SVG Paths here -->\n</svg>`;
    }

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = (name) => {
    setFavorites(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const filteredGroups = useMemo(() => {
    return ICON_GROUPS.map(group => {
      // If we are looking for a specific category, filter out other groups
      if (activeCategory !== "All Icons" && group.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return null;
      }

      // Filter icons by search query
      let icons = group.icons.filter(icon => 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Sort icons
      if (sortOrder === "Name") {
        icons = [...icons].sort((a, b) => a.name.localeCompare(b.name));
      }

      if (icons.length === 0) return null;

      return {
        ...group,
        icons
      };
    }).filter(Boolean);
  }, [activeCategory, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS1 – ICON LIBRARY</h1>
          <p className="text-sm text-slate-500 mt-1">Consistent and scalable icon set used across the platform.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Header Search */}
          <div className="relative flex-1 md:w-64 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search icons..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ⌘ K
            </kbd>
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

      {/* KPI Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 items-stretch">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Icons</span>
            <span className="text-2xl font-bold text-slate-900 mt-2 block">1,248</span>
          </div>
          <span className="text-[11px] text-green-500 font-semibold mt-2 flex items-center gap-1">
            <span className="text-[14px]">↑</span> +24 this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Categories</span>
            <span className="text-2xl font-bold text-slate-900 mt-2 block">24</span>
          </div>
          <span className="text-[11px] text-green-500 font-semibold mt-2 flex items-center gap-1">
            <span className="text-[14px]">↑</span> +2 this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Icon Styles</span>
            <span className="text-2xl font-bold text-slate-900 mt-2 block">2</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2">
            Outline, Filled
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Formats</span>
            <span className="text-2xl font-bold text-slate-900 mt-2 block">5</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2">
            SVG, React, Vue, PNG, Figma
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Last Updated</span>
            <span className="text-sm font-bold text-slate-900 mt-2 block">Jun 06, 2024</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2">
            2 days ago
          </span>
        </div>

        <button className="flex flex-col items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold p-4 shadow-sm transition-colors text-center border-none">
          <Download className="w-5 h-5" />
          <span>Export Icon Set</span>
        </button>
      </section>

      {/* Filter and Toolbar */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-grow">
          {/* Inner Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search icons by name or keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full md:w-48 appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="All Icons">All Categories</option>
              {CATEGORIES.filter(c => c.name !== "All Icons").map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Style Dropdown */}
          <div className="relative">
            <select 
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full md:w-36 appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="All Styles">All Styles</option>
              <option value="Outline">Outline</option>
              <option value="Filled">Filled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-4 justify-between lg:justify-end border-t lg:border-none pt-3 lg:pt-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sort by:</span>
            <div className="relative">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-1 pr-6 py-1 font-semibold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="Name">Name</option>
                <option value="Newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-white text-indigo-600 font-bold shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <span className="material-symbols-outlined text-[18px] block">grid_view</span>
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-white text-indigo-600 font-bold shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <span className="material-symbols-outlined text-[18px] block">view_list</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start flex-grow">
        
        {/* Categories Sidebar */}
        <aside className="w-full lg:w-[240px] shrink-0 bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">Categories</h3>
          <nav className="space-y-0.5 overflow-y-auto max-h-[480px] lg:max-h-none pr-1">
            {CATEGORIES.map(category => {
              const isSelected = activeCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </nav>
          <button className="w-full mt-4 flex items-center justify-center gap-1.5 px-4 py-2 border border-dashed border-indigo-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Category</span>
          </button>
        </aside>

        {/* Icons Grid Content */}
        <div className="flex-1 space-y-8 min-w-0">
          {filteredGroups.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold">No icons found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            filteredGroups.map(group => (
              <div key={group.category} className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{group.category}</h2>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{group.countLabel}</span>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    View All
                  </button>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-10 gap-3">
                    {group.icons.map(icon => {
                      const isSelected = selectedIcon.name === icon.name;
                      const hasIcon = iconMap[icon.name] !== undefined;
                      return (
                        <button
                          key={icon.name}
                          onClick={() => setSelectedIcon(icon)}
                          className={`group p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all relative ${
                            isSelected
                              ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10"
                              : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm"
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            {hasIcon ? (
                              <LucideRenderer 
                                name={icon.name} 
                                size={22} 
                                color={isSelected ? selectedColor : "#334155"} 
                                style={selectedStyle}
                                strokeWidth={selectedStroke}
                              />
                            ) : (
                              <HelpCircle className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <span className={`text-[10px] text-center truncate w-full transition-colors ${
                            isSelected ? "text-indigo-600 font-semibold" : "text-slate-500 group-hover:text-slate-800"
                          }`}>
                            {icon.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // List Mode
                  <div className="divide-y divide-slate-100">
                    {group.icons.map(icon => {
                      const isSelected = selectedIcon.name === icon.name;
                      return (
                        <div 
                          key={icon.name}
                          onClick={() => setSelectedIcon(icon)}
                          className={`flex items-center justify-between py-2.5 px-4 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-md">
                              <LucideRenderer 
                                name={icon.name} 
                                size={18} 
                                color={selectedColor} 
                                style={selectedStyle}
                                strokeWidth={selectedStroke}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{icon.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <span className="text-xs font-mono text-slate-400">lucide-react: &lt;{icon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')} /&gt;</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(icon.name);
                              }}
                              className={`p-1.5 rounded-full hover:bg-slate-100 ${favorites[icon.name] ? 'text-red-500' : 'text-slate-300'}`}
                            >
                              <Heart className="w-4 h-4" fill={favorites[icon.name] ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Detail Panel Drawer */}
        <aside className="w-full lg:w-[340px] shrink-0 bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sticky top-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                {activeCategory === "All Icons" ? "General" : activeCategory}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-none">{selectedIcon.name}</h3>
            </div>
            
            <button 
              onClick={() => toggleFavorite(selectedIcon.name)}
              className={`p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm ${
                favorites[selectedIcon.name] ? "text-red-500 bg-red-50 border-red-100" : "text-slate-400 bg-white"
              }`}
            >
              <Heart className="w-4 h-4" fill={favorites[selectedIcon.name] ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Checkerboard Preview */}
          <div 
            className="h-44 rounded-xl border border-slate-200 flex items-center justify-center mb-6 relative shadow-inner overflow-hidden bg-white"
            style={{
              backgroundImage: "linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0"
            }}
          >
            <div className="p-8 rounded-lg bg-white/20 backdrop-blur-[1px] transition-all">
              <LucideRenderer 
                name={selectedIcon.name} 
                size={selectedSize * 2} // visually double it for detail preview
                color={selectedColor} 
                style={selectedStyle}
                strokeWidth={selectedStroke}
              />
            </div>
          </div>

          {/* Styles */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Styles</span>
            <div className="flex gap-2">
              {["Outline", "Filled"].map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
                    selectedStyle === style
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Sizes (px)</span>
            <div className="flex gap-1.5">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
                    selectedSize === size
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Stroke</span>
            <div className="flex gap-2">
              {[
                { label: "1.5px", val: 1.5 },
                { label: "2px", val: 2 },
                { label: "2.5px", val: 2.5 }
              ].map(stroke => (
                <button
                  key={stroke.val}
                  onClick={() => setSelectedStroke(stroke.val)}
                  className={`flex-grow py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
                    selectedStroke === stroke.val
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {stroke.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Colors</span>
            <div className="flex flex-wrap gap-2.5 items-center">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full shadow-inner border transition-all ${
                    selectedColor === color ? "ring-2 ring-indigo-500 ring-offset-2 scale-110" : "border-slate-300/40 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <button className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors text-xs font-semibold cursor-pointer">
                +
              </button>
            </div>
          </div>

          {/* Usage description */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Usage</span>
            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-lg">
              Used for representing {selectedIcon.name.replace('-', ' ')} indicator in navigational menus, status alerts, or active buttons across the web experience.
            </p>
          </div>

          {/* Accessibility table */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Accessibility</span>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2 bg-slate-50/50 text-slate-400 font-medium w-24">Name</td>
                    <td className="px-3 py-2 text-slate-700 font-semibold">{selectedIcon.name}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2 bg-slate-50/50 text-slate-400 font-medium">Aria Label</td>
                    <td className="px-3 py-2 text-slate-600">Go to {selectedIcon.name.replace('-', ' ')}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 bg-slate-50/50 text-slate-400 font-medium">Role</td>
                    <td className="px-3 py-2 text-slate-600">
                      <select className="bg-transparent border-none p-0 focus:outline-none text-slate-600 text-xs font-medium cursor-pointer">
                        <option>img</option>
                        <option>button</option>
                        <option>presentation</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Generation Tabs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Code</span>
              <button 
                onClick={handleCopyCode}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            
            <div className="flex border-b border-slate-200 mb-2">
              {["React", "HTML", "Vue", "SVG"].map(tab => (
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

            <pre className="bg-slate-900 text-slate-300 p-3.5 rounded-lg text-[10px] font-mono leading-normal overflow-x-auto select-all max-h-36 scrollbar-thin">
              {codeTab === "React" && `import { ${selectedIcon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')} } from 'lucide-react';\n\n<${selectedIcon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')} size={${selectedSize}} strokeWidth={${selectedStroke}} ${selectedStyle === "Filled" ? 'fill="currentColor"' : ''} />`}
              {codeTab === "HTML" && `<i data-lucide="${selectedIcon.name}" style="width: ${selectedSize}px; height: ${selectedSize}px;"></i>`}
              {codeTab === "Vue" && `<template>\n  <${selectedIcon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')} :size="${selectedSize}" :stroke-width="${selectedStroke}" />\n</template>\n\n<script>\nimport { ${selectedIcon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')} } from 'lucide-react-vue';\nexport default {\n  components: { ${selectedIcon.name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')} }\n}\n<\/script>`}
              {codeTab === "SVG" && `<svg xmlns="http://www.w3.org/2000/svg"\n  width="${selectedSize}"\n  height="${selectedSize}"\n  viewBox="0 0 24 24"\n  fill="${selectedStyle === "Filled" ? selectedColor : "none"}"\n  stroke="${selectedColor}"\n  stroke-width="${selectedStroke}"\n  stroke-linecap="round"\n  stroke-linejoin="round"\n>\n  <!-- paths -->\n</svg>`}
            </pre>
          </div>

          <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>View in Figma Library</span>
          </button>
        </aside>

      </div>

    </div>
  );
}
