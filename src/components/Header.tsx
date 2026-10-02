import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Phone, 
  MessageCircle, 
  Search, 
  Store, 
  Package, 
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: 'home' | 'products' | 'shops' | 'orders' | 'dashboard') => void;
  activeTab: string;
  onOpenProductUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onNavigateTab, 
  activeTab,
  onOpenProductUpload
}) => {
  const { 
    currentUser, 
    cartCount, 
    setIsCartOpen, 
    setIsAuthModalOpen, 
    currency, 
    setCurrency, 
    wishlist,
    settings 
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    onNavigateTab('products');
  };

  const hotline = settings?.hotlinePhone || '0798010110';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/250798010110';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-orange-400 font-bold tracking-wide">CLEAR MALL 555</span>
            <span className="text-slate-500">·</span>
            <span className="truncate">MTN Mobile Money Accepted Code: <strong className="text-white font-mono">*182*8*1*2262742*AMOUNT#</strong></span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-slate-400">Rapid Delivery Across Rwanda</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a 
              href={`tel:${hotline}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="Call Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline font-mono font-medium">{hotline}</span>
            </a>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">WhatsApp</span>
            </a>

            {/* Currency switcher */}
            <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700">
              {(['RWF', 'USD', 'EUR'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${
                    currency === c 
                      ? 'bg-orange-500 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Strict 3 Zone Architecture */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { onNavigateTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
              555
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                CLEAR MALL <span className="text-orange-500">555</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                Online Shopping Mall
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links + Search bar */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigateTab('home')}
              className={`hover:text-orange-600 transition-colors ${activeTab === 'home' ? 'text-orange-600 font-semibold' : ''}`}
            >
              Mall Home
            </button>
            <button
              onClick={() => onNavigateTab('products')}
              className={`hover:text-orange-600 transition-colors ${activeTab === 'products' ? 'text-orange-600 font-semibold' : ''}`}
            >
              All Products
            </button>
            <button
              onClick={() => onNavigateTab('shops')}
              className={`hover:text-orange-600 transition-colors ${activeTab === 'shops' ? 'text-orange-600 font-semibold' : ''}`}
            >
              Mall Shops
            </button>
            <button
              onClick={() => onNavigateTab('orders')}
              className={`hover:text-orange-600 transition-colors ${activeTab === 'orders' ? 'text-orange-600 font-semibold' : ''}`}
            >
              Track Order
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className={`flex items-center gap-1.5 hover:text-blue-700 transition-colors ${activeTab === 'dashboard' ? 'text-blue-700 font-semibold' : ''}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{currentUser?.role === 'admin' ? 'Admin Center' : currentUser?.role === 'seller' ? 'Seller Hub' : 'Mall Control'}</span>
            </button>
          </nav>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-56 xl:w-72">
            <input
              type="text"
              placeholder="Search products, brands, shops..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>
        </div>

        {/* Zone 3: Actions (Upload for Sellers/Admin, Wishlist, Cart, Account) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Product Upload Button for Admin/Seller */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'seller') && (
            <button
              onClick={onOpenProductUpload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:shadow"
              title="Upload new product photo/video directly from phone or computer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>+ Add Product</span>
            </button>
          )}

          {/* Hotline Quick Tap for Mobile */}
          <a
            href={`tel:${hotline}`}
            className="sm:hidden p-2 text-slate-700 hover:text-orange-600 bg-slate-100 rounded-lg"
            title="Call Support"
          >
            <Phone className="w-4 h-4 text-orange-500" />
          </a>

          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200 bg-emerald-50/50"
            title="Chat on WhatsApp (0798010110)"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Sign In */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <User className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline font-semibold">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
            {currentUser && (
              <span className="hidden md:inline text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 uppercase font-bold">
                {currentUser.role}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, shops..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => { onNavigateTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'home' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-slate-50 text-slate-700'}`}
            >
              Mall Home
            </button>
            <button
              onClick={() => { onNavigateTab('products'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'products' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-slate-50 text-slate-700'}`}
            >
              All Products
            </button>
            <button
              onClick={() => { onNavigateTab('shops'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'shops' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-slate-50 text-slate-700'}`}
            >
              Mall Shops
            </button>
            <button
              onClick={() => { onNavigateTab('orders'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-slate-50 text-slate-700'}`}
            >
              Track Order
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => { onNavigateTab('dashboard'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 px-3 bg-blue-50 text-blue-800 font-semibold text-xs rounded-lg text-center border border-blue-200"
            >
              {currentUser?.role === 'admin' ? '⚙️ Admin Dashboard' : '🏪 Seller Hub & Stats'}
            </button>
            {(currentUser?.role === 'admin' || currentUser?.role === 'seller') && (
              <button
                onClick={() => { onOpenProductUpload(); setMobileMenuOpen(false); }}
                className="py-2 px-3 bg-orange-600 text-white font-semibold text-xs rounded-lg text-center"
              >
                + Upload
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
