import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, PlusCircle, Shield, Bell, Search, LogOut, User as UserIcon, ShieldAlert, Ticket, Utensils, Users } from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  userXp: number;
  userLevel: number;
  userCoins: number;
}

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center space-x-3 px-4 py-2.5 rounded transition-all duration-150 border ${
      isActive
        ? 'bg-[#2b2b35] border-mc-cyan text-[#00d8df] shadow-[inset_0_0_8px_rgba(0,216,223,0.15)] font-bold'
        : 'text-slate-400 border-transparent hover:bg-[#1f1f26] hover:text-[#f1f5f9]'
    }`;

  return (
    <NavLink to={to} className={navItemClass}>
      <span className="text-[#00d8df] group-hover:scale-105 transition-transform">{icon}</span>
      <span className="font-mc-sub text-[10px] tracking-wide uppercase">{label}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, userXp, userLevel, userCoins }) => {
  const xpNeeded = userLevel * 150;
  const xpPercentage = Math.min(100, Math.round((userXp / xpNeeded) * 100));

  return (
    <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col border-r-3 border-[#101014] bg-[#1a1a20] z-50">
      {/* Brand Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center space-x-3.5 mb-2">
          <div 
            className="w-10 h-10 bg-[#2b2b35] border-2 border-[#101014] rounded flex items-center justify-center font-mc-title text-base text-mc-cyan shadow-inner"
            style={{ boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.05)' }}
          >
            H
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mc-title tracking-tight text-white uppercase">HostelBuddy</span>
            <span className="text-[9px] text-[#00d8df] font-mc-sub uppercase tracking-wider mt-1">Lobby Portal</span>
          </div>
        </div>
      </div>

      {/* Minecraft Player HUD Slot */}
      {user.role === UserRole.STUDENT && (
        <div className="px-5 py-4 mx-4 my-2 bg-[#141419] border-2 border-[#101014] rounded relative overflow-hidden shadow-inner">
          {/* Status Label */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">Level Status</span>
            <span className="text-[#00e676] font-mc-title text-[9px] drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
              {userLevel}
            </span>
          </div>

          {/* Minecraft XP Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#31313a] h-2 border border-[#101014] p-0.5 rounded-sm">
              <div 
                className="bg-[#00e676] h-full transition-all duration-300 rounded-sm"
                style={{ width: `${xpPercentage}%`, boxShadow: '0 0 4px rgba(0,230,118,0.4)' }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] font-mono-readable text-slate-400">
              <span>XP: {userXp}/{xpNeeded}</span>
              <span>{xpPercentage}%</span>
            </div>
          </div>

          {/* Emerald Purse */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#26262a]">
            <span className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">Emeralds</span>
            <div className="flex items-center gap-1.5 text-mc-emerald font-mc-sub text-[10px] font-bold">
              <span>💚</span>
              <span className="text-[#00e676]">{userCoins} EM</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mc-sub">Main Menu</p>
        <NavItem to="/dashboard" icon={<Home size={16} />} label="Command Block" />
        <NavItem to="/issues" icon={<List size={16} />} label="Quest Log" />
        <NavItem to="/announcements" icon={<Bell size={16} />} label="Notice Board" />

        {user.role === UserRole.STUDENT && (
          <>
            <NavItem to="/outpass" icon={<Ticket size={16} />} label="Gate Pass" />
            <NavItem to="/mess" icon={<Utensils size={16} />} label="Mess Kitchen" />
            <NavItem to="/roommates" icon={<Users size={16} />} label="Roommates" />
            <NavItem to="/report" icon={<PlusCircle size={16} />} label="New Report" />
            <NavItem to="/lost-found" icon={<Search size={16} />} label="Lost & Found" />
            <NavItem to="/profile" icon={<UserIcon size={16} />} label="My Stats" />
          </>
        )}
        
        {user.role === UserRole.ADMIN && (
          <div className="pt-4 mt-2">
            <p className="px-4 text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mc-sub">Admin Console</p>
            <NavItem to="/admin" icon={<Shield size={16} />} label="World Control" />
          </div>
        )}
      </nav>

      {/* Safety Cell Link */}
      <div className="px-4 py-2">
          <div className="my-1 border-t border-[#26262a]"></div>
          {user.role === UserRole.STUDENT && (
            <NavLink to="/ragging" className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-2 rounded border transition-all duration-150 ${
                isActive
                  ? 'bg-red-950/20 border-mc-red text-mc-red font-bold shadow-[inset_0_0_8px_rgba(239,68,68,0.15)]'
                  : 'text-mc-red border-transparent hover:bg-red-950/10'
              }`
            }>
              <ShieldAlert size={16} className="text-mc-red animate-pulse" />
              <span className="font-mc-sub text-[10px] tracking-wide uppercase">Anti-Ragging</span>
            </NavLink>
          )}
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="p-4 border-t-3 border-[#101014] bg-[#141419]">
        <div className="flex items-center p-2.5 bg-[#1f1f26] border border-[#26262a] rounded mb-2.5 shadow-inner">
           <div className="w-7 h-7 rounded bg-[#2b2b35] border border-[#101014] flex items-center justify-center text-mc-cyan font-mc-title text-xs font-bold">
               {user.name[0]}
           </div>
           <div className="ml-2.5 overflow-hidden">
                <p className="text-[10px] font-bold text-white truncate font-mc-sub uppercase">{user.name.split(' ')[0]}</p>
                <p className="text-[8px] text-slate-500 font-mono-readable uppercase tracking-wider mt-0.5">{user.role}</p>
           </div>
        </div>
        <button onClick={onLogout} className="flex items-center justify-center space-x-2 px-3 py-2 w-full text-slate-400 hover:text-mc-red hover:bg-red-950/10 border border-transparent hover:border-mc-red/25 rounded transition-all font-mc-sub text-[9px] uppercase tracking-wider">
          <LogOut size={14} />
          <span>Exit Game</span>
        </button>
      </div>
    </aside>
  );
};