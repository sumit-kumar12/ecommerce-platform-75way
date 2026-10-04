"use client";
export function StatusFilter({ currentStatus, onStatusChange, counts }) {
  const tabs = [
    { id: "ALL", label: "All", count: counts?.all || 0 },
    { id: "ACTIVE", label: "Active", count: counts?.active || 0 },
    { id: "INACTIVE", label: "Inactive", count: counts?.inactive || 0 },
    { id: "DRAFT", label: "Draft", count: counts?.draft || 0 },
  ];

  return (
    <div className="flex border-b border-[#2d2c45] mb-6 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onStatusChange(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            currentStatus === tab.id
              ? "border-[#8C63F5] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
          }`}
        >
          {tab.label}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            currentStatus === tab.id ? "bg-[#8C63F5]/20 text-[#8C63F5]" : "bg-[#2d2c45] text-slate-400"
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
