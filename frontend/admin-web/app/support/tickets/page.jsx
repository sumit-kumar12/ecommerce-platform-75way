"use client";

import React, { useState } from "react";
import Link from "next/link";

const TICKETS = [
  { id: "#TKT-1256", subject: "Payout not received", user: "Rahul Sharma", status: "Open", date: "May 31, 10:20 AM" },
  { id: "#TKT-1255", subject: "Unable to add product", user: "Priya Mehta", status: "In Progress", date: "May 31, 09:45 AM" },
  { id: "#TKT-1254", subject: "Refund pending", user: "Amit Verma", status: "Open", date: "May 31, 09:20 AM" },
  { id: "#TKT-1253", subject: "Login issue", user: "Sneha Iyer", status: "Resolved", date: "May 30, 06:15 PM" },
  { id: "#TKT-1252", subject: "API integration error", user: "Karan Patel", status: "In Progress", date: "May 30, 05:30 PM" },
];

export default function SupportTickets() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { name: "All", count: 88 },
    { name: "Open", count: 23 },
    { name: "In Progress", count: 18 },
    { name: "Resolved", count: 40 },
    { name: "Closed", count: 5 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Support Tickets</h2>
          <p className="text-slate-400 mt-1 text-sm">Manage and resolve support tickets</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#8C63F5] hover:bg-[#7b53de] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">add</span> New Ticket
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        {/* Toolbar */}
        <div className="px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.name ? "bg-[#8C63F5] text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {tab.name} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.name ? 'bg-white/20' : 'bg-zinc-800'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="pl-10 pr-4 py-2 bg-[#0F0E17] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-[#8C63F5] transition-colors w-full sm:w-64"
              />
            </div>
            <button className="p-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <tbody className="divide-y divide-zinc-800/60">
              {TICKETS.map((ticket, idx) => {
                let badgeColor = "";
                switch (ticket.status) {
                  case "Open": badgeColor = "text-red-400"; break;
                  case "In Progress": badgeColor = "text-[#F59E0B]"; break;
                  case "Resolved": badgeColor = "text-emerald-400"; break;
                  default: badgeColor = "text-slate-400";
                }

                return (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors cursor-pointer">
                    <td className="p-5 pl-6 w-[120px]">
                      <span className="text-sm font-medium text-[#8C63F5]">{ticket.id}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white mb-0.5">{ticket.subject}</span>
                        <span className="text-xs text-zinc-500">{ticket.user}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-5 pr-6 text-right">
                      <span className="text-sm text-zinc-400">{ticket.date}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-zinc-500">
          <span>Showing 1 to 5 of 88 tickets</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">3</button>
            <span className="px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">18</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
