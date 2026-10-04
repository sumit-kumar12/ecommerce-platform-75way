"use client";

export function ThreatBadge({ level = "low", children, className = "" }) {
  const cls =
    level === "high"
      ? "bg-red-500/15 text-red-200"
      : level === "medium"
        ? "bg-amber-500/15 text-amber-200"
        : "bg-emerald-500/15 text-emerald-200";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${cls} ${className}`}
    >
      {children ?? level}
    </span>
  );
}
