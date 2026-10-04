export function OffersTable({ offers }) {
  if (!offers || offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#1a192b] border border-[#2d2c45] rounded-2xl">
        <span className="material-symbols-outlined text-slate-500 text-5xl mb-4">local_offer</span>
        <h3 className="text-xl font-bold text-white mb-2">No promotional offers</h3>
        <p className="text-slate-400">Create campaigns and promo codes to boost sales.</p>
      </div>
    );
  }

  const getStatusColor = (isActive, endDate) => {
    if (!isActive) return "bg-slate-800 text-slate-400";
    if (new Date(endDate) < new Date()) return "bg-[#EF4444]/20 text-[#EF4444]";
    return "bg-[#10B861]/20 text-[#10B861]";
  };

  const getStatusLabel = (isActive, endDate) => {
    if (!isActive) return "INACTIVE";
    if (new Date(endDate) < new Date()) return "EXPIRED";
    return "ACTIVE";
  };

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F0E17] border-b border-[#2d2c45] text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Campaign Title</th>
              <th className="p-4 font-medium">Promo Code</th>
              <th className="p-4 font-medium">Discount</th>
              <th className="p-4 font-medium">Usage</th>
              <th className="p-4 font-medium">Expires On</th>
              <th className="p-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2c45]">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-[#2d2c45]/30 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <strong className="text-white text-sm">{offer.title}</strong>
                    <span className="text-xs text-slate-500">ID: {offer.id.slice(-8).toUpperCase()}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-block bg-[#8C63F5]/10 border border-[#8C63F5]/30 text-[#8C63F5] font-mono font-bold px-3 py-1 rounded-md text-sm tracking-widest">
                    {offer.code}
                  </span>
                </td>
                <td className="p-4 text-white font-bold">
                  {offer.discountPercent}% OFF
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-slate-300 text-sm">{offer.usageCount || 0} uses</span>
                    <span className="text-xs text-slate-500">Limit: {offer.usageLimit || '∞'}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-400 text-sm">
                  {new Date(offer.endDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(offer.isActive, offer.endDate)}`}>
                    {getStatusLabel(offer.isActive, offer.endDate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

