import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, RefreshCw, Wand2, Lightbulb } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface AiPackage {
  packageTitle: string;
  recommendedServices: string[];
  estimatedTotal: number;
  advanceDeposit: number;
  expertReason: string;
  routineTip: string;
}

export const SmartRecommendationQuiz: React.FC = () => {
  const { isQuizModalOpen, closeQuizModal, openBookingModal, services } = useSalon();

  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<string>("Women's Salon");
  const [serviceInterest, setServiceInterest] = useState<string>("Skin Glow & Radiance");
  const [concern, setConcern] = useState<string>("Dull skin & uneven tone");
  const [occasion, setOccasion] = useState<string>("Upcoming Party / Event this week");
  const [budget, setBudget] = useState<string>("₹1,500 - ₹3,000 (Executive Care)");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<AiPackage[]>([]);

  if (!isQuizModalOpen) return null;

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setStep(5);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          serviceInterest,
          hairOrSkinConcern: concern,
          occasion,
          budgetRange: budget
        })
      });
      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      } else if (data.recommendations && typeof data.recommendations === 'object') {
        setRecommendations(Object.values(data.recommendations));
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setRecommendations([
        {
          packageTitle: `${serviceInterest} Signature Revitalizer`,
          recommendedServices: ['Radiance Facial Therapy', 'Layered Haircut & Styling'],
          estimatedTotal: 2650,
          advanceDeposit: 265,
          expertReason: `Perfect balance addressing ${concern} for ${occasion}.`,
          routineTip: 'Drink 3L water daily and use gentle hyaluronic serum.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPackage = (pkg: AiPackage) => {
    closeQuizModal();
    // Match service if possible
    const firstRec = Array.isArray(pkg.recommendedServices) ? (pkg.recommendedServices[0] || '') : (typeof pkg.recommendedServices === 'string' ? pkg.recommendedServices : '');
    const pkgTitle = pkg.packageTitle || '';
    
    const match = services.find(s => {
      const sName = (s.name || '').toLowerCase();
      return (firstRec && sName.includes(firstRec.toLowerCase())) ||
        (pkgTitle && pkgTitle.toLowerCase().includes(sName));
    }) || services[0];
    
    openBookingModal(match);
  };

  const handleReset = () => {
    setStep(1);
    setRecommendations([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#121216] border border-yellow-500/30 rounded-2xl shadow-2xl overflow-hidden text-zinc-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-[#1a170b] to-zinc-950 border-b border-yellow-500/20 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shrink-0">
              <Wand2 className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-yellow-400">
                AI Smart Recommendation Quiz
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                Tailored beauty &amp; grooming selection matched to your needs
              </p>
            </div>
          </div>

          <button
            onClick={closeQuizModal}
            className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Steps */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                Step 1 of 4: Who are we styling today?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Women's Salon & Haircare", desc: 'Facials, layered haircuts, styling & keratin' },
                  { title: "Men's Executive Grooming", desc: 'Beard trimming, taper fades & charcoal facial' },
                  { title: "HD Bridal & Pre-Bridal", desc: 'Complete wedding looks & pre-bridal therapy' },
                  { title: "Unisex Spa & Nail Art", desc: 'Aromatherapy, gel nail extensions & relaxation' }
                ].map(opt => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setGender(opt.title)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      gender === opt.title
                        ? 'border-yellow-400 bg-yellow-500/10 shadow-md shadow-yellow-500/10'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-zinc-200 flex items-center justify-between">
                      <span>{opt.title}</span>
                      {gender === opt.title && <Check className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                Step 2 of 4: What is your primary beauty focus?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Skin Glow & Pore Cleansing Facial',
                  'Hair Makeover, Cut & Keratin Therapy',
                  'Executive Beard Edging & Precision Haircut',
                  'Bridal High-Definition Glam Makeover',
                  'Nail Extensions & Hand Rejuvenation',
                  'Full Body Aromatherapy Relaxation Spa'
                ].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setServiceInterest(item)}
                    className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                      serviceInterest === item
                        ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      {serviceInterest === item && <Check className="w-4 h-4 text-yellow-400" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-xs text-zinc-400 hover:text-white">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                Step 3 of 4: Any specific concerns or occasion?
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">Primary Concern</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Dull skin & uneven sun tan',
                    'Frizzy & damaged hair texture',
                    'Beard patchiness & rough skin',
                    'Split ends & lack of volume'
                  ].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setConcern(c)}
                      className={`p-2.5 rounded-lg border text-xs text-left ${
                        concern === c ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300' : 'border-zinc-800 bg-zinc-900'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">Upcoming Occasion / Timeline</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                >
                  <option value="Upcoming Party / Event this week">Upcoming Party / Event this week</option>
                  <option value="Wedding / Engagement in 1-2 months">Wedding / Engagement in 1-2 months</option>
                  <option value="Weekend Self-Care Refresh">Weekend Self-Care Refresh</option>
                  <option value="Regular Monthly Maintenance">Regular Monthly Maintenance</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button onClick={() => setStep(2)} className="text-xs text-zinc-400 hover:text-white">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                Step 4 of 4: Preferred budget range
              </div>
              <div className="space-y-2.5">
                {[
                  { range: 'Under ₹1,000', note: 'Essential cuts, basic cleanups, express grooming' },
                  { range: '₹1,000 - ₹3,000 (Recommended)', note: 'Radiance facials, layered cuts with styling & spa' },
                  { range: '₹3,000 - ₹8,000+', note: 'Full HD bridal packages, Keratin treatment & luxury combos' }
                ].map(b => (
                  <button
                    key={b.range}
                    type="button"
                    onClick={() => setBudget(b.range)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      budget === b.range
                        ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center justify-between">
                      <span>{b.range}</span>
                      {budget === b.range && <Check className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{b.note}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button onClick={() => setStep(3)} className="text-xs text-zinc-400 hover:text-white">
                  Back
                </button>
                <button
                  onClick={handleGenerateRecommendations}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with AI</span>
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              {loading ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
                  <div className="font-serif text-lg font-bold text-yellow-400">
                    Consulting AI Beauty Expert...
                  </div>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Analyzing skin texture, occasion timeline, and calculating precise 10% advance deposit bundles.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Matched Profile</div>
                      <h4 className="font-serif text-lg font-bold text-yellow-400">
                        Tailored Recommendations
                      </h4>
                    </div>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                    {recommendations.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1a11] via-[#141418] to-zinc-950 border border-yellow-500/30 space-y-3 shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                              AI Best Match #{idx + 1}
                            </span>
                            <h5 className="font-serif text-base font-bold text-zinc-100 mt-1">
                              {pkg.packageTitle}
                            </h5>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold text-zinc-100">₹{pkg.estimatedTotal}</div>
                            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              10% Adv: ₹{pkg.advanceDeposit}
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                          <div className="text-yellow-400 font-semibold">Included Services:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.recommendedServices.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-200">
                                • {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-zinc-400 leading-relaxed flex items-start gap-1.5">
                          <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                          <span>{pkg.expertReason}</span>
                        </div>

                        <div className="border-t border-zinc-800/80 pt-2 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-500">Pay 10% online via Razorpay</span>
                          <button
                            type="button"
                            onClick={() => handleBookPackage(pkg)}
                            className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-yellow-500/10 cursor-pointer"
                          >
                            <span>Book This Package</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
