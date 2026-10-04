"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { InputField } from "../../../components/ui/InputField";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import { useStoreCategories } from "../../../lib/useStoreCategories";
import { apiRequest } from "../../../lib/api";

export default function AccountSettingsPage() {
  const { categories } = useStoreCategories();
  
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    currentPassword: "",
    newPassword: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest("/users/me");
        if (data && data.user) {
          const nameParts = data.user.name ? data.user.name.split(" ") : ["", ""];
          setCustomerDetails({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            phone: data.user.phone || ""
          });
          setLoginDetails(prev => ({
            ...prev,
            email: data.user.email || ""
          }));
          setIsActive(data.user.isActive ?? true);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to load account settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveDetails = async () => {
    try {
      const name = `${customerDetails.firstName} ${customerDetails.lastName}`.trim();
      await apiRequest("/users/me", {
        method: "PATCH",
        body: { name, phone: customerDetails.phone || null }
      });
      setIsEditing(false);
      alert("Customer details updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update details");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await apiRequest("/users/me/change-password", {
        method: "POST",
        body: {
          currentPassword: loginDetails.currentPassword,
          newPassword: loginDetails.newPassword
        }
      });
      alert("Password updated successfully!");
      setLoginDetails({ ...loginDetails, currentPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.message || "Failed to update password");
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "40px 20px", minHeight: "80vh", maxWidth: "800px", margin: "0 auto" }}>
        
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", color: "#f8fafc", marginBottom: "8px" }}>Account Settings</h1>
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>Manage your personal information, login details, and verification status.</p>
        </header>

        {/* Customer Details */}
        <section style={{ marginBottom: "40px" }}>
          <SectionHeader 
            eyebrow="PROFILE" 
            title="Customer Details" 
            description="Your personal information used for orders and communication."
            icon="person"
          />
          <GlassPanel style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <InputField 
                label="First name" 
                value={customerDetails.firstName} 
                onChange={(e) => setCustomerDetails({...customerDetails, firstName: e.target.value})}
                disabled={!isEditing}
                icon="person"
              />
              <InputField 
                label="Last name" 
                value={customerDetails.lastName} 
                onChange={(e) => setCustomerDetails({...customerDetails, lastName: e.target.value})}
                disabled={!isEditing}
                icon="person"
              />
            </div>
            <InputField 
              label="Phone number" 
              value={customerDetails.phone} 
              onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
              disabled={!isEditing}
              icon="call"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              {isEditing ? (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    style={{ background: "transparent", color: "#94a3b8", border: "1px solid #475569", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <ButtonPrimary onClick={handleSaveDetails} icon="save">Save Changes</ButtonPrimary>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={{ background: "transparent", color: "#818cf8", border: "1px solid #818cf8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span> Modify Details
                </button>
              )}
            </div>
          </GlassPanel>
        </section>

        {/* Login Details */}
        <section style={{ marginBottom: "40px" }}>
          <SectionHeader 
            eyebrow="SECURITY" 
            title="Login Details" 
            description="Update your email address or change your password."
            icon="lock"
          />
          <GlassPanel style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField 
              label="Email address" 
              value={loginDetails.email} 
              onChange={(e) => setLoginDetails({...loginDetails, email: e.target.value})}
              disabled={true} // Usually requires a separate flow to change email
              icon="alternate_email"
            />
            <div style={{ borderTop: "1px solid #334155", margin: "8px 0", paddingTop: "24px" }}>
              <h3 style={{ color: "#f8fafc", fontSize: "16px", marginBottom: "16px" }}>Change Password</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <InputField 
                  label="Current password" 
                  type="password"
                  value={loginDetails.currentPassword} 
                  onChange={(e) => setLoginDetails({...loginDetails, currentPassword: e.target.value})}
                  icon="key"
                />
                <InputField 
                  label="New password" 
                  type="password"
                  value={loginDetails.newPassword} 
                  onChange={(e) => setLoginDetails({...loginDetails, newPassword: e.target.value})}
                  icon="password"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ButtonPrimary 
                  onClick={handleUpdatePassword} 
                  disabled={!loginDetails.currentPassword || !loginDetails.newPassword}
                  icon="update"
                >
                  Update Password
                </ButtonPrimary>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* Verification */}
        <section>
          <SectionHeader 
            eyebrow="STATUS" 
            title="Account Verification" 
            description="Your current identity and account standing."
            icon="verified_user"
          />
          <GlassPanel style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: isActive ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)", color: isActive ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>{isActive ? "verified" : "gpp_bad"}</span>
              </div>
              <div>
                <h3 style={{ color: "#f8fafc", margin: "0 0 4px 0", fontSize: "16px" }}>{isActive ? "Verified Customer" : "Account Suspended/Inactive"}</h3>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>{isActive ? "Your email and identity have been verified." : "Your account requires attention."}</p>
              </div>
            </div>
            <div style={{ background: isActive ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)", color: isActive ? "#4ade80" : "#f87171", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </div>
          </GlassPanel>
        </section>

      </div>
  );
}
