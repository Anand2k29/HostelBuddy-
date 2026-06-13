import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hey! I'm your HostelBuddy AI assistant. Ask me anything about mess menus, gate passes, anti-ragging, or draft an issue report." }
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
      setMessages(prev => [...prev, { role: 'model' as const, text: "Sorry, I ran into an issue connecting to my AI processor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-[360px] h-[500px] mb-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    HostelBuddy AI <Sparkles size={13} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                  </h3>
                  <p className="text-xs text-blue-100 font-medium">Virtual Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%]`}>
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0 mt-0.5 shadow-sm border border-blue-200">
                        <Bot size={14} />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed font-medium shadow-sm border ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none'
                          : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                    <div className="p-3 bg-white text-slate-400 border border-slate-100 rounded-2xl rounded-tl-none flex items-center space-x-1">
                      <Loader2 className="animate-spin" size={16} />
                      <span className="text-xs font-semibold">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask me something..."
                className="flex-1 bg-slate-100 hover:bg-slate-200/70 focus:bg-white border-transparent focus:border-blue-500 border-2 rounded-2xl px-4 py-2 text-sm focus:outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all cursor-pointer relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center relative"
            >
              <MessageSquare size={24} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 border-2 border-indigo-600 rounded-full animate-bounce"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
