import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Award,
  Clock,
  CalendarCheck,
  Star,
  CheckCircle2,
  Scissors,
  Heart,
  ChevronRight,
  Filter,
  UserCheck,
  BadgeCheck
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Hair Care' | 'Skin & Facial' | 'Bridal & Makeup' | 'Men Grooming' | 'Spa & Wellness';
  experience: string;
  specialties: string[];
  certifications: string[];
  rating: number;
  reviewsCount: number;
  totalClients: number;
  shiftHours: string;
  availability: {
    status: 'Available Today' | 'Limited Slots' | 'Booked Today';
    slotsLeft: number;
    nextAvailableSlot: string;
  };
  bio: string;
  image: string;
}

export const MeetTheTeam: React.FC = () => {
  const { openBookingModal } = useSalon();

  const [activeDept, setActiveDept] = useState<string>('All');
  const [selectedStylistModal, setSelectedStylistModal] = useState<TeamMember | null>(null);

  const team: TeamMember[] = [
    {
      id: 'stylist-1',
      name: 'Vikram Mehta',
      role: 'Creative Director & Master Hair Stylist',
      department: 'Hair Care',
      experience: '14+ Years',
      specialties: ['French Balayage', 'Precision Razor Cuts', 'Olaplex Bond Rebuilding', 'Keratin Smoothing'],
      certifications: ['Toni & Guy Advanced London', "L'Oréal Professionnel Master Colorist"],
      rating: 4.98,
      reviewsCount: 382,
      totalClients: 4200,
      shiftHours: '10:00 AM - 07:30 PM',
      availability: {
        status: 'Available Today',
        slotsLeft: 3,
        nextAvailableSlot: 'Today, 02:45 PM'
      },
      bio: 'Vikram has styled runway models and high-profile clientele across Mumbai and Pune. Specializing in bespoke haircuts customized to bone structure and natural hair flow.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'stylist-2',
      name: 'Kavita Patel',
      role: 'Senior Aesthetician & Skin Therapist',
      department: 'Skin & Facial',
      experience: '10+ Years',
      specialties: ['Hydra-Facial Therapy', 'Dermaplaning & Extraction', 'Korean Glass Skin Facials', 'Anti-Aging Peels'],
      certifications: ['CIDESCO International Aesthetician', 'Dermalogica Certified Expert'],
      rating: 4.96,
      reviewsCount: 410,
      totalClients: 3600,
      shiftHours: '09:30 AM - 06:30 PM',
      availability: {
        status: 'Limited Slots',
        slotsLeft: 1,
        nextAvailableSlot: 'Today, 04:30 PM'
      },
      bio: 'Kavita brings clinical expertise to holistic skincare therapies. Her customized facial protocols deliver immediate radiance while protecting the dermal barrier.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'stylist-3',
      name: 'Sunita Roy',
      role: 'Bridal Makeover Director',
      department: 'Bridal & Makeup',
      experience: '12+ Years',
      specialties: ['HD Airbrush Makeup', 'Traditional Bridal Draping', 'Editorial Glam', 'Pre-Bridal Glow Rituals'],
      certifications: ['Kryolan Professional Makeup Master', 'Mario Dedivanovic Masterclass'],
      rating: 4.99,
      reviewsCount: 520,
      totalClients: 1850,
      shiftHours: '09:00 AM - 08:00 PM',
      availability: {
        status: 'Available Today',
        slotsLeft: 2,
        nextAvailableSlot: 'Today, 05:00 PM'
      },
      bio: 'Having directed over 1,200 bridal transformations, Sunita is celebrated for creating weightless, waterproof, and photogenic bridal looks that last all night.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'stylist-4',
      name: 'Sameer Khan',
      role: 'Executive Men Grooming Specialist',
      department: 'Men Grooming',
      experience: '9+ Years',
      specialties: ['Skin Fade Tapers', 'Hot Towel Charcoal Shaves', 'Beard Contour Sculpting', 'Scalp Rejuvenation'],
      certifications: ['Wahl Master Barber Academy', 'Truefitt & Hill Certified'],
      rating: 4.94,
      reviewsCount: 310,
      totalClients: 2900,
      shiftHours: '10:30 AM - 08:30 PM',
      availability: {
        status: 'Available Today',
        slotsLeft: 4,
        nextAvailableSlot: 'Today, 01:30 PM'
      },
      bio: 'Sameer combines classic barber craftsmanship with contemporary sharp styling for executive haircuts, clean beard alignments, and stress-relieving head massages.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'stylist-5',
      name: 'Rhea Fernandes',
      role: 'Senior Colorist & Texture Specialist',
      department: 'Hair Care',
      experience: '8+ Years',
      specialties: ['Ash & Honey Highlights', 'Cysteine & Botox Smoothing', 'Root Melt & Shadow Tones', 'Curly Hair Care'],
      certifications: ['Schwarzkopf Royal Colorist', 'Brazilian Blowout Certified'],
      rating: 4.92,
      reviewsCount: 245,
      totalClients: 2100,
      shiftHours: '11:00 AM - 08:00 PM',
      availability: {
        status: 'Booked Today',
        slotsLeft: 0,
        nextAvailableSlot: 'Tomorrow, 11:00 AM'
      },
      bio: 'Passionate about custom tone mapping and damage-free color formulation that enhances individual skin undertones with high shine.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'stylist-6',
      name: 'Aarti Kulkarni',
      role: 'Holistic Spa & Body Therapist',
      department: 'Spa & Wellness',
      experience: '11+ Years',
      specialties: ['Deep Tissue Massage', 'Aromatherapy Reflexology', 'Ayurvedic Herb Wraps', 'Hot Stone Therapy'],
      certifications: ['Ayush Ministry Certified Therapist', 'Thai Spa Academy Bangkok'],
      rating: 4.97,
      reviewsCount: 290,
      totalClients: 2400,
      shiftHours: '10:00 AM - 07:00 PM',
      availability: {
        status: 'Available Today',
        slotsLeft: 2,
        nextAvailableSlot: 'Today, 03:30 PM'
      },
      bio: 'Aarti crafts tranquil therapy sessions using organic essential oils and targeted acupressure to dissolve muscle tension and restore full-body equilibrium.',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const departments = ['All', 'Hair Care', 'Skin & Facial', 'Bridal & Makeup', 'Men Grooming', 'Spa & Wellness'];

  const filteredTeam = useMemo(() => {
    if (activeDept === 'All') return team;
    return team.filter((member) => member.department === activeDept);
  }, [activeDept]);

  const handleBookWithMember = (member: TeamMember) => {
    openBookingModal();
  };

  return (
    <section className="space-y-8 pt-4">
      {/* SECTION TITLE */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>MEET THE TEAM</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          Senior Stylists &amp; Master Aestheticians
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Every artist at Smart Salon holds international credentials, brings over 8+ years of dedicated craft experience, and provides one-on-one personalized consultations.
        </p>
      </div>

      {/* DEPARTMENT FILTER PILLS */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            onClick={() => setActiveDept(dept)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeDept === dept
                ? 'bg-yellow-500 text-black font-bold shadow-md shadow-yellow-500/10'
                : 'bg-[#141418] border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => {
          const isAvailable = member.availability.status === 'Available Today';
          const isLimited = member.availability.status === 'Limited Slots';

          return (
            <div
              key={member.id}
              className="rounded-3xl border transition-all overflow-hidden flex flex-col justify-between group bg-[#131317] border-zinc-800/90 hover:border-yellow-500/50 shadow-xl"
            >
              <div>
                {/* Image Header with Availability Badge */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-md ${
                        isAvailable
                          ? 'bg-emerald-500/90 text-white'
                          : isLimited
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-zinc-800/90 text-zinc-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAvailable
                            ? 'bg-white animate-pulse'
                            : isLimited
                            ? 'bg-white'
                            : 'bg-zinc-400'
                        }`}
                      />
                      <span>{member.availability.status}</span>
                    </span>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-yellow-400 font-mono text-[11px] font-bold">
                      {member.experience}
                    </span>
                  </div>

                  {/* Name and Rating overlay at bottom of image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white leading-snug">
                        {member.name}
                      </h3>
                      <div className="text-xs text-yellow-400 font-medium">
                        {member.role}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{member.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  {/* Bio */}
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Specializations Tags */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Scissors className="w-3 h-3 text-yellow-500" />
                      <span>Key Specializations</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications & Timing Strip */}
                  <div className="p-3 rounded-2xl border space-y-1.5 text-xs bg-[#0f0f12] border-zinc-800/80">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-500" />
                        <span>Shift Hours:</span>
                      </span>
                      <span className="font-mono text-zinc-300 font-semibold">{member.shiftHours}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="w-3 h-3 text-emerald-400" />
                        <span>Next Slot:</span>
                      </span>
                      <span className="font-semibold text-emerald-400">{member.availability.nextAvailableSlot}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-zinc-800/80 bg-[#101014]">
                <button
                  type="button"
                  onClick={() => handleBookWithMember(member)}
                  className="w-full py-2.5 px-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Book with {member.name.split(' ')[0]} (10% Adv)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SALON HYGIENE & CERTIFICATION GUARANTEE */}
      <div className="p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all bg-[#141418] border-zinc-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-zinc-100">
              100% Certified Master Artists &amp; Sterilization Standards
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
              All tools undergo hospital-grade medical autoclave sterilization between each client. Our staff completes monthly advanced training seminars in Paris, London, and Tokyo styling methodologies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <span>Book Appointment Online</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
