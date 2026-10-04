"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ── Shared Styles ─────────────────────────────────────────────── */
const card = {
  background: "#13151f",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: "20px",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile Information");

  const tabs = ["Profile Information", "Security", "Sessions", "Preferences", "Activity"];

  return (
    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20, minHeight: "100%", background: "#0b0d12", color: "#fff", fontFamily: "inherit", boxSizing: "border-box" }}>
      
      {/* ── Breadcrumbs & Header ────────────────────────────────────── */}
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>My Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          <span>Platform Admin</span>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>My Profile</span>
        </div>
      </div>

      {/* ── Profile Header Card ─────────────────────────────────────── */}
      <div style={{ ...card, padding: "24px", position: "relative" }}>
        <button style={{ position: "absolute", top: 24, right: 24, display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#818cf8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_square</span>
          Edit Profile
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
          {/* Avatar Area */}
          <div style={{ position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(255,255,255,0.1)", overflow: "hidden", border: "2px solid rgba(255,255,255,0.05)" }}>
              {/* Fallback image style since actual image is not provided, replacing with icon for now */}
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1f2937" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "rgba(255,255,255,0.5)" }}>person</span>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #13151f" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#fff" }}>local_police</span>
            </div>
          </div>

          {/* Info Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700 }}>Platform Admin</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: "rgba(99,102,241,0.15)", color: "#818cf8", borderRadius: 4, border: "1px solid rgba(99,102,241,0.3)" }}>SUPER ADMIN</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", background: "rgba(16,185,129,0.1)", color: "#10b981", borderRadius: 4, border: "1px solid rgba(16,185,129,0.2)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></span> Active
              </span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>mail</span>
              <span>platform@katabazaar.local</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14, marginLeft: 4, cursor: "pointer", color: "rgba(255,255,255,0.3)" }}>content_copy</span>
            </div>

            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              Primary Administrator of Katabazaar Platform
            </div>
          </div>
        </div>

        {/* Horizontal Stats Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 40, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>badge</span> User ID
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>ADM-000001</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span> MFA Status
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>Enabled</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>history</span> Last Login
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>May 16, 2024 02:34 PM</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>alternate_email</span> Session ID
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "monospace" }}>A1B2-C3D4-E5F6-G7H8</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> IP Address
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>117.198.34.12</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", marginTop: 10 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 24px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #818cf8" : "2px solid transparent",
              color: activeTab === tab ? "#818cf8" : "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Content Grid ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...card, padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, fontWeight: 700 }}>
              Personal Information
            </div>
            <div style={{ padding: "8px 20px 20px" }}>
              {[
                { icon: "person", label: "Full Name", value: "Platform Admin" },
                { icon: "mail", label: "Email Address", value: "platform@katabazaar.local" },
                { icon: "phone", label: "Phone Number", value: "—" },
                { icon: "schedule", label: "Timezone", value: "(UTC+05:30) Asia/Kolkata" },
                { icon: "language", label: "Language", value: "English" },
                { icon: "domain", label: "Department", value: "Platform Security" },
                { icon: "badge", label: "Role", value: "Super Administrator" },
                { icon: "shield", label: "Access Level", value: "Full Access" }
              ].map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "12px 0", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.4)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div style={{ color: "#fff", fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...card, padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, fontWeight: 700 }}>
              Permissions & Access
            </div>
            <div style={{ padding: "20px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { icon: "groups", iconBg: "rgba(99,102,241,0.1)", iconColor: "#818cf8", val: "12", label: "Roles Assigned" },
                  { icon: "verified_user", iconBg: "rgba(59,130,246,0.1)", iconColor: "#60a5fa", val: "256", label: "Permissions Granted" },
                  { icon: "grid_view", iconBg: "rgba(16,185,129,0.1)", iconColor: "#34d399", val: "All", label: "Modules Access" }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: stat.iconBg, color: stat.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{stat.icon}</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{stat.val}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Role Summary</div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", background: "rgba(99,102,241,0.15)", color: "#818cf8", borderRadius: 4 }}>Primary Role</span>
                </div>
                
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,0.15)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_police</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Super Administrator</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Full control over platform, security, users and all modules.</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>chevron_right</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Additional Roles</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: "security", label: "Security Administrator" },
                    { icon: "settings_suggest", label: "System Administrator" },
                    { icon: "history_edu", label: "Audit Viewer" }
                  ].map((role, i) => (
                    <div key={i} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>{role.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{role.label}</span>
                      </div>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>chevron_right</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Quick Actions */}
          <div style={{ ...card, padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, fontWeight: 700 }}>
              Quick Actions
            </div>
            <div style={{ padding: "12px 0" }}>
              {[
                { icon: "key", label: "Change Password" },
                { icon: "admin_panel_settings", label: "Security Settings" },
                { icon: "api", label: "Manage API Tokens" },
                { icon: "devices", label: "Active Sessions" }
              ].map((action, i) => (
                <div key={i} style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>{action.icon}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{action.label}</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>chevron_right</span>
                </div>
              ))}
              
              <div style={{ margin: "12px 20px 8px" }}>
                <button style={{ width: "100%", padding: "12px", background: "none", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div style={{ ...card, padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, fontWeight: 700 }}>
              Connected Devices
            </div>
            <div style={{ padding: "12px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "computer", label: "Windows • Chrome", isCurrent: true },
                  { icon: "desktop_mac", label: "macOS • Safari", time: "May 16, 2024 11:12 AM" },
                  { icon: "laptop_windows", label: "Ubuntu • Chrome", time: "May 15, 2024 09:31 PM" }
                ].map((device, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: device.isCurrent ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)", color: device.isCurrent ? "#818cf8" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{device.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: device.isCurrent ? "#fff" : "rgba(255,255,255,0.8)" }}>{device.label}</div>
                      {device.time && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{device.time}</div>}
                    </div>
                    {device.isCurrent && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#10b981" }}>This Device</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <button style={{ width: "100%", padding: "10px", background: "rgba(99,102,241,0.1)", border: "none", borderRadius: 8, color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  View All Sessions
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Recent Activity Table ────────────────────────────────────── */}
      <div style={{ ...card, padding: 0 }}>
        <div style={{ padding: "20px", fontSize: 14, fontWeight: 700 }}>
          Recent Activity
        </div>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ padding: "12px 20px", fontWeight: 500 }}>Event</th>
                <th style={{ padding: "12px 20px", fontWeight: 500 }}>Details</th>
                <th style={{ padding: "12px 20px", fontWeight: 500 }}>IP Address</th>
                <th style={{ padding: "12px 20px", fontWeight: 500 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: "Login Successful", detail: "Logged in from Windows • Chrome", ip: "117.198.34.12", time: "May 16, 2024 02:34 PM" },
                { event: "Password Changed", detail: "Password was changed successfully", ip: "117.198.34.12", time: "May 15, 2024 10:21 AM" },
                { event: "MFA Enabled", detail: "Multi-factor authentication enabled", ip: "117.198.34.12", time: "May 14, 2024 04:11 PM" },
                { event: "Role Updated", detail: "Roles and permissions updated", ip: "117.198.34.12", time: "May 13, 2024 09:45 AM" }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#10b981" }}>check_circle</span>
                      <span style={{ color: "rgba(255,255,255,0.9)" }}>{row.event}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{row.detail}</td>
                  <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>{row.ip}</td>
                  <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button style={{ background: "none", border: "none", color: "#818cf8", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            View All Activity
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </button>
        </div>
      </div>

    </div>
  );
}
