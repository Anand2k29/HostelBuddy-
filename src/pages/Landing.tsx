import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { GraduationCap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    navigate('/login', { state: { role } });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden font-sans">
      {/* Subtle background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-indigo-200/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mb-12"
        >
          <motion.div variants={item} className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm border border-gray-200/80 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg shadow-blue-200">HB</div>
            <span className="text-md font-bold text-gray-800 tracking-tight pr-4">HostelBuddy</span>
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tighter mb-5 leading-tight">
            Seamless Hostel Living,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Perfectly Managed.</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Your all-in-one solution for issue reporting, community updates, and efficient hostel administration.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
        >
          {/* Student Card */}
          <RoleCard
            role={UserRole.STUDENT}
            title="Student"
            description="Report issues, track requests, and view important announcements in your student portal."
            icon={<GraduationCap size={32} />}
            onSelect={handleRoleSelect}
            color="blue"
          />

          {/* Admin Card */}
          <RoleCard
            role={UserRole.ADMIN}
            title="Admin"
            description="Manage facilities, assign tasks, and oversee all hostel operations from the admin dashboard."
            icon={<ShieldCheck size={32} />}
            onSelect={handleRoleSelect}
            color="indigo"
          />
        </motion.div>
      </div>
      
      <footer className="p-8 text-center text-gray-500 text-sm font-medium">
        &copy; {new Date().getFullYear()} HostelBuddy. All Rights Reserved.
      </footer>
    </div>
  );
};

// A new component for the role cards to keep the code clean
interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'indigo';
  onSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, title, description, icon, color, onSelect }) => {
  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -8, transition: { type: 'spring', stiffness: 300 } }
  };

  const arrowVariants = {
    rest: { x: 0 },
    hover: { x: 5, transition: { type: 'spring', stiffness: 400 } }
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      shadow: 'hover:shadow-blue-500/10',
      border: 'hover:border-blue-500/30'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      shadow: 'hover:shadow-indigo-500/10',
      border: 'hover:border-indigo-500/30'
    }
  };

  return (
    <motion.button
      onClick={() => onSelect(role)}
      className={`group relative text-left glass-card p-8 overflow-hidden transition-all duration-300 ${colorClasses[color].shadow} ${colorClasses[color].border}`}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      layout
    >
      <div className={`absolute top-8 right-8 text-gray-300 group-hover:${colorClasses[color].text} transition-colors`}>
        <motion.div variants={arrowVariants}>
          <ArrowRight size={24} />
        </motion.div>
      </div>
      <div className={`w-16 h-16 ${colorClasses[color].bg} ${colorClasses[color].text} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 font-medium leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center space-x-2 text-sm text-green-600 font-semibold">
        <CheckCircle2 size={16} />
        <span>Get Started</span>
      </div>
    </motion.button>
  );
};