import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Shop, Product, CartItem, MallSettings, Order } from '../types';
import { api } from '../services/api';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  currentShop: Shop | null;
  setCurrentUser: (user: User | null, shop?: Shop | null) => void;
  currency: 'RWF' | 'USD' | 'EUR';
  setCurrency: (currency: 'RWF' | 'USD' | 'EUR') => void;
  formatPrice: (rwfAmount: number) => string;
  getRawPrice: (rwfAmount: number) => { amount: number; symbol: string; code: string };
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalRwf: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  settings: MallSettings | null;
  refreshSettings: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeCheckoutOrder: Order | null;
  setActiveCheckoutOrder: (order: Order | null) => void;
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('clearmall_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentShop, setCurrentShopState] = useState<Shop | null>(() => {
    const saved = localStorage.getItem('clearmall_shop');
    return saved ? JSON.parse(saved) : null;
  });

  const [currency, setCurrencyState] = useState<'RWF' | 'USD' | 'EUR'>(() => {
    const saved = localStorage.getItem('clearmall_currency');
    return (saved as any) || 'RWF';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('clearmall_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('clearmall_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<MallSettings | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCheckoutOrder, setActiveCheckoutOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const toast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('clearmall_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('clearmall_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setCurrentUser = (user: User | null, shop?: Shop | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('clearmall_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('clearmall_user');
    }

    if (shop !== undefined) {
      setCurrentShopState(shop);
      if (shop) {
        localStorage.setItem('clearmall_shop', JSON.stringify(shop));
      } else {
        localStorage.removeItem('clearmall_shop');
      }
    }
  };

  const setCurrency = (c: 'RWF' | 'USD' | 'EUR') => {
    setCurrencyState(c);
    localStorage.setItem('clearmall_currency', c);
  };

  const getRawPrice = (rwfAmount: number) => {
    const rates = settings?.currencies?.rates || { RWF: 1, USD: 0.000704, EUR: 0.000645 };
    if (currency === 'USD') {
      const val = rwfAmount * rates.USD;
      return { amount: Number(val.toFixed(2)), symbol: '$', code: 'USD' };
    }
    if (currency === 'EUR') {
      const val = rwfAmount * rates.EUR;
      return { amount: Number(val.toFixed(2)), symbol: '€', code: 'EUR' };
    }
    return { amount: Math.round(rwfAmount), symbol: 'RWF', code: 'RWF' };
  };

  const formatPrice = (rwfAmount: number) => {
    const p = getRawPrice(rwfAmount);
    if (p.code === 'RWF') {
      return `${p.amount.toLocaleString()} RWF`;
    }
    return `${p.symbol}${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        toast(`Updated "${product.name}" quantity in cart`, 'info');
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast(`Added "${product.name}" to cart`, 'success');
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    toast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalRwf = cart.reduce(
    (sum, item) => sum + item.product.priceRwf * item.quantity,
    0
  );

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        toast('Added to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentShop,
        setCurrentUser,
        currency,
        setCurrency,
        formatPrice,
        getRawPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalRwf,
        wishlist,
        toggleWishlist,
        isWishlisted,
        settings,
        refreshSettings,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCartOpen,
        setIsCartOpen,
        activeCheckoutOrder,
        setActiveCheckoutOrder,
        toast,
      }}
    >
      {children}
      {/* Toast floating notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border text-sm flex items-center gap-3 transition-all transform animate-in fade-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800'
                : t.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-800'
                : 'bg-slate-900/90 text-slate-100 border-slate-700'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                t.type === 'success'
                  ? 'bg-emerald-400'
                  : t.type === 'error'
                  ? 'bg-rose-400'
                  : 'bg-orange-400'
              }`}
            />
            <span className="flex-1 font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
