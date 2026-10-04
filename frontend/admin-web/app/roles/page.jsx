"use client";

import React, { useState } from "react";

const ROLES = [
  { id: "super_admin", name: "Super Admin", users: 1, desc: "Full access to all features" },
  { id: "manager", name: "Manager", users: 3, desc: "Manage orders, products & finance" },
  { id: "editor", name: "Editor", users: 5, desc: "Manage products & content" },
  { id: "support", name: "Support", users: 2, desc: "View orders & customers" },
  { id: "viewer", name: "Viewer", users: 4, desc: "View reports & analytics" },
];

const MODULES = [
  { id: "dashboard", name: "Dashboard", actions: ["View Dashboard", "Export Reports"] },
  { id: "orders", name: "Orders", actions: ["View Orders", "Edit Orders", "Update Status", "Delete Orders"] },
  { id: "products", name: "Products", actions: ["View Products", "Add Products", "Edit Products", "Delete Products"] },
  { id: "finance", name: "Finance", actions: ["View Transactions", "Process Refunds", "Manage Payouts"] },
  { id: "users", name: "Users", actions: ["Manage Users", "Roles & Settings"] },
];

export default function RolesAndPermissions() {
  const [activeRole, setActiveRole] = useState("manager");

  const currentRole = ROLES.find(r => r.id === activeRole);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Roles & Permissions</h2>
          <p className="text-slate-400 mt-1 text-sm">Manage roles and access permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: Roles List */}
        <div className="lg:col-span-1 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col h-[calc(100vh-200px)]">
          <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/60">
            <h3 className="text-white font-medium">Roles</h3>
            <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">add</span> Add Role
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  activeRole === role.id 
                    ? 'bg-[#8C63F5]/10 border-[#8C63F5]/30' 
                    : 'bg-transparent border-transparent hover:bg-zinc-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${activeRole === role.id ? 'text-[#8C63F5]' : 'text-white'}`}>
                    {role.name}
                  </span>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {role.users} users
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{role.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Permissions Panel */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col h-[calc(100vh-200px)]">
          <div className="px-6 py-5 border-b border-zinc-800/60 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Permissions for <span className="text-[#8C63F5]">{currentRole?.name}</span></h3>
              <p className="text-xs text-slate-400 mt-1">Select the features this role can access.</p>
            </div>
            <button className="bg-[#8C63F5] hover:bg-[#7b53de] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-[#8C63F5]/20 disabled:opacity-50">
              Save Changes
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MODULES.map((module) => (
                <div key={module.id} className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{module.name}</h4>
                  <div className="space-y-3">
                    {module.actions.map((action, idx) => {
                      // Mocking checked state based on active role for visual demonstration
                      const isChecked = 
                        currentRole.id === 'super_admin' || 
                        (currentRole.id === 'manager' && (module.id !== 'users')) ||
                        (currentRole.id === 'editor' && (module.id === 'products' || action === 'View Dashboard')) ||
                        (currentRole.id === 'support' && (module.id === 'orders' && !action.includes('Delete'))) ||
                        (currentRole.id === 'viewer' && action.includes('View'));

                      return (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                            isChecked 
                              ? 'bg-[#8C63F5] border-[#8C63F5]' 
                              : 'bg-[#1A1827] border-zinc-600 group-hover:border-zinc-400'
                          }`}>
                            {isChecked && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                          </div>
                          <span className={`text-sm ${isChecked ? 'text-slate-200' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                            {action}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
