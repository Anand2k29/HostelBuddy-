import React, { useState } from 'react';
import { User, Issue, IssueStatus } from '../types';
import { Mail, MapPin, Hash, CheckCircle2, AlertCircle, Edit2, Save, X, Phone, Trophy, Zap, Shield, Flame, Star, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfileProps {
  user: User;
  issues: Issue[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, issues }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'quests' | 'achievements'>('quests');
  
  // Local state to manage edits before saving
  const [formData, setFormData] = useState({
    name: user.name,
    roomNumber: user.roomNumber,
    email: user.email,
    phone: '+91 9876 543 210' // Mock phone since it's not in User type yet
  });

  const myIssues = issues.filter(i => i.reporterId === user.id);
  const resolvedCount = myIssues.filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED).length;
  const pendingCount = myIssues.filter(i => i.status === IssueStatus.REPORTED || i.status === IssueStatus.ASSIGNED).length;
  const inProgressCount = myIssues.filter(i => i.status === IssueStatus.IN_PROGRESS).length;
  const totalCount = myIssues.length;

  // Level & XP stats mapping
  const xp = resolvedCount * 150 + inProgressCount * 50 + pendingCount * 20;
  const level = Math.floor(xp / 300) + 1;
  const currentLevelXp = xp % 300;
  const nextLevelXp = 300;
  const progressPercent = Math.min((currentLevelXp / nextLevelXp) * 100, 100);
  const emeralds = resolvedCount * 25 + inProgressCount * 5;

  // Completion ring
  const completionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // Achievements
  const achievements = [
    { name: 'First Quest', desc: 'Report your first issue', unlocked: totalCount >= 1, icon: '⚔️', color: '#00d8df' },
    { name: 'Quest Slayer', desc: 'Resolve 3 quests', unlocked: resolvedCount >= 3, icon: '🏆', color: '#ffbe00' },
    { name: 'Guild Regular', desc: 'Report 5 issues', unlocked: totalCount >= 5, icon: '🛡️', color: '#00e676' },
    { name: 'Emerald Hoarder', desc: 'Earn 100 emeralds', unlocked: emeralds >= 100, icon: '💎', color: '#a78bfa' },
    { name: 'Streak Master', desc: 'Report 3 days in a row', unlocked: false, icon: '🔥', color: '#f2ab13' },
    { name: 'Village Elder', desc: 'Reach Level 10', unlocked: level >= 10, icon: '👑', color: '#ef4444' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'REPORTED': return 'bg-zinc-800 text-slate-300 border border-zinc-700';
      case 'ASSIGNED': return 'bg-amber-950/60 text-mc-gold border border-mc-gold/30';
      case 'IN_PROGRESS': return 'bg-cyan-950/60 text-mc-cyan border border-mc-cyan/30';
      case 'RESOLVED': return 'bg-emerald-950/60 text-mc-green border border-mc-green/30';
      case 'CLOSED': return 'bg-zinc-900 text-zinc-500 border border-zinc-800';
      default: return 'bg-zinc-800 text-slate-400';
    }
  };

  const handleSave = () => {
    console.log("Saving user data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      roomNumber: user.roomNumber,
      email: user.email,
      phone: '+91 9876 543 210'
    });
    setIsEditing(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const InputField = ({ label, value, onChange, icon: Icon, type = "text", disabled = false }: any) => (
    <div className={`mc-slot flex items-center p-3.5 transition-all duration-200 ${isEditing && !disabled ? 'border-mc-cyan' : 'border-zinc-800'}`}>
      <div className="p-2 bg-zinc-950/50 text-slate-400 mr-3 border border-zinc-800/40 rounded flex items-center justify-center">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-mc-sub text-slate-500 uppercase tracking-wider mb-0.5">{label}</span>
        {isEditing && !disabled ? (
          <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent font-mono-readable text-xs text-white outline-none border-none p-0 focus:ring-0 placeholder:text-zinc-600"
          />
        ) : (
          <span className="block font-mono-readable text-xs text-slate-200 truncate">{value}</span>
        )}
      </div>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto p-4"
    >
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-mc-title text-white">CHARACTER SHEETS</h1>
          <p className="text-xs font-mc-sub text-slate-400 mt-1">Manage your active attributes and check registry logs.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ═══ Left: Profile Card (4 cols) ═══ */}
        <motion.div variants={item} className="lg:col-span-4 mc-card p-6 relative overflow-hidden bg-mc-card">
          
          {/* Edit Button Group */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="p-1.5 bg-zinc-850 hover:bg-mc-red/80 text-slate-300 hover:text-white rounded border border-zinc-700 transition-all cursor-pointer"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
                <button 
                  onClick={handleSave}
                  className="btn-mc flex items-center space-x-1.5 py-1 px-3 text-[10px]"
                >
                  <Save size={12} />
                  <span>SAVE</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-mc flex items-center space-x-1.5 py-1 px-3 text-[10px]"
              >
                <Edit2 size={12} />
                <span>EDIT</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center text-center mt-6">
            <div className="relative mb-5 group">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-24 h-24 rounded object-cover border-4 border-zinc-950 shadow-md transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-24 h-24 rounded bg-zinc-900 flex items-center justify-center text-mc-cyan text-3xl font-mc-title border-4 border-zinc-950 shadow-md">
                  {user.name[0]}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-mc-green rounded border-2 border-zinc-950"></div>
            </div>
            
            {/* Name Field */}
            {isEditing ? (
              <input 
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="font-mc-title text-base text-white text-center bg-zinc-950 border-2 border-zinc-850 focus:border-mc-cyan outline-none w-full max-w-[180px] py-1 px-2 mb-1 rounded"
              />
            ) : (
              <h2 className="font-mc-title text-base text-white mb-1">{formData.name}</h2>
            )}

            <span className="font-mc-sub px-2.5 py-0.5 bg-zinc-950 border border-zinc-800 text-mc-cyan rounded text-[9px] uppercase tracking-wider mt-1.5 mb-5">
              {user.role}
            </span>

            {/* Level and XP HUD */}
            <div className="w-full bg-zinc-950/60 border border-zinc-800 p-3.5 rounded mb-5 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mc-sub text-[10px] text-mc-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy size={11} className="text-mc-gold" /> Lvl {level} Explorer
                </span>
                <span className="font-mono-readable text-[10px] text-slate-400">{currentLevelXp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded overflow-hidden p-0.5 border border-zinc-800">
                <motion.div 
                  className="bg-gradient-to-r from-mc-gold to-amber-400 h-full rounded-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Form Slots */}
            <div className="w-full space-y-3 text-left">
              <InputField 
                label="Email Address" 
                value={formData.email} 
                icon={Mail} 
                disabled={true} 
                onChange={() => {}} 
              />
              <InputField 
                label="Phone Number" 
                value={formData.phone} 
                icon={Phone} 
                onChange={(val: string) => setFormData({...formData, phone: val})} 
              />
              <InputField 
                label="Room Number" 
                value={formData.roomNumber} 
                icon={MapPin} 
                onChange={(val: string) => setFormData({...formData, roomNumber: val})} 
              />
              <InputField 
                label="User ID" 
                value={`#${user.id}`} 
                icon={Hash} 
                disabled={true}
                onChange={() => {}} 
              />
            </div>
          </div>
        </motion.div>

        {/* ═══ Right: Stats + Content (8 cols) ═══ */}
        <div className="lg:col-span-8 space-y-6">

          {/* Stats Row - 4 interactive cards */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Quests', value: totalCount, icon: Flame, color: '#00d8df', bg: 'rgba(0,216,223,0.08)', border: 'rgba(0,216,223,0.2)' },
              { label: 'Active Quests', value: pendingCount + inProgressCount, icon: AlertCircle, color: '#ffbe00', bg: 'rgba(255,190,0,0.08)', border: 'rgba(255,190,0,0.2)' },
              { label: 'Resolved', value: resolvedCount, icon: CheckCircle2, color: '#00e676', bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.2)' },
              { label: 'Emeralds', value: emeralds, icon: Star, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="mc-card p-4 bg-mc-card cursor-default group transition-all duration-200 overflow-hidden relative"
                style={{ borderColor: `${stat.border}` }}
              >
                {/* Subtle hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                     style={{ background: `radial-gradient(circle at 50% 120%, ${stat.bg}, transparent 70%)` }} 
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-1.5 rounded border" style={{ color: stat.color, borderColor: stat.border, backgroundColor: stat.bg }}>
                      <stat.icon size={14} />
                    </div>
                    <TrendingUp size={10} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                  <h3 className="font-mc-title text-xl text-white group-hover:text-mc-cyan transition-colors">{stat.value}</h3>
                  <p className="font-mc-sub text-[8px] text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Completion Ring + Quick Info Row */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Completion Ring Card */}
            <div className="mc-card p-5 bg-mc-card flex flex-col items-center justify-center relative">
              <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Track */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#26262a" strokeWidth="6" />
                {/* Progress */}
                <motion.circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#00e676" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mc-title text-xl text-white">{completionRate}%</span>
                <span className="font-mc-sub text-[7px] text-slate-500 uppercase tracking-wider">Resolved</span>
              </div>
            </div>

            {/* Quick Stats Side */}
            <div className="md:col-span-2 mc-card p-5 bg-mc-card space-y-3">
              <h3 className="font-mc-sub text-[10px] text-slate-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Quick Stats</h3>
              {[
                { label: 'Total XP Earned', value: `${xp} XP`, icon: Zap, color: '#ffbe00' },
                { label: 'Current Level', value: `Level ${level}`, icon: Shield, color: '#00d8df' },
                { label: 'Avg Resolution', value: totalCount > 0 ? `${Math.round((resolvedCount / totalCount) * 100)}%` : '—', icon: TrendingUp, color: '#00e676' },
                { label: 'Active Streak', value: '2 days', icon: Flame, color: '#f2ab13' },
              ].map(qs => (
                <div key={qs.label} className="flex items-center justify-between py-1 group cursor-default hover:bg-zinc-900/30 px-2 rounded transition-colors -mx-2">
                  <div className="flex items-center gap-2.5">
                    <qs.icon size={13} style={{ color: qs.color }} />
                    <span className="font-mono-readable text-[11px] text-slate-400">{qs.label}</span>
                  </div>
                  <span className="font-mc-sub text-[11px] text-white">{qs.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs: Quests / Achievements */}
          <motion.div variants={item} className="mc-card bg-mc-card overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-zinc-800">
              <button 
                onClick={() => setActiveTab('quests')}
                className={`flex-1 px-4 py-3 text-[10px] font-mc-sub uppercase tracking-wider transition-all ${
                  activeTab === 'quests' 
                    ? 'text-mc-cyan border-b-2 border-mc-cyan bg-zinc-900/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Clock size={11} /> My Quest Logs
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('achievements')}
                className={`flex-1 px-4 py-3 text-[10px] font-mc-sub uppercase tracking-wider transition-all ${
                  activeTab === 'achievements' 
                    ? 'text-mc-gold border-b-2 border-mc-gold bg-zinc-900/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Trophy size={11} /> Achievements
                </span>
              </button>
            </div>

            {/* Quests Tab */}
            {activeTab === 'quests' && (
              myIssues.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-950/50 border-b border-zinc-800">
                      <tr>
                        <th className="px-5 py-3 font-mc-sub text-[9px] uppercase text-slate-400 tracking-wider">Quest Detail</th>
                        <th className="px-5 py-3 font-mc-sub text-[9px] uppercase text-slate-400 tracking-wider">Status</th>
                        <th className="px-5 py-3 font-mc-sub text-[9px] uppercase text-slate-400 tracking-wider text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {myIssues.map((issue, idx) => (
                        <motion.tr 
                          key={issue.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-zinc-900/30 transition-colors cursor-default group"
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">{issue.title}</div>
                            <div className="font-mono-readable text-[10px] text-slate-500 truncate max-w-[280px] mt-0.5">{issue.description}</div>
                          </td>
                          <td className="px-5 py-3.5 font-mc-sub">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                              {issue.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono-readable text-[10px] text-slate-400">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 font-mc-sub text-xs">
                  Registry archive is empty. No logged scrolls found.
                </div>
              )
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.map((ach, i) => (
                  <motion.div
                    key={ach.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className={`p-4 rounded border-2 text-center transition-all duration-200 cursor-default group ${
                      ach.unlocked 
                        ? 'bg-zinc-900/50 border-zinc-700 hover:border-mc-gold' 
                        : 'bg-zinc-950/40 border-zinc-800/50 opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{ach.icon}</div>
                    <h4 className="font-mc-sub text-[9px] text-white uppercase tracking-wide">{ach.name}</h4>
                    <p className="font-mono-readable text-[9px] text-slate-500 mt-1">{ach.desc}</p>
                    {ach.unlocked && (
                      <div className="mt-2 text-[7px] font-mc-sub uppercase tracking-widest" style={{ color: ach.color }}>
                        ✓ Unlocked
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};