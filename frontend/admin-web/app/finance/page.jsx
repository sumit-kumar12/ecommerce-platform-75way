"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

import { adminRequest } from "../../lib/api";

const PERIODS = ["7D", "30D", "90D"];
const COLORS = ['#8C63F5', '#10B861', '#F59E0B', '#EF4444', '#00DAFF'];

export default function PayoutsOverview() {
  const [period, setPeriod] = useState("30D");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ availableBalance: 0, balanceGrowth: 0, pendingPayouts: 0, pendingGrowth: 0, totalPayouts: 0, totalGrowth: 0 });
  const [payouts, setPayouts] = useState([]);
  
  React.useEffect(() => {
    let active = true;
    const fetchFinance = async () => {
      try {
        const [summaryRes, payoutsRes] = await Promise.all([
          adminRequest("/finance/summary"),
          adminRequest("/finance/payouts")
        ]);
        
        if (!active) return;
        
        if (summaryRes?.summary) {
          const s = summaryRes.summary;
          setKpis({
            availableBalance: s.totalRevenue,
            balanceGrowth: s.revenueGrowth ?? (s.prevTotalRevenue && s.prevTotalRevenue > 0
              ? Math.round(((s.totalRevenue - s.prevTotalRevenue) / s.prevTotalRevenue) * 1000) / 10
              : null),
            pendingPayouts: s.pendingClearance,
            pendingGrowth: s.pendingGrowth ?? null,
            totalPayouts: s.successfulPayouts,
            totalGrowth: s.payoutsGrowth ?? null
          });
        }
        
        if (payoutsRes?.payouts) {
          setPayouts(payoutsRes.payouts);
        }
      } catch (err) {
        console.error("Failed to load finance data", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFinance();
    return () => { active = false; };
  }, []);

  // Build chart from real payouts data — distribute evenly if daily breakdown unavailable
  const payoutsOverTime = payouts.length > 0
    ? payouts.slice(-30).map(p => ({
        date: p.date || p.createdAt
          ? new Date(p.date || p.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })
          : 'N/A',
        amount: Number(p.amount || p.totalAmount || 0),
      }))
    : Array.from({ length: 7 }).map((_, i) => ({
        date: new Date(Date.now() - (6 - i) * 864e5).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }),
        amount: Math.round(kpis.totalPayouts / 7),
      }));
  const payoutsByStatus = [
    { name: "Completed", value: 80, amount: kpis.totalPayouts * 0.8 },
    { name: "Processing", value: 20, amount: kpis.totalPayouts * 0.2 },
  ];
  const topMethods = [
    { method: "Bank Transfer", amount: kpis.totalPayouts * 0.75, pct: 75 },
    { method: "UPI", amount: kpis.totalPayouts * 0.25, pct: 25 },
  ];

  if (loading) {
    return <div className="min-h-screen bg-[#0F0E17] flex items-center justify-center text-white">Loading Finance Data...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Payouts Overview</h2>
          <p className="text-slate-400 mt-1 text-sm">Overview of all payouts and balances</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://dashboard.razorpay.com/app/settlements" target="_blank" rel="noopener noreferrer" className="bg-[#8C63F5] hover:bg-[#7b53de] text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-[#8C63F5]/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Manage Settlements in Razorpay
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Available Balance" value={`₹${kpis.availableBalance.toLocaleString()}`} trend={kpis.balanceGrowth} />
        <KpiCard title="Pending Payouts" value={`₹${kpis.pendingPayouts.toLocaleString()}`} trend={kpis.pendingGrowth} invertTrend />
        <KpiCard title="Total Payouts" value={`₹${kpis.totalPayouts.toLocaleString()}`} trend={kpis.totalGrowth} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Payouts Over Time Area Chart */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-medium">Payouts Over Time</h3>
              <select className="bg-[#1A1827] border border-[#2d2c45] text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={payoutsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8C63F5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8C63F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2c45" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#1A1827', borderColor: '#2d2c45', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#8C63F5' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#8C63F5" strokeWidth={3} fillOpacity={1} fill="url(#colorPayouts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payouts by Status */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">Payouts by Status</h3>
              <div className="h-[220px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={payoutsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {payoutsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1A1827', borderColor: '#2d2c45', borderRadius: '8px', color: '#fff' }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                  <span className="text-white font-bold text-xl">{payoutsByStatus[0].value}%</span>
                </div>
              </div>
            </div>

            {/* Top Payout Methods */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 flex flex-col">
              <h3 className="text-white font-medium mb-6">Top Payout Methods</h3>
              <div className="flex-1 space-y-4">
                {topMethods.map((method, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{method.method}</span>
                      <span className="text-white font-medium">₹{method.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#8C63F5] rounded-full" 
                        style={{ width: `${method.pct}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Transactions/Payout List */}
        <div className="xl:col-span-1 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-800/60">
            <h3 className="text-lg font-bold text-white">Recent Payouts</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-zinc-800/60">
              {payouts.length === 0 && (
                <div className="p-6 text-center text-zinc-500">No payouts found</div>
              )}
              {payouts.map((po, idx) => (
                <div key={idx} className="p-4 px-6 hover:bg-zinc-800/30 transition-colors flex items-center justify-between group">
                  <div>
                    <span className="text-[#8C63F5] text-sm font-medium">
                      {po.id}
                    </span>
                    <p className="text-xs text-zinc-500 mt-1">{new Date(po.created_at * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm mb-1">₹{po.amount.toLocaleString()}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      po.status === 'processed' || po.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-zinc-800/60 text-center">
            <Link href="/finance/transactions" className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
              View all payouts →
            </Link>
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
