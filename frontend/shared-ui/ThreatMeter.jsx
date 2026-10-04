"use client";

export function ThreatMeter({ score = 0, threshold = 15, label, className = "" }) {
  const pct = Math.min(100, Math.round((Number(score) / Math.max(1, threshold)) * 100));
  const level = pct >= 90 ? "high" : pct >= 50 ? "medium" : "low";
  const segments = 20;
  const filledSegments = Math.max(0, Math.min(segments, Math.round((pct / 100) * segments)));
  const segmentClass =
    level === "high"
      ? "bg-red-500/80"
      : level === "medium"
        ? "bg-amber-400/80"
        : "bg-emerald-400/80";
  return (
    <div className={className}>
      {label ? (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-slate-400">{label}</span>
          <span>{score} / {threshold}</span>
        </div>
      ) : null}
      <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-0.5 rounded-full bg-white/10 p-0.5">
        {Array.from({ length: segments }).map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full ${idx < filledSegments ? segmentClass : "bg-transparent"}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
