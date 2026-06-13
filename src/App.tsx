import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
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
import { AntiRagging } from './pages/AntiRagging';
import { GatePass } from './pages/GatePass';
import { User, UserRole, Issue, Announcement, LostItem, GatePass as IGatePass, GatePassStatus } from './types';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_ISSUES, INITIAL_ANNOUNCEMENTS, INITIAL_LOST_ITEMS, INITIAL_GATE_PASSES } from './services/mockStore';
import { Unauthorized } from './pages/Unauthorized';

const ProtectedLayout: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar (Left) */}
      {user && (
         <>
           <Sidebar user={user} onLogout={onLogout} />
           {/* Mobile Menu Button - Optional: Add a small button here for mobile if needed, or just hide navbar for now */}
         </>
      )}

      {/* Main Content (Right) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [lostItems, setLostItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [gatePasses, setGatePasses] = useState<IGatePass[]>(INITIAL_GATE_PASSES);

  const addIssue = async (newIssue: Issue) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setIssues([newIssue, ...issues]);
  };

  const addGatePass = async (passDetails: Omit<IGatePass, 'id' | 'status' | 'requestedAt' | 'studentName' | 'roomNumber'>) => {
    if (!user) return;
    const newPass: IGatePass = {
      id: `gp${Date.now()}`,
      status: GatePassStatus.PENDING,
      requestedAt: new Date().toISOString(),
      studentName: user.name,
      roomNumber: user.roomNumber,
      ...passDetails,
    };
    await new Promise(resolve => setTimeout(resolve, 500));
    setGatePasses([newPass, ...gatePasses]);
  };

  const handleAddAnnouncement = async (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      date: new Date().toISOString(),
      ...announcement,
    };
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleAddLostItem = async (item: Omit<LostItem, 'id' | 'date'>) => {
    const newLostItem: LostItem = {
      id: `li-${Date.now()}`,
      date: new Date().toISOString(),
      ...item,
    };
    await new Promise(resolve => setTimeout(resolve, 500));
    setLostItems([newLostItem, ...lostItems]);
  };

  const updateGatePassStatus = async (passId: string, status: GatePassStatus) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setGatePasses(passes => passes.map(p => p.id === passId ? { ...p, status } : p));
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
    setUser(null);
    navigate('/');
  };

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />} />
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {user && (
          <Route element={<ProtectedLayout user={user} onLogout={handleLogout} />}>
            {user.role === UserRole.ADMIN && (
              <Route path="/admin" element={<AdminPanel issues={issues} onMerge={mergeIssues} gatePasses={gatePasses} onUpdatePassStatus={updateGatePassStatus} />} />
            )}
            <Route path="/dashboard" element={<Dashboard user={user} issues={issues} announcements={announcements} />} />
            <Route path="/profile" element={<UserProfile user={user} issues={issues} />} />
            <Route path="/issues" element={<IssueBoard user={user} issues={issues} onUpdate={updateIssue} />} />
            <Route path="/report" element={<ReportIssue user={user} onReport={addIssue} />} />
            <Route path="/announcements" element={<Announcements user={user} data={announcements} onAdd={handleAddAnnouncement} />} />
            <Route path="/lost-found" element={<LostFound items={lostItems} onAdd={handleAddLostItem} />} />
            <Route path="/ragging" element={<AntiRagging user={user} onReport={addIssue} />} />
            <Route path="/outpass" element={<GatePass user={user} passes={gatePasses.filter(p => p.studentId === user.id)} onNewPass={addGatePass} />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}