"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { StatCard } from "../../../components/dashboard/StatCard";
import CouponModal from "./CouponModal";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/coupons");
      setCoupons(payload.coupons || []);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await apiRequest(`/admin/offers/${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
      alert(err.message || "Failed to delete coupon");
    }
  };

  const openNewModal = () => {
    setCouponToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setCouponToEdit(coupon);
    setIsModalOpen(true);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied ${code} to clipboard!`);
  };

  const getStatus = (coupon) => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    if (!coupon.isActive) return "inactive";
    if (now < start) return "scheduled";
    if (now > end) return "expired";
    return "active";
  };

  const filteredCoupons = coupons.filter(c => {
    const status = getStatus(c);
    if (activeTab !== "all" && status !== activeTab) return false;
    if (search && !c.code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalCoupons = coupons.length;
  const activeCount = coupons.filter(c => getStatus(c) === "active").length;
  const usedCount = coupons.reduce((acc, c) => acc + (c.redeemedCount || 0), 0);
  
  // Example dummy discount total
  const totalDiscount = 642890;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Marketing</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Coupons</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Coupons</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage discount coupons & codes</p>
        </div>
        
        <button 
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Coupon
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Coupons" value={totalCoupons.toLocaleString()} icon="confirmation_number" color="#8C63F5" trend={10.3} />
        <StatCard title="Active" value={activeCount.toLocaleString()} icon="play_circle" color="#10B861" trend={5.6} />
        <StatCard title="Used" value={usedCount.toLocaleString()} icon="how_to_reg" color="#00DAFF" trend={22.4} />
        <StatCard title="Total Discount" value={`₹${totalDiscount.toLocaleString()}`} icon="savings" color="#EF4444" trend={8.5} />
      </div>

      {/* DataTable */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2d2c45] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0F0E17] p-1 rounded-lg border border-[#2d2c45] overflow-x-auto max-w-full">
            {['all', 'active', 'scheduled', 'expired'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap ${
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
                placeholder="Search coupons..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0E17]/50 border-b border-[#2d2c45] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium pl-6">Coupon Code</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium text-right">Discount</th>
                <th className="p-4 font-medium text-right">Usage</th>
                <th className="p-4 font-medium text-right">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading coupons...</td></tr>
              ) : filteredCoupons.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No coupons found.</td></tr>
              ) : filteredCoupons.map(c => {
                const status = getStatus(c);
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-[#8C63F5]">
                          <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold font-mono text-white tracking-wider">{c.code}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{c.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#8C63F5]/10 text-[#8C63F5]">
                        Percentage
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-bold text-white">{c.discountPercent}% OFF</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1A1827] border border-[#2d2c45] text-slate-300">
                        {c.redeemedCount} / {c.usageLimit || '∞'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {status === 'active' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#10B861]/10 text-[#10B861] border border-[#10B861]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B861] animate-pulse" /> Active
                        </span>
                      )}
                      {status === 'scheduled' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                          Scheduled
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
                          onClick={() => copyToClipboard(c.code)}
                          className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" 
                          title="Copy Code"
                        >
                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        </button>
                        <button 
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
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
      </div>
      
      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          fetchCoupons();
        }}
        couponToEdit={couponToEdit}
      />
    </div>
  );
}
