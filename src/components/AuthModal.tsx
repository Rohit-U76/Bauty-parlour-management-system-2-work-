import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  KeyRound,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Crown,
  Gift,
  Star,
  Check
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { ModernSalonLogo } from './ModernSalonLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalInitialTab,
    authModalMode,
    login,
    registerCustomer,
    settings
  } = useSalon();

  const [activeTab, setActiveTab] = useState<'customer_login' | 'customer_register' | 'admin_login'>('customer_login');

  // Customer Form State
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regServices, setRegServices] = useState<string[]>([]);

  // Admin Form State
  const [adminIdentifier, setAdminIdentifier] = useState('admin');
  const [adminSecret, setAdminSecret] = useState('');
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableServicePicks = [
    '3D/4D Bridal Makeup',
    "Men's Fade & Styling",
    "Cheryla's Facial",
    "L'Oréal Hair Spa",
    'Keratin Treatment'
  ];

  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalInitialTab === 'admin') {
        setActiveTab('admin_login');
      } else if (authModalMode === 'register') {
        setActiveTab('customer_register');
      } else {
        setActiveTab('customer_login');
      }
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen, authModalInitialTab, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await login(customerIdentifier, customerPassword, 'CUSTOMER');
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await registerCustomer({
      name: regName,
      username: regUsername,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      preferredServices: regServices
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await login(adminIdentifier, adminSecret, 'ADMIN');
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Owner credentials verified. Opening Admin Suite...');
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const quickFill = (identifier: string, pass: string, tab: 'customer_login' | 'admin_login') => {
    setActiveTab(tab);
    if (tab === 'customer_login') {
      setCustomerIdentifier(identifier);
      setCustomerPassword(pass);
    } else {
      setAdminIdentifier(identifier);
      setAdminSecret(pass);
    }
    setErrorMsg('');
  };

  const toggleServicePref = (cat: string) => {
    setRegServices(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div
      id="salon-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#141418] border border-purple-200 dark:border-zinc-800 rounded-3xl shadow-2xl shadow-purple-500/10 dark:shadow-black/70 overflow-hidden my-6 transition-all">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-100 dark:border-zinc-800 bg-purple-50/50 dark:bg-[#0e0e12]">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <ModernSalonLogo size="sm" showTagline={false} />
            <div>
              <h2 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">
                Salon Portal Access
              </h2>
              <p className="text-xs text-purple-700 dark:text-amber-400 font-semibold">
                {settings.salonName} • Mohol
              </p>
            </div>
          </div>

          {/* 3 Tabs */}
          <div className="mt-4 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-purple-100/60 dark:bg-[#0a0a0d] border border-purple-200 dark:border-zinc-800 text-xs font-bold">
            <button
              type="button"
              id="modal-tab-signin"
              onClick={() => {
                setActiveTab('customer_login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'customer_login'
                  ? 'bg-purple-600 text-white dark:bg-amber-500 dark:text-zinc-950 font-extrabold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-800 dark:hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              id="modal-tab-signup"
              onClick={() => {
                setActiveTab('customer_register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'customer_register'
                  ? 'bg-purple-600 text-white dark:bg-amber-500 dark:text-zinc-950 font-extrabold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-800 dark:hover:text-zinc-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>

            <button
              type="button"
              id="modal-tab-admin"
              onClick={() => {
                setActiveTab('admin_login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin_login'
                  ? 'bg-purple-200 text-purple-900 border border-purple-300 dark:bg-zinc-800 dark:text-amber-400 dark:border-amber-500/40 font-extrabold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-800 dark:hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Notification / Error feedback */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: CUSTOMER LOGIN */}
          {/* ========================================================================= */}
          {activeTab === 'customer_login' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600 dark:text-amber-500" />
                  <span>Username, Email, or Mobile Number</span>
                </label>
                <input
                  type="text"
                  required
                  id="modal-login-identifier"
                  value={customerIdentifier}
                  onChange={(e) => setCustomerIdentifier(e.target.value)}
                  placeholder="e.g. rohit / priya / rohitumdale@gmail.com / 8104026257"
                  className="w-full px-4 py-2.5 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-amber-500" />
                    <span>Password</span>
                  </label>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                    (Default: password123)
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showCustomerPassword ? 'text' : 'password'}
                    required
                    id="modal-login-password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 cursor-pointer"
                  >
                    {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="modal-login-submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Fill Demo */}
              <div className="pt-2">
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600 dark:text-amber-500" />
                  <span>1-Click Test Demo:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickFill('rohit', 'password123', 'customer_login')}
                    className="p-2 rounded-xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-amber-500/50 text-left transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>Rohit Umdale</span>
                      <Crown className="w-3 h-3 text-purple-600 dark:text-amber-400" />
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                      rohit (500 pts)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill('priya', 'password123', 'customer_login')}
                    className="p-2 rounded-xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-amber-500/50 text-left transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>Priya Sharma</span>
                      <Star className="w-3 h-3 text-purple-600 dark:text-amber-400" />
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                      priya (450 pts)
                    </div>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Need a new account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customer_register');
                    setErrorMsg('');
                  }}
                  className="text-xs text-purple-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Create Account (+100 pts)
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CUSTOMER REGISTER */}
          {/* ========================================================================= */}
          {activeTab === 'customer_register' && (
            <form onSubmit={handleCustomerRegister} className="space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-100/80 dark:bg-amber-500/10 border border-purple-200 dark:border-amber-500/30 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-700 dark:text-amber-400 shrink-0" />
                <span className="text-[11px] text-zinc-700 dark:text-zinc-300">
                  <strong className="text-purple-900 dark:text-amber-300">100 Welcome Points:</strong> Added to your profile upon creation!
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    id="modal-reg-name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rohit Umdale"
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    Username (Optional)
                  </label>
                  <input
                    type="text"
                    id="modal-reg-username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. rohit123"
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    id="modal-reg-phone"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 8104026257"
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    id="modal-reg-email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. rohit@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    id="modal-reg-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3 py-2 pr-9 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-0.5 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Service picks */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Interests (Optional):
                </label>
                <div className="flex flex-wrap gap-1">
                  {availableServicePicks.map((srv) => {
                    const isSel = regServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleServicePref(srv)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] transition flex items-center gap-1 cursor-pointer ${
                          isSel
                            ? 'bg-purple-600 text-white dark:bg-amber-500 dark:text-zinc-950 font-bold'
                            : 'bg-purple-50 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-purple-400'
                        }`}
                      >
                        {isSel && <Check className="w-2.5 h-2.5" />}
                        <span>{srv}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                id="modal-reg-submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account &amp; Collect 100 Pts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Already registered?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customer_login');
                    setErrorMsg('');
                  }}
                  className="text-xs text-purple-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ADMIN / OWNER LOGIN */}
          {/* ========================================================================= */}
          {activeTab === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-100/80 dark:bg-amber-500/10 border border-purple-200 dark:border-amber-500/30 flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-700 dark:text-amber-400 shrink-0" />
                <span className="text-xs text-zinc-700 dark:text-zinc-300">
                  Salon Owner &amp; Stylist Access Portal
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600 dark:text-amber-500" />
                  <span>Admin Username or Email</span>
                </label>
                <input
                  type="text"
                  required
                  id="modal-admin-identifier"
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  placeholder="e.g. admin or admin@modernsalon.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-amber-500" />
                    <span>PIN or Password</span>
                  </label>
                  <span className="text-[11px] text-purple-700 dark:text-amber-400 font-mono font-bold">
                    (PIN: 9999 or 'admin')
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showAdminSecret ? 'text' : 'password'}
                    required
                    id="modal-admin-secret"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter 4-digit PIN (9999) or Master Password"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 focus:border-purple-600 dark:focus:border-amber-500 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminSecret(!showAdminSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 cursor-pointer"
                  >
                    {showAdminSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="modal-admin-submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Admin Suite</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => quickFill('admin', '9999', 'admin_login')}
                className="w-full p-2.5 rounded-xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-amber-500/50 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div className="text-xs font-bold text-purple-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>1-Click Owner Auto-Fill (PIN: 9999)</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-amber-500/10 dark:text-amber-400 rounded-md">
                  Use Preset
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
