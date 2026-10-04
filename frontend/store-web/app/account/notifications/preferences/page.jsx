"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../../lib/api";

const CHANNELS = [
  { id: "EMAIL", label: "Email", icon: "email", desc: "Get updates in your inbox" },
  { id: "WHATSAPP", label: "WhatsApp", icon: "chat", desc: "Instant WhatsApp notifications" },
];

const CATEGORIES = [
  { id: "ORDER", label: "Order Updates", icon: "local_shipping", desc: "Shipping, delivery, and order status" },
  { id: "OFFER", label: "Offers & Deals", icon: "sell", desc: "Exclusive coupons and flash deals" },
  { id: "ACCOUNT", label: "Account Alerts", icon: "person", desc: "Security, login, and profile changes" },
  { id: "MARKETING", label: "Marketing", icon: "campaign", desc: "Newsletters and product launches" },
];

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // key of what's being saved
  const [savedKey, setSavedKey] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/notifications/preferences")
      .then(res => { if (active && res.preferences) setPrefs(res.preferences); })
      .catch(() => { if (active) setError("Failed to load notification preferences."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const isEnabled = (channel, category) => prefs?.[channel]?.[category] ?? true;

  const toggle = async (channel, category) => {
    const key = `${channel}|${category}`;
    const newVal = !isEnabled(channel, category);

    // Optimistic UI update
    setPrefs(prev => ({
      ...prev,
      [channel]: { ...(prev[channel] || {}), [category]: newVal },
    }));

    setSaving(key);
    try {
      await apiRequest("/notifications/preferences", {
        method: "PATCH",
        body: { channel, eventCategory: category, enabled: newVal },
      });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 1500);
    } catch {
      // Rollback on failure
      setPrefs(prev => ({
        ...prev,
        [channel]: { ...(prev[channel] || {}), [category]: !newVal },
      }));
      alert("Failed to save preference. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto min-h-[70vh]">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <span>Account</span>
          <span className="text-gray-600">/</span>
          <span className="text-white">Notification Preferences</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Notification Preferences</h1>
        <p className="text-gray-400 text-sm mt-2">Control exactly what you hear about and how.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading preferences…</div>
      ) : (
        <div className="space-y-4">
          {/* Grid header */}
          <div className="hidden md:grid grid-cols-[1fr_repeat(2,_80px)] gap-4 px-5 pb-2 border-b border-white/5">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Category</span>
            {CHANNELS.map(c => (
              <span key={c.id} className="text-xs text-gray-500 uppercase tracking-wider text-center">{c.label}</span>
            ))}
          </div>

          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 grid grid-cols-1 md:grid-cols-[1fr_repeat(2,_80px)] gap-4 items-center hover:border-white/[0.12] transition-colors"
            >
              {/* Category info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-[#8B5CF6]">{cat.icon}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{cat.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{cat.desc}</p>
                </div>
              </div>

              {/* Toggle per channel */}
              {CHANNELS.map(ch => {
                const key = `${ch.id}|${cat.id}`;
                const enabled = isEnabled(ch.id, cat.id);
                const isSaving = saving === key;
                const justSaved = savedKey === key;

                return (
                  <div key={ch.id} className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-2">
                    {/* Mobile label */}
                    <span className="md:hidden text-xs text-gray-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">{ch.icon}</span>
                      {ch.label}
                    </span>

                    <button
                      onClick={() => toggle(ch.id, cat.id)}
                      disabled={isSaving}
                      aria-label={`${enabled ? "Disable" : "Enable"} ${cat.label} via ${ch.label}`}
                      style={{
                        width: "44px",
                        height: "24px",
                        borderRadius: "99px",
                        border: "none",
                        cursor: isSaving ? "wait" : "pointer",
                        background: enabled
                          ? justSaved ? "#10b981" : "#8B5CF6"
                          : "rgba(255,255,255,0.1)",
                        transition: "background 0.2s",
                        position: "relative",
                        flexShrink: 0,
                        opacity: isSaving ? 0.6 : 1,
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "3px",
                        left: enabled ? "22px" : "3px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Info footer */}
          <div className="mt-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-gray-500 mt-0.5 flex-shrink-0">info</span>
            <p className="text-gray-500 text-sm leading-relaxed">
              Changes are saved instantly. Transactional notifications (e.g. order confirmations, password resets)
              cannot be disabled and will always be sent for your security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
