"use client";

export function ThreatGauge({ score = 0, size = 160 }) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = (size - 24) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Arc from 135deg to 405deg (270deg sweep)
  const startAngle = 135;
  const endAngle = 405;
  const sweepDeg = endAngle - startAngle;
  const filled = (clampedScore / 100) * sweepDeg;

  function polar(angleDeg, r) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function arcPath(start, end, r) {
    const s = polar(start, r);
    const e = polar(end, r);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s[0]} ${s[1]} A ${r} ${r} 0 ${large} 1 ${e[0]} ${e[1]}`;
  }

  const getColor = (s) => {
    if (s >= 80) return "#ef4444";
    if (s >= 60) return "#f97316";
    if (s >= 40) return "#eab308";
    return "#22c55e";
  };

  const getLabel = (s) => {
    if (s >= 80) return "CRITICAL";
    if (s >= 60) return "HIGH RISK";
    if (s >= 40) return "MEDIUM";
    return "LOW RISK";
  };

  const color = getColor(clampedScore);
  const label = getLabel(clampedScore);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <path
          d={arcPath(startAngle, endAngle, radius)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {clampedScore > 0 && (
          <path
            d={arcPath(startAngle, startAngle + filled, radius)}
            stroke="url(#gauge-grad)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
        {/* Score text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="white"
          fontSize={size / 5}
          fontWeight="800"
          fontFamily="Space Grotesk, sans-serif"
        >
          {clampedScore}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#64748b"
          fontSize="10"
          fontFamily="Space Grotesk, sans-serif"
        >
          /100
        </text>
      </svg>
      <span className="text-xs font-bold tracking-widest mt-1" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export function CaseHealthGauge({ score = 84, size = 100 }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  const label = pct >= 70 ? "Healthy" : pct >= 40 ? "At Risk" : "Critical";
  const r = (size - 16) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
          {pct}%
        </text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}
