"use client";

export function CheckoutStepper({ steps = [], currentIndex = 0, className = "" }) {
  return (
    <ul className={`flex list-none gap-2 p-0 ${className}`}>
      {steps.map((step, i) => (
        <li
          key={step.id ?? i}
          className={`flex flex-1 items-center gap-2 rounded-2xl px-3 py-2.5 ${i === currentIndex ? "bg-indigo-600/15" : "bg-slate-900/5 dark:bg-white/5"}`}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/10 text-sm font-medium text-slate-900 dark:bg-white/10 dark:text-slate-100"
          >
            {i + 1}
          </span>
          <span className="text-sm font-medium">{step.label ?? step}</span>
        </li>
      ))}
    </ul>
  );
}
