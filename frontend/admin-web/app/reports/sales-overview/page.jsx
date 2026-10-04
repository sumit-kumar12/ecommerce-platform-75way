"use client";

import { useState, useEffect } from "react";
import { adminRequest } from "../../../lib/api";

const RANGES = ["7D", "30D", "90D", "Custom"];

// Simple sparkline-style chart points for SVG
const defaultChartPoints = [
  { x: 0, y: 80 }, { x: 40, y: 65 }, { x: 80, y: 72 }, { x: 120, y: 50 },
  { x: 160, y: 40 }, { x: 200, y: 55 }, { x: 240, y: 35 }, { x: 280, y: 20 },
  { x: 320, y: 30 }, { x: 360, y: 15 }, { x: 400, y: 25 }, { x: 440, y: 10 },
];

export default function SalesOverviewPage() {
  const [range, setRange] = useState("30D");
  const [stats, setStats] = useState({
    revenue: { value: "₹0", trend: "0%", up: true },
    orders: { value: "0", trend: "0%", up: true },
    aov: { value: "₹0", trend: "0%", up: true },
    returnRate: { value: "₹0", trend: "0%", up: true },
  });
  const [chartPoints, setChartPoints] = useState(defaultChartPoints);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminRequest('/merchant/analytics/business');
      const data = res.data || res;
      if (data && data.kpis) {
        setStats({
          revenue: { value: `₹${data.kpis.totalRevenue.toLocaleString()}`, trend: `+${data.kpis.revenueGrowth}%`, up: data.kpis.revenueGrowth >= 0 },
          orders: { value: data.kpis.orders.toLocaleString(), trend: `+${data.kpis.ordersGrowth}%`, up: data.kpis.ordersGrowth >= 0 },
          aov: { value: `₹${data.kpis.aov.toLocaleString()}`, trend: `+${data.kpis.aovGrowth}%`, up: data.kpis.aovGrowth >= 0 },
          returnRate: { value: `₹${data.kpis.refunds.toLocaleString()}`, trend: `${data.kpis.refundsGrowth}%`, up: data.kpis.refundsGrowth >= 0 },
        });
      }
      if (data && data.revenueChart) {
        // Map revenue chart to table
        const tData = data.revenueChart.map(item => ({
          label: item.date,
          revenue: `₹${item.value.toLocaleString()}`,
          orders: "-",
          aov: "-"
        }));
        setTableData(tData.reverse());
      }
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  const polyline = chartPoints.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = `M0,80 ${chartPoints.map(p => `L${p.x},${p.y}`).join(" ")} L440,100 L0,100 Z`;

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Reports</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Overview of sales performance and key metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1A1827] border border-[#2d2c45] rounded-lg p-1">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  range === r ? "bg-[#8C63F5] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", ...stats.revenue, icon: "payments", color: "text-[#8C63F5]", bg: "bg-[#8C63F5]/10" },
          { label: "Total Orders", ...stats.orders, icon: "receipt_long", color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Avg. Order Value", ...stats.aov, icon: "shopping_bag", color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Total Returns", ...stats.returnRate, icon: "undo", color: "text-red-400", bg: "bg-red-500/10" },
        ].map((card) => (
          <div key={card.label} className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                <span className="material-symbols-outlined text-[16px]">{card.icon}</span>
              </div>
            </div>
            <p className="text-xl font-bold text-white">{card.value}</p>
            <span className={`text-xs font-medium flex items-center gap-1 ${card.up ? "text-green-500" : "text-red-500"}`}>
              <span className="material-symbols-outlined text-[14px]">{card.up ? "arrow_upward" : "arrow_downward"}</span>
              {card.trend} vs last period
            </span>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Revenue Over Time</h2>
        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 440 100" className="w-full h-48" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8C63F5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8C63F5" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />
            <polyline points={polyline} fill="none" stroke="#8C63F5" strokeWidth="2" strokeLinejoin="round" />
            {chartPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#8C63F5" />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
          {["May 01","May 05","May 10","May 15","May 20","May 25","May 31"].map(d => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2d2c45]">
          <h2 className="text-sm font-bold text-white">Daily Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                {["Date", "Revenue", "Orders", "Avg. Order Value"].map(h => (
                  <th key={h} className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {tableData.map((row) => (
                <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-6 text-sm text-slate-300">{row.label}</td>
                  <td className="py-3 px-6 text-sm font-medium text-white">{row.revenue}</td>
                  <td className="py-3 px-6 text-sm text-slate-300">{row.orders}</td>
                  <td className="py-3 px-6 text-sm text-slate-300">{row.aov}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
