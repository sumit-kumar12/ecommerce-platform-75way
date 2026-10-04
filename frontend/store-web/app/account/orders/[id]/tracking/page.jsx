"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStoreCategories } from "../../../../../lib/useStoreCategories";
import { apiRequest } from "../../../../../lib/api";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { categories } = useStoreCategories();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest(`/orders/${id}`)
      .then(res => {
        if (active && res.order) setOrder(res.order);
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
          Loading Tracking Info...
        </div>
    );
  }

  if (!order) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Tracking Not Found</h1>
            <Link href="/account/orders" className="text-[#8B5CF6] hover:underline">Back to Orders</Link>
          </div>
        </div>
    );
  }

  const statusLevels = {
    "PENDING_PAYMENT": 0,
    "PAID": 1,
    "PROCESSING": 2,
    "SHIPPED": 3,
    "DELIVERED": 4,
    "CANCELLED": -1,
    "REFUNDED": -1,
    "RETURNED": -1
  };
  const currentLevel = statusLevels[order.status] || 0;

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const updateDate = order.updatedAt ? new Date(order.updatedAt) : orderDate;
  
  // Estimate delivery 5 days after creation
  const estDelivery = new Date(orderDate);
  estDelivery.setDate(estDelivery.getDate() + 5);

  const carrier = order.shippingCarrier || "Courier";
  const trackingNum = order.trackingNumber || "Awaiting tracking info";
  const shippedDetails = currentLevel >= 3 ? `${formatDate(updateDate)} • ${formatTime(updateDate)}\n${carrier} - ${trackingNum}` : "Pending";

  const steps = [
    { title: "Order Placed", time: `${formatDate(orderDate)} • ${formatTime(orderDate)}`, completed: currentLevel >= 0 && currentLevel !== -1 },
    { title: "Confirmed / Paid", time: currentLevel >= 1 ? `${formatDate(order.paidAt || updateDate)}` : "Pending", completed: currentLevel >= 1 },
    { title: "Packed", time: currentLevel >= 2 ? `${formatDate(updateDate)}` : "Pending", completed: currentLevel >= 2 },
    { title: "Shipped", time: shippedDetails, completed: currentLevel >= 3 },
    { title: "Delivered", time: currentLevel >= 4 ? `${formatDate(updateDate)}` : "Pending", completed: currentLevel >= 4 }
  ];

  return (
      <div className="max-w-[600px] mx-auto min-h-[70vh]">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => router.push(`/account/orders/${order.id}`)} className="p-2 rounded-lg bg-[#0F0E17] border border-white/10 hover:bg-white/5 transition">
              <span className="material-symbols-outlined text-[20px] text-white">arrow_back</span>
            </button>
            <h1 className="text-xl font-semibold text-white">Tracking #{order.orderNumber || order.id.slice(0,8).toUpperCase()}</h1>
          </div>

          <div className="text-sm mb-6">
            <p className="text-gray-400">Estimated Delivery</p>
            <p className="text-green-400 font-medium text-base mt-1">
              {currentLevel === 4 ? "Delivered on" : "Delivered by"} {formatDate(currentLevel === 4 ? updateDate : estDelivery)}
            </p>
          </div>

          {/* Vertical Stepper exactly matching Snippet 3 */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-green-500' : 'bg-gray-700'} text-white`}>
                  {step.completed ? <span className="material-symbols-outlined text-[16px]">check</span> : ''}
                </div>
                <div className={`flex-1 pb-6 ${i !== steps.length - 1 ? 'border-l border-white/10 ml-4 -mt-2 pl-6' : 'ml-4 -mt-2 pl-6'}`}>
                  <p className={`font-medium ${step.completed ? 'text-white' : 'text-gray-400'}`}>{step.title}</p>
                  <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{step.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="pt-6 border-t border-white/10 mt-6 pb-6">
            <h2 className="text-white font-semibold mb-4">Delivery Address</h2>
            <div className="text-sm text-gray-400 leading-relaxed">
              <p className="text-white font-medium mb-1">{order.shippingAddress?.fullName || 'John Doe'}</p>
              <p>{order.shippingAddress?.line1 || '123, Cybercity, Sector 62'}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
              <p className="mt-2">{order.shippingAddress?.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          <button className="w-full bg-[#0F0E17] text-[#8B5CF6] border border-white/10 py-3 rounded-lg font-semibold hover:bg-white/5 transition">
            Need Help?
          </button>
        </div>
      </div>
  );
}
