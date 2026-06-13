import React, { useState } from 'react';
import { User, Issue, UserRole, IssueStatus, IssueCategory } from '../types';
import { ThumbsUp, MessageSquare, Lock, Filter, AlertTriangle, Search, Calendar, User as UserIcon, Tag, XCircle, ArrowUpDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  // Logic: Filter issues based on all criteria
  const visibleIssues = issues.filter(issue => {
    // 1. Core Permissions & Merged Check
    if (issue.status === 'CLOSED' && issue.mergedInto) return false; 
    const hasPermission = !issue.isPrivate || user.role === UserRole.ADMIN || issue.reporterId === user.id;
    if (!hasPermission) return false;

    // 2. Search Query (Title or Description)
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesDesc = issue.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
    }

    // 3. Status Filter
    if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;

    // 4. Category Filter
    if (categoryFilter !== 'ALL' && issue.category !== categoryFilter) return false;

    // 5. Reporter Filter
    if (reporterFilter === 'ME' && issue.reporterId !== user.id) return false;
    if (reporterFilter === 'OTHERS' && issue.reporterId === user.id) return false;

    // 6. Date Filter
    if (dateFilter !== 'ALL') {
        const date = new Date(issue.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (dateFilter === '7_DAYS' && diffDays > 7) return false;
        if (dateFilter === '30_DAYS' && diffDays > 30) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case SortOption.DATE_NEWEST:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case SortOption.DATE_OLDEST:
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case SortOption.PRIORITY_HIGH:
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      case SortOption.UPVOTES_MOST:
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
  });

  const activeFiltersCount = [
      statusFilter !== 'ALL',
      categoryFilter !== 'ALL',
      dateFilter !== 'ALL',
      reporterFilter !== 'ALL'
  ].filter(Boolean).length;

  const resetFilters = () => {
      setSearchQuery('');
      setStatusFilter('ALL');
      setCategoryFilter('ALL');
      setDateFilter('ALL');
      setReporterFilter('ALL');
  };

  const handleUpvote = (issue: Issue) => {
    if (issue.upvotedBy.includes(user.id)) return; // Already upvoted
    const updated = {
      ...issue,
      upvotes: issue.upvotes + 1,
      upvotedBy: [...issue.upvotedBy, user.id]
    };
    onUpdate(updated);
  };

  const initiateStatusChange = (issue: Issue, newStatus: string) => {
    setConfirmModal({
      issue,
      newStatus: newStatus as IssueStatus
    });
  };

  const confirmStatusChange = () => {
    if (confirmModal) {
      onUpdate({
        ...confirmModal.issue,
        status: confirmModal.newStatus
      });
      setConfirmModal(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'REPORTED': return 'bg-slate-100 text-slate-600';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'CLOSED': return 'bg-slate-800 text-slate-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Issue Board</h1>
           <p className="text-slate-500 text-sm mt-1">Track, manage, and resolve hostel issues.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {user.role !== UserRole.ADMIN && (
            <Link to="/report" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
              <Plus size={18} />
              <span className="text-sm font-bold">New Issue</span>
            </Link>
          )}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {/* Status Filter */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${statusFilter !== 'ALL' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <Filter size={14} className={statusFilter !== 'ALL' ? 'text-indigo-600' : 'text-slate-500'} />
              <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none p-0 focus:ring-0 w-28"
              >
                  <option value="ALL">All Status</option>
                  {Object.values(IssueStatus).map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
              </select>
          </div>

           {/* Category Filter */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${categoryFilter !== 'ALL' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <Tag size={14} className={categoryFilter !== 'ALL' ? 'text-indigo-600' : 'text-slate-500'} />
              <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none p-0 focus:ring-0 w-28"
              >
                  <option value="ALL">All Categories</option>
                   {Object.values(IssueCategory).map(c => (
                      <option key={c} value={c}>{c}</option>
                  ))}
              </select>
          </div>

          {/* Date Filter */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${dateFilter !== 'ALL' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <Calendar size={14} className={dateFilter !== 'ALL' ? 'text-indigo-600' : 'text-slate-500'} />
              <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none p-0 focus:ring-0 w-28"
              >
                  <option value="ALL">All Time</option>
                  <option value="7_DAYS">Last 7 Days</option>
                  <option value="30_DAYS">Last 30 Days</option>
              </select>
          </div>

           {/* Reporter Filter */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${reporterFilter !== 'ALL' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <UserIcon size={14} className={reporterFilter !== 'ALL' ? 'text-indigo-600' : 'text-slate-500'} />
              <select 
                  value={reporterFilter}
                  onChange={(e) => setReporterFilter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none p-0 focus:ring-0 w-28"
              >
                  <option value="ALL">All Reporters</option>
                  <option value="ME">Reported by Me</option>
                  <option value="OTHERS">By Others</option>
              </select>
          </div>
           
           {/* Sort By Dropdown */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${sortBy !== SortOption.DATE_NEWEST ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <ArrowUpDown size={14} className={sortBy !== SortOption.DATE_NEWEST ? 'text-indigo-600' : 'text-slate-500'} />
              <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none p-0 focus:ring-0 w-36"
              >
                  <option value={SortOption.DATE_NEWEST}>Date (Newest First)</option>
                  <option value={SortOption.DATE_OLDEST}>Date (Oldest First)</option>
                  <option value={SortOption.PRIORITY_HIGH}>Priority (Highest First)</option>
                  <option value={SortOption.UPVOTES_MOST}>Upvotes (Most Popular)</option>
              </select>
          </div>

           {(activeFiltersCount > 0 || searchQuery) && (
            <button 
                onClick={resetFilters}
                className="ml-auto flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-red-600 px-3 py-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
            >
                <XCircle size={14} />
                <span>Reset ({activeFiltersCount})</span>
            </button>
           )}
      </div>

      <div className="space-y-4">
        {visibleIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">No issues found</h3>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="mt-4 text-indigo-600 font-semibold text-sm hover:underline">Clear all filters</button>
            </div>
        ) : visibleIssues.map(issue => (
          <div key={issue.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {user.role === UserRole.ADMIN ? (
                  <div className="relative">
                     <select
                      value={issue.status}
                      onChange={(e) => initiateStatusChange(issue, e.target.value)}
                      className={`appearance-none pl-3 pr-6 py-1 text-xs font-bold rounded-md uppercase tracking-wide cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${getStatusColor(issue.status)}`}
                    >
                      {Object.values(IssueStatus).map(s => (
                        <option key={s} value={s} className="bg-white text-slate-900 normal-case">
                          {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow for select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-current opacity-50">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                ) : (
                  <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                )}
                
                {issue.isPrivate && <div title="Private Issue" className="bg-slate-100 p-1 rounded"><Lock size={12} className="text-slate-500" /></div>}
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">#{issue.id.substring(0,6)}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">{issue.category}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{issue.title}</h3>
                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{issue.description}</p>
            </div>
            
            <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleUpvote(issue)}
                  disabled={issue.upvotedBy.includes(user.id)}
                  className={`flex items-center space-x-1.5 text-sm font-medium transition-colors px-2 py-1 rounded-lg ${
                      issue.upvotedBy.includes(user.id) 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <ThumbsUp size={16} className={issue.upvotedBy.includes(user.id) ? 'fill-current' : ''} />
                  <span>{issue.upvotes}</span>
                </button>
                <div className="flex items-center space-x-1.5 text-slate-500 text-sm px-2 py-1">
                  <MessageSquare size={16} />
                  <span>{issue.comments.length}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                    {issue.reporterName[0]}
                 </div>
                 <span className="text-xs font-medium text-slate-500">{issue.reporterName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setConfirmModal(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Status Change</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Are you sure you want to change the status of 
                  <span className="font-semibold text-slate-900 block mt-1">"{confirmModal.issue.title}"</span> 
                  from <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${getStatusColor(confirmModal.issue.status)} opacity-80`}>{confirmModal.issue.status}</span> 
                  to <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${getStatusColor(confirmModal.newStatus)}`}>{confirmModal.newStatus}</span>?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-colors"
                  >
                    Confirm Change
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