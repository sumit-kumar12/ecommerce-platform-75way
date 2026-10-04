export function KPICards({ data }) {
  const cards = [
    { label: "Total Orders", value: data?.orders || 0, icon: "local_shipping", color: "#8C63F5" },
    { label: "Wishlist Items", value: data?.wishlist || 0, icon: "favorite", color: "#F59E0B" },
    { label: "Reward Points", value: data?.rewardPoints || 0, icon: "military_tech", color: "#00DAFF" },
    { label: "Katacoins Balance", value: `₸${data?.katacoins || '0.00'}`, icon: "monetization_on", color: "#10B861" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-5 flex items-center gap-4 hover:border-[#5048e5]/50 transition-colors group">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors"
            style={{ 
              backgroundColor: `${card.color}15`, 
              color: card.color,
              borderColor: `${card.color}30`
            }}
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{card.icon}</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{card.label}</p>
            <h4 className="text-xl font-bold text-white leading-none">{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
