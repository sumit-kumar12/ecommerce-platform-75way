"use client";
import React from 'react';

export default function AdminSecurityDashboard() {
  return (
    <div style={{ padding: '32px', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#f8fafc', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>SOC Dashboard</h1>
          <p style={{ margin: 0 }}>KataBazaar Security Operations Center</p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
          System Secure - No Active Breaches
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#94a3b8' }}>Overall Security Score</h3>
          <p style={{ color: '#10b981', fontSize: '42px', fontWeight: '800', margin: '0' }}>92<span style={{ fontSize: '20px', color: '#64748b' }}>/100</span></p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', background: '#10b981', width: '92%' }}></div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#94a3b8' }}>Active Threats Blocked</h3>
          <p style={{ color: '#8C63F5', fontSize: '42px', fontWeight: '800', margin: '0' }}>1,204</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#ef4444' }}>↑ 15% from last week</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#94a3b8' }}>Failed Logins (24h)</h3>
          <p style={{ color: '#f59e0b', fontSize: '42px', fontWeight: '800', margin: '0' }}>342</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#10b981' }}>↓ 5% from last week</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#94a3b8' }}>Open Vulnerabilities</h3>
          <p style={{ color: '#00DAFF', fontSize: '42px', fontWeight: '800', margin: '0' }}>0</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748b' }}>All patched</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '24px' }}>Global Threat Map</h2>
          <div style={{ width: '100%', height: '300px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '40%', left: '20%', width: '12px', height: '12px', background: 'rgba(239, 68, 68, 0.5)', borderRadius: '50%', boxShadow: '0 0 20px #ef4444', animation: 'pulse 2s infinite' }}></div>
            <div style={{ position: 'absolute', top: '30%', left: '60%', width: '8px', height: '8px', background: 'rgba(245, 158, 11, 0.5)', borderRadius: '50%', boxShadow: '0 0 15px #f59e0b', animation: 'pulse 3s infinite' }}></div>
            <div style={{ position: 'absolute', top: '60%', left: '80%', width: '16px', height: '16px', background: 'rgba(140, 99, 245, 0.5)', borderRadius: '50%', boxShadow: '0 0 25px #8C63F5', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: '14px' }}>Map Visualization Layer</div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '24px' }}>Recent Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc' }}>Brute Force Attempt</h4>
              <p style={{ margin: 0, fontSize: '12px' }}>Multiple failed admin logins from 192.168.1.50</p>
              <span style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px', display: 'block' }}>10 mins ago</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc' }}>Unusual Traffic Spike</h4>
              <p style={{ margin: 0, fontSize: '12px' }}>API requests exceeded threshold on /checkout</p>
              <span style={{ fontSize: '10px', color: '#f59e0b', marginTop: '8px', display: 'block' }}>45 mins ago</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid #10b981', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc' }}>System Patch Applied</h4>
              <p style={{ margin: 0, fontSize: '12px' }}>Security patch v1.4.2 successfully deployed</p>
              <span style={{ fontSize: '10px', color: '#10b981', marginTop: '8px', display: 'block' }}>2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
