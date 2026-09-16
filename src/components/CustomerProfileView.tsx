import React, { useState } from 'react';
import {
  User,
  Crown,
  Gift,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Award,
  ChevronRight,
  TrendingUp,
  LogIn,
  LogOut,
  Clock,
  Scissors
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Appointment } from '../types';

interface CustomerProfileViewProps {
  onBookAppointment: () => void;
  appointments: Appointment[];
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  onBookAppointment,
  appointments
}) => {
  const { currentUser, openAuthModal, logout, settings } = useSalon();

  const confirmedCount = appointments.filter(a => a.bookingStatus === 'CONFIRMED' || a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter(a => a.bookingStatus === 'COMPLETED' || a.status === 'COMPLETED').length;
  const totalAdvancePaid = appointments.reduce((sum, a) => sum + (a.advancePaid || 0), 0);

  // If user is not signed in
  if (!currentUser) {
    return (
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mx-auto flex items-center justify-center">
          <Crown className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Client Profile &amp; Loyalty Rewards
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Sign in to view your loyalty points, track past and upcoming visits, access digital QR passes, and enjoy automated 10% advance booking check-out.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('customer', 'login')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>
          <button
            onClick={() => openAuthModal('customer', 'register')}
            className="px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
          >
            <span>Register (+100 Pts)</span>
          </button>
        </div>
      </div>
    );
  }

  const loyaltyPoints = currentUser.loyaltyPoints ?? 150;
  const rupeeValue = Math.round(loyaltyPoints * 0.5); // 2 points = ₹1
  const tier = currentUser.memberTier || 'VIP Member';

  const cleanPhone = (settings.phone || '8104026257').replace(/\D/g, '');
  const conciergeWhatsApp = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello Rohit ji, I am ${currentUser.name} (Member Tier: ${tier}). I have a query regarding my appointments and loyalty benefits.`)}`;

  return (
    <div className="space-y-6">
      {/* Top Profile Summary Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {currentUser.name}
                </h2>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{tier}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentUser.email}</span>
                </span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>+91 {currentUser.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Member since {currentUser.memberSince || '2026'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <a
              href={conciergeWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp Concierge</span>
            </a>

            <button
              onClick={() => logout()}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-500/15 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Bento Grid: Loyalty, Stats, and Tier Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Loyalty Rewards Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Loyalty Points</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
              Active Balance
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {loyaltyPoints} <span className="text-base text-amber-600 dark:text-amber-400 font-serif">Points</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Worth approximately <strong>₹{rupeeValue}</strong> in direct salon discounts on upcoming visits.
            </p>
          </div>

          {/* Tier Progress */}
          <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
            <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
              <span>Tier Progress</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200">
                {loyaltyPoints} / 500 Pts to Platinum
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-amber-500/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (loyaltyPoints / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Salon Visit Stats */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-amber-400" />
              <span>Visit History</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
              Total {appointments.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50">
              <div className="text-[11px] text-zinc-500">Confirmed</div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {confirmedCount}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50">
              <div className="text-[11px] text-zinc-500">Completed</div>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {completedCount}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500">10% Advance Paid Total:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ₹{totalAdvancePaid.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 3: VIP Membership Perks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Membership Benefits</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              Unlocked
            </span>
          </div>

          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zero waiting time with guaranteed chair reservation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Complimentary scalp &amp; skin consultation with every haircut</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Automated 24-hour reminder SMS &amp; WhatsApp check-in pass</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onBookAppointment}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 dark:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-white" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
