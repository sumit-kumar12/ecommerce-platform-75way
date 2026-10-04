export function StatCard({ title, value, icon, trend, trendLabel, color = "#8C63F5" }) {
  const isPositive = trend > 0;
  
  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-[#8C63F5]/30 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-20" style={{ backgroundColor: color }}></div>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-[#10B861]/10 text-[#10B861]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
            <span className="material-symbols-outlined text-[14px]">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <strong className="text-white text-2xl tracking-tight mt-1 block">{value}</strong>
        {trendLabel && <span className="text-slate-500 text-xs mt-1 block">{trendLabel}</span>}
      </div>
    </div>
  );
}
