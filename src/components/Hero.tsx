import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, PhoneCall, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  onShopNow: () => void;
  onOpenSellerModal: () => void;
  onExploreShops: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onOpenSellerModal, onExploreShops }) => {
  const { settings } = useApp();
  const hotline = settings?.hotlinePhone || '0798010110';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_clear_mall_1790926848550.jpg"
          alt="CLEAR MALL 555 Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline and Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Rwanda's Direct Multi-Vendor Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Quality at <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              CLEAR MALL 555
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
            One single online mall uniting Kigali's top boutiques, flagship tech stores, and authentic Rwandan fashion sellers. Enjoy instant MTN Mobile Money checkout and swift nationwide doorstep delivery.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onShopNow}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Explore Mall Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreShops}
              className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Browse Mall Shops
            </button>

            <button
              onClick={onOpenSellerModal}
              className="px-5 py-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 font-semibold text-sm rounded-xl transition-all"
            >
              Sell at Clear Mall 555
            </button>
          </div>

          {/* Trust Value Propositions */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">MTN MoMo Pay</span>
                <span className="text-slate-400 text-[11px] font-mono">*182*8*1*2262742*#</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Swift Delivery</span>
                <span className="text-slate-400 text-[11px]">Kigali & Provinces</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Verified Vendors</span>
                <span className="text-slate-400 text-[11px]">100% Genuine Items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Quick Card */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Mall Service</span>
              </div>
              <span className="text-xs text-slate-400">Kigali, Rwanda</span>
            </div>

            {/* MTN MoMo Official Payment Box */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent p-4 rounded-xl border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">MTN Merchant MoMo Code</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">2262742</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Dial the auto-generated USSD code to pay for your cart with zero hassle:
              </p>
              <div className="bg-slate-900/90 rounded-lg p-3 font-mono text-sm text-amber-300 font-bold tracking-wider text-center border border-amber-500/40 select-all">
                *182*8*1*2262742*AMOUNT#
              </div>
            </div>

            {/* Fast Customer Support Hotline */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block">Direct Order Hotline & WhatsApp</span>
                <span className="text-base font-extrabold text-white font-mono">{hotline}</span>
              </div>
              <a
                href={`tel:${hotline}`}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
