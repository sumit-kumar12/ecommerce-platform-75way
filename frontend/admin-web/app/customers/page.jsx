"use client";

import { useState, useEffect } from "react";
import { CustomerTable } from "../../components/customers/CustomerTable";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    // Mock data fetching since there's no real backend yet for this specific custom payload
    const timer = setTimeout(() => {
      setCustomers([
        { id: "CUST-001", name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 98765 43210", totalOrders: 12, totalSpent: 45200, status: "ACTIVE", createdAt: "2023-01-15T10:00:00Z" },
        { id: "CUST-002", name: "Priya Patel", email: "priya.p@example.com", phone: "+91 98765 43211", totalOrders: 3, totalSpent: 8500, status: "ACTIVE", createdAt: "2023-05-22T14:30:00Z" },
        { id: "CUST-003", name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 98765 43212", totalOrders: 1, totalSpent: 1200, status: "INACTIVE", createdAt: "2024-02-10T09:15:00Z" },
        { id: "CUST-004", name: "Neha Singh", email: "neha.s@example.com", phone: "+91 98765 43213", totalOrders: 5, totalSpent: 18450, status: "ACTIVE", createdAt: "2023-11-05T16:45:00Z" },
        { id: "CUST-005", name: "Vikram Malhotra", email: "vikram.m@example.com", phone: "+91 98765 43214", totalOrders: 0, totalSpent: 0, status: "INACTIVE", createdAt: "2024-06-01T11:20:00Z" },
      ]);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Customer Database</h2>
          <p className="text-slate-400 mt-1 text-sm">Manage user accounts and purchase histories</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input 
              className="bg-[#1a192b] border border-[#2d2c45] focus:border-[#8C63F5] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 min-w-[280px] outline-none transition-colors" 
              placeholder="Search names, emails..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-[#1a192b] border border-[#2d2c45] text-slate-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-[#1a192b] border border-[#2d2c45] p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#8C63F5] rounded-full blur-3xl opacity-10"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Registered</p>
          <div className="flex items-end gap-3">
            <h4 className="text-2xl font-bold text-white">{loading ? "..." : "12,843"}</h4>
            <span className="text-emerald-500 text-sm font-bold mb-1">+15.3%</span>
          </div>
        </div>
        <div className="bg-[#1a192b] border border-[#2d2c45] p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B861] rounded-full blur-3xl opacity-10"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Buyers</p>
          <div className="flex items-end gap-3">
            <h4 className="text-2xl font-bold text-[#10B861]">{loading ? "..." : "8,291"}</h4>
            <span className="text-emerald-500 text-sm font-bold mb-1">+4.2%</span>
          </div>
        </div>
        <div className="bg-[#1a192b] border border-[#2d2c45] p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00DAFF] rounded-full blur-3xl opacity-10"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Average Lifetime Value</p>
          <div className="flex items-end gap-3">
            <h4 className="text-2xl font-bold text-[#00DAFF]">{loading ? "..." : "₹14,670"}</h4>
            <span className="text-emerald-500 text-sm font-bold mb-1">+8.1%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[#2d2c45] mb-2 overflow-x-auto hide-scrollbar">
        {["ALL", "ACTIVE", "INACTIVE"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              filter === tab
                ? "border-[#8C63F5] text-white"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
            }`}
          >
            {tab === "ALL" ? "All Customers" : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-[#1a192b] border border-[#2d2c45] rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[#8C63F5] text-4xl">sync</span>
              <span className="text-slate-400 font-medium">Loading database...</span>
            </div>
          </div>
        ) : (
          <CustomerTable customers={filteredCustomers} />
        )}
      </div>

    </div>
  );
}
