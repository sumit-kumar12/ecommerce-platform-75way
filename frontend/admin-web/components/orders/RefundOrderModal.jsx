"use client";

import React, { useState } from "react";
import { apiRequest } from "../../lib/api";

export function RefundOrderModal({ order, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const isCOD = order.paymentMethod === "COD";

  const handleRefund = async () => {
    if (!reason) {
      setError("Please provide a reason for the refund.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest(`/admin/orders/${order.id}/refund`, {
        method: "POST",
        body: { reason },
      });
      onSuccess(payload.order);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to process refund.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2d2c45]">
          <h2 className="text-xl font-bold text-white">Refund Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</h2>
          <p className="text-sm text-zinc-400 mt-1">
            {isCOD 
              ? "This order was Cash on Delivery. Refunding will mark it as returned and no payment gateway refund is needed." 
              : "This will initiate a refund via the payment gateway and mark the order as refunded."}
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">Refund Amount</label>
            <div className="px-4 py-2.5 bg-zinc-800/50 rounded-xl text-white font-medium border border-zinc-700">
              ₹{Number(order.totalAmount || 0).toLocaleString()} (Full Refund)
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer requested cancellation, Item out of stock"
              rows={3}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8C63F5] transition-colors resize-none"
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
            onClick={handleRefund}
            disabled={loading}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            Process Refund
          </button>
        </div>
      </div>
    </div>
  );
}
