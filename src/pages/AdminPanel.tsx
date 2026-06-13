import React, { useState, useMemo } from 'react';
import { Issue, IssueStatus, User, UserRole, GatePass, GatePassStatus, IssueCategory, IssuePriority } from '../types';
import { Merge, CheckSquare, Square, Users, BarChart3, ListFilter, CheckCircle, Clock, AlertTriangle, UserCircle, Ticket, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  issues: Issue[];
  onMerge: (parentId: string, children: string[]) => void;
  gatePasses: GatePass[];
  onUpdatePassStatus: (passId: string, status: GatePassStatus) => void;
}

const mockUsers: User[] = [
  { id: 'u101', name: "Vihaan 'Vee' Malhotra", email: 'vihaan.m@college.edu', role: UserRole.STUDENT, roomNumber: '101' },
  { id: 'u102', name: "Diya 'Dee' Kapoor", email: 'diya.k@college.edu', role: UserRole.STUDENT, roomNumber: '102' },
  { id: 'u103', name: "Ishaan Verma", email: 'ishaan.v@college.edu', role: UserRole.STUDENT, roomNumber: '201' },
  { id: 'u104', name: "Kiara Advani", email: 'kiara.a@college.edu', role: UserRole.STUDENT, roomNumber: '202' },
  { id: 'a201', name: "Warden Suresh Reddy", email: 'warden@college.edu', role: UserRole.ADMIN, roomNumber: 'Office' },
  { id: 'a202', name: "Matron Geeta Ben", email: 'geeta.b@college.edu', role: UserRole.ADMIN, roomNumber: 'Office' },
];

type AdminTab = 'ISSUES' | 'PASSES' | 'USERS' | 'ANALYTICS';

export const AdminPanel: React.FC<AdminPanelProps> = ({ issues, onMerge, gatePasses, onUpdatePassStatus }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('ISSUES');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const stats = useMemo(() => {
    const pending = issues.filter(i => i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
    const resolved = issues.filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED).length;
    return {
      total: issues.length,
      pending,
      resolved,
      avgResponse: '2.4 hrs', // Placeholder
    };
  }, [issues]);

  const activeIssues = issues.filter(i => i.status !== IssueStatus.CLOSED && !i.mergedInto);
  const pendingPasses = gatePasses.filter(p => p.status === GatePassStatus.PENDING);

  const filteredIssues = useMemo(() => {
    if (!showCriticalOnly) return activeIssues;
    return activeIssues.filter(
      issue => issue.category === IssueCategory.RAGGING || issue.priority === IssuePriority.CRITICAL
    );
  }, [activeIssues, showCriticalOnly]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleMerge = () => {
    if (selectedIds.length < 2) return;
    const parentId = selectedIds[0];
    const children = selectedIds.slice(1);
    if (confirm(`Merge ${children.length} issues into issue #${parentId}?`)) {
      onMerge(parentId, children);
      setSelectedIds([]);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass = 'text-slate-400' }: any) => (
    <div className="mc-card bg-[#1f1f26]/90 p-5 flex items-start justify-between">
      <div>
        <p className="text-[9px] font-mc-sub uppercase text-slate-400 tracking-wider">{title}</p>
        <p className="text-2xl font-black text-white font-mc-title mt-2 tracking-tight select-none" style={{ textShadow: '1.5px 1.5px 0px #111011' }}>
          {value}
        </p>
      </div>
      <div className={`p-2.5 bg-[#141419] border border-[#3c3c44] rounded ${colorClass}`}>
        <Icon size={18} />
      </div>
    </div>
  );

  const TabButton = ({ tab, label, icon: Icon }: { tab: AdminTab, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`btn-mc text-[10px] uppercase flex items-center space-x-2 ${
        activeTab === tab 
          ? 'bg-mc-cyan text-black border-mc-cyan' 
          : 'bg-[#1f1f26] text-slate-400 border-[#26262a]'
      }`}
    >
      <Icon size={12} />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'ISSUES':
        return (
          <div className="mc-card bg-[#1f1f26]/90 overflow-hidden">
            <div className="p-4 border-b border-[#26262a] flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xs font-black text-white font-mc-title uppercase">All Active Alerts</h3>
                    <button
                        onClick={() => setShowCriticalOnly(!showCriticalOnly)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded border text-[9px] font-mc-sub uppercase transition-all ${
                            showCriticalOnly
                            ? 'bg-red-500 text-black border-red-500 font-bold'
                            : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                        }`}
                    >
                        <AlertTriangle size={12} />
                        <span>Critical & Anti-Ragging Logs</span>
                    </button>
                </div>
                {selectedIds.length > 1 && (
                    <button 
                        onClick={handleMerge}
                        className="btn-mc bg-mc-cyan text-black border-mc-cyan text-[9px] uppercase font-bold flex items-center gap-1.5 animate-pulse"
                    >
                        <Merge size={12} />
                        <span>Merge ({selectedIds.length})</span>
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-readable min-w-[600px]">
                <thead className="bg-[#141419] border-b border-[#26262a]">
                  <tr>
                    <th className="p-4 w-10 text-center"></th>
                    <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Alert Description</th>
                    <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Category</th>
                    <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Priority</th>
                    <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Status</th>
                    <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Reported By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26262a] bg-[#1f1f26]/40">
                  {filteredIssues.map(issue => (
                    <tr 
                      key={issue.id} 
                      className={`transition-colors cursor-pointer 
                        ${selectedIds.includes(issue.id) 
                          ? 'bg-[#00d8df]/10 border-l-4 border-l-mc-cyan' 
                          : issue.category === IssueCategory.RAGGING 
                            ? 'bg-[#ef4444]/15 border-l-4 border-l-red-500 hover:bg-[#ef4444]/20' 
                            : 'hover:bg-[#141419]/70'
                        }`}
                      onClick={() => toggleSelect(issue.id)}
                    >
                      <td className="p-4 text-center">
                        {selectedIds.includes(issue.id) 
                          ? <CheckSquare size={16} className="text-mc-cyan mx-auto" /> 
                          : <Square size={16} className="text-slate-600 mx-auto" />
                        }
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white uppercase font-mc-sub text-[10px]">{issue.title}</div>
                        <div className="text-slate-400 mt-1 line-clamp-1 max-w-xs text-[11px]">{issue.description}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mc-sub uppercase border ${
                          issue.category === 'RAGGING' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-[#141419] text-slate-400 border-[#26262a]'
                        }`}>{issue.category}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mc-sub uppercase border ${
                          issue.priority === 'HIGH' || issue.priority === 'CRITICAL' 
                          ? 'text-red-400 bg-red-500/10 border-red-500/30' 
                          : 'text-slate-400 bg-[#141419] border-[#26262a]'
                        }`}>{issue.priority}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mc-sub uppercase border ${
                          issue.status === 'RESOLVED' ? 'text-mc-green bg-mc-green/10 border-mc-green/30' : 'text-mc-gold bg-mc-gold/10 border-mc-gold/30'
                        }`}>{issue.status}</span>
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        {issue.isAnonymous ? (
                          <span className="text-slate-500 italic flex items-center gap-1.5 text-[10px] font-mc-sub uppercase"><Shield size={12}/> Anonymous</span>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-mc-sub uppercase">{issue.reporterName || 'Unknown'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'PASSES':
        return (
          <div className="mc-card bg-[#1f1f26]/90 overflow-hidden">
             <div className="p-4 border-b border-[#26262a]">
                <h3 className="text-xs font-black text-white font-mc-title uppercase">Pending Gate Pass Requests ({pendingPasses.length})</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-xs font-mono-readable min-w-[600px]">
                 <thead className="bg-[#141419] border-b border-[#26262a]">
                   <tr>
                     <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Student Outpost Record</th>
                     <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Journey Timings</th>
                     <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Reason Scroll</th>
                     <th className="p-4 font-mc-sub uppercase text-[9px] text-slate-400 tracking-wider">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#26262a] bg-[#1f1f26]/40">
                   {pendingPasses.map(pass => (
                     <tr key={pass.id} className="hover:bg-[#141419]/70">
                       <td className="p-4">
                           <div className="font-bold text-white uppercase font-mc-sub text-[10px]">{pass.studentName}</div>
                           <div className="text-slate-500 mt-1 text-[10px]">Room: {pass.roomNumber}</div>
                       </td>
                       <td className="p-4">
                           <div className="text-slate-300 text-[11px]"><b>From:</b> {new Date(pass.departureDate).toLocaleDateString()}</div>
                           <div className="text-slate-300 text-[11px] mt-1"><b>To:</b> {new Date(pass.returnDate).toLocaleDateString()}</div>
                       </td>
                       <td className="p-4 text-slate-400 max-w-sm truncate text-[11px]">{pass.reason}</td>
                       <td className="p-4">
                           <div className="flex space-x-2">
                               <button onClick={() => onUpdatePassStatus(pass.id, GatePassStatus.APPROVED)} className="px-3 py-1 text-[9px] font-bold font-mc-sub uppercase text-green-400 bg-green-500/10 border border-green-500/30 rounded hover:bg-green-500/25">Approve</button>
                               <button onClick={() => onUpdatePassStatus(pass.id, GatePassStatus.REJECTED)} className="px-3 py-1 text-[9px] font-bold font-mc-sub uppercase text-red-400 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/25">Reject</button>
                           </div>
                       </td>
                     </tr>
                   ))}
                   {pendingPasses.length === 0 && (
                       <tr>
                           <td colSpan={4} className="text-center p-10 text-slate-500 font-mc-sub text-[9px] uppercase">No pending gate pass requests in buffer.</td>
                       </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )
      case 'USERS':
        return (
          <div className="mc-card bg-[#1f1f26]/90 p-5 space-y-4">
            <h3 className="text-xs font-black text-white font-mc-title uppercase border-b border-[#26262a] pb-3">User Registry database</h3>
            <ul className="divide-y divide-[#26262a] bg-[#141419]/30 rounded overflow-hidden">
                {mockUsers.map(user => (
                    <li key={user.id} className="p-3.5 flex justify-between items-center hover:bg-[#141419]/70 transition-colors">
                        <div className="font-mono-readable">
                            <p className="font-bold text-white uppercase font-mc-sub text-[10px]">{user.name}</p>
                            <p className="text-slate-400 text-xs mt-1">{user.email} - Room {user.roomNumber}</p>
                        </div>
                        <span className="text-[9px] bg-mc-cyan/15 text-mc-cyan border border-mc-cyan/30 font-bold px-2 py-0.5 rounded font-mc-sub uppercase">{user.role}</span>
                    </li>
                ))}
            </ul>
          </div>
        );
      case 'ANALYTICS':
        return (
            <div className="mc-card bg-[#1f1f26]/90 p-8 text-center font-mono-readable">
                <BarChart3 size={36} className="mx-auto text-slate-600 mb-4 animate-pulse" />
                <h3 className="text-xs font-black text-white font-mc-title uppercase">Analytics Log Archives</h3>
                <p className="text-slate-500 text-xs mt-2">[ Graph files are currently locked under developer encrypt keys ]</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Overhauled Admin Command Center Banner */}
      <div className="relative p-6 mc-card bg-[#1f1f26] border-2 border-slate-700/50 text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mc-cyan/40 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white font-mc-title uppercase tracking-wide select-none" style={{ textShadow: '2px 2px 0px #111011' }}>
              Warden Command Center
            </h1>
            <p className="text-slate-400 font-mono-readable text-xs mt-1.5">[ Global administrator systems logs, outpost passes, and registry databases ]</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/35 text-[9px] font-mc-sub uppercase tracking-wider animate-pulse">
            <CheckCircle size={10} className="mr-1.5" />
            Outpost Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Alerts Logged" value={stats.total} icon={AlertTriangle} colorClass="text-mc-cyan" />
        <StatCard title="Active Quest Alerts" value={stats.pending} icon={Clock} colorClass="text-red-500" />
        <StatCard title="Resolved Quests" value={stats.resolved} icon={CheckCircle} colorClass="text-green-500" />
        <StatCard title="Avg Resolution Time" value={stats.avgResponse} icon={BarChart3} colorClass="text-mc-gold" />
      </div>

      <div className="flex flex-wrap gap-2.5 border-b border-[#26262a] pb-3">
        <TabButton tab="ISSUES" label="Issues" icon={ListFilter} />
        <TabButton tab="PASSES" label="Pass Requests" icon={Ticket} />
        <TabButton tab="USERS" label="Users" icon={Users} />
        <TabButton tab="ANALYTICS" label="Analytics" icon={BarChart3} />
      </div>

      <div>
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};