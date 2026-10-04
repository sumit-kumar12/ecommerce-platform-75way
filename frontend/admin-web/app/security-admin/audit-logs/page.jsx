"use client";
import React from 'react';
import { Search, Filter, Download, ShieldAlert, AlertTriangle, XCircle, ShieldCheck, Clock, User, Activity, Globe, HardDrive, AlertCircle } from 'lucide-react';

const AuditLogs = () => {
  const kpis = [
    { title: "Total Logs", value: "1,248,560", trend: "+12.5%", icon: <Activity className="w-6 h-6 text-blue-400" /> },
    { title: "Critical Events", value: "2,345", trend: "+8.3%", icon: <AlertTriangle className="w-6 h-6 text-red-400" /> },
    { title: "Failed Access", value: "8,452", trend: "+6.7%", icon: <XCircle className="w-6 h-6 text-orange-400" /> },
    { title: "Admin Actions", value: "15,672", trend: "+14.2%", icon: <ShieldCheck className="w-6 h-6 text-emerald-400" /> },
  ];

  const logs = [
    { id: 1, time: "2026-06-20 18:45:12", user: "admin@katabazaar.com", action: "Policy Update", resource: "Firewall Rules", ip: "192.168.1.45", severity: "Medium" },
    { id: 2, time: "2026-06-20 18:32:05", user: "system", action: "Failed Login", resource: "Auth Service", ip: "45.22.11.90", severity: "High" },
    { id: 3, time: "2026-06-20 18:15:33", user: "j.doe@katabazaar.com", action: "Data Export", resource: "Customer DB", ip: "10.0.0.12", severity: "Low" },
    { id: 4, time: "2026-06-20 17:55:01", user: "admin@katabazaar.com", action: "Role Assigned", resource: "IAM", ip: "192.168.1.45", severity: "Medium" },
    { id: 5, time: "2026-06-20 17:40:22", user: "system", action: "DDoS Detected", resource: "Edge Router", ip: "Multiple", severity: "Critical" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E17] text-gray-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-indigo-500" />
              System Audit Logs
            </h1>
            <p className="text-sm text-gray-400 mt-1">Monitor and analyze system-wide security events and user actions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-[#1A1827] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <p className="text-gray-400 text-sm font-medium">{kpi.title}</p>
                <div className="p-2 bg-[#0F0E17] rounded-lg border border-gray-800">
                  {kpi.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-[#1A1827] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search logs by user, action, IP..." 
              className="w-full bg-[#0F0E17] border border-gray-700 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0E17] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto text-sm font-medium">
            <Filter className="w-4 h-4" /> Advanced Filters
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-[#1A1827] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F0E17] border-b border-gray-800">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><Clock className="w-4 h-4"/> Time</div></th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><User className="w-4 h-4"/> User</div></th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><Activity className="w-4 h-4"/> Action</div></th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><HardDrive className="w-4 h-4"/> Resource</div></th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><Globe className="w-4 h-4"/> IP Address</div></th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Severity</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#232135] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-300">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{log.resource}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{log.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-[#1A1827]">
            <span className="text-sm text-gray-500">Showing 1 to 5 of 1,248,560 entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded bg-[#0F0E17] border border-gray-700 text-gray-400 hover:text-white disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 rounded bg-indigo-600 text-white">1</button>
              <button className="px-3 py-1 rounded bg-[#0F0E17] border border-gray-700 text-gray-400 hover:bg-gray-800">2</button>
              <button className="px-3 py-1 rounded bg-[#0F0E17] border border-gray-700 text-gray-400 hover:bg-gray-800">3</button>
              <span className="px-2 py-1 text-gray-500">...</span>
              <button className="px-3 py-1 rounded bg-[#0F0E17] border border-gray-700 text-gray-400 hover:bg-gray-800">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
