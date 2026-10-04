"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../lib/api';

export default function ReturnsManagement() {
  const router = useRouter();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const data = await apiRequest("/returns/admin");
        setReturns(data.returns || []);
      } catch (err) {
        console.error("Failed to fetch returns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const tabs = [
    { label: 'All', count: returns.length },
    { label: 'PENDING', count: returns.filter(r => r.status === 'PENDING').length },
    { label: 'APPROVED', count: returns.filter(r => r.status === 'APPROVED').length },
    { label: 'REJECTED', count: returns.filter(r => r.status === 'REJECTED').length },
    { label: 'COMPLETED', count: returns.filter(r => r.status === 'COMPLETED').length }
  ];

  const filteredReturns = activeTab === 'All' 
    ? returns 
    : returns.filter(r => r.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>;
      case "COMPLETED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Completed</span>;
      case "PENDING": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case "REJECTED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-[#0F0E17]">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Returns & Refunds</h1>
        <p className="text-zinc-400 text-sm">Handle customer return and refund requests</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-white">{returns.length}</p>
        </div>
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-amber-400">{returns.filter(r => r.status === 'PENDING').length}</p>
        </div>
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Approved Returns</p>
          <p className="text-3xl font-bold text-emerald-400">{returns.filter(r => r.status === 'APPROVED').length}</p>
        </div>
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Rejected Returns</p>
          <p className="text-3xl font-bold text-red-400">{returns.filter(r => r.status === 'REJECTED').length}</p>
        </div>
      </div>

      <div className="flex gap-6 border-b border-[#2d2c45] overflow-x-auto whitespace-nowrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`pb-4 text-sm font-medium flex items-center gap-2 transition-colors relative ${
              activeTab === tab.label ? "text-[#8C63F5]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label === 'All' ? 'All Requests' : tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === tab.label 
                ? "bg-[#8C63F5] text-white" 
                : "bg-[#1A1827] text-zinc-400"
            }`}>
              {tab.count}
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
          <p className="text-sm">Loading returns...</p>
        </div>
      ) : filteredReturns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-zinc-600 text-5xl mb-4">assignment_return</span>
          <h3 className="text-xl font-medium text-white mb-2">No return requests</h3>
          <p className="text-zinc-500">There are no return requests matching this status.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/20 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredReturns.map((ret) => (
                  <tr 
                    key={ret.id} 
                    className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/orders/${ret.orderId}/refund`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-white">#{ret.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-zinc-400">
                        {new Date(ret.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#8C63F5] font-medium">#{ret.orderId.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-zinc-200">{ret.order?.customerName || "Customer"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-300 line-clamp-1">{ret.reason}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ret.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/orders/${ret.orderId}/refund`);
                        }}
                        className="text-sm font-medium text-[#8C63F5] hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-[#8C63F5]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
