import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  MessageCircle, 
  ArrowRight,
  Loader2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface MtnMomoModalProps {
  order: Order | null;
  ussdCode: string;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

export const MtnMomoModal: React.FC<MtnMomoModalProps> = ({
  order,
  ussdCode,
  onClose,
  onOrderUpdated,
}) => {
  const { toast, settings } = useApp();

  const [copied, setCopied] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(order?.customerPhone || '0798010110');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  if (!order) return null;

  const hotline = settings?.hotlinePhone || '0798010110';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/250798010110';

  // Format dialer link with %23 for '#' so dialer opens intact
  const dialerUri = `tel:${ussdCode.replace('#', '%23')}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ussdCode);
    setCopied(true);
    toast('USSD Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast('Please enter your MTN Mobile Money transaction ID from SMS', 'error');
      return;
    }

    setIsSubmittingProof(true);
    try {
      const updated = await api.submitMomoPayment(order.id, {
        customerMomoPhone: customerPhone.trim(),
        transactionRef: transactionRef.trim(),
      });
      onOrderUpdated(updated);
      toast('Payment details submitted! Order is now awaiting merchant confirmation.', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to submit payment details', 'error');
    } finally {
      setIsSubmittingProof(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-sm">
              MTN
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                MTN Mobile Money Payment
              </h2>
              <span className="text-xs text-amber-100 font-mono">
                Order #{order.orderNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Order Total Highlight */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Total Order Payable Amount</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
                {order.totalRwf.toLocaleString()} RWF
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">MTN Merchant Code</span>
              <span className="text-xs font-bold text-orange-600 font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                2262742
              </span>
            </div>
          </div>

          {/* Generated USSD Code Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Auto-Generated MTN MoMo USSD Code
            </label>
            <div className="p-4 bg-slate-900 text-amber-300 rounded-xl border border-slate-800 flex items-center justify-between gap-3 shadow-inner">
              <span className="font-mono text-base sm:text-lg font-bold tracking-wider select-all break-all">
                {ussdCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="shrink-0 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Copy USSD"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct Phone Dialer Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href={dialerUri}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Tap to Dial USSD Code</span>
              </a>

              <button
                type="button"
                onClick={handleCopyCode}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-300"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Payment Code</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs space-y-2.5">
            <span className="font-bold text-amber-950 block">Payment Steps:</span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
              <li>
                Click <strong>"Tap to Dial USSD Code"</strong> or dial <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">{ussdCode}</code> on your MTN phone.
              </li>
              <li>
                Confirm the merchant name shows <strong>CLEAR MALL 555</strong> (Merchant Code: <strong>2262742</strong>) with total <strong>{order.totalRwf.toLocaleString()} RWF</strong>.
              </li>
              <li>
                Enter your secret <strong>MTN Mobile Money PIN</strong> on your device to approve payment.
              </li>
              <li>
                Once you receive the MTN confirmation SMS, copy or enter the <strong>Transaction Reference ID</strong> below.
              </li>
            </ol>
          </div>

          {/* Verification Status or Submission Form */}
          {order.paymentStatus === 'verified' ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Payment Verified Successfully!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Your payment of {order.totalRwf.toLocaleString()} RWF has been confirmed by CLEAR MALL 555. Your package is now in preparation for dispatch.
              </p>
            </div>
          ) : order.paymentStatus === 'verification_pending' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                <span>Payment Verification In Progress</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                We received your MTN Transaction Reference: <strong className="font-mono">{order.momoDetails?.transactionRef}</strong>. CLEAR MALL 555 finance desk is confirming receipt with MTN merchant code 2262742.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-blue-200">
                <span className="text-blue-700">Need immediate priority dispatch?</span>
                <a
                  href={`tel:${hotline}`}
                  className="font-bold underline text-blue-900 hover:text-blue-950"
                >
                  Call {hotline}
                </a>
              </div>
            </div>
          ) : (
            // Verification Submission Form
            <form onSubmit={handleSubmitProof} className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Verify Your Payment
                </label>
                <span className="text-[11px] text-slate-500">
                  Required before shipment
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Your MTN Mobile Money Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0798010110"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  MTN SMS Transaction ID / Reference Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTN-TX-89241512 or Financial Transaction Id"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProof}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingProof ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Payment for Verification</span>
                  </>
                )}
              </button>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  As required for genuine security, orders are verified against merchant account records prior to physical dispatch.
                </span>
              </div>
            </form>
          )}

          {/* Quick Help Contacts */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Payment questions?</span>
            <div className="flex items-center gap-3 font-semibold">
              <a href={`tel:${hotline}`} className="text-orange-600 hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{hotline}</span>
              </a>
              <span>·</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
