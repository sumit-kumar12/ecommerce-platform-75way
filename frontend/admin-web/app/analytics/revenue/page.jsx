"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Chart Components
// ─────────────────────────────────────────────────────────────────────────────

function Spark({ data = [], color = "#3b82f6", height = 24 }) {
  if (!data.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1), w = 80;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  const area = `M0,${height} ${data.map((v, i) => `L${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
  const id = `sp-${color.replace("#", "")}-${height}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible mt-1 shrink-0" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ items, totalLabel, totalValue, size = 110 }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  const r = 44, cx = 60, cy = 60, circum = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="13" />
        {items.map((item, i) => {
          const pct = item.value / total;
          const dash = `${pct * circum} ${circum}`;
          const offset = -(cum * circum);
          cum += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={item.color} strokeWidth="13"
              strokeDasharray={dash} strokeDashoffset={offset}
              className="transition-all duration-700" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-sm font-bold text-white leading-tight">{totalValue}</div>
        <div className="text-[9px] text-zinc-400 text-center leading-tight">{totalLabel}</div>
      </div>
    </div>
  );
}

function LineChart({ data, color = "#8b5cf6", labels = [], height = 120 }) {
  const max = Math.max(...data, 1), w = 440;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  const area = `M0,${height} ${data.map((v, i) => `L${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ")} L${w},${height} Z`;
  const id = `lc-${color.replace("#", "")}`;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {labels.length > 0 && (
        <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
          {labels.map(l => <span key={l}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

function ComboChart({ barData, lineData, labels = [], height = 120 }) {
  const maxBar = Math.max(...barData, 1), maxLine = Math.max(...lineData, 1);
  const w = 440, barW = w / barData.length * 0.7, barGap = w / barData.length;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="comboGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      {barData.map((v, i) => {
        const barH = (v / maxBar) * height;
        return <rect key={i} x={i * barGap + (barGap - barW) / 2} y={height - barH} width={barW} height={barH} fill="url(#comboGrad)" rx="2" />;
      })}
      <polyline
        points={lineData.map((v, i) => `${i * barGap + barGap / 2},${height - (v / maxLine) * height}`).join(" ")}
        fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function SettlementChart({ data, height = 80 }) {
  const max = Math.max(...data, 1), w = 440;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - (v / max) * height}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {[0.5].map((f, i) => (
        <line key={i} x1="0" y1={height * f} x2={w} y2={height * f} stroke="#1f2937" strokeWidth="1" />
      ))}
      <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const kpis = [
  { icon: "currency_rupee", label: "Total Revenue", value: "₹12,78,45,230", sub: "+18.6% vs last 7 days", up: true, color: "#10b981", sp: [80, 90, 95, 100, 110, 115, 127] },
  { icon: "percent", label: "Platform Commission", value: "₹1,27,84,523", sub: "+16.2% vs last 7 days", up: true, color: "#3b82f6", sp: [70, 80, 85, 90, 100, 110, 127] },
  { icon: "account_balance", label: "Net Revenue", value: "₹11,50,60,707", sub: "+19.3% vs last 7 days", up: true, color: "#8b5cf6", sp: [75, 85, 90, 95, 105, 110, 115] },
  { icon: "payments", label: "Total Settlements", value: "₹9,85,40,320", sub: "+14.7% vs last 7 days", up: true, color: "#f59e0b", sp: [65, 72, 80, 85, 90, 95, 98] },
  { icon: "currency_exchange", label: "Refunds", value: "₹45,21,080", sub: "-6.2% vs last 7 days", up: false, color: "#ef4444", sp: [55, 52, 50, 48, 47, 46, 45] },
  { icon: "credit_card_off", label: "Chargebacks", value: "₹8,45,210", sub: "-3.4% vs last 7 days", up: false, color: "#f97316", sp: [10, 9.5, 9.2, 9, 8.8, 8.6, 8.45] },
];

const revenueData = [75, 90, 100, 85, 110, 120, 127];
const weekLabels = ["May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27"];

const revenueBreakdown = [
  { label: "Product Sales", value: 74.0, color: "#3b82f6", amount: "₹9.45 Cr" },
  { label: "Shipping Charges", value: 9.9, color: "#10b981", amount: "₹1.26 Cr" },
  { label: "Platform Commission", value: 10.0, color: "#8b5cf6", amount: "₹1.26 Cr" },
  { label: "Taxes Collected", value: 5.0, color: "#f59e0b", amount: "₹0.64 Cr" },
  { label: "Other Income", value: 1.1, color: "#06b6d4", amount: "₹0.15 Cr" },
];

const revenueByCategory = [
  { label: "Grocery", value: 32.2, color: "#3b82f6", amount: "₹4.12 Cr" },
  { label: "Food & Beverages", value: 23.3, color: "#8b5cf6", amount: "₹2.98 Cr" },
  { label: "Home Essentials", value: 17.6, color: "#10b981", amount: "₹2.25 Cr" },
  { label: "Hardware", value: 13.1, color: "#f59e0b", amount: "₹1.68 Cr" },
  { label: "Daily Essentials", value: 8.2, color: "#06b6d4", amount: "₹1.05 Cr" },
  { label: "Others", value: 5.6, color: "#ef4444", amount: "₹0.70 Cr" },
];

const commissionBarData = [310, 330, 320, 340, 360, 380, 400];
const commissionLineData = [9.2, 9.5, 9.3, 9.6, 9.8, 10.0, 10.2];

const gateways = [
  { name: "Razorpay", revenue: "₹9,45,12,340", rate: "98.73%", count: "1,28,745", refunds: "₹25,12,340", rateColor: "text-emerald-400" },
  { name: "Cashfree", revenue: "₹2,12,45,320", rate: "97.21%", count: "45,231", refunds: "₹12,34,780", rateColor: "text-emerald-400" },
  { name: "PayU", revenue: "₹78,45,230", rate: "96.15%", count: "12,564", refunds: "₹4,23,410", rateColor: "text-emerald-400" },
  { name: "PhonePe", revenue: "₹28,76,540", rate: "97.85%", count: "5,421", refunds: "₹1,45,240", rateColor: "text-emerald-400" },
  { name: "Amazon Pay", revenue: "₹13,65,800", rate: "97.32%", count: "2,145", refunds: "₹98,450", rateColor: "text-emerald-400" },
];

const settlementData = [60, 70, 65, 80, 90, 85, 95, 100, 95, 105, 112, 120];

const taxItems = [
  { label: "IGST", value: 44.6, color: "#3b82f6", amount: "₹28.65 L" },
  { label: "SGST", value: 27.8, color: "#10b981", amount: "₹17.84 L" },
  { label: "CGST", value: 27.6, color: "#f59e0b", amount: "₹17.84 L" },
];

const refundItems = [
  { label: "Completed", value: 84.3, color: "#10b981", amount: "₹38.12 L" },
  { label: "Pending", value: 11.5, color: "#3b82f6", amount: "₹5.21 L" },
  { label: "Failed", value: 4.2, color: "#ef4444", amount: "₹1.88 L" },
];

const revenueByCity = [
  { city: "New Delhi", revenue: "₹2,12,45,230", orders: "21,245" },
  { city: "Mumbai", revenue: "₹1,65,24,560", orders: "18,632" },
  { city: "Bengaluru", revenue: "₹1,45,78,400", orders: "15,653" },
  { city: "Hyderabad", revenue: "₹1,08,65,320", orders: "10,245" },
  { city: "Pune", revenue: "₹85,41,250", orders: "8,142" },
];

const revenueBySource = [
  { label: "Marketplace", value: 81.8, color: "#10b981", amount: "₹10.45 Cr" },
  { label: "Shipping", value: 9.9, color: "#3b82f6", amount: "₹1.26 Cr" },
  { label: "Ads & Promotions", value: 5.0, color: "#8b5cf6", amount: "₹0.64 Cr" },
  { label: "Other Services", value: 3.3, color: "#f59e0b", amount: "₹0.43 Cr" },
];

const revenueSummary = [
  { label: "Gross Merchandise Value", val: "₹18,92,34,560", change: "+16.9%", up: true },
  { label: "Total Revenue", val: "₹12,78,45,230", change: "+18.6%", up: true },
  { label: "Platform Commission", val: "₹1,27,84,523", change: "+16.2%", up: true },
  { label: "Net Revenue", val: "₹11,50,60,707", change: "+19.3%", up: true },
  { label: "Total Settlements", val: "₹9,85,40,320", change: "+14.7%", up: true },
  { label: "Refunds", val: "₹45,21,080", change: "-6.2%", up: false },
  { label: "Chargebacks", val: "₹8,45,210", change: "-3.4%", up: false },
];

const recentTransactions = [
  { id: "Order #KB290051245", sub: "Razorpay", amt: "₹1,245.00", time: "2m ago", color: "#10b981" },
  { id: "Order #KB290051244", sub: "Cashfree", amt: "₹845.50", time: "5m ago", color: "#3b82f6" },
  { id: "Refund #RF29051212", sub: "Razorpay", amt: "-₹1,240.00", time: "12m ago", color: "#ef4444" },
  { id: "Order #KB290051243", sub: "PayU", amt: "₹2,149.00", time: "18m ago", color: "#10b981" },
  { id: "Settlement Payout", sub: "Bank Transfer", amt: "₹12,45,320.00", time: "45m ago", color: "#8b5cf6" },
];

const revenueAlerts = [
  { icon: "error", text: "High refund rate detected", sub: "Refund rate is above 5%", time: "10m ago", color: "#ef4444" },
  { icon: "warning", text: "Settlement delay in HDFC Bank", sub: "Payout may be delayed", time: "22m ago", color: "#f59e0b" },
  { icon: "warning", text: "Chargeback increase", sub: "Chargebacks up by 12%", time: "35m ago", color: "#f59e0b" },
  { icon: "info", text: "Payment gateway issue", sub: "Latency detected", time: "1h ago", color: "#3b82f6" },
  { icon: "info", text: "Tax mismatch detected", sub: "Verify IGST for 23 orders", time: "2h ago", color: "#06b6d4" },
];

const quickActions = [
  { icon: "bar_chart", label: "Revenue Report", color: "#8b5cf6" },
  { icon: "file_download", label: "Export Data", color: "#10b981" },
  { icon: "account_balance", label: "Settlement Report", color: "#3b82f6" },
  { icon: "receipt_long", label: "Tax Report", color: "#f59e0b" },
  { icon: "settings", label: "Payout Settings", color: "#06b6d4" },
  { icon: "fact_check", label: "View Transactions", color: "#ef4444" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function RevenueAnalyticsDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Revenue Analytics Dashboard
            <span className="material-symbols-outlined text-[18px] text-purple-400">query_stats</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Comprehensive revenue, commission, settlement and financial performance insights.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            May 21 – May 27, 2025
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors">
            Compare: May 14 – May 20, 2025
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors">
            <span className="material-symbols-outlined text-[14px]">refresh</span> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((k, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]" style={{ color: k.color }}>{k.icon}</span>
                  <span className="text-[10px] text-zinc-400 font-medium leading-tight">{k.label}</span>
                </div>
                <div className="text-[15px] font-bold text-white leading-tight">{k.value}</div>
                <div className={`text-[9px] flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                  <span className="material-symbols-outlined text-[11px]">{k.up ? "arrow_upward" : "arrow_downward"}</span>
                  {k.sub}
                </div>
                <Spark data={k.sp} color={k.color} height={20} />
              </div>
            ))}
          </div>

          {/* Row 2: Revenue Over Time + Revenue Breakdown + Revenue by Category */}
          <div className="grid grid-cols-12 gap-4">

            {/* Revenue Over Time */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Revenue Over Time</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Daily</option><option>Weekly</option>
                </select>
              </div>
              {/* Y-axis labels */}
              <div className="flex gap-2 flex-1 min-h-[110px]">
                <div className="flex flex-col justify-between text-[9px] text-zinc-600 py-0.5">
                  <span>₹3M</span><span>₹2.25M</span><span>₹1.5M</span><span>₹0.75M</span><span>₹0</span>
                </div>
                <div className="flex-1">
                  <LineChart data={revenueData} color="#8b5cf6" labels={weekLabels} height={110} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 border-t border-zinc-800 pt-3">
                {[
                  { label: "Current Period", val: "₹12,78,45,230" },
                  { label: "Previous Period", val: "₹10,78,12,480" },
                  { label: "Growth", val: "18.6%", green: true },
                  { label: "Trend", val: "Positive", green: true },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[9px] text-zinc-500">{s.label}</div>
                    <div className={`text-[10px] font-bold ${s.green ? "text-emerald-400" : "text-white"} truncate`}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Breakdown Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Revenue Breakdown</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={revenueBreakdown} totalValue="₹12.78 Cr" totalLabel="Total Revenue" size={110} />
                <div className="space-y-2 flex-1">
                  {revenueBreakdown.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: d.color }} />
                        <span className="text-zinc-300">{d.label}</span>
                      </div>
                      <div className="flex gap-2 text-right">
                        <span className="text-zinc-400">{d.amount}</span>
                        <span className="text-zinc-600">({d.value}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue by Category Donut */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Revenue by Category</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={revenueByCategory} totalValue="₹12.78 Cr" totalLabel="Total Revenue" size={110} />
                <div className="space-y-1.5 flex-1">
                  {revenueByCategory.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: d.color }} />
                        <span className="text-zinc-300">{d.label}</span>
                      </div>
                      <div className="flex gap-2 text-right">
                        <span className="text-zinc-400">{d.amount}</span>
                        <span className="text-zinc-600">({d.value}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Commission Overview + Payment Gateway + Settlement Overview */}
          <div className="grid grid-cols-12 gap-4">

            {/* Commission Overview (Combo Chart) */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Commission Overview</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Daily</option>
                </select>
              </div>
              <div className="flex gap-3 mb-2">
                <div className="flex items-center gap-1.5 text-[9px]"><span className="w-2 h-2 rounded bg-blue-500/60" />Commission Amount</div>
                <div className="flex items-center gap-1.5 text-[9px]"><span className="w-2 h-2 rounded bg-emerald-400" />Commission Rate (%)</div>
              </div>
              <div className="flex-1 min-h-[100px]">
                <ComboChart barData={commissionBarData} lineData={commissionLineData} height={100} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-1 px-1">
                {weekLabels.map(l => <span key={l}>{l.replace("May ", "")}</span>)}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-zinc-800">
                {[
                  { label: "Total Commission", val: "₹1,27,84,523" },
                  { label: "Avg Commission Rate", val: "10.02%" },
                  { label: "Previous Period", val: "₹1,09,99,120" },
                  { label: "Growth", val: "16.2%", green: true },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[8px] text-zinc-500 leading-tight">{s.label}</div>
                    <div className={`text-[10px] font-bold ${s.green ? "text-emerald-400" : "text-white"} truncate`}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Gateway Performance */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Payment Gateway Performance</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[11px] whitespace-nowrap">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left pb-2 font-medium px-2">Gateway</th>
                      <th className="text-right pb-2 font-medium px-2">Revenue (₹)</th>
                      <th className="text-right pb-2 font-medium px-2">Success Rate</th>
                      <th className="text-right pb-2 font-medium px-2">Txn Count</th>
                      <th className="text-right pb-2 font-medium px-2">Refunds (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {gateways.map((g, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20">
                        <td className="py-2.5 px-2 text-zinc-300 font-medium">{g.name}</td>
                        <td className="py-2.5 px-2 text-right text-white">{g.revenue}</td>
                        <td className="py-2.5 px-2 text-right text-emerald-400 font-medium">{g.rate}</td>
                        <td className="py-2.5 px-2 text-right text-zinc-400">{g.count}</td>
                        <td className="py-2.5 px-2 text-right text-red-400">{g.refunds}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-zinc-700">
                    <tr>
                      <td className="py-2.5 px-2 text-zinc-300 font-bold text-[12px]">Total</td>
                      <td className="py-2.5 px-2 text-right text-white font-bold text-[12px]">₹12,78,45,230</td>
                      <td className="py-2.5 px-2 text-right text-emerald-400 font-bold text-[12px]">98.10%</td>
                      <td className="py-2.5 px-2 text-right text-zinc-400 font-bold text-[12px]">1,94,106</td>
                      <td className="py-2.5 px-2 text-right text-red-400 font-bold text-[12px]">₹45,21,080</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Settlement Overview */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-white">Settlement Overview</h3>
                <select className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1">
                  <option>Weekly</option><option>Monthly</option>
                </select>
              </div>
              <div className="flex gap-2 mb-1">
                <div className="flex items-center gap-1 text-[9px]"><span className="w-2 h-0.5 bg-emerald-400 inline-block" />Successful</div>
                <div className="flex items-center gap-1 text-[9px]"><span className="w-2 h-0.5 bg-red-400 inline-block" />Failed</div>
              </div>
              <div className="flex-1 min-h-[80px]">
                <SettlementChart data={settlementData} height={80} />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-zinc-800">
                {[
                  { label: "Total Settled", val: "₹9,85,40,320" },
                  { label: "Pending Settlement", val: "₹1,25,60,450" },
                  { label: "Next Payout", val: "May 30, 2025" },
                  { label: "On Hold", val: "₹12,34,780" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[8px] text-zinc-500 leading-tight">{s.label}</div>
                    <div className="text-[10px] font-bold text-white truncate">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Tax Collection + Refund Analysis */}
          <div className="grid grid-cols-12 gap-4">

            {/* Tax Collection */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Tax Collection</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={taxItems} totalValue="₹64.28 L" totalLabel="Total Taxes" size={100} />
                <div className="space-y-2 flex-1">
                  {taxItems.map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: t.color }} />
                        <span className="text-zinc-300">{t.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{t.amount}</div>
                        <div className="text-zinc-600">({t.value}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Refund Analysis */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Refund Analysis</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={refundItems} totalValue="₹45.21 L" totalLabel="Total Refunds" size={100} />
                <div className="space-y-2 flex-1">
                  {refundItems.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: r.color }} />
                        <span className="text-zinc-300">{r.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{r.amount}</div>
                        <div className="text-zinc-600">({r.value}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>

          {/* Row 5: Revenue by City + Revenue by Source */}
          <div className="grid grid-cols-12 gap-4">

            {/* Revenue by City (Top 5) */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Revenue by City (Top 5)</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <table className="w-full text-[10px] flex-1">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left pb-2 font-medium">City</th>
                    <th className="text-right pb-2 font-medium">Revenue (₹)</th>
                    <th className="text-right pb-2 font-medium">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {revenueByCity.map((c, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20">
                      <td className="py-2 text-zinc-300">{c.city}</td>
                      <td className="py-2 text-right text-white">{c.revenue}</td>
                      <td className="py-2 text-right text-zinc-400">{c.orders}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-zinc-700">
                  <tr>
                    <td className="py-2 text-zinc-400 font-bold">Total (Top 5)</td>
                    <td className="py-2 text-right text-white font-bold">₹7,57,54,760</td>
                    <td className="py-2 text-right text-zinc-400 font-bold">73,917</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Revenue by Source */}
            <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Revenue by Source</h3>
                <Link href="#" className="text-[10px] text-purple-400">View Report</Link>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <DonutChart items={revenueBySource} totalValue="₹12.78 Cr" totalLabel="Total Revenue" size={100} />
                <div className="space-y-2 flex-1">
                  {revenueBySource.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: s.color }} />
                        <span className="text-zinc-300">{s.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{s.amount}</div>
                        <div className="text-zinc-600">({s.value}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-72 border-l border-zinc-800/60 bg-zinc-900/20 flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Revenue Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Revenue Summary</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {revenueSummary.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">{s.label}</span>
                  <div className="text-right">
                    <div className="text-white font-medium">{s.val}</div>
                    <div className={`text-[9px] ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Recent Transactions</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((t, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: `${t.color}20` }}>
                    <span className="material-symbols-outlined text-[12px]" style={{ color: t.color }}>payments</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium truncate">{t.id}</div>
                    <div className="text-[9px] text-zinc-500">{t.sub}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[10px] font-bold ${t.amt.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>{t.amt}</div>
                    <div className="text-[9px] text-zinc-600">{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white">Revenue Alerts</h3>
              <Link href="#" className="text-[10px] text-purple-400">View All</Link>
            </div>
            <div className="space-y-2">
              {revenueAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0" style={{ color: a.color }}>{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-200 font-medium">{a.text}</div>
                    <div className="text-[9px] text-zinc-500">{a.sub}</div>
                  </div>
                  <div className="text-[9px] text-zinc-600 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-[12px] font-bold text-white mb-2">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q, i) => (
                <button key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${q.color}20` }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: q.color }}>{q.icon}</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 text-center leading-tight group-hover:text-zinc-200">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
