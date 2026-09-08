import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { ModernSalonLogo } from './ModernSalonLogo';

export const AdminAuthGate: React.FC = () => {
  const { login, setIsAdminMode, setActiveNavTab, settings } = useSalon();
  const [adminIdentifier, setAdminIdentifier] = useState('admin@modernsalon.com');
  const [adminSecret, setAdminSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(adminIdentifier, adminSecret, 'ADMIN');
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const quickFill = (identifier: string, secret: string) => {
    setAdminIdentifier(identifier);
    setAdminSecret(secret);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200">
      
      {/* Back to Client Site button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={() => {
            setIsAdminMode(false);
            setActiveNavTab('home');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Client Website</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          Mohol Front Desk
        </span>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-950/40 text-center space-y-2">
          <div className="flex justify-center">
            <ModernSalonLogo size="md" showTagline={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Stylist &amp; Admin Portal</span>
          </div>

          <h1 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
            Staff Security Clearance
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            Please authenticate with your owner password or 4-digit PIN to access administrative controls.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="admin@modernsalon.com"
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password or 4-Digit Security PIN
                </label>
                <span className="text-[10px] text-zinc-400 font-mono">PIN: 9999</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type={showSecret ? 'text' : 'password'}
                  required
                  placeholder="Enter 'admin' or '9999'"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Credentials...' : 'Unlock Admin Suite'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Fill Button */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => quickFill('admin@modernsalon.com', 'admin')}
              className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Test Admin Login (admin / admin)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-zinc-950/80 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 text-center">
          Modern Unisex Salon • B.N. Gund Complex, Mohol - 413213
        </div>
      </div>
    </div>
  );
};
