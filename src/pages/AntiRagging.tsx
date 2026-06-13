import React, { useState, useEffect } from 'react';
import { User, Issue, IssueCategory, IssuePriority, IssueStatus } from '../types';
import { Shield, Send, Calendar, Clock, MapPin, Radio, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AntiRaggingProps {
  user: User;
  onReport: (issue: Issue) => void;
}

const TRANSMISSION_STEPS = [
  'Establishing secure tunnel to Aegis Keep...',
  'Obfuscating client browser metadata...',
  'Shuffling route packets through 4 proxy relays...',
  'Encrypting payload with SHA-512 cryptorunes...',
  'Inscribing ledger anonymously in the Chancellor Archive...',
  'Purging temporary local cache and trace files...'
];

export const AntiRagging: React.FC<AntiRaggingProps> = ({ user, onReport }) => {
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [location, setLocation] = useState('');

  // Transmission simulation state
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionProgress, setTransmissionProgress] = useState(0);
  const [transmissionStep, setTransmissionStep] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTransmitting) {
      setTransmissionProgress(0);
      setTransmissionStep(TRANSMISSION_STEPS[0]);

      interval = setInterval(() => {
        setTransmissionProgress((prev) => {
          const next = prev + (100 / (TRANSMISSION_STEPS.length * 4)); // increment progress
          
          // Determine current step based on progress percentage
          const stepIndex = Math.min(
            Math.floor((next / 100) * TRANSMISSION_STEPS.length),
            TRANSMISSION_STEPS.length - 1
          );
          setTransmissionStep(TRANSMISSION_STEPS[stepIndex]);

          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsTransmitting(false);
              setSuccess(true);
            }, 300);
            return 100;
          }
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isTransmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      alert('Please provide a detailed description of the incident (minimum 20 characters).');
      return;
    }

    setIsTransmitting(true);
  };

  const finalizeReport = () => {
    const newIssue: Issue = {
      id: `anon-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Anti-Ragging Report', // Generic title for anonymity
      description: `Date: ${incidentDate} ${incidentTime}\nLocation: ${location}\n\nDetails:\n${description}`,
      category: IssueCategory.RAGGING,
      priority: IssuePriority.CRITICAL,
      status: IssueStatus.REPORTED,
      isPrivate: true,
      isAnonymous: true,
      reporterId: user.id,
      reporterName: 'Anonymous Student',
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      comments: [],
    };

    onReport(newIssue);
    setDescription('');
    setIncidentDate('');
    setIncidentTime('');
    setLocation('');
  };

  useEffect(() => {
    if (success) {
      finalizeReport();
    }
  }, [success]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-mc-title text-white flex items-center justify-center gap-3">
          <Shield size={32} className="text-mc-red animate-pulse" />
          AEGIS SECURE NODE
        </h1>
        <p className="text-sm font-mc-sub text-slate-400 mt-2">
          Anonymized reporting uplink for critical student protection.
        </p>
      </div>

      <div className="mc-card p-6 md:p-8 relative overflow-hidden bg-mc-card border-3 border-zinc-950 shadow-2xl">
        <AnimatePresence mode="wait">
          {isTransmitting ? (
            /* SECURE TRANSMISSION SIMULATOR */
            <motion.div
              key="transmitting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-mc-red/25 border-t-mc-red rounded-full animate-spin"></div>
                <Radio className="absolute text-mc-red animate-ping" size={32} />
              </div>

              <div className="space-y-3 text-center w-full max-w-md">
                <div className="font-mc-sub text-mc-red text-xs uppercase tracking-wider animate-pulse flex items-center justify-center gap-2">
                  <Lock size={12} /> SECURE PROTOCOL ACTIVE
                </div>
                <p className="font-mono-readable text-sm text-slate-200 h-10 select-none">
                  {transmissionStep}
                </p>
              </div>

              <div className="w-full max-w-md bg-zinc-900 border-2 border-zinc-800 p-1 rounded">
                <div 
                  className="bg-mc-red h-3 transition-all duration-150 ease-out"
                  style={{ width: `${transmissionProgress}%` }}
                />
              </div>

              <span className="font-mc-sub text-xs text-slate-500">
                Uplink: SECURE_RELAY_{Math.floor(transmissionProgress * 7)} // Obfuscating IP
              </span>
            </motion.div>
          ) : success ? (
            /* SUCCESS FEEDBACK */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500/10 border-2 border-mc-green rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 size={40} className="text-mc-green" />
              </div>

              <div className="space-y-2">
                <h3 className="font-mc-title text-mc-green text-lg uppercase">TRANSMISSION SECURED</h3>
                <p className="font-mc-sub text-slate-400 text-xs">Advancement Unlocked: Aegis Vanguard</p>
              </div>

              <p className="text-slate-300 max-w-md text-sm leading-relaxed">
                Your report scroll was successfully logged. The Warden Keep and Admin Council have been alerted. The Aegis encryption wrapper has destroyed all session link logs to your account.
              </p>

              <button 
                type="button"
                onClick={() => setSuccess(false)}
                className="btn-mc mt-4"
              >
                Return to Sanctuary
              </button>
            </motion.div>
          ) : (
            /* AEGIS FORM */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Shield Obfuscation Banner */}
              <div className="bg-mc-red/10 border border-mc-red/30 p-4 rounded mb-8 flex items-start space-x-3">
                <Lock className="text-mc-red mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-mc-sub text-mc-red text-xs uppercase tracking-wider">🔒 Identity Obfuscated</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    This reporting pipeline employs decentralized secure sockets. Neither the system administrators nor the wardens will see your name, room number, or email on the incident ledger.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scroll Details */}
                <div>
                  <label htmlFor="description" className="block font-mc-sub text-xs text-slate-300 uppercase tracking-wider mb-2">
                    Incident Ledger Scroll (Describe event in detail)
                  </label>
                  <textarea
                    id="description"
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-zinc-950 text-slate-100 border-2 border-zinc-800 rounded focus:border-mc-cyan transition-all outline-none text-sm placeholder:text-zinc-600"
                    placeholder="Enter full chronology of events. To maintain absolute safety and anonymity, do not write your name or other self-identifying markers within this description text."
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Minimum 20 characters required. Current length: {description.length}
                  </p>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block font-mc-sub text-xs text-slate-300 uppercase tracking-wider mb-2">
                      Chronology Inscription Date
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Calendar size={16} />
                      </div>
                      <input
                        id="date"
                        type="date"
                        required
                        value={incidentDate}
                        onChange={e => setIncidentDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 text-slate-100 border-2 border-zinc-800 rounded focus:border-mc-cyan transition-all outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="time" className="block font-mc-sub text-xs text-slate-300 uppercase tracking-wider mb-2">
                      Chronology Inscription Time
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Clock size={16} />
                      </div>
                      <input
                        id="time"
                        type="time"
                        required
                        value={incidentTime}
                        onChange={e => setIncidentTime(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 text-slate-100 border-2 border-zinc-800 rounded focus:border-mc-cyan transition-all outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Coords */}
                <div>
                  <label htmlFor="location" className="block font-mc-sub text-xs text-slate-300 uppercase tracking-wider mb-2">
                    Outpost Location Coords (Location)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <MapPin size={16} />
                    </div>
                    <input
                      id="location"
                      type="text"
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 text-slate-100 border-2 border-zinc-800 rounded focus:border-mc-cyan transition-all outline-none text-sm placeholder:text-zinc-600"
                      placeholder="e.g. Block C common rooms, Floor 2 corridors, Dining forge"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3 btn-mc text-sm uppercase tracking-wide flex items-center justify-center space-x-2 mt-4"
                >
                  <Send size={14} />
                  <span>Transmit Secure Scroll</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
