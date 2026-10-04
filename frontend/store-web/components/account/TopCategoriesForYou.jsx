import Link from "next/link";

export function TopCategoriesForYou({ categories }) {
  const defaultCategories = [
    { name: "Electronics", icon: "smartphone", color: "#8C63F5", href: "/category/electronics" },
    { name: "Fashion", icon: "checkroom", color: "#F59E0B", href: "/category/fashion" },
    { name: "Home & Living", icon: "chair", color: "#10B861", href: "/category/home" },
    { name: "Sports", icon: "sports_basketball", color: "#00DAFF", href: "/category/sports" },
  ];

  const cats = categories || defaultCategories;

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-6">Top Categories For You</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cats.map((cat, idx) => (
          <Link 
            key={idx} 
            href={cat.href}
            className="flex flex-col items-center justify-center p-4 bg-[#121121] border border-[#2d2c45] hover:border-[#8C63F5] rounded-xl transition-all group hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-[#8C63F5]/10"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors"
              style={{ 
                backgroundColor: `${cat.color}15`, 
                color: cat.color 
              }}
            >
              <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
            </div>
            <span className="text-sm font-bold text-slate-300 group-hover:text-white text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
