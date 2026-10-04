import Link from "next/link";

export function ProductsTable({ products, onDelete, onToggleStatus, selectedIds = [], onSelectRow, onSelectAll }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <span className="material-symbols-outlined text-zinc-500 text-5xl mb-4">inventory_2</span>
        <h3 className="text-xl font-medium text-zinc-200 mb-2">No products found</h3>
        <p className="text-zinc-400 mb-6">You haven't added any products matching this criteria yet.</p>
        <Link href="/products/new" className="bg-[#8C63F5] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#7b53e4] transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Product
        </Link>
      </div>
    );
  }

  const allSelected = products.length > 0 && products.every(p => selectedIds.includes(p.id));

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-800">
        <thead className="bg-zinc-900/50">
          <tr>
            <th className="px-4 py-3 text-left w-12">
              <input 
                type="checkbox" 
                checked={allSelected} 
                onChange={(e) => onSelectAll?.(e.target.checked)} 
                className="rounded border-zinc-700 bg-zinc-900 text-[#8C63F5] focus:ring-[#8C63F5] focus:ring-offset-zinc-900" 
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Stock</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Views</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-950 divide-y divide-zinc-800">
          {products.map((product) => {
            const isActive = product.isActive;
            const stock = Number(product.stockQuantity || product.stock || 0);
            const isOutOfStock = stock <= 0;
            const isLowStock = stock > 0 && stock <= 10;
            const isSelected = selectedIds.includes(product.id);
            
            let statusText = isActive ? "Active" : "Inactive";
            let statusBadgeClass = isActive ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20" : "bg-red-500/10 text-red-500 border border-red-500/20";
            if (isOutOfStock) {
              statusText = "Out of Stock";
              statusBadgeClass = "bg-red-500/10 text-red-500 border border-red-500/20";
            } else if (isLowStock) {
              statusText = "Low Stock";
              statusBadgeClass = "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
            }

            const views = Math.floor(Math.random() * 2000);

            return (
              <tr key={product.id} className={`hover:bg-zinc-900/50 transition-colors ${isSelected ? 'bg-zinc-900/30' : ''}`}>
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={(e) => onSelectRow?.(product.id, e.target.checked)} 
                    className="rounded border-zinc-700 bg-zinc-900 text-[#8C63F5] focus:ring-[#8C63F5] focus:ring-offset-zinc-900" 
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.thumbnailImageUrl || (product.images && product.images[0]?.url) ? (
                      <img src={product.thumbnailImageUrl || product.images[0].url} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-zinc-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-zinc-600 text-sm">image</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-200">{product.name}</span>
                      <span className="text-xs text-zinc-500">{product.category?.name || "Uncategorized"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300">
                  {Number.isNaN(Number(product.price ?? product.variants?.[0]?.price))
                    ? "₹0"
                    : `₹${Number(product.price ?? product.variants?.[0]?.price ?? 0).toLocaleString()}`}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300">{stock}</td>
                <td className="px-4 py-3 text-sm">
                  <button 
                    onClick={() => onToggleStatus && !isOutOfStock && onToggleStatus(product.id, isActive)}
                    disabled={isOutOfStock || !onToggleStatus}
                    title={isOutOfStock ? "Cannot activate out-of-stock product" : "Click to toggle status"}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-100 disabled:cursor-default ${statusBadgeClass}`}
                  >
                    {statusText}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    {views.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/products/${product.id}/analytics`} title="Analytics" className="p-1.5 hover:text-[#00DAFF] hover:bg-[#00DAFF]/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">analytics</span>
                    </Link>
                    <Link href={`/products/${product.id}/variants`} title="Variants" className="p-1.5 hover:text-[#10B861] hover:bg-[#10B861]/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                    </Link>
                    <Link href={`/products/${product.id}/media`} title="Media" className="p-1.5 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">photo_library</span>
                    </Link>
                    <Link href={`/products/${product.id}`} title="Edit" className="p-1.5 hover:text-[#8C63F5] hover:bg-[#8C63F5]/10 rounded-lg transition-colors ml-1">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </Link>
                    {onDelete && (
                      <button onClick={() => onDelete(product.id)} title="Delete" className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-1">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

