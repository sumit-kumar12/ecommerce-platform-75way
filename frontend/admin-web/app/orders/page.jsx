"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiRequest, resolveAdminApiBase } from "../../lib/api";
import { OrdersTable } from "../../components/orders/OrdersTable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState({
    All: 0, Pending: 0, Processing: 0, Shipped: 0, Delivered: 0
  });

  const [showFilters, setShowFilters] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");

  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = activeTab !== "All" ? `&status=${activeTab.toUpperCase()}` : "";
      const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : "";
      const pmParam = paymentMethod !== "All" ? `&paymentMethod=${encodeURIComponent(paymentMethod)}` : "";
      const psParam = paymentStatus !== "All" ? `&paymentStatus=${encodeURIComponent(paymentStatus)}` : "";
      
      const payload = await apiRequest(`/admin/orders?page=${page}&limit=${limit}${statusParam}${searchParam}${pmParam}${psParam}`);
      setOrders(payload.orders || []);
      setTotal(payload.total || 0);

      if (payload.counts) {
        setTabCounts(payload.counts);
      } else if (!debouncedSearch && activeTab === "All" && paymentMethod === "All" && paymentStatus === "All") {
        setTabCounts(prev => ({ ...prev, All: payload.total || 0 }));
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, debouncedSearch, paymentMethod, paymentStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleExport = async () => {
    try {
      const adminBase = await resolveAdminApiBase();
      const statusParam = activeTab !== "All" ? `status=${activeTab.toUpperCase()}` : "";
      const searchParam = debouncedSearch ? `search=${encodeURIComponent(debouncedSearch)}` : "";
      const pmParam = paymentMethod !== "All" ? `paymentMethod=${encodeURIComponent(paymentMethod)}` : "";
      const psParam = paymentStatus !== "All" ? `paymentStatus=${encodeURIComponent(paymentStatus)}` : "";
      
      const query = [statusParam, searchParam, pmParam, psParam].filter(Boolean).join("&");
      const url = `${adminBase}/orders/export${query ? `?${query}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `orders-export-${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Failed to export orders", err);
      alert("Failed to export orders. Please try again.");
    }
  };

  const tabs = [
    { label: "All" },
    { label: "Pending" },
    { label: "Processing" },
    { label: "Shipped" },
    { label: "Delivered" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
        <p className="text-zinc-400 text-sm">View and manage all customer orders</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 bg-[#1A1827] border border-[#2d2c45] rounded-xl px-4 py-2.5 w-full md:w-96 focus-within:border-[#8C63F5] focus-within:ring-1 focus-within:ring-[#8C63F5] transition-all shadow-sm">
          <span className="material-symbols-outlined text-zinc-400 text-[20px]">search</span>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1827] border border-[#2d2c45] rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 bg-[#1A1827] border ${showFilters ? 'border-[#8C63F5] text-[#8C63F5]' : 'border-[#2d2c45] text-zinc-300'} rounded-xl text-sm font-medium hover:text-white transition-all shadow-sm`}
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-4 mb-6 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-zinc-400">Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => { setPaymentMethod(e.target.value); setPage(1); }}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]"
            >
              <option value="All">All Methods</option>
              <option value="ONLINE">Online Payment</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-zinc-400">Payment Status</label>
            <select 
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#8C63F5]"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div className="flex items-end flex-none">
            <button 
              onClick={() => { setPaymentMethod("All"); setPaymentStatus("All"); setPage(1); }}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6 border-b border-[#2d2c45] overflow-x-auto whitespace-nowrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.label)}
            className={`pb-4 text-sm font-medium flex items-center gap-2 transition-colors relative ${
              activeTab === tab.label ? "text-[#8C63F5]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === tab.label 
                ? "bg-[#8C63F5] text-white" 
                : "bg-[#1A1827] text-zinc-400"
            }`}>
              {activeTab === tab.label ? total : (tabCounts[tab.label] || 0)}
            </span>
            {activeTab === tab.label && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8C63F5] rounded-t-full shadow-[0_-2px_10px_rgba(140,99,245,0.4)]" />
            )}
          </button>
        ))}
      </div>


      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <div className="w-8 h-8 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm">Loading orders...</p>
        </div>
      ) : (
        <>
          <div className="mt-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-sm">
            <OrdersTable orders={orders} />
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-zinc-400">
              Showing {orders.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} orders
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[#1A1827] border border-[#2d2c45] rounded-lg text-sm font-medium text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 bg-[#1A1827] border border-[#2d2c45] rounded-lg text-sm font-medium text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
