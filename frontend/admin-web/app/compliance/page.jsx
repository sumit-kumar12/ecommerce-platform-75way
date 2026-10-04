'use client';

import React from 'react';

export default function CompliancePage() {
  return (
    <div className="compliance-container">
      <style>{`
        .compliance-container {
          background-color: #0f1115;
          color: #ffffff;
          font-family: 'Inter', 'Roboto', sans-serif;
          min-height: 100vh;
          padding: 2rem;
          box-sizing: border-box;
        }
        .header {
          margin-bottom: 2rem;
        }
        .header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }
        .header p {
          color: #94a3b8;
          margin: 0;
        }
        .grid-top {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .grid-top {
            grid-template-columns: 1fr 2fr;
          }
        }
        .card {
          background-color: #1e2128;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          border: 1px solid #2a2e37;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
          color: #e2e8f0;
        }
        /* Donut Chart */
        .chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 1rem 0;
        }
        .donut-svg {
          width: 200px;
          height: 200px;
          transform: rotate(-90deg);
        }
        .donut-bg {
          fill: none;
          stroke: #2a2e37;
          stroke-width: 12;
        }
        .donut-fill {
          fill: none;
          stroke: #3b82f6;
          stroke-width: 12;
          stroke-linecap: round;
          stroke-dasharray: 251.2;
          stroke-dashoffset: 35.168; /* (1 - 0.86) * 251.2 */
          transition: stroke-dashoffset 1s ease-in-out;
          animation: fillDonut 1.5s ease-out forwards;
        }
        @keyframes fillDonut {
          from { stroke-dashoffset: 251.2; }
          to { stroke-dashoffset: 35.168; }
        }
        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .chart-score {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
        }
        .chart-label {
          font-size: 0.875rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }
        /* Progress Bars */
        .framework-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .framework-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .framework-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .framework-name {
          font-weight: 500;
          color: #e2e8f0;
        }
        .framework-score {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .progress-track {
          height: 8px;
          background-color: #2a2e37;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease-in-out;
          width: 0;
        }
        .progress-fill.gdpr { animation: fillProgress92 1s ease-out forwards; background: linear-gradient(90deg, #10b981, #34d399); }
        .progress-fill.soc2 { animation: fillProgress85 1s ease-out forwards; background: linear-gradient(90deg, #3b82f6, #60a5fa); }
        .progress-fill.hipaa { animation: fillProgress78 1s ease-out forwards; background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .progress-fill.pci { animation: fillProgress100 1s ease-out forwards; background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
        
        @keyframes fillProgress92 { to { width: 92%; } }
        @keyframes fillProgress85 { to { width: 85%; } }
        @keyframes fillProgress78 { to { width: 78%; } }
        @keyframes fillProgress100 { to { width: 100%; } }

        /* Table */
        .table-container {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          padding: 1rem;
          border-bottom: 2px solid #2a2e37;
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.875rem;
          white-space: nowrap;
        }
        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #2a2e37;
          color: #e2e8f0;
        }
        .data-table tr:last-child td {
          border-bottom: none;
        }
        .data-table tr:hover td {
          background-color: #252830;
          transition: background-color 0.2s ease;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-passed { background-color: rgba(16, 185, 129, 0.15); color: #34d399; }
        .status-pending { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .status-failed { background-color: rgba(239, 68, 68, 0.15); color: #f87171; }
      `}</style>

      <div className="header">
        <h1>Compliance Overview</h1>
        <p>Monitor your organizational compliance scores and recent assessment results.</p>
      </div>

      <div className="grid-top">
        <div className="card">
          <h2 className="card-title">Overall Score</h2>
          <div className="chart-container">
            <svg className="donut-svg" viewBox="0 0 100 100">
              <circle className="donut-bg" cx="50" cy="50" r="40" />
              <circle className="donut-fill" cx="50" cy="50" r="40" />
            </svg>
            <div className="chart-center">
              <div className="chart-score">86%</div>
              <div className="chart-label">Healthy</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Framework Progress</h2>
          <div className="framework-list">
            <div className="framework-item">
              <div className="framework-header">
                <span className="framework-name">GDPR</span>
                <span className="framework-score">92%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill gdpr"></div>
              </div>
            </div>
            
            <div className="framework-item">
              <div className="framework-header">
                <span className="framework-name">SOC 2 Type II</span>
                <span className="framework-score">85%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill soc2"></div>
              </div>
            </div>

            <div className="framework-item">
              <div className="framework-header">
                <span className="framework-name">HIPAA</span>
                <span className="framework-score">78%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill hipaa"></div>
              </div>
            </div>

            <div className="framework-item">
              <div className="framework-header">
                <span className="framework-name">PCI DSS</span>
                <span className="framework-score">100%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill pci"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Recent Assessments</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assessment Name</th>
                <th>Framework</th>
                <th>Date Completed</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Q2 Annual Security Audit</td>
                <td>SOC 2 Type II</td>
                <td>Jun 15, 2026</td>
                <td>85/100</td>
                <td><span className="status-badge status-passed">Passed</span></td>
              </tr>
              <tr>
                <td>Data Privacy Review</td>
                <td>GDPR</td>
                <td>May 28, 2026</td>
                <td>92/100</td>
                <td><span className="status-badge status-passed">Passed</span></td>
              </tr>
              <tr>
                <td>Healthcare Data Controls</td>
                <td>HIPAA</td>
                <td>Apr 10, 2026</td>
                <td>78/100</td>
                <td><span className="status-badge status-pending">Needs Review</span></td>
              </tr>
              <tr>
                <td>Payment Gateway Scan</td>
                <td>PCI DSS</td>
                <td>Mar 22, 2026</td>
                <td>100/100</td>
                <td><span className="status-badge status-passed">Passed</span></td>
              </tr>
              <tr>
                <td>Cloud Infrastructure Scan</td>
                <td>Custom</td>
                <td>Feb 05, 2026</td>
                <td>65/100</td>
                <td><span className="status-badge status-failed">Action Req</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
