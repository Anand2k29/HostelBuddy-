import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import {
  GraduationCap, ShieldCheck, Wifi, Bell, QrCode, Utensils, Users,
  Sparkles, ChevronRight, Zap, Shield, Trophy, Clock, Star, ArrowRight,
  CheckCircle, Package, MessageSquare
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

/* ─── Particle config ─── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 3,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 15,
  duration: Math.random() * 12 + 16,
  color: ['#00d8df', '#00e676', '#ffbe00', '#f2ab13', '#00d8df', '#a78bfa'][i % 6],
  opacity: Math.random() * 0.35 + 0.1,
}));

/* ─── Feature list ─── */
const featuresList = [
  {
    icon: Wifi,
    title: 'Quest Log',
    desc: 'Report WiFi, plumbing, electrical, and other campus issues. Upvote shared problems and track real-time resolution status.',
    color: '#00d8df',
    badge: 'Issue Tracking',
  },
  {
    icon: QrCode,
    title: 'Gate Pass',
    desc: 'Apply for outpasses digitally. Warden reviews and approves — no more chasing signatures. Scannable QR output.',
    color: '#00e676',
    badge: 'Leave Management',
  },
  {
    icon: Utensils,
    title: 'Mess Menu',
    desc: 'View daily breakfast, lunch, and dinner menus. Rate meals, check nutrition info, and vote on special dishes.',
    color: '#ffbe00',
    badge: 'Daily Meals',
  },
  {
    icon: Users,
    title: 'Roommate Finder',
    desc: 'Answer lifestyle questions and browse compatible profiles. Find your ideal room partner from your batch.',
    color: '#f2ab13',
    badge: 'Social Matching',
  },
  {
    icon: Bell,
    title: 'Notice Board',
    desc: 'Stay updated with official warden announcements — maintenance alerts, curfews, events, and emergency notices.',
    color: '#ef4444',
    badge: 'Announcements',
  },
  {
    icon: Package,
    title: 'Lost & Found',
    desc: 'Post lost items or report what you found. Browse listings with photos, contact info, and locations.',
    color: '#a78bfa',
    badge: 'Item Recovery',
  },
  {
    icon: Sparkles,
    title: 'AI Companion',
    desc: 'Ask about hostel rules, timings, facilities. Get complaint drafts, menu recommendations, and instant answers.',
    color: '#f472b6',
    badge: 'Smart Assistant',
  },
  {
    icon: MessageSquare,
    title: 'Anti-Ragging',
    desc: 'Confidentially report ragging or harassment incidents. Private, secure, and directly escalated to wardens.',
    color: '#fb923c',
    badge: 'Safety First',
  },
];

/* ─── Animated Counter Hook ─── */
const useCounter = (end: number, duration: number = 2000, inView: boolean) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return count;
};

/* ─── Stats data ─── */
const statsData = [
  { label: 'Active Students', value: 500, suffix: '+', icon: Users, color: '#00d8df' },
  { label: 'Issues Resolved', value: 120, suffix: '+', icon: Shield, color: '#00e676' },
  { label: 'Server Uptime', value: 99, suffix: '%', icon: Zap, color: '#ffbe00' },
  { label: 'Avg Rating', value: 4.8, suffix: '★', icon: Trophy, color: '#f2ab13', isDecimal: true },
];

/* ─── Testimonials ─── */
const testimonials = [
  { text: 'HostelBuddy made my WiFi complaints actually get fixed!', user: 'Priya M., 2nd Year' },
  { text: 'The roommate finder matched me with my best friend. Literally!', user: 'Rohan S., 1st Year' },
  { text: 'Rating mess food is so easy now. Love the XP system!', user: 'Ananya K., 3rd Year' },
  { text: 'Gate pass in 2 clicks. No more chasing wardens for signatures.', user: 'Vikram P., 2nd Year' },
  { text: 'The AI companion helped me draft a perfect complaint in seconds.', user: 'Diya N., 1st Year' },
  { text: 'Sunday food polls are the highlight of my week here!', user: 'Aarav T., 3rd Year' },
];

/* ─── Stat Counter ─── */
const StatCounter: React.FC<{ stat: typeof statsData[0]; index: number; inView: boolean }> = ({ stat, index, inView }) => {
  const count = useCounter(stat.isDecimal ? 48 : stat.value, 2200, inView);
  const displayValue = stat.isDecimal ? (count / 10).toFixed(1) : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 80 }}
      className="flex flex-col items-center text-center p-8 mc-card bg-[#1f1f26]/60 hover:bg-[#1f1f26] transition-all"
    >
      <div className="w-12 h-12 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center mb-4" style={{ color: stat.color }}>
        <stat.icon size={22} />
      </div>
      <span className="text-3xl md:text-4xl font-black text-white font-mc-title stat-number">
        {displayValue}{stat.suffix}
      </span>
      <span className="text-[9px] text-slate-400 font-mc-sub uppercase tracking-wider mt-2">{stat.label}</span>
    </motion.div>
  );
};

/* ─── MAIN COMPONENT ─── */
export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  const handleRoleSelect = (role: UserRole) => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-[#141419] text-[#f1f5f9] flex flex-col font-sans antialiased relative overflow-hidden">
      {/* ═══ Background Particles ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              backgroundColor: p.color,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00d8df] rounded-full opacity-[0.025] blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00e676] rounded-full opacity-[0.02] blur-[120px]" />
        <div className="absolute top-3/4 left-1/4 w-[400px] h-[400px] bg-[#a78bfa] rounded-full opacity-[0.015] blur-[100px]" />
      </div>

      {/* ═══ Navbar ═══ */}
      <nav className="px-6 md:px-16 py-5 flex items-center justify-between max-w-7xl mx-auto w-full relative z-20 border-b border-[#1f1f26]">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-9 h-9 bg-[#2b2b35] border-2 border-[#101014] rounded flex items-center justify-center font-mc-title text-sm text-mc-cyan shadow-inner"
            style={{ boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.05)' }}
          >
            H
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mc-title tracking-tight text-white uppercase">HostelBuddy</span>
            <span className="text-[8px] text-mc-cyan font-mc-sub uppercase tracking-wider">Your Campus OS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn-mc uppercase text-[10px] py-1.5 px-5"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section className="flex-1 flex items-center px-6 md:px-16 py-8 md:py-14 max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">

          {/* Left Column */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
            }}
            className="flex flex-col items-start space-y-8"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2 bg-[#2b2b35] border border-[#3c3c44] px-4 py-2 rounded text-[8px] font-mc-sub text-mc-cyan uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-ping" />
              Server Online — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="relative">
              <h1
                className="text-4xl md:text-6xl font-black text-white font-mc-title uppercase leading-tight select-none"
                style={{ textShadow: '3px 3px 0px #111011, 6px 6px 0px rgba(0,0,0,0.15)' }}
              >
                Hostel<br />
                <span className="text-mc-cyan">Buddy</span>
              </h1>
              {/* Pulsing Yellow Splash Text */}
              <span className="absolute -bottom-2 right-12 md:right-24 text-mc-gold font-mc-sub text-[10px] md:text-xs uppercase mc-splash tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] pointer-events-none select-none z-30">
                Warden Approved!
              </span>
              <p className="mt-3 text-[11px] md:text-xs text-slate-400 font-mc-sub uppercase tracking-widest">
                Your Complete Hostel Management Platform
              </p>
            </motion.div>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="text-sm text-slate-400 leading-relaxed font-mono-readable max-w-md"
            >
              Everything you need for hostel life — in one place. Report issues, check the mess menu, find roommates, manage gate passes, and get AI assistance anytime.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-col gap-2"
            >
              {['Track and resolve hostel issues instantly', 'Digital gate passes — no paper forms', 'AI assistant for rules, complaints & guidance'].map(item => (
                <div key={item} className="flex items-center gap-2.5 text-[11px] text-slate-300 font-mono-readable">
                  <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="w-full space-y-3 pt-2"
            >
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mc-sub">Select Your Role to Continue</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={() => handleRoleSelect(UserRole.STUDENT)}
                  className="btn-mc flex-1 flex items-center justify-center gap-2.5 py-4 uppercase glow-cta text-[11px]"
                >
                  <GraduationCap size={16} /> Student Login
                </button>
                <button
                  onClick={() => handleRoleSelect(UserRole.ADMIN)}
                  className="btn-mc flex-1 flex items-center justify-center gap-2.5 py-4 bg-[#404040] hover:bg-[#00d8df] hover:text-[#0b0f19] uppercase text-[11px]"
                >
                  <ShieldCheck size={16} /> Warden / Admin
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 60, damping: 15 }}
            className="hidden lg:block relative w-full max-w-lg mx-auto"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-[#00d8df]/8 via-transparent to-[#00e676]/8 rounded-xl blur-2xl" />

            <div className="mc-card p-6 space-y-5 bg-[#1f1f26]/95 relative overflow-hidden animate-float">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#26262a] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#141419] border-2 border-[#ffbe00] rounded flex items-center justify-center font-mc-title text-sm text-mc-gold shadow-inner">
                    G
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-white font-mc-sub uppercase">Quest Guild Board</h3>
                    <p className="text-[8px] text-slate-500 font-mono-readable mt-0.5">Guild Hall · Block B · Level 5 Explorer</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 font-mc-sub uppercase">XP Score</div>
                  <div className="text-sm font-bold text-mc-gold font-mc-sub mt-0.5">720 PTS</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Active Quests', value: '3', color: 'text-mc-cyan' },
                  { label: 'Gate Passes', value: '2', color: 'text-emerald-400' },
                  { label: 'Emerald Bank', value: '85', color: 'text-mc-gold' },
                ].map(stat => (
                  <div key={stat.label} className="mc-slot p-3 text-center space-y-1">
                    <p className={`text-lg font-black font-mc-title ${stat.color}`}>{stat.value}</p>
                    <p className="text-[7px] font-mc-sub text-slate-500 uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* XP Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-mc-sub text-slate-400 uppercase">
                  <span>Level 5 Progress</span>
                  <span className="text-mc-cyan">720 / 1200 XP</span>
                </div>
                <div className="w-full bg-[#141419] h-3 border border-[#3c3c44] p-0.5 rounded-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-mc-cyan to-emerald-400 h-full rounded-sm"
                    style={{ boxShadow: '0 0 6px rgba(0,216,223,0.4)' }}
                  />
                </div>
              </div>

              {/* Today's Activity */}
              <div className="border-t border-[#26262a] pt-4 space-y-2">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">Guild Activity Log</p>
                {[
                  { icon: '🛡️', text: 'Warden outpass approved for weekend', status: 'Approved', statusColor: 'text-emerald-400' },
                  { icon: '🍗', text: 'Monday Breakfast rated — 5 stars', status: 'Done', statusColor: 'text-emerald-400' },
                  { icon: '🏹', text: 'WiFi issue reported in library logs', status: 'Active', statusColor: 'text-blue-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[10px] font-mono-readable">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="text-slate-400 flex-1 truncate">{item.text}</span>
                    <span className={`shrink-0 text-[8px] font-mc-sub uppercase ${item.statusColor}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Stats Section ═══ */}
      <section ref={statsRef} className="px-6 md:px-16 py-20 relative z-20 border-t border-[#1f1f26]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-lg md:text-xl font-black text-white tracking-wider font-mc-title uppercase">
              Trusted by Hundreds of Students
            </h2>
            <p className="text-slate-500 font-mono-readable mt-2.5 text-xs max-w-lg mx-auto">
              Real numbers from real hostel residents using HostelBuddy every day.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map((stat, i) => (
              <StatCounter key={stat.label} stat={stat} index={i} inView={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features Section ═══ */}
      <section className="px-6 md:px-16 py-20 bg-[#1a1a20] border-t border-[#1f1f26] relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wider font-mc-title uppercase">
              Everything You Need
            </h2>
            <p className="text-slate-500 font-mono-readable mt-3 text-xs max-w-xl mx-auto leading-relaxed">
              A complete suite of tools to make your hostel experience smoother, smarter, and more connected.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuresList.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="mc-card feature-card-glow p-5 bg-[#1f1f26]/50 hover:bg-[#1f1f26] flex flex-col gap-4 group"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center"
                    style={{ color: feature.color }}
                  >
                    <feature.icon size={20} />
                  </div>
                  <span
                    className="text-[7px] font-mc-sub uppercase tracking-wider px-2 py-0.5 rounded border opacity-70"
                    style={{ color: feature.color, borderColor: `${feature.color}40`, backgroundColor: `${feature.color}10` }}
                  >
                    {feature.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-[10px] font-black tracking-wide text-white mb-2 font-mc-title uppercase">{feature.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono-readable leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-[8px] font-mc-sub uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: feature.color }}>
                  Learn More <ChevronRight size={10} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="px-6 md:px-16 py-20 relative z-20 border-t border-[#1f1f26]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-xl font-black text-white tracking-wider font-mc-title uppercase">How It Works</h2>
            <p className="text-slate-500 font-mono-readable mt-3 text-xs max-w-lg mx-auto">Get started in seconds. No training needed.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign In', desc: 'Log in with your college credentials as a student or warden. Your profile is auto-created.', icon: GraduationCap, color: '#00d8df' },
              { step: '02', title: 'Use Features', desc: 'Report issues, apply for gate passes, check the mess menu, or chat with the AI companion.', icon: Sparkles, color: '#00e676' },
              { step: '03', title: 'Track & Earn', desc: 'Monitor issue status in real-time and earn XP rewards for active participation.', icon: Trophy, color: '#ffbe00' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-sm border-2 flex items-center justify-center"
                    style={{ borderColor: `${item.color}50`, backgroundColor: `${item.color}10`, color: item.color }}
                  >
                    <item.icon size={28} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black border font-mc-title"
                    style={{ backgroundColor: item.color, borderColor: '#141419', color: '#000' }}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white font-mc-sub uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-slate-400 font-mono-readable leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Testimonials Ticker ═══ */}
      <section className="py-10 bg-[#141419] border-t border-[#1f1f26] relative z-20 overflow-hidden">
        <p className="text-center text-[8px] font-mc-sub text-slate-500 uppercase tracking-widest mb-6">What Students Are Saying</p>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#141419] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#141419] to-transparent z-10 pointer-events-none" />
          <div className="ticker-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="mx-3 shrink-0 mc-card bg-[#1f1f26]/60 p-5 w-[320px] space-y-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-mc-gold text-mc-gold" />)}
                </div>
                <p className="text-[11px] text-slate-300 font-mono-readable leading-relaxed italic">"{t.text}"</p>
                <p className="text-[9px] text-mc-cyan font-mc-sub uppercase tracking-wider">— {t.user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="px-6 md:px-16 py-20 relative z-20 border-t border-[#1f1f26]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-black text-white font-mc-title uppercase leading-tight">
              Ready to Upgrade<br />
              <span className="text-mc-cyan">Your Hostel Life?</span>
            </h2>
            <p className="text-slate-400 font-mono-readable text-sm mt-4 max-w-lg mx-auto leading-relaxed">
              Join hundreds of students who use HostelBuddy to manage their campus life more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => handleRoleSelect(UserRole.STUDENT)}
                className="btn-mc py-4 px-8 uppercase glow-cta text-[11px] flex items-center justify-center gap-2"
              >
                <GraduationCap size={16} /> Get Started as Student
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-mc py-4 px-8 uppercase bg-[#2b2b35] hover:bg-[#00d8df] hover:text-black text-[11px] flex items-center justify-center gap-2"
              >
                Warden Portal <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="px-6 md:px-16 py-10 border-t border-[#26262a] bg-[#101014] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 bg-[#2b2b35] border-2 border-[#101014] rounded flex items-center justify-center font-mc-title text-[10px] text-mc-cyan"
                style={{ boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.05)' }}
              >
                H
              </div>
              <span className="text-[11px] font-mc-title text-white uppercase">HostelBuddy</span>
            </div>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">
              © {new Date().getFullYear()} HostelBuddy — Student Life, Simplified
            </p>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            {['Quest Log', 'Mess Menu', 'Roommates', 'Gate Pass', 'Lost & Found'].map(link => (
              <span key={link} className="text-[9px] text-slate-500 hover:text-mc-cyan cursor-pointer font-mc-sub uppercase tracking-wide transition-colors">
                {link}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate('/login')}
            className="btn-mc uppercase text-[10px] py-2 px-6 glow-cta flex items-center gap-2"
          >
            Login <ArrowRight size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
};