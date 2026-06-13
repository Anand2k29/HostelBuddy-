import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';

// Animated Pixel Art Librarian Villager Head SVG
const LibrarianAvatar: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 8 8" 
    shapeRendering="crispEdges"
    className="animate-float"
  >
    {/* Hair/Hood (Dark Brown) */}
    <rect x="1" y="1" width="6" height="6" fill="#3c2d1e" />
    {/* Skin/Face (Tan/Peach) */}
    <rect x="1" y="2" width="6" height="5" fill="#bd8e62" />
    {/* Eyebrows (Connected monobrow - Dark Brown) */}
    <rect x="2" y="2" width="4" height="1" fill="#291e14" />
    {/* Eyes (White + Green Pupil) */}
    <rect x="2" y="3" width="1" height="1" fill="#ffffff" />
    <rect x="5" y="3" width="1" height="1" fill="#ffffff" />
    <rect x="2" y="3" width="1" height="1" fill="#00e676" clipPath="inset(0 0 0 0.5)" />
    <rect x="5" y="3" width="1" height="1" fill="#00e676" clipPath="inset(0 0.5 0 0)" />
    <rect x="2.5" y="3" width="0.5" height="1" fill="#000000" />
    <rect x="5" y="3" width="0.5" height="1" fill="#000000" />
    {/* Nose (Large stick-out - Darker Peach) */}
    <rect x="3.5" y="4" width="1" height="2.5" fill="#9e7047" />
    {/* Glasses (Gold rimmed) */}
    <rect x="2.2" y="3.2" width="0.6" height="0.6" fill="none" stroke="#ffbe00" strokeWidth="0.4" />
    <rect x="5.2" y="3.2" width="0.6" height="0.6" fill="none" stroke="#ffbe00" strokeWidth="0.4" />
    <line x1="2.8" y1="3.5" x2="5.2" y2="3.5" stroke="#ffbe00" strokeWidth="0.4" />
    {/* Librarian Hat/Book-Band (Crimson red library block) */}
    <rect x="2" y="0" width="4" height="2" fill="#b71c1c" />
    {/* Gold buckle on Hat */}
    <rect x="3.5" y="1" width="1" height="1" fill="#ffd54f" />
  </svg>
);

// Pixel Art Emerald SVG
const PixelEmerald: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 8 8" 
    shapeRendering="crispEdges"
    className="hover:rotate-12 transition-transform duration-300"
  >
    {/* Outer shadow border */}
    <rect x="2" y="0" width="4" height="8" fill="#052c13" />
    <rect x="1" y="1" width="6" height="6" fill="#052c13" />
    <rect x="0" y="2" width="8" height="4" fill="#052c13" />
    {/* Emerald Core Fill */}
    <rect x="2" y="1" width="4" height="6" fill="#00e676" />
    <rect x="1" y="2" width="6" height="4" fill="#00e676" />
    {/* Highlighting sheen */}
    <rect x="3" y="2" width="3" height="3" fill="#a7ffd0" />
    <rect x="2" y="2" width="1" height="1" fill="#a7ffd0" />
    <rect x="3" y="1" width="1" height="1" fill="#a7ffd0" />
    {/* Dark contours */}
    <rect x="2" y="5" width="4" height="1" fill="#00a852" />
    <rect x="5" y="2" width="1" height="4" fill="#00a852" />
    <rect x="1" y="3" width="1" height="2" fill="#00a852" />
    <rect x="3" y="6" width="2" height="1" fill="#04200d" />
  </svg>
);

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { 
      role: 'model', 
      text: "Greetings, traveler! I am the Hostel Scribe Villager. Tell me, what queries do you seek from my library logs? Ask me about the mess menus (e.g. 'Monday Breakfast Menu'), outpass rules, or let me write an issue scroll template for you!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    const updatedMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY || '';
      const reply = await chatWithAI(updatedMessages, apiKey);
      setMessages(prev => [...prev, { role: 'model' as const, text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model' as const, text: "*Hrmm!* My parchment delivery got lost in the Nether. Try asking again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render text with line breaks and simple formatting
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Basic bold formatting support (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block min-h-[1.2em]">
          {renderedLine}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="w-[360px] h-[520px] mb-4 bg-[#1f1f26] border-3 border-[#101014] rounded-sm shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: 'inset 2px 2px 0px rgba(255, 255, 255, 0.05), inset -2px -2px 0px rgba(0, 0, 0, 0.3), 0 12px 36px rgba(0,0,0,0.6)'
            }}
          >
            {/* Basalt Header (Minecraft GUI Panel) */}
            <div className="bg-[#141419] border-b-2 border-[#101014] p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#1f1f26] border-2 border-[#2b2b35] rounded-sm flex items-center justify-center shadow-inner">
                  <LibrarianAvatar size={28} />
                </div>
                <div>
                  <h3 className="font-mc-title text-[9px] text-white uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    Librarian AI <Sparkles size={11} className="text-mc-gold animate-pulse" />
                  </h3>
                  <p className="text-[8px] text-mc-cyan font-mc-sub uppercase tracking-widest mt-1">Level 42 Scribe</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 bg-[#2b2b35] hover:bg-[#3c3c44] border-2 border-black rounded-sm flex items-center justify-center text-slate-300 transition-colors shadow"
              >
                <X size={14} />
              </button>
            </div>

            {/* Message Area with Minecraft/Parchment scroll style bubbles */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#141419]/90 scrollbar-thin"
              style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(0, 216, 223, 0.02) 0%, transparent 80%)'
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 bg-[#f5e3be] border-2 border-[#8b5a2b] rounded-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <LibrarianAvatar size={20} />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded text-xs leading-relaxed transition-all ${
                        msg.role === 'user'
                          ? 'bg-[#2b2b35] text-white border-2 border-[#101014] shadow-inner font-mono-readable'
                          : 'bg-[#f5e3be] text-[#2c1d11] border-2 border-[#8b5a2b] shadow-md font-mono-readable font-medium'
                      }`}
                      style={
                        msg.role === 'model'
                          ? {
                              boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.4), 0 3px 6px rgba(0, 0, 0, 0.2)',
                            }
                          : {}
                      }
                    >
                      {renderMessageText(msg.text)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-7 h-7 bg-[#f5e3be] border-2 border-[#8b5a2b] rounded-sm flex items-center justify-center shrink-0">
                      <LibrarianAvatar size={20} />
                    </div>
                    <div 
                      className="p-3 bg-[#f5e3be] text-[#8b5a2b] border-2 border-[#8b5a2b] rounded flex items-center space-x-1.5 text-xs font-mc-sub font-bold uppercase tracking-wider"
                      style={{ boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.4), 0 3px 6px rgba(0, 0, 0, 0.2)' }}
                    >
                      <Loader2 className="animate-spin" size={12} />
                      <span>Scribing reply...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar (Minecraft Slot style) */}
            <form onSubmit={handleSend} className="p-3 border-t-2 border-[#101014] bg-[#1f1f26] flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Query the archives..."
                className="flex-1 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white text-xs font-mono-readable px-4 py-2.5 outline-none rounded-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="btn-mc py-2 px-3.5 flex items-center justify-center shadow-md disabled:opacity-50 shrink-0 h-[38px]"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button (Spinning 3D Emerald token) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#1f1f26] border-3 border-[#101014] rounded-sm flex items-center justify-center shadow-2xl cursor-pointer relative"
        style={{
          boxShadow: 'inset 2px 2px 0px rgba(255, 255, 255, 0.1), inset -2px -2px 0px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-mc-cyan"
            >
              <X size={20} className="stroke-[3]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center relative w-full h-full"
            >
              {/* Spinning Pixel Emerald */}
              <div className="animate-bounce mt-1">
                <PixelEmerald size={24} />
              </div>
              {/* Pulsing indicator block */}
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-mc-gold border border-black animate-pulse"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
