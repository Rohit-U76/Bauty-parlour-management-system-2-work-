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
 * Normalized comparison for time slots (handles casing & minor whitespace)
 */
export function normalizeTimeSlot(slotStr: string): string {
  if (!slotStr) return '';
  return slotStr.trim().toUpperCase();
}

/**
 * Parse time string like "07:30 PM" into total minutes from midnight (0 - 1439)
 */
export function parseSlotTimeToMinutes(slotStr: string): number {
  if (!slotStr) return 0;
  const match = slotStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Validates slot availability based on date and salon time constraints.
 * Specific rule: If current time is 7:00 PM (19:00 = 1140 mins) or later on today's date,
 * only show/allow appointments after 7:00 PM (e.g. 07:30 PM, 08:15 PM).
 */
export function isSlotAvailableForDate(slotStr: string, dateStr: string): boolean {
  if (!slotStr || !dateStr) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  if (dateStr < todayStr) return false;
  if (dateStr > todayStr) return true; // Future dates are fully bookable

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = parseSlotTimeToMinutes(slotStr);
  const SEVEN_PM_MINUTES = 19 * 60; // 19:00 = 1140 minutes

  // If current time is 7:00 PM or later, only allow slots strictly after 7:00 PM
  if (currentMinutes >= SEVEN_PM_MINUTES) {
    return slotMinutes > SEVEN_PM_MINUTES && slotMinutes > currentMinutes;
  }

  // Otherwise, only allow slots that are still in the future today
  return slotMinutes > currentMinutes;
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
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = date === todayStr;

  // Filter active appointments (Pending or Confirmed)
  const slotBookings = appointments.filter(apt => {
    const isSameDate = apt.date === date;
    const isSameSlot = normalizeTimeSlot(apt.timeSlot) === normSlot;
    const isActive = apt.bookingStatus === 'PENDING' || apt.bookingStatus === 'CONFIRMED' || apt.status === 'CONFIRMED';
    return isSameDate && isSameSlot && isActive;
  });

  const pendingCount = slotBookings.filter(a => a.bookingStatus === 'PENDING').length;
  const confirmedCount = slotBookings.filter(a => a.bookingStatus === 'CONFIRMED' || a.status === 'CONFIRMED').length;
  const bookedCount = slotBookings.length;
  let remainingSeats = Math.max(0, capacity - bookedCount);
  const occupancyPercent = Math.min(100, Math.round((bookedCount / capacity) * 100));

  // Check 7:00 PM constraint & current time for today
  const slotTimeAllowed = isSlotAvailableForDate(timeSlot, date);

  let status: SlotAvailabilityInfo['status'] = 'AVAILABLE';
  let isFillingFast = false;
  let statusLabel = 'Available';
  let urgencyText = `${remainingSeats} chairs open`;

  if (!slotTimeAllowed && isToday) {
    status = 'SOLD_OUT';
    statusLabel = 'Time Closed';
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    urgencyText = currentMinutes >= 19 * 60 ? 'Past 7:00 PM' : 'Slot time passed';
    remainingSeats = 0;
  } else if (remainingSeats === 0) {
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
