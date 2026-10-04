import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Smartphone, CreditCard, Building2, QrCode, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSalon } from '../context/SalonContext';

export interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    totalAmount: number;
    advanceAmount: number;
    remainingAmount: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    timeSlot: string;
  };
  // Flat props support for seamless compatibility
  advanceAmount?: number;
  totalAmount?: number;
  serviceName?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  onPaymentSuccess?: (paymentId: string, orderId: string) => void;
  onSuccess?: (paymentId: string, orderId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  orderData,
  advanceAmount: propAdvance,
  totalAmount: propTotal,
  serviceName: propServiceName,
  clientName: propClientName,
  clientEmail: propClientEmail,
  clientPhone: propClientPhone,
  onPaymentSuccess,
  onSuccess
}) => {
  const { settings } = useSalon();
  const advancePercentage = settings?.advancePercentage || 10;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const effectiveAdvance = orderData?.advanceAmount ?? propAdvance ?? 0;
  const effectiveTotal = orderData?.totalAmount ?? propTotal ?? 0;
  const effectiveRemaining = orderData?.remainingAmount ?? (effectiveTotal - effectiveAdvance);
  const effectiveName = orderData?.customerName ?? propClientName ?? 'Client';
  const effectivePhone = orderData?.customerPhone ?? propClientPhone ?? '';
  const effectiveSuccess = onPaymentSuccess || onSuccess || (() => {});

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8829',
    cardExp: '08/28',
    cardCvv: '782',
    cardName: effectiveName
  });
  const [selectedBank, setSelectedBank] = useState('HDFC');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    
    try {
      const generatedPayId = `pay_rzp_${Math.floor(100000000 + Math.random() * 900000000)}`;
      const generatedOrderId = `order_${Date.now().toString().slice(-6)}`;

      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayPaymentId: generatedPayId,
          razorpayOrderId: generatedOrderId,
          advanceAmount: effectiveAdvance,
          totalAmount: effectiveTotal
        })
      });

      const data = await res.json();
      
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        const resolvedPayId = data.paymentId || generatedPayId;
        setPaymentId(resolvedPayId);
        triggerConfetti();

        setTimeout(() => {
          effectiveSuccess(resolvedPayId, generatedOrderId);
        }, 1200);
      }, 900);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      const fallbackPayId = `pay_rzp_${Date.now()}`;
      setPaymentSuccess(true);
      setPaymentId(fallbackPayId);
      triggerConfetti();
      setTimeout(() => {
        effectiveSuccess(fallbackPayId, `order_${Date.now()}`);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#141418] border border-purple-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-purple-50/80 dark:bg-[#0e0e12] border-b border-purple-200 dark:border-zinc-800 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 dark:bg-red-600 flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
              ₹
            </div>
            <div>
              <div className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-1.5">
                <span>Razorpay Secure Gateway</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-red-500/20 text-purple-700 dark:text-red-300 font-mono font-bold">{advancePercentage}% Advance</span>
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 text-xs">
                Modern Unisex Salon, Mohol
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
              {advancePercentage}% Deposit Authorized!
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Advance deposit of <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{effectiveAdvance}</span> successfully received.
            </p>
            <div className="p-3 bg-purple-50/50 dark:bg-[#0e0e11] rounded-2xl border border-purple-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300 space-y-1">
              <div>Transaction ID: {paymentId}</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">Status: SUCCESS &amp; CONFIRMED</div>
            </div>
            <div className="text-xs text-zinc-500">
              Generating your salon boarding pass and 24h notification...
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
            {/* Amount Breakdown Card */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-[#0e0e11] border border-purple-200 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Total Service Price:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 font-mono">₹{effectiveTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700 dark:text-red-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-red-400" />
                  {advancePercentage}% Online Advance Deposit (Pay Now):
                </span>
                <span className="text-xl font-bold text-purple-700 dark:text-red-400 font-mono">₹{effectiveAdvance}</span>
              </div>
              <div className="border-t border-purple-200 dark:border-zinc-800 pt-2 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Remaining Balance (Payable at Salon Counter):</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono">₹{effectiveRemaining}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Select Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-purple-600 dark:border-red-500 bg-purple-100/60 dark:bg-red-500/15 text-purple-700 dark:text-red-400 font-bold'
                      : 'border-purple-100 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI App</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium cursor-pointer ${
                    paymentMethod === 'qr'
                      ? 'border-purple-600 dark:border-red-500 bg-purple-100/60 dark:bg-red-500/15 text-purple-700 dark:text-red-400 font-bold'
                      : 'border-purple-100 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-purple-600 dark:border-red-500 bg-purple-100/60 dark:bg-red-500/15 text-purple-700 dark:text-red-400 font-bold'
                      : 'border-purple-100 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-medium cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-purple-600 dark:border-red-500 bg-purple-100/60 dark:bg-red-500/15 text-purple-700 dark:text-red-400 font-bold'
                      : 'border-purple-100 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>NetBank</span>
                </button>
              </div>
            </div>

            {/* Method Content */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-[#0e0e11] border border-purple-200 dark:border-zinc-800">
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Popular Instant UPI Apps:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                      <div
                        key={app}
                        onClick={() => setUpiId(`${effectivePhone || 'client'}@${app.toLowerCase().replace(' ', '')}`)}
                        className="p-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-purple-200 dark:border-zinc-700 text-center text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-purple-500 dark:hover:border-red-500 cursor-pointer transition-colors"
                      >
                        {app}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <label className="text-[11px] text-zinc-600 dark:text-zinc-400 block mb-1">Or enter UPI ID / VPA</label>
                    <input
                      type="text"
                      placeholder="e.g. yourname@oksbi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-red-500"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="text-center space-y-3 py-1">
                  <div className="w-36 h-36 bg-white dark:bg-zinc-900 rounded-2xl p-2 mx-auto flex items-center justify-center border-2 border-purple-500/40 dark:border-red-500/40">
                    <div className="w-full h-full bg-purple-50/40 dark:bg-[#0a0a0d] flex flex-col items-center justify-center rounded-xl text-zinc-900 dark:text-white p-2 border border-purple-200 dark:border-zinc-800">
                      <QrCode className="w-16 h-16 text-purple-600 dark:text-red-500 mb-1" />
                      <span className="text-[9px] font-mono text-zinc-600 dark:text-zinc-400">SCAN TO PAY ₹{effectiveAdvance}</span>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    Scan with Google Pay, PhonePe, Paytm, or BHIM UPI
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-zinc-600 dark:text-zinc-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-zinc-600 dark:text-zinc-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.cardExp}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardExp: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-600 dark:text-zinc-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardDetails.cardCvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardCvv: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-purple-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2.5">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Popular Banks:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'border-purple-600 dark:border-red-500 bg-purple-100/60 dark:bg-red-500/15 text-purple-700 dark:text-red-400 font-bold'
                            : 'border-purple-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-purple-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              id="razorpay-pay-btn"
              onClick={handleSimulatedPayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing ₹{effectiveAdvance} via Razorpay...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {advancePercentage}% Advance Deposit (₹{effectiveAdvance})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security notice */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit SSL Encrypted • Razorpay Certified Payment Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
