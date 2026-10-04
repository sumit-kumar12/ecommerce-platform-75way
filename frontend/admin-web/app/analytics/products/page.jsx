"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest, adminRequest } from "../../../lib/api";

const PERIODS = ["7D", "30D", "90D"];

export default function ConversionAnalytics() {
  const [period, setPeriod] = useState("30D");
  const [data, setData] = useState(null);
  const [funnel, setFunnel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [payload, funnelPayload] = await Promise.all([
          apiRequest(`/admin/merchant/analytics/products?period=${period.toLowerCase()}`),
          adminRequest(`/analytics/funnel`)
        ]);
        if (active) {
          setData(payload);
          if (funnelPayload?.funnel) {
            setFunnel(funnelPayload.funnel);
          }
        }
      } catch (err) {
        console.error("Failed to fetch conversion analytics:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => { active = false; };
  }, [period]);

  const maxVal = funnel[0]?.value || 1;
  const funnelData = funnel.map(f => ({
    stage: f.label || f.name || "Unknown",
    count: f.value,
    pct: ((f.value / maxVal) * 100).toFixed(1)
  }));

  const dropOffs = [
    { stage: "Add to Cart → Checkout", pct: 55.8 },
    { stage: "Checkout → Payment", pct: 34.2 },
    { stage: "Payment → Success", pct: 10.0 }
  ];

  const kpis = {
    conversionRate: funnelData.length > 0 ? funnelData[funnelData.length - 1].pct : 3.42, conversionGrowth: 0.8,
    addToCartRate: funnelData.length > 0 ? funnelData[2]?.pct || 12.8 : 12.8, addToCartGrowth: 1.2,
    checkoutRate: funnelData.length > 0 ? funnelData[3]?.pct || 5.6 : 5.6, checkoutGrowth: -0.5,
    purchaseRate: funnelData.length > 0 ? funnelData[4]?.pct || 3.1 : 3.1, purchaseGrowth: 0.1
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/analytics" className="hover:text-slate-300 transition-colors">Analytics</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Conversion Analytics</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Conversion Analytics</h2>
          <p className="text-slate-400 mt-1 text-sm">Understand conversion & customer behavior</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl p-1 h-10">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 h-full rounded-lg text-xs font-bold transition-all ${period === p ? "bg-[#8C63F5] text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title="Conversion Rate" value={`${kpis.conversionRate}%`} trend={kpis.conversionGrowth} />
            <KpiCard title="Add to Cart Rate" value={`${kpis.addToCartRate}%`} trend={kpis.addToCartGrowth} />
            <KpiCard title="Checkout Rate" value={`${kpis.checkoutRate}%`} trend={kpis.checkoutGrowth} />
            <KpiCard title="Purchase Rate" value={`${kpis.purchaseRate}%`} trend={kpis.purchaseGrowth} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Funnel Overview */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-12">Funnel Overview</h3>
              <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                {funnelData.map((stage, idx) => (
                  <div key={idx} className="w-full flex items-center justify-between gap-4">
                    <div className="flex-1 flex justify-center">
                      <div 
                        className="h-14 bg-[#8C63F5] flex items-center justify-center text-white font-medium shadow-lg transition-all"
                        style={{ 
                          width: `${Math.max(30, stage.pct)}%`, 
                          clipPath: idx < funnelData.length - 1 ? 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
                          opacity: 1 - (idx * 0.15)
                        }}
                      >
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <p className="text-sm font-medium text-white">{stage.stage}</p>
                      <p className="text-xs text-zinc-400">{stage.count.toLocaleString()} <span className="text-[#8C63F5]">({stage.pct}%)</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Drop-off Points */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 flex flex-col">
              <h3 className="text-white font-medium mb-6">Top Drop-off Points</h3>
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {dropOffs.map((drop, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      </div>
                      <span className="text-sm font-medium text-slate-300">{drop.stage}</span>
                    </div>
                    <span className="text-white font-bold">{drop.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
                <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
                  View all drop-offs
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ title, value, trend }) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
      <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
      <div className="mt-4 flex items-end justify-between">
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          <span className="material-symbols-outlined text-[14px]">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
          {Math.abs(trend)}%
        </div>
      </div>
    </div>
  );
}
