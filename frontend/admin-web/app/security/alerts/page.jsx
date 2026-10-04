"use client";
import React, { useState } from 'react';

export default function AdminSecurityAlerts() {
  const [filter, setFilter] = useState('all');

  const alerts = [
    { id: 1, severity: 'critical', title: 'Multiple failed admin logins', desc: 'Detected from IP 192.168.1.50 targeting admin accounts.', time: '10 mins ago', status: 'investigating' },
    { id: 2, severity: 'warning', title: 'Unusual traffic spike', desc: 'API requests exceeded threshold on /checkout endpoint.', time: '45 mins ago', status: 'open' },
    { id: 3, severity: 'high', title: 'Suspicious payload detected', desc: 'WAF blocked an SQL injection attempt on search API.', time: '2 hours ago', status: 'resolved' },
    { id: 4, severity: 'low', title: 'New login from unknown device', desc: 'User ID 4829 logged in from a new browser in Ukraine.', time: '5 hours ago', status: 'open' },
    { id: 5, severity: 'critical', title: 'DDoS Attempt Mitigated', desc: 'Cloudflare blocked volumetric attack on API gateway.', time: '1 day ago', status: 'resolved' },
  ];

  return (
    <div style={{ padding: '32px', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#f8fafc', fontSize: '28px', fontWeight: '700', margin: 0 }}>Security Alerts</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{ background: '#8C63F5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Export Logs</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => setFilter('all')} style={{ background: filter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>All Alerts</button>
        <button onClick={() => setFilter('critical')} style={{ background: filter === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Critical</button>
        <button onClick={() => setFilter('high')} style={{ background: filter === 'high' ? 'rgba(249, 115, 22, 0.2)' : 'transparent', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>High</button>
        <button onClick={() => setFilter('warning')} style={{ background: filter === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'transparent', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Warning</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {alerts.filter(a => filter === 'all' || a.severity === filter).map(alert => (
          <div key={alert.id} style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.07)', 
            borderLeft: `4px solid ${alert.severity === 'critical' ? '#ef4444' : alert.severity === 'high' ? '#f97316' : alert.severity === 'warning' ? '#f59e0b' : '#3b82f6'}`,
            borderRadius: '12px', 
            padding: '24px', 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ color: '#f8fafc', margin: 0 }}>{alert.title}</h3>
                <span style={{ 
                  fontSize: '12px', padding: '2px 8px', borderRadius: '12px',
                  background: alert.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: alert.status === 'resolved' ? '#10b981' : '#f59e0b'
                }}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>{alert.desc}</p>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{alert.time} • Alert ID: #{8000 + alert.id}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>View Details</button>
              {alert.status !== 'resolved' && (
                <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Mark Resolved</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
