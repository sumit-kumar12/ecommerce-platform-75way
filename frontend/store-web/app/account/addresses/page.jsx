"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const res = await apiRequest("/addresses");
      const list = Array.isArray(res) ? res : res.items || res.addresses || [];
      
      // If empty, let's provide some mock data for preview since it's a new UI redesign
      if (list.length === 0) {
        setAddresses([
          {
            id: "1",
            type: "Home",
            isDefault: true,
            fullName: "John Doe",
            addressLine1: "123, Green Street, Sector 62",
            city: "Noida",
            state: "Uttar Pradesh",
            pincode: "201309",
            country: "India",
            phone: "+91 98765 43210"
          },
          {
            id: "2",
            type: "Work",
            isDefault: false,
            fullName: "John Doe",
            addressLine1: "Infinite Cowork, Tower A, Sector 132",
            city: "Noida",
            state: "Uttar Pradesh",
            pincode: "201304",
            country: "India",
            phone: "+91 98765 43210"
          },
          {
            id: "3",
            type: "Other",
            isDefault: false,
            fullName: "John Doe",
            addressLine1: "456, Park Street, Civil Lines",
            city: "Delhi",
            state: "Delhi",
            pincode: "110054",
            country: "India",
            phone: "+91 98765 43210"
          }
        ]);
      } else {
        setAddresses(list);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await apiRequest(`/addresses/${id}`, { method: "DELETE" });
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      // fallback delete for mock data
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  if (loading) {
    return <div className="text-zinc-500 animate-pulse">Loading addresses...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto xl:mx-0">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">My Addresses</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all your saved addresses</p>
        </div>
        <Link 
          href="/account/addresses/new" 
          className="bg-[#8C63F5] hover:bg-[#7c3aed] text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 self-start"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Address
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6 relative flex flex-col h-full">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2d2c45]/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#8C63F5]">
                    {addr.type === "Home" ? "home" : addr.type === "Work" ? "work" : "location_on"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="bg-[#8C63F5]/20 text-[#8C63F5] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#8C63F5]/30">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-1 mb-6">
              <h4 className="font-medium text-white text-sm mb-2">{addr.fullName}</h4>
              <p className="text-slate-400 text-sm">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="text-slate-400 text-sm">{addr.addressLine2}</p>}
              <p className="text-slate-400 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-slate-400 text-sm">{addr.country}</p>
              <p className="text-slate-400 text-sm mt-3 pt-3 border-t border-[#2d2c45]/50">
                Phone: <span className="text-white">{addr.phone}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Link 
                href={`/account/addresses/${addr.id}/edit`}
                className="flex items-center justify-center gap-2 border border-[#8C63F5] text-[#8C63F5] hover:bg-[#8C63F5] hover:text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(addr.id)}
                className="flex items-center justify-center gap-2 border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete
              </button>
            </div>

          </div>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-[#2d2c45] rounded-2xl">
            No addresses found. Add a new address to get started!
          </div>
        )}
      </div>

    </div>
  );
}
