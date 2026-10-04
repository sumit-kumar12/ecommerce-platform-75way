"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";

export default function RefundProcessingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderAndReturn = async () => {
      try {
        const [orderPayload, returnsPayload] = await Promise.all([
          apiRequest(`/admin/orders/${id}`),
          apiRequest("/returns/admin")
        ]);
        setOrder(orderPayload.order || orderPayload);
        // Find if this order has a return
        const orderReturns = (returnsPayload.returns || []).filter(r => r.orderId === id);
        setReturns(orderReturns);
      } catch (err) {
        console.error("Failed to fetch order/return:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderAndReturn();
  }, [id]);

  const updateReturnStatus = async (returnId, newStatus) => {
    setUpdating(true);
    try {
      await apiRequest(`/returns/${returnId}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      // Refresh
      const returnsPayload = await apiRequest("/returns/admin");
      setReturns((returnsPayload.returns || []).filter(r => r.orderId === id));
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
  
  const returnReq = returns.length > 0 ? returns[0] : null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/returns" className="hover:text-slate-300 transition-colors">Returns</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href={`/orders/${id}`} className="hover:text-slate-300 transition-colors">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Refund</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Refund Processing</h1>
          <p className="text-zinc-400 text-sm mt-1">Review return details and process refunds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-medium">Return Request {returnReq ? `#${returnReq.id.slice(0, 8).toUpperCase()}` : "Not Requested"}</h3>
              {returnReq && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  returnReq.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  returnReq.status === "COMPLETED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  returnReq.status === "REJECTED" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {returnReq.status}
                </span>
              )}
            </div>

            {returnReq ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-zinc-500 mb-1">Order ID</p>
                    <p className="text-[#8C63F5] font-medium">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Request Date</p>
                    <p className="text-zinc-200 font-medium">{new Date(returnReq.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-500 mb-1">Reason</p>
                    <p className="text-zinc-200 font-medium">{returnReq.reason}</p>
                    {returnReq.description && <p className="text-zinc-400 mt-1">{returnReq.description}</p>}
                  </div>
                </div>
                
                <div className="border-t border-zinc-800/60 pt-6">
                  <h4 className="text-sm font-medium text-zinc-300 mb-4">Items to Return</h4>
                  <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-zinc-600">inventory_2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{returnReq.product?.name || "Unknown Product"}</p>
                        <p className="text-xs text-zinc-500">Qty: {returnReq.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white">₹{Number((returnReq.product?.price || 0) * (returnReq.quantity || 1)).toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  {returnReq.status === "PENDING" && (
                    <>
                      <button 
                        onClick={() => updateReturnStatus(returnReq.id, "REJECTED")}
                        disabled={updating}
                        className="px-6 py-2 bg-transparent border border-red-900/50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-900/20 transition-colors"
                      >
                        Reject Request
                      </button>
                      <button 
                        onClick={() => updateReturnStatus(returnReq.id, "APPROVED")}
                        disabled={updating}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve Return
                      </button>
                    </>
                  )}
                  {returnReq.status === "APPROVED" && (
                    <button 
                      onClick={() => updateReturnStatus(returnReq.id, "COMPLETED")}
                      disabled={updating}
                      className="px-6 py-2 bg-[#8C63F5] hover:bg-[#7b53de] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {updating ? "Processing..." : "Process Refund"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-sm">No return request found for this order.</p>
                <div className="mt-6 border-t border-zinc-800/60 pt-6 text-left">
                  <h4 className="text-sm font-medium text-zinc-300 mb-4">Refund Order Items Manually</h4>
                  <p className="text-xs text-zinc-500 mb-4">You can manually process a refund without a customer request.</p>
                  <button className="px-6 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53de] transition-colors">
                    Initiate Manual Refund
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-6">Refund Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#0F0E17] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${returnReq ? 'bg-[#8C63F5] text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">assignment_return</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50">
                  <h4 className={`text-sm font-medium ${returnReq ? 'text-white' : 'text-zinc-400'}`}>Refund Requested</h4>
                  {returnReq && <p className="text-xs text-zinc-500 mt-1">{new Date(returnReq.createdAt).toLocaleString()}</p>}
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#0F0E17] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${returnReq && ['APPROVED', 'COMPLETED'].includes(returnReq.status) ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">account_balance</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50">
                  <h4 className={`text-sm font-medium ${returnReq && ['APPROVED', 'COMPLETED'].includes(returnReq.status) ? 'text-white' : 'text-zinc-400'}`}>Payment Gateway</h4>
                  <p className="text-xs text-zinc-600 mt-1">Processing refund via Original Payment Method</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#0F0E17] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${returnReq?.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/50">
                  <h4 className={`text-sm font-medium ${returnReq?.status === 'COMPLETED' ? 'text-emerald-400' : 'text-zinc-400'}`}>Refund Completed</h4>
                  <p className="text-xs text-zinc-600 mt-1">{returnReq?.status === 'COMPLETED' ? new Date(returnReq.updatedAt).toLocaleString() : "Awaiting approval"}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
