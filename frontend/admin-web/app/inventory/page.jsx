"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../lib/api';

export default function InventoryPage() {
  const [kpis, setKpis] = useState([
    { label: 'Total Stock', value: '0', trend: '—', trendUp: null, color: '#FF8906', icon: '📦' },
    { label: 'Low Stock Items', value: '0', trend: '—', trendUp: null, color: '#F25F4C', icon: '⚠️' },
    { label: 'Out of Stock Items', value: '0', trend: '—', trendUp: null, color: '#E53170', icon: '🚫' },
    { label: 'Stock Value', value: '₹0', trend: '—', trendUp: null, color: '#2CB67D', icon: '💰' },
    { label: 'Items Sold', value: '0', trend: '—', trendUp: null, color: '#8C63F5', icon: '📈' },
  ]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStock, setEditingStock] = useState(null); // { sku, stock }

  const fetchData = async () => {
    try {
        const [statsRes, listRes] = await Promise.all([
          apiRequest('/admin/inventory/stats'),
          apiRequest('/admin/inventory?limit=500') // fetch enough for client side filtering
        ]);
        
        const stats = statsRes.kpis;
        setKpis([
          { label: 'Total Stock', value: stats.totalStock.value.toLocaleString(), trend: stats.totalStock.trend, trendUp: stats.totalStock.trendUp, color: '#FF8906', icon: '📦' },
          { label: 'Low Stock Items', value: stats.lowStock.value.toLocaleString(), trend: stats.lowStock.trend, trendUp: stats.lowStock.trendUp, color: '#F25F4C', icon: '⚠️' },
          { label: 'Out of Stock Items', value: stats.outOfStock.value.toLocaleString(), trend: stats.outOfStock.trend, trendUp: stats.outOfStock.trendUp, color: '#E53170', icon: '🚫' },
          { label: 'Stock Value', value: `₹${stats.stockValue.value.toLocaleString()}`, trend: stats.stockValue.trend, trendUp: stats.stockValue.trendUp, color: '#2CB67D', icon: '💰' },
          { label: 'Items Sold (30d)', value: stats.itemsSold.value.toLocaleString(), trend: stats.itemsSold.trend, trendUp: stats.itemsSold.trendUp, color: '#8C63F5', icon: '📈' },
        ]);

        setInventoryData(listRes.items || []);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStock = async (sku, newStock) => {
    try {
      await apiRequest(`/admin/inventory/${sku}`, { 
        method: "PATCH", 
        body: { stock: Number(newStock) }
      });
      setEditingStock(null);
      fetchData(); // Refresh data to accurately get new Available stock and statuses
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert(err.message || "Failed to update stock");
    }
  };

  const filteredData = inventoryData.filter(item => 
    item.product.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return { bg: 'rgba(44, 182, 125, 0.15)', text: '#2CB67D', border: '#2CB67D' };
      case 'Low Stock': return { bg: 'rgba(242, 95, 76, 0.15)', text: '#F25F4C', border: '#F25F4C' };
      case 'Out of Stock': return { bg: 'rgba(229, 49, 112, 0.15)', text: '#E53170', border: '#E53170' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#FFFFFF', border: '#FFFFFF' };
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0F0E17',
      color: '#FFFFFE',
      fontFamily: '"Inter", "Roboto", sans-serif',
      padding: '40px',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      margin: 0,
      background: 'linear-gradient(90deg, #FFFFFE 0%, #A7A9BE 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    actionBtn: {
      backgroundColor: '#FF8906',
      color: '#FFFFFE',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 14px 0 rgba(255, 137, 6, 0.39)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    kpiCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '24px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    },
    kpiHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      color: '#A7A9BE',
      fontSize: '0.95rem',
      fontWeight: '500',
    },
    kpiIcon: (color) => ({
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: `${color}20`, // 20% opacity
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.2rem',
      color: color,
    }),
    kpiValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      margin: '0 0 8px 0',
      color: '#FFFFFE',
    },
    kpiTrend: (trendUp) => ({
      fontSize: '0.85rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: trendUp === true ? '#2CB67D' : trendUp === false ? '#E53170' : '#A7A9BE',
    }),
    tableContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    },
    tableHeader: {
      padding: '24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tableTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: 0,
      color: '#FFFFFE',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
    },
    th: {
      padding: '16px 24px',
      color: '#A7A9BE',
      fontSize: '0.85rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    td: {
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
      color: '#FFFFFE',
      fontSize: '0.95rem',
    },
    tr: {
      transition: 'background-color 0.2s ease',
    },
    productName: {
      fontWeight: '500',
      marginBottom: '4px',
    },
    productId: {
      fontSize: '0.8rem',
      color: '#A7A9BE',
    },
    badge: (status) => {
      const colors = getStatusColor(status);
      return {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        display: 'inline-block',
      };
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Inventory Management</h1>
        <Link href="/products/new">
          <button style={styles.actionBtn}>+ Add Product</button>
        </Link>
      </div>

      <div style={styles.kpiGrid}>
        {kpis.map((kpi, index) => (
          <div key={index} style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span>{kpi.label}</span>
              <div style={styles.kpiIcon(kpi.color)}>{kpi.icon}</div>
            </div>
            <h2 style={styles.kpiValue}>{kpi.value}</h2>
            <div style={styles.kpiTrend(kpi.trendUp)}>
              {kpi.trendUp === true ? '↑' : kpi.trendUp === false ? '↓' : '—'} {kpi.trend} vs last month
            </div>
            {/* Decorative background glow */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: kpi.color,
              filter: 'blur(60px)',
              opacity: 0.15,
              zIndex: 0,
              pointerEvents: 'none',
            }} />
          </div>
        ))}
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Current Inventory</h3>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 16px',
              color: '#FFFFFE',
              outline: 'none',
              width: '250px',
            }}
          />
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Reserved</th>
              <th style={styles.th}>Available</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{...styles.td, textAlign: 'center'}}>Loading inventory...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="6" style={{...styles.td, textAlign: 'center'}}>No inventory found.</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr 
                  key={item.id} 
                  style={styles.tr}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={styles.td}>
                  <div style={styles.productName}>{item.product}</div>
                  <div style={styles.productId}>{item.sku}</div>
                </td>
                <td style={styles.td}>
                  {editingStock?.sku === item.sku ? (
                    <input 
                      type="number"
                      min="0"
                      value={editingStock.stock}
                      onChange={(e) => setEditingStock({ ...editingStock, stock: e.target.value })}
                      style={{
                        width: '80px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                      autoFocus
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td style={styles.td}>{item.reserved}</td>
                <td style={{...styles.td, fontWeight: '600'}}>{item.available}</td>
                <td style={styles.td}>
                  <span style={styles.badge(item.status)}>{item.status}</span>
                </td>
                <td style={styles.td}>
                  {editingStock?.sku === item.sku ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleUpdateStock(item.sku, editingStock.stock)}
                        style={{
                          background: '#2CB67D',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          padding: '6px 12px',
                          borderRadius: '6px'
                        }}
                      >Save</button>
                      <button 
                        onClick={() => setEditingStock(null)}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          padding: '6px 12px',
                          borderRadius: '6px'
                        }}
                      >Cancel</button>
                    </div>
                  ) : (
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#A7A9BE',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      transition: 'color 0.2s',
                    }}
                    onClick={() => setEditingStock({ sku: item.sku, stock: item.stock })}
                    onMouseOver={(e) => e.currentTarget.style.color = '#FF8906'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#A7A9BE'}
                    title="Edit Stock"
                    >
                      ✏️
                    </button>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
