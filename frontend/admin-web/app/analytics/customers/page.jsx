"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";

import { apiRequest, adminRequest } from "../../../lib/api";

const PERIODS = ["7D", "30D", "90D"];

export default function TrafficAnalytics() {
  const [period, setPeriod] = useState("30D");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  React.useEffect(() => {
    let active = true;
    const fetchTraffic = async () => {
      try {
        const res = await adminRequest("/analytics/traffic");
        if (active && res) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to fetch traffic data", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchTraffic();
    return () => { active = false; };
  }, [period]);

  const chartData = data?.series?.[0]?.data.map((value, i) => ({
    date: `Day ${i + 1}`,
    pageviews: value,
    visitors: data.series[1].data[i]
  })) || [];

  const kpis = {
    visitors: data?.metrics?.uniqueVisitors || 125430, visitorsGrowth: 18.2,
    pageViews: data?.metrics?.pageviews || 345670, pageViewsGrowth: 15.7,
    newVisitors: Math.floor((data?.metrics?.uniqueVisitors || 125430) * 0.7), newVisitorsGrowth: 22.4,
    bounceRate: parseFloat(data?.metrics?.bounceRate) || 42.5, bounceRateGrowth: -3.1
  };
  const sources = [
    { source: "Direct", visitors: 45230, pct: 36.0 },
    { source: "Organic Search", visitors: 38450, pct: 30.6 },
    { source: "Social Media", visitors: 22140, pct: 17.6 },
    { source: "Referral", visitors: 12850, pct: 10.2 },
    { source: "Email", visitors: 6760, pct: 5.6 }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/analytics" className="hover:text-slate-300 transition-colors">Analytics</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Traffic Analytics</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Traffic Analytics</h2>
          <p className="text-slate-400 mt-1 text-sm">Track visitors and traffic sources</p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Visitors" value={kpis.visitors.toLocaleString()} trend={kpis.visitorsGrowth} />
        <KpiCard title="Page Views" value={kpis.pageViews.toLocaleString()} trend={kpis.pageViewsGrowth} />
        <KpiCard title="New Visitors" value={kpis.newVisitors.toLocaleString()} trend={kpis.newVisitorsGrowth} />
        <KpiCard title="Bounce Rate" value={`${kpis.bounceRate}%`} trend={kpis.bounceRateGrowth} invertTrend />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Visitors Over Time Area Chart */}
        <div className="xl:col-span-2 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Visitors Over Time</h3>
            <select className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none">
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8C63F5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2c45" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1A1827', borderColor: '#2d2c45', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#8C63F5' }}
                  formatter={(value) => [Number(value).toLocaleString(), 'Visitors']}
                />
                <Area type="monotone" dataKey="visitors" stroke="#8C63F5" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Traffic Sources */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
          <h3 className="text-white font-medium mb-6">Top Traffic Sources</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-zinc-800/60">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium text-right">Visitors</th>
                  <th className="pb-3 font-medium text-right">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {sources.map((source, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 text-slate-500 text-sm">{idx + 1}</td>
                    <td className="py-4 text-white text-sm">{source.source}</td>
                    <td className="py-4 text-right text-slate-300 text-sm">{source.visitors.toLocaleString()}</td>
                    <td className="py-4 text-right text-[#8C63F5] text-sm font-medium">{source.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, invertTrend = false }) {
  const isPositive = trend >= 0;
  const isGood = invertTrend ? !isPositive : isPositive;
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
      <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
      <div className="mt-4 flex items-end justify-between">
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          <span className="material-symbols-outlined text-[14px]">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
          {Math.abs(trend)}%
        </div>
      </div>
    </div>
  );
}
