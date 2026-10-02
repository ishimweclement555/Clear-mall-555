import React, { useState } from 'react';
import { X, User, Store, Shield, ArrowRight, Check, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, toast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (targetEmail: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(targetEmail);
      setCurrentUser(res.user, res.shop);
      toast(`Welcome back, ${res.user.name}!`, 'success');
      onClose();
    } catch (err: any) {
      toast(err.message || 'Login failed. Try a demo account below.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    if (role === 'seller' && !shopName.trim()) {
      toast('Please enter your shop name', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        shopName: role === 'seller' ? shopName.trim() : undefined,
        shopDescription: role === 'seller' ? shopDescription.trim() : undefined,
      });

      setCurrentUser(res.user, res.shop);
      toast(`Account created! Welcome to CLEAR MALL 555, ${res.user.name}.`, 'success');
      onClose();
    } catch (err: any) {
      toast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null, null);
    toast('Logged out successfully', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              555
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                CLEAR MALL 555 Account
              </h2>
              <span className="text-[11px] text-slate-500">
                {currentUser ? `Active: ${currentUser.role.toUpperCase()}` : 'Secure Sign In & Registration'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {currentUser ? (
            // Current User Profile Display
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Logged In As:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-slate-600">{currentUser.email}</div>
                <div className="text-slate-600 font-mono">MTN Line: {currentUser.phone}</div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              {/* Toggle Login / Register */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Register Account
                </button>
              </div>

              {mode === 'login' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin(email);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@clearmall.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3 text-xs max-h-[50vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          role === 'customer'
                            ? 'bg-orange-50 border-orange-500 text-orange-700'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Customer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('seller')}
                        className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          role === 'seller'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Shop Seller</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clement Ishimwe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ishimweclement537@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number (MTN) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0798010110"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  {role === 'seller' && (
                    <div className="space-y-2 p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                      <span className="font-bold text-blue-900 block">Your Shop Details</span>
                      <div>
                        <label className="block font-medium text-slate-700 mb-0.5">Shop Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 555 Fashion Hub"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 mb-0.5">Description</label>
                        <input
                          type="text"
                          placeholder="Original sneakers and streetwear in Kigali"
                          value={shopDescription}
                          onChange={(e) => setShopDescription(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Create Account & Start</span>
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              )}
            </>
          )}

          {/* Quick Demo Personas One-Click Switcher */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              ⚡ Quick Instant Demo Personas
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleLogin('admin@clearmall.com')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex flex-col items-center gap-1 transition-colors border border-slate-200"
              >
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                <span>👔 Director</span>
              </button>

              <button
                type="button"
                onClick={() => handleLogin('tech@clearmall.com')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex flex-col items-center gap-1 transition-colors border border-slate-200"
              >
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>🏪 Seller</span>
              </button>

              <button
                type="button"
                onClick={() => handleLogin('ishimweclement537@gmail.com')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex flex-col items-center gap-1 transition-colors border border-slate-200"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>🛒 Customer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
