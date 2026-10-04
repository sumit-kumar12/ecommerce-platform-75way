import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { formatCatalogPrice } from "../../lib/catalog";
import { CheckoutButton } from "./CheckoutButton";

export function PriceSummary({ cart, setCart }) {
  const [loading, setLoading] = useState(false);

  if (!cart || !cart.items || cart.items.length === 0) return null;

  // Calculate totals
  let totalMRP = 0;
  let totalDiscount = 0;
  
  cart.items.forEach(item => {
    const qty = item.quantity || 1;
    const price = item.price || 0;
    const compareAt = item.originalPrice || price;
    
    totalMRP += compareAt * qty;
    totalDiscount += (compareAt - price) * qty;
  });

  // Backend values (Paise to INR conversion)
  const delivery = (cart.shippingFeePaise || 0) / 100;
  const couponDiscount = (cart.couponDiscountPaise || 0) / 100;
  const grandTotal = totalMRP - totalDiscount - couponDiscount + delivery;
  const totalSavings = totalDiscount + couponDiscount;

  return (
    <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl p-6 sticky top-24">
      <h3 className="font-semibold text-lg text-white pb-4 border-b border-white/5">Price Details</h3>
      
      <div className="space-y-4 mt-4">
        <div className="flex justify-between text-sm text-gray-400">
           <span>Total MRP</span>  <span>{formatCatalogPrice(totalMRP)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-400">
             <span>Discount on MRP</span> <span>-{formatCatalogPrice(totalDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-green-400">
           <span>Delivery Charges</span> <span>{delivery > 0 ? formatCatalogPrice(delivery) : 'FREE'}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-400">
             <span>Coupon Discount</span> <span>-{formatCatalogPrice(couponDiscount)}</span>
          </div>
        )}
        
        <div className="pt-4 border-t border-white/5 flex justify-between font-bold text-lg text-white">
           <span>Grand Total</span> <span>{formatCatalogPrice(grandTotal)}</span>
        </div>
        
        {totalSavings > 0 && (
          <div className="text-xs text-green-400 text-center bg-green-400/10 py-2 rounded-lg font-medium">
             You will save {formatCatalogPrice(totalSavings)} on this order
          </div>
        )}
      </div>

      <div className="mt-6">
        <CheckoutButton cart={cart} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3.5 rounded-xl transition-colors duration-200" />
      </div>
      
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-500 font-medium">
         <span className="material-symbols-outlined text-[14px]">lock</span>
         Secure Checkout
      </div>
    </div>
  );
}
