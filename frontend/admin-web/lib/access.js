const FULL_ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);
const SECURITY_ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "SECURITY_ADMIN"]);
const COMMERCE_ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "COMMERCE_ADMIN", "PRODUCT_LISTER", "SUPPORT_AGENT", "VIEWER"]);

export const ADMIN_SURFACE_ROLES = new Set([
  ...FULL_ADMIN_ROLES,
  "SECURITY_ADMIN",
  "COMMERCE_ADMIN",
  "PRODUCT_LISTER",
  "SUPPORT_AGENT",
  "VIEWER",
]);

export const PANEL_DEFINITIONS = {
  commerce: {
    id: "commerce",
    label: "Merchant Admin",
    eyebrow: "Merchant Surface",
    icon: "storefront",
    defaultPath: "/",
    summary: "Customer-facing catalog, orders, offers, categories, and storefront promotions.",
  },
  security: {
    id: "security",
    label: "Platform Admin",
    eyebrow: "Super + Security Surface",
    icon: "shield_lock",
    defaultPath: "/dashboard",
    summary: "Threat operations, incidents, restrictions, audit trails, and access control.",
  },
};

export const NAV_GROUPS_BY_PANEL = {
  // ─────────────────────────────────────────────────────────────────────────
  // COMMERCE PANEL — 4 collapsible top-level modules.
  // Each module contains a `groups[]` array of the original flat group objects.
  // AdminSidebar.jsx detects this shape via `Array.isArray(entry.groups)`.
  // ─────────────────────────────────────────────────────────────────────────
  commerce: [
    {
      id: "store-ops",
      label: "Store Operations",
      icon: "storefront",
      defaultOpen: true, // open on first load before localStorage has an entry
      groups: [
        {
          items: [
            { href: "/", icon: "space_dashboard", label: "Dashboard", summary: "Merchant command overview" },
            { href: "/orders", icon: "receipt_long", label: "Orders", summary: "Fulfillment and payment state" },
            { href: "/products", icon: "inventory_2", label: "Products", summary: "Catalog, media, pricing" },
            { href: "/categories", icon: "account_tree", label: "Categories", summary: "Tree, ordering, visibility" },
            { href: "/inventory", icon: "inventory", label: "Inventory", summary: "Track stock levels and history" },
            { href: "/users", icon: "group", label: "Customers", summary: "Customer directory" },
            { href: "/shipping", icon: "local_shipping", label: "Shipping Engine", summary: "Configure global shipping & COD" },
          ],
        },
        {
          items: [
            { href: "/store-pos", icon: "point_of_sale", label: "POS Dashboard", summary: "Main POS Terminal" },
            { href: "/store-pos/sale", icon: "add_shopping_cart", label: "New Sale", summary: "Start a new sale" },
            { href: "/store-pos/scan", icon: "qr_code_scanner", label: "Scan Barcode", summary: "Barcode scanner mode" },
            { href: "/store-pos/payment", icon: "payments", label: "Payment", summary: "Process payments" },
            { href: "/store-pos/receipt", icon: "receipt", label: "Receipt", summary: "View & print receipts" },
            { href: "/store-pos/drawer", icon: "point_of_sale", label: "Cash Drawer", summary: "Manage cash drawer" },
          ],
        },
      ],
    },
    {
      id: "growth",
      label: "Growth & Marketing",
      icon: "trending_up",
      defaultOpen: false,
      groups: [
        {
          items: [
            { href: "/marketing/flash-deals", icon: "bolt", label: "Flash Deals", summary: "Time-limited promotions" },
            { href: "/marketing/sponsored-ads", icon: "ads_click", label: "Sponsored Ads", summary: "Manage product ads carousel" },
            { href: "/marketing/campaigns", icon: "campaign", label: "Campaigns", summary: "Manage hero campaigns" },
            { href: "/marketing/offers", icon: "sell", label: "Offers", summary: "Site-wide promotions" },
            { href: "/marketing/coupons", icon: "confirmation_number", label: "Coupons", summary: "Discount codes" },
          ],
        },
        {
          items: [
            { href: "/analytics", icon: "insights", label: "Analytics Overview", summary: "Detailed business metrics" },
            { href: "/analytics/revenue", icon: "query_stats", label: "Sales Insights", summary: "Track revenue growth" },
            { href: "/analytics/customers", icon: "group_work", label: "Traffic Analytics", summary: "Visitor traffic sources" },
            { href: "/analytics/products", icon: "troubleshoot", label: "Conversion Analytics", summary: "Understand conversion behavior" },
          ],
        },
        {
          items: [
            { href: "/reports/sales-overview", icon: "bar_chart", label: "Sales Overview", summary: "Sales performance & key metrics" },
            { href: "/reports/product-performance", icon: "trending_up", label: "Product Performance", summary: "Top & low performing products" },
            { href: "/reports/customer-insights", icon: "people", label: "Customer Insights", summary: "Customer growth, segments & insights" },
            { href: "/reports/campaigns", icon: "campaign", label: "Campaigns Report", summary: "Campaign performance & ROI" },
            { href: "/reports/export-schedule", icon: "download", label: "Export & Schedule", summary: "Export reports or schedule auto delivery" },
          ],
        },
      ],
    },
    {
      id: "multi-store",
      label: "Multi-Store & Finance",
      icon: "account_balance",
      defaultOpen: false,
      groups: [
        {
          items: [
            { href: "/outlets", icon: "store", label: "Outlets", summary: "Manage store locations" },
            { href: "/outlets/map", icon: "map", label: "Outlet Map", summary: "View outlets on map" },
            { href: "/outlets/inventory", icon: "inventory", label: "Outlet Inventory", summary: "Per-outlet stock tracking" },
            { href: "/outlets/transfers", icon: "swap_horiz", label: "Stock Transfer", summary: "Transfer stock between outlets" },
            { href: "/outlets/analytics", icon: "analytics", label: "Outlet Analytics", summary: "Performance & analytics of outlets" },
          ],
        },
        {
          items: [
            { href: "/outlet-ops/inventory", icon: "inventory_2", label: "Inventory Check", summary: "Manage local stock" },
            { href: "/outlet-ops/adjustment", icon: "tune", label: "Stock Adjustment", summary: "Adjust stock levels" },
            { href: "/outlet-ops/transfers", icon: "local_shipping", label: "Stock Transfer", summary: "Transfer stock between stores" },
            { href: "/outlet-ops/orders", icon: "shopping_cart", label: "Supplier Orders", summary: "Manage incoming stock" },
            { href: "/outlet-ops/suppliers", icon: "local_shipping", label: "Supplier Management", summary: "Manage local suppliers" },
            { href: "/outlet-ops/analytics", icon: "query_stats", label: "Outlet Analytics", summary: "Store performance" },
          ],
        },
        {
          items: [
            { href: "/finance", icon: "account_balance_wallet", label: "Payouts Overview", summary: "Overview of all payouts" },
            { href: "/finance/transactions", icon: "receipt_long", label: "Transactions", summary: "View all transactions" },
            { href: "/finance/settlements", icon: "account_balance", label: "Settlements", summary: "Reconciliation details" },
            { href: "/finance/invoices", icon: "receipt", label: "Invoices", summary: "Download invoices" },
            { href: "/finance/reconciliation", icon: "compare_arrows", label: "Reconciliation", summary: "Match transactions" },
          ],
        },
      ],
    },
    {
      id: "governance",
      label: "Governance & Support",
      icon: "shield_lock",
      defaultOpen: false,
      groups: [
        {
          items: [
            { href: "/reviews", icon: "rate_review", label: "Reviews Queue", summary: "Review & approve customer reviews" },
            { href: "/moderation/keywords", icon: "block", label: "Abuse Keywords", summary: "Manage blocked words and phrases" },
            { href: "/returns", icon: "assignment_return", label: "Returns Management", summary: "Review & manage return requests" },
            { href: "/moderation/refunds", icon: "currency_rupee", label: "Refund Management", summary: "Process refunds and track status" },
            { href: "/moderation/broadcasts", icon: "campaign", label: "Broadcast Notifications", summary: "Send announcements to users" },
          ],
        },
        {
          items: [
            { href: "/audit", icon: "history", label: "Activity Log", summary: "Track system activities", requiredRoles: ["ADMIN", "SUPER_ADMIN", "COMMERCE_ADMIN"] },
            { href: "/support/tickets", icon: "support_agent", label: "Support Tickets", summary: "Manage support tickets" },
            { href: "/faq", icon: "quiz", label: "FAQ", summary: "Common questions" },
            { href: "/announcements", icon: "campaign", label: "Announcements", summary: "Important updates" },
            { href: "/changelog", icon: "update", label: "Changelog", summary: "Track product changes" },
            { href: "/reports/export-schedule", icon: "download", label: "Data Export", summary: "Export business data" },
          ],
        },
        {
          items: [
            { href: "/settings", icon: "person", label: "Profile & Account", summary: "Manage profile details" },
            { href: "/roles", icon: "admin_panel_settings", label: "Roles & Permissions", summary: "Access control", requiredRoles: ["ADMIN", "SUPER_ADMIN"] },
            { href: "/settings/integrations", icon: "extension", label: "Integrations", summary: "Third-party apps" },
            { href: "/notifications", icon: "notifications", label: "Notifications", summary: "Notification preferences" },
            { href: "/settings/preferences", icon: "settings", label: "System Settings", summary: "System preferences" },
            { href: "/settings/payment-rules", icon: "payments", label: "Payment Rules", summary: "Configure COD & Global Payments", requiredRoles: ["ADMIN", "SUPER_ADMIN", "COMMERCE_ADMIN"] },
          ],
        },
        {
          items: [
            { href: "/design-system", icon: "design_services", label: "Design System", summary: "UI Components & Tokens" },
          ],
        },
      ],
    },
  ],
  security: [
    // ── Group 0: OVERVIEW (no label header) ──────────────────────────────────
    {
      label: null,
      items: [
        { href: "/dashboard", icon: "space_dashboard", label: "Platform Overview", summary: "Executive command center" },
      ],
    },
    // ── Group 1: SECURITY OPERATIONS ─────────────────────────────────────────
    {
      label: "SECURITY OPERATIONS",
      items: [
        { href: "/soc/dashboard", icon: "security", label: "SOC Dashboard", summary: "Security ops command center" },
        { href: "/soc/alerts", icon: "radar", label: "SIEM Alerts", summary: "Live threat detection & SIEM" },
        { href: "/soc/cases", icon: "cases", label: "SOC Cases", summary: "Case investigation workspace" },
        { href: "/soc/playbooks", icon: "play_circle", label: "Playbooks", summary: "Automated response playbooks" },
        { href: "/soc/threats", icon: "travel_explore", label: "Threat Intelligence", summary: "IOC feed, threat map, MITRE" },
        { href: "/soc/users", icon: "manage_accounts", label: "User Risk Scores", summary: "High risk user analytics" },
        { href: "/honeypot", icon: "pest_control", label: "Honeypot Traps", summary: "Decoy trap events & logs" },
      ],
    },
    // ── Group 2: IDENTITY & ACCESS ────────────────────────────────────────────
    {
      label: "IDENTITY & ACCESS",
      items: [
        { href: "/identity/dashboard", icon: "badge", label: "Identity Dashboard", summary: "Identity operations command center" },
        { href: "/users", icon: "group", label: "Users", summary: "Identity and account state" },
        { href: "/rbac", icon: "admin_panel_settings", label: "Roles & Permissions", summary: "RBAC and access governance" },
        { href: "/audit", icon: "history_edu", label: "Audit Logs", summary: "Immutable event trails" },
        { href: "/lockout", icon: "lock_person", label: "Access Control", summary: "Lockouts & restrictions", danger: true },
      ],
    },
    // ── Group 3: PLATFORM OPERATIONS ─────────────────────────────────────────
    {
      label: "PLATFORM OPERATIONS",
      items: [
        { href: "/monitoring", icon: "hub", label: "Command Center", summary: "Infrastructure health & ops" },
        { href: "/system-health", icon: "monitor_heart", label: "System Health", summary: "CPU, Memory, Disk, Uptime" },
        { href: "/monitoring/logs", icon: "terminal", label: "Live Logs", summary: "Real-time log stream" },
        { href: "/soc/logs", icon: "receipt_long", label: "Log Management", summary: "SOC log sources & viewer" },
        { href: "/soc/siem", icon: "sensors", label: "SIEM Config", summary: "SIEM engine & detection rules" },
      ],
    },
    // ── Group 4: COMMUNICATION ───────────────────────────────────────────────
    {
      label: "COMMUNICATION",
      items: [
        { href: "/communication/dashboard", icon: "dashboard", label: "Comms Dashboard", summary: "Communication metrics and logs" },
        { href: "/notifications/email-templates", icon: "mail", label: "Email Templates", summary: "Manage email layouts" },
        { href: "/communication/system-alerts", icon: "notifications_active", label: "System Alerts", summary: "Broadcast alerts" },
        { href: "/communication/preferences", icon: "tune", label: "Preferences", summary: "Notification preferences" },
      ],
    },
    // ── Group 5: BUSINESS INTELLIGENCE ───────────────────────────────────────
    {
      label: "BUSINESS INTELLIGENCE",
      items: [
        { href: "/soc/analytics", icon: "insights", label: "Security Analytics", summary: "SOC event trends & detection stats" },
        { href: "/soc/users", icon: "person_alert", label: "User Risk Analysis", summary: "Risk scores & flagged users" },
        { href: "/reports/export-schedule", icon: "download", label: "Reports & Export", summary: "Generate & schedule reports" },
      ],
    },
    // ── Group 6: SETTINGS & CONFIGURATION ────────────────────────────────────
    {
      label: "SETTINGS & CONFIGURATION",
      items: [
        { href: "/settings", icon: "settings", label: "Platform Settings", summary: "General platform configuration" },
        { href: "/settings/integrations", icon: "integration_instructions", label: "Integrations", summary: "Third-party services & APIs" },
        { href: "/settings/api-keys", icon: "key", label: "API Keys & Secrets", summary: "Manage API keys, tokens & credentials" },
        { href: "/settings/environment", icon: "cloud", label: "Environment", summary: "Manage deployment environments" },
        { href: "/settings/feature-flags", icon: "flag", label: "Feature Flags", summary: "Manage feature rollouts" },
        { href: "/payment-rules", icon: "payments", label: "Payment Rules", summary: "COD & gateway configuration" },
      ],
    },
    // ── Group 7: DOCUMENTATION & SUPPORT ─────────────────────────────────────
    {
      label: "DOCUMENTATION & SUPPORT",
      items: [
        { href: "/help-center", icon: "help", label: "Help Center", summary: "Browse guides, docs & resources" },
        { href: "/changelog", icon: "update", label: "Changelog", summary: "Track updates, features & fixes" },
        { href: "/system-status", icon: "cloud_done", label: "System Status", summary: "Real-time system availability" },
        { href: "/contact-support", icon: "support_agent", label: "Contact Support", summary: "Tickets, SLAs & escalations" },
      ],
    },
  ],
};

const ROUTE_PANEL_MATCHERS = [
  { panel: "commerce", paths: ["/", "/orders", "/products", "/marketing/offers", "/marketing/coupons", "/categories", "/outlets", "/inventory", "/shipping", "/analytics", "/finance", "/reviews", "/returns", "/moderation/keywords", "/moderation/refunds", "/moderation/broadcasts", "/marketing/campaigns", "/marketing/flash-deals", "/marketing/sponsored-ads", "/store-pos", "/outlet-ops", "/design-system"] },
  {
    panel: "security",
    paths: ["/dashboard", "/threats", "/monitoring", "/threat-map", "/incidents", "/lockout", "/honeypot", "/compliance", "/identity", "/users", "/audit", "/rbac", "/payment-rules", "/emergency", "/search", "/soc", "/security-admin", "/system-health", "/system-status", "/contact-support", "/help-center", "/changelog", "/analytics", "/reports", "/communication", "/settings", "/notifications"],
  },
];

const normalizedRole = (role) => String(role || "").toUpperCase();

export const isAdminRole = (role) => ADMIN_SURFACE_ROLES.has(normalizedRole(role));

export const isFullAdminRole = (role) => FULL_ADMIN_ROLES.has(normalizedRole(role));

export const getAvailablePanels = (userOrRole) => {
  const role = normalizedRole(typeof userOrRole === "string" ? userOrRole : userOrRole?.role);
  if (FULL_ADMIN_ROLES.has(role)) return [PANEL_DEFINITIONS.security, PANEL_DEFINITIONS.commerce];
  if (role === "SECURITY_ADMIN") return [PANEL_DEFINITIONS.security];
  if (COMMERCE_ADMIN_ROLES.has(role)) return [PANEL_DEFINITIONS.commerce];
  return [];
};

export const getDefaultPanelForRole = (role) => {
  const panels = getAvailablePanels(role);
  return panels[0]?.id ?? "commerce";
};

export const getDefaultRouteForPanel = (panel) => PANEL_DEFINITIONS[panel]?.defaultPath ?? "/";

export const getPanelForPath = (pathname = "/", currentPanel = null) => {
  const path = pathname || "/";
  
  if (currentPanel) {
    const matcher = ROUTE_PANEL_MATCHERS.find(m => m.panel === currentPanel);
    if (matcher && matcher.paths.some((route) => path === route || (route !== "/" && path.startsWith(`${route}/`)))) {
      return currentPanel;
    }
  }

  for (const matcher of ROUTE_PANEL_MATCHERS) {
    if (matcher.paths.some((route) => path === route || (route !== "/" && path.startsWith(`${route}/`)))) {
      return matcher.panel;
    }
  }
  return null;
};

export const canAccessPanel = (role, panel) => getAvailablePanels(role).some((item) => item.id === panel);

export const getNavGroupsForPanel = (panel) => NAV_GROUPS_BY_PANEL[panel] ?? NAV_GROUPS_BY_PANEL.commerce;

export const getNavGroupsForUser = (userOrRole, panel) => {
  const role = typeof userOrRole === "string" ? userOrRole : userOrRole?.role;
  const fallbackPanel = getDefaultPanelForRole(role);
  const effectivePanel = canAccessPanel(role, panel) ? panel : fallbackPanel;
  const rawGroups = getNavGroupsForPanel(effectivePanel);
  
  return rawGroups.map(module => {
    if (Array.isArray(module.groups)) {
      return {
        ...module,
        groups: module.groups.map(g => ({
          ...g,
          items: g.items?.filter(item => !item.requiredRoles || item.requiredRoles.includes(role)) ?? []
        }))
      };
    } else {
      return {
        ...module,
        items: module.items?.filter(item => !item.requiredRoles || item.requiredRoles.includes(role)) ?? []
      };
    }
  });
};

// Handles both the new modular shape ({ id, groups: [{items}] })
// and the legacy flat shape ({ label, items }) used by the security panel.
// .filter(Boolean) guards against sparse items arrays producing undefined slots.
export const getNavItemsForUser = (userOrRole, panel) =>
  getNavGroupsForUser(userOrRole, panel)
    .flatMap((entry) =>
      Array.isArray(entry.groups)
        ? entry.groups.flatMap((g) => g.items ?? [])
        : entry.items ?? [],
    )
    .filter(Boolean);

export const canAccessAdminPath = (role, pathname = "/") => {
  if (!isAdminRole(role)) return false;
  
  const path = pathname || "/";
  const matchingPanels = [];
  for (const matcher of ROUTE_PANEL_MATCHERS) {
    if (matcher.paths.some((route) => path === route || (route !== "/" && path.startsWith(`${route}/`)))) {
      matchingPanels.push(matcher.panel);
    }
  }
  
  if (matchingPanels.length === 0) {
    return isFullAdminRole(role);
  }
  
  return matchingPanels.some(panel => canAccessPanel(role, panel));
};

export const resolveFallbackPath = (role, attemptedPath = "/") => {
  if (!isAdminRole(role)) return "/login?error=unauthorized";
  if (canAccessAdminPath(role, attemptedPath)) return attemptedPath || "/";
  return getDefaultRouteForPanel(getDefaultPanelForRole(role));
};

// Cache invalidation trigger
