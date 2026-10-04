"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";

export default function FulfillmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");

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

  const timelineSteps = ["PENDING", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];
  const currentStepIndex = timelineSteps.indexOf(order.status) >= 0 ? timelineSteps.indexOf(order.status) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/orders" className="hover:text-slate-300 transition-colors">Orders</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href={`/orders/${id}`} className="hover:text-slate-300 transition-colors">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Fulfill</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fulfill Order</h1>
          <p className="text-zinc-400 text-sm mt-1">Process and pack items for shipping</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="text-white font-medium mb-6">Fulfillment Status</h3>
        
        <div className="flex items-center justify-between relative max-w-2xl mx-auto mb-8 mt-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#8C63F5] rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
          ></div>
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#0F0E17] ${isCompleted ? 'bg-[#8C63F5]' : 'bg-zinc-800'}`}>
                  {isCompleted && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                </div>
                <span className={`text-xs font-medium absolute -bottom-6 ${isActive ? 'text-[#8C63F5]' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {step.charAt(0) + step.slice(1).toLowerCase()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-12 space-y-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-3">Items to Fulfill</h4>
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden divide-y divide-zinc-800/60">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-600">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.productName || item.product?.name || "Unknown Product"}</p>
                    <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-300 font-medium">Verify Qty: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">Add Order Note (Visible to customer)</h4>
          <textarea
            className="w-full bg-zinc-950 border border-zinc-800/60 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#8C63F5] transition-colors resize-none"
            rows="3"
            placeholder="Thank you for your order! We are preparing it for shipping..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-zinc-800/60">
          <button 
            onClick={() => router.push(`/orders/${id}`)}
            className="px-4 py-2 bg-transparent border border-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          
          {["PENDING", "PROCESSING"].includes(order.status) && (
            <button 
              onClick={() => updateStatus("PACKED")} 
              disabled={updating}
              className="px-6 py-2 bg-[#8C63F5] hover:bg-[#7b53de] text-white rounded-lg text-sm font-medium transition-colors"
            >
              {updating ? "Processing..." : "Mark as Packed"}
            </button>
          )}
          
          {order.status === "PACKED" && (
            <button 
              onClick={() => updateStatus("SHIPPED")} 
              disabled={updating}
              className="px-6 py-2 bg-[#8C63F5] hover:bg-[#7b53de] text-white rounded-lg text-sm font-medium transition-colors"
            >
              {updating ? "Processing..." : "Mark as Shipped"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
