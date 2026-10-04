"use client";

import React, { useState, useRef } from "react";
import { 
  Download, Search, Info, Check, AlertTriangle, X, Eye, EyeOff, Mail,
  Lock, Calendar, RefreshCw, ChevronDown, UploadCloud, HelpCircle, 
  AlertCircle, Trash2, Sliders, CheckSquare, Square, Smartphone, ShieldAlert
} from "lucide-react";

const TABS = [
  "Overview", 
  "Input Fields", 
  "Select", 
  "Checkbox & Radio", 
  "Switch", 
  "Validation", 
  "Best Practices"
];

const GUIDELINES = [
  { label: "Use clear labels and placeholders.", ok: true },
  { label: "Provide helpful hints when needed.", ok: true },
  { label: "Validate inputs and show clear errors.", ok: true },
  { label: "Keep forms short and focused.", ok: true },
  { label: "Ensure forms are accessible to all users.", ok: true }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Associate labels with inputs.", ok: true },
  { label: "Provide error messages with role=\"alert\".", ok: true },
  { label: "Ensure sufficient color contrast.", ok: true },
  { label: "Support keyboard navigation.", ok: true },
  { label: "Use aria-describedby for help text.", ok: true }
];

const CODE_EXAMPLES = {
  Overview: `<form class="form">
  <div class="form-group">
    <label for="email" class="form-label">Email address</label>
    <input
      type="email"
      id="email"
      placeholder="name@example.com"
      aria-describedby="email-hint"
      class="form-input"
    />
    <small id="email-hint" class="form-hint">
      We'll never share your email.
    </small>
  </div>
  <button type="submit" class="btn btn-primary">
    Submit
  </button>
</form>`,
  "Input Fields": `<div class="form-group">
  <label for="message" class="form-label">Message</label>
  <textarea 
    id="message" 
    placeholder="Type your message..." 
    class="form-textarea"
    maxlength="200"
  ></textarea>
  <div class="char-counter">0 / 200</div>
</div>`,
  Select: `<div class="form-group">
  <label for="country" class="form-label">Country</label>
  <div class="select-wrapper">
    <select id="country" class="form-select">
      <option value="">Select country</option>
      <option value="us">United States</option>
      <option value="in">India</option>
    </select>
    <span class="chevron-icon"></span>
  </div>
</div>`,
  "Checkbox & Radio": `<div class="checkbox-group">
  <label class="checkbox-label">
    <input type="checkbox" checked class="form-checkbox" />
    <span>I agree to the Terms & Conditions</span>
  </label>
</div>

<div class="radio-group">
  <label class="radio-label">
    <input type="radio" name="plan" checked class="form-radio" />
    <span>Basic Plan</span>
  </label>
</div>`,
  Switch: `<div class="switch-group">
  <div class="switch-info">
    <span class="switch-title">Enable notifications</span>
    <span class="switch-desc">You will receive push notifications.</span>
  </div>
  <button role="switch" aria-checked="true" class="form-switch active">
    <span class="switch-thumb"></span>
  </button>
</div>`,
  Validation: `<div class="form-group error">
  <label for="username" class="form-label">Username</label>
  <input 
    type="text" 
    id="username" 
    value="John" 
    class="form-input border-red-500" 
    aria-invalid="true"
    aria-describedby="username-error"
  />
  <span id="username-error" class="error-msg" role="alert">
    Name must be at least 3 characters.
  </span>
</div>`,
  "Best Practices": `<!-- Accessibility checklist example -->
<input 
  type="text" 
  id="search" 
  aria-describedby="search-helper" 
  placeholder="Search..."
  class="form-input-accessible"
/>
<p id="search-helper" class="sr-only">
  Type your query here to filter components.
</p>`
};

export default function DSFormsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Email state
  const [email, setEmail] = useState("name@example.com");

  // Search input state
  const [searchVal, setSearchVal] = useState("");

  // Password Input state
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  // Textarea message state
  const [message, setMessage] = useState("");

  // Country select state
  const [selectedCountry, setSelectedCountry] = useState("Select country");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countries = ["United States", "United Kingdom", "Canada", "Germany", "India", "Australia"];

  // Multi select technologies state
  const [selectedTechs, setSelectedTechs] = useState(["React", "TypeScript", "Node.js"]);
  const [isTechsOpen, setIsTechsOpen] = useState(false);
  const techOptions = ["React", "TypeScript", "Node.js", "Next.js", "Vue", "TailwindCSS", "GraphQL", "Docker"];

  // Checkbox states
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [subNewsletter, setSubNewsletter] = useState(true);
  const [enableUpdates, setEnableUpdates] = useState(false);

  // Radio button states
  const [selectedPlan, setSelectedPlan] = useState("Basic Plan");

  // Switch state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Date picker state
  const [selectedDate, setSelectedDate] = useState("2024-05-20");

  // Vertical layout form state
  const [verticalName, setVerticalName] = useState("");
  const [verticalEmail, setVerticalEmail] = useState("");

  // Horizontal layout form state
  const [horizontalEmail, setHorizontalEmail] = useState("");

  // Helper function to format date
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Select date";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Copy code helper
  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // File Upload Handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleVerticalSubmit = (e) => {
    e.preventDefault();
    if (!verticalName || !verticalEmail) {
      triggerToast("Please fill in all fields!");
      return;
    }
    triggerToast(`Form submitted! Name: ${verticalName}`);
    setVerticalName("");
    setVerticalEmail("");
  };

  const handleHorizontalSubmit = (e) => {
    e.preventDefault();
    if (!horizontalEmail) {
      triggerToast("Please enter an email!");
      return;
    }
    triggerToast(`Subscribed with: ${horizontalEmail}`);
    setHorizontalEmail("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-8 flex flex-col relative">
      
      {/* Toast Alert */}
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DS3 – FORMS</h1>
            <span className="material-symbols-outlined text-[28px] text-indigo-650 font-bold bg-indigo-50 p-1.5 rounded-lg">edit_note</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Forms collect and validate user input in a clear and accessible way.</p>
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
          
          {/* Overview Tab Content */}
          {(activeTab === "Overview" || activeTab === "Best Practices") && (
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">edit_note</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">12</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Form Components</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">text_fields</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">6</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Input Types</span>
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

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
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

          {/* FORM EXAMPLES Heading & Grid */}
          {(activeTab === "Overview" || activeTab === "Input Fields" || activeTab === "Select" || activeTab === "Checkbox & Radio" || activeTab === "Switch") && (
            <div className="space-y-6">
              {activeTab === "Overview" && (
                <div className="flex items-center gap-2 mt-4">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Form Examples</h3>
                  <div className="flex-grow h-px bg-slate-200"></div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* 1. Text Input */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Text Input</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Required</span>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email-input" className="text-xs font-bold text-slate-700 block">Email address</label>
                        <input 
                          type="email" 
                          id="email-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm font-medium text-slate-800"
                        />
                        <span className="text-[10px] text-slate-400 font-medium block">We'll never share your email.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Text Input with Icon */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Text Input with Icon</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Optional</span>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="search-input" className="text-xs font-bold text-slate-700 block">Search</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            id="search-input"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            placeholder="Search anything..."
                            className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm font-medium text-slate-800"
                          />
                          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        <span className="text-[10px] text-transparent select-none font-medium block">Placeholder text</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Password Input */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Password Input</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Secure</span>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="pass-input" className="text-xs font-bold text-slate-700 block">Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            id="pass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm font-medium tracking-wide text-slate-800"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-indigo-650 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block">Must be at least 8 characters.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Text Area */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Text Area</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Multi Line</span>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="msg-input" className="text-xs font-bold text-slate-700 block">Message</label>
                        <div className="relative">
                          <textarea 
                            id="msg-input"
                            value={message}
                            onChange={(e) => {
                              if (e.target.value.length <= 200) setMessage(e.target.value);
                            }}
                            placeholder="Type your message..."
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm h-24 resize-none font-medium text-slate-800"
                          />
                          <span className="absolute bottom-2.5 right-3 text-[9px] font-bold text-slate-400">{message.length} / 200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Select */}
                {(activeTab === "Overview" || activeTab === "Select") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full relative">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Select</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Single</span>
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-xs font-bold text-slate-700 block">Country</label>
                        <div 
                          onClick={() => {
                            setIsCountryOpen(!isCountryOpen);
                            setIsTechsOpen(false);
                          }}
                          className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold shadow-sm flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <span className={selectedCountry === "Select country" ? "text-slate-400 font-medium" : "text-slate-800"}>
                            {selectedCountry}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-450 shrink-0 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                        </div>

                        {isCountryOpen && (
                          <div className="absolute top-[72px] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-30 max-h-48 overflow-y-auto space-y-1">
                            {countries.map(c => (
                              <div 
                                key={c}
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setIsCountryOpen(false);
                                }}
                                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold ${
                                  selectedCountry === c ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                {c}
                              </div>
                            ))}
                          </div>
                        )}
                        <span className="text-[10px] text-transparent select-none font-medium block">Spacer</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Multi Select */}
                {(activeTab === "Overview" || activeTab === "Select") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full relative">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Multi Select</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Tags</span>
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-xs font-bold text-slate-700 block">Technologies</label>
                        
                        <div 
                          onClick={() => {
                            setIsTechsOpen(!isTechsOpen);
                            setIsCountryOpen(false);
                          }}
                          className="w-full border border-slate-200 rounded-xl p-1.5 bg-white flex items-center justify-between shadow-sm min-h-[44px] cursor-pointer"
                        >
                          <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
                            {selectedTechs.length === 0 ? (
                              <span className="text-slate-400 text-xs pl-2 font-medium">Select options...</span>
                            ) : (
                              selectedTechs.map(tech => (
                                <span 
                                  key={tech} 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-650 rounded-lg text-xs font-bold border border-indigo-100"
                                >
                                  {tech}
                                  <X 
                                    className="w-3 h-3 text-indigo-400 cursor-pointer hover:text-indigo-600" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTechs(selectedTechs.filter(t => t !== tech));
                                    }}
                                  />
                                </span>
                              ))
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-450 mr-1 shrink-0 transition-transform ${isTechsOpen ? "rotate-180" : ""}`} />
                        </div>

                        {isTechsOpen && (
                          <div className="absolute top-[72px] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-30 max-h-48 overflow-y-auto space-y-1">
                            {techOptions.map(tech => {
                              const isSelected = selectedTechs.includes(tech);
                              return (
                                <div 
                                  key={tech}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isSelected) {
                                      setSelectedTechs(selectedTechs.filter(t => t !== tech));
                                    } else {
                                      setSelectedTechs([...selectedTechs, tech]);
                                    }
                                  }}
                                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold flex justify-between items-center ${
                                    isSelected ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <span>{tech}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <span className="text-[10px] text-transparent select-none font-medium block">Spacer</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Checkbox */}
                {(activeTab === "Overview" || activeTab === "Checkbox & Radio") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Checkbox</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Boolean</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={agreeTerms} 
                              onChange={() => setAgreeTerms(!agreeTerms)}
                              className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded-lg cursor-pointer focus:ring-indigo-500"
                            />
                            <span>I agree to the <span className="text-indigo-600 hover:underline">Terms & Conditions</span></span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={subNewsletter} 
                              onChange={() => setSubNewsletter(!subNewsletter)}
                              className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded-lg cursor-pointer focus:ring-indigo-500"
                            />
                            <span>Subscribe to newsletter</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={enableUpdates} 
                              onChange={() => setEnableUpdates(!enableUpdates)}
                              className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded-lg cursor-pointer focus:ring-indigo-500"
                            />
                            <span>Enable updates via email</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. Radio Buttons */}
                {(activeTab === "Overview" || activeTab === "Checkbox & Radio") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Radio Buttons</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Mutually Exclusive</span>
                      </div>
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-700 block">Choose a plan</span>
                        <div className="flex flex-col gap-2.5">
                          {["Basic Plan", "Pro Plan", "Enterprise Plan"].map(plan => (
                            <label key={plan} className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700">
                              <input 
                                type="radio" 
                                name="plan-selection"
                                checked={selectedPlan === plan}
                                onChange={() => setSelectedPlan(plan)}
                                className="w-4.5 h-4.5 text-indigo-600 border-slate-300 cursor-pointer focus:ring-indigo-500"
                              />
                              <span>{plan}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Switch */}
                {(activeTab === "Overview" || activeTab === "Switch") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Switch</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Toggle</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex-1 pr-4">
                            <span className="text-xs font-bold text-slate-800 block">Enable notifications</span>
                            <span className="text-[10px] text-slate-450 font-medium block mt-0.5 leading-tight">You will receive push notifications.</span>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                              notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              notificationsEnabled ? 'translate-x-4.5' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. File Upload */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">File Upload</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Drag & Drop</span>
                      </div>
                      <div className="space-y-2">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".png,.jpg,.jpeg"
                        />

                        {!uploadedFile ? (
                          <div 
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50"
                          >
                            <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
                            <span className="text-xs font-bold text-slate-800">Drag & drop a file here</span>
                            <span className="text-[9px] text-slate-400 font-semibold mt-1">PNG, JPG up to 5MB</span>
                            <button 
                              type="button"
                              className="mt-3 text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-50 text-indigo-650 px-3 py-1.5 rounded-lg shadow-sm"
                            >
                              Browse Files
                            </button>
                          </div>
                        ) : (
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 font-bold" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 block truncate leading-tight">{uploadedFile.name}</span>
                                <span className="text-[9px] text-slate-450 font-bold block mt-0.5">{uploadedFile.size}</span>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={removeFile}
                              className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. Date Picker */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Date Picker</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-500">Date</span>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="date-input" className="text-xs font-bold text-slate-700 block">Select date</label>
                        
                        <div className="relative">
                          <input 
                            type="date" 
                            id="date-input"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm cursor-pointer"
                          />
                          <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 pointer-events-none" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block">Formatted: {formatDateDisplay(selectedDate)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12. Form Layout (Vertical) */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full xl:col-span-1">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Form Layout (Vertical)</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-indigo-50 text-indigo-650 border border-indigo-100">Layout</span>
                      </div>
                      <form onSubmit={handleVerticalSubmit} className="space-y-3">
                        <div className="space-y-1">
                          <label htmlFor="vert-name" className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                          <input 
                            type="text" 
                            id="vert-name"
                            value={verticalName}
                            onChange={(e) => setVerticalName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none shadow-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="vert-email" className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                          <input 
                            type="email" 
                            id="vert-email"
                            value={verticalEmail}
                            onChange={(e) => setVerticalEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none shadow-sm font-medium"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold py-2 shadow-sm border-none transition-colors"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 13. Form Layout (Horizontal) */}
                {(activeTab === "Overview" || activeTab === "Input Fields") && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full xl:col-span-1">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-900">Form Layout (Horizontal)</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-indigo-50 text-indigo-650 border border-indigo-100">Inline</span>
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="horiz-email" className="text-[10px] font-bold text-slate-400 uppercase block">Email</label>
                        <form onSubmit={handleHorizontalSubmit} className="flex gap-2 items-center">
                          <input 
                            type="email" 
                            id="horiz-email"
                            value={horizontalEmail}
                            onChange={(e) => setHorizontalEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="flex-grow min-w-0 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none shadow-sm font-medium"
                          />
                          <button 
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold px-4 py-2.5 shadow-sm shrink-0 border-none transition-colors"
                          >
                            Subscribe
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* VALIDATION STATES Section */}
          {(activeTab === "Overview" || activeTab === "Validation") && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Validation States</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                
                {/* Default Validation State */}
                <div className="space-y-2">
                  <label htmlFor="val-def" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Default</label>
                  <input 
                    type="text" 
                    id="val-def"
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none shadow-sm font-medium text-slate-800"
                  />
                  <span className="text-[10px] text-transparent select-none font-medium block">Spacer</span>
                </div>

                {/* Success Validation State */}
                <div className="space-y-2">
                  <label htmlFor="val-succ" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Success</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="val-succ"
                      defaultValue="John Doe"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-emerald-500 rounded-xl text-sm focus:outline-none shadow-sm font-semibold text-emerald-900"
                    />
                    <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 font-bold" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block">Looks good!</span>
                </div>

                {/* Error Validation State */}
                <div className="space-y-2">
                  <label htmlFor="val-err" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Error</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="val-err"
                      defaultValue="Jo"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-red-500 rounded-xl text-sm focus:outline-none shadow-sm font-semibold text-red-900"
                    />
                    <AlertCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-[10px] text-red-650 font-bold block">Name must be at least 3 characters.</span>
                </div>

                {/* Disabled Validation State */}
                <div className="space-y-2">
                  <label htmlFor="val-dis" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disabled</label>
                  <input 
                    type="text" 
                    id="val-dis"
                    disabled
                    defaultValue="John Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 font-semibold cursor-not-allowed select-none"
                  />
                  <span className="text-[10px] text-transparent select-none font-medium block">Spacer</span>
                </div>

                {/* Read Only Validation State */}
                <div className="space-y-2">
                  <label htmlFor="val-ro" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Read Only</label>
                  <input 
                    type="text" 
                    id="val-ro"
                    readOnly
                    defaultValue="John Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-semibold cursor-default"
                  />
                  <span className="text-[10px] text-slate-400 font-medium block">This field is read only.</span>
                </div>

              </div>
            </div>
          )}

          {/* FORM STATES Section */}
          {(activeTab === "Overview" || activeTab === "Validation") && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Form States</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                
                {/* 1. Default */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-3 shadow-inner">
                    <Info className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Default</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1.5 leading-snug">Ready for user input.</span>
                </div>

                {/* 2. Focused */}
                <div className="bg-white p-4 rounded-xl border border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-lg mb-3 border border-indigo-300">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Focused</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1.5 leading-snug">Input is active and highlighted.</span>
                </div>

                {/* 3. Filled */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-250 flex items-center justify-center font-bold text-lg mb-3">
                    <CheckSquare className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Filled</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1.5 leading-snug">Input has a value.</span>
                </div>

                {/* 4. Disabled */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 opacity-60 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-lg mb-3">
                    <X className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 block leading-tight">Disabled</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1.5 leading-snug">Input is not interactive.</span>
                </div>

                {/* 5. Error */}
                <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 border border-red-250 flex items-center justify-center font-bold text-lg mb-3">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Error</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1.5 leading-snug">Input has an issue.</span>
                </div>

                {/* 6. Success */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-250 flex items-center justify-center font-bold text-lg mb-3">
                    <Check className="w-5 h-5 font-bold" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Success</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1.5 leading-snug">Input is valid.</span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Form Guidelines</h4>
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
            <pre className="bg-[#070b15] text-[#94a3b8] p-3.5 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-56 custom-scrollbar border border-slate-800/80">
              <code>{CODE_EXAMPLES[activeTab] || CODE_EXAMPLES.Overview}</code>
            </pre>
          </div>

          {/* When to Use */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">When to Use</h4>
            <ul className="space-y-3.5">
              {[
                "Collecting user information.",
                "User registration and login.",
                "Search and filtering.",
                "Contact and feedback forms.",
                "Settings and preferences."
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
