export default function CaseLoading() {
  return (
    <div className="min-h-screen bg-[#0b0d14] animate-pulse">
      {/* Header skeleton */}
      <div className="border-b border-[#1e2235] bg-[#0f1117] px-8 py-5">
        <div className="h-3 w-48 bg-white/5 rounded mb-4" />
        <div className="flex items-center gap-3 mb-3">
          <div className="h-6 w-32 bg-white/5 rounded-full" />
          <div className="h-6 w-24 bg-white/5 rounded-full" />
        </div>
        <div className="h-5 w-72 bg-white/5 rounded mb-3" />
        <div className="flex gap-2">
          {[...Array(5)].map((_,i) => <div key={i} className="h-5 w-24 bg-white/5 rounded-full" />)}
        </div>
      </div>

      <div className="flex gap-6 px-8 py-6">
        {/* Main content skeleton */}
        <div className="flex-1 space-y-5">
          {/* Tab bar */}
          <div className="flex gap-2">
            {[...Array(8)].map((_,i) => <div key={i} className="h-9 w-24 bg-white/5 rounded-lg" />)}
          </div>
          {/* Content cards */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="rounded-2xl border border-[#1e2235] bg-[#0f1117] p-5 h-40">
                <div className="h-3 w-20 bg-white/5 rounded mb-4" />
                <div className="h-24 bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#1e2235] bg-[#0f1117] p-5 h-64">
            <div className="h-3 w-32 bg-white/5 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_,i) => <div key={i} className="h-8 bg-white/5 rounded" />)}
            </div>
          </div>
        </div>

        {/* Right panel skeleton */}
        <div className="w-72 space-y-4 shrink-0">
          {[...Array(4)].map((_,i) => (
            <div key={i} className="rounded-2xl border border-[#1e2235] bg-[#0f1117] p-4 h-32">
              <div className="h-3 w-20 bg-white/5 rounded mb-3" />
              <div className="h-20 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
