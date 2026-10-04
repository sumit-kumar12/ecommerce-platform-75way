"use client";
import { useMemo, useRef } from "react";
import styles from "./ThreatVolumeGraph.module.css";

export function ThreatVolumeGraph({ timeline, security, topology, historyRange, setHistoryRange, loading }) {
  const containerRef = useRef(null);

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Fullscreen Error: ${err.message}`);
      });
    }
  };

  const stats = topology?.stats || { peakLoad: "1.2 GB/s", avgLatency: "10ms", packetDrop: "0.01%" };
  const timelineValues = useMemo(
    () => (timeline || []).map((bin) => Number(bin?.value) || 0),
    [timeline],
  );
  const currentThreatRate = timelineValues.length ? timelineValues[timelineValues.length - 1] : 0;
  const peakThreatRate = timelineValues.length ? Math.max(...timelineValues) : 0;
  const averageThreatRate = timelineValues.length
    ? Math.round(timelineValues.reduce((sum, value) => sum + value, 0) / timelineValues.length)
    : 0;

  const timeLabels = useMemo(() => {
    if (historyRange === 1) return ["1h ago", "45m ago", "30m ago", "15m ago", "NOW"];
    if (historyRange === 6) return ["6h ago", "4.5h ago", "3h ago", "1.5h ago", "NOW"];
    if (historyRange === 12) return ["12h ago", "9h ago", "6h ago", "3h ago", "NOW"];
    if (historyRange === 24) return ["24h ago", "18h ago", "12h ago", "6h ago", "NOW"];
    if (historyRange === 48) return ["48h ago", "36h ago", "24h ago", "12h ago", "NOW"];
    if (historyRange === 72) return ["72h ago", "54h ago", "36h ago", "18h ago", "NOW"];
    return [];
  }, [historyRange]);
  
  const dataPoints = useMemo(() => {
    if (!timeline || timeline.length === 0) {
      const len = historyRange <= 1 ? 60 : 48;
      return Array.from({ length: len }).map((_, i) => ({
        x: (i / Math.max(1, len - 1)) * 100,
        y: 72 - Math.sin(i / 4) * 6,
      }));
    }

    const minValue = Math.min(...timelineValues);
    const maxValue = Math.max(...timelineValues, 1);
    const range = Math.max(maxValue - minValue, 1);

    const points = timeline.map((bin, i) => {
      const x = (i / Math.max(1, timeline.length - 1)) * 100;
      const value = Number(bin?.value) || 0;
      const normalized = (value - minValue) / range;
      const y = 86 - normalized * 58;
      return { x, y, value };
    });
    return points;
  }, [timeline, timelineValues, historyRange]);

  const pathData = useMemo(() => {
    if (dataPoints.length === 0) return "";
    let d = `M ${dataPoints[0].x},${dataPoints[0].y}`;
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const p0 = dataPoints[i];
      const p1 = dataPoints[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      d += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }, [dataPoints]);

  const areaData = useMemo(() => {
    return `${pathData} L 100,100 L 0,100 Z`;
  }, [pathData]);

  // Width scales with range, but with a minimum for 1h/6h visibility
  const graphWidth = Math.max(100, (historyRange / 24) * 100);

  return (
    <div ref={containerRef} className={`${styles.container} glass-panel`}>
      <div className="glass-card-header">
        <div>
          <h4 className={styles.title}>Threat Activity Timeline</h4>
          <p className={styles.subtitle}>
            {historyRange === 1 ? "1 hour" : `${historyRange} hours`} of live threat telemetry
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.rangeSelector}>
            {[1, 6, 12, 24, 48, 72].map(r => (
              <button 
                key={r} 
                className={`${styles.rangeBtn} ${historyRange === r ? styles.rangeActive : ""}`}
                onClick={() => setHistoryRange(r)}
              >
                {r === 1 ? "1H" : r < 24 ? `${r}H` : `${r}H`}
              </button>
            ))}
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.dot}></span>
              <span>Live Feed</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={handleFullscreen}>
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.metricStrip}>
          <div className={styles.metricPill}>
            <span className={styles.metricLabel}>Current</span>
            <strong className={styles.metricValue}>{loading ? "..." : currentThreatRate}</strong>
          </div>
          <div className={styles.metricPill}>
            <span className={styles.metricLabel}>Peak</span>
            <strong className={styles.metricValue}>{loading ? "..." : peakThreatRate}</strong>
          </div>
          <div className={styles.metricPill}>
            <span className={styles.metricLabel}>Average</span>
            <strong className={styles.metricValue}>{loading ? "..." : averageThreatRate}</strong>
          </div>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.graphWrapper} style={{ width: `${graphWidth}%` }}>
            {loading ? (
              <div className={styles.loadingOverlay}>Scanning Infrastructure...</div>
            ) : (
              <>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#7000ff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#7000ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {[20, 40, 60, 80].map(val => (
                    <line key={val} x1="0" y1={val} x2="100" y2={val} className={styles.gridLine} />
                  ))}

                  <path d={areaData} fill="url(#areaGradient)" className={styles.area} />
                  <path d={pathData} fill="none" strokeWidth="1.5" className={styles.line} />
                  
                  <circle 
                    cx={dataPoints[dataPoints.length - 1].x} 
                    cy={dataPoints[dataPoints.length - 1].y} 
                    r="1.5" 
                    fill="#00f2ff"
                    className={styles.pulse}
                  />
                </svg>
                <div className={styles.labels}>
                  {timeLabels.map((lbl, i) => <span key={i}>{lbl}</span>)}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Peak Load</span>
            <span className={styles.statValue}>{loading ? "..." : stats.peakLoad}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Avg Latency</span>
            <span className={styles.statValue}>{loading ? "..." : stats.avgLatency}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Packet Loss</span>
            <span className={styles.statValue}>{loading ? "..." : stats.packetDrop}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
