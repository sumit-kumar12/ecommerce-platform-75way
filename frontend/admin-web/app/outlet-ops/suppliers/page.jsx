"use client";

import React from "react";

const SUPPLIERS = [
  { id: 1, name: "Tech Distributors", contact: "Ravi Kumar", phone: "9876543210", orders: 24, status: "Active", icon: "T" },
  { id: 2, name: "Gadget World", contact: "Anita Verma", phone: "9123456780", orders: 18, status: "Active", icon: "G" },
  { id: 3, name: "Digital Supplies", contact: "Vikram Singh", phone: "9988776655", orders: 31, status: "Active", icon: "D" },
  { id: 4, name: "Fashion Hub", contact: "Neha Patel", phone: "9012345678", orders: 16, status: "Active", icon: "F" },
  { id: 5, name: "Home Essentials", contact: "Arun Das", phone: "9888988898", orders: 22, status: "Inactive", icon: "H" },
];

export default function SupplierManagement() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-full">
      
      <div className="flex flex-col md:flex-row items-center justify-end gap-4">
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-medium transition-colors shrink-0">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Supplier
        </button>
      </div>

      <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider bg-[#0F0E17]">
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Contact Person</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium text-center">Total Orders</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SUPPLIERS.map((supplier) => (
                <tr key={supplier.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F0E17] border border-zinc-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {supplier.icon}
                    </div>
                    <span className="text-slate-300 font-medium">{supplier.name}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{supplier.contact}</td>
                  <td className="px-6 py-4 text-zinc-400 font-mono">{supplier.phone}</td>
                  <td className="px-6 py-4 text-center text-white">{supplier.orders}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border inline-block ${
                      supplier.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {supplier.status}
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

        {/* Footer KPIs & Link */}
        <div className="border-t border-zinc-800/60 bg-[#0F0E17] grid grid-cols-1 md:grid-cols-4 items-center">
          <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <p className="text-zinc-400 text-xs mb-1">Total Suppliers</p>
            <p className="text-xl font-bold text-white">18</p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <p className="text-zinc-400 text-xs mb-1">Active Suppliers</p>
            <p className="text-xl font-bold text-emerald-400">15</p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <p className="text-zinc-400 text-xs mb-1">Inactive Suppliers</p>
            <p className="text-xl font-bold text-red-400">3</p>
          </div>
          <div className="p-6 text-center">
            <button className="text-[#8C63F5] text-sm font-medium hover:text-[#7b53de] transition-colors">
              View All Suppliers
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
