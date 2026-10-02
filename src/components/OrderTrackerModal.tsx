import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Phone, 
  CreditCard,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface OrderTrackerModalProps {
  initialOrderNumber?: string;
  onClose: () => void;
  onOpenMomoPayment: (order: Order, ussdCode: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  initialOrderNumber = '',
  onClose,
  onOpenMomoPayment,
}) => {
  const { currentUser, formatPrice, settings, toast } = useApp();
  const [searchVal, setSearchVal] = useState(initialOrderNumber || 'CLM-555-1001');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  const hotline = settings?.hotlinePhone || '0798010110';

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const found = await api.getOrder(query.trim());
      setOrder(found);
    } catch (err: any) {
      toast('Order not found with number ' + query, 'error');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    } else {
      fetchOrder('CLM-555-1001');
    }

    // Also fetch recent orders for current user
    if (currentUser) {
      api.getOrders({ customerId: currentUser.id }).then(setUserOrders).catch(console.error);
    }
  }, [initialOrderNumber, currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchVal);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Awaiting MoMo Payment</span>;
      case 'payment_submitted':
        return <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">Verification Pending</span>;
      case 'processing':
        return <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">Payment Verified & Processing</span>;
      case 'shipped':
        return <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">In Transit with Courier</span>;
      case 'out_for_delivery':
        return <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">Out for Immediate Delivery</span>;
      case 'delivered':
        return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Delivered Successfully</span>;
      default:
        return <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Clear Mall 555 Delivery Tracker
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order # (e.g. CLM-555-1001)"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick selection chips if user has recent orders */}
          {userOrders.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
              <span className="text-slate-500 font-medium">My Orders:</span>
              {userOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchVal(o.orderNumber);
                    fetchOrder(o.orderNumber);
                  }}
                  className={`px-2.5 py-1 rounded-lg border font-mono font-bold whitespace-nowrap ${
                    order?.id === o.id
                      ? 'bg-orange-50 border-orange-400 text-orange-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  #{o.orderNumber}
                </button>
              ))}
            </div>
          )}

          {/* Order Details View */}
          {order ? (
            <div className="space-y-6">
              {/* Order Status Header */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block font-mono">
                    Order Ref: #{order.orderNumber}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {order.customerName}
                  </span>
                  <span className="text-xs text-slate-500">
                    Placed: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="sm:text-right">
                  {getStatusBadge(order.orderStatus)}
                  <span className="block text-sm font-extrabold text-slate-900 font-mono mt-1">
                    {formatPrice(order.totalRwf)}
                  </span>
                </div>
              </div>

              {/* MTN MoMo Action Banner if Unpaid */}
              {order.paymentStatus !== 'verified' && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600" />
                      {order.paymentStatus === 'verification_pending'
                        ? 'Payment Verification in Progress'
                        : 'MTN Mobile Money Payment Required'}
                    </span>
                    <p className="text-[11px] text-amber-900 font-mono">
                      Code: *182*8*1*2262742*{order.totalRwf}#
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenMomoPayment(order, `*182*8*1*2262742*${order.totalRwf}#`)}
                    className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg shadow-sm whitespace-nowrap"
                  >
                    {order.paymentStatus === 'verification_pending' ? 'View MoMo Code' : 'Pay via MTN MoMo'}
                  </button>
                </div>
              )}

              {/* Delivery Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Real-Time Shipment & Payment Pipeline</span>
                </h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {order.timeline?.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{step.label}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {step.note && (
                          <p className="text-slate-600 text-[11px] mt-0.5 font-normal leading-relaxed">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Delivery Address
                  </span>
                  <p className="text-slate-600 leading-snug">
                    {order.deliveryAddress.streetAddress}<br />
                    {order.deliveryAddress.district}, {order.deliveryAddress.cityProvince}
                  </p>
                  {order.deliveryAddress.deliveryNotes && (
                    <p className="text-slate-500 text-[11px] mt-1 italic">
                      Note: "{order.deliveryAddress.deliveryNotes}"
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    Recipient Contact
                  </span>
                  <p className="text-slate-600 font-mono">
                    {order.customerPhone}
                  </p>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Service: {order.deliveryZone?.name || 'Standard Courier'} ({order.deliveryZone?.estimatedDelivery})
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Package Contents</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
                    <img
                      src={item.image || '/src/assets/images/product_smartphone_flagship_1790926862084.jpg'}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-blue-700 font-semibold block truncate">
                        {item.shopName}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {item.productName}
                      </h5>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Qty: {item.quantity} · {formatPrice(item.priceRwf)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <span>Enter an order number above to track your parcel across Rwanda.</span>
            </div>
          )}

          {/* Hotline contact bar */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Direct Delivery Desk Hotline:</span>
            <a href={`tel:${hotline}`} className="font-bold text-orange-600 font-mono hover:underline">
              {hotline}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
