"use client";

import React, { useState } from "react";

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState({
    email: true,
    push: false,
    orders: true,
    promotions: false,
    system: true,
  });

  const [saving, setSaving] = useState(false);

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const settings = [
    { id: "email", label: "Email Notifications", desc: "Receive updates via email" },
    { id: "push", label: "Push Notifications", desc: "Receive push notifications on your device" },
    { id: "orders", label: "Order Updates", desc: "Get notified for new orders & status changes" },
    { id: "promotions", label: "Promotions & Offers", desc: "Receive offers and promotional emails" },
    { id: "system", label: "System Alerts", desc: "Important system and security alerts" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="text-slate-300">Notifications</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-300">Preferences</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Notification Preferences</h1>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden p-6 md:p-8">
        <div className="space-y-6">
          {settings.map((setting, index) => (
            <React.Fragment key={setting.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{setting.label}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{setting.desc}</p>
                </div>
                
                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => togglePreference(setting.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    preferences[setting.id] ? "bg-[#8C63F5]" : "bg-[#2d2c45]"
                  }`}
                  role="switch"
                  aria-checked={preferences[setting.id]}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences[setting.id] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {index < settings.length - 1 && <hr className="border-[#2d2c45]" />}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#2d2c45] flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
