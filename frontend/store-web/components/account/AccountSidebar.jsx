"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiRequest } from "../../lib/api";

const NAVIGATION = [
  { group: "My Account", items: [
    { name: "Dashboard", href: "/account", icon: "space_dashboard" },
    { name: "Orders", href: "/account/orders", icon: "shopping_bag" },
    { name: "Recently Viewed", href: "/account/recently-viewed", icon: "history" },
    { name: "Wishlist", href: "/wishlist", icon: "favorite" },
    { name: "Addresses", href: "/account/addresses", icon: "location_on" },
  ]},
  { group: "Settings", items: [
    { name: "Settings", href: "/account/settings", icon: "settings" },
    { name: "Profile", href: "/account/profile", icon: "person" },
    { name: "Security", href: "/account/security", icon: "security" },
    { name: "Notifications", href: "/account/notifications", icon: "notifications" },
    { name: "Payment Methods", href: "/account/payment-methods", icon: "credit_card" },
  ]},
  { group: "Support", items: [
    { name: "Returns & Refunds", href: "/account/returns", icon: "assignment_return" },
    { name: "Help Center", href: "/help", icon: "help" },
  ]}
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({ name: "Loading...", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest("/users/me");
        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        if (err?.code === "AUTH_REQUIRED" || err?.status === 401) {
          router.push("/login");
        } else {
          console.error("Failed to load user for sidebar", err);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/login"); // Force redirect on fail
    }
  };

  const displayName = user.name || "Guest User";
  const avatarName = encodeURIComponent(displayName);

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-4 sticky top-24">
      {/* User Info Snippet */}
      <div className="flex items-center gap-4 p-4 border-b border-[#2d2c45] mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8C63F5] to-[#00DAFF] p-0.5">
          <div className="w-full h-full bg-[#121121] rounded-full flex items-center justify-center border-2 border-[#121121] overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=random`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">{displayName}</h3>
          <p className="text-slate-400 text-xs">{user.email || "No email"}</p>
        </div>
      </div>

      <nav className="space-y-6">
        {NAVIGATION.map((section, index) => (
          <div key={index}>
            <h4 className="text-xs font-bold text-[#8C63F5] uppercase tracking-widest px-4 mb-2">
              {section.group}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? "bg-[#8C63F5]/10 text-[#8C63F5] font-bold border border-[#8C63F5]/20" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#2d2c45]/50 border border-transparent"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#8C63F5]' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-[#2d2c45]">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors font-bold text-sm">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
}
