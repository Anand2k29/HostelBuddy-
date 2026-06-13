import React from 'react';
import { User, Issue, Announcement, IssueStatus, UserRole } from '../types';
import { AlertTriangle, CheckCircle2, Bell, Clock, ArrowRight, BarChart2, Shield, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
  issues: Issue[];
  announcements: Announcement[];
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
  <motion.div
    variants={item}
    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col justify-between`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-xl`}>
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
    </div>
  </motion.div>
);

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export const Dashboard: React.FC<DashboardProps> = ({ user, issues, announcements }) => {
  // Role-specific calculations
  const isAdmin = user.role === UserRole.ADMIN;

  // Stats
  const myPendingIssues = issues.filter(i => i.reporterId === user.id && i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
  const myResolvedIssues = issues.filter(i => i.reporterId === user.id && (i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED)).length;
  const totalPending = issues.filter(i => i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
  const criticalIssues = issues.filter(i => i.priority === 'HIGH' && i.status !== 'RESOLVED').length;

  // Recent Activity
  const recentActivity = (isAdmin ? issues : issues.filter(i => i.reporterId === user.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Hello, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {isAdmin ? "Here's the admin overview of the hostel." : "A quick look at what's happening in your hostel."}
          </p>
        </div>
        {/* Quick Action Button */}
        {isAdmin ? (
          <Link to="/admin" className="flex items-center gap-2 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-md hover:bg-slate-900 transition-colors">
            <Shield size={20} />
            <span className="font-bold">Admin Console</span>
          </Link>
        ) : (
          <Link to="/report" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <Plus size={20} />
            <span className="font-bold">New Issue</span>
          </Link>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <StatCard title="Total Pending" value={totalPending} icon={<Clock size={24} />} color="blue" />
            <StatCard title="Critical Issues" value={criticalIssues} icon={<AlertTriangle size={24} />} color="red" />
            <StatCard title="Total Resolved" value={issues.length - totalPending} icon={<CheckCircle2 size={24} />} color="green" />
          </>
        ) : (
          <>
            <StatCard title="My Pending Issues" value={myPendingIssues} icon={<AlertTriangle size={24} />} color="yellow" />
            <StatCard title="My Resolved Issues" value={myResolvedIssues} icon={<CheckCircle2 size={24} />} color="green" />
            <StatCard title="Announcements" value={announcements.length} icon={<Bell size={24} />} color="blue" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Recent Announcements */}
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Announcements</h3>
            <Link to="/announcements" className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {announcements.slice(0, 4).map(ann => (
              <div key={ann.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-100/70 transition-colors">
                 <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${ann.priority === 'URGENT' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                 <div>
                    <h4 className="text-sm font-semibold text-gray-800">{ann.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ann.content}</p>
                 </div>
              </div>
            ))}
            {announcements.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">No new announcements.</div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">{isAdmin ? 'Recent System Activity' : 'Your Recent Issues'}</h3>
            <Link to="/issues" className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
             {recentActivity.slice(0, 4).map(issue => (
                 <div key={issue.id} className="p-4 hover:bg-gray-100/70 transition-colors flex items-center justify-between group">
                    <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{issue.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(issue.createdAt).toLocaleDateString()} • <span className="font-medium">{issue.category}</span></p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                        issue.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {issue.status.replace('_', ' ')}
                    </span>
                 </div>
             ))}
             {recentActivity.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">{isAdmin ? 'No issues reported yet.' : 'You haven\'t reported any issues yet.'}</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};