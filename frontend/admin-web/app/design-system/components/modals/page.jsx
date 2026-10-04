"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Trash2, Image,
  ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, RefreshCw, 
  Layers, Settings, Sliders, Smartphone
} from "lucide-react";

const TABS = ["Overview", "Modal Types", "Sizes", "Anatomy", "Behavior", "Best Practices"];

const GUIDELINES = [
  { label: "Use modals for focused tasks and important actions." },
  { label: "Keep content clear, concise and actionable." },
  { label: "Provide clear primary and secondary actions." },
  { label: "Don't use modals for non-essential information." },
  { label: "Allow users to close or cancel the modal." }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Trap focus within the modal." },
  { label: "Close on ESC key press." },
  { label: "Return focus to the trigger element on close." },
  { label: "Use aria-modal=\"true\" and role=\"dialog\"." },
  { label: "Provide aria-labelledby and aria-describedby." }
];

const CODE_EXAMPLE_HTML = `<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal">
    <div class="modal-header">
      <h2 id="modal-title" class="modal-title">Modal Title</h2>
      <button class="modal-close" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline">Cancel</button>
      <button class="btn btn-primary">Save</button>
    </div>
  </div>
</div>`;

const IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
];

export default function DSModalsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal open states
  const [activeModal, setActiveModal] = useState(null); // 'standard', 'confirm', 'alert', 'form', 'media', 'fullscreen'
  
  // Carousel index for media modal
  const [imageIndex, setImageIndex] = useState(0);

  // Form modal inputs
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("Audio");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!productName) {
      triggerToast("Product Name is required!");
      return;
    }
    triggerToast(`Added product: ${productName} (${productCategory})`);
    setProductName("");
    setActiveModal(null);
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DS3 – MODAL & DIALOGS</h1>
            <span className="material-symbols-outlined text-[28px] text-indigo-650 font-bold bg-indigo-50 p-1.5 rounded-lg">layers</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Modals and dialogs display important content and require user interaction.</p>
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
                  <span className="material-symbols-outlined text-[24px] block font-bold">layers</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">6</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Modal Types</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">zoom_out_map</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">4</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Sizes</span>
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

          {/* MODAL TYPES Section */}
          {(activeTab === "Overview" || activeTab === "Modal Types") && (
            <section className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Modal Types</h3>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">Click templates to preview</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 items-stretch">
                
                {/* 1. Standard Modal */}
                <div 
                  onClick={() => setActiveModal('standard')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer min-h-[260px]"
                >
                  <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 space-y-2.5">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                      <span className="text-[9px] font-bold text-slate-700">Modal Title</span>
                      <X className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                    <p className="text-[8px] text-slate-400 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <div className="flex gap-1 justify-end">
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[7px] text-slate-500 font-bold">Cancel</span>
                      <span className="px-2 py-0.5 bg-indigo-650 text-white rounded text-[7px] font-bold">Save</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Standard Modal</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Used for general information or actions.</span>
                  </div>
                </div>

                {/* 2. Confirmation Dialog */}
                <div 
                  onClick={() => setActiveModal('confirm')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer min-h-[260px]"
                >
                  <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 space-y-2.5 text-center">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500 text-[10px] font-bold">?</div>
                    <span className="text-[9px] font-bold text-slate-800 block">Are you sure you want to delete this item?</span>
                    <div className="flex gap-1 justify-center">
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[7px] text-slate-500 font-bold">Cancel</span>
                      <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[7px] font-bold">Delete</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Confirmation Dialog</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Used to confirm destructive or important actions.</span>
                  </div>
                </div>

                {/* 3. Alert Dialog */}
                <div 
                  onClick={() => setActiveModal('alert')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer min-h-[260px]"
                >
                  <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 space-y-2.5 text-center">
                    <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto" />
                    <span className="text-[8px] font-bold text-slate-800 block">Something went wrong! Please try again later.</span>
                    <span className="px-3 py-0.5 bg-indigo-650 text-white rounded text-[7px] font-bold inline-block mx-auto">OK</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Alert Dialog</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Used to show alerts or important messages.</span>
                  </div>
                </div>

                {/* 4. Form Modal */}
                <div 
                  onClick={() => setActiveModal('form')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer min-h-[260px]"
                >
                  <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 space-y-2 text-[8px]">
                    <span className="font-bold text-slate-800 block border-b border-slate-100 pb-0.5">Add New Product</span>
                    <div>
                      <span className="text-[6px] text-slate-400 font-bold block mb-0.5">Product Name</span>
                      <div className="h-4 bg-white border border-slate-200 rounded w-full"></div>
                    </div>
                    <div>
                      <span className="text-[6px] text-slate-400 font-bold block mb-0.5">Category</span>
                      <div className="h-4 bg-white border border-slate-200 rounded w-full"></div>
                    </div>
                    <div className="flex gap-1 justify-end pt-1">
                      <span className="px-1.5 py-0.5 bg-white border border-slate-205 rounded text-[6px]">Cancel</span>
                      <span className="px-1.5 py-0.5 bg-indigo-650 text-white rounded text-[6px]">Add</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Form Modal</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Contains forms for data collection or input.</span>
                  </div>
                </div>

                {/* 5. Image/Media Modal */}
                <div 
                  onClick={() => setActiveModal('media')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer min-h-[260px]"
                >
                  <div className="border border-slate-150 rounded-xl p-1 bg-slate-50/50 relative overflow-hidden">
                    <div className="h-20 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-[8px] font-bold">
                      Image
                    </div>
                    <X className="absolute top-2 right-2 w-2 h-2 text-white" />
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Image/Media Modal</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Used to display images, videos or rich media.</span>
                  </div>
                </div>

                {/* 6. Fullscreen Modal */}
                <div 
                  onClick={() => setActiveModal('fullscreen')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer min-h-[260px]"
                >
                  <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 h-[88px] flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <div className="h-1.5 bg-slate-250 rounded w-1/3"></div>
                      <X className="w-2.5 h-2.5 text-slate-450" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-slate-200 rounded w-full"></div>
                      <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-850 block leading-tight">Fullscreen Modal</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Used for immersive content or complex workflows.</span>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* MODAL SIZES Section */}
          {(activeTab === "Overview" || activeTab === "Sizes") && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Modal Sizes</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                
                {/* Small */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border border-slate-150 rounded-xl p-3 bg-slate-50 flex items-center justify-center">
                      <div className="w-1/2 border border-slate-200 bg-white rounded-lg p-2.5 shadow-sm space-y-2 text-center">
                        <div className="h-2 bg-slate-250 rounded w-3/4 mx-auto"></div>
                        <div className="h-1.5 bg-slate-150 rounded w-1/3 mx-auto"></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-tight">Small</span>
                      <span className="text-xs font-bold text-indigo-700 block mt-1">320px max width</span>
                      <p className="text-[10px] text-slate-450 font-medium mt-1.5">For short content and mobile.</p>
                    </div>
                  </div>
                </div>

                {/* Medium (Default) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border border-slate-150 rounded-xl p-3 bg-slate-50 flex items-center justify-center">
                      <div className="w-3/4 border border-slate-200 bg-white rounded-lg p-2.5 shadow-sm space-y-2 text-center">
                        <div className="h-2 bg-slate-250 rounded w-1/2 mx-auto"></div>
                        <div className="h-1.5 bg-slate-150 rounded w-1/4 mx-auto"></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-tight">Medium (Default)</span>
                      <span className="text-xs font-bold text-indigo-700 block mt-1">600px max width</span>
                      <p className="text-[10px] text-slate-450 font-medium mt-1.5">Default size for most use cases.</p>
                    </div>
                  </div>
                </div>

                {/* Large */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border border-slate-150 rounded-xl p-3 bg-slate-50 flex items-center justify-center">
                      <div className="w-full border border-slate-200 bg-white rounded-lg p-2.5 shadow-sm space-y-2 text-center">
                        <div className="h-2 bg-slate-250 rounded w-1/3 mx-auto"></div>
                        <div className="h-1.5 bg-slate-150 rounded w-1/6 mx-auto"></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-tight">Large</span>
                      <span className="text-xs font-bold text-indigo-700 block mt-1">800px max width</span>
                      <p className="text-[10px] text-slate-450 font-medium mt-1.5">For detailed content or complex forms.</p>
                    </div>
                  </div>
                </div>

                {/* Extra Large (Fullscreen) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border border-slate-150 rounded-xl p-3 bg-slate-50 flex items-center justify-center">
                      <div className="w-full h-11 border border-slate-200 bg-white rounded-lg p-2 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-0.5">
                          <div className="h-1.5 bg-slate-250 rounded w-1/4"></div>
                          <X className="w-1.5 h-1.5 text-slate-400" />
                        </div>
                        <div className="h-1 bg-slate-150 rounded w-full"></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-tight">Extra Large (Fullscreen)</span>
                      <span className="text-xs font-bold text-indigo-700 block mt-1">100% width & height</span>
                      <p className="text-[10px] text-slate-450 font-medium mt-1.5">For complex workflows or immersive experience.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ALERT DIALOG EXAMPLES Section */}
          {(activeTab === "Overview" || activeTab === "Modal Types") && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alert Dialog Examples</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                
                {/* Success Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between text-center items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                      <Check className="w-5 h-5 font-bold" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">Success!</span>
                    <p className="text-xs text-slate-500 leading-normal max-w-[200px]">Your changes have been saved successfully.</p>
                  </div>
                  <button onClick={() => triggerToast("Success Ack")} className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">
                    OK
                  </button>
                </div>

                {/* Warning Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between text-center items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3.5">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner border border-amber-100">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">Warning!</span>
                    <p className="text-xs text-slate-500 leading-normal max-w-[200px]">There are unsaved changes. Do you want to continue?</p>
                  </div>
                  <div className="mt-6 flex gap-2 w-full justify-center">
                    <button onClick={() => triggerToast("Cancelled warning")} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold bg-white transition-colors">Cancel</button>
                    <button onClick={() => triggerToast("Continued")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">Continue</button>
                  </div>
                </div>

                {/* Error Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between text-center items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3.5">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner border border-red-100">
                      <X className="w-5 h-5 font-bold" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">Error!</span>
                    <p className="text-xs text-slate-500 leading-normal max-w-[200px]">Something went wrong. Please try again.</p>
                  </div>
                  <button onClick={() => triggerToast("Dismissed Error")} className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">
                    OK
                  </button>
                </div>

                {/* Information Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between text-center items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3.5">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                      <span className="font-bold text-sm">i</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">Information</span>
                    <p className="text-xs text-slate-500 leading-normal max-w-[200px]">This is some useful information for the user.</p>
                  </div>
                  <button onClick={() => triggerToast("Ack Info")} className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">
                    Got it
                  </button>
                </div>

              </div>
            </section>
          )}

          {/* Modal Anatomy & Behavior Section */}
          {(activeTab === "Anatomy" || activeTab === "Behavior") && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Modal Anatomy */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Modal Anatomy</h3>
                
                <div className="border border-slate-150 rounded-xl bg-slate-50/50 p-4 space-y-3">
                  <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-md space-y-4 max-w-xs mx-auto relative">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2 relative">
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-indigo-650 text-white flex items-center justify-center rounded-full text-[8px] font-bold">1</span>
                      <span className="font-bold text-slate-800 text-xs">Modal Title</span>
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="relative py-2">
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-indigo-650 text-white flex items-center justify-center rounded-full text-[8px] font-bold">2</span>
                      <div className="h-10 bg-slate-100 rounded w-full flex items-center justify-center text-[10px] text-slate-400 font-semibold">Body Content</div>
                    </div>
                    <div className="flex gap-2 justify-end border-t border-slate-100 pt-3 relative">
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-indigo-650 text-white flex items-center justify-center rounded-full text-[8px] font-bold">3</span>
                      <div className="h-6 bg-slate-100 rounded w-12"></div>
                      <div className="h-6 bg-indigo-100 rounded w-12"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-normal">
                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-indigo-650 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <h4 className="font-bold text-slate-800">Header & Title</h4>
                      <p className="text-slate-500 mt-0.5">Tells the user what the modal is about and provides a close action.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-indigo-650 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <h4 className="font-bold text-slate-800">Body Content</h4>
                      <p className="text-slate-500 mt-0.5">The main messaging, form inputs, lists or media displaying inside the modal.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-indigo-650 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <h4 className="font-bold text-slate-800">Footer Actions</h4>
                      <p className="text-slate-500 mt-0.5">Contains primary and secondary action buttons to proceed or dismiss.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Behavior/Transitions */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Transitions & Behavior</h3>
                
                <div className="border border-slate-150 rounded-xl bg-slate-50/50 p-4 flex flex-col justify-center items-center h-48 gap-4">
                  <button onClick={() => {
                    setActiveModal('standard');
                    triggerToast("Triggered with Fade & Scale Animation");
                  }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all border-none">
                    Trigger Animated Modal
                  </button>
                  <span className="text-[10px] text-slate-400 font-semibold">Standard layout uses backdrop fade + scale-up transitions.</span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600">
                  <p>• <b>Backdrop:</b> A semi-transparent overlay (<code>bg-slate-900/60</code> with <code>backdrop-blur-sm</code>) dims background content to highlight the modal.</p>
                  <p>• <b>Dismissal:</b> Users can close modals by clicking the overlay backdrop, pressing the close "X" icon, clicking the Cancel button, or pressing the <b>ESC</b> key.</p>
                  <p>• <b>Focus Trap:</b> Keyboard focus is trapped within the active modal boundary to keep accessibility standards compliant.</p>
                </div>
              </section>
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Modal Guidelines</h4>
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
                "Create, edit or delete forms.",
                "Confirm critical or destructive actions.",
                "Display important alerts or notifications.",
                "Show images, videos or rich media.",
                "Step-by-step workflows and wizards."
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

      {/* OVERLAY DIALOGS (REAL ACTIVE MODALS IN PORTAL OVERLAYS) */}
      {activeModal !== null && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          {/* Modal box */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col justify-between overflow-hidden animate-scale-up ${
              activeModal === 'fullscreen' 
                ? 'w-full h-full max-w-none max-h-none rounded-none p-8' 
                : activeModal === 'media'
                  ? 'max-w-xl w-full p-2 bg-slate-950 border-none'
                  : activeModal === 'form'
                    ? 'max-w-md w-full p-6'
                    : 'max-w-sm w-full p-6'
            }`}
          >
            {/* Standard Modal */}
            {activeModal === 'standard' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <h4 className="font-bold text-slate-900 text-sm">Modal Title</h4>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="py-2">
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="flex gap-2.5 justify-end border-t border-slate-100 pt-3">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold bg-white transition-colors">Cancel</button>
                  <button onClick={() => { triggerToast("Standard Action Saved"); setActiveModal(null); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">Save</button>
                </div>
              </div>
            )}

            {/* Confirm Dialog */}
            {activeModal === 'confirm' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Action</span>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200 shadow-sm font-black text-lg">
                    ?
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">Are you sure?</h4>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    Are you sure you want to delete this item? This action is permanent and cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2.5 justify-end pt-2">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold bg-white transition-colors">Cancel</button>
                  <button onClick={() => { triggerToast("Action Confirmed & Executed"); setActiveModal(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">Delete</button>
                </div>
              </div>
            )}

            {/* Alert Dialog */}
            {activeModal === 'alert' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center py-2 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-150 shadow-inner">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">Something went wrong!</h4>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    A connection error occurred while submitting your data. Please try again.
                  </p>
                </div>
                <div className="flex justify-center pt-2">
                  <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">OK</button>
                </div>
              </div>
            )}

            {/* Form Modal */}
            {activeModal === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <h4 className="font-bold text-slate-900 text-sm">Add New Product</h4>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3.5 py-2">
                  <div className="space-y-1.5">
                    <label htmlFor="form-prod-name" className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                    <input 
                      type="text" 
                      id="form-prod-name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Wireless Headphones"
                      className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="form-prod-cat" className="text-xs font-bold text-slate-500 uppercase">Category</label>
                    <select 
                      id="form-prod-cat"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2.5 justify-end border-t border-slate-100 pt-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold bg-white transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none">Add</button>
                </div>
              </form>
            )}

            {/* Media Modal */}
            {activeModal === 'media' && (
              <div className="relative flex flex-col items-center">
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border-none"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-full h-80 rounded-xl overflow-hidden relative flex items-center justify-center">
                  <img src={IMAGES[imageIndex]} alt="nature carousel" className="max-w-full max-h-full object-cover w-full h-full" />
                  
                  {/* Arrows */}
                  <button 
                    onClick={() => setImageIndex(p => (p === 0 ? IMAGES.length - 1 : p - 1))}
                    className="absolute left-3 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors border-none"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setImageIndex(p => (p === IMAGES.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors border-none"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dot count */}
                  <div className="absolute bottom-3.5 flex gap-1.5">
                    {IMAGES.map((_, i) => (
                      <span 
                        key={i}
                        onClick={() => setImageIndex(i)}
                        className={`h-1.5 rounded-full cursor-pointer transition-all ${
                          imageIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Fullscreen Modal */}
            {activeModal === 'fullscreen' && (
              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Fullscreen Workspace Modal</h2>
                    <p className="text-xs text-slate-400 mt-1">Immersive overlay workflow layout.</p>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl shadow-sm transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 py-8 overflow-y-auto space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Complex Form / Settings Grid</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                      <input type="text" defaultValue="Katabazaar DS3" className="w-full px-3 py-2 border border-slate-205 rounded-xl text-xs font-semibold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Version Tag</label>
                      <input type="text" defaultValue="v1.0.0" className="w-full px-3 py-2 border border-slate-205 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="max-w-3xl border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs leading-relaxed text-slate-500 mt-6">
                    <p className="font-bold text-slate-700">Workspace Summary Notes</p>
                    <p>This layout is extremely suitable for extensive wizard stages, detailed asset browser views, configurations, and analytical report reviews requiring dedicated focal screen attention.</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end border-t border-slate-200 pt-4 mt-auto">
                  <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold bg-white transition-colors">Cancel Workspace</button>
                  <button onClick={() => { triggerToast("Project Created & Saved"); setActiveModal(null); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors border-none">Create Project</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
