import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ShopList } from './components/ShopList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductUploadModal } from './components/ProductUploadModal';
import { CartDrawer } from './components/CartDrawer';
import { MtnMomoModal } from './components/MtnMomoModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminSellerDashboard } from './components/AdminSellerDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Product, Shop, Order } from './types';
import { api } from './services/api';
import { Phone, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';

function MallContent() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    currentUser,
    settings,
    toast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'shops' | 'orders' | 'dashboard'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Selectors
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // MTN MoMo & Tracking
  const [activeMomoPayment, setActiveMomoPayment] = useState<{ order: Order; ussdCode: string } | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderNum, setTrackerOrderNum] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, shps] = await Promise.all([
        api.getProducts({ search: searchQuery }),
        api.getShops()
      ]);
      setProducts(prods);
      setShops(shps);
    } catch (err: any) {
      console.error('Failed to load products/shops:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleQuickBuy = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleSelectShop = (shopId: string) => {
    setSelectedShopId(shopId);
    setActiveTab('products');
  };

  const hotline = settings?.hotlinePhone || '0798010110';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/250798010110';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Main App Navigation */}
      <Header
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'orders') {
            setIsTrackerOpen(true);
          }
        }}
        onSearch={(q) => setSearchQuery(q)}
        onOpenProductUpload={() => {
          setProductToEdit(null);
          setIsUploadModalOpen(true);
        }}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onShopNow={() => setActiveTab('products')}
              onExploreShops={() => setActiveTab('shops')}
              onOpenSellerModal={() => {
                if (currentUser?.role === 'seller' || currentUser?.role === 'admin') {
                  setActiveTab('dashboard');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            />

            {/* Featured Mall Boutiques */}
            <ShopList
              shops={shops}
              onSelectShop={handleSelectShop}
              onOpenSellerModal={() => setIsAuthModalOpen(true)}
            />

            {/* Featured Products Grid */}
            <ProductGrid
              products={products}
              onSelectProduct={setSelectedProduct}
              onQuickBuy={handleQuickBuy}
              selectedShopId={selectedShopId}
              onClearShopFilter={() => setSelectedShopId(null)}
            />
          </>
        )}

        {activeTab === 'products' && (
          <ProductGrid
            products={products}
            onSelectProduct={setSelectedProduct}
            onQuickBuy={handleQuickBuy}
            selectedShopId={selectedShopId}
            onClearShopFilter={() => setSelectedShopId(null)}
          />
        )}

        {activeTab === 'shops' && (
          <ShopList
            shops={shops}
            onSelectShop={handleSelectShop}
            onOpenSellerModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <AdminSellerDashboard
            onOpenProductUpload={(prod) => {
              setProductToEdit(prod || null);
              setIsUploadModalOpen(true);
            }}
            onRefreshProducts={loadData}
          />
        )}
      </main>

      {/* Floating Fast Dial & WhatsApp Contact for Phone Convenience */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <a
          href={`tel:${hotline}`}
          className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-108 border border-white/20"
          title={`Call ${hotline}`}
        >
          <Phone className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold font-mono pr-1">{hotline}</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-108 border border-white/20"
          title="WhatsApp Support"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold pr-1">WhatsApp</span>
        </a>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onQuickBuy={handleQuickBuy}
        />
      )}

      {isUploadModalOpen && (
        <ProductUploadModal
          productToEdit={productToEdit}
          shops={shops}
          onClose={() => {
            setIsUploadModalOpen(false);
            setProductToEdit(null);
          }}
          onSuccess={() => {
            setIsUploadModalOpen(false);
            setProductToEdit(null);
            loadData();
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToMtnMomo={(order, ussdCode) => {
          setActiveMomoPayment({ order, ussdCode });
        }}
      />

      {activeMomoPayment && (
        <MtnMomoModal
          order={activeMomoPayment.order}
          ussdCode={activeMomoPayment.ussdCode}
          onClose={() => setActiveMomoPayment(null)}
          onOrderUpdated={(updated) => {
            setActiveMomoPayment({ order: updated, ussdCode: activeMomoPayment.ussdCode });
            loadData();
          }}
        />
      )}

      {isTrackerOpen && (
        <OrderTrackerModal
          initialOrderNumber={trackerOrderNum}
          onClose={() => setIsTrackerOpen(false)}
          onOpenMomoPayment={(order, ussdCode) => {
            setIsTrackerOpen(false);
            setActiveMomoPayment({ order, ussdCode });
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MallContent />
    </AppProvider>
  );
}
