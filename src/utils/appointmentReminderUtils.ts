import { Appointment } from '../types';

/**
 * Parse an appointment date (YYYY-MM-DD) and time slot (e.g., "02:30 PM", "11:00 AM")
 * into a valid JavaScript Date object.
 */
export function parseAppointmentDateTime(dateStr: string, timeSlotStr?: string): Date {
  if (!dateStr) return new Date();

  let hours = 11;
  let minutes = 0;

  if (timeSlotStr) {
    const cleanTime = timeSlotStr.trim();
    const match = cleanTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const modifier = match[3] ? match[3].toUpperCase() : 'AM';
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
    }
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || isNaN(month) || isNaN(day)) {
    return new Date(dateStr);
  }

  return new Date(year, month - 1, day, hours, minutes, 0);
}

/**
 * Calculate the time difference and whether an appointment falls into the 24-hour reminder window.
 * Reference date defaults to the current mock date or real client time.
 */
export function getAppointmentReminderInfo(
  apt: Appointment,
  referenceDate: Date = new Date()
): {
  appointmentDate: Date;
  hoursUntil: number;
  isUpcoming24h: boolean;
  timeLabel: string;
  isToday: boolean;
  isTomorrow: boolean;
  formattedDateStr: string;
} {
  const appointmentDate = parseAppointmentDateTime(apt.date, apt.timeSlot);
  const diffMs = appointmentDate.getTime() - referenceDate.getTime();
  const hoursUntil = diffMs / (1000 * 60 * 60);

  // Check if date is today or tomorrow relative to referenceDate
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const refDay = referenceDate.getDate();

  const aptYear = appointmentDate.getFullYear();
  const aptMonth = appointmentDate.getMonth();
  const aptDay = appointmentDate.getDate();

  const isToday = refYear === aptYear && refMonth === aptMonth && refDay === aptDay;
  
  const tomorrow = new Date(refYear, refMonth, refDay + 1);
  const isTomorrow =
    tomorrow.getFullYear() === aptYear &&
    tomorrow.getMonth() === aptMonth &&
    tomorrow.getDate() === aptDay;

  // An appointment is eligible for the 24-hour reminder if:
  // 1. Status is confirmed or pending (not cancelled or completed)
  // 2. Either falls between 0 and 36 hours from now, or is scheduled for tomorrow/today
  const isNotDone = apt.bookingStatus !== 'CANCELLED' && apt.bookingStatus !== 'COMPLETED';
  const isUpcoming24h = isNotDone && (
    (hoursUntil >= -2 && hoursUntil <= 36) ||
    isTomorrow ||
    (isToday && hoursUntil >= -1)
  );

  let timeLabel = '';
  if (hoursUntil < 0 && hoursUntil >= -2) {
    timeLabel = 'Starting shortly';
  } else if (hoursUntil <= 1) {
    timeLabel = 'In less than 1 hour';
  } else if (hoursUntil <= 24) {
    timeLabel = `In ~${Math.round(hoursUntil)} hours (${isTomorrow ? 'Tomorrow' : 'Today'})`;
  } else if (hoursUntil <= 48 || isTomorrow) {
    timeLabel = `Tomorrow (${Math.round(hoursUntil)} hrs away)`;
  } else {
    timeLabel = `In ${Math.ceil(hoursUntil / 24)} days`;
  }

  // Format date nicely (e.g. "Sat, 15 Aug 2026")
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  const formattedDateStr = appointmentDate.toLocaleDateString('en-US', options);

  return {
    appointmentDate,
    hoursUntil,
    isUpcoming24h,
    timeLabel,
    isToday,
    isTomorrow,
    formattedDateStr
  };
}

/**
 * Generate Google Calendar URL for an appointment
 */
export function generateGoogleCalendarUrl(apt: Appointment, salonAddress = 'Smart Salon & Spa, MG Road, Indiranagar, Bengaluru'): string {
  const start = parseAppointmentDateTime(apt.date, apt.timeSlot);
  // Default duration 60 mins
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const formatIsoUtc = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const title = encodeURIComponent(`Salon Appointment: ${apt.serviceName} with ${apt.stylistName}`);
  const details = encodeURIComponent(
    `Your appointment at Smart Salon is confirmed.\n\nBooking ID: ${apt.bookingRef}\nService: ${apt.serviceName}\nStylist: ${apt.stylistName}\nPayment: 10% Advance Paid (₹${apt.advancePaid}), Balance Due: ₹${apt.balanceDue}\nVenue: ${salonAddress}\n\nPlease arrive 10 minutes prior.`
  );
  const location = encodeURIComponent(salonAddress);
  const dates = `${formatIsoUtc(start)}/${formatIsoUtc(end)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Download .ICS file for Apple / Outlook / Mobile calendars
 */
export function downloadIcsCalendarFile(apt: Appointment, salonAddress = 'Smart Salon & Spa, MG Road, Indiranagar, Bengaluru') {
  const start = parseAppointmentDateTime(apt.date, apt.timeSlot);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Salon AI//Appointment Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${apt.bookingRef}-${apt.id}@smartsalon.ai`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:Smart Salon: ${apt.serviceName} (${apt.stylistName})`,
    `DESCRIPTION:Appointment Ref: ${apt.bookingRef}\\nService: ${apt.serviceName}\\nStylist: ${apt.stylistName}\\nBalance Due at Salon: Rs.${apt.balanceDue}`,
    `LOCATION:${salonAddress}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Salon Appointment in 24 Hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Salon_Appointment_${apt.bookingRef}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Play a soothing luxury sound chime when notification appears
 */
export function playLuxuryNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First tone (G5 - 783.99 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second harmonic tone (B5 - 987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.8);
  } catch (e) {
    // Audio context may be restricted by browser until user gesture
  }
}
