import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { IssueBoard } from './pages/IssueBoard';
import { ReportIssue } from './pages/ReportIssue';
import { AdminPanel } from './pages/AdminPanel';
import { Announcements } from './pages/Announcements';
import { LostFound } from './pages/LostFound';
import { UserProfile } from './pages/UserProfile';
import { User, UserRole, Issue, Announcement, LostItem } from './types';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_ISSUES, INITIAL_ANNOUNCEMENTS, INITIAL_LOST_ITEMS } from './services/mockStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Unauthorized } from './pages/Unauthorized';

const ProtectedLayout: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto h-screen p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [lostItems, setLostItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);

  const addIssue = async (newIssue: Issue) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setIssues([newIssue, ...issues]);
  };

  const updateIssue = async (updatedIssue: Issue) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setIssues(issues.map(i => i.id === updatedIssue.id ? updatedIssue : i));
  };

  const mergeIssues = async (parentIssueId: string, childIssueIds: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setIssues(prev => prev.map(issue => {
      if (childIssueIds.includes(issue.id)) {
        return { ...issue, status: 'CLOSED' as any, mergedInto: parentIssueId };
      }
      return issue;
    }));
  };

  const handleLogin = (loggedInUser: User) => setUser(loggedInUser);
  const handleLogout = () => {
    setUser(null)
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedLayout user={user} onLogout={handleLogout} />}>
            <Route element={<ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminPanel issues={issues} onMerge={mergeIssues} />} />
            </Route>
            <Route element={<ProtectedRoute user={user} allowedRoles={[UserRole.STUDENT, UserRole.ADMIN]} />}>
              <Route path="/dashboard" element={<Dashboard user={user!} issues={issues} announcements={announcements} />} />
              <Route path="/profile" element={<UserProfile user={user!} issues={issues} />} />
              <Route path="/issues" element={<IssueBoard user={user!} issues={issues} onUpdate={updateIssue} />} />
              <Route path="/report" element={<ReportIssue user={user!} onReport={addIssue} />} />
              <Route path="/announcements" element={<Announcements user={user!} data={announcements} />} />
              <Route path="/lost-found" element={<LostFound items={lostItems} />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}