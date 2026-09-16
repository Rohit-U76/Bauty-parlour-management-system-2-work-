import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  PlusCircle,
  ThumbsUp,
  Calendar,
  X,
  Award,
  Search,
  Filter,
  User,
  Scissors
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Review } from '../types';

export const CustomerReviewsPage: React.FC = () => {
  const { reviews, addReview, services, openBookingModal } = useSalon();

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});
  const [userLikedReviews, setUserLikedReviews] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review Form
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    rating: 5,
    serviceName: services[0]?.name || 'O3+ Diamond Glow Facial',
    comment: ''
  });

  const categories = [
    'All',
    'Facials & Skin',
    'Bridal & Makeup',
    'Hair Treatments',
    'Haircut & Styling',
    "Men's Grooming"
  ];

  // Metrics
  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '4.9';

  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      if (selectedCategory !== 'All') {
        const sName = rev.serviceName.toLowerCase();
        if (selectedCategory === 'Facials & Skin' && !sName.includes('facial') && !sName.includes('skin') && !sName.includes('glow')) return false;
        if (selectedCategory === 'Bridal & Makeup' && !sName.includes('make up') && !sName.includes('makeup') && !sName.includes('bridal')) return false;
        if (selectedCategory === 'Hair Treatments' && !sName.includes('keratin') && !sName.includes('rebonding') && !sName.includes('color')) return false;
        if (selectedCategory === 'Haircut & Styling' && !sName.includes('cut') && !sName.includes('styling')) return false;
        if (selectedCategory === "Men's Grooming" && !sName.includes('men') && !sName.includes('grooming') && !sName.includes('beard')) return false;
      }

      if (minRating > 0 && rev.rating < minRating) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesClient = rev.clientName.toLowerCase().includes(q);
        const matchesService = rev.serviceName.toLowerCase().includes(q);
        const matchesComment = rev.comment.toLowerCase().includes(q);
        if (!matchesClient && !matchesService && !matchesComment) return false;
      }

      return true;
    });
  }, [reviews, selectedCategory, minRating, searchQuery]);

  const handleLikeReview = (reviewId: string) => {
    if (userLikedReviews[reviewId]) return;
    setUserLikedReviews(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulLikes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.comment.trim()) {
      alert('Please enter your name and review.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      clientName: formData.clientName.trim(),
      rating: formData.rating,
      date: todayStr,
      serviceName: formData.serviceName,
      comment: formData.comment.trim(),
      verifiedBooking: true
    };

    addReview(newRev);
    setIsWriteModalOpen(false);
    setToastMessage('Thank you! Your review has been submitted.');
    setTimeout(() => setToastMessage(null), 4000);

    setFormData({
      clientName: '',
      phone: '',
      rating: 5,
      serviceName: services[0]?.name || 'O3+ Diamond Glow Facial',
      comment: ''
    });
  };

  return (
    <div className="space-y-8 pb-28 lg:pb-16 pt-4 sm:pt-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Customer Reviews</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            What Our Clients Say
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Real feedback from customers in Mohol who booked haircuts, facials, bridal packages, and styling.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 shrink-0">
          <div className="text-center">
            <div className="text-4xl font-bold font-serif text-amber-500">{avgRating}</div>
            <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Based on {totalReviewsCount}+ reviews
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by client name, service, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredReviews.map(rev => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{rev.clientName}</h3>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{rev.serviceName}</div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">Verified Visit</span>
                <span>•</span>
                <span className="text-[11px]">{rev.date}</span>
              </div>

              <button
                onClick={() => handleLikeReview(rev.id)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition ${
                  userLikedReviews[rev.id]
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{(helpfulLikes[rev.id] || 0) + 1}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="text-zinc-400 text-sm">No reviews found matching your search.</div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-amber-500 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">Write a Review</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Share your salon experience with others</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Deshmukh"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Service Received</label>
                <select
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-amber-500 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating ? 'fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {formData.rating} Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Your Feedback *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the hygiene, stylist skill, and results..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
