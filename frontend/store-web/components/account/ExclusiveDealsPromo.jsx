import Link from "next/link";

export function ExclusiveDealsPromo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Promo Banner 1 */}
      <div className="bg-gradient-to-r from-[#8C63F5] to-[#6a64f1] rounded-2xl p-6 relative overflow-hidden group h-[160px] flex flex-col justify-center">
        <div className="absolute right-[-10%] top-[-20%] w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1 block">Exclusive Deals</span>
          <h3 className="text-2xl font-bold text-white mb-2">Up to 70% OFF</h3>
          <Link href="/deals" className="inline-flex items-center gap-1 text-sm font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors w-fit">
            Shop Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Promo Banner 2 */}
      <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 relative overflow-hidden group h-[160px] flex flex-col justify-center">
        <div className="absolute right-[-10%] top-[-20%] w-48 h-48 bg-[#00DAFF]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-[#00DAFF] text-xs font-bold uppercase tracking-widest mb-1 block">Partner Program</span>
          <h3 className="text-xl font-bold text-white mb-2">Become a Seller</h3>
          <p className="text-slate-400 text-sm mb-3 max-w-[80%] line-clamp-1">Start selling your products to millions.</p>
          <Link href="/seller/apply" className="inline-flex items-center gap-1 text-sm font-bold text-[#121121] bg-[#00DAFF] hover:bg-[#00c4e5] px-4 py-2 rounded-lg transition-colors w-fit shadow-lg shadow-[#00DAFF]/20">
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
