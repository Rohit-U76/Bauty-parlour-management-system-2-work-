import React, { useState } from 'react';
import { 
  Home, 
  Scissors, 
  Calendar, 
  User, 
  MoreHorizontal, 
  Sparkles,
  Plus
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { MobileMoreSheet } from './MobileMoreSheet';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeNavTab, 
    setActiveNavTab, 
    openBookingModal, 
    appointments, 
    currentUser,
    openAuthModal
  } = useSalon();

  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const handleNav = (tab: string) => {
    setActiveNavTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav 
        id="mobile-bottom-navigation-bar"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-200/90 dark:border-zinc-800/90 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] safe-area-pb"
      >
        <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
          
          {/* 1. Home */}
          <button
            id="mobile-nav-tab-home"
            onClick={() => handleNav('home')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeNavTab === 'home'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Home className={`w-5 h-5 mb-0.5 ${activeNavTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          {/* 2. Services / Rate Card */}
          <button
            id="mobile-nav-tab-services"
            onClick={() => handleNav('services')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeNavTab === 'services'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Scissors className={`w-5 h-5 mb-0.5 ${activeNavTab === 'services' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight">Services</span>
          </button>

          {/* 3. Central Prominent Book Button */}
          <div className="relative -top-3 flex flex-col items-center">
            <button
              id="mobile-nav-book-action-btn"
              onClick={() => openBookingModal()}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 active:scale-90 transition-transform cursor-pointer border-2 border-white dark:border-zinc-950"
              aria-label="Book Appointment"
            >
              <Calendar className="w-5 h-5 stroke-[2.5px] text-white" />
            </button>
            <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 tracking-tight mt-0.5">
              Book
            </span>
          </div>

          {/* 4. Visits / Appointments */}
          <button
            id="mobile-nav-tab-appointments"
            onClick={() => handleNav('appointments')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
              activeNavTab === 'appointments'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Calendar className={`w-5 h-5 mb-0.5 ${activeNavTab === 'appointments' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {appointments.length > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-zinc-950 font-extrabold text-[9px]">
                  {appointments.length}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">My Visits</span>
          </button>

          {/* 5. Three Dots "More" Button (Opens Options Sheet with Gallery, About Us, Terms, Offers, etc.) */}
          <button
            id="mobile-nav-tab-more"
            onClick={() => setIsMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              ['gallery', 'about', 'terms', 'offers', 'reviews', 'contact'].includes(activeNavTab) || isMoreSheetOpen
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <div className="p-0.5">
              <MoreHorizontal className="w-5 h-5 mb-0.5 stroke-[2.5px]" />
            </div>
            <span className="text-[10px] tracking-tight">More</span>
          </button>

        </div>
      </nav>

      {/* Hidden Options Sheet Modal */}
      <MobileMoreSheet 
        isOpen={isMoreSheetOpen} 
        onClose={() => setIsMoreSheetOpen(false)} 
      />
    </>
  );
};
