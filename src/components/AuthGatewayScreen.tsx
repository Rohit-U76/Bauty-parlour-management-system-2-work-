import React, { useState } from 'react';
import {
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
  Check,
  Compass,
  Scissors
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { ModernSalonLogo } from './ModernSalonLogo';

export const AuthGatewayScreen: React.FC = () => {
  const {
    login,
    registerCustomer,
    setIsGuestMode,
    settings,
    currentUser
  } = useSalon();

  const [activeTab, setActiveTab] = useState<'customer_login' | 'customer_register' | 'admin_login'>('customer_login');

  // Customer Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Admin Form State
  const [adminIdentifier, setAdminIdentifier] = useState('admin');
  const [adminSecret, setAdminSecret] = useState('');
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  // Feedback State
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

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await login(loginIdentifier, loginPassword, 'CUSTOMER');
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
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
      preferredServices: selectedServices
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
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
      setSuccessMsg('Owner Access Verified. Entering Management Suite...');
    } else {
      setErrorMsg(res.message);
    }
  };

  const quickFill = (identifier: string, pass: string, tab: 'customer_login' | 'admin_login') => {
    setActiveTab(tab);
    if (tab === 'customer_login') {
      setLoginIdentifier(identifier);
      setLoginPassword(pass);
    } else {
      setAdminIdentifier(identifier);
      setAdminSecret(pass);
    }
    setErrorMsg('');
  };

  const toggleService = (srv: string) => {
    setSelectedServices(prev =>
      prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      {/* Background Decorative Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <ModernSalonLogo size="md" showTagline={false} />
          <div>
            <h1 className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">
              {settings.salonName}
            </h1>
            <p className="text-xs text-amber-400 font-medium">
              Mohol • Premier Unisex Salon &amp; Bridal Studio
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-xs font-semibold text-amber-400 flex items-center gap-2 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Authorization Required</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-xl bg-zinc-900/95 border border-zinc-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
          
          {/* Header & Tabs */}
          <div className="p-6 sm:p-8 pb-4 border-b border-zinc-800">
            <div className="text-center space-y-1.5 mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Salon Member Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {activeTab === 'customer_login' && 'Sign in to Your Account'}
                {activeTab === 'customer_register' && 'Create Your Salon Account'}
                {activeTab === 'admin_login' && 'Salon Owner & Staff Login'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                {activeTab === 'customer_login' && 'Access reward points, booking passes, and express checkouts'}
                {activeTab === 'customer_register' && 'Register now to receive a 100 Reward Points welcome bonus'}
                {activeTab === 'admin_login' && 'Master Stylist Dashboard & Business Operations'}
              </p>
            </div>

            {/* 3 Clear Segmented Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold">
              <button
                type="button"
                id="auth-tab-client-login"
                onClick={() => {
                  setActiveTab('customer_login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'customer_login'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="truncate">Sign In</span>
              </button>

              <button
                type="button"
                id="auth-tab-client-register"
                onClick={() => {
                  setActiveTab('customer_register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  activeTab === 'customer_register'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span className="truncate">Sign Up</span>
                <span className="hidden sm:inline text-[9px] font-black px-1.5 py-0.2 bg-amber-400 text-zinc-950 rounded-full ml-0.5">
                  +100pt
                </span>
              </button>

              <button
                type="button"
                id="auth-tab-admin-login"
                onClick={() => {
                  setActiveTab('admin_login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'admin_login'
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/40 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate">Admin</span>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: CUSTOMER LOGIN */}
            {activeTab === 'customer_login' && (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>Username, Email, or Mobile Number</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="login-username-input"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. rohit / priya / rohitumdale@gmail.com / 8104026257"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-sm text-white placeholder:text-zinc-500 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Password</span>
                    </label>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      (Default: password123)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      id="login-password-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-sm text-white placeholder:text-zinc-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="login-submit-btn"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Test Demo Pre-fills */}
                <div className="pt-2">
                  <div className="text-[11px] text-zinc-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Instant 1-Click Test Accounts:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickFill('rohit', 'password123', 'customer_login')}
                      className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-left transition cursor-pointer"
                    >
                      <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                        <span>Rohit Umdale</span>
                        <Crown className="w-3 h-3 text-amber-400" />
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        user: rohit (500 pts)
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickFill('priya', 'password123', 'customer_login')}
                      className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-left transition cursor-pointer"
                    >
                      <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                        <span>Priya Sharma</span>
                        <Star className="w-3 h-3 text-amber-400" />
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        user: priya (450 pts)
                      </div>
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-xs text-zinc-400">
                    Don't have an account yet?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('customer_register');
                      setErrorMsg('');
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Create an Account (+100 pts)
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CUSTOMER REGISTER */}
            {activeTab === 'customer_register' && (
              <form onSubmit={handleCustomerRegister} className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                  <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs text-zinc-300">
                    <span className="font-bold text-amber-300">100 Welcome Points:</span> Instantly credited to your profile upon account creation!
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      id="reg-name-input"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rohit Umdale"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-xs text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">
                      Choose Username (Optional)
                    </label>
                    <input
                      type="text"
                      id="reg-username-input"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. rohit123"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-xs text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-500" />
                      <span>Mobile Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      id="reg-phone-input"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 8104026257"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-xs text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-amber-500" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      id="reg-email-input"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rohit@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-xs text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Create Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      id="reg-password-input"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-xs text-white placeholder:text-zinc-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Preferred Services Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-zinc-400">
                    Interests &amp; Preferred Services (Optional):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableServicePicks.map((srv) => {
                      const isSel = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer ${
                            isSel
                              ? 'bg-amber-500 text-zinc-950 font-bold'
                              : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          {isSel && <Check className="w-3 h-3" />}
                          <span>{srv}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  id="reg-submit-btn"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration &amp; Collect 100 Pts</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <span className="text-xs text-zinc-400">
                    Already registered with us?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('customer_login');
                      setErrorMsg('');
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: ADMIN / OWNER LOGIN */}
            {activeTab === 'admin_login' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs text-zinc-300">
                    <span className="font-bold text-amber-300">Owner Access:</span> Manage appointments, edit rate cards, view Razorpay transactions, and handle inquiries.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>Admin Username or Email</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="admin-identifier-input"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="e.g. admin or admin@modernsalon.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-sm text-white placeholder:text-zinc-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                      <span>Owner PIN or Password</span>
                    </label>
                    <span className="text-[11px] text-amber-400 font-mono font-bold">
                      (PIN: 9999 or 'admin')
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showAdminSecret ? 'text' : 'password'}
                      required
                      id="admin-secret-input"
                      value={adminSecret}
                      onChange={(e) => setAdminSecret(e.target.value)}
                      placeholder="Enter 4-digit PIN (9999) or Master Password"
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-sm text-white placeholder:text-zinc-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminSecret(!showAdminSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                    >
                      {showAdminSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="admin-submit-btn"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate &amp; Open Admin Suite</span>
                    </>
                  )}
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => quickFill('admin', '9999', 'admin_login')}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5" />
                        <span>1-Click Owner Auto-Fill</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        user: admin | PIN: 9999
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg">
                      Use Preset
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Notice: Authorization Enforced */}
            <div className="pt-4 border-t border-zinc-800 text-center space-y-1.5">
              <div className="text-xs text-zinc-300 flex items-center justify-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Authorization Required: Please sign in or create an account to enter</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                All client profiles and appointments are saved directly to the salon MySQL database.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 text-center text-xs text-zinc-500 border-t border-zinc-800/60">
        <p>
          &copy; {new Date().getFullYear()} {settings.salonName} • {settings.address} • Contact: {settings.phone}
        </p>
      </footer>
    </div>
  );
};
