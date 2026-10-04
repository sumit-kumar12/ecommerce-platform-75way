"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { adminRequest } from "../../../lib/api";

export default function SecurityAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kpis: { totalEvents: 0, uniqueThreats: 0, meanTimeToDetect: "0m", meanTimeToRespond: "0m" },
    eventsOverTime: [],
    eventsBySource: [],
    topAttackedAssets: [],
    attackTrends: []
  });

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        const res = await adminRequest("/soc/analytics/overview");
        if (active && res?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch SOC analytics", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAnalytics();
    // Poll every 30 seconds for live feel
    const interval = setInterval(fetchAnalytics, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const { kpis, eventsOverTime, eventsBySource, topAttackedAssets, attackTrends } = data;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full">
      
      {/* Page Header Actions */}
      <div className="flex justify-between items-center">
        <div className="text-white text-lg font-bold">Security Analytics</div>
        <div className="relative">
          <select className="bg-[#1A1827] border border-zinc-800/60 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:border-[#8C63F5] appearance-none">
            <option>Last 30 Days</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
        </div>
      </div>

      {loading && <div className="text-zinc-500 text-sm">Loading analytics...</div>}

      {/* Top row KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-zinc-400 text-sm mb-2">Total Events</p>
          <h3 className="text-3xl font-bold text-white mb-2">{kpis.totalEvents.toLocaleString()}</h3>
        </div>

        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-zinc-400 text-sm mb-2">Unique Threats</p>
          <h3 className="text-3xl font-bold text-white mb-2">{kpis.uniqueThreats.toLocaleString()}</h3>
        </div>

        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-zinc-400 text-sm mb-2">Mean Time to Detect</p>
          <h3 className="text-3xl font-bold text-white mb-2">{kpis.meanTimeToDetect}</h3>
        </div>

        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-zinc-400 text-sm mb-2">Mean Time to Respond</p>
          <h3 className="text-3xl font-bold text-white mb-2">{kpis.meanTimeToRespond}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Events Over Time */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 xl:col-span-2">
          <h3 className="text-white font-medium mb-6">Events Over Time</h3>
          <div className="h-[250px] w-full">
            {eventsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={eventsOverTime} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dy={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600 text-sm">No event data</div>
            )}
          </div>
        </div>

        {/* Events by Source */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6 flex flex-col">
          <h3 className="text-white font-medium mb-6">Events by Source</h3>
          <div className="flex items-center justify-between h-[250px]">
            {eventsBySource.length > 0 ? (
              <>
                <div className="w-40 h-40 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie
                        data={eventsBySource}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {eventsBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#EAB308'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1827', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => `${value}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-white leading-none">
                      {eventsBySource.length}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 pl-4 space-y-3">
                  {eventsBySource.map((src, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-[11px]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color || '#EAB308' }}></span>
                          <span className="text-slate-300">{src.name}</span>
                        </div>
                        <span className="text-white font-medium">{src.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex w-full h-full items-center justify-center text-zinc-600 text-sm">No source data</div>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Attacked Assets */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Top Attacked Assets</h3>
          </div>
          <div className="space-y-5">
            {topAttackedAssets.length > 0 ? topAttackedAssets.map((asset, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">{asset.name || 'Unknown'}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500">{asset.count}</span>
                  </div>
                </div>
                <div className="w-full bg-[#0F0E17] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-blue-500" 
                    style={{ width: `${asset.val}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-zinc-600 text-sm">No asset data</div>
            )}
          </div>
        </div>

        {/* Attack Trends */}
        <div className="bg-[#1A1827] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Attack Trends</h3>
          </div>
          <div className="space-y-4">
            {attackTrends.length > 0 ? attackTrends.map((trend, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className="text-slate-300 text-xs w-28 truncate">{trend.name}</span>
                <div className="flex-1 px-8 h-8 max-w-[150px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <LineChart data={trend.spark || [{v:0}]}>
                      <Line type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )) : (
              <div className="text-zinc-600 text-sm">No trend data</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
