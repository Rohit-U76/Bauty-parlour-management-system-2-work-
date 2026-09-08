import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Bell, 
  Eye, 
  CheckCircle2,
  Table,
  Phone,
  FileText,
  Instagram,
  MapPin,
  Star,
  LogOut,
  Crown,
  Gift,
  KeyRound,
  MoreHorizontal
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { ThemeToggle } from './ThemeToggle';
import { getAppointmentReminderInfo } from '../utils/appointmentReminderUtils';
import { AppointmentPassModal } from './AppointmentPassModal';
import { MobileMoreSheet } from './MobileMoreSheet';
import { Appointment } from '../types';
import { ModernSalonLogo } from './ModernSalonLogo';

export const Navbar: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    openBookingModal,
    setIsAdminMode,
    openQuizModal,
    appointments,
    settings,
    reviews,
    currentUser,
    openAuthModal,
    logout
  } = useSalon();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedPassAppointment, setSelectedPassAppointment] = useState<Appointment | null>(null);

  // Compute 24-hr and upcoming reminders
  const upcomingReminders = useMemo(() => {
    return appointments.filter(apt => {
      const info = getAppointmentReminderInfo(apt);
      return info.isUpcoming24h;
    });
  }, [appointments]);

  const handleNav = (tab: string) => {
    setActiveNavTab(tab);
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 dark:bg-black text-zinc-300 border-b border-zinc-800 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-amber-400 font-bold shrink-0">
              Modern Unisex Salon:
            </span>
            <span className="truncate text-zinc-300">
              Mohol • B.N. Gund Complex • {settings.advancePercentage || 10}% Online Advance Deposit
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 lg:gap-4 text-zinc-400 shrink-0">
            <a 
              href={`tel:${settings.phone}`} 
              className="flex items-center gap-1 text-zinc-300 hover:text-amber-300 transition font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>+91 {settings.phone}</span>
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href={settings.instagramUrl || "https://www.instagram.com/modern_unisex_salon_mohol?utm_source=qr"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@modern_unisex_salon_mohol</span>
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> Razorpay {settings.advancePercentage || 10}% Advance
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')}
            className="cursor-pointer group select-none shrink-0"
          >
            <ModernSalonLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium">
            <button
              onClick={() => handleNav('home')}
              className={`transition-colors py-1 ${
                activeNavTab === 'home' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            {/* Services (Tabular Rate Card) */}
            <div className="relative group">
              <button
                onClick={() => handleNav('services')}
                onMouseEnter={() => setServicesDropdown(true)}
                className={`flex items-center gap-1 transition-colors py-1 ${
                  activeNavTab === 'services' 
                    ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span>Rate Card</span>
                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:rotate-180 transition-transform" />
              </button>

              {servicesDropdown && (
                <div 
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Service Categories
                  </div>
                  <button
                    onClick={() => handleNav('services')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>💄 Make Up (HD, 3D/4D)</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">₹2,000+</span>
                  </button>
                  <button
                    onClick={() => handleNav('services')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>🌿 Skin &amp; Hydrafacial</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Top Rated</span>
                  </button>
                  <button
                    onClick={() => handleNav('services')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>💇‍♀️ Hair Cut &amp; Blow Dry</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">From ₹150</span>
                  </button>
                  <button
                    onClick={() => handleNav('services')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>🎨 Global &amp; Balayage Color</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">₹2,500+</span>
                  </button>
                  <button
                    onClick={() => handleNav('services')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>🧪 Keratin &amp; Rebonding</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">₹4,000+</span>
                  </button>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>
                  <button
                    onClick={() => {
                      setServicesDropdown(false);
                      openQuizModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Style &amp; Treatment Quiz</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reviews & Ratings Nav Tab */}
            <button
              onClick={() => handleNav('reviews')}
              className={`transition-colors flex items-center gap-1.5 py-1 ${
                activeNavTab === 'reviews' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Reviews</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                {reviews.length}
              </span>
            </button>

            {/* My Visits & Customer Dashboard Nav Tab */}
            <button
              onClick={() => handleNav('appointments')}
              className={`transition-colors flex items-center gap-1.5 py-1 ${
                activeNavTab === 'appointments' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>My Visits</span>
              {appointments.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  {appointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('offers')}
              className={`transition-colors py-1 ${
                activeNavTab === 'offers' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Offers
            </button>

            <button
              onClick={() => handleNav('gallery')}
              className={`transition-colors py-1 ${
                activeNavTab === 'gallery' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleNav('terms')}
              className={`transition-colors flex items-center gap-1 py-1 ${
                activeNavTab === 'terms' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Policies</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`transition-colors py-1 ${
                activeNavTab === 'about' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`transition-colors py-1 ${
                activeNavTab === 'contact' 
                  ? 'text-amber-600 dark:text-amber-400 font-bold border-b-2 border-amber-500' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* 24-Hour Reminder Notification Bell */}
            <div className="relative">
              <button
                id="navbar-reminder-bell-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2.5 rounded-xl border transition relative ${
                  upcomingReminders.length > 0
                    ? 'border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
                title="Upcoming appointment reminders"
              >
                <Bell className="w-4 h-4" />
                {upcomingReminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                    {upcomingReminders.length}
                  </span>
                )}
              </button>

              {/* Reminders Dropdown Popup */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        24-Hour Appointment Alerts
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                      {upcomingReminders.length} Due Soon
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {upcomingReminders.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        No appointments scheduled within the next 24 hours.
                      </div>
                    ) : (
                      upcomingReminders.map((apt) => {
                        const info = getAppointmentReminderInfo(apt);
                        return (
                          <div
                            key={apt.id}
                            className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/70 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                  {apt.serviceName}
                                </span>
                                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                  Client: <strong>{apt.clientName}</strong>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                                {info.hoursUntil}h away
                              </span>
                            </div>

                            <div className="text-[11px] text-zinc-700 dark:text-zinc-300 flex items-center justify-between font-mono">
                              <span>📅 {apt.date} at {apt.timeSlot}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{settings.advancePercentage || 10}% Deposit Paid</span>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedPassAppointment(apt);
                                setNotificationsOpen(false);
                              }}
                              className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[11px] font-extrabold flex items-center justify-center gap-1 shadow transition"
                            >
                              <Eye className="w-3.5 h-3.5 text-zinc-950" />
                              <span>View Digital Check-In Pass</span>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Customer Account / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="navbar-user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-extrabold text-[10px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  {currentUser.role === 'ADMIN' && (
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold">
                          {currentUser.role === 'ADMIN' ? 'Owner' : (currentUser.memberTier || 'Client')}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                      {currentUser.loyaltyPoints !== undefined && (
                        <div className="mt-1 pt-1 border-t border-zinc-200/60 dark:border-zinc-700 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">Reward Balance:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                            💎 {currentUser.loyaltyPoints} pts
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      {currentUser.role === 'ADMIN' ? (
                        <button
                          onClick={() => {
                            setIsAdminMode(true);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Open Owner Admin Suite</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleNav('appointments');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-amber-500" />
                          <span>My Bookings &amp; Passes</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="navbar-client-signin-btn"
                onClick={() => openAuthModal('customer', 'login')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Client Login</span>
              </button>
            )}

            {/* Admin Portal Toggle */}
            <button
              id="navbar-admin-toggle-btn"
              onClick={() => {
                if (currentUser?.role === 'ADMIN') {
                  setIsAdminMode(true);
                } else {
                  openAuthModal('admin', 'login');
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer"
              title="Staff / Admin Authentication"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>

            {/* Golden Book Appointment Button */}
            <button
              id="navbar-book-appointment-btn"
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-zinc-950" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Quick Call */}
            <a
              href={`tel:${settings.phone}`}
              className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Call Salon"
            >
              <Phone className="w-4 h-4 text-amber-500" />
            </a>

            {/* Notification Bell on Mobile */}
            {upcomingReminders.length > 0 && (
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 transition relative"
                title="Appointment alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-extrabold flex items-center justify-center animate-bounce">
                  {upcomingReminders.length}
                </span>
              </button>
            )}

            <ThemeToggle />

            {/* Three Dots / Menu Button */}
            <button
              id="navbar-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
              aria-label="Toggle options menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-500" />
              ) : (
                <div className="flex items-center gap-1">
                  <MoreHorizontal className="w-5 h-5 text-amber-500" />
                  <span className="text-[11px] font-bold hidden xs:inline text-zinc-700 dark:text-zinc-300">Menu</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-lg">
          
          {/* Mobile User Profile Section */}
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    {currentUser.role === 'ADMIN' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {currentUser.role === 'ADMIN' ? 'Salon Owner' : (currentUser.memberTier || 'Client')} • {currentUser.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('customer', 'login');
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Client Login</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('customer', 'register');
                }}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-500" />
                <span>Join (100 pts)</span>
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-1 text-sm font-medium">
            <button
              onClick={() => handleNav('home')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('services')}
              className="text-left px-3 py-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold flex items-center justify-between"
            >
              <span>Service Price Table (Rate Card)</span>
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNav('reviews')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Reviews &amp; Ratings ({reviews.length})</span>
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">4.9 ★</span>
            </button>
            <button
              onClick={() => handleNav('appointments')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>My Visits &amp; Feedback</span>
              </span>
              {appointments.length > 0 && (
                <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {appointments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('offers')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Coupons &amp; Offers
            </button>
            <button
              onClick={() => handleNav('gallery')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Gallery
            </button>
            <button
              onClick={() => handleNav('terms')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Terms &amp; Salon Policies
            </button>
            <button
              onClick={() => handleNav('about')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              About Modern Salon
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Contact &amp; Map Location
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            <button
              id="mobile-drawer-book-appointment-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4 text-zinc-950" />
              <span>Book Appointment (10% Advance)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser?.role === 'ADMIN') {
                  setIsAdminMode(true);
                } else {
                  openAuthModal('admin', 'login');
                }
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Owner Admin Suite</span>
            </button>
          </div>
        </div>
      )}

      {/* Digital Pass Modal when clicked from notification bell */}
      {selectedPassAppointment && (
        <AppointmentPassModal
          appointment={selectedPassAppointment}
          onClose={() => setSelectedPassAppointment(null)}
        />
      )}
    </header>
  );
};
