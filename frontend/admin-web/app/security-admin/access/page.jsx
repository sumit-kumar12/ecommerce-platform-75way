import React from 'react';

export default function AccessManagementPage() {
  const tabs = ['Users', 'Roles', 'Permissions', 'API Keys', 'Service Accounts'];
  
  const users = [
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=alice', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=bob', role: 'Security Analyst', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=charlie', role: 'Read Only', status: 'Inactive', lastLogin: '5 days ago' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', avatar: 'https://i.pravatar.cc/150?u=diana', role: 'Security Manager', status: 'Active', lastLogin: 'Today at 9:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0E17] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Access Management</h1>
            <p className="text-gray-400 mt-1">Manage users, roles, and permissions across the platform.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            + Add User/Role
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  idx === 0 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* User Directory Table */}
        <div className="bg-[#1A1827] rounded-lg shadow border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-800/30">
            <h2 className="text-lg font-medium">User Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Last Login</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-700" />
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{user.email}</td>
                    <td className="p-4">
                      <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded text-xs font-medium border border-gray-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{user.lastLogin}</td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-white transition-colors text-sm font-medium mr-3">Edit</button>
                      <button className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
