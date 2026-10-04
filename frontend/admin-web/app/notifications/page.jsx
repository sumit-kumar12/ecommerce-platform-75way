"use client";

import React, { useState } from "react";

const CHANNELS = ["Email", "SMS", "In-App"];

const SETTINGS_LIST = [
  { id: "order", title: "Order Updates", desc: "Receive emails for new orders and status changes", defaultOn: true },
  { id: "payout", title: "Payouts & Settlement", desc: "Receive payout and settlement notifications", defaultOn: true },
  { id: "stock", title: "Low Stock Alerts", desc: "Get notified when stock is running low", defaultOn: false },
  { id: "promos", title: "Promotions & Offers", desc: "Receive promotional emails and offers", defaultOn: true },
  { id: "security", title: "Account & Security", desc: "Important account and security updates", defaultOn: true, locked: true },
  { id: "reports", title: "Reports & Analytics", desc: "Receive reports and analytics summaries", defaultOn: false },
  { id: "system", title: "System Updates", desc: "Updates about new features and changes", defaultOn: true },
];

export default function Notifications() {
  const [activeChannel, setActiveChannel] = useState("Email");
  const [preferences, setPreferences] = useState(
    SETTINGS_LIST.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.defaultOn }), {})
  );

  const togglePref = (id, locked) => {
    if (locked) return;
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Notifications</h2>
          <p className="text-slate-400 mt-1 text-sm">Manage notification preferences</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        {/* Channel Tabs */}
        <div className="p-6 border-b border-zinc-800/60">
          <div className="inline-flex bg-[#1A1827] border border-zinc-800/80 rounded-xl p-1">
            {CHANNELS.map(channel => (
              <button
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeChannel === channel 
                    ? "bg-[#8C63F5] text-white shadow-md" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Settings List */}
        <div className="p-6">
          <h3 className="text-white font-medium mb-6">{activeChannel} Notifications</h3>
          <div className="space-y-6">
            {SETTINGS_LIST.map(setting => {
              const isOn = preferences[setting.id];
              return (
                <div key={setting.id} className="flex items-start justify-between gap-4 group">
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{setting.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{setting.desc}</p>
                  </div>
                  <button 
                    onClick={() => togglePref(setting.id, setting.locked)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      setting.locked ? 'opacity-50 cursor-not-allowed' : ''
                    } ${isOn ? 'bg-[#8C63F5]' : 'bg-zinc-700'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isOn ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-zinc-800/60">
          <button className="w-full bg-[#8C63F5] hover:bg-[#7b53de] text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-[#8C63F5]/20">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
