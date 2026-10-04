"use client";

import { useCallback, useEffect, useState } from "react";
import { adminRequest } from "../../lib/api";
import styles from "./page.module.css";

/* ── helpers ─────────────────────────────────────────────────── */
function fmt(v) {
  if (!v) return "--";
  return new Date(v).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function SeverityBadge({ level }) {
  const map = {
    Low: styles.badgeLow, Medium: styles.badgeMedium,
    High: styles.badgeHigh, Critical: styles.badgeCritical,
  };
  return <span className={`${styles.badge} ${map[level] || styles.badgeLow}`}>{level}</span>;
}

function StatusBadge({ status }) {
  const map = {
    Active: styles.statusActive, Draft: styles.statusDraft,
    Archived: styles.statusArchived, Disabled: styles.statusDisabled,
    Success: styles.statusActive, Failed: styles.statusCritical,
    Blocked: styles.statusCritical,
  };
  return <span className={`${styles.statusBadge} ${map[status] || ""}`}>{status}</span>;
}

function StatCard({ label, value, delta, icon, accent }) {
  const isPos = delta && !delta.startsWith("-");
  return (
    <div className={styles.statCard} style={{ "--accent": accent }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statBody}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        {delta && (
          <div className={`${styles.statDelta} ${isPos ? styles.deltaPos : styles.deltaNeg}`}>
            {isPos ? "▲" : "▼"} {delta}
          </div>
        )}
      </div>
    </div>
  );
}

const PANELS = [
  "Audit Logs", "Security Policies", "Emergency Controls",
  "Login Monitoring", "Threat Rules", "Access Management",
];

/* ── mock data ───────────────────────────────────────────────── */
const MOCK_LOGS = [
  { time: "Jun 06 10:24 AM", user: "rahul.sharma", action: "Login Success", resource: "Admin Panel", ip: "103.21.45.67", severity: "Low" },
  { time: "Jun 06 10:23 AM", user: "priya.verma", action: "Update User", resource: "User: ankit.singh", ip: "103.21.45.67", severity: "Medium" },
  { time: "Jun 06 10:22 AM", user: "system", action: "Policy Created", resource: "MFA Policy", ip: "--", severity: "Medium" },
  { time: "Jun 06 10:21 AM", user: "ankit.singh", action: "Login Success", resource: "Admin Panel", ip: "198.51.100.23", severity: "High" },
  { time: "Jun 06 10:20 AM", user: "neha.patil", action: "Delete Role", resource: "Role: Manager", ip: "203.0.113.45", severity: "High" },
  { time: "Jun 06 10:19 AM", user: "system", action: "API Key Created", resource: "Service: Payment", ip: "--", severity: "Medium" },
  { time: "Jun 06 10:18 AM", user: "vikram.singh", action: "Access Denied", resource: "Settings", ip: "198.51.100.23", severity: "High" },
  { time: "Jun 06 10:17 AM", user: "rahul.sharma", action: "Export Data", resource: "Audit Logs", ip: "103.21.45.67", severity: "Low" },
];

const MOCK_POLICIES = [
  { name: "Password Policy", category: "Access Control", status: "Active", updated: "Jun 06, 2024", by: "Rahul Sharma" },
  { name: "Multi-Factor Auth Policy", category: "Access Control", status: "Active", updated: "Jun 05, 2024", by: "Priya Verma" },
  { name: "Session Timeout Policy", category: "Session Management", status: "Active", updated: "Jun 05, 2024", by: "Rahul Sharma" },
  { name: "IP Whitelisting Policy", category: "Network Security", status: "Active", updated: "Jun 04, 2024", by: "Ankit Singh" },
  { name: "Data Retention Policy", category: "Data Protection", status: "Active", updated: "Jun 03, 2024", by: "Neha Patil" },
  { name: "API Security Policy", category: "Application Security", status: "Active", updated: "Jun 02, 2024", by: "Vikram Singh" },
  { name: "Device Management Policy", category: "Access Control", status: "Draft", updated: "May 31, 2024", by: "Priya Verma" },
  { name: "Third Party Access Policy", category: "Access Control", status: "Draft", updated: "May 30, 2024", by: "Ankit Singh" },
];

const MOCK_EMERG_LOGS = [
  { time: "Jun 05 09:15 AM", user: "Rahul Sharma", action: "Revoke All Sessions", status: "Success" },
  { time: "Jun 05 06:42 AM", user: "System", action: "IP Blocklist Mode Enabled", status: "Success" },
  { time: "Jun 05 11:30 PM", user: "Priya Verma", action: "Lock All Accounts", status: "Failed" },
  { time: "Jun 05 11:28 PM", user: "System", action: "Maintenance Mode Enabled", status: "Success" },
];

const MOCK_LOGINS = [
  { time: "Jun 06 10:24 AM", user: "rahul.sharma", ip: "103.21.45.67", location: "Mumbai, India", device: "Chrome/Windows", status: "Success" },
  { time: "Jun 06 10:23 AM", user: "ankit.singh", ip: "198.51.100.23", location: "Unknown", device: "Firefox/Linux", status: "Failed" },
  { time: "Jun 06 10:22 AM", user: "priya.verma", ip: "203.0.113.45", location: "Moscow, Russia", device: "Chrome/Windows", status: "Blocked" },
  { time: "Jun 06 10:21 AM", user: "neha.patil", ip: "113.107.45.67", location: "New Delhi, India", device: "Safari/iOS", status: "Success" },
  { time: "Jun 06 10:20 AM", user: "vikram.singh", ip: "185.220.101.12", location: "Beijing, China", device: "Chrome/Windows", status: "Failed" },
];

const TOP_LOCATIONS = [
  { flag: "🇺🇸", country: "United States", count: 245 },
  { flag: "🇷🇺", country: "Russia", count: 198 },
  { flag: "🇨🇳", country: "China", count: 156 },
  { flag: "🇮🇳", country: "India", count: 132 },
  { flag: "🇧🇷", country: "Brazil", count: 98 },
];

const MOCK_RULES = [
  { name: "Brute Force Detection", type: "Brute Force", severity: "High", status: "Active", triggered: "Jun 06 10:15 AM" },
  { name: "Suspicious IP Access", type: "IP Reputation", severity: "High", status: "Active", triggered: "Jun 06 09:45 AM" },
  { name: "SQL Injection Attempt", type: "Attack Pattern", severity: "Critical", status: "Active", triggered: "Jun 06 08:32 AM" },
  { name: "XSS Attack Detection", type: "Attack Pattern", severity: "Medium", status: "Active", triggered: "Jun 06 07:22 AM" },
  { name: "Multiple Failed Logins", type: "Behavioral", severity: "High", status: "Active", triggered: "Jun 06 06:15 AM" },
  { name: "Abnormal Data Access", type: "Data Access", severity: "Medium", status: "Active", triggered: "Jun 06 05:42 AM" },
  { name: "Unauthorized API Access", type: "API Security", severity: "High", status: "Active", triggered: "Jun 06 04:31 AM" },
  { name: "Malware Upload Attempt", type: "File Analysis", severity: "Critical", status: "Active", triggered: "Jun 06 03:18 AM" },
  { name: "Privilege Escalation", type: "Behavioral", severity: "Critical", status: "Disabled", triggered: "--" },
  { name: "DDoS Detection", type: "Network", severity: "High", status: "Active", triggered: "Jun 06 02:09 AM" },
];

const MOCK_USERS = [
  { initials: "RS", name: "Rahul Sharma", email: "rahul.sharma@katabazaar.com", role: "Super Admin", status: "Active", lastLogin: "Jun 06 10:24 AM" },
  { initials: "PV", name: "Priya Verma", email: "priya.verma@katabazaar.com", role: "Security Admin", status: "Active", lastLogin: "Jun 06 10:23 AM" },
  { initials: "AS", name: "Ankit Singh", email: "ankit.singh@katabazaar.com", role: "Analyst", status: "Active", lastLogin: "Jun 06 10:22 AM" },
  { initials: "NP", name: "Neha Patil", email: "neha.patil@katabazaar.com", role: "Analyst", status: "Active", lastLogin: "Jun 06 10:20 AM" },
  { initials: "VS", name: "Vikram Singh", email: "vikram.singh@katabazaar.com", role: "Incident Responder", status: "Active", lastLogin: "Jun 06 09:58 AM" },
  { initials: "AJ", name: "Arjun Jain", email: "arjun.jain@katabazaar.com", role: "Viewer", status: "Inactive", lastLogin: "May 31, 2024" },
  { initials: "MS", name: "Meera Shah", email: "meera.shah@katabazaar.com", role: "Analyst", status: "Active", lastLogin: "Jun 05 06:32 PM" },
  { initials: "SA", name: "System Account", email: "system@katabazaar.com", role: "Service Account", status: "Active", lastLogin: "--" },
];

/* ── Panel Components ─────────────────────────────────────────── */
function AuditLogsPanel() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    adminRequest("/audit").then(res => {
      const data = res.data || res;
      setLogs(data.map(l => ({
        time: new Date(l.createdAt).toLocaleString(),
        user: l.actorId || 'system',
        action: l.action,
        resource: l.targetType || '--',
        ip: l.ipAddress || '--',
        severity: l.severity || 'Medium'
      })));
    }).catch(console.error);
  }, []);

  return (
    <div className={styles.panelContent}>
      <div className={styles.statGrid4}>
        <StatCard label="Total Logs" value="1,248,560" delta="+12.5% vs last 7 days" icon="📋" accent="#7C3AED" />
        <StatCard label="Critical Events" value="2,345" delta="+8.3% vs last 7 days" icon="🚨" accent="#ef4444" />
        <StatCard label="Failed Access" value="8,452" delta="+6.7% vs last 7 days" icon="🚫" accent="#f59e0b" />
        <StatCard label="Admin Actions" value="15,672" delta="+14.2% vs last 7 days" icon="⚡" accent="#22c55e" />
      </div>
      <div className={styles.tableToolbar}>
        <input className={styles.searchInput} placeholder="Search by user, action, resource, IP..." />
        <div className={styles.toolbarActions}>
          <button className={styles.btnOutline}>⚙ Filters</button>
          <button className={styles.btnOutline}>↑ Export</button>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Time</th><th>User</th><th>Action</th><th>Resource</th><th>IP Address</th><th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {(logs.length > 0 ? logs : []).slice(0, 50).map((r, i) => (
              <tr key={i}>
                <td>{r.time}</td>
                <td><span className={styles.userChip}>{r.user}</span></td>
                <td>{r.action}</td>
                <td className={styles.textMuted}>{r.resource}</td>
                <td className={styles.monoText}>{r.ip}</td>
                <td><SeverityBadge level={r.severity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>Showing 1 to 8 of 1,248,560 logs</span>
        <div className={styles.pageButtons}>
          {[1,2,3,4,5].map(p => (
            <button key={p} className={`${styles.pageBtn} ${p===1 ? styles.pageBtnActive : ""}`}>{p}</button>
          ))}
          <span className={styles.pageEllipsis}>...</span>
          <button className={styles.pageBtn}>156,070</button>
        </div>
      </div>
    </div>
  );
}

function SecurityPoliciesPanel() {
  const [tab, setTab] = useState("Active Policies");
  const [policies, setPolicies] = useState([]);
  useEffect(() => {
    adminRequest("/compliance/policies").then(res => {
      const rows = res?.data || res?.policies || [];
      setPolicies(rows.map(p => ({
        name: p.name,
        category: p.category,
        status: p.status,
        updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-IN') : '--',
        by: p.updatedBy?.name || 'System',
      })));
    }).catch(console.error);
  }, []);

  const filtered = policies.filter(p =>
    tab === "Active Policies" ? p.status === "Active" :
    tab === "Draft Policies" ? p.status === "Draft" : p.status === "Archived"
  );
  const active = policies.filter(p => p.status === "Active").length;
  const draft = policies.filter(p => p.status === "Draft").length;

  return (
    <div className={styles.panelContent}>
      <div className={styles.panelActionRow}>
        <div className={styles.tabGroup}>
          {["Active Policies","Draft Policies","Archived Policies"].map(t => (
            <button key={t} className={`${styles.tab} ${tab===t ? styles.tabActive : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <button className={styles.btnPrimary}>+ Create Policy</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead>
            <tr><th>Policy Name</th><th>Category</th><th>Status</th><th>Last Updated</th><th>Updated By</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center',color:'#64748b',padding:'24px'}}>No policies found.</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={i}>
                <td className={styles.policyName}>{p.name}</td>
                <td>{p.category}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>{p.updated}</td>
                <td>{p.by}</td>
                <td><button className={styles.actionDots}>···</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.statRow4}>
        <div className={styles.miniStat}><span className={styles.miniStatVal}>{policies.length}</span><span className={styles.miniStatLabel}>Total Policies</span></div>
        <div className={styles.miniStat}><span className={styles.miniStatVal}>{active}</span><span className={styles.miniStatLabel}>Active Policies</span></div>
        <div className={`${styles.miniStat} ${styles.miniStatWarn}`}><span className={styles.miniStatVal}>{draft}</span><span className={styles.miniStatLabel}>Draft Policies</span></div>
        <div className={`${styles.miniStat} ${styles.miniStatDanger}`}><span className={styles.miniStatVal}>{policies.length - active - draft}</span><span className={styles.miniStatLabel}>Archived/Expired</span></div>
      </div>
    </div>
  );
}

function EmergencyControlsPanel() {
  const [emergMode, setEmergMode] = useState(false);
  const [blocklistMode, setBlocklistMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  return (
    <div className={styles.panelContent}>
      <div className={`${styles.emergBanner} ${emergMode ? styles.emergActive : styles.emergInactive}`}>
        <div className={styles.emergBannerLeft}>
          <span className={styles.emergIcon}>⚠</span>
          <div>
            <div className={styles.emergTitle}>Emergency Access Mode: {emergMode ? "ENABLED" : "Disabled"}</div>
            <div className={styles.emergDesc}>Enable emergency access mode to restrict systems in critical situations.</div>
          </div>
        </div>
        <button className={emergMode ? styles.btnDanger : styles.btnPrimary} onClick={() => setEmergMode(v => !v)}>
          {emergMode ? "Disable Mode" : "Enable Mode"}
        </button>
      </div>

      <div className={styles.emergActions}>
        {[
          { icon: "🔒", title: "Lock All Accounts", desc: "Lock all user accounts immediately.", label: "Lock Accounts", danger: true },
          { icon: "↺", title: "Revoke All Sessions", desc: "Revoke all active user sessions.", label: "Revoke Sessions", danger: false },
          { icon: "🚫", title: "Disable API Access", desc: "Disable all active API tokens.", label: "Disable API", danger: false },
        ].map(a => (
          <div key={a.label} className={styles.emergActionCard}>
            <div className={styles.emergActionIcon}>{a.icon}</div>
            <div className={styles.emergActionTitle}>{a.title}</div>
            <div className={styles.emergActionDesc}>{a.desc}</div>
            <button className={a.danger ? styles.btnDangerSm : styles.btnOutlineSm}>{a.label}</button>
          </div>
        ))}
      </div>

      <div className={styles.emergToggles}>
        {[
          { icon: "🌐", title: "IP Blocklist Mode", desc: "Block all IPs except whitelisted.", val: blocklistMode, set: setBlocklistMode, danger: false },
          { icon: "🔧", title: "Maintenance Mode", desc: "Put system into maintenance mode.", val: maintenanceMode, set: setMaintenanceMode, danger: false },
          { icon: "⚡", title: "System Shutdown", desc: "Safely shutdown all services.", val: false, set: () => {}, danger: true },
        ].map(t => (
          <div key={t.title} className={styles.emergToggleCard}>
            <span className={styles.emergToggleIcon}>{t.icon}</span>
            <div className={styles.emergToggleInfo}>
              <div className={styles.emergToggleTitle}>{t.title}</div>
              <div className={styles.emergToggleDesc}>{t.desc}</div>
            </div>
            <button className={t.danger ? styles.btnDangerSm : styles.btnOutlineSm} onClick={() => t.set(v => !v)}>
              {t.danger ? "Shutdown" : t.val ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.emergLogsHeader}>
        <span>Emergency Logs</span>
        <button className={styles.linkBtn}>View All Emergency Logs →</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Status</th></tr></thead>
          <tbody>
            {MOCK_EMERG_LOGS.map((l, i) => (
              <tr key={i}>
                <td>{l.time}</td><td>{l.user}</td><td>{l.action}</td>
                <td><StatusBadge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoginMonitoringPanel() {
  const [logins, setLogins] = useState([]);
  useEffect(() => {
    adminRequest("/monitoring/failed-logins").then(res => {
      const data = res.data || res;
      setLogins(data.map(l => ({
        time: new Date(l.createdAt).toLocaleString(),
        user: l.actorId || l.metadata?.email || '--',
        ip: l.ipAddress || '--',
        location: l.metadata?.location || 'Unknown',
        device: l.metadata?.userAgent || 'Unknown',
        status: 'Failed'
      })));
    }).catch(console.error);
  }, []);

  return (
    <div className={styles.panelContent}>
      <div className={styles.statGrid4}>
        <StatCard label="Successful Logins" value="12,456" delta="+18.3% vs last 7 days" icon="✅" accent="#22c55e" />
        <StatCard label="Failed Logins" value="1,248" delta="+22.4% vs last 7 days" icon="❌" accent="#ef4444" />
        <StatCard label="Suspicious Logins" value="342" delta="+18.6% vs last 7 days" icon="⚠️" accent="#f59e0b" />
        <StatCard label="Blocked Logins" value="256" delta="+12.8% vs last 7 days" icon="🚫" accent="#7C3AED" />
      </div>
      <div className={styles.loginGrid}>
        <div className={styles.loginChartCard}>
          <div className={styles.cardTitle}>Login Attempts Over Time</div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartLegend}>
              <span className={styles.legendDot} style={{"--c":"#22c55e"}} />Successful
              <span className={styles.legendDot} style={{"--c":"#ef4444"}} />Failed
              <span className={styles.legendDot} style={{"--c":"#f59e0b"}} />Suspicious
            </div>
            <svg viewBox="0 0 400 120" className={styles.sparkSvg} preserveAspectRatio="none">
              <polyline points="0,90 67,70 133,60 200,80 267,50 333,40 400,45" fill="none" stroke="#22c55e" strokeWidth="2" />
              <polyline points="0,100 67,95 133,90 200,85 267,80 333,75 400,80" fill="none" stroke="#ef4444" strokeWidth="2" />
              <polyline points="0,110 67,108 133,105 200,100 267,95 333,90 400,92" fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>
            <div className={styles.chartLabels}>
              {["May 31","Jun 1","Jun 2","Jun 3","Jun 4","Jun 5","Jun 6"].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>
        <div className={styles.locationCard}>
          <div className={styles.cardTitle}>Top Failed Login Locations</div>
          {TOP_LOCATIONS.map(l => (
            <div key={l.country} className={styles.locationRow}>
              <span className={styles.flag}>{l.flag}</span>
              <span className={styles.locationName}>{l.country}</span>
              <div className={styles.locationBar}><div className={styles.locationFill} style={{width:`${(l.count/245)*100}%`}} /></div>
              <span className={styles.locationCount}>{l.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <span className={styles.cardTitle}>Recent Login Attempts</span>
          <button className={styles.linkBtn}>View All Login Attempts →</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead><tr><th>Time</th><th>User</th><th>IP Address</th><th>Location</th><th>Device</th><th>Status</th></tr></thead>
            <tbody>
              {(logins.length > 0 ? logins : MOCK_LOGINS).map((l, i) => (
                <tr key={i}>
                  <td>{l.time}</td>
                  <td><span className={styles.userChip}>{l.user}</span></td>
                  <td className={styles.monoText}>{l.ip}</td>
                  <td>{l.location}</td>
                  <td className={styles.textMuted}>{l.device}</td>
                  <td><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ThreatRulesPanel() {
  const [rules, setRules] = useState([]);
  useEffect(() => {
    adminRequest("/threat/rules").then(res => {
      const data = res.data || res;
      setRules(data.map(r => ({
        name: r.name || r.id,
        type: r.type || 'General',
        severity: r.severity || 'Medium',
        status: r.isActive ? 'Active' : 'Disabled',
        triggered: '--'
      })));
    }).catch(console.error);
  }, []);

  return (
    <div className={styles.panelContent}>
      <div className={styles.panelActionRow}>
        <div />
        <button className={styles.btnPrimary}>+ Create Rule</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead><tr><th>Rule Name</th><th>Type</th><th>Severity</th><th>Status</th><th>Last Triggered</th><th>Actions</th></tr></thead>
          <tbody>
            {(rules.length > 0 ? rules : MOCK_RULES).map((r, i) => (
              <tr key={i}>
                <td className={styles.ruleName}>{r.name}</td>
                <td className={styles.textMuted}>{r.type}</td>
                <td><SeverityBadge level={r.severity} /></td>
                <td><StatusBadge status={r.status} /></td>
                <td className={styles.textMuted}>{r.triggered}</td>
                <td><button className={styles.actionDots}>···</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.statRow4}>
        <div className={styles.miniStat}><span className={styles.miniStatVal}>28</span><span className={styles.miniStatLabel}>Total Rules</span></div>
        <div className={styles.miniStat}><span className={styles.miniStatVal}>24</span><span className={styles.miniStatLabel}>Active Rules</span></div>
        <div className={`${styles.miniStat} ${styles.miniStatWarn}`}><span className={styles.miniStatVal}>4</span><span className={styles.miniStatLabel}>Disabled Rules</span></div>
        <div className={`${styles.miniStat} ${styles.miniStatDanger}`}><span className={styles.miniStatVal}>156</span><span className={styles.miniStatLabel}>Triggered Today</span></div>
      </div>
      <div className={styles.viewAllRow}>
        <button className={styles.linkBtn}>View All Threat Rules →</button>
      </div>
    </div>
  );
}

function AccessManagementPanel() {
  const [userTab, setUserTab] = useState("Users");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminRequest("/users").then(res => {
      const data = res.data?.users || res.data || res;
      if (Array.isArray(data)) {
        setUsers(data.map(u => ({
          initials: (u.name || u.email || 'U').substring(0,2).toUpperCase(),
          name: u.name || 'Unknown',
          email: u.email,
          role: u.role,
          status: u.isActive ? 'Active' : 'Inactive',
          lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '--'
        })));
      }
    }).catch(console.error);
  }, []);

  return (
    <div className={styles.panelContent}>
      <div className={styles.panelActionRow}>
        <div className={styles.tabGroup}>
          {["Users","Roles","Permissions","API Keys","Service Accounts"].map(t => (
            <button key={t} className={`${styles.tab} ${userTab===t ? styles.tabActive : ""}`} onClick={() => setUserTab(t)}>{t}</button>
          ))}
        </div>
        <button className={styles.btnPrimary}>+ Add User / Role</button>
      </div>
      <div className={styles.tableToolbar}>
        <input className={styles.searchInput} placeholder="Search by name, email or role..." />
        <button className={styles.btnOutline}>⚙ Filters</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.dataTable}>
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
          <tbody>
            {(users.length > 0 ? users : MOCK_USERS).map((u, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatarCircle}>{u.initials}</div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className={styles.textMuted}>{u.email}</td>
                <td>{u.role}</td>
                <td><StatusBadge status={u.status} /></td>
                <td className={styles.textMuted}>{u.lastLogin}</td>
                <td><button className={styles.actionDots}>···</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.viewAllRow}>
        <button className={styles.linkBtn}>View All Users →</button>
      </div>
    </div>
  );
}

const PANEL_COMPONENTS = {
  "Audit Logs": AuditLogsPanel,
  "Security Policies": SecurityPoliciesPanel,
  "Emergency Controls": EmergencyControlsPanel,
  "Login Monitoring": LoginMonitoringPanel,
  "Threat Rules": ThreatRulesPanel,
  "Access Management": AccessManagementPanel,
};

/* ── Main Page ────────────────────────────────────────────────── */
export default function SecurityPage() {
  const [activePanel, setActivePanel] = useState("Audit Logs");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ActiveComponent = PANEL_COMPONENTS[activePanel] || AuditLogsPanel;

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? "" : styles.sidebarCollapsed}`}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandIcon}>🛡️</span>
          {sidebarOpen && <span className={styles.brandName}>KATABAZAAR<br /><small>SECURITY ADMIN</small></span>}
        </div>
        <nav className={styles.sidebarNav}>
          {PANELS.map(p => (
            <button
              key={p}
              className={`${styles.navItem} ${activePanel === p ? styles.navItemActive : ""}`}
              onClick={() => setActivePanel(p)}
            >
              <span className={styles.navIcon}>
                {p === "Audit Logs" && "📋"}
                {p === "Security Policies" && "📜"}
                {p === "Emergency Controls" && "🚨"}
                {p === "Login Monitoring" && "👁"}
                {p === "Threat Rules" && "⚔️"}
                {p === "Access Management" && "👥"}
              </span>
              {sidebarOpen && <span>{p}</span>}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.navItem}><span className={styles.navIcon}>⚙️</span>{sidebarOpen && "Settings"}</button>
          <button className={styles.navItem} onClick={() => setSidebarOpen(v => !v)}>
            <span className={styles.navIcon}>{sidebarOpen ? "◀" : "▶"}</span>
            {sidebarOpen && "Collapse"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>{activePanel}</h1>
            <p className={styles.pageSubtitle}>Security Administration — Katabazaar Group</p>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.orgLabel}>Organization: Katabazaar Group</span>
            <div className={styles.userInfo}>
              <div className={styles.avatarCircle}>RS</div>
              <div>
                <div className={styles.userName}>Rahul Sharma</div>
                <div className={styles.userRole}>Security Admin <span className={styles.onlineDot}>● Online</span></div>
              </div>
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <div className={styles.contentArea}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>{activePanel}</h2>
          </div>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}

