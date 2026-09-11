import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAssistantWidget: React.FC = () => {
  const { isAiChatOpen, toggleAiChat, closeAiChat, openBookingModal, openQuizModal } = useSalon();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaste & Welcome to Smart Salon! ✨ I am your AI Beauty & Grooming Consultant. How can I help you today? You can ask about our treatments, hair/skin advice, special offers, or our 10% advance booking system.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || "I am glad to help you pick the best salon treatments. Would you like to reserve a slot with our 10% advance deposit?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: "Our master stylists offer world-class facials, haircuts, and bridal makeovers! You can book online right now with a 10% advance deposit via Razorpay.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "How does the 10% advance deposit work?",
    "Recommend a facial for dull skin",
    "What bridal makeover packages do you offer?",
    "Executive men beard & haircut cost"
  ];

  return (
    <>
      {/* Floating Widget Trigger Button (Matches Screenshot 2 & 3) */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
        <button
          id="ai-assistant-floating-btn"
          onClick={toggleAiChat}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl shadow-yellow-500/30 border border-yellow-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          <span>AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
        </button>
      </div>

      {/* Expandable Chat Drawer/Modal */}
      {isAiChatOpen && (
        <div className="fixed inset-x-3 bottom-20 sm:inset-x-auto sm:bottom-20 sm:right-6 z-50 sm:w-96 max-w-md rounded-2xl bg-[#141418] border border-yellow-500/40 shadow-2xl overflow-hidden flex flex-col h-[480px] sm:h-[520px] max-h-[80vh] text-zinc-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-[#1c190c] to-zinc-950 border-b border-yellow-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-yellow-400 flex items-center gap-1.5">
                  <span>Smart Salon AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Online</span>
                </div>
                <div className="text-[10px] text-zinc-400">Beauty & Booking Consultant</div>
              </div>
            </div>

            <button
              onClick={closeAiChat}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Info Badge */}
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-3 py-1.5 text-[11px] text-yellow-300/90 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              10% Advance Deposit Razorpay Gateway
            </span>
            <button
              onClick={() => {
                closeAiChat();
                openQuizModal();
              }}
              className="underline text-yellow-400 font-semibold"
            >
              Take Quiz
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 text-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-yellow-500 text-black font-medium rounded-tr-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`text-[9px] ${msg.sender === 'user' ? 'text-black/70' : 'text-zinc-500'} text-right`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-zinc-400">
                <div className="w-7 h-7 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>AI Expert typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-zinc-800/80 bg-zinc-950/60 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-yellow-500/20 border border-zinc-800 hover:border-yellow-500/40 text-[10px] text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-zinc-800 bg-[#121215] flex gap-2">
            <input
              type="text"
              placeholder="Ask about treatments, pricing, offers..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="p-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black font-bold transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
