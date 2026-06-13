import React, { useState } from 'react';
import { Announcement, User, UserRole } from '../types';
import { Bell, Pin, X, Plus, CheckCheck, Clock, Search, Filter, AlertTriangle, Info, Megaphone, Utensils, Wrench, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementsProps {
  user: User;
  data: Announcement[];
  onAdd: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  gainXp?: (amount: number) => void;
  gainCoins?: (amount: number) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string }> = {
  BROADCAST: { icon: Megaphone, label: 'Broadcast', color: 'text-mc-cyan', bg: 'bg-mc-cyan/10', border: 'border-mc-cyan/30' },
  FOOD: { icon: Utensils, label: 'Mess & Food', color: 'text-mc-gold', bg: 'bg-mc-gold/10', border: 'border-mc-gold/30' },
  SECURITY: { icon: AlertTriangle, label: 'Security', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  MAINTENANCE: { icon: Wrench, label: 'Maintenance', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  EVENT: { icon: Trophy, label: 'Events', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
};

export const Announcements: React.FC<AnnouncementsProps> = ({ user, data, onAdd, gainXp, gainCoins }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');
  const [categoryTag, setCategoryTag] = useState('BROADCAST');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [readIds, setReadIds] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
    if (!newTitle || !newContent) {
      alert('Please fill out all fields.');
      return;
    }

    onAdd({
      title: newTitle,
      content: newContent,
      priority: newPriority,
    });

    setNewTitle('');
    setNewContent('');
    setNewPriority('NORMAL');
    setCategoryTag('BROADCAST');
    setIsModalOpen(false);
  };

  const handleMarkRead = (id: string) => {
    if (readIds.includes(id)) return;
    setReadIds(prev => [...prev, id]);
    if (gainXp) gainXp(5);
    if (gainCoins) gainCoins(1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getCategoryFromTitle = (title: string): string => {
    if (title.includes('FOOD') || title.includes('🍔')) return 'FOOD';
    if (title.includes('SECURITY') || title.includes('🛡️')) return 'SECURITY';
    if (title.includes('MAINTENANCE') || title.includes('🔧')) return 'MAINTENANCE';
    if (title.includes('EVENT') || title.includes('🏆')) return 'EVENT';
    return 'BROADCAST';
  };

  const filteredData = data.filter(item => {
    const cat = getCategoryFromTitle(item.title);
    if (filterCategory !== 'ALL' && cat !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
    }
    return true;
  });

  const urgentCount = data.filter(i => i.priority === 'URGENT').length;
  const unreadCount = data.filter(i => !readIds.includes(i.id)).length;

  return (
    <div className="space-y-8 pb-12 text-white font-sans">
      {/* Read Acknowledgement Toast */}
      <AnimatePresence>
        {showToast && (
          <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-[#1f1f26] border-2 border-[#00e676]/60 p-4 rounded-sm shadow-2xl flex items-center gap-3 max-w-xs"
              style={{ boxShadow: '0 4px 20px rgba(0,230,118,0.15)' }}
            >
              <div className="w-9 h-9 bg-[#141419] border border-[#3c3c44] flex items-center justify-center text-lg shrink-0">
                ✅
              </div>
              <div>
                <p className="text-[#00e676] font-mc-sub text-[9px] uppercase font-bold tracking-widest">Notice Read!</p>
                <p className="text-[10px] text-slate-400 font-mono-readable mt-0.5">+5 XP • +1 Emerald awarded</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26262a] pb-6">
        <div>
          <h1 className="text-xl font-black text-white font-mc-title uppercase tracking-wide">Notice Board</h1>
          <p className="text-slate-400 font-mono-readable text-xs mt-1.5">[ Official announcements and directives from the warden — acknowledge for XP ]</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141419] border border-[#26262a] rounded text-[9px] font-mc-sub text-slate-400 uppercase">
              <Bell size={10} className="text-mc-cyan animate-pulse" />
              <span>{unreadCount} Unread</span>
            </div>
          )}
          {user.role === UserRole.ADMIN && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-mc uppercase text-[10px] py-2 px-4 shrink-0 flex items-center gap-2"
            >
              <Plus size={12} className="stroke-[3]" />
              <span>Post Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Notices', value: data.length, color: 'text-white' },
          { label: 'Urgent Alerts', value: urgentCount, color: 'text-red-400' },
          { label: 'Acknowledged', value: readIds.length, color: 'text-emerald-400' },
          { label: 'Unread', value: unreadCount, color: 'text-mc-gold' },
        ].map(stat => (
          <div key={stat.label} className="mc-card bg-[#1f1f26]/60 p-3 text-center">
            <p className={`text-xl font-black font-mc-title ${stat.color}`}>{stat.value}</p>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap items-center gap-3 bg-[#1f1f26]/60 p-3 rounded border border-[#26262a]">
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <Filter size={12} className="text-mc-cyan" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-28"
          >
            <option value="ALL">All Types</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="/search [notice title...]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono-readable bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white pl-8 pr-4 py-2 outline-none rounded-sm"
          />
          <Search size={12} className="absolute left-3 top-3.5 text-slate-500" />
        </div>
        {(filterCategory !== 'ALL' || searchQuery) && (
          <button
            onClick={() => { setFilterCategory('ALL'); setSearchQuery(''); }}
            className="text-[9px] font-bold font-mc-sub uppercase text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-2 rounded flex items-center gap-1.5"
          >
            <X size={10} /> Reset
          </button>
        )}
      </div>

      {/* Notices List */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 mc-card bg-[#1f1f26]/80 text-center border-dashed">
          <div className="p-4 bg-[#141419] border border-[#26262a] rounded-sm mb-4">
            <Bell size={24} className="text-slate-500" />
          </div>
          <h3 className="text-white font-mc-title text-[9px] uppercase">No Notices Found</h3>
          <p className="text-slate-400 text-xs mt-2 font-mono-readable">No announcements match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredData.map((item, idx) => {
              const isUrgent = item.priority === 'URGENT';
              const isRead = readIds.includes(item.id);
              const categoryKey = getCategoryFromTitle(item.title);
              const categoryConf = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.BROADCAST;
              const CatIcon = categoryConf.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className={`mc-card p-5 transition-all relative overflow-hidden ${
                    isUrgent
                      ? 'bg-[#1e1515]/90 border-red-500/40 hover:border-red-500/70'
                      : isRead
                        ? 'bg-[#181820]/80 border-[#2a2a35] opacity-75'
                        : 'bg-[#1f1f26]/90 hover:border-mc-cyan'
                  }`}
                >
                  {/* Urgent Accent Bar */}
                  {isUrgent && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  )}

                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Icon Column */}
                    <div className={`shrink-0 w-10 h-10 rounded border flex items-center justify-center ${categoryConf.bg} ${categoryConf.border}`}>
                      <CatIcon size={18} className={categoryConf.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {isUrgent && (
                          <span className="px-2 py-0.5 text-[8px] font-mc-sub font-bold uppercase border rounded bg-red-500/15 text-red-400 border-red-500/40 flex items-center gap-1">
                            <AlertTriangle size={8} className="animate-pulse" /> URGENT
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[8px] font-mc-sub font-bold uppercase border rounded ${categoryConf.bg} ${categoryConf.color} ${categoryConf.border}`}>
                          {categoryConf.label}
                        </span>
                        {isRead && (
                          <span className="px-2 py-0.5 text-[8px] font-mc-sub font-bold uppercase border rounded bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                            <CheckCheck size={8} /> Read
                          </span>
                        )}
                        <span className="ml-auto text-[9px] font-mono-readable text-slate-500 flex items-center gap-1.5">
                          <Clock size={9} />
                          {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className={`text-sm font-bold uppercase tracking-wide font-mc-sub mb-1.5 ${isUrgent ? 'text-red-300' : 'text-white'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs leading-relaxed font-mono-readable ${isUrgent ? 'text-red-200/70' : 'text-slate-400'}`}>
                        {item.content}
                      </p>

                      {/* Acknowledge button for students */}
                      {user.role === UserRole.STUDENT && (
                        <div className="mt-3 pt-3 border-t border-[#26262a] flex items-center justify-between">
                          <span className="text-[8px] font-mc-sub text-slate-500 uppercase tracking-wider">
                            {isRead ? 'You acknowledged this notice' : 'Mark as read to earn +5 XP'}
                          </span>
                          <button
                            disabled={isRead}
                            onClick={() => handleMarkRead(item.id)}
                            className={`px-4 py-1.5 text-[9px] font-bold uppercase font-mc-sub border rounded transition-all flex items-center gap-1.5 ${
                              isRead
                                ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-500 cursor-not-allowed'
                                : 'bg-[#141419] border-[#3c3c44] text-slate-300 hover:border-mc-cyan hover:text-mc-cyan'
                            }`}
                          >
                            <CheckCheck size={10} />
                            {isRead ? 'Acknowledged' : 'Mark Read'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Post Notice Modal (Admin Only) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#07090e]/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1f1f26] text-white p-6 rounded-sm w-full max-w-lg space-y-5 border-3 border-[#101014]"
              style={{ boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.05), inset -2px -2px 0px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.7)' }}
            >
              <div className="flex justify-between items-center border-b border-[#26262a] pb-4">
                <div>
                  <h2 className="text-xs font-bold uppercase font-mc-title text-white flex items-center gap-2">
                    <Bell size={14} className="text-mc-cyan" /> Post New Notice
                  </h2>
                  <p className="text-[9px] text-slate-500 font-mono-readable mt-0.5">Broadcast an announcement to all residents.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-[#26262a] rounded text-slate-400 transition-colors"
                >
                  <X size={16} className="stroke-[2.5]" />
                </button>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategoryTag(key)}
                        className={`py-2 text-[8px] font-bold font-mc-sub uppercase border rounded-sm transition-all flex items-center justify-center gap-1 ${
                          categoryTag === key
                            ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                            : 'bg-[#141419] border-[#3c3c44] text-slate-500 hover:border-slate-500'
                        }`}
                      >
                        <Icon size={10} /> {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Notice Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none"
                  placeholder="Brief, clear announcement title..."
                />
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Message Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none resize-none"
                  placeholder="Full announcement details..."
                />
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Priority Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['NORMAL', 'URGENT'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2.5 text-[9px] font-bold font-mc-sub uppercase border-2 rounded-sm transition-all ${
                        newPriority === p
                          ? p === 'URGENT'
                            ? 'bg-red-500/20 border-red-500/60 text-red-300'
                            : 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : 'bg-[#141419] border-[#3c3c44] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {p === 'URGENT' ? '🔥 Urgent Alert' : '📋 Normal'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-[#26262a]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-[#141419] hover:bg-[#26262a] text-slate-300 text-xs font-bold font-mc-sub uppercase border border-[#3c3c44] rounded-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 btn-mc text-[10px] uppercase flex items-center gap-2"
                >
                  <Bell size={12} />
                  Publish Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};