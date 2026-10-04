"use client";

import React, { useState } from "react";

export default function ToastShowcasePage() {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message, exiting: false }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => 
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250); // Matches the exit animation duration
  };

  const getToastStyles = (type) => {
    switch (type) {
      case "success": return { icon: "check_circle", color: "text-green-500" };
      case "info": return { icon: "info", color: "text-blue-500" };
      case "warning": return { icon: "warning", color: "text-yellow-500" };
      case "error": return { icon: "error", color: "text-red-500" };
      default: return { icon: "notifications", color: "text-slate-500" };
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="text-slate-300">Notifications</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-300">In-App Toasts</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Toast Notifications</h1>
        <p className="text-sm text-slate-400 mt-1">Test real-time in-app toast notifications.</p>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-2xl overflow-hidden p-6 md:p-8">
        <h2 className="text-lg font-bold text-white mb-6">Trigger Test Toasts</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => showToast("success", "Success", "Order #ORD-1256 has been updated successfully.")}
            className="p-4 rounded-xl border border-[#2d2c45] hover:border-green-500 bg-[#0F0E17] hover:bg-green-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <span className="font-bold text-white">Success Toast</span>
            </div>
            <p className="text-xs text-slate-400">Trigger a success message</p>
          </button>

          <button 
            onClick={() => showToast("info", "Info", "Data imported successfully.")}
            className="p-4 rounded-xl border border-[#2d2c45] hover:border-blue-500 bg-[#0F0E17] hover:bg-blue-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-blue-500">info</span>
              <span className="font-bold text-white">Info Toast</span>
            </div>
            <p className="text-xs text-slate-400">Trigger an informational message</p>
          </button>

          <button 
            onClick={() => showToast("warning", "Warning", "Low stock for 5 products.")}
            className="p-4 rounded-xl border border-[#2d2c45] hover:border-yellow-500 bg-[#0F0E17] hover:bg-yellow-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-yellow-500">warning</span>
              <span className="font-bold text-white">Warning Toast</span>
            </div>
            <p className="text-xs text-slate-400">Trigger a warning message</p>
          </button>

          <button 
            onClick={() => showToast("error", "Error", "Failed to update product. Please try again.")}
            className="p-4 rounded-xl border border-[#2d2c45] hover:border-red-500 bg-[#0F0E17] hover:bg-red-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-red-500">error</span>
              <span className="font-bold text-white">Error Toast</span>
            </div>
            <p className="text-xs text-slate-400">Trigger an error message</p>
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Static Preview</h3>
          <div className="space-y-4 max-w-sm">
            {/* Static Previews matching Mockup perfectly */}
            {["success", "info", "warning", "error"].map(type => {
              const styles = getToastStyles(type);
              return (
                <div key={type} className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 flex items-start gap-3 w-full">
                  <span className={`material-symbols-outlined ${styles.color}`}>{styles.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 capitalize">{type}</h4>
                    <p className="text-sm text-slate-600 mt-0.5">Static preview message for {type}.</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actual Live Toast Container */}
      <div className="fixed z-50 top-4 right-4 flex flex-col gap-3 w-80 pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div 
              key={toast.id} 
              className={`bg-white rounded-lg shadow-xl border border-slate-200 p-4 flex items-start gap-3 w-full pointer-events-auto ${toast.exiting ? "animate-slide-out-right" : "animate-slide-in-right"}`}
            >
              <span className={`material-symbols-outlined ${styles.color}`}>{styles.icon}</span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">{toast.title}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{toast.message}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
