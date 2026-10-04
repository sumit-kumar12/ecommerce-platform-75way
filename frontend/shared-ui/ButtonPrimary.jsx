"use client";

export function ButtonPrimary({ children, className = "", disabled, type = "button", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold text-white shadow-[0_12px_34px_rgba(79,70,229,0.35)] transition-[transform,box-shadow] duration-200 hover:enabled:scale-[1.02] disabled:opacity-60 bg-gradient-to-r from-indigo-600 to-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
