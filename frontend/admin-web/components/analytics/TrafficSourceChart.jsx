"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#8C63F5', '#10B861', '#F59E0B', '#00DAFF'];

export function TrafficSourceChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { name: 'Organic Search', value: 45 },
        { name: 'Direct', value: 25 },
        { name: 'Social Media', value: 20 },
        { name: 'Referral', value: 10 },
      ];
    }
    return data;
  }, [data]);

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-white tracking-tight">Traffic Sources</h2>
        <p className="text-slate-400 text-sm mt-1">Where your customers are coming from</p>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F0E17', borderColor: '#2d2c45', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}%`, "Traffic Share"]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

