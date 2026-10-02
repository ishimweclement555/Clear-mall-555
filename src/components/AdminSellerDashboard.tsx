import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Store, 
  ShoppingBag, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  Phone, 
  CreditCard,
  DollarSign,
  TrendingUp,
  Percent,
  Users
} from 'lucide-react';
import { Order, Product, Shop, MallSettings, User } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface AdminSellerDashboardProps {
  onOpenProductUpload: (product?: Product) => void;
  onRefreshProducts: () => void;
}

export const AdminSellerDashboard: React.FC<AdminSellerDashboardProps> = ({
  onOpenProductUpload,
  onRefreshProducts,
}) => {
  const { currentUser, formatPrice, settings, refreshSettings, toast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'shops' | 'settings'>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Settings form state
  const [momoTemplate, setMomoTemplate] = useState(settings?.mtnPaymentCodeTemplate || '*182*8*1*2262742*AMOUNT#');
  const [hotline, setHotline] = useState(settings?.hotlinePhone || '0798010110');
  const [whatsapp, setWhatsapp] = useState(settings?.whatsappUrl || 'https://wa.me/250798010110');
  const [commission, setCommission] = useState(String(settings?.defaultCommissionPercent || 5));
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Order filtering
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, ordersData, productsData, shopsData, usersData] = await Promise.all([
        api.getAnalytics(),
        api.getOrders(),
        api.getProducts(),
        api.getShops(),
        currentUser?.role === 'admin' ? api.getUsers() : Promise.resolve([])
      ]);

      setAnalytics(analyticsData);
      setOrders(ordersData);
      setProducts(productsData);
      setShops(shopsData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Dashboard load error:', err);
      toast('Failed to load some dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  useEffect(() => {
    if (settings) {
      setMomoTemplate(settings.mtnPaymentCodeTemplate);
      setHotline(settings.hotlinePhone);
      setWhatsapp(settings.whatsappUrl);
      setCommission(String(settings.defaultCommissionPercent));
    }
  }, [settings]);

  // Verify MTN Payment
  const handleVerifyPayment = async (orderId: string, approve: boolean) => {
    try {
      await api.verifyPayment(orderId, {
        verifiedBy: currentUser?.name || 'CLEAR MALL 555 Admin',
        approve,
        rejectionReason: approve ? undefined : 'Transaction details could not be matched against MTN Merchant 2262742'
      });
      toast(approve ? 'Payment marked as verified!' : 'Payment marked as unverified', approve ? 'success' : 'info');
      loadDashboardData();
    } catch (err: any) {
      toast(err.message || 'Verification update failed', 'error');
    }
  };

  // Update order delivery status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, { status });
      toast(`Order status updated to "${status}"`, 'success');
      loadDashboardData();
    } catch (err: any) {
      toast(err.message || 'Status update failed', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(productId);
      toast('Product removed from catalog', 'info');
      loadDashboardData();
      onRefreshProducts();
    } catch (err: any) {
      toast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings({
        mtnPaymentCodeTemplate: momoTemplate.trim(),
        hotlinePhone: hotline.trim(),
        whatsappUrl: whatsapp.trim(),
        defaultCommissionPercent: Number(commission) || 5,
      });
      await refreshSettings();
      toast('CLEAR MALL 555 settings updated successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending_verification') return o.paymentStatus === 'verification_pending';
    if (orderFilter === 'verified') return o.paymentStatus === 'verified';
    return o.orderStatus === orderFilter;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Dashboard Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              {currentUser?.role === 'admin' ? 'CLEAR MALL 555 Main Command Center' : 'Verified Seller Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mall Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Full phone and desktop control for shops, products, MTN MoMo payments, and delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenProductUpload()}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Product</span>
          </button>
        </div>
      </div>

      {/* Touch-Friendly Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & Sales</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & MTN MoMo</span>
          {analytics?.pendingVerificationCount > 0 && (
            <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {analytics.pendingVerificationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'shops'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Mall Shops ({shops.length})</span>
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mall Settings</span>
          </button>
        )}
      </div>

      {/* ---------------- Tab 1: Overview & Metrics ---------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Total Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatPrice(analytics?.totalVolumeRwf || 0)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                Verified Orders Volume
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Mall Commission ({settings?.defaultCommissionPercent || 5}%)</span>
                <Percent className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-extrabold text-orange-600 font-mono">
                {formatPrice(analytics?.mallCommissionRwf || 0)}
              </div>
              <span className="text-[11px] text-slate-500 block">
                Clear Mall Platform Cut
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Total Orders Placed</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {analytics?.totalOrders || 0}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold block">
                {analytics?.pendingVerificationCount || 0} Pending Verification
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Verified Vendors</span>
                <Store className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {shops.length}
              </div>
              <span className="text-[11px] text-purple-600 font-semibold block">
                {products.length} Products Active
              </span>
            </div>
          </div>

          {/* Quick Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Recent Orders & Payment Actions
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Delivery Status</th>
                    <th className="py-2.5 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{order.customerName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {formatPrice(order.totalRwf)}
                      </td>
                      <td className="py-3 px-3">
                        {order.paymentStatus === 'verified' ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            ✓ Verified
                          </span>
                        ) : order.paymentStatus === 'verification_pending' ? (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Ref: {order.momoDetails?.transactionRef || 'Submitted'}
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 capitalize font-medium text-slate-700">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {order.paymentStatus !== 'verified' && (
                          <button
                            onClick={() => handleVerifyPayment(order.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                          >
                            Verify MoMo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Tab 2: Orders & MTN Payments ---------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order filters */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending_verification', label: '⚠️ Verification Pending' },
              { id: 'verified', label: '✓ Payment Verified' },
              { id: 'processing', label: 'Processing' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'delivered', label: 'Delivered' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  orderFilter === f.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Cards List (Mobile & Desktop optimized) */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No orders match this filter.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600">
                        Customer: <strong className="text-slate-900">{order.customerName}</strong> ({order.customerPhone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-base text-orange-600">
                        {formatPrice(order.totalRwf)}
                      </span>
                    </div>
                  </div>

                  {/* MoMo Payment Status Box */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">MTN MoMo Status:</span>
                        {order.paymentStatus === 'verified' ? (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                            Verified by {order.momoDetails?.verifiedBy || 'Admin'}
                          </span>
                        ) : order.paymentStatus === 'verification_pending' ? (
                          <span className="text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                            Customer Submitted Proof
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">
                            Awaiting Payment
                          </span>
                        )}
                      </div>

                      {order.momoDetails?.transactionRef && (
                        <div className="font-mono text-slate-700">
                          MTN SMS Ref: <strong className="text-slate-950 font-bold">{order.momoDetails.transactionRef}</strong>
                          {order.momoDetails.customerMomoPhone && (
                            <span> · MoMo Line: {order.momoDetails.customerMomoPhone}</span>
                          )}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 font-mono">
                        USSD Dialed: *182*8*1*2262742*{order.totalRwf}#
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex items-center gap-2">
                      {order.paymentStatus !== 'verified' ? (
                        <button
                          onClick={() => handleVerifyPayment(order.id, true)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Verify MoMo</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyPayment(order.id, false)}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Revoke Verification
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delivery Location & Status Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                    <div>
                      <span className="text-slate-500 block">
                        Delivery Destination: <strong className="text-slate-900">{order.deliveryAddress.streetAddress}, {order.deliveryAddress.district}</strong>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Tier: {order.deliveryZone?.name} ({order.deliveryZone?.estimatedDelivery})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-semibold">Change Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="payment_submitted">Payment Submitted</option>
                        <option value="processing">Processing / Packaging</option>
                        <option value="shipped">Shipped with Courier</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- Tab 3: Products Management ---------------- */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Clear Mall Products ({products.length})
            </h3>
            <button
              onClick={() => onOpenProductUpload()}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={product.images?.[0] || '/src/assets/images/product_smartphone_flagship_1790926862084.jpg'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-blue-700 font-semibold block truncate">
                      {product.shopName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs font-mono font-extrabold text-slate-900 block mt-0.5">
                      {formatPrice(product.priceRwf)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Stock: {product.stock} units {product.videoUrl && '· 📹 Video Included'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenProductUpload(product)}
                    className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- Tab 4: Shops & Vendors ---------------- */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Clear Mall Vendors & Boutiques ({shops.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start gap-4"
              >
                <img
                  src={shop.logo}
                  alt={shop.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {shop.name}
                    </h4>
                    <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded">
                      {shop.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {shop.description}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Commission Rate: <strong>{shop.commissionRate}%</strong></span>
                    <span>Total Sales: <strong>{shop.totalSales}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- Tab 5: Mall Settings (Admin Only) ---------------- */}
      {activeTab === 'settings' && currentUser?.role === 'admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl space-y-5">
          <h3 className="text-base font-extrabold text-slate-900">
            CLEAR MALL 555 Central Parameters
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                MTN Mobile Money USSD Code Template *
              </label>
              <input
                type="text"
                required
                value={momoTemplate}
                onChange={(e) => setMomoTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Use <code>AMOUNT</code> as placeholder for the exact calculated order total.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mall Phone Hotline *
              </label>
              <input
                type="text"
                required
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                WhatsApp Direct Link *
              </label>
              <input
                type="url"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Default Mall Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-50"
              >
                {isSavingSettings ? 'Saving...' : 'Save Mall Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
