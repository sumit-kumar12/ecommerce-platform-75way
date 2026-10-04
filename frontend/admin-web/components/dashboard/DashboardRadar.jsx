"use client";
import { useRef, useState, useEffect } from "react";
import styles from "./DashboardRadar.module.css";

export function DashboardRadar({ topology, loading, isScanning, onRescan }) {
  const containerRef = useRef(null);
  const [isVisitScanning, setIsVisitScanning] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisitScanning(false), 4000); // One full sweep duration
    return () => clearTimeout(timer);
  }, []);

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

  const activeThreats = topology?.activeThreats || 0;
  const isAnomaly = topology?.isAnomaly || false;
  const nodes = topology?.nodes || [];
  const connections = topology?.connections || [];

  return (
    <div ref={containerRef} className={`${styles.container} glass-panel`}>
      <div className="glass-card-header">
        <div className={styles.titleInfo}>
          <h3 className={styles.title}>
            <span className="material-symbols-outlined">hub</span>
            Threat Detection Engine - Real-time Network Topology
          </h3>
          <p className={styles.subtitle}>Live vector mapping | Zone: US-EAST-01</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={`${styles.rescanBtn} ${isScanning ? styles.btnActive : ""}`}
            onClick={onRescan}
            disabled={isScanning}
          >
            <span className="material-symbols-outlined">refresh</span>
            {isScanning ? "SCANNING..." : "RE-SCAN"}
          </button>
          <button className={styles.iconBtn} onClick={handleFullscreen}>
            <span className="material-symbols-outlined">fullscreen</span>
          </button>
        </div>
      </div>

    <div className={`${styles.radarGrid} ${styles.scanningEffect}`}>
        {(isScanning || isVisitScanning) && <div className="scanner-line"></div>}
        
        {/* Radar Circles */}
        <div className={styles.radarCircle} style={{ width: '300px', height: '300px', opacity: 0.4 }}></div>
        <div className={styles.radarCircle} style={{ width: '500px', height: '500px', opacity: 0.2 }}></div>
        <div className={styles.radarCircle} style={{ width: '100px', height: '100px', opacity: 0.6 }}></div>

        {/* SVG Node Graph */}
        <svg className={styles.svgOverlay} viewBox="0 0 800 500">
          <g className={styles.connections}>
            {connections.map((conn, i) => (
              <line 
                key={i}
                x1={nodes.find(n => n.id === conn.from)?.x || 400} 
                y1={nodes.find(n => n.id === conn.from)?.y || 250} 
                x2={nodes.find(n => n.id === conn.to)?.x || 400} 
                y2={nodes.find(n => n.id === conn.to)?.y || 250} 
                className={conn.type === 'danger' ? styles.lineDanger : styles.linePrimary} 
              />
            ))}
          </g>
          
          <g className={styles.nodes}>
            {nodes.map((node, i) => (
              <circle 
                key={i}
                cx={node.x} 
                cy={node.y} 
                r={node.type === 'hub' ? 8 : 5} 
                className={styles[`node${node.type.charAt(0).toUpperCase() + node.type.slice(1)}`]} 
              />
            ))}
          </g>

          <g className={styles.labels}>
            {nodes.map((node, i) => (
              <text 
                key={i}
                x={node.x + 15} 
                y={node.y + 5} 
                className={node.type === 'danger' ? styles.labelDanger : styles.labelPrimary}
              >
                {loading ? "SYNCING..." : node.label}
              </text>
            ))}
          </g>
        </svg>

        {/* performance metrics */}
        <div className={styles.metricsOverlay}>
          <span>LATENCY: {topology?.latency || "12ms"}</span>
          <span>PACKETS: {topology?.packets || "1.2M/s"}</span>
          <span>DROPS: {topology?.drops || "0.001%"}</span>
        </div>

        {/* anomaly alert */}
        {isAnomaly && (
          <div className={styles.alertPanel}>
            <p className={styles.alertTitle}>CRITICAL ANOMALY</p>
            <p className={styles.alertText}>Unauthorized handshake from cluster ingress detected.</p>
            <div className={styles.alertLevel}>
              <div className={styles.alertLevelFill}></div>
              <div className={styles.alertLevelEmpty}></div>
              <div className={styles.alertLevelEmpty}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
