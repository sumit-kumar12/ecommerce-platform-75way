"use client";

import React, { useState } from "react";

const initialTemplates = [
  { id: 1, name: "Order Confirmation", slug: "order-confirmation", status: "Active" },
  { id: 2, name: "Order Shipped", slug: "order-shipped", status: "Active" },
  { id: 3, name: "Password Reset", slug: "password-reset", status: "Active" },
  { id: 4, name: "Welcome Email", slug: "welcome-email", status: "Draft" },
  { id: 5, name: "Low Stock Alert", slug: "low-stock-alert", status: "Active" },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Notifications</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Email Templates</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Email Templates</h1>
          <p className="text-sm text-slate-400 mt-1">Manage email templates for notifications.</p>
        </div>
        <button className="px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors flex items-center gap-2 shadow-lg shadow-[#8C63F5]/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Template
        </button>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Template Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Slug</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="py-4 px-6 text-sm font-medium text-white">{template.name}</td>
                  <td className="py-4 px-6 text-sm text-slate-400 font-mono">{template.slug}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      template.status === "Active" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-slate-500/10 text-slate-400"
                    }`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-[#2d2c45]">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-[#2d2c45] flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{templates.length}</span> of <span className="font-medium text-white">{templates.length}</span> results</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white shadow-lg shadow-[#8C63F5]/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
