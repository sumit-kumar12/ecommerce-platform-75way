"use client";

import { useRouter } from "next/navigation";

export function OrdersTable({ orders }) {
  const router = useRouter();

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/40 border-t border-zinc-800/60">
        <span className="material-symbols-outlined text-zinc-600 text-5xl mb-4">receipt_long</span>
        <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
        <p className="text-zinc-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Delivered</span>;
      case "SHIPPED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Shipped</span>;
      case "PROCESSING":
      case "PACKED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#8C63F5]/10 text-[#8C63F5] border border-[#8C63F5]/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-[#8C63F5]"></span>Processing</span>;
      case "PENDING":
      case "PENDING_PAYMENT":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Pending</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>{status || "UNKNOWN"}</span>;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800/60 bg-zinc-900/20 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {orders.map((order) => (
            <tr 
              key={order.id} 
              className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-white">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-zinc-400">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {(order.customerName || "G")[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">{order.customerName || "Guest User"}</span>
                    <span className="text-xs text-zinc-500">{order.customerEmail || "No email provided"}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-zinc-200">
                  ₹{Number(order.totalAmount || order.total || 0).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-xs font-medium text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
                  {order.paymentMethod || "COD"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/orders/${order.id}`);
                  }}
                  className="text-sm font-medium text-[#8C63F5] hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-[#8C63F5]"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

