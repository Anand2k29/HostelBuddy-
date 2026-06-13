import React, { useState, useMemo } from 'react';
import { Issue, IssueStatus, User, UserRole, IssueCategory, IssuePriority } from '../types';
import { Merge, CheckSquare, Square, Users, BarChart3, ListFilter, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  issues: Issue[];
  onMerge: (parentId: string, children: string[]) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.d@example.com', role: UserRole.STUDENT, roomNumber: '101A' },
  { id: '2', name: 'Jane Smith', email: 'jane.s@example.com', role: UserRole.STUDENT, roomNumber: '102B' },
  { id: '3', name: 'Peter Jones', email: 'peter.j@example.com', role: UserRole.STUDENT, roomNumber: '103C' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@example.com', role: UserRole.STUDENT, roomNumber: '104D' },
];

type AdminTab = 'ISSUES' | 'USERS' | 'ANALYTICS';

export const AdminPanel: React.FC<AdminPanelProps> = ({ issues, onMerge }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('ISSUES');

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

  const StatCard = ({ title, value, icon: Icon, colorClass = 'text-slate-500' }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-2 bg-slate-100 rounded-lg ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  );

  const TabButton = ({ tab, label, icon: Icon }: { tab: AdminTab, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
        activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'ISSUES':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-bold text-slate-800">All Issues</h3>
                    {/* Filters */}
                    <div className="flex items-center space-x-2">
                        <ListFilter size={16} className="text-slate-400" />
                        <select className="text-sm border-none bg-transparent focus:ring-0">
                            <option>Category</option>
                        </select>
                        <select className="text-sm border-none bg-transparent focus:ring-0">
                            <option>Priority</option>
                        </select>
                    </div>
                </div>
                {selectedIds.length > 1 && (
                    <button 
                        onClick={handleMerge}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-indigo-500/20 animate-pulse"
                    >
                        <Merge size={16} />
                        <span>Merge ({selectedIds.length})</span>
                    </button>
                )}
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="p-4 w-10"></th>
                  <th className="p-4 font-semibold text-slate-600">Issue</th>
                  <th className="p-4 font-semibold text-slate-600">Category</th>
                  <th className="p-4 font-semibold text-slate-600">Priority</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Reported By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeIssues.map(issue => (
                  <tr 
                    key={issue.id} 
                    className={`transition-colors cursor-pointer ${selectedIds.includes(issue.id) ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                    onClick={() => toggleSelect(issue.id)}
                  >
                    <td className="p-4 text-center">
                      {selectedIds.includes(issue.id) 
                        ? <CheckSquare size={18} className="text-indigo-600" /> 
                        : <Square size={18} className="text-slate-300" />
                      }
                    </td>
                    <td className="p-4"><div className="font-bold text-slate-900">{issue.title}</div><div className="text-slate-500 truncate max-w-xs">{issue.description}</div></td>
                    <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{issue.category}</span></td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? 'text-red-600 bg-red-100' : 'text-slate-600 bg-slate-100'}`}>{issue.priority}</span></td>
                    <td className="p-4 text-slate-600">{issue.status}</td>
                    <td className="p-4 text-slate-500">{issue.reporterName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'USERS':
        return (
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">User Management</h3>
            <ul className="divide-y divide-slate-100">
                {mockUsers.map(user => (
                    <li key={user.id} className="p-3 flex justify-between items-center hover:bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-slate-500 text-sm">{user.email} - Room {user.roomNumber}</p>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-full">{user.role}</span>
                    </li>
                ))}
            </ul>
          </div>
        );
      case 'ANALYTICS':
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                <BarChart3 size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Analytics Dashboard</h3>
                <p className="text-slate-500">Charts and graphs will be displayed here.</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Command Center Banner */}
      <div className="relative p-8 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://source.unsplash.com/random/1200x400?abstract,technology')] bg-cover bg-center"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Command Center</h1>
            <p className="text-indigo-100 mt-2">Comprehensive control over HostelBuddy operations.</p>
          </div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm">
            <CheckCircle size={16} className="mr-2" />
            System Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Issues" value={stats.total} icon={AlertTriangle} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} colorClass="text-red-500" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} colorClass="text-green-500" />
        <StatCard title="Avg Response" value={stats.avgResponse} icon={BarChart3} />
      </div>

      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <TabButton tab="ISSUES" label="Issues" icon={ListFilter} />
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