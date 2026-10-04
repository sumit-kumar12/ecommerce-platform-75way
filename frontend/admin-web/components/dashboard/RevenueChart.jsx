"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function RevenueChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Mock data for initial render or if backend not connected
      return [
        { name: "Mon", revenue: 4000 },
        { name: "Tue", revenue: 3000 },
        { name: "Wed", revenue: 5000 },
        { name: "Thu", revenue: 2780 },
        { name: "Fri", revenue: 6890 },
        { name: "Sat", revenue: 8390 },
        { name: "Sun", revenue: 10490 },
      ];
    }
    return data;
  }, [data]);

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Revenue Overview</h2>
        <p className="text-slate-400 text-sm mt-1">Daily sales performance over the last 7 days</p>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F0E17', borderColor: '#2d2c45', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#8C63F5' }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8C63F5" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

