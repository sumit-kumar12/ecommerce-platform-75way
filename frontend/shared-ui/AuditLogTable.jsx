"use client";

export function AuditLogTable({ rows = [], columns = ["timestamp", "actorId", "action", "targetType", "details"], className = "" }) {
  const defaultCols = ["timestamp", "actorId", "action", "targetType", "details"];
  const cols = columns.length ? columns : defaultCols;
  return (
    <div className={`overflow-x-auto rounded-[20px] border border-white/10 bg-slate-900/40 ${className}`}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {cols.map((c) => (
              <th key={c} className="px-4 py-3 text-left font-semibold capitalize text-slate-400">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-white/5">
              {cols.map((col) => (
                <td key={col} className="px-4 py-2 text-slate-100">
                  {typeof row[col] === "object" && row[col] !== null ? JSON.stringify(row[col]) (row[col] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="p-4 text-center text-sm text-slate-400">No audit entries.</p>
      ) : null}
    </div>
  );
}
