"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCheckoutStore } from "../../../lib/store/checkoutStore";

export default function CheckoutDeliveryPage() {
  const router = useRouter();
  const { deliveryDate, deliveryTimeSlot, shippingMethod, setDeliveryOptions } = useCheckoutStore();

  const handleContinue = (e) => {
    e.preventDefault();
    router.push("/checkout/payment");
  };

  const dates = [
    { day: "Mon", date: "27", month: "May", full: "2024-05-27" },
    { day: "Tue", date: "28", month: "May", full: "2024-05-28" },
    { day: "Wed", date: "29", month: "May", full: "2024-05-29" },
    { day: "Thu", date: "30", month: "May", full: "2024-05-30" },
    { day: "Fri", date: "31", month: "May", full: "2024-05-31" },
  ];

  const timeSlots = [
    { id: "morning", label: "Morning (9 AM - 12 PM)" },
    { id: "afternoon", label: "Afternoon (12 PM - 4 PM)" },
    { id: "evening", label: "Evening (4 PM - 8 PM)" },
    { id: "night", label: "Night (8 PM - 10 PM)" },
  ];

  const methods = [
    { id: "standard", label: "Standard Shipping", time: "4-5 Days", price: "FREE" },
    { id: "express", label: "Express Shipping", time: "1-2 Days", price: "₹99" },
    { id: "sameday", label: "Same Day Delivery", time: "Within 24 Hours", price: "₹149" },
  ];

  // Set defaults if empty
  useEffect(() => {
    if (!deliveryDate && dates.length > 0) {
      setDeliveryOptions({ deliveryDate: dates[1].full });
    }
    if (!deliveryTimeSlot) {
      setDeliveryOptions({ deliveryTimeSlot: "afternoon" });
    }
  }, [deliveryDate, deliveryTimeSlot, dates, setDeliveryOptions]);

  return (
    <div className="bg-[#1A1A2E] border border-white/5 shadow-2xl rounded-3xl p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Delivery Options</h2>
      
      <form onSubmit={handleContinue} className="space-y-8">
        
        {/* Date Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Select Date</label>
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {dates.map((d) => {
              const isSelected = deliveryDate === d.full;
              return (
                <button
                  key={d.full}
                  type="button"
                  onClick={() => setDeliveryOptions({ deliveryDate: d.full })}
                  className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl border transition-colors ${
                    isSelected 
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                      : "bg-[#0F0E17] border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  <span className="text-xs">{d.day}</span>
                  <span className="text-xl font-bold my-1">{d.date}</span>
                  <span className="text-xs">{d.month}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Select Time Slot</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = deliveryTimeSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setDeliveryOptions({ deliveryTimeSlot: slot.id })}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-colors text-left ${
                    isSelected 
                      ? "bg-[#8B5CF6]/10 border-[#8B5CF6] text-white" 
                      : "bg-[#0F0E17] border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#8B5CF6]' : 'border-gray-600'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-full"></div>}
                  </div>
                  <span className="text-sm font-medium">{slot.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shipping Methods */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 pt-4 border-t border-white/10">Shipping Methods</h2>
          <div className="space-y-3">
            {methods.map((method) => {
              const isSelected = shippingMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setDeliveryOptions({ shippingMethod: method.id })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${
                    isSelected 
                      ? "bg-[#8B5CF6]/10 border-[#8B5CF6] text-white" 
                      : "bg-[#0F0E17] border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#8B5CF6]' : 'border-gray-600'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-full"></div>}
                    </div>
                    <div>
                      <div className="font-semibold">{method.label}</div>
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>{method.time}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${method.price === 'FREE' ? 'text-green-400' : 'text-white'}`}>
                    {method.price}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="w-1/3 bg-[#0F0E17] border border-white/10 hover:bg-white/5 text-white font-semibold py-4 rounded-xl transition-colors duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-2/3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-4 rounded-xl transition-colors duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2"
          >
            Continue to Payment
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
