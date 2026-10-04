"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";
import { FulfillOrderModal } from "../../../components/orders/FulfillOrderModal";
import { RefundOrderModal } from "../../../components/orders/RefundOrderModal";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

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
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 max-w-[1200px] mx-auto text-center">
        <h2 className="text-2xl text-white">Order not found</h2>
        <button onClick={() => router.push("/orders")} className="mt-4 text-[#8C63F5]">Back to Orders</button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Delivered</span>;
      case "SHIPPED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Shipped</span>;
      case "PROCESSING": case "PACKED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#8C63F5]/10 text-[#8C63F5] border border-[#8C63F5]/20">Processing</span>;
      case "PENDING": case "PENDING_PAYMENT": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case "PAID": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Paid</span>;
      case "CANCELLED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Cancelled</span>;
      case "REFUNDED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">Refunded</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">{status}</span>;
    }
  };

  const timelineSteps = ["PENDING", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];
  const currentStepIndex = timelineSteps.indexOf(order.status) >= 0 ? timelineSteps.indexOf(order.status) : (["CANCELLED", "REFUNDED", "RETURNED"].includes(order.status) ? -1 : 0);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17] print:bg-white print:p-0 print:text-black">
      
      {/* Hide elements when printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; color: black !important; border: 1px solid #ddd; }
          .print\\:text-black { color: black !important; }
          .print\\:border-gray-200 { border-color: #eee !important; }
        }
      `}} />

      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 print:hidden">
        <Link href="/orders" className="hover:text-slate-300 transition-colors">Orders</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight print:text-black">
              Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
            </h1>
            <div className="print:hidden">
              {getStatusBadge(order.status)}
            </div>
            <div className="hidden print:block font-bold">
              Status: {order.status}
            </div>
          </div>
          <p className="text-zinc-400 text-sm mt-1 print:text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline - Hide when printing */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 print:hidden">
            <h3 className="text-white font-medium mb-6">Order Status</h3>
            {currentStepIndex >= 0 ? (
              <div className="flex items-center justify-between relative">
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
                      <span className={`text-xs font-medium ${isActive ? 'text-[#8C63F5]' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {step.charAt(0) + step.slice(1).toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-red-400 font-medium">
                This order is {order.status}.
              </div>
            )}
            
            <div className="mt-8 flex gap-3">
              {["PENDING", "PAID"].includes(order.status) && (
                <button 
                  onClick={() => updateStatus("PROCESSING")} 
                  disabled={updating}
                  className="px-4 py-2 bg-[#8C63F5] hover:bg-[#7b53de] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start Processing
                </button>
              )}
              {["PENDING", "PAID", "PROCESSING", "PACKED"].includes(order.status) && (
                <button 
                  onClick={() => setIsFulfillModalOpen(true)}
                  className="px-4 py-2 bg-[#1A1827] border border-[#2d2c45] text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Fulfill Order
                </button>
              )}
              {["SHIPPED"].includes(order.status) && (
                <button 
                  onClick={() => updateStatus("DELIVERED")} 
                  disabled={updating}
                  className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-sm font-medium transition-colors"
                >
                  Mark as Delivered
                </button>
              )}
              {!["CANCELLED", "REFUNDED"].includes(order.status) && (
                <button 
                  onClick={() => setIsRefundModalOpen(true)}
                  className="px-4 py-2 bg-[#1A1827] border border-[#2d2c45] text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors ml-auto"
                >
                  Refund / Return
                </button>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 print:bg-white print:border-gray-200">
            <h3 className="text-white font-medium mb-4 print:text-black">Order Items</h3>
            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-zinc-800/60 last:border-0 print:border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0 print:hidden">
                      {item.productImage || item.image || item.product?.image || item.product?.images?.[0] ? (
                        <img 
                          src={item.productImage || item.image || item.product?.image || item.product?.images?.[0]} 
                          alt={item.productName || item.product?.name || "Product"} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="material-symbols-outlined text-zinc-600">inventory_2</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white print:text-black">{item.productName || item.product?.name || "Unknown Product"}</p>
                      <p className="text-xs text-zinc-500 print:text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white print:text-black">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 print:text-gray-600">₹{Number(item.price).toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800/60 space-y-2 print:border-gray-200">
              <div className="flex justify-between text-sm text-zinc-400 print:text-gray-600">
                <span>Subtotal</span>
                <span className="text-white font-medium print:text-black">₹{Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400 print:text-gray-600">
                <span>Shipping</span>
                <span className="text-white font-medium print:text-black">₹0</span>
              </div>
              <div className="flex justify-between text-base text-zinc-200 font-semibold pt-2 border-t border-zinc-800/60 mt-2 print:border-gray-200 print:text-black">
                <span>Total</span>
                <span className="text-[#8C63F5] print:text-black">₹{Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 print:bg-white print:border-gray-200">
            <h3 className="text-white font-medium mb-4 print:text-black">Customer</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300 print:hidden">
                {(order.customerName || "G")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white print:text-black">{order.customerName || "Guest User"}</p>
                <p className="text-xs text-zinc-400 print:text-gray-600">{order.customerEmail || "No email"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 print:bg-white print:border-gray-200">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2 print:text-black">
              <span className="material-symbols-outlined text-[18px] print:hidden">local_shipping</span>
              Shipping Address
            </h3>
            <div className="text-sm text-zinc-400 space-y-1 print:text-black">
              <p className="text-zinc-200 font-medium print:text-black">{order.shippingAddress?.name || order.customerName || "N/A"}</p>
              <p>{order.shippingAddress?.street || "No street provided"}</p>
              <p>{order.shippingAddress?.city || "City"}, {order.shippingAddress?.state || "State"} {order.shippingAddress?.zip || ""}</p>
              <p>{order.shippingAddress?.country || "India"}</p>
              {order.shippingAddress?.phone && <p className="pt-2 text-zinc-300 print:text-black">Phone: {order.shippingAddress.phone}</p>}
            </div>
            {order.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-zinc-800/60 print:border-gray-200 text-sm text-zinc-400 print:text-black">
                <p className="text-zinc-200 font-medium print:text-black">Shipping Details</p>
                <p>Carrier: {order.shippingCarrier}</p>
                <p>Tracking: {order.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 print:bg-white print:border-gray-200">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2 print:text-black">
              <span className="material-symbols-outlined text-[18px] print:hidden">credit_card</span>
              Payment Method
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 print:text-black">{order.paymentMethod || "Cash on Delivery"}</span>
              <span className={`px-2 py-1 text-xs rounded font-medium print:border print:border-gray-300 print:text-black ${
                order.paymentStatus === 'REFUNDED' ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-800 text-zinc-200'
              }`}>
                {order.paymentStatus || "Pending"}
              </span>
            </div>
            
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-zinc-800/60 print:border-gray-200 text-sm text-zinc-400 print:text-black">
                <p className="text-zinc-200 font-medium print:text-black mb-1">Notes</p>
                <p className="whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <FulfillOrderModal 
        isOpen={isFulfillModalOpen} 
        onClose={() => setIsFulfillModalOpen(false)} 
        order={order} 
        onSuccess={setOrder} 
      />
      <RefundOrderModal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)} 
        order={order} 
        onSuccess={setOrder} 
      />
    </div>
  );
}
