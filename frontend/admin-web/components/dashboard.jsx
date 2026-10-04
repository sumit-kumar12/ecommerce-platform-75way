"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest, resolveAdminApiBase, coreApiRequest } from "../lib/api";
import { MetricGrid } from "./dashboard/MetricGrid";
import { ThreatVolumeGraph } from "./dashboard/ThreatVolumeGraph";
import { DashboardRadar } from "./dashboard/DashboardRadar";
import { RecentActivity } from "./dashboard/RecentActivity";
import { ResourceMatrix } from "./dashboard/ResourceMatrix";
import { ThreatEngineScore } from "./dashboard/ThreatEngineScore";
import { EngagementMatrix } from "./dashboard/EngagementMatrix";
import { PerformanceHeatmap } from "./dashboard/PerformanceHeatmap";
import styles from "./dashboard.module.css";

const normalizeAuditEntry = (entry) => ({
  event: entry?.event ?? entry?.action ?? entry?.type ?? "SYSTEM_EVENT",
  timestamp: entry?.timestamp ?? entry?.createdAt ?? new Date().toISOString(),
  resource: entry?.resource ?? entry?.subject ?? entry?.metadata?.resource ?? "control_surface",
  ip: entry?.ip ?? entry?.ipAddress ?? entry?.metadata?.ipAddress ?? null,
});

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [security, setSecurity] = useState(null);
  const [activity, setActivity] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [resources, setResources] = useState([]);
  const [topology, setTopology] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [historyRange, setHistoryRange] = useState(24);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeMode, setActiveMode] = useState("Live Matrix");
  const MODES = ["Live Matrix", "Historical Audit", "Resource Signals"];
  const overviewCards = [
    {
      label: "Threat events",
      value: stats?.overview?.recentThreats ?? stats?.security?.recentThreats ?? "--",
      icon: "warning",
    },
    {
      label: "Blocked IPs",
      value: security?.blockedIpCount ?? stats?.security?.blockedIpCount ?? "--",
      icon: "gpp_bad",
    },
    {
      label: "Audit records",
      value: activity.length || "--",
      icon: "description",
    },
  ];
  const commandLinks = [
    { href: "/threat", label: "Threat Engine", icon: "shield_person" },
    { href: "/orders", label: "Order Desk", icon: "receipt_long" },
    { href: "/products", label: "Inventory", icon: "inventory_2" },
  ];
  const activeNodeCount = Array.isArray(resources) ? resources.length : 0;
  const liveThreats = Number(security?.recentThreatEvents ?? 0);
  const liquidityScore = stats?.orders ? `$${Number(stats.orders * 1180).toLocaleString()}` : "--";
  const activeSystems = [
    {
      label: "Threat mesh",
      status: liveThreats > 0 ? "Elevated" : "Stable",
      tone: liveThreats > 0 ? "warning" : "success",
    },
    {
      label: "Resource grid",
      status: activeNodeCount ? `${activeNodeCount} nodes` : "Pending",
      tone: activeNodeCount ? "success" : "idle",
    },
    {
      label: "Audit stream",
      status: activity.length ? "Live" : "Standby",
      tone: activity.length ? "success" : "idle",
    },
  ];

  // SSE Activity Stream
  useEffect(() => {
    let eventSource;
    let active = true;

    const initSSE = async () => {
      try {
        const apiBase = await resolveAdminApiBase();
        if (!active) return;
        
        const sseRes = await coreApiRequest("/auth/sse-token", { method: "POST" });

        eventSource = new EventSource(`${apiBase}/monitoring/activity-stream?sseToken=${sseRes.sseToken}`, {
          withCredentials: true
        });

        eventSource.onmessage = (event) => {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'AUDIT') {
            setActivity((prev) => [normalizeAuditEntry(parsed.data), ...prev].slice(0, 5));
          } else if (parsed.type === 'THREAT') {
            loadData();
          } else if (parsed.type === 'STATUS' && parsed.data === 'CONNECTED') {
            console.log("Telemetry stream established");
          }
        };

        eventSource.onerror = () => {
          console.error("SSE Connection failed or disconnected.");
          eventSource.close();
        };
      } catch (err) {
        if (err?.code !== "AUTH_REQUIRED") {
          console.error("Failed to resolve API base for SSE:", err);
        }
      }
    };

    initSSE();

    return () => {
      active = false;
      eventSource?.close();
    };
  }, []);

  const loadData = async () => {
    try {
      const [statsData, securityData, auditData, timelineData, resourceData, topologyData, engagementData, analyticsData] = await Promise.all([
        adminRequest("/stats"),
        adminRequest("/security/overview"),
        adminRequest("/audit?limit=5"),
        adminRequest("/monitoring/threat-activity?history=" + historyRange),
        adminRequest("/monitoring/resource-matrix"),
        adminRequest("/monitoring/radar-topology"),
        adminRequest("/monitoring/user-engagement"),
        adminRequest("/monitoring/analytics/history?range=24")
      ]);
      setStats(statsData);
      setSecurity(securityData?.summary || null);
      setActivity((auditData?.logs || []).map(normalizeAuditEntry));
      setTimeline(timelineData?.activity || []);
      setResources(resourceData?.nodes || []);
      setTopology(topologyData || null);
      setEngagement(engagementData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (err) {
      if (err?.code !== "AUTH_REQUIRED") {
        console.error("Dashboard data fetch failed:", err.message || err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRescan = async () => {
    setIsScanning(true);
    try {
      await adminRequest("/monitoring/rescan", { method: "POST" });
    } catch (err) {
      console.error("Rescan failed:", err);
    } finally {
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); 
    return () => clearInterval(interval);
  }, [historyRange]);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLead}>
          <span className={styles.eyebrow}>Merchant Control Hub</span>
          <h1 className={styles.title}>System Overview</h1>
          <p className={styles.subtitle}>Real-time security telemetry, operator activity, and infrastructure health.</p>
          <div className={styles.modeTabs}>
            {MODES.map(mode => (
              <span 
                key={mode}
                className={mode === activeMode ? styles.modeTabActive : styles.modeTab}
                onClick={() => setActiveMode(mode)}
                style={{ cursor: "pointer" }}
              >{mode}</span>
            ))}
          </div>
          <div className={styles.commandLinks}>
            {commandLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.commandLink}>
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.headerMeta}>
          <div className={styles.statusPill}>
            <span className={styles.pulse}></span>
            Live monitoring active
          </div>
          <div className={styles.lastUpdated}>
            Last sync: {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </div>
          <div className={styles.headerCards}>
            {overviewCards.map((card) => (
              <div key={card.label} className={styles.headerCard}>
                <div className={styles.headerCardIcon}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <span>{card.label}</span>
                <strong>{loading ? "..." : card.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.controlHubGrid}>
        <section className={styles.commandSurface}>
          <div className={styles.surfaceHeader}>
            <div>
              <span className={styles.surfaceEyebrow}>Integrated signal board</span>
              <h2>Live matrix command lane</h2>
            </div>
            <button type="button" className={styles.surfaceButton} onClick={handleRescan} disabled={isScanning}>
              <span className="material-symbols-outlined">sensors</span>
              {isScanning ? "Scanning..." : "Push Live Scan"}
            </button>
          </div>

          <div className={styles.surfaceStats}>
            <div className={styles.surfaceCard}>
              <span>Network Liquidity</span>
              <strong>{loading ? "..." : liquidityScore}</strong>
              <div className={styles.surfaceRail}>
                <span style={{ width: `${Math.min(100, Math.max(18, Number(stats?.orders || 0) * 6))}%` }}></span>
              </div>
            </div>
            <div className={styles.surfaceCard}>
              <span>Historical Window</span>
              <strong>{historyRange}H ACTIVE</strong>
              <div className={styles.rangeChips}>
                {[6, 12, 24].map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={range === historyRange ? styles.rangeChipActive : styles.rangeChip}
                    onClick={() => setHistoryRange(range)}
                  >
                    {range}H
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.sideStack}>
          <div className={styles.sidePanel}>
            <p>Network Integrity</p>
            <strong>{loading ? "..." : `${security?.healthScore ?? 100}%`}</strong>
            <div className={styles.sidePanelMeta}>
              <span className={styles.metaPositive}>{liveThreats > 0 ? `${liveThreats} live threats` : "Clear path"}</span>
              <div className={styles.sideRail}>
                <span style={{ width: `${Math.max(12, Number(security?.healthScore ?? 100))}%` }}></span>
              </div>
            </div>
          </div>

          <div className={styles.sidePanel}>
            <p>Active System Nodes</p>
            <div className={styles.systemList}>
              {activeSystems.map((system) => (
                <div key={system.label} className={styles.systemRow}>
                  <span>{system.label}</span>
                  <strong className={styles[`tone${system.tone[0].toUpperCase()}${system.tone.slice(1)}`]}>{system.status}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <MetricGrid stats={stats} security={security} loading={loading} />

      <div className={styles.mainGrid}>
        <div className={styles.radarSection}>
          <DashboardRadar 
            topology={topology} 
            loading={loading} 
            isScanning={isScanning}
            onRescan={handleRescan} 
          />
          <ThreatVolumeGraph 
            timeline={timeline} 
            security={security} 
            topology={topology} 
            historyRange={historyRange}
            setHistoryRange={setHistoryRange}
            loading={loading} 
          />
        </div>
        <div className={styles.activitySection}>
          <ThreatEngineScore security={security} loading={loading} />
          <RecentActivity activity={activity} loading={loading} />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.insightGrid}>
          <EngagementMatrix data={engagement} loading={loading} />
          <PerformanceHeatmap data={analytics} loading={loading} />
        </div>
        <div className={styles.resourceWrapper}>
          <ResourceMatrix resources={resources} loading={loading} />
        </div>
      </div>
    </div>
  );
}
