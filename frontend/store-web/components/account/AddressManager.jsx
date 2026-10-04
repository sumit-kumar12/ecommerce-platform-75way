"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddressManager.module.css";
import { apiRequest } from "../../lib/api";

export function AddressManager({ onSelectAddress, selectedAddressId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "Home",
    isDefault: false,
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "India"
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/users/me"); // Verify auth implicitly if needed
      const result = await apiRequest("/addresses");
      setAddresses(result.data.addresses);
      setError(null);
    } catch (err) {
      if (err?.status === 401 || err?.code === "AUTH_REQUIRED") {
        setAddresses([]);
      } else {
        console.error(err);
        setError("Failed to load addresses.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId && onSelectAddress) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddr) {
        onSelectAddress(defaultAddr);
      }
    }
  }, [addresses, selectedAddressId, onSelectAddress]);

  const openModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setForm({ ...addr });
    } else {
      setEditingAddress(null);
      setForm({
        type: "Home",
        isDefault: addresses.length === 0,
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "India"
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAddress) {
        await apiRequest(`/addresses/${editingAddress.id}`, {
          method: "PATCH",
          body: form
        });
      } else {
        await apiRequest("/addresses", {
          method: "POST",
          body: form
        });
      }
      await fetchAddresses();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (id, e) => {
    e.stopPropagation();
    setAddressToDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!addressToDeleteId) return;
    try {
      await apiRequest(`/addresses/${addressToDeleteId}`, { method: "DELETE" });
      await fetchAddresses();
      setAddressToDeleteId(null);
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  if (loading && addresses.length === 0) {
    return <div style={{ color: "#94a3b8", padding: "20px" }}>Loading addresses...</div>;
  }

  return (
    <section className={styles.addressSection}>
      <div className={styles.addressHeader}>
        <div className={styles.headerLeft}>
          <span className={`material-symbols-outlined ${styles.headerIcon}`}>location_on</span>
          <div>
            <h2>Shipping Addresses</h2>
            <p>Manage your delivery addresses for a faster checkout experience.</p>
          </div>
        </div>
        <button className={styles.addAddressBtn} onClick={() => openModal()}>
          <span className="material-symbols-outlined">add</span> Add New Address
        </button>
      </div>

      {error && <div style={{ color: "#f87171", marginBottom: "16px" }}>{error}</div>}

      <div className={styles.addressContainer}>
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          const cardClass = [
            styles.addressCard,
            addr.isDefault || isSelected ? styles.addressCardDefault : ""
          ].join(" ").trim();

          return (
            <div key={addr.id} className={cardClass} onClick={() => onSelectAddress && onSelectAddress(addr)}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <span className="material-symbols-outlined">
                    {addr.type === "Home" ? "home" : addr.type === "Work" ? "work" : "location_city"}
                  </span>
                </div>
                {addr.isDefault ? (
                  <span className={styles.defaultBadge}>Default</span>
                ) : null}
              </div>
              
              <h3>{addr.type}</h3>
              
              <div className={styles.info}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>person</span> 
                {addr.name}
              </div>
              <div className={styles.info}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>phone</span> 
                {addr.phone}
              </div>
              <div className={styles.info}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>location_on</span>
                <div>
                  {addr.line1}<br />
                  {addr.line2 && <>{addr.line2}<br /></>}
                  {addr.city}, {addr.region} {addr.postalCode}
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.editBtn} 
                  onClick={(e) => { e.stopPropagation(); openModal(addr); }}
                >
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>edit</span> Edit
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={(e) => openDeleteModal(addr.id, e)}
                >
                  <span className="material-symbols-outlined" style={{fontSize: "18px"}}>delete</span> Delete
                </button>
              </div>
            </div>
          );
        })}

        <div className={styles.addNewCard} onClick={() => openModal()}>
          <div className={styles.addCircle}>
            <span className="material-symbols-outlined">add</span>
          </div>
          <h3>Add New Address</h3>
          <p>Add a new address for delivery to a different location.</p>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select 
                    value={form.type} 
                    onChange={e => setForm({...form, type: e.target.value})}
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroupCheckbox}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.isDefault}
                      onChange={e => setForm({...form, isDefault: e.target.checked})}
                    />
                    Set as Default
                  </label>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Address Line 1</label>
                <input type="text" value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Address Line 2 (Optional)</label>
                <input type="text" value={form.line2 || ""} onChange={e => setForm({...form, line2: e.target.value})} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City</label>
                  <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Region/State</label>
                  <input type="text" value={form.region} onChange={e => setForm({...form, region: e.target.value})} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Postal Code</label>
                  <input type="text" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Country</label>
                  <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} required />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      {addressToDeleteId && (
        <div className={styles.kbModal}>
          <div className={styles.kbModalCard}>
            <button className={styles.kbClose} onClick={() => setAddressToDeleteId(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className={styles.kbIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: "40px" }}>warning</span>
            </div>
            <h3>Delete <span>Address</span></h3>
            <p>This address will be permanently removed<br />from your account.</p>
            <div className={styles.kbActions}>
              <button className={styles.kbCancel} onClick={() => setAddressToDeleteId(null)}>Cancel</button>
              <button className={styles.kbDelete} onClick={confirmDelete}>
                <span className="material-symbols-outlined">delete</span> Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
