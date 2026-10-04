"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";

export default function SecuritySettingsPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/users/me/sessions")
      .then(res => {
        if (active && res.sessions) setSessions(res.sessions);
      })
      .catch(console.error)
      .finally(() => { if (active) setLoadingSessions(false); });
    return () => { active = false; };
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setUpdatingPassword(true);
    try {
      await apiRequest("/users/me/change-password", {
        method: "POST",
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        csrf: true
      });
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Failed to update password", err);
      setPasswordMessage({ type: "error", text: err.message || "Failed to update password" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await apiRequest(`/users/me/sessions/${sessionId}`, { method: "DELETE", csrf: true });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error("Failed to revoke session", err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto xl:mx-0">
      
      <div className="bg-[#121121] border border-[#2d2c45] rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2d2c45]">
          <h1 className="text-xl font-bold text-white">Security Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Secure your account</p>
        </div>

        <div className="p-6 space-y-10">
          
          {/* Change Password Section */}
          <section>
            <h2 className="text-lg font-bold text-white mb-5">Change Password</h2>
            
            {passwordMessage && (
              <div className={`p-3 rounded-xl mb-5 text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#1a192b] border border-[#2d2c45] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8C63F5] focus:ring-1 focus:ring-[#8C63F5] transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full mt-2 bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {updatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

          <hr className="border-[#2d2c45]" />

          {/* Login Activity */}
          <section>
            <h2 className="text-lg font-bold text-white mb-2">Login Activity</h2>
            <p className="text-sm text-slate-400 mb-5">Active sessions on your account.</p>

            {loadingSessions ? (
              <div className="flex justify-center p-4"><div className="w-6 h-6 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-[#1a192b] border border-[#2d2c45] rounded-xl flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2d2c45] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">
                          devices
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          IP: {session.ip}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">Last Active: {new Date(session.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.isCurrentSession && (
                        <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded">
                          This Device
                        </span>
                      )}
                      {!session.isCurrentSession && (
                        <button onClick={() => handleRevokeSession(session.id)} className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1 bg-red-400/10 rounded transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-sm text-slate-400">No active sessions found.</div>
                )}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
