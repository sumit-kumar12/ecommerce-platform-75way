"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { StatCard } from "../../../components/dashboard/StatCard";
import OfferModal from "./OfferModal";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/offers");
      setOffers(payload.offers || []);
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      await apiRequest(`/admin/offers/${id}`, { method: "DELETE" });
      fetchOffers();
    } catch (err) {
      console.error("Failed to delete offer", err);
      alert(err.message || "Failed to delete offer");
    }
  };

  const openNewModal = () => {
    setOfferToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offer) => {
    setOfferToEdit(offer);
    setIsModalOpen(true);
  };

  const getStatus = (offer) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    if (!offer.isActive) return "inactive";
    if (now < start) return "scheduled";
    if (now > end) return "expired";
    return "active";
  };

  const filteredOffers = offers.filter(o => {
    const status = getStatus(o);
    if (activeTab !== "all" && status !== activeTab) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalOffers = offers.length;
  const activeCount = offers.filter(o => getStatus(o) === "active").length;
  const totalRedemptions = offers.reduce((acc, o) => acc + (o.redeemedCount || 0), 0);
  
  // Example dummy discount total, could be aggregated via API
  const totalDiscount = 765430;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Marketing</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Offers</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Offers</h1>
          <p className="text-slate-400 mt-1 text-sm">Create site-wide offers & promotions</p>
        </div>
        
        <button 
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Offer
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Offers" value={totalOffers.toLocaleString()} icon="local_offer" color="#8C63F5" trend={32} />
        <StatCard title="Active Offers" value={activeCount.toLocaleString()} icon="play_circle" color="#10B861" trend={11} />
        <StatCard title="Redemptions" value={totalRedemptions.toLocaleString()} icon="redeem" color="#00DAFF" trend={15.5} />
        <StatCard title="Total Discount" value={`₹${totalDiscount.toLocaleString()}`} icon="savings" color="#F59E0B" trend={10} />
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
                placeholder="Search offers..."
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
                <th className="p-4 font-medium pl-6">Offer Name</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium text-right">Discount</th>
                <th className="p-4 font-medium">Validity</th>
                <th className="p-4 font-medium text-right">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading offers...</td></tr>
              ) : filteredOffers.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No offers found.</td></tr>
              ) : filteredOffers.map(offer => {
                const status = getStatus(offer);
                return (
                  <tr key={offer.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-[#8C63F5]">
                          <span className="material-symbols-outlined text-[20px]">local_offer</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{offer.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{offer.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#8C63F5]/10 text-[#8C63F5]">
                        Percentage
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-bold text-white">{offer.discountPercent}% OFF</span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-300">
                        {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
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
                          onClick={() => openEditModal(offer)}
                          className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(offer.id)}
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
      
      <OfferModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          fetchOffers();
        }}
        offerToEdit={offerToEdit}
      />
    </div>
  );
}
