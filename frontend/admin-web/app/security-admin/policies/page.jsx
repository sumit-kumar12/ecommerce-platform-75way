"use client";
import React, { useState } from 'react';
import { Shield, Plus, MoreVertical, FileText, CheckCircle2, Clock, ShieldOff, Search, FileEdit, Trash2, ShieldCheck, FileArchive } from 'lucide-react';

const SecurityPolicies = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['ACTIVE', 'DRAFT', 'ARCHIVED'];

  React.useEffect(() => {
    let active = true;
    import('../../../lib/api').then(({ adminRequest }) => {
      return adminRequest('/compliance/policies');
    }).then(res => {
      if (active) {
        setPolicies(res.policies || []);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (active) {
        setError(err.message || 'Failed to load policies');
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const filteredPolicies = policies.filter(p => {
    if (activeTab === 'ACTIVE') return p.status === 'ACTIVE';
    if (activeTab === 'DRAFT') return p.status === 'DRAFT';
    if (activeTab === 'ARCHIVED') return p.status === 'ARCHIVED';
    return true;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ACTIVE': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'DRAFT': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'ARCHIVED': return <ShieldOff className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E17] text-gray-200 p-6 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-500" />
              Security Policies
            </h1>
            <p className="text-sm text-gray-400 mt-1">Manage and enforce security rules and compliance policies.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-indigo-500/20">
              <Plus className="w-5 h-5" /> Create Policy
            </button>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1A1827] p-2 rounded-xl border border-gray-800 shadow-sm">
          <div className="flex space-x-1 p-1 bg-[#0F0E17] rounded-lg w-full sm:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap flex-1 sm:flex-none ${
                  activeTab === tab 
                    ? 'bg-[#1A1827] text-white shadow shadow-black/20' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1827]/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72 px-2 pb-2 sm:p-0">
            <Search className="w-4 h-4 absolute left-4 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search policies..." 
              className="w-full bg-[#0F0E17] border border-gray-700 text-sm text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1A1827] border border-gray-800 rounded-xl shadow-lg flex-grow flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F0E17] border-b border-gray-800">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Policy Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Updated By</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-red-500">{error}</td>
                  </tr>
                ) : filteredPolicies.length > 0 ? (
                  filteredPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-[#232135] transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#0F0E17] border border-gray-800 group-hover:border-gray-700 transition-colors">
                            <FileText className="w-4 h-4 text-indigo-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-200">{policy.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-400 bg-[#0F0E17] px-2.5 py-1 rounded-md border border-gray-800">
                          {policy.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(policy.status)}
                          <span className="text-sm text-gray-300">{policy.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(policy.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{policy.updatedBy?.email || policy.updatedById || 'System'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                            <FileEdit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileArchive className="w-12 h-12 text-gray-700 mb-3" />
                        <p>No policies found in this view.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer KPIs */}
        <div className="mt-auto pt-6 border-t border-gray-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1A1827] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Policies</p>
                <p className="text-xl font-bold text-white mt-1">{policies.length}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-500/20" />
            </div>
            <div className="bg-[#1A1827] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">{policies.filter(p => p.status === 'ACTIVE').length}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-500/20" />
            </div>
            <div className="bg-[#1A1827] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Drafts</p>
                <p className="text-xl font-bold text-yellow-400 mt-1">{policies.filter(p => p.status === 'DRAFT').length}</p>
              </div>
              <FileEdit className="w-8 h-8 text-yellow-500/20" />
            </div>
            <div className="bg-[#1A1827] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Expired/Archived</p>
                <p className="text-xl font-bold text-red-400 mt-1">{policies.filter(p => p.status === 'ARCHIVED' || p.status === 'EXPIRED').length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500/20" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecurityPolicies;
