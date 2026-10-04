"use client";

import React, { useState } from "react";

export default function AdminModerationPage() {
  const [filter, setFilter] = useState("pending");

  const items = [
    { id: "MOD-101", type: "Product Review", content: "This product is a scam! Do not buy!", user: "angry_user99", status: "pending", date: "2026-06-15" },
    { id: "MOD-102", type: "Product Listing", content: "Gucci Fake Bag 100% Real", user: "sketchy_vendor", status: "pending", date: "2026-06-14" },
    { id: "MOD-103", type: "User Comment", content: "Check out my site at bad-link.com", user: "spammer1", status: "rejected", date: "2026-06-10" },
  ];

  return (
    <div style={{ padding: "32px", color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ color: "#f8fafc", fontSize: "28px", fontWeight: "700", margin: 0 }}>Content Moderation Queue</h1>
        <button style={{ background: "#8C63F5", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Auto-Mod Settings</button>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <button onClick={() => setFilter("pending")} style={{ background: filter === "pending" ? "rgba(245, 158, 11, 0.2)" : "transparent", color: filter === "pending" ? "#f59e0b" : "#f8fafc", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Pending Review</button>
        <button onClick={() => setFilter("approved")} style={{ background: filter === "approved" ? "rgba(16, 185, 129, 0.2)" : "transparent", color: filter === "approved" ? "#10b981" : "#f8fafc", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Approved</button>
        <button onClick={() => setFilter("rejected")} style={{ background: filter === "rejected" ? "rgba(239, 68, 68, 0.2)" : "transparent", color: filter === "rejected" ? "#ef4444" : "#f8fafc", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Rejected</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {items.filter(i => i.status === filter).map(item => (
          <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{ color: "#00DAFF", fontWeight: "600" }}>{item.type}</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{item.id} • {item.date}</span>
              </div>
              <p style={{ color: "#f8fafc", margin: "0 0 8px 0", fontSize: "16px" }}>"{item.content}"</p>
              <div style={{ fontSize: "12px" }}>Reported User: <span style={{ color: "#8C63F5" }}>@{item.user}</span></div>
            </div>
            {item.status === "pending" && (
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>Approve</button>
                <button style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>Reject & Delete</button>
              </div>
            )}
          </div>
        ))}
        {items.filter(i => i.status === filter).length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p>No items in this queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
