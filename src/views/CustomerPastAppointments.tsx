import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCw,
  Search,
  Receipt,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Eye,
  Filter,
  Copy,
  Check,
  Star,
  MessageSquare,
  Send,
  Plus,
  Crown,
  Gift,
  LogIn
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Appointment } from '../types';
import { AppointmentPassModal } from '../components/AppointmentPassModal';
import { CustomerFeedbackForm } from '../components/CustomerFeedbackForm';

export const CustomerPastAppointments: React.FC = () => {
  const {
    services,
    reviews,
    openBookingModal,
    setActiveNavTab,
    currentUser,
    openAuthModal,
    fetchMyAppointments
  } = useSalon();
  
  const [myBookings, setMyBookings] = useState<Appointment[]>([]);
  const [lookupPhone, setLookupPhone] = useState(currentUser?.phone || '');
  const [listError, setListError] = useState<string>('');
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [selectedPassAppointment, setSelectedPassAppointment] = useState<Appointment | null>(null);
  const [selectedFeedbackAppointment, setSelectedFeedbackAppointment] = useState<Appointment | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'appointments' | 'feedback'>('appointments');

  const loadMine = async (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setMyBookings([]);
      return;
    }
    setListLoading(true);
    setListError('');
    try {
      const rows = await fetchMyAppointments(trimmed);
      setMyBookings(rows);
    } catch (err: any) {
      setListError(err?.message || 'Could not load bookings from the server.');
      setMyBookings([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const phone = currentUser?.phone || '';
    setLookupPhone(phone);
    loadMine(phone);
  }, [currentUser?.phone]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return myBookings
      .filter(apt => {
        const matchesStatus = 
          statusFilter === 'ALL' || 
          apt.bookingStatus === statusFilter || 
          apt.status === statusFilter;
        
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          !q ||
          apt.bookingRef.toLowerCase().includes(q) ||
          apt.clientName.toLowerCase().includes(q) ||
          apt.clientPhone.toLowerCase().includes(q) ||
          apt.serviceName.toLowerCase().includes(q) ||
          (apt.category || '').toLowerCase().includes(q);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [myBookings, statusFilter, searchQuery]);

  const handleCopy = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleRebook = (apt: Appointment) => {
    const matchedService = services.find(s => s.id === apt.serviceId || s.name.toLowerCase() === apt.serviceName.toLowerCase());
    if (matchedService) {
      openBookingModal(matchedService);
    } else {
      openBookingModal();
    }
  };

  const handleOpenFeedback = (apt?: Appointment) => {
    setSelectedFeedbackAppointment(apt || null);
    setShowFeedbackModal(true);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed Slot</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-10 space-y-6 sm:space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Client Appointment &amp; Satisfaction Portal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Customer Dashboard &amp; Visits
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Manage your past and upcoming salon bookings, verify 10% advance deposits, access digital check-in passes, or submit real-time feedback directly to the salon owner.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => handleOpenFeedback()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Submit Live Feedback</span>
          </button>

          <button
            onClick={() => openBookingModal()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 text-zinc-950" />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Logged in User Status Banner or Login Prompt */}
      {currentUser ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-base shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {currentUser.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
                  {currentUser.memberTier || 'Verified Client'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentUser.email} • {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {currentUser.loyaltyPoints !== undefined && (
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-amber-500/30 text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>Rewards: <strong className="text-amber-600 dark:text-amber-400 font-mono">{currentUser.loyaltyPoints} pts</strong></span>
              </div>
            )}
            <div className="text-[11px] text-zinc-500">
              Member since {currentUser.memberSince || '2026'}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            <Crown className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Have a registered salon profile? Sign in to unlock loyalty reward points, digital passes, and instant auto-fill!</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal('customer', 'login')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Client Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('customer', 'register')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition cursor-pointer"
            >
              Register (+100 pts)
            </button>
          </div>
        </div>
      )}

      {/* Sub-view Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setViewMode('appointments')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            viewMode === 'appointments'
              ? 'bg-amber-500 text-zinc-950 shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Salon Bookings ({myBookings.length})</span>
        </button>

        <button
          onClick={() => setViewMode('feedback')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            viewMode === 'feedback'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Real-Time Feedback Form</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px]">
            Direct Sync
          </span>
        </button>
      </div>

      {viewMode === 'feedback' ? (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
          <CustomerFeedbackForm
            onSuccess={() => {
              setTimeout(() => setViewMode('appointments'), 2500);
            }}
          />
        </div>
      ) : (
        <>
          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Total Bookings</span>
              <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-serif">{myBookings.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Confirmed / Active</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">
                {myBookings.filter(a => a.bookingStatus === 'CONFIRMED' || a.status === 'CONFIRMED').length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Completed Visits</span>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 font-serif">
                {myBookings.filter(a => a.bookingStatus === 'COMPLETED' || a.status === 'COMPLETED').length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Satisfaction Rate</span>
              <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">4.9 ★ (CSAT 98%)</div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3.5 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                placeholder="Lookup bookings by mobile number"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => loadMine(lookupPhone)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold"
              >
                {listLoading ? 'Loading…' : 'Find my bookings'}
              </button>
            </div>
            {listError && <p className="text-xs text-red-500">{listError}</p>}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Booking Ref, Client Name, Phone or Service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-1" />
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'CONFIRMED', label: 'Confirmed' },
                  { id: 'COMPLETED', label: 'Completed' },
                  { id: 'CANCELLED', label: 'Cancelled' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Appointment Records Found</h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'ALL'
                    ? 'No bookings match your selected filter criteria. Try resetting the filters or search term.'
                    : 'You have not booked any appointments yet. Book a customized hair, facial, or grooming session in Mohol with our 10% advance deposit.'}
                </p>
              </div>
              <button
                onClick={() => openBookingModal()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-sm transition cursor-pointer"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredAppointments.map(apt => {
                const status = apt.bookingStatus || apt.status;
                return (
                  <div
                    key={apt.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-all shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    {/* Top Row: Ref + Status */}
                    <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                            {apt.bookingRef}
                          </span>
                          <button
                            onClick={() => handleCopy(apt.bookingRef)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                            title="Copy Reference"
                          >
                            {copiedRef === apt.bookingRef ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {apt.serviceName}
                        </h3>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(status)}
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="font-semibold">{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                          <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{apt.clientName} ({apt.clientPhone})</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 text-right">
                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                          <span>Total Amount:</span>
                          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{apt.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> 10% Paid Online:
                          </span>
                          <span className="font-mono font-bold">₹{apt.advancePaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-1">
                          <span>Balance at Salon:</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">₹{apt.balanceDue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 italic">
                        Note: "{apt.notes}"
                      </div>
                    )}

                    {/* Bottom Actions: Rate Visit, E-Pass & Rebook */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPassAppointment(apt)}
                          className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5 text-amber-500" />
                          <span>Pass</span>
                        </button>

                        <button
                          onClick={() => handleOpenFeedback(apt)}
                          className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                          title="Submit real-time rating for this visit"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Rate Visit</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleRebook(apt)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-zinc-950" />
                        <span>Rebook</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Digital Pass Modal */}
      {selectedPassAppointment && (
        <AppointmentPassModal
          appointment={selectedPassAppointment}
          onClose={() => setSelectedPassAppointment(null)}
        />
      )}

      {/* Real-time Feedback Submission Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl">
            <CustomerFeedbackForm
              initialAppointment={selectedFeedbackAppointment}
              isModal={true}
              onClose={() => setShowFeedbackModal(false)}
              onSuccess={() => {
                // Keep open to view confirmation/coupon
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

