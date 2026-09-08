import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ServiceItem,
  Appointment,
  ContactInquiry,
  Customer,
  Review,
  OfferCoupon,
  GalleryItem,
  NotificationItem,
  SalonSettings,
  SalonPolicyItem,
  AppointmentStatus,
  InquiryStatus,
  ThemeMode,
  User,
  UserRole
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_APPOINTMENTS,
  INITIAL_INQUIRIES,
  INITIAL_CUSTOMERS,
  INITIAL_GALLERY,
  INITIAL_OFFERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  SALON_TERMS_AND_POLICIES
} from '../data/initialData';

interface BookingPayload {
  serviceId: string;
  serviceName: string;
  category: any;
  date: string;
  timeSlot: string;
  stylistName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
  couponCode?: string;
  totalAmount: number;
  advanceAmount: number;
  balanceDue: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
}

interface SalonContextType {
  // State
  services: ServiceItem[];
  appointments: Appointment[];
  inquiries: ContactInquiry[];
  customers: Customer[];
  gallery: GalleryItem[];
  offers: OfferCoupon[];
  reviews: Review[];
  policies: SalonPolicyItem[];
  notifications: NotificationItem[];
  settings: SalonSettings;
  theme: ThemeMode;
  isAdminMode: boolean;
  activeNavTab: string; // for customer page navigation or admin subpage
  adminTab: string; // for admin suite sidebar tab
  selectedServiceForBooking: ServiceItem | null;
  isBookingModalOpen: boolean;
  isQuizModalOpen: boolean;
  isAiChatOpen: boolean;

  // Auth State
  currentUser: User | null;
  users: User[];
  isGuestMode: boolean;
  setIsGuestMode: (val: boolean) => void;
  isAuthModalOpen: boolean;
  authModalInitialTab: 'customer' | 'admin';
  authModalMode: 'login' | 'register';

  // Actions
  login: (usernameOrEmailOrPhone: string, passwordOrPin: string, role?: UserRole) => Promise<{ success: boolean; message: string; user?: User }>;
  registerCustomer: (data: { name: string; username?: string; email: string; phone: string; password?: string; preferredServices?: string[] }) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  openAuthModal: (initialTab?: 'customer' | 'admin', mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  setIsAdminMode: (val: boolean) => void;
  setActiveNavTab: (tab: string) => void;
  setAdminTab: (tab: string) => void;
  openBookingModal: (service?: ServiceItem) => void;
  closeBookingModal: () => void;
  openQuizModal: () => void;
  closeQuizModal: () => void;
  toggleAiChat: () => void;
  closeAiChat: () => void;

  // Booking & Razorpay
  createAppointment: (payload: BookingPayload) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;

  // Service Management
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Inquiry Management
  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'receivedDate' | 'status'>) => void;
  addContactInquiry: (inquiry: { name?: string; clientName?: string; phone: string; email: string; message: string; subject?: string; serviceCategory?: string }) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus, ownerReply?: string) => void;
  deleteInquiry: (id: string) => void;
  sendInquiryEmailReply: (id: string, replyText: string) => Promise<{ success: boolean; message: string; mailtoUrl: string }>;

  // Gallery Management
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // Offers Management
  addOffer: (offer: Omit<OfferCoupon, 'id'>) => void;
  toggleOfferActive: (id: string) => void;
  deleteOffer: (id: string) => void;

  // Reviews Management
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  // Policies Management
  addPolicy: (policy: Omit<SalonPolicyItem, 'id'>) => void;
  updatePolicy: (id: string, policy: Partial<SalonPolicyItem>) => void;
  deletePolicy: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Settings
  updateSettings: (newSettings: Partial<SalonSettings>) => void;

  // Stats Calculations
  totalRevenue: number;
  totalBookingsCount: number;
  confirmedBookingsCount: number;
  activeCustomersCount: number;
  pendingInquiriesCount: number;
  advanceDepositTotal: number;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'modern_salon_data_v2';

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try loading from localStorage or fallback to initial constants
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inquiries`);
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_gallery`);
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [offers, setOffers] = useState<OfferCoupon[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_offers`);
    if (!saved) return INITIAL_OFFERS;
    try {
      const parsed: OfferCoupon[] = JSON.parse(saved);
      const existingCodes = new Set(parsed.map(o => o.code));
      const missing = INITIAL_OFFERS.filter(o => !existingCodes.has(o.code));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_OFFERS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [policies, setPolicies] = useState<SalonPolicyItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_policies`);
    return saved ? JSON.parse(saved) : SALON_TERMS_AND_POLICIES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<SalonSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const map = new Map<string, User>();
        // First put INITIAL_USERS
        INITIAL_USERS.forEach(u => map.set(u.id, u));
        // Then overwrite with user edits / custom registrations
        parsed.forEach(u => map.set(u.id, { ...map.get(u.id), ...u }));
        return Array.from(map.values());
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
    return saved === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'customer' | 'admin'>('customer');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme`) as ThemeMode;
    return saved === 'light' ? 'light' : 'dark';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, mode);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // UI state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  // Sync with Backend Database API on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
          if (data.settings.advancePercentage) {
            const pct = Number(data.settings.advancePercentage);
            setServices(prev => prev.map(s => ({
              ...s,
              advanceDeposit: Math.round((s.price * pct) / 100)
            })));
          }
        }
      })
      .catch(() => {});

    fetch('/api/inquiries')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.inquiries) && data.inquiries.length > 0) {
          setInquiries(data.inquiries);
        }
      })
      .catch(() => {});

    fetch('/api/auth/users')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
        }
      })
      .catch(() => {});
  }, []);

  // Check URL parameters for direct promo QR links (e.g. ?service=... or ?book=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      const bookParam = params.get('book');
      const navParam = params.get('tab') || params.get('page');

      if (navParam && ['home', 'services', 'gallery', 'offers', 'reviews', 'terms', 'about', 'contact'].includes(navParam)) {
        setActiveNavTab(navParam);
      }

      if (serviceParam) {
        const found = services.find(
          s => s.id.toLowerCase() === serviceParam.toLowerCase() || 
               s.name.toLowerCase().includes(serviceParam.toLowerCase())
        );
        if (found) {
          setSelectedServiceForBooking(found);
          setIsBookingModalOpen(true);
        } else {
          setIsBookingModalOpen(true);
        }
      } else if (bookParam === 'true') {
        setIsBookingModalOpen(true);
      }
    } catch {
      // Ignore URL parsing errors in SSR/sandboxed iframe
    }
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inquiries`, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_gallery`, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_offers`, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_policies`, JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isGuestMode) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_guest_mode`, 'true');
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
    }
  }, [isGuestMode]);

  // Auth helper methods
  const openAuthModal = (initialTab: 'customer' | 'admin' = 'customer', mode: 'login' | 'register' = 'login') => {
    setAuthModalInitialTab(initialTab);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (
    usernameOrEmailOrPhone: string,
    passwordOrPin: string,
    expectedRole?: UserRole
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const rawInput = (usernameOrEmailOrPhone || '').trim();
    const cleanInput = rawInput.toLowerCase();
    const cleanDigits = rawInput.replace(/\D/g, '');
    const cleanSecret = (passwordOrPin || '').trim();

    if (!rawInput || !cleanSecret) {
      return {
        success: false,
        message: 'Please enter your Username, Email, or Mobile, along with your Password/PIN.'
      };
    }

    // First try backend database API
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: rawInput,
          password: cleanSecret,
          role: expectedRole
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsGuestMode(false);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(data.user));
        if (data.user.role === 'ADMIN') {
          setIsAdminMode(true);
        }
        setIsAuthModalOpen(false);
        return {
          success: true,
          message: data.message || `Welcome back, ${data.user.name}!`,
          user: data.user
        };
      }
    } catch {
      // Fall through to local fallback check
    }

    // Local fallback check
    let user = users.find(u => {
      const matchUsername = Boolean(u.username && u.username.toLowerCase() === cleanInput);
      const matchEmail = Boolean(u.email && u.email.toLowerCase() === cleanInput);
      const matchName = Boolean(u.name && u.name.toLowerCase() === cleanInput);
      const matchPhone = Boolean(cleanDigits.length >= 4 && u.phone && u.phone.replace(/\D/g, '').includes(cleanDigits));
      const matchAdminKeyword = (cleanInput === 'admin' || cleanInput === 'owner' || cleanInput === 'master') && u.role === 'ADMIN';
      const matchRole = expectedRole ? u.role === expectedRole : true;

      return (matchUsername || matchEmail || matchName || matchPhone || matchAdminKeyword) && matchRole;
    });

    // Fallback for admin if expectedRole is ADMIN and input was 'admin'
    if (!user && expectedRole === 'ADMIN') {
      user = users.find(u => u.role === 'ADMIN');
    }

    if (!user) {
      return {
        success: false,
        message: expectedRole === 'ADMIN'
          ? 'Admin account not found. You can log in with username "admin" or PIN "9999".'
          : 'Account not found with provided username/email/phone. Please create a new account.'
      };
    }

    // Verify Password or PIN
    const isPasswordMatch = user.password && (user.password === cleanSecret || user.password.toLowerCase() === cleanSecret.toLowerCase());
    const isPinMatch = user.pin && (user.pin === cleanSecret);
    const isAdminDefaultMatch = user.role === 'ADMIN' && (cleanSecret === 'admin' || cleanSecret === '9999' || cleanSecret === 'admin123');

    if (!isPasswordMatch && !isPinMatch && !isAdminDefaultMatch) {
      return {
        success: false,
        message: 'Invalid password or PIN. (Hint: Customer default password is "password123", Admin is "admin" or PIN "9999")'
      };
    }

    setCurrentUser(user);
    setIsGuestMode(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(user));

    if (user.role === 'ADMIN') {
      setIsAdminMode(true);
    }
    setIsAuthModalOpen(false);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user
    };
  };

  const registerCustomer = async (data: {
    name: string;
    username?: string;
    email: string;
    phone: string;
    password?: string;
    preferredServices?: string[];
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanName = (data.name || '').trim();
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPhone = (data.phone || '').trim();
    const cleanUsername = (data.username || cleanName.toLowerCase().replace(/\s+/g, '')).trim().toLowerCase();
    const cleanPassword = (data.password || 'password123').trim();

    if (!cleanName || !cleanPhone) {
      return { success: false, message: 'Please provide your Full Name and Mobile Number.' };
    }

    // Call backend database API to register and persist to database
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          username: cleanUsername,
          email: cleanEmail || `${cleanUsername}@example.com`,
          phone: cleanPhone,
          password: cleanPassword,
          preferredServices: data.preferredServices || []
        })
      });
      const resData = await response.json();
      if (resData.success && resData.user) {
        const newUser: User = resData.user;
        setUsers(prev => [...prev.filter(u => u.id !== newUser.id), newUser]);
        setCurrentUser(newUser);
        setIsGuestMode(false);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(newUser));

        // Also register in customer CRM directory
        setCustomers(prev => {
          if (prev.some(c => c.phone === newUser.phone || (newUser.email && c.email === newUser.email))) return prev;
          return [...prev, {
            id: `cust-${Date.now()}`,
            name: newUser.name,
            phone: newUser.phone,
            email: newUser.email,
            totalVisits: 0,
            totalSpent: 0,
            lastVisit: 'Just Joined',
            favoriteService: (data.preferredServices && data.preferredServices[0]) || 'General Styling',
            memberSince: newUser.memberSince || '2026',
            tier: 'New Client'
          }];
        });

        setIsAuthModalOpen(false);
        return {
          success: true,
          message: resData.message || `Account registered in database! Welcome to Modern Unisex Salon, ${newUser.name}.`,
          user: newUser
        };
      } else if (resData.message) {
        return { success: false, message: resData.message };
      }
    } catch {
      // Fall through to local registration fallback
    }

    const existing = users.find(
      u => (u.username && u.username.toLowerCase() === cleanUsername) ||
           (cleanEmail && u.email.toLowerCase() === cleanEmail) ||
           (cleanPhone.replace(/\D/g, '').length >= 7 && u.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, ''))
    );

    if (existing) {
      return {
        success: false,
        message: `An account already exists with this mobile or username. Please log in directly.`
      };
    }

    const newUser: User = {
      id: `usr-cust-${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail || `${cleanUsername}@example.com`,
      phone: cleanPhone,
      role: 'CUSTOMER',
      password: cleanPassword,
      memberTier: 'New Client',
      loyaltyPoints: 100, // 100 Welcome bonus loyalty points
      totalVisits: 0,
      memberSince: new Date().getFullYear().toString(),
      preferredServices: data.preferredServices || []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setIsGuestMode(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(newUser));

    // Also register in customer directory if not present
    const existingCust = customers.find(c => c.phone === cleanPhone || (cleanEmail && c.email.toLowerCase() === cleanEmail));
    if (!existingCust) {
      const newCustRecord: Customer = {
        id: `cust-${Date.now()}`,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: 'Just Joined',
        favoriteService: (data.preferredServices && data.preferredServices[0]) || 'General Styling',
        memberSince: newUser.memberSince || '2026',
        tier: 'New Client'
      };
      setCustomers(prev => [...prev, newCustRecord]);
    }

    setIsAuthModalOpen(false);

    return {
      success: true,
      message: `Account created successfully! Welcome to Modern Unisex Salon, ${newUser.name}.`,
      user: newUser
    };
  };

  const logout = () => {
    const wasAdmin = currentUser?.role === 'ADMIN' || isAdminMode;
    setCurrentUser(null);
    setIsGuestMode(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_guest_mode`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (wasAdmin) {
      setIsAdminMode(false);
      setActiveNavTab('home');
    }
  };

  // Modal open/close helpers
  const openBookingModal = (service?: ServiceItem) => {
    if (service) {
      setSelectedServiceForBooking(service);
    } else if (services.length > 0) {
      setSelectedServiceForBooking(services[0]);
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceForBooking(null);
  };

  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => setIsQuizModalOpen(false);

  const toggleAiChat = () => setIsAiChatOpen(!isAiChatOpen);
  const closeAiChat = () => setIsAiChatOpen(false);

  // Create confirmed appointment upon 10% Razorpay payment
  const createAppointment = async (payload: BookingPayload): Promise<Appointment> => {
    const bookingRef = `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingRef,
      clientName: payload.clientName,
      clientPhone: payload.clientPhone,
      clientEmail: payload.clientEmail,
      serviceId: payload.serviceId,
      serviceName: payload.serviceName,
      category: payload.category,
      date: payload.date,
      timeSlot: payload.timeSlot,
      stylistName: payload.stylistName,
      totalAmount: payload.totalAmount,
      advancePaid: payload.advanceAmount,
      balanceDue: payload.balanceDue,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      status: 'CONFIRMED',
      razorpayPaymentId: payload.razorpayPaymentId,
      razorpayOrderId: payload.razorpayOrderId,
      createdAt: new Date().toISOString(),
      notes: payload.notes || '',
      isNew: true
    };

    // Update appointments
    setAppointments(prev => [newAppointment, ...prev]);

    // Update or add customer record
    setCustomers(prev => {
      const existing = prev.find(c => c.phone === payload.clientPhone || c.email === payload.clientEmail);
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalVisits: c.totalVisits + 1,
          totalSpent: c.totalSpent + payload.totalAmount,
          lastVisit: payload.date,
          favoriteService: payload.serviceName,
          tier: c.totalVisits + 1 >= 5 ? 'VIP Member' : 'Standard'
        } : c);
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: payload.clientName,
          phone: payload.clientPhone,
          email: payload.clientEmail,
          totalVisits: 1,
          totalSpent: payload.totalAmount,
          lastVisit: payload.date,
          favoriteService: payload.serviceName,
          memberSince: new Date().toISOString().split('T')[0],
          tier: 'New Client'
        };
        return [newCust, ...prev];
      }
    });

    // Add admin notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Online Reservation & 10% Deposit',
      message: `${payload.clientName} booked ${payload.serviceName} for ${payload.date} at ${payload.timeSlot}. Advance deposit ₹${payload.advanceAmount} verified via Razorpay.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, bookingStatus: status, status: status, isNew: false } : apt));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  // Service CRUD
  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
      advanceDeposit: Math.round((service.price * (settings.advancePercentage || 10)) / 100)
    };
    setServices(prev => [newService, ...prev]);
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const price = updated.price !== undefined ? updated.price : s.price;
        return {
          ...s,
          ...updated,
          price,
          advanceDeposit: Math.round((price * (settings.advancePercentage || 10)) / 100)
        };
      }
      return s;
    }));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Inquiry CRUD
  const submitInquiry = (inq: Omit<ContactInquiry, 'id' | 'receivedDate' | 'status'>) => {
    const newInq: ContactInquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'NEW'
    };
    setInquiries(prev => [newInq, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Client Inquiry',
      message: `${inq.clientName} sent an inquiry: "${inq.subject}".`,
      type: 'inquiry',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addContactInquiry = (inq: { name?: string; clientName?: string; phone: string; email: string; message: string; subject?: string; serviceCategory?: string }) => {
    const clientName = inq.name || inq.clientName || 'Valued Client';
    const subject = inq.subject || inq.serviceCategory || 'General Service & Booking Inquiry';
    submitInquiry({
      clientName,
      phone: inq.phone,
      email: inq.email,
      subject,
      serviceCategory: inq.serviceCategory || 'General Inquiry',
      message: inq.message
    });
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus, ownerReply?: string) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? {
      ...inq,
      status,
      ...(ownerReply !== undefined ? { ownerReply } : {})
    } : inq));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    fetch(`/api/inquiries/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to delete inquiry from backend API:', err));
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  // Offer CRUD
  const addOffer = (offer: Omit<OfferCoupon, 'id'>) => {
    const newOffer: OfferCoupon = {
      ...offer,
      id: `off-${Date.now()}`
    };
    setOffers(prev => [newOffer, ...prev]);
  };

  const toggleOfferActive = (id: string) => {
    setOffers(prev => prev.map(off => off.id === id ? { ...off, active: !off.active } : off));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(off => off.id !== id));
  };

  // Review CRUD
  const addReview = (rev: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sentiment: rev.rating >= 4 ? 'positive' : rev.rating === 3 ? 'neutral' : 'critical',
      status: 'published'
    };
    setReviews(prev => [newReview, ...prev]);

    // Push instant real-time notification to the Admin Suite
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `⭐ New ${rev.rating}-Star Feedback Received!`,
      message: `${rev.clientName || 'A customer'} rated ${rev.serviceName}: "${rev.comment ? rev.comment.slice(0, 60) + (rev.comment.length > 60 ? '...' : '') : 'Excellent salon experience.'}"`,
      type: 'review',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateReview = (id: string, updated: Partial<Review>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Policy CRUD
  const addPolicy = (policy: Omit<SalonPolicyItem, 'id'>) => {
    const newPol: SalonPolicyItem = {
      ...policy,
      id: `pol-${Date.now()}`
    };
    setPolicies(prev => [...prev, newPol]);
  };

  const updatePolicy = (id: string, updated: Partial<SalonPolicyItem>) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePolicy = (id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
  };

  // Email Reply to Inquiry
  const sendInquiryEmailReply = async (id: string, replyText: string) => {
    const targetInq = inquiries.find(i => i.id === id);
    const recipientEmail = targetInq?.email || 'client@example.com';
    const clientName = targetInq?.clientName || 'Client';
    const subject = `Response from ${settings.salonName}: Re: ${targetInq?.subject || 'Salon Inquiry'}`;

    // Mailto fallback link
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Dear ${clientName},\n\nThank you for reaching out to ${settings.salonName}.\n\n${replyText}\n\nWarm regards,\n${settings.salonName} Management\nPhone: ${settings.phone}\nAddress: ${settings.address}`
    )}`;

    try {
      const response = await fetch('/api/inquiries/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: id,
          recipientEmail,
          clientName,
          subject,
          replyMessage: replyText,
          salonName: settings.salonName
        })
      });
      const data = await response.json();
      updateInquiryStatus(id, 'RESOLVED', replyText);
      return {
        success: true,
        message: data.message || `Reply logged & email sent to ${recipientEmail}`,
        mailtoUrl
      };
    } catch (err) {
      updateInquiryStatus(id, 'RESOLVED', replyText);
      return {
        success: true,
        message: `Reply logged for ${clientName}. Click below to open in your email client.`,
        mailtoUrl
      };
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Settings
  const updateSettings = (newSettings: Partial<SalonSettings>) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(merged));
      return merged;
    });

    // If advancePercentage changed, recalculate advanceDeposit for all services dynamically
    if (newSettings.advancePercentage !== undefined) {
      const newPct = Number(newSettings.advancePercentage);
      setServices(prev => prev.map(s => ({
        ...s,
        advanceDeposit: Math.round((s.price * newPct) / 100)
      })));
    }

    // Persist to backend database API
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(err => console.error('Failed to sync settings to API:', err));
  };

  // Financial & Operational Stat calculations
  const totalRevenue = appointments.reduce((sum, apt) => {
    if (apt.bookingStatus !== 'CANCELLED') {
      return sum + apt.totalAmount;
    }
    return sum;
  }, 0);

  const advanceDepositTotal = appointments.reduce((sum, apt) => {
    if (apt.bookingStatus !== 'CANCELLED') {
      return sum + apt.advancePaid;
    }
    return sum;
  }, 0);

  const totalBookingsCount = appointments.length;
  const confirmedBookingsCount = appointments.filter(a => a.bookingStatus === 'CONFIRMED' || a.bookingStatus === 'COMPLETED').length;
  const activeCustomersCount = customers.length;
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'NEW' || i.status === 'IN PROGRESS').length;

  return (
    <SalonContext.Provider
      value={{
        services,
        appointments,
        inquiries,
        customers,
        gallery,
        offers,
        reviews,
        policies,
        notifications,
        settings,
        theme,
        toggleTheme,
        setTheme,
        isAdminMode,
        activeNavTab,
        adminTab,
        selectedServiceForBooking,
        isBookingModalOpen,
        isQuizModalOpen,
        isAiChatOpen,
        currentUser,
        users,
        isGuestMode,
        setIsGuestMode,
        isAuthModalOpen,
        authModalInitialTab,
        authModalMode,
        login,
        registerCustomer,
        logout,
        openAuthModal,
        closeAuthModal,
        setIsAdminMode,
        setActiveNavTab,
        setAdminTab,
        openBookingModal,
        closeBookingModal,
        openQuizModal,
        closeQuizModal,
        toggleAiChat,
        closeAiChat,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addService,
        updateService,
        deleteService,
        submitInquiry,
        addContactInquiry,
        updateInquiryStatus,
        deleteInquiry,
        sendInquiryEmailReply,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addOffer,
        toggleOfferActive,
        deleteOffer,
        addReview,
        updateReview,
        deleteReview,
        addPolicy,
        updatePolicy,
        deletePolicy,
        markNotificationAsRead,
        markAllNotificationsRead,
        updateSettings,
        totalRevenue,
        totalBookingsCount,
        confirmedBookingsCount,
        activeCustomersCount,
        pendingInquiriesCount,
        advanceDepositTotal
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
