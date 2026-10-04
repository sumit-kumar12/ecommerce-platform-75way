"use client";

export function SecureBadge({ children = "Secure", className = "" }) {
  return (
    <span
      className={`inline-block rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-200 ${className}`}
    >
      {children}
    </span>
  );
}
