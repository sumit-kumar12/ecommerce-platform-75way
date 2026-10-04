"use client";
import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Clock, 
    CheckCircle, 
    XCircle, 
    ChevronLeft, 
    ChevronRight, 
    Download,
    RefreshCw,
    Undo2,
    Banknote
} from 'lucide-react';

const refundsData = [
  { id: 'REF-10045', orderId: 'ORD-9821', customer: 'Alice Smith', amount: '$120.00', method: 'Credit Card', date: 'Oct 24, 2023', status: 'Pending' },
  { id: 'REF-10046', orderId: 'ORD-9822', customer: 'Bob Johnson', amount: '$45.50', method: 'PayPal', date: 'Oct 23, 2023', status: 'Processing' },
  { id: 'REF-10047', orderId: 'ORD-9810', customer: 'Charlie Brown', amount: '$300.00', method: 'Bank Transfer', date: 'Oct 21, 2023', status: 'Completed' },
  { id: 'REF-10048', orderId: 'ORD-9799', customer: 'Diana Prince', amount: '$15.99', method: 'Credit Card', date: 'Oct 20, 2023', status: 'Declined' },
  { id: 'REF-10049', orderId: 'ORD-9750', customer: 'Evan Wright', amount: '$89.00', method: 'Store Credit', date: 'Oct 19, 2023', status: 'Completed' },
];

export default function RefundsPage() {
    const [activeTab, setActiveTab] = useState('All');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Declined': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0E17] text-gray-200 p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Refund Management</h1>
                        <p className="text-sm text-gray-400 mt-1">Process and track customer refunds</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1827] border border-[#2d2c45] rounded-lg hover:bg-[#2d2c45] transition-colors text-sm">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Total Refunds', value: '$12,450', subtext: '+15% from last month', icon: Undo2, color: 'text-blue-400' },
                        { title: 'Pending', value: '24', subtext: 'Needs processing', icon: Clock, color: 'text-amber-400' },
                        { title: 'Refunds Today', value: '8', subtext: '$420.00 total', icon: RefreshCw, color: 'text-indigo-400' },
                        { title: 'Avg. Refund Time', value: '2.4 days', subtext: '-0.5 days from last month', icon: Banknote, color: 'text-emerald-400' },
                    ].map((kpi, idx) => (
                        <div key={idx} className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-[#0F0E17] border border-[#2d2c45] ${kpi.color}`}>
                                    <kpi.icon size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium">{kpi.title}</h3>
                                <div className="text-2xl font-bold text-white mt-1">{kpi.value}</div>
                                <p className="text-xs text-gray-500 mt-1">{kpi.subtext}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl overflow-hidden flex flex-col">
                    {/* Tabs & Controls */}
                    <div className="p-4 border-b border-[#2d2c45] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center space-x-1 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
                            {['All', 'Pending', 'Processing', 'Completed'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTab === tab
                                            ? 'bg-indigo-500/10 text-indigo-400'
                                            : 'text-gray-400 hover:text-gray-200 hover:bg-[#2d2c45]/50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full lg:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search order or ID..." 
                                    className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <button className="flex items-center justify-center p-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg hover:bg-[#2d2c45] transition-colors">
                                <Filter size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-[#2d2c45] bg-[#0F0E17]/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Refund ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2d2c45]">
                                {refundsData.map((refund) => (
                                    <tr key={refund.id} className="hover:bg-[#2d2c45]/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-white">{refund.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href="#" className="text-sm text-indigo-400 hover:underline">{refund.orderId}</a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-300">{refund.customer}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-white">{refund.amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-400">{refund.method}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-400">{refund.date}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(refund.status)}`}>
                                                {refund.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2d2c45] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-[#2d2c45] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F0E17]/30">
                        <span className="text-sm text-gray-400">
                            Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">5</span> of <span className="font-medium text-white">24</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-[#2d2c45] rounded-lg text-gray-400 hover:text-white hover:bg-[#2d2c45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium">1</button>
                            <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#2d2c45] rounded-lg text-sm transition-colors">2</button>
                            <button className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#2d2c45] rounded-lg text-sm transition-colors">3</button>
                            <button className="p-2 border border-[#2d2c45] rounded-lg text-gray-400 hover:text-white hover:bg-[#2d2c45] transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
