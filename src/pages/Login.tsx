import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await mockSignInWithGoogle();
      onLogin(user);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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
      onLogin(user);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05)_0%,_transparent_30%)]"></div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-lg">
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">HB</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tighter">
              Welcome to the Future of Hostel Living.
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              HostelBuddy streamlines everything from reporting issues to staying connected with your community.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
          </motion.div>

          <motion.button
            variants={itemVariants}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 mb-6 shadow-sm"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-gray-400" size={20} />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">OR</span>
            </div>
          </motion.div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="you@example.com"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 group"
                whileTap={{ scale: 0.98 }}
              >
                <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Sign up</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};