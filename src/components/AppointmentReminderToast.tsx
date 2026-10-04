import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  User,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  Eye,
  AlertCircle,
  Play,
  RotateCcw,
  Compass
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Appointment } from '../types';
import {
  getAppointmentReminderInfo,
  generateGoogleCalendarUrl,
  playLuxuryNotificationChime
} from '../utils/appointmentReminderUtils';
import { AppointmentPassModal } from './AppointmentPassModal';

export const AppointmentReminderToast: React.FC = () => {
  const { appointments, settings } = useSalon();

  // State
  const [activeToastIndex, setActiveToastIndex] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedPassAppointment, setSelectedPassAppointment] = useState<Appointment | null>(null);
  const [manualTriggerAppointmentId, setManualTriggerAppointmentId] = useState<string | null>(null);
  const [hasPlayedChime, setHasPlayedChime] = useState<boolean>(false);

  // Find all upcoming appointments within 24 hours (or tomorrow/today)
  const upcomingReminders = useMemo(() => {
    return appointments.filter(apt => {
      if (manualTriggerAppointmentId && apt.id === manualTriggerAppointmentId) {
        return true;
      }
      const info = getAppointmentReminderInfo(apt);
      return info.isUpcoming24h;
    });
  }, [appointments, manualTriggerAppointmentId]);

  // Active appointment to show in the toast
  const activeAppointment: Appointment | undefined =
    upcomingReminders[activeToastIndex] || upcomingReminders[0];

  const reminderInfo = useMemo(() => {
    if (!activeAppointment) return null;
    return getAppointmentReminderInfo(activeAppointment);
  }, [activeAppointment]);

  // Check snooze state
  const isSnoozed = snoozeUntil !== null && Date.now() < snoozeUntil;

  // Sound chime effect when reminder triggers
  useEffect(() => {
    if (upcomingReminders.length > 0 && !isDismissed && !isSnoozed && soundEnabled && !hasPlayedChime) {
      // Gentle chime on load / trigger
      const timer = setTimeout(() => {
        playLuxuryNotificationChime();
        setHasPlayedChime(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [upcomingReminders.length, isDismissed, isSnoozed, soundEnabled, hasPlayedChime]);

  // Reset dismissed state if manual trigger is clicked
  const handleTestReminder = (aptId?: string) => {
    setIsDismissed(false);
    setSnoozeUntil(null);
    setIsCollapsed(false);
    if (aptId) {
      setManualTriggerAppointmentId(aptId);
      const idx = appointments.findIndex(a => a.id === aptId);
      if (idx !== -1) setActiveToastIndex(0);
    } else if (appointments.length > 0) {
      // Pick first appointment
      setManualTriggerAppointmentId(appointments[0].id);
      setActiveToastIndex(0);
    }
    if (soundEnabled) {
      playLuxuryNotificationChime();
    }
  };

  const handleSnooze = (minutes = 60) => {
    const expireTime = Date.now() + minutes * 60 * 1000;
    setSnoozeUntil(expireTime);
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (upcomingReminders.length === 0 || !activeAppointment || !reminderInfo) {
    return (
      <>
        {/* Floating Mini Simulator Trigger for Demo / Evaluation */}
        <div className="fixed bottom-4 left-4 z-40">
          <button
            id="simulate-24h-reminder-btn"
            onClick={() => handleTestReminder()}
            className="px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-yellow-400 border border-yellow-500/40 text-[11px] font-bold flex items-center gap-2 shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
            title="Test 24-hour in-app appointment reminder notification"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <Bell className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>Test 24-Hr Reminder Alert</span>
          </button>
        </div>

        {/* Appointment Pass Modal */}
        <AppointmentPassModal
          appointment={selectedPassAppointment}
          isOpen={!!selectedPassAppointment}
          onClose={() => setSelectedPassAppointment(null)}
        />
      </>
    );
  }

  // If user dismissed or snoozed, render the subtle floating reminder badge / icon on the LEFT side (away from AI assistant)
  if (isDismissed || isSnoozed) {
    return (
      <>
        <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            id="restore-appointment-reminder-btn"
            onClick={() => {
              setIsDismissed(false);
              setSnoozeUntil(null);
              setIsCollapsed(false);
            }}
            className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-2xl border border-purple-300 dark:border-yellow-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="View Upcoming Appointment Reminder"
          >
            <div className="relative">
              <Bell className="w-4 h-4 text-white dark:text-zinc-950 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600" />
            </div>
            <span>Upcoming Appointment ({upcomingReminders.length})</span>
          </button>
        </div>

        <AppointmentPassModal
          appointment={selectedPassAppointment}
          isOpen={!!selectedPassAppointment}
          onClose={() => setSelectedPassAppointment(null)}
        />
      </>
    );
  }

  const googleCalUrl = generateGoogleCalendarUrl(activeAppointment, settings.address);

  return (
    <>
      {/* IN-APP 24-HOUR TOAST NOTIFICATION CONTAINER (Positioned Top-Left away from AI Assistant Bar) */}
      <div
        id="appointment-reminder-toast"
        className="fixed top-20 sm:top-24 left-3 sm:left-6 z-40 max-w-[400px] w-[calc(100vw-24px)] sm:w-full transition-all duration-300"
      >
        {isCollapsed ? (
          /* COLLAPSED COMPACT PILL */
          <div className="bg-white/95 dark:bg-[#141419]/95 backdrop-blur-md border-2 border-purple-400 dark:border-amber-500/50 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 text-left animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-amber-500/20 border border-purple-300 dark:border-amber-500/40 flex items-center justify-center text-purple-700 dark:text-amber-400 shrink-0">
                <Bell className="w-4 h-4 animate-pulse" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-zinc-900 dark:text-amber-400 truncate">
                  {activeAppointment.serviceName}
                </div>
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
                  {reminderInfo.timeLabel} • {activeAppointment.timeSlot}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsCollapsed(false)}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950 text-[11px] font-extrabold shadow-sm transition"
              >
                Expand
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* FULL LUXURY 24-HOUR REMINDER TOAST CARD */
          <div className="relative rounded-3xl bg-white/95 dark:bg-[#121217]/95 backdrop-blur-xl border-2 border-purple-400 dark:border-amber-500/50 shadow-2xl shadow-purple-500/10 dark:shadow-amber-500/10 overflow-hidden text-left animate-in slide-in-from-top-4 duration-300">
            
            {/* Top Glowing Ambient Accents */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Badge & Window Controls */}
            <div className="p-4 sm:p-5 pb-3 border-b border-zinc-200 dark:border-zinc-800/80 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-2xl bg-purple-100 dark:bg-amber-500/20 border border-purple-300 dark:border-amber-500/50 flex items-center justify-center text-purple-700 dark:text-amber-400 shadow-sm shrink-0">
                  <Bell className="w-4 h-4 animate-swing" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 dark:bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600 dark:bg-amber-500"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-amber-400 bg-purple-50 dark:bg-amber-500/10 border border-purple-200 dark:border-amber-500/30 px-2 py-0.5 rounded-full">
                      ⏰ 24-Hour Salon Reminder
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    Upcoming Appointment Tomorrow
                  </h4>
                </div>
              </div>

              {/* Top Controls: Sound, Collapse, Dismiss */}
              <div className="flex items-center gap-1 shrink-0 text-zinc-500 dark:text-zinc-400">
                <button
                  onClick={() => {
                    if (!soundEnabled) playLuxuryNotificationChime();
                    setSoundEnabled(!soundEnabled);
                  }}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-purple-600 dark:hover:text-amber-400 transition-colors"
                  title={soundEnabled ? 'Mute notification sound' : 'Unmute sound'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />}
                </button>

                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-xs font-mono"
                  title="Collapse to minimal pill"
                >
                  —
                </button>

                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-500 transition-colors"
                  title="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="p-4 sm:p-5 space-y-3.5 text-xs">
              {/* Client Greeting & Service Info */}
              <div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Dear <strong className="text-purple-700 dark:text-yellow-400 font-semibold">{activeAppointment.clientName}</strong>, this is a friendly reminder that your salon session is scheduled in <strong className="text-purple-900 dark:text-yellow-300 font-bold">{reminderInfo.timeLabel}</strong>.
                </p>
              </div>

              {/* Service & Time Breakdown Card */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-start justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-2">
                  <div>
                    <div className="font-serif text-sm font-bold text-zinc-900 dark:text-yellow-400">
                      {activeAppointment.serviceName}
                    </div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-purple-600 dark:text-yellow-500" />
                      <span>{activeAppointment.stylistName}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                    10% Adv Paid
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-yellow-400 shrink-0" />
                    <span className="font-medium">{reminderInfo.formattedDateStr}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400 shrink-0" />
                    <span className="font-medium">{activeAppointment.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">Balance Due at Studio:</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs">₹{activeAppointment.balanceDue}</span>
                </div>
              </div>

              {/* Multi-appointment pagination if > 1 upcoming */}
              {upcomingReminders.length > 1 && (
                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                  <span>Appointment {activeToastIndex + 1} of {upcomingReminders.length}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveToastIndex(prev => (prev - 1 + upcomingReminders.length) % upcomingReminders.length)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setActiveToastIndex(prev => (prev + 1) % upcomingReminders.length)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Primary & Secondary Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedPassAppointment(activeAppointment)}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 dark:shadow-yellow-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Pass &amp; QR</span>
                  </button>

                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-yellow-400" />
                    <span>Add to Cal</span>
                  </a>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                  <button
                    onClick={() => handleSnooze(60)}
                    className="hover:text-purple-700 dark:hover:text-yellow-400 font-medium transition-colors cursor-pointer"
                  >
                    Snooze (1 hour)
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Dismiss reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Pass Lightbox Modal */}
      <AppointmentPassModal
        appointment={selectedPassAppointment}
        isOpen={!!selectedPassAppointment}
        onClose={() => setSelectedPassAppointment(null)}
      />
    </>
  );
};
