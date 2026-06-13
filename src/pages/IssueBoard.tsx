import React, { useState } from 'react';
import { User, Issue, UserRole, IssueStatus, IssueCategory, Comment } from '../types';
import { ThumbsUp, MessageSquare, Lock, Filter, AlertTriangle, Search, Calendar, User as UserIcon, Tag, X, ArrowUpDown, Plus, ChevronRight, CheckCircle2, Clock4, Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

enum SortOption {
  DATE_NEWEST = 'DATE_NEWEST',
  DATE_OLDEST = 'DATE_OLDEST',
  PRIORITY_HIGH = 'PRIORITY_HIGH',
  UPVOTES_MOST = 'UPVOTES_MOST',
}

interface IssueBoardProps {
  user: User;
  issues: Issue[];
  onUpdate: (issue: Issue) => void;
}

export const IssueBoard: React.FC<IssueBoardProps> = ({ user, issues, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [reporterFilter, setReporterFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.DATE_NEWEST);

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [commentText, setCommentText] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    issue: Issue;
    newStatus: IssueStatus;
  } | null>(null);

  const getPriorityWeight = (priority: string): number => {
    switch (priority) {
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return { label: '🔴 CRITICAL', color: 'bg-red-500/10 text-red-400 border-red-500/35' };
      case 'MEDIUM':
        return { label: '🟡 NORMAL', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/35' };
      case 'LOW':
      default:
        return { label: '🟢 TRIVIAL', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35' };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'WIFI': return { label: 'WiFi / Net', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '🌐' };
      case 'PLUMBING': return { label: 'Plumbing', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: '💧' };
      case 'ELECTRICAL': return { label: 'Electrical', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: '⚡' };
      case 'FURNITURE': return { label: 'Furniture', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: '🪑' };
      case 'CLEANING': return { label: 'Cleaning', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: '🧹' };
      case 'RAGGING': return { label: 'Anti-Ragging', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🛡️' };
      default: return { label: 'Other', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: '📋' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'REPORTED': return { label: 'Reported', icon: <Clock4 size={10} />, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
      case 'ASSIGNED': return { label: 'Assigned', icon: <UserIcon size={10} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
      case 'IN_PROGRESS': return { label: 'In Progress', icon: <Zap size={10} />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
      case 'RESOLVED': return { label: 'Resolved', icon: <CheckCircle2 size={10} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      case 'CLOSED': return { label: 'Closed', icon: <Shield size={10} />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
      default: return { label: status, icon: null, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
    }
  };

  const visibleIssues = issues.filter(issue => {
    if (issue.status === 'CLOSED' && issue.mergedInto) return false;
    const hasPermission = !issue.isPrivate || user.role === UserRole.ADMIN || issue.reporterId === user.id;
    if (!hasPermission) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = issue.title.toLowerCase().includes(query);
      const matchesDesc = issue.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc) return false;
    }

    if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && issue.category !== categoryFilter) return false;

    if (reporterFilter === 'ME' && issue.reporterId !== user.id) return false;
    if (reporterFilter === 'OTHERS' && issue.reporterId === user.id) return false;

    if (dateFilter !== 'ALL') {
      const date = new Date(issue.createdAt);
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (dateFilter === '7_DAYS' && diffDays > 7) return false;
      if (dateFilter === '30_DAYS' && diffDays > 30) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case SortOption.DATE_NEWEST: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case SortOption.DATE_OLDEST: return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case SortOption.PRIORITY_HIGH: return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      case SortOption.UPVOTES_MOST: return b.upvotes - a.upvotes;
      default: return 0;
    }
  });

  const activeFiltersCount = [
    statusFilter !== 'ALL',
    categoryFilter !== 'ALL',
    dateFilter !== 'ALL',
    reporterFilter !== 'ALL',
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setDateFilter('ALL');
    setReporterFilter('ALL');
  };

  const handleUpvote = (issue: Issue, e: React.MouseEvent) => {
    e.stopPropagation();
    if (issue.upvotedBy.includes(user.id)) return;
    const updated = { ...issue, upvotes: issue.upvotes + 1, upvotedBy: [...issue.upvotedBy, user.id] };
    onUpdate(updated);
    if (selectedIssue?.id === issue.id) setSelectedIssue(updated);
  };

  const initiateStatusChange = (issue: Issue, newStatus: string) => {
    setConfirmModal({ issue, newStatus: newStatus as IssueStatus });
  };

  const confirmStatusChange = () => {
    if (confirmModal) {
      const updatedIssue = { ...confirmModal.issue, status: confirmModal.newStatus };
      onUpdate(updatedIssue);
      setConfirmModal(null);
      if (selectedIssue?.id === updatedIssue.id) setSelectedIssue(updatedIssue);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedIssue) return;
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    const updatedIssue = { ...selectedIssue, comments: [...selectedIssue.comments, newComment] };
    onUpdate(updatedIssue);
    setSelectedIssue(updatedIssue);
    setCommentText('');
  };

  // Stats
  const openCount = issues.filter(i => i.status === 'REPORTED').length;
  const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

  return (
    <div className="space-y-8 pb-12 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26262a] pb-6">
        <div>
          <h1 className="text-xl font-black text-white font-mc-title uppercase tracking-wide">Quest Log</h1>
          <p className="text-slate-400 font-mono-readable text-xs mt-1.5">[ Track all campus issues — report, upvote, and monitor resolution progress ]</p>
        </div>
        <div className="flex items-center gap-3">
          {user.role !== UserRole.ADMIN && (
            <Link to="/report" className="btn-mc uppercase text-[10px] py-2 px-4 shrink-0 flex items-center gap-2">
              <Plus size={12} className="stroke-[3]" />
              <span>Report Issue</span>
            </Link>
          )}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-mono-readable bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white pl-8 pr-4 py-2 outline-none rounded-sm"
            />
            <Search size={12} className="absolute left-3 top-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open Issues', value: openCount, color: 'text-slate-300', borderColor: 'border-slate-500/25' },
          { label: 'In Progress', value: inProgressCount, color: 'text-blue-400', borderColor: 'border-blue-500/25' },
          { label: 'Resolved', value: resolvedCount, color: 'text-emerald-400', borderColor: 'border-emerald-500/25' },
        ].map(s => (
          <div key={s.label} className={`mc-card bg-[#1f1f26]/60 p-4 text-center border ${s.borderColor}`}>
            <p className={`text-2xl font-black font-mc-title ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1f1f26]/60 p-3 rounded border border-[#26262a]">
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <Filter size={11} className="text-mc-cyan shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-24"
          >
            <option value="ALL">All Status</option>
            {Object.values(IssueStatus).map(s => (
              <option key={s} value={s} className="bg-[#1f1f26] normal-case">{getStatusInfo(s).label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <Tag size={11} className="text-mc-cyan shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-28"
          >
            <option value="ALL">All Categories</option>
            {Object.values(IssueCategory).map(c => (
              <option key={c} value={c} className="bg-[#1f1f26]">{getCategoryInfo(c).icon} {getCategoryInfo(c).label}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <Calendar size={11} className="text-mc-cyan shrink-0" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-24"
          >
            <option value="ALL">All Time</option>
            <option value="7_DAYS">Last 7 Days</option>
            <option value="30_DAYS">Last 30 Days</option>
          </select>
        </div>

        {/* Reporter Filter */}
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <UserIcon size={11} className="text-mc-cyan shrink-0" />
          <select
            value={reporterFilter}
            onChange={(e) => setReporterFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-24"
          >
            <option value="ALL">All Users</option>
            <option value="ME">Mine</option>
            <option value="OTHERS">Others</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <ArrowUpDown size={11} className="text-mc-cyan shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-36"
          >
            <option value={SortOption.DATE_NEWEST}>Newest First</option>
            <option value={SortOption.DATE_OLDEST}>Oldest First</option>
            <option value={SortOption.PRIORITY_HIGH}>Highest Priority</option>
            <option value={SortOption.UPVOTES_MOST}>Most Upvotes</option>
          </select>
        </div>

        {(activeFiltersCount > 0 || searchQuery) && (
          <button
            onClick={resetFilters}
            className="ml-auto text-[9px] font-bold font-mc-sub uppercase text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/35 px-3 py-2 rounded transition-all flex items-center gap-1.5"
          >
            <X size={11} />
            <span>Reset ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono-readable text-slate-500">
          Showing <span className="text-slate-300 font-bold">{visibleIssues.length}</span> of {issues.length} issues
        </span>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {visibleIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 mc-card bg-[#1f1f26]/80 text-center border-dashed">
            <div className="p-4 bg-[#141419] border border-[#26262a] rounded-sm mb-4">
              <Search size={24} className="text-slate-500" />
            </div>
            <h3 className="text-white font-mc-title text-[9px] uppercase">No Issues Found</h3>
            <p className="text-slate-400 text-xs mt-2 font-mono-readable">Adjust your filters or report a new issue.</p>
            <button onClick={resetFilters} className="mt-4 text-mc-cyan font-bold text-xs hover:underline uppercase font-mc-sub">Reset Filters</button>
          </div>
        ) : visibleIssues.map((issue, idx) => {
          const priorityStyle = getPriorityBadge(issue.priority);
          const categoryInfo = getCategoryInfo(issue.category);
          const statusInfo = getStatusInfo(issue.status);
          const isRagging = issue.category === 'RAGGING';

          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
              onClick={() => setSelectedIssue(issue)}
              className={`mc-card bg-[#1f1f26]/90 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all cursor-pointer relative hover:border-mc-cyan group ${
                isRagging ? 'border-red-500/50 bg-[#1e1515]/80' : ''
              }`}
            >
              {/* Left accent bar for status */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                issue.status === 'RESOLVED' || issue.status === 'CLOSED' ? 'bg-emerald-500' :
                issue.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                issue.status === 'ASSIGNED' ? 'bg-yellow-500' :
                isRagging ? 'bg-red-500' : 'bg-slate-600'
              }`} />

              <div className="space-y-2 flex-1 min-w-0 pl-2">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mc-sub border uppercase tracking-wider flex items-center gap-1 ${statusInfo.color} ${statusInfo.bg} ${statusInfo.border}`}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>

                  {/* Category Badge */}
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mc-sub border uppercase tracking-wider ${categoryInfo.color} ${categoryInfo.bg} ${categoryInfo.border}`}>
                    {categoryInfo.icon} {categoryInfo.label}
                  </span>

                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded text-[8px] border font-mc-sub ${priorityStyle.color}`}>
                    {priorityStyle.label}
                  </span>

                  {/* Private Lock */}
                  {issue.isPrivate && (
                    <div title="Private Issue" className="bg-[#141419] border border-[#26262a] p-1 rounded-sm text-slate-500 flex items-center">
                      <Lock size={9} />
                    </div>
                  )}

                  {/* ID tag */}
                  <span className="text-[8px] font-mono-readable text-slate-600 bg-[#141419] px-1.5 py-0.5 rounded-sm border border-[#26262a]">
                    #{issue.id.substring(0, 6).toUpperCase()}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-mc-cyan transition-colors truncate font-mc-sub">
                    {issue.title}
                  </h3>
                  <p className="mt-0.5 text-slate-400 text-xs font-mono-readable line-clamp-1 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono-readable">
                  <span className="flex items-center gap-1"><UserIcon size={9} /> {issue.reporterName}</span>
                  <span className="flex items-center gap-1"><Calendar size={9} /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                  {(issue.status === 'RESOLVED' || issue.status === 'CLOSED') && (
                    <span className="text-emerald-500 flex items-center gap-1"><Sparkles size={9} /> +30 XP Earned</span>
                  )}
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-[#26262a] pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                {/* Upvote */}
                <button
                  onClick={(e) => handleUpvote(issue, e)}
                  disabled={issue.upvotedBy.includes(user.id)}
                  className={`flex items-center space-x-1.5 text-[10px] font-bold font-mc-sub border py-1.5 px-3 rounded transition-all ${
                    issue.upvotedBy.includes(user.id)
                      ? 'bg-mc-cyan/15 text-mc-cyan border-mc-cyan/40'
                      : 'bg-[#141419] border-[#26262a] hover:border-slate-500 hover:text-white text-slate-400'
                  }`}
                >
                  <ThumbsUp size={11} className={issue.upvotedBy.includes(user.id) ? 'fill-current' : ''} />
                  <span>{issue.upvotes}</span>
                </button>

                {/* Comments */}
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-[#141419] border border-[#26262a] rounded text-[10px] font-bold font-mc-sub text-slate-400">
                  <MessageSquare size={11} />
                  <span>{issue.comments.length}</span>
                </div>

                {/* View Arrow */}
                <div className="btn-mc py-1 px-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={12} className="stroke-[3]" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Issue Detail Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-sm"
              onClick={() => setSelectedIssue(null)}
            />
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              className="relative bg-[#1f1f26] text-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto border-3 border-[#101014] flex flex-col"
              style={{ boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.05), inset -2px -2px 0px rgba(0,0,0,0.3), 0 16px 50px rgba(0,0,0,0.8)' }}
            >
              {/* Modal Header */}
              {(() => {
                const catInfo = getCategoryInfo(selectedIssue.category);
                const statusInfo = getStatusInfo(selectedIssue.status);
                const priorityInfo = getPriorityBadge(selectedIssue.priority);
                return (
                  <div className="p-5 border-b border-[#26262a] bg-[#141419]/60 flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-[8px] font-mc-sub border uppercase tracking-wider flex items-center gap-1.5 ${statusInfo.color} ${statusInfo.bg} ${statusInfo.border}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded text-[8px] font-bold font-mc-sub border uppercase tracking-wider ${catInfo.color} ${catInfo.bg} ${catInfo.border}`}>
                          {catInfo.icon} {catInfo.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded text-[8px] border font-mc-sub ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold uppercase tracking-wide text-white font-mc-sub">
                        {selectedIssue.title}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-mono-readable">
                        Reported by <span className="text-slate-300">{selectedIssue.reporterName}</span> on {new Date(selectedIssue.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedIssue(null)}
                      className="p-1.5 hover:bg-[#26262a] rounded-md transition-colors text-slate-400 shrink-0"
                    >
                      <X size={18} className="stroke-[2.5]" />
                    </button>
                  </div>
                );
              })()}

              {/* Modal Body */}
              <div className="p-5 space-y-5 flex-1">
                {/* Description */}
                <div>
                  <h4 className="text-[9px] font-bold uppercase text-slate-500 tracking-wider font-mc-sub mb-2">Description</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#141419] p-4 border border-[#26262a] rounded-sm font-mono-readable">
                    {selectedIssue.description}
                  </p>
                </div>

                {/* Progress Timeline */}
                <div>
                  <h4 className="text-[9px] font-bold uppercase text-slate-500 tracking-wider font-mc-sub mb-3">Resolution Progress</h4>
                  <div className="bg-[#141419] p-4 border border-[#26262a] rounded-sm">
                    <div className="flex items-center gap-0">
                      {[
                        { key: 'REPORTED', label: 'Reported' },
                        { key: 'ASSIGNED', label: 'Assigned' },
                        { key: 'IN_PROGRESS', label: 'Working' },
                        { key: 'RESOLVED', label: 'Resolved' },
                      ].map((step, i, arr) => {
                        const statusOrder = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
                        const currentIdx = statusOrder.indexOf(selectedIssue.status);
                        const stepIdx = statusOrder.indexOf(step.key);
                        const isCompleted = currentIdx >= stepIdx;
                        const isActive = currentIdx === stepIdx;

                        return (
                          <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                  : isActive
                                    ? 'bg-blue-600 border-blue-500 text-white animate-pulse'
                                    : 'bg-[#1f1f26] border-[#3c3c44] text-slate-600'
                              }`}>
                                {isCompleted ? '✓' : (i + 1)}
                              </div>
                              <span className={`text-[7px] font-mc-sub uppercase mt-1.5 tracking-wide ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}>
                                {step.label}
                              </span>
                            </div>
                            {i < arr.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-4 transition-all ${isCompleted && statusOrder.indexOf(arr[i + 1].key) <= currentIdx ? 'bg-emerald-600' : 'bg-[#3c3c44]'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Admin Status Control */}
                {user.role === UserRole.ADMIN && (
                  <div className="bg-[#141419] p-4 border-2 border-[#3c3c44] rounded-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-mc-cyan tracking-wider font-mc-sub block">Admin: Update Status</span>
                        <span className="text-[9px] text-slate-500 font-mono-readable mt-0.5">Change the resolution state of this issue.</span>
                      </div>
                      <select
                        value={selectedIssue.status}
                        onChange={(e) => initiateStatusChange(selectedIssue, e.target.value)}
                        className="bg-[#1f1f26] border-2 border-[#3c3c44] focus:border-mc-cyan text-white text-xs font-mc-sub uppercase font-bold py-2 px-4 rounded-sm outline-none cursor-pointer"
                      >
                        {Object.values(IssueStatus).map(s => (
                          <option key={s} value={s} className="bg-[#1f1f26] normal-case">
                            {getStatusInfo(s).label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold uppercase text-slate-500 tracking-wider font-mc-sub flex items-center gap-1.5">
                    <MessageSquare size={11} />
                    <span>Comments ({selectedIssue.comments.length})</span>
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedIssue.comments.length === 0 ? (
                      <p className="text-center py-6 text-slate-600 text-xs font-mono-readable italic bg-[#141419] border border-[#26262a] rounded-sm">
                        No comments yet. Be the first to add one.
                      </p>
                    ) : selectedIssue.comments.map(c => (
                      <div key={c.id} className="p-3 bg-[#141419] border border-[#26262a] rounded-sm space-y-1.5">
                        <div className="flex justify-between items-center text-[9px]">
                          <span className="font-bold text-mc-cyan uppercase font-mc-sub">{c.userName}</span>
                          <span className="text-slate-600 font-mono-readable">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono-readable">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 btn-mc text-[9px] uppercase shrink-0"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Status Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
          <div className="relative bg-[#1f1f26] text-white rounded-sm w-full max-w-md p-6 border-3 border-[#101014]"
            style={{ boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.05), inset -2px -2px 0px rgba(0,0,0,0.3), 0 8px 30px rgba(0,0,0,0.6)' }}
          >
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/35 rounded-sm shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-black text-white font-mc-title uppercase mb-2">Confirm Status Change</h3>
                <p className="text-slate-400 text-xs font-mono-readable leading-relaxed mb-6">
                  Update status of <span className="text-mc-cyan font-bold">"{confirmModal.issue.title}"</span> from{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold font-mc-sub border border-slate-500/30 bg-slate-500/10 text-slate-300">{getStatusInfo(confirmModal.issue.status).label}</span>{' '}
                  to{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold font-mc-sub border border-mc-cyan/40 bg-mc-cyan/10 text-mc-cyan">{getStatusInfo(confirmModal.newStatus).label}</span>?
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal(null)} className="flex-1 btn-mc py-2 text-[10px]">Cancel</button>
                  <button
                    onClick={confirmStatusChange}
                    className="flex-1 py-2 bg-[#00e676] hover:bg-[#00c867] text-black font-mc-sub font-bold text-[10px] uppercase border-2 border-black rounded-sm shadow-md"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};