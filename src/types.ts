export type GenderTarget = 'women' | 'men' | 'unisex';

export type ServiceCategory = 
  | 'Make Up'
  | 'Skin Services'
  | 'Hair Services'
  | 'Color Services'
  | 'Hair Chemical Services'
  | 'Hair Care & Styling'
  | 'Skin & Facial Therapy'
  | 'Bridal & Pre-Bridal'
  | "Men's Executive Grooming"
  | 'Nail Art & Extensions'
  | 'Spa & Body Treatments';

export interface PriceTierVariant {
  label: string;
  price: number;
  durationMinutes?: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  gender: GenderTarget;
  durationMinutes: number;
  price: number;
  priceDisplay?: string; // e.g. "₹2,000 / ₹2,500" or "₹150 / ₹300 / ₹600"
  tierOptions?: PriceTierVariant[];
  advanceDeposit: number; // 10% of base price
  description: string;
  imageUrl: string;
  popular?: boolean;
  rating: number;
  reviewsCount: number;
  benefits: string[];
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED';

export interface Appointment {
  id: string;
  bookingRef: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  stylistName: string;
  totalAmount: number;
  advancePaid: number; // 10% deposit
  balanceDue: number; // 90% remaining
  paymentStatus: PaymentStatus;
  bookingStatus: AppointmentStatus;
  status?: AppointmentStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  notes?: string;
  isNew?: boolean;
}

export type InquiryStatus = 'NEW' | 'IN PROGRESS' | 'RESOLVED';

export interface ContactInquiry {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  subject: string;
  serviceCategory?: string;
  message: string;
  status: InquiryStatus;
  receivedDate: string;
  ownerReply?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  favoriteService: string;
  memberSince: string;
  tier: 'Standard' | 'VIP Member' | 'New Client';
}

export interface Review {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  rating: number; // 1-5 overall
  serviceName: string;
  category?: string;
  comment: string;
  date: string;
  verifiedBooking: boolean;
  avatarUrl?: string;
  bookingRef?: string;
  stylistName?: string;
  // Detailed Satisfaction Aspect Sub-ratings (1-5)
  hygieneRating?: number;
  stylistSkillRating?: number;
  punctualityRating?: number;
  valueRating?: number;
  recommend?: boolean;
  npsScore?: number; // 0-10
  tags?: string[];
  ownerReply?: string;
  ownerReplyDate?: string;
  featured?: boolean;
  sentiment?: 'positive' | 'neutral' | 'critical';
  status?: 'published' | 'under_review' | 'resolved';
}

export interface OfferCoupon {
  id: string;
  code: string;
  title: string;
  discountPercent?: number;
  discountAmount?: number;
  minBookingAmount: number;
  validTill: string;
  description: string;
  active: boolean;
}

export type OfferItem = OfferCoupon;

export type GalleryCategory = 
  | 'All'
  | 'Bridal'
  | 'Hair Care'
  | 'Skin Care'
  | 'Salon Interior'
  | 'Nail Art'
  | 'Spa'
  | 'Men Grooming';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  tag: string;
  imageUrl: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'inquiry' | 'payment' | 'system' | 'review';
  timestamp: string;
  read: boolean;
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  advancePercentage: number; // default 10
  currencySymbol: string;
  razorpayKeyId: string;
  bookingAutoConfirm: boolean;
  instagramUrl?: string;
  mapsUrl?: string;
  gstNumber?: string;
  staffType?: string;
  upiId?: string;
  phonePeNumber?: string;
  payeeName?: string;
}

export interface SalonPolicyItem {
  id: string;
  iconName: string;
  title: string;
  summary: string;
  points: string[];
}

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  pin?: string;
  avatarUrl?: string;
  memberTier?: 'Standard' | 'VIP Member' | 'New Client';
  loyaltyPoints?: number;
  totalVisits?: number;
  memberSince?: string;
  preferredServices?: string[];
}

export type ThemeMode = 'dark' | 'light';
