"use client";

import React, { useState } from "react";

const ALERTS = [
  { 
    id: 1, 
    type: "Critical", 
    title: "Payment Gateway Down", 
    desc: "Razorpay is experiencing issues. Some payments may fail.", 
    time: "10 mins ago",
    icon: "error",
    color: "text-red-400 bg-red-400/10 border-red-500/20",
    iconColor: "text-red-500"
  },
  { 
    id: 2, 
    type: "Warning", 
    title: "High Refund Rate", 
    desc: "Refund rate is 8.5% higher than usual.", 
    time: "1 hour ago",
    icon: "warning",
    color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
    iconColor: "text-[#F59E0B]"
  },
  { 
    id: 3, 
    type: "Warning", 
    title: "Low Stock Alert", 
    desc: "15 products are running low on stock.", 
    time: "2 hours ago",
    icon: "inventory_2",
    color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
    iconColor: "text-[#F59E0B]"
  },
  { 
    id: 4, 
    type: "Info", 
    title: "Daily Backup Completed", 
    desc: "Your data backup was completed successfully.", 
    time: "3 hours ago",
    icon: "cloud_done",
    color: "text-blue-400 bg-blue-400/10 border-blue-500/20",
    iconColor: "text-blue-500"
  },
  { 
    id: 5, 
    type: "Info", 
    title: "New Feature Released", 
    desc: "Bulk product upload is now available.", 
    time: "1 day ago",
    icon: "new_releases",
    color: "text-blue-400 bg-blue-400/10 border-blue-500/20",
    iconColor: "text-blue-500"
  },
];

export default function AlertsNotifications() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Alerts (8)", "Notifications (24)", "System (5)"];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Alerts & Notifications</h2>
          <p className="text-slate-400 mt-1 text-sm">System alerts and important notifications</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        
        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === tab ? "text-[#8C63F5]" : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C63F5] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-end mb-4">
            <button className="text-sm font-medium text-[#8C63F5] hover:text-[#7b53de] transition-colors">
              Mark all as read
            </button>
          </div>

          <div className="space-y-4">
            {ALERTS.map((alert) => (
              <div key={alert.id} className="flex gap-4 p-4 rounded-xl border border-zinc-800/60 bg-[#1A1827] hover:border-zinc-700 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${alert.color}`}>
                  <span className={`material-symbols-outlined text-[20px] ${alert.iconColor}`}>{alert.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${alert.color}`}>
                        {alert.type}
                      </span>
                      <h4 className="font-bold text-white truncate">{alert.title}</h4>
                    </div>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-300">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="px-6 py-4 border-t border-zinc-800/60 text-center bg-[#1A1827] rounded-b-2xl">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full">
            View all notifications <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
