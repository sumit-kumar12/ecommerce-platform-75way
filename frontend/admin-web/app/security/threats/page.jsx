"use client";
import React from 'react';

export default function AdminSecurityThreats() {
  return (
    <div style={{ padding: '32px', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#f8fafc', fontSize: '28px', fontWeight: '700', margin: 0 }}>Threat Intelligence</h1>
        <button style={{ background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Generate Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: '#f8fafc', marginTop: 0, fontSize: '16px', color: '#94a3b8' }}>Total Threats Blocked (30d)</h2>
          <p style={{ color: '#8C63F5', fontSize: '48px', fontWeight: '800', margin: '16px 0 0 0' }}>12,404</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: '#f8fafc', marginTop: 0, fontSize: '16px', color: '#94a3b8' }}>Malicious IPs Banned</h2>
          <p style={{ color: '#ef4444', fontSize: '48px', fontWeight: '800', margin: '16px 0 0 0' }}>842</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: '#f8fafc', marginTop: 0, fontSize: '16px', color: '#94a3b8' }}>DDoS Attacks Mitigated</h2>
          <p style={{ color: '#00DAFF', fontSize: '48px', fontWeight: '800', margin: '16px 0 0 0' }}>14</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '24px' }}>Attack Vectors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#f8fafc' }}>SQL Injection</span><span>45%</span></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '45%', background: '#ef4444' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#f8fafc' }}>Cross-Site Scripting (XSS)</span><span>28%</span></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '28%', background: '#f97316' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#f8fafc' }}>Brute Force</span><span>15%</span></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '15%', background: '#f59e0b' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#f8fafc' }}>Path Traversal</span><span>12%</span></div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '12%', background: '#8C63F5' }}></div></div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '24px' }}>Top Origin Countries</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Country</th>
                <th style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>Incidents</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>🇷🇺 Russia</td><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right', color: '#ef4444', fontWeight: '600' }}>3,492</td></tr>
              <tr><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>🇨🇳 China</td><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right', color: '#f97316', fontWeight: '600' }}>2,810</td></tr>
              <tr><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>🇺🇸 United States</td><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right', color: '#f59e0b', fontWeight: '600' }}>1,154</td></tr>
              <tr><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>🇧🇷 Brazil</td><td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right', color: '#eab308', fontWeight: '600' }}>892</td></tr>
              <tr><td style={{ padding: '16px 0', color: '#f8fafc' }}>🇺🇦 Ukraine</td><td style={{ padding: '16px 0', textAlign: 'right', color: '#eab308', fontWeight: '600' }}>420</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
