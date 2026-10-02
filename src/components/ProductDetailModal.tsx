import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Zap, 
  Phone, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Truck, 
  Store,
  Play,
  Heart
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onQuickBuy: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onQuickBuy,
}) => {
  const { formatPrice, addToCart, wishlist, toggleWishlist, settings } = useApp();
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWished = wishlist.includes(product.id);
  const hotline = settings?.hotlinePhone || '0798010110';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/250798010110';

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/src/assets/images/product_smartphone_flagship_1790926862084.jpg'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    onQuickBuy(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Gallery & Video Viewport */}
          <div className="md:col-span-6 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
            <div>
              {/* Main Media Display */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-200 shadow-inner flex items-center justify-center">
                {isVideoMode && product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={images[selectedMediaIdx] || images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                )}

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/90 shadow text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails + Video selector */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMediaIdx(idx);
                      setIsVideoMode(false);
                    }}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 bg-white transition-all ${
                      !isVideoMode && selectedMediaIdx === idx
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}

                {product.videoUrl && (
                  <button
                    onClick={() => setIsVideoMode(true)}
                    className={`h-14 px-3 rounded-lg border-2 shrink-0 flex items-center gap-1.5 text-xs font-bold transition-all ${
                      isVideoMode
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Vendor Contact Widget */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 bg-white p-3.5 rounded-xl border flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[150px]">
                    {product.shopName}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Verified Clear Mall Seller</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${hotline}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                  title="Call Shop"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{product.category}</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">In Stock ({product.stock} units)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                  {formatPrice(product.priceRwf)}
                </span>
                {product.originalPriceRwf && product.originalPriceRwf > product.priceRwf && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatPrice(product.originalPriceRwf)}
                  </span>
                )}
              </div>

              {/* MTN MoMo Payment Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Instant MTN MoMo Payment Ready</span>
                </div>
                <p className="text-slate-600 font-mono text-[11px]">
                  USSD: *182*8*1*2262742*AMOUNT# (Rwanda Francs)
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block mb-1">Specifications</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-200/60 text-slate-600">
                        <span className="text-slate-500 font-medium">{key}:</span>
                        <span className="font-semibold text-slate-900 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Purchase Actions */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              {/* Quantity stepper */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-mono font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buy & Cart Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-300"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-102"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>MoMo Checkout</span>
                </button>
              </div>

              {/* Assurances */}
              <div className="flex items-center justify-around text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Same-day Kigali Delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Clear Mall Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
