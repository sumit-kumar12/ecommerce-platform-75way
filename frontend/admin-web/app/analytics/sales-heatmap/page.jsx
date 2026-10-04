"use client";
import React, { useState, useEffect } from "react";

const TOP_STATES = [
  { state: "Maharashtra", value: "₹40,46,800" },
  { state: "Karnataka", value: "₹32,28,700" },
  { state: "Delhi NCR", value: "₹28,75,000" },
  { state: "Gujarat", value: "₹22,10,200" },
  { state: "Uttar Pradesh", value: "₹19,45,600" },
];

const HOURS = ["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// Generate mock heatmap data (intensity 0-100)
const generateHeatData = () => {
  return DAYS.map((_, di) =>
    HOURS.map((_, hi) => {
      const isPeak = (hi >= 10 && hi <= 14) || (hi >= 18 && hi <= 21);
      const isWeekend = di >= 5;
      const base = isPeak ? 60 : isWeekend ? 40 : 20;
      return Math.min(100, Math.max(2, base + Math.round((Math.random() - 0.5) * 30)));
    })
  );
};

const HEAT_DATA = generateHeatData();

function getHeatColor(val) {
  if (val < 20) return "bg-[#1A1827]";
  if (val < 40) return "bg-[#3d2a6e]";
  if (val < 60) return "bg-[#5b3fa3]";
  if (val < 80) return "bg-[#7c5bc4]";
  return "bg-[#8C63F5]";
}

export default function SalesHeatmapPage() {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Analytics Center</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Heatmap</h1>
          <p className="text-sm text-slate-400 mt-1">Visualize sales activity by location and time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-[#1A1827] p-1 rounded-lg border border-[#2d2c45]">
            {["By Location","By Time","By Day"].map((tab, i) => (
              <button key={tab} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${i === 0 ? "bg-[#8C63F5] text-white" : "text-slate-400 hover:text-white"}`}>{tab}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] text-slate-300 rounded-lg text-sm">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            May 2024
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* India Map Heatmap */}
        <div className="lg:col-span-2 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <h2 className="text-sm font-bold text-white mb-6">Sales by Location</h2>
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 400 420" className="w-full max-w-[400px] animate-fade-in">
              {/* Background grid */}
              <rect width="400" height="420" fill="#0F0E17" rx="12" />
              {/* India outline simplified */}
              <path d="M200,30 Q250,25 280,55 Q310,85 305,120 Q330,145 325,175 Q340,200 325,225 Q310,260 295,285 Q275,310 250,340 Q235,360 220,375 Q210,385 200,390 Q190,385 180,375 Q165,360 150,340 Q125,310 105,285 Q90,260 75,225 Q60,200 75,175 Q70,145 95,120 Q90,85 120,55 Q150,25 200,30 Z"
                fill="#1A1827" stroke="#3d3960" strokeWidth="2" />
              {/* State heatmap overlays */}
              {[
                { x: 190, y: 240, r: 45, intensity: 0.9, label: "Maharashtra", value: "₹40L" },
                { x: 210, y: 290, r: 35, intensity: 0.75, label: "Karnataka", value: "₹32L" },
                { x: 185, y: 140, r: 38, intensity: 0.65, label: "Delhi", value: "₹28L" },
                { x: 130, y: 210, r: 30, intensity: 0.5, label: "Gujarat", value: "₹22L" },
                { x: 215, y: 195, r: 28, intensity: 0.45, label: "Telangana", value: "₹19L" },
                { x: 240, y: 165, r: 22, intensity: 0.35, label: "Bihar", value: "₹12L" },
                { x: 155, y: 175, r: 24, intensity: 0.3, label: "Rajasthan", value: "₹10L" },
              ].map((s, i) => (
                <g key={i} className="cursor-pointer" style={{ animation: `fadeIn 0.5s ease ${i * 150}ms both` }}>
                  <circle cx={s.x} cy={s.y} r={s.r} fill="#8C63F5" opacity={s.intensity * 0.55} />
                  <circle cx={s.x} cy={s.y} r={s.r * 0.5} fill="#8C63F5" opacity={s.intensity * 0.8} />
                  <circle cx={s.x} cy={s.y} r="4" fill="white" opacity="0.9" />
                  <text x={s.x} y={s.y + s.r + 12} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">{s.label}</text>
                  <text x={s.x} y={s.y + s.r + 22} textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="bold">{s.value}</text>
                </g>
              ))}
              {/* Legend */}
              <defs>
                <linearGradient id="mapLegend" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1A1827" />
                  <stop offset="100%" stopColor="#8C63F5" />
                </linearGradient>
              </defs>
              <rect x="100" y="398" width="200" height="8" rx="4" fill="url(#mapLegend)" opacity="0.8" />
              <text x="100" y="414" fill="#64748b" fontSize="8">Low</text>
              <text x="290" y="414" textAnchor="end" fill="#64748b" fontSize="8">High</text>
            </svg>
          </div>
        </div>

        {/* Top States Table */}
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <h2 className="text-sm font-bold text-white mb-6">Top States by Sales</h2>
          <div className="space-y-3">
            {TOP_STATES.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0F0E17] border border-[#2d2c45] rounded-xl hover:border-[#8C63F5]/50 transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? "bg-[#8C63F5] text-white" : "bg-[#2d2c45] text-slate-400"}`}>{i + 1}</span>
                  <span className="text-sm font-medium text-slate-300">{s.state}</span>
                </div>
                <span className="text-sm font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time of Day Heatmap Grid */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: "320ms" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-white">Sales by Time of Day</h2>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-12 h-2 rounded bg-[#1A1827] border border-[#2d2c45]"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-2 rounded bg-[#8C63F5] opacity-70"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-2 rounded bg-[#8C63F5]"></div>
              <span>High</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex gap-1 mb-1 ml-10">
              {HOURS.map((h, i) => (
                <div key={i} className="flex-1 text-center text-[8px] text-slate-600">{i % 3 === 0 ? h : ""}</div>
              ))}
            </div>
            {/* Grid */}
            {DAYS.map((day, di) => (
              <div key={di} className="flex items-center gap-1 mb-1">
                <span className="text-[10px] text-slate-500 w-9 shrink-0 text-right pr-1">{day}</span>
                {HOURS.map((_, hi) => {
                  const val = mounted ? HEAT_DATA[di][hi] : 0;
                  return (
                    <div
                      key={hi}
                      className={`flex-1 h-5 rounded-sm cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-[#8C63F5] ${getHeatColor(val)}`}
                      title={`${day} ${HOURS[hi]}: ${val} orders`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
