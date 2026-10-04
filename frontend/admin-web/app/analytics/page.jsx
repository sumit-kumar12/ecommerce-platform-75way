"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Chart Components
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data = [], color = "#3b82f6" }) {
  if (!data.length) return <div className="h-6 w-16 shrink-0" />;
  const max = Math.max(...data, 1), w = 64, h = 24;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible opacity-80 mt-1 shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LineChart({ data = [], color = "#10b981", yLabel = "" }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 400, h = 100;
  
  return (
    <div className="w-full h-full relative mt-4">
      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-zinc-800/60 pb-5 pl-8 text-[9px] text-zinc-500">
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">{yLabel}</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5"></div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">0</div>
        
        <div className="absolute bottom-0 left-8 right-0 flex justify-between transform translate-y-full pt-1.5">
          <span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span><span>May 25</span><span>May 26</span><span>May 27</span>
        </div>
      </div>
      <div className="absolute inset-0 ml-8 mb-5">
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
          {(() => {
            const pts = data.map((v, j) => `${(j / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`);
            return (
              <g>
                <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" />
                {pts.map((pt, j) => (
                  <circle key={j} cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="3" fill={color} />
                ))}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

function BarChart({ data = [], color = "#3b82f6" }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 400, h = 100;
  
  return (
    <div className="w-full h-full relative mt-4">
      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-zinc-800/60 pb-5 pl-8 text-[9px] text-zinc-500">
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">30K</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">15K</div>
        <div className="flex items-center -ml-8 w-8 justify-end pr-2 -mt-1.5">0</div>
        
        <div className="absolute bottom-0 left-8 right-0 flex justify-between transform translate-y-full pt-1.5">
          <span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span><span>May 25</span><span>May 26</span><span>May 27</span>
        </div>
      </div>
      <div className="absolute inset-0 ml-8 mb-5 flex items-end justify-between px-2">
        {data.map((v, i) => (
          <div key={i} className="w-1/12 rounded-t" style={{ backgroundColor: color, height: `${(v / max) * 100}%` }}></div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ items, totalLabel, totalValue, size = 48, r = 18, strokeWidth = 6, thick = false }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;
  const center = size / 2;
  const circum = 2 * Math.PI * r;

  return (
    <div className="relative w-full aspect-square max-w-[140px] flex-shrink-0 mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90 overflow-visible">
        <circle r={r} cx={center} cy={center} fill="transparent" stroke="#1f2937" strokeWidth={strokeWidth} />
        {items.map((item, i) => {
          const pct = item.value / total;
          const dasharray = `${pct * circum} ${circum}`;
          const dashoffset = -(cumulativePercent * circum);
          cumulativePercent += pct;
          return (
            <circle
              key={i}
              r={r}
              cx={center}
              cy={center}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              strokeLinecap={thick ? "round" : "butt"}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[14px] font-bold text-white leading-tight">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center uppercase tracking-wider mt-0.5">{totalLabel}</div>
      </div>
    </div>
  );
}

function FunnelChart({ data = [] }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1 w-full mt-2">
      {data.map((d, i) => {
        const width = 100 - (i * 20); // 100%, 80%, 60%, 40%
        return (
          <div key={i} className="flex items-center w-full justify-between gap-4">
            <div className="text-[10px] text-zinc-400 w-16 text-right shrink-0">{d.label}</div>
            <div className="flex-1 flex justify-center">
              <div 
                className="h-8 flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                style={{ width: `${width}%`, backgroundColor: d.color, clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
              >
                {d.value}
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 w-12 shrink-0">{d.pct}</div>
          </div>
        );
      })}
    </div>
  );
}

function GeoMap({ data = [] }) {
  const isOnlyIndia = data.every(city => {
    if (!city.lat || !city.lng) return true;
    return city.lat > 8 && city.lat < 37 && city.lng > 68 && city.lng < 97;
  });

  // Very rough equirectangular projection to map coordinates to a 1000x500 svg
  const getX = (lng) => ((lng + 180) / 360) * 1000;
  const getY = (lat) => 280 - (lat * 2.8); // Shifted Y for better visual alignment with world-map.svg

  // If only India, set viewBox to zoom in tightly on India's coordinates
  // India's X is roughly ~700-740, Y is roughly ~180-250
  const viewBox = isOnlyIndia ? "695 180 60 60" : "0 0 1000 500";
  const markerR = isOnlyIndia ? 1 : 8;

  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto opacity-90 flex items-center justify-center rounded-full overflow-hidden border border-zinc-800/50 bg-[#0a0f1a]">
      <svg viewBox={viewBox} className="w-full h-full">
        <image 
          href="/world-map.svg" 
          width="1000" 
          height="500" 
          className="opacity-40"
          style={{ filter: "invert(1) brightness(1.5)" }}
        />
        {data.map((city, i) => {
          if (!city.lat || !city.lng) return null;
          return (
            <circle 
              key={i} 
              cx={getX(city.lng)} 
              cy={getY(city.lat)} 
              r={markerR} 
              fill={city.c || "#10b981"} 
              className="animate-pulse"
              style={{ filter: `drop-shadow(0 0 ${markerR * 2}px ${city.c || "#10b981"})` }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

export default function BusinessIntelligenceDashboard() {
  const topKPIs = [
    { icon: "account_balance_wallet", label: "Total Revenue", value: "₹12,78,45,230", sub: "+18.6% vs last 7 days", scolor: "#10b981", isRed: false, spark: [10, 11, 11.5, 12, 12.2, 12.5, 12.78] },
    { icon: "receipt_long", label: "Total Orders", value: "128,456", sub: "+12.4% vs last 7 days", scolor: "#10b981", isRed: false, spark: [100, 105, 110, 115, 120, 125, 128] },
    { icon: "storefront", label: "Total Merchants", value: "8,672", sub: "+7.8% vs last 7 days", scolor: "#10b981", isRed: false, spark: [8.0, 8.1, 8.2, 8.4, 8.5, 8.6, 8.67] },
    { icon: "group", label: "Total Customers", value: "2,45,876", sub: "+15.3% vs last 7 days", scolor: "#10b981", isRed: false, spark: [2.0, 2.1, 2.2, 2.3, 2.35, 2.4, 2.45] },
    { icon: "shopping_cart", label: "Average Order Value", value: "₹1,245", sub: "+5.2% vs last 7 days", scolor: "#10b981", isRed: false, spark: [1100, 1120, 1150, 1180, 1200, 1220, 1245] },
    { icon: "payments", label: "Gross Merchandise Value", value: "₹18,92,34,560", sub: "+15.9% vs last 7 days", scolor: "#10b981", isRed: false, spark: [15, 16, 16.5, 17, 18, 18.5, 18.9] },
    { icon: "assignment_return", label: "Refunds", value: "₹45,210", sub: "-6.2% vs last 7 days", scolor: "#ef4444", isRed: true, spark: [50, 49, 48, 47, 46, 45.5, 45.2] },
  ];

  const topCategories = [
    { label: "Grocery", value: 4.12, pct: "32.2%", color: "#10b981" },
    { label: "Food & Beverages", value: 2.98, pct: "23.3%", color: "#f59e0b" },
    { label: "Home Essentials", value: 2.25, pct: "17.6%", color: "#f97316" },
    { label: "Hardware", value: 1.68, pct: "13.1%", color: "#ef4444" },
    { label: "Daily Essentials", value: 1.05, pct: "8.2%", color: "#3b82f6" },
    { label: "Others", value: 0.70, pct: "5.6%", color: "#8b5cf6" },
  ];

  const topMerchants = [
    { name: "FreshMart Store", orders: "12,456", revenue: "₹1,24,56,780", growth: "+ 16.2%", sc: "text-emerald-500", c: "bg-emerald-500" },
    { name: "QuickBites Foods", orders: "9,875", revenue: "₹98,45,210", growth: "+ 14.8%", sc: "text-emerald-500", c: "bg-amber-500" },
    { name: "HomeNeeds Hub", orders: "8,765", revenue: "₹85,62,430", growth: "+ 12.3%", sc: "text-emerald-500", c: "bg-orange-500" },
    { name: "BuildRight Hardware", orders: "7,654", revenue: "₹72,15,660", growth: "+ 10.1%", sc: "text-emerald-500", c: "bg-red-500" },
    { name: "DailyDose Essentials", orders: "6,543", revenue: "₹61,25,430", growth: "+ 9.3%", sc: "text-emerald-500", c: "bg-blue-500" },
  ];

  const cities = [
    { name: "New Delhi", rev: "₹2.45 Cr", c: "#10b981", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", rev: "₹2.12 Cr", c: "#10b981", lat: 19.0760, lng: 72.8777 },
    { name: "Bengaluru", rev: "₹1.96 Cr", c: "#10b981", lat: 12.9716, lng: 77.5946 },
    { name: "Hyderabad", rev: "₹1.45 Cr", c: "#10b981", lat: 17.3850, lng: 78.4867 },
    { name: "Pune", rev: "₹0.98 Cr", c: "#10b981", lat: 18.5204, lng: 73.8567 },
    { name: "Chennai", rev: "₹0.85 Cr", c: "#10b981", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", rev: "₹0.72 Cr", c: "#10b981", lat: 22.5726, lng: 88.3639 },
    { name: "Others", rev: "₹2.03 Cr", c: "#10b981" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans overflow-x-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Business Intelligence Dashboard <span className="material-symbols-outlined text-[20px] text-purple-400">insights</span>
          </h1>
          <p className="text-[11px] text-zinc-400 mt-1">Real-time business analytics, performance insights and growth metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
            May 21 - May 27, 2026
            <span className="material-symbols-outlined text-[14px] ml-1">expand_more</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
            Compare: May 14 - May 20, 2026
            <span className="material-symbols-outlined text-[14px] ml-1">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col xl:flex-row h-full">
          
          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 p-6 space-y-4 lg:min-w-0">
            
            {/* Row 1: Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
              {topKPIs.map((kpi, i) => (
                <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded p-3 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 mb-1">
                    <span className="material-symbols-outlined text-[14px] shrink-0" style={{ color: kpi.scolor }}>{kpi.icon}</span>
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">{kpi.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white whitespace-nowrap truncate">{kpi.value}</div>
                  <div className="flex items-end justify-between mt-1 gap-2">
                    <div className={`text-[9px] truncate ${kpi.isRed ? 'text-red-500' : 'text-emerald-400'}`}>{kpi.sub}</div>
                    <Spark data={kpi.spark} color={kpi.scolor} />
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Overview Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Revenue Overview */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[260px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Revenue Overview</h3>
                  <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-300">
                    <option>Daily</option>
                  </select>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <LineChart data={[1, 1.2, 1.4, 1.3, 1.7, 1.8, 2.1]} color="#10b981" yLabel="₹2.5M" />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/60">
                  <div>
                    <div className="text-[9px] text-zinc-500">Current Period</div>
                    <div className="text-[11px] text-white font-medium mt-0.5">₹12,78,45,230</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Previous Period</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">₹10,78,12,480</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Growth</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5">18.6%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Trend</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5">Positive</div>
                  </div>
                </div>
              </div>

              {/* Orders Overview */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[260px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Orders Overview</h3>
                  <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-300">
                    <option>Daily</option>
                  </select>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <BarChart data={[10, 12, 14, 13, 16, 17, 20]} color="#3b82f6" />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/60">
                  <div>
                    <div className="text-[9px] text-zinc-500">Current Period</div>
                    <div className="text-[11px] text-white font-medium mt-0.5">128,456</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Previous Period</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">114,215</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Growth</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5">12.4%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Trend</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5">Positive</div>
                  </div>
                </div>
              </div>

              {/* GMV Overview */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[260px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">GMV Overview</h3>
                  <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-300">
                    <option>Daily</option>
                  </select>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <LineChart data={[1, 1.3, 1.5, 1.4, 1.8, 1.9, 2.2]} color="#8b5cf6" yLabel="₹4M" />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/60">
                  <div>
                    <div className="text-[9px] text-zinc-500">Current Period</div>
                    <div className="text-[11px] text-white font-medium mt-0.5">₹18,92,34,560</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Previous Period</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">₹16,19,45,120</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Growth</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5">16.9%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500">Trend</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5">Positive</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Categories & Geo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Categories */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Top Categories by Revenue</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <DonutChart items={topCategories} totalLabel="" totalValue="" size={48} r={18} strokeWidth={6} />
                  <div className="flex-1 space-y-1.5 w-full">
                    {topCategories.map((c, i) => (
                      <div key={i} className="flex flex-col text-[9px]">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-1.5 h-1.5 rounded-[2px]" style={{backgroundColor: c.color}}></span>
                          <span className="text-zinc-300">{c.label}</span>
                        </div>
                        <div className="pl-3 flex gap-1 justify-between w-full">
                          <span className="text-white">₹{c.value.toFixed(2)} Cr</span>
                          <span className="text-zinc-500">{c.pct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue by City */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Revenue by City</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex gap-4 flex-1">
                  <div className="w-1/2 flex items-center justify-center">
                    <GeoMap data={cities} />
                  </div>
                  <div className="w-1/2 space-y-1.5 overflow-y-auto pr-2">
                    {cities.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-zinc-300">{c.name}</span>
                        </div>
                        <span className="text-white">{c.rev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Success Rate */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Payment Success Rate</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex items-center justify-center gap-8 flex-1">
                  <DonutChart 
                    items={[
                      { value: 97.42, color: "#10b981" },
                      { value: 1.98, color: "#ef4444" },
                      { value: 0.60, color: "#f59e0b" }
                    ]} 
                    totalLabel="Success Rate" 
                    totalValue="97.42%" 
                    size={48} r={18} strokeWidth={6} 
                  />
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px] bg-emerald-500"></span><span className="text-zinc-300">Successful</span></div>
                      <div className="pl-3.5 text-white font-bold">97.42%</div>
                    </div>
                    <div className="flex flex-col gap-1 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px] bg-red-500"></span><span className="text-zinc-300">Failed</span></div>
                      <div className="pl-3.5 text-white font-bold">1.98%</div>
                    </div>
                    <div className="flex flex-col gap-1 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px] bg-amber-500"></span><span className="text-zinc-300">Pending</span></div>
                      <div className="pl-3.5 text-white font-bold">0.60%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Merchants & Growth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Merchants Table */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Top Merchants by Revenue</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View All</Link>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-[11px] whitespace-nowrap">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800/60">
                        <th className="pb-2 font-medium">Merchant</th>
                        <th className="pb-2 font-medium">Orders</th>
                        <th className="pb-2 font-medium">Revenue</th>
                        <th className="pb-2 font-medium text-right">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      {topMerchants.map((m, i) => (
                        <tr key={i} className="border-b border-zinc-800/30">
                          <td className="py-2.5 truncate max-w-[120px]">{m.name}</td>
                          <td className="py-2.5 text-zinc-400">{m.orders}</td>
                          <td className="py-2.5 text-white">{m.revenue}</td>
                          <td className={`py-2.5 text-right ${m.sc}`}>{m.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New vs Returning */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">New vs Returning Customers</h3>
                  <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
                </div>
                <div className="flex items-center justify-center gap-6 flex-1">
                  <DonutChart 
                    items={[{ value: 68.2, color: "#10b981" }, { value: 31.8, color: "#8b5cf6" }]} 
                    totalLabel="Total Customers" 
                    totalValue="2,45,876" 
                    size={48} r={18} strokeWidth={6} 
                  />
                  <div className="space-y-4">
                    <div className="flex flex-col text-[10px]">
                      <div className="flex items-center gap-1.5 mb-1"><span className="w-2 h-2 rounded-[2px] bg-emerald-500"></span><span className="text-zinc-300">New Customers</span></div>
                      <div className="pl-3.5 flex items-center gap-2">
                        <span className="text-white font-bold">68.2%</span>
                        <span className="text-zinc-500">(1,67,543)</span>
                      </div>
                    </div>
                    <div className="flex flex-col text-[10px]">
                      <div className="flex items-center gap-1.5 mb-1"><span className="w-2 h-2 rounded-[2px] bg-purple-500"></span><span className="text-zinc-300">Returning Customers</span></div>
                      <div className="pl-3.5 flex items-center gap-2">
                        <span className="text-white font-bold">31.8%</span>
                        <span className="text-zinc-500">(78,333)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Growth */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Customer Growth</h3>
                  <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-300">
                    <option>Daily</option>
                  </select>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <LineChart data={[1, 1.1, 1.25, 1.35, 1.5, 1.7, 1.9]} color="#10b981" yLabel="60K" />
                </div>
              </div>
            </div>

            {/* Row 5: Funnels & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sales Funnel */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-bold text-white">Sales Funnel</h3>
                </div>
                <FunnelChart data={[
                  { label: "Visitors", value: "5,28,456", pct: "100%", color: "#3b82f6" },
                  { label: "Add to Cart", value: "1,25,340", pct: "23.72%", color: "#f59e0b" },
                  { label: "Checkout", value: "68,234", pct: "12.92%", color: "#8b5cf6" },
                  { label: "Orders", value: "128,456", pct: "5.34%", color: "#10b981" },
                ]} />
              </div>

              {/* Refund Overview */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Refund Overview</h3>
                </div>
                <div className="flex items-center gap-6 flex-1">
                  <DonutChart 
                    items={[{ value: 62.9, color: "#10b981" }, { value: 24.8, color: "#3b82f6" }, { value: 12.3, color: "#ef4444" }]} 
                    totalLabel="Total Refunds" 
                    totalValue="₹45,210" 
                    size={48} r={18} strokeWidth={6} 
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px] bg-emerald-500"></span><span className="text-zinc-300">Completed</span></div>
                      <div className="flex gap-2 text-white"><span>₹28,450</span><span className="text-zinc-500">62.9%</span></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px] bg-blue-500"></span><span className="text-zinc-300">Pending</span></div>
                      <div className="flex gap-2 text-white"><span>₹11,230</span><span className="text-zinc-500">24.8%</span></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px] bg-red-500"></span><span className="text-zinc-300">Failed</span></div>
                      <div className="flex gap-2 text-white"><span>₹5,530</span><span className="text-zinc-500">12.3%</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Status */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 flex flex-col min-w-0 h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-white">Orders Status</h3>
                </div>
                <div className="flex items-center gap-6 flex-1">
                  <DonutChart 
                    items={[{ value: 74.9, color: "#10b981" }, { value: 16.8, color: "#3b82f6" }, { value: 4.9, color: "#ef4444" }, { value: 0.4, color: "#f59e0b" }]} 
                    totalLabel="Total Orders" 
                    totalValue="128,456" 
                    size={48} r={18} strokeWidth={6} 
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-[2px] bg-emerald-500"></span><span className="text-zinc-300">Delivered</span></div>
                      <div className="flex gap-2 text-white"><span>96,214</span><span className="text-zinc-500 w-6 text-right">74.9%</span></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-[2px] bg-blue-500"></span><span className="text-zinc-300">Processing</span></div>
                      <div className="flex gap-2 text-white"><span>21,543</span><span className="text-zinc-500 w-6 text-right">16.8%</span></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-[2px] bg-red-500"></span><span className="text-zinc-300">Cancelled</span></div>
                      <div className="flex gap-2 text-white"><span>6,243</span><span className="text-zinc-500 w-6 text-right">4.9%</span></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-[2px] bg-amber-500"></span><span className="text-zinc-300">Returned</span></div>
                      <div className="flex gap-2 text-white"><span>474</span><span className="text-zinc-500 w-6 text-right">0.4%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Panel (Sidebar) ─────────────────────────────────────────────────── */}
          <div className="w-full xl:w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-6 shrink-0 lg:flex-none overflow-y-auto min-w-[280px]">
            
            {/* Top Merchants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Top Merchants</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-4">
                {topMerchants.map((m, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="text-[10px] text-zinc-500 font-mono w-2">{i+1}</div>
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${m.c} bg-opacity-20`}>
                      <span className={`material-symbols-outlined text-[12px] ${m.sc}`}>storefront</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-zinc-200 truncate">{m.name}</div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="text-[10px] text-white">{m.revenue}</span>
                      <span className={`text-[9px] ${m.sc} flex items-center`}><span className="material-symbols-outlined text-[10px]">arrow_upward</span>{m.growth.replace('+ ', '')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Top Categories</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-4">
                {topCategories.map((c, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{backgroundColor: `${c.color}20`}}>
                      <span className="material-symbols-outlined text-[12px]" style={{color: c.color}}>category</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-zinc-200 truncate">{c.label}</div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="text-[10px] text-white">₹{c.value.toFixed(2)} Cr</span>
                      <span className="text-[9px] text-zinc-500">{c.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-white">Recent Alerts</h3>
                <Link href="#" className="text-[10px] text-purple-400">View All</Link>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start border-b border-zinc-800/50 pb-3">
                  <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 bg-red-500/10 text-red-500">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-zinc-200 truncate">High refund rate detected</div>
                    <div className="text-[9px] text-zinc-500 truncate">Food & Beverages category</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">10m ago</div>
                </div>
                <div className="flex gap-3 items-start border-b border-zinc-800/50 pb-3">
                  <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-500">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-zinc-200 truncate">Payment success rate dropped</div>
                    <div className="text-[9px] text-zinc-500 truncate">UPI payments experiencing issues</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">18m ago</div>
                </div>
                <div className="flex gap-3 items-start border-b border-zinc-800/50 pb-3">
                  <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-500">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-zinc-200 truncate">New merchant onboarded</div>
                    <div className="text-[9px] text-zinc-500 truncate">QuickKart Store</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">35m ago</div>
                </div>
                <div className="flex gap-3 items-start border-b border-zinc-800/50 pb-3">
                  <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-500">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-zinc-200 truncate">Sales target achieved</div>
                    <div className="text-[9px] text-zinc-500 truncate">Daily target reached</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">1h ago</div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-500">
                    <span className="material-symbols-outlined text-[14px]">group_add</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-zinc-200 truncate">Peak traffic recorded</div>
                    <div className="text-[9px] text-zinc-500 truncate">Visitors increased by 32%</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">2h ago</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-[12px] font-bold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-blue-400">insert_chart</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Generate Report</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">download</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Export Data</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-purple-400">campaign</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Create Campaign</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-orange-400">notifications_active</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Bulk Notification</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-amber-500">local_offer</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Create Offer</span>
                </button>
                <button className="bg-zinc-800/40 border border-zinc-800 hover:bg-zinc-800 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-zinc-400">settings</span>
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">Analytics Settings</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
