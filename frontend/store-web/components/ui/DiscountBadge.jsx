export default function DiscountBadge({ discount, className = "" }) {
  if (!discount || discount <= 0) return null;
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md bg-primary text-white text-[10px] sm:text-xs font-bold leading-none tracking-wide shadow-sm ${className}`}>
      {discount}% OFF
    </span>
  );
}
