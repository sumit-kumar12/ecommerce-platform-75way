"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { adminRequest } from "../../../lib/api";

export default function IncidentResponse() {
  const [activeTab, setActiveTab] = useState("Active Incidents");
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [lifecycleData, setLifecycleData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchIncidents = async () => {
      try {
        // Fetch incidents from backend
        const res = await adminRequest("/incidents?limit=50");
        if (active && res) {
          // Normal API response logic depending on actual API shape
          // Assuming res.data or res is an array of incidents
          const dataList = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
          setIncidents(dataList);

          // Calculate lifecycle data dynamically based on status
          const statusCounts = {};
          dataList.forEach(inc => {
            statusCounts[inc.status] = (statusCounts[inc.status] || 0) + 1;
          });
          
          const colors = {
            "OPEN": "#3B82F6",
            "IN_PROGRESS": "#EAB308",
            "RESOLVED": "#10B981",
            "CLOSED": "#8C63F5"
          };
          
          const ld = Object.keys(statusCounts).map(status => ({
            name: status.replace(/_/g, " "),
            value: statusCounts[status],
            color: colors[status] || "#F97316"
          }));
          setLifecycleData(ld);

          // Calculate top categories dynamically
          const catCounts = {};
          dataList.forEach(inc => {
            const cat = inc.title || "Other"; // Fallback to title as category
            catCounts[cat] = (catCounts[cat] || 0) + 1;
          });
          const sortedCats = Object.keys(catCounts)
            .map(c => ({ name: c, count: catCounts[c] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
          
          setTopCategories(sortedCats);
        }
      } catch (err) {
        console.error("Failed to fetch incidents", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const getPriorityStyle = (priority) => {
    const p = String(priority).toUpperCase();
    switch (p) {
      case "CRITICAL": return "text-red-500";
      case "HIGH": return "text-orange-500";
      case "MEDIUM": return "text-yellow-500";
      default: return "text-blue-500";
    }
  };

  const getStatusStyle = (status) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case "OPEN": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "IN_PROGRESS": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "RESOLVED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CLOSED": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const activeCount = incidents.filter(i => i.status !== "CLOSED" && i.status !== "RESOLVED").length;
  const highPriorityCount = incidents.filter(i => ["HIGH", "CRITICAL"].includes(String(i.severity).toUpperCase())).length;
  const inProgressCount = incidents.filter(i => String(i.status).toUpperCase() === "IN_PROGRESS").length;
  const resolvedCount = incidents.filter(i => String(i.status).toUpperCase() === "RESOLVED").length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full">
      
      {/* Header Tabs & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto bg-[#1A1827] p-1.5 rounded-xl border border-zinc-800/60">
          {["Active Incidents", "All Incidents", "My Incidents"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-[#8C63F5] text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8C63F5] hover:bg-[#7b53de] text-white font-medium transition-colors shrink-0 shadow-lg shadow-[#8C63F5]/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Incident
        </button>
      </div>

      {loading && <div className="text-zinc-500 text-sm">Loading real incidents...</div>}

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">Active Incidents</p>
          <div className="flex items-end gap-3 mb-2">
            <h3 className="text-3xl font-bold text-emerald-400 leading-none">{activeCount}</h3>
          </div>
        </div>
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">High Priority</p>
          <h3 className="text-3xl font-bold text-red-500 mb-2">{highPriorityCount}</h3>
        </div>
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">In Progress</p>
          <h3 className="text-3xl font-bold text-orange-400 mb-2">{inProgressCount}</h3>
        </div>
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">Resolved (Total)</p>
          <h3 className="text-3xl font-bold text-blue-400 mb-2">{resolvedCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Incident Table */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl lg:col-span-2 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800/60 text-xs text-zinc-500 uppercase tracking-wider bg-[#0F0E17]">
                  <th className="px-6 py-4 font-medium">Incident ID</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Created At</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {incidents.length > 0 ? incidents.map((inc) => (
                  <tr key={inc.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{inc.id.substring(0,8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-white font-medium">{inc.title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold ${getPriorityStyle(inc.severity)}`}>
                        {inc.severity || "INFO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(inc.status)}`}>
                        {inc.status || "OPEN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className={!inc.createdById ? 'text-zinc-500 italic text-xs' : 'text-slate-300'}>
                        {inc.createdById ? 'System Admin' : 'System'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">{new Date(inc.createdAt).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-zinc-500 text-sm">No incidents found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panels */}
        <div className="flex flex-col gap-6">
          
          {/* Incident Lifecycle */}
          <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-6">Incident Lifecycle</h3>
            
            <div className="flex flex-col xl:flex-row items-center gap-6">
              <div className="w-32 h-32 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={lifecycleData.length > 0 ? lifecycleData : [{name:"No Data", value:1, color:"#374151"}]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {(lifecycleData.length > 0 ? lifecycleData : [{name:"No Data", value:1, color:"#374151"}]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white leading-none">{incidents.length}</span>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-3">
                {lifecycleData.map((stage, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }}></span>
                      <span className="text-slate-300">{stage.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white font-medium">{stage.value}</span>
                      <span className="text-zinc-500 w-8 text-right">({incidents.length > 0 ? Math.round((stage.value / incidents.length) * 100) : 0}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Incident Categories */}
          <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex-1">
            <h3 className="text-white font-medium mb-6">Top Incident Categories</h3>
            <div className="space-y-4">
              {topCategories.length > 0 ? topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0 last:pb-0">
                  <span className="text-slate-300 text-sm">{cat.name}</span>
                  <span className="text-white font-medium">{cat.count}</span>
                </div>
              )) : (
                <div className="text-zinc-500 text-sm">No category data</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
