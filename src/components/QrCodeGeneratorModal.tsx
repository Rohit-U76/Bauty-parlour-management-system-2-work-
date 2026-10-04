import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Wifi,
  DollarSign,
  Star,
  Tag,
  CreditCard,
  Phone,
  Globe,
  Share2,
  Sliders,
  Palette,
  ExternalLink,
  ShieldCheck,
  Scissors,
  Calendar,
  Layers,
  Percent,
  Megaphone,
  MapPin,
  Clock,
  LayoutTemplate,
  Info
} from 'lucide-react';
import QRCode from 'qrcode';
import { useSalon } from '../context/SalonContext';
import { ServiceItem } from '../types';

interface QrCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'service' | 'booking' | 'offer' | 'upi' | 'review' | 'wifi' | 'vcard' | 'custom';
  initialService?: ServiceItem | null;
}

export const QrCodeGeneratorModal: React.FC<QrCodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialType = 'service',
  initialService = null
}) => {
  const { services, settings, offers } = useSalon();
  const [activeType, setActiveType] = useState<'service' | 'booking' | 'offer' | 'upi' | 'review' | 'wifi' | 'vcard' | 'custom'>(initialType);
  
  // Service Promotion State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService ? initialService.id : (services[0]?.id || '')
  );
  const [serviceUtmSource, setServiceUtmSource] = useState<string>('pamphlet');
  const [serviceCoupon, setServiceCoupon] = useState<string>('');
  const [serviceCustomHeadline, setServiceCustomHeadline] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');

  // Booking Page Promotion State
  const [bookingCategory, setBookingCategory] = useState<string>('all');
  const [bookingUtmSource, setBookingUtmSource] = useState<string>('standee');
  const [bookingCoupon, setBookingCoupon] = useState<string>('GLOW20');

  // UPI State
  const [upiAmount, setUpiAmount] = useState<string>('500');
  const [upiVpa, setUpiVpa] = useState<string>('modernunisexsalon@icici');
  const [upiPayee, setUpiPayee] = useState<string>('Modern Unisex Salon Mohol');
  const [upiNote, setUpiNote] = useState<string>('Salon Advance Deposit');

  // Review State
  const [reviewUrl, setReviewUrl] = useState<string>('https://modernsalon.in/reviews');

  // Wi-Fi State
  const [wifiSsid, setWifiSsid] = useState<string>('ModernSalon_VIP_5G');
  const [wifiPassword, setWifiPassword] = useState<string>('ModernMohol@2026');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Offer State
  const [selectedOfferCode, setSelectedOfferCode] = useState<string>(offers[0]?.code || 'GLOW20');

  // Custom State
  const [customText, setCustomText] = useState<string>('https://modernsalon.in');

  // Flyer / Stand Layout Format
  const [layoutFormat, setLayoutFormat] = useState<'tent_card' | 'poster_flyer' | 'social_card'>('tent_card');

  // Styling State
  const [qrColorDark, setQrColorDark] = useState<string>('#7c3aed');
  const [qrColorLight, setQrColorLight] = useState<string>('#ffffff');
  const [qrThemePreset, setQrThemePreset] = useState<'lavender' | 'gold' | 'emerald' | 'dark' | 'classic'>('lavender');

  // Generated QR output
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [rawPayload, setRawPayload] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Synchronize when modal opens or initialType/initialService props change
  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setActiveType(initialType);
      }
      if (initialService) {
        setSelectedServiceId(initialService.id);
        setActiveType('service');
      }
    }
  }, [isOpen, initialType, initialService]);

  // Apply color presets
  const applyPreset = (preset: 'lavender' | 'gold' | 'emerald' | 'dark' | 'classic') => {
    setQrThemePreset(preset);
    switch (preset) {
      case 'lavender':
        setQrColorDark('#7c3aed');
        setQrColorLight('#ffffff');
        break;
      case 'gold':
        setQrColorDark('#b8860b');
        setQrColorLight('#ffffff');
        break;
      case 'emerald':
        setQrColorDark('#059669');
        setQrColorLight('#ffffff');
        break;
      case 'dark':
        setQrColorDark('#141418');
        setQrColorLight('#ffffff');
        break;
      case 'classic':
      default:
        setQrColorDark('#000000');
        setQrColorLight('#ffffff');
        break;
    }
  };

  const currentSelectedService = services.find(s => s.id === selectedServiceId) || services[0];

  // Compute QR Raw Payload string
  const computePayload = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://modernsalon.in';

    switch (activeType) {
      case 'service': {
        const srv = currentSelectedService;
        const srvId = srv ? srv.id : 'service';
        const params = new URLSearchParams();
        params.set('service', srvId);
        params.set('book', 'true');
        if (serviceUtmSource) params.set('utm_source', serviceUtmSource);
        if (serviceCoupon) params.set('coupon', serviceCoupon);
        return `${origin}?${params.toString()}`;
      }
      case 'booking': {
        const params = new URLSearchParams();
        params.set('book', 'true');
        if (bookingCategory && bookingCategory !== 'all') params.set('category', bookingCategory);
        if (bookingCoupon) params.set('coupon', bookingCoupon);
        if (bookingUtmSource) params.set('utm_source', bookingUtmSource);
        return `${origin}?${params.toString()}`;
      }
      case 'offer': {
        const offerObj = offers.find(o => o.code === selectedOfferCode);
        const params = new URLSearchParams();
        params.set('coupon', selectedOfferCode);
        params.set('discount', String(offerObj?.discountPercentage || 20));
        params.set('book', 'true');
        params.set('utm_source', 'coupon_qr');
        return `${origin}?${params.toString()}`;
      }
      case 'upi': {
        const amt = parseFloat(upiAmount) || 0;
        const amtStr = amt > 0 ? `&am=${amt.toFixed(2)}` : '';
        return `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiPayee)}${amtStr}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
      }
      case 'review':
        return reviewUrl;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:Salon;Modern;Unisex;;\nFN:Modern Unisex Salon Mohol\nORG:Modern Unisex Salon\nTEL;TYPE=WORK,VOICE:+91${settings.phone}\nEMAIL:contact@modernsalon.in\nADR;TYPE=WORK:;;B.N. Gund Complex, Shivaji Chowk;Mohol;Maharashtra;413213;India\nURL:${origin}\nEND:VCARD`;
      case 'custom':
      default:
        return customText || origin;
    }
  };

  // Generate QR Code on any parameter change
  useEffect(() => {
    if (!isOpen) return;
    const payload = computePayload();
    setRawPayload(payload);

    QRCode.toDataURL(payload, {
      width: 600,
      margin: 1.5,
      color: {
        dark: qrColorDark,
        light: qrColorLight
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Generation failed:', err));
  }, [
    isOpen,
    activeType,
    selectedServiceId,
    serviceUtmSource,
    serviceCoupon,
    bookingCategory,
    bookingUtmSource,
    bookingCoupon,
    upiAmount,
    upiVpa,
    upiPayee,
    upiNote,
    reviewUrl,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    selectedOfferCode,
    customText,
    qrColorDark,
    qrColorLight
  ]);

  if (!isOpen) return null;

  // Filtered services for picker
  const filteredServices = serviceCategoryFilter === 'all'
    ? services
    : services.filter(s => s.category.toLowerCase() === serviceCategoryFilter.toLowerCase());

  // Download high-resolution PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    const fileName = activeType === 'service' && currentSelectedService
      ? `modern-salon-qr-${currentSelectedService.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`
      : `modern-salon-qr-${activeType}-${Date.now()}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(rawPayload);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Print Tabletop Stand / Flyer
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative max-w-5xl w-full bg-[#141418] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-6 text-left animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0e0e11] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-100">
                  Salon Promotion &amp; QR Code Generator Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  Deep-Link Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generate direct scan-to-book links for individual services, general booking portal, discount flyers &amp; tabletop stands.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4 border-b border-zinc-800 flex flex-wrap gap-2">
          {[
            { id: 'service', label: 'Specific Service Promo', icon: Scissors, badge: 'High Conversion' },
            { id: 'booking', label: 'Main Booking Portal', icon: Calendar },
            { id: 'offer', label: 'VIP Coupon Voucher', icon: Tag },
            { id: 'upi', label: 'UPI Counter Payment', icon: DollarSign },
            { id: 'review', label: 'Google 5★ Review Stand', icon: Star },
            { id: 'wifi', label: 'Salon Wi-Fi Pass', icon: Wifi },
            { id: 'vcard', label: 'Digital Visiting Card', icon: Phone },
            { id: 'custom', label: 'Custom URL / Text', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border-t border-x border-purple-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold ml-1">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body: 2 Columns */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* TYPE 1: SPECIFIC SERVICE PROMOTION */}
            {activeType === 'service' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-200 flex items-start gap-2.5">
                  <Megaphone className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                  <div>
                    <span className="font-bold block">Direct Service Booking Link:</span>
                    <span>When scanned, clients land directly on the booking modal with this specific service and its 10% advance deposit pre-selected!</span>
                  </div>
                </div>

                {/* Service Category Filter & Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Filter Category
                    </label>
                    <select
                      value={serviceCategoryFilter}
                      onChange={e => setServiceCategoryFilter(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Categories ({services.length})</option>
                      <option value="Hair">Hair &amp; Beard</option>
                      <option value="Skin">Skin &amp; Facials</option>
                      <option value="Spa">Spa &amp; Treatments</option>
                      <option value="Bridal">Bridal &amp; Groom</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Select Featured Salon Service
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={e => setSelectedServiceId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs font-semibold focus:outline-none focus:border-purple-500"
                    >
                      {filteredServices.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} - ₹{s.price} (Adv: ₹{s.advanceDeposit || Math.round(s.price * 0.1)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Service Spotlight Card */}
                {currentSelectedService && (
                  <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                        {currentSelectedService.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-zinc-100">
                        {currentSelectedService.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                        {currentSelectedService.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 pl-3 border-l border-zinc-800">
                      <div className="font-mono text-sm font-bold text-zinc-100">₹{currentSelectedService.price}</div>
                      <div className="text-[10px] text-purple-400 font-bold">
                        10% Adv: ₹{currentSelectedService.advanceDeposit || Math.round(currentSelectedService.price * 0.1)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketing Campaign Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Marketing Distribution Channel (UTM)
                    </label>
                    <select
                      value={serviceUtmSource}
                      onChange={e => setServiceUtmSource(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="pamphlet">Print Pamphlet / Flyer</option>
                      <option value="standee">Salon Entrance Standee</option>
                      <option value="instagram">Instagram Bio / Story</option>
                      <option value="whatsapp">WhatsApp Status / Broadcast</option>
                      <option value="tabletop">Styling Station Tabletop Stand</option>
                      <option value="google_ad">Google Local Campaign</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Attach Promo Discount Coupon (Optional)
                    </label>
                    <select
                      value={serviceCoupon}
                      onChange={e => setServiceCoupon(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="">No Coupon (Standard Pricing)</option>
                      {offers.map(o => (
                        <option key={o.code} value={o.code}>
                          {o.code} - {o.discountPercentage}% OFF ({o.title})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Promo Tagline */}
                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Custom Banner Headline (Optional for Standee / Flyer)
                  </label>
                  <input
                    type="text"
                    value={serviceCustomHeadline}
                    onChange={e => setServiceCustomHeadline(e.target.value)}
                    placeholder={`e.g. Exclusive 20% OFF on ${currentSelectedService?.name || 'Hair Treatment'}`}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* TYPE 2: MAIN BOOKING PORTAL PROMO */}
            {activeType === 'booking' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-200 flex items-start gap-2.5">
                  <Globe className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                  <div>
                    <span className="font-bold block">General Salon Booking Portal QR:</span>
                    <span>Directs clients to the full interactive appointment reservation wizard with 10% online advance slot lock.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Pre-Selected Service Category
                    </label>
                    <select
                      value={bookingCategory}
                      onChange={e => setBookingCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Services Catalog</option>
                      <option value="Hair">Hair Styling &amp; Chemical Treatments</option>
                      <option value="Skin">Facials &amp; Skin Care</option>
                      <option value="Spa">Spa &amp; Body Relaxation</option>
                      <option value="Bridal">Bridal &amp; Groom Packages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Promotion Source / Medium
                    </label>
                    <select
                      value={bookingUtmSource}
                      onChange={e => setBookingUtmSource(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="standee">Salon Floor Standee Banner</option>
                      <option value="visiting_card">Receptionist Visiting Card</option>
                      <option value="pamphlet">Town Pamphlet Insert</option>
                      <option value="bill_receipt">Printed Payment Receipt</option>
                      <option value="instagram_bio">Instagram Bio Link</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Auto-Apply Promo Coupon
                  </label>
                  <select
                    value={bookingCoupon}
                    onChange={e => setBookingCoupon(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="">None (Standard Rate)</option>
                    {offers.map(o => (
                      <option key={o.code} value={o.code}>
                        {o.code} - {o.discountPercentage}% OFF ({o.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* TYPE 3: VIP OFFER COUPON */}
            {activeType === 'offer' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Generate promo voucher QR codes to distribute on Instagram stories, flyers, and festive campaigns.</span>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Select Active Offer Coupon
                  </label>
                  <select
                    value={selectedOfferCode}
                    onChange={e => setSelectedOfferCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                  >
                    {offers.map(o => (
                      <option key={o.code} value={o.code}>
                        {o.code} - {o.title} ({o.discountPercentage}% OFF)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* TYPE 4: UPI PAYMENT */}
            {activeType === 'upi' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
                  <span>Accept direct payments via GPay, PhonePe, Paytm, BHIM &amp; all UPI banking apps.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Collection Amount (₹)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={upiAmount}
                        onChange={e => setUpiAmount(e.target.value)}
                        placeholder="Leave blank for any amount"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Bill / Reference Note
                    </label>
                    <input
                      type="text"
                      value={upiNote}
                      onChange={e => setUpiNote(e.target.value)}
                      placeholder="e.g. Hair Cut & Spa Bill"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Quick Amount Chips */}
                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Quick Preset Amounts:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['150', '250', '500', '800', '1200', '2000', '3500'].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setUpiAmount(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          upiAmount === amt
                            ? 'bg-purple-600 text-white'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Salon UPI VPA ID
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={e => setUpiVpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Beneficiary / Account Name
                    </label>
                    <input
                      type="text"
                      value={upiPayee}
                      onChange={e => setUpiPayee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 5: GOOGLE REVIEW */}
            {activeType === 'review' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <Star className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Place this QR stand at styling stations and reception to skyrocket 5-star Google reviews.</span>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Google Review / Feedback URL
                  </label>
                  <input
                    type="url"
                    value={reviewUrl}
                    onChange={e => setReviewUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* TYPE 6: WI-FI PASS */}
            {activeType === 'wifi' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                  <Wifi className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>Clients can point their smartphone camera to connect to the salon Wi-Fi without typing passwords.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Wi-Fi Network Name (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={e => setWifiSsid(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                      Wi-Fi Password
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={e => setWifiPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Security Encryption
                  </label>
                  <select
                    value={wifiEncryption}
                    onChange={e => setWifiEncryption(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open Network (No Password)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TYPE 7: VCARD */}
            {activeType === 'vcard' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>Scan to save official salon contacts, WhatsApp phone line, Google Maps location, and address to contacts.</span>
                </div>
              </div>
            )}

            {/* TYPE 8: CUSTOM URL / TEXT */}
            {activeType === 'custom' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1 text-[10px]">
                    Custom URL or Text Content
                  </label>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="https://modernsalon.in/your-custom-link"
                    className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* PRINT & DISPLAY FORMAT SWITCHER */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />
                <span>Card &amp; Print Display Layout</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tent_card', label: 'Acrylic Tent Stand', desc: 'Station & Counter' },
                  { id: 'poster_flyer', label: 'A4 Wall Poster', desc: 'Promotional Flyer' },
                  { id: 'social_card', label: 'Social Share Card', desc: 'Story & WhatsApp' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setLayoutFormat(fmt.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      layoutFormat === fmt.id
                        ? 'border-purple-500 bg-purple-500/15 text-purple-200 font-bold'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs block leading-tight">{fmt.label}</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* THEME & COLOR CUSTOMIZER */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>QR Color Palette</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'lavender', label: 'Lavender Royal', dark: '#7c3aed', light: '#ffffff' },
                  { id: 'gold', label: 'Obsidian Gold', dark: '#b8860b', light: '#ffffff' },
                  { id: 'emerald', label: 'Emerald Glow', dark: '#059669', light: '#ffffff' },
                  { id: 'dark', label: 'Midnight Zinc', dark: '#141418', light: '#ffffff' },
                  { id: 'classic', label: 'Classic Black', dark: '#000000', light: '#ffffff' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id as any)}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      qrThemePreset === p.id
                        ? 'border-purple-500 bg-purple-500/15 text-purple-300 font-bold'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: p.dark }}
                    />
                    <span className="text-[10px] leading-tight">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payload Link Preview */}
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2">
              <div className="text-[11px] font-mono text-zinc-400 truncate flex-1">
                <span className="text-purple-400 font-bold">Deep Link: </span>
                {rawPayload}
              </div>

              <a
                href={rawPayload}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1 shrink-0"
                title="Test Scan Link in New Tab"
              >
                <ExternalLink className="w-3 h-3 text-purple-400" />
                <span>Test Link</span>
              </a>
            </div>

          </div>

          {/* Right Card: High-Res QR Display & Print Stand Format (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            
            {/* Tabletop Counter Tent Card / Poster Frame */}
            <div
              ref={printRef}
              className={`w-full max-w-[320px] p-6 rounded-3xl bg-white text-zinc-900 shadow-2xl border-2 border-purple-500/30 text-center space-y-3.5 flex flex-col items-center relative overflow-hidden transition-all ${
                layoutFormat === 'poster_flyer' ? 'border-purple-600 bg-gradient-to-b from-purple-50 via-white to-purple-50' : ''
              }`}
            >
              {/* Header Badge */}
              <div className="w-full">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-700 block">
                  MODERN UNISEX SALON MOHOL
                </span>
                
                {activeType === 'service' && currentSelectedService && (
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider inline-block">
                      {currentSelectedService.category} SPECIAL
                    </span>
                    <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1 leading-tight">
                      {serviceCustomHeadline || currentSelectedService.name}
                    </h4>
                  </div>
                )}

                {activeType === 'booking' && (
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider inline-block">
                      VIP FAST-TRACK PASS
                    </span>
                    <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1">
                      Scan to Book Online
                    </h4>
                  </div>
                )}

                {activeType === 'offer' && (
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider inline-block">
                      EXCLUSIVE PROMO COUPON
                    </span>
                    <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1">
                      {selectedOfferCode} Voucher
                    </h4>
                  </div>
                )}

                {activeType === 'upi' && (
                  <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1">
                    Scan &amp; Pay via UPI
                  </h4>
                )}

                {activeType === 'review' && (
                  <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1">
                    Rate Us on Google ★
                  </h4>
                )}

                {activeType === 'wifi' && (
                  <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1">
                    Connect to Salon Wi-Fi
                  </h4>
                )}

                {activeType === 'vcard' && (
                  <h4 className="font-serif text-base font-extrabold text-zinc-900 mt-1">
                    Save Salon Contact Card
                  </h4>
                )}
              </div>

              {/* High-Resolution QR Canvas Image */}
              <div className="p-2.5 rounded-2xl bg-white shadow-md border border-purple-100 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Generated Salon Promotion QR Code"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-zinc-400">
                    Generating Vector QR...
                  </div>
                )}
              </div>

              {/* Dynamic Service / Pricing Callout Footer */}
              <div className="w-full space-y-1.5 pt-1 text-center">
                {activeType === 'service' && currentSelectedService && (
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                      <span>Service Price:</span>
                      <span className="font-mono text-purple-700 text-sm">₹{currentSelectedService.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold mt-0.5">
                      <span>10% Advance Deposit:</span>
                      <span className="font-mono">₹{currentSelectedService.advanceDeposit || Math.round(currentSelectedService.price * 0.1)}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Scan with any camera to lock your VIP slot
                    </p>
                  </div>
                )}

                {activeType === 'booking' && (
                  <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-200 text-[11px] text-indigo-950 font-medium">
                    <div>10% Advance Slot Reservation • No Waiting Queue</div>
                    <div className="text-[10px] text-indigo-700 font-bold mt-0.5">
                      {bookingCoupon ? `Use Code: ${bookingCoupon}` : 'Verified Master Stylists'}
                    </div>
                  </div>
                )}

                {activeType === 'offer' && (
                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-medium">
                    <span>Active Promo Code: <strong className="font-mono text-emerald-700">{selectedOfferCode}</strong></span>
                  </div>
                )}

                {activeType === 'upi' && (
                  <div className="text-[11px] text-zinc-600 font-medium">
                    <span>Amount: <strong className="text-purple-700 font-mono">₹{upiAmount || 'Custom'}</strong> • GPay / PhonePe / Paytm</span>
                  </div>
                )}

                {activeType === 'wifi' && (
                  <div className="text-[11px] text-zinc-600 font-medium">
                    <span>Network: <strong className="text-purple-700">{wifiSsid}</strong></span>
                  </div>
                )}

                <div className="text-[10px] text-zinc-400 font-medium pt-1">
                  B.N. Gund Complex, Shivaji Chowk, Mohol • +91 {settings.phone}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[320px] grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadPng}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/25 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-zinc-700 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Deep Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="w-full max-w-[320px] py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Table Stand / Flyer Format</span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
