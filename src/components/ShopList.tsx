import React from 'react';
import { Store, Phone, Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Shop } from '../types';

interface ShopListProps {
  shops: Shop[];
  onSelectShop: (shopId: string) => void;
  onOpenSellerModal: () => void;
}

export const ShopList: React.FC<ShopListProps> = ({ shops, onSelectShop, onOpenSellerModal }) => {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-orange-500" />
            <span>CLEAR MALL 555 Verified Boutiques & Stores</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct storefronts managed by verified merchants with immediate dispatch across Rwanda.
          </p>
        </div>

        <button
          onClick={onOpenSellerModal}
          className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-xs font-bold rounded-lg shadow-sm hover:from-blue-800 hover:to-indigo-900 transition-colors flex items-center gap-1.5"
        >
          <span>+ Create a Seller Shop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            {/* Shop Banner with Logo Overlay */}
            <div className="relative h-32 bg-slate-100 overflow-hidden">
              <img
                src={shop.banner}
                alt={shop.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Logo pill */}
              <div className="absolute bottom-3 left-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-slate-200 overflow-hidden">
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm leading-tight drop-shadow-sm">{shop.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    {shop.address.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {shop.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-600">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-900">{shop.rating}</span>
                  <span className="text-slate-400">· {shop.totalSales} sales</span>
                </div>

                <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{shop.phone}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectShop(shop.id)}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Store Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
