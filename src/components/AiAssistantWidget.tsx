import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const renderInlineFormatted = (text: string) => {
  // Parse **bold** parts
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-purple-700 dark:text-yellow-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const FormattedAiMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const isBulletLine = (line: string) => {
    return (
      line.startsWith('•') ||
      line.startsWith('* ') ||
      line.startsWith('- ') ||
      /^\d+\.\s/.test(line)
    );
  };

  const cleanBullet = (line: string) => {
    return line.replace(/^[•\*\-]\s*/, '').replace(/^\d+\.\s*/, '');
  };

  const elements: React.ReactNode[] = [];
  let currentBullets: string[] = [];

  const flushBullets = (keyIdx: number) => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={`ul-${keyIdx}`} className="space-y-1.5 my-1.5 pl-1">
          {currentBullets.map((bullet, bIdx) => (
            <li key={bIdx} className="flex items-start gap-2 text-[11px] sm:text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-yellow-400 shrink-0 mt-1.5"></span>
              <span className="leading-relaxed">{renderInlineFormatted(bullet)}</span>
            </li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, idx) => {
    if (isBulletLine(line)) {
      currentBullets.push(cleanBullet(line));
    } else {
      flushBullets(idx);
      elements.push(
        <p key={`p-${idx}`} className="text-[11px] sm:text-xs leading-relaxed">
          {renderInlineFormatted(line)}
        </p>
      );
    }
  });

  flushBullets(lines.length);

  return <div className="space-y-1.5">{elements}</div>;
};

export const AiAssistantWidget: React.FC = () => {
  const { isAiChatOpen, toggleAiChat, closeAiChat, openQuizModal, settings } = useSalon();
  
  const advPct = settings.advancePercentage || 10;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `✨ **Welcome to Smart Salon!**\nI am your AI Beauty & Grooming Consultant.\n• Ask about our hair styling, facials, bridal & grooming\n• Explore current seasonal promotions & discounts\n• Inquire about our transparent ${advPct}% online advance booking policy.\nHow can I help you today?`,
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
        text: data.reply || `I am glad to help you pick the best salon treatments. Would you like to reserve a slot with our ${advPct}% advance deposit?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `✨ **Smart Salon Services:**\n• **Facials & Glow:** Radiance facial & hydra deep pore treatments\n• **Hair Care:** Precision cuts, Brazilian keratin smoothing\n• **Advance Deposit:** Only **${advPct}%** online to reserve your slot!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    `How does the ${advPct}% advance deposit work?`,
    "Recommend a facial for dull skin",
    "What bridal makeover packages do you offer?",
    "Executive men beard & haircut cost"
  ];

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          id="ai-assistant-floating-btn"
          onClick={toggleAiChat}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-gradient-to-r dark:from-yellow-500 dark:to-amber-500 dark:hover:from-yellow-400 dark:hover:to-amber-400 dark:text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl shadow-purple-600/30 dark:shadow-yellow-500/30 border border-purple-400/40 dark:border-yellow-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
          <span>AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-700 animate-pulse"></span>
        </button>
      </div>

      {/* Expandable Chat Drawer/Modal */}
      {isAiChatOpen && (
        <div className="fixed inset-x-3 bottom-20 sm:inset-x-auto sm:bottom-20 sm:right-6 z-50 sm:w-96 max-w-md rounded-2xl bg-white dark:bg-[#141418] border border-purple-300 dark:border-yellow-500/40 shadow-2xl overflow-hidden flex flex-col h-[480px] sm:h-[520px] max-h-[75vh] text-zinc-900 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-purple-50/80 dark:bg-gradient-to-r dark:from-zinc-950 dark:via-[#1c190c] dark:to-zinc-950 border-b border-purple-200 dark:border-yellow-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/15 dark:bg-yellow-500/20 border border-purple-300 dark:border-yellow-500/40 flex items-center justify-center text-purple-700 dark:text-yellow-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-yellow-400 flex items-center gap-1.5">
                  <span>Smart Salon AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono font-bold">Online</span>
                </div>
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400">Beauty &amp; Booking Consultant</div>
              </div>
            </div>

            <button
              onClick={closeAiChat}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Info Badge */}
          <div className="bg-purple-100/70 dark:bg-yellow-500/10 border-b border-purple-200 dark:border-yellow-500/20 px-3 py-1.5 text-[11px] text-purple-950 dark:text-yellow-300/90 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-yellow-400" />
              {advPct}% Advance Deposit Razorpay Gateway
            </span>
            <button
              onClick={() => {
                closeAiChat();
                openQuizModal();
              }}
              className="underline text-purple-800 dark:text-yellow-400 font-bold cursor-pointer"
            >
              Take Quiz
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-purple-50/20 dark:bg-transparent">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-yellow-500/20 border border-purple-200 dark:border-yellow-500/30 flex items-center justify-center text-purple-700 dark:text-yellow-400 shrink-0 text-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white dark:bg-yellow-500 dark:text-black font-medium rounded-tr-none'
                      : 'bg-white dark:bg-zinc-900 border border-purple-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 rounded-tl-none space-y-1.5'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <FormattedAiMessage text={msg.text} />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <div className={`text-[9px] ${msg.sender === 'user' ? 'text-white/80 dark:text-black/70' : 'text-zinc-500 dark:text-zinc-500'} text-right mt-1`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-zinc-600 dark:text-zinc-400">
                <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-yellow-500/20 flex items-center justify-center text-purple-700 dark:text-yellow-400 animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>AI Expert typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-purple-200/80 dark:border-zinc-800/80 bg-purple-50/50 dark:bg-zinc-950/60 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 hover:bg-purple-100 dark:hover:bg-yellow-500/20 border border-purple-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-yellow-500/40 text-[10px] text-zinc-900 dark:text-zinc-300 hover:text-purple-800 dark:hover:text-yellow-400 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-purple-200 dark:border-zinc-800 bg-white dark:bg-[#121215] flex gap-2">
            <input
              type="text"
              placeholder="Ask about treatments, pricing, offers..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 rounded-xl bg-purple-50/40 dark:bg-zinc-950 border border-purple-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-purple-600 dark:focus:border-yellow-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 disabled:opacity-40 text-white dark:text-black font-bold transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
