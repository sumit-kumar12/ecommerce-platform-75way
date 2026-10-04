"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";
import { StatCard } from "../../../../components/dashboard/StatCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const PERIODS = ["7d", "30d", "90d"];
const COLORS = ['#8C63F5', '#10B861', '#F59E0B', '#00DAFF', '#EF4444'];

const TRAFFIC_SOURCES = [
  { source: "Direct", visits: 12480, pct: 49 },
  { source: "Category Page", visits: 8421, pct: 33 },
  { source: "Search", visits: 2856, pct: 11 },
  { source: "Recommendations", visits: 1800, pct: 7 },
];

export default function ProductAnalyticsPage() {
  const { id } = useParams();
  const [period, setPeriod] = useState("30d");
  const [product, setProduct] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, analyticsRes] = await Promise.allSettled([
          apiRequest(`/products/${id}`),
          apiRequest(`/admin/products/${id}/analytics?period=${period}`),
        ]);
        if (prodRes.status === "fulfilled") setProduct(prodRes.value?.product || prodRes.value);
        if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value);
      } catch (err) {
        console.error("Analytics load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, period]);

  const viewsData = useMemo(() => {
    return analytics?.viewsTimeSeries || [];
  }, [analytics]);

  const variantSegments = useMemo(() => {
    if (analytics?.salesByVariant?.length) {
      return analytics.salesByVariant.map((v) => ({
        name: v.title || v.name,
        value: v.count || v.sales || 0,
      }));
    }
    return [];
  }, [analytics]);

  const kpis = analytics || {
    views: 0, viewsChange: 0,
    orders: 0, ordersChange: 0,
    revenue: 0, revenueChange: 0,
    conversionRate: 0, conversionChange: 0
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/products" className="hover:text-slate-300 transition-colors">Products</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href={`/products/${id}`} className="hover:text-slate-300 transition-colors">{product?.name || "Product"}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Analytics</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Product Analytics</h2>
          <p className="text-slate-400 mt-1 text-sm">Detailed performance insights · {product?.name}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl p-1 h-10">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 h-full rounded-lg text-xs font-bold transition-all ${period === p ? "bg-[#8C63F5] text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-2">
        <StatCard 
          title="Total Views" 
          value={kpis.views?.toLocaleString()} 
          icon="visibility" 
          trend={kpis.viewsChange} 
          trendLabel="vs last period"
          color="#8B5CF6" 
        />
        <StatCard 
          title="Total Orders" 
          value={kpis.orders?.toLocaleString()} 
          icon="receipt_long" 
          trend={kpis.ordersChange} 
          trendLabel="vs last period"
          color="#10B861" 
        />
        <StatCard 
          title="Revenue" 
          value={`₹${kpis.revenue?.toLocaleString()}`} 
          icon="payments" 
          trend={kpis.revenueChange} 
          trendLabel="vs last period"
          color="#F59E0B" 
        />
        <StatCard 
          title="Conversion" 
          value={`${kpis.conversionRate}%`} 
          icon="trending_up" 
          trend={kpis.conversionChange} 
          trendLabel="vs last period"
          color="#00DAFF" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-2">
        
        {/* Views Chart */}
        <div className="xl:col-span-2 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Views Over Time</h2>
              <p className="text-slate-400 text-sm mt-1">Daily product view count</p>
            </div>
            {loading && <div className="w-5 h-5 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin" />}
          </div>
          
          <div className="flex-1 w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={viewsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8C63F5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2c45" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0F0E17', borderColor: '#2d2c45', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#8C63F5', strokeWidth: 1, strokeDasharray: '5 5' }}
                  formatter={(value) => [value.toLocaleString(), 'Views']}
                />
                <Area type="monotone" dataKey="views" stroke="#8C63F5" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Variant Donut */}
        <div className="xl:col-span-1 bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Sales by Variant</h2>
            <p className="text-slate-400 text-sm mt-1">Variant distribution</p>
          </div>
          
          <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={variantSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {variantSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0F0E17', borderColor: '#2d2c45', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, "Sales Share"]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', color: '#94A3B8', paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Sources Table */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Top Traffic Sources</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d2c45]">
                <th className="text-left text-xs font-bold text-slate-500 pb-4">Source</th>
                <th className="text-right text-xs font-bold text-slate-500 pb-4">Visits</th>
                <th className="text-right text-xs font-bold text-slate-500 pb-4 hidden sm:table-cell">Share</th>
                <th className="text-right text-xs font-bold text-slate-500 pb-4 hidden md:table-cell">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {TRAFFIC_SOURCES.map((row) => (
                <tr key={row.source}>
                  <td className="py-4 text-white font-medium">{row.source}</td>
                  <td className="py-4 text-slate-300 text-right">{row.visits.toLocaleString()}</td>
                  <td className="py-4 text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-2 rounded-full bg-[#0F0E17] overflow-hidden">
                        <div className="h-full bg-[#8C63F5] rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-slate-400 text-xs font-mono w-8 text-right">{row.pct}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1 text-[#10B861] text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      +{Math.floor(Math.random() * 10 + 1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
