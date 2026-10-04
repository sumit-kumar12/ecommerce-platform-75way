"use client";

export function GlassPanel({ children, className = "", variant = "light", ...props }) {
  const isDark = variant === "dark";
  return (
    <div
      className={`rounded-[20px] border p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.10)] text-slate-900 dark:text-slate-100 ${isDark ? "bg-slate-900/60 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.20)]" : "bg-white/80 border-slate-900/10"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
