import { Product, Shop, Order, MallSettings, User, ShippingAddress, DeliveryZone } from '../types';

export const api = {
  // Settings
  async getSettings(): Promise<MallSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<MallSettings>): Promise<MallSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    return data.settings;
  },

  // Auth
  async login(email: string): Promise<{ user: User; shop?: Shop }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    return { user: data.user, shop: data.shop };
  },

  async register(payload: {
    name: string;
    email: string;
    phone: string;
    role: string;
    shopName?: string;
    shopDescription?: string;
  }): Promise<{ user: User; shop?: Shop }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    return { user: data.user, shop: data.shop };
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    const data = await res.json();
    return data.users || [];
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    const res = await fetch(`/api/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    return data.user;
  },

  // Shops
  async getShops(): Promise<Shop[]> {
    const res = await fetch('/api/shops');
    const data = await res.json();
    return data.shops || [];
  },

  async getShop(idOrSlug: string): Promise<{ shop: Shop; products: Product[] }> {
    const res = await fetch(`/api/shops/${idOrSlug}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Shop not found');
    return { shop: data.shop, products: data.products || [] };
  },

  async createShop(payload: Partial<Shop>): Promise<Shop> {
    const res = await fetch('/api/shops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create shop');
    return data.shop;
  },

  async updateShop(id: string, payload: Partial<Shop>): Promise<Shop> {
    const res = await fetch(`/api/shops/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.shop;
  },

  // Products
  async getProducts(params?: {
    shopId?: string;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.shopId) query.set('shopId', params.shopId);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');

    const res = await fetch(`/api/products?${query.toString()}`);
    const data = await res.json();
    return data.products || [];
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Product not found');
    return data.product;
  },

  async uploadMedia(dataUrl: string): Promise<{ url: string; mediaType: string }> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Media upload failed');
    return { url: data.url, mediaType: data.mediaType };
  },

  async createProduct(payload: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create product');
    return data.product;
  },

  async updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete product');
  },

  // Orders
  async getOrders(params?: { customerId?: string; shopId?: string; status?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.customerId) query.set('customerId', params.customerId);
    if (params?.shopId) query.set('shopId', params.shopId);
    if (params?.status) query.set('status', params.status);

    const res = await fetch(`/api/orders?${query.toString()}`);
    const data = await res.json();
    return data.orders || [];
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Order not found');
    return data.order;
  },

  async createOrder(payload: {
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    deliveryAddress: ShippingAddress;
    deliveryZone: DeliveryZone;
    items: any[];
    displayCurrency: 'RWF' | 'USD' | 'EUR';
  }): Promise<{ order: Order; ussdCode: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Order creation failed');
    return { order: data.order, ussdCode: data.ussdCode };
  },

  async submitMomoPayment(
    orderId: string,
    payload: { customerMomoPhone?: string; transactionRef: string; receiptProofUrl?: string }
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/momo-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Payment submission failed');
    return data.order;
  },

  async verifyPayment(
    orderId: string,
    payload: { verifiedBy: string; approve: boolean; rejectionReason?: string }
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Payment verification failed');
    return data.order;
  },

  async updateOrderStatus(
    orderId: string,
    payload: { status: string; note?: string; courierName?: string; trackingNumber?: string }
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Order update failed');
    return data.order;
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    const data = await res.json();
    return data.stats;
  },
};
