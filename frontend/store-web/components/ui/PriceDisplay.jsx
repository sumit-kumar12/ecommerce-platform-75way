export default function PriceDisplay({ price, mrp, discount, size = "md", className = "" }) {
  const sizeClasses = {
    sm: { price: "text-lg", mrp: "text-sm", discount: "text-xs" },
    md: { price: "text-xl", mrp: "text-base", discount: "text-sm" },
    lg: { price: "text-2xl md:text-3xl", mrp: "text-lg", discount: "text-base" },
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

  const formattedMrp = mrp
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(mrp)
    : null;

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={`font-bold text-text-primary ${sizeClasses[size].price}`}>
        {formattedPrice}
      </span>
      {formattedMrp && (
        <span className={`line-through text-mrp ${sizeClasses[size].mrp}`}>
          {formattedMrp}
        </span>
      )}
      {discount > 0 && (
        <span className={`font-medium text-success ${sizeClasses[size].discount}`}>
          {discount}% off
        </span>
      )}
    </div>
  );
}
