import React, { useState } from 'react';
import { Sparkles, Calendar, Eye, X, ChevronRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { GalleryItem, GalleryCategory } from '../types';

export const CustomerGallery: React.FC = () => {
  const { gallery, openBookingModal } = useSalon();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories: GalleryCategory[] = [
    'All',
    'Bridal',
    'Hair Care',
    'Skin Care',
    'Salon Interior',
    'Nail Art',
    'Spa'
  ];

  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Bridal') return item.category === 'Bridal' || item.tag.includes('Bridal');
    if (activeCategory === 'Hair Care') return item.category === 'Hair Care' || item.category === 'Men Grooming' || item.tag.includes('Hair') || item.tag.includes('Men');
    if (activeCategory === 'Skin Care') return item.category === 'Skin Care' || item.tag.includes('Skin');
    if (activeCategory === 'Salon Interior') return item.category === 'Salon Interior';
    if (activeCategory === 'Nail Art') return item.category === 'Nail Art';
    if (activeCategory === 'Spa') return item.category === 'Spa';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-12 space-y-8 text-left">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon Portfolio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Our Work &amp; Transformations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Take a look at recent haircuts, glowing facials, bridal makeovers, and our modern salon interior in Mohol.
          </p>
        </div>

        <button
          onClick={() => openBookingModal()}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredGallery.map(item => (
          <div
            key={item.id}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image */}
            <div
              className="relative h-64 overflow-hidden cursor-pointer bg-zinc-100 dark:bg-zinc-800"
              onClick={() => setActiveLightboxItem(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white shadow-lg">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[11px] font-semibold text-amber-300">
                {item.tag}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-1">
              <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeLightboxItem.imageUrl}
              alt={activeLightboxItem.title}
              className="w-full h-80 sm:h-96 object-cover"
            />

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  {activeLightboxItem.category} • {activeLightboxItem.tag}
                </span>
                <button
                  onClick={() => {
                    setActiveLightboxItem(null);
                    openBookingModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book This Style</span>
                </button>
              </div>

              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {activeLightboxItem.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {activeLightboxItem.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
