"use client";

const CHAIN_STEPS = [
  { id: "recon",    label: "Recon",      icon: "🔍", tactic: "TA0043" },
  { id: "access",   label: "Init Access", icon: "🚪", tactic: "TA0001" },
  { id: "exec",     label: "Execution",   icon: "⚡", tactic: "TA0002" },
  { id: "cred",     label: "Cred Access", icon: "🔑", tactic: "TA0006" },
  { id: "persist",  label: "Persistence", icon: "🔒", tactic: "TA0003" },
  { id: "privesc",  label: "Priv Esc",    icon: "⬆️", tactic: "TA0004" },
  { id: "exfil",    label: "Exfiltration",icon: "📤", tactic: "TA0010" },
];

export function AttackChain({ activeSteps = [], compact = false }) {
  const activeSet = new Set(activeSteps);

  return (
    <div className={`flex items-center gap-0 ${compact ? "flex-wrap gap-1" : "overflow-x-auto"}`}>
      {CHAIN_STEPS.map((step, idx) => {
        const isActive = activeSet.has(step.id) || activeSet.has(step.tactic) || idx < (activeSteps.length || 0);
        const isLast = idx === CHAIN_STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center shrink-0">
            {/* Step node */}
            <div className={`
              flex flex-col items-center gap-1 group cursor-default
              ${compact ? "p-1" : "p-2"}
            `}>
              <div className={`
                ${compact ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-sm"}
                rounded-full flex items-center justify-center font-bold
                border-2 transition-all duration-300
                ${isActive
                  ? "bg-red-500/20 border-red-500/60 shadow-lg shadow-red-500/20"
                  : "bg-white/5 border-white/10 opacity-40"
                }
              `}>
                {isActive ? "✓" : (idx + 1)}
              </div>
              {!compact && (
                <span className={`text-[9px] font-semibold text-center leading-tight whitespace-nowrap ${isActive ? "text-red-400" : "text-gray-600"}`}>
                  {step.label}
                </span>
              )}
            </div>
            {/* Connector arrow */}
            {!isLast && (
              <div className={`flex items-center ${compact ? "mx-0.5" : "mx-1"}`}>
                <div className={`h-px w-4 ${isActive ? "bg-red-500/60" : "bg-white/10"} transition-colors`} />
                <svg width="6" height="8" viewBox="0 0 6 8" fill="none" className={isActive ? "text-red-500/60" : "text-white/10"}>
                  <path d="M0 0L6 4L0 8V0Z" fill="currentColor" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
