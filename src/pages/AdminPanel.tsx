import React, { useState, useMemo } from 'react';
import { Issue, IssueStatus, User, UserRole, GatePass, GatePassStatus, IssueCategory, IssuePriority } from '../types';
import { Merge, CheckSquare, Square, Users, BarChart3, ListFilter, CheckCircle, Clock, AlertTriangle, Ticket, Shield, TrendingUp, Activity, Search, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  issues: Issue[];
  onMerge: (parentId: string, children: string[]) => void;
  gatePasses: GatePass[];
  onUpdatePassStatus: (passId: string, status: GatePassStatus) => void;
}

const mockUsers: User[] = [
  { id: 'u101', name: 'Vihaan Malhotra', email: 'vihaan.m@college.edu', role: UserRole.STUDENT, roomNumber: '101' },
  { id: 'u102', name: 'Diya Kapoor', email: 'diya.k@college.edu', role: UserRole.STUDENT, roomNumber: '102' },
  { id: 'u103', name: 'Ishaan Verma', email: 'ishaan.v@college.edu', role: UserRole.STUDENT, roomNumber: '201' },
  { id: 'u104', name: 'Kiara Advani', email: 'kiara.a@college.edu', role: UserRole.STUDENT, roomNumber: '202' },
  { id: 'a201', name: 'Warden Suresh Reddy', email: 'warden@college.edu', role: UserRole.ADMIN, roomNumber: 'Office' },
  { id: 'a202', name: 'Matron Geeta Ben', email: 'geeta.b@college.edu', role: UserRole.ADMIN, roomNumber: 'Office' },
];

type AdminTab = 'ISSUES' | 'PASSES' | 'USERS' | 'ANALYTICS';

export const AdminPanel: React.FC<AdminPanelProps> = ({ issues, onMerge, gatePasses, onUpdatePassStatus }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('ISSUES');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const pending = issues.filter(i => i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
    const resolved = issues.filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED).length;
    const pendingPasses = gatePasses.filter(p => p.status === GatePassStatus.PENDING).length;
    return {
      total: issues.length,
      pending,
      resolved,
      pendingPasses,
      resolutionRate: issues.length > 0 ? Math.round((resolved / issues.length) * 100) : 0,
    };
  }, [issues, gatePasses]);

  const activeIssues = issues.filter(i => i.status !== IssueStatus.CLOSED && !i.mergedInto);
  const pendingPasses = gatePasses.filter(p => p.status === GatePassStatus.PENDING);

  const filteredIssues = useMemo(() => {
    let list = activeIssues;
    if (showCriticalOnly) {
      list = list.filter(i => i.category === IssueCategory.RAGGING || i.priority === IssuePriority.CRITICAL);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.reporterName?.toLowerCase().includes(q));
    }
    return list;
  }, [activeIssues, showCriticalOnly, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleMerge = () => {
    if (selectedIds.length < 2) return;
    const parentId = selectedIds[0];
    const children = selectedIds.slice(1);
    if (confirm(`Merge ${children.length} issue(s) into #${parentId.substring(0, 6).toUpperCase()}?`)) {
      onMerge(parentId, children);
      setSelectedIds([]);
    }
  };

  const TABS: { key: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'ISSUES', label: 'Issues', icon: ListFilter, badge: stats.pending },
    { key: 'PASSES', label: 'Gate Passes', icon: Ticket, badge: stats.pendingPasses },
    { key: 'USERS', label: 'Users', icon: Users },
    { key: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      REPORTED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
      ASSIGNED: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      IN_PROGRESS: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      RESOLVED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      CLOSED: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    };
    return map[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'ISSUES':
        return (
          <div className="bg-[#1f1f26] border border-[#26262a] rounded-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-[#26262a] flex flex-wrap justify-between items-center gap-3 bg-[#141419]/40">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="text-xs font-mono-readable bg-[#141419] border border-[#3c3c44] text-white pl-8 pr-4 py-2 outline-none rounded w-48 focus:border-mc-cyan"
                  />
                  <Search size={11} className="absolute left-2.5 top-2.5 text-slate-500" />
                </div>
                <button
                  onClick={() => setShowCriticalOnly(!showCriticalOnly)}
                  className={`flex items-center gap-2 px-3 py-2 rounded border text-[9px] font-medium uppercase transition-all ${
                    showCriticalOnly
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : 'bg-[#141419] border-[#3c3c44] text-slate-400 hover:border-red-500/40 hover:text-red-400'
                  }`}
                >
                  <AlertTriangle size={11} />
                  <span>Critical Only</span>
                </button>
                <span className="text-[10px] text-slate-500 font-mono-readable">
                  {filteredIssues.length} issues
                </span>
              </div>
              {selectedIds.length > 1 && (
                <button
                  onClick={handleMerge}
                  className="flex items-center gap-1.5 px-4 py-2 bg-mc-cyan text-black font-medium text-[9px] uppercase rounded border border-mc-cyan/50 hover:bg-cyan-400 transition-all"
                >
                  <Merge size={12} />
                  Merge Selected ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#141419] border-b border-[#26262a]">
                  <tr>
                    <th className="p-3 w-10 text-center" />
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Issue</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Reporter</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a22]">
                  {filteredIssues.map(issue => (
                    <tr
                      key={issue.id}
                      onClick={() => toggleSelect(issue.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedIds.includes(issue.id)
                          ? 'bg-mc-cyan/8 border-l-2 border-l-mc-cyan'
                          : issue.category === IssueCategory.RAGGING
                            ? 'bg-red-500/5 hover:bg-red-500/10'
                            : 'hover:bg-[#141419]/50'
                      }`}
                    >
                      <td className="p-3 text-center">
                        {selectedIds.includes(issue.id)
                          ? <CheckSquare size={14} className="text-mc-cyan mx-auto" />
                          : <Square size={14} className="text-slate-600 mx-auto" />
                        }
                      </td>
                      <td className="p-3 max-w-xs">
                        <p className="font-medium text-white truncate text-[11px]">{issue.title}</p>
                        <p className="text-slate-500 mt-0.5 text-[10px] truncate">{issue.description}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-medium border ${
                          issue.category === 'RAGGING' ? 'bg-red-500/15 text-red-400 border-red-500/35' : 'bg-[#141419] text-slate-400 border-[#3c3c44]'
                        }`}>
                          {issue.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-medium border ${
                          issue.priority === 'HIGH' || issue.priority === 'CRITICAL'
                            ? 'text-red-400 bg-red-500/10 border-red-500/30'
                            : issue.priority === 'MEDIUM'
                              ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                              : 'text-slate-400 bg-[#141419] border-[#3c3c44]'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-medium border ${getStatusBadge(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        {issue.isAnonymous ? (
                          <span className="text-slate-500 italic flex items-center gap-1 text-[10px]">
                            <Shield size={10} /> Anonymous
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px]">{issue.reporterName || 'Unknown'}</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500 text-[10px] font-mono-readable">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredIssues.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-10 text-slate-500 text-xs">
                        No issues match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'PASSES':
        return (
          <div className="bg-[#1f1f26] border border-[#26262a] rounded-sm overflow-hidden">
            <div className="p-4 border-b border-[#26262a] bg-[#141419]/40">
              <h3 className="text-sm font-semibold text-white">Pending Gate Pass Requests</h3>
              <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5">{pendingPasses.length} request{pendingPasses.length !== 1 ? 's' : ''} awaiting review</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-[#141419] border-b border-[#26262a]">
                  <tr>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Dates</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Reason</th>
                    <th className="p-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a22]">
                  {pendingPasses.map(pass => (
                    <tr key={pass.id} className="hover:bg-[#141419]/50 transition-colors">
                      <td className="p-3">
                        <p className="font-medium text-white text-[11px]">{pass.studentName}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">Room {pass.roomNumber}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-slate-300 text-[10px]">From: {new Date(pass.departureDate).toLocaleDateString()}</p>
                        <p className="text-slate-300 text-[10px] mt-0.5">To: {new Date(pass.returnDate).toLocaleDateString()}</p>
                      </td>
                      <td className="p-3 max-w-xs">
                        <p className="text-slate-400 text-[10px] truncate">{pass.reason}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdatePassStatus(pass.id, GatePassStatus.APPROVED)}
                            className="px-3 py-1.5 text-[9px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded hover:bg-emerald-500/20 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdatePassStatus(pass.id, GatePassStatus.REJECTED)}
                            className="px-3 py-1.5 text-[9px] font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/20 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingPasses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-10 text-slate-500 text-xs">
                        No pending gate pass requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'USERS':
        return (
          <div className="bg-[#1f1f26] border border-[#26262a] rounded-sm overflow-hidden">
            <div className="p-4 border-b border-[#26262a] bg-[#141419]/40">
              <h3 className="text-sm font-semibold text-white">User Registry</h3>
              <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5">{mockUsers.length} registered users</p>
            </div>
            <div className="divide-y divide-[#1a1a22]">
              {mockUsers.map(user => (
                <div key={user.id} className="p-4 flex justify-between items-center hover:bg-[#141419]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#141419] border border-[#3c3c44] rounded flex items-center justify-center text-sm font-bold text-mc-cyan font-mc-title">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5">{user.email} · Room {user.roomNumber}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-medium px-2.5 py-1 rounded border ${
                    user.role === UserRole.ADMIN
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      : 'bg-mc-cyan/10 text-mc-cyan border-mc-cyan/25'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ANALYTICS':
        const categoryBreakdown = Object.values(IssueCategory).map(cat => ({
          category: cat,
          count: issues.filter(i => i.category === cat).length,
        })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

        const maxCount = Math.max(...categoryBreakdown.map(c => c.count), 1);

        return (
          <div className="space-y-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Issues', value: stats.total, color: 'text-mc-cyan' },
                { label: 'Open Issues', value: stats.pending, color: 'text-yellow-400' },
                { label: 'Resolved', value: stats.resolved, color: 'text-emerald-400' },
                { label: 'Resolution Rate', value: `${stats.resolutionRate}%`, color: 'text-purple-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#1f1f26] border border-[#26262a] rounded-sm p-4">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
                  <p className={`text-2xl font-black font-mc-title ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="bg-[#1f1f26] border border-[#26262a] rounded-sm p-5">
              <h4 className="text-sm font-semibold text-white mb-4">Issues by Category</h4>
              <div className="space-y-3">
                {categoryBreakdown.map(({ category, count }) => (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono-readable">
                      <span className="text-slate-400">{category}</span>
                      <span className="text-slate-300 font-medium">{count} issue{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full h-2 bg-[#141419] border border-[#26262a] rounded-sm overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        className="h-full bg-mc-cyan rounded-sm"
                      />
                    </div>
                  </div>
                ))}
                {categoryBreakdown.length === 0 && (
                  <p className="text-slate-500 text-xs font-mono-readable text-center py-4">No issue data available yet.</p>
                )}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-[#1f1f26] border border-[#26262a] rounded-sm p-5">
              <h4 className="text-sm font-semibold text-white mb-4">Status Distribution</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.values(IssueStatus).map(status => {
                  const count = issues.filter(i => i.status === status).length;
                  const pct = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
                  return (
                    <div key={status} className="text-center p-3 bg-[#141419] border border-[#26262a] rounded-sm">
                      <p className="text-lg font-black text-white font-mc-title">{count}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-wider mt-1">{status.replace('_', ' ')}</p>
                      <p className="text-[8px] text-slate-600 mt-0.5">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Clean Admin Header */}
      <div className="bg-[#1f1f26] border border-[#26262a] rounded-sm p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-xs font-mono-readable mt-0.5">Warden Command Center — manage issues, passes, and residents.</p>
          </div>
          <span className="inline-flex items-center px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-medium gap-1.5">
            <CheckCircle size={10} />
            System Online
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Issues', value: stats.total, icon: Activity, color: 'text-mc-cyan', borderColor: 'border-mc-cyan/20' },
          { title: 'Pending Issues', value: stats.pending, icon: Clock, color: 'text-yellow-400', borderColor: 'border-yellow-500/20' },
          { title: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
          { title: 'Pending Passes', value: stats.pendingPasses, icon: Ticket, color: 'text-purple-400', borderColor: 'border-purple-500/20' },
        ].map(({ title, value, icon: Icon, color, borderColor }) => (
          <div key={title} className={`bg-[#1f1f26] border ${borderColor} rounded-sm p-4 flex items-start justify-between`}>
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">{title}</p>
              <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
            </div>
            <div className={`p-2 bg-[#141419] border border-[#3c3c44] rounded ${color}`}>
              <Icon size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#26262a] pb-1">
        {TABS.map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-medium rounded-t border-b-2 transition-all ${
              activeTab === key
                ? 'border-mc-cyan text-white bg-[#1f1f26]'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#1f1f26]/50'
            }`}
          >
            <Icon size={13} />
            <span>{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};