import React from 'react';
import { ShoppingBag, Heart, Play, Store, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickBuy }) => {
  const { formatPrice, addToCart, wishlist, toggleWishlist } = useApp();
  const isWished = wishlist.includes(product.id);

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/src/assets/images/product_smartphone_flagship_1790926862084.jpg';

  return (
    <div className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={mainImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
        />

        {/* Video Available Indicator */}
        {product.videoUrl && (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Play className="w-3 h-3 fill-orange-400 text-orange-400" />
            <span>Video</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWished 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500' : ''}`} />
        </button>

        {/* In-stock status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            Only {product.stock} Left!
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Shop and Category quiet metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700 truncate max-w-[130px] flex items-center gap-1">
              <Store className="w-3 h-3 text-slate-400" />
              {product.shopName}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="truncate">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-semibold text-slate-900 text-sm hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price & Rating */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                {formatPrice(product.priceRwf)}
              </span>
              {product.originalPriceRwf && product.originalPriceRwf > product.priceRwf && (
                <span className="block text-xs text-slate-400 line-through font-mono">
                  {formatPrice(product.originalPriceRwf)}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="text-amber-500 font-bold">★ {product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => onQuickBuy(product)}
              className="w-full py-2 px-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <span>MoMo Pay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
