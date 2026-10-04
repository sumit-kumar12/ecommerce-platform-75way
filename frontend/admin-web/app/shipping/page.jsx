"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../lib/api";

export default function ShippingPage() {
  const [settings, setSettings] = useState({ allowGlobalCOD: true, freeShippingThreshold: 0, maxCODPrice: 0 });
  const [configs, setConfigs] = useState([]);
  
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  
  const [savingSettings, setSavingSettings] = useState(false);
  const [message, setMessage] = useState("");

  const [editingConfig, setEditingConfig] = useState(null);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchConfigs();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiRequest("/shipping/settings");
      if (res.settings) {
        setSettings({
          allowGlobalCOD: res.settings.allowGlobalCOD,
          freeShippingThreshold: res.settings.freeShippingThreshold || 0,
          maxCODPrice: res.settings.maxCODPrice || 0
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchConfigs = async () => {
    try {
      const res = await apiRequest("/shipping/configs");
      setConfigs(res.configs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConfigs(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage("");
    try {
      await apiRequest("/shipping/settings", {
        method: "PUT",
        body: {
          allowGlobalCOD: settings.allowGlobalCOD,
          freeShippingThreshold: settings.freeShippingThreshold > 0 ? Number(settings.freeShippingThreshold) : null,
          maxCODPrice: settings.maxCODPrice > 0 ? Number(settings.maxCODPrice) : null
        }
      });
      setMessage("Settings saved successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to save settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      if (editingConfig.id) {
        await apiRequest(`/shipping/configs/${editingConfig.id}`, {
          method: "PUT",
          body: editingConfig
        });
      } else {
        await apiRequest("/shipping/configs", {
          method: "POST",
          body: editingConfig
        });
      }
      setEditingConfig(null);
      fetchConfigs();
    } catch (err) {
      alert("Failed to save shipping method: " + err.message);
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen bg-[#0F0E17]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Shipping &amp; COD Engine</h1>
        <p className="text-slate-400 mt-2">Manage global shipping rules, cash on delivery thresholds, and shipping methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Global Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400">settings</span>
              Global Settings
            </h2>
            
            {loadingSettings ? (
              <div className="text-center py-10 text-slate-400 animate-pulse">Loading settings...</div>
            ) : (
              <form onSubmit={handleSaveSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 p-5 rounded-lg border border-zinc-800 hover:border-indigo-500/30 transition-colors">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Free Shipping Threshold (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-8 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={settings.freeShippingThreshold} 
                        onChange={e => setSettings({...settings, freeShippingThreshold: e.target.value})} 
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Orders above this amount qualify for free standard shipping. Set to 0 to disable.</p>
                  </div>

                  <div className="bg-zinc-900/50 p-5 rounded-lg border border-zinc-800 hover:border-indigo-500/30 transition-colors">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Max COD Order Value (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-8 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={settings.maxCODPrice} 
                        onChange={e => setSettings({...settings, maxCODPrice: e.target.value})} 
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Any product or cart exceeding this amount will force Online Payment. Set to 0 to disable.</p>
                  </div>
                  
                  <div className="bg-zinc-900/50 p-5 rounded-lg border border-zinc-800 hover:border-indigo-500/30 transition-colors md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Allow Global COD</h3>
                        <p className="text-zinc-500 text-xs mt-1">If disabled, Cash on Delivery will be turned off for the entire store regardless of product settings.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={settings.allowGlobalCOD}
                          onChange={(e) => setSettings({...settings, allowGlobalCOD: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`mt-6 p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={savingSettings}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                  >
                    {savingSettings ? (
                       <><span className="material-symbols-outlined animate-spin mr-2 text-sm">sync</span> Saving...</>
                    ) : (
                       <><span className="material-symbols-outlined mr-2 text-sm">save</span> Save Settings</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Shipping Methods UI */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="material-symbols-outlined text-purple-400">local_shipping</span>
                 Shipping Methods
               </h2>
               <button 
                  onClick={() => setEditingConfig({ type: "", price: 0, estimatedDays: 3, isEnabled: true })}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 flex items-center gap-2"
               >
                 <span className="material-symbols-outlined text-[16px]">add</span> Add Method
               </button>
             </div>
             
             {loadingConfigs ? (
                <div className="text-center py-10 text-slate-400">Loading methods...</div>
             ) : configs.length === 0 ? (
                <div className="text-center py-8 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-700 text-zinc-500">
                   No shipping methods found. Add one to get started!
                </div>
             ) : (
               <div className="space-y-3">
                 {configs.map(config => (
                   <div key={config.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{config.type}</h3>
                          {!config.isEnabled && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Disabled</span>}
                        </div>
                        <p className="text-sm text-zinc-500 mt-1">₹{Number(config.price).toFixed(2)} &bull; {config.estimatedDays} days transit</p>
                      </div>
                      <button 
                        onClick={() => setEditingConfig({ ...config, price: Number(config.price) })}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
        
        {/* Helper Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
             <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-3">
               <span className="material-symbols-outlined text-[18px]">info</span> How this works
             </h3>
             <ul className="space-y-3 text-sm text-indigo-200/80">
               <li>&bull; When a customer places an order, the cheapest active <b>Shipping Method</b> is selected automatically.</li>
               <li>&bull; If their cart exceeds the <b>Free Shipping Threshold</b>, the shipping fee becomes ₹0.</li>
               <li>&bull; If their cart exceeds the <b>Max COD Order Value</b>, they are forced to pay online via Razorpay.</li>
             </ul>
          </div>
        </div>

      </div>

      {/* Edit Config Modal */}
      {editingConfig && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a192b] border border-zinc-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingConfig.id ? "Edit Shipping Method" : "Add Shipping Method"}
              </h2>
              
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Method Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard Delivery"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500"
                    value={editingConfig.type}
                    onChange={(e) => setEditingConfig({...editingConfig, type: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      required min="0" step="0.01"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500"
                      value={editingConfig.price}
                      onChange={(e) => setEditingConfig({...editingConfig, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Est. Transit Days</label>
                    <input
                      type="number"
                      required min="1"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500"
                      value={editingConfig.estimatedDays}
                      onChange={(e) => setEditingConfig({...editingConfig, estimatedDays: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-indigo-600 rounded bg-zinc-900 border-zinc-700" 
                      checked={editingConfig.isEnabled} 
                      onChange={(e) => setEditingConfig({...editingConfig, isEnabled: e.target.checked})} 
                    />
                    <span className="text-sm font-medium text-zinc-300">Method is Active</span>
                  </label>
                </div>
                
                <div className="flex gap-3 pt-6 mt-6 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingConfig(null)}
                    className="flex-1 px-4 py-2.5 bg-transparent border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {savingConfig ? "Saving..." : "Save Method"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
