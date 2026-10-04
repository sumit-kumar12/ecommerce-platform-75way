"use client";

export function CartDrawer({
  open,
  onClose,
  children,
  footer,
  guestWarning,
  title = "Cart",
  className = "",
}) {
  return (
    <aside
      className={`fixed top-0 right-0 z-30 grid h-full w-[min(400px,92vw)] grid-rows-[auto_auto_1fr_auto] border-l border-slate-900/10 bg-white/90 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900/60 ${open ? "translate-x-0" : "translate-x-[105%]"} ${className}`}
    >
      <header className="flex items-center justify-between border-b border-[rgba(15,23,42,0.08)] p-4">
        <h3 className="m-0 text-lg font-semibold">{title}</h3>
        <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-black/5" aria-label="Close cart">
          Close
        </button>
      </header>
      {guestWarning ? (
        <div className="mx-4 mt-2 rounded-xl bg-amber-500/15 px-3 py-2.5 text-sm text-amber-800 dark:text-amber-200">
          {guestWarning}
        </div>
      ) : null}
      <div className="overflow-y-auto p-4">{children}</div>
      {footer ? <footer className="border-t border-[rgba(15,23,42,0.08)] p-4">{footer}</footer> : null}
    </aside>
  );
}
