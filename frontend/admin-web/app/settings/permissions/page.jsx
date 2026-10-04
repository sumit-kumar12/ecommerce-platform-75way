"use client";

import React, { useState } from "react";

const MODULES = ["Dashboard", "Products", "Orders", "Customers", "Marketing", "Reports", "Settings"];
const ACTIONS = ["View", "Create", "Edit", "Delete", "Export"];

// Mock initial permissions for "Manager"
const initialMatrix = {
  Dashboard: { View: true, Create: false, Edit: false, Delete: false, Export: true },
  Products: { View: true, Create: true, Edit: true, Delete: false, Export: true },
  Orders: { View: true, Create: true, Edit: true, Delete: false, Export: true },
  Customers: { View: true, Create: true, Edit: false, Delete: false, Export: true },
  Marketing: { View: true, Create: false, Edit: false, Delete: false, Export: false },
  Reports: { View: true, Create: true, Edit: true, Delete: false, Export: true },
  Settings: { View: true, Create: false, Edit: false, Delete: false, Export: false },
};

export default function PermissionMatrixPage() {
  const [role, setRole] = useState("Manager");
  const [matrix, setMatrix] = useState(initialMatrix);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const togglePermission = (module, action) => {
    setMatrix((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setIsSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Settings & Configurations</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Permission Matrix</h1>
          <p className="text-sm text-slate-400 mt-1">Visual permission matrix</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-300">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#1A1827] border border-[#2d2c45] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors appearance-none pr-10"
              >
                <option>Super Admin</option>
                <option>Manager</option>
                <option>Editor</option>
                <option>Support</option>
                <option>Viewer</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-lg min-w-[110px] justify-center ${
              isSaved
                ? "bg-green-500 text-white shadow-green-500/20 animate-pulse"
                : "bg-[#8C63F5] text-white hover:bg-[#7b53e4] shadow-[#8C63F5]/20 disabled:opacity-70"
            }`}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                Saving
              </>
            ) : isSaved ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check</span>
                Saved
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] group-hover:animate-bounce">save</span>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#0F0E17] z-10 shadow-sm border-b border-[#2d2c45]">
              <tr>
                <th className="py-4 px-6 text-sm font-bold text-slate-300">Module</th>
                {ACTIONS.map((action) => (
                  <th key={action} className="py-4 px-6 text-sm font-bold text-slate-300 text-center">
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {MODULES.map((module) => (
                <tr key={module} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-white">{module}</td>
                  {ACTIONS.map((action) => {
                    const isChecked = matrix[module]?.[action] || false;
                    return (
                      <td key={action} className="py-4 px-6 text-center">
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isChecked}
                            onChange={() => togglePermission(module, action)}
                          />
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-[#8C63F5] border-[#8C63F5] animate-scale-in"
                              : "bg-[#0F0E17] border border-[#2d2c45] group-hover:border-[#8C63F5]"
                          }`}>
                            {isChecked && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                          </div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
