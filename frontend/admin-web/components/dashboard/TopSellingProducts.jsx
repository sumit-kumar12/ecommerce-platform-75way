import Link from "next/link";

export function TopSellingProducts({ products = [] }) {
  // If backend returns empty, provide mock top sellers for the dashboard
  const displayProducts = products.length > 0 ? products : [
    { id: 1, name: "boAt Airdopes 141", price: 1299, sales: 423, status: "In Stock" },
    { id: 2, name: "Noise ColorFit Pro 4", price: 2999, sales: 381, status: "Low Stock" },
    { id: 3, name: "ASUS ROG Strix G15", price: 89990, sales: 142, status: "In Stock" },
    { id: 4, name: "Nike Air Max 270", price: 12495, sales: 98, status: "Out of Stock" }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "In Stock": return "bg-[#10B861]/20 text-[#10B861]";
      case "Low Stock": return "bg-[#F59E0B]/20 text-[#F59E0B]";
      case "Out of Stock": return "bg-[#EF4444]/20 text-[#EF4444]";
      default: return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Top Selling Products</h2>
          <p className="text-slate-400 text-sm mt-1">Best performing items by volume</p>
        </div>
        <Link href="/products" className="text-sm font-bold text-[#8C63F5] hover:text-white transition-colors">View Catalog</Link>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2d2c45] text-slate-400 text-xs uppercase tracking-wider">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Sales</th>
              <th className="pb-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2c45]">
            {displayProducts.map((product) => (
              <tr key={product.id} className="hover:bg-[#2d2c45]/30 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0F0E17] flex items-center justify-center border border-[#2d2c45]">
                      <span className="material-symbols-outlined text-slate-500 text-[20px]">inventory_2</span>
                    </div>
                    <span className="font-bold text-white text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 text-slate-300 text-sm">₹{product.price.toLocaleString()}</td>
                <td className="py-4 text-slate-300 text-sm">{product.sales}</td>
                <td className="py-4 text-right">
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

