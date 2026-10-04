"use client";
import { useEffect } from "react";
import Link from "next/link";

export function NotificationDrawer({ open, onClose, notifications, notificationLoading, unreadIds, onMarkRead, onMarkAllRead, onRefresh }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const ICON_MAP = {
    shopping_bag: "shopping_bag",
    favorite: "favorite",
    local_shipping: "local_shipping",
    bolt: "bolt",
    notifications: "notifications",
  };

  const iconColors = {
    shopping_bag: "text-[#8C63F5] bg-[#8C63F5]/10",
    favorite: "text-rose-400 bg-rose-400/10",
    local_shipping: "text-sky-400 bg-sky-400/10",
    bolt: "text-amber-400 bg-amber-400/10",
    notifications: "text-slate-400 bg-slate-400/10",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] z-[999] bg-[#121121] border-l border-[#2d2c45] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Notifications"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d2c45] flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-lg">Notifications</h2>
            {unreadIds.length > 0 && (
              <p className="text-[#8C63F5] text-xs font-bold">{unreadIds.length} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadIds.length > 0 && (
              <button onClick={onMarkAllRead} className="text-xs text-slate-400 hover:text-white font-bold transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                Mark all read
              </button>
            )}
            <button onClick={onRefresh} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close notifications">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-3">
          {notificationLoading ? (
            <div className="space-y-3 px-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">notifications_none</span>
              <p className="text-white font-bold">No notifications yet</p>
              <p className="text-slate-500 text-sm mt-1">We'll let you know when something arrives.</p>
            </div>
          ) : (
            <div className="space-y-1 px-3">
              {notifications.map((item) => {
                const isUnread = unreadIds.includes(item.id);
                const iconKey = item.icon || "notifications";
                const colorClass = iconColors[iconKey] || iconColors.notifications;
                return (
                  <Link
                    key={item.id}
                    href={item.href || "#"}
                    onClick={() => { onMarkRead(item.id); onClose(); }}
                    className={`flex items-start gap-3 p-4 rounded-xl transition-colors group ${isUnread ? "bg-[#8C63F5]/8 border border-[#8C63F5]/20" : "hover:bg-white/5"}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <span className="material-symbols-outlined text-[20px]">{ICON_MAP[iconKey] || "info"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-snug ${isUnread ? "text-white" : "text-slate-300"}`}>{item.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.meta || (item.timestamp ? new Date(item.timestamp).toLocaleString() : "Just now")}</p>
                    </div>
                    {isUnread && <div className="w-2 h-2 rounded-full bg-[#8C63F5] mt-1.5 flex-shrink-0" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 border-t border-[#2d2c45] px-4 py-4">
          <Link href="/account/orders" onClick={onClose} className="block w-full text-center bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-[#8C63F5]/20">
            View All Notifications
          </Link>
        </div>
      </aside>
    </>
  );
}
