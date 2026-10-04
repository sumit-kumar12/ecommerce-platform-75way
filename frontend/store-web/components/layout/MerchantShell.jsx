"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { StoreHeader } from "./StoreHeader";

const navLinks = [
  { name: "Dashboard", href: "/merchant/dashboard", icon: "dashboard" },
  { name: "Products", href: "/merchant/products", icon: "inventory_2" },
  { name: "Orders", href: "/merchant/orders", icon: "shopping_cart" },
  { name: "Analytics", href: "/merchant/analytics", icon: "analytics" },
  { name: "Finance", href: "/merchant/finance", icon: "account_balance" },
  { name: "Reviews", href: "/merchant/reviews", icon: "reviews" },
  { name: "Settings", href: "/merchant/settings", icon: "settings" },
];

export default function MerchantShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Basic guard, will redirect if not logged in or not a lister
  const isAuthorized = !loading && (user && (user.role === "PRODUCT_LISTER" || user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "COMMERCE_ADMIN"));
  const shouldRedirect = !loading && !isAuthorized;

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/");
    }
  }, [shouldRedirect, router]);

  if (loading || shouldRedirect) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F0E17] flex flex-col font-sans">
      <StoreHeader />
      
      <div className="flex-grow flex mt-16 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 p-6 hidden md:block">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-24">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 px-3">
              Merchant Portal
            </h2>
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                      isActive 
                        ? "bg-[#8B5CF6]/20 text-[#8B5CF6]" 
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-white/10 px-3">
              <Link
                href="/products/new"
                className="flex items-center justify-center gap-2 w-full bg-[#8B5CF6] hover:bg-[#7e53db] text-white py-2 rounded-lg font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Product
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-4 md:p-6 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
