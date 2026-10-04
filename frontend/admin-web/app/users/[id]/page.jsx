"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest, getCurrentUser } from "../../../lib/api";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params.id) return;
      try {
        const [payload, userRes] = await Promise.all([
          apiRequest(`/admin/users/${params.id}`),
          getCurrentUser().then(res => res.json()).catch(() => null)
        ]);
        setUser(payload.user);
        if (userRes && userRes.user) setCurrentUser(userRes.user);
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleToggleActive = async () => {
    try {
      await apiRequest(`/admin/users/${user.id}/active`, {
        method: "PATCH",
        body: { isActive: !user.isActive }
      });
      setUser({ ...user, isActive: !user.isActive });
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  const handleRoleChange = async () => {
    const newRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    try {
      await apiRequest(`/admin/users/${user.id}/role`, {
        method: "PATCH",
        body: { role: newRole }
      });
      setUser({ ...user, role: newRole });
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-[32px] text-zinc-500 mb-4">refresh</span>
        <p className="text-zinc-400">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 justify-center items-center">
        <span className="material-symbols-outlined text-[48px] text-zinc-600 mb-4">error</span>
        <h2 className="text-xl font-bold mb-2 text-zinc-300">User Not Found</h2>
        <Link href="/users" className="text-[#8C63F5] hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800/60 bg-zinc-950">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-zinc-500 hover:text-zinc-300 p-2 bg-zinc-900 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {user.name}
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {user.isActive ? 'Active' : 'Banned'}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {user.role}
              </span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRoleChange}
            disabled={currentUser?.id === user.id}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={currentUser?.id === user.id ? "Cannot change own role" : ""}
          >
            <span className="material-symbols-outlined text-[18px]">
              {user.role === 'ADMIN' ? 'person_remove' : 'admin_panel_settings'}
            </span>
            {user.role === 'ADMIN' ? 'Demote to Customer' : 'Make Admin'}
          </button>
          <button 
            onClick={handleToggleActive}
            disabled={currentUser?.id === user.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${
              user.isActive 
                ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
            }`}
            title={currentUser?.id === user.id ? "Cannot deactivate yourself" : ""}
          >
            <span className="material-symbols-outlined text-[18px]">
              {user.isActive ? 'block' : 'check_circle'}
            </span>
            {user.isActive ? 'Deactivate User' : 'Activate User'}
          </button>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">User Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Total Orders</p>
                <p className="text-2xl font-semibold text-zinc-100">{user._count?.orders || 0}</p>
              </div>
              <hr className="border-zinc-800" />
              <div>
                <p className="text-xs text-zinc-500 mb-1">Security Events (Threats)</p>
                <p className="text-2xl font-semibold text-zinc-100">{user._count?.threatEvents || 0}</p>
              </div>
              <hr className="border-zinc-800" />
              <div>
                <p className="text-xs text-zinc-500 mb-1">Audit Logs</p>
                <p className="text-2xl font-semibold text-zinc-100">{user._count?.auditLogs || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="border-b border-zinc-800 px-6 py-4 bg-zinc-900/60">
              <h3 className="text-sm font-semibold text-zinc-200">Account Details</h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-xs font-medium text-zinc-500">User ID</dt>
                  <dd className="mt-1 text-sm text-zinc-300 font-mono break-all">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">Phone</dt>
                  <dd className="mt-1 text-sm text-zinc-300">{user.phone || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">Joined Date</dt>
                  <dd className="mt-1 text-sm text-zinc-300">{new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-zinc-300">{new Date(user.updatedAt).toLocaleDateString()} at {new Date(user.updatedAt).toLocaleTimeString()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">Failed Login Attempts</dt>
                  <dd className="mt-1 text-sm text-zinc-300">
                    <span className={user.failedLoginAttempts > 0 ? "text-yellow-400" : ""}>{user.failedLoginAttempts}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">Account Lock Status</dt>
                  <dd className="mt-1 text-sm text-zinc-300">
                    {user.lockedUntil && new Date(user.lockedUntil) > new Date() 
                      ? <span className="text-red-400 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock</span> Locked until {new Date(user.lockedUntil).toLocaleString()}</span>
                      : <span className="text-green-400 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock_open</span> Unlocked</span>
                    }
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
