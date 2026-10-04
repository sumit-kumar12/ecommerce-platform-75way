"use client";

export function ProductCard({
  id,
  name,
  description,
  categoryName,
  price,
  priceFormatted,
  href,
  LinkComponent,
  onAddToCart,
  onAddToWishlist,
  addToCartDisabled,
  className = "",
}) {
  const url = href ?? (id != null ? `/product/${id}` : "#");
  const LinkOrA = LinkComponent ?? "a";
  return (
    <article
      className={`relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_32px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-[180ms] ease-out hover:scale-[1.02] hover:shadow-xl dark:bg-slate-900/60 ${className}`}
    >
      {onAddToWishlist ? (
        <button
          type="button"
          aria-label={`Add ${name} to wishlist`}
          onClick={() => onAddToWishlist(id)}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 px-2.5 py-1.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300"
        >
          Wish
        </button>
      ) : null}
      <LinkOrA
        href={url}
        className="flex min-h-[170px] items-end justify-start bg-gradient-to-br from-indigo-600/30 to-blue-600/20 p-4"
      >
        <span className="text-sm font-medium">{categoryName ?? "Luxury"}</span>
      </LinkOrA>
      <div className="p-4">
        <h3 className="m-0 text-lg font-semibold">{name}</h3>
        <p className="min-h-[44px] text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <strong>{priceFormatted ?? (price != null ? `₹${Number(price).toFixed(2)}` : "—")}</strong>
          {onAddToCart ? (
            <button
              type="button"
              onClick={() => onAddToCart()}
              disabled={addToCartDisabled}
              className="rounded-full bg-indigo-600/15 px-3.5 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-600/20 disabled:opacity-50 dark:text-slate-100"
            >
              Add
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
