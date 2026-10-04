"use client";

export function RuleTogglePanel({
  title = "Payment rules",
  rules = [],
  onToggle,
  disabled,
  className = "",
}) {
  return (
    <div className={`rounded-[20px] border border-white/10 bg-slate-900/40 p-4 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold text-slate-100">{title}</h3>
      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r.id ?? r.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-400">{r.label ?? r.key}</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={!!r.value}
                onChange={() => onToggle?.(r.key, !r.value)}
                disabled={disabled}
                className="peer sr-only"
              />
              <div
                className={`h-6 w-11 rounded-full bg-white/10 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 ${disabled ? "opacity-60" : ""}`}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
