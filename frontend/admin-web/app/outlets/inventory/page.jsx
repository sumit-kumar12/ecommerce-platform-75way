"use client";

import React, { useState } from "react";
import Link from "next/link";

const initialInventory = [
  { id: 1, name: "Wireless Headphones", sku: "KB-WH-1001", inStock: 120, reserved: 20, available: 100, status: "In Stock" },
  { id: 2, name: "Smart Watch Pro", sku: "KB-SW-2002", inStock: 45, reserved: 5, available: 40, status: "Low Stock" },
  { id: 3, name: "Leather Wallet", sku: "KB-LW-3003", inStock: 0, reserved: 0, available: 0, status: "Out of Stock" },
  { id: 4, name: "Backpack Pro", sku: "KB-BP-4004", inStock: 230, reserved: 30, available: 200, status: "In Stock" },
  { id: 5, name: "Sneakers Air Max", sku: "KB-SN-5005", inStock: 15, reserved: 5, available: 10, status: "Low Stock" },
];

export default function OutletInventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredInventory = inventory.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || i.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    if (status === "In Stock") return "text-green-400 bg-green-400/10";
    if (status === "Low Stock") return "text-yellow-400 bg-yellow-400/10";
    return "text-red-400 bg-red-400/10 animate-pulse";
  };

  const handleStockChange = (id, newStock) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, inStock: newStock } : item));
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 mb-1">Commerce Control</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Outlet Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">Detailed inventory with stock levels</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#1A1827] border border-[#2d2c45] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#8C63F5]">
            <option>Katabazaar Mumbai</option>
            <option>Katabazaar Bangalore</option>
            <option>Katabazaar Delhi</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0E17] border border-[#2d2c45] hover:bg-[#2d2c45] text-slate-300 rounded-lg text-sm font-medium transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
        </div>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#2d2c45] border-b border-[#2d2c45]">
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Products</p>
            <p className="text-2xl font-bold text-white">2,450</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">In Stock</p>
            <p className="text-2xl font-bold text-green-400">1,820</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-400">320</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-red-400">310</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-[#2d2c45] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>

          <div className="flex bg-[#0F0E17] p-1 rounded-lg border border-[#2d2c45]">
            {["All", "In Stock", "Low Stock", "Out of Stock"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeFilter === filter ? "bg-[#2d2c45] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Product</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">SKU</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-center">In Stock</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-center">Reserved</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-center">Available</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {filteredInventory.map((item, i) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-white/[0.02] transition-colors group animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2d2c45] flex items-center justify-center text-slate-400 shrink-0">
                        <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                      </div>
                      <span className="text-sm font-medium text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-400">{item.sku}</td>
                  <td className="py-4 px-6 text-center">
                    <input 
                      type="number" 
                      value={item.inStock} 
                      onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#0F0E17] border border-[#2d2c45] rounded-md px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-[#8C63F5] transition-colors"
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-400 text-center">{item.reserved}</td>
                  <td className="py-4 px-6 text-sm text-white font-bold text-center">{item.available}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-md transition-colors flex items-center justify-center ml-auto" title="Save Adjustment">
                      <span className="material-symbols-outlined text-[18px]">save</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#2d2c45] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F0E17]">
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filteredInventory.length}</span> of <span className="font-medium text-white">2,450</span> products
          </p>
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <Link href="#" className="text-sm font-medium text-[#8C63F5] hover:underline">View all</Link>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white font-bold text-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors text-sm">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors text-sm">3</button>
              <span className="text-slate-500 px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors text-sm">490</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
