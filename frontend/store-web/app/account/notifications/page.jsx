"use client";

import React, { useState, useEffect } from "react";
import { useStoreCategories } from "../../../lib/useStoreCategories";
import { apiRequest } from "../../../lib/api";

export default function AccountNotificationsPage() {
  const { categories } = useStoreCategories();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    let active = true;
    apiRequest("/notifications")
      .then(res => {
        if (active && res.notifications) setNotifications(res.notifications);
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiRequest("/notifications/read-all", { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const tabs = ["All", "Orders", "Offers", "Updates", "Account"];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "All") return true;
    if (activeTab === "Orders" && n.type === "ORDER") return true;
    if (activeTab === "Offers" && n.type === "OFFER") return true;
    if (activeTab === "Updates" && n.type === "UPDATE") return true;
    if (activeTab === "Account" && n.type === "ACCOUNT") return true;
    return false;
  });

  return (
    <div className="max-w-[800px] mx-auto min-h-[70vh]">
        
        {/* Header Breadcrumb equivalent */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <span>Account</span> <span className="text-gray-600">/</span> <span className="text-white">Notifications</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Notifications
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-[#8B5CF6] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/account/notifications/preferences"
              className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Preferences
            </a>
            <button 
              onClick={handleMarkAllRead}
              className="text-[#8B5CF6] text-sm font-semibold hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-6 hide-scrollbar border-b border-white/5 mb-6">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 border-b-2 text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "border-[#8B5CF6] text-[#8B5CF6]" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No notifications found.</div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(n => {
              const dateStr = new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              const typeShort = n.type === "ORDER" ? "ord" : n.type === "OFFER" ? "off" : n.type === "UPDATE" ? "upd" : "acc";
              let icon = "notifications";
              if (typeShort === "ord") icon = "local_shipping";
              if (typeShort === "off") icon = "sell";
              if (typeShort === "upd") icon = "system_update_alt";
              if (typeShort === "acc") icon = "person";

              return (
                <div key={n.id} className={`flex gap-4 p-4 rounded-xl border ${n.isRead ? 'bg-[#0F0E17] border-white/10' : 'bg-[#1A1A2E] border-violet-500/50'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    typeShort === 'ord' ? 'bg-blue-500/20 text-blue-400' : 
                    typeShort === 'off' ? 'bg-pink-500/20 text-pink-400' : 
                    typeShort === 'upd' ? 'bg-green-500/20 text-green-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{n.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{dateStr}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}
