import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockSignInWithGoogle, mockSignInWithEmail } from '../services/authService';
import { User, UserRole } from '../types';
import { Loader2, ArrowRight, Eye, EyeOff, Volume2, VolumeX, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cheatCode, setCheatCode] = useState('');
  const [cheatStatus, setCheatStatus] = useState<string | null>(null);
  const [cheatClass, setCheatClass] = useState<string | null>(null);

  const selectedRoleFromLanding = (location.state as { role?: UserRole })?.role || UserRole.STUDENT;
  const [activeRole, setActiveRole] = useState<UserRole>(selectedRoleFromLanding);

  const playRetroSound = (type: 'tab' | 'click' | 'success' | 'fail' | 'type') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'tab') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'type') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100 + Math.random() * 50, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.setValueAtTime(329.63, now + 0.06);
        osc.frequency.setValueAtTime(392.00, now + 0.12);
        osc.frequency.setValueAtTime(523.25, now + 0.18);
        osc.frequency.setValueAtTime(659.25, now + 0.24);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (err) {
      console.warn("Web Audio Context not allowed or initialized yet", err);
    }
  };

  const handleCheatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCheatCode(value);
    playRetroSound('type');

    if (value === '') {
      setCheatStatus(null);
      setCheatClass(null);
      return;
    }

    const codeLower = value.toLowerCase().trim();
    if (codeLower === 'emerald') {
      setCheatStatus('emerald rain');
      setCheatClass('Emerald Hoarder');
      playRetroSound('success');
    } else if (codeLower === 'kernel') {
      setCheatStatus('kernel hack');
      setCheatClass('Hackathon Winner');
      playRetroSound('success');
    } else if (codeLower === 'godmode') {
      setCheatStatus('god activated');
      setCheatClass('Legendary Deity');
      playRetroSound('success');
    } else if (value.length > 8) {
      setCheatStatus('unknown');
      playRetroSound('fail');
      setTimeout(() => {
        setCheatStatus(null);
        setCheatCode('');
      }, 1500);
    }
  };

  const handleAuthSuccess = (user: User) => {
    const userWithSelectedRole: User = { ...user, role: activeRole };
    onLogin(userWithSelectedRole);
    if (userWithSelectedRole.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      let user = await mockSignInWithGoogle();
      if (activeRole === UserRole.ADMIN) {
        user = {
          ...user,
          name: "Warden Suresh Reddy",
          email: "warden@college.edu",
          photoURL: "https://api.dicebear.com/8.x/initials/svg?seed=Felix"
        };
      } else {
        user = {
          ...user,
          name: "Aarav Sharma",
          email: "aarav.s@student.college.edu",
          photoURL: "https://api.dicebear.com/8.x/initials/svg?seed=Aarav"
        };
      }
      handleAuthSuccess(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await mockSignInWithEmail(email);
      handleAuthSuccess(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <div className="min-h-screen w-full flex bg-[#141419] text-[#f1f5f9] relative">
      
      {/* 🔊 Sound Toggle Button */}
      <button 
        onClick={() => { setSoundEnabled(!soundEnabled); playRetroSound('click'); }} 
        className="absolute top-6 right-6 z-[9999] text-[8px] font-mc-sub uppercase flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1f1f26] border border-[#3c3c44] text-slate-400 hover:text-white cursor-pointer hover:border-mc-cyan/30 transition-all shadow-md"
      >
        {soundEnabled ? <Volume2 size={12} className="text-[#00e676]" /> : <VolumeX size={12} className="text-red-500" />}
        <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
      </button>

      {/* 💎 Floating Emerald Rain (Cheat command activation effect) */}
      {cheatStatus && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-lg select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-40px`,
                animation: `float-particle linear infinite`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              💎
            </div>
          ))}
        </div>
      )}

      {/* Left Side - Character Sheet Grid */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#1a1a20] items-center justify-center p-12 border-r-3 border-[#101014]">
        <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-white max-w-md space-y-6 w-full"
        >
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2b2b35] border-2 border-[#101014] rounded flex items-center justify-center font-mc-title text-sm text-mc-cyan shadow-inner">
                  H
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-mc-title tracking-tight text-white uppercase">HostelBuddy</span>
                <span className="text-[8px] text-mc-cyan font-mc-sub uppercase tracking-wider">Your Campus OS</span>
              </div>
            </div>

            <div className="relative inline-block mt-2">
              <h1 
                className="text-4xl font-black text-white font-mc-title uppercase select-none tracking-tight leading-none"
                style={{ textShadow: '3px 3px 0px #111011' }}
              >
                HostelBuddy
              </h1>
              <div className="absolute -bottom-2.5 -right-6 text-[#ffd500] font-mc-title text-[9px] uppercase mc-splash origin-center select-none drop-shadow-[0_1.5px_0_rgba(0,0,0,0.8)]">
                Lobby Signin
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-mono-readable pt-2">
              Log reports, request digital gate outpasses, review daily dining plans, and coordinate roommate sync matching under a unified console.
            </p>
          </motion.div>

          {/* Character Card Info Panel */}
          <motion.div
            key={activeRole}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className={`mc-card p-6 bg-[#1f1f26]/95 border-3 relative overflow-hidden transition-all duration-300 ${
              activeRole === UserRole.STUDENT 
                ? 'border-[#00d8df]/40 shadow-[0_0_20px_rgba(0,216,223,0.08)]' 
                : 'border-[#ffbe00]/40 shadow-[0_0_20px_rgba(255,190,0,0.08)]'
            }`}
          >
            <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none"></div>
            
            <div className="border-b border-[#26262a] pb-3 flex justify-between items-center mb-4">
              <span className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">LOBBY HERO STATS</span>
              <span className={`text-[8px] font-mc-sub uppercase tracking-widest px-2 py-0.5 rounded border ${
                activeRole === UserRole.STUDENT 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-mc-cyan' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-mc-gold'
              }`}>
                {activeRole === UserRole.STUDENT ? 'CLASS: STUDENT' : 'CLASS: ADMIN'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Dynamic Relic Weapon */}
              <div className={`w-20 h-20 rounded border-2 bg-[#141419] flex items-center justify-center relative shrink-0 shadow-inner ${
                activeRole === UserRole.STUDENT ? 'border-[#00d8df]/30' : 'border-[#ffbe00]/30'
              }`}>
                {activeRole === UserRole.STUDENT ? (
                  <svg className="w-12 h-12 animate-float" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 54L34 30M34 30L44 20L48 24L38 34L34 30ZM8 56L14 50M14 56L8 50" stroke="#00d8df" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="46" cy="22" r="3" fill="#00d8df" />
                    <rect x="22" y="14" width="28" height="18" rx="2" transform="rotate(25 22 14)" stroke="#e2e8f0" strokeWidth="3" fill="#1f1f26" />
                    <line x1="32" y1="20" x2="44" y2="25" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 animate-float" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 28L18 40H46L52 28L40 34L32 20L24 34L12 28Z" fill="#ffbe00" stroke="#ffbe00" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="32" cy="18" r="2" fill="#ffbe00" />
                    <circle cx="12" cy="26" r="1.5" fill="#ffbe00" />
                    <circle cx="52" cy="26" r="1.5" fill="#ffbe00" />
                    <path d="M22 46H38M38 46V52M34 46V52" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="30" cy="46" r="5" stroke="#ffbe00" strokeWidth="3" />
                  </svg>
                )}
                <span className="absolute -bottom-1.5 -right-1.5 text-[6px] font-mc-sub bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-slate-400">LVL 99</span>
              </div>

              {/* Class attributes */}
              <div className="space-y-1.5 text-left w-full">
                <h3 className={`font-mc-title text-[11px] leading-tight ${
                  cheatClass ? 'text-purple-400 animate-pulse font-black' : activeRole === UserRole.STUDENT ? 'text-mc-cyan' : 'text-mc-gold'
                }`}>
                  {cheatClass || (activeRole === UserRole.STUDENT ? 'Quest Pathfinder' : 'Lobby Overlord')}
                </h3>
                <p className="text-[8px] font-mc-sub text-slate-500 uppercase tracking-wider">Character Stats & Equipment</p>
                
                <div className="space-y-1 font-mono-readable text-[9px] text-slate-400">
                  <div className="flex justify-between py-0.5 border-b border-[#26262a]">
                    <span>Relic Weapon:</span>
                    <span className="text-white font-bold">{activeRole === UserRole.STUDENT ? 'Broadsword of Grievance' : 'Key of Authority'}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#26262a]">
                    <span>Passive Perk:</span>
                    <span className="text-white font-bold">{activeRole === UserRole.STUDENT ? 'Outpass Sprint (+10 speed)' : 'Aura of Order'}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#26262a]">
                    <span>Guild Skill:</span>
                    <span className="text-mc-green font-bold">{activeRole === UserRole.STUDENT ? 'Whisper (Anonymous reports)' : 'Broadcast Notices'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26262a] text-[9px] font-mc-sub text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>Status: Ready for lobby</span>
              <span className={`w-2 h-2 rounded-full ${activeRole === UserRole.STUDENT ? 'bg-mc-cyan shadow-[0_0_6px_#00d8df]' : 'bg-mc-gold shadow-[0_0_6px_#ffbe00]'} animate-pulse`} />
            </div>
          </motion.div>

          {/* Interactive Cheat Box */}
          <motion.div 
            variants={itemVariants}
            className="mc-slot p-3 bg-[#141419]/90 border border-[#26262a] rounded flex items-center gap-3"
          >
            <div className="p-1.5 bg-[#1f1f26] text-slate-400 rounded border border-[#26262a]">
              <Terminal size={12} className="text-slate-500" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <span className="block text-[7px] font-mc-sub text-slate-500 uppercase tracking-widest mb-0.5">Secret Quest Command line</span>
              <input
                type="text"
                placeholder="try typing: emerald, kernel, or godmode..."
                value={cheatCode}
                onChange={handleCheatChange}
                className="w-full bg-transparent font-mono-readable text-[10px] text-[#e2e8f0] outline-none border-none p-0 focus:ring-0 placeholder:text-slate-700"
              />
            </div>
            {cheatStatus && (
              <span className="text-[7px] font-mc-sub bg-mc-green/10 border border-mc-green/30 text-mc-green px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
                {cheatStatus}
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#141419]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`w-full max-w-sm mc-card bg-[#1f1f26] p-8 shadow-2xl relative transition-all duration-300 border-3 ${
            activeRole === UserRole.STUDENT 
              ? 'border-[#00d8df]/30 hover:border-[#00d8df]/60 shadow-[0_0_20px_rgba(0,216,223,0.05)]' 
              : 'border-[#ffbe00]/30 hover:border-[#ffbe00]/60 shadow-[0_0_20px_rgba(255,190,0,0.05)]'
          }`}
        >
          <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
          
          <motion.div variants={itemVariants} className="mb-5 text-center">
            <h2 className="text-lg font-black text-white font-mc-title uppercase tracking-wide">Enter Lobby</h2>
            <p className="text-[10px] text-slate-500 font-mono-readable uppercase tracking-widest mt-1.5">Enter credentials to load server credentials</p>
          </motion.div>

          {/* Segmented Tab Selector */}
          <motion.div variants={itemVariants} className="flex p-1 bg-[#141419]/80 rounded border border-[#26262a] mb-6">
            <button
              type="button"
              onClick={() => { setActiveRole(UserRole.STUDENT); playRetroSound('tab'); }}
              className={`flex-1 py-2 text-[8px] font-mc-sub uppercase tracking-wider transition-all rounded cursor-pointer ${
                activeRole === UserRole.STUDENT
                  ? 'bg-[#2b2b35] text-mc-cyan font-bold border border-[#3c3c44] shadow-inner'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Student Account
            </button>
            <button
              type="button"
              onClick={() => { setActiveRole(UserRole.ADMIN); playRetroSound('tab'); }}
              className={`flex-1 py-2 text-[8px] font-mc-sub uppercase tracking-wider transition-all rounded cursor-pointer ${
                activeRole === UserRole.ADMIN
                  ? 'bg-[#2b2b35] text-mc-gold font-bold border border-[#3c3c44] shadow-inner'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Warden Panel
            </button>
          </motion.div>

          {/* Google Login button */}
          <motion.button
            variants={itemVariants}
            onClick={() => { handleGoogleLogin(); playRetroSound('click'); }}
            disabled={isLoading}
            className={`btn-mc w-full flex items-center justify-center space-x-3 mb-6 uppercase text-[10px] ${
              activeRole === UserRole.ADMIN ? 'hover:!bg-[#ffbe00] hover:!text-black hover:!shadow-[inset_2px_2px_0px_#ffe47e,inset_-2px_-2px_0px_#a67c00]' : ''
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 shrink-0" />
                <span>Google credentials</span>
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#26262a]"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-mc-sub uppercase">
              <span className="px-4 bg-[#1f1f26] text-slate-500">OR</span>
            </div>
          </motion.div>

          <form onSubmit={handleEmailLogin} className="space-y-4 font-mono-readable">
            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-mc-sub uppercase tracking-wider text-slate-400 mb-1.5">Email Slot</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); playRetroSound('type'); }}
                className={`w-full px-3.5 py-2.5 bg-[#141419] border border-[#26262a] text-[#f1f5f9] rounded text-xs transition-all placeholder:text-slate-600 outline-none ${
                  activeRole === UserRole.STUDENT 
                    ? 'focus:!border-mc-cyan focus:!shadow-[0_0_8px_rgba(0,216,223,0.15)]' 
                    : 'focus:!border-mc-gold focus:!shadow-[0_0_8px_rgba(255,190,0,0.15)]'
                }`}
                placeholder="you@college.edu"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-[10px] font-mc-sub uppercase tracking-wider text-slate-400 mb-1.5">Password Key</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); playRetroSound('type'); }}
                className={`w-full px-3.5 py-2.5 bg-[#141419] border border-[#26262a] text-[#f1f5f9] rounded text-xs transition-all placeholder:text-slate-600 outline-none pr-10 ${
                  activeRole === UserRole.STUDENT 
                    ? 'focus:!border-mc-cyan focus:!shadow-[0_0_8px_rgba(0,216,223,0.15)]' 
                    : 'focus:!border-mc-gold focus:!shadow-[0_0_8px_rgba(255,190,0,0.15)]'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => { setShowPassword(!showPassword); playRetroSound('click'); }}
                className="absolute right-3 top-9 text-slate-500 hover:text-slate-350 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center justify-between text-[11px] pt-1">
                <a 
                  href="#" 
                  onClick={() => playRetroSound('click')}
                  className={`font-semibold hover:underline uppercase tracking-wide text-[10px] ${
                    activeRole === UserRole.STUDENT ? 'text-mc-cyan' : 'text-mc-gold'
                  }`}
                >
                  Forgot Key?
                </a>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                onClick={() => playRetroSound('click')}
                className={`btn-mc w-full flex items-center justify-center space-x-2 uppercase py-3 text-[10px] ${
                  activeRole === UserRole.ADMIN ? 'hover:!bg-[#ffbe00] hover:!text-black hover:!shadow-[inset_2px_2px_0px_#ffe47e,inset_-2px_-2px_0px_#a67c00]' : ''
                }`}
              >
                <span>{isLoading ? 'Loading...' : 'Sign In'}</span>
                {!isLoading && <ArrowRight size={14} />}
              </button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-6 text-center text-[10px] text-slate-500 uppercase tracking-widest">
            First login?{' '}
            <a 
              href="#" 
              onClick={() => playRetroSound('click')}
              className={`font-bold hover:underline ${
                activeRole === UserRole.STUDENT ? 'text-mc-cyan' : 'text-mc-gold'
              }`}
            >
              Deploy account
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};