"use client";

import React, { useState } from "react";
import { apiRequest } from "../../lib/api";

export function FulfillOrderModal({ order, isOpen, onClose, onSuccess }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFulfill = async () => {
    if (!carrier || !trackingNumber) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest(`/admin/orders/${order.id}/fulfill`, {
        method: "POST",
        body: { shippingCarrier: carrier, trackingNumber },
      });
      onSuccess(payload.order);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fulfill order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2d2c45]">
          <h2 className="text-xl font-bold text-white">Fulfill Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</h2>
          <p className="text-sm text-zinc-400 mt-1">Provide shipping details to mark this order as shipped.</p>
        </div>
        
        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">Shipping Carrier</label>
            <input
              type="text"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g. FedEx, BlueDart, Delhivery"
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>
        </div>

        <div className="p-4 bg-zinc-900/40 border-t border-[#2d2c45] flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleFulfill}
            disabled={loading}
            className="px-5 py-2 bg-[#8C63F5] hover:bg-[#7b53de] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            Mark as Shipped
          </button>
        </div>
      </div>
    </div>
  );
}
