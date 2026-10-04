"use client";

import React, { useState } from "react";

const initialAlerts = [
  { id: 1, type: "critical", title: "Scheduled Maintenance", message: "System will be down on May 28, 2026 from 02:00 AM to 04:00 AM.", active: true },
  { id: 2, type: "warning", title: "High Order Volume", message: "We are experiencing high order volume. Some delays possible.", active: true },
  { id: 3, type: "info", title: "New Feature Released", message: "Bulk import feature is now available for all merchants.", active: false },
];

export default function SystemAlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const getTypeStyles = (type) => {
    switch (type) {
      case "critical":
        return { wrapper: "bg-red-500/10 border-red-500/30", text: "text-red-500", dot: "bg-red-500" };
      case "warning":
        return { wrapper: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-500", dot: "bg-yellow-500" };
      case "info":
        return { wrapper: "bg-blue-500/10 border-blue-500/30", text: "text-blue-500", dot: "bg-blue-500" };
      default:
        return { wrapper: "bg-slate-500/10 border-slate-500/30", text: "text-slate-500", dot: "bg-slate-500" };
    }
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Notifications</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">System Alerts</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Alerts</h1>
          <p className="text-sm text-slate-400 mt-1">Create & manage global system alerts & announcements.</p>
        </div>
        <button className="px-4 py-2 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors flex items-center gap-2 shadow-lg shadow-[#8C63F5]/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Alert
        </button>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-[#1A1827] border border-[#2d2c45] rounded-xl flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-3 opacity-50">check_circle</span>
            <p>No active system alerts.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const styles = getTypeStyles(alert.type);
            return (
              <div 
                key={alert.id}
                className={`p-5 rounded-xl border ${styles.wrapper} relative animate-fade-in`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}>
                      {alert.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {alert.active && (
                      <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                      </span>
                    )}
                    <button 
                      onClick={() => removeAlert(alert.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-bold mb-1">{alert.title}</h3>
                <p className="text-sm text-slate-300">{alert.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
