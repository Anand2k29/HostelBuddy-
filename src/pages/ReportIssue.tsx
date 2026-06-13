import React, { useState } from 'react';
import { User, Issue, IssueCategory, IssuePriority, IssueStatus } from '../types';
import { analyzeIssueWithAI } from '../services/geminiService';
import { Wand2, Loader2, Send, ArrowRight, Lock, Info, Wifi, Droplets, Zap, Sofa, Sparkles, Shield, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ReportIssueProps {
  user: User;
  onReport: (issue: Issue) => void;
}

const CATEGORY_CONFIG = {
  WIFI: { label: 'WiFi / Internet', icon: Wifi, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  PLUMBING: { label: 'Plumbing / Water', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  ELECTRICAL: { label: 'Electrical / Power', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  FURNITURE: { label: 'Furniture', icon: Sofa, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  CLEANING: { label: 'Cleaning / Hygiene', icon: Sparkles, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  RAGGING: { label: 'Anti-Ragging', icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' },
  OTHER: { label: 'Other / Misc', icon: FileText, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', desc: 'Minor inconvenience', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  MEDIUM: { label: 'Medium', desc: 'Noticeable issue', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  HIGH: { label: 'High', desc: 'Significant impact', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  CRITICAL: { label: 'Critical', desc: 'Urgent — needs immediate action', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export const ReportIssue: React.FC<ReportIssueProps> = ({ user, onReport }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>(IssueCategory.OTHER);
  const [priority, setPriority] = useState<IssuePriority>(IssuePriority.LOW);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [questLoggedSuccess, setQuestLoggedSuccess] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleAIAnalyze = async () => {
    if (!description || description.length < 10) {
      alert('Please describe the issue with at least 10 characters to use AI analysis.');
      return;
    }
    setIsAnalyzing(true);
    const result = await analyzeIssueWithAI(description, import.meta.env.VITE_API_KEY);
    setIsAnalyzing(false);
    if (result) {
      setCategory(result.category);
      setPriority(result.priority);
      setAiSummary(result.summary);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIssue: Issue = {
      id: `q-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      category,
      priority,
      status: IssueStatus.REPORTED,
      isPrivate,
      reporterId: user.id,
      reporterName: user.name,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      comments: [],
    };
    onReport(newIssue);
    setQuestLoggedSuccess(true);
    setTitle('');
    setDescription('');
    setAiSummary('');
    setIsPrivate(false);
    setStep(1);
  };

  const isRagging = category === 'RAGGING';

  return (
    <div className="max-w-2xl mx-auto text-white font-sans">
      <AnimatePresence mode="wait">
        {!questLoggedSuccess ? (
          <motion.div
            key="report-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Heading */}
            <div className="border-b border-[#26262a] pb-5">
              <h1 className="text-xl font-black text-white font-mc-title uppercase tracking-wide">Report an Issue</h1>
              <p className="text-slate-400 font-mono-readable text-xs mt-1.5">[ Describe your problem clearly — our AI can help categorize it automatically ]</p>
            </div>

            {/* Anti-Ragging Special Banner */}
            <div className="flex items-start gap-3 p-4 bg-[#1e1515] border-2 border-red-500/40 rounded-sm">
              <Shield size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-black text-red-400 font-mc-sub uppercase tracking-wider">Anti-Ragging & Safety Issues</p>
                <p className="text-[11px] text-red-200/70 font-mono-readable mt-1 leading-relaxed">
                  If this is a ragging or harassment incident, select "Anti-Ragging" category below. Your report can be kept completely private.
                </p>
              </div>
            </div>

            {/* Reward Preview */}
            <div className="flex items-center justify-between bg-[#141419] border border-[#26262a] p-3.5 rounded-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#1f1f26] border border-[#3c3c44] rounded flex items-center justify-center text-lg">💎</div>
                <div>
                  <h4 className="text-[9px] font-black text-white font-mc-sub uppercase">Submission Rewards</h4>
                  <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5">Earned instantly when you submit</p>
                </div>
              </div>
              <div className="flex gap-3 text-[10px] font-mc-sub font-bold uppercase">
                <span className="text-emerald-400">+30 XP</span>
                <span className="text-mc-gold">+10 Emeralds</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mc-card bg-[#1f1f26]/90 p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider mb-2">Issue Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-sm font-semibold p-3 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none transition-all font-mono-readable"
                  placeholder="e.g., WiFi not working on 3rd floor, Wing B"
                />
              </div>

              {/* Description + AI */}
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider mb-2">
                  Detailed Description <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={5}
                    className="w-full text-xs font-mono-readable p-3 pb-12 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none transition-all resize-none"
                    placeholder="Describe the issue in detail — when it started, what you tried, which room/area..."
                  />
                  <button
                    type="button"
                    onClick={handleAIAnalyze}
                    disabled={isAnalyzing}
                    className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[9px] font-bold uppercase font-mc-sub rounded-sm shadow-md transition-all glow-cta cursor-pointer disabled:opacity-50 h-8"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />}
                    <span>{isAnalyzing ? 'Analyzing...' : 'AI Analyze'}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {aiSummary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3.5 bg-purple-500/10 text-purple-300 text-xs rounded border border-purple-500/30 flex items-start space-x-2.5"
                    >
                      <Wand2 size={14} className="mt-0.5 shrink-0 animate-pulse text-purple-400" />
                      <div>
                        <strong className="font-mc-sub uppercase text-[9px] text-purple-400 block mb-1">AI Suggestion Applied</strong>
                        <span className="font-mono-readable leading-relaxed">"{aiSummary}"</span>
                        <p className="text-[9px] text-purple-500 mt-1.5">Category & priority have been auto-filled below.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Selector (Icon Grid) */}
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider mb-2">Category <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isSelected = category === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key as IssueCategory)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 border-2 rounded-sm transition-all text-center ${
                          isSelected
                            ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                            : 'bg-[#141419] border-[#3c3c44] text-slate-500 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-[8px] font-mc-sub uppercase leading-tight">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider mb-2">Priority Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => {
                    const isSelected = priority === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPriority(key as IssuePriority)}
                        className={`flex flex-col items-center gap-1 py-3 px-2 border-2 rounded-sm transition-all text-center ${
                          isSelected
                            ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                            : 'bg-[#141419] border-[#3c3c44] text-slate-500 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-sm">{key === 'LOW' ? '🟢' : key === 'MEDIUM' ? '🟡' : key === 'HIGH' ? '🟠' : '🔴'}</span>
                        <span className="text-[8px] font-mc-sub uppercase font-bold">{cfg.label}</span>
                        <span className="text-[7px] font-mono-readable text-slate-500 hidden sm:block">{cfg.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Privacy Toggle */}
              <div
                className={`flex items-center space-x-3.5 p-4 rounded-sm border-2 cursor-pointer transition-all ${
                  isPrivate
                    ? 'bg-purple-500/10 border-purple-500/40'
                    : 'bg-[#141419] border-[#26262a] hover:border-[#3c3c44]'
                }`}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isPrivate ? 'bg-purple-600 border-purple-500' : 'bg-[#141419] border-[#3c3c44]'
                }`}>
                  {isPrivate && <span className="text-white text-xs">✓</span>}
                </div>
                <Lock size={15} className={isPrivate ? 'text-purple-400' : 'text-slate-500'} />
                <div>
                  <label className="block text-xs font-bold text-white uppercase font-mc-sub cursor-pointer select-none">Private Report</label>
                  <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5">Only you and admins can see this report.</p>
                </div>
              </div>

              {/* Ragging Warning */}
              {isRagging && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/40 rounded-sm"
                >
                  <Info size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold text-red-400 font-mc-sub uppercase">You are reporting an Anti-Ragging incident.</p>
                    <p className="text-[10px] text-red-200/70 font-mono-readable mt-1">This report is treated with highest priority. We strongly recommend enabling Private Mode above. Your identity is protected.</p>
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-mc text-[11px] uppercase py-3 flex items-center justify-center space-x-2"
              >
                <Send size={13} />
                <span>Submit Report</span>
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 mc-card bg-[#1f1f26]/95 text-center border-emerald-500/40 border-2"
            style={{ boxShadow: '0 0 30px rgba(16,185,129,0.1)' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-[#141419] border-3 border-emerald-500 rounded-sm flex items-center justify-center text-4xl shadow-inner mb-6"
            >
              🎉
            </motion.div>

            <p className="text-emerald-400 font-mc-sub text-[10px] uppercase font-bold tracking-widest">Report Submitted!</p>
            <h2 className="text-white font-mc-title text-[12px] mt-2 uppercase leading-tight">Issue Logged Successfully</h2>

            <p className="text-[11px] text-slate-400 font-mono-readable max-w-sm mt-4 leading-relaxed">
              Your report has been added to the queue. Admins will review it and update the status.
            </p>

            <div className="my-6 bg-[#141419] border border-[#26262a] px-6 py-3 rounded-sm text-[10px] font-mc-sub font-bold uppercase tracking-wider text-slate-300">
              Rewards: <span className="text-emerald-400 ml-1">+30 XP</span> • <span className="text-mc-gold ml-1">+10 Emeralds</span>
            </div>

            <div className="flex gap-4 w-full max-w-xs">
              <button
                onClick={() => setQuestLoggedSuccess(false)}
                className="flex-1 btn-mc py-2.5 text-[9px] uppercase font-bold font-mc-sub"
              >
                Report Another
              </button>
              <Link
                to="/issues"
                className="flex-1 text-center py-2.5 bg-mc-cyan hover:bg-cyan-400 text-black font-mc-sub font-bold text-[9px] uppercase border-2 border-black rounded-sm shadow flex items-center justify-center gap-1"
              >
                View Issues <ArrowRight size={10} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};