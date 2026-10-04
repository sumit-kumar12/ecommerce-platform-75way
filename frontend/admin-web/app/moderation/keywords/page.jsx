"use client";

import React, { useState } from 'react';


const keywordsData = [
  { id: 1, keyword: 'idiot', type: 'Profanity', severity: 'Low', status: true },
  { id: 2, keyword: 'kill', type: 'Violence', severity: 'High', status: true },
  { id: 3, keyword: 'scam', type: 'Spam/Fraud', severity: 'High', status: true },
  { id: 4, keyword: 'stupid', type: 'Profanity', severity: 'Low', status: false },
  { id: 5, keyword: 'fake review', type: 'Spam/Fraud', severity: 'Medium', status: true },
  { id: 6, keyword: 'die', type: 'Violence', severity: 'High', status: true },
];

export default function AbuseKeywordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState(keywordsData);

  const toggleStatus = (id) => {
    setKeywords(keywords.map(kw => 
      kw.id === id ? { ...kw, status: !kw.status } : kw
    ));
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="p-6 text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Abuse Keywords</h1>
          <p className="text-gray-400 text-sm">Manage keywords for automatic moderation and filtering.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Keyword
        </button>
      </div>

      <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-[#2d2c45] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F0E17] border border-[#2d2c45] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-gray-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-[#2d2c45] hover:bg-[#2d2c45] text-gray-300 px-4 py-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0E17] border-b border-[#2d2c45]">
                <th className="p-4 font-medium text-gray-400 text-sm">Keyword</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Type</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Severity</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Status</th>
                <th className="p-4 font-medium text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2c45]">
              {keywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-[#2d2c45]/30 transition-colors group">
                  <td className="p-4">
                    <span className="font-medium text-white">{kw.keyword}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {kw.type}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(kw.severity)}`}>
                      {kw.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(kw.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1A1827] ${kw.status ? 'bg-indigo-600' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${kw.status ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2c45] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-[#2d2c45] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#2d2c45] flex items-center justify-between text-sm text-gray-400">
          <div>
            Showing 1 to 6 of 6 entries
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[#2d2c45] rounded hover:bg-[#2d2c45] disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-[#2d2c45] rounded hover:bg-[#2d2c45] disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
