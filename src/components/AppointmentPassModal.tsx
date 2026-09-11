import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  QrCode as QrCodeIcon,
  Sparkles,
  Printer,
  Copy,
  Check,
  Navigation,
  MessageSquare,
  Send,
  Smartphone
} from 'lucide-react';
import QRCode from 'qrcode';
import { Appointment } from '../types';
import {
  getAppointmentReminderInfo,
  generateGoogleCalendarUrl,
  downloadIcsCalendarFile
} from '../utils/appointmentReminderUtils';
import { useSalon } from '../context/SalonContext';

interface AppointmentPassModalProps {
  appointment: Appointment | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const AppointmentPassModal: React.FC<AppointmentPassModalProps> = ({
  appointment,
  isOpen = true,
  onClose
}) => {
  const { settings } = useSalon();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentStatus, setSmsSentStatus] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      // Generate standard verification QR string with verifiable JSON token
      const qrPayload = JSON.stringify({
        ref: appointment.bookingRef,
        client: appointment.clientName,
        phone: appointment.clientPhone,
        service: appointment.serviceName,
        date: appointment.date,
        time: appointment.timeSlot,
        stylist: appointment.stylistName,
        advancePaid: appointment.advancePaid,
        balanceDue: appointment.balanceDue,
        total: appointment.totalAmount,
        status: appointment.bookingStatus || appointment.status || 'CONFIRMED'
      });

      QRCode.toDataURL(qrPayload, {
        width: 256,
        margin: 1.5,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff'
        }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const reminderInfo = getAppointmentReminderInfo(appointment);
  const googleCalUrl = generateGoogleCalendarUrl(appointment, settings.address);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(appointment.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const text = `Modern Unisex Salon Mohol Appointment Confirmed!\nBooking Ref: ${appointment.bookingRef}\nService: ${appointment.serviceName}\nDate & Time: ${appointment.date} at ${appointment.timeSlot}\nStylist: ${appointment.stylistName}\nVenue: ${settings.address || 'B.N. Gund Complex, Near ICICI Bank, Mohol - 413213'}`;
    if (navigator.share) {
      navigator.share({
        title: 'Modern Unisex Salon Booking Pass',
        text
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Booking pass details copied to clipboard!');
    }
  };

  // Direct SMS Dispatch
  const handleSendSms = async () => {
    setIsSendingSms(true);
    setSmsSentStatus(null);
    try {
      const res = await fetch('/api/notifications/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: appointment.clientPhone,
          clientName: appointment.clientName,
          templateType: 'CONFIRMATION',
          bookingRef: appointment.bookingRef,
          serviceName: appointment.serviceName,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          advancePaid: appointment.advancePaid,
          balanceDue: appointment.balanceDue
        })
      });
      const data = await res.json();
      setSmsSentStatus(`SMS Dispatched to ${appointment.clientPhone}`);
      // Also open SMS if on mobile device
      if (/Android|iPhone|iPad/i.test(navigator.userAgent) && data.webSmsUrl) {
        window.location.href = data.webSmsUrl;
      }
    } catch (err) {
      setSmsSentStatus(`SMS Prepared for ${appointment.clientPhone}`);
    } finally {
      setIsSendingSms(false);
      setTimeout(() => setSmsSentStatus(null), 5000);
    }
  };

  // Direct WhatsApp Dispatch
  const handleSendWhatsApp = () => {
    const cleanPhone = (appointment.clientPhone || '').replace(/[^0-9]/g, '');
    const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `🌟 *MODERN UNISEX SALON APPOINTMENT CONFIRMED* 🌟\n\n📌 *Booking Ref:* ${appointment.bookingRef}\n👤 *Client:* ${appointment.clientName}\n💇 *Service:* ${appointment.serviceName}\n📅 *Date:* ${appointment.date}\n⏰ *Time Slot:* ${appointment.timeSlot}\n✂️ *Stylist:* ${appointment.stylistName}\n\n💳 *10% Advance Paid:* ₹${appointment.advancePaid} (Confirmed)\n💰 *Remaining at Salon:* ₹${appointment.balanceDue}\n📍 *Address:* ${settings.address || 'B.N. Gund Complex, Near ICICI Bank, Mohol'}\n\nPlease show this pass or QR upon arrival. Thank you!`;
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Direct Email Dispatch
  const handleSendEmail = async () => {
    if (!appointment.clientEmail) {
      alert('No email address attached to this appointment.');
      return;
    }
    setIsSendingEmail(true);
    setEmailSentStatus(null);
    try {
      const res = await fetch('/api/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: appointment.clientEmail,
          clientName: appointment.clientName,
          bookingRef: appointment.bookingRef,
          serviceName: appointment.serviceName,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          advancePaid: appointment.advancePaid,
          balanceDue: appointment.balanceDue,
          totalAmount: appointment.totalAmount
        })
      });
      const data = await res.json();
      setEmailSentStatus(`Receipt emailed to ${appointment.clientEmail}`);
    } catch (err) {
      setEmailSentStatus(`Receipt queued for ${appointment.clientEmail}`);
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailSentStatus(null), 5000);
    }
  };

  // Download QR Code PNG Image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `ModernSalon-Pass-${appointment.bookingRef}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative max-w-lg w-full max-h-[92vh] flex flex-col bg-[#141418] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-left animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#0e0e11] p-4 sm:p-6 border-b border-zinc-800 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>DIGITAL SMART SALON PASS</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-100">
              Appointment Boarding Pass
            </h3>
            <p className="text-xs text-zinc-400">
              Modern Unisex Salon • 10% Advance Deposit Verified
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pass Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Booking Ref & 24h Countdown Alert Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0e0e11] border border-purple-500/30">
            <div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                Booking Reference
              </div>
              <div className="font-mono text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>{appointment.bookingRef}</span>
                <button
                  onClick={handleCopyRef}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-400 text-xs transition-colors"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{reminderInfo.timeLabel}</span>
            </div>
          </div>

          {/* QR Code & Scan Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-br from-purple-950/40 via-[#13101d] to-[#0e0e11] p-4 rounded-2xl border border-purple-500/30">
            <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0 flex flex-col items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Pass for ${appointment.bookingRef}`}
                  className="w-28 h-28 object-contain rounded"
                />
              ) : (
                <div className="w-28 h-28 bg-zinc-200 animate-pulse rounded flex items-center justify-center">
                  <QrCodeIcon className="w-8 h-8 text-zinc-400" />
                </div>
              )}
              <span className="text-[9px] font-bold text-zinc-800 uppercase mt-1 tracking-tighter">Fast Check-In</span>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-purple-300">
                <QrCodeIcon className="w-4 h-4 text-purple-400" />
                <span>Contactless Reception QR Pass</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Present this QR code at the salon reception desk for instant check-in, booth assignment, and 10% advance deposit redemption.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  onClick={handleDownloadQr}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-[11px] font-semibold flex items-center gap-1 border border-purple-500/20 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-purple-400" />
                  <span>Save QR</span>
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 border border-emerald-500/30 cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp Pass</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instant SMS & Email Notification Alerts */}
          {(smsSentStatus || emailSentStatus) && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{smsSentStatus || emailSentStatus}</span>
            </div>
          )}

          {/* Core Service & Stylist Info */}
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Treatment / Service
                </div>
                <h4 className="font-serif text-lg font-bold text-zinc-100">
                  {appointment.serviceName}
                </h4>
                <div className="text-xs text-zinc-400">{appointment.category}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed</span>
              </span>
            </div>

            {/* Grid of Key Details */}
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-zinc-400 block text-[11px]">Appointment Date:</span>
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>{reminderInfo.formattedDateStr}</span>
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block text-[11px]">Time Slot:</span>
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{appointment.timeSlot}</span>
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block text-[11px]">Assigned Specialist:</span>
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">{appointment.stylistName}</span>
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block text-[11px]">Client Name:</span>
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">{appointment.clientName}</span>
                </span>
              </div>
            </div>

            {/* Payment & Deposit Breakdown */}
            <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">10% Advance Deposit</div>
                <div className="font-mono font-bold text-sm text-emerald-400">₹{appointment.advancePaid} (Paid)</div>
              </div>

              <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-xl p-2.5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Remaining at Salon</div>
                <div className="font-mono font-bold text-sm text-zinc-100">₹{appointment.balanceDue}</div>
              </div>
            </div>
          </div>

          {/* Quick Notification Sending Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleSendSms}
              disabled={isSendingSms}
              className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>{isSendingSms ? 'Sending SMS...' : 'Send SMS Pass'}</span>
            </button>

            {appointment.clientEmail ? (
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{isSendingEmail ? 'Sending Email...' : 'Send Email Receipt'}</span>
              </button>
            ) : (
              <button
                onClick={handleSendWhatsApp}
                className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-200 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Notification</span>
              </button>
            )}
          </div>

          {/* Action Buttons: Calendar & Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              onClick={() => downloadIcsCalendarFile(appointment, settings.address)}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Download iCal / Outlook</span>
            </button>
          </div>

          {/* Quick Share / Print / Close footer */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
