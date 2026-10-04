"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

export default function AccountDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    user: { name: "Guest" },
    kpis: { orders: 0, wishlist: 0, addresses: 0, coupons: 0, katacoins: "0" },
    recentOrders: []
  });

  useEffect(() => {
    let active = true;
    const loadAccount = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          apiRequest("/users/me").catch(() => null),
          apiRequest("/orders/mine?limit=4").catch(() => null)
        ]);

        if (active) {
          const fetchedOrders = ordersRes?.orders || [];
          setData({
            user: { name: userRes?.user?.name || userRes?.user?.firstName || "Customer" },
            kpis: {
              orders: ordersRes?.pagination?.total || fetchedOrders.length || 0,
              wishlist: 0, // Placeholder
              addresses: 0, // Placeholder
              coupons: 0, // Placeholder
              katacoins: "0", // Placeholder
            },
            recentOrders: fetchedOrders.map(o => ({
              id: o.id,
              date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              amount: o.totalAmount || 0,
              status: o.status
            }))
          });
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    loadAccount();
    return () => { active = false; };
  }, []);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "delivered": return "text-[#4ade80] bg-[#4ade80]/10";
      case "shipped": return "text-[#60a5fa] bg-[#60a5fa]/10";
      case "processing": return "text-[#facc15] bg-[#facc15]/10";
      case "cancelled": return "text-[#f87171] bg-[#f87171]/10";
      default: return "text-zinc-400 bg-zinc-800";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#121121] to-[#1a192b] border border-[#2d2c45] rounded-2xl p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8C63F5]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-[#00DAFF]/10 rounded-full blur-3xl -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {data.user.name}! 👋</h1>
          <p className="text-slate-400 text-sm">Here's what's happening with your account today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-[#121121] border border-[#2d2c45] rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#8C63F5]/10 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[#8C63F5]">shopping_bag</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Orders</span>
          <span className="text-2xl font-bold text-white">{data.kpis.orders}</span>
        </div>

        <div className="bg-[#121121] border border-[#2d2c45] rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-rose-500">favorite</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Wishlist</span>
          <span className="text-2xl font-bold text-white">{data.kpis.wishlist}</span>
        </div>

        <div className="bg-[#121121] border border-[#2d2c45] rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-blue-500">location_on</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Addresses</span>
          <span className="text-2xl font-bold text-white">{data.kpis.addresses}</span>
        </div>

        <div className="bg-[#121121] border border-[#2d2c45] rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-emerald-500">local_offer</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Coupons</span>
          <span className="text-2xl font-bold text-white">{data.kpis.coupons}</span>
        </div>

        <div className="bg-[#121121] border border-[#2d2c45] rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-amber-500">monetization_on</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Katacoins</span>
          <span className="text-2xl font-bold text-white">{data.kpis.katacoins}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders & Top Categories */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Orders */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              <Link href="/account/orders" className="text-sm font-medium text-[#8C63F5] hover:text-[#7c3aed] transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {data.recentOrders.map(order => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#2d2c45] bg-[#1a192b]/50 hover:bg-[#1a192b] transition-colors">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 rounded-lg bg-[#2d2c45] flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Order {order.id}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                    <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                    <span className="text-sm font-bold text-white">₹{order.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Top Categories For You</h2>
              <Link href="/categories" className="text-sm font-medium text-[#8C63F5] hover:text-[#7c3aed] transition-colors">
                View All
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { name: "Electronics", icon: "devices", color: "text-blue-400", bg: "bg-blue-400/10" },
                { name: "Fashion", icon: "checkroom", color: "text-pink-400", bg: "bg-pink-400/10" },
                { name: "Home", icon: "chair", color: "text-amber-400", bg: "bg-amber-400/10" },
                { name: "Beauty", icon: "face", color: "text-rose-400", bg: "bg-rose-400/10" },
                { name: "Sports", icon: "sports_basketball", color: "text-orange-400", bg: "bg-orange-400/10" }
              ].map(cat => (
                <Link key={cat.name} href={`/categories/${cat.name.toLowerCase()}`} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 rounded-full ${cat.bg} border border-[#2d2c45] group-hover:border-[#8C63F5] flex items-center justify-center transition-colors`}>
                    <span className={`material-symbols-outlined ${cat.color}`}>{cat.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Banners Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#8C63F5] to-[#4c1d95] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider inline-block mb-3 border border-white/10">
                Exclusive Deals
              </span>
              <h3 className="text-xl font-bold text-white leading-tight">Up to 70% Off!</h3>
              <p className="text-white/80 text-sm mt-1">On electronics & gadgets</p>
            </div>
            <Link href="/products" className="bg-white text-[#4c1d95] text-sm font-bold py-2 px-4 rounded-lg self-start relative z-10 hover:bg-slate-100 transition-colors inline-block text-center">
              Shop Now
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#121121] to-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[200px]">
             <div className="relative z-10">
              <span className="px-2.5 py-1 rounded-md bg-[#00DAFF]/10 text-[#00DAFF] text-[11px] font-bold uppercase tracking-wider inline-block mb-3 border border-[#00DAFF]/20">
                Become a Seller
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">Start selling with Katabazaar</h3>
            </div>
            <Link href="http://localhost:3001/login" className="bg-[#8C63F5] text-white text-sm font-bold py-2 px-4 rounded-lg self-start relative z-10 hover:bg-[#7c3aed] transition-colors inline-block text-center">
              Apply Now
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
