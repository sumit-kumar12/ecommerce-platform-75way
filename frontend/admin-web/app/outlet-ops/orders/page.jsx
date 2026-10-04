"use client";

import React, { useState } from "react";

const SUPPLIER_ORDERS = [
  { id: "PO-10025", supplier: "Tech Distributors", date: "May 31, 2024", items: 24, amount: 25340, status: "In Transit" },
  { id: "PO-10024", supplier: "Gadget World", date: "May 30, 2024", items: 18, amount: 18760, status: "Delivered" },
  { id: "PO-10023", supplier: "Digital Supplies", date: "May 29, 2024", items: 12, amount: 12850, status: "Ordered" },
  { id: "PO-10022", supplier: "Fashion Hub", date: "May 28, 2024", items: 30, amount: 32450, status: "Delivered" },
  { id: "PO-10021", supplier: "Home Essentials", date: "May 27, 2024", items: 16, amount: 15160, status: "Cancelled" },
];

export default function SupplierOrders() {
  const [activeTab, setActiveTab] = useState("All Orders");

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Transit": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Ordered": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-full">
      
      {/* Header Tabs & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
          {["All Orders", "Draft", "Ordered", "In Transit", "Delivered", "Cancelled"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-[#8C63F5] text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-medium transition-colors shrink-0">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Order
        </button>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden">
        
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-800/60 divide-x divide-zinc-800/60">
          <div className="p-6">
            <p className="text-zinc-400 text-xs mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-white">56</p>
          </div>
          <div className="p-6">
            <p className="text-zinc-400 text-xs mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-white">₹1,24,560.00</p>
          </div>
          <div className="p-6">
            <p className="text-zinc-400 text-xs mb-1">In Transit</p>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
          <div className="p-6">
            <p className="text-zinc-400 text-xs mb-1">Delivered</p>
            <p className="text-2xl font-bold text-white">28</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider bg-[#0F0E17]">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium text-center">Date</th>
                <th className="px-6 py-4 font-medium text-center">Items</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SUPPLIER_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-white font-mono">{order.id}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{order.supplier}</td>
                  <td className="px-6 py-4 text-center text-zinc-400">{order.date}</td>
                  <td className="px-6 py-4 text-center text-white">{order.items}</td>
                  <td className="px-6 py-4 text-right text-white font-medium">₹{order.amount.toLocaleString('en-IN')}.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-1">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/60 text-center bg-[#0F0E17]">
          <button className="text-[#8C63F5] text-sm font-medium hover:text-[#7b53de] transition-colors">
            View All Orders
          </button>
        </div>

      </div>

    </div>
  );
}
