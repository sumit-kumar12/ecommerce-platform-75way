"use client";

export function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  disabled,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100">
          {label}
          {required ? " *" : ""}
        </label>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition-colors outline-none ${
          error
            ? "border-red-700/60 bg-red-500/5 text-red-200 focus:ring-2 focus:ring-red-500/30"
            : "border-slate-900/15 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        }`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
