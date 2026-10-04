"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCheckoutStore } from "../../lib/store/checkoutStore";
import { AddressManager } from "../../components/account/AddressManager";

export default function CheckoutShippingPage() {
  const router = useRouter();
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShippingAddress({
      fullName: addr.name || "",
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city || (addr.region && addr.region.includes("Mumbai") ? "Mumbai" : "Pune"),
      postalCode: addr.postalCode || (addr.region && addr.region.match(/\d+/) ? addr.region.match(/\d+/)[0] : "400000"),
      state: addr.region || "Maharashtra",
      phone: addr.phone || ""
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    router.push("/checkout/delivery");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ [name]: value });
  };

  return (
    <div className="bg-[#1A1A2E] border border-white/5 shadow-2xl rounded-3xl p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Saved Addresses</h2>
      <div className="mb-8 p-4 bg-[#0F0E17] border border-white/5 rounded-2xl max-h-[300px] overflow-y-auto custom-scrollbar">
        <AddressManager 
          onSelectAddress={handleSelectAddress}
          selectedAddressId={selectedAddressId}
        />
      </div>

      <h2 className="text-xl font-bold text-white mb-6 pt-6 border-t border-white/10">Shipping Details</h2>
      
      <form onSubmit={handleContinue} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={shippingAddress.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={shippingAddress.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 1</label>
          <input
            type="text"
            name="line1"
            required
            value={shippingAddress.line1}
            onChange={handleChange}
            placeholder="123, Cybercity, Sector 62"
            className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 2 (Optional)</label>
          <input
            type="text"
            name="line2"
            value={shippingAddress.line2}
            onChange={handleChange}
            placeholder="Near Infosys Building"
            className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
            <input
              type="text"
              name="city"
              required
              value={shippingAddress.city}
              onChange={handleChange}
              placeholder="Noida"
              className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
            <select
              name="state"
              required
              value={shippingAddress.state}
              onChange={handleChange}
              className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors appearance-none"
            >
              <option value="">Select State</option>
              {[
                "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
                "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
                "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
                "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
                "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
                "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
                "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
              ].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">PIN Code</label>
          <input
            type="text"
            name="postalCode"
            required
            value={shippingAddress.postalCode}
            onChange={handleChange}
            placeholder="201309"
            className="w-full bg-[#0F0E17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="saveAddr" className="w-5 h-5 rounded border-white/10 bg-[#0F0E17] text-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-offset-[#1A1A2E]" />
          <label htmlFor="saveAddr" className="text-sm text-gray-400">Save this address for future</label>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-4 rounded-xl transition-colors duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2"
          >
            Continue to Delivery
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
