import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  selectedShopId?: string | null;
  onClearShopFilter?: () => void;
}

const CATEGORIES = [
  'All',
  'Cars & Automotive',
  'Electronics',
  'Fashion & Shoes',
  'Beauty & Fragrance',
  'Home & Living',
  'Smartphones & Gadgets'
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onQuickBuy,
  selectedShopId,
  onClearShopFilter
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [videoOnly, setVideoOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedShopId) {
      result = result.filter((p) => p.shopId === selectedShopId);
    }

    if (activeCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    if (videoOnly) {
      result = result.filter((p) => Boolean(p.videoUrl));
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.priceRwf - b.priceRwf);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.priceRwf - a.priceRwf);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedShopId, activeCategory, videoOnly, sortBy]);

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Mall Marketplace
            </h2>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {filteredProducts.length} items
            </span>
          </div>
          {selectedShopId && (
            <div className="flex items-center gap-2 mt-1 text-xs text-orange-600 font-medium">
              <span>Filtering by vendor shop</span>
              <button 
                onClick={onClearShopFilter}
                className="underline hover:text-orange-800"
              >
                (View All Shops)
              </button>
            </div>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setVideoOnly(!videoOnly)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
              videoOnly
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>📹 With Video Preview</span>
          </button>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-base font-semibold text-slate-700">No products found in this selection.</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting another category or clear the active filter.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setVideoOnly(false);
              if (onClearShopFilter) onClearShopFilter();
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      )}
    </section>
  );
};
