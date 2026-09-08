import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  Printer,
  FileText,
  MapPin,
  Info,
  Flame,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { RazorpayModal } from './RazorpayModal';
import { ServiceItem, Appointment, PriceTierVariant } from '../types';
import { ModernSalonLogo } from './ModernSalonLogo';
import { SALON_TIME_SLOTS, getSlotAvailability, getDayAvailabilitySummary } from '../utils/availability';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    services,
    selectedServiceForBooking,
    offers,
    createAppointment,
    settings,
    currentUser,
    appointments
  } = useSalon();

  // Wizard steps: 1 = Service & Tier Variant, 2 = Date & Slot, 3 = Client Details & Advance Payment, 4 = Confirmation Receipt
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<PriceTierVariant | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string>('Self-Employed (Master Stylist & Founder)');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  
  // Client details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Payment modal state
  const [showRazorpayModal, setShowRazorpayModal] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Stylists list - "Self Employed" default
  const stylists = [
    'Self-Employed (Master Stylist & Founder)',
    'Senior Beauty & Skin Specialist',
    'Certified Hair & Chemical Treatment Expert'
  ];

  // Time slots
  const timeSlots = [
    '09:30 AM',
    '10:30 AM',
    '11:45 AM',
    '01:30 PM',
    '02:45 PM',
    '04:00 PM',
    '05:30 PM',
    '06:45 PM',
    '07:30 PM'
  ];

  const resetBookingForm = (targetService?: ServiceItem | null) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setSelectedTimeSlot('11:00 AM');
    setSelectedStylist('Self-Employed (Master Stylist & Founder)');
    const srv = targetService !== undefined ? targetService : (selectedServiceForBooking || services[0] || null);
    setSelectedService(srv);
    if (srv && srv.tierOptions && srv.tierOptions.length > 0) {
      setSelectedTier(srv.tierOptions[0]);
    } else {
      setSelectedTier(null);
    }
    setClientName(currentUser?.name || '');
    setClientPhone(currentUser?.phone || '');
    setClientEmail(currentUser?.email || '');
    setSpecialNotes('');
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setConfirmedBooking(null);
    setStep(1);
  };

  // Set default date (today or tomorrow) and fresh state on modal open
  useEffect(() => {
    if (isBookingModalOpen) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      const targetService = selectedServiceForBooking || services[0] || null;
      setSelectedService(targetService);
      if (targetService && targetService.tierOptions && targetService.tierOptions.length > 0) {
        setSelectedTier(targetService.tierOptions[0]);
      } else {
        setSelectedTier(null);
      }
      if (currentUser) {
        setClientName(prev => prev || currentUser.name || '');
        setClientPhone(prev => prev || currentUser.phone || '');
        setClientEmail(prev => prev || currentUser.email || '');
      }
      setStep(1);
      setConfirmedBooking(null);
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
    }
  }, [isBookingModalOpen, selectedServiceForBooking, currentUser]);

  const handleSelectService = (srv: ServiceItem) => {
    setSelectedService(srv);
    if (srv.tierOptions && srv.tierOptions.length > 0) {
      setSelectedTier(srv.tierOptions[0]);
    } else {
      setSelectedTier(null);
    }
  };

  if (!isBookingModalOpen) return null;

  // Calculate active price based on selected tier or base service price
  const activeBasePrice = selectedTier ? selectedTier.price : (selectedService ? selectedService.price : 0);
  const activeDuration = selectedTier?.durationMinutes || selectedService?.durationMinutes || 30;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const netTotal = Math.max(0, activeBasePrice - discountAmount);
  
  // 10% Advance Deposit calculation
  const advancePercentage = settings.advancePercentage || 10;
  const advanceDeposit = Math.round((netTotal * advancePercentage) / 100);
  const balanceAtSalon = netTotal - advanceDeposit;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    const matched = offers.find(
      o => (o.code || '').toUpperCase() === couponCode.trim().toUpperCase() && o.active
    );

    if (matched) {
      if (activeBasePrice < matched.minBookingAmount) {
        setCouponError(`Minimum service amount of ₹${matched.minBookingAmount} required for this coupon.`);
        return;
      }
      let disc = 0;
      if (matched.discountPercent) {
        disc = Math.round((activeBasePrice * matched.discountPercent) / 100);
      } else if (matched.discountAmount) {
        disc = matched.discountAmount;
      }
      setAppliedCoupon({ code: matched.code, discount: disc });
      setCouponError('');
    } else {
      setCouponError('Invalid or expired promo code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleProceedToRazorpay = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please provide your name and mobile number for appointment confirmation and 24h reminder notification.');
      return;
    }
    setShowRazorpayModal(true);
  };

  const handlePaymentSuccess = async (paymentId: string, orderId: string) => {
    setShowRazorpayModal(false);
    if (!selectedService) return;

    const serviceTitle = selectedTier 
      ? `${selectedService.name} (${selectedTier.label})`
      : selectedService.name;

    try {
      const created = await createAppointment({
        serviceId: selectedService.id,
        serviceName: serviceTitle,
        category: selectedService.category,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        stylistName: selectedStylist,
        clientName,
        clientPhone,
        clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        notes: specialNotes,
        couponCode: appliedCoupon?.code,
        totalAmount: netTotal,
        advanceAmount: advanceDeposit,
        balanceDue: balanceAtSalon,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId
      });

      setConfirmedBooking(created);
      setStep(4);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#141418] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="bg-[#0e0e11] border-b border-zinc-800 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <ModernSalonLogo size="sm" showTagline={false} />
            <div className="truncate border-l border-zinc-800 pl-3">
              <h3 className="font-bold text-sm sm:text-base text-zinc-100 truncate">
                {step === 4 ? 'Appointment Confirmation Pass' : 'Schedule Appointment'}
              </h3>
              <p className="text-[11px] text-zinc-400 truncate">
                {step === 4 
                  ? '10% Advance Deposit Verified • Digital Pass Ready'
                  : '10% Online Deposit via UPI / Razorpay • 90% Balance at Counter'
                }
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="bg-[#101014] border-b border-zinc-800 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'bg-zinc-800 text-zinc-500'}`}>1</span>
              <span>Select Service</span>
            </div>
            <span className="text-zinc-700">→</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'bg-zinc-800 text-zinc-500'}`}>2</span>
              <span>Date &amp; Slot</span>
            </div>
            <span className="text-zinc-700">→</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'bg-zinc-800 text-zinc-500'}`}>3</span>
              <span>10% Advance Deposit</span>
            </div>
          </div>
        )}

        {/* Modal Body with smooth scrolling */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-left">
          {/* STEP 1: Service & Tier Variant Selection */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Highlight if a Custom / Preset Bundle is selected */}
              {selectedService && (!services.some(s => s.id === selectedService.id) || selectedService.id.startsWith('bundle-') || selectedService.id.startsWith('preset-')) && (
                <div className="p-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Special Discounted Bundle Selected</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-extrabold">
                      Active Bundle
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{selectedService.name}</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedService.description}</p>
                  
                  {selectedService.benefits && selectedService.benefits.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {selectedService.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Total Bundle Price: <strong className="text-amber-400 text-sm">₹{selectedService.price}</strong></span>
                    <span className="text-emerald-400 font-bold">10% Advance Deposit: ₹{selectedService.advanceDeposit}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  1. Select Treatment / Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        selectedService?.id === srv.id
                          ? 'border-amber-500 bg-amber-500/15 shadow-sm'
                          : 'border-zinc-800 bg-[#181820]/70 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-zinc-100 truncate">{srv.name}</div>
                        <div className="text-[11px] text-zinc-400">{srv.durationMinutes} mins • {srv.category}</div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="font-extrabold text-amber-400 text-xs font-mono">
                            {srv.priceDisplay || `₹${srv.price}`}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                            10% Adv: ₹{Math.round(srv.price * 0.1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Tier Variation Picker (if selected service has multiple tiers) */}
              {selectedService?.tierOptions && selectedService.tierOptions.length > 1 && (
                <div className="p-3.5 rounded-2xl bg-[#0e0e11] border border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    <span>Select Specific Option / Length / Tier for {selectedService.name}:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.tierOptions.map((tier, idx) => {
                      const isTierActive = selectedTier?.label === tier.label;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedTier(tier)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                            isTierActive
                              ? 'border-red-500 bg-red-500/20 text-white font-bold shadow-sm ring-1 ring-red-500'
                              : 'border-zinc-800 bg-[#181820] text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <span className="truncate pr-2">{tier.label}</span>
                          <div className="text-right shrink-0">
                            <div className="font-mono text-red-400 font-bold">₹{tier.price}</div>
                            <div className="text-[10px] text-emerald-400 font-mono">
                              Adv: ₹{Math.round(tier.price * 0.1)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stylist Selection */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  2. Select Master Stylist / Grooming Artist
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {stylists.map((st) => (
                    <label
                      key={st}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${
                        selectedStylist === st
                          ? 'border-red-500 bg-red-500/15 text-white font-bold'
                          : 'border-zinc-800 bg-[#181820]/70 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="stylist"
                          checked={selectedStylist === st}
                          onChange={() => setSelectedStylist(st)}
                          className="accent-red-600"
                        />
                        <span>{st}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Available
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slot Selection */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Selected summary */}
              <div className="p-3.5 rounded-2xl bg-[#0e0e11] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Selected Treatment</div>
                  <div className="font-bold text-sm text-zinc-100">
                    {selectedService?.name} {selectedTier ? `(${selectedTier.label})` : ''}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    Duration: ~{activeDuration} mins • Price: ₹{activeBasePrice}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-bold">10% Deposit</div>
                  <div className="text-sm font-bold text-red-400 font-mono">
                    ₹{advanceDeposit}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#0e0e11] border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Select Time Slot (Mohol Salon Hours: 9:00 AM - 9:00 PM)
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Real-time chair capacity</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SALON_TIME_SLOTS.map((slot) => {
                    const slotInfo = getSlotAvailability(appointments, selectedDate, slot);
                    const isSoldOut = slotInfo.status === 'SOLD_OUT';
                    const isFast = slotInfo.isFillingFast && !isSoldOut;
                    const isSelected = selectedTimeSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                          isSoldOut
                            ? 'border-zinc-800 bg-[#121216] opacity-50 cursor-not-allowed text-zinc-500'
                            : isSelected
                            ? 'border-red-500 bg-red-600/90 text-white shadow-md ring-2 ring-red-500/40'
                            : isFast
                            ? 'border-amber-500/50 bg-amber-500/10 text-zinc-200 hover:border-amber-400'
                            : 'border-zinc-800 bg-[#181820] text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold">{slot}</span>
                          {isSoldOut ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              Full
                            </span>
                          ) : isFast ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 flex items-center gap-0.5 animate-pulse">
                              <Flame className="w-2.5 h-2.5 fill-zinc-950" />
                              <span>Fast</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              Open
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                          <span className={isSelected ? 'text-white/80' : isFast ? 'text-amber-300/90' : 'text-zinc-400'}>
                            {slotInfo.urgencyText}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Slot Real-Time Note */}
                {selectedTimeSlot && (() => {
                  const activeSlotInfo = getSlotAvailability(appointments, selectedDate, selectedTimeSlot);
                  if (activeSlotInfo.isFillingFast && activeSlotInfo.status !== 'SOLD_OUT') {
                    return (
                      <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
                        <span>
                          <strong>{selectedTimeSlot} is Filling Fast!</strong> {activeSlotInfo.pendingCount > 0 ? `${activeSlotInfo.pendingCount} pending customer hold(s) active.` : 'High demand slot.'} Complete {advancePercentage}% advance deposit to lock your station.
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          )}

          {/* STEP 3: Client Details & Advance Deposit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Pooja Kadam"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0e11] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Mobile Number (For 24h Reminder) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="e.g. 8104026257"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0e11] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Email Address (Optional for Digital Pass Receipt)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0e11] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Special Notes or Allergies
                </label>
                <textarea
                  rows={2}
                  placeholder="Any hair/scalp allergies, skin sensitivity, or specific style preferences..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0e0e11] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="p-3 rounded-2xl bg-[#0e0e11] border border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Have a Promo / Coupon Code?</span>
                </div>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied (-₹{appliedCoupon.discount})</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-amber-400 hover:text-amber-300 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MODERN20, MOHOL10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#141418] border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-xs shadow-sm cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-amber-400">{couponError}</p>}
              </div>

              {/* Billing Summary Box */}
              <div className="p-4 rounded-2xl bg-[#0e0e11] border border-zinc-800 text-white space-y-2.5">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Treatment Total:</span>
                  <span className="font-mono">₹{activeBasePrice}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-sm">
                  <span>Net Service Amount:</span>
                  <span className="font-mono text-amber-400">₹{netTotal}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-bold text-amber-300">{advancePercentage}% Online Advance Deposit Payable Now</div>
                    <div className="text-[10px] text-zinc-400">Remaining {100 - advancePercentage}% (₹{balanceAtSalon}) balance payable at salon</div>
                  </div>
                  <div className="text-base font-extrabold text-amber-400 font-mono">
                    ₹{advanceDeposit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Pass (Receipt) */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-zinc-400">
                  Your slot has been secured with a 10% online advance deposit.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-[#0e0e11] border border-zinc-800 rounded-3xl p-5 text-left space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Booking Reference</div>
                    <div className="font-mono font-bold text-sm text-amber-400">
                      {confirmedBooking.bookingRef}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    DEPOSIT VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Client Name</span>
                    <strong className="text-white">{confirmedBooking.clientName}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Contact Mobile</span>
                    <strong className="text-white">{confirmedBooking.clientPhone}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Date &amp; Time</span>
                    <strong className="text-white">{confirmedBooking.date} at {confirmedBooking.timeSlot}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Stylist</span>
                    <strong className="text-white">{confirmedBooking.stylistName}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Advance Paid</span>
                    <span className="font-bold text-emerald-400">₹{confirmedBooking.advancePaid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 block text-[10px]">Balance Due at Salon</span>
                    <span className="font-bold text-white">₹{confirmedBooking.balanceDue}</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Modern Unisex Salon, B.N. Gund Complex, Near ICICI Bank, Mohol</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => resetBookingForm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book Another Appointment</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetBookingForm(null);
                    closeBookingModal();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 text-xs font-extrabold transition shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 3) */}
        {step < 4 && (
          <div className="bg-[#0e0e11] border-t border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 active:scale-95 border border-amber-400/40 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProceedToRazorpay}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition shadow-xl shadow-amber-500/25 active:scale-95 border border-amber-400/40 cursor-pointer"
              >
                <span>Pay ₹{advanceDeposit} Advance with Razorpay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Razorpay Checkout Simulation / Real Modal */}
      {showRazorpayModal && selectedService && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          onSuccess={handlePaymentSuccess}
          advanceAmount={advanceDeposit}
          totalAmount={netTotal}
          serviceName={selectedTier ? `${selectedService.name} (${selectedTier.label})` : selectedService.name}
          clientName={clientName}
          clientEmail={clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@example.com`}
          clientPhone={clientPhone}
        />
      )}
    </div>
  );
};
