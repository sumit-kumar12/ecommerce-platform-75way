"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";

export default function PaymentRulesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState({
    onlineOnly: false,
    allowCOD: true,
    forceDigitalOnline: true,
    minCODPrice: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    apiRequest("/admin/payment-rules", { csrf: false })
      .then((res) => {
        if (res?.policy) {
          setRules({
            onlineOnly: res.policy.onlineOnly,
            allowCOD: res.policy.allowCOD,
            forceDigitalOnline: res.policy.forceDigitalOnline,
            minCODPrice: res.policy.minCODPrice || "",
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load payment rules:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await apiRequest("/admin/payment-rules", {
        method: "PUT",
        body: {
          onlineOnly: rules.onlineOnly,
          allowCOD: rules.allowCOD,
          forceDigitalOnline: rules.forceDigitalOnline,
          minCODPrice: rules.minCODPrice ? Number(rules.minCODPrice) : null,
        },
      });
      setMessage({ text: "Payment rules updated successfully.", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Failed to update payment rules.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17] flex items-center justify-center">
        <div className="text-zinc-500">Loading payment rules...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Global Payment Rules</h1>
          <p className="text-zinc-400 text-sm mt-1">Configure platform-wide payment and COD restrictions.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 space-y-8">
          
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-medium">Enable Cash on Delivery</h3>
              <p className="text-zinc-400 text-sm mt-1">Allow customers to choose Cash on Delivery at checkout.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={rules.allowCOD}
                onChange={(e) => setRules({...rules, allowCOD: e.target.checked})}
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C63F5]"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-medium">Force Online Only Mode</h3>
              <p className="text-zinc-400 text-sm mt-1">Strictly disable all offline payments regardless of product settings.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={rules.onlineOnly}
                onChange={(e) => setRules({...rules, onlineOnly: e.target.checked})}
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-medium">Force Digital Products Online</h3>
              <p className="text-zinc-400 text-sm mt-1">Always require online payment for digital/downloadable goods.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={rules.forceDigitalOnline}
                onChange={(e) => setRules({...rules, forceDigitalOnline: e.target.checked})}
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C63F5]"></div>
            </label>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <h3 className="text-white font-medium mb-4">Minimum COD Order Value</h3>
            <p className="text-zinc-400 text-sm mb-3">Cart total must exceed this amount for COD to be available. Leave empty for no limit.</p>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-sm text-white outline-none focus:border-[#8C63F5] transition-colors"
                value={rules.minCODPrice}
                onChange={(e) => setRules({...rules, minCODPrice: e.target.value})}
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving} 
            className="px-6 py-2.5 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving Changes..." : "Save Payment Rules"}
          </button>
        </div>
      </form>
    </div>
  );
}
