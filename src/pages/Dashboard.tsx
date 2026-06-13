import React, { useState } from 'react';
import { User, Issue, Announcement, IssueStatus, UserRole } from '../types';
import { AlertTriangle, CheckCircle2, Bell, Clock, ArrowRight, Shield, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
  issues: Issue[];
  announcements: Announcement[];
  userXp: number;
  userLevel: number;
  userCoins: number;
  gainXp: (amount: number) => void;
  gainCoins: (amount: number) => void;
}

const StatSlot: React.FC<{ title: string; value: number; icon: string; borderAccent: string }> = ({ title, value, icon, borderAccent }) => {
  return (
    <motion.div
      variants={item}
      className="mc-card p-5 bg-[#1f1f26]/90 flex flex-col justify-between relative overflow-hidden"
      style={{ borderColor: borderAccent }}
    >
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center text-lg shadow-inner shrink-0">
          {icon}
        </div>
        <span className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider">Slot Active</span>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-black text-white font-mc-sub">{value}</h3>
        <p className="text-[10px] text-slate-400 font-mc-sub uppercase tracking-wider mt-1">{title}</p>
      </div>
    </motion.div>
  );
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export const Dashboard: React.FC<DashboardProps> = ({ user, issues, announcements, userXp, userLevel, userCoins, gainXp, gainCoins }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  // Stats
  const myPendingIssues = issues.filter(i => i.reporterId === user.id && i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
  const myResolvedIssues = issues.filter(i => i.reporterId === user.id && (i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED)).length;
  const totalPending = issues.filter(i => i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
  const criticalIssues = issues.filter(i => i.priority === 'HIGH' && i.status !== 'RESOLVED').length;
  const totalResolved = issues.length - totalPending;

  // Chart Data
  const categoryCounts = issues.reduce((acc: { [key: string]: number }, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map(cat => ({
    name: cat.replace('_', ' '),
    count: categoryCounts[cat]
  }));

  // Quests
  const [claimedQuests, setClaimedQuests] = useState<string[]>([]);
  const [questNotif, setQuestNotif] = useState<{ id: string; xp: number; coins: number } | null>(null);

  const quests = [
    { id: 'q1', title: 'Tavern Rations', description: 'Evaluate dining quality in the Mess Kitchen panel.', rewardXp: 15, rewardCoins: 5 },
    { id: 'q2', title: 'Good Neighbour', description: 'Log a new report ticket or reply with logs.', rewardXp: 25, rewardCoins: 10 },
    { id: 'q3', title: 'Safe Sentinel', description: 'Complete this week with zero outpass violations.', rewardXp: 20, rewardCoins: 8 }
  ];

  const handleClaimReward = (qId: string, xp: number, coins: number) => {
    if (claimedQuests.includes(qId)) return;
    setClaimedQuests(prev => [...prev, qId]);
    gainXp(xp);
    gainCoins(coins);
    setQuestNotif({ id: qId, xp, coins });
    setTimeout(() => setQuestNotif(null), 3000);
  };

  // Log lists
  const recentActivity = (isAdmin ? issues : issues.filter(i => i.reporterId === user.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Leaderboard
  const baseLeaderboard = [
    { rank: 1, name: 'Vihaan Mukund', title: 'OP Operator', level: 12, xp: 2450 },
    { rank: 2, name: 'Rohan Sharma', title: 'Redstone Mage', level: 8, xp: 1600 },
    { rank: 3, name: 'Ananya Nair', title: 'Green Farmer', level: 6, xp: 1100 },
    { rank: 4, name: 'Aarav Sharma', title: 'Lobby Hero', level: userLevel, xp: userXp + (userLevel - 3) * 150 + 340, isUser: true },
    { rank: 5, name: 'Priyanka Patel', title: 'Quick Runner', level: 3, xp: 310 }
  ];

  const leaderboard = [...baseLeaderboard].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-8 pb-12 font-sans"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {questNotif && (
          <div className="fixed top-6 right-6 z-50 pointer-events-none">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-[#211f20] border-3 border-[#00e676] p-4 rounded shadow-2xl flex items-center gap-3.5 max-w-sm w-full"
              style={{
                boxShadow: 'inset 2px 2px 0 #3a3839, inset -2px -2px 0 #111011, 0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div className="w-10 h-10 bg-[#141419] border-2 border-[#3a3839] flex items-center justify-center text-xl shadow-inner shrink-0">
                ⭐
              </div>
              <div>
                <p className="text-[#00e676] font-mc-sub text-[10px] uppercase font-bold tracking-widest leading-none">Advancement Made!</p>
                <p className="text-white font-mc-title text-[10px] mt-1.5 uppercase leading-none">Quest Claimed</p>
                <p className="text-[10px] text-slate-400 font-mono-readable mt-2">+{questNotif.xp} XP • +{questNotif.coins} Emeralds added</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Title Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#26262a] pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide font-mc-title uppercase">
            Command Block
          </h1>
          <p className="text-slate-400 font-mono-readable text-xs mt-1.5">
            {isAdmin ? "[ Overlord permissions validated. Realtime world statistics loaded ]" : "[ Student class online. Check daily log advancements below ]"}
          </p>
        </div>
        {isAdmin ? (
          <Link to="/admin" className="btn-mc uppercase text-[10px]">
            Admin Control
          </Link>
        ) : (
          <Link to="/report" className="btn-mc uppercase text-[10px]">
            New Report
          </Link>
        )}
      </motion.div>

      {/* Stats KPI Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <StatSlot title="Active Reports" value={totalPending} icon="⏰" borderAccent="#ffbe00" />
            <StatSlot title="High Alerts" value={criticalIssues} icon="🚨" borderAccent="#ef4444" />
            <StatSlot title="Completed Actions" value={totalResolved} icon="✅" borderAccent="#00e676" />
          </>
        ) : (
          <>
            <StatSlot title="My Reports" value={myPendingIssues} icon="📔" borderAccent="#ffbe00" />
            <StatSlot title="Resolved Issues" value={myResolvedIssues} icon="🛡️" borderAccent="#00e676" />
            <StatSlot title="Notices Issued" value={announcements.length} icon="✉️" borderAccent="#00d8df" />
          </>
        )}
      </div>

      {/* Main Grid Section */}
      {isAdmin ? (
        /* ═══ WARDEN: Simple 2-column layout — Notice Board + Log Stream ═══ */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Guild Notices (Announcements) */}
          <motion.div variants={item} className="mc-card bg-[#1f1f26]/90 p-5 space-y-4">
            <div className="border-b border-[#26262a] pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black text-white font-mc-title uppercase">Notice Board</h3>
              <Link to="/announcements" className="text-mc-cyan text-[9px] font-bold hover:underline font-mc-sub uppercase">
                View All <ArrowRight size={10} className="inline ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 4).map(ann => (
                <div key={ann.id} className="p-3 rounded bg-[#141419] border border-[#26262a] hover:border-mc-cyan/30 transition-colors">
                   <div className="flex items-center gap-2">
                     <span className={`w-1.5 h-1.5 rounded-full ${ann.priority === 'URGENT' ? 'bg-[#ef4444]' : 'bg-[#00d8df]'}`}></span>
                     <h4 className="text-[10px] font-bold text-white uppercase font-mc-sub">{ann.title}</h4>
                   </div>
                   <p className="text-[11px] text-slate-400 font-mono-readable mt-1.5 line-clamp-2 leading-relaxed">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                  <div className="text-center py-8 text-slate-500 font-mc-sub text-[9px]">Notice list is vacant.</div>
              )}
            </div>
          </motion.div>

          {/* Global Log Stream */}
          <motion.div variants={item} className="mc-card bg-[#1f1f26]/90 p-5 space-y-4">
             <div className="border-b border-[#26262a] pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black text-white font-mc-title uppercase">Global Log Stream</h3>
              <Link to="/issues" className="text-[#00d8df] text-[9px] font-bold hover:underline font-mc-sub uppercase">
                Quest list <ArrowRight size={10} className="inline ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-[#26262a] bg-[#141419]/40">
               {recentActivity.slice(0, 6).map(issue => (
                   <div key={issue.id} className="py-3 flex items-center justify-between gap-4 group">
                      <div className="min-w-0">
                          <p className="text-[10px] font-bold text-white uppercase font-mc-sub group-hover:text-mc-cyan transition-colors truncate">{issue.title}</p>
                          <p className="text-[9px] text-slate-500 font-mono-readable mt-1 uppercase tracking-widest">{new Date(issue.createdAt).toLocaleDateString()} • <span className="text-[#00e676]">{issue.category}</span></p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[8px] font-mc-sub uppercase shrink-0 border ${
                          issue.status === 'RESOLVED' ? 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/40' : 'bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/40'
                      }`}>
                          {issue.status.replace('_', ' ')}
                      </span>
                   </div>
               ))}
               {recentActivity.length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-mc-sub text-[9px]">Zero logs filed.</div>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        /* ═══ STUDENT: Full gamified 5-column layout ═══ */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Weekly Quests (Interactive HUD element) */}
          <motion.div variants={item} className="lg:col-span-3 mc-card bg-[#1f1f26]/90 p-5 space-y-4">
            <div className="border-b border-[#26262a] pb-3 flex items-center justify-between">
              <h3 className="text-xs font-black text-white font-mc-title uppercase">Advancement Quests</h3>
              <span className="text-[9px] text-[#00d8df] font-mc-sub uppercase tracking-wider">Weekly Goals</span>
            </div>
            <div className="space-y-4">
              {quests.map(q => {
                const isClaimed = claimedQuests.includes(q.id);
                return (
                  <div key={q.id} className="p-4 bg-[#141419] border border-[#26262a] rounded flex items-center justify-between gap-4">
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isClaimed ? 'bg-slate-600' : 'bg-mc-cyan animate-pulse'}`}></span>
                        <h4 className="text-xs font-bold text-white uppercase font-mc-sub">{q.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono-readable">{q.description}</p>
                      <div className="flex gap-3 text-[9px] font-mc-sub tracking-wider text-slate-500 uppercase pt-1">
                        <span className="text-[#00e676]/85">+{q.rewardXp} XP</span>
                        <span className="text-[#ffd500]/85">+{q.rewardCoins} Emeralds</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleClaimReward(q.id, q.rewardXp, q.rewardCoins)}
                      disabled={isClaimed}
                      className="btn-mc py-1.5 px-3.5 uppercase tracking-wider shrink-0"
                    >
                      {isClaimed ? 'Done' : 'Claim'}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

        {/* Server Leaderboard */}
        <motion.div variants={item} className="lg:col-span-2 mc-card bg-[#1f1f26]/90 p-5 space-y-4">
          <div className="border-b border-[#26262a] pb-3 flex items-center justify-between">
            <h3 className="text-xs font-black text-white font-mc-title uppercase">Server Leaderboard</h3>
            <span className="text-xs">🏆</span>
          </div>
          <div className="divide-y divide-[#26262a]">
            {leaderboard.map(player => (
              <div 
                key={player.name} 
                className={`py-3 flex items-center justify-between gap-3 text-xs ${
                  player.isUser ? 'bg-[#2b2b35]/40 px-2' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded flex items-center justify-center font-mc-title text-[9px] font-black shrink-0 ${
                    player.rank === 1 ? 'bg-[#ffbe00] text-black' : player.rank === 2 ? 'bg-slate-300 text-black' : player.rank === 3 ? 'bg-[#b45309] text-white' : 'bg-[#141419] text-slate-500'
                  }`}>
                    {player.rank}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold truncate uppercase tracking-wide font-mc-sub text-[10px] ${player.isUser ? 'text-[#00d8df]' : 'text-slate-200'}`}>
                      {player.name}
                    </p>
                    <p className="text-[8px] text-slate-500 font-mono-readable uppercase tracking-widest">{player.title}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mc-sub font-bold text-white text-[10px]">{player.xp} XP</span>
                  <p className="text-[8px] text-[#00e676] font-mc-sub font-bold uppercase tracking-wider">LVL {player.level}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Category Recharts Chart */}
        <motion.div variants={item} className="lg:col-span-3 mc-card bg-[#1f1f26]/90 p-5 flex flex-col justify-between">
          <div className="border-b border-[#26262a] pb-3">
            <h3 className="text-xs font-black text-white font-mc-title uppercase">Issue Resolution Metrics</h3>
            <p className="text-[9px] text-slate-500 font-mono-readable uppercase mt-1">Classification logs by sector</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'Silkscreen' }}
                    axisLine={{ stroke: '#26262a' }}
                    tickLine={{ stroke: '#26262a' }}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'Silkscreen' }}
                    axisLine={{ stroke: '#26262a' }}
                    tickLine={{ stroke: '#26262a' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f26', borderColor: '#26262a', color: '#fff', borderRadius: '4px', fontSize: 10, fontFamily: 'Silkscreen' }}
                    itemStyle={{ color: '#00d8df' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                  />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#00e676' : '#00d8df'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-500 font-mc-sub text-[10px]">No active data blocks.</span>
            )}
          </div>
        </motion.div>

        {/* Guild Notices (Announcements) */}
        <motion.div variants={item} className="lg:col-span-2 mc-card bg-[#1f1f26]/90 p-5 space-y-4">
          <div className="border-b border-[#26262a] pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black text-white font-mc-title uppercase">Notice Board</h3>
            <Link to="/announcements" className="text-mc-cyan text-[9px] font-bold hover:underline font-mc-sub uppercase">
              View All <ArrowRight size={10} className="inline ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="p-3 rounded bg-[#141419] border border-[#26262a] hover:border-mc-cyan/30 transition-colors">
                 <div className="flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${ann.priority === 'URGENT' ? 'bg-[#ef4444]' : 'bg-[#00d8df]'}`}></span>
                   <h4 className="text-[10px] font-bold text-white uppercase font-mc-sub">{ann.title}</h4>
                 </div>
                 <p className="text-[11px] text-slate-400 font-mono-readable mt-1.5 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
            {announcements.length === 0 && (
                <div className="text-center py-8 text-slate-500 font-mc-sub text-[9px]">Notice list is vacant.</div>
            )}
          </div>
        </motion.div>

        {/* Quest Logs (Activity) */}
        <motion.div variants={item} className="lg:col-span-3 mc-card bg-[#1f1f26]/90 p-5 space-y-4">
           <div className="border-b border-[#26262a] pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black text-white font-mc-title uppercase">MY ACTIVE QUEST LOGS</h3>
            <Link to="/issues" className="text-[#00d8df] text-[9px] font-bold hover:underline font-mc-sub uppercase">
              Quest list <ArrowRight size={10} className="inline ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-[#26262a] bg-[#141419]/40">
             {recentActivity.slice(0, 4).map(issue => (
                 <div key={issue.id} className="py-3 flex items-center justify-between gap-4 group">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white uppercase font-mc-sub group-hover:text-mc-cyan transition-colors truncate">{issue.title}</p>
                        <p className="text-[9px] text-slate-500 font-mono-readable mt-1 uppercase tracking-widest">{new Date(issue.createdAt).toLocaleDateString()} • <span className="text-[#00e676]">{issue.category}</span></p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[8px] font-mc-sub uppercase shrink-0 border ${
                        issue.status === 'RESOLVED' ? 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/40' : 'bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/40'
                    }`}>
                        {issue.status.replace('_', ' ')}
                    </span>
                 </div>
             ))}
             {recentActivity.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-mc-sub text-[9px]">Zero logs filed.</div>
            )}
          </div>
        </motion.div>

        </div>
      )}
    </motion.div>
  );
};