import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Search,
  Camera,
  Check,
  User,
  Calendar,
  Clock,
  Scissors,
  DollarSign,
  ShieldCheck,
  Smartphone,
  Printer,
  Sparkles,
  RefreshCw,
  CreditCard,
  Volume2
} from 'lucide-react';
import QRCode from 'qrcode';
import { useSalon } from '../context/SalonContext';
import { Appointment } from '../types';

interface ReceptionistQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAppointment?: (appointment: Appointment) => void;
}

export const ReceptionistQrScannerModal: React.FC<ReceptionistQrScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectAppointment
}) => {
  const { appointments, updateAppointmentStatus } = useSalon();
  const [searchInput, setSearchInput] = useState('');
  const [scannedAppointment, setScannedAppointment] = useState<Appointment | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);
  const [generatedUpiQr, setGeneratedUpiQr] = useState<string>('');
  const [customCollectAmount, setCustomCollectAmount] = useState<number>(0);
  const [showUpiModal, setShowUpiModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanningActive(true);
      setScanStatusMessage(null);
      setScannedAppointment(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const playSuccessBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // Audio context might be restricted
    }
  };

  const handleVerifyCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;

    // Try parsing as JSON if from raw QR payload
    let targetRef = clean;
    try {
      const parsed = JSON.parse(code);
      if (parsed.ref) targetRef = parsed.ref.toUpperCase();
    } catch (e) {
      // Plain text reference code
    }

    const found = appointments.find(
      a => a.bookingRef.toUpperCase() === targetRef ||
           a.id.toUpperCase() === targetRef ||
           a.clientPhone.includes(clean)
    );

    if (found) {
      setScannedAppointment(found);
      setCustomCollectAmount(found.balanceDue || 0);
      setScanStatusMessage(`Appointment Verified: ${found.clientName}`);
      playSuccessBeep();
    } else {
      setScanStatusMessage('No matching booking found for code: ' + clean);
    }
  };

  const handleCheckIn = (app: Appointment) => {
    updateAppointmentStatus(app.id, 'CONFIRMED');
    setScanStatusMessage(`Client ${app.clientName} Checked In Successfully!`);
    playSuccessBeep();
  };

  const handleMarkCompleted = (app: Appointment) => {
    updateAppointmentStatus(app.id, 'COMPLETED');
    setScanStatusMessage(`Service Completed & Settled for ${app.clientName}!`);
  };

  const generateCounterUpi = async (amount: number, ref: string) => {
    try {
      const vpa = 'modernunisexsalon@icici';
      const name = 'Modern Unisex Salon Mohol';
      const upiString = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Counter Settlement ${ref}`)}`;
      const dataUrl = await QRCode.toDataURL(upiString, { width: 260, margin: 1 });
      setGeneratedUpiQr(dataUrl);
      setShowUpiModal(true);
    } catch (e) {
      console.error('Error generating UPI QR:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-[#141418] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-6 text-left animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#0e0e11] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-100">
                  Receptionist QR Scanner &amp; Check-In Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  Contactless
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Scan client digital boarding pass to verify 10% advance deposit and settle balance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Scanner Simulation & Manual Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            
            {/* Left Box: Visual Camera Scanner Box */}
            <div className="relative bg-[#0c0c0e] rounded-2xl border border-purple-500/30 p-5 flex flex-col items-center justify-center text-center overflow-hidden min-h-[220px]">
              {/* Laser line animation */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-lg shadow-purple-500/50 animate-pulse" />
              
              {/* Viewfinder corners */}
              <div className="relative w-44 h-44 border-2 border-purple-500/40 rounded-2xl flex flex-col items-center justify-center p-3 bg-purple-950/10">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

                <Camera className="w-8 h-8 text-purple-400 mb-2 animate-bounce" />
                <span className="text-[11px] font-bold text-zinc-300">Point Camera at Pass</span>
                <span className="text-[9px] text-zinc-500 mt-1">or select quick booking below</span>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-purple-300">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Audio Verification Beep Armed</span>
              </div>
            </div>

            {/* Right Box: Code Input & Recent Appointments to Pick */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Enter Booking Ref or Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleVerifyCode(searchInput)}
                      placeholder="e.g. SS-2026-618293 or 98221..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500 uppercase font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleVerifyCode(searchInput)}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* Fast Pick List of Recent Appointments */}
              <div>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Simulate QR Scan (Tap any booking):
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {appointments.slice(0, 4).map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleVerifyCode(app.bookingRef)}
                      className="w-full p-2 rounded-xl bg-zinc-900/90 hover:bg-purple-950/40 border border-zinc-800 hover:border-purple-500/40 flex items-center justify-between text-left text-xs transition cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-zinc-200 block">{app.clientName}</span>
                        <span className="text-[10px] font-mono text-purple-400">{app.bookingRef} • {app.serviceName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">10% Paid: ₹{app.advancePaid}</span>
                        <span className="text-[10px] text-zinc-400">Due: ₹{app.balanceDue}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status Message Notification */}
          {scanStatusMessage && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{scanStatusMessage}</span>
            </div>
          )}

          {/* Verified Appointment Details Card */}
          {scannedAppointment && (
            <div className="bg-[#0e0e11] border border-purple-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {scannedAppointment.bookingRef}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      10% Advance Deposit Verified
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-zinc-100 mt-1">
                    {scannedAppointment.clientName}
                  </h4>
                  <div className="text-xs text-zinc-400 flex items-center gap-3 mt-0.5">
                    <span>{scannedAppointment.clientPhone}</span>
                    <span>•</span>
                    <span>{scannedAppointment.clientEmail || 'No email provided'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCheckIn(scannedAppointment)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Check In Client</span>
                  </button>
                  <button
                    onClick={() => handleMarkCompleted(scannedAppointment)}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
                  >
                    Mark Done
                  </button>
                </div>
              </div>

              {/* Service & Financials Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Service</span>
                  <span className="font-bold text-zinc-200 truncate block mt-0.5">{scannedAppointment.serviceName}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Specialist</span>
                  <span className="font-bold text-zinc-200 truncate block mt-0.5">{scannedAppointment.stylistName}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">10% Paid Online</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5">₹{scannedAppointment.advancePaid}</span>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <span className="text-purple-300 block text-[10px] uppercase font-bold">Balance to Collect</span>
                  <span className="font-mono font-bold text-purple-300 text-sm mt-0.5">₹{scannedAppointment.balanceDue}</span>
                </div>
              </div>

              {/* Fast Payment Collection: Dynamic UPI QR Trigger */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-zinc-200">
                      Collect Balance at Counter (₹{scannedAppointment.balanceDue})
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Generate dynamic QR code for GPay, PhonePe, Paytm, or BHIM
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => generateCounterUpi(scannedAppointment.balanceDue, scannedAppointment.bookingRef)}
                  className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>Show Dynamic UPI QR</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic UPI Payment Modal Sub-view */}
          {showUpiModal && generatedUpiQr && (
            <div className="p-5 rounded-2xl bg-[#0c0c0e] border border-purple-500/40 text-center space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Contactless UPI Payment Counter
                </span>
                <button
                  onClick={() => setShowUpiModal(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center my-2">
                <div className="bg-white p-3 rounded-2xl shadow-xl">
                  <img src={generatedUpiQr} alt="UPI Payment QR" className="w-40 h-40" />
                </div>
              </div>

              <div className="text-sm font-bold text-zinc-100">
                Amount to Collect: <span className="font-mono text-purple-400">₹{customCollectAmount}</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) • Direct bank settlement to Modern Unisex Salon ICICI Account
              </p>

              <button
                onClick={() => {
                  setShowUpiModal(false);
                  if (scannedAppointment) handleMarkCompleted(scannedAppointment);
                }}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Confirm Payment Received (₹{customCollectAmount})
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
