import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, PlusCircle, Bell, Search, LogOut, Shield, Menu, X } from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-slate-100 text-slate-900'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
                HB
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight hidden md:block">HostelBuddy</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-2">
              <NavLink to="/dashboard" className={navItemClass}>
                <Home size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/issues" className={navItemClass}>
                <List size={18} />
                <span>Issues</span>
              </NavLink>
              <NavLink to="/report" className={navItemClass}>
                <PlusCircle size={18} />
                <span>Report</span>
              </NavLink>
              <NavLink to="/announcements" className={navItemClass}>
                <Bell size={18} />
                <span>Announcements</span>
              </NavLink>
               <NavLink to="/lost-found" className={navItemClass}>
                <Search size={18} />
                <span>Lost & Found</span>
              </NavLink>
              {user.role === UserRole.ADMIN && (
                <NavLink to="/admin" className={navItemClass}>
                  <Shield size={18} />
                  <span>Admin</span>
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm bg-slate-100"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {user.name[0]}
                </div>
              )}
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <NavLink to="/dashboard" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                <Home size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/issues" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                <List size={18} />
                <span>Issues</span>
              </NavLink>
              <NavLink to="/report" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                <PlusCircle size={18} />
                <span>Report</span>
              </NavLink>
              {user.role === UserRole.ADMIN && (
                <NavLink to="/admin" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  <Shield size={18} />
                  <span>Admin Panel</span>
                </NavLink>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};