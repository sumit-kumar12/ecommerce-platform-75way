"use client";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0F0E17]/80 backdrop-blur-sm transition-all" onClick={onClose}>
      <div className="bg-[#1a192b] w-full max-w-4xl rounded-2xl overflow-hidden border border-[#2d2c45] shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2d2c45] flex items-center justify-between bg-[#0F0E17]">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                Order #{order.id.slice(-8).toUpperCase()}
                <OrderStatusBadge status={order.status} />
              </h2>
              <p className="text-slate-400 text-sm mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors p-2" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Timeline */}
            <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Fulfillment Timeline</h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute top-2 bottom-2 left-[11px] w-[2px] bg-[#2d2c45]"></div>
                
                <div className="relative z-10 flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#10B861] border-4 border-[#0F0E17] flex items-center justify-center shrink-0 -ml-[11px]">
                    <span className="material-symbols-outlined text-[12px] text-white">check</span>
                  </div>
                  <div>
                    <strong className="text-white text-sm block">Order Placed</strong>
                    <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-4">
                  <div className={`w-6 h-6 rounded-full border-4 border-[#0F0E17] flex items-center justify-center shrink-0 -ml-[11px] ${order.status !== 'PENDING' ? 'bg-[#8C63F5]' : 'bg-[#2d2c45]'}`}>
                    {order.status !== 'PENDING' && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                  </div>
                  <div>
                    <strong className={order.status !== 'PENDING' ? 'text-white text-sm block' : 'text-slate-500 text-sm block'}>Processing</strong>
                    <span className="text-xs text-slate-500">Payment confirmed, preparing items</span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-4">
                  <div className={`w-6 h-6 rounded-full border-4 border-[#0F0E17] flex items-center justify-center shrink-0 -ml-[11px] ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#00DAFF]' : 'bg-[#2d2c45]'}`}>
                    {['SHIPPED', 'DELIVERED'].includes(order.status) && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                  </div>
                  <div>
                    <strong className={['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-white text-sm block' : 'text-slate-500 text-sm block'}>Shipped</strong>
                    <span className="text-xs text-slate-500">Handed over to delivery partner</span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-4">
                  <div className={`w-6 h-6 rounded-full border-4 border-[#0F0E17] flex items-center justify-center shrink-0 -ml-[11px] ${order.status === 'DELIVERED' ? 'bg-[#10B861]' : 'bg-[#2d2c45]'}`}>
                    {order.status === 'DELIVERED' && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                  </div>
                  <div>
                    <strong className={order.status === 'DELIVERED' ? 'text-white text-sm block' : 'text-slate-500 text-sm block'}>Delivered</strong>
                    <span className="text-xs text-slate-500">Package arrived at destination</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-[#2d2c45] last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#1a192b] border border-[#2d2c45] flex items-center justify-center">
                         <span className="material-symbols-outlined text-slate-500">inventory_2</span>
                      </div>
                      <div>
                        <strong className="text-white text-sm block">{item.productName || `Product ID: ${item.productId}`}</strong>
                        <span className="text-xs text-slate-400">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                    <strong className="text-white">₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}</strong>
                  </div>
                ))}
                {!order.items?.length && (
                  <div className="text-slate-500 text-sm text-center py-4">No item details available.</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Customer Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Name</span>
                  <strong className="text-white">{order.customerName || "Guest"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Email</span>
                  <strong className="text-white">{order.customerEmail || "No email"}</strong>
                </div>
                {order.shippingAddress && (
                  <div>
                    <span className="text-slate-500 block text-xs">Shipping Address</span>
                    <p className="text-slate-300 mt-1">
                      {order.shippingAddress.line1}<br/>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Payment Summary</h3>
              <div className="space-y-2 text-sm border-b border-[#2d2c45] pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">₹{(order.total - (order.tax || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax</span>
                  <span className="text-white">₹{Number(order.tax || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span className="text-white">Free</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#8C63F5]">₹{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-[#8C63F5] hover:bg-[#6a64f1] text-white py-2.5 rounded-xl font-bold transition-colors">
                Update Status
              </button>
              <button className="w-12 h-12 bg-[#2d2c45] hover:bg-[#3d3b54] text-white rounded-xl flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

