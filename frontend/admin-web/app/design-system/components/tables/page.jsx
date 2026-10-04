"use client";

import React, { useState } from "react";
import { 
  Download, Search, Info, Check, Eye, MoreVertical, ChevronLeft, ChevronRight, 
  Trash2, Sliders, Settings, Calendar, Grid, Columns, FileText, Filter, AlertCircle,
  Headphones, Watch, Speaker, MousePointer, Smartphone
} from "lucide-react";

const TABS = ["Overview", "Variants", "Sorting & Filtering", "Pagination", "Selection", "States", "Best Practices"];

const GUIDELINES = [
  { label: "Use tables for structured data, not layouts." },
  { label: "Keep data scannable and easy to compare." },
  { label: "Use clear column labels and consistent formatting." },
  { label: "Enable sorting and filtering for large datasets." },
  { label: "Provide empty and loading states." }
];

const ACCESSIBILITY_ITEMS = [
  { label: "Use <table>, <thead>, <tbody>, <th>, <td> correctly." },
  { label: "Ensure sufficient color contrast." },
  { label: "Support keyboard navigation for all actions." },
  { label: "Provide accessible labels for sorting and actions." },
  { label: "Announce changes for dynamic content." }
];

const CODE_EXAMPLE_HTML = `<table class="ds-table">
  <thead>
    <tr>
      <th scope="col">Order ID</th>
      <th scope="col">Customer</th>
      <th scope="col">Date</th>
      <th scope="col">Status</th>
      <th scope="col">Amount</th>
      <th scope="col">Payment</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>#ORD-1024</td>
      <td>Rahul Sharma</td>
      <td>20 May 2024</td>
      <td><span class="badge success">Completed</span></td>
      <td>₹ 12,450.00</td>
      <td><span class="badge success">Paid</span></td>
      <td>...</td>
    </tr>
  </tbody>
</table>`;

const BASIC_DATA = [
  { id: "#ORD-1024", name: "Rahul Sharma", date: "20 May 2024", status: "Completed", amount: "₹ 12,450.00", payment: "Paid" },
  { id: "#ORD-1023", name: "Neha Singh", date: "19 May 2024", status: "Processing", amount: "₹ 8,950.00", payment: "Paid" },
  { id: "#ORD-1022", name: "Arjun Verma", date: "19 May 2024", status: "Shipped", amount: "₹ 5,600.00", payment: "Paid" },
  { id: "#ORD-1021", name: "Priya Patel", date: "18 May 2024", status: "Cancelled", amount: "₹ 2,350.00", payment: "Refunded" },
  { id: "#ORD-1020", name: "Karan Mehta", date: "18 May 2024", status: "Pending", amount: "₹ 3,750.00", payment: "Pending" }
];

const CHECKBOX_DATA = [
  { id: "prod-1", name: "Wireless Headphones", category: "Audio", stock: 120, price: "₹ 2,999.00", icon: "headphones" },
  { id: "prod-2", name: "Smart Watch", category: "Wearables", stock: 85, price: "₹ 3,999.00", icon: "watch" },
  { id: "prod-3", name: "Bluetooth Speaker", category: "Audio", stock: 60, price: "₹ 1,499.00", icon: "speaker" },
  { id: "prod-4", name: "Gaming Mouse", category: "Accessories", stock: 150, price: "₹ 1,099.00", icon: "mouse" }
];

const STRIPED_DATA = [
  { id: "user-1", name: "Rahul Sharma", role: "Admin", email: "rahul@example.com", status: "Active", initial: "RS" },
  { id: "user-2", name: "Neha Singh", role: "Editor", email: "neha@example.com", status: "Active", initial: "NS" },
  { id: "user-3", name: "Arjun Verma", role: "Viewer", email: "arjun@example.com", status: "Active", initial: "AV" },
  { id: "user-4", name: "Priya Patel", role: "Editor", email: "priya@example.com", status: "Inactive", initial: "PP" },
  { id: "user-5", name: "Karan Mehta", role: "Viewer", email: "karan@example.com", status: "Active", initial: "KM" }
];

const SEARCHABLE_DATA = [
  { id: "#ORD-1024", name: "Rahul Sharma", date: "20 May 2024", status: "Completed", amount: 12450, payment: "Paid" },
  { id: "#ORD-1023", name: "Neha Singh", date: "19 May 2024", status: "Processing", amount: 8950, payment: "Paid" },
  { id: "#ORD-1022", name: "Arjun Verma", date: "19 May 2024", status: "Shipped", amount: 5600, payment: "Paid" },
  { id: "#ORD-1021", name: "Priya Patel", date: "18 May 2024", status: "Cancelled", amount: 2350, payment: "Refunded" },
  { id: "#ORD-1020", name: "Karan Mehta", date: "18 May 2024", status: "Pending", amount: 3750, payment: "Pending" },
  { id: "#ORD-1019", name: "Amit Sen", date: "17 May 2024", status: "Completed", amount: 15200, payment: "Paid" },
  { id: "#ORD-1018", name: "Sonia Das", date: "17 May 2024", status: "Completed", amount: 4300, payment: "Paid" },
  { id: "#ORD-1017", name: "Vikram Malhotra", date: "16 May 2024", status: "Processing", amount: 9150, payment: "Pending" },
  { id: "#ORD-1016", name: "Riya Sen", date: "16 May 2024", status: "Shipped", amount: 6400, payment: "Paid" },
  { id: "user-status-err", idVal: "#ORD-1015", name: "Gourav Roy", date: "15 May 2024", status: "Cancelled", amount: 1200, payment: "Refunded" },
  { id: "#ORD-1014", name: "Kriti Sanon", date: "14 May 2024", status: "Completed", amount: 24000, payment: "Paid" },
  { id: "#ORD-1013", name: "Varun Dhawan", date: "14 May 2024", status: "Pending", amount: 5000, payment: "Pending" }
];

export default function DSTablesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Checkbox table state
  const [selectedProds, setSelectedProds] = useState(["prod-1", "prod-2"]);

  // Search, filter, sorting, pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  // Status dropdown filter open state
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  // Copy code helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  // Toggle selection on product table
  const handleToggleProd = (id) => {
    if (selectedProds.includes(id)) {
      setSelectedProds(selectedProds.filter(x => x !== id));
    } else {
      setSelectedProds([...selectedProds, id]);
    }
  };

  const handleToggleAllProds = (e) => {
    if (e.target.checked) {
      setSelectedProds(CHECKBOX_DATA.map(p => p.id));
    } else {
      setSelectedProds([]);
    }
  };

  // Sorting
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
  };

  // Processing Searchable dataset
  const processedData = React.useMemo(() => {
    let result = [...SEARCHABLE_DATA];

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        const idStr = (item.id || item.idVal || "").toLowerCase();
        return idStr.includes(q) || item.name.toLowerCase().includes(q);
      });
    }

    // Status Filter
    if (statusFilter !== "All Status") {
      result = result.filter(item => item.status === statusFilter);
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        // Handle irregular item objects
        if (sortField === "id") {
          valA = a.id || a.idVal;
          valB = b.id || b.idVal;
        }

        if (typeof valA === "string") {
          return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }
      });
    }

    return result;
  }, [searchQuery, statusFilter, sortField, sortOrder]);

  // Paginated dataset
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage);

  const getProductIcon = (iconName) => {
    switch (iconName) {
      case "headphones": return <Headphones className="w-4 h-4 text-slate-500" />;
      case "watch": return <Watch className="w-4 h-4 text-slate-500" />;
      case "speaker": return <Speaker className="w-4 h-4 text-slate-500" />;
      case "mouse": return <MousePointer className="w-4 h-4 text-slate-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case "Completed":
      case "Active":
        return <span className="px-2.5 py-0.5 inline-flex text-[10px] leading-tight font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Completed</span>;
      case "Processing":
        return <span className="px-2.5 py-0.5 inline-flex text-[10px] leading-tight font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">Processing</span>;
      case "Shipped":
        return <span className="px-2.5 py-0.5 inline-flex text-[10px] leading-tight font-bold rounded-full bg-indigo-50 text-indigo-700 border border-[#E0E7FF]">Shipped</span>;
      case "Cancelled":
      case "Inactive":
        return <span className="px-2.5 py-0.5 inline-flex text-[10px] leading-tight font-bold rounded-full bg-red-50 text-red-700 border border-red-100">Cancelled</span>;
      case "Pending":
        return <span className="px-2.5 py-0.5 inline-flex text-[10px] leading-tight font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100">Pending</span>;
      default:
        return null;
    }
  };

  const getPaymentText = (payment) => {
    switch (payment) {
      case "Paid":
        return <span className="text-emerald-600 font-bold text-xs">Paid</span>;
      case "Refunded":
        return <span className="text-slate-500 font-bold text-xs">Refunded</span>;
      case "Pending":
        return <span className="text-amber-600 font-bold text-xs">Pending</span>;
      default:
        return null;
    }
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DS3 – TABLES</h1>
            <span className="material-symbols-outlined text-[28px] text-indigo-650 font-bold bg-indigo-50 p-1.5 rounded-lg">table_chart</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Tables organize and display data in rows and columns for easy scanning.</p>
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
                  <span className="material-symbols-outlined text-[24px] block font-bold">grid_view</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">7</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Table Variants</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] block font-bold">filter_alt</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">6</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block whitespace-nowrap">Table States</span>
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

          {/* BASIC TABLE Section */}
          {(activeTab === "Overview" || activeTab === "Variants") && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Basic Table</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 pr-4">Customer</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Payment</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {BASIC_DATA.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-bold text-slate-950">{row.id}</td>
                        <td className="py-3.5 font-semibold text-slate-700">{row.name}</td>
                        <td className="py-3.5 text-xs font-semibold text-slate-500">{row.date}</td>
                        <td className="py-3.5">{getStatusPill(row.status)}</td>
                        <td className="py-3.5 font-extrabold text-slate-900">{row.amount}</td>
                        <td className="py-3.5">{getPaymentText(row.payment)}</td>
                        <td className="py-3.5 text-center">
                          <button onClick={() => triggerToast(`Clicked actions for ${row.id}`)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors border-none text-slate-450 hover:text-slate-750">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Basic Table Pagination footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 text-xs font-semibold text-slate-500">
                <span>Showing 1 to 5 of 32 results</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">1</button>
                  <button className="w-7 h-7 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer">2</button>
                  <button className="w-7 h-7 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer">3</button>
                  <button className="w-7 h-7 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer">4</button>
                  <button className="w-7 h-7 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer">5</button>
                  <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </section>
          )}

          {/* CHECKBOX & STRIPED TABLES (Two columns on large screen) */}
          {(activeTab === "Overview" || activeTab === "Variants" || activeTab === "Selection") && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Table with Checkbox */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Table with Checkbox</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm min-w-[380px]">
                      <thead>
                        <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 w-10">
                            <input 
                              type="checkbox" 
                              onChange={handleToggleAllProds}
                              checked={selectedProds.length === CHECKBOX_DATA.length}
                              className="w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            />
                          </th>
                          <th className="pb-3 pr-4">Product</th>
                          <th className="pb-3 pr-4">Category</th>
                          <th className="pb-3 pr-4">Stock</th>
                          <th className="pb-3 pr-4">Price</th>
                          <th className="pb-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {CHECKBOX_DATA.map((row) => {
                          const isSel = selectedProds.includes(row.id);
                          return (
                            <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors ${isSel ? "bg-indigo-50/10" : ""}`}>
                              <td className="py-3.5">
                                <input 
                                  type="checkbox" 
                                  checked={isSel}
                                  onChange={() => handleToggleProd(row.id)}
                                  className="w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-3.5 pr-4">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                                    {getProductIcon(row.icon)}
                                  </div>
                                  <span className="font-bold text-slate-800 text-xs">{row.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 pr-4 font-semibold text-slate-500 text-xs">{row.category}</td>
                              <td className="py-3.5 pr-4 font-bold text-slate-700 text-xs">{row.stock}</td>
                              <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-xs">{row.price}</td>
                              <td className="py-3.5 text-center">
                                <button onClick={() => triggerToast(`Clicked actions for ${row.id}`)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors border-none text-slate-450 hover:text-slate-750">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>{selectedProds.length} selected</span>
                    {selectedProds.length > 0 && (
                      <button onClick={() => setSelectedProds([])} className="text-indigo-600 hover:text-indigo-800 hover:underline border-none bg-transparent cursor-pointer font-bold">Clear</button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                      className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-indigo-650 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>Bulk Actions</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bulkMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {bulkMenuOpen && (
                      <div className="absolute right-0 bottom-10 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 min-w-36 space-y-1">
                        <button 
                          onClick={() => {
                            triggerToast(`Deleted ${selectedProds.length} items`);
                            setSelectedProds([]);
                            setBulkMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-50 text-red-650 flex items-center gap-1.5 transition-colors border-none bg-transparent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Selected</span>
                        </button>
                        <button 
                          onClick={() => {
                            triggerToast(`Exported ${selectedProds.length} items`);
                            setBulkMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors border-none bg-transparent"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Striped Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Striped Table</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm min-w-[380px]">
                    <thead>
                      <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pr-4">User</th>
                        <th className="pb-3 pr-4">Role</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {STRIPED_DATA.map((row, idx) => (
                        <tr key={row.id} className={`transition-colors ${idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"} hover:bg-slate-50`}>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                                {row.initial}
                              </div>
                              <span className="font-bold text-slate-850 text-xs">{row.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 font-semibold text-slate-700 text-xs">{row.role}</td>
                          <td className="py-3 pr-4 font-medium text-slate-400 text-[11px]">{row.email}</td>
                          <td className="py-3">{getStatusPill(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TABLE WITH SEARCH, FILTER & PAGINATION Showcase */}
          {(activeTab === "Overview" || activeTab === "Sorting & Filtering" || activeTab === "Pagination") && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Table with Search, Filter & Pagination</h3>
              
              {/* Search and control bar */}
              <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-4xl">
                  {/* Search orders */}
                  <div className="relative flex-grow sm:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search orders..." 
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <div 
                      onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                      className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-between cursor-pointer gap-2"
                    >
                      <span className="text-slate-500">Status: <span className="text-slate-800 font-bold">{statusFilter}</span></span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    </div>

                    {statusMenuOpen && (
                      <div className="absolute left-0 top-[38px] bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 min-w-36 space-y-1">
                        {["All Status", "Completed", "Processing", "Shipped", "Cancelled", "Pending"].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => {
                              setStatusFilter(opt);
                              setStatusMenuOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-semibold ${
                              statusFilter === opt ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date range filter display */}
                  <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date Range: <span className="text-slate-800 font-bold">01 May 2024 - 31 May 2024</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full xl:w-auto shrink-0 justify-end">
                  <button onClick={() => triggerToast("Customize columns layout")} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 shadow-sm transition-colors border-none">
                    <Columns className="w-3.5 h-3.5" />
                    <span>Columns</span>
                  </button>
                  <button onClick={() => triggerToast("Downloading CSV dataset")} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 shadow-sm transition-colors border-none">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button onClick={() => triggerToast("More table options")} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 shadow-sm transition-colors border-none">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Options</span>
                  </button>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="border border-slate-250/60 rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th 
                        scope="col" 
                        onClick={() => handleSort("id")}
                        className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Order ID</span>
                          {sortField === "id" && <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                        </div>
                      </th>
                      <th scope="col" className="px-5 py-3.5">Customer</th>
                      <th scope="col" className="px-5 py-3.5">Date</th>
                      <th scope="col" className="px-5 py-3.5">Status</th>
                      <th 
                        scope="col" 
                        onClick={() => handleSort("amount")}
                        className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Amount</span>
                          {sortField === "amount" && <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                        </div>
                      </th>
                      <th scope="col" className="px-5 py-3.5">Payment</th>
                      <th scope="col" className="px-5 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {paginatedData.map(row => (
                      <tr key={row.id || row.idVal} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-800">{row.id || row.idVal}</td>
                        <td className="px-5 py-4 font-bold text-slate-850">{row.name}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-500">{row.date}</td>
                        <td className="px-5 py-4">{getStatusPill(row.status)}</td>
                        <td className="px-5 py-4 font-extrabold text-slate-900">₹{row.amount.toLocaleString("en-IN")}.00</td>
                        <td className="px-5 py-4">{getPaymentText(row.payment)}</td>
                        <td className="px-5 py-4 text-center">
                          <button onClick={() => triggerToast(`Clicked actions for ${row.id || row.idVal}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-slate-750 transition-colors border-none bg-transparent cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-5 py-12 text-center text-slate-400 font-medium">
                          No orders match the selected search or filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 gap-4">
                <span>Showing {processedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, processedData.length)} of {processedData.length} results</span>
                
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <select 
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-indigo-500 text-slate-700 font-semibold cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-all ${
                          currentPage === i + 1 ? "bg-indigo-600 text-white shadow-sm" : "border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Table states section */}
          {(activeTab === "Overview" || activeTab === "States") && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Table States</h3>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 1. Loading State */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <span className="text-xs font-bold text-slate-900 block">Loading State</span>
                  <div className="border border-slate-100 rounded-xl overflow-hidden text-[10px] animate-pulse">
                    <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex justify-between">
                      <div className="w-8 h-3 bg-slate-200 rounded"></div>
                      <div className="w-12 h-3 bg-slate-200 rounded"></div>
                      <div className="w-10 h-3 bg-slate-200 rounded"></div>
                    </div>
                    <div className="px-3 py-2.5 flex justify-between border-b border-slate-50">
                      <div className="w-10 h-3 bg-slate-150 rounded"></div>
                      <div className="w-14 h-3 bg-slate-150 rounded"></div>
                      <div className="w-12 h-3 bg-slate-150 rounded"></div>
                    </div>
                    <div className="px-3 py-2.5 flex justify-between">
                      <div className="w-10 h-3 bg-slate-150 rounded"></div>
                      <div className="w-14 h-3 bg-slate-150 rounded"></div>
                      <div className="w-12 h-3 bg-slate-150 rounded"></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">Displays skeletal placeholders during page load or fetch requests.</span>
                </div>

                {/* 2. Empty State */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <span className="text-xs font-bold text-slate-900 block">Empty State</span>
                  <div className="border border-slate-150 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center bg-slate-50/50 gap-2 h-[68px]">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-700 text-[10px] block leading-none">No data available</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">Shown when no search query results or data elements are present.</span>
                </div>

                {/* 3. Selection State */}
                <div className="bg-white p-5 rounded-2xl border border-indigo-300 shadow-md space-y-4 cursor-pointer">
                  <span className="text-xs font-bold text-indigo-750 block">Selection State</span>
                  <div className="border border-indigo-200 bg-indigo-50/30 rounded-xl p-3.5 flex items-center justify-between h-[68px]">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={true} readOnly className="w-4 h-4 rounded text-indigo-600" />
                      <span className="text-indigo-850 font-bold text-xs">#ORD-1024</span>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-black">SELECTED</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">Highlight states when items are selected using checkbox toggles.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          
          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Table Guidelines</h4>
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
                "Admin dashboards and data management.",
                "Reports and analytics data.",
                "Product listings and inventory.",
                "User management and activity logs.",
                "Financial transactions and order history."
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
