"use client";
import React, { useState, useEffect } from "react";

const KPI_CARDS = [
  { label: "Abandoned Carts", value: "8,450", change: "-3.2%", down: true, icon: "remove_shopping_cart" },
  { label: "Recovery Rate", value: "18.6%", change: "+2.4%", icon: "autorenew" },
  { label: "Revenue Lost", value: "₹1,570", change: "-5.1%", down: true, icon: "trending_down" },
  { label: "Recovered Revenue", value: "₹99,46,900", change: "+14.2%", icon: "currency_rupee" },
];

const RECOVERY_CHANNEL = [
  { label: "Email", pct: 35, color: "#8C63F5" },
  { label: "SMS", pct: 25, color: "#06b6d4" },
  { label: "Push", pct: 20, color: "#eab308" },
  { label: "Others", pct: 20, color: "#64748b" },
];

const TOP_CAMPAIGNS = [
  { name: "Cart Reminder Email", recovered: 430, rate: "24.5%" },
  { name: "Whatsapp Offer", recovered: 295, rate: "18.3%" },
  { name: "Free Shipping Promo", recovered: 180, rate: "12.1%" },
];

function DonutChart({ data }) {
  const r = 15.9155;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  const segs = data.map(d => {
    const dash = (d.pct / 100) * circ;
    const seg = { ...d, dash, offset: -(acc / 100) * circ };
    acc += d.pct;
    return seg;
  });
  return (
    <svg viewBox="0 0 36 36" width={110} height={110} className="rotate-[-90deg] shrink-0">
      {segs.map((s, i) => (
        <circle key={i} r={r} cx="18" cy="18" fill="none" stroke={s.color} strokeWidth="5"
          strokeDasharray={`${s.dash} ${circ - s.dash}`} strokeDashoffset={s.offset} />
      ))}
    </svg>
  );
}

export default function AbandonedCartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Analytics Center</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Abandoned Cart Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Track abandoned carts and recovery performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] text-slate-300 rounded-lg text-sm">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          May 01 – May 31, 2024
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <div key={i} className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-5 shadow-lg animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <span className="material-symbols-outlined text-[18px] text-slate-600">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
            <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.down ? "text-red-400" : "text-green-400"}`}>
              <span className="material-symbols-outlined text-[14px]">{kpi.down ? "arrow_drop_down" : "arrow_drop_up"}</span>{kpi.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Abandoned vs Recovered Area Chart */}
        <div className="lg:col-span-2 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: "320ms" }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white">Abandoned vs Recovered</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#8C63F5] rounded-full"></div><span className="text-slate-400">Recovered</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-red-400 rounded-full"></div><span className="text-slate-400">Abandoned</span></div>
            </div>
          </div>
          <div className="h-52 relative">
            <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] text-slate-500 pr-2 text-right">
              <span>10K</span><span>7.5K</span><span>5K</span><span>2.5K</span><span>0</span>
            </div>
            <div className="absolute left-10 right-0 top-0 bottom-4 flex flex-col justify-between pointer-events-none">
              {[0,1,2,3,4].map(i => <div key={i} className="border-b border-dashed border-[#2d2c45] w-full opacity-50" />)}
            </div>
            <div className="absolute left-10 right-0 top-0 bottom-4">
              {mounted && (
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="abanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="recovGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8C63F5" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8C63F5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Abandoned */}
                  <path d="M0,10 L12,14 L24,8 L36,16 L48,10 L60,18 L72,12 L84,20 L100,14 L100,40 L0,40 Z" fill="url(#abanGrad)" />
                  <path d="M0,10 L12,14 L24,8 L36,16 L48,10 L60,18 L72,12 L84,20 L100,14" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="2 1" className="animate-draw" />
                  {/* Recovered */}
                  <path d="M0,28 L12,25 L24,30 L36,22 L48,26 L60,20 L72,24 L84,18 L100,22 L100,40 L0,40 Z" fill="url(#recovGrad)" />
                  <path d="M0,28 L12,25 L24,30 L36,22 L48,26 L60,20 L72,24 L84,18 L100,22" fill="none" stroke="#8C63F5" strokeWidth="1.5" className="animate-draw" />
                </svg>
              )}
            </div>
            <div className="absolute bottom-[-22px] left-10 right-0 flex justify-between text-[10px] text-slate-500">
              <span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 31</span>
            </div>
          </div>
        </div>

        {/* Recovery by Channel + Top Campaigns */}
        <div className="flex flex-col gap-6">
          {/* Recovery by Channel Donut */}
          <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-5 shadow-xl animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <h2 className="text-sm font-bold text-white mb-4">Recovery by Channel</h2>
            <div className="flex items-center gap-4">
              {mounted && <DonutChart data={RECOVERY_CHANNEL} />}
              <div className="space-y-2 flex-1">
                {RECOVERY_CHANNEL.map(d => (
                  <div key={d.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: d.color }} /><span className="text-slate-300">{d.label}</span></div>
                    <span className="font-bold text-white">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Recovery Campaigns */}
          <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-5 shadow-xl animate-fade-in-up flex-1" style={{ animationDelay: "480ms" }}>
            <h2 className="text-sm font-bold text-white mb-4">Top Recovery Campaigns</h2>
            <div className="space-y-3">
              {TOP_CAMPAIGNS.map((c, i) => (
                <div key={i} className="p-3 bg-[#0F0E17] border border-[#2d2c45] rounded-xl hover:border-[#8C63F5]/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <p className="text-xs font-medium text-slate-300 mb-2">{c.name}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Recovered: <span className="text-white font-bold">{c.recovered}</span></span>
                    <span className="text-[#8C63F5] font-bold">{c.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
