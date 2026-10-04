"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";

export default function ShippingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const payload = await apiRequest(`/admin/orders/${id}`);
        setOrder(payload.order || payload);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const payload = await apiRequest(`/admin/orders/${id}`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setOrder(payload.order || payload);
      router.push(`/orders/${id}`);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/orders" className="hover:text-slate-300 transition-colors">Orders</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href={`/orders/${id}`} className="hover:text-slate-300 transition-colors">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Shipping</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Shipping</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage shipping details and tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-medium">Shipping Details</h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {order.status === "DELIVERED" ? "Delivered" : "Shipped"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-zinc-500 mb-1">Courier Partner</p>
                <p className="text-zinc-200 font-medium">Delhivery</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1 flex items-center justify-between">
                  Tracking ID
                  <button className="text-[#8C63F5] text-xs hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                </p>
                <p className="text-zinc-200 font-medium tracking-wide">1234567890123</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">AWB Number</p>
                <p className="text-zinc-200 font-medium">AWB1234567890</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Shipped Date</p>
                <p className="text-zinc-200 font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Expected Delivery</p>
                <p className="text-zinc-200 font-medium">{new Date(Date.now() + 3 * 86400000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-6">Tracking Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#0F0E17] bg-[#8C63F5] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                  <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50">
                  <h4 className="text-sm font-medium text-white">Order Shipped</h4>
                  <p className="text-xs text-zinc-500 mt-1">{new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#0F0E17] bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50">
                  <h4 className="text-sm font-medium text-white">In Transit</h4>
                  <p className="text-xs text-zinc-500 mt-1">Package has left the facility.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#0F0E17] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${order.status === "DELIVERED" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"}`}>
                  <span className="material-symbols-outlined text-[14px]">home</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/50">
                  <h4 className="text-sm font-medium text-zinc-400">Delivered</h4>
                  <p className="text-xs text-zinc-600 mt-1">Expected {new Date(Date.now() + 3 * 86400000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              {order.status !== "DELIVERED" && (
                <button 
                  onClick={() => updateStatus("DELIVERED")}
                  disabled={updating}
                  className="px-6 py-2.5 bg-[#8C63F5] hover:bg-[#7b53de] text-white rounded-xl text-sm font-medium transition-colors w-full"
                >
                  {updating ? "Processing..." : "Track on Delivery (Simulate Delivered)"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4">Customer Details</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">
                {(order.customerName || "G")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{order.customerName || "Guest User"}</p>
                <p className="text-xs text-zinc-400">{order.customerEmail || "No email"}</p>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-zinc-300 mb-2">Delivery Address</h4>
            <div className="text-sm text-zinc-400 space-y-1 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
              <p className="text-zinc-200 font-medium">{order.shippingAddress?.name || order.customerName || "N/A"}</p>
              <p>{order.shippingAddress?.street || "No street provided"}</p>
              <p>{order.shippingAddress?.city || "City"}, {order.shippingAddress?.state || "State"} {order.shippingAddress?.zip || ""}</p>
              <p>{order.shippingAddress?.country || "India"}</p>
              {order.shippingAddress?.phone && <p className="pt-2 text-zinc-300">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
