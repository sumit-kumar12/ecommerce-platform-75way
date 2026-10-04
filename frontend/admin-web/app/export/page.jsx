"use client";

import React, { useState } from "react";

const EXPORT_OPTIONS = [
  { id: "orders", title: "Orders Report", desc: "Export order data with all details", formats: ["CSV", "Excel", "PDF"] },
  { id: "sales", title: "Sales Report", desc: "Export sales and revenue data", formats: ["CSV", "Excel", "PDF"] },
  { id: "customers", title: "Customers Report", desc: "Export customer and user data", formats: ["CSV", "Excel", "PDF"] },
  { id: "products", title: "Products Report", desc: "Export product and inventory data", formats: ["CSV", "Excel", "PDF"] },
];

export default function DataExportCenter() {
  const [selectedFormats, setSelectedFormats] = useState({
    orders: "CSV",
    sales: "Excel",
    customers: "CSV",
    products: "PDF"
  });

  const [isScheduled, setIsScheduled] = useState(true);

  const setFormat = (reportId, format) => {
    setSelectedFormats(prev => ({ ...prev, [reportId]: format }));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[800px] mx-auto min-h-screen bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Data Export Center</h2>
          <p className="text-slate-400 mt-1 text-sm">Export reports and data in multiple formats</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col mt-8">
        <div className="px-6 py-5 border-b border-zinc-800/60 flex items-center justify-between">
          <h3 className="text-white font-medium">Export Center</h3>
          <button className="text-[#8C63F5] hover:text-[#7b53de] text-sm font-medium transition-colors">
            Export History
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {EXPORT_OPTIONS.map((report) => (
            <div key={report.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/60 last:border-0 last:pb-0">
              <div>
                <h4 className="text-white font-medium mb-1">{report.title}</h4>
                <p className="text-xs text-zinc-500">{report.desc}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {report.formats.map(fmt => (
                    <button 
                      key={fmt}
                      onClick={() => setFormat(report.id, fmt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        selectedFormats[report.id] === fmt 
                          ? 'bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/30' 
                          : 'bg-[#1A1827] border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
                <button className="bg-[#8C63F5] hover:bg-[#7b53de] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#8C63F5]/20 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">download</span> Export
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Scheduled Exports */}
        <div className="px-6 py-5 border-t border-zinc-800/60 bg-[#1A1827] rounded-b-2xl">
          <h3 className="text-white font-medium mb-4">Scheduled Exports</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Daily Sales Report</h4>
                <p className="text-xs text-zinc-500">CSV • Daily at 09:00 AM</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsScheduled(!isScheduled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isScheduled ? 'bg-[#8C63F5]' : 'bg-zinc-700'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isScheduled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
