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
import { MessMenu } from './pages/MessMenu';
import { RoommateFinder } from './pages/RoommateFinder';
import { AIChatbot } from './components/AIChatbot';
import { User, UserRole, Issue, Announcement, LostItem, GatePass as IGatePass, GatePassStatus } from './types';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_ISSUES, INITIAL_ANNOUNCEMENTS, INITIAL_LOST_ITEMS, INITIAL_GATE_PASSES } from './services/mockStore';
import { Unauthorized } from './pages/Unauthorized';

interface ProtectedLayoutProps {
  user: User;
  onLogout: () => void;
  userXp: number;
  userLevel: number;
  userCoins: number;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ user, onLogout, userXp, userLevel, userCoins }) => {
  return (
    <div className="flex h-screen bg-[#0b0f19] text-[#f1f5f9] overflow-hidden">
      {/* Sidebar (Left) */}
      {user && (
         <>
           <Sidebar user={user} onLogout={onLogout} userXp={userXp} userLevel={userLevel} userCoins={userCoins} />
         </>
      )}

      {/* Main Content (Right) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0b0f19] p-6 md:p-8">
            <Outlet />
        </main>
        {/* Global AI Chatbot for logged-in users */}
        <AIChatbot />
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

  // RPG States
  const [userXp, setUserXp] = useState<number>(340);
  const [userLevel, setUserLevel] = useState<number>(3);
  const [userCoins, setUserCoins] = useState<number>(85);
  const [levelUpNotif, setLevelUpNotif] = useState<number | null>(null);

  const gainXp = (amount: number) => {
    setUserXp(prev => {
      const totalXp = prev + amount;
      const xpNeeded = userLevel * 150;
      if (totalXp >= xpNeeded) {
        const excess = totalXp - xpNeeded;
        setUserLevel(l => {
          const nextLvl = l + 1;
          setLevelUpNotif(nextLvl);
          setUserCoins(c => c + 20);
          setTimeout(() => setLevelUpNotif(null), 3000);
          return nextLvl;
        });
        return excess;
      }
      return totalXp;
    });
  };

  const gainCoins = (amount: number) => {
    setUserCoins(prev => prev + amount);
  };

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
    <div className="relative min-h-screen bg-[#141419]">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'} />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {user && (
            <Route element={<ProtectedLayout user={user} onLogout={handleLogout} userXp={userXp} userLevel={userLevel} userCoins={userCoins} />}>
              {user.role === UserRole.ADMIN && (
                <Route path="/admin" element={<AdminPanel issues={issues} onMerge={mergeIssues} gatePasses={gatePasses} onUpdatePassStatus={updateGatePassStatus} />} />
              )}
              <Route path="/dashboard" element={<Dashboard user={user} issues={issues} announcements={announcements} userXp={userXp} userLevel={userLevel} userCoins={userCoins} gainXp={gainXp} gainCoins={gainCoins} />} />
              <Route path="/profile" element={<UserProfile user={user} issues={issues} userXp={userXp} userLevel={userLevel} userCoins={userCoins} />} />
              <Route path="/issues" element={<IssueBoard user={user} issues={issues} onUpdate={updateIssue} />} />
              <Route path="/report" element={<ReportIssue user={user} onReport={(issue) => { addIssue(issue); gainXp(30); gainCoins(10); }} />} />
              <Route path="/announcements" element={<Announcements user={user} data={announcements} onAdd={handleAddAnnouncement} />} />
              <Route path="/lost-found" element={<LostFound items={lostItems} onAdd={(item) => { handleAddLostItem(item); gainXp(25); gainCoins(8); }} />} />
              <Route path="/ragging" element={<AntiRagging user={user} onReport={addIssue} />} />
              <Route path="/outpass" element={<GatePass user={user} passes={gatePasses.filter(p => p.studentId === user.id)} onNewPass={(pass) => { addGatePass(pass); gainXp(20); gainCoins(5); }} />} />
              <Route path="/mess" element={<MessMenu gainXp={gainXp} gainCoins={gainCoins} />} />
              <Route path="/roommates" element={<RoommateFinder />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>

      {/* Advancement Notification (Level Up) */}
      <AnimatePresence>
        {levelUpNotif !== null && (
          <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-[#211f20] border-3 border-[#f2ab13] p-4 rounded shadow-2xl flex items-center gap-3.5 max-w-sm w-full"
              style={{
                boxShadow: 'inset 2px 2px 0 #3a3839, inset -2px -2px 0 #111011, 0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div className="w-10 h-10 bg-[#141419] border-2 border-[#3a3839] flex items-center justify-center text-xl shadow-inner shrink-0">
                💎
              </div>
              <div>
                <p className="text-[#f2ab13] font-mc-sub text-[10px] uppercase font-bold tracking-widest leading-none">Advancement Made!</p>
                <p className="text-white font-mc-title text-[10px] mt-1.5 uppercase leading-none">LVL UP: LEVEL {levelUpNotif}</p>
                <p className="text-[10px] text-slate-400 font-mono-readable mt-2">+20 Emeralds Added To Pouch</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}