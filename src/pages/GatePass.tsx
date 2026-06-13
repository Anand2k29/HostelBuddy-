import React, { useState } from 'react';
import { User, GatePass as IGatePass, GatePassStatus, LeaveType } from '../types';
import { Plus, History, Send, Ticket, CheckCircle, XCircle, Clock, Anchor, Shield, Sparkles, MapPin, Zap } from 'lucide-react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';

interface GatePassProps {
  user: User;
  passes: IGatePass[];
  onNewPass: (pass: Omit<IGatePass, 'id' | 'status' | 'requestedAt' | 'studentName' | 'roomNumber'>) => void;
}

type Tab = 'REQUEST' | 'HISTORY';

/* ─── Thematic leave type labels ─── */
const LEAVE_LABELS: Record<string, { name: string; desc: string; icon: string; color: string }> = {
  [LeaveType.OUTING]: { name: 'Tavern Outing Route', desc: 'Short duration patrol outside campus walls', icon: '🍺', color: '#00d8df' },
  [LeaveType.HOME]: { name: 'Faction Quest Route', desc: 'Long duration journey to home faction base', icon: '🏰', color: '#ffbe00' },
  [LeaveType.MEDICAL]: { name: 'Sanctuary Healing Route', desc: 'Emergency teleport to medical healing outpost', icon: '💊', color: '#00e676' },
};

/* ─── Status timeline steps ─── */
const STATUS_STEPS = [
  { key: 'FORGING', label: 'Forging Rune', icon: '🔨' },
  { key: 'SENT', label: 'Sent To Warden Keep', icon: '📜' },
  { key: 'RESULT', label: 'Portal Active', icon: '🌀' },
];

/* ─── Pass Card (History) ─── */
const GatePassCard: React.FC<{ pass: IGatePass }> = ({ pass }) => {
  const statusConfig = {
    [GatePassStatus.APPROVED]: {
      bg: 'bg-[#00e676]/10', border: 'border-[#00e676]/50', text: 'text-[#00e676]',
      icon: <CheckCircle size={14} />, label: 'PORTAL ACTIVE', badge: 'bg-[#00e676]',
      stepIndex: 2, stepColor: '#00e676',
    },
    [GatePassStatus.PENDING]: {
      bg: 'bg-[#ffbe00]/10', border: 'border-[#ffbe00]/50', text: 'text-[#ffbe00]',
      icon: <Clock size={14} />, label: 'AWAITING WARDEN SEAL', badge: 'bg-[#ffbe00]',
      stepIndex: 1, stepColor: '#ffbe00',
    },
    [GatePassStatus.REJECTED]: {
      bg: 'bg-[#ef4444]/10', border: 'border-[#ef4444]/50', text: 'text-[#ef4444]',
      icon: <XCircle size={14} />, label: 'SCROLL INCINERATED', badge: 'bg-[#ef4444]',
      stepIndex: 2, stepColor: '#ef4444',
    },
  };

  const s = statusConfig[pass.status];
  const leaveInfo = LEAVE_LABELS[pass.leaveType] || LEAVE_LABELS[LeaveType.OUTING];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mc-card bg-[#1f1f26] border ${s.border} overflow-hidden transition-all hover:shadow-lg`}
    >
      {/* Pass Header */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{leaveInfo.icon}</span>
              <p className="text-[10px] font-bold text-white font-mc-sub uppercase truncate">{pass.studentName}</p>
            </div>
            <p className="text-[9px] text-slate-500 font-mono-readable">Room {pass.roomNumber} · ID: {pass.id.slice(0, 8)}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[8px] font-mc-sub uppercase font-bold border ${s.bg} ${s.text} ${s.border} shrink-0`}>
            {s.icon}
            <span>{s.label}</span>
          </div>
        </div>

        {/* Rune Progress Timeline */}
        <div className="mt-5 flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => {
            const isActive = i <= s.stepIndex;
            const isRejectedFinal = pass.status === GatePassStatus.REJECTED && i === 2;
            const dotColor = isRejectedFinal ? '#ef4444' : isActive ? s.stepColor : '#3c3c44';
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center text-center flex-1">
                  <div
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm transition-all ${
                      isActive ? 'bg-[#141419] shadow-lg' : 'bg-[#1f1f26]'
                    }`}
                    style={{ borderColor: dotColor, boxShadow: isActive ? `0 0 10px ${dotColor}40` : 'none' }}
                  >
                    {isRejectedFinal ? '❌' : step.icon}
                  </div>
                  <p className="text-[7px] font-mc-sub uppercase mt-1.5 tracking-wider" style={{ color: isActive ? dotColor : '#64748b' }}>
                    {isRejectedFinal ? 'Incinerated' : step.label}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 rounded" style={{ backgroundColor: i < s.stepIndex ? s.stepColor : '#3c3c44' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Details Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#26262a] pt-4">
          <div>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase">Portal Outbound</p>
            <p className="text-[10px] text-slate-300 font-mono-readable mt-1">{new Date(pass.departureDate).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase">Portal Return</p>
            <p className="text-[10px] text-slate-300 font-mono-readable mt-1">{new Date(pass.returnDate).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase">Route Type</p>
            <p className="text-[10px] font-mono-readable mt-1" style={{ color: leaveInfo.color }}>{leaveInfo.name}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase">Quest Scroll</p>
            <p className="text-[10px] text-slate-300 font-mono-readable mt-1 truncate">{pass.reason}</p>
          </div>
        </div>
      </div>

      {/* QR Portal Key for Approved */}
      {pass.status === GatePassStatus.APPROVED && (
        <div className="p-5 bg-[#141419]/80 border-t-2 border-dashed border-[#00e676]/30 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-3 bg-[#00e676]/10 rounded blur-xl" />
            <div className="relative bg-white p-2 rounded shadow-lg">
              <QRCode value={pass.id} size={110} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-mc-title text-[#00e676] uppercase font-bold tracking-wide flex items-center gap-1.5">
              <Shield size={12} /> Portal Pass Key — Verified
            </p>
            <p className="text-[9px] text-slate-500 font-mono-readable mt-1">Present this artifact at the campus gate outpost</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};


export const GatePass: React.FC<GatePassProps> = ({ user, passes, onNewPass }) => {
  const [activeTab, setActiveTab] = useState<Tab>('REQUEST');
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.OUTING);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [reason, setReason] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [forgeText, setForgeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsForging(true);
    setForgeText('* INSCRIBING RUNE GLYPHS *');

    const texts = ['* INSCRIBING RUNE GLYPHS *', '* ENCHANTING PORTAL SCROLL *', '* SEALING WITH WARDEN SIGIL *'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setForgeText(texts[idx]);
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setIsForging(false);
      onNewPass({
        studentId: user.id,
        leaveType,
        departureDate,
        returnDate,
        reason,
      });
      setDepartureDate('');
      setReturnDate('');
      setReason('');
      setActiveTab('HISTORY');
    }, 2000);
  };

  const selectedLeave = LEAVE_LABELS[leaveType] || LEAVE_LABELS[LeaveType.OUTING];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#26262a] pb-5">
        <div className="w-10 h-10 bg-[#1f1f26] border-2 border-[#101014] rounded flex items-center justify-center text-mc-cyan shadow-inner">
          <Ticket size={18} />
        </div>
        <div>
          <h1 className="text-lg font-black text-white font-mc-title uppercase tracking-wide">Portal Gateway Ledger</h1>
          <p className="text-slate-400 font-mono-readable text-xs mt-0.5">[ Forge portal runes to travel beyond the hostel campus walls ]</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2.5">
        <button
          onClick={() => setActiveTab('REQUEST')}
          className={`btn-mc flex-1 flex items-center justify-center gap-2 text-[10px] uppercase ${
            activeTab === 'REQUEST' ? 'bg-mc-cyan text-black border-mc-cyan' : 'bg-[#1f1f26] text-slate-400 border-[#26262a]'
          }`}
        >
          <Plus size={12} /> Forge New Rune
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`btn-mc flex-1 flex items-center justify-center gap-2 text-[10px] uppercase ${
            activeTab === 'HISTORY' ? 'bg-mc-cyan text-black border-mc-cyan' : 'bg-[#1f1f26] text-slate-400 border-[#26262a]'
          }`}
        >
          <History size={12} /> Passage Archive
        </button>
      </div>

      {/* Content Area */}
      <div className="mc-card bg-[#1f1f26]/90 p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'REQUEST' && (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                <div className="text-center mb-2">
                  <h2 className="text-xs font-black text-white font-mc-title uppercase">Inscribe Portal Passage Rune</h2>
                  <p className="text-[9px] text-slate-500 font-mono-readable mt-1">Select your route, log your quest objectives, and submit for warden approval</p>
                </div>

                {/* Leave Type Selection */}
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider block">Destination Route</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(LEAVE_LABELS).map(([key, info]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setLeaveType(key as LeaveType)}
                        className={`p-3 rounded border text-left transition-all ${
                          leaveType === key
                            ? 'bg-[#141419] shadow-lg'
                            : 'bg-[#1f1f26] hover:bg-[#141419] border-[#26262a]'
                        }`}
                        style={{
                          borderColor: leaveType === key ? info.color : undefined,
                          boxShadow: leaveType === key ? `0 0 12px ${info.color}25` : undefined,
                        }}
                      >
                        <span className="text-lg block mb-1">{info.icon}</span>
                        <p className="text-[9px] font-mc-sub uppercase font-bold" style={{ color: info.color }}>{info.name}</p>
                        <p className="text-[8px] text-slate-500 font-mono-readable mt-0.5 leading-relaxed">{info.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider block mb-2">Portal Outbound Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full text-xs font-mono-readable"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider block mb-2">Portal Return Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full text-xs font-mono-readable"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase font-mc-sub tracking-wider block mb-2">Quest Objectives Scroll</label>
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-xs font-mono-readable resize-none"
                    placeholder="Describe your travel quest objectives..."
                  />
                </div>

                {/* Active Route Preview */}
                <div className="bg-[#141419] border border-[#3c3c44] rounded p-3 flex items-center gap-3">
                  <span className="text-xl">{selectedLeave.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-mc-sub uppercase font-bold" style={{ color: selectedLeave.color }}>{selectedLeave.name}</p>
                    <p className="text-[8px] text-slate-500 font-mono-readable">{selectedLeave.desc}</p>
                  </div>
                  <Zap size={14} style={{ color: selectedLeave.color }} className="shrink-0" />
                </div>

                {/* Submit / Forging State */}
                {isForging ? (
                  <div className="space-y-3 py-2">
                    <div className="flex justify-between items-center text-[9px] font-mc-sub uppercase text-[#ffbe00]">
                      <span className="animate-pulse">{forgeText}</span>
                      <span>Forging...</span>
                    </div>
                    <div className="w-full h-3 bg-[#141419] border border-[#3c3c44] p-0.5 rounded-sm overflow-hidden">
                      <div className="h-full bg-mc-cyan chomp-bar" />
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn-mc w-full flex items-center justify-center gap-2 py-3 uppercase text-[10px] glow-cta"
                  >
                    <Sparkles size={14} />
                    Inscribe Portal Rune
                  </button>
                )}
              </form>
            )}
            {activeTab === 'HISTORY' && (
              <div>
                <h2 className="text-xs font-black text-white font-mc-title uppercase text-center mb-6">Passage Archive Ledger</h2>
                {passes.length > 0 ? (
                    <div className="space-y-5">
                        {passes.map(pass => <GatePassCard key={pass.id} pass={pass} />)}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MapPin size={32} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xs font-mc-title text-slate-400 uppercase">No Portal Runes Found</h3>
                        <p className="text-[10px] text-slate-500 font-mono-readable mt-2">You haven't forged any passage runes yet. Create your first one above.</p>
                    </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
