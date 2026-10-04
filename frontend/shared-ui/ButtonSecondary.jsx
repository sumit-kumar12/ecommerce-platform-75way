"use client";

export function ButtonSecondary({ children, className = "", disabled, type = "button", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-white px-5 py-3 font-semibold text-slate-900 transition-colors hover:enabled:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:enabled:bg-white/10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
