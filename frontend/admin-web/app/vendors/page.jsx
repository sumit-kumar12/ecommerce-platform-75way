"use client";

import React from "react";

export default function AdminVendorsPage() {
  const vendors = [
    { id: "VND-482", name: "ElectroWorld Tech", email: "contact@electroworld.in", applied: "2026-06-15", documents: 3, status: "Pending Verification" },
    { id: "VND-481", name: "Fashion Hub", email: "sales@fashionhub.com", applied: "2026-06-14", documents: 1, status: "Missing Docs" },
    { id: "VND-479", name: "Organic Farms", email: "hello@organicfarms.org", applied: "2026-06-10", documents: 4, status: "Verified" },
  ];

  return (
    <div style={{ padding: "32px", color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: "#f8fafc", fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0" }}>Vendor Onboarding Queue</h1>
          <p style={{ margin: 0 }}>Review and verify merchant applications and KYC documents.</p>
        </div>
        <button style={{ background: "#8C63F5", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Invite Vendor</button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", color: "#f8fafc", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Vendor</th>
              <th style={{ padding: "16px 24px", color: "#f8fafc", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Date Applied</th>
              <th style={{ padding: "16px 24px", color: "#f8fafc", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>KYC Docs</th>
              <th style={{ padding: "16px 24px", color: "#f8fafc", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Status</th>
              <th style={{ padding: "16px 24px", color: "#f8fafc", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ color: "#f8fafc", fontWeight: "500", marginBottom: "4px" }}>{vendor.name}</div>
                  <div style={{ fontSize: "12px" }}>{vendor.email}</div>
                </td>
                <td style={{ padding: "16px 24px" }}>{vendor.applied}</td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#f8fafc" }}>{vendor.documents} Files</span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ 
                    padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500",
                    background: vendor.status === "Verified" ? "rgba(16, 185, 129, 0.1)" : vendor.status === "Pending Verification" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    color: vendor.status === "Verified" ? "#10b981" : vendor.status === "Pending Verification" ? "#f59e0b" : "#ef4444"
                  }}>
                    {vendor.status}
                  </span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <button style={{ background: "transparent", border: "1px solid #8C63F5", color: "#8C63F5", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>Review KYC</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
