export type UserRole = 'admin' | 'seller' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  shopId?: string;
  avatar?: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  phone: string;
  address: string;
  rating: number;
  totalSales: number;
  commissionRate: number; // e.g. 5 for 5%
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  priceRwf: number;
  originalPriceRwf?: number;
  stock: number;
  images: string[];
  videoUrl?: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  specs?: Record<string, string>;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  feeRwf: number;
  estimatedDelivery: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  cityProvince: string;
  district: string;
  streetAddress: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  shopId: string;
  shopName: string;
  priceRwf: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: ShippingAddress;
  deliveryZone: DeliveryZone;
  items: OrderItem[];
  subtotalRwf: number;
  deliveryFeeRwf: number;
  totalRwf: number;
  displayCurrency: 'RWF' | 'USD' | 'EUR';
  displayTotal: number;
  paymentMethod: 'mtn_momo' | 'cash_on_delivery';
  paymentStatus: 'unpaid' | 'verification_pending' | 'verified' | 'failed';
  momoDetails?: {
    code: string;
    customerMomoPhone?: string;
    transactionRef?: string;
    receiptProofUrl?: string;
    submittedAt?: string;
    verifiedAt?: string;
    verifiedBy?: string;
    notes?: string;
  };
  orderStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface MallSettings {
  mallName: string;
  hotlinePhone: string;
  hotlineInternational: string;
  whatsappUrl: string;
  mtnPaymentCodeTemplate: string;
  mtnMerchantNumber: string;
  defaultCommissionPercent: number;
  deliveryZones: DeliveryZone[];
  currencies: {
    base: 'RWF';
    rates: {
      RWF: number;
      USD: number;
      EUR: number;
    };
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
