import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeliveryZone, ShippingAddress } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToMtnMomo: (order: any, ussdCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToMtnMomo,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartSubtotalRwf,
    formatPrice,
    currency,
    settings,
    currentUser,
    toast,
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(() => {
    return settings?.deliveryZones?.[0] || {
      id: 'kigali-urban',
      name: 'Kigali Urban Delivery',
      description: 'Nyarugenge, Gasabo, Kicukiro',
      feeRwf: 2000,
      estimatedDelivery: 'Same Day / 24 Hours'
    };
  });

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '0798010110',
    email: currentUser?.email || '',
    cityProvince: 'Kigali City',
    district: 'Gasabo',
    streetAddress: 'KG 15 Ave, Kimihurura',
    deliveryNotes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = selectedZone ? selectedZone.feeRwf : 2000;
  const totalRwf = cartSubtotalRwf + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName.trim() || !address.phone.trim() || !address.streetAddress.trim()) {
      toast('Please fill in complete delivery details', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        shopId: item.product.shopId,
        shopName: item.product.shopName,
        priceRwf: item.product.priceRwf,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
      }));

      const res = await api.createOrder({
        customerId: currentUser?.id,
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        deliveryAddress: address,
        deliveryZone: selectedZone,
        items: itemsPayload,
        displayCurrency: currency,
      });

      clearCart();
      onClose();
      onProceedToMtnMomo(res.order, res.ussdCode);
      toast('Order created! Please complete MTN MoMo payment.', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                {step === 'cart' ? `Shopping Cart (${cartCount})` : 'Delivery & Checkout'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Your shopping cart is empty</p>
                <p className="text-xs text-slate-500">Explore CLEAR MALL 555 products and add items to your cart.</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Continue Shopping
                </button>
              </div>
            ) : step === 'cart' ? (
              // Step 1: Cart Items List
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={product.images?.[0] || '/src/assets/images/product_smartphone_flagship_1790926862084.jpg'}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-blue-700 font-semibold block truncate">
                        {product.shopName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <span className="text-xs font-mono font-extrabold text-slate-900 block mt-0.5">
                        {formatPrice(product.priceRwf * quantity)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-300 rounded bg-white text-xs">
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 font-bold hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-mono font-bold text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="px-2 py-0.5 font-bold hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Delivery Zone Selection Preview */}
                <div className="pt-3 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-500" />
                    <span>Choose Delivery Option</span>
                  </label>
                  <select
                    value={selectedZone?.id}
                    onChange={(e) => {
                      const z = settings?.deliveryZones.find((dz) => dz.id === e.target.value);
                      if (z) setSelectedZone(z);
                    }}
                    className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {settings?.deliveryZones?.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} (+{formatPrice(z.feeRwf)}) - {z.estimatedDelivery}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              // Step 2: Delivery Details Form
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl text-slate-700">
                  <span className="font-bold text-orange-900 block mb-0.5">Delivery Destination</span>
                  <span className="text-[11px]">Selected: {selectedZone.name} ({selectedZone.estimatedDelivery})</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clement Ishimwe"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    MTN Mobile Phone Number (For MoMo & Courier) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0798010110"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / Province *</label>
                    <input
                      type="text"
                      required
                      placeholder="Kigali City"
                      value={address.cityProvince}
                      onChange={(e) => setAddress({ ...address, cityProvince: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">District / Sector *</label>
                    <input
                      type="text"
                      required
                      placeholder="Gasabo / Kimihurura"
                      value={address.district}
                      onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Street Address / House / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="KG 15 Ave, House 24, Near Kigali Heights"
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Call when outside the gate; leave with security."
                    value={address.deliveryNotes}
                    onChange={(e) => setAddress({ ...address, deliveryNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer with Totals & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">{formatPrice(cartSubtotalRwf)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({selectedZone.name.split(' ')[0]}):</span>
                  <span className="font-mono font-bold text-slate-900">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Order Amount:</span>
                  <span className="font-mono text-base text-orange-600">{formatPrice(totalRwf)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-101"
                >
                  <span>Proceed to Delivery & MoMo Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-1/3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing}
                    className="w-2/3 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Generate MTN Code</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by CLEAR MALL 555 Buyer Assurance</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
