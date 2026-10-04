"use client";

export const SEVERITY_CFG = {
  Critical:      { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30",    dot: "bg-red-500",    glow: "shadow-red-500/20" },
  High:          { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-500", glow: "shadow-orange-500/20" },
  Medium:        { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30", dot: "bg-yellow-400", glow: "shadow-yellow-500/20" },
  Low:           { bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30",   dot: "bg-blue-400",  glow: "shadow-blue-500/20" },
  Informational: { bg: "bg-slate-500/15",  text: "text-slate-400",  border: "border-slate-500/30",  dot: "bg-slate-400", glow: "shadow-slate-500/20" },
  CRITICAL:      { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30",    dot: "bg-red-500",   glow: "shadow-red-500/20" },
  WARN:          { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-500",glow: "shadow-orange-500/20" },
  INFO:          { bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30",   dot: "bg-blue-400",  glow: "shadow-blue-500/20" },
};

export const STATUS_CFG = {
  Open:        { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/30" },
  "In Progress":{ bg: "bg-violet-500/15", text: "text-violet-400",  border: "border-violet-500/30" },
  "On Hold":   { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/30" },
  Resolved:    { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  Closed:      { bg: "bg-slate-500/15",   text: "text-slate-400",   border: "border-slate-500/30" },
  Active:      { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/30" },
  Critical:    { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/30" },
  High:        { bg: "bg-orange-500/15",  text: "text-orange-400",  border: "border-orange-500/30" },
  Medium:      { bg: "bg-yellow-500/15",  text: "text-yellow-400",  border: "border-yellow-500/30" },
};

export function SeverityBadge({ level, size = "sm" }) {
  const cfg = SEVERITY_CFG[level] || SEVERITY_CFG.Medium;
  const sz = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sz} ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {level}
    </span>
  );
}

export function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Open;
  const sz = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sz} ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, size = "sm" }) {
  return <SeverityBadge level={priority} size={size} />;
}
