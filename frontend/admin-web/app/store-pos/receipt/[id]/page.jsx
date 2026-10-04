"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "../../../../lib/api";

export default function POSReceipt() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiRequest(`/admin/orders/${id}`)
        .then(res => setOrder(res.order))
        .catch(err => {
          console.error("Failed to load receipt", err);
          alert("Could not load receipt data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-full text-white">Generating receipt...</div>;
  if (!order) return <div className="flex items-center justify-center h-full text-red-400">Order not found</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-full w-full justify-center p-6 bg-[#0F0E17] overflow-y-auto">
      
      <div className="w-full max-w-sm space-y-6">
        
        {/* Actions - hide on print */}
        <div className="flex gap-4 print:hidden">
          <button onClick={() => router.push("/store-pos/sale")} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition">
            New Sale
          </button>
          <button onClick={handlePrint} className="flex-1 py-3 bg-[#8C63F5] hover:bg-[#7b53de] text-white rounded-xl font-medium transition flex justify-center items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print
          </button>
        </div>

        {/* Receipt Paper */}
        <div className="bg-white text-black p-6 rounded-lg shadow-xl print:shadow-none print:m-0 print:p-0">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black uppercase tracking-widest">KATA STORE</h1>
            <p className="text-sm text-zinc-600 mt-1">123 Commerce Avenue, Tech Park</p>
            <p className="text-sm text-zinc-600">Mumbai, MH 400001</p>
            <p className="text-sm font-medium mt-3">GSTIN: 27AABCU9603R1Z</p>
          </div>

          <div className="border-t border-b border-dashed border-zinc-400 py-3 mb-6 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Receipt No:</span>
              <span className="font-mono font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Date:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Cashier:</span>
              <span>Store POS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Customer:</span>
              <span className="font-medium">{order.user ? order.user.name || order.user.phone : "Walk-in"}</span>
            </div>
          </div>

          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left pb-2 font-bold uppercase">Item</th>
                <th className="text-center pb-2 font-bold uppercase w-12">Qty</th>
                <th className="text-right pb-2 font-bold uppercase w-20">Amount</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 text-left pr-2 break-words text-xs">{item.product?.name || `Item #${item.variantId}`}</td>
                  <td className="py-2 text-center align-top">{item.quantity}</td>
                  <td className="py-2 text-right align-top">₹{Number(item.total).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-zinc-400 pt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Subtotal</span>
              <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            {/* Hardcoded taxes for receipt demo purposes */}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">CGST (9%)</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">SGST (9%)</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-black">
              <span>TOTAL</span>
              <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm mt-4">
              <span className="text-zinc-600">Payment Method</span>
              <span className="font-bold">{order.payment?.provider || "CASH"}</span>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <svg className="mx-auto w-3/4 h-12" xmlns="http://www.w3.org/2000/svg">
               {/* Dummy barcode lines for visual effect */}
               <rect x="10%" y="0" width="2%" height="100%" fill="#000" />
               <rect x="15%" y="0" width="5%" height="100%" fill="#000" />
               <rect x="25%" y="0" width="1%" height="100%" fill="#000" />
               <rect x="30%" y="0" width="4%" height="100%" fill="#000" />
               <rect x="38%" y="0" width="3%" height="100%" fill="#000" />
               <rect x="45%" y="0" width="1%" height="100%" fill="#000" />
               <rect x="50%" y="0" width="7%" height="100%" fill="#000" />
               <rect x="60%" y="0" width="2%" height="100%" fill="#000" />
               <rect x="65%" y="0" width="5%" height="100%" fill="#000" />
               <rect x="73%" y="0" width="1%" height="100%" fill="#000" />
               <rect x="78%" y="0" width="4%" height="100%" fill="#000" />
               <rect x="85%" y="0" width="5%" height="100%" fill="#000" />
            </svg>
            <p className="font-mono text-xs">{order.orderNumber}</p>
            
            <div className="mt-6 font-medium text-sm pt-4 border-t border-zinc-200">
               Thank you for shopping with us!
            </div>
            {!order.userId && (
              <div className="bg-zinc-100 p-3 rounded text-xs text-zinc-600 mt-4 border border-dashed border-zinc-300">
                ⭐ <b>Promo:</b> Register an account with us on katabazaar.com using your phone number to earn loyalty points on this purchase!
              </div>
            )}
            <p className="text-xs text-zinc-500 mt-2">No returns on electronic items without original packaging.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
