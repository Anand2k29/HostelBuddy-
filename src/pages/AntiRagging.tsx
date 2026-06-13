import React, { useState } from 'react';
import { User, Issue, IssueCategory, IssuePriority, IssueStatus } from '../types';
import { ShieldCheck, Send, Calendar, Clock, MapPin } from 'lucide-react';

interface AntiRaggingProps {
  user: User;
  onReport: (issue: Issue) => void;
}

export const AntiRagging: React.FC<AntiRaggingProps> = ({ user, onReport }) => {
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 20) {
      alert('Please provide a detailed description of the incident.');
      return;
    }

    const newIssue: Issue = {
      id: `anon-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Anti-Ragging Report', // Generic title for anonymity
      description: `Date: ${incidentDate} ${incidentTime}\nLocation: ${location}\n\nDetails:\n${description}`,
      category: IssueCategory.RAGGING,
      priority: IssuePriority.CRITICAL,
      status: IssueStatus.REPORTED,
      isPrivate: true,
      isAnonymous: true,
      reporterId: user.id, // The ID is stored for system records but not displayed
      reporterName: 'Anonymous Student',
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      comments: [],
    };

    onReport(newIssue);
    alert('Your report has been submitted anonymously. The administration has been notified.');
    setDescription('');
    setIncidentDate('');
    setIncidentTime('');
    setLocation('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Anti-Ragging Reporting Channel</h1>
        <p className="text-lg text-slate-500 mt-2">Your identity will remain <span className="font-bold text-rose-600">anonymous</span> to the administration.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-rose-100">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg mb-6 flex items-center space-x-3">
          <ShieldCheck size={24} />
          <div className="flex-1">
            <h3 className="font-bold">🔒 Secure & Anonymous Mode Active</h3>
            <p className="text-sm">All information submitted here is treated with the highest level of confidentiality and urgency.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Detailed Description of Incident</label>
            <textarea
              id="description"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              placeholder="Please describe the events in as much detail as possible. Do not include your name or any identifying information if you wish to remain fully anonymous."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">Date of Incident</label>
              <div className="absolute left-3 top-10">
                <Calendar size={16} className="text-slate-400" />
              </div>
              <input
                id="date"
                type="date"
                required
                value={incidentDate}
                onChange={e => setIncidentDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">Time of Incident</label>
              <div className="absolute left-3 top-10">
                <Clock size={16} className="text-slate-400" />
              </div>
              <input
                id="time"
                type="time"
                required
                value={incidentTime}
                onChange={e => setIncidentTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">Location of Incident</p>
            <div className="absolute left-3 top-10">
                <MapPin size={16} className="text-slate-400" />
            </div>
            <input
              id="location"
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              placeholder="e.g., Common Room, Floor 2, Block C"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <Send size={18} />
            <span>Submit Anonymous Report</span>
          </button>
        </form>
      </div>
    </div>
  );
};
