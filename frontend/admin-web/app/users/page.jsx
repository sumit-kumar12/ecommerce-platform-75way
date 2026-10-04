"use client";

import React, { useState, useEffect } from "react";
import { apiRequest, getCurrentUser } from "../../lib/api";
import { CustomerTable } from "../../components/customers/CustomerTable";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const [payload, userRes] = await Promise.all([
          apiRequest(`/admin/users?limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}${activeTab === "Active" ? "&status=ACTIVE" : activeTab === "Inactive" ? "&status=BANNED" : ""}`),
          getCurrentUser().then(res => res.json()).catch(() => null)
        ]);
        
        setCustomers(payload.users || []);
        if (userRes && userRes.user) setCurrentUser(userRes.user);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Add simple debounce for search
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, activeTab, refreshKey]);

  // The tabs count will just be approximations or hidden if we use backend filtering
  // For simplicity, we can just omit the count if we are filtering, but keeping length of current array works for the active tab.
  const tabs = [
    { label: "All" },
    { label: "Active" },
    { label: "Inactive" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Users & Identities
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Manage customer accounts and monitor identity state.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-[#8C63F5]/10 border border-[#8C63F5]/20 text-[#8C63F5] px-3 py-1.5 rounded-lg text-xs font-medium">
            <span className="material-symbols-outlined text-[14px]">group</span>
            {customers.length} Total Users
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 min-w-0">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2 w-full md:w-96 focus-within:border-[#8C63F5] transition-colors">
              <span className="material-symbols-outlined text-zinc-500 text-[18px]">search</span>
              <input
                type="text"
                className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-300 transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filter
              </button>
            </div>
          </div>

          <div className="flex gap-6 border-b border-zinc-800 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`pb-3 text-sm font-medium flex items-center gap-2 transition-colors relative ${
                  activeTab === tab.label ? "text-[#8C63F5]" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label} 
                {activeTab === tab.label && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C63F5] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-zinc-500 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[24px]">refresh</span>
                <span>Loading identities...</span>
              </div>
            ) : (
              <CustomerTable customers={customers} currentUser={currentUser} onRefresh={() => setRefreshKey(k => k + 1)} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
