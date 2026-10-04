"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";
import { StatCard } from "../../../components/dashboard/StatCard";
import FlashDealModal from "./FlashDealModal";

export default function FlashDealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/flash-deals");
      setDeals(payload.flashDeals || payload.deals || []);
    } catch (err) {
      console.error("Failed to load flash deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this flash deal?")) return;
    try {
      await apiRequest(`/admin/flash-deals/${id}`, { method: "DELETE" });
      fetchDeals();
    } catch (err) {
      console.error("Failed to delete flash deal", err);
      alert(err.message || "Failed to delete flash deal");
    }
  };

  const openNewModal = () => {
    setDealToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  const getStatus = (deal) => {
    const now = new Date();
    const start = new Date(deal.startDate);
    const end = new Date(deal.endDate);
    if (!deal.isActive) return "inactive";
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "live";
  };

  const filteredDeals = deals.filter(d => {
    const status = getStatus(d);
    if (activeTab !== "all" && status !== activeTab) return false;
    if (search && !(d.title || d.name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalDeals = deals.length;
  const liveDeals = deals.filter(d => getStatus(d) === "live").length;
  const upcomingDeals = deals.filter(d => getStatus(d) === "upcoming").length;
  const expiredDeals = deals.filter(d => getStatus(d) === "expired").length;
  
  // Example dummy sales data since flashDeal schema might not easily track exact revenue directly without aggregation
  const totalSales = 1285750;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Marketing</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Flash Deals</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Flash Deals</h1>
          <p className="text-slate-400 mt-1 text-sm">Create & manage limited time flash deals</p>
        </div>
        
        <button 
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Deal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Deals" value={totalDeals.toLocaleString()} icon="bolt" color="#8C63F5" />
        <StatCard title="Upcoming" value={upcomingDeals.toLocaleString()} icon="schedule" color="#F59E0B" />
        <StatCard title="Expired" value={expiredDeals.toLocaleString()} icon="history" color="#EF4444" />
        <StatCard title="Total Sales" value={`₹${totalSales.toLocaleString()}`} icon="payments" trend={13.6} color="#10B861" />
      </div>

      {/* DataTable */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2d2c45] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0F0E17] p-1 rounded-lg border border-[#2d2c45]">
            {['all', 'live', 'upcoming', 'expired'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                  activeTab === tab 
                    ? "bg-[#2d2c45] text-white shadow-sm" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 w-full md:w-64">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search deals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
              />
            </div>
            <button className="p-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0E17]/50 border-b border-[#2d2c45] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium pl-6">Deal Name</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Validity</th>
                <th className="p-4 font-medium text-right">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading flash deals...</td></tr>
              ) : filteredDeals.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No flash deals found.</td></tr>
              ) : filteredDeals.map(deal => {
                const status = getStatus(deal);
                return (
                  <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-[#8C63F5]">
                          <span className="material-symbols-outlined text-[20px]">bolt</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{deal.title || deal.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{deal.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-bold text-[#10B861]">{deal.discountType === "PERCENTAGE" ? `${deal.discountValue}%` : `₹${deal.discountValue}`}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-300">
                        {new Date(deal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(deal.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {status === 'live' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#10B861]/10 text-[#10B861] border border-[#10B861]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B861] animate-pulse" /> Live
                        </span>
                      )}
                      {status === 'upcoming' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                          Upcoming
                        </span>
                      )}
                      {status === 'expired' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-slate-400 border border-zinc-700">
                          Expired
                        </span>
                      )}
                      {status === 'inactive' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(deal)}
                          className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(deal.id)}
                          className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-[#2d2c45] flex items-center justify-between text-sm text-slate-400">
          <span>Showing {filteredDeals.length} deals</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

      </div>
      
      <FlashDealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          fetchDeals();
        }}
        dealToEdit={dealToEdit}
      />
    </div>
  );
}
