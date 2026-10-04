import Link from "next/link";
import { pickCategoryIcon } from "../../lib/catalog";

export default function TopCategories({ categories }) {
  const displayCategories = categories?.length > 0 ? categories.slice(0, 6) : [
    { id: "c1", name: "Electronics", slug: "electronics", icon: "devices" },
    { id: "c2", name: "Fashion", slug: "fashion", icon: "checkroom" },
    { id: "c3", name: "Home & Kitchen", slug: "home", icon: "home" },
    { id: "c4", name: "Beauty", slug: "beauty", icon: "face_retouching_natural" },
    { id: "c5", name: "Sports", slug: "sports", icon: "sports_basketball" },
  ];

  return (
    <section className="py-8 md:py-12 bg-[#0F0E17]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-white">Top Categories</h2>
          <Link href="/products" className="text-[#8B5CF6] hover:text-white text-xs md:text-sm font-semibold flex items-center gap-1 transition-colors">
            View All <span className="material-symbols-outlined text-xs md:text-sm">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-6">
          {displayCategories.map((cat, i) => (
            <Link 
              key={cat.id || i} 
              href={`/category/${encodeURIComponent(cat.slug)}`}
              className="flex flex-col items-center gap-2 md:gap-3 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#8B5CF6] group-hover:bg-[#8B5CF6]/10 group-hover:border-[#8B5CF6]/50 transition-all duration-300 transform group-hover:-translate-y-1">
                <span className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl">
                  {pickCategoryIcon(cat)}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 group-hover:text-white transition-colors text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
          
          {/* If less than 6, we can show a "More" button, but for now we map what we have. If exactly 5, let's hardcode a 'More' link */}
          {displayCategories.length >= 5 && (
            <Link 
              href="/products"
              className="flex flex-col items-center gap-2 md:gap-3 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-white/30 transition-all duration-300 transform group-hover:-translate-y-1">
                <span className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl">
                  more_horiz
                </span>
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 group-hover:text-white transition-colors text-center leading-tight">
                More
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
