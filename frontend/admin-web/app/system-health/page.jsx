"use client";

import React from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const SERVICES = [
  { name: "Website", status: "Operational", uptime: "100%" },
  { name: "API Server", status: "Operational", uptime: "100%" },
  { name: "Database", status: "Operational", uptime: "100%" },
  { name: "Payment Gateway", status: "Operational", uptime: "99.98%" },
  { name: "Email Service", status: "Operational", uptime: "100%" },
  { name: "File Storage", status: "Operational", uptime: "100%" },
  { name: "CDN", status: "Operational", uptime: "100%" },
];

const generateSparklineData = () => {
  return Array.from({ length: 20 }).map((_, i) => ({ value: Math.floor(Math.random() * 40) + 30 }));
};

const METRICS = [
  { name: "CPU Usage", value: "32%", data: generateSparklineData() },
  { name: "Memory Usage", value: "54%", data: generateSparklineData() },
  { name: "Disk Usage", value: "42%", data: generateSparklineData() },
  { name: "Response Time", value: "245ms", data: generateSparklineData() },
];

export default function SystemHealth() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Health</h2>
          <p className="text-slate-400 mt-1 text-sm">Monitor system status and uptime</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        
        <div className="p-6 border-b border-zinc-800/60">
          <h3 className="text-white font-medium mb-6">System Status</h3>
          
          <div className="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
            <div>
              <h4 className="text-emerald-400 font-bold text-lg">All Systems Operational</h4>
              <p className="text-emerald-500/70 text-sm">Uptime (30 days)</p>
            </div>
            <span className="text-3xl font-bold text-emerald-400">100%</span>
          </div>

          <div className="space-y-4">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-2">
                <span className="text-slate-300 font-medium w-32">{service.name}</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium flex-1 justify-end sm:justify-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {service.status}
                </span>
                <span className="text-white font-mono text-right w-16 hidden sm:block">{service.uptime}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-white font-medium mb-6">System Metrics</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((metric, idx) => (
              <div key={idx} className="bg-[#1A1827] border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-zinc-400 text-sm">{metric.name}</h4>
                  <span className="text-white font-bold text-xl">{metric.value}</span>
                </div>
                <div className="h-10 w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <LineChart data={metric.data}>
                      <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8C63F5" 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="px-6 py-4 border-t border-zinc-800/60 text-center bg-[#1A1827] rounded-b-2xl">
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full">
            View detailed status <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
