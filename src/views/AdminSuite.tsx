import React, { useState } from 'react';
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
  Crown
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { ServiceItem, Appointment, GalleryItem, OfferCoupon, AppointmentStatus } from '../types';
import { AdminCharts } from '../components/AdminCharts';
import { AdminReviewsTrends } from '../components/AdminReviewsTrends';
import { ReceptionistQrScannerModal } from '../components/ReceptionistQrScannerModal';
import { QrCodeGeneratorModal } from '../components/QrCodeGeneratorModal';
import { AdminSmsEmailHubModal } from '../components/AdminSmsEmailHubModal';

export const AdminSuite: React.FC = () => {
  const {
    services,
    appointments,
    inquiries,
    customers,
    gallery,
    offers,
    reviews,
    settings,
    updateSettings,
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
    logout
  } = useSalon();

  // Search & Filter
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('all');

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
    const matchStatus = appointmentFilter === 'all' || aStatus.toLowerCase() === appointmentFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: confirmedCount },
    { id: 'services', label: 'Services & Pricing', icon: Scissors },
    { id: 'gallery', label: 'Gallery Manager', icon: ImageIcon },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'inquiries', label: 'Consultation Inquiries', icon: Mail, badge: inquiries.length },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'qr-scanner', label: 'QR Check-in Scanner', icon: QrCode },
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

        {/* Admin Profile & Exit Controls */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {currentUser && (
            <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-zinc-200 truncate flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate font-mono">
                    Owner Clear (PIN: 9999)
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition cursor-pointer"
                title="Sign Out of Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>Return to Client Website</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Scissors className="w-4 h-4" />
          </div>
          <span className="font-serif text-sm font-bold text-zinc-100">Modern Salon Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => logout()}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded-lg bg-rose-500/10 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Lock</span>
          </button>
          <button
            onClick={() => setIsAdminMode(false)}
            className="text-xs text-amber-400 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 cursor-pointer"
          >
            Client Site
          </button>
        </div>
      </div>

      {/* MOBILE HORIZONTAL TABS */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto p-2 bg-zinc-900/60 border-b border-zinc-800 scrollbar-none text-xs">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              adminTab === tab.id ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
                    <span>10% Advance Deposits</span>
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

              {/* Recent Appointments Preview */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-zinc-200">Recent Appointments</h3>
                  <button
                    onClick={() => setAdminTab('appointments')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-zinc-800">
                  {appointments.slice(0, 5).map(app => (
                    <div key={app.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-zinc-200">{app.clientName} • {app.serviceName}</div>
                        <div className="text-zinc-400">{app.date} at {app.timeSlot} • Phone: {app.clientPhone}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">₹{app.advancePaid} Deposit</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                          {getAppStatus(app)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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

                <div className="flex items-center gap-1.5">
                  {['all', 'confirmed', 'completed', 'cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setAppointmentFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                        appointmentFilter === st
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Booking Ref / Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Total / 10% Adv</th>
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
                            10% Adv: ₹{app.advancePaid}
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
                          <span>10% Advance:</span>
                          <span className="font-mono font-bold">₹{srv.advanceDeposit || Math.round(srv.price * 0.1)}</span>
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

              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
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
            </div>
          )}

          {/* INQUIRIES TAB */}
          {adminTab === 'inquiries' && (
            <div className="space-y-5">
              <div>
                <h1 className="font-serif text-2xl font-bold text-zinc-100">Consultation Inquiries</h1>
                <p className="text-xs text-zinc-400">Messages sent from the Contact page form.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map(inq => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-zinc-100">{inq.clientName || (inq as any).name}</span>
                      <span className="text-[10px] text-zinc-500">{inq.receivedDate || (inq as any).date}</span>
                    </div>
                    <div className="text-xs text-zinc-400">{inq.phone} • {inq.email}</div>
                    <p className="text-xs text-zinc-300 italic bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS & ANALYTICS TAB */}
          {adminTab === 'reports' && (
            <AdminCharts />
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
                  <label className="text-zinc-300 block mb-1">10% Advance</label>
                  <div className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-bold font-mono">
                    ₹{Math.round(newServicePrice * 0.1)}
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
    </div>
  );
};
