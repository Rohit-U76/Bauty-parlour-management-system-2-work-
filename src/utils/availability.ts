import { Appointment } from '../types';

export const SALON_TIME_SLOTS = [
  '09:30 AM',
  '10:30 AM',
  '11:45 AM',
  '01:30 PM',
  '02:45 PM',
  '04:00 PM',
  '05:30 PM',
  '06:45 PM',
  '07:30 PM',
  '08:15 PM'
];

export const MAX_PARALLEL_CHAIRS = 3; // Modern Unisex Salon Mohol simultaneous capacity

export interface SlotAvailabilityInfo {
  slot: string;
  date: string;
  totalCapacity: number;
  bookedCount: number;
  pendingCount: number;
  confirmedCount: number;
  remainingSeats: number;
  occupancyPercent: number;
  status: 'AVAILABLE' | 'FILLING_FAST' | 'HIGH_DEMAND' | 'SOLD_OUT' | 'PEAK_POPULAR';
  isFillingFast: boolean;
  statusLabel: string;
  urgencyText: string;
  activeAppointments: Appointment[];
}

export interface DayAvailabilitySummary {
  date: string;
  isToday: boolean;
  isTomorrow: boolean;
  formattedDate: string;
  totalDailyCapacity: number;
  totalActiveBookings: number;
  totalPendingRequests: number;
  overallOccupancyPercent: number;
  fillingFastSlots: SlotAvailabilityInfo[];
  availableSlots: SlotAvailabilityInfo[];
  soldOutSlots: SlotAvailabilityInfo[];
  allSlots: SlotAvailabilityInfo[];
  peakPeriodAlert?: string;
  nextExpressSlot?: string;
  fastestAvailableSlot?: string;
}

/**
 * Normalized comparison for time slots (handles casing, minor whitespace, leading zeroes)
 */
export function normalizeTimeSlot(slotStr: string): string {
  if (!slotStr) return '';
  let str = String(slotStr).trim().toUpperCase();
  str = str.replace(/\s+/g, ' ');
  const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match) {
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    const period = match[3];
    return `${hh}:${mm} ${period}`;
  }
  return str;
}

/**
 * Standardized date string normalization (handles YYYY-MM-DD, ISO strings, and slash formats)
 */
export function normalizeDateStr(dateStr: string): string {
  if (!dateStr) return '';
  const str = String(dateStr).trim();
  if (!str) return '';
  const clean = str.includes('T') ? str.split('T')[0] : str;
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
      if (parts[2].length === 4) {
        const p1 = Number(parts[0]);
        const p2 = Number(parts[1]);
        const year = parts[2];
        if (p1 > 12) {
          return `${year}-${String(p2).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
        }
        if (p2 > 12) {
          return `${year}-${String(p1).padStart(2, '0')}-${String(p2).padStart(2, '0')}`;
        }
        return `${year}-${String(p2).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
      }
    }
  }
  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
      if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
  }
  return clean.slice(0, 10);
}

/**
 * Calculates slot availability and 'Filling Fast' metrics for a specific date and time slot
 */
export function getSlotAvailability(
  appointments: Appointment[],
  date: string,
  timeSlot: string,
  capacity: number = MAX_PARALLEL_CHAIRS
): SlotAvailabilityInfo {
  const normSlot = normalizeTimeSlot(timeSlot);
  const normTargetDate = normalizeDateStr(date);

  // Filter active appointments (Pending or Confirmed)
  const slotBookings = appointments.filter(apt => {
    const isSameDate = normalizeDateStr(apt.date) === normTargetDate;
    const isSameSlot = normalizeTimeSlot(apt.timeSlot) === normSlot;
    const isActive = apt.bookingStatus === 'PENDING' || apt.bookingStatus === 'CONFIRMED' || apt.status === 'PENDING' || apt.status === 'CONFIRMED';
    return isSameDate && isSameSlot && isActive;
  });

  const pendingCount = slotBookings.filter(a => a.bookingStatus === 'PENDING').length;
  const confirmedCount = slotBookings.filter(a => a.bookingStatus === 'CONFIRMED').length;
  const bookedCount = slotBookings.length;
  const remainingSeats = Math.max(0, capacity - bookedCount);
  const occupancyPercent = Math.min(100, Math.round((bookedCount / capacity) * 100));

  let status: SlotAvailabilityInfo['status'] = 'AVAILABLE';
  let isFillingFast = false;
  let statusLabel = 'Available';
  let urgencyText = `${remainingSeats} chairs open`;

  if (remainingSeats === 0) {
    status = 'SOLD_OUT';
    statusLabel = 'Sold Out';
    urgencyText = 'Fully booked';
    isFillingFast = true;
  } else if (remainingSeats === 1) {
    status = 'FILLING_FAST';
    statusLabel = 'Filling Fast';
    urgencyText = pendingCount > 0 
      ? `🔥 Only 1 seat left (${pendingCount} pending hold)`
      : '🔥 Only 1 seat remaining!';
    isFillingFast = true;
  } else if (pendingCount >= 1 && bookedCount >= 1) {
    status = 'HIGH_DEMAND';
    statusLabel = 'Filling Fast';
    urgencyText = `⚡ High Demand: ${pendingCount} pending request`;
    isFillingFast = true;
  } else if (normSlot.includes('05:30') || normSlot.includes('06:45') || normSlot.includes('07:30') || normSlot.includes('08:15')) {
    // Peak evening slot with at least 1 booking
    if (bookedCount >= 1) {
      status = 'PEAK_POPULAR';
      statusLabel = 'Peak Rush';
      urgencyText = `⚡ Evening Peak (${remainingSeats} seats left)`;
      isFillingFast = true;
    } else {
      statusLabel = 'Peak Slot Open';
      urgencyText = `${remainingSeats} seats open`;
    }
  } else {
    status = 'AVAILABLE';
    statusLabel = 'Available';
    urgencyText = `${remainingSeats} chairs open`;
  }

  return {
    slot: timeSlot,
    date,
    totalCapacity: capacity,
    bookedCount,
    pendingCount,
    confirmedCount,
    remainingSeats,
    occupancyPercent,
    status,
    isFillingFast,
    statusLabel,
    urgencyText,
    activeAppointments: slotBookings
  };
}

/**
 * Calculates a complete day summary for salon availability
 */
export function getDayAvailabilitySummary(
  appointments: Appointment[],
  date: string
): DayAvailabilitySummary {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const isToday = date === todayStr;
  const isTomorrow = date === tomorrowStr;

  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const allSlots: SlotAvailabilityInfo[] = SALON_TIME_SLOTS.map(slot =>
    getSlotAvailability(appointments, date, slot)
  );

  const fillingFastSlots = allSlots.filter(s => s.isFillingFast && s.status !== 'SOLD_OUT');
  const soldOutSlots = allSlots.filter(s => s.status === 'SOLD_OUT');
  const availableSlots = allSlots.filter(s => s.remainingSeats > 0);

  const totalDailyCapacity = SALON_TIME_SLOTS.length * MAX_PARALLEL_CHAIRS;
  const totalActiveBookings = allSlots.reduce((sum, s) => sum + s.bookedCount, 0);
  const totalPendingRequests = allSlots.reduce((sum, s) => sum + s.pendingCount, 0);
  const overallOccupancyPercent = Math.min(
    100,
    Math.round((totalActiveBookings / totalDailyCapacity) * 100)
  );

  // Peak period alert
  const eveningBooked = allSlots
    .filter(s => s.slot.includes('05:30') || s.slot.includes('06:45') || s.slot.includes('07:30') || s.slot.includes('08:15'))
    .reduce((sum, s) => sum + s.bookedCount, 0);
  
  const eveningCapacity = 4 * MAX_PARALLEL_CHAIRS;
  const eveningOccupancy = Math.round((eveningBooked / eveningCapacity) * 100);

  let peakPeriodAlert: string | undefined;
  if (eveningOccupancy >= 50) {
    peakPeriodAlert = `Evening rush (5:30 PM - 8:15 PM) is ${eveningOccupancy}% booked today. We recommend booking in advance!`;
  }

  // Next express available slot
  const nextExpressSlot = availableSlots[0]?.slot;
  const fastestAvailableSlot = availableSlots.find(s => s.remainingSeats >= 2)?.slot || nextExpressSlot;

  return {
    date,
    isToday,
    isTomorrow,
    formattedDate,
    totalDailyCapacity,
    totalActiveBookings,
    totalPendingRequests,
    overallOccupancyPercent,
    fillingFastSlots,
    availableSlots,
    soldOutSlots,
    allSlots,
    peakPeriodAlert,
    nextExpressSlot,
    fastestAvailableSlot
  };
}

/**
 * Gets real-time availability highlight for a specific service based on its duration
 */
export function getServiceAvailabilityInsight(
  appointments: Appointment[],
  durationMinutes: number,
  selectedDate?: string
): {
  fillingFastSlotCount: number;
  highlightText: string;
  recommendedSlot?: string;
  isUrgent: boolean;
} {
  const dateToUse = selectedDate || new Date().toISOString().split('T')[0];
  const summary = getDayAvailabilitySummary(appointments, dateToUse);

  const fillingFastCount = summary.fillingFastSlots.length;
  
  if (fillingFastCount > 0) {
    const topFast = summary.fillingFastSlots[0];
    return {
      fillingFastSlotCount: fillingFastCount,
      highlightText: `🔥 ${topFast.slot} Filling Fast (${topFast.urgencyText})`,
      recommendedSlot: topFast.slot,
      isUrgent: true
    };
  }

  if (summary.nextExpressSlot) {
    return {
      fillingFastSlotCount: 0,
      highlightText: `🟢 Next Available Express Chair: ${summary.nextExpressSlot}`,
      recommendedSlot: summary.nextExpressSlot,
      isUrgent: false
    };
  }

  return {
    fillingFastSlotCount: 0,
    highlightText: '🟢 Slots open across morning & afternoon',
    recommendedSlot: '11:45 AM',
    isUrgent: false
  };
}
