import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, PlusCircle, Shield, Bell, Search, LogOut, User as UserIcon, Settings, LifeBuoy, ShieldAlert } from 'lucide-react';
import { User, UserRole } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-500 shadow-lg shadow-blue-500/30 text-white font-semibold'
        : 'text-gray-500 hover:bg-gray-200/60 hover:text-gray-900'
    }`;

  return (
    <NavLink to={to} className={navItemClass}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col border-r border-gray-200/80 bg-white/90 backdrop-blur-xl z-50">
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-300">
            HB
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">HostelBuddy</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
        <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
        <NavItem to="/profile" icon={<UserIcon size={20} />} label="My Profile" />
        <NavItem to="/issues" icon={<List size={20} />} label="All Issues" />
        <NavItem to="/report" icon={<PlusCircle size={20} />} label="Report Issue" />
        <NavItem to="/announcements" icon={<Bell size={20} />} label="Announcements" />
        <NavItem to="/lost-found" icon={<Search size={20} />} label="Lost & Found" />
        
        {user.role === UserRole.ADMIN && (
          <div className="pt-4 mt-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin</p>
            <NavItem to="/admin" icon={<Shield size={20} />} label="Admin Console" />
          </div>
        )}
      </nav>

      <div className="px-4 py-2">
          <div className="my-2 border-t border-gray-200/80"></div>
          <NavLink to="/ragging" className={({ isActive }) =>
    `group relative flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-rose-100 text-rose-700 font-semibold'
        : 'text-rose-600 hover:bg-rose-50/60 hover:text-rose-700'
    }`
  }>
            <ShieldAlert size={20} />
            <span>Anti-Ragging Cell</span>
          </NavLink>
      </div>

      <div className="p-4 space-y-2 border-t border-gray-200/80">
        <div className="flex items-center p-3 bg-gray-100/60 rounded-xl">
           {user.photoURL ? (
                <img src={user.photoURL} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
           ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {user.name[0]}
                </div>
           )}
           <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
           </div>
        </div>
        <button onClick={onLogout} className="flex items-center space-x-3 px-4 py-2.5 w-full text-gray-500 hover:text-red-600 hover:bg-red-100/50 rounded-lg transition-colors font-medium">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};