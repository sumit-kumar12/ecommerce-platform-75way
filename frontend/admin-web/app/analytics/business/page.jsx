"use client";

import { useState, useEffect } from "react";
import { adminRequest } from "../../../lib/api";
import { DateRangeFilter } from "../../../components/analytics/DateRangeFilter";
import { SalesChart } from "../../../components/analytics/SalesChart";
import { TrafficSourceChart } from "../../../components/analytics/TrafficSourceChart";
import { StatCard } from "../../../components/dashboard/StatCard";

export default function BusinessAnalyticsPage() {
  const [range, setRange] = useState("30D");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await adminRequest("/merchant/analytics/business");
        setData(res);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [range]);

  const SAFE_TRENDS = { revenue: 0, aov: 0, cac: 0, ltv: 0 };
  const kpis = {
    totalRevenue: 0,
    averageOrderValue: 0,
    customerAcquisitionCost: 0,
    lifetimeValue: 0,
    trends: { ...SAFE_TRENDS },
    ...(data?.kpis || {}),
    // Always guarantee trends is an object with all keys
    trends: { ...SAFE_TRENDS, ...(data?.kpis?.trends || {}) },
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Business Analysis</h2>
          <p className="text-slate-400 mt-1 text-sm">Revenue forecasts, sales trends, and demographic insights</p>
        </div>
        <div className="flex gap-4 items-center">
          <DateRangeFilter selected={range} onChange={setRange} />
          <button className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors h-10">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-2">
        <StatCard title="Total Revenue" value={`₹${(kpis.totalRevenue || 0).toLocaleString()}`} icon="account_balance" trend={kpis.trends.revenue} color="#8B5CF6" />
        <StatCard title="Average Order Value" value={`₹${(kpis.averageOrderValue || 0).toLocaleString()}`} icon="receipt_long" trend={kpis.trends.aov} color="#10B861" />
        <StatCard title="Customer Acquisition Cost" value={`₹${(kpis.customerAcquisitionCost || 0).toLocaleString()}`} icon="group_add" trend={kpis.trends.cac} color="#F59E0B" />
        <StatCard title="Customer Lifetime Value" value={`₹${(kpis.lifetimeValue || 0).toLocaleString()}`} icon="loyalty" trend={kpis.trends.ltv} color="#00DAFF" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-2">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>
        <div className="xl:col-span-1">
          <TrafficSourceChart />
        </div>
      </div>

      {/* Demographic Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#2d2c45]">
            <h3 className="text-lg font-bold text-white">Top Geographies</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { region: 'Maharashtra', percent: 35, color: '#8B5CF6' },
                { region: 'Delhi NCR', percent: 25, color: '#10B861' },
                { region: 'Karnataka', percent: 20, color: '#00DAFF' },
                { region: 'Gujarat', percent: 12, color: '#F59E0B' },
              ].map(item => (
                <div key={item.region}>
                  <div className="flex justify-between text-sm text-slate-300 mb-1">
                    <span>{item.region}</span>
                    <span className="font-mono">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-[#0F0E17] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#2d2c45]">
            <h3 className="text-lg font-bold text-white">Revenue by Category</h3>
          </div>
          <div className="p-6 flex flex-col justify-center h-[calc(100%-69px)]">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-16 text-right text-sm text-slate-400">Electronics</div>
                <div className="flex-1 h-6 bg-[#8B5CF6] rounded-sm" style={{ width: '60%' }}></div>
                <div className="w-16 font-mono text-sm text-white text-right">60%</div>
             </div>
             <div className="flex items-center gap-4 mb-4">
                <div className="w-16 text-right text-sm text-slate-400">Fashion</div>
                <div className="flex-1 h-6 bg-[#00DAFF] rounded-sm" style={{ width: '25%' }}></div>
                <div className="w-16 font-mono text-sm text-white text-right">25%</div>
             </div>
             <div className="flex items-center gap-4 mb-4">
                <div className="w-16 text-right text-sm text-slate-400">Home</div>
                <div className="flex-1 h-6 bg-[#10B861] rounded-sm" style={{ width: '10%' }}></div>
                <div className="w-16 font-mono text-sm text-white text-right">10%</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-16 text-right text-sm text-slate-400">Other</div>
                <div className="flex-1 h-6 bg-[#F59E0B] rounded-sm" style={{ width: '5%' }}></div>
                <div className="w-16 font-mono text-sm text-white text-right">5%</div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
