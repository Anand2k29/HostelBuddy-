import React, { useState } from 'react';
import { User, Issue, IssueCategory, IssuePriority, IssueStatus } from '../types';
import { analyzeIssueWithAI } from '../services/geminiService';
import { Wand2, Loader2, Send } from 'lucide-react';

interface ReportIssueProps {
  user: User;
  onReport: (issue: Issue) => void;
}

export const ReportIssue: React.FC<ReportIssueProps> = ({ user, onReport }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>(IssueCategory.OTHER);
  const [priority, setPriority] = useState<IssuePriority>(IssuePriority.LOW);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');


  // In a real hackathon app, you'd likely env var this, 
  // but for the demo UI we allow entering it if missing
  
  const handleAIAnalyze = async () => {
    if (!description || description.length < 10) {
      alert("Please enter a detailed description first.");
      return;
    }
    
    setIsAnalyzing(true);
    const result = await analyzeIssueWithAI(description, import.meta.env.VITE_API_KEY);
    setIsAnalyzing(false);

    if (result) {
      setCategory(result.category);
      setPriority(result.priority);
      setAiSummary(result.summary);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIssue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      priority,
      status: IssueStatus.REPORTED,
      isPrivate,
      reporterId: user.id,
      reporterName: user.name,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      comments: []
    };
    onReport(newIssue);
    alert('Issue reported successfully!');
    setTitle('');
    setDescription('');
    setAiSummary('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Report an Issue</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., WiFi not working in Room 304"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <div className="relative">
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe the issue in detail..."
              />
              <button
                type="button"
                onClick={handleAIAnalyze}
                disabled={isAnalyzing}
                className="absolute bottom-3 right-3 flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full hover:shadow-lg transition-all"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                <span>AI Analyze</span>
              </button>
            </div>
            {aiSummary && (
                <div className="mt-2 p-3 bg-purple-50 text-purple-700 text-sm rounded-lg border border-purple-100 flex items-start space-x-2">
                    <Wand2 size={16} className="mt-0.5 shrink-0" />
                    <span><strong>AI Suggestion:</strong> {aiSummary}</span>
                </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as IssueCategory)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {Object.values(IssueCategory).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as IssuePriority)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {Object.values(IssuePriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <label htmlFor="private" className="block text-sm font-medium text-slate-900">Mark as Private</label>
              <p className="text-xs text-slate-500">Only Admins can see this issue.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Send size={18} />
            <span>Submit Report</span>
          </button>
        </form>
      </div>
    </div>
  );
};