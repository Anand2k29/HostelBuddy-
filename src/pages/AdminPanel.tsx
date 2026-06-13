import React, { useState } from 'react';
import { Issue, IssueStatus } from '../types';
import { Merge, CheckSquare, Square } from 'lucide-react';

interface AdminPanelProps {
  issues: Issue[];
  onMerge: (parentId: string, children: string[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ issues, onMerge }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
          <p className="text-slate-500 text-sm">Manage, assign, and merge hostel issues.</p>
        </div>
        {selectedIds.length > 1 && (
          <button 
            onClick={handleMerge}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold shadow-lg animate-pulse"
          >
            <Merge size={18} />
            <span>Merge ({selectedIds.length})</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
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
                className={`hover:bg-blue-50 transition-colors cursor-pointer ${selectedIds.includes(issue.id) ? 'bg-blue-50' : ''}`}
                onClick={() => toggleSelect(issue.id)}
              >
                <td className="p-4 text-center">
                  {selectedIds.includes(issue.id) 
                    ? <CheckSquare size={18} className="text-blue-600" /> 
                    : <Square size={18} className="text-slate-300" />
                  }
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-900">{issue.title}</div>
                  <div className="text-slate-500 truncate max-w-xs">{issue.description}</div>
                </td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{issue.category}</span>
                </td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                       issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? 'text-red-600 bg-red-100' : 'text-slate-600 bg-slate-100'
                   }`}>
                       {issue.priority}
                   </span>
                </td>
                <td className="p-4 text-slate-600">{issue.status}</td>
                <td className="p-4 text-slate-500">{issue.reporterName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};