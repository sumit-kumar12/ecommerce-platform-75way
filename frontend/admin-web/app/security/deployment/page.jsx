"use client";

import React, { useState } from "react";

export default function SystemDeploymentControlPage() {
  const [activeState, setActiveState] = useState("normal");

  const states = [
    { id: "normal", name: "Normal Operation", desc: "System running smoothly. No forced errors.", icon: "check_circle", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { id: "maintenance", name: "Maintenance Mode (500)", desc: "Force the 500 Server Error page on the storefront.", icon: "build", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { id: "offline", name: "Simulate Offline (Network)", desc: "Force the Network Error offline page.", icon: "wifi_off", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { id: "locked", name: "Global Account Lock", desc: "Force the Account Locked state for testing.", icon: "lock", color: "text-[#8C63F5]", bg: "bg-[#8C63F5]/10", border: "border-[#8C63F5]/20" },
    { id: "expired", name: "Force Session Expiry", desc: "Force the Session Expired state for testing.", icon: "hourglass_empty", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" }
  ];

  const handleDeploy = (id) => {
    setActiveState(id);
    // In a real application, this would make an API call to update the global system state in Redis/DB
    console.log(`Deployed system state: ${id}`);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="text-slate-300">Security</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-300">System States</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Deployment Controls</h1>
        <p className="text-slate-400 mt-1 text-sm">Manually deploy error pages and system states to the storefront.</p>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden p-6">
        <h2 className="text-lg font-bold text-white mb-6">Select State to Deploy</h2>
        
        <div className="space-y-4">
          {states.map((state) => (
            <div 
              key={state.id} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                activeState === state.id 
                  ? `${state.bg} ${state.border}` 
                  : "bg-[#0F0E17] border-[#2d2c45] hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${activeState === state.id ? state.bg : "bg-[#1A1827]"} ${state.color}`}>
                  <span className="material-symbols-outlined">{state.icon}</span>
                </div>
                <div>
                  <h3 className={`font-bold ${activeState === state.id ? "text-white" : "text-slate-200"}`}>{state.name}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{state.desc}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleDeploy(state.id)}
                disabled={activeState === state.id}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeState === state.id
                    ? "bg-[#2d2c45] text-slate-400 cursor-not-allowed"
                    : "bg-[#8C63F5] text-white hover:bg-[#7b53e4] shadow-lg shadow-[#8C63F5]/20"
                }`}
              >
                {activeState === state.id ? "Currently Active" : "Deploy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
