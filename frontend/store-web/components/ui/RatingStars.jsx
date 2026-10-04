import { Star } from "lucide-react";

export default function RatingStars({ rating, count = null, className = "" }) {
  const fullStars = Math.floor(rating || 0);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < fullStars ? "fill-warning text-warning" : "fill-transparent text-border"}`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-text-primary">
        {(rating || 0).toFixed(1)}
      </span>
      {count !== null && (
        <span className="text-sm text-text-muted">
          ({count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count})
        </span>
      )}
    </div>
  );
}
