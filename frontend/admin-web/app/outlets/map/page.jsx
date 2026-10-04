"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function OutletMapPage() {
  const [selectedZone, setSelectedZone] = useState("All Zones");

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-130px)] bg-[#0F0E17] overflow-hidden rounded-2xl border border-[#2d2c45] shadow-2xl">
      {/* Sidebar */}
      <div className="w-full lg:w-[350px] flex-shrink-0 bg-[#1A1827] border-r border-[#2d2c45] flex flex-col z-10 animate-slide-in-right shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="p-5 border-b border-[#2d2c45]">
          <h1 className="text-xl font-bold text-white mb-4">Outlets Map</h1>
          <div className="flex gap-2">
            <select className="flex-1 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8C63F5]">
              <option>All Zones</option>
              <option>North Zone</option>
              <option>South Zone</option>
            </select>
            <select className="flex-1 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8C63F5]">
              <option>All Cities</option>
              <option>Mumbai</option>
              <option>Delhi</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* KPI List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0F0E17] rounded-lg border border-[#2d2c45]">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">All Outlets</p>
                <p className="text-xl font-bold text-white">112</p>
              </div>
              <span className="material-symbols-outlined text-[#8C63F5]">store</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-400/10 rounded-lg border border-green-400/20 text-center">
                <p className="text-lg font-bold text-green-400">98</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Active</p>
              </div>
              <div className="p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20 text-center">
                <p className="text-lg font-bold text-yellow-400">14</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Low Stock</p>
              </div>
            </div>

            <div className="p-3 bg-red-400/10 rounded-lg border border-red-400/20 text-center">
              <p className="text-lg font-bold text-red-400">3</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Out of Stock</p>
            </div>
          </div>

          {/* Zones List */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">By Zone</h3>
            <div className="space-y-2">
              {[
                { name: "North Zone", count: 24 },
                { name: "South Zone", count: 35 },
                { name: "West Zone", count: 41 },
                { name: "East Zone", count: 12 },
              ].map(zone => (
                <div key={zone.name} className="flex items-center justify-between p-2 hover:bg-[#0F0E17] rounded-lg transition-colors cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{zone.name}</span>
                  <span className="text-xs font-bold text-slate-500 bg-[#0F0E17] px-2 py-1 rounded group-hover:bg-[#2d2c45] group-hover:text-white transition-colors">
                    {zone.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#13111C] overflow-hidden flex flex-col">
        {/* Top bar on map */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-bold hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Outlet
          </button>
        </div>

        {/* Map Placeholder (SVG styling) */}
        <div className="absolute inset-0 z-0">
          <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2d2c45" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Abstract India Map Shape */}
            <path d="M400,200 Q450,150 500,250 T550,400 T450,550 T350,500 T300,350 Z" fill="#1A1827" stroke="#2d2c45" strokeWidth="2" className="opacity-50" />
            
            {/* Markers */}
            <g className="animate-scale-in" style={{ animationDelay: '300ms' }}>
              <circle cx="350" cy="300" r="8" fill="#4ade80" className="animate-pulse" />
              <circle cx="350" cy="300" r="16" fill="#4ade80" opacity="0.2" className="animate-ping" />
            </g>
            
            <g className="animate-scale-in" style={{ animationDelay: '500ms' }}>
              <circle cx="480" cy="380" r="8" fill="#facc15" />
            </g>
            
            <g className="animate-scale-in" style={{ animationDelay: '700ms' }}>
              <circle cx="420" cy="480" r="8" fill="#4ade80" />
            </g>
            
            <g className="animate-scale-in" style={{ animationDelay: '900ms' }}>
              <circle cx="520" cy="280" r="8" fill="#f87171" />
              <circle cx="520" cy="280" r="16" fill="#f87171" opacity="0.2" className="animate-ping" />
            </g>
          </svg>
        </div>
        
        {/* Mock Popup */}
        <div className="absolute top-[260px] left-[370px] z-10 w-48 bg-[#1A1827] border border-[#2d2c45] rounded-lg shadow-xl p-3 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
          <p className="text-xs font-bold text-white mb-1">Katabazaar Delhi</p>
          <p className="text-[10px] text-slate-400 mb-2">New Delhi, Delhi</p>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Active
            </span>
            <span className="text-slate-300">Stock: Good</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-20 flex gap-4 bg-[#1A1827] border border-[#2d2c45] p-3 rounded-lg shadow-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="w-3 h-3 rounded-full bg-green-400"></span> Active
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Low Stock
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-400"></span> Out of Stock
          </div>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
          <button className="w-10 h-10 bg-[#1A1827] border border-[#2d2c45] rounded-lg flex items-center justify-center text-white hover:bg-[#2d2c45] transition-colors shadow-lg">
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="w-10 h-10 bg-[#1A1827] border border-[#2d2c45] rounded-lg flex items-center justify-center text-white hover:bg-[#2d2c45] transition-colors shadow-lg">
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
