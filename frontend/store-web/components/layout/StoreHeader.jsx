"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "../../../shared-ui/BrandLogo";
import { CategoryNav } from "./CategoryNav";
import { apiRequest } from "../../lib/api";
import { formatCatalogPrice, getProductImageUrl, pickCategoryIcon } from "../../lib/catalog";
import styles from "./StoreHeader.module.css";
import { MobileDrawer } from "../mobile/MobileDrawer";
import { SearchDrawer } from "../mobile/SearchDrawer";
import { CartDrawer } from "../mobile/CartDrawer";
import { NotificationDrawer } from "../mobile/NotificationDrawer";
import { MegaSearchOverlay } from "../mobile/MegaSearchOverlay";
import { Suspense } from "react";

const NOTIFICATION_STORAGE_PREFIX = "kb-store-seen-notifications";

function getNotificationStorageKey(scope) {
  return `${NOTIFICATION_STORAGE_PREFIX}:${scope || "guest"}`;
}

function readSeenNotifications(scope) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getNotificationStorageKey(scope));
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSeenNotifications(scope, ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getNotificationStorageKey(scope), JSON.stringify(Array.from(new Set(ids))));
}

function StoreHeaderInner({ categories = [], options = {} }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("q") ?? "";
  const {
    showSearch = true,
    showNav = true,
    showTheme = true,
    showNotifications = true,
    showWishlist = true,
    showCart = true,
    showAccount = true,
    showMobileCategories = true,
  } = options;
  const [search, setSearch] = useState(routeQuery);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationScope, setNotificationScope] = useState("guest");
  const [unreadIds, setUnreadIds] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountUser, setAccountUser] = useState(null);
  const [accountLatestOrder, setAccountLatestOrder] = useState(null);
  const [accountLoggingOut, setAccountLoggingOut] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [megaSearchOpen, setMegaSearchOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("kb-theme") || (document.documentElement.classList.contains("light") ? "light" : "dark");
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      document.documentElement.classList.toggle("light", savedTheme === "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kb-theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.classList.toggle("light", nextTheme === "light");
    }
  };
  const [cartItems, setCartItems] = useState([]);
  const [cartOffers, setCartOffers] = useState([]);
  const [cartError, setCartError] = useState("");
  const notificationRef = useRef(null);
  const accountRef = useRef(null);
  const cartRef = useRef(null);
  const topCategories = useMemo(() => categories.slice(0, 4), [categories]);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0), [cartItems]);
  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cartItems],
  );
  const cartOriginalSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.originalPrice || item.price || 0) * Number(item.quantity || 0), 0),
    [cartItems],
  );
  const cartOfferSavings = Math.max(0, cartOriginalSubtotal - cartSubtotal);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home", active: pathname === "/" },
      { href: "/products", label: "Categories", active: pathname.startsWith("/products") || pathname.startsWith("/category") },
      { href: "/deals", label: "Deals", active: pathname.startsWith("/deals") },
      { href: "/offers", label: "Offers", active: pathname.startsWith("/offers") },
      { href: "/trust", label: "About", active: pathname.startsWith("/trust") || pathname.startsWith("/brand-guidelines") },
    ],
    [pathname]
  );

  useEffect(() => {
    setSearch(routeQuery);
  }, [routeQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
  };

  const loadNotifications = useCallback(async () => {
    setNotificationLoading(true);
    try {
      const sessionResult = await apiRequest("/users/me", { csrf: false, refresh: false })
        .then((value) => ({ status: "fulfilled", value }))
        .catch((reason) => ({ status: "rejected", reason }));

      const nextNotifications = [];
      const isAuthenticated = sessionResult.status === "fulfilled" && Boolean(sessionResult.value?.user);
      const scope = isAuthenticated ? sessionResult.value?.user?.id || sessionResult.value?.user?.email || "customer" : "guest";
      let cartResult = { status: "rejected" };
      let wishlistResult = { status: "rejected" };
      let ordersResult = { status: "rejected" };
      let latestOrder = null;

      setAccountUser(isAuthenticated ? sessionResult.value.user : null);

      if (isAuthenticated) {
        [cartResult, wishlistResult, ordersResult] = await Promise.allSettled([
          apiRequest("/cart", { csrf: false, refresh: false }),
          apiRequest("/wishlist", { csrf: false, refresh: false }),
          apiRequest("/orders/mine", { csrf: false, refresh: false }),
        ]);
        latestOrder = ordersResult.status === "fulfilled" ? (ordersResult.value?.orders || [])[0] || null : null;
      }

      setAccountLatestOrder(latestOrder);

      if (cartResult.status === "fulfilled") {
        const items = cartResult.value?.cart?.items || [];
        if (items.length > 0) {
          nextNotifications.push({
            id: `cart-${items.length}`,
            icon: "shopping_bag",
            title: `${items.length} item${items.length === 1 ? "" : "s"} ready in cart`,
            meta: "Continue secure checkout",
            href: "/checkout",
          });
        }
      }

      if (wishlistResult.status === "fulfilled") {
        const items = wishlistResult.value?.wishlist?.items || [];
        if (items.length > 0) {
          nextNotifications.push({
            id: `wishlist-${items.length}`,
            icon: "favorite",
            title: `${items.length} saved wishlist item${items.length === 1 ? "" : "s"}`,
            meta: "Review saved products",
            href: "/wishlist",
          });
        }
      }

      if (ordersResult.status === "fulfilled") {
        if (latestOrder) {
          nextNotifications.push({
            id: `order-${latestOrder.id}-${latestOrder.status || "pending"}`,
            icon: "local_shipping",
            title: `Latest order ${String(latestOrder.orderNumber || latestOrder.id).slice(-8)}`,
            meta: latestOrder.status || "Track order",
            href: `/order/${latestOrder.id}`,
          });
        }
      }

      if (!nextNotifications.length) {
        nextNotifications.push({
          id: isAuthenticated ? "deals-signed" : "deals-guest",
          icon: "bolt",
          title: "No active alerts right now",
          meta: isAuthenticated ? "Explore live deals and new arrivals" : "Sign in for order alerts and saved-item updates",
          href: isAuthenticated ? "/deals" : "/login",
        });
      }

      const seenIds = readSeenNotifications(scope);
      setNotificationScope(scope);
      setNotifications(nextNotifications.slice(0, 5));
      setUnreadIds(nextNotifications.filter((item) => !seenIds.includes(item.id)).map((item) => item.id));
    } catch {
      setAccountUser(null);
      setAccountLatestOrder(null);
      setNotifications([
        {
          id: "fallback",
          icon: "notifications",
          title: "Notifications unavailable",
          meta: "Open deals or refresh the storefront",
          href: "/deals",
        },
      ]);
      setUnreadIds(["fallback"]);
    } finally {
      setNotificationLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const timer = window.setInterval(() => {
      void loadNotifications();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [loadNotifications, pathname]);

  const markNotificationAsRead = useCallback((notificationId) => {
    const currentSeen = readSeenNotifications(notificationScope);
    const nextSeen = [...currentSeen, notificationId];
    writeSeenNotifications(notificationScope, nextSeen);
    setUnreadIds((current) => current.filter((id) => id !== notificationId));
  }, [notificationScope]);

  const markAllNotificationsAsRead = useCallback(() => {
    writeSeenNotifications(notificationScope, notifications.map((item) => item.id));
    setUnreadIds([]);
  }, [notificationScope, notifications]);

  const handleNotificationToggle = async () => {
    const next = !notificationOpen;
    setNotificationOpen(next);
    if (next) {
      setAccountOpen(false);
      setCartOpen(false);
      await loadNotifications();
    }
  };

  const handleAccountToggle = async () => {
    if (!accountUser) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    const next = !accountOpen;
    setAccountOpen(next);
    if (next) {
      setNotificationOpen(false);
      setCartOpen(false);
      await loadNotifications();
    }
  };

  const loadCartDrawer = useCallback(async () => {
    setCartLoading(true);
    setCartError("");
    try {
      const [cartResult, offersResult] = await Promise.allSettled([
        apiRequest("/cart", { csrf: false }),
        apiRequest("/offers", { csrf: false }),
      ]);

      if (cartResult.status === "fulfilled") {
        setCartItems(cartResult.value?.cart?.items || []);
      } else {
        setCartItems([]);
        setCartError("Cart feed unavailable right now.");
      }

      if (offersResult.status === "fulfilled") {
        setCartOffers((offersResult.value?.offers || []).filter((offer) => offer.isActive).slice(0, 2));
      } else {
        setCartOffers([]);
      }
    } finally {
      setCartLoading(false);
    }
  }, []);

  const handleCartToggle = async () => {
    const next = !cartOpen;
    setCartOpen(next);
    if (next) {
      setNotificationOpen(false);
      setAccountOpen(false);
      await loadCartDrawer();
    }
  };

  useEffect(() => {
    const onCartUpdated = () => {
      if (!cartOpen) {
        setCartOpen(true);
        setNotificationOpen(false);
        setAccountOpen(false);
      }
      void loadCartDrawer();
    };
    window.addEventListener("cart-updated", onCartUpdated);
    return () => window.removeEventListener("cart-updated", onCartUpdated);
  }, [cartOpen, loadCartDrawer]);

  const handleCartQuantityChange = useCallback(async (variantId, quantity) => {
    try {
      if (quantity <= 0) {
        const res = await apiRequest(`/cart/items/${variantId}`, { method: "DELETE" });
        setCartItems(res?.cart?.items || []);
        return;
      }

      const res = await apiRequest(`/cart/items/${variantId}`, {
        method: "PATCH",
        body: { quantity },
      });
      setCartItems(res?.cart?.items || []);
    } catch (error) {
      setCartError(error?.message || "Unable to update cart.");
    }
  }, []);

  const handleCartCheckout = useCallback(() => {
    setCartOpen(false);
    router.push("/checkout");
  }, [router]);

  const handleLogout = useCallback(async () => {
    if (accountLoggingOut) return;
    setAccountLoggingOut(true);
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Logout should still clear local UI state even if backend session is already gone.
    } finally {
      setAccountUser(null);
      setAccountLatestOrder(null);
      setAccountOpen(false);
      setNotificationScope("guest");
      setNotifications([]);
      setUnreadIds([]);
      setCartItems([]);
      setCartOffers([]);
      setCartOpen(false);
      setNotificationOpen(false);
      setAccountLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  }, [accountLoggingOut, router]);

  const rawAccountDisplayName = accountUser?.name || accountUser?.email?.split("@")[0] || "Guest";
  const isAdminIdentity = /admin/i.test(rawAccountDisplayName) || /admin/i.test(accountUser?.email || "");
  const accountDisplayName = accountUser ? (isAdminIdentity ? "Marketplace Member" : rawAccountDisplayName) : "Guest";
  const accountInitials = accountDisplayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "KB";

  return (
    <>
    <MobileDrawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
    <SearchDrawer open={searchDrawerOpen} onClose={() => setSearchDrawerOpen(false)} />
    <CartDrawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      cartItems={cartItems}
      cartOffers={cartOffers}
      cartLoading={cartLoading}
      cartError={cartError}
      cartSubtotal={cartSubtotal}
      cartOfferSavings={cartOfferSavings}
      onQuantityChange={handleCartQuantityChange}
      onCheckout={handleCartCheckout}
    />
    <NotificationDrawer
      open={notificationOpen}
      onClose={() => setNotificationOpen(false)}
      notifications={notifications}
      notificationLoading={notificationLoading}
      unreadIds={unreadIds}
      onMarkRead={markNotificationAsRead}
      onMarkAllRead={markAllNotificationsAsRead}
      onRefresh={loadNotifications}
    />
    <MegaSearchOverlay open={megaSearchOpen} onClose={() => setMegaSearchOpen(false)} categories={categories} />
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.leftCluster}>
          {/* Hamburger – mobile only */}
          <button
            className="flex lg:hidden w-9 h-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors mr-1"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <Link href="/" className={styles.brand}>
            <BrandLogo width={32} height={32} showText={false} className={styles.brandLogo} />
            <div className={styles.brandTextWrap}>
              <span className={styles.brandText}>Katabazaar</span>
              <span className={styles.brandSubtitle}>Your Trusted Store</span>
            </div>
          </Link>

          {showSearch ? (
            <form className={styles.searchForm} action="/products" method="get" role="search" onSubmit={handleSubmit}>
              <span className={`material-symbols-outlined ${styles.searchIconLeft}`}>search</span>
              <input
                type="search"
                name="q"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setMegaSearchOpen(true)}
                className={styles.searchInput}
                placeholder="Search products, categories..."
                aria-label="Search"
                autoComplete="off"
              />
              <div className={styles.categorySelectWrap}>
                <select className={styles.categorySelect} name="categorySlug">
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <span className={`material-symbols-outlined ${styles.categorySelectIcon}`}>expand_more</span>
              </div>
              <button type="submit" className={styles.searchBtn} aria-label="Submit search">
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
          ) : null}
        </div>

        {showNav ? (
          <nav className={styles.desktopNav}>
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href} className={`${styles.navLink} ${item.active ? styles.navLinkActive : ""}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className={styles.actions}>
          {/* Mobile search icon – visible only on small screens */}
          {showSearch ? (
            <button
              className="flex lg:hidden w-9 h-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSearchDrawerOpen(true)}
              aria-label="Open search"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
          ) : null}
          {/* Theme toggle disabled globally as per request
          {showTheme ? (
            <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle Theme">
              <span className="material-symbols-outlined text-[1.1rem]">{theme === "dark" ? "light_mode" : "dark_mode"}</span>
            </button>
          ) : null}
          */}
          {showNotifications ? (
            <button type="button" className={styles.iconButton} onClick={() => void handleNotificationToggle()}>
              <span className="material-symbols-outlined text-[1.1rem]">notifications</span>
              {unreadIds.length > 0 ? <span className={styles.notificationCount}>{unreadIds.length}</span> : null}
            </button>
          ) : null}

          {showNav ? (
            <Link href="/wishlist" className={styles.iconButton} aria-label="Wishlist">
              <span className="material-symbols-outlined text-[1.1rem]">favorite</span>
            </Link>
          ) : null}

          {showCart ? (
            <button type="button" className={styles.iconButton} onClick={() => void handleCartToggle()} aria-label="Open cart">
              <span className="material-symbols-outlined text-[1.1rem]">shopping_cart</span>
              {cartCount > 0 ? <span className={styles.notificationCount}>{cartCount}</span> : null}
            </button>
          ) : null}
          {showAccount ? (
            <div className={styles.accountWrap} ref={accountRef}>
              <button type="button" className={`${styles.iconButton} ${styles.accountPill}`} onClick={() => void handleAccountToggle()}>
                {accountUser ? (
                  <span className="material-symbols-outlined text-[1.1rem]">verified_user</span>
                ) : (
                  <span className="material-symbols-outlined text-[1.1rem]">account_circle</span>
                )}
              </button>

              {accountOpen && accountUser ? (
                <div className={styles.accountDropdown}>
                  <div className={styles.accountPointer}></div>
                  <div className={styles.accountHeader}>
                    <div className={styles.accountIdentityRow}>
                      <div className={styles.accountAvatarLarge}>
                        <img
                          alt="User Profile Avatar"
                          className="w-full h-full object-cover rounded-xl"
                          src={isAdminIdentity
                            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCu2h87QIZoxmNexShTxMnvWVFk_llYsjT1MzRgEsdE7zW_lyQWJH1DGshGCxySITLqGqrz7u0GMR77Ao_U0M8k-fnn08eG7b2POzjExFt16R2jXElnkjd-LQ543e-L6h5fVhPYlqHOIoWQnyGixgs98_x7YFt5wZIlskpk5WI0bE3vEMXUXLevkEPp2Rl_Fsxuy-Q-jujSkyNhcG1CpYT2pF8jcrBIHY0x_xS-z3TOYf1otmiQsjZCw6Jh68bQxVKsWVWsPDawbfM"
                            : "https://lh3.googleusercontent.com/aida-public/AB6AXuA2X8_9Y6W9xuwRUYq8QMDQpvX7z6H-q29EovKrOYx1BJAswfNfpiD3--egzI6oW9Dzs7h8DvJt5_pphS39X9DZzNY9gDFRVGVRlztlZO39PLOyKtVgwctxZB-UoBSwS_o47dLqdsCJdc9wMeEhkrJ2Szx0ceprm8cYbvCal1F8xdgw5RG7L4bM0P6acmGCT0ineL82I0kb9WQFpoQCP_8YHCz5qvwjQolqmWfYrXucYoHDJkmkabAF_SUEDqSix_l3RheNwfjw_Zw"
                          }
                        />
                      </div>
                      <div>
                        <p className={styles.accountWelcome}>Welcome back</p>
                        <strong>{accountDisplayName}</strong>
                        <small>{isAdminIdentity ? "Local testing profile" : accountUser.email}</small>
                      </div>
                    </div>
                    {/* Removed secure session pill */}
                  </div>

                  <div className={styles.accountMenu}>
                    <Link
                      href="/account/orders"
                      className={styles.accountMenuItem}
                      onClick={() => setAccountOpen(false)}
                    >
                      <div className={styles.accountMenuIcon}>
                        <span className="material-symbols-outlined">package_2</span>
                      </div>
                      <div className={styles.accountMenuBody}>
                        <span>My Orders</span>
                        <small>View and track your orders</small>
                      </div>
                    </Link>

                    <Link href="/wishlist" className={styles.accountMenuItem} onClick={() => setAccountOpen(false)}>
                      <div className={styles.accountMenuIcon}>
                        <span className="material-symbols-outlined">favorite</span>
                      </div>
                      <div className={styles.accountMenuBody}>
                        <span>Wishlist</span>
                        <small>Review saved products</small>
                      </div>
                    </Link>

                    <Link href="/cart" className={styles.accountMenuItem} onClick={() => setAccountOpen(false)}>
                      <div className={styles.accountMenuIcon}>
                        <span className="material-symbols-outlined">shopping_cart</span>
                      </div>
                      <div className={styles.accountMenuBody}>
                        <span>Cart</span>
                        <small>View items in your cart</small>
                      </div>
                    </Link>

                    <Link href="/account/addresses" className={styles.accountMenuItem} onClick={() => setAccountOpen(false)}>
                      <div className={styles.accountMenuIcon}>
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div className={styles.accountMenuBody}>
                        <span>My Addresses</span>
                        <small>Manage shipping locations</small>
                      </div>
                    </Link>

                    <Link href="/account/settings" className={styles.accountMenuItem} onClick={() => setAccountOpen(false)}>
                      <div className={styles.accountMenuIcon}>
                        <span className="material-symbols-outlined">settings</span>
                      </div>
                      <div className={styles.accountMenuBody}>
                        <span>Settings</span>
                        <small>Manage account and login details</small>
                      </div>
                    </Link>
                  </div>

                  <div className={styles.accountFooter}>
                    <button type="button" className={styles.accountLogout} onClick={() => void handleLogout()} disabled={accountLoggingOut}>
                      <div className={styles.accountMenuIcon}>
                        <span className="material-symbols-outlined">logout</span>
                      </div>
                      <div className={styles.accountMenuBody}>
                        <span>{accountLoggingOut ? "Signing out..." : "Sign Out"}</span>
                        <small>End this secure session</small>
                      </div>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>


    </header>
    </>
  );
}

export function StoreHeader(props) {
  return (
    <Suspense fallback={<header className={styles.header} />}>
      <StoreHeaderInner {...props} />
    </Suspense>
  );
}
