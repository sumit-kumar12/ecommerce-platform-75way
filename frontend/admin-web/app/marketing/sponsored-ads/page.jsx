"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { StatCard } from "../../../components/dashboard/StatCard";
import SponsoredAdModal from "./SponsoredAdModal";

export default function SponsoredAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/sponsored-ads");
      setAds(payload.sponsoredAds || payload.ads || []);
    } catch (err) {
      console.error("Failed to load sponsored ads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this sponsored ad?")) return;
    try {
      await apiRequest(`/admin/sponsored-ads/${id}`, { method: "DELETE" });
      fetchAds();
    } catch (err) {
      console.error("Failed to delete sponsored ad", err);
      alert(err.message || "Failed to delete sponsored ad");
    }
  };

  const openNewModal = () => {
    setAdToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ad) => {
    setAdToEdit(ad);
    setIsModalOpen(true);
  };

  const filteredAds = ads.filter(ad => {
    if (activeTab !== "all" && ad.status !== activeTab) return false;
    if (search && !ad.campaignName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalAds = ads.length;
  const totalClicks = ads.reduce((acc, ad) => acc + (ad.clicks || 0), 0);
  const totalImpressions = ads.reduce((acc, ad) => acc + (ad.impressions || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
  
  // Spend could be calculated from daily budget or tracked metrics, we'll use a dummy calculation here 
  // or a total from the DB if available.
  const totalSpend = 245780; 

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Marketing</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Sponsored Ads</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sponsored Ads</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage sponsored product & banner ads</p>
        </div>
        
        <button 
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Ad
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Ads" value={totalAds.toLocaleString()} icon="campaign" color="#8C63F5" />
        <StatCard title="Clicks" value={totalClicks.toLocaleString()} icon="touch_app" color="#10B861" />
        <StatCard title="Average CTR" value={`${avgCtr}%`} icon="ads_click" color="#00DAFF" />
        <StatCard title="Total Spend" value={`₹${totalSpend.toLocaleString()}`} icon="payments" color="#EF4444" />
      </div>

      {/* DataTable */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2d2c45] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0F0E17] p-1 rounded-lg border border-[#2d2c45] overflow-x-auto max-w-full">
            {['all', 'active', 'paused', 'completed'].map(tab => (
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
                placeholder="Search campaigns..."
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
                <th className="p-4 font-medium pl-6">Ad Campaign</th>
                <th className="p-4 font-medium">Placement</th>
                <th className="p-4 font-medium text-right">Clicks</th>
                <th className="p-4 font-medium text-right">CTR</th>
                <th className="p-4 font-medium text-right">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading ads...</td></tr>
              ) : filteredAds.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No sponsored ads found.</td></tr>
              ) : filteredAds.map(ad => {
                const ctr = (ad.impressions || 0) > 0 ? (((ad.clicks || 0) / (ad.impressions || 1)) * 100).toFixed(2) : 0;
                return (
                  <tr key={ad.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-[#00DAFF]">
                          <span className="material-symbols-outlined text-[20px]">ad</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{ad.campaignName}</p>
                          <p className="text-xs text-slate-500">Targeting Product #{(ad.productId || "").substring(0,6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-300">Position {ad.adPosition}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-medium text-white">{(ad.clicks || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-medium text-white">{ctr}%</span>
                    </td>
                    <td className="p-4 text-right">
                      {ad.status === 'active' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#10B861]/10 text-[#10B861] border border-[#10B861]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B861] animate-pulse" /> Active
                        </span>
                      )}
                      {ad.status === 'paused' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                          Paused
                        </span>
                      )}
                      {ad.status === 'completed' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-slate-400 border border-zinc-700">
                          Completed
                        </span>
                      )}
                      {ad.status === 'scheduled' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#8C63F5]/10 text-[#8C63F5] border border-[#8C63F5]/20">
                          Scheduled
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(ad)}
                          className="p-1.5 hover:bg-[#8C63F5]/10 text-zinc-400 hover:text-[#8C63F5] rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(ad.id)}
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
      
      <SponsoredAdModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          fetchAds();
        }}
        adToEdit={adToEdit}
      />
    </div>
  );
}
