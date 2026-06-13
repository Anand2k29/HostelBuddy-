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
      <section className="flex-1 flex flex-col items-center px-6 md:px-16 py-8 md:py-12 max-w-7xl mx-auto w-full relative z-20">
        {/* Centered Heading Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#2b2b35] border border-[#3c3c44] px-4 py-2 rounded text-[8px] font-mc-sub text-mc-cyan uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-ping" />
            Server Online — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>

          <h1
            className="text-5xl md:text-7xl font-black text-white font-mc-title uppercase leading-none select-none tracking-tight flex items-center justify-center flex-wrap gap-x-4 gap-y-2"
            style={{ textShadow: '4px 4px 0px #111011, 8px 8px 0px rgba(0,0,0,0.15)' }}
          >
            <span>Hostel</span>
            <span className="text-mc-cyan">Buddy</span>
            {/* Level Badge Shield */}
            <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-mc-gold border-3 border-black text-black text-[10px] md:text-xs font-mc-title rounded-full shadow-[0_4px_0_#b27d00] animate-bounce shrink-0 relative ml-1">
              99
              {/* Level Up floating text effect */}
              <span className="absolute -top-6 text-[6px] md:text-[8px] font-mc-sub text-[#00e676] animate-pulse uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded border border-[#00e676]/30">Lvl Up!</span>
            </span>
          </h1>
          <p className="mt-4 text-xs md:text-sm text-slate-400 font-mc-sub uppercase tracking-widest">
            Your Complete Gamified Campus OS
          </p>

          <p className="mt-6 text-sm md:text-base text-slate-300 leading-relaxed font-mono-readable max-w-2xl">
            Embark on your hostel adventure. Report campus quests (complaints), rate food feasts, match with compatible roommates, and manage outpasses—all in one immersive portal.
          </p>
        </motion.div>

        {/* Two-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full max-w-6xl mx-auto">
          
          {/* Left Column: Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 60, damping: 15 }}
            className="relative w-full flex flex-col"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-[#00d8df]/10 via-transparent to-[#00e676]/10 rounded-xl blur-2xl" />

            <div className="mc-card p-5 md:p-6 bg-[#1f1f26]/95 relative overflow-hidden animate-float flex-1 flex flex-col justify-between">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00d8df]/5 to-transparent pointer-events-none" />

              <div>
                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#26262a] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#ffbe00] to-[#f2ab13] rounded flex items-center justify-center font-mc-title text-sm text-black shadow-lg">
                      G
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold text-white font-mc-sub uppercase flex items-center gap-1.5">
                        Quest Guild Board
                        <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-pulse" />
                      </h3>
                      <p className="text-[8px] text-slate-500 font-mono-readable mt-0.5">Guild Hall · Block B · Level 5</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-slate-500 font-mc-sub uppercase">XP Score</div>
                    <div className="text-base font-black text-mc-gold font-mc-title mt-0.5" style={{ textShadow: '0 0 8px rgba(255,190,0,0.3)' }}>720</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {[
                    { label: 'Active Quests', value: '3', color: '#00d8df', icon: '⚔️' },
                    { label: 'Gate Passes', value: '2', color: '#00e676', icon: '🎫' },
                    { label: 'Emerald Bank', value: '85', color: '#ffbe00', icon: '💎' },
                  ].map(stat => (
                    <div key={stat.label} className="mc-slot p-3 text-center space-y-1.5 group hover:border-[#3c3c44] transition-colors cursor-default">
                      <div className="text-base">{stat.icon}</div>
                      <p className="text-lg font-black font-mc-title" style={{ color: stat.color, textShadow: `0 0 6px ${stat.color}30` }}>{stat.value}</p>
                      <p className="text-[6px] font-mc-sub text-slate-500 uppercase leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* XP Progress */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-[8px] font-mc-sub text-slate-400 uppercase">
                    <span className="flex items-center gap-1">⭐ Level 5 Progress</span>
                    <span className="text-mc-cyan">720 / 1200 XP</span>
                  </div>
                  <div className="w-full bg-[#141419] h-3.5 border border-[#3c3c44] p-0.5 rounded-sm relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-[#00d8df] via-[#00e676] to-[#00d8df] h-full rounded-sm relative"
                      style={{ boxShadow: '0 0 8px rgba(0,216,223,0.5)', backgroundSize: '200% 100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Today's Activity */}
              <div className="border-t border-[#26262a] pt-3.5 space-y-2.5 mt-4">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={9} /> Guild Activity Log
                </p>
                {[
                  { icon: '🛡️', text: 'Outpass approved for weekend', status: 'Approved', statusColor: '#00e676' },
                  { icon: '🍗', text: 'Breakfast rated — 5 stars', status: 'Done', statusColor: '#00e676' },
                  { icon: '🏹', text: 'WiFi issue in library logs', status: 'Active', statusColor: '#00d8df' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-mono-readable py-1 px-2 -mx-2 rounded hover:bg-[#2b2b35]/50 transition-colors cursor-default">
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="text-slate-400 flex-1 truncate">{item.text}</span>
                    <span className="shrink-0 text-[7px] font-mc-sub uppercase px-1.5 py-0.5 rounded border" 
                          style={{ color: item.statusColor, borderColor: `${item.statusColor}40`, backgroundColor: `${item.statusColor}10` }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Faction Select / Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 60, damping: 15 }}
            className="relative w-full flex flex-col"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-[#00e676]/10 via-transparent to-[#ffbe00]/10 rounded-xl blur-2xl" />

            <div className="mc-card p-5 md:p-6 bg-[#1f1f26]/95 relative overflow-hidden flex flex-col justify-between flex-1">
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#ffbe00]/5 to-transparent pointer-events-none" />
              
              <div>
                {/* Header */}
                <div className="border-b border-[#26262a] pb-4">
                  <h3 className="text-[12px] font-bold text-white font-mc-sub uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center text-mc-gold text-[8px] font-mc-title">⚡</span>
                    Select Faction Portal
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono-readable mt-1.5">Choose your role to authenticate and enter the guild</p>
                </div>

                {/* Faction Selectors */}
                <div className="space-y-3 mt-5">
                  {/* Student Faction */}
                  <div 
                    onClick={() => handleRoleSelect(UserRole.STUDENT)}
                    className="p-4 mc-slot hover:border-[#00d8df] cursor-pointer transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00d8df]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00d8df]/20 to-[#141419] border-2 border-[#3c3c44] group-hover:border-[#00d8df] rounded flex items-center justify-center text-[#00d8df] shrink-0 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(0,216,223,0.2)]">
                        <GraduationCap size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-bold text-white font-mc-title uppercase tracking-wide group-hover:text-[#00d8df] transition-colors">Student Explorer</h4>
                        <p className="text-[9px] text-slate-500 font-mono-readable mt-1 leading-relaxed">
                          Report issues, apply for outpasses, find roommates, and earn XP
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-700 group-hover:text-[#00d8df] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>

                  {/* Warden Faction */}
                  <div 
                    onClick={() => handleRoleSelect(UserRole.ADMIN)}
                    className="p-4 mc-slot hover:border-[#ffbe00] cursor-pointer transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffbe00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#ffbe00]/20 to-[#141419] border-2 border-[#3c3c44] group-hover:border-[#ffbe00] rounded flex items-center justify-center text-[#ffbe00] shrink-0 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(255,190,0,0.2)]">
                        <ShieldCheck size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-bold text-white font-mc-title uppercase tracking-wide group-hover:text-[#ffbe00] transition-colors">Village Warden</h4>
                        <p className="text-[9px] text-slate-500 font-mono-readable mt-1 leading-relaxed">
                          Manage gate passes, post notices, and oversee the campus guild
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-700 group-hover:text-[#ffbe00] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Features Row */}
              <div className="border-t border-[#26262a] pt-4 mt-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Secure Auth', icon: '🔒', color: '#00d8df' },
                    { label: 'Instant Access', icon: '⚡', color: '#ffbe00' },
                    { label: 'Role-Based', icon: '🛡️', color: '#00e676' },
                  ].map(feat => (
                    <div key={feat.label} className="text-center py-2">
                      <div className="text-base mb-1">{feat.icon}</div>
                      <p className="text-[7px] font-mc-sub uppercase tracking-wider" style={{ color: feat.color }}>{feat.label}</p>
                    </div>
                  ))}
                </div>
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

      {/* ═══ Quest Resolution Roadmap ═══ */}
      <section className="px-6 md:px-16 py-20 relative z-20 border-t border-[#1f1f26]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wider font-mc-title uppercase">
              Quest Resolution Roadmap
            </h2>
            <p className="text-slate-500 font-mono-readable mt-3 text-xs max-w-xl mx-auto leading-relaxed">
              Follow the leveling journey of a hostel issue from the moment a student logs it to final resolution and reward payout.
            </p>
          </motion.div>

          {/* Connected Grid (4 Steps) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Connecting lines on desktop screens */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-[#2b2b35] z-0" />

            {[
              { level: 'LEVEL 1', title: 'Quest Logged', desc: 'Student posts an issue scroll (e.g. Wi-Fi down) on the board. Others can upvote it.', icon: GraduationCap, color: '#00d8df' },
              { level: 'LEVEL 2', title: 'AI Processing', desc: 'The Librarian AI auto-formats the report and prepares complaint scrolls for Warden review.', icon: Sparkles, color: '#a78bfa' },
              { level: 'LEVEL 3', title: 'Warden Dispatch', desc: 'The Warden reviews details, changes status to "In Progress", and assigns repair workers.', icon: ShieldCheck, color: '#ffbe00' },
              { level: 'LEVEL 4', title: 'Quest Resolved', desc: 'Warden marks it "Resolved". The quest completes, granting the reporter XP & Emeralds!', icon: Trophy, color: '#00e676' },
            ].map((item, i) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center gap-4 relative z-10 group"
              >
                {/* Bouncing circular level bubble */}
                <div
                  className="w-16 h-16 rounded-full border-3 flex items-center justify-center relative transition-all duration-300 group-hover:scale-110 shadow-lg cursor-default"
                  style={{ 
                    borderColor: item.color, 
                    backgroundColor: '#1f1f26', 
                    color: item.color,
                    boxShadow: `inset 0 0 10px ${item.color}30, 0 4px 12px rgba(0,0,0,0.5)`
                  }}
                >
                  <item.icon size={26} className="transition-transform duration-300 group-hover:rotate-12" />
                  
                  {/* Small level tag */}
                  <div
                    className="absolute -bottom-2 px-2 py-0.5 rounded-sm text-[6px] font-black border font-mc-title"
                    style={{ backgroundColor: item.color, borderColor: '#101014', color: '#000' }}
                  >
                    {item.level}
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  <h3 className="text-xs font-black text-white font-mc-sub uppercase tracking-wide group-hover:text-mc-cyan transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono-readable leading-relaxed max-w-[220px] mx-auto">
                    {item.desc}
                  </p>
                </div>
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