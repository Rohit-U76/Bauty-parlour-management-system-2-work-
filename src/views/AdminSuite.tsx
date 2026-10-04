import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Star,
  Tag,
  ImageIcon,
  Mail,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Search,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  DollarSign,
  UserCheck,
  TrendingUp,
  X,
  RefreshCw,
  Sun,
  Moon,
  Palette,
  Eye,
  Check,
  Smartphone,
  Bot,
  LogOut,
  Crown,
  Menu,
  MessageSquare,
  Download,
  Copy,
  Camera,
  Award,
  Briefcase,
  FileText,
  ExternalLink
} from 'lucide-react';
import QRCode from 'qrcode';
import { useSalon } from '../context/SalonContext';
import { ServiceItem, Appointment, GalleryItem, OfferCoupon, AppointmentStatus, StaffMember } from '../types';
import { AdminCharts } from '../components/AdminCharts';
import { AdminReviewsTrends } from '../components/AdminReviewsTrends';
import { ReceptionistQrScannerModal } from '../components/ReceptionistQrScannerModal';
import { QrCodeGeneratorModal } from '../components/QrCodeGeneratorModal';
import { AdminSmsEmailHubModal } from '../components/AdminSmsEmailHubModal';
import { AdminTermsPolicies } from '../components/AdminTermsPolicies';

export const AdminSuite: React.FC = () => {
  const {
    services,
    appointments,
    inquiries,
    deleteInquiry,
    updateInquiryStatus,
    customers,
    gallery,
    offers,
    reviews,
    settings,
    updateSettings,
    policies,
    addService,
    updateService,
    deleteService,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    addOffer,
    deleteOffer,
    updateAppointmentStatus,
    setIsAdminMode,
    theme,
    setTheme,
    adminTab,
    setAdminTab,
    openBookingModal,
    currentUser,
    logout,
    staffMembers,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember
  } = useSalon();

  // Search & Filter
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);

  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showQrScannerModal, setShowQrScannerModal] = useState(false);
  const [showQrGeneratorModal, setShowQrGeneratorModal] = useState(false);
  const [selectedServiceForQr, setSelectedServiceForQr] = useState<ServiceItem | null>(null);
  const [qrGeneratorInitialType, setQrGeneratorInitialType] = useState<string>('booking');
  const [showSmsHubModal, setShowSmsHubModal] = useState(false);
  const [selectedAppForMessaging, setSelectedAppForMessaging] = useState<Appointment | null>(null);

  // Staff State & Form
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDepartmentFilter, setStaffDepartmentFilter] = useState('All');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);

  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Senior Hair Stylist');
  const [staffDepartment, setStaffDepartment] = useState<StaffMember['department']>('Hair Care');
  const [staffExperience, setStaffExperience] = useState('5 Years');
  const [staffPhone, setStaffPhone] = useState('+91 98765 43210');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffShift, setStaffShift] = useState('9:00 AM - 7:00 PM');
  const [staffStatus, setStaffStatus] = useState<StaffMember['status']>('Available Today');
  const [staffSpecialties, setStaffSpecialties] = useState('Hair Styling, Balayage, Keratin');
  const [staffBio, setStaffBio] = useState('Dedicated salon professional passionate about precision styling and client transformation.');
  const [staffImage, setStaffImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);
  const [actionFeedbackToast, setActionFeedbackToast] = useState<string | null>(null);

  const openAddStaffModal = () => {
    setStaffName('');
    setStaffRole('Senior Hair Stylist');
    setStaffDepartment('Hair Care');
    setStaffExperience('4 Years');
    setStaffPhone('');
    setStaffEmail('');
    setStaffShift('9:00 AM - 7:00 PM');
    setStaffStatus('Available Today');
    setStaffSpecialties('Hair Styling, Hair Treatment');
    setStaffBio('Passionate salon expert delivering top-notch client care.');
    setStaffImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
    setEditingStaffMember(null);
    setShowAddStaffModal(true);
  };

  const openEditStaffModal = (member: StaffMember) => {
    setEditingStaffMember(member);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffDepartment(member.department);
    setStaffExperience(member.experience);
    setStaffPhone(member.phone || '');
    setStaffEmail(member.email || '');
    setStaffShift(member.shiftHours);
    setStaffStatus(member.status);
    setStaffSpecialties(member.specialties.join(', '));
    setStaffBio(member.bio);
    setStaffImage(member.image);
    setShowAddStaffModal(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    const specialtiesList = staffSpecialties
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingStaffMember) {
      updateStaffMember(editingStaffMember.id, {
        name: staffName.trim(),
        role: staffRole.trim(),
        department: staffDepartment,
        experience: staffExperience.trim(),
        phone: staffPhone.trim(),
        email: staffEmail.trim(),
        shiftHours: staffShift.trim(),
        status: staffStatus,
        specialties: specialtiesList.length > 0 ? specialtiesList : ['General Styling'],
        bio: staffBio.trim(),
        image: staffImage
      });
    } else {
      addStaffMember({
        name: staffName.trim(),
        role: staffRole.trim(),
        department: staffDepartment,
        experience: staffExperience.trim() || '3 Years',
        phone: staffPhone.trim(),
        email: staffEmail.trim(),
        specialties: specialtiesList.length > 0 ? specialtiesList : ['General Styling'],
        rating: 5.0,
        reviewsCount: 0,
        totalClients: 0,
        shiftHours: staffShift.trim() || '9:00 AM - 7:00 PM',
        status: staffStatus,
        bio: staffBio.trim() || 'Professional salon specialist.',
        image: staffImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      });
    }

    setShowAddStaffModal(false);
    setEditingStaffMember(null);
  };

  // Dashboard Booking QR Widget State
  const [dashQrType, setDashQrType] = useState<'booking' | 'service' | 'walkin'>('booking');
  const [dashQrServiceId, setDashQrServiceId] = useState<string>(services[0]?.id || '');
  const [dashQrDataUrl, setDashQrDataUrl] = useState<string>('');
  const [dashQrCopied, setDashQrCopied] = useState<boolean>(false);

  useEffect(() => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    let targetUrl = `${origin}?book=true`;
    if (dashQrType === 'service') {
      const srvId = dashQrServiceId || (services[0]?.id || '');
      targetUrl = `${origin}?service=${srvId}&book=true`;
    } else if (dashQrType === 'walkin') {
      targetUrl = `${origin}?book=true&ref=reception_desk`;
    }

    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(url => setDashQrDataUrl(url))
      .catch(err => console.error('Failed to generate dashboard QR code', err));
  }, [dashQrType, dashQrServiceId, services]);

  const handleDownloadDashQr = () => {
    if (!dashQrDataUrl) return;
    const link = document.createElement('a');
    link.href = dashQrDataUrl;
    link.download = `ModernSalon_${dashQrType}_QR.png`;
    link.click();
  };

  const handleCopyDashQrLink = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    let targetUrl = `${origin}?book=true`;
    if (dashQrType === 'service') {
      const srvId = dashQrServiceId || (services[0]?.id || '');
      targetUrl = `${origin}?service=${srvId}&book=true`;
    } else if (dashQrType === 'walkin') {
      targetUrl = `${origin}?book=true&ref=reception_desk`;
    }
    navigator.clipboard.writeText(targetUrl);
    setDashQrCopied(true);
    setTimeout(() => setDashQrCopied(false), 2000);
  };

  // Dashboard Front Desk QR Check-in Station State
  const [dashCheckinQuery, setDashCheckinQuery] = useState('');
  const [dashMatchedApp, setDashMatchedApp] = useState<Appointment | null>(null);
  const [dashCheckinSuccess, setDashCheckinSuccess] = useState<string | null>(null);

  const handleDashCheckinSearch = (q: string) => {
    setDashCheckinQuery(q);
    const clean = q.trim().toLowerCase();
    if (!clean) {
      setDashMatchedApp(null);
      return;
    }
    const found = appointments.find(a => 
      (a.bookingRef && a.bookingRef.toLowerCase().includes(clean)) ||
      (a.clientPhone && a.clientPhone.includes(clean)) ||
      (a.clientName && a.clientName.toLowerCase().includes(clean))
    );
    setDashMatchedApp(found || null);
  };

  const handleConfirmDashCheckin = (app: Appointment) => {
    updateAppointmentStatus(app.id, 'COMPLETED');
    setDashCheckinSuccess(`Appointment ${app.bookingRef || app.id} checked in successfully for ${app.clientName}!`);
    setTimeout(() => {
      setDashCheckinSuccess(null);
      setDashCheckinQuery('');
      setDashMatchedApp(null);
    }, 3500);
  };

  // Add Service Form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Hair Care & Styling');
  const [newServicePrice, setNewServicePrice] = useState(500);
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceImg, setNewServiceImg] = useState('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80');

  // Add Gallery Form
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGallerySubtitle, setNewGallerySubtitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<'Bridal' | 'Hair Care' | 'Skin Care' | 'Salon Interior' | 'Nail Art' | 'Spa'>('Hair Care');
  const [newGalleryTag, setNewGalleryTag] = useState('Hair Care');
  const [newGalleryImg, setNewGalleryImg] = useState('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80');

  // Add Offer Form
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState(15);
  const [newOfferMin, setNewOfferMin] = useState(1000);

  // Status helper
  const getAppStatus = (a?: { status?: string; bookingStatus?: string }): AppointmentStatus => {
    if (!a) return 'CONFIRMED';
    const val = (a.bookingStatus || a.status || 'CONFIRMED').toUpperCase();
    if (val === 'COMPLETED' || val === 'DONE') return 'COMPLETED';
    if (val === 'CANCELLED' || val === 'CANCELED') return 'CANCELLED';
    if (val === 'PENDING') return 'PENDING';
    return 'CONFIRMED';
  };

  // Metrics
  const totalRevenue = appointments.reduce((acc, a) => acc + (getAppStatus(a) !== 'CANCELLED' ? (a.totalAmount || 0) : 0), 0);
  const totalAdvanceCollected = appointments.reduce((acc, a) => acc + (getAppStatus(a) !== 'CANCELLED' ? (a.advancePaid || 0) : 0), 0);
  const confirmedCount = appointments.filter(a => getAppStatus(a) === 'CONFIRMED').length;
  const upcomingAppointments = appointments
    .filter(a => getAppStatus(a) === 'CONFIRMED' || getAppStatus(a) === 'PENDING')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingCount = upcomingAppointments.length;

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    const priceNum = Number(newServicePrice);

    addService({
      name: newServiceName,
      category: newServiceCategory as any,
      price: priceNum,
      advanceDeposit: Math.round(priceNum * 0.1),
      durationMinutes: Number(newServiceDuration),
      description: newServiceDesc || 'Professional salon service.',
      imageUrl: newServiceImg,
      benefits: ['Quality products', 'Experienced stylist', 'Hygiene guaranteed'],
      rating: 4.9,
      reviewsCount: 12,
      gender: newServiceCategory.includes('Men') ? 'men' : 'women'
    });

    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  const handleUpdateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    updateService(editingService.id, {
      name: editingService.name,
      category: editingService.category,
      price: Number(editingService.price),
      durationMinutes: Number(editingService.durationMinutes),
      description: editingService.description,
      imageUrl: editingService.imageUrl
    });

    setEditingService(null);
  };

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryImg) return;

    addGalleryItem({
      title: newGalleryTitle,
      subtitle: newGallerySubtitle || 'Salon treatment results',
      category: newGalleryCategory,
      tag: newGalleryTag,
      imageUrl: newGalleryImg
    });

    setShowAddGalleryModal(false);
    setNewGalleryTitle('');
    setNewGallerySubtitle('');
    setNewGalleryImg('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80');
  };

  const handleUpdateGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;

    updateGalleryItem(editingGalleryItem.id, {
      title: editingGalleryItem.title,
      subtitle: editingGalleryItem.subtitle,
      category: editingGalleryItem.category,
      tag: editingGalleryItem.tag,
      imageUrl: editingGalleryItem.imageUrl
    });

    setEditingGalleryItem(null);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferCode || !newOfferTitle) return;

    addOffer({
      code: newOfferCode.toUpperCase().trim(),
      title: newOfferTitle,
      description: newOfferDesc,
      discountPercent: Number(newOfferDiscount),
      minBookingAmount: Number(newOfferMin),
      expiryDate: '2026-12-31',
      active: true
    });

    setShowAddOfferModal(false);
    setNewOfferCode('');
    setNewOfferTitle('');
  };

  const filteredAppointments = appointments.filter(a => {
    const clientName = a.clientName || '';
    const serviceName = a.serviceName || '';
    const bookingRef = a.bookingRef || '';
    const clientPhone = a.clientPhone || '';
    const query = appointmentSearch.toLowerCase().trim();

    const matchSearch = !query || 
      clientName.toLowerCase().includes(query) ||
      serviceName.toLowerCase().includes(query) ||
      bookingRef.toLowerCase().includes(query) ||
      clientPhone.includes(query);

    const aStatus = getAppStatus(a);
    let matchStatus = true;
    if (appointmentFilter === 'all') {
      matchStatus = true;
    } else if (appointmentFilter === 'upcoming') {
      matchStatus = (aStatus === 'CONFIRMED' || aStatus === 'PENDING');
    } else {
      matchStatus = aStatus.toLowerCase() === appointmentFilter.toLowerCase();
    }
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (appointmentFilter === 'upcoming') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: confirmedCount },
    { id: 'services', label: 'Services & Pricing', icon: Scissors },
    { id: 'staff', label: 'Staff & Team', icon: UserCheck, badge: staffMembers.length },
    { id: 'gallery', label: 'Gallery Manager', icon: ImageIcon },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'inquiries', label: 'Consultation Inquiries', icon: Mail, badge: inquiries.length },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'qr-scanner', label: 'QR Check-in Scanner', icon: QrCode },
    { id: 'policies', label: 'Terms & Policies', icon: FileText, badge: (policies || []).length },
    { id: 'themes', label: 'Theme Studio', icon: Palette },
    { id: 'settings', label: 'Salon Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row text-left">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 bg-zinc-900 border-r border-zinc-800 flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif text-sm font-bold text-zinc-100">Modern Salon</div>
                <div className="text-[10px] text-zinc-400">Admin Control Panel</div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile & Sign Out Controls */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          {currentUser && (
            <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-zinc-200 truncate flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                </div>
                <div className="text-[10px] text-zinc-400 truncate font-mono">
                  Owner Active • PIN: 9999
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Sign Out button that returns to Authorization Page */}
          <button
            id="admin-sidebar-signout-btn"
            onClick={() => logout()}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            title="Sign out and return to Authorization Page"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out to Authorization Page</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 focus:outline-none cursor-pointer"
            aria-label="Toggle Admin Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-zinc-100 block leading-tight">Admin Suite</span>
              <span className="text-[10px] text-zinc-400 capitalize">{adminTab.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-mobile-signout-btn"
            onClick={() => logout()}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Sign out and return to Authorization Page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm pt-14 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-150">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Navigation Menu</span>
              <span className="text-[11px] text-amber-400 font-mono">12 Modules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAdminTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer text-left text-sm ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                        : 'bg-zinc-900 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                        isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer with Admin Details & Exit */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 space-y-3">
            {currentUser && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-100 truncate flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Owner Active • PIN: 9999
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => logout()}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out to Authorization Page</span>
            </button>
          </div>
        </div>
      )}

      {/* MOBILE HORIZONTAL TABS (Touch-friendly pill scroller) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto p-2.5 bg-zinc-900/90 border-b border-zinc-800 scrollbar-none text-xs sticky top-[57px] z-20 backdrop-blur-md">
        {navTabs.map(tab => {
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold flex items-center gap-1.5 transition active:scale-95 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 hover:bg-zinc-700/70'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* DASHBOARD TAB */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-zinc-100">Salon Dashboard</h1>
                <p className="text-xs text-zinc-400">Overview of bookings, deposits, and salon operations in Mohol.</p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Total Bookings</span>
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-zinc-100">{appointments.length}</div>
                  <div className="text-[11px] text-emerald-400 font-medium">{confirmedCount} active confirmed</div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{settings.advancePercentage || 10}% Advance Deposits</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">₹{totalAdvanceCollected.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-400">Verified via Razorpay</div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Total Service Value</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-zinc-100">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-400">Balance paid at salon</div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Client Rating</span>
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-400">4.9 ★</div>
                  <div className="text-[11px] text-zinc-400">{reviews.length} verified reviews</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h3 className="font-serif text-sm font-bold text-zinc-200">Quick Actions</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setAdminTab('appointments')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Appointments ({confirmedCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedServiceForQr(null);
                      setQrGeneratorInitialType('booking');
                      setShowQrGeneratorModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate Booking QR</span>
                  </button>
                  <button
                    onClick={() => setShowQrScannerModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Launch QR Scanner</span>
                  </button>
                  <button
                    onClick={openAddStaffModal}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Salon Staff</span>
                  </button>
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add New Service</span>
                  </button>
                  <button
                    onClick={() => setShowAddGalleryModal(true)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Gallery Photo</span>
                  </button>
                </div>
              </div>

              {/* DASHBOARD QR SUITE: GENERATE BOOKING QR & FRONT DESK SCANNER STATION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* 1. Generate Booking QR Section */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-serif text-sm font-bold text-zinc-100">Generate Booking QR</h3>
                          <p className="text-[11px] text-zinc-400">Display at reception desk or salon entrance in Mohol.</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                        Live Standee
                      </span>
                    </div>

                    {/* QR Type Selector Tabs */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-medium">
                      <button
                        onClick={() => setDashQrType('booking')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-center transition cursor-pointer ${
                          dashQrType === 'booking'
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Salon Booking Flow
                      </button>
                      <button
                        onClick={() => setDashQrType('service')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-center transition cursor-pointer ${
                          dashQrType === 'service'
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Specific Treatment
                      </button>
                      <button
                        onClick={() => setDashQrType('walkin')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-center transition cursor-pointer ${
                          dashQrType === 'walkin'
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Reception Desk Walk-in
                      </button>
                    </div>

                    {/* Service Selector if Specific Treatment is chosen */}
                    {dashQrType === 'service' && (
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-400 block font-medium">Select Salon Treatment:</label>
                        <select
                          value={dashQrServiceId}
                          onChange={(e) => setDashQrServiceId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                        >
                          {services.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} (₹{s.price} • {settings.advancePercentage || 10}% deposit ₹{Math.round((s.price * (settings.advancePercentage || 10)) / 100)})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* QR Code Preview Box */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                      {dashQrDataUrl ? (
                        <div className="p-2.5 rounded-xl bg-white shadow-md shrink-0 flex items-center justify-center">
                          <img
                            src={dashQrDataUrl}
                            alt="Salon Booking QR Code"
                            className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                          Generating QR...
                        </div>
                      )}

                      <div className="space-y-1.5 text-xs text-left">
                        <div className="font-semibold text-zinc-200">
                          {dashQrType === 'booking' && 'Direct Salon Booking QR'}
                          {dashQrType === 'service' && `Book ${(services.find(s => s.id === dashQrServiceId)?.name) || 'Selected Service'}`}
                          {dashQrType === 'walkin' && 'Front Desk Walk-In Check-In QR'}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Clients can scan this QR code with their mobile phone camera to open the instant appointment reservation modal with {settings.advancePercentage || 10}% verified advance deposit.
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono pt-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Includes Verified Razorpay Gateway</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={handleDownloadDashQr}
                      className="flex-1 min-w-[130px] py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download QR PNG</span>
                    </button>
                    <button
                      onClick={handleCopyDashQrLink}
                      className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {dashQrCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{dashQrCopied ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (dashQrType === 'service') {
                          const srv = services.find(s => s.id === dashQrServiceId) || services[0];
                          openBookingModal(srv);
                        } else {
                          openBookingModal();
                        }
                      }}
                      className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      title="Test and open the booking flow modal"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test Booking</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedServiceForQr(null);
                        setQrGeneratorInitialType('booking');
                        setShowQrGeneratorModal(true);
                      }}
                      className="py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Open full print studio with standee borders, logos and flyers"
                    >
                      <span>Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 2. QR Check-in & Receptionist Scanner Station */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-serif text-sm font-bold text-zinc-100">QR Check-in Scanner Station</h3>
                          <p className="text-[11px] text-zinc-400">Scan client passes or search reference codes upon arrival.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowQrScannerModal(true)}
                        className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 cursor-pointer transition active:scale-95"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Launch Camera</span>
                      </button>
                    </div>

                    {/* Quick Search for Manual Check-in */}
                    <div className="space-y-1">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Type Booking Ref (e.g. MS-2026-...) or Client Phone..."
                          value={dashCheckinQuery}
                          onChange={(e) => handleDashCheckinSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Success Alert */}
                    {dashCheckinSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{dashCheckinSuccess}</span>
                      </div>
                    )}

                    {/* Matched Appointment Result Card */}
                    {dashMatchedApp ? (
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-zinc-100">{dashMatchedApp.clientName}</div>
                          <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                            {dashMatchedApp.bookingRef || dashMatchedApp.id}
                          </span>
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                          {dashMatchedApp.serviceName} • {dashMatchedApp.date} at {dashMatchedApp.timeSlot}
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800">
                          <span className="text-emerald-400 font-semibold font-mono">
                            ₹{dashMatchedApp.advancePaid} Advance Paid
                          </span>
                          <span className="text-zinc-300 font-mono">
                            ₹{Math.max(0, (dashMatchedApp.totalAmount || 0) - (dashMatchedApp.advancePaid || 0))} Due at Salon
                          </span>
                        </div>
                        <button
                          onClick={() => handleConfirmDashCheckin(dashMatchedApp)}
                          className="w-full mt-2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Client Check-in</span>
                        </button>
                      </div>
                    ) : (
                      /* Today's Arrivals Preview List */
                      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                          <span>Today's Pending Client Check-ins</span>
                          <span className="font-mono text-amber-400">
                            {appointments.filter(a => getAppStatus(a) === 'CONFIRMED').length} awaiting
                          </span>
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {appointments
                            .filter(a => getAppStatus(a) === 'CONFIRMED')
                            .slice(0, 3)
                            .map(a => (
                              <div
                                key={a.id}
                                onClick={() => setDashMatchedApp(a)}
                                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800/80 flex items-center justify-between cursor-pointer transition text-[11px]"
                              >
                                <div>
                                  <span className="font-semibold text-zinc-200">{a.clientName}</span>
                                  <span className="text-zinc-500 ml-1.5">({a.timeSlot})</span>
                                </div>
                                <span className="text-amber-400 text-[10px] font-bold">Check-in →</span>
                              </div>
                            ))}
                          {appointments.filter(a => getAppStatus(a) === 'CONFIRMED').length === 0 && (
                            <p className="text-[11px] text-zinc-500 italic py-2 text-center">
                              No pending client arrivals for today.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                    <button
                      onClick={() => setShowQrScannerModal(true)}
                      className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open Fullscreen Scanner &amp; UPI Collection</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Dedicated Upcoming Appointments & Arrivals Section */}
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-zinc-100 flex items-center gap-2">
                        <span>Upcoming Appointments &amp; Arrivals</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-zinc-950">
                          {upcomingCount} Scheduled
                        </span>
                      </h3>
                      <p className="text-[11px] text-zinc-400">Chronologically sorted upcoming visits with 10% advance deposit</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAppointmentFilter('upcoming');
                        setAdminTab('appointments');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage All ({upcomingCount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openBookingModal()}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs text-zinc-400">No upcoming appointments scheduled.</p>
                    <button
                      onClick={() => openBookingModal()}
                      className="text-xs text-amber-400 hover:underline font-bold"
                    >
                      + Schedule an appointment now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {upcomingAppointments.slice(0, 6).map(app => {
                      const cleanPhone = (app.clientPhone || '').replace(/\D/g, '');
                      const whatsappDirectUrl = app.whatsappUrl || `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${app.clientName}, your appointment at Modern Salon Mohol for ${app.serviceName} is scheduled for ${app.date} at ${app.timeSlot}. Ref: ${app.bookingRef}. We look forward to welcoming you!`)}`;

                      return (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-100">{app.clientName}</span>
                                <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                                  {app.bookingRef}
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-400 mt-0.5">
                                {app.serviceName} {app.stylistName ? `• Stylist: ${app.stylistName}` : ''}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                              {getAppStatus(app)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                            <span className="font-medium text-amber-300">
                              📅 {app.date} • ⏰ {app.timeSlot}
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              ₹{app.advancePaid} Deposit (Paid)
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <a
                              href={whatsappDirectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center gap-1 transition"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'COMPLETED')}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                                title="Mark as completed upon salon visit"
                              >
                                <Check className="w-3 h-3" />
                                <span>Complete</span>
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'CANCELLED')}
                                className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-[11px] transition cursor-pointer"
                                title="Cancel appointment"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {adminTab === 'appointments' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">Appointments Management</h1>
                  <p className="text-xs text-zinc-400">Track client bookings and 10% advance deposit receipts.</p>
                </div>
                <button
                  onClick={() => openBookingModal()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Appointment</span>
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by client name, reference ID, phone, or service..."
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {['all', 'upcoming', 'confirmed', 'completed', 'cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setAppointmentFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize flex items-center gap-1.5 cursor-pointer transition ${
                        appointmentFilter === st
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{st === 'all' ? 'All' : st === 'upcoming' ? 'Upcoming' : st}</span>
                      {st === 'upcoming' && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                          appointmentFilter === 'upcoming' ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {upcomingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Booking Ref / Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Total / {settings.advancePercentage || 10}% Adv</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredAppointments.map(app => (
                      <tr key={app.id} className="hover:bg-zinc-800/40">
                        <td className="px-4 py-3">
                          <div className="font-mono font-bold text-amber-400">{app.bookingRef}</div>
                          <div className="text-zinc-400">{app.date} • {app.timeSlot}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-200">{app.clientName}</div>
                          <div className="text-zinc-400">{app.clientPhone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-300">{app.serviceName}</div>
                          <div className="text-zinc-500">{app.stylistName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-zinc-200">₹{app.totalAmount}</div>
                          <div className="text-emerald-400 font-mono text-[11px]">
                            {settings.advancePercentage || 10}% Adv: ₹{app.advancePaid}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            getAppStatus(app) === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : getAppStatus(app) === 'COMPLETED'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {getAppStatus(app)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            onClick={() => {
                              setSelectedAppForMessaging(app);
                              setShowSmsHubModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold"
                            title="SMS & WhatsApp Hub"
                          >
                            <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                            <span>Notify</span>
                          </button>
                          {getAppStatus(app) === 'CONFIRMED' && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'COMPLETED')}
                                className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-600/30"
                              >
                                Done
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'CANCELLED')}
                                className="px-2 py-1 rounded-lg bg-red-600/20 text-red-400 text-[11px] font-semibold hover:bg-red-600/30"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Appointment Cards (Clean, high-density, touch-friendly) */}
              <div className="md:hidden space-y-3">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-xs">
                    No appointments match your filter criteria.
                  </div>
                ) : (
                  filteredAppointments.map(app => {
                    const status = getAppStatus(app);
                    const cleanPhone = (app.clientPhone || '').replace(/\D/g, '');
                    const whatsappDirectUrl = app.whatsappUrl || `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${app.clientName}, your appointment for ${app.serviceName} at Modern Unisex Salon Mohol is confirmed for ${app.date} at ${app.timeSlot}. Ref: ${app.bookingRef}.`)}`;

                    return (
                      <div
                        key={app.id}
                        className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm"
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-amber-400">
                                {app.bookingRef}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                status === 'CONFIRMED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : status === 'COMPLETED'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {status}
                              </span>
                            </div>
                            <h3 className="font-serif font-bold text-base text-zinc-100 mt-1">
                              {app.clientName}
                            </h3>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-zinc-400 block">Total Bill</span>
                            <span className="font-mono font-bold text-sm text-zinc-100">₹{app.totalAmount}</span>
                          </div>
                        </div>

                        {/* Service & Time details */}
                        <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-1">
                          <div className="flex items-center justify-between text-zinc-300">
                            <span className="font-semibold text-amber-300/90">{app.serviceName}</span>
                            <span className="text-zinc-500">{app.stylistName}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-1 border-t border-zinc-800/60">
                            <span>📅 {app.date} • ⏰ {app.timeSlot}</span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              Adv: ₹{app.advancePaid} (Paid)
                            </span>
                          </div>
                        </div>

                        {/* Direct Communication & Mobile Actions */}
                        <div className="pt-1 flex items-center gap-2 flex-wrap">
                          {app.clientPhone && (
                            <a
                              href={`tel:${app.clientPhone}`}
                              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 flex-1 justify-center min-h-[40px]"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                              <span>Call</span>
                            </a>
                          )}

                          <a
                            href={whatsappDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 flex-1 justify-center min-h-[40px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => {
                              setSelectedAppForMessaging(app);
                              setShowSmsHubModal(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
                            title="SMS & WhatsApp Hub"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Notify</span>
                          </button>
                        </div>

                        {/* Status Change Buttons on Mobile */}
                        {status === 'CONFIRMED' && (
                          <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'COMPLETED')}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/40 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[40px]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Completed</span>
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'CANCELLED')}
                              className="py-2 px-3 rounded-xl bg-red-600/15 text-red-400 hover:bg-red-600/25 border border-red-600/30 text-xs font-bold min-h-[40px]"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* SERVICES & PRICING TAB WITH IMAGE EDITING */}
          {adminTab === 'services' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">Services &amp; Pricing</h1>
                  <p className="text-xs text-zinc-400">Add, edit service details, photos, and duration.</p>
                </div>

                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(srv => (
                  <div
                    key={srv.id}
                    className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col justify-between shadow-sm"
                  >
                    {srv.imageUrl && (
                      <div className="h-40 w-full overflow-hidden bg-zinc-950 relative">
                        <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-medium">
                          {srv.category}
                        </span>
                      </div>
                    )}

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-base font-bold text-zinc-100">{srv.name}</h3>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingService(srv)}
                              className="p-1 rounded text-zinc-400 hover:text-amber-400"
                              title="Edit Service"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteService(srv.id)}
                              className="p-1 rounded text-zinc-400 hover:text-red-400"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{srv.description}</p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Duration: {srv.durationMinutes} mins</span>
                          <span className="font-bold text-zinc-100 font-mono">₹{srv.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs bg-amber-500/10 p-2 rounded-lg text-amber-400 font-semibold">
                          <span>{settings.advancePercentage || 10}% Advance:</span>
                          <span className="font-mono font-bold">₹{srv.advanceDeposit || Math.round((srv.price * (settings.advancePercentage || 10)) / 100)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY MANAGER TAB WITH FULL EDIT / ADD / DELETE */}
          {adminTab === 'gallery' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">Gallery Manager</h1>
                  <p className="text-xs text-zinc-400">Manage client transformation photos, bridal styling, and salon interior shots.</p>
                </div>

                <button
                  onClick={() => setShowAddGalleryModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gallery.map(item => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 text-amber-400 text-[10px] font-bold">
                        {item.tag}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-zinc-100">{item.title}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{item.subtitle}</p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">{item.category}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingGalleryItem(item)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-amber-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteGalleryItem(item.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OFFERS TAB */}
          {adminTab === 'offers' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">Promo Offers &amp; Coupons</h1>
                  <p className="text-xs text-zinc-400">Create and manage coupon codes for client discounts.</p>
                </div>

                <button
                  onClick={() => setShowAddOfferModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {offers.map(offer => (
                  <div key={offer.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-amber-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {offer.code}
                      </span>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="font-semibold text-sm text-zinc-200">{offer.title}</div>
                      <div className="text-xs text-zinc-400 mt-1">{offer.description}</div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-between">
                      <span>Discount: {offer.discountPercent ? `${offer.discountPercent}%` : `₹${offer.discountAmount}`}</span>
                      <span>Min Booking: ₹{offer.minBookingAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {adminTab === 'reviews' && (
            <AdminReviewsTrends />
          )}

          {/* CUSTOMERS CRM TAB */}
          {adminTab === 'customers' && (
            <div className="space-y-5">
              <div>
                <h1 className="font-serif text-2xl font-bold text-zinc-100">Customers CRM</h1>
                <p className="text-xs text-zinc-400">List of registered clients and repeat visit history.</p>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="px-5 py-3">Client Name</th>
                      <th className="px-5 py-3">Phone &amp; Email</th>
                      <th className="px-5 py-3">Visits</th>
                      <th className="px-5 py-3">Total Spent</th>
                      <th className="px-5 py-3">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-zinc-800/40">
                        <td className="px-5 py-4 font-semibold text-zinc-200">{c.name}</td>
                        <td className="px-5 py-4 text-zinc-400">
                          <div>{c.phone}</div>
                          <div className="text-[11px] text-zinc-500">{c.email}</div>
                        </td>
                        <td className="px-5 py-4 font-mono">{c.totalVisits} visits</td>
                        <td className="px-5 py-4 font-bold text-amber-400 font-mono">₹{c.totalSpent.toLocaleString()}</td>
                        <td className="px-5 py-4 text-zinc-400">{c.lastVisit || 'Recent'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Customers Cards */}
              <div className="md:hidden space-y-3">
                {customers.map(c => {
                  const cleanPhone = (c.phone || '').replace(/\D/g, '');
                  return (
                    <div key={c.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-zinc-100">{c.name}</h3>
                          <div className="text-xs text-zinc-400">{c.phone}</div>
                          {c.email && <div className="text-[11px] text-zinc-500 truncate">{c.email}</div>}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400 block">Spent</span>
                          <span className="font-mono font-bold text-amber-400 text-sm">₹{c.totalSpent.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-mono">
                          {c.totalVisits} visits
                        </span>
                        <span className="text-zinc-500 text-[11px]">Last: {c.lastVisit || 'Recent'}</span>
                        <div className="flex items-center gap-1.5">
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="p-2 rounded-lg bg-zinc-800 text-amber-400 hover:bg-zinc-700"
                              title="Call Client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${c.name}, greetings from Modern Unisex Salon Mohol!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                              title="WhatsApp Client"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INQUIRIES TAB */}
          {adminTab === 'inquiries' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">Consultation Enquiries</h1>
                  <p className="text-xs text-zinc-400">
                    Client consultation messages, bridal queries &amp; reported inquiries from the Contact form.
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 w-fit">
                  Total Enquiries: {inquiries.length}
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <Mail className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-sm font-semibold text-zinc-300">No reported consultation enquiries</p>
                  <p className="text-xs text-zinc-500">All client messages and inquiries have been cleared or resolved.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inquiries.map(inq => (
                    <div key={inq.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-zinc-100">{inq.clientName || (inq as any).name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              inq.status === 'NEW'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : inq.status === 'RESOLVED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {inq.status || 'NEW'}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500 font-mono">{inq.receivedDate || (inq as any).date}</span>
                        </div>

                        {inq.subject && (
                          <div className="text-xs font-bold text-amber-400">
                            Subject: {inq.subject}
                          </div>
                        )}

                        <div className="text-xs text-zinc-400 flex flex-wrap gap-2">
                          {inq.phone && <span>📞 {inq.phone}</span>}
                          {inq.email && <span>✉️ {inq.email}</span>}
                        </div>

                        <p className="text-xs text-zinc-300 italic bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 leading-relaxed">
                          "{inq.message}"
                        </p>
                      </div>

                      {/* Action buttons: Delete Reported Enquiry & Status */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-zinc-500">ID: {inq.id}</span>
                        <div className="flex items-center gap-2">
                          {inq.status !== 'RESOLVED' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'RESOLVED')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          )}
                          <button
                            id={`delete-inquiry-${inq.id}`}
                            onClick={() => setInquiryToDelete(inq.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            title="Delete Reported Enquiry from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Reported Enquiry</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORTS & ANALYTICS TAB */}
          {adminTab === 'reports' && (
            <AdminCharts />
          )}

          {/* STAFF & TEAM MANAGEMENT TAB */}
          {adminTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">Staff &amp; Salon Specialists</h1>
                  <p className="text-xs text-zinc-400">
                    Manage stylists, beauticians, shift hours, and specialties for Modern Unisex Salon Mohol.
                  </p>
                </div>
                <button
                  id="add-staff-btn"
                  onClick={openAddStaffModal}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg shadow-amber-500/20 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Staff Member</span>
                </button>
              </div>

              {/* Staff Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400">Total Specialists</span>
                  <div className="text-xl font-bold font-mono text-zinc-100">{staffMembers.length}</div>
                  <span className="text-[10px] text-amber-400 font-medium">Verified Team</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400">Available Today</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {staffMembers.filter(s => s.status === 'Available Today').length}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">On Shift</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400">Active Staff</span>
                  <div className="text-xl font-bold font-mono text-blue-400">
                    {staffMembers.filter(s => s.status === 'Active').length}
                  </div>
                  <span className="text-[10px] text-blue-400 font-medium">Roster</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400">Avg Client Rating</span>
                  <div className="text-xl font-bold font-mono text-amber-400">4.9 ★</div>
                  <span className="text-[10px] text-zinc-400">Top Hospitality</span>
                </div>
              </div>

              {/* Search & Department Filters */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search staff by name, role, or specialty..."
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    {staffSearch && (
                      <button
                        onClick={() => setStaffSearch('')}
                        className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Department Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {['All', 'Hair Care', 'Skin & Facial', 'Bridal & Makeup', 'Men Grooming', 'Spa & Wellness'].map(dept => (
                    <button
                      key={dept}
                      onClick={() => setStaffDepartmentFilter(dept)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                        staffDepartmentFilter === dept
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Grid */}
              {(() => {
                const query = staffSearch.toLowerCase().trim();
                const filteredStaff = staffMembers.filter(m => {
                  const matchSearch = !query ||
                    m.name.toLowerCase().includes(query) ||
                    m.role.toLowerCase().includes(query) ||
                    m.specialties.some(s => s.toLowerCase().includes(query));
                  const matchDept = staffDepartmentFilter === 'All' || m.department === staffDepartmentFilter;
                  return matchSearch && matchDept;
                });

                if (filteredStaff.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-300">No staff members found</p>
                      <p className="text-xs text-zinc-500">
                        {staffSearch ? `No specialists match "${staffSearch}".` : 'Get started by adding your first salon stylist or specialist.'}
                      </p>
                      <button
                        onClick={openAddStaffModal}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Staff</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStaff.map(member => (
                      <div
                        key={member.id}
                        className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Member Top Header */}
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                                alt={member.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-zinc-700 shadow-md"
                              />
                              <span
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${
                                  member.status === 'Available Today'
                                    ? 'bg-emerald-400'
                                    : member.status === 'Active'
                                    ? 'bg-blue-400'
                                    : 'bg-amber-400'
                                }`}
                                title={member.status}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h3 className="font-bold text-sm text-zinc-100 truncate">{member.name}</h3>
                                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{member.rating || 4.9}</span>
                                </div>
                              </div>
                              <p className="text-xs text-amber-400/90 font-medium truncate">{member.role}</p>
                              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-400 font-mono">
                                <Briefcase className="w-3 h-3 text-zinc-500" />
                                <span>{member.experience || '3+ Years'} Exp</span>
                                <span>•</span>
                                <span className="text-zinc-300">{member.department}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shift & Status Bar */}
                          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="font-mono">{member.shiftHours || '9:00 AM - 7:00 PM'}</span>
                            </div>

                            {/* Status Quick Changer */}
                            <select
                              value={member.status}
                              onChange={(e) => updateStaffMember(member.id, { status: e.target.value as any })}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer focus:outline-none ${
                                member.status === 'Available Today'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : member.status === 'Active'
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              }`}
                            >
                              <option value="Available Today" className="bg-zinc-900 text-emerald-400">Available Today</option>
                              <option value="Active" className="bg-zinc-900 text-blue-400">Active</option>
                              <option value="On Leave" className="bg-zinc-900 text-amber-400">On Leave</option>
                            </select>
                          </div>

                          {/* Specialties Tags */}
                          {member.specialties && member.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {member.specialties.map((spec, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 text-[10px] border border-zinc-700/60"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Bio */}
                          {member.bio && (
                            <p className="text-[11px] text-zinc-400 italic line-clamp-2 leading-relaxed">
                              "{member.bio}"
                            </p>
                          )}

                          {/* Phone / Email Contact info */}
                          <div className="text-[11px] text-zinc-400 flex flex-wrap gap-2 pt-1">
                            {member.phone && (
                              <a href={`tel:${member.phone}`} className="flex items-center gap-1 hover:text-amber-400">
                                <Phone className="w-3 h-3 text-zinc-500" />
                                <span>{member.phone}</span>
                              </a>
                            )}
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="flex items-center gap-1 hover:text-amber-400">
                                <Mail className="w-3 h-3 text-zinc-500" />
                                <span>{member.email}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {member.totalClients || 120}+ Clients
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditStaffModal(member)}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition active:scale-95"
                              title="Edit Staff Member"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setStaffToDelete(member)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs cursor-pointer transition active:scale-95"
                              title="Delete Staff Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* QR CHECK-IN SCANNER TAB */}
          {adminTab === 'qr-scanner' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-zinc-100">QR Check-in &amp; Pass Terminal</h1>
                  <p className="text-xs text-zinc-400">
                    Live camera scanning, booking pass verification, and instant balance collection for salon arrivals.
                  </p>
                </div>
                <button
                  onClick={() => setShowQrScannerModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Camera className="w-4 h-4" />
                  <span>Launch Live Camera Scanner</span>
                </button>
              </div>

              {/* Terminal Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left 2 Cols: Interactive Verification */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-zinc-200">Instant Check-in Search</h3>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Scanner Online
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 block font-medium">
                      Scan or enter Client Booking Reference (e.g. MS-2026-...) or Mobile Phone:
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. MS-2026-8821 or 9876543210"
                        value={dashCheckinQuery}
                        onChange={(e) => handleDashCheckinSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  {dashCheckinSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold">Arrival Confirmed!</div>
                        <div>{dashCheckinSuccess}</div>
                      </div>
                    </div>
                  )}

                  {dashMatchedApp ? (
                    <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                            Verified Booking Reference
                          </span>
                          <h4 className="text-lg font-bold text-zinc-100">{dashMatchedApp.clientName}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                          {dashMatchedApp.bookingRef || dashMatchedApp.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Service</span>
                          <span className="font-semibold text-zinc-200">{dashMatchedApp.serviceName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Appointment Time</span>
                          <span className="font-semibold text-zinc-200">{dashMatchedApp.date} at {dashMatchedApp.timeSlot}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">{settings.advancePercentage || 10}% Paid Online</span>
                          <span className="font-bold text-emerald-400 font-mono">₹{dashMatchedApp.advancePaid}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Balance at Salon</span>
                          <span className="font-bold text-amber-400 font-mono">
                            ₹{Math.max(0, (dashMatchedApp.totalAmount || 0) - (dashMatchedApp.advancePaid || 0))}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleConfirmDashCheckin(dashMatchedApp)}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" />
                          <span>Complete Client Check-in &amp; Mark Arrived</span>
                        </button>
                        <button
                          onClick={() => setDashMatchedApp(null)}
                          className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 space-y-2">
                      <QrCode className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p className="text-xs text-zinc-400">
                        Scan the client's booking QR code on their smartphone or enter their booking ID above.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right 1 Col: Quick Arrivals List */}
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-zinc-200">Awaiting Check-in</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      {appointments.filter(a => getAppStatus(a) === 'CONFIRMED').length} Today
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {appointments
                      .filter(a => getAppStatus(a) === 'CONFIRMED')
                      .map(app => (
                        <div
                          key={app.id}
                          onClick={() => setDashMatchedApp(app)}
                          className="p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 cursor-pointer transition text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200">{app.clientName}</span>
                            <span className="text-amber-400 font-mono text-[10px]">{app.timeSlot}</span>
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                            <span className="truncate max-w-[150px]">{app.serviceName}</span>
                            <span className="text-emerald-400 font-mono">₹{app.advancePaid} Paid</span>
                          </div>
                        </div>
                      ))}
                    {appointments.filter(a => getAppStatus(a) === 'CONFIRMED').length === 0 && (
                      <p className="text-xs text-zinc-500 italic py-6 text-center">
                        All client bookings have been checked in.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* THEMES TAB */}
          {adminTab === 'themes' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-zinc-100">Theme Selector</h1>
                <p className="text-xs text-zinc-400">Choose between White &amp; Lavender Light mode or Obsidian Gold Dark mode.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  onClick={() => setTheme('light')}
                  className={`p-6 rounded-2xl border-2 transition cursor-pointer ${
                    theme === 'light' ? 'border-amber-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      <span className="font-bold text-sm text-zinc-100">White &amp; Lavender Light</span>
                    </div>
                    {theme === 'light' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-zinc-400">Clean, bright aesthetic for daytime salon viewing.</p>
                </div>

                <div
                  onClick={() => setTheme('dark')}
                  className={`p-6 rounded-2xl border-2 transition cursor-pointer ${
                    theme === 'dark' ? 'border-amber-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-sm text-zinc-100">Obsidian Gold Dark</span>
                    </div>
                    {theme === 'dark' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-zinc-400">Deep luxury tone with golden accents.</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {adminTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="font-serif text-2xl font-bold text-zinc-100">Salon Settings</h1>
                <p className="text-xs text-zinc-400">Update salon contact details and deposit settings.</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm text-xs">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Salon Name</label>
                  <input
                    type="text"
                    value={settings.salonName}
                    onChange={(e) => updateSettings({ salonName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSettings({ email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">Advance Deposit Percentage:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{settings.advancePercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={settings.advancePercentage}
                    onChange={(e) => updateSettings({ advancePercentage: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS TAB */}
          {adminTab === 'policies' && (
            <AdminTermsPolicies />
          )}

        </div>
      </main>

      {/* MODALS */}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-100">Add New Service</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. O3+ Bridal Glow Facial"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 block mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="Hair Care & Styling">Hair Care & Styling</option>
                    <option value="Skin & Facial Therapy">Skin &amp; Facial</option>
                    <option value="Bridal & Pre-Bridal">Bridal &amp; Makeup</option>
                    <option value="Men's Executive Grooming">Men's Grooming</option>
                    <option value="Hair Chemical Services">Hair Chemical / Keratin</option>
                    <option value="Spa & Body Treatments">Spa</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">{settings.advancePercentage || 10}% Advance</label>
                  <div className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-bold font-mono">
                    ₹{Math.round((newServicePrice * (settings.advancePercentage || 10)) / 100)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Service Image (Upload file or Paste URL)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newServiceImg}
                      onChange={(e) => setNewServiceImg(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                    <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setNewServiceImg(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {newServiceImg && (
                    <div className="relative h-24 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img src={newServiceImg} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-100">Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={editingService.durationMinutes}
                    onChange={(e) => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Service Image (Upload file or Paste URL)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingService.imageUrl || ''}
                      onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                    <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setEditingService({ ...editingService, imageUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingService.imageUrl && (
                    <div className="relative h-24 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img src={editingService.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Update Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Gallery Modal */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-100">Add Gallery Photo</h3>
              <button onClick={() => setShowAddGalleryModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Bridal Transformation"
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Subtitle / Details</label>
                <input
                  type="text"
                  placeholder="e.g. HD Make Up & Jewellery Styling"
                  value={newGallerySubtitle}
                  onChange={(e) => setNewGallerySubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 block mb-1">Category</label>
                  <select
                    value={newGalleryCategory}
                    onChange={(e: any) => {
                      setNewGalleryCategory(e.target.value);
                      setNewGalleryTag(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Salon Interior">Salon Interior</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Spa">Spa</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Tag Badge</label>
                  <input
                    type="text"
                    value={newGalleryTag}
                    onChange={(e) => setNewGalleryTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Image (Upload file or Paste URL) *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newGalleryImg}
                      onChange={(e) => setNewGalleryImg(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                    <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setNewGalleryImg(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {newGalleryImg && (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img src={newGalleryImg} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Upload to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Gallery Item Modal */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-100">Edit Gallery Photo</h3>
              <button onClick={() => setEditingGalleryItem(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGallerySubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Photo Title</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingGalleryItem.subtitle || ''}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 block mb-1">Category</label>
                  <select
                    value={editingGalleryItem.category}
                    onChange={(e: any) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Salon Interior">Salon Interior</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Spa">Spa</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Tag Badge</label>
                  <input
                    type="text"
                    value={editingGalleryItem.tag}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Image (Upload file or Paste URL)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={editingGalleryItem.imageUrl}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                    <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setEditingGalleryItem({ ...editingGalleryItem, imageUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingGalleryItem.imageUrl && (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img src={editingGalleryItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Update Photo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {showAddOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-100">Create Promo Code</h3>
              <button onClick={() => setShowAddOfferModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Coupon Code (e.g. GLOW20) *</label>
                <input
                  type="text"
                  required
                  value={newOfferCode}
                  onChange={(e) => setNewOfferCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white uppercase font-mono"
                />
              </div>
              <div>
                <label className="text-zinc-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newOfferTitle}
                  onChange={(e) => setNewOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={newOfferDiscount}
                    onChange={(e) => setNewOfferDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Min Booking (₹)</label>
                  <input
                    type="number"
                    value={newOfferMin}
                    onChange={(e) => setNewOfferMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Publish Coupon
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT STAFF MEMBER MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-zinc-100">
                    {editingStaffMember ? 'Edit Staff Specialist' : 'Add New Salon Specialist'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {editingStaffMember ? `Update ${editingStaffMember.name}'s details & shift schedule` : 'Add stylist, beautician, or therapist to Modern Salon team'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddStaffModal(false);
                  setEditingStaffMember(null);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              {/* Image Preview & URL */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <img
                  src={staffImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt="Staff Preview"
                  className="w-14 h-14 rounded-2xl object-cover border border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <label className="text-zinc-300 font-medium block text-[11px]">Photo URL / Avatar</label>
                  <input
                    type="url"
                    value={staffImage}
                    onChange={(e) => setStaffImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Specialist Name *</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    placeholder="e.g. Senior Hair Stylist & Colorist"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Department & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Department</label>
                  <select
                    value={staffDepartment}
                    onChange={(e) => setStaffDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin & Facial">Skin & Facial</option>
                    <option value="Bridal & Makeup">Bridal & Makeup</option>
                    <option value="Men Grooming">Men Grooming</option>
                    <option value="Spa & Wellness">Spa & Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Experience</label>
                  <input
                    type="text"
                    value={staffExperience}
                    onChange={(e) => setStaffExperience(e.target.value)}
                    placeholder="e.g. 5 Years"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Shift Hours & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Daily Shift Hours</label>
                  <input
                    type="text"
                    value={staffShift}
                    onChange={(e) => setStaffShift(e.target.value)}
                    placeholder="e.g. 9:00 AM - 7:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Current Status</label>
                  <select
                    value={staffStatus}
                    onChange={(e) => setStaffStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Available Today">Available Today</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="priya@modernsalon.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={staffSpecialties}
                  onChange={(e) => setStaffSpecialties(e.target.value)}
                  placeholder="e.g. Keratin Therapy, Balayage, Layer Cut, Bridal Glow"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Bio / Profile Highlight</label>
                <textarea
                  rows={2}
                  value={staffBio}
                  onChange={(e) => setStaffBio(e.target.value)}
                  placeholder="Brief note about the specialist's training and styling philosophy..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStaffModal(false);
                    setEditingStaffMember(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingStaffMember ? 'Update Staff Member' : 'Add to Salon Team'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global QR and Messaging Modals */}
      <ReceptionistQrScannerModal
        isOpen={showQrScannerModal}
        onClose={() => setShowQrScannerModal(false)}
      />

      <QrCodeGeneratorModal
        isOpen={showQrGeneratorModal}
        onClose={() => {
          setShowQrGeneratorModal(false);
          setSelectedServiceForQr(null);
        }}
        initialType={qrGeneratorInitialType}
        initialService={selectedServiceForQr}
      />

      <AdminSmsEmailHubModal
        isOpen={showSmsHubModal}
        onClose={() => setShowSmsHubModal(false)}
        initialAppointment={selectedAppForMessaging}
      />

      {/* DELETE STAFF CONFIRMATION MODAL */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base font-bold text-zinc-100">Remove Staff Specialist?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-zinc-200">{staffToDelete.name}</span> ({staffToDelete.role}) from the active salon staff roster?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const name = staffToDelete.name;
                  deleteStaffMember(staffToDelete.id);
                  setStaffToDelete(null);
                  setActionFeedbackToast(`Removed ${name} from salon staff roster.`);
                  setTimeout(() => setActionFeedbackToast(null), 3000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE INQUIRY CONFIRMATION MODAL */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base font-bold text-zinc-100">Delete Reported Enquiry?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This will permanently delete this client enquiry record from your dashboard database.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteInquiry(inquiryToDelete);
                  setInquiryToDelete(null);
                  setActionFeedbackToast('Enquiry record deleted successfully.');
                  setTimeout(() => setActionFeedbackToast(null), 3000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Feedback Toast */}
      {actionFeedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-amber-500/40 text-zinc-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedbackToast}</span>
        </div>
      )}
    </div>
  );
};
