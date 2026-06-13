import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { GraduationCap, ShieldCheck, Wifi, Bell, QrCode, Utensils, Users, Sparkles, ChevronRight, Zap, Shield, Trophy, Clock } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

/* ─── Particle config ─── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 4,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 12,
  duration: Math.random() * 10 + 14,
  color: ['#00d8df', '#00e676', '#ffbe00', '#f2ab13', '#00d8df', '#00e676'][i % 6],
  opacity: Math.random() * 0.4 + 0.15,
}));

/* ─── Feature list ─── */
const skillsList = [
  { icon: Wifi, title: 'Quest Log', desc: 'Report WiFi lag, plumbing, or electrical issues. Track real-time updates with blockmates.', color: '#00d8df' },
  { icon: QrCode, title: 'Gate Rune Pass', desc: 'Apply for gate outpasses digitally. Warden-signed and scannable in seconds.', color: '#00e676' },
  { icon: Utensils, title: 'Mess Furnace', desc: 'View daily menus, rate chef meals with RPG stats, and vote on Sunday feast specials.', color: '#ffbe00' },
  { icon: Users, title: 'Roommate Finder', desc: 'Answer lifestyle attributes, browse profiles, and construct your ideal roommate party.', color: '#f2ab13' },
  { icon: Bell, title: 'Notice Board', desc: 'Instant alerts from wardens on maintenance, curfews, fests, and emergency updates.', color: '#ef4444' },
  { icon: Sparkles, title: 'AI Companion', desc: 'Consult an AI chatbot for rules, timings, complaint drafts, and hostel guidance.', color: '#a78bfa' },
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
      // Ease out cubic
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
  { label: 'Uptime', value: 99, suffix: '%', icon: Zap, color: '#ffbe00' },
  { label: 'Avg Rating', value: 4.8, suffix: '★', icon: Trophy, color: '#f2ab13', isDecimal: true },
];

/* ─── Testimonials ─── */
const testimonials = [
  { text: "HostelBuddy made my WiFi complaints actually get fixed!", user: "Priya M., 2nd Year" },
  { text: "The roommate finder matched me with my best friend. Literally!", user: "Rohan S., 1st Year" },
  { text: "Rating mess food is weirdly fun now. Love the gamified XP system!", user: "Ananya K., 3rd Year" },
  { text: "Gate pass in 2 clicks. No more chasing wardens for signatures.", user: "Vikram P., 2nd Year" },
  { text: "The AI companion helped me draft a perfect complaint in seconds.", user: "Diya N., 1st Year" },
  { text: "Sunday food polls are the highlight of my week here!", user: "Aarav T., 3rd Year" },
];

/* ─── Stat Counter Component ─── */
const StatCounter: React.FC<{ stat: typeof statsData[0]; index: number; inView: boolean }> = ({ stat, index, inView }) => {
  const count = useCounter(stat.isDecimal ? 48 : stat.value, 2200, inView);
  const displayValue = stat.isDecimal ? (count / 10).toFixed(1) : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 80 }}
      className="flex flex-col items-center text-center p-6 mc-card bg-[#1f1f26]/60 hover:bg-[#1f1f26] transition-all"
    >
      <div className="w-10 h-10 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center mb-3" style={{ color: stat.color }}>
        <stat.icon size={18} />
      </div>
      <span className="text-2xl md:text-3xl font-black text-white font-mc-title stat-number">
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
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  const handleRoleSelect = (role: UserRole) => {
    navigate('/login', { state: { role } });
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
  };

  return (
    <div className="min-h-screen bg-[#141419] text-[#f1f5f9] flex flex-col font-sans antialiased relative overflow-hidden">
      {/* ═══ Floating Particle Background ═══ */}
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
        {/* Radial ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#00d8df] rounded-full opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00e676] rounded-full opacity-[0.02] blur-[100px]" />
      </div>

      {/* ═══ Navbar ═══ */}
      <nav className="px-6 md:px-16 py-6 flex items-center justify-between max-w-7xl mx-auto w-full relative z-20">
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
            <span className="text-[10px] font-mc-title tracking-tight text-white uppercase">HostelBuddy</span>
            <span className="text-[8px] text-[#00d8df] font-mc-sub uppercase tracking-wider">Multiplayer Lobby</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="btn-mc uppercase text-[10px] py-1.5 px-4"
        >
          Sign In
        </button>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section className="flex-1 flex items-center px-6 md:px-16 py-16 md:py-28 max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* Left Column: Staggered Entrance */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start space-y-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#2b2b35] border border-[#3c3c44] px-3.5 py-1.5 rounded text-[8px] font-mc-sub text-mc-cyan uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-ping" />
              Server lobby is online — {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </motion.div>

            {/* Title Block */}
            <motion.div variants={fadeUp}>
              <h1
                className="text-3xl md:text-5xl font-black text-white font-mc-title uppercase leading-tight select-none"
                style={{ textShadow: '3px 3px 0px #111011, 5px 5px 0px rgba(0,0,0,0.2)' }}
              >
                HostelBuddy
              </h1>
              <p className="mt-2 text-[10px] md:text-xs text-mc-cyan font-mc-sub uppercase tracking-widest">
                Your Hostel Command Center
              </p>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs md:text-sm text-slate-400 leading-relaxed font-mono-readable max-w-md">
              Your hostel, gamified. Earn XP, claim daily quests, rate the mess furnace, find your ideal roommate party, and manage everything from one clean command center.
            </motion.p>

            {/* Login Buttons */}
            <motion.div variants={fadeUp} className="w-full space-y-3 pt-2">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mc-sub">Select Your Character Role</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={() => handleRoleSelect(UserRole.STUDENT)}
                  className="btn-mc flex-1 flex items-center justify-center gap-2 py-3.5 uppercase glow-cta"
                >
                  <GraduationCap size={15} /> Student Class
                </button>
                <button
                  onClick={() => handleRoleSelect(UserRole.ADMIN)}
                  className="btn-mc flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#404040] hover:bg-[#00d8df] hover:text-[#0b0f19] uppercase"
                >
                  <ShieldCheck size={15} /> Warden Admin
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Animated HUD Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 60, damping: 15 }}
            className="hidden lg:block relative w-full max-w-md mx-auto"
          >
            {/* Ambient glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#00d8df]/10 via-transparent to-[#00e676]/10 rounded-xl blur-2xl opacity-60" />

            <div className="mc-card p-6 space-y-5 bg-[#1f1f26]/90 relative overflow-hidden animate-float">
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

              {/* Header slot */}
              <div className="flex justify-between items-center border-b border-[#26262a] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#141419] border-2 border-[#3c3c44] rounded flex items-center justify-center font-mc-title text-sm text-[#00d8df] shadow-inner">
                    A
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-white font-mc-sub uppercase">Aarav Sharma</h3>
                    <p className="text-[9px] text-[#00e676] font-mc-title uppercase mt-0.5 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">LVL 5</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-500 font-mc-sub uppercase">Advancement Score</p>
                  <p className="text-xs font-bold text-[#ffd500] font-mc-sub mt-0.5">720 PTS</p>
                </div>
              </div>

              {/* Attributes slot */}
              <div className="grid grid-cols-2 gap-4">
                <div className="mc-slot p-3 space-y-1">
                  <span className="text-[8px] text-slate-500 font-mc-sub uppercase">HP (Dining Sat)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">❤️</span>
                    <span className="font-mc-sub text-[10px] text-red-400">9/10</span>
                  </div>
                </div>

                <div className="mc-slot p-3 space-y-1">
                  <span className="text-[8px] text-slate-500 font-mc-sub uppercase">Wallet</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">💚</span>
                    <span className="font-mc-sub text-[10px] text-[#00e676]">85 EM</span>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mc-sub text-slate-400">
                  <span>Level Up Progress</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-[#141419] h-2.5 border border-[#3c3c44] p-0.5 rounded-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                    className="bg-[#00e676] h-full rounded-sm"
                    style={{ boxShadow: '0 0 3px rgba(0,230,118,0.3)' }}
                  />
                </div>
              </div>

              {/* Mini quest preview */}
              <div className="border-t border-[#26262a] pt-3 space-y-2">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">Active Quests</p>
                {['Rate today\'s lunch menu', 'Report a maintenance issue'].map((quest, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-slate-300 font-mono-readable">
                    <span className="w-1.5 h-1.5 bg-[#00d8df] rounded-full animate-pulse shrink-0" />
                    {quest}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══ Animated Stats Counter Section ═══ */}
      <section ref={statsRef} className="px-6 md:px-16 py-16 relative z-20 border-t border-[#1f1f26]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, i) => (
            <StatCounter key={stat.label} stat={stat} index={i} inView={statsInView} />
          ))}
        </div>
      </section>

      {/* ═══ Feature Blocks ═══ */}
      <section className="px-6 md:px-16 py-16 bg-[#1a1a20] border-t-3 border-[#101014] relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12 text-center"
          >
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wider font-mc-title uppercase">Server Attributes</h2>
            <p className="text-slate-500 font-mono-readable mt-2.5 text-xs max-w-lg mx-auto">
              A comprehensive suite of tools deployed for seamless hostel life — issue tracking, meal management, and social matching.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsList.map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="mc-card feature-card-glow p-6 bg-[#1f1f26]/40 hover:bg-[#1f1f26] flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center mb-4"
                    style={{ color: skill.color }}
                  >
                    <skill.icon size={18} />
                  </div>
                  <h3 className="text-[10px] font-black tracking-wide text-white mb-2 font-mc-title uppercase">{skill.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono-readable leading-relaxed">{skill.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[8px] font-mc-sub uppercase tracking-wider" style={{ color: skill.color }}>
                  Explore <ChevronRight size={10} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Testimonial Ticker ═══ */}
      <section className="py-8 bg-[#141419] border-t border-[#1f1f26] relative z-20 overflow-hidden">
        <p className="text-center text-[8px] font-mc-sub text-slate-500 uppercase tracking-widest mb-5">What Players Are Saying</p>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#141419] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#141419] to-transparent z-10 pointer-events-none" />

          <div className="ticker-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="mx-3 shrink-0 mc-card bg-[#1f1f26]/60 p-4 rounded w-[300px] space-y-2"
              >
                <p className="text-[11px] text-slate-300 font-mono-readable leading-relaxed italic">"{t.text}"</p>
                <p className="text-[9px] text-[#00d8df] font-mc-sub uppercase tracking-wider">— {t.user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="px-6 md:px-16 py-10 border-t border-[#26262a] bg-[#101014] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 bg-[#2b2b35] border-2 border-[#101014] rounded flex items-center justify-center font-mc-title text-[10px] text-mc-cyan"
                style={{ boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.05)' }}
              >
                H
              </div>
              <span className="text-[10px] font-mc-title text-white uppercase">HostelBuddy</span>
            </div>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">
              © {new Date().getFullYear()} HostelBuddy OS · Minecraft Edition
            </p>
          </div>

          <div className="flex items-center gap-6">
            {['Quest Log', 'Mess Kitchen', 'Roommates', 'Gate Pass'].map(link => (
              <span key={link} className="text-[9px] text-slate-500 hover:text-mc-cyan cursor-pointer font-mc-sub uppercase tracking-wide transition-colors">
                {link}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate('/login')}
            className="btn-mc uppercase text-[10px] py-2 px-6 glow-cta flex items-center gap-2"
          >
            Play Now <ChevronRight size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
};