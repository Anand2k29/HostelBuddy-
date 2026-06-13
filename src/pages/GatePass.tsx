import React, { useState } from 'react';
import { User, GatePass as IGatePass, GatePassStatus, LeaveType } from '../types';
import { Plus, History, Send, Ticket, CheckCircle, XCircle, Clock, Anchor } from 'lucide-react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';

interface GatePassProps {
  user: User;
  passes: IGatePass[];
  onNewPass: (pass: Omit<IGatePass, 'id' | 'status' | 'requestedAt' | 'studentName' | 'roomNumber'>) => void;
}

type Tab = 'REQUEST' | 'HISTORY';

const GatePassCard: React.FC<{ pass: IGatePass }> = ({ pass }) => {
  const statusStyles = {
    [GatePassStatus.APPROVED]: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-800',
      icon: <CheckCircle size={20} />,
      label: 'APPROVED',
      badge: 'bg-green-600',
    },
    [GatePassStatus.PENDING]: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: <Clock size={20} />,
      label: 'PENDING',
      badge: 'bg-yellow-500',
    },
    [GatePassStatus.REJECTED]: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: <XCircle size={20} />,
      label: 'REJECTED',
      badge: 'bg-red-600',
    },
  };

  const style = statusStyles[pass.status];

  return (
    <div className={`w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border ${style.border} overflow-hidden transition-all duration-300 hover:shadow-2xl`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs text-slate-500">HostelBuddy Digital Gate Pass</p>
                <p className="text-2xl font-bold text-slate-900">{pass.studentName}</p>
                <p className="text-sm text-slate-500">Room: {pass.roomNumber}</p>
            </div>
            <div className="flex flex-col items-end">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white font-bold text-sm ${style.badge}`}>
                    {style.icon}
                    <span>{style.label}</span>
                </div>
                 <p className="text-xs text-slate-400 mt-2">ID: {pass.id.slice(0, 8)}</p>
            </div>
        </div>

        <div className="my-4 border-t-2 border-dashed border-slate-200"></div>

        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-slate-500">Departure</p>
                <p className="font-bold text-slate-800">{new Date(pass.departureDate).toLocaleString()}</p>
            </div>
            <div>
                <p className="text-slate-500">Return</p>
                <p className="font-bold text-slate-800">{new Date(pass.returnDate).toLocaleString()}</p>
            </div>
             <div>
                <p className="text-slate-500">Leave Type</p>
                <p className="font-bold text-slate-800">{pass.leaveType}</p>
            </div>
             <div>
                <p className="text-slate-500">Reason</p>
                <p className="font-bold text-slate-800 truncate">{pass.reason}</p>
            </div>
        </div>
      </div>
      
      {pass.status === GatePassStatus.APPROVED && (
        <div className={`p-5 ${style.bg} border-t-2 border-dashed border-slate-200 flex flex-col items-center gap-4`}>
            <div className="bg-white p-2 rounded-lg shadow-md">
                <QRCode value={pass.id} size={128} />
            </div>
            <div className="text-center">
                <p className={`font-bold text-sm ${style.text}`}>OFFICIAL PASS - VERIFIED</p>
                <p className="text-xs text-slate-500">Present this QR code at the gate</p>
            </div>
        </div>
      )}
    </div>
  );
};


export const GatePass: React.FC<GatePassProps> = ({ user, passes, onNewPass }) => {
  const [activeTab, setActiveTab] = useState<Tab>('REQUEST');
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.OUTING);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNewPass({
      studentId: user.id,
      leaveType,
      departureDate,
      returnDate,
      reason,
    });
    alert('Gate pass requested successfully!');
    // Reset form
    setDepartureDate('');
    setReturnDate('');
    setReason('');
    setActiveTab('HISTORY');
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center space-x-2 py-3 font-semibold text-sm transition-all rounded-t-lg ${
        activeTab === tab ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
            <Ticket size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-900">Digital Gate Pass</h1>
        </div>
      
      <div className="flex bg-slate-100 rounded-t-lg">
        <TabButton tab="REQUEST" label="Request New Pass" icon={Plus} />
        <TabButton tab="HISTORY" label="My Pass History" icon={History} />
      </div>

      <div className="bg-white p-8 rounded-b-lg shadow-md">
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
                <h2 className="text-xl font-semibold text-center text-slate-800">New Gate Pass Request</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Departure Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Return Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Leave</label>
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Attending a family function"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  <Send size={18} />
                  <span>Submit Request</span>
                </button>
              </form>
            )}
            {activeTab === 'HISTORY' && (
              <div>
                <h2 className="text-xl font-semibold text-center text-slate-800 mb-6">Your Gate Pass History</h2>
                {passes.length > 0 ? (
                    <div className="space-y-6">
                        {passes.map(pass => <GatePassCard key={pass.id} pass={pass} />)}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 rounded-lg bg-slate-50">
                        <Anchor size={40} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">No Passes Found</h3>
                        <p className="text-slate-500">You haven't requested any gate passes yet.</p>
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
