import React, { useState } from 'react';
import { User, Issue, IssueStatus } from '../types';
import { Mail, MapPin, Hash, CheckCircle2, AlertCircle, Edit2, Save, X, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfileProps {
  user: User;
  issues: Issue[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, issues }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state to manage edits before saving
  const [formData, setFormData] = useState({
    name: user.name,
    roomNumber: user.roomNumber,
    email: user.email,
    phone: '+1 (555) 000-0000' // Mock phone since it's not in User type yet
  });

  const myIssues = issues.filter(i => i.reporterId === user.id);
  const resolvedCount = myIssues.filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED).length;
  const pendingCount = myIssues.length - resolvedCount;

  // Level & XP stats mapping
  const xp = resolvedCount * 100 + pendingCount * 20;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = 100;
  const progressPercent = Math.min(((xp % 100) / nextLevelXp) * 100, 100);

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
      phone: '+1 (555) 000-0000'
    });
    setIsEditing(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      className="space-y-8 max-w-6xl mx-auto p-4"
    >
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-mc-title text-white">CHARACTER SHEETS</h1>
          <p className="text-xs font-mc-sub text-slate-400 mt-1">Manage your active attributes and check registry logs.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Details Card */}
        <motion.div variants={item} className="mc-card p-6 relative overflow-hidden bg-mc-card">
          
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
                <span>EDIT PROFILE</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center text-center mt-6">
            <div className="relative mb-5 group">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-28 h-28 rounded object-cover border-4 border-zinc-950 shadow-md transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-28 h-28 rounded bg-zinc-900 flex items-center justify-center text-mc-cyan text-3xl font-mc-title border-4 border-zinc-950 shadow-md">
                  {user.name[0]}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-mc-green rounded border-2 border-zinc-950"></div>
            </div>
            
            {/* Name Field (Special display) */}
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
                <span className="font-mc-sub text-[10px] text-mc-gold uppercase tracking-wider">Lvl {level} Explorer</span>
                <span className="font-mono-readable text-[10px] text-slate-400">{xp % 100} / 100 XP</span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded overflow-hidden p-0.5 border border-zinc-800">
                <div 
                  className="bg-mc-gold h-full rounded-sm transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Form Slots */}
            <div className="w-full space-y-3.5 text-left">
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

        {/* Stats & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Row */}
          <motion.div variants={item} className="grid grid-cols-2 gap-4">
            <div className="mc-card p-5 bg-mc-card flex items-center space-x-4">
              <div className="p-3 bg-mc-red/10 border border-mc-red/25 text-mc-red rounded">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-mc-sub text-[10px] text-slate-400 uppercase tracking-wider">Active Alerts Quests</p>
                <h3 className="font-mc-title text-lg text-white mt-1">{pendingCount}</h3>
              </div>
            </div>
            <div className="mc-card p-5 bg-mc-card flex items-center space-x-4">
              <div className="p-3 bg-mc-green/10 border border-mc-green/25 text-mc-green rounded">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-mc-sub text-[10px] text-slate-400 uppercase tracking-wider">Resolved Quest Tasks</p>
                <h3 className="font-mc-title text-lg text-white mt-1">{resolvedCount}</h3>
              </div>
            </div>
          </motion.div>

          {/* Activity Table */}
          <motion.div variants={item} className="mc-card bg-mc-card overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/20">
              <h3 className="font-mc-title text-xs text-white uppercase tracking-wider">My Reported Registry Logs</h3>
            </div>
            {myIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-950/50 border-b border-zinc-800">
                    <tr>
                      <th className="px-5 py-3 font-mc-sub text-[9px] uppercase text-slate-400 tracking-wider">Registry Detail</th>
                      <th className="px-5 py-3 font-mc-sub text-[9px] uppercase text-slate-400 tracking-wider">Node Status</th>
                      <th className="px-5 py-3 font-mc-sub text-[9px] uppercase text-slate-400 tracking-wider text-right">Inscription Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {myIssues.map(issue => (
                      <tr key={issue.id} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-xs text-slate-200">{issue.title}</div>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mc-sub text-xs">
                Registry archive is empty. No logged scrolls found.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};