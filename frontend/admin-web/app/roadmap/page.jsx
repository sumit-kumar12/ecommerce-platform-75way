"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const VIEW_TABS = ["Quarterly Timeline", "Category Board", "Status Map", "Infrastructure Debt"];

const ROADMAP_COLUMNS = [
  {
    id: "security",
    title: "Security Core",
    icon: "shield",
    tone: styles.securityTone,
    items: [
      {
        title: "Quantum-Resistant Vault",
        status: "In Progress",
        statusTone: styles.statusCritical,
        quarter: "Q3 2024",
        description: "Implementing lattice-based cryptography for long-term data persistence security.",
        progress: null,
        team: true,
      },
      {
        title: "Biometric Auth v2",
        status: "Backlog",
        statusTone: styles.statusBacklog,
        quarter: "Q4 2024",
        description: "Integration of WebAuthn and Passkeys for passwordless administrative access.",
      },
      {
        title: "SOC2 Compliance Prep",
        status: "Completed",
        statusTone: styles.statusComplete,
        done: true,
      },
    ],
  },
  {
    id: "payments",
    title: "Payment Rails",
    icon: "payments",
    tone: styles.paymentsTone,
    items: [
      {
        title: "Cross-Border Settlements",
        status: "Active",
        statusTone: styles.statusPrimary,
        quarter: "Q3 2024",
        description: "Instant FX conversion and low-fee corridors for SEPA and SWIFT integrations.",
        progress: 65,
      },
      {
        title: "Recurring Subscription Engine",
        status: "Next Up",
        statusTone: styles.statusSoft,
        quarter: "Q4 2024",
        description: "Native handling of tiered billing, trial periods, and automated dunning.",
      },
      {
        title: "Add Payment Milestone",
        dashed: true,
      },
    ],
  },
  {
    id: "storefront",
    title: "Storefront",
    icon: "storefront",
    tone: styles.storeTone,
    items: [
      {
        title: "AR Product Preview",
        status: "Backlog",
        statusTone: styles.statusBacklog,
        quarter: "Q1 2025",
        description: "Enabling 3D models and augmented reality visualizations for mobile customers.",
      },
      {
        title: "AI Personalized Search",
        status: "In Progress",
        statusTone: styles.statusStore,
        quarter: "Q3 2024",
        description: "Vector-based search engine that learns from user behavior patterns.",
        note: "Performance Impact: High",
      },
      {
        title: "Micro-Frontend Architecture",
        status: "Backlog",
        statusTone: styles.statusBacklog,
        quarter: "Q2 2025",
        description: "Decoupling store components for independent team scaling and deployment.",
      },
    ],
  },
];

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("Category Board");
  const [search, setSearch] = useState("");
  const [showNewMilestone, setShowNewMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", column: "security", quarter: "Q3 2024", description: "" });

  const handleExport = () => {
    const data = ROADMAP_COLUMNS.map(col => ({ ...col, items: col.items.filter(i => !i.dashed) }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredColumns = useMemo(() => {
    if (!search.trim()) return ROADMAP_COLUMNS;
    const q = search.trim().toLowerCase();
    return ROADMAP_COLUMNS.map(col => ({
      ...col,
      items: col.items.filter(item => 
        !item.dashed && (
          (item.title || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q) ||
          (item.status || "").toLowerCase().includes(q)
        )
      ),
    })).filter(col => col.items.length > 0);
  }, [search]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.brandMark}>
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div className={styles.brandText}>Katabazaar <span>Admin</span></div>
          <nav className={styles.nav}>
            <Link href="/">Dashboard</Link>
            <Link href="/products">Inventory</Link>
            <span className={styles.navActive}>Roadmap</span>
            <Link href="/payment-rules">Settings</Link>
          </nav>
        </div>
        <div className={styles.headerTools}>
          <label className={styles.searchWrap}>
            <span className="material-symbols-outlined">search</span>
            <input 
              placeholder="Search milestones..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className={styles.profileDot}>K</div>
        </div>
      </header>

      <div className={styles.hero}>
        <div>
          <h1>Product <span>Roadmap</span></h1>
          <p>Strategic milestones and future-proof architectural scaling.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.secondaryAction} onClick={handleExport}>
            <span className="material-symbols-outlined">ios_share</span>
            Export
          </button>
          <button type="button" className={styles.primaryAction} onClick={() => setShowNewMilestone(true)}>
            <span className="material-symbols-outlined">add</span>
            New Milestone
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        {VIEW_TABS.map((tab) => (
          <button 
            key={tab} 
            type="button" 
            className={tab === activeTab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {search && filteredColumns.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#8ea0bf', fontSize: '0.9rem' }}>
          No milestones match &ldquo;{search}&rdquo;
        </div>
      )}

      <div className={styles.board}>
        {filteredColumns.map((column) => (
          <section key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={`${styles.columnIcon} ${column.tone}`}>
                <span className="material-symbols-outlined">{column.icon}</span>
              </div>
              <h2>{column.title}</h2>
            </div>
            <div className={styles.cardStack}>
              {column.items.map((item) => {
                if (item.dashed) {
                  return (
                    <button 
                      key={item.title} 
                      type="button" 
                      className={styles.dashedCard}
                      onClick={() => {
                        setNewMilestone(p => ({ ...p, column: column.id }));
                        setShowNewMilestone(true);
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                      {item.title}
                    </button>
                  );
                }
                return (
                  <article key={item.title} className={`${styles.roadmapCard} ${item.done ? styles.doneCard : ""}`}>
                    <div className={styles.cardTop}>
                      <span className={`${styles.statusPill} ${item.statusTone}`}>{item.status}</span>
                      {item.done ? <span className={`material-symbols-outlined ${styles.doneIcon}`}>check_circle</span> : <span className={styles.quarter}>{item.quarter}</span>}
                    </div>
                    <h3>{item.title}</h3>
                    {item.description ? <p>{item.description}</p> : null}
                    {item.progress ? (
                      <div className={styles.progressBar}>
                        <span style={{ width: `${item.progress}%` }}></span>
                      </div>
                    ) : null}
                    {item.team ? (
                      <div className={styles.teamRow}>
                        <i></i><i></i>
                      </div>
                    ) : null}
                    {item.note ? <div className={styles.notePill}>{item.note}</div> : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className={styles.footerPanel}>
        <div className={styles.footerLead}>
          <div className={styles.footerIcon}>
            <span className="material-symbols-outlined">dns</span>
          </div>
          <div>
            <h4>System Integrity <span>Nominal</span></h4>
            <p>All core systems operating at 99.99% uptime. Roadmap estimates are within 5% variance.</p>
          </div>
        </div>
        <div className={styles.footerStats}>
          <div>
            <small>Active Sprints</small>
            <strong>12</strong>
          </div>
          <div>
            <small>Velocity</small>
            <strong>48 <span>pts/wk</span></strong>
          </div>
          <div>
            <small>Launch Drift</small>
            <strong className={styles.good}>-2d</strong>
          </div>
        </div>
      </footer>

      {/* New Milestone Modal */}
      {showNewMilestone && (
        <div
          style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15, 14, 23,0.85)', backdropFilter:'blur(8px)' }}
          onClick={() => setShowNewMilestone(false)}
        >
          <div
            style={{ background:'#1d1c33', border:'1px solid rgba(139, 92, 246,0.3)', borderRadius:'1.25rem', padding:'2rem', width:'100%', maxWidth:'500px', color:'#e2e8f0' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontWeight:800, fontSize:'1.2rem', marginBottom:'1.5rem' }}>New Milestone</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <label style={{ display:'flex', flexDirection:'column', gap:'0.4rem', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#8ea0bf' }}>
                Title
                <input
                  style={{ background:'#0F0E17', border:'1px solid rgba(139, 92, 246,0.3)', borderRadius:'0.5rem', padding:'0.6rem 0.85rem', color:'#e2e8f0', fontSize:'0.9rem', outline:'none' }}
                  value={newMilestone.title}
                  onChange={e => setNewMilestone(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Biometric Auth v3"
                />
              </label>
              <label style={{ display:'flex', flexDirection:'column', gap:'0.4rem', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#8ea0bf' }}>
                Column
                <select
                  style={{ background:'#0F0E17', border:'1px solid rgba(139, 92, 246,0.3)', borderRadius:'0.5rem', padding:'0.6rem 0.85rem', color:'#e2e8f0', fontSize:'0.9rem', outline:'none' }}
                  value={newMilestone.column}
                  onChange={e => setNewMilestone(p => ({ ...p, column: e.target.value }))}
                >
                  {ROADMAP_COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                </select>
              </label>
              <label style={{ display:'flex', flexDirection:'column', gap:'0.4rem', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#8ea0bf' }}>
                Target Quarter
                <input
                  style={{ background:'#0F0E17', border:'1px solid rgba(139, 92, 246,0.3)', borderRadius:'0.5rem', padding:'0.6rem 0.85rem', color:'#e2e8f0', fontSize:'0.9rem', outline:'none' }}
                  value={newMilestone.quarter}
                  onChange={e => setNewMilestone(p => ({ ...p, quarter: e.target.value }))}
                  placeholder="Q3 2024"
                />
              </label>
              <label style={{ display:'flex', flexDirection:'column', gap:'0.4rem', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#8ea0bf' }}>
                Description
                <textarea
                  rows={3}
                  style={{ background:'#0F0E17', border:'1px solid rgba(139, 92, 246,0.3)', borderRadius:'0.5rem', padding:'0.6rem 0.85rem', color:'#e2e8f0', fontSize:'0.9rem', outline:'none', resize:'vertical' }}
                  value={newMilestone.description}
                  onChange={e => setNewMilestone(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the milestone objective..."
                />
              </label>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.75rem', marginTop:'1.5rem' }}>
              <button
                type="button"
                style={{ padding:'0.5rem 1.25rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#94a3b8', fontWeight:700, cursor:'pointer' }}
                onClick={() => setShowNewMilestone(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ padding:'0.5rem 1.25rem', borderRadius:'0.6rem', background:'#8B5CF6', color:'#fff', fontWeight:700, cursor:'pointer', border:'none' }}
                onClick={() => {
                  alert(`Milestone "${newMilestone.title}" queued for backend submission (POST /roadmap/milestones).`);
                  setShowNewMilestone(false);
                  setNewMilestone({ title: '', column: 'security', quarter: 'Q3 2024', description: '' });
                }}
              >
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

