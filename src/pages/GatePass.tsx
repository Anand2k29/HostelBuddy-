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
  [LeaveType.EMERGENCY]: { name: 'Sanctuary Healing Route', desc: 'Emergency teleport to medical healing outpost', icon: '💊', color: '#00e676' },
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

  const formatDateTimeLocal = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
  };

  const applyPreset = (hours: number) => {
    const now = new Date();
    const returnDt = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    const depStr = formatDateTimeLocal(now);
    const retStr = formatDateTimeLocal(returnDt);
    
    setDepartureDate(depStr);
    setReturnDate(retStr);
  };

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
    <div className="space-y-6 text-white font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#26262a] pb-5">
        <div className="w-10 h-10 bg-[#1f1f26] border-2 border-[#101014] rounded flex items-center justify-center text-mc-cyan shadow-inner shrink-0">
          <Ticket size={18} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white font-mc-title uppercase tracking-wide">Portal Gateway Ledger</h1>
          <p className="text-slate-400 font-mono-readable text-xs mt-0.5">[ Forge portal runes to travel beyond the hostel campus walls ]</p>
        </div>
      </div>

      {/* Grid Layout (utilizing page) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left: Forge Passage Rune Console (3 columns) */}
        <div className="lg:col-span-3 mc-card bg-[#1f1f26]/90 p-6 space-y-6 flex flex-col justify-between">
          <div className="border-b border-[#26262a] pb-3">
            <h2 className="text-sm font-black text-white font-mc-title uppercase">Inscribe Portal Passage Rune</h2>
            <p className="text-xs text-slate-500 font-mono-readable mt-1">Select your route, choose date-times from the calendar, and submit for warden approval</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 font-mc-sub tracking-wider block mb-2">Destination Route</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(LEAVE_LABELS).map(([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLeaveType(key as LeaveType)}
                    className={`p-3 rounded border text-left transition-all cursor-pointer ${
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
                    <p className="text-[11px] font-mc-sub uppercase font-bold" style={{ color: info.color }}>{info.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5 leading-relaxed">{info.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Portal Outbound & Return Time (Calendar Type Inputs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 font-mc-sub tracking-wider block mb-2">
                  🛫 PORTAL OUTBOUND TIME
                </label>
                <input
                  type="datetime-local"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#141419] border-2 border-[#3c3c44] rounded text-white p-3.5 focus:border-mc-cyan outline-none text-sm font-bold font-mono-readable cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 font-mc-sub tracking-wider block mb-2">
                  🛬 PORTAL RETURN TIME
                </label>
                <input
                  type="datetime-local"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#141419] border-2 border-[#3c3c44] rounded text-white p-3.5 focus:border-mc-gold outline-none text-sm font-bold font-mono-readable cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Outpass Duration Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mc-sub text-slate-400 uppercase tracking-wider block">
                ⚡ QUICK OUTPASS DURATION PRESETS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: '4 Hours (Short Outing)', hours: 4 },
                  { label: '12 Hours (Rest Shift)', hours: 12 },
                  { label: '24 Hours (Overnight)', hours: 24 },
                  { label: '3 Days (Weekend Leave)', hours: 72 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.hours)}
                    className="py-2.5 px-3 bg-[#141419] border-2 border-[#3c3c44] hover:border-mc-cyan rounded text-[8px] font-mc-sub uppercase text-slate-350 hover:text-white transition-all cursor-pointer shadow-inner active:scale-95 text-center"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-bold text-slate-400 font-mc-sub tracking-wider block mb-2">Quest Objectives Scroll</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-sm font-mono-readable py-3 px-4 bg-[#141419] border-2 border-[#3c3c44] rounded text-white focus:border-mc-cyan outline-none transition-all resize-none"
                placeholder="Describe your travel quest objectives..."
              />
            </div>

            {/* Active Route Preview */}
            <div className="bg-[#141419] border border-[#3c3c44] rounded p-3 flex items-center gap-3">
              <span className="text-xl">{selectedLeave.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mc-sub uppercase font-bold" style={{ color: selectedLeave.color }}>{selectedLeave.name}</p>
                <p className="text-[10px] text-slate-500 font-mono-readable">{selectedLeave.desc}</p>
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
        </div>

        {/* Right: Passage Archive Ledger (2 columns) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="mc-card bg-[#1f1f26]/90 p-5 space-y-4">
            <div className="border-b border-[#26262a] pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black text-white font-mc-title uppercase">Passage Archive</h3>
              <span className="text-[9px] text-[#00d8df] font-mc-sub uppercase tracking-wider">Scroll Records</span>
            </div>
            
            <div className="space-y-5 max-h-[800px] overflow-y-auto pr-1">
              {passes.length > 0 ? (
                passes.map(pass => <GatePassCard key={pass.id} pass={pass} />)
              ) : (
                <div className="text-center py-12">
                  <MapPin size={32} className="mx-auto text-slate-600 mb-4 animate-bounce" />
                  <h3 className="text-xs font-mc-title text-slate-400 uppercase">No Portal Runes Found</h3>
                  <p className="text-[10px] text-slate-500 font-mono-readable mt-2">You haven't forged any passage runes yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
