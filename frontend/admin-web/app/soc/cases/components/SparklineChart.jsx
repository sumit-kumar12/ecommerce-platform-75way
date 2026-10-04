"use client";

export function SparklineChart({ data = [], color = "#8B5CF6", height = 32, width = 80 }) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="opacity-30 bg-white/5 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padX = 2;
  const padY = 2;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * w;
    const y = padY + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const fillPoints = `${padX},${padY + h} ${polyline} ${padX + w},${padY + h}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        points={polyline}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DonutChart({ segments = [], size = 120, thickness = 18, label, sublabel }) {
  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const arc = { ...seg, dashArray: `${dash} ${gap}`, dashOffset: -offset * circumference };
    offset += pct;
    return arc;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={thickness}
          strokeDasharray={arc.dashArray}
          strokeDashoffset={arc.dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      ))}
      {label && (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
            {label}
          </text>
          {sublabel && (
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="Space Grotesk, sans-serif">
              {sublabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
}

export function MultiLineChart({ series = [], labels = [], height = 100, width = 300 }) {
  const COLORS = ["#8B5CF6", "#22c55e", "#64748b"];
  const allVals = series.flatMap(s => s.data || []);
  const min = 0;
  const max = Math.max(...allVals, 1);
  const padX = 8, padY = 8;
  const w = width - padX * 2;
  const h = height - padY * 2;
  const n = Math.max(...series.map(s => (s.data || []).length));

  const getPoints = (data) =>
    data.map((v, i) => {
      const x = padX + (i / (n - 1)) * w;
      const y = padY + h - ((v - min) / (max - min)) * h;
      return [x, y];
    });

  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={padX} y1={padY + t * h}
          x2={padX + w} y2={padY + t * h}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1"
        />
      ))}
      {series.map((s, si) => {
        if (!s.data || s.data.length < 2) return null;
        const pts = getPoints(s.data);
        const color = s.color || COLORS[si % COLORS.length];
        return (
          <g key={si}>
            <path d={toPath(pts)} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, pi) => (
              <circle key={pi} cx={p[0]} cy={p[1]} r="2.5" fill={color} stroke="#0b0d14" strokeWidth="1.5" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
