import Link from "next/link";
import ProductCard from "../product/ProductCard";

export default function BestSellers({ products, loading }) {
  // Use fallback dummy data if none provided (for UI visualization)
  const displayProducts = (!loading && products?.length > 0) ? products : [
    { id: "p1", name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", rating: 4.8, reviews: 2450, variants: [{ id: "v1", price: 29990 }] },
    { id: "p2", name: "Samsung Galaxy S23 Ultra 5G (Phantom Black, 256GB)", rating: 4.7, reviews: 1840, variants: [{ id: "v2", price: 124999 }] },
    { id: "p3", name: "Apple iPad Air (5th Generation)", rating: 4.9, reviews: 3200, variants: [{ id: "v3", price: 59900 }] },
    { id: "p4", name: "Dyson V15 Detect Absolute Cord-Free Vacuum", rating: 4.6, reviews: 890, variants: [{ id: "v4", price: 62900 }] },
    { id: "p5", name: "LG 55 inch 4K Ultra HD Smart OLED TV", rating: 4.8, reviews: 1120, variants: [{ id: "v5", price: 89990 }] },
    { id: "p6", name: "PlayStation 5 Console - God of War Bundle", rating: 4.9, reviews: 5400, variants: [{ id: "v6", price: 54990 }] },
    { id: "p7", name: "Nike Air Force 1 '07", rating: 4.7, reviews: 8200, variants: [{ id: "v7", price: 7495 }] },
    { id: "p8", name: "Nespresso Vertuo Next Coffee and Espresso Maker", rating: 4.5, reviews: 2100, variants: [{ id: "v8", price: 15999 }] },
  ];

  return (
    <section className="py-8 md:py-16 bg-background-dark">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-12">
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-[10px] md:text-xs mb-1 md:mb-2 block">Featured Collection</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary">Our Best Sellers</h2>
          </div>
          <Link href="/products" className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-surface border border-border/50 text-text-primary hover:text-primary hover:border-primary/50 transition-colors font-medium text-xs md:text-sm w-full sm:w-fit">
            View Collection <span className="material-symbols-outlined text-xs md:text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl md:rounded-2xl h-[280px] md:h-[360px] animate-pulse border border-border/20"></div>
            ))
          ) : (
            displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
