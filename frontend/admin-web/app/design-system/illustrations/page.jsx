"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Heart, Download, Copy, Play, Eye, ChevronRight, ChevronLeft, ChevronDown,
  X, Check, AlertTriangle, Info, Bell, Settings, HelpCircle, Layers
} from "lucide-react";

// Premium vector-style illustration SVGs
const LaunchIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#EEF2FF" className="animate-pulse" />
    <circle cx="60" cy="60" r="35" fill="#E0E7FF" />
    <g transform="translate(25, 20)">
      {/* Flames */}
      <path d="M35 55 L35 70 L30 65 Z" fill="#F59E0B" />
      <path d="M35 55 L35 70 L40 65 Z" fill="#EF4444" />
      <path d="M35 52 L35 62 L32 58 Z" fill="#FCD34D" />
      {/* Rocket Body */}
      <path d="M25 50 C25 25, 35 10, 35 10 C35 10, 45 25, 45 50 Z" fill="#4F46E5" />
      <path d="M30 45 C30 30, 35 15, 35 15 C35 15, 40 30, 40 45 Z" fill="#6366F1" />
      {/* Wings */}
      <path d="M25 40 L15 48 L25 48 Z" fill="#4338CA" />
      <path d="M45 40 L55 48 L45 48 Z" fill="#4338CA" />
      {/* Nose Cone */}
      <path d="M32 18 C32 18, 35 10, 35 10 C35 10, 38 18, 38 18 Z" fill="#EF4444" />
      {/* Window */}
      <circle cx="35" cy="30" r="4" fill="#FFFFFF" />
      <circle cx="35" cy="30" r="2.5" fill="#38BDF8" />
    </g>
    {/* Space details */}
    <circle cx="30" cy="35" r="2" fill="#818CF8" />
    <circle cx="88" cy="42" r="3" fill="#818CF8" />
    <circle cx="45" cy="88" r="1.5" fill="#818CF8" />
    <circle cx="92" cy="78" r="1" fill="#818CF8" />
  </svg>
);

const WelcomeIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#EFF6FF" />
    <circle cx="60" cy="60" r="35" fill="#DBEAFE" />
    <g transform="translate(30, 25)">
      {/* Body / Torso */}
      <path d="M15 55 C15 45, 45 45, 45 55 Z" fill="#2563EB" />
      {/* Head */}
      <circle cx="30" cy="28" r="12" fill="#F87171" />
      {/* Hair */}
      <path d="M18 24 C18 14, 42 14, 42 24 C38 16, 22 16, 18 24 Z" fill="#1E293B" />
      {/* Hand waving */}
      <path d="M44 48 C44 48, 52 35, 52 32 C52 29, 48 28, 48 30 C48 30, 42 42, 42 45 Z" fill="#F87171" />
      {/* Sparkles */}
      <path d="M50 15 L52 10 L54 15 L59 17 L54 19 L52 24 L50 19 L45 17 Z" fill="#F59E0B" />
    </g>
  </svg>
);

const EmptyBoxIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#F1F5F9" />
    <g transform="translate(30, 30)">
      {/* 3D Box Open */}
      {/* Back flap */}
      <path d="M10 20 L30 10 L50 20 L30 30 Z" fill="#CBD5E1" />
      {/* Left side */}
      <path d="M10 20 L30 30 L30 55 L10 45 Z" fill="#94A3B8" />
      {/* Right side */}
      <path d="M30 30 L50 20 L50 45 L30 55 Z" fill="#64748B" />
      {/* Opened Flaps */}
      <path d="M10 20 L5 8 L25 18 Z" fill="#E2E8F0" />
      <path d="M50 20 L55 8 L35 18 Z" fill="#E2E8F0" />
      {/* Empty space lines inside */}
      <path d="M22 21 L38 13" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
    </g>
  </svg>
);

const NoResultsIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#F0FDF4" />
    <g transform="translate(35, 25)">
      {/* Sheet of paper */}
      <rect x="5" y="10" width="36" height="48" rx="4" fill="#FFFFFF" stroke="#86EFAC" strokeWidth="2" />
      <line x1="12" y1="22" x2="34" y2="22" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="32" x2="28" y2="32" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="42" x2="30" y2="42" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Magnifying Glass */}
      <g transform="translate(18, 22)">
        <circle cx="16" cy="16" r="10" fill="#FFFFFF" stroke="#16A34A" strokeWidth="3" />
        <line x1="23" y1="23" x2="34" y2="34" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
      </g>
    </g>
  </svg>
);

const SuccessIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#ECFDF5" />
    <circle cx="60" cy="60" r="35" fill="#D1FAE5" />
    {/* Large check badge */}
    <g transform="translate(32, 32)">
      <circle cx="28" cy="28" r="24" fill="#10B981" />
      <path d="M18 28 L25 35 L38 20" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
    {/* Sparkles */}
    <path d="M22 35 L24 32 L26 35 L29 36 L26 37 L24 40 L22 37 L19 36 Z" fill="#F59E0B" />
    <path d="M90 28 L91 25 L93 28 L96 29 L93 30 L91 33 L90 30 L87 29 Z" fill="#3B82F6" />
    <path d="M82 85 L83 82 L85 85 L88 86 L85 87 L83 90 L82 87 L79 86 Z" fill="#EF4444" />
  </svg>
);

const Error404Illustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#FEF2F2" />
    <g transform="translate(25, 30)">
      {/* 404 Text */}
      <text x="0" y="32" fontSize="26" fontWeight="bold" fill="#EF4444" fontFamily="sans-serif">404</text>
      {/* Broken path line under */}
      <path d="M2 42 L25 42 M35 42 L68 42" stroke="#FCA5A5" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx="30" cy="42" r="3.5" fill="#EF4444" />
    </g>
    {/* Warning icons */}
    <path d="M92 35 L96 42 L88 42 Z" fill="#EF4444" opacity="0.6" />
  </svg>
);

const ServerErrorIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#FFFBEB" />
    <g transform="translate(35, 25)">
      {/* Servers stack */}
      <rect x="5" y="5" width="40" height="15" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" fill="#10B981" />
      <circle cx="20" cy="12" r="2.5" fill="#94A3B8" />

      <rect x="5" y="24" width="40" height="15" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
      <circle cx="12" cy="31" r="2.5" fill="#EF4444" />
      <circle cx="20" cy="31" r="2.5" fill="#EF4444" />
      
      {/* Warning Triangle Overlay */}
      <g transform="translate(22, 18)">
        <polygon points="12,2 22,20 2,20" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
        <text x="10" y="16" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">!</text>
      </g>
    </g>
  </svg>
);

const MaintenanceIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#FFF7ED" />
    <g transform="translate(30, 30)">
      {/* Large Gear */}
      <circle cx="25" cy="25" r="14" fill="#FB923C" />
      <circle cx="25" cy="25" r="7" fill="#FFF7ED" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <rect key={deg} x="22" y="5" width="6" height="40" rx="1.5" fill="#FB923C" transform={`rotate(${deg} 25 25)`} />
      ))}
      <circle cx="25" cy="25" r="10" fill="#FB923C" />
      <circle cx="25" cy="25" r="6" fill="#FFF7ED" />
      
      {/* Small Gear */}
      <g transform="translate(25, 25)">
        <circle cx="20" cy="20" r="9" fill="#94A3B8" />
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <rect key={deg} x="18" y="7" width="4" height="26" rx="1" fill="#94A3B8" transform={`rotate(${deg} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="6" fill="#94A3B8" />
        <circle cx="20" cy="20" r="3" fill="#FFF7ED" />
      </g>
    </g>
  </svg>
);

const SecurityIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#F5F3FF" />
    <circle cx="60" cy="60" r="35" fill="#EDE9FE" />
    <g transform="translate(38, 28)">
      {/* Shield */}
      <path d="M22 2 C22 2, 40 6, 40 18 C40 32, 22 42, 22 42 C22 42, 4 32, 4 18 C4 6, 22 2, 22 2 Z" fill="#6366F1" />
      <path d="M22 5 C22 5, 36 8.5, 36 18 C36 29.5, 22 38, 22 38 C22 38, 8 29.5, 8 18 C8 8.5, 22 5, 22 5 Z" fill="#818CF8" />
      {/* Padlock */}
      <rect x="16" y="20" width="12" height="9" rx="2" fill="#FFFFFF" />
      <path d="M19 20 L19 16 C19 14.5, 20.5 13, 22 13 C23.5 13, 25 14.5, 25 16 L25 20" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      <circle cx="22" cy="24" r="1.5" fill="#6366F1" />
    </g>
  </svg>
);

const DataAnalysisIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#F0F9FF" />
    <g transform="translate(32, 32)">
      {/* Chart outline grid */}
      <rect x="2" y="2" width="52" height="52" rx="6" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
      {/* Graph bars */}
      <rect x="10" y="28" width="6" height="18" rx="1.5" fill="#93C5FD" />
      <rect x="20" y="16" width="6" height="30" rx="1.5" fill="#3B82F6" />
      <rect x="30" y="22" width="6" height="24" rx="1.5" fill="#93C5FD" />
      <rect x="40" y="10" width="6" height="36" rx="1.5" fill="#1D4ED8" />
      {/* Trending line */}
      <path d="M13 25 L23 12 L33 19 L43 6" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="43" cy="6" r="3" fill="#F59E0B" />
    </g>
  </svg>
);

const PeopleIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#FDF4FF" />
    {/* Left person */}
    <g transform="translate(20, 40)" opacity="0.8">
      <circle cx="18" cy="18" r="10" fill="#D946EF" />
      <path d="M5 40 C5 32, 31 32, 31 40 Z" fill="#E879F9" />
    </g>
    {/* Right person */}
    <g transform="translate(62, 40)" opacity="0.8">
      <circle cx="18" cy="18" r="10" fill="#06B6D4" />
      <path d="M5 40 C5 32, 31 32, 31 40 Z" fill="#22D3EE" />
    </g>
    {/* Center main person */}
    <g transform="translate(38, 30)">
      <circle cx="22" cy="20" r="12" fill="#4F46E5" />
      <path d="M6 48 C6 37, 38 37, 38 48 Z" fill="#6366F1" />
    </g>
  </svg>
);

const EcommerceIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#ECFDF5" />
    <g transform="translate(30, 30)">
      {/* Shopping Cart */}
      <path d="M5 10 L12 10 L22 35 L48 35 L55 18 L15 18" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="24" cy="45" r="5" fill="#047857" />
      <circle cx="44" cy="45" r="5" fill="#047857" />
      {/* Small package box inside cart */}
      <rect x="20" y="21" width="18" height="12" rx="1.5" fill="#A7F3D0" />
    </g>
  </svg>
);

const FinanceIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#FEFCE8" />
    <g transform="translate(30, 35)">
      {/* Wallet */}
      <rect x="5" y="10" width="50" height="32" rx="6" fill="#EAB308" />
      <path d="M5 16 L55 16" stroke="#CA8A04" strokeWidth="2.5" />
      <rect x="42" y="20" width="15" height="12" rx="2" fill="#CA8A04" />
      <circle cx="49" cy="26" r="2.5" fill="#FEFCE8" />
      {/* Gold coins spilling */}
      <g transform="translate(10, -10)">
        <circle cx="12" cy="12" r="7" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
        <circle cx="22" cy="8" r="7" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
      </g>
    </g>
  </svg>
);

const DocumentIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#F8FAFC" />
    <g transform="translate(38, 26)">
      {/* Document Sheet */}
      <rect x="2" y="2" width="38" height="54" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
      {/* Dogear corner */}
      <path d="M30 2 L40 12 L30 12 Z" fill="#94A3B8" />
      <line x1="10" y1="20" x2="30" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="30" x2="30" y2="30" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="40" x2="22" y2="40" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      {/* Pen */}
      <g transform="translate(24, 28) rotate(-45)">
        <rect x="0" y="0" width="6" height="24" rx="1" fill="#4F46E5" />
        <polygon points="0,0 3,-6 6,0" fill="#EF4444" />
      </g>
    </g>
  </svg>
);

const MessageIllustration = () => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
    <circle cx="60" cy="60" r="45" fill="#EEF2FF" />
    <g transform="translate(30, 32)">
      {/* Envelope */}
      <rect x="5" y="10" width="50" height="34" rx="4" fill="#818CF8" />
      {/* Back flap lines */}
      <path d="M5 10 L30 28 L55 10" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Paper plane flyer */}
      <g transform="translate(38, -12) scale(0.8)">
        <polygon points="2,12 22,2 14,22 11,14" fill="#4F46E5" />
      </g>
    </g>
  </svg>
);

const illustrationRenderers = {
  "Launch": LaunchIllustration,
  "Welcome": WelcomeIllustration,
  "Empty Box": EmptyBoxIllustration,
  "No Results": NoResultsIllustration,
  "Success": SuccessIllustration,
  "Error 404": Error404Illustration,
  "Server Error": ServerErrorIllustration,
  "Maintenance": MaintenanceIllustration,
  "Security": SecurityIllustration,
  "Data Analysis": DataAnalysisIllustration,
  "People": PeopleIllustration,
  "E-commerce": EcommerceIllustration,
  "Finance": FinanceIllustration,
  "Document": DocumentIllustration,
  "Message": MessageIllustration,
};

const ILLUSTRATIONS = [
  { name: "Launch", desc: "Represents getting started, launching or setting things up.", category: "Onboarding", bg: "#EEF2FF" },
  { name: "Welcome", desc: "Friendly welcome illustration for greetings and onboarding.", category: "Onboarding", bg: "#EFF6FF" },
  { name: "Empty Box", desc: "Indicates no data or empty state for content.", category: "Empty States", bg: "#F1F5F9" },
  { name: "No Results", desc: "Shown when a search or filter doesn't return results.", category: "Empty States", bg: "#F0FDF4" },
  { name: "Success", desc: "Indicates successful completion of an action.", category: "Success", bg: "#ECFDF5" },
  { name: "Error 404", desc: "Page not found or missing resource illustration.", category: "Error", bg: "#FEF2F2" },
  { name: "Server Error", desc: "Used for server error or unexpected failures.", category: "Error", bg: "#FFFBEB" },
  { name: "Maintenance", desc: "Shown when system is under maintenance.", category: "Maintenance", bg: "#FFF7ED" },
  { name: "Security", desc: "Used for authentication and security related states.", category: "Security", bg: "#F5F3FF" },
  { name: "Data Analysis", desc: "Represents data insights and analytics.", category: "Data", bg: "#F0F9FF" },
  { name: "People", desc: "Represents users, teams or communities.", category: "People", bg: "#FDF4FF" },
  { name: "E-commerce", desc: "Used in shopping, orders and storefront flows.", category: "E-commerce", bg: "#ECFDF5" },
  { name: "Finance", desc: "Represents payments, wallet or transactions.", category: "Finance", bg: "#FEFCE8" },
  { name: "Document", desc: "Used for documents, files and content.", category: "General", bg: "#F8FAFC" },
  { name: "Message", desc: "Used for messages, notifications or inbox.", category: "Communication", bg: "#EEF2FF" },
];

const TABS = ["All Illustrations", "Onboarding", "Empty States", "Success", "Error", "Maintenance", "Security", "Data", "People", "E-commerce", "Finance"];

export default function IllustrationsPage() {
  const [activeTab, setActiveTab] = useState("All Illustrations");
  const [selectedIllustration, setSelectedIllustration] = useState(ILLUSTRATIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState("Filled");
  const [selectedFormat, setSelectedFormat] = useState("SVG");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All Categories");
  const [activeStyleFilter, setActiveStyleFilter] = useState("All Styles");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (name) => {
    setFavorites(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDownload = () => {
    // Generate a simple dummy file download for high fidelity
    const content = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><!-- ${selectedIllustration.name} illustration --></svg>`;
    const blob = new Blob([content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedIllustration.name.toLowerCase().replace(" ", "_")}.${selectedFormat.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    const code = `<svg viewBox="0 0 120 120" fill="${selectedStyle === "Filled" ? "#4F46E5" : "none"}" stroke="#4F46E5">\n  <!-- ${selectedIllustration.name} SVG Paths -->\n</svg>`;
    navigator.clipboard.writeText(code);
    alert("Copied SVG code to clipboard!");
  };

  // Filtered illustrations
  const filteredIllustrations = useMemo(() => {
    return ILLUSTRATIONS.filter(item => {
      // 1. Category Tab Filter
      if (activeTab !== "All Illustrations" && item.category !== activeTab) {
        return false;
      }
      
      // 2. Toolbar Category Filter
      if (activeCategoryFilter !== "All Categories" && item.category !== activeCategoryFilter) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.desc.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === "Name") {
        return a.name.localeCompare(b.name);
      }
      return 0; // Default order (newest / array layout)
    });
  }, [activeTab, activeCategoryFilter, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans p-6 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DS1 – ILLUSTRATIONS</h1>
          <p className="text-sm text-slate-500 mt-1">A consistent set of illustrations to communicate ideas and enhance user experience.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Header Search */}
          <div className="relative flex-grow sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search illustrations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          
          <button className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold px-4 py-2 shadow-sm transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Illustrations</span>
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide mb-6">
        <div className="flex space-x-1 border-b border-slate-200 w-full min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveCategoryFilter("All Categories"); // reset toolbar filter to avoid conflicting
              }}
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
      </div>

      {/* Main Grid + Sidebar Detail Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start flex-grow">
        
        {/* Main Grid Content */}
        <div className="flex-grow space-y-6 w-full lg:min-w-0">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow">
              <div className="relative flex-grow max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search illustrations by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Category Select */}
              <div className="relative">
                <select 
                  value={activeCategoryFilter}
                  onChange={(e) => {
                    setActiveCategoryFilter(e.target.value);
                    setActiveTab("All Illustrations"); // reset tab to avoid conflict
                  }}
                  className="w-full sm:w-40 appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All Categories">All Categories</option>
                  {TABS.filter(t => t !== "All Illustrations").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Style Select */}
              <div className="relative">
                <select 
                  value={activeStyleFilter}
                  onChange={(e) => setActiveStyleFilter(e.target.value)}
                  className="w-full sm:w-32 appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All Styles">All Styles</option>
                  <option value="Filled">Filled</option>
                  <option value="Outline">Outline</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-none pt-3 sm:pt-0">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none pl-1 pr-6 py-1 font-semibold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    <option value="Newest">Newest</option>
                    <option value="Name">Name</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Grid Toggle Buttons */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button className="p-2 bg-white text-indigo-600 font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[18px] block">grid_view</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-[18px] block">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredIllustrations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold">No illustrations found</p>
              <p className="text-sm text-slate-400 mt-1">Try broadening your search term or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredIllustrations.map(ill => {
                const isSelected = selectedIllustration.name === ill.name;
                const IllComponent = illustrationRenderers[ill.name] || LaunchIllustration;
                
                return (
                  <div
                    key={ill.name}
                    onClick={() => setSelectedIllustration(ill)}
                    className={`group text-left bg-white rounded-xl border p-4 flex flex-col justify-between h-72 transition-all hover:shadow-md hover:border-indigo-200 cursor-pointer relative ${
                      isSelected
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/5"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Visual Preview */}
                    <div 
                      className="h-32 rounded-lg flex items-center justify-center mb-4 w-full relative overflow-hidden transition-all group-hover:scale-[1.02]"
                      style={{ backgroundColor: ill.bg }}
                    >
                      <IllComponent />
                    </div>

                    {/* Metadata */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className={`text-sm font-bold leading-tight transition-colors ${
                          isSelected ? "text-indigo-600" : "text-slate-800 group-hover:text-indigo-600"
                        }`}>
                          {ill.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {ill.desc}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ill.category === "Onboarding" ? "bg-purple-50 text-purple-600" :
                          ill.category === "Empty States" ? "bg-slate-50 text-slate-500" :
                          ill.category === "Success" ? "bg-green-50 text-green-600" :
                          ill.category === "Error" ? "bg-red-50 text-red-600" :
                          ill.category === "Maintenance" ? "bg-orange-50 text-orange-600" :
                          ill.category === "Security" ? "bg-indigo-50 text-indigo-600" :
                          "bg-blue-50 text-blue-600"
                        }`}>
                          {ill.category}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(ill.name);
                            }}
                            className={`p-1 rounded hover:bg-slate-100 ${favorites[ill.name] ? 'text-red-500' : 'text-slate-300'}`}
                          >
                            <Heart className="w-3.5 h-3.5" fill={favorites[ill.name] ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-1">
              <button className="p-1.5 rounded-md text-slate-400 border border-slate-200 cursor-not-allowed bg-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-semibold shadow-sm">1</button>
              <button className="px-3 py-1 hover:bg-slate-50 border border-transparent rounded-md text-xs font-semibold text-slate-500">2</button>
              <button className="px-3 py-1 hover:bg-slate-50 border border-transparent rounded-md text-xs font-semibold text-slate-500">3</button>
              <button className="px-3 py-1 hover:bg-slate-50 border border-transparent rounded-md text-xs font-semibold text-slate-500">4</button>
              <button className="px-3 py-1 hover:bg-slate-50 border border-transparent rounded-md text-xs font-semibold text-slate-500">5</button>
              <span className="px-1.5 text-slate-400 text-xs">...</span>
              <button className="px-3 py-1 hover:bg-slate-50 border border-transparent rounded-md text-xs font-semibold text-slate-500">14</button>
              <button className="p-1.5 rounded-md text-slate-600 hover:bg-slate-50 border border-slate-200 bg-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Showing 1 to 15 of 200 illustrations
            </span>
          </div>

        </div>

        {/* Right Detail Panel Drawer */}
        <aside className="w-full lg:w-[340px] shrink-0 bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sticky top-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                {selectedIllustration.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-none">{selectedIllustration.name}</h3>
            </div>
            
            <button 
              onClick={() => toggleFavorite(selectedIllustration.name)}
              className={`p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm ${
                favorites[selectedIllustration.name] ? "text-red-500 bg-red-50 border-red-100" : "text-slate-400 bg-white"
              }`}
            >
              <Heart className="w-4 h-4" fill={favorites[selectedIllustration.name] ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Checkerboard Preview */}
          <div 
            className="h-44 rounded-xl border border-slate-200 flex flex-col items-center justify-center mb-4 relative shadow-inner overflow-hidden"
            style={{ 
              backgroundColor: selectedIllustration.bg,
              backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.015) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.015) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.015) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.015) 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0"
            }}
          >
            {React.createElement(illustrationRenderers[selectedIllustration.name] || LaunchIllustration)}
          </div>
          
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 mb-6 cursor-pointer">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Full Size</span>
          </button>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Description</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-lg">
                {selectedIllustration.desc}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Category</span>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                {selectedIllustration.category}
              </span>
            </div>

            {/* Styles */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Style</span>
              <div className="flex gap-2">
                {["Filled", "Outline"].map(style => (
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

            {/* Formats */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Formats</span>
              <div className="flex gap-1.5">
                {["SVG", "PNG", "JPG", "WebP"].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
                      selectedFormat === fmt
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Usage</span>
              <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-lg">
                Use this illustration in onboarding flows, welcome screens, or empty state dashboards to create visual engagement and context for the user.
              </p>
            </div>
            
            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button 
                onClick={handleDownload}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {selectedFormat}</span>
              </button>
              
              <button 
                onClick={handleCopyCode}
                className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy SVG Code</span>
              </button>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
