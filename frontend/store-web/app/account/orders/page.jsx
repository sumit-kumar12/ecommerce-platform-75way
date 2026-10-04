"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStoreCategories } from "../../../lib/useStoreCategories";
import { apiRequest } from "../../../lib/api";

export default function AccountOrdersPage() {
  const { categories } = useStoreCategories();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Orders");

  useEffect(() => {
    let active = true;
    apiRequest("/orders/mine")
      .then(res => {
        if (active && res.orders) setOrders(res.orders);
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const tabs = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = orders.filter(order => {
    if (activeTab === "All Orders") return true;
    if (activeTab === "Processing" && (order.status === "PENDING" || order.status === "PROCESSING")) return true;
    if (activeTab === "Shipped" && order.status === "SHIPPED") return true;
    if (activeTab === "Delivered" && order.status === "DELIVERED") return true;
    if (activeTab === "Cancelled" && order.status === "CANCELLED") return true;
    return false;
  });

  return (
    <div className="max-w-[800px] mx-auto min-h-[70vh]">
        
        {/* Header Breadcrumb equivalent */}
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <span>Account</span> <span className="text-gray-600">/</span> <span className="text-white">Orders</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Orders</h1>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-6 hide-scrollbar border-b border-white/5 mb-6">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 border-b-2 text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "border-[#8B5CF6] text-[#8B5CF6]" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const firstItem = order.items?.[0];
              const totalINR = order.items?.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0) || 0;
              const image = firstItem?.variant?.images?.[0]?.url || firstItem?.product?.images?.[0]?.url || (firstItem?.product?.images?.[0]?.storageKey ? `/media/products/${firstItem.product.images[0].storageKey}` : null) || "https://placehold.co/100x100/1a1a2e/8B5CF6?text=Image";
              const itemName = firstItem?.product?.name || "Order Item";
              const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              const statusDisplay = order.status === "PENDING" ? "Processing" : order.status.charAt(0) + order.status.slice(1).toLowerCase();

              return (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="block p-4 rounded-xl bg-[#0F0E17] border border-white/10 hover:border-[#8B5CF6]/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-bold text-sm">Order #{order.orderNumber || order.id.slice(0,8).toUpperCase()}</p>
                      <p className="text-gray-400 text-xs mt-1">{dateStr}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusDisplay === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                      statusDisplay === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      statusDisplay === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{statusDisplay}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={image} alt={itemName} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{itemName}</p>
                      <p className="text-sm text-gray-400">₹{totalINR.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8 text-sm">
            <button className="text-gray-400 hover:text-white px-3 py-1">&lt; Prev</button>
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white font-bold flex items-center justify-center">1</div>
            <button className="text-gray-400 hover:text-white px-3 py-1">Next &gt;</button>
          </div>
        )}
      </div>
  );
}
