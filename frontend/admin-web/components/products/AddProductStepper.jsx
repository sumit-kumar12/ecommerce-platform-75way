export function AddProductStepper({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-between relative mb-8">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#2d2c45] -translate-y-1/2 z-0"></div>
      
      {/* Active Line Progress */}
      <div 
        className="absolute top-1/2 left-0 h-[2px] bg-[#8C63F5] -translate-y-1/2 z-0 transition-all duration-300" 
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-[#0F0E17] px-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                isActive 
                  ? "bg-[#8C63F5] border-[#8C63F5] text-white shadow-[0_0_15px_rgba(140,99,245,0.4)]" 
                  : isCompleted 
                    ? "bg-[#10B861] border-[#10B861] text-white" 
                    : "bg-[#1a192b] border-[#2d2c45] text-slate-500"
              }`}
            >
              {isCompleted ? <span className="material-symbols-outlined text-[20px]">check</span> : stepNum}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider absolute top-12 whitespace-nowrap ${
              isActive ? "text-white" : isCompleted ? "text-[#10B861]" : "text-slate-500"
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

