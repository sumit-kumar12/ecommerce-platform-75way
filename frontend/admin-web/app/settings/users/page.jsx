"use client";

import React, { useState } from "react";

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@katabazaar.com", role: "Admin", status: "Active", lastActive: "2m ago" },
  { id: 2, name: "Sophia Lee", email: "sophia@katabazaar.com", role: "Manager", status: "Active", lastActive: "15m ago" },
  { id: 3, name: "Michael Scott", email: "michael@katabazaar.com", role: "Editor", status: "Inactive", lastActive: "2d ago" },
  { id: 4, name: "Emily Johnson", email: "emily@katabazaar.com", role: "Support", status: "Active", lastActive: "5m ago" },
  { id: 5, name: "Daniel Brown", email: "daniel@katabazaar.com", role: "Viewer", status: "Active", lastActive: "1h ago" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getAvatarColor = (name) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1200px] mx-auto bg-[#0F0E17] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Settings</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-sm text-slate-400 mt-1">Manage admin & staff users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add User
        </button>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2d2c45] flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#8C63F5] transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0F0E17] border border-[#2d2c45] text-slate-300 rounded-lg text-sm font-medium hover:bg-[#2d2c45] transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2d2c45] bg-[#0F0E17]">
                {["User", "Role", "Email", "Status", "Last Active", "Action"].map((h) => (
                  <th key={h} className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No users found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors hover:scale-[1.01] origin-left duration-200 animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${getAvatarColor(user.name)}`}>
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-white whitespace-nowrap">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-300">{user.role}</td>
                    <td className="py-4 px-6 text-sm text-slate-400">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          user.status === "Active"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-400 whitespace-nowrap">{user.lastActive}</td>
                    <td className="py-4 px-6">
                      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-[#2d2c45] rounded-md transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#2d2c45] flex items-center justify-between bg-[#1A1827]">
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-white">{filteredUsers.length}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8C63F5] text-white font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d2c45] text-slate-400 hover:bg-[#2d2c45] transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
