import React from 'react';
import { Phone, MessageCircle, ShieldCheck, Truck, Zap, Store, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useApp();
  const hotline = settings?.hotlinePhone || '0798010110';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/250798010110';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Contact Hotlines */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-sm">
                555
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                CLEAR MALL <span className="text-orange-500">555</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rwanda's dedicated multi-vendor marketplace connecting verified retail stores with shoppers nationwide.
            </p>

            {/* Direct Contact Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`tel:${hotline}`}
                className="px-3.5 py-2.5 bg-orange-600/90 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline: {hotline}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp (24/7)</span>
              </a>
            </div>
          </div>

          {/* Col 2: Payment & MTN MoMo */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              MTN Mobile Money
            </h4>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>MTN Payment Code</span>
              </div>
              <p className="font-mono text-xs text-amber-300 font-bold select-all">
                *182*8*1*2262742*AMOUNT#
              </p>
              <p className="text-[11px] text-slate-400">
                Merchant: <strong>CLEAR MALL 555</strong><br />
                Code: <strong>2262742</strong>
              </p>
            </div>
          </div>

          {/* Col 3: Delivery Coverage */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Nationwide Delivery
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Kigali Express (2 Hours Doorstep)</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Nyarugenge, Gasabo & Kicukiro</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Provincial Rwanda (Musanze, Rubavu, Huye)</span>
              </li>
              <li className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Free Pick-up at Clear Mall Atrium</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Central Location
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>CLEAR MALL 555 Complex, Central Business District, Kigali, Rwanda</span>
              </div>
              <p className="text-slate-500 pt-1">
                Open Daily: 7:00 AM - 10:00 PM<br />
                Online Orders: 24/7 Automated Processing
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CLEAR MALL 555. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Supported Currencies: RWF · USD · EUR</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Merchant Code: 2262742</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
