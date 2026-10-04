"use client";

import { useState } from "react";

const topStats = [
  { label: "Total Campaigns", value: "24", icon: "campaign", color: "text-[#8C63F5]", bg: "bg-[#8C63F5]/10" },
  { label: "Total Spend", value: "₹2,45,680", icon: "payments", color: "text-red-400", bg: "bg-red-500/10", trend: "+15.0%", up: false },
  { label: "Revenue", value: "₹88,76,430", icon: "trending_up", color: "text-green-400", bg: "bg-green-500/10", trend: "+15.0%", up: true },
  { label: "Avg. ROI", value: "3.57x", icon: "query_stats", color: "text-blue-400", bg: "bg-blue-500/10", trend: "+15.0%", up: true },
];

const campaigns = [
  { name: "Summer Sale 2024", spend: "₹78,450", revenue: "₹3,65,100", orders: 2330, roi: 4.65, status: "Active" },
  { name: "New Arrivals Drop", spend: "₹42,200", revenue: "₹1,88,000", orders: 980, roi: 4.45, status: "Active" },
  { name: "Email Promo May", spend: "₹32,500", revenue: "₹85,400", orders: 858, roi: 2.63, status: "Completed" },
  { name: "Social Media May", spend: "₹52,340", revenue: "₹1,25,600", orders: 1170, roi: 2.40, status: "Completed" },
  { name: "Referral Program", spend: "₹40,190", revenue: "₹2,12,330", orders: 0, roi: 0, status: "Scheduled" },
];

const statusStyles = {
  Active: "bg-green-500/10 text-green-400",
  Completed: "bg-slate-500/10 text-slate-400",
  Scheduled: "bg-blue-500/10 text-blue-400",
};

export default function CampaignsReportPage() {
  const [sort, setSort] = useState(null);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Reports</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Marketing Campaigns Report</h1>
          <p className="text-sm text-slate-400 mt-1">Track campaign performance and ROI</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-[#1A1827] border border-[#2d2c45] px-3 py-2 rounded-lg">
            May 01 – May 31, 2024
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(card => (
          <div key={card.label} className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                <span className="material-symbols-outlined text-[16px]">{card.icon}</span>
              </div>
            </div>
            <p className="text-xl font-bold text-white">{card.value}</p>
            {card.trend && (
              <span className={`text-xs font-medium flex items-center gap-1 ${card.up ? "text-green-500" : "text-red-500"}`}>
                <span className="material-symbols-outlined text-[13px]">{card.up ? "arrow_upward" : "arrow_downward"}</span>
                {card.trend}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2d2c45] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">All Campaigns</h2>
          <span className="text-xs text-slate-400">{campaigns.length} campaigns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                {["Campaign", "Spend", "Revenue", "Orders", "ROI", "Status"].map(h => (
                  <th key={h} className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {campaigns.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-white">{row.name}</td>
                  <td className="py-4 px-6 text-sm text-slate-300">{row.spend}</td>
                  <td className="py-4 px-6 text-sm font-medium text-green-400">{row.revenue}</td>
                  <td className="py-4 px-6 text-sm text-slate-300">{row.orders > 0 ? row.orders.toLocaleString() : "—"}</td>
                  <td className="py-4 px-6">
                    {row.roi > 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-white">{row.roi}x</span>
                        <div className="w-16 h-1.5 bg-[#2d2c45] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((row.roi / 5) * 100, 100)}%`,
                              background: row.roi >= 4 ? "#10B981" : row.roi >= 2.5 ? "#F59E0B" : "#EF4444"
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
