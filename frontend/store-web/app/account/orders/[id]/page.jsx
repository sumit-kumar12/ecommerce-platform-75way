"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStoreCategories } from "../../../../lib/useStoreCategories";
import { apiRequest } from "../../../../lib/api";

export default function OrderDetailPage() {
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
          Loading Order...
        </div>
    );
  }

  if (!order) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
            <button onClick={() => router.push('/account/orders')} className="text-[#8B5CF6] hover:underline">
              Back to Orders
            </button>
          </div>
        </div>
    );
  }

  const statusDisplay = order.status === "PENDING" ? "Processing" : order.status.charAt(0) + order.status.slice(1).toLowerCase();
  const subtotal = order.items.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0);
  const shipping = 250; // Mock shipping cost
  const total = subtotal + shipping;

  const handleBuyAgain = async () => {
    try {
      setLoading(true);
      for (const item of order.items) {
        await apiRequest("/cart/items", { method: "POST", body: { variantId: item.variantId, quantity: item.quantity }, csrf: true });
      }
      router.push('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add items to cart.');
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    const invoiceText = `
========================================
             KATABAZAAR RETAIL
========================================
INVOICE FOR ORDER: ${order.orderNumber || order.id}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
Status: ${statusDisplay}
----------------------------------------
Items Purchased:
${order.items.map(item => `- ${item.product?.name || "Product"} (${item.variant?.title || "Default"}) x ${item.quantity}: ₹${(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}`).join("\n")}
----------------------------------------
Subtotal: ₹${subtotal.toLocaleString('en-IN')}
Shipping: ₹${shipping.toLocaleString('en-IN')}
Total: ₹${total.toLocaleString('en-IN')}
========================================
Thank you for shopping with us!
`;
    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order.orderNumber || order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="max-w-[600px] mx-auto min-h-[70vh]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/account/orders')} className="p-2 rounded-lg bg-[#0F0E17] border border-white/10 hover:bg-white/5 transition">
              <span className="material-symbols-outlined text-[20px] text-white">arrow_back</span>
            </button>
            <h1 className="text-xl font-semibold text-white">Order #{order.orderNumber || order.id.slice(0,8).toUpperCase()}</h1>
            <span className={`ml-auto text-sm ${
                statusDisplay === 'Delivered' ? 'text-green-400' :
                statusDisplay === 'Processing' ? 'text-yellow-400' :
                statusDisplay === 'Shipped' ? 'text-blue-400' :
                'text-red-400'
            }`}>{statusDisplay}</span>
          </div>

          <div className="text-sm text-gray-400 mb-6">
            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-white font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => {
                const image = item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url || (item.product?.images?.[0]?.storageKey ? `/media/products/${item.product.images[0].storageKey}` : null) || "https://placehold.co/100x100/1a1a2e/8B5CF6?text=Image";
                const itemTotal = (Number(item.unitPrice) * item.quantity);
                
                return (
                  <div key={item.id} className="flex gap-4">
                    <img src={image} alt={item.product?.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.product?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.variant?.name && `${item.variant.name} • `}Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">₹{itemTotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-white font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Item Total</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-white">₹{shipping.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Discount</span>
                <span className="text-green-400">- ₹0</span>
              </div>
              <div className="flex justify-between pt-4 mt-2 border-t border-white/10 font-bold">
                <span className="text-white">Total</span>
                <span className="text-white">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button onClick={handleDownloadInvoice} className="w-full mt-6 bg-[#1A1A2E] text-[#8B5CF6] border border-[#8B5CF6] py-3 rounded-lg font-semibold hover:bg-[#8B5CF6]/10 transition">
              Download Invoice
            </button>
          </div>

          {/* Payment Method */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">Payment Method</h2>
              <span className="text-gray-400 text-sm">{order.payments?.[0]?.paymentMethod || 'Online'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <span>UPI - PhonePe</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-6 border-t border-white/10 pb-6">
            <h2 className="text-white font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-400 leading-relaxed">
              <p className="text-white font-medium mb-1">{order.shippingAddress?.fullName || 'John Doe'}</p>
              <p>{order.shippingAddress?.line1 || '123, Cybercity, Sector 62'}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
              <p className="mt-2">{order.shippingAddress?.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleBuyAgain} className="bg-[#8B5CF6] text-white py-3 rounded-lg font-semibold hover:bg-[#7C3AED] transition">
              Buy Again
            </button>
            <Link href={`/account/orders/${order.id}/tracking`} className="bg-[#0F0E17] text-white py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/5 transition flex justify-center items-center">
              Track Order
            </Link>
          </div>
        </div>
      </div>
  );
}
