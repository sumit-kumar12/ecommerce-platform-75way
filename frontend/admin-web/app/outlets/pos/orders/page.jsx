"use client";

import React, { useState } from "react";

const ORDERS = [
  { id: "PO-10025", supplier: "Tech Distributor", date: "May 31, 2024", status: "Open" },
  { id: "PO-10024", supplier: "Gadget World", date: "May 28, 2024", status: "Received" },
  { id: "PO-10023", supplier: "Digital Supplies", date: "May 25, 2024", status: "Open" },
];

export default function SupplierOrders() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Open", "Received"];

  const filteredOrders = ORDERS.filter(o => activeTab === "All" || o.status === activeTab);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Orders</h2>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800/50 rounded uppercase tracking-wider">Suppliers</span>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col h-[700px]">
        
        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-8 w-full justify-between">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative flex-1 ${
                  activeTab === tab ? "text-[#8C63F5]" : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C63F5] rounded-t-full mx-4"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto hide-scrollbar">
          {filteredOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/60 bg-[#0F0E17] hover:border-zinc-700 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{order.id}</h4>
                <p className="text-sm text-slate-300">{order.supplier}</p>
                <p className="text-xs text-zinc-500 mt-1">{order.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                order.status === 'Open' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {order.status}
              </span>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-zinc-500 text-sm">
              No orders found for "{activeTab}".
            </div>
          )}
        </div>

        {/* Action */}
        <div className="p-6 bg-[#0F0E17] border-t border-zinc-800/60 rounded-b-2xl text-center">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full">
            <span className="material-symbols-outlined text-[18px]">add</span> New Order
          </button>
        </div>

      </div>
    </div>
  );
}
