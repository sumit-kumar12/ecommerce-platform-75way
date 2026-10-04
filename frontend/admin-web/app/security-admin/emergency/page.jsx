"use client";

import React, { useState } from 'react';
import { AlertTriangle, Lock, ShieldOff, Power, List, Activity, UserX, Database, Globe } from 'lucide-react';

export default function EmergencyControlsPage() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0E17] text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="text-red-500 w-8 h-8" />
              Emergency Controls
            </h1>
            <p className="text-gray-400 mt-2">Critical system security overrides and emergency actions.</p>
          </div>
        </div>

        {/* Emergency Mode Banner */}
        <div className={`p-6 rounded-xl border-2 flex items-center justify-between transition-colors ${emergencyMode ? 'bg-red-900/20 border-red-500' : 'bg-[#1A1827] border-gray-700'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${emergencyMode ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 text-gray-400'}`}>
              <ShieldOff className="w-8 h-8" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${emergencyMode ? 'text-red-500' : 'text-gray-300'}`}>
                Emergency Access Mode - {emergencyMode ? 'Active' : 'Disabled'}
              </h2>
              <p className="text-gray-400">Enabling this mode bypasses standard protocols and logs all actions securely.</p>
            </div>
          </div>
          <button 
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${emergencyMode ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
          >
            {emergencyMode ? 'Disable Mode' : 'Enable Mode'}
          </button>
        </div>

        {/* Primary Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Primary Emergency Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              title="Lock All Accounts" 
              description="Immediately force logout and lock all user and admin accounts across the platform."
              icon={<Lock className="w-6 h-6" />}
              color="red"
              disabled={!emergencyMode}
            />
            <ActionCard 
              title="Revoke All Sessions" 
              description="Invalidate all active session tokens. Users will need to re-authenticate."
              icon={<UserX className="w-6 h-6" />}
              color="red"
              disabled={!emergencyMode}
            />
            <ActionCard 
              title="Disable API Access" 
              description="Halt all incoming API requests. Internal services remain operational."
              icon={<Database className="w-6 h-6" />}
              color="red"
              disabled={!emergencyMode}
            />
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Secondary Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              title="IP Blocklist Mode" 
              description="Switch to strict IP filtering. Only whitelisted IPs will be allowed."
              icon={<Globe className="w-6 h-6" />}
              color="orange"
              disabled={!emergencyMode}
            />
            <ActionCard 
              title="Maintenance Mode" 
              description="Display maintenance page to all users. Prevent new interactions."
              icon={<Activity className="w-6 h-6" />}
              color="orange"
              disabled={!emergencyMode}
            />
            <ActionCard 
              title="System Shutdown" 
              description="Gracefully shutdown all non-essential microservices."
              icon={<Power className="w-6 h-6" />}
              color="red"
              disabled={!emergencyMode}
            />
          </div>
        </div>

        {/* Emergency Logs Table */}
        <div className="bg-[#1A1827] rounded-xl border border-gray-800 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <List className="w-5 h-5" />
              Emergency Logs
            </h3>
            <span className="text-sm text-gray-400">Last 24 Hours</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0F0E17] text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Initiated By</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {[
                  { time: '2026-06-20 18:45:12', action: 'Emergency Mode Enabled', user: 'admin@system.local', status: 'Success', ip: '192.168.1.45' },
                  { time: '2026-06-20 18:46:05', action: 'API Access Disabled', user: 'admin@system.local', status: 'Success', ip: '192.168.1.45' },
                  { time: '2026-06-20 18:50:22', action: 'API Access Enabled', user: 'admin@system.local', status: 'Success', ip: '192.168.1.45' },
                  { time: '2026-06-20 18:55:01', action: 'Emergency Mode Disabled', user: 'admin@system.local', status: 'Success', ip: '192.168.1.45' },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-medium text-gray-200">{log.action}</td>
                    <td className="px-6 py-4 text-gray-400">{log.user}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, color, disabled }) {
  const colorClasses = {
    red: disabled ? 'border-gray-800 text-gray-500 bg-[#1A1827]' : 'border-red-500/30 hover:border-red-500 bg-red-900/10 text-red-500 hover:bg-red-900/20',
    orange: disabled ? 'border-gray-800 text-gray-500 bg-[#1A1827]' : 'border-orange-500/30 hover:border-orange-500 bg-orange-900/10 text-orange-500 hover:bg-orange-900/20',
  };

  const buttonClasses = {
    red: disabled ? 'bg-gray-800 text-gray-600' : 'bg-red-600 hover:bg-red-700 text-white',
    orange: disabled ? 'bg-gray-800 text-gray-600' : 'bg-orange-500 hover:bg-orange-600 text-white',
  };

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${colorClasses[color]} flex flex-col justify-between h-full`}>
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gray-900/50">
            {icon}
          </div>
          <h4 className={`text-lg font-bold ${disabled ? 'text-gray-500' : 'text-gray-200'}`}>{title}</h4>
        </div>
        <p className={`text-sm mb-6 ${disabled ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
      </div>
      <button 
        disabled={disabled}
        className={`w-full py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${buttonClasses[color]}`}
      >
        {disabled ? 'Mode Disabled' : 'Execute Action'}
      </button>
    </div>
  );
}
