"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export function SalesChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { name: "Jan", actual: 4000, projected: 2400 },
        { name: "Feb", actual: 3000, projected: 1398 },
        { name: "Mar", actual: 2000, projected: 9800 },
        { name: "Apr", actual: 2780, projected: 3908 },
        { name: "May", actual: 1890, projected: 4800 },
        { name: "Jun", actual: 2390, projected: 3800 },
        { name: "Jul", actual: 3490, projected: 4300 },
      ];
    }
    return data;
  }, [data]);

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Revenue vs Projected</h2>
        <p className="text-slate-400 text-sm mt-1">Comparison of actual sales performance against targets</p>
      </div>
      
      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: '#2d2c45', opacity: 0.4 }}
              formatter={(value, name) => [`₹${value.toLocaleString()}`, name === 'actual' ? 'Actual Revenue' : 'Projected Revenue']}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}
              formatter={(value) => <span className="text-slate-300 ml-1">{value === 'actual' ? 'Actual Revenue' : 'Projected Revenue'}</span>}
            />
            <Bar dataKey="projected" fill="#2d2c45" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="#8C63F5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

