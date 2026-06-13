import React, { useState } from 'react';
import { Announcement, User, UserRole } from '../types';
import { Bell, Pin, X } from 'lucide-react';

interface AnnouncementsProps {
  user: User;
  data: Announcement[];
  onAdd: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ user, data, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');

  const handleSubmit = () => {
    if (!newTitle || !newContent) {
      alert('Please fill out all fields.');
      return;
    }
    onAdd({
      title: newTitle,
      content: newContent,
      priority: newPriority,
    });
    // Reset form and close modal
    setNewTitle('');
    setNewContent('');
    setNewPriority('NORMAL');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          {user.role === UserRole.ADMIN && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
            >
              + Post New
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {data.map(item => (
            <div key={item.id} className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {item.priority === 'URGENT' && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">URGENT</div>
              )}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-xs mb-3 flex items-center">
                    <Pin size={12} className="mr-1" /> Posted on {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-slate-700 leading-relaxed">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Create New Announcement</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea
                rows={4}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as 'NORMAL' | 'URGENT')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
              >
                Post Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};