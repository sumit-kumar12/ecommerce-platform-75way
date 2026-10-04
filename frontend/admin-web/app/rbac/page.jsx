"use client";

import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/api";

const RESOURCE_MAP = [
  { id: "commerce", label: "Commerce Panel", desc: "panel.commerce.access" },
  { id: "products", label: "Product Listings", desc: "catalog.products.main" },
  { id: "categories", label: "Category Tree", desc: "catalog.categories.taxonomy" },
  { id: "orders", label: "Order & Fulfillment", desc: "commerce.orders.processor" },
  { id: "offers", label: "Offer Campaigns", desc: "commerce.offers.engine" },
  { id: "discounts", label: "Discount Rules", desc: "commerce.discounts.rules" },
  { id: "media", label: "Product Media", desc: "catalog.media.assets" },
  { id: "payment_rules", label: "Payment Rules", desc: "commerce.payment.guardrails" },
  { id: "payment_gateway", label: "Razorpay Secrets", desc: "security.payment.gateway.secrets" },
  { id: "security", label: "Security Panel", desc: "panel.security.access" },
  { id: "monitoring", label: "Monitoring", desc: "security.monitoring.health" },
  { id: "threats", label: "Threat Rules", desc: "security.threats.rules" },
  { id: "audit", label: "Audit Logs", desc: "security.audit.ledger" },
  { id: "users", label: "User Management", desc: "security.users.accounts" },
  { id: "sessions", label: "Sessions", desc: "security.sessions.revoke" },
  { id: "lockout", label: "Global Lockout", desc: "security.lockout.controls" },
  { id: "incidents", label: "Incidents", desc: "security.incidents.response" },
  { id: "honeypot", label: "Honeypot", desc: "security.honeypot.traps" },
  { id: "rbac", label: "RBAC", desc: "security.rbac.policies" },
  { id: "emergency", label: "Emergency Broadcast", desc: "security.broadcast.channels" },
  { id: "search", label: "Global Search", desc: "admin.search.index" },
];

const ACTIONS = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "broadcast", label: "Broadcast" },
];

export default function RbacPage() {
  const [roles, setRoles] = useState({});
  const [roleList, setRoleList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // Local state for active role UI
  const [activeRole, setActiveRole] = useState("ADMIN");
  const [localPerms, setLocalPerms] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchPolicies = async () => {
      try {
        const payload = await adminRequest("/rbac/roles");
        if (payload?.roles && active) {
          const roleMap = {};
          payload.roles.forEach(r => {
            const permMap = {};
            r.permissions.forEach(p => {
              permMap[p] = true;
            });
            roleMap[r.role] = permMap;
          });
          setRoles(roleMap);
          setRoleList(payload.roles);
          setLocalPerms(roleMap["ADMIN"] || {});
          setPermissions(payload.availablePermissions || []);
        }
      } catch (e) {
        console.error("Failed to load policies", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPolicies();
    return () => { active = false; };
  }, []);

  const switchRole = (newRole) => {
    setActiveRole(newRole);
    setLocalPerms(roles[newRole] || {});
  };

  const togglePermission = (resourceId, action) => {
    const key = `${resourceId}:${action}`;
    if (!permissions.includes(key)) return;
    setLocalPerms(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const permsArray = Object.keys(localPerms).filter(k => localPerms[k]);
      await adminRequest(`/rbac/roles/${activeRole}`, {
        method: "PUT",
        body: { permissions: permsArray }
      });
      setRoles(prev => ({
        ...prev,
        [activeRole]: localPerms
      }));
      alert("Role policies updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to update policies.");
    } finally {
      setSaving(false);
    }
  };

  const getRoleDisplayName = (role) => {
    if (role === "ADMIN") return "Super Admin";
    if (role === "PRODUCT_LISTER") return "Merchant";
    return String(role || "Customer")
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const getRoleTone = (role) => {
    if (["ADMIN", "SUPER_ADMIN", "SECURITY_ADMIN"].includes(role)) return "bg-red-500";
    if (["COMMERCE_ADMIN", "PRODUCT_LISTER"].includes(role)) return "bg-emerald-400";
    return "bg-slate-500";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] text-slate-200 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/60 gap-4 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Roles & Permissions
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Manage global resource access controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 focus-within:border-purple-500 transition-colors">
            <span className="material-symbols-outlined text-zinc-500 text-[16px]">search</span>
            <input
              type="text"
              className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-48"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors disabled:opacity-50">
            <span className="material-symbols-outlined text-[14px]">save</span>
            {saving ? "Saving..." : "Apply Changes"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 p-6 flex flex-col min-w-0">
            <div className="flex flex-col flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden min-h-0">
              
              {/* Grid Header */}
              <div className="grid grid-cols-[minmax(220px,1fr)_repeat(3,minmax(96px,0.35fr))] bg-zinc-800/40 border-b border-zinc-800 p-4 font-bold text-[11px] uppercase tracking-wider text-zinc-400 shrink-0">
                <div className="flex items-center gap-2">Resource Name</div>
                {ACTIONS.map((action) => <div key={action.key} className="text-center">{action.label}</div>)}
              </div>

              {/* Grid Body */}
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {loading ? (
                  <div className="p-8 text-center text-zinc-500">Loading Matrix...</div>
                ) : (
                  RESOURCE_MAP
                    .filter(r => !search.trim() || r.label.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase()))
                    .map(resource => (
                    <div key={resource.id} className="grid grid-cols-[minmax(220px,1fr)_repeat(3,minmax(96px,0.35fr))] border-b border-zinc-800/50 p-4 items-center group hover:bg-purple-500/5 transition-colors">
                      <div className="flex flex-col min-w-0 pr-4">
                        <span className="text-sm font-bold text-white truncate">{resource.label}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{resource.desc}</span>
                      </div>
                      {ACTIONS.map(action => {
                        const permissionKey = `${resource.id}:${action.key}`;
                        const supported = permissions.includes(permissionKey);

                        return (
                        <div key={action.key} className="flex justify-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              checked={!!localPerms[permissionKey]}
                              disabled={!supported}
                              onChange={() => togglePermission(resource.id, action.key)}
                              className="sr-only peer" 
                              type="checkbox"
                            />
                            <div className={`w-9 h-5 ${supported ? 'bg-zinc-700' : 'bg-zinc-900 opacity-30'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500`}></div>
                          </label>
                        </div>
                      )})}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Right Panel ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-80 border-l border-zinc-800 bg-zinc-900/40 flex flex-col p-6 gap-6 shrink-0 lg:flex-none">
            
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Active Roles</h3>
              <div className="flex flex-col gap-2">
                {(roleList.length ? roleList : [{ role: "ADMIN" }, { role: "PRODUCT_LISTER" }, { role: "CUSTOMER" }]).map((roleEntry) => (
                  <div key={roleEntry.role} onClick={() => switchRole(roleEntry.role)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${activeRole === roleEntry.role ? 'bg-purple-500/10 border-purple-500/50' : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${getRoleTone(roleEntry.role)}`}></div>
                      <span className="text-xs font-medium text-white">{getRoleDisplayName(roleEntry.role)}</span>
                    </div>
                    {["ADMIN", "SUPER_ADMIN", "SECURITY_ADMIN"].includes(roleEntry.role) ? (
                      <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold">Root</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-purple-400 text-sm">verified_user</span>
                <p className="text-[11px] font-bold text-slate-200">Least Privilege Active</p>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">System is enforcing granular access controls to minimize security risks. Changes applied immediately.</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
