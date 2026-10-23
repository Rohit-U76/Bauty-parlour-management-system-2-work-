import React, { useState } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Users,
  Search,
  Sparkles,
  Smartphone,
  Tag,
  ArrowRight,
  ChevronRight,
  Radio,
  Send,
  Calendar,
  Gift
} from 'lucide-react';
import { OfferCoupon, WhatsAppBroadcastLog, WhatsAppBroadcastRecipient } from '../types';

interface AdminOfferBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferCoupon | null;
  broadcastResult: WhatsAppBroadcastLog | null;
}

export const AdminOfferBroadcastModal: React.FC<AdminOfferBroadcastModalProps> = ({
  isOpen,
  onClose,
  offer,
  broadcastResult
}) => {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState(0);

  if (!isOpen || !offer) return null;

  const recipients = broadcastResult?.recipients || [];
  const totalCount = recipients.length;

  const filteredRecipients = recipients.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.phone.includes(q);
  });

  const activeRecipient: WhatsAppBroadcastRecipient | undefined =
    filteredRecipients[selectedRecipientIndex] || filteredRecipients[0];

  const handleCopyMessage = () => {
    const textToCopy = broadcastResult?.messageText || '';
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleCopyNumbers = () => {
    const phones = recipients.map(r => r.formattedPhone).join(', ');
    navigator.clipboard?.writeText(phones);
    setCopiedNumbers(true);
    setTimeout(() => setCopiedNumbers(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(offer.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const discountText = offer.discountPercent
    ? `${offer.discountPercent}% OFF`
    : (offer.discountAmount ? `₹${offer.discountAmount} OFF` : 'Special Discount');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-left flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shadow-md shadow-emerald-500/10 shrink-0">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  WhatsApp Broadcast Active
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {totalCount} Dynamic Clients Reached
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-100 mt-1 flex items-center gap-2">
                <span>Offer Dispatched to All Clients</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
          
          {/* Offer Summary Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-amber-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold text-amber-400 bg-zinc-950 px-3 py-1 rounded-xl border border-amber-500/40 shadow-sm flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  {offer.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  {discountText}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="text-zinc-400 hover:text-zinc-200 p-1"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <h4 className="font-bold text-sm text-zinc-100">{offer.title}</h4>
              <p className="text-[11px] text-zinc-400 max-w-xl">{offer.description}</p>
            </div>

            <div className="shrink-0 text-right space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-4">
              <div className="text-[10px] text-zinc-400">Min Order: <strong className="text-zinc-200">₹{offer.minBookingAmount || 0}</strong></div>
              <div className="text-[10px] text-zinc-400">Valid Till: <strong className="text-zinc-200">{offer.validTill || offer.expiryDate || '2026-12-31'}</strong></div>
              <div className="text-[10px] text-emerald-400 font-semibold">10% Advance Booking Auto-Applied</div>
            </div>
          </div>

          {/* Broadcast Quick Tools Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyMessage}
              className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-zinc-200 text-xs">Copy WhatsApp Promo Text</div>
                  <div className="text-[10px] text-zinc-400">Complete message formatted with booking link</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 shrink-0">
                {copiedMessage ? 'Copied!' : 'Copy'}
              </span>
            </button>

            <button
              onClick={handleCopyNumbers}
              className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-zinc-200 text-xs">Copy All Client Numbers ({totalCount})</div>
                  <div className="text-[10px] text-zinc-400">For WhatsApp Web Broadcast List / Groups</div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 shrink-0">
                {copiedNumbers ? 'Copied!' : 'Copy List'}
              </span>
            </button>
          </div>

          {/* Dynamic Client Directory & 1-Click WhatsApp Dispatch */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-zinc-200">
                  Target Clients ({filteredRecipients.length} of {totalCount})
                </h4>
                <span className="text-[11px] text-zinc-500">
                  Includes past visits, booking history &amp; registered accounts
                </span>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search client or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Recipient Cards Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden max-h-72 overflow-y-auto">
              {filteredRecipients.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 space-y-1">
                  <p>No client contacts match your search.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {filteredRecipients.map((rec, idx) => (
                    <div
                      key={rec.id || `rec-${idx}`}
                      className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {rec.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="font-semibold text-zinc-200 truncate flex items-center gap-1.5">
                            <span>{rec.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-mono">
                              {rec.source === 'customer' ? 'CRM Client' : rec.source === 'appointment' ? 'Booking History' : 'Registered User'}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400">
                            +91 {rec.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={rec.whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                          title="Open WhatsApp Chat with prefilled offer message"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send</span>
                        </a>

                        <a
                          href={rec.webWhatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                          title="Open in WhatsApp Web"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Live WhatsApp Message Preview */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Message Preview (as seen by client)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                WhatsApp Unicode &amp; NPCI Link Compliant
              </span>
            </div>
            <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {broadcastResult?.messageText || 'Message template will appear here'}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-zinc-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Dynamic sync: any new client registering in the future will automatically be included on future blasts.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs cursor-pointer transition-colors"
            >
              Done &amp; Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
