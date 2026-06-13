import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockSignInWithGoogle, mockSignInWithEmail } from '../services/authService';
import { User, UserRole } from '../types';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const selectedRoleFromLanding = (location.state as { role?: UserRole })?.role || UserRole.STUDENT;
  const [activeRole, setActiveRole] = useState<UserRole>(selectedRoleFromLanding);

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
    <div className="min-h-screen w-full flex bg-[#141419] text-[#f1f5f9]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#1a1a20] items-center justify-center p-12 border-r-3 border-[#101014]">
        <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-white max-w-lg space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-12 h-12 bg-[#2b2b35] border-2 border-[#101014] rounded flex items-center justify-center font-mc-title text-base text-mc-cyan shadow-inner">
                H
            </div>
            
            <div className="relative inline-block">
              <h1 
                className="text-4xl font-black text-white font-mc-title uppercase select-none tracking-tight leading-none"
                style={{ textShadow: '2px 2px 0px #111011' }}
              >
                HostelBuddy
              </h1>
              <div className="absolute -bottom-2.5 -right-6 text-[#ffd500] font-mc-title text-[9px] uppercase mc-splash origin-center select-none drop-shadow-[0_1.5px_0_rgba(0,0,0,0.8)]">
                Lobby Signin
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed font-mono-readable pt-2">
              Log reports, request digital gate outpasses, review daily dining plans, and coordinate roommate sync matching under a unified console.
            </p>
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
              onClick={() => setActiveRole(UserRole.STUDENT)}
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
              onClick={() => setActiveRole(UserRole.ADMIN)}
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
            onClick={handleGoogleLogin}
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-[#141419] border border-[#26262a] text-[#f1f5f9] rounded text-xs transition-all placeholder:text-slate-600 outline-none pr-10 ${
                  activeRole === UserRole.STUDENT 
                    ? 'focus:!border-mc-cyan focus:!shadow-[0_0_8px_rgba(0,216,223,0.15)]' 
                    : 'focus:!border-mc-gold focus:!shadow-[0_0_8px_rgba(255,190,0,0.15)]'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-500 hover:text-slate-350 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center justify-between text-[11px] pt-1">
                <a 
                  href="#" 
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