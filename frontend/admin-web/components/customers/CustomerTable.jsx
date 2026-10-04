import React, { useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../lib/api';

export function CustomerTable({ customers, currentUser, onRefresh }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleToggleActive = async (e, user) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    try {
      setLoadingAction(user.id);
      await apiRequest(`/admin/users/${user.id}/active`, {
        method: "PATCH",
        body: { isActive: !user.isActive }
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to update user status.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRoleChange = async (e, user, newRole) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoadingAction(user.id);
      await apiRequest(`/admin/users/${user.id}/role`, {
        method: "PATCH",
        body: { role: newRole }
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to update user role.");
    } finally {
      setLoadingAction(null);
    }
  };
  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <span className="material-symbols-outlined text-zinc-500 text-5xl mb-4">group_off</span>
        <h3 className="text-xl font-medium text-zinc-200 mb-2">No customers found</h3>
        <p className="text-zinc-400">Your customer database is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-800">
        <thead className="bg-zinc-900/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Orders</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Total Spent</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-950 divide-y divide-zinc-800">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-zinc-900/50 transition-colors group">
              <td className="px-4 py-3 cursor-pointer" onClick={() => window.location.href = `/users/${customer.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">{customer.name}</span>
                    <span className="text-xs text-zinc-500">{customer.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-300 cursor-pointer" onClick={() => window.location.href = `/users/${customer.id}`}>
                {customer.totalOrders || 0}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-300 cursor-pointer" onClick={() => window.location.href = `/users/${customer.id}`}>
                ₹{Number(customer.totalSpent || 0).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm cursor-pointer" onClick={() => window.location.href = `/users/${customer.id}`}>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  customer.isActive !== false
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {customer.isActive !== false ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleToggleActive(e, customer)}
                    disabled={loadingAction === customer.id || customer.id === currentUser?.id}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={customer.id === currentUser?.id ? "Cannot deactivate yourself" : (customer.isActive ? "Deactivate User" : "Activate User")}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {customer.isActive ? 'block' : 'check_circle'}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => handleRoleChange(e, customer, customer.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                    disabled={loadingAction === customer.id || customer.id === currentUser?.id}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={customer.id === currentUser?.id ? "Cannot change own role" : (customer.role === 'ADMIN' ? "Demote to Customer" : "Promote to Admin")}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {customer.role === 'ADMIN' ? 'person_remove' : 'admin_panel_settings'}
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

