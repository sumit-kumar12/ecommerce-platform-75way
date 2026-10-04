"use client";

export function BroadcastAlertPanel({ title = "Alert", severity = "info", message, onDismiss, className = "" }) {
  const panelClass =
    severity === "critical" || severity === "error"
      ? "bg-red-500/15 border-red-500/40"
      : severity === "warn"
        ? "bg-amber-500/15 border-amber-500/40"
        : "bg-indigo-600/10 border-indigo-600/30";
  return (
    <div
      className={`rounded-[20px] border p-4 ${panelClass} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-100">{title}</h4>
          {message ? <p className="mt-1 text-sm text-slate-300">{message}</p> : null}
        </div>
        {onDismiss ? (
          <button type="button" onClick={onDismiss} className="shrink-0 rounded p-1 hover:opacity-80" aria-label="Dismiss">
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
