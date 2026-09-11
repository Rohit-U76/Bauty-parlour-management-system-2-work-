import { Appointment, AppointmentStatus, PaymentStatus, ServiceCategory } from '../types';

export interface SlotAvailabilityApi {
  slot: string;
  date?: string;
  totalCapacity: number;
  bookedCount: number;
  remainingSeats: number;
  occupancyPercent: number;
  status: string;
  statusLabel: string;
  soldOut: boolean;
  bookedStylistIds?: string[];
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toDateString(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (Array.isArray(value) && value.length >= 3) {
    return `${value[0]}-${pad(Number(value[1]))}-${pad(Number(value[2]))}`;
  }
  return String(value);
}

function toIsoDateTime(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = value.map(Number);
    return new Date(y, m - 1, d, hh, mm, ss).toISOString();
  }
  return String(value);
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
}

export function normalizeAppointment(raw: any): Appointment {
  const bookingStatus = String(raw.bookingStatus || raw.status || 'PENDING').toUpperCase() as AppointmentStatus;
  const paymentRaw = String(raw.paymentStatus || 'PENDING').toUpperCase();
  const paymentStatus = (paymentRaw === 'PARTIAL' ? 'PAID' : paymentRaw) as PaymentStatus;

  return {
    id: String(raw.id),
    bookingRef: raw.bookingRef || '',
    clientName: raw.clientName || '',
    clientPhone: raw.clientPhone || '',
    clientEmail: raw.clientEmail || '',
    serviceId: raw.serviceId || raw.services?.[0]?.serviceId || '',
    serviceName: raw.serviceName || raw.services?.[0]?.serviceName || '',
    category: (raw.category || 'Hair Services') as ServiceCategory,
    date: toDateString(raw.date || raw.appointmentDate),
    timeSlot: raw.timeSlot || '',
    stylistName: raw.stylistName || 'Any Available Expert',
    totalAmount: toNumber(raw.totalAmount),
    advancePaid: toNumber(raw.advancePaid),
    balanceDue: toNumber(raw.balanceDue),
    paymentStatus: paymentStatus === 'REFUNDED' || paymentStatus === 'PAID' || paymentStatus === 'PENDING'
      ? paymentStatus
      : 'PENDING',
    bookingStatus,
    status: bookingStatus,
    razorpayPaymentId: raw.razorpayPaymentId || raw.paymentId,
    razorpayOrderId: raw.razorpayOrderId,
    createdAt: toIsoDateTime(raw.createdAt),
    notes: raw.notes || '',
    isNew: bookingStatus === 'PENDING' || bookingStatus === 'CONFIRMED'
  };
}

export async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || fallback;
  } catch {
    return fallback;
  }
}
