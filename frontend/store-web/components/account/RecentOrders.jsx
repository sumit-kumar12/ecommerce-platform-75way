import Link from "next/link";

export function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 mb-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">No Recent Orders</h3>
        <p className="text-slate-400 mb-4">You haven't placed any orders yet.</p>
        <Link href="/" className="inline-block bg-[#8C63F5] hover:bg-[#6a64f1] text-white px-6 py-2 rounded-xl font-bold transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED": return "bg-[#10B861]/10 text-[#10B861] border-[#10B861]/20";
      case "SHIPPED": return "bg-[#00DAFF]/10 text-[#00DAFF] border-[#00DAFF]/20";
      case "PROCESSING": return "bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/20";
      case "CANCELLED": return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
      default: return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"; // PENDING
    }
  };

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-[#2d2c45] flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Recent Orders</h3>
        <Link href="/account/orders" className="text-sm font-bold text-[#8C63F5] hover:underline flex items-center gap-1">
          View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <div className="divide-y divide-[#2d2c45]">
        {orders.slice(0, 4).map(order => (
          <div key={order.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#2d2c45]/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#121121] border border-[#2d2c45] rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-slate-400">inventory_2</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Order <span className="font-mono text-[#8C63F5]">#{order.id.slice(-8).toUpperCase()}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-sm text-slate-300">{new Date(order.date).toLocaleDateString()}</span>
                  <span className="hidden sm:block text-slate-600">•</span>
                  <strong className="text-white">₹{order.amount.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button className="w-10 h-10 rounded-xl bg-[#121121] border border-[#2d2c45] text-slate-400 hover:text-white hover:border-[#8C63F5] flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
