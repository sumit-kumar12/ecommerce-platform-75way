export function AccountHero({ name }) {
  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 md:p-8 flex items-center justify-between relative overflow-hidden mb-8">
      {/* Background flare */}
      <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#8C63F5] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
          Welcome back, {name}! 👋
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Here is an overview of your recent activity and rewards.
        </p>
      </div>
      
      <div className="hidden md:flex gap-4">
        <button className="bg-[#121121] border border-[#2d2c45] hover:border-[#8C63F5] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
