"use client";
export function DateRangeFilter({ selected, onChange }) {
  const ranges = [
    { id: "7D", label: "7 Days" },
    { id: "30D", label: "30 Days" },
    { id: "90D", label: "3 Months" },
    { id: "YTD", label: "Year to Date" },
    { id: "ALL", label: "All Time" }
  ];

  return (
    <div className="flex bg-[#1a192b] border border-[#2d2c45] rounded-xl p-1 w-fit">
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => onChange(range.id)}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            selected === range.id
              ? "bg-[#8C63F5] text-white shadow-md shadow-[#8C63F5]/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
